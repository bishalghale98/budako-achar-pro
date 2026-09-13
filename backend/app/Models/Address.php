<?php

namespace App\Models;

use App\Traits\HasCuid;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'user_id', 'label', 'address_line', 'area',
    'city', 'province', 'phone', 'delivery_notes', 'is_default',
])]
class Address extends Model
{
    use HasCuid, HasFactory;

    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function setAsDefault(): void
    {
        $this->user->addresses()->where('id', '!=', $this->id)->update(['is_default' => false]);
        $this->update(['is_default' => true]);
    }

    protected static function booted(): void
    {
        static::deleted(function (Address $address) {
            if ($address->is_default) {
                $nextDefault = $address->user->addresses()->first();
                if ($nextDefault) {
                    $nextDefault->update(['is_default' => true]);
                }
            }
        });
    }
}
