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
        $addressId = $this->input('address_id');

        $rules = [
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:20'],
            'customer_email' => ['required', 'email', 'max:255'],
            'payment_method' => ['required', 'string', 'in:cod,digital,bank'],
            'payment_proof' => array_merge(
                in_array($paymentMethod, ['digital', 'bank'])
                    ? ['required']
                    : ['nullable'],
                ['file', 'image', 'max:5120']
            ),
        ];

        if ($addressId) {
            $rules['address_id'] = ['required', 'string', 'exists:addresses,id'];
        } else {
            $rules['address_line'] = ['required', 'string', 'max:255'];
            $rules['area'] = ['nullable', 'string', 'max:255'];
            $rules['city'] = ['required', 'string', 'max:100'];
            $rules['province'] = ['required', 'string', 'max:100'];
            $rules['delivery_notes'] = ['nullable', 'string', 'max:500'];
        }

        return $rules;
    }
}
