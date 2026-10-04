<?php

namespace App\Policies;

use App\Models\ProjectExpense;
use App\Models\User;

class ProjectExpensePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isActive();
    }

    public function view(User $user, ProjectExpense $record): bool
    {
        return $user->isActive();
    }

    public function create(User $user): bool
    {
        return $user->isActive() && $user->isAdmin();
    }

    public function update(User $user, ProjectExpense $record): bool
    {
        return $user->isActive() && $user->isAdmin();
    }

    public function delete(User $user, ProjectExpense $record): bool
    {
        return $user->isActive() && $user->isAdmin();
    }
}
