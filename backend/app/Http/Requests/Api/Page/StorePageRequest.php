<?php

namespace App\Http\Requests\Api\Page;

use App\Rules\ValidTiptapDocument;
use Illuminate\Foundation\Http\FormRequest;

class StorePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:pages,slug'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'content' => ['nullable', new ValidTiptapDocument],
            'status' => ['sometimes', 'string', 'in:draft,published'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:500'],
            'canonical_url' => ['nullable', 'string', 'max:500', 'url'],
        ];
    }
}
