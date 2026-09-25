<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isActive();
    }

    public function view(User $user, Project $record): bool
    {
        return $user->isActive();
    }

    public function create(User $user): bool
    {
        return $user->isActive() && $user->isAdmin();
    }

    public function update(User $user, Project $record): bool
    {
        return $user->isActive() && $user->isAdmin();
    }

    public function archive(User $user, Project $record): bool
    {
        return $user->isActive() && $user->isAdmin();
    }
}
