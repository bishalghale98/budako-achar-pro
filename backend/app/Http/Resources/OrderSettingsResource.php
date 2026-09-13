<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderSettingsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'delivery_fee' => (float) $this->delivery_fee,
            'free_delivery_threshold' => $this->free_delivery_threshold ? (float) $this->free_delivery_threshold : null,
            'minimum_order_amount' => $this->minimum_order_amount ? (float) $this->minimum_order_amount : null,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
