<?php

namespace Tests\Feature\Clients;

use App\Enums\ClientStatus;
use App\Models\Client;
use App\Models\ClientContact;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class ClientReadTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get(route('clients.index'))->assertRedirect(route('login'));
    }

    public function test_unverified_user_is_redirected_to_verification_notice(): void
    {
        $user = User::factory()->unverified()->create();

        $this->actingAs($user)
            ->get(route('clients.index'))
            ->assertRedirect(route('verification.notice'));
    }

    public function test_suspended_user_is_logged_out_and_redirected_to_login(): void
    {
        $user = User::factory()->suspended()->create();

        $this->actingAs($user)
            ->get(route('clients.index'))
            ->assertRedirect(route('login'));

        $this->assertGuest();
    }

    public function test_member_can_filter_clients_and_preserve_query_string(): void
    {
        $member = User::factory()->member()->create();
        Client::factory()->create([
            'name' => 'Atlas Films',
            'status' => ClientStatus::Active,
        ]);
        Client::factory()->archived()->create(['name' => 'Hidden Studio']);

        $this->actingAs($member)
            ->get(route('clients.index', ['search' => 'Atlas', 'status' => 'active']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('clients/index')
                ->where('filters.search', 'Atlas')
                ->where('filters.status', 'active')
                ->has('clients.data', 1)
                ->where('clients.data.0.name', 'Atlas Films')
                ->where('counts.active', 1)
                ->where('counts.archived', 1)
                ->where('can.create', false)
            );
    }

    #[DataProvider('contactSearchTerms')]
    public function test_member_can_search_by_contact_name_or_email(string $search): void
    {
        $member = User::factory()->member()->create();
        $match = Client::factory()->create(['name' => 'Northwind Media']);
        ClientContact::factory()->create([
            'client_id' => $match->id,
            'name' => 'Mina Rahal',
            'email' => 'mina@northwind.example',
        ]);
        Client::factory()->create(['name' => 'Unrelated Client']);

        $this->actingAs($member)
            ->get(route('clients.index', ['search' => $search]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('clients.data', 1)
                ->where('clients.data.0.id', $match->id)
            );
    }

    /** @return array<string, array{string}> */
    public static function contactSearchTerms(): array
    {
        return [
            'contact name' => ['Mina Rahal'],
            'contact email' => ['mina@northwind.example'],
        ];
    }

    public function test_member_can_search_for_zero_without_returning_unmatched_clients(): void
    {
        $member = User::factory()->member()->create();
        $match = Client::factory()->create(['name' => 'Studio 0']);
        Client::factory()->create(['name' => 'Atlas Films']);

        $this->actingAs($member)
            ->get(route('clients.index', ['search' => '0']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.search', '0')
                ->has('clients.data', 1)
                ->where('clients.data.0.id', $match->id)
            );
    }

    public function test_search_is_grouped_before_status_filter(): void
    {
        $member = User::factory()->member()->create();
        $inactive = Client::factory()->inactive()->create(['name' => 'Atlas Inactive']);
        ClientContact::factory()->create([
            'client_id' => $inactive->id,
            'name' => 'Atlas Contact',
        ]);
        Client::factory()->create(['name' => 'Atlas Active']);

        $this->actingAs($member)
            ->get(route('clients.index', ['search' => 'Atlas', 'status' => 'inactive']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('clients.data', 1)
                ->where('clients.data.0.id', $inactive->id)
            );
    }

    public function test_invalid_status_is_rejected(): void
    {
        $member = User::factory()->member()->create();

        $this->actingAs($member)
            ->get(route('clients.index', ['status' => 'deleted']))
            ->assertSessionHasErrors('status');
    }

    public function test_search_longer_than_one_hundred_characters_is_rejected(): void
    {
        $member = User::factory()->member()->create();

        $this->actingAs($member)
            ->get(route('clients.index', ['search' => str_repeat('a', 101)]))
            ->assertSessionHasErrors('search');
    }

    public function test_client_index_paginates_fifteen_rows_and_preserves_filters(): void
    {
        $member = User::factory()->member()->create();
        Client::factory()->count(16)->create([
            'industry' => 'Film',
            'status' => ClientStatus::Active,
        ]);

        $this->actingAs($member)
            ->get(route('clients.index', [
                'search' => 'Film',
                'status' => 'active',
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('clients.data', 15)
                ->where('clients.per_page', 15)
                ->where('clients.total', 16)
                ->where('clients.next_page_url', fn (?string $url) => $url !== null
                    && str_contains($url, 'search=Film')
                    && str_contains($url, 'status=active'))
            );
    }

    public function test_client_index_eager_loads_primary_contacts(): void
    {
        $member = User::factory()->member()->create();
        Client::factory()
            ->count(3)
            ->has(ClientContact::factory()->state(['is_primary' => true]), 'contacts')
            ->create();

        DB::flushQueryLog();
        DB::enableQueryLog();

        $this->actingAs($member)
            ->get(route('clients.index'))
            ->assertOk();

        $clientQueries = collect(DB::getQueryLog())
            ->pluck('query')
            ->filter(fn (string $query) => preg_match('/\bfrom\s+[`"]client/', $query) === 1);

        DB::disableQueryLog();

        $this->assertCount(4, $clientQueries);
    }

    public function test_member_can_view_client_detail_with_ordered_contacts(): void
    {
        $member = User::factory()->member()->create();
        $client = Client::factory()->create([
            'name' => 'Atlas Films',
            'industry' => 'Film',
            'phone' => '+212 500 000 000',
            'website' => 'https://atlas.example',
            'address' => '12 Cinema Street',
            'notes' => 'Prefers morning calls.',
            'status' => ClientStatus::Active,
        ]);
        ClientContact::factory()->create([
            'client_id' => $client->id,
            'name' => 'Zara Secondary',
            'is_primary' => false,
        ]);
        ClientContact::factory()->create([
            'client_id' => $client->id,
            'name' => 'Mina Primary',
            'is_primary' => true,
        ]);
        ClientContact::factory()->create([
            'client_id' => $client->id,
            'name' => 'Adam Secondary',
            'is_primary' => false,
        ]);

        $this->actingAs($member)
            ->get(route('clients.show', $client))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('clients/show')
                ->where('client.id', $client->id)
                ->where('client.name', 'Atlas Films')
                ->where('client.industry', 'Film')
                ->where('client.notes', 'Prefers morning calls.')
                ->has('client.contacts', 3)
                ->where('client.contacts.0.name', 'Mina Primary')
                ->where('client.contacts.0.is_primary', true)
                ->where('client.contacts.1.name', 'Adam Secondary')
                ->where('client.contacts.2.name', 'Zara Secondary')
                ->where('can.update', false)
                ->where('can.archive', false)
                ->where('can.reactivate', false)
            );
    }

    public function test_admin_receives_create_and_mutation_capabilities(): void
    {
        $admin = User::factory()->admin()->create();
        $client = Client::factory()->create();

        $this->actingAs($admin)
            ->get(route('clients.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('can.create', true)
            );

        $this->actingAs($admin)
            ->get(route('clients.show', $client))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('can.update', true)
                ->where('can.archive', true)
                ->where('can.reactivate', true)
            );
    }
}
