<?php

namespace Database\Factories;

use App\Enums\CartStatus;
use App\Models\Cart;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CartFactory extends Factory
{
    protected $model = Cart::class;

    public function definition(): array
    {
        return [
            'user_id' => null,
            'cart_token' => Str::random(64),
            'status' => CartStatus::Active,
        ];
    }
}
