<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class ComingSoonPagesTest extends TestCase
{
    use RefreshDatabase;

    public static function modules(): array
    {
        return [
            'studio' => ['studio.index', 'Studio', 'audio-lines'],
            'calendar' => ['calendar.index', 'Calendar', 'calendar-days'],
            'sidha ai' => ['sidha-ai.index', 'SIDHA AI', 'sparkles'],
        ];
    }

    #[DataProvider('modules')]
    public function test_guests_are_redirected_from_future_modules(
        string $routeName,
        string $_title,
        string $_icon,
    ): void {
        $this->get(route($routeName))->assertRedirect(route('login'));
    }

    #[DataProvider('modules')]
    public function test_unverified_users_are_redirected_from_future_modules(
        string $routeName,
        string $_title,
        string $_icon,
    ): void {
        $user = User::factory()->unverified()->create();

        $this->actingAs($user)
            ->get(route($routeName))
            ->assertRedirect(route('verification.notice'));
    }

    #[DataProvider('modules')]
    public function test_authenticated_users_can_view_a_generic_module_page(
        string $routeName,
        string $title,
        string $icon,
    ): void {
        $user = User::factory()->create(['email_verified_at' => now()]);

        $this->actingAs($user)
            ->get(route($routeName))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('coming-soon')
                ->where('pageTitle', $title)
                ->where('moduleIcon', $icon)
                ->has('pageDescription')
            );
    }
}
