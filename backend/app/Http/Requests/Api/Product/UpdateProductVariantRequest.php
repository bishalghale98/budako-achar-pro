<?php

namespace App\Http\Requests\Api\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductVariantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $variantId = $this->route('variant')?->id;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'weight' => ['sometimes', 'required', 'numeric', 'min:0'],
            'unit' => ['sometimes', 'required', 'string', 'in:g,kg'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'compare_price' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['sometimes', 'integer', 'min:0'],
            'sku' => ['nullable', 'string', 'max:255', 'unique:product_variants,sku,' . $variantId],
            'status' => ['sometimes', 'string', 'in:active,inactive'],
        ];
    }
}
