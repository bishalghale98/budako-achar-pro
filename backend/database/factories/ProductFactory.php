<?php

namespace Database\Factories;

use App\Enums\ProductStatus;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $title = fake()->unique()->words(2, true);

        return [
            'category_id' => Category::factory(),
            'title' => ucfirst($title),
            'slug' => str($title)->slug()->toString(),
            'short_description' => fake()->sentence(),
            'description' => fake()->paragraphs(2, true),
            'rating' => 0,
            'review_count' => 0,
            'featured' => fake()->boolean(20),
            'status' => ProductStatus::Active,
        ];
    }

    public function featured(): static
    {
        return $this->state(fn () => ['featured' => true]);
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['status' => ProductStatus::Inactive]);
    }
}
