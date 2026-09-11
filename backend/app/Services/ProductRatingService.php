<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Support\Facades\DB;

class ProductRatingService
{
    public function recalculate(Product $product): void
    {
        $stats = ProductReview::where('product_id', $product->id)
            ->where('status', 'approved')
            ->selectRaw('COALESCE(AVG(rating), 0) as avg_rating')
            ->selectRaw('COUNT(*) as review_count')
            ->first();

        $product->update([
            'rating' => round($stats->avg_rating, 2),
            'review_count' => $stats->review_count,
        ]);
    }
}
