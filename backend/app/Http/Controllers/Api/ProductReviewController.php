<?php

namespace App\Http\Controllers\Api;

use App\Enums\ReviewStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Product\StoreProductReviewRequest;
use App\Http\Requests\Api\Product\UpdateProductReviewRequest;
use App\Http\Resources\ProductReviewResource;
use App\Models\Product;
use App\Models\ProductReview;
use App\Services\ProductRatingService;
use Illuminate\Http\JsonResponse;

class ProductReviewController extends Controller
{
    public function __construct(
        protected ProductRatingService $ratingService,
    ) {}

    public function store(StoreProductReviewRequest $request, Product $product): JsonResponse
    {
        $existingReview = ProductReview::where('product_id', $product->id)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existingReview) {
            return response()->json([
                'success' => false,
                'message' => 'You have already reviewed this product.',
            ], 422);
        }

        $review = $product->reviews()->create([
            'user_id' => $request->user()->id,
            'rating' => $request->rating,
            'title' => $request->title,
            'comment' => $request->comment,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Review submitted. It will be visible after moderation.',
            'review' => new ProductReviewResource($review->load('user')),
        ], 201);
    }

    public function update(UpdateProductReviewRequest $request, Product $product, ProductReview $review): JsonResponse
    {
        if ($review->product_id !== $product->id) {
            return response()->json([
                'success' => false,
                'message' => 'Review does not belong to this product.',
            ], 404);
        }

        if ($review->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'You can only update your own review.',
            ], 403);
        }

        $review->update($request->validated());

        if ($review->status === ReviewStatus::Approved) {
            $this->ratingService->recalculate($product);
        }

        return response()->json([
            'success' => true,
            'message' => 'Review updated successfully.',
            'review' => new ProductReviewResource($review->load('user')),
        ]);
    }

    public function destroy(Product $product, ProductReview $review): JsonResponse
    {
        if ($review->product_id !== $product->id) {
            return response()->json([
                'success' => false,
                'message' => 'Review does not belong to this product.',
            ], 404);
        }

        if ($review->user_id !== request()->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'You can only delete your own review.',
            ], 403);
        }

        $review->delete();
        $this->ratingService->recalculate($product);

        return response()->json([
            'success' => true,
            'message' => 'Review deleted.',
        ]);
    }
}
