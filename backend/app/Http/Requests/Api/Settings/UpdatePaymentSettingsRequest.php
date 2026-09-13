<?php

namespace App\Http\Requests\Api\Settings;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePaymentSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Digital Payment
            'digital_payment_account_name' => ['nullable', 'string', 'max:255'],
            'digital_payment_wallet_number' => ['nullable', 'string', 'max:30'],
            'digital_payment_qr_image' => ['nullable', 'image', 'max:2048', 'mimes:jpeg,png,webp'],

            // Bank Transfer
            'bank_name' => ['nullable', 'string', 'max:255'],
            'bank_account_name' => ['nullable', 'string', 'max:255'],
            'bank_account_number' => ['nullable', 'string', 'max:50'],
            'bank_branch' => ['nullable', 'string', 'max:100'],
            'bank_qr_image' => ['nullable', 'image', 'max:2048', 'mimes:jpeg,png,webp'],
        ];
    }
}
