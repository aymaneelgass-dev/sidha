<?php

namespace Tests\Feature\Database;

use App\Enums\ClientStatus;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\Client;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\SidhaDemoSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use LogicException;
use Tests\TestCase;

class SidhaDemoSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_demo_seeder_creates_deterministic_fictional_clients_contacts_and_team(): void
    {
        $this->seed(SidhaDemoSeeder::class);

        $this->assertDatabaseCount('users', 4);
        $this->assertDatabaseHas('users', [
            'email' => 'admin@sidha.test',
            'role' => UserRole::Admin->value,
            'status' => UserStatus::Active->value,
        ]);
        $this->assertSame(1, DB::table('users')->where('role', UserRole::Admin->value)->count());
        $this->assertSame(3, DB::table('users')->where('role', UserRole::Member->value)->count());
        $this->assertSame(1, DB::table('users')->where('status', UserStatus::Suspended->value)->count());
        $this->assertDatabaseMissing('users', [
            'email' => 'admin@sidha.test',
            'email_verified_at' => null,
        ]);

        $this->assertDatabaseCount('clients', 8);
        $this->assertSame(4, Client::where('status', ClientStatus::Active)->count());
        $this->assertSame(2, Client::where('status', ClientStatus::Inactive)->count());
        $this->assertSame(2, Client::where('status', ClientStatus::Archived)->count());
        $this->assertDatabaseCount('client_contacts', 16);

        Client::with('contacts')->each(function (Client $client): void {
            $this->assertGreaterThanOrEqual(1, $client->contacts->count());
            $this->assertLessThanOrEqual(3, $client->contacts->count());
            $this->assertLessThanOrEqual(1, $client->contacts->where('is_primary', true)->count());
        });

        $emails = DB::table('users')->pluck('email')
            ->merge(DB::table('client_contacts')->pluck('email'));

        $this->assertNotEmpty($emails);
        $this->assertTrue($emails->every(
            fn (?string $email): bool => $email !== null && str_ends_with($email, '.test'),
        ));
    }

    public function test_demo_seeder_refuses_production_before_writing_any_records(): void
    {
        $originalEnvironment = $this->app->environment();
        $this->app->instance('env', 'production');

        try {
            $this->app->make(SidhaDemoSeeder::class)->run();
            $this->fail('Expected the demo seeder to refuse production.');
        } catch (LogicException $exception) {
            $this->assertSame(
                'SIDHA demo data cannot be seeded in production.',
                $exception->getMessage(),
            );
        } finally {
            $this->app->instance('env', $originalEnvironment);
        }

        $this->assertDatabaseCount('users', 0);
        $this->assertDatabaseCount('clients', 0);
        $this->assertDatabaseCount('client_contacts', 0);
    }

    public function test_database_seeder_loads_demo_data_in_testing(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->assertDatabaseCount('users', 4);
        $this->assertDatabaseCount('clients', 12);
        $this->assertDatabaseCount('projects', 7);
        $this->assertDatabaseCount('client_contacts', 16);
    }

    public function test_database_seeder_does_not_load_demo_data_in_production(): void
    {
        $originalEnvironment = $this->app->environment();
        $this->app->instance('env', 'production');

        try {
            $this->app->make(DatabaseSeeder::class)->run();
        } finally {
            $this->app->instance('env', $originalEnvironment);
        }

        $this->assertDatabaseCount('users', 0);
        $this->assertDatabaseCount('clients', 0);
        $this->assertDatabaseCount('client_contacts', 0);
    }
}
