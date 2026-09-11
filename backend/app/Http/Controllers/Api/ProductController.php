<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $products = Product::with(['category', 'images', 'variants'])
            ->where('status', 'active')
            ->when($request->category_id, fn ($q, $categoryId) => $q->where('category_id', $categoryId))
            ->when($request->featured !== null, fn ($q, $featured) => $q->where('featured', $featured))
            ->when($request->search, fn ($q, $search) => $q->where('title', 'like', "%{$search}%"))
            ->orderByDesc('created_at')
            ->paginate($request->per_page ?? 20);

        return ProductResource::collection($products);
    }

    public function show(string $slug): JsonResponse
    {
        $product = Product::with(['category', 'images', 'variants'])
            ->where('slug', $slug)
            ->where('status', 'active')
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'product' => new ProductResource($product),
        ]);
    }

    public function reviews(string $slug): JsonResponse
    {
        $product = Product::where('slug', $slug)->where('status', 'active')->firstOrFail();

        $reviews = $product->approvedReviews()
            ->with('user:id,name')
            ->orderByDesc('created_at')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'reviews' => $reviews,
        ]);
    }
}
