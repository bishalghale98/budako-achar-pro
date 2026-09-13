<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_settings', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->decimal('delivery_fee', 10, 2)->default(100);
            $table->decimal('free_delivery_threshold', 10, 2)->nullable();
            $table->decimal('minimum_order_amount', 10, 2)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_settings');
    }
};
