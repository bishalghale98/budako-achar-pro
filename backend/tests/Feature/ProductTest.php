<?php

namespace Tests\Feature;

use App\Enums\Role;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Session;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $customer;
    protected Category $category;

    protected function setUp(): void
    {
        parent::setUp();
        Session::start();

        $this->admin = User::factory()->create(['role' => Role::Admin]);
        $this->customer = User::factory()->create(['role' => Role::Customer]);
        $this->category = Category::factory()->create();
    }

    private function asUser(User $user): self
    {
        $this->actingAs($user, 'sanctum');
        return $this;
    }

    // ─── Admin Product CRUD ──────────────────────────────

    public function test_admin_can_create_product(): void
    {
        $response = $this->asUser($this->admin)->postJson('/api/admin/products', [
            'category_id' => $this->category->id,
            'title' => 'Mango Achar',
            'slug' => 'mango-achar',
            'short_description' => 'Sweet mango pickle.',
            'description' => 'A delicious mango achar.',
            'featured' => true,
            'status' => 'active',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'product' => ['id', 'title', 'slug', 'status'],
            ]);

        $this->assertDatabaseHas('products', ['slug' => 'mango-achar']);
    }

    public function test_admin_can_list_products(): void
    {
        Product::factory()->count(3)->create(['category_id' => $this->category->id]);

        $response = $this->asUser($this->admin)->getJson('/api/admin/products');

        $response->assertOk();
        $this->assertArrayHasKey('data', $response->json());
    }

    public function test_admin_can_show_product(): void
    {
        $product = Product::factory()->create(['category_id' => $this->category->id]);

        $response = $this->asUser($this->admin)->getJson("/api/admin/products/{$product->id}");

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'product' => ['id', 'title', 'slug', 'category', 'images', 'variants'],
            ]);
    }

    public function test_admin_can_update_product(): void
    {
        $product = Product::factory()->create(['category_id' => $this->category->id]);

        $response = $this->asUser($this->admin)->putJson("/api/admin/products/{$product->id}", [
            'title' => 'Updated Achar',
        ]);

        $response->assertOk()
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('products', ['id' => $product->id, 'title' => 'Updated Achar']);
    }

    public function test_admin_can_delete_product(): void
    {
        $product = Product::factory()->create(['category_id' => $this->category->id]);

        $response = $this->asUser($this->admin)->deleteJson("/api/admin/products/{$product->id}");

        $response->assertOk();
        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }

    public function test_customer_cannot_create_product(): void
    {
        $response = $this->asUser($this->customer)->postJson('/api/admin/products', [
            'category_id' => $this->category->id,
            'title' => 'Hack Achar',
            'slug' => 'hack-achar',
        ]);

        $response->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_access_admin_products(): void
    {
        $response = $this->getJson('/api/admin/products');

        $response->assertStatus(401);
    }

    public function test_product_slug_must_be_unique(): void
    {
        Product::factory()->create(['slug' => 'existing-slug']);

        $response = $this->asUser($this->admin)->postJson('/api/admin/products', [
            'category_id' => $this->category->id,
            'title' => 'Test',
            'slug' => 'existing-slug',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['slug']);
    }

    public function test_product_requires_category(): void
    {
        $response = $this->asUser($this->admin)->postJson('/api/admin/products', [
            'title' => 'No Category',
            'slug' => 'no-category',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['category_id']);
    }

    // ─── Public Product Endpoints ────────────────────────

    public function test_public_can_list_active_products(): void
    {
        Product::factory()->create(['category_id' => $this->category->id, 'status' => 'active']);
        Product::factory()->inactive()->create(['category_id' => $this->category->id]);

        $response = $this->getJson('/api/products');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
    }

    public function test_public_can_show_product_by_slug(): void
    {
        $product = Product::factory()->create([
            'category_id' => $this->category->id,
            'slug' => 'test-product',
            'status' => 'active',
        ]);

        $response = $this->getJson('/api/products/test-product');

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'product' => ['id', 'title', 'slug'],
            ]);
    }

    public function test_inactive_product_not_visible_publicly(): void
    {
        Product::factory()->inactive()->create([
            'category_id' => $this->category->id,
            'slug' => 'inactive-product',
        ]);

        $response = $this->getJson('/api/products/inactive-product');

        $response->assertStatus(404);
    }

    // ─── Variants ───────────────────────────────────────

    public function test_admin_can_create_variant(): void
    {
        $product = Product::factory()->create(['category_id' => $this->category->id]);

        $response = $this->asUser($this->admin)->postJson("/api/admin/products/{$product->id}/variants", [
            'name' => '500g',
            'weight' => 500,
            'unit' => 'g',
            'price' => 350,
            'stock' => 50,
            'sku' => 'TEST-500G',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['success', 'variant' => ['id', 'name', 'price']]);

        $this->assertDatabaseHas('product_variants', ['sku' => 'TEST-500G']);
    }

    public function test_admin_can_update_variant(): void
    {
        $product = Product::factory()->create(['category_id' => $this->category->id]);
        $variant = ProductVariant::factory()->create(['product_id' => $product->id]);

        $response = $this->asUser($this->admin)->putJson(
            "/api/admin/products/{$product->id}/variants/{$variant->id}",
            ['price' => 500]
        );

        $response->assertOk();
        $this->assertDatabaseHas('product_variants', ['id' => $variant->id, 'price' => 500]);
    }

    public function test_admin_can_delete_variant(): void
    {
        $product = Product::factory()->create(['category_id' => $this->category->id]);
        $variant = ProductVariant::factory()->create(['product_id' => $product->id]);

        $response = $this->asUser($this->admin)->deleteJson(
            "/api/admin/products/{$product->id}/variants/{$variant->id}"
        );

        $response->assertOk();
        $this->assertDatabaseMissing('product_variants', ['id' => $variant->id]);
    }

    public function test_cannot_modify_variant_from_different_product(): void
    {
        $product1 = Product::factory()->create(['category_id' => $this->category->id]);
        $product2 = Product::factory()->create(['category_id' => $this->category->id]);
        $variant = ProductVariant::factory()->create(['product_id' => $product2->id]);

        $response = $this->asUser($this->admin)->putJson(
            "/api/admin/products/{$product1->id}/variants/{$variant->id}",
            ['price' => 999]
        );

        $response->assertStatus(404);
    }

    public function test_variant_sku_must_be_unique(): void
    {
        ProductVariant::factory()->create(['sku' => 'UNIQUE-SKU']);

        $product = Product::factory()->create(['category_id' => $this->category->id]);

        $response = $this->asUser($this->admin)->postJson("/api/admin/products/{$product->id}/variants", [
            'name' => '1kg',
            'weight' => 1,
            'unit' => 'kg',
            'price' => 600,
            'sku' => 'UNIQUE-SKU',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['sku']);
    }

    // ─── Images ─────────────────────────────────────────

    public function test_admin_can_add_image(): void
    {
        $product = Product::factory()->create(['category_id' => $this->category->id]);

        $response = $this->asUser($this->admin)->postJson("/api/admin/products/{$product->id}/images", [
            'image_url' => 'https://example.com/image.jpg',
            'is_thumbnail' => true,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('product_images', [
            'product_id' => $product->id,
            'is_thumbnail' => true,
        ]);
    }

    public function test_set_thumbnail_unsets_previous(): void
    {
        $product = Product::factory()->create(['category_id' => $this->category->id]);

        $image1 = ProductImage::factory()->thumbnail()->create(['product_id' => $product->id]);
        $image2 = ProductImage::factory()->create(['product_id' => $product->id]);

        $response = $this->asUser($this->admin)->postJson(
            "/api/admin/products/{$product->id}/images/{$image2->id}/thumbnail"
        );

        $response->assertOk();

        $this->assertDatabaseHas('product_images', ['id' => $image1->id, 'is_thumbnail' => false]);
        $this->assertDatabaseHas('product_images', ['id' => $image2->id, 'is_thumbnail' => true]);
    }

    public function test_cannot_modify_image_from_different_product(): void
    {
        $product1 = Product::factory()->create(['category_id' => $this->category->id]);
        $product2 = Product::factory()->create(['category_id' => $this->category->id]);
        $image = ProductImage::factory()->create(['product_id' => $product2->id]);

        $response = $this->asUser($this->admin)->deleteJson(
            "/api/admin/products/{$product1->id}/images/{$image->id}"
        );

        $response->assertStatus(404);
    }

    public function test_delete_thumbnail_promotes_next(): void
    {
        $product = Product::factory()->create(['category_id' => $this->category->id]);

        $thumbnail = ProductImage::factory()->thumbnail()->create(['product_id' => $product->id, 'sort_order' => 0]);
        $second = ProductImage::factory()->create(['product_id' => $product->id, 'sort_order' => 1]);

        $response = $this->asUser($this->admin)->deleteJson(
            "/api/admin/products/{$product->id}/images/{$thumbnail->id}"
        );

        $response->assertOk();
        $this->assertDatabaseHas('product_images', ['id' => $second->id, 'is_thumbnail' => true]);
    }
}
