<?php

namespace App\Services;

use App\Enums\CartStatus;
use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Enums\ProductStatus;
use App\Enums\VariantStatus;
use App\Exceptions\OrderException;
use App\Models\Cart;
use App\Models\Counter;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\ProductVariant;
use App\Models\User;
use App\Models\Address;
use App\Notifications\NewCustomerWelcomeNotification;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class OrderService
{
    private const TRANSITIONS = [
        'pending' => [OrderStatus::Confirmed, OrderStatus::Cancelled],
        'confirmed' => [OrderStatus::Processing, OrderStatus::Cancelled],
        'processing' => [OrderStatus::Shipped, OrderStatus::Cancelled],
        'shipped' => [OrderStatus::Delivered],
        'delivered' => [],
        'cancelled' => [],
    ];

    public function placeOrder(Cart $cart, array $data, ?UploadedFile $proofFile = null): Order
    {
        $plainPassword = null;
        $newlyCreated = false;
        $proofPath = null;

        try {
            $order = DB::transaction(function () use ($cart, $data, $proofFile, &$plainPassword, &$newlyCreated, &$proofPath) {
                // 1. Validate cart
                $this->validateCart($cart);

                // 2. Load and validate cart items
                $cartItems = $cart->items()->with('productVariant.product')->get();
                $this->validateCartItems($cartItems);

                // 3. Lock and reload product variants, validate stock
                $variantIds = $cartItems->pluck('product_variant_id')->toArray();
                $variants = ProductVariant::whereIn('id', $variantIds)
                    ->lockForUpdate()
                    ->get()
                    ->keyBy('id');

                $this->validateStock($cartItems, $variants);

                // 4. Calculate prices from DB
                $subtotal = $cartItems->sum(function ($item) use ($variants) {
                    $variant = $variants->get($item->product_variant_id);
                    return (float) $variant->price * $item->quantity;
                });

                $deliveryFee = (float) config('order.delivery_fee', 100);
                $total = $subtotal + $deliveryFee;

                // 5. Find or create user
                $user = User::where('email', $data['customer_email'])->first();

                if (! $user) {
                    $plainPassword = Str::random(8);
                    $user = User::create([
                        'name' => $data['customer_name'],
                        'email' => $data['customer_email'],
                        'password' => $plainPassword,
                    ]);
                    $newlyCreated = true;
                }

                // 6. Resolve address from saved address or manual input
                $addressLine = $data['address_line'] ?? null;
                $area = $data['area'] ?? null;
                $city = $data['city'] ?? null;
                $province = $data['province'] ?? null;
                $deliveryNotes = $data['delivery_notes'] ?? null;
                $customerPhone = $data['customer_phone'];

                if (! empty($data['address_id'])) {
                    $address = Address::where('id', $data['address_id'])
                        ->where('user_id', $user->id)
                        ->firstOrFail();

                    $addressLine = $address->address_line;
                    $area = $address->area;
                    $city = $address->city;
                    $province = $address->province;
                    $deliveryNotes = $address->delivery_notes;
                    $customerPhone = $address->phone;
                }

                // 7. Generate order number
                $counter = Counter::where('name', 'order_number')->lockForUpdate()->first();
                $orderNumber = $counter->next('BKA-', 4);

                // 8. Create order
                $order = Order::create([
                    'order_number' => $orderNumber,
                    'user_id' => $user->id,
                    'cart_id' => $cart->id,
                    'customer_name' => $data['customer_name'],
                    'customer_phone' => $customerPhone,
                    'customer_email' => $data['customer_email'],
                    'address_line' => $addressLine,
                    'area' => $area,
                    'city' => $city,
                    'province' => $province,
                    'delivery_notes' => $deliveryNotes,
                    'status' => $this->resolveOrderStatus($data['payment_method']),
                    'subtotal' => $subtotal,
                    'delivery_fee' => $deliveryFee,
                    'total' => $total,
                ]);

                // 9. Create order items (snapshot)
                foreach ($cartItems as $item) {
                    $variant = $variants->get($item->product_variant_id);
                    $itemSubtotal = (float) $variant->price * $item->quantity;

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item->product_id,
                        'product_variant_id' => $item->product_variant_id,
                        'product_name' => $variant->product->title,
                        'variant_name' => $variant->name,
                        'quantity' => $item->quantity,
                        'unit_price' => $variant->price,
                        'subtotal' => $itemSubtotal,
                    ]);
                }

                // 9. Store payment proof
                if ($proofFile) {
                    $proofPath = $proofFile->store('payment-proofs', 'private');
                }

                // 10. Create payment
                $paymentMethod = PaymentMethod::from($data['payment_method']);

                Payment::create([
                    'order_id' => $order->id,
                    'payment_method' => $paymentMethod,
                    'status' => PaymentStatus::Pending,
                    'amount' => $total,
                    'proof_image' => $proofPath,
                ]);

                // 11. Decrement stock
                foreach ($cartItems as $item) {
                    $variant = $variants->get($item->product_variant_id);
                    $variant->decrement('stock', $item->quantity);
                }

                // 12. Convert cart
                $cart->update(['status' => CartStatus::Converted]);

                return $order->load(['items', 'payment']);
            });
        } catch (\Exception $e) {
            // Clean up uploaded proof file on failure
            if ($proofPath) {
                Storage::disk('private')->delete($proofPath);
            }

            if ($e instanceof OrderException) {
                throw $e;
            }

            logger()->error('Order placement failed', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            throw new OrderException('Failed to place order. Please try again.');
        }

        // 13. Send welcome email after successful commit
        if ($newlyCreated && $plainPassword) {
            $order->user->notify(new NewCustomerWelcomeNotification($plainPassword));
        }

        return $order;
    }

    public function updateStatus(Order $order, string $status): Order
    {
        $newStatus = OrderStatus::from($status);
        $allowed = self::TRANSITIONS[$order->status->value] ?? [];

        if (! in_array($newStatus, $allowed, true)) {
            throw new OrderException(
                "Cannot transition from \"{$order->status->value}\" to \"{$newStatus->value}\"."
            );
        }

        $order->update(['status' => $newStatus]);

        return $order;
    }

    public function cancelOrder(Order $order, User $user, string $reason): Order
    {
        return DB::transaction(function () use ($order, $user, $reason) {
            $order = Order::where('id', $order->id)
                ->where('status', '!=', OrderStatus::Cancelled)
                ->lockForUpdate()
                ->firstOrFail();

            $allowed = self::TRANSITIONS[$order->status->value] ?? [];
            if (! in_array(OrderStatus::Cancelled, $allowed, true)) {
                throw new OrderException(
                    "Order in \"{$order->status->value}\" status cannot be cancelled."
                );
            }

            // Restore stock (exact inverse of placeOrder decrement)
            $order->items()->with('productVariant')->each(function ($item) {
                $item->productVariant->increment('stock', $item->quantity);
            });

            $order->update([
                'status' => OrderStatus::Cancelled,
                'cancelled_at' => now(),
                'cancelled_by' => $user->id,
                'cancellation_reason' => $reason,
            ]);

            return $order;
        });
    }

    public function verifyPayment(Payment $payment, User $admin): Payment
    {
        if ($payment->status !== PaymentStatus::Pending) {
            throw new OrderException('Payment is not pending verification.');
        }

        $payment->update([
            'status' => PaymentStatus::Paid,
            'verified_by' => $admin->id,
            'verified_at' => now(),
        ]);

        // Auto-confirm order if still pending
        if ($payment->order->status === OrderStatus::Pending) {
            $this->updateStatus($payment->order, OrderStatus::Confirmed->value);
        }

        return $payment;
    }

    public function rejectPayment(Payment $payment, User $admin, string $reason): Payment
    {
        if ($payment->status !== PaymentStatus::Pending) {
            throw new OrderException('Payment is not pending verification.');
        }

        $payment->update([
            'status' => PaymentStatus::Rejected,
            'verified_by' => $admin->id,
            'verified_at' => now(),
            'rejection_reason' => $reason,
        ]);

        return $payment;
    }

    private function validateCart(Cart $cart): void
    {
        if ($cart->status !== CartStatus::Active) {
            throw new OrderException('This cart has already been used.');
        }

        if ($cart->items()->count() === 0) {
            throw new OrderException('Your cart is empty.');
        }
    }

    private function validateCartItems($cartItems): void
    {
        foreach ($cartItems as $item) {
            if (! $item->productVariant || ! $item->productVariant->product) {
                throw new OrderException('A product in your cart is no longer available.');
            }

            if ($item->productVariant->product->status !== ProductStatus::Active) {
                throw new OrderException("The product \"{$item->productVariant->product->title}\" is no longer available.");
            }

            if ($item->productVariant->status !== VariantStatus::Active) {
                throw new OrderException("The variant \"{$item->productVariant->name}\" is no longer available.");
            }
        }
    }

    private function validateStock($cartItems, $variants): void
    {
        foreach ($cartItems as $item) {
            $variant = $variants->get($item->product_variant_id);

            if ($variant->stock < $item->quantity) {
                throw new OrderException(
                    "Insufficient stock for \"{$variant->product->title} - {$variant->name}\"."
                );
            }
        }
    }

    private function resolveOrderStatus(string $paymentMethod): OrderStatus
    {
        $method = PaymentMethod::from($paymentMethod);

        return $method === PaymentMethod::Cod
            ? OrderStatus::Confirmed
            : OrderStatus::Pending;
    }
}
