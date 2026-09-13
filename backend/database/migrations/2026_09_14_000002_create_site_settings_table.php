<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->string('id')->primary();

            // General
            $table->string('site_name', 255);
            $table->text('site_description')->nullable();
            $table->string('currency_code', 10)->default('NPR');
            $table->string('currency_symbol', 10)->default('NPR');
            $table->string('default_city', 100)->nullable();
            $table->string('default_province', 100)->nullable();
            $table->string('timezone', 50)->default('Asia/Kathmandu');

            // Branding
            $table->string('brand_name', 255);
            $table->string('brand_logo', 500)->nullable();
            $table->string('favicon', 500)->nullable();
            $table->string('brand_display_mode', 10)->default('image');

            // Contact
            $table->string('phone', 30)->nullable();
            $table->string('whatsapp_number', 30)->nullable();
            $table->string('email', 255)->nullable();
            $table->text('address')->nullable();
            $table->string('google_maps_url', 500)->nullable();

            // Social
            $table->string('facebook_url', 500)->nullable();
            $table->string('instagram_url', 500)->nullable();
            $table->string('tiktok_url', 500)->nullable();
            $table->string('youtube_url', 500)->nullable();

            // SEO
            $table->string('meta_title', 255)->nullable();
            $table->text('meta_description')->nullable();
            $table->string('og_image', 500)->nullable();

            // Footer
            $table->text('footer_description')->nullable();
            $table->string('copyright_text', 255)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
