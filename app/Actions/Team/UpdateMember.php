<?php

namespace App\Actions\Team;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class UpdateMember
{
    /** @param array<string, mixed> $data */
    public function execute(User $member, array $data): User
    {
        return DB::transaction(function () use ($member, $data): User {
            $nextRole = $this->roleFrom($data['role'] ?? $member->role);
            $nextStatus = $this->statusFrom($data['status'] ?? $member->status);
            $roleChanges = $nextRole !== $member->role;
            $willSuspend = $member->status === UserStatus::Active
                && $nextStatus === UserStatus::Suspended;

            if ($member->id === Auth::id() && $roleChanges) {
                throw ValidationException::withMessages([
                    'role' => 'You cannot change your own role.',
                ]);
            }

            if ($member->id === Auth::id() && $willSuspend) {
                throw ValidationException::withMessages([
                    'status' => 'You cannot suspend your own account.',
                ]);
            }

            $removesActiveAdmin = $member->role === UserRole::Admin
                && $member->status === UserStatus::Active
                && ($nextRole !== UserRole::Admin || $nextStatus !== UserStatus::Active);

            if ($removesActiveAdmin) {
                $activeAdmins = User::query()
                    ->where('role', UserRole::Admin->value)
                    ->where('status', UserStatus::Active->value)
                    ->lockForUpdate()
                    ->get(['id']);

                if (count($activeAdmins) <= 1) {
                    $field = $nextRole !== UserRole::Admin ? 'role' : 'status';

                    throw ValidationException::withMessages([
                        $field => 'At least one active Admin must remain.',
                    ]);
                }
            }

            $member->fill($data);

            if ($member->isDirty('email')) {
                $member->email_verified_at = null;
            }

            $member->save();

            return $member->refresh();
        });
    }

    private function roleFrom(mixed $role): UserRole
    {
        return $role instanceof UserRole ? $role : UserRole::from((string) $role);
    }

    private function statusFrom(mixed $status): UserStatus
    {
        return $status instanceof UserStatus ? $status : UserStatus::from((string) $status);
    }
}
