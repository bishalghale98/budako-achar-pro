<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_settings', function (Blueprint $table) {
            $table->string('id')->primary();

            // Digital Payment
            $table->string('digital_payment_account_name', 255)->nullable();
            $table->string('digital_payment_wallet_number', 30)->nullable();
            $table->string('digital_payment_qr_image', 500)->nullable();

            // Bank Transfer
            $table->string('bank_name', 255)->nullable();
            $table->string('bank_account_name', 255)->nullable();
            $table->string('bank_account_number', 50)->nullable();
            $table->string('bank_branch', 100)->nullable();
            $table->string('bank_qr_image', 500)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_settings');
    }
};
