<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'color',
        'order',
        'is_final',
    ];

    protected $casts = [
        'is_final' => 'boolean',
    ];

    public function workEntries()
    {
        return $this->hasMany(WorkEntry::class);
    }
}