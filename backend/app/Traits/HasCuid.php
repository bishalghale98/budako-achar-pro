<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;

trait HasCuid
{
    public static function bootHasCuid(): void
    {
        static::creating(function (Model $model) {
            if (empty($model->getKey())) {
                $model->setAttribute($model->getKeyName(), static::generateCuid());
            }
        });
    }

    public function getIncrementing(): bool
    {
        return false;
    }

    public function getKeyType(): string
    {
        return 'string';
    }

    public static function generateCuid(): string
    {
        $timestamp = (int) (microtime(true) * 1000);
        $random = bin2hex(random_bytes(12));

        return 'c' . dechex($timestamp) . $random;
    }
}
