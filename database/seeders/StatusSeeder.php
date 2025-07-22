<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Status;

class StatusSeeder extends Seeder
{
    public function run()
    {
        $statuses = [
            [
                'name' => 'Pending',
                'color' => '#6B7280',
                'order' => 1,
                'is_final' => false,
            ],
            [
                'name' => 'In Progress',
                'color' => '#3B82F6',
                'order' => 2,
                'is_final' => false,
            ],
            [
                'name' => 'Review',
                'color' => '#F59E0B',
                'order' => 3,
                'is_final' => false,
            ],
            [
                'name' => 'Completed',
                'color' => '#10B981',
                'order' => 4,
                'is_final' => true,
            ],
            [
                'name' => 'Cancelled',
                'color' => '#EF4444',
                'order' => 5,
                'is_final' => true,
            ],
            [
                'name' => 'On Hold',
                'color' => '#8B5CF6',
                'order' => 6,
                'is_final' => false,
            ],
        ];

        foreach ($statuses as $status) {
            Status::create($status);
        }
    }
}