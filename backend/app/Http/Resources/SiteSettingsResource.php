<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SiteSettingsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            // General
            'site_name' => $this->site_name,
            'site_description' => $this->site_description,
            'currency_code' => $this->currency_code,
            'currency_symbol' => $this->currency_symbol,
            'default_city' => $this->default_city,
            'default_province' => $this->default_province,
            'timezone' => $this->timezone,

            // Branding
            'brand_name' => $this->brand_name,
            'brand_logo' => $this->brand_logo,
            'favicon' => $this->favicon,
            'brand_display_mode' => $this->brand_display_mode,

            // Contact
            'phone' => $this->phone,
            'whatsapp_number' => $this->whatsapp_number,
            'email' => $this->email,
            'address' => $this->address,
            'google_maps_url' => $this->google_maps_url,

            // Social
            'facebook_url' => $this->facebook_url,
            'instagram_url' => $this->instagram_url,
            'tiktok_url' => $this->tiktok_url,
            'youtube_url' => $this->youtube_url,

            // SEO
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'og_image' => $this->og_image,

            // Footer
            'footer_description' => $this->footer_description,
            'copyright_text' => $this->copyright_text,

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
