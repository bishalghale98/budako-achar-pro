<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'payment_method' => $this->payment_method->value,
            'status' => $this->status->value,
            'amount' => (float) $this->amount,
            'proof_image' => $this->proof_image,
            'verified_by' => $this->verified_by,
            'verified_at' => $this->verified_at?->toISOString(),
            'rejection_reason' => $this->rejection_reason,
            'order' => $this->whenLoaded('order', fn () => [
                'id' => $this->order->id,
                'order_number' => $this->order->order_number,
                'status' => $this->order->status->value,
            ]),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
