<?php

namespace App\Http\Controllers;

use App\Actions\Team\CreateMember;
use App\Actions\Team\SendMemberPasswordSetup;
use App\Actions\Team\UpdateMember;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Http\Requests\Team\StoreMemberRequest;
use App\Http\Requests\Team\TeamIndexRequest;
use App\Http\Requests\Team\UpdateMemberRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class TeamController extends Controller
{
    public function __construct(
        private readonly CreateMember $createMember,
        private readonly UpdateMember $updateMember,
        private readonly SendMemberPasswordSetup $sendMemberPasswordSetup,
    ) {}

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
                'manage' => $request->user()->can('update', $request->user()),
            ],
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', User::class);

        return Inertia::render('team/create');
    }

    public function store(StoreMemberRequest $request): RedirectResponse
    {
        try {
            $result = $this->createMember->execute($request->validated());
        } catch (Throwable $exception) {
            report($exception);

            return back()
                ->withInput()
                ->withErrors(['member' => 'The member account could not be created. Please try again.']);
        }

        $passwordSent = $result['passwordStatus'] === Password::RESET_LINK_SENT;
        $onboardingSent = $passwordSent && $result['verificationSent'];

        Inertia::flash('toast', [
            'type' => $onboardingSent ? 'success' : 'warning',
            'message' => $onboardingSent
                ? __('Member created and password setup email sent.')
                : __('Member created, but an onboarding email could not be sent. Use resend for password setup. The member can resend verification after signing in.'),
        ]);

        return to_route('team.index');
    }

    public function edit(User $member): Response
    {
        Gate::authorize('update', $member);

        return Inertia::render('team/edit', [
            'member' => $this->memberItem($member),
        ]);
    }

    public function update(UpdateMemberRequest $request, User $member): RedirectResponse
    {
        try {
            $this->updateMember->execute($member, $request->validated());
        } catch (ValidationException $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            report($exception);

            return back()
                ->withInput()
                ->withErrors(['member' => 'The member account could not be updated. Please try again.']);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Member updated.'),
        ]);

        return to_route('team.index');
    }

    public function suspend(User $member): RedirectResponse
    {
        Gate::authorize('suspend', $member);

        return $this->changeStatus($member, UserStatus::Suspended);
    }

    public function reactivate(User $member): RedirectResponse
    {
        Gate::authorize('reactivate', $member);

        return $this->changeStatus($member, UserStatus::Active);
    }

    public function resendPassword(User $member): RedirectResponse
    {
        Gate::authorize('resendPassword', $member);

        try {
            $status = $this->sendMemberPasswordSetup->execute($member);
        } catch (Throwable $exception) {
            report($exception);

            return back()->withErrors([
                'email' => 'The password setup email could not be sent. Please try again.',
            ]);
        }

        if ($status !== Password::RESET_LINK_SENT) {
            throw ValidationException::withMessages([
                'email' => __($status),
            ]);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Password setup email sent.'),
        ]);

        return to_route('team.index');
    }

    private function changeStatus(User $member, UserStatus $status): RedirectResponse
    {
        try {
            $this->updateMember->execute($member, ['status' => $status]);
        } catch (ValidationException $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            report($exception);

            return back()->withErrors([
                'status' => 'The member status could not be updated. Please try again.',
            ]);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $status === UserStatus::Active
                ? __('Member reactivated.')
                : __('Member suspended.'),
        ]);

        return to_route('team.index');
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

    /** @return array<string, int|string|null> */
    private function memberItem(User $member): array
    {
        return $this->listItem($member);
    }

    private function enumValue(UserRole|UserStatus|string $value): string
    {
        return is_string($value) ? $value : $value->value;
    }
}
