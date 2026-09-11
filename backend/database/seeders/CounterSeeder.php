<?php

namespace Database\Seeders;

use App\Models\Counter;
use Illuminate\Database\Seeder;

class CounterSeeder extends Seeder
{
    public function run(): void
    {
        Counter::create([
            'name' => 'order_number',
            'value' => 1000,
        ]);
    }
}
