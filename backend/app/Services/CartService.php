<?php

namespace App\Services;

use App\Enums\CartStatus;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CartService
{
    public function getOrCreateGuestCart(Request $request): Cart
    {
        $token = $request->cookie('cart_token');

        if ($token) {
            $cart = Cart::where('cart_token', $token)
                ->where('status', CartStatus::Active)
                ->first();

            if ($cart) {
                return $cart;
            }
        }

        $token = Str::random(64);

        $cart = Cart::create([
            'cart_token' => $token,
            'status' => CartStatus::Active,
        ]);

        cookie()->queue(
            cookie()->make('cart_token', $token, 60 * 24 * 30, null, null, null, true)
        );

        return $cart;
    }

    public function getCart(Cart $cart): Cart
    {
        $cart->load([
            'items.product' => fn ($q) => $q->select('id', 'title', 'slug'),
            'items.product.images' => fn ($q) => $q->select('id', 'product_id', 'image_url', 'is_thumbnail'),
            'items.productVariant' => fn ($q) => $q->select('id', 'name', 'weight', 'unit', 'price'),
        ]);

        return $cart;
    }

    public function addItem(Cart $cart, string $productId, string $variantId, int $quantity): Cart
    {
        return DB::transaction(function () use ($cart, $productId, $variantId, $quantity) {
            $product = Product::where('id', $productId)
                ->where('status', 'active')
                ->first();

            if (! $product) {
                throw new \App\Exceptions\CartItemException('Product not found.');
            }

            $variant = ProductVariant::where('id', $variantId)
                ->where('product_id', $productId)
                ->where('status', 'active')
                ->first();

            if (! $variant) {
                throw new \App\Exceptions\CartItemException('Product variant not found.');
            }

            if ($variant->stock < $quantity) {
                throw new \App\Exceptions\CartItemException('Insufficient stock.');
            }

            $existingItem = $cart->items()
                ->where('product_variant_id', $variantId)
                ->first();

            if ($existingItem) {
                $newQuantity = $existingItem->quantity + $quantity;

                if ($variant->stock < $newQuantity) {
                    throw new \App\Exceptions\CartItemException('Insufficient stock.');
                }

                $existingItem->update(['quantity' => $newQuantity]);
            } else {
                $cart->items()->create([
                    'product_id' => $productId,
                    'product_variant_id' => $variantId,
                    'quantity' => $quantity,
                    'unit_price' => $variant->price,
                ]);
            }

            return $this->getCart($cart->fresh());
        });
    }

    public function updateItem(Cart $cart, CartItem $item, int $quantity): Cart
    {
        return DB::transaction(function () use ($cart, $item, $quantity) {
            if ($item->cart_id !== $cart->id) {
                throw new \App\Exceptions\CartItemException('Cart item not found.');
            }

            $variant = ProductVariant::where('id', $item->product_variant_id)
                ->where('status', 'active')
                ->first();

            if (! $variant) {
                throw new \App\Exceptions\CartItemException('Product variant is no longer available.');
            }

            if ($variant->stock < $quantity) {
                throw new \App\Exceptions\CartItemException('Insufficient stock.');
            }

            $item->update(['quantity' => $quantity]);

            return $this->getCart($cart->fresh());
        });
    }

    public function removeItem(Cart $cart, CartItem $item): Cart
    {
        if ($item->cart_id !== $cart->id) {
            throw new \App\Exceptions\CartItemException('Cart item not found.');
        }

        $item->delete();

        return $this->getCart($cart->fresh());
    }

    public function clearCart(Cart $cart): void
    {
        $cart->items()->delete();
    }
}
