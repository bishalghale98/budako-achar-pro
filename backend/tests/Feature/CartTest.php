<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Session;
use Tests\TestCase;

class CartTest extends TestCase
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

        $this->category = Category::factory()->create();
        $this->product = Product::factory()->create([
            'category_id' => $this->category->id,
            'status' => 'active',
        ]);
        $this->variant1 = ProductVariant::factory()->create([
            'product_id' => $this->product->id,
            'price' => 180.00,
            'stock' => 10,
            'status' => 'active',
        ]);
        $this->variant2 = ProductVariant::factory()->create([
            'product_id' => $this->product->id,
            'price' => 320.00,
            'stock' => 5,
            'status' => 'active',
        ]);
    }

    private function createCartWithToken(string $token): Cart
    {
        return Cart::create([
            'cart_token' => $token,
            'status' => 'active',
        ]);
    }

    private function cartCall(string $method, string $uri, array $cookies = [], ?array $data = null): \Illuminate\Testing\TestResponse
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

    private function cartPost(string $uri, array $data, array $cookies = []): \Illuminate\Testing\TestResponse
    {
        return $this->cartCall('POST', $uri, $cookies, $data);
    }

    private function cartPatch(string $uri, array $data, array $cookies = []): \Illuminate\Testing\TestResponse
    {
        return $this->cartCall('PATCH', $uri, $cookies, $data);
    }

    private function cartDelete(string $uri, array $cookies = []): \Illuminate\Testing\TestResponse
    {
        return $this->cartCall('DELETE', $uri, $cookies);
    }

    private function cartGet(string $uri, array $cookies = []): \Illuminate\Testing\TestResponse
    {
        return $this->cartCall('GET', $uri, $cookies);
    }

    private function cookie(string $token): array
    {
        return ['cart_token' => $token];
    }

    // ─── Empty Cart ─────────────────────────────────────

    public function test_guest_can_get_empty_cart(): void
    {
        $this->cartGet('/api/cart')
            ->assertOk()
            ->assertJson([
                'success' => true,
                'cart' => [
                    'subtotal' => 0,
                    'item_count' => 0,
                    'total_quantity' => 0,
                ],
            ]);
    }

    public function test_empty_cart_has_no_items(): void
    {
        $this->cartGet('/api/cart')
            ->assertOk()
            ->assertJsonPath('cart.items', []);
    }

    // ─── Add Item ───────────────────────────────────────

    public function test_guest_can_add_item_to_cart(): void
    {
        $this->cartPost('/api/cart/items', [
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant1->id,
            'quantity' => 2,
        ])->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Item added to cart.',
            ]);

        $this->assertDatabaseHas('cart_items', [
            'product_variant_id' => $this->variant1->id,
            'quantity' => 2,
            'unit_price' => 180.00,
        ]);
    }

    public function test_cart_is_created_on_first_add(): void
    {
        $this->assertDatabaseCount('carts', 0);

        $this->cartPost('/api/cart/items', [
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant1->id,
            'quantity' => 1,
        ]);

        $this->assertDatabaseCount('carts', 1);
    }

    public function test_cart_token_is_set_on_first_add(): void
    {
        $this->cartPost('/api/cart/items', [
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant1->id,
            'quantity' => 1,
        ]);

        $cart = Cart::first();
        $this->assertNotEmpty($cart->cart_token);
    }

    public function test_duplicate_variant_increments_quantity(): void
    {
        $token = 'test-token-duplicate';
        $this->createCartWithToken($token);

        $this->cartPost('/api/cart/items', [
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant1->id,
            'quantity' => 2,
        ], $this->cookie($token));

        $this->cartPost('/api/cart/items', [
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant1->id,
            'quantity' => 3,
        ], $this->cookie($token));

        $this->assertDatabaseHas('cart_items', [
            'product_variant_id' => $this->variant1->id,
            'quantity' => 5,
        ]);

        $this->assertDatabaseCount('cart_items', 1);
    }

    public function test_different_variants_create_separate_items(): void
    {
        $token = 'test-token-different';
        $this->createCartWithToken($token);

        $this->cartPost('/api/cart/items', [
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant1->id,
            'quantity' => 1,
        ], $this->cookie($token));

        $this->cartPost('/api/cart/items', [
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant2->id,
            'quantity' => 1,
        ], $this->cookie($token));

        $this->assertDatabaseCount('cart_items', 2);
    }

    public function test_add_item_returns_cart_with_totals(): void
    {
        $this->cartPost('/api/cart/items', [
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant1->id,
            'quantity' => 2,
        ])->assertStatus(201)
            ->assertJsonPath('cart.subtotal', 360)
            ->assertJsonPath('cart.item_count', 1)
            ->assertJsonPath('cart.total_quantity', 2);
    }

    // ─── Validation ─────────────────────────────────────

    public function test_invalid_product_rejected(): void
    {
        $this->cartPost('/api/cart/items', [
            'product_id' => 'nonexistent',
            'product_variant_id' => $this->variant1->id,
            'quantity' => 1,
        ])->assertStatus(422);
    }

    public function test_invalid_variant_rejected(): void
    {
        $this->cartPost('/api/cart/items', [
            'product_id' => $this->product->id,
            'product_variant_id' => 'nonexistent',
            'quantity' => 1,
        ])->assertStatus(422);
    }

    public function test_variant_belonging_to_wrong_product_rejected(): void
    {
        $otherProduct = Product::factory()->create([
            'category_id' => $this->category->id,
            'status' => 'active',
        ]);
        $otherVariant = ProductVariant::factory()->create([
            'product_id' => $otherProduct->id,
            'status' => 'active',
        ]);

        $this->cartPost('/api/cart/items', [
            'product_id' => $this->product->id,
            'product_variant_id' => $otherVariant->id,
            'quantity' => 1,
        ])->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Product variant not found.',
            ]);
    }

    public function test_inactive_product_rejected(): void
    {
        $inactiveProduct = Product::factory()->create([
            'category_id' => $this->category->id,
            'status' => 'inactive',
        ]);
        $variant = ProductVariant::factory()->create([
            'product_id' => $inactiveProduct->id,
            'status' => 'active',
        ]);

        $this->cartPost('/api/cart/items', [
            'product_id' => $inactiveProduct->id,
            'product_variant_id' => $variant->id,
            'quantity' => 1,
        ])->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Product not found.',
            ]);
    }

    public function test_inactive_variant_rejected(): void
    {
        $inactiveVariant = ProductVariant::factory()->create([
            'product_id' => $this->product->id,
            'status' => 'inactive',
        ]);

        $this->cartPost('/api/cart/items', [
            'product_id' => $this->product->id,
            'product_variant_id' => $inactiveVariant->id,
            'quantity' => 1,
        ])->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Product variant not found.',
            ]);
    }

    public function test_zero_quantity_rejected(): void
    {
        $this->cartPost('/api/cart/items', [
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant1->id,
            'quantity' => 0,
        ])->assertStatus(422);
    }

    public function test_negative_quantity_rejected(): void
    {
        $this->cartPost('/api/cart/items', [
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant1->id,
            'quantity' => -1,
        ])->assertStatus(422);
    }

    public function test_insufficient_stock_rejected(): void
    {
        $this->cartPost('/api/cart/items', [
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant1->id,
            'quantity' => 100,
        ])->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Insufficient stock.',
            ]);
    }

    public function test_insufficient_stock_on_duplicate_variant_rejected(): void
    {
        $token = 'test-token-stock';
        $this->createCartWithToken($token);

        $this->cartPost('/api/cart/items', [
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant2->id,
            'quantity' => 3,
        ], $this->cookie($token));

        $this->cartPost('/api/cart/items', [
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant2->id,
            'quantity' => 3,
        ], $this->cookie($token))->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Insufficient stock.',
            ]);
    }

    // ─── Update ─────────────────────────────────────────

    public function test_guest_can_update_item_quantity(): void
    {
        $token = 'test-token-update';
        $cart = $this->createCartWithToken($token);

        $this->cartPost('/api/cart/items', [
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant1->id,
            'quantity' => 1,
        ], $this->cookie($token));

        $item = $cart->items()->first();

        $this->cartPatch("/api/cart/items/{$item->id}", [
            'quantity' => 3,
        ], $this->cookie($token))->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Cart item updated.',
            ]);

        $this->assertDatabaseHas('cart_items', [
            'id' => $item->id,
            'quantity' => 3,
        ]);
    }

    public function test_update_with_insufficient_stock_rejected(): void
    {
        $token = 'test-token-update-stock';
        $cart = $this->createCartWithToken($token);

        $this->cartPost('/api/cart/items', [
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant1->id,
            'quantity' => 1,
        ], $this->cookie($token));

        $item = $cart->items()->first();

        $this->cartPatch("/api/cart/items/{$item->id}", [
            'quantity' => 100,
        ], $this->cookie($token))->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'Insufficient stock.',
            ]);
    }

    public function test_foreign_cart_item_cannot_be_updated(): void
    {
        $otherCart = Cart::factory()->create();
        $otherItem = CartItem::factory()->create([
            'cart_id' => $otherCart->id,
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant1->id,
            'quantity' => 1,
            'unit_price' => 180.00,
        ]);

        $token = 'test-token-my-cart';
        $this->createCartWithToken($token);

        $this->cartPatch("/api/cart/items/{$otherItem->id}", [
            'quantity' => 99,
        ], $this->cookie($token))->assertStatus(404);
    }

    // ─── Remove ─────────────────────────────────────────

    public function test_guest_can_remove_item(): void
    {
        $token = 'test-token-remove';
        $cart = $this->createCartWithToken($token);

        $this->cartPost('/api/cart/items', [
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant1->id,
            'quantity' => 1,
        ], $this->cookie($token));

        $item = $cart->items()->first();

        $this->cartDelete("/api/cart/items/{$item->id}", $this->cookie($token))
            ->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Item removed from cart.',
            ]);

        $this->assertDatabaseMissing('cart_items', ['id' => $item->id]);
    }

    public function test_remove_foreign_cart_item_returns_404(): void
    {
        $otherCart = Cart::factory()->create();
        $otherItem = CartItem::factory()->create([
            'cart_id' => $otherCart->id,
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant1->id,
            'quantity' => 1,
            'unit_price' => 180.00,
        ]);

        $token = 'test-token-remove-foreign';
        $this->createCartWithToken($token);

        $this->cartDelete("/api/cart/items/{$otherItem->id}", $this->cookie($token))
            ->assertStatus(404);
    }

    // ─── Clear Cart ─────────────────────────────────────

    public function test_guest_can_clear_cart(): void
    {
        $token = 'test-token-clear';
        $cart = $this->createCartWithToken($token);

        $this->cartPost('/api/cart/items', [
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant1->id,
            'quantity' => 1,
        ], $this->cookie($token));

        $this->cartPost('/api/cart/items', [
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant2->id,
            'quantity' => 1,
        ], $this->cookie($token));

        $this->cartDelete('/api/cart', $this->cookie($token))
            ->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Cart cleared successfully.',
            ]);

        $this->assertDatabaseCount('cart_items', 0);
    }

    public function test_other_carts_unaffected_by_clear(): void
    {
        $token = 'test-token-clear-other';
        $cart = $this->createCartWithToken($token);

        $this->cartPost('/api/cart/items', [
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant1->id,
            'quantity' => 1,
        ], $this->cookie($token));

        $otherCart = Cart::factory()->create();
        CartItem::factory()->create([
            'cart_id' => $otherCart->id,
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant2->id,
            'quantity' => 2,
            'unit_price' => 320.00,
        ]);

        $this->cartDelete('/api/cart', $this->cookie($token));

        $this->assertDatabaseCount('cart_items', 1);
        $this->assertDatabaseHas('cart_items', ['cart_id' => $otherCart->id]);
    }

    // ─── Totals ─────────────────────────────────────────

    public function test_cart_totals_are_correct(): void
    {
        $token = 'test-token-totals';
        $cart = $this->createCartWithToken($token);

        $this->cartPost('/api/cart/items', [
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant1->id,
            'quantity' => 2,
        ], $this->cookie($token));

        $this->cartPost('/api/cart/items', [
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant2->id,
            'quantity' => 1,
        ], $this->cookie($token));

        $this->cartGet('/api/cart', $this->cookie($token))
            ->assertOk()
            ->assertJsonPath('cart.subtotal', 680)
            ->assertJsonPath('cart.item_count', 2)
            ->assertJsonPath('cart.total_quantity', 3);
    }

    // ─── Price Safety ───────────────────────────────────

    public function test_frontend_price_is_ignored(): void
    {
        $this->cartPost('/api/cart/items', [
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant1->id,
            'quantity' => 1,
            'unit_price' => 1.00,
        ]);

        $this->assertDatabaseHas('cart_items', [
            'product_variant_id' => $this->variant1->id,
            'unit_price' => 180.00,
        ]);
    }

    // ─── Cart Retrieval ─────────────────────────────────

    public function test_populated_cart_returns_items(): void
    {
        $token = 'test-token-populated';
        $cart = $this->createCartWithToken($token);

        $this->cartPost('/api/cart/items', [
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant1->id,
            'quantity' => 1,
        ], $this->cookie($token));

        $this->cartGet('/api/cart', $this->cookie($token))
            ->assertOk()
            ->assertJsonStructure([
                'success',
                'cart' => [
                    'id',
                    'items' => [
                        [
                            'id',
                            'product' => ['id', 'title', 'slug'],
                            'variant' => ['id', 'name', 'weight', 'unit', 'price'],
                            'quantity',
                            'unit_price',
                            'subtotal',
                        ],
                    ],
                    'subtotal',
                    'item_count',
                    'total_quantity',
                ],
            ]);
    }

    // ─── Security ───────────────────────────────────────

    public function test_guest_cannot_access_other_guest_cart(): void
    {
        $otherCart = Cart::factory()->create();
        $otherItem = CartItem::factory()->create([
            'cart_id' => $otherCart->id,
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant2->id,
            'quantity' => 1,
            'unit_price' => 320.00,
        ]);

        $token = 'test-token-security';
        $this->createCartWithToken($token);

        $this->cartPost('/api/cart/items', [
            'product_id' => $this->product->id,
            'product_variant_id' => $this->variant1->id,
            'quantity' => 1,
        ], $this->cookie($token));

        $this->cartPatch("/api/cart/items/{$otherItem->id}", [
            'quantity' => 99,
        ], $this->cookie($token))->assertStatus(404);
    }
}
