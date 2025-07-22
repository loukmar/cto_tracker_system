<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class WorkEntriesExport implements FromCollection, WithHeadings, WithMapping
{
    protected $entries;

    public function __construct($entries)
    {
        $this->entries = $entries;
    }

    public function collection()
    {
        return $this->entries;
    }

    public function headings(): array
    {
        return [
            'Date',
            'Title',
            'Department',
            'User',
            'Work Type',
            'Status',
            'Hours',
            'Location',
            'Description',
        ];
    }

    public function map($entry): array
    {
        return [
            $entry->work_date->format('Y-m-d'),
            $entry->title,
            $entry->department->name,
            $entry->user->name,
            $entry->workType->name,
            $entry->status->name,
            $entry->hours_spent,
            $entry->location,
            $entry->description,
        ];
    }
}