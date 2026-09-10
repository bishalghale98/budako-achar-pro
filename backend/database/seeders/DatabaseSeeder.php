<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => Role::Admin,
        ]);

        User::factory()->create([
            'name' => 'Customer User',
            'email' => 'customer@example.com',
            'role' => Role::Customer,
        ]);
    }
}
