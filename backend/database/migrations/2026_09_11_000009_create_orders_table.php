<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('order_number')->unique();
            $table->string('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            $table->string('cart_id');
            $table->foreign('cart_id')->references('id')->on('carts')->restrictOnDelete();

            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('customer_email');

            $table->string('address_line');
            $table->string('city');
            $table->string('province');
            $table->string('delivery_notes')->nullable();

            $table->string('status')->default('pending');

            $table->decimal('subtotal', 10, 2);
            $table->decimal('delivery_fee', 10, 2);
            $table->decimal('total', 10, 2);

            $table->timestamps();

            $table->index('status');
            $table->index('user_id');
            $table->index('order_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
