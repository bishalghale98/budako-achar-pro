<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Bishal Ghale',
            'email' => 'bishal@example.com',
            'password' => Hash::make('password'),
        ]);

        User::create([
            'name' => 'Aayush Sharma',
            'email' => 'aayush@example.com',
            'password' => Hash::make('password'),
        ]);

        User::create([
            'name' => 'Puja Thapa',
            'email' => 'puja@example.com',
            'password' => Hash::make('password'),
        ]);
    }
}
