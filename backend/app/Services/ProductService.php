<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Support\Facades\DB;

class ProductService
{
    public function __construct(
        protected ProductRatingService $ratingService,
    ) {}

    public function create(array $data): Product
    {
        return DB::transaction(function () use ($data) {
            $product = Product::create($data);

            if (isset($data['images']) && is_array($data['images'])) {
                foreach ($data['images'] as $index => $imageData) {
                    $product->images()->create([
                        'image_url' => $imageData['image_url'],
                        'is_thumbnail' => $imageData['is_thumbnail'] ?? false,
                        'sort_order' => $imageData['sort_order'] ?? $index,
                    ]);
                }

                $this->ensureThumbnail($product);
            }

            return $product;
        });
    }

    public function update(Product $product, array $data): Product
    {
        $product->update($data);
        return $product;
    }

    public function delete(Product $product): bool
    {
        return DB::transaction(function () use ($product) {
            $product->images()->delete();
            $product->variants()->delete();
            $product->reviews()->delete();
            return $product->delete();
        });
    }

    public function setThumbnail(Product $product, ProductImage $image): void
    {
        DB::transaction(function () use ($product, $image) {
            $product->images()->where('is_thumbnail', true)->update(['is_thumbnail' => false]);
            $image->refresh();
            $image->update(['is_thumbnail' => true]);
        });
    }

    public function reorderImages(Product $product, array $orderedIds): void
    {
        foreach ($orderedIds as $index => $id) {
            $product->images()->where('id', $id)->update(['sort_order' => $index]);
        }
    }

    protected function ensureThumbnail(Product $product): void
    {
        if (! $product->images()->where('is_thumbnail', true)->exists()) {
            $firstImage = $product->images()->orderBy('sort_order')->first();
            if ($firstImage) {
                $firstImage->update(['is_thumbnail' => true]);
            }
        }
    }
}
