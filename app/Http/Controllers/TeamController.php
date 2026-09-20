<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Http\Requests\Team\TeamIndexRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    public function index(TeamIndexRequest $request): Response
    {
        Gate::authorize('viewAny', User::class);

        $filters = $request->validated();
        $search = $filters['search'] ?? null;
        $role = $filters['role'] ?? null;
        $status = $filters['status'] ?? null;

        $members = User::query()
            ->select(['id', 'name', 'email', 'job_title', 'phone', 'role', 'status'])
            ->when($search !== null && $search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($role, fn (Builder $query, string $role) => $query->where('role', $role))
            ->when($status, fn (Builder $query, string $status) => $query->where('status', $status))
            ->orderByRaw('CASE WHEN status = ? THEN 0 ELSE 1 END', [UserStatus::Active->value])
            ->orderBy('name')
            ->orderBy('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (User $member): array => $this->listItem($member));

        $statusCounts = User::query()
            ->selectRaw('status, count(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        return Inertia::render('team/index', [
            'members' => $members,
            'filters' => [
                'search' => $search ?? '',
                'role' => $role ?? '',
                'status' => $status ?? '',
            ],
            'counts' => [
                'all' => $statusCounts->sum(),
                'active' => (int) ($statusCounts[UserStatus::Active->value] ?? 0),
                'suspended' => (int) ($statusCounts[UserStatus::Suspended->value] ?? 0),
            ],
            'can' => [
                'create' => $request->user()->can('create', User::class),
            ],
        ]);
    }

    /** @return array<string, int|string|null> */
    private function listItem(User $member): array
    {
        return [
            'id' => $member->id,
            'name' => $member->name,
            'email' => $member->email,
            'job_title' => $member->job_title,
            'phone' => $member->phone,
            'role' => $this->enumValue($member->role),
            'status' => $this->enumValue($member->status),
        ];
    }

    private function enumValue(UserRole|UserStatus|string $value): string
    {
        return is_string($value) ? $value : $value->value;
    }
}
