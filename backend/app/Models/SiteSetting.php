<?php

namespace App\Models;

use App\Traits\HasCuid;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'site_name', 'site_description', 'currency_code', 'currency_symbol',
    'default_city', 'default_province', 'timezone',
    'brand_name', 'brand_logo', 'favicon', 'brand_display_mode',
    'phone', 'whatsapp_number', 'email', 'address', 'google_maps_url',
    'facebook_url', 'instagram_url', 'tiktok_url', 'youtube_url',
    'meta_title', 'meta_description', 'og_image',
    'footer_description', 'copyright_text',
])]
class SiteSetting extends Model
{
    use HasCuid;

    protected $table = 'site_settings';

    /**
     * Get the single settings record, creating it if it doesn't exist.
     */
    public static function instance(): static
    {
        return static::firstOrCreate([], [
            'site_name' => 'Buda Ko Achar',
            'site_description' => 'Handcrafted, traditional Nepali achar made with love. Explore our range of authentic pickles.',
            'currency_code' => 'NPR',
            'currency_symbol' => 'NPR',
            'timezone' => 'Asia/Kathmandu',
            'brand_name' => 'Buda Ko Achar',
            'brand_display_mode' => 'image',
        ]);
    }
}
