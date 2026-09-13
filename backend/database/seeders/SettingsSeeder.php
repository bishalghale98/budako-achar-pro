<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use App\Models\PaymentSetting;
use App\Models\OrderSetting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        SiteSetting::firstOrCreate([], [
            'site_name' => 'Buda Ko Achar',
            'site_description' => 'Handcrafted, traditional Nepali achar made with love. Explore our range of authentic pickles.',
            'currency_code' => 'NPR',
            'currency_symbol' => 'NPR',
            'default_city' => 'Itahari',
            'default_province' => 'Koshi Province',
            'timezone' => 'Asia/Kathmandu',
            'brand_name' => 'Buda Ko Achar',
            'brand_display_mode' => 'image',
            'phone' => '982-7078809',
            'whatsapp_number' => '9827078809',
            'email' => 'info@budakoachar.com',
            'address' => 'Sangeet Chowk, Itahari, Koshi Province, Nepal',
            'meta_title' => 'Buda Ko Achar — Authentic Nepali Pickles',
            'meta_description' => 'Handcrafted, traditional Nepali achar made with love. Explore our range of authentic pickles.',
            'footer_description' => 'Handcrafted, traditional Nepali achar made with love. Authentic recipes passed down through generations, bringing the true taste of Nepal to your table.',
            'copyright_text' => 'Buda Ko Achar',
        ]);

        PaymentSetting::firstOrCreate([], [
            'digital_payment_account_name' => 'Budako Achar Udyog',
            'digital_payment_wallet_number' => '9800000000',
            'bank_name' => 'Global IME Bank',
            'bank_account_name' => 'Budako Achar Udyog',
            'bank_account_number' => '01234567890123',
            'bank_branch' => 'Biratnagar',
        ]);

        OrderSetting::firstOrCreate([], [
            'delivery_fee' => 100,
        ]);
    }
}
