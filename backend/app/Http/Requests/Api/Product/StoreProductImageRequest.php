<?php

namespace App\Http\Requests\Api\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreProductImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'image' => ['nullable', 'file', 'image', 'max:5120', 'mimes:jpeg,png,webp'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'is_thumbnail' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if (! $this->hasFile('image') && ! $this->filled('image_url')) {
                $validator->errors()->add(
                    'image',
                    'Either an image file or an image URL is required.'
                );
            }
        });
    }
}
