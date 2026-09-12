<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $thumbnail = $this->images->firstWhere('is_thumbnail', true);
        $activeVariants = $this->variants->where('status', 'active');
        $totalStock = (int) $activeVariants->sum('stock');
        $lowStockThreshold = (int) env('PRODUCT_LOW_STOCK_THRESHOLD', 5);

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'ingredients' => $this->ingredients,
            'storage_info' => $this->storage_info,
            'rating' => (float) $this->rating,
            'review_count' => $this->review_count,
            'featured' => $this->featured,
            'status' => $this->status->value,
            'thumbnail_url' => $thumbnail?->image_url,
            'total_stock' => $totalStock,
            'is_available' => $totalStock > 0,
            'low_stock' => $totalStock > 0 && $totalStock <= $lowStockThreshold,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'images' => ProductImageResource::collection($this->whenLoaded('images')),
            'variants' => ProductVariantResource::collection($this->whenLoaded('variants')),
            'reviews' => ProductReviewResource::collection($this->whenLoaded('reviews')),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
