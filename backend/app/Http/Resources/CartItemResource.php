<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product' => [
                'id' => $this->product->id,
                'title' => $this->product->title,
                'slug' => $this->product->slug,
                'thumbnail_url' => $this->product->images->firstWhere('is_thumbnail', true)?->image_url
                    ?? $this->product->images->first()?->image_url,
            ],
            'variant' => [
                'id' => $this->productVariant->id,
                'name' => $this->productVariant->name,
                'weight' => (float) $this->productVariant->weight,
                'unit' => $this->productVariant->unit->value,
                'price' => (float) $this->productVariant->price,
            ],
            'quantity' => $this->quantity,
            'unit_price' => (float) $this->unit_price,
            'subtotal' => (float) $this->unit_price * $this->quantity,
        ];
    }
}
