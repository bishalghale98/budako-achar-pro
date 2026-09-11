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

class ProductRatingTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected Product $product;
    protected ProductRatingService $ratingService;

    protected function setUp(): void
    {
        parent::setUp();
        Session::start();

        $this->admin = User::factory()->create(['role' => Role::Admin]);
        $category = Category::factory()->create();
        $this->product = Product::factory()->create(['category_id' => $category->id]);
        $this->ratingService = app(ProductRatingService::class);
    }

    private function asUser(User $user): self
    {
        $this->actingAs($user, 'sanctum');
        return $this;
    }

    // ─── Rating Calculation ─────────────────────────────

    public function test_single_approved_review_sets_rating(): void
    {
        $user = User::factory()->create();
        ProductReview::factory()->approved()->create([
            'product_id' => $this->product->id,
            'user_id' => $user->id,
            'rating' => 5,
        ]);

        $this->ratingService->recalculate($this->product);

        $this->product->refresh();
        $this->assertEquals(5.0, (float) $this->product->rating);
        $this->assertEquals(1, $this->product->review_count);
    }

    public function test_multiple_approved_reviews_average_correctly(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        ProductReview::factory()->approved()->create([
            'product_id' => $this->product->id,
            'user_id' => $user1->id,
            'rating' => 5,
        ]);
        ProductReview::factory()->approved()->create([
            'product_id' => $this->product->id,
            'user_id' => $user2->id,
            'rating' => 4,
        ]);

        $this->ratingService->recalculate($this->product);

        $this->product->refresh();
        $this->assertEquals(4.5, (float) $this->product->rating);
        $this->assertEquals(2, $this->product->review_count);
    }

    public function test_pending_review_not_counted(): void
    {
        $user = User::factory()->create();
        ProductReview::factory()->create([
            'product_id' => $this->product->id,
            'user_id' => $user->id,
            'rating' => 5,
            'status' => 'pending',
        ]);

        $this->ratingService->recalculate($this->product);

        $this->product->refresh();
        $this->assertEquals(0.0, (float) $this->product->rating);
        $this->assertEquals(0, $this->product->review_count);
    }

    public function test_approving_pending_review_updates_rating(): void
    {
        $user = User::factory()->create();
        $review = ProductReview::factory()->create([
            'product_id' => $this->product->id,
            'user_id' => $user->id,
            'rating' => 5,
            'status' => 'pending',
        ]);

        $this->ratingService->recalculate($this->product);
        $this->product->refresh();
        $this->assertEquals(0.0, (float) $this->product->rating);

        $review->update(['status' => 'approved']);
        $this->ratingService->recalculate($this->product);

        $this->product->refresh();
        $this->assertEquals(5.0, (float) $this->product->rating);
        $this->assertEquals(1, $this->product->review_count);
    }

    public function test_rejecting_approved_review_updates_rating(): void
    {
        $user = User::factory()->create();
        $review = ProductReview::factory()->approved()->create([
            'product_id' => $this->product->id,
            'user_id' => $user->id,
            'rating' => 5,
        ]);

        $this->ratingService->recalculate($this->product);
        $this->product->refresh();
        $this->assertEquals(5.0, (float) $this->product->rating);

        $review->update(['status' => 'rejected']);
        $this->ratingService->recalculate($this->product);

        $this->product->refresh();
        $this->assertEquals(0.0, (float) $this->product->rating);
        $this->assertEquals(0, $this->product->review_count);
    }

    public function test_updating_approved_review_rating_recalculates(): void
    {
        $user = User::factory()->create();
        $review = ProductReview::factory()->approved()->create([
            'product_id' => $this->product->id,
            'user_id' => $user->id,
            'rating' => 4,
        ]);

        $this->ratingService->recalculate($this->product);
        $this->product->refresh();
        $this->assertEquals(4.0, (float) $this->product->rating);

        $review->update(['rating' => 5]);
        $this->ratingService->recalculate($this->product);

        $this->product->refresh();
        $this->assertEquals(5.0, (float) $this->product->rating);
    }

    public function test_deleting_approved_review_updates_rating(): void
    {
        $user = User::factory()->create();
        $review = ProductReview::factory()->approved()->create([
            'product_id' => $this->product->id,
            'user_id' => $user->id,
            'rating' => 5,
        ]);

        $this->ratingService->recalculate($this->product);
        $this->product->refresh();
        $this->assertEquals(5.0, (float) $this->product->rating);

        $review->delete();
        $this->ratingService->recalculate($this->product);

        $this->product->refresh();
        $this->assertEquals(0.0, (float) $this->product->rating);
        $this->assertEquals(0, $this->product->review_count);
    }

    public function test_last_review_deletion_resets_to_zero(): void
    {
        $user = User::factory()->create();
        $review = ProductReview::factory()->approved()->create([
            'product_id' => $this->product->id,
            'user_id' => $user->id,
            'rating' => 3,
        ]);

        $this->ratingService->recalculate($this->product);

        $review->delete();
        $this->ratingService->recalculate($this->product);

        $this->product->refresh();
        $this->assertEquals(0.0, (float) $this->product->rating);
        $this->assertEquals(0, $this->product->review_count);
    }

    // ─── Admin Approval Triggers Recalculation ──────────

    public function test_admin_approval_recalculates_rating(): void
    {
        $user = User::factory()->create();
        $review = ProductReview::factory()->create([
            'product_id' => $this->product->id,
            'user_id' => $user->id,
            'rating' => 5,
            'status' => 'pending',
        ]);

        $response = $this->asUser($this->admin)->postJson(
            "/api/admin/products/{$this->product->id}/reviews/{$review->id}/approve"
        );

        $response->assertOk();

        $this->product->refresh();
        $this->assertEquals(5.0, (float) $this->product->rating);
        $this->assertEquals(1, $this->product->review_count);
    }

    public function test_admin_rejection_recalculates_rating(): void
    {
        $user = User::factory()->create();
        $review = ProductReview::factory()->approved()->create([
            'product_id' => $this->product->id,
            'user_id' => $user->id,
            'rating' => 5,
        ]);

        $this->ratingService->recalculate($this->product);

        $response = $this->asUser($this->admin)->postJson(
            "/api/admin/products/{$this->product->id}/reviews/{$review->id}/reject"
        );

        $response->assertOk();

        $this->product->refresh();
        $this->assertEquals(0.0, (float) $this->product->rating);
        $this->assertEquals(0, $this->product->review_count);
    }

    public function test_admin_deletion_recalculates_rating(): void
    {
        $user = User::factory()->create();
        $review = ProductReview::factory()->approved()->create([
            'product_id' => $this->product->id,
            'user_id' => $user->id,
            'rating' => 4,
        ]);

        $this->ratingService->recalculate($this->product);

        $response = $this->asUser($this->admin)->deleteJson(
            "/api/admin/products/{$this->product->id}/reviews/{$review->id}"
        );

        $response->assertOk();

        $this->product->refresh();
        $this->assertEquals(0.0, (float) $this->product->rating);
        $this->assertEquals(0, $this->product->review_count);
    }
}
