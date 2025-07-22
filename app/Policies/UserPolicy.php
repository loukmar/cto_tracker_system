<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->isAdmin() || $user->isCTO();
    }

    public function view(User $user, User $model)
    {
        // Users can view their own profile
        if ($user->id === $model->id) {
            return true;
        }

        // Admin and CTO can view all users
        if ($user->isAdmin() || $user->isCTO()) {
            return true;
        }

        // Department owners can view users in their department
        return $user->department_id === $model->department_id;
    }

    public function create(User $user)
    {
        return $user->isAdmin();
    }

    public function update(User $user, User $model)
    {
        // Users can update their own profile
        if ($user->id === $model->id) {
            return true;
        }

        // Only admins can update other users
        return $user->isAdmin();
    }

    public function delete(User $user, User $model)
    {
        // Cannot delete yourself
        if ($user->id === $model->id) {
            return false;
        }

        return $user->isAdmin();
    }
}
