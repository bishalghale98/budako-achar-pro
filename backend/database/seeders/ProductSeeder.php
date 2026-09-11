<?php

namespace Database\Seeders;

use App\Enums\ReviewStatus;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $bishal = User::where('email', 'bishal@example.com')->first();
        $aayush = User::where('email', 'aayush@example.com')->first();
        $puja = User::where('email', 'puja@example.com')->first();

        $traditionalMeat = Category::where('slug', 'traditional-meat-pickles')->first();
        $vegFruit = Category::where('slug', 'vegetable-fruit-pickles')->first();
        $specialty = Category::where('slug', 'specialty-regional-pickles')->first();

        // ─── Products ──────────────────────────────────────

        $buff = Product::create([
            'category_id' => $traditionalMeat->id,
            'title' => "Buda's Special Buff Achar",
            'slug' => 'budas-special-buff-achar',
            'short_description' => 'Tender buffalo meat chunks slow-cooked in rich mustard oil with aromatic Himalayan timur and coarse spices.',
            'description' => "Crafted using an age-old heritage recipe passed down generations. We use lean buffalo meat perfectly spiced with sun-dried local chillies, garlic paste, fenugreek, and cold-pressed mustard oil for an intense, smoky flavor profile.",
            'rating' => 4.90,
            'review_count' => 42,
            'featured' => true,
            'status' => 'active',
        ]);

        $lapsi = Product::create([
            'category_id' => $vegFruit->id,
            'title' => 'Tangy Lapsi Sweet & Sour Pickle',
            'slug' => 'tangy-lapsi-sweet-sour-pickle',
            'short_description' => 'Wild Himalayan hog plum simmered in jaggery syrup with a punch of spice and authentic warmth.',
            'description' => "A nostalgic childhood favorite capturing the perfect balance of tart lapsi pulp, unrefined sugarcane jaggery, and secret spice blends. Excellent companion for traditional Nepali dal-bhat or snacks.",
            'rating' => 4.85,
            'review_count' => 28,
            'featured' => true,
            'status' => 'active',
        ]);

        $dalle = Product::create([
            'category_id' => $specialty->id,
            'title' => 'Extra Hot Dalle Khursani Paste',
            'slug' => 'extra-hot-dalle-khursani-paste',
            'short_description' => 'Fiery round cherry peppers crushed fresh with pungent garlic and cold-pressed mustard oil.',
            'description' => "Made using authentic organic Dalle Khursani harvested from the hills. This explosive paste brings an intense kick and distinct aroma that elevates any meal instantly. Handle with delicious caution!",
            'rating' => 4.95,
            'review_count' => 64,
            'featured' => true,
            'status' => 'active',
        ]);

        $veg = Product::create([
            'category_id' => $vegFruit->id,
            'title' => 'Traditional Mixed Vegetable Achar',
            'slug' => 'traditional-mixed-vegetable-achar',
            'short_description' => 'Crunchy cauliflower, carrots, and radishes cured in a rich mustard and turmeric marinade.',
            'description' => "A vibrant medley of crisp winter vegetables naturally fermented and sun-kissed under traditional earthen covers. Coated generously in mustard paste and authentic spices.",
            'rating' => 4.75,
            'review_count' => 19,
            'featured' => false,
            'status' => 'active',
        ]);

        $chicken = Product::create([
            'category_id' => $traditionalMeat->id,
            'title' => 'Timur-Infused Chicken Achar',
            'slug' => 'timur-infused-chicken-achar',
            'short_description' => 'Boneless chicken pieces infused with tongue-tingling Sichuan pepper and rich aromatic spices.',
            'description' => "Premium tender chicken pieces slow-roasted and preserved in pure mustard oil. Enhanced with generous notes of fresh green timur, creating a numbing, savory depth.",
            'rating' => 4.88,
            'review_count' => 35,
            'featured' => true,
            'status' => 'active',
        ]);

        // ─── Variants ──────────────────────────────────────

        $buff->variants()->createMany([
            ['name' => '200g Jar', 'weight' => 200, 'unit' => 'g', 'price' => 350.00, 'compare_price' => 400.00, 'stock' => 50, 'sku' => 'BA-BUFF-200G', 'status' => 'active'],
            ['name' => '500g Jar', 'weight' => 500, 'unit' => 'g', 'price' => 800.00, 'compare_price' => 900.00, 'stock' => 30, 'sku' => 'BA-BUFF-500G', 'status' => 'active'],
            ['name' => '1kg Family Pack', 'weight' => 1000, 'unit' => 'g', 'price' => 1500.00, 'compare_price' => 1700.00, 'stock' => 15, 'sku' => 'BA-BUFF-1KG', 'status' => 'active'],
        ]);

        $lapsi->variants()->createMany([
            ['name' => '250g Jar', 'weight' => 250, 'unit' => 'g', 'price' => 250.00, 'compare_price' => 300.00, 'stock' => 60, 'sku' => 'BA-LAPSI-250G', 'status' => 'active'],
            ['name' => '500g Jar', 'weight' => 500, 'unit' => 'g', 'price' => 480.00, 'compare_price' => 550.00, 'stock' => 40, 'sku' => 'BA-LAPSI-500G', 'status' => 'active'],
        ]);

        $dalle->variants()->createMany([
            ['name' => '150g Glass Jar', 'weight' => 150, 'unit' => 'g', 'price' => 280.00, 'compare_price' => 320.00, 'stock' => 80, 'sku' => 'BA-DALLE-150G', 'status' => 'active'],
            ['name' => '350g Glass Jar', 'weight' => 350, 'unit' => 'g', 'price' => 600.00, 'compare_price' => 680.00, 'stock' => 45, 'sku' => 'BA-DALLE-350G', 'status' => 'active'],
        ]);

        $veg->variants()->createMany([
            ['name' => '300g Jar', 'weight' => 300, 'unit' => 'g', 'price' => 220.00, 'compare_price' => 250.00, 'stock' => 50, 'sku' => 'BA-MIXVEG-300G', 'status' => 'active'],
            ['name' => '700g Jar', 'weight' => 700, 'unit' => 'g', 'price' => 490.00, 'compare_price' => 560.00, 'stock' => 25, 'sku' => 'BA-MIXVEG-700G', 'status' => 'active'],
        ]);

        $chicken->variants()->createMany([
            ['name' => '200g Jar', 'weight' => 200, 'unit' => 'g', 'price' => 380.00, 'compare_price' => 430.00, 'stock' => 40, 'sku' => 'BA-CHICKEN-200G', 'status' => 'active'],
            ['name' => '500g Jar', 'weight' => 500, 'unit' => 'g', 'price' => 880.00, 'compare_price' => 980.00, 'stock' => 20, 'sku' => 'BA-CHICKEN-500G', 'status' => 'active'],
        ]);

        // ─── Images ────────────────────────────────────────

        $buff->images()->createMany([
            ['image_url' => 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800', 'is_thumbnail' => true, 'sort_order' => 0],
            ['image_url' => 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', 'is_thumbnail' => false, 'sort_order' => 1],
        ]);

        $lapsi->images()->createMany([
            ['image_url' => 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800', 'is_thumbnail' => true, 'sort_order' => 0],
            ['image_url' => 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', 'is_thumbnail' => false, 'sort_order' => 1],
        ]);

        $dalle->images()->createMany([
            ['image_url' => 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800', 'is_thumbnail' => true, 'sort_order' => 0],
            ['image_url' => 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', 'is_thumbnail' => false, 'sort_order' => 1],
        ]);

        $veg->images()->create([
            'image_url' => 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
            'is_thumbnail' => true,
            'sort_order' => 0,
        ]);

        $chicken->images()->create([
            'image_url' => 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800',
            'is_thumbnail' => true,
            'sort_order' => 0,
        ]);

        // ─── Reviews ───────────────────────────────────────

        ProductReview::create([
            'product_id' => $buff->id,
            'user_id' => $bishal->id,
            'rating' => 5,
            'title' => 'Absolute game changer for Dal-Bhat!',
            'comment' => 'Reminds me completely of traditional homeland flavors. The mustard oil aroma hits right away and the buff chunks are cooked to absolute perfection. Will definitely reorder.',
            'status' => ReviewStatus::Approved,
        ]);

        ProductReview::create([
            'product_id' => $dalle->id,
            'user_id' => $aayush->id,
            'rating' => 5,
            'title' => 'Warning: Extremely addictive heat!',
            'comment' => 'If you love spicy food, this is holy grail material. Just a tiny dab with momos or noodles brings tears of joy. Fresh garlic flavor comes through beautifully.',
            'status' => ReviewStatus::Approved,
        ]);

        ProductReview::create([
            'product_id' => $lapsi->id,
            'user_id' => $puja->id,
            'rating' => 4,
            'title' => 'Nostalgic and delicious flavor',
            'comment' => 'Perfect blend of sweet jaggery and sour lapsi pulp. My kids love it with their evening snacks. Packaging was clean and secure too.',
            'status' => ReviewStatus::Approved,
        ]);

        ProductReview::create([
            'product_id' => $chicken->id,
            'user_id' => $bishal->id,
            'rating' => 5,
            'title' => 'That timur tingle is amazing!',
            'comment' => 'The packaging is neat and the chicken is tender. The green timur gives that authentic tongue-numbing sensation that is so hard to find commercially.',
            'status' => ReviewStatus::Approved,
        ]);

        ProductReview::create([
            'product_id' => $veg->id,
            'user_id' => $aayush->id,
            'rating' => 4,
            'title' => 'Crunchy and fresh',
            'comment' => 'You can actually taste the sun-cured freshness in the vegetables. Goes wonderfully with plain parathas and morning tea.',
            'status' => ReviewStatus::Approved,
        ]);
    }
}
