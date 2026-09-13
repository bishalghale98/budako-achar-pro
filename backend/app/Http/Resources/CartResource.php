<?php

namespace App\Http\Resources;

use App\Models\OrderSetting;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $items = CartItemResource::collection($this->whenLoaded('items'));
        $subtotal = (float) $this->items->sum(fn ($item) => $item->unit_price * $item->quantity);
        $deliveryFee = OrderSetting::getDeliveryFee();

        return [
            'id' => $this->id,
            'items' => $items,
            'subtotal' => $subtotal,
            'delivery_fee' => $deliveryFee,
            'total' => $subtotal + $deliveryFee,
            'item_count' => $this->items->count(),
            'total_quantity' => (int) $this->items->sum('quantity'),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
