<?php

namespace App\Models;

use App\Traits\HasCuid;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'digital_payment_account_name', 'digital_payment_wallet_number', 'digital_payment_qr_image',
    'bank_name', 'bank_account_name', 'bank_account_number', 'bank_branch', 'bank_qr_image',
])]
class PaymentSetting extends Model
{
    use HasCuid;

    protected $table = 'payment_settings';

    /**
     * Get the single settings record, creating it if it doesn't exist.
     */
    public static function instance(): static
    {
        return static::firstOrCreate([], []);
    }
}
