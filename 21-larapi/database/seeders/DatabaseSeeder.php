<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Pet;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        //User::factory(20)->create();
        // User::factory()->create([
        //     'name' => 'Test User',
        \App\Models\User::create([
        'name' => 'Jhon wick',
        'email' => 'johnw@mail.com',
        'password' => Hash::make('admin'), // Esta será tu clave
        //     'email' => 'test@example.com',
        // ]);
    ]);
        Pet::factory(50)->create();

    }
}
