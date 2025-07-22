<?php

namespace App\Providers;

use App\Models\User;
use App\Models\WorkEntry;
use App\Models\Department;
use App\Models\WorkType;
use App\Models\Status;
use App\Policies\UserPolicy;
use App\Policies\WorkEntryPolicy;
use App\Policies\DepartmentPolicy;
use App\Policies\WorkTypePolicy;
use App\Policies\StatusPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        User::class => UserPolicy::class,
        WorkEntry::class => WorkEntryPolicy::class,
        Department::class => DepartmentPolicy::class,
        WorkType::class => WorkTypePolicy::class,
        Status::class => StatusPolicy::class,
    ];

    public function boot()
    {
        $this->registerPolicies();
    }
}