<?php

namespace Database\Factories;

use App\Enums\UnitType;
use App\Enums\VariantStatus;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductVariantFactory extends Factory
{
    protected $model = ProductVariant::class;

    public function definition(): array
    {
        $weight = fake()->randomElement([250, 500, 1000]);
        $unit = $weight >= 1000 ? UnitType::Kilogram : UnitType::Gram;
        $displayWeight = $weight >= 1000 ? $weight / 1000 : $weight;

        return [
            'product_id' => Product::factory(),
            'name' => $displayWeight . $unit->value,
            'weight' => $displayWeight,
            'unit' => $unit,
            'price' => fake()->randomFloat(2, 150, 800),
            'compare_price' => null,
            'stock' => fake()->numberBetween(0, 100),
            'sku' => strtoupper(fake()->bothify('####-???')),
            'status' => VariantStatus::Active,
        ];
    }
}
