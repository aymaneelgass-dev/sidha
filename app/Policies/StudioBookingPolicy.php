<?php

namespace App\Policies;

use App\Models\StudioBooking;
use App\Models\User;

class StudioBookingPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isActive();
    }

    public function view(User $user, StudioBooking $booking): bool
    {
        return $user->isActive();
    }

    public function create(User $user): bool
    {
        return $user->isActive() && $user->isAdmin();
    }

    public function update(User $user, StudioBooking $booking): bool
    {
        return $user->isActive() && $user->isAdmin();
    }

    public function cancel(User $user, StudioBooking $booking): bool
    {
        return $user->isActive() && $user->isAdmin();
    }
}
