<?php

namespace Tests\Unit\Policies;

use App\Models\User;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_active_member_can_read_but_cannot_mutate_team(): void
    {
        $member = User::factory()->member()->create();
        $teamMember = User::factory()->member()->create();
        $policy = new UserPolicy;

        $this->assertTrue($policy->viewAny($member));
        $this->assertTrue($policy->view($member, $teamMember));
        $this->assertFalse($policy->create($member));
        $this->assertFalse($policy->update($member, $teamMember));
        $this->assertFalse($policy->suspend($member, $teamMember));
        $this->assertFalse($policy->reactivate($member, $teamMember));
        $this->assertFalse($policy->resendPassword($member, $teamMember));
    }

    public function test_active_admin_receives_every_team_capability(): void
    {
        $admin = User::factory()->admin()->create();
        $teamMember = User::factory()->member()->create();
        $policy = new UserPolicy;

        $this->assertTrue($policy->viewAny($admin));
        $this->assertTrue($policy->view($admin, $teamMember));
        $this->assertTrue($policy->create($admin));
        $this->assertTrue($policy->update($admin, $teamMember));
        $this->assertTrue($policy->suspend($admin, $teamMember));
        $this->assertTrue($policy->reactivate($admin, $teamMember));
        $this->assertTrue($policy->resendPassword($admin, $teamMember));
    }

    public function test_suspended_admin_receives_no_team_capabilities(): void
    {
        $admin = User::factory()->admin()->suspended()->create();
        $teamMember = User::factory()->member()->create();
        $policy = new UserPolicy;

        $this->assertFalse($policy->viewAny($admin));
        $this->assertFalse($policy->view($admin, $teamMember));
        $this->assertFalse($policy->create($admin));
        $this->assertFalse($policy->update($admin, $teamMember));
        $this->assertFalse($policy->suspend($admin, $teamMember));
        $this->assertFalse($policy->reactivate($admin, $teamMember));
        $this->assertFalse($policy->resendPassword($admin, $teamMember));
    }
}
