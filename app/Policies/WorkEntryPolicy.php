<?php

namespace App\Policies;

use App\Models\User;
use App\Models\WorkEntry;
use Illuminate\Auth\Access\HandlesAuthorization;

class WorkEntryPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return true;
    }

    public function view(User $user, WorkEntry $workEntry)
    {
        // Admin and CTO can view all entries
        if ($user->canViewAllDepartments()) {
            return true;
        }

        // Users can view entries from their department
        return $user->department_id === $workEntry->department_id;
    }

    public function create(User $user)
    {
        return true;
    }

    public function update(User $user, WorkEntry $workEntry)
    {
        // Admin can update any entry
        if ($user->isAdmin()) {
            return true;
        }

        // Users can update their own entries
        return $user->id === $workEntry->user_id;
    }

    public function delete(User $user, WorkEntry $workEntry)
    {
        // Admin can delete any entry
        if ($user->isAdmin()) {
            return true;
        }

        // Users can delete their own entries
        return $user->id === $workEntry->user_id;
    }
}