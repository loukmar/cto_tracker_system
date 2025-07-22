<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkEntryAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'work_entry_id',
        'file_name',
        'file_path',
        'file_size',
        'mime_type',
    ];

    protected $casts = [
        'file_size' => 'integer',
    ];

    public function workEntry()
    {
        return $this->belongsTo(WorkEntry::class);
    }

    // Accessor to get full URL
    public function getFullUrlAttribute()
    {
        return asset('storage/' . $this->file_path);
    }

    // Format file size for display
    public function getFormattedSizeAttribute()
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];

        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }
}
