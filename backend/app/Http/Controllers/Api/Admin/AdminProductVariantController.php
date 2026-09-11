<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Product\StoreProductVariantRequest;
use App\Http\Requests\Api\Product\UpdateProductVariantRequest;
use App\Http\Resources\ProductVariantResource;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Enums\VariantStatus;
use Illuminate\Http\JsonResponse;

class AdminProductVariantController extends Controller
{
    public function index(Product $product): JsonResponse
    {
        $variants = $product->variants()->orderBy('weight')->get();

        return response()->json([
            'success' => true,
            'variants' => ProductVariantResource::collection($variants),
        ]);
    }

    public function store(StoreProductVariantRequest $request, Product $product): JsonResponse
    {
        $variant = $product->variants()->create([
            ...$request->validated(),
            'status' => $request->input('status', VariantStatus::Active->value),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Variant created successfully.',
            'variant' => new ProductVariantResource($variant),
        ], 201);
    }

    public function update(UpdateProductVariantRequest $request, Product $product, ProductVariant $variant): JsonResponse
    {
        if ($variant->product_id !== $product->id) {
            return response()->json([
                'success' => false,
                'message' => 'Variant does not belong to this product.',
            ], 404);
        }

        $variant->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Variant updated successfully.',
            'variant' => new ProductVariantResource($variant),
        ]);
    }

    public function destroy(Product $product, ProductVariant $variant): JsonResponse
    {
        if ($variant->product_id !== $product->id) {
            return response()->json([
                'success' => false,
                'message' => 'Variant does not belong to this product.',
            ], 404);
        }

        $variant->delete();

        return response()->json([
            'success' => true,
            'message' => 'Variant deleted successfully.',
        ]);
    }
}
