<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Department;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        $itDept = Department::where('code', 'IT')->first();
        $hrDept = Department::where('code', 'HR')->first();
        $finDept = Department::where('code', 'FIN')->first();

        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'department_id' => $itDept->id,
                'is_active' => true,
            ],
            [
                'name' => 'CTO User',
                'email' => 'cto@example.com',
                'password' => Hash::make('password'),
                'role' => 'cto',
                'department_id' => $itDept->id,
                'is_active' => true,
            ],
            [
                'name' => 'IT Manager',
                'email' => 'it.manager@example.com',
                'password' => Hash::make('password'),
                'role' => 'department_owner',
                'department_id' => $itDept->id,
                'is_active' => true,
            ],
            [
                'name' => 'HR Manager',
                'email' => 'hr.manager@example.com',
                'password' => Hash::make('password'),
                'role' => 'department_owner',
                'department_id' => $hrDept->id,
                'is_active' => true,
            ],
            [
                'name' => 'Finance Manager',
                'email' => 'finance.manager@example.com',
                'password' => Hash::make('password'),
                'role' => 'department_owner',
                'department_id' => $finDept->id,
                'is_active' => true,
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}