<?php

namespace Tests\Feature\Console;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class MakeAdminCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_command_promotes_existing_user_to_active_admin(): void
    {
        $user = User::factory()->member()->suspended()->create([
            'email' => 'member@example.test',
        ]);

        $this->artisan('sidha:make-admin', ['email' => 'MEMBER@EXAMPLE.TEST'])
            ->assertSuccessful();

        $this->assertSame(UserRole::Admin, $user->refresh()->role);
        $this->assertSame(UserStatus::Active, $user->status);
    }

    public function test_command_refuses_an_invalid_email(): void
    {
        $this->artisan('sidha:make-admin', ['email' => 'not-an-email'])
            ->assertFailed();

        $this->assertDatabaseCount('users', 0);
    }

    public function test_command_creates_a_verified_active_admin_without_disclosing_secrets(): void
    {
        $email = 'first.admin@example.test';
        $password = 'BootstrapPassword123!';
        $resetToken = 'known-reset-token-that-must-not-be-disclosed';

        DB::table('password_reset_tokens')->insert([
            'email' => $email,
            'token' => $resetToken,
            'created_at' => now(),
        ]);

        $this->artisan('sidha:make-admin', ['email' => 'FIRST.ADMIN@EXAMPLE.TEST'])
            ->expectsQuestion('Name', 'First Admin')
            ->expectsQuestion('Password', $password)
            ->expectsQuestion('Confirm password', $password)
            ->doesntExpectOutputToContain($password)
            ->doesntExpectOutputToContain('$2y$')
            ->doesntExpectOutputToContain($resetToken)
            ->doesntExpectOutputToContain('/reset-password/')
            ->doesntExpectOutputToContain('/email/verify/')
            ->assertSuccessful();

        $user = User::query()->where('email', $email)->sole();

        $this->assertSame('First Admin', $user->name);
        $this->assertSame(UserRole::Admin, $user->role);
        $this->assertSame(UserStatus::Active, $user->status);
        $this->assertNotNull($user->email_verified_at);
    }

    public function test_command_rejects_a_new_account_password_that_fails_the_default_rule(): void
    {
        $this->artisan('sidha:make-admin', ['email' => 'admin@example.test'])
            ->expectsQuestion('Name', 'Admin')
            ->expectsQuestion('Password', 'short')
            ->expectsQuestion('Confirm password', 'short')
            ->assertFailed();

        $this->assertDatabaseMissing('users', ['email' => 'admin@example.test']);
    }
}
