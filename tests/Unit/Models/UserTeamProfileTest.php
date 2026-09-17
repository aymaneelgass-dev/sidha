<?php

namespace Tests\Unit\Models;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTeamProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_defaults_to_active_member(): void
    {
        $user = User::factory()->create();

        $this->assertSame(UserRole::Member, $user->role);
        $this->assertSame(UserStatus::Active, $user->status);
        $this->assertFalse($user->isAdmin());
        $this->assertTrue($user->isActive());
    }

    public function test_admin_and_suspended_factory_states_are_explicit(): void
    {
        $admin = User::factory()->admin()->create();
        $suspended = User::factory()->suspended()->create();

        $this->assertTrue($admin->isAdmin());
        $this->assertFalse($suspended->isActive());
    }
}
