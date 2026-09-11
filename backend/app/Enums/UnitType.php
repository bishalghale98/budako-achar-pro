<?php

namespace App\Enums;

enum UnitType: string
{
    case Gram = 'g';
    case Kilogram = 'kg';

    public function label(): string
    {
        return match ($this) {
            self::Gram => 'Gram',
            self::Kilogram => 'Kilogram',
        };
    }
}
