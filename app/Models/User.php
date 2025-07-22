<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'department_id',
        'phone',
        'avatar',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function workEntries()
    {
        return $this->hasMany(WorkEntry::class);
    }

    // Make sure these methods exist
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isCTO()
    {
        return $this->role === 'cto';
    }

    public function isDepartmentOwner()
    {
        return $this->role === 'department_owner';
    }

    public function canViewAllDepartments()
    {
        return in_array($this->role, ['admin', 'cto']);
    }
}
