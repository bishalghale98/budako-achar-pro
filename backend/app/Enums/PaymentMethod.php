<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case Cod = 'cod';
    case Digital = 'digital';
    case Bank = 'bank';

    public function label(): string
    {
        return match ($this) {
            self::Cod => 'Cash on Delivery',
            self::Digital => 'eSewa / Khalti / QR Payment',
            self::Bank => 'Bank Transfer',
        };
    }

    public function requiresProof(): bool
    {
        return $this !== self::Cod;
    }
}
