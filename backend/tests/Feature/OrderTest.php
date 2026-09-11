<?php

namespace Tests\Feature;

use App\Enums\CartStatus;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Counter;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    protected Category $category;
    protected Product $product;
    protected ProductVariant $variant1;
    protected ProductVariant $variant2;

    protected function setUp(): void
    {
        parent::setUp();
        Session::start();

        Notification::fake();

        $this->category = Category::factory()->create();
        $this->product = Product::factory()->create([
            'category_id' => $this->category->id,
            'status' => 'active',
        ]);
        $this->variant1 = ProductVariant::factory()->create([
            'product_id' => $this->product->id,
            'price' => 350.00,
            'stock' => 10,
            'status' => 'active',
        ]);
        $this->variant2 = ProductVariant::factory()->create([
            'product_id' => $this->product->id,
            'price' => 500.00,
            'stock' => 5,
            'status' => 'active',
        ]);

        Counter::create(['name' => 'order_number', 'value' => 1000]);
    }

    private function createCartWithToken(string $token): Cart
    {
        return Cart::create([
            'cart_token' => $token,
            'status' => CartStatus::Active,
        ]);
    }

    private function addItemToCart(Cart $cart, ProductVariant $variant, int $quantity = 1): CartItem
    {
        return CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $variant->product_id,
            'product_variant_id' => $variant->id,
            'quantity' => $quantity,
            'unit_price' => $variant->price,
        ]);
    }

    private function orderData(array $overrides = []): array
    {
        return array_merge([
            'customer_name' => 'Ram Thapa',
            'customer_phone' => '9841234567',
            'customer_email' => 'ram@example.com',
            'address_line' => 'Main Road 123',
            'city' => 'Biratnagar',
            'province' => 'Koshi',
            'delivery_notes' => null,
            'payment_method' => 'cod',
        ], $overrides);
    }

    private function orderCall(string $method, string $uri, array $cookies = [], ?array $data = null): \Illuminate\Testing\TestResponse
    {
        $content = $data !== null ? json_encode($data) : null;

        $server = [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_ACCEPT' => 'application/json',
        ];

        if ($content !== null) {
            $server['CONTENT_LENGTH'] = mb_strlen($content, '8bit');
        }

        return $this->call($method, $uri, [], $cookies, [], $server, $content);
    }

    private function orderPost(string $uri, array $data, array $cookies = []): \Illuminate\Testing\TestResponse
    {
        return $this->orderCall('POST', $uri, $cookies, $data);
    }

    private function orderPostMultipart(string $uri, array $data, array $cookies = []): \Illuminate\Testing\TestResponse
    {
        return $this->call('POST', $uri, [], $cookies, [], [
            'HTTP_ACCEPT' => 'application/json',
        ], null, $data);
    }

    private function cookie(string $token): array
    {
        return ['cart_token' => $token];
    }

    // ─── Guest Checkout — Basic ──────────────────────────

    public function test_guest_can_place_cod_order(): void
    {
        $token = 'test-token-cod';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 2);

        $this->orderPost('/api/orders', $this->orderData(), $this->cookie($token))
            ->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Order placed successfully.',
            ]);
    }

    public function test_order_is_created_in_database(): void
    {
        $token = 'test-token-db';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 1);

        $this->orderPost('/api/orders', $this->orderData(), $this->cookie($token));

        $this->assertDatabaseCount('orders', 1);
        $this->assertDatabaseHas('orders', [
            'customer_name' => 'Ram Thapa',
            'customer_email' => 'ram@example.com',
            'status' => 'confirmed',
        ]);
    }

    public function test_order_items_are_created(): void
    {
        $token = 'test-token-items';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 2);
        $this->addItemToCart($cart, $this->variant2, 1);

        $this->orderPost('/api/orders', $this->orderData(), $this->cookie($token));

        $this->assertDatabaseCount('order_items', 2);
    }

    public function test_payment_is_created(): void
    {
        $token = 'test-token-payment';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 1);

        $this->orderPost('/api/orders', $this->orderData(), $this->cookie($token));

        $this->assertDatabaseCount('payments', 1);
        $this->assertDatabaseHas('payments', [
            'payment_method' => 'cod',
            'status' => 'pending',
        ]);
    }

    // ─── Order Number ────────────────────────────────────

    public function test_order_number_is_generated(): void
    {
        $token = 'test-token-num';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 1);

        $response = $this->orderPost('/api/orders', $this->orderData(), $this->cookie($token));

        $response->assertJsonPath('order.order_number', 'BKA-1001');
    }

    public function test_order_numbers_are_sequential(): void
    {
        $token1 = 'test-token-seq1';
        $cart1 = $this->createCartWithToken($token1);
        $this->addItemToCart($cart1, $this->variant1, 1);

        $token2 = 'test-token-seq2';
        $cart2 = $this->createCartWithToken($token2);
        $this->addItemToCart($cart2, $this->variant2, 1);

        $this->orderPost('/api/orders', $this->orderData(['customer_email' => 'a@test.com']), $this->cookie($token1));
        $this->orderPost('/api/orders', $this->orderData(['customer_email' => 'b@test.com']), $this->cookie($token2));

        $this->assertDatabaseHas('orders', ['order_number' => 'BKA-1001']);
        $this->assertDatabaseHas('orders', ['order_number' => 'BKA-1002']);
    }

    // ─── Pricing ─────────────────────────────────────────

    public function test_backend_calculates_subtotal(): void
    {
        $token = 'test-token-sub';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 2);
        $this->addItemToCart($cart, $this->variant2, 1);

        $response = $this->orderPost('/api/orders', $this->orderData(), $this->cookie($token));

        $response->assertJsonPath('order.subtotal', fn ($val) => abs($val - 1200.00) < 0.01);
    }

    public function test_backend_calculates_delivery_fee(): void
    {
        $token = 'test-token-del';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 1);

        $response = $this->orderPost('/api/orders', $this->orderData(), $this->cookie($token));

        $response->assertJsonPath('order.delivery_fee', fn ($val) => abs($val - 100.00) < 0.01);
    }

    public function test_backend_calculates_total(): void
    {
        $token = 'test-token-total';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 2);

        $response = $this->orderPost('/api/orders', $this->orderData(), $this->cookie($token));

        $response->assertJsonPath('order.total', fn ($val) => abs($val - 800.00) < 0.01);
    }

    public function test_frontend_cannot_manipulate_total(): void
    {
        $token = 'test-token-nomani';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 1);

        $this->orderPost('/api/orders', $this->orderData(['total' => 1.00]), $this->cookie($token));

        $order = Order::first();
        $this->assertEquals(450.00, (float) $order->total);
    }

    public function test_payment_amount_matches_order_total(): void
    {
        $token = 'test-token-pamt';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 2);

        $this->orderPost('/api/orders', $this->orderData(), $this->cookie($token));

        $order = Order::first();
        $payment = Payment::first();
        $this->assertEquals($order->total, $payment->amount);
    }

    // ─── Stock ───────────────────────────────────────────

    public function test_stock_is_decremented(): void
    {
        $token = 'test-token-stock';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 2);

        $this->orderPost('/api/orders', $this->orderData(), $this->cookie($token));

        $this->variant1->refresh();
        $this->assertEquals(8, $this->variant1->stock);
    }

    public function test_insufficient_stock_rejected(): void
    {
        $token = 'test-token-nostock';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 100);

        $this->orderPost('/api/orders', $this->orderData(), $this->cookie($token))
            ->assertStatus(422)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_stock_not_decremented_on_failure(): void
    {
        $token = 'test-token-nodc';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 100);

        $this->orderPost('/api/orders', $this->orderData(), $this->cookie($token));

        $this->variant1->refresh();
        $this->assertEquals(10, $this->variant1->stock);
    }

    // ─── Cart ────────────────────────────────────────────

    public function test_cart_is_converted_after_order(): void
    {
        $token = 'test-token-conv';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 1);

        $this->orderPost('/api/orders', $this->orderData(), $this->cookie($token));

        $cart->refresh();
        $this->assertEquals(CartStatus::Converted, $cart->status);
    }

    public function test_converted_cart_cannot_checkout(): void
    {
        $token = 'test-token-used';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 1);

        $this->orderPost('/api/orders', $this->orderData(['customer_email' => 'first@test.com']), $this->cookie($token));

        $cart2 = $this->createCartWithToken($token . '-new');
        $this->addItemToCart($cart2, $this->variant2, 1);

        $this->orderPost('/api/orders', $this->orderData(['customer_email' => 'second@test.com']), $this->cookie($token))
            ->assertStatus(422);
    }

    public function test_empty_cart_rejected(): void
    {
        $token = 'test-token-empty';
        $this->createCartWithToken($token);

        $this->orderPost('/api/orders', $this->orderData(), $this->cookie($token))
            ->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Your cart is empty.',
            ]);
    }

    // ─── Validation ──────────────────────────────────────

    public function test_email_is_required(): void
    {
        $token = 'test-token-nomail';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 1);

        $this->orderPost('/api/orders', $this->orderData(['customer_email' => '']), $this->cookie($token))
            ->assertStatus(422);
    }

    public function test_invalid_email_rejected(): void
    {
        $token = 'test-token-badmail';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 1);

        $this->orderPost('/api/orders', $this->orderData(['customer_email' => 'not-an-email']), $this->cookie($token))
            ->assertStatus(422);
    }

    public function test_payment_method_is_required(): void
    {
        $token = 'test-token-nomethod';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 1);

        $this->orderPost('/api/orders', $this->orderData(['payment_method' => '']), $this->cookie($token))
            ->assertStatus(422);
    }

    public function test_invalid_payment_method_rejected(): void
    {
        $token = 'test-token-badpay';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 1);

        $this->orderPost('/api/orders', $this->orderData(['payment_method' => 'crypto']), $this->cookie($token))
            ->assertStatus(422);
    }

    // ─── Payment Methods ─────────────────────────────────

    public function test_cod_order_starts_confirmed(): void
    {
        $token = 'test-token-codstatus';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 1);

        $this->orderPost('/api/orders', $this->orderData(), $this->cookie($token));

        $order = Order::first();
        $this->assertEquals(OrderStatus::Confirmed, $order->status);
    }

    public function test_digital_order_starts_pending(): void
    {
        $token = 'test-token-digstatus';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 1);

        Storage::fake('private');
        $proof = UploadedFile::fake()->image('proof.png');

        $response = $this->call('POST', '/api/orders', [
            'customer_name' => 'Ram Thapa',
            'customer_phone' => '9841234567',
            'customer_email' => 'ram@example.com',
            'address_line' => 'Main Road 123',
            'city' => 'Biratnagar',
            'province' => 'Koshi',
            'payment_method' => 'digital',
            'payment_proof' => $proof,
        ], ['cart_token' => $token], [], [
            'HTTP_ACCEPT' => 'application/json',
        ]);

        $response->assertStatus(201);

        $order = Order::first();
        $this->assertNotNull($order);
        $this->assertEquals(OrderStatus::Pending, $order->status);
    }

    public function test_bank_order_starts_pending(): void
    {
        $token = 'test-token-bankstatus';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 1);

        Storage::fake('private');
        $proof = UploadedFile::fake()->image('proof.png');

        $response = $this->call('POST', '/api/orders', [
            'customer_name' => 'Ram Thapa',
            'customer_phone' => '9841234567',
            'customer_email' => 'ram@example.com',
            'address_line' => 'Main Road 123',
            'city' => 'Biratnagar',
            'province' => 'Koshi',
            'payment_method' => 'bank',
            'payment_proof' => $proof,
        ], ['cart_token' => $token], [], [
            'HTTP_ACCEPT' => 'application/json',
        ]);

        $response->assertStatus(201);

        $order = Order::first();
        $this->assertNotNull($order);
        $this->assertEquals(OrderStatus::Pending, $order->status);
    }

    public function test_digital_payment_proof_required(): void
    {
        $token = 'test-token-digproof';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 1);

        $this->orderPost('/api/orders', $this->orderData(['payment_method' => 'digital']), $this->cookie($token))
            ->assertStatus(422);
    }

    public function test_bank_payment_proof_required(): void
    {
        $token = 'test-token-bankproof';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 1);

        $this->orderPost('/api/orders', $this->orderData(['payment_method' => 'bank']), $this->cookie($token))
            ->assertStatus(422);
    }

    public function test_cod_payment_proof_not_required(): void
    {
        $token = 'test-token-codproof';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 1);

        $this->orderPost('/api/orders', $this->orderData(), $this->cookie($token))
            ->assertStatus(201);
    }

    // ─── Payment Proof Storage ───────────────────────────

    public function test_payment_proof_is_stored(): void
    {
        Storage::fake('private');

        $token = 'test-token-proof';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 1);

        $proof = UploadedFile::fake()->image('receipt.jpg');

        $response = $this->call('POST', '/api/orders', [
            'customer_name' => 'Ram Thapa',
            'customer_phone' => '9841234567',
            'customer_email' => 'ram@example.com',
            'address_line' => 'Main Road 123',
            'city' => 'Biratnagar',
            'province' => 'Koshi',
            'payment_method' => 'digital',
            'payment_proof' => $proof,
        ], ['cart_token' => $token], [], [
            'HTTP_ACCEPT' => 'application/json',
        ]);

        $response->assertStatus(201);

        $payment = Payment::first();
        $this->assertNotNull($payment->proof_image);
        Storage::disk('private')->assertExists($payment->proof_image);
    }

    // ─── User Creation ───────────────────────────────────

    public function test_new_user_is_created_for_new_email(): void
    {
        $token = 'test-token-newuser';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 1);

        $this->orderPost('/api/orders', $this->orderData(['customer_email' => 'newguest@test.com']), $this->cookie($token));

        $this->assertDatabaseHas('users', ['email' => 'newguest@test.com']);
    }

    public function test_existing_user_is_reused(): void
    {
        $existingUser = User::factory()->create(['email' => 'existing@test.com']);

        $token = 'test-token-reuse';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 1);

        $this->orderPost('/api/orders', $this->orderData(['customer_email' => 'existing@test.com']), $this->cookie($token));

        $this->assertDatabaseCount('users', 1);
        $this->assertDatabaseHas('users', ['id' => $existingUser->id]);
    }

    public function test_existing_user_password_not_changed(): void
    {
        $existingUser = User::factory()->create([
            'email' => 'existing@test.com',
            'password' => 'original-password',
        ]);
        $originalHash = $existingUser->password;

        $token = 'test-token-pwd';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 1);

        $this->orderPost('/api/orders', $this->orderData(['customer_email' => 'existing@test.com']), $this->cookie($token));

        $existingUser->refresh();
        $this->assertEquals($originalHash, $existingUser->password);
    }

    public function test_welcome_email_sent_for_new_account(): void
    {
        Notification::fake();

        $token = 'test-token-welcome';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 1);

        $this->orderPost('/api/orders', $this->orderData(['customer_email' => 'newguest@test.com']), $this->cookie($token));

        $user = User::where('email', 'newguest@test.com')->first();
        Notification::assertSentTo($user, \App\Notifications\NewCustomerWelcomeNotification::class);
    }

    public function test_welcome_email_not_sent_for_existing_user(): void
    {
        Notification::fake();

        User::factory()->create(['email' => 'existing@test.com']);

        $token = 'test-token-nowelcome';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 1);

        $this->orderPost('/api/orders', $this->orderData(['customer_email' => 'existing@test.com']), $this->cookie($token));

        Notification::assertNothingSent();
    }

    // ─── Order Status ────────────────────────────────────

    public function test_order_belongs_to_user(): void
    {
        $token = 'test-token-owner';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 1);

        $this->orderPost('/api/orders', $this->orderData(['customer_email' => 'own@test.com']), $this->cookie($token));

        $order = Order::first();
        $this->assertNotNull($order->user_id);
        $this->assertDatabaseHas('users', ['id' => $order->user_id, 'email' => 'own@test.com']);
    }

    // ─── Order Items Snapshot ────────────────────────────

    public function test_order_items_snapshot_product_name(): void
    {
        $token = 'test-token-snap';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 1);

        $this->orderPost('/api/orders', $this->orderData(), $this->cookie($token));

        $this->assertDatabaseHas('order_items', [
            'product_name' => $this->product->title,
            'variant_name' => $this->variant1->name,
        ]);
    }

    public function test_order_items_snapshot_unit_price(): void
    {
        $token = 'test-token-price';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 2);

        $this->orderPost('/api/orders', $this->orderData(), $this->cookie($token));

        $this->assertDatabaseHas('order_items', [
            'unit_price' => 350.00,
            'quantity' => 2,
            'subtotal' => 700.00,
        ]);
    }

    // ─── Response Structure ──────────────────────────────

    public function test_order_response_structure(): void
    {
        $token = 'test-token-struct';
        $cart = $this->createCartWithToken($token);
        $this->addItemToCart($cart, $this->variant1, 1);

        $this->orderPost('/api/orders', $this->orderData(), $this->cookie($token))
            ->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'order' => [
                    'id',
                    'order_number',
                    'status',
                    'customer_name',
                    'customer_phone',
                    'customer_email',
                    'subtotal',
                    'delivery_fee',
                    'total',
                    'items' => [
                        [
                            'id',
                            'product_id',
                            'product_variant_id',
                            'product_name',
                            'variant_name',
                            'quantity',
                            'unit_price',
                            'subtotal',
                        ],
                    ],
                    'payment' => [
                        'id',
                        'payment_method',
                        'status',
                        'amount',
                    ],
                ],
            ]);
    }
}
