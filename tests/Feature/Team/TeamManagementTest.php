<?php

namespace Tests\Feature\Team;

use App\Actions\Team\SendMemberPasswordSetup;
use App\Actions\Team\UpdateMember;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TeamManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    public function test_admin_can_open_create_and_edit_pages(): void
    {
        $admin = User::factory()->admin()->create();
        $member = User::factory()->member()->create([
            'name' => 'Yasmine Editor',
            'email' => 'yasmine@example.test',
            'job_title' => 'Video Editor',
            'phone' => '+212600000000',
        ]);

        $this->actingAs($admin)
            ->get(route('team.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('team/create'));

        $this->actingAs($admin)
            ->get(route('team.edit', $member))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('team/edit')
                ->where('member.id', $member->id)
                ->where('member.name', 'Yasmine Editor')
                ->where('member.email', 'yasmine@example.test')
                ->where('member.job_title', 'Video Editor')
                ->where('member.phone', '+212600000000')
                ->where('member.role', 'member')
                ->where('member.status', 'active')
                ->missing('member.password')
                ->missing('member.remember_token')
                ->missing('member.two_factor_secret')
                ->missing('member.two_factor_recovery_codes'));
    }

    public function test_admin_creates_member_and_sends_existing_security_notifications(): void
    {
        Notification::fake();
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->post(route('team.store'), [
            'name' => '  Yasmine Editor  ',
            'email' => '  YASMINE@example.test  ',
            'job_title' => '  Video Editor  ',
            'phone' => '  +212600000000  ',
            'role' => 'member',
        ]);

        $response->assertRedirect(route('team.index'));

        $member = User::where('email', 'yasmine@example.test')->firstOrFail();
        $this->assertSame('Yasmine Editor', $member->name);
        $this->assertSame('Video Editor', $member->job_title);
        $this->assertSame('+212600000000', $member->phone);
        $this->assertSame(UserRole::Member, $member->role);
        $this->assertSame(UserStatus::Active, $member->status);
        $this->assertNull($member->email_verified_at);
        $this->assertNotSame('', $member->password);
        $this->assertStringNotContainsString($member->password, $response->getContent());
        Notification::assertSentTo($member, ResetPassword::class);
        Notification::assertSentTo($member, VerifyEmail::class);
    }

    public function test_created_account_is_retained_with_warning_when_password_setup_is_not_sent(): void
    {
        Notification::fake();
        $admin = User::factory()->admin()->create();
        $this->app->bind(SendMemberPasswordSetup::class, fn () => new class extends SendMemberPasswordSetup
        {
            public function execute(User $member): string
            {
                return Password::RESET_THROTTLED;
            }
        });

        $response = $this->actingAs($admin)->post(route('team.store'), [
            'name' => 'Retained Member',
            'email' => 'retained@example.test',
            'role' => 'member',
        ]);

        $response
            ->assertRedirect(route('team.index'))
            ->assertInertiaFlash('toast.type', 'warning');
        $this->assertDatabaseHas('users', [
            'email' => 'retained@example.test',
            'status' => UserStatus::Active->value,
        ]);
    }

    public function test_member_cannot_call_any_team_mutation_route(): void
    {
        Notification::fake();
        $viewer = User::factory()->member()->create();
        $member = User::factory()->member()->create();

        $this->actingAs($viewer)->get(route('team.create'))->assertForbidden();
        $this->actingAs($viewer)->post(route('team.store'), [
            'name' => 'Denied',
            'email' => 'denied@example.test',
            'role' => 'member',
        ])->assertForbidden();
        $this->actingAs($viewer)->get(route('team.edit', $member))->assertForbidden();
        $this->actingAs($viewer)->put(route('team.update', $member), [
            'name' => 'Denied',
            'email' => $member->email,
            'role' => 'admin',
        ])->assertForbidden();
        $this->actingAs($viewer)->patch(route('team.suspend', $member))->assertForbidden();
        $this->actingAs($viewer)->patch(route('team.reactivate', $member))->assertForbidden();
        $this->actingAs($viewer)->post(route('team.resend-password', $member))->assertForbidden();

        $this->assertSame(UserRole::Member, $member->fresh()->role);
        $this->assertSame(UserStatus::Active, $member->fresh()->status);
        Notification::assertNothingSent();
    }

    public function test_admin_updates_member_profile_and_role(): void
    {
        $admin = User::factory()->admin()->create();
        $member = User::factory()->member()->create([
            'name' => 'Old Name',
            'email' => 'old@example.test',
        ]);

        $this->actingAs($admin)->put(route('team.update', $member), [
            'name' => '  New Name  ',
            'email' => '  NEW@example.test  ',
            'job_title' => '  Producer  ',
            'phone' => '',
            'role' => 'admin',
        ])->assertRedirect(route('team.index'));

        $member->refresh();
        $this->assertSame('New Name', $member->name);
        $this->assertSame('new@example.test', $member->email);
        $this->assertSame('Producer', $member->job_title);
        $this->assertNull($member->phone);
        $this->assertSame(UserRole::Admin, $member->role);
    }

    public function test_changing_a_member_email_requires_verification_again(): void
    {
        $admin = User::factory()->admin()->create();
        $member = User::factory()->member()->create([
            'email' => 'old@example.test',
            'email_verified_at' => now(),
        ]);

        $this->actingAs($admin)->put(route('team.update', $member), [
            'name' => $member->name,
            'email' => 'new@example.test',
            'role' => 'member',
        ])->assertRedirect(route('team.index'));

        $member->refresh();
        $this->assertSame('new@example.test', $member->email);
        $this->assertNull($member->email_verified_at);
    }

    public function test_team_requests_reject_duplicate_email_and_invalid_role(): void
    {
        $admin = User::factory()->admin()->create();
        $existing = User::factory()->create(['email' => 'existing@example.test']);
        $member = User::factory()->member()->create(['email' => 'member@example.test']);

        $this->actingAs($admin)->post(route('team.store'), [
            'name' => 'Duplicate',
            'email' => $existing->email,
            'role' => 'owner',
        ])->assertSessionHasErrors(['email', 'role']);

        $this->actingAs($admin)->put(route('team.update', $member), [
            'name' => 'Duplicate',
            'email' => $existing->email,
            'role' => 'owner',
        ])->assertSessionHasErrors(['email', 'role']);

        $this->actingAs($admin)->put(route('team.update', $member), [
            'name' => 'Same Email',
            'email' => $member->email,
            'role' => 'member',
        ])->assertRedirect(route('team.index'));
    }

    public function test_admin_cannot_suspend_self(): void
    {
        $admin = User::factory()->admin()->create();
        User::factory()->admin()->create();

        $this->actingAs($admin)
            ->from(route('team.index'))
            ->patch(route('team.suspend', $admin))
            ->assertRedirect(route('team.index'))
            ->assertSessionHasErrors(['status']);

        $this->assertSame(UserStatus::Active, $admin->fresh()->status);
    }

    public function test_admin_cannot_change_own_role(): void
    {
        $admin = User::factory()->admin()->create();
        User::factory()->admin()->create();

        $this->actingAs($admin)
            ->from(route('team.edit', $admin))
            ->put(route('team.update', $admin), [
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => 'member',
            ])
            ->assertRedirect(route('team.edit', $admin))
            ->assertSessionHasErrors(['role']);

        $this->assertSame(UserRole::Admin, $admin->fresh()->role);
    }

    public function test_last_active_admin_cannot_be_demoted_or_suspended(): void
    {
        $lastActiveAdmin = User::factory()->admin()->create();
        $suspendedAdmin = User::factory()->admin()->suspended()->create();
        $this->actingAs($suspendedAdmin);

        try {
            app(UpdateMember::class)->execute($lastActiveAdmin, [
                'role' => UserRole::Member,
            ]);
            $this->fail('The last active Admin was demoted.');
        } catch (ValidationException $exception) {
            $this->assertArrayHasKey('role', $exception->errors());
        }

        try {
            app(UpdateMember::class)->execute($lastActiveAdmin, [
                'status' => UserStatus::Suspended,
            ]);
            $this->fail('The last active Admin was suspended.');
        } catch (ValidationException $exception) {
            $this->assertArrayHasKey('status', $exception->errors());
        }

        $this->assertSame(UserRole::Admin, $lastActiveAdmin->fresh()->role);
        $this->assertSame(UserStatus::Active, $lastActiveAdmin->fresh()->status);
    }

    public function test_admin_can_demote_another_admin_when_an_active_admin_remains(): void
    {
        $admin = User::factory()->admin()->create();
        $otherAdmin = User::factory()->admin()->create();

        $this->actingAs($admin)->put(route('team.update', $otherAdmin), [
            'name' => $otherAdmin->name,
            'email' => $otherAdmin->email,
            'role' => 'member',
        ])->assertRedirect(route('team.index'));

        $this->assertSame(UserRole::Member, $otherAdmin->fresh()->role);
        $this->assertSame(UserRole::Admin, $admin->fresh()->role);
    }

    public function test_admin_can_suspend_and_reactivate_another_member(): void
    {
        $admin = User::factory()->admin()->create();
        $member = User::factory()->member()->create();

        $this->actingAs($admin)
            ->patch(route('team.suspend', $member))
            ->assertRedirect(route('team.index'));
        $this->assertSame(UserStatus::Suspended, $member->fresh()->status);

        $this->actingAs($admin)
            ->patch(route('team.reactivate', $member))
            ->assertRedirect(route('team.index'));
        $this->assertSame(UserStatus::Active, $member->fresh()->status);
    }

    public function test_admin_can_resend_password_setup_notification(): void
    {
        Notification::fake();
        $admin = User::factory()->admin()->create();
        $member = User::factory()->member()->unverified()->create();

        $this->actingAs($admin)
            ->post(route('team.resend-password', $member))
            ->assertRedirect(route('team.index'));

        Notification::assertSentTo($member, ResetPassword::class);
    }

    public function test_password_setup_resend_reports_broker_failure_as_validation_error(): void
    {
        $admin = User::factory()->admin()->create();
        $member = User::factory()->member()->create();
        $this->app->bind(SendMemberPasswordSetup::class, fn () => new class extends SendMemberPasswordSetup
        {
            public function execute(User $member): string
            {
                return Password::INVALID_USER;
            }
        });

        $this->actingAs($admin)
            ->from(route('team.index'))
            ->post(route('team.resend-password', $member))
            ->assertRedirect(route('team.index'))
            ->assertSessionHasErrors([
                'email' => __(Password::INVALID_USER),
            ]);
    }

    public function test_password_setup_resend_is_throttled_after_three_attempts_per_minute(): void
    {
        Notification::fake();
        $admin = User::factory()->admin()->create();
        $member = User::factory()->member()->create();
        $this->app->bind(SendMemberPasswordSetup::class, fn () => new class extends SendMemberPasswordSetup
        {
            public function execute(User $member): string
            {
                return Password::RESET_LINK_SENT;
            }
        });

        foreach (range(1, 3) as $attempt) {
            $this->actingAs($admin)
                ->post(route('team.resend-password', $member))
                ->assertRedirect(route('team.index'));
        }

        $this->actingAs($admin)
            ->post(route('team.resend-password', $member))
            ->assertTooManyRequests();

    }
}
