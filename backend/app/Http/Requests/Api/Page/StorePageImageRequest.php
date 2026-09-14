<?php

namespace App\Http\Requests\Api\Page;

use Illuminate\Foundation\Http\FormRequest;

class StorePageImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'image' => ['required', 'file', 'image', 'max:5120', 'mimes:jpeg,png,webp'],
        ];
    }
}
