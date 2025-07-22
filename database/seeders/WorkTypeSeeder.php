<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\WorkType;

class WorkTypeSeeder extends Seeder
{
    public function run()
    {
        $workTypes = [
            [
                'name' => 'Development',
                'icon' => '💻',
                'color' => '#3B82F6',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Meeting',
                'icon' => '🤝',
                'color' => '#10B981',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Documentation',
                'icon' => '📄',
                'color' => '#F59E0B',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Research',
                'icon' => '🔍',
                'color' => '#8B5CF6',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Training',
                'icon' => '📚',
                'color' => '#EC4899',
                'order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Support',
                'icon' => '🛠️',
                'color' => '#14B8A6',
                'order' => 6,
                'is_active' => true,
            ],
            [
                'name' => 'Planning',
                'icon' => '📋',
                'color' => '#F97316',
                'order' => 7,
                'is_active' => true,
            ],
            [
                'name' => 'Review',
                'icon' => '✅',
                'color' => '#84CC16',
                'order' => 8,
                'is_active' => true,
            ],
        ];

        foreach ($workTypes as $workType) {
            WorkType::create($workType);
        }
    }
}
