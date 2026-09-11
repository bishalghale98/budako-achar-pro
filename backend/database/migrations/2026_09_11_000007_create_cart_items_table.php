<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cart_items', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('cart_id');
            $table->foreign('cart_id')->references('id')->on('carts')->cascadeOnDelete();
            $table->string('product_id');
            $table->foreign('product_id')->references('id')->on('products')->restrictOnDelete();
            $table->string('product_variant_id');
            $table->foreign('product_variant_id')->references('id')->on('product_variants')->restrictOnDelete();
            $table->unsignedInteger('quantity')->default(1);
            $table->decimal('unit_price', 10, 2);
            $table->timestamps();

            $table->unique(['cart_id', 'product_variant_id']);
            $table->index('cart_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
