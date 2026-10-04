<?php

namespace Tests\Feature\Team;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class TeamReadTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get(route('team.index'))->assertRedirect(route('login'));
    }

    public function test_unverified_user_is_redirected_to_verification_notice(): void
    {
        $user = User::factory()->unverified()->create();

        $this->actingAs($user)
            ->get(route('team.index'))
            ->assertRedirect(route('verification.notice'));
    }

    public function test_suspended_user_is_logged_out_and_redirected_to_login(): void
    {
        $user = User::factory()->suspended()->create();

        $this->actingAs($user)
            ->get(route('team.index'))
            ->assertRedirect(route('login'));

        $this->assertGuest();
    }

    public function test_member_can_filter_the_team_directory(): void
    {
        $viewer = User::factory()->member()->create(['name' => 'Viewer']);
        User::factory()->admin()->create(['name' => 'Amina Director']);
        User::factory()->member()->suspended()->create(['name' => 'Suspended Editor']);

        $this->actingAs($viewer)
            ->get(route('team.index', ['role' => 'admin', 'search' => 'Amina']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('team/index')
                ->where('filters.search', 'Amina')
                ->where('filters.role', 'admin')
                ->where('filters.status', '')
                ->has('members.data', 1)
                ->where('members.data.0.name', 'Amina Director')
                ->where('can.create', false)
                ->missing('can.update')
                ->missing('can.suspend')
                ->missing('can.reactivate')
            );
    }

    public function test_status_filter_and_default_order_put_active_members_first_then_sort_by_name(): void
    {
        $viewer = User::factory()->member()->create(['name' => 'Viewer']);
        User::factory()->member()->suspended()->create(['name' => 'Aaron Suspended']);
        User::factory()->member()->create(['name' => 'Zara Active']);
        User::factory()->member()->create(['name' => 'Amina Active']);

        $this->actingAs($viewer)
            ->get(route('team.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('members.data.0.name', 'Amina Active')
                ->where('members.data.1.name', 'Viewer')
                ->where('members.data.2.name', 'Zara Active')
                ->where('members.data.3.name', 'Aaron Suspended')
                ->where('counts.all', 4)
                ->where('counts.active', 3)
                ->where('counts.suspended', 1)
            );

        $this->actingAs($viewer)
            ->get(route('team.index', ['status' => 'suspended']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.status', 'suspended')
                ->has('members.data', 1)
                ->where('members.data.0.name', 'Aaron Suspended')
            );
    }

    public function test_admin_receives_create_capability(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->get(route('team.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('can.create', true)
            );
    }

    #[DataProvider('invalidFilters')]
    public function test_invalid_filters_are_rejected(string $filter, string $value): void
    {
        $member = User::factory()->member()->create();

        $this->actingAs($member)
            ->get(route('team.index', [$filter => $value]))
            ->assertSessionHasErrors($filter);
    }

    /** @return array<string, array{string, string}> */
    public static function invalidFilters(): array
    {
        return [
            'invalid role' => ['role', 'owner'],
            'invalid status' => ['status', 'deleted'],
            'search longer than one hundred characters' => ['search', 'a'.str_repeat('b', 100)],
        ];
    }

    public function test_team_index_paginates_fifteen_rows_and_preserves_filters(): void
    {
        $viewer = User::factory()->member()->create([
            'name' => 'Team Viewer',
            'email' => 'viewer@example.test',
        ]);
        User::factory()->member()->count(15)->create([
            'job_title' => 'Editor',
            'status' => UserStatus::Active,
        ]);

        $this->actingAs($viewer)
            ->get(route('team.index', [
                'search' => 'example',
                'role' => 'member',
                'status' => 'active',
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('members.data', 15)
                ->where('members.per_page', 15)
                ->where('members.total', 16)
                ->where('members.next_page_url', fn (?string $url) => $url !== null
                    && str_contains($url, 'search=example')
                    && str_contains($url, 'role=member')
                    && str_contains($url, 'status=active'))
            );
    }

    public function test_team_props_expose_only_public_member_fields(): void
    {
        $viewer = User::factory()->member()->create();
        $member = User::factory()->withTwoFactor()->admin()->create([
            'name' => 'Public Profile',
            'email' => 'profile@example.test',
            'job_title' => 'Producer',
            'phone' => '+212 500 000 000',
            'role' => UserRole::Admin,
            'status' => UserStatus::Active,
            'remember_token' => 'remember-me',
        ]);

        $this->actingAs($viewer)
            ->get(route('team.index', ['search' => $member->email]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('members.data', 1)
                ->has('members.data.0', fn (Assert $item) => $item
                    ->where('id', $member->id)
                    ->where('name', 'Public Profile')
                    ->where('email', 'profile@example.test')
                    ->where('job_title', 'Producer')
                    ->where('phone', '+212 500 000 000')
                    ->where('role', 'admin')
                    ->where('status', 'active')
                    ->missing('password')
                    ->missing('remember_token')
                    ->missing('two_factor_secret')
                    ->missing('two_factor_recovery_codes')
                    ->missing('two_factor_confirmed_at')
                    ->missing('email_verified_at')
                    ->missing('created_at')
                    ->missing('updated_at')
                )
            );
    }
}
