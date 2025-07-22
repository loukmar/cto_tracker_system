<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            DepartmentSeeder::class,
            WorkTypeSeeder::class,
            StatusSeeder::class,
            UserSeeder::class,
        ]);
    }
}
