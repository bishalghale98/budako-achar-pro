<?php

namespace Database\Seeders;

use App\Enums\ProductStatus;
use App\Enums\ReviewStatus;
use App\Enums\Role;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductReview;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            ['name' => 'Admin', 'password' => Hash::make('password'), 'role' => Role::Admin]
        );

        $customer = User::firstOrCreate(
            ['email' => 'customer@example.com'],
            ['name' => 'Customer', 'password' => Hash::make('password'), 'role' => Role::Customer]
        );

        $categories = [
            ['name' => 'Meat Achar', 'slug' => 'meat-achar'],
            ['name' => 'Traditional Achar', 'slug' => 'traditional-achar'],
            ['name' => 'Vegetarian Achar', 'slug' => 'vegetarian-achar'],
            ['name' => 'Special Achar', 'slug' => 'special-achar'],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(['slug' => $cat['slug']], $cat);
        }

        $products = [
            [
                'title' => 'Chicken Achar',
                'slug' => 'chicken-achar',
                'category' => 'meat-achar',
                'short_description' => 'Rich and spicy home recipe.',
                'description' => 'Rich and savory bone-in chicken pieces simmered in aromatic mustard oil, garlic paste, red chillies, and traditional Nepali spices.',
                'featured' => true,
                'images' => [
                    ['image_url' => 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800', 'is_thumbnail' => true, 'sort_order' => 0],
                ],
                'variants' => [
                    ['name' => '500g', 'weight' => 500, 'unit' => 'g', 'price' => 350, 'stock' => 50, 'sku' => 'CHICKEN-500G'],
                ],
            ],
            [
                'title' => 'Buff Achar',
                'slug' => 'buff-achar',
                'category' => 'meat-achar',
                'short_description' => 'Chewy buff meat cured with local spices.',
                'description' => 'Chewy, flavorful buffalo meat cured with robust Himalayan spices and pungent garlic-ginger paste.',
                'featured' => true,
                'images' => [
                    ['image_url' => 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800', 'is_thumbnail' => true, 'sort_order' => 0],
                ],
                'variants' => [
                    ['name' => '500g', 'weight' => 500, 'unit' => 'g', 'price' => 400, 'stock' => 40, 'sku' => 'BUFF-500G'],
                ],
            ],
            [
                'title' => 'Mutton Achar',
                'slug' => 'mutton-achar',
                'category' => 'meat-achar',
                'short_description' => 'Premium tender mutton cuts.',
                'description' => 'Premium tender mutton cuts simmered in thick aromatic gravies and sun-dried spices.',
                'featured' => true,
                'images' => [
                    ['image_url' => 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=800', 'is_thumbnail' => true, 'sort_order' => 0],
                ],
                'variants' => [
                    ['name' => '500g', 'weight' => 500, 'unit' => 'g', 'price' => 450, 'stock' => 30, 'sku' => 'MUTTON-500G'],
                ],
            ],
            [
                'title' => 'Lapsi Achar',
                'slug' => 'lapsi-achar',
                'category' => 'traditional-achar',
                'short_description' => 'Sweet and tangy hog plum pickle.',
                'description' => 'Sweet and tangy hog plum pickle made with traditional Nepali spices.',
                'featured' => false,
                'images' => [
                    ['image_url' => 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800', 'is_thumbnail' => true, 'sort_order' => 0],
                ],
                'variants' => [
                    ['name' => '500g', 'weight' => 500, 'unit' => 'g', 'price' => 300, 'stock' => 60, 'sku' => 'LAPSI-500G'],
                ],
            ],
            [
                'title' => 'Mixed Achar',
                'slug' => 'mixed-achar',
                'category' => 'traditional-achar',
                'short_description' => 'Assorted traditional spice blend.',
                'description' => 'Assorted traditional spice blend with mixed vegetables and authentic Nepali flavors.',
                'featured' => false,
                'images' => [
                    ['image_url' => 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800', 'is_thumbnail' => true, 'sort_order' => 0],
                ],
                'variants' => [
                    ['name' => '500g', 'weight' => 500, 'unit' => 'g', 'price' => 320, 'stock' => 45, 'sku' => 'MIXED-500G'],
                ],
            ],
        ];

        foreach ($products as $productData) {
            $images = $productData['images'];
            $variants = $productData['variants'];
            unset($productData['images'], $productData['variants']);

            $category = Category::where('slug', $productData['category'])->first();
            $productData['category_id'] = $category->id;
            $productData['status'] = ProductStatus::Active;

            $product = Product::create($productData);

            foreach ($images as $imageData) {
                $product->images()->create($imageData);
            }

            foreach ($variants as $variantData) {
                $product->variants()->create($variantData);
            }
        }

        $product = Product::first();
        ProductReview::create([
            'product_id' => $product->id,
            'user_id' => $customer->id,
            'rating' => 5,
            'title' => 'Excellent taste!',
            'comment' => 'Tastes exactly like home. Perfectly spiced.',
            'status' => ReviewStatus::Approved,
        ]);

        app(\App\Services\ProductRatingService::class)->recalculate($product);
    }
}
