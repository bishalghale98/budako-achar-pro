<?php

namespace App\Models;

use App\Traits\HasCuid;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'delivery_fee', 'free_delivery_threshold', 'minimum_order_amount',
])]
class OrderSetting extends Model
{
    use HasCuid;

    protected $table = 'order_settings';

    /**
     * Get the single settings record, creating it if it doesn't exist.
     */
    public static function instance(): static
    {
        return static::firstOrCreate([], [
            'delivery_fee' => (float) config('order.delivery_fee', 100),
        ]);
    }

    /**
     * Centralized delivery fee accessor. Falls back to config if table row missing.
     */
    public static function getDeliveryFee(): float
    {
        return (float) static::instance()->delivery_fee;
    }
}
