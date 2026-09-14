<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_images', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('page_id');
            $table->string('image_url');
            $table->string('original_name')->nullable();
            $table->string('mime_type')->nullable();
            $table->unsignedInteger('size')->nullable();
            $table->timestamps();

            $table->foreign('page_id')->references('id')->on('pages')->onDelete('cascade');
            $table->index('page_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_images');
    }
};
