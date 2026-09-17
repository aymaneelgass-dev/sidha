<?php

namespace Tests\Unit\Policies;

use App\Models\Client;
use App\Models\User;
use App\Policies\ClientPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_active_member_can_read_but_cannot_mutate_clients(): void
    {
        $member = User::factory()->member()->create();
        $client = Client::factory()->create();
        $policy = new ClientPolicy;

        $this->assertTrue($policy->viewAny($member));
        $this->assertTrue($policy->view($member, $client));
        $this->assertFalse($policy->create($member));
        $this->assertFalse($policy->update($member, $client));
        $this->assertFalse($policy->archive($member, $client));
        $this->assertFalse($policy->reactivate($member, $client));
    }

    public function test_active_admin_receives_every_client_capability(): void
    {
        $admin = User::factory()->admin()->create();
        $client = Client::factory()->create();
        $policy = new ClientPolicy;

        $this->assertTrue($policy->viewAny($admin));
        $this->assertTrue($policy->view($admin, $client));
        $this->assertTrue($policy->create($admin));
        $this->assertTrue($policy->update($admin, $client));
        $this->assertTrue($policy->archive($admin, $client));
        $this->assertTrue($policy->reactivate($admin, $client));
    }

    public function test_suspended_admin_receives_no_client_capabilities(): void
    {
        $admin = User::factory()->admin()->suspended()->create();
        $client = Client::factory()->create();
        $policy = new ClientPolicy;

        $this->assertFalse($policy->viewAny($admin));
        $this->assertFalse($policy->view($admin, $client));
        $this->assertFalse($policy->create($admin));
        $this->assertFalse($policy->update($admin, $client));
        $this->assertFalse($policy->archive($admin, $client));
        $this->assertFalse($policy->reactivate($admin, $client));
    }
}
