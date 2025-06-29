<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $joel = User::create([
            'name' => 'Joel Cabrera',
            'email' => 'joel@example.com',
            'status' => 'activo',
            'password' => bcrypt('joel123'),
        ]);

        $pedro = User::create([
            'name' => 'Pedro Perez',
            'email' => 'pedro@example.com',
            'status' => 'inactivo',
            'password' => bcrypt('pedro123'),
        ]);

        $saul = User::create([
            'name' => 'Saul Gonzales',
            'email' => 'saul@example.com',
            'status' => 'pendiente',
            'password' => bcrypt('saul123'),
        ]);

        $joel->assignRole('admin');
        $pedro->assignRole('premium');
        $saul->assignRole('guest');
    }
}
