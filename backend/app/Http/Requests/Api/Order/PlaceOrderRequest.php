<?php

namespace App\Http\Requests\Api\Order;

use App\Enums\PaymentMethod;
use Illuminate\Foundation\Http\FormRequest;

class PlaceOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $paymentMethod = $this->input('payment_method');

        return [
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:20'],
            'customer_email' => ['required', 'email', 'max:255'],
            'address_line' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'province' => ['required', 'string', 'max:100'],
            'delivery_notes' => ['nullable', 'string', 'max:500'],
            'payment_method' => ['required', 'string', 'in:cod,digital,bank'],
            'payment_proof' => array_merge(
                in_array($paymentMethod, ['digital', 'bank'])
                    ? ['required']
                    : ['nullable'],
                ['file', 'image', 'max:5120']
            ),
        ];
    }
}
