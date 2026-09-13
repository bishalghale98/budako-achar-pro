<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->timestamp('cancelled_at')->nullable()->after('updated_at');
            $table->string('cancelled_by')->nullable()->after('cancelled_at');
            $table->foreign('cancelled_by')->references('id')->on('users')->nullOnDelete();
            $table->text('cancellation_reason')->nullable()->after('cancelled_by');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['cancelled_by']);
            $table->dropColumn(['cancelled_at', 'cancelled_by', 'cancellation_reason']);
        });
    }
};
