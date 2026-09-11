<?php

namespace App\Http\Requests\Api\Product;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductVariantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'weight' => ['required', 'numeric', 'min:0'],
            'unit' => ['required', 'string', 'in:g,kg'],
            'price' => ['required', 'numeric', 'min:0'],
            'compare_price' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['sometimes', 'integer', 'min:0'],
            'sku' => ['nullable', 'string', 'max:255', 'unique:product_variants,sku'],
            'status' => ['sometimes', 'string', 'in:active,inactive'],
        ];
    }
}
