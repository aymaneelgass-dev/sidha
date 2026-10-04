<?php

namespace App\Policies;

use App\Models\Client;
use App\Models\User;

class ClientPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isActive();
    }

    public function view(User $user, Client $client): bool
    {
        return $user->isActive();
    }

    public function create(User $user): bool
    {
        return $user->isActive() && $user->isAdmin();
    }

    public function update(User $user, Client $client): bool
    {
        return $user->isActive() && $user->isAdmin();
    }

    public function archive(User $user, Client $client): bool
    {
        return $user->isActive() && $user->isAdmin();
    }

    public function reactivate(User $user, Client $client): bool
    {
        return $user->isActive() && $user->isAdmin();
    }
}
