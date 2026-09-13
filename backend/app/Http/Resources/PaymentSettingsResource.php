<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentSettingsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            // Digital Payment
            'digital_payment_account_name' => $this->digital_payment_account_name,
            'digital_payment_wallet_number' => $this->digital_payment_wallet_number,
            'digital_payment_qr_image' => $this->digital_payment_qr_image,

            // Bank Transfer
            'bank_name' => $this->bank_name,
            'bank_account_name' => $this->bank_account_name,
            'bank_account_number' => $this->bank_account_number,
            'bank_branch' => $this->bank_branch,
            'bank_qr_image' => $this->bank_qr_image,

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
