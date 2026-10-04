<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isActive();
    }

    public function view(User $user, User $teamMember): bool
    {
        return $user->isActive();
    }

    public function create(User $user): bool
    {
        return $user->isActive() && $user->isAdmin();
    }

    public function update(User $user, User $teamMember): bool
    {
        return $user->isActive() && $user->isAdmin();
    }

    public function suspend(User $user, User $teamMember): bool
    {
        return $user->isActive() && $user->isAdmin();
    }

    public function reactivate(User $user, User $teamMember): bool
    {
        return $user->isActive() && $user->isAdmin();
    }

    public function resendPassword(User $user, User $teamMember): bool
    {
        return $user->isActive() && $user->isAdmin();
    }
}
