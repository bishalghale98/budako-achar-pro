<?php

namespace App\Models;

use App\Traits\HasCuid;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'value'])]
class Counter extends Model
{
    use HasCuid;

    public function next(string $prefix = '', int $padding = 0): string
    {
        $this->increment('value');

        $value = $this->value;

        if ($padding > 0) {
            $value = str_pad($value, $padding, '0', STR_PAD_LEFT);
        }

        return $prefix . $value;
    }
}
