<?php

namespace App\Policies;

use App\Models\User;
use App\Models\WorkType;
use Illuminate\Auth\Access\HandlesAuthorization;

class WorkTypePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return true;
    }

    public function view(User $user, WorkType $workType)
    {
        return true;
    }

    public function create(User $user)
    {
        return $user->isAdmin();
    }

    public function update(User $user, WorkType $workType)
    {
        return $user->isAdmin();
    }

    public function delete(User $user, WorkType $workType)
    {
        return $user->isAdmin();
    }
}