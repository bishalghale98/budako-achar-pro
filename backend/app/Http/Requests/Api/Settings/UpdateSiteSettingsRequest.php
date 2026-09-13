<?php

namespace App\Http\Requests\Api\Settings;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSiteSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $siteSettingId = $this->route('siteSetting')?->id;

        return [
            // General
            'site_name' => ['required', 'string', 'max:255'],
            'site_description' => ['nullable', 'string', 'max:1000'],
            'currency_code' => ['required', 'string', 'max:10'],
            'currency_symbol' => ['required', 'string', 'max:10'],
            'default_city' => ['nullable', 'string', 'max:100'],
            'default_province' => ['nullable', 'string', 'max:100'],
            'timezone' => ['required', 'string', 'max:50'],

            // Branding
            'brand_name' => ['required', 'string', 'max:255'],
            'brand_logo' => ['nullable', 'image', 'max:2048', 'mimes:jpeg,png,webp'],
            'favicon' => ['nullable', 'image', 'max:512', 'mimes:ico,png,svg'],
            'brand_display_mode' => ['required', 'string', 'in:image,name'],

            // Contact
            'phone' => ['nullable', 'string', 'max:30'],
            'whatsapp_number' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'google_maps_url' => ['nullable', 'url', 'max:500'],

            // Social
            'facebook_url' => ['nullable', 'url', 'max:500'],
            'instagram_url' => ['nullable', 'url', 'max:500'],
            'tiktok_url' => ['nullable', 'url', 'max:500'],
            'youtube_url' => ['nullable', 'url', 'max:500'],

            // SEO
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:1000'],
            'og_image' => ['nullable', 'image', 'max:2048', 'mimes:jpeg,png,webp'],

            // Footer
            'footer_description' => ['nullable', 'string', 'max:1000'],
            'copyright_text' => ['nullable', 'string', 'max:255'],
        ];
    }
}
