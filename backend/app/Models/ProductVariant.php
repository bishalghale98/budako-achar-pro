<?php

namespace App\Models;

use App\Enums\UnitType;
use App\Enums\VariantStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['product_id', 'name', 'weight', 'unit', 'price', 'compare_price', 'stock', 'sku', 'status'])]
class ProductVariant extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'weight' => 'decimal:2',
            'price' => 'decimal:2',
            'compare_price' => 'decimal:2',
            'stock' => 'integer',
            'unit' => UnitType::class,
            'status' => VariantStatus::class,
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
