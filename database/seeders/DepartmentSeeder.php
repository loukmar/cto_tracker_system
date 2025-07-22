<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    public function run()
    {
        $departments = [
            [
                'name' => 'IT Department',
                'code' => 'IT',
                'description' => 'Information Technology Department',
                'color' => '#3B82F6',
                'is_active' => true,
            ],
            [
                'name' => 'HR Department',
                'code' => 'HR',
                'description' => 'Human Resources Department',
                'color' => '#10B981',
                'is_active' => true,
            ],
            [
                'name' => 'Finance Department',
                'code' => 'FIN',
                'description' => 'Finance and Accounting Department',
                'color' => '#F59E0B',
                'is_active' => true,
            ],
            [
                'name' => 'Marketing Department',
                'code' => 'MKT',
                'description' => 'Marketing and Communications Department',
                'color' => '#EF4444',
                'is_active' => true,
            ],
            [
                'name' => 'Operations Department',
                'code' => 'OPS',
                'description' => 'Operations and Logistics Department',
                'color' => '#8B5CF6',
                'is_active' => true,
            ],
        ];

        foreach ($departments as $department) {
            Department::create($department);
        }
    }
}
