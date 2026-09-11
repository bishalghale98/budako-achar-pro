<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductImageFactory extends Factory
{
    protected $model = ProductImage::class;

    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'image_url' => fake()->imageUrl(800, 600, 'food'),
            'is_thumbnail' => false,
            'sort_order' => 0,
        ];
    }

    public function thumbnail(): static
    {
        return $this->state(fn () => ['is_thumbnail' => true]);
    }
}
