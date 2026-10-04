<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InternalAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_registration_is_disabled(): void
    {
        $this->get('/register')->assertNotFound();
        $this->post('/register', [
            'name' => 'Public User',
            'email' => 'public@example.test',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])->assertNotFound();
    }

    public function test_suspended_user_with_existing_session_is_logged_out(): void
    {
        $user = User::factory()->suspended()->create();

        $this->actingAs($user)->get(route('dashboard'))->assertRedirect(route('login'));
        $this->assertGuest();
    }

    public function test_suspended_user_is_checked_before_email_verification(): void
    {
        $user = User::factory()->suspended()->unverified()->create();

        $this->actingAs($user)->get(route('dashboard'))->assertRedirect(route('login'));
        $this->assertGuest();
    }

    public function test_suspended_user_cannot_reach_profile_settings(): void
    {
        $user = User::factory()->suspended()->create();

        $this->actingAs($user)->get(route('profile.edit'))->assertRedirect(route('login'));
        $this->assertGuest();
    }
}
