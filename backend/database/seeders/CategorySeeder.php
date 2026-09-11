<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Traditional Meat Pickles', 'slug' => 'traditional-meat-pickles'],
            ['name' => 'Vegetable & Fruit Pickles', 'slug' => 'vegetable-fruit-pickles'],
            ['name' => 'Specialty & Regional Pickles', 'slug' => 'specialty-regional-pickles'],
            ['name' => 'Gift & Combo Packs', 'slug' => 'gift-combo-packs'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
