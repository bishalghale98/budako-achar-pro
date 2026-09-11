<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductReviewResource;
use App\Models\Product;
use App\Models\ProductReview;
use App\Services\ProductRatingService;
use Illuminate\Http\JsonResponse;

class AdminProductReviewController extends Controller
{
    public function __construct(
        protected ProductRatingService $ratingService,
    ) {}

    public function index(Product $product): JsonResponse
    {
        $reviews = $product->reviews()->with('user')->orderByDesc('created_at')->get();

        return response()->json([
            'success' => true,
            'reviews' => ProductReviewResource::collection($reviews),
        ]);
    }

    public function approve(Product $product, ProductReview $review): JsonResponse
    {
        if ($review->product_id !== $product->id) {
            return response()->json([
                'success' => false,
                'message' => 'Review does not belong to this product.',
            ], 404);
        }

        $review->update(['status' => 'approved']);
        $this->ratingService->recalculate($product);

        return response()->json([
            'success' => true,
            'message' => 'Review approved.',
            'review' => new ProductReviewResource($review->load('user')),
        ]);
    }

    public function reject(Product $product, ProductReview $review): JsonResponse
    {
        if ($review->product_id !== $product->id) {
            return response()->json([
                'success' => false,
                'message' => 'Review does not belong to this product.',
            ], 404);
        }

        $review->update(['status' => 'rejected']);
        $this->ratingService->recalculate($product);

        return response()->json([
            'success' => true,
            'message' => 'Review rejected.',
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

        $review->delete();
        $this->ratingService->recalculate($product);

        return response()->json([
            'success' => true,
            'message' => 'Review deleted.',
        ]);
    }
}
