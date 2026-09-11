<?php

namespace Tests\Feature;

use App\Enums\Role;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\User;
use App\Services\ProductRatingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Session;
use Tests\TestCase;

class ProductReviewTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $customer;
    protected Product $product;

    protected function setUp(): void
    {
        parent::setUp();
        Session::start();

        $this->admin = User::factory()->create(['role' => Role::Admin]);
        $this->customer = User::factory()->create(['role' => Role::Customer]);
        $category = Category::factory()->create();
        $this->product = Product::factory()->create(['category_id' => $category->id]);
    }

    private function asUser(User $user): self
    {
        $this->actingAs($user, 'sanctum');
        return $this;
    }

    // ─── Review Creation ────────────────────────────────

    public function test_authenticated_user_can_create_review(): void
    {
        $response = $this->asUser($this->customer)->postJson("/api/products/{$this->product->id}/reviews", [
            'rating' => 5,
            'title' => 'Great!',
            'comment' => 'Tastes amazing.',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['success', 'review' => ['id', 'rating', 'status']]);

        $this->assertDatabaseHas('product_reviews', [
            'product_id' => $this->product->id,
            'user_id' => $this->customer->id,
            'status' => 'pending',
        ]);
    }

    public function test_unauthenticated_user_cannot_create_review(): void
    {
        $response = $this->postJson("/api/products/{$this->product->id}/reviews", [
            'rating' => 5,
        ]);

        $response->assertStatus(401);
    }

    public function test_user_cannot_review_same_product_twice(): void
    {
        ProductReview::factory()->create([
            'product_id' => $this->product->id,
            'user_id' => $this->customer->id,
        ]);

        $response = $this->asUser($this->customer)->postJson("/api/products/{$this->product->id}/reviews", [
            'rating' => 4,
        ]);

        $response->assertStatus(422);
    }

    public function test_rating_must_be_between_1_and_5(): void
    {
        $response = $this->asUser($this->customer)->postJson("/api/products/{$this->product->id}/reviews", [
            'rating' => 6,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['rating']);
    }

    public function test_rating_cannot_be_zero(): void
    {
        $response = $this->asUser($this->customer)->postJson("/api/products/{$this->product->id}/reviews", [
            'rating' => 0,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['rating']);
    }

    // ─── Review Ownership ───────────────────────────────

    public function test_user_can_update_own_review(): void
    {
        $review = ProductReview::factory()->create([
            'product_id' => $this->product->id,
            'user_id' => $this->customer->id,
            'rating' => 3,
        ]);

        $response = $this->asUser($this->customer)->patchJson(
            "/api/products/{$this->product->id}/reviews/{$review->id}",
            ['rating' => 5]
        );

        $response->assertOk();
        $this->assertDatabaseHas('product_reviews', ['id' => $review->id, 'rating' => 5]);
    }

    public function test_user_cannot_update_other_users_review(): void
    {
        $otherCustomer = User::factory()->create(['role' => Role::Customer]);
        $review = ProductReview::factory()->create([
            'product_id' => $this->product->id,
            'user_id' => $otherCustomer->id,
        ]);

        $response = $this->asUser($this->customer)->patchJson(
            "/api/products/{$this->product->id}/reviews/{$review->id}",
            ['rating' => 1]
        );

        $response->assertStatus(403);
    }

    public function test_user_can_delete_own_review(): void
    {
        $review = ProductReview::factory()->create([
            'product_id' => $this->product->id,
            'user_id' => $this->customer->id,
        ]);

        $response = $this->asUser($this->customer)->deleteJson(
            "/api/products/{$this->product->id}/reviews/{$review->id}"
        );

        $response->assertOk();
        $this->assertDatabaseMissing('product_reviews', ['id' => $review->id]);
    }

    public function test_user_cannot_delete_other_users_review(): void
    {
        $otherCustomer = User::factory()->create(['role' => Role::Customer]);
        $review = ProductReview::factory()->create([
            'product_id' => $this->product->id,
            'user_id' => $otherCustomer->id,
        ]);

        $response = $this->asUser($this->customer)->deleteJson(
            "/api/products/{$this->product->id}/reviews/{$review->id}"
        );

        $response->assertStatus(403);
    }

    // ─── Admin Moderation ───────────────────────────────

    public function test_admin_can_approve_review(): void
    {
        $review = ProductReview::factory()->create([
            'product_id' => $this->product->id,
            'status' => 'pending',
        ]);

        $response = $this->asUser($this->admin)->postJson(
            "/api/admin/products/{$this->product->id}/reviews/{$review->id}/approve"
        );

        $response->assertOk();
        $this->assertDatabaseHas('product_reviews', ['id' => $review->id, 'status' => 'approved']);
    }

    public function test_admin_can_reject_review(): void
    {
        $review = ProductReview::factory()->create([
            'product_id' => $this->product->id,
            'status' => 'pending',
        ]);

        $response = $this->asUser($this->admin)->postJson(
            "/api/admin/products/{$this->product->id}/reviews/{$review->id}/reject"
        );

        $response->assertOk();
        $this->assertDatabaseHas('product_reviews', ['id' => $review->id, 'status' => 'rejected']);
    }

    public function test_customer_cannot_moderate_reviews(): void
    {
        $review = ProductReview::factory()->create([
            'product_id' => $this->product->id,
            'status' => 'pending',
        ]);

        $response = $this->asUser($this->customer)->postJson(
            "/api/admin/products/{$this->product->id}/reviews/{$review->id}/approve"
        );

        $response->assertStatus(403);
    }

    public function test_pending_review_not_visible_publicly(): void
    {
        ProductReview::factory()->create([
            'product_id' => $this->product->id,
            'status' => 'pending',
        ]);

        $response = $this->getJson("/api/products/{$this->product->slug}/reviews");

        $response->assertOk();
        $this->assertEmpty($response->json('reviews.data', []));
    }

    public function test_approved_review_visible_publicly(): void
    {
        ProductReview::factory()->approved()->create([
            'product_id' => $this->product->id,
        ]);

        $response = $this->getJson("/api/products/{$this->product->slug}/reviews");

        $response->assertOk();
        $this->assertNotEmpty($response->json('reviews.data', []));
    }
}
