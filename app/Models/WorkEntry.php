<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'department_id',
        'work_type_id',
        'status_id',
        'work_date',
        'title',
        'description',
        'hours_spent',
        'kpi_metrics',
        'location',
        'tags',
    ];

    protected $casts = [
        'work_date' => 'date',
        'kpi_metrics' => 'array',
        'tags' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function workType()
    {
        return $this->belongsTo(WorkType::class);
    }

    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    public function attachments()
    {
        return $this->hasMany(WorkEntryAttachment::class);
    }

    // Add this scope if it doesn't exist
    public function scopeForUser($query, User $user)
    {
        if ($user->canViewAllDepartments()) {
            return $query;
        }

        return $query->where('department_id', $user->department_id);
    }

    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('work_date', [$startDate, $endDate]);
    }
}
