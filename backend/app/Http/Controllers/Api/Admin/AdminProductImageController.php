<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Product\StoreProductImageRequest;
use App\Http\Requests\Api\Product\UpdateProductImageRequest;
use App\Http\Resources\ProductImageResource;
use App\Models\Product;
use App\Models\ProductImage;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminProductImageController extends Controller
{
    public function __construct(
        protected ProductService $productService,
    ) {}

    public function index(Product $product): JsonResponse
    {
        $images = $product->images()->orderBy('sort_order')->get();

        return response()->json([
            'success' => true,
            'images' => ProductImageResource::collection($images),
        ]);
    }

    public function store(StoreProductImageRequest $request, Product $product): JsonResponse
    {
        $maxOrder = $product->images()->max('sort_order') ?? 0;
        $isThumbnail = $request->boolean('is_thumbnail', false);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('products/' . $product->id, $filename, 'public');
            $imageUrl = Storage::disk('public')->url($path);
        } else {
            $imageUrl = $request->input('image_url');
        }

        $image = $product->images()->create([
            'image_url' => $imageUrl,
            'is_thumbnail' => $isThumbnail,
            'sort_order' => $request->integer('sort_order', $maxOrder + 1),
        ]);

        if ($isThumbnail) {
            $this->productService->setThumbnail($product, $image);
        } else {
            $this->productService->ensureThumbnail($product);
        }

        return response()->json([
            'success' => true,
            'message' => 'Image added successfully.',
            'image' => new ProductImageResource($image),
        ], 201);
    }

    public function update(UpdateProductImageRequest $request, Product $product, ProductImage $image): JsonResponse
    {
        if ($image->product_id !== $product->id) {
            return response()->json([
                'success' => false,
                'message' => 'Image does not belong to this product.',
            ], 404);
        }

        $image->update($request->validated());

        if ($request->boolean('is_thumbnail', false)) {
            $this->productService->setThumbnail($product, $image);
        }

        return response()->json([
            'success' => true,
            'message' => 'Image updated successfully.',
            'image' => new ProductImageResource($image),
        ]);
    }

    public function destroy(Product $product, ProductImage $image): JsonResponse
    {
        if ($image->product_id !== $product->id) {
            return response()->json([
                'success' => false,
                'message' => 'Image does not belong to this product.',
            ], 404);
        }

        $wasThumbnail = $image->is_thumbnail;

        // Delete stored file if it's a local product upload
        if (str_starts_with($image->image_url, 'products/')) {
            Storage::disk('public')->delete($image->image_url);
        }

        $image->delete();

        if ($wasThumbnail) {
            $firstImage = $product->images()->orderBy('sort_order')->first();
            if ($firstImage) {
                $firstImage->update(['is_thumbnail' => true]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Image deleted successfully.',
        ]);
    }

    public function setThumbnail(Product $product, ProductImage $image): JsonResponse
    {
        if ($image->product_id !== $product->id) {
            return response()->json([
                'success' => false,
                'message' => 'Image does not belong to this product.',
            ], 404);
        }

        $this->productService->setThumbnail($product, $image);

        return response()->json([
            'success' => true,
            'message' => 'Thumbnail updated successfully.',
        ]);
    }
}
