<?php

namespace Tests\Feature\Clients;

use App\Actions\Clients\SyncClientContacts;
use App\Enums\ClientStatus;
use App\Models\Client;
use App\Models\ClientContact;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use InvalidArgumentException;
use PHPUnit\Framework\Attributes\DataProvider;
use RuntimeException;
use Tests\TestCase;

class ClientManagementTest extends TestCase
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
        $client = Client::factory()->create(['name' => 'Atlas Films']);
        ClientContact::factory()->for($client)->create(['name' => 'Mina Rahal']);

        $this->actingAs($admin)
            ->get(route('clients.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('clients/create'));

        $this->actingAs($admin)
            ->get(route('clients.edit', $client))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('clients/edit')
                ->where('client.id', $client->id)
                ->where('client.name', 'Atlas Films')
                ->where('client.contacts.0.name', 'Mina Rahal'));
    }

    public function test_admin_creates_client_and_contacts_atomically(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->post(route('clients.store'), [
            'name' => '  Northlight Films  ',
            'industry' => '  Advertising  ',
            'phone' => '',
            'website' => '',
            'address' => '',
            'notes' => '',
            'status' => 'active',
            'contacts' => [
                [
                    'name' => '  Sara Karim  ',
                    'job_title' => '  Producer  ',
                    'email' => '  sara@example.test  ',
                    'phone' => '',
                    'is_primary' => true,
                ],
                [
                    'name' => 'Omar Naji',
                    'job_title' => '',
                    'email' => 'omar@example.test',
                    'phone' => '',
                    'is_primary' => false,
                ],
            ],
        ]);

        $client = Client::where('name', 'Northlight Films')->firstOrFail();

        $response->assertRedirect(route('clients.show', $client));
        $this->assertSame('Advertising', $client->industry);
        $this->assertNull($client->phone);
        $this->assertNull($client->website);
        $this->assertNull($client->address);
        $this->assertNull($client->notes);
        $this->assertCount(2, $client->contacts);
        $this->assertSame('Sara Karim', $client->primaryContact?->name);
        $this->assertSame('Producer', $client->primaryContact?->job_title);
        $this->assertSame('sara@example.test', $client->primaryContact?->email);
    }

    public function test_member_cannot_call_any_client_mutation_route(): void
    {
        $member = User::factory()->member()->create();
        $client = Client::factory()->create();

        $this->actingAs($member)->get(route('clients.create'))->assertForbidden();
        $this->actingAs($member)->post(route('clients.store'), ['name' => 'Denied'])->assertForbidden();
        $this->actingAs($member)->get(route('clients.edit', $client))->assertForbidden();
        $this->actingAs($member)->put(route('clients.update', $client), ['name' => 'Denied'])->assertForbidden();
        $this->actingAs($member)->patch(route('clients.archive', $client))->assertForbidden();
        $this->actingAs($member)->patch(route('clients.reactivate', $client))->assertForbidden();
    }

    public function test_nested_contact_validation_returns_indexed_errors(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->post(route('clients.store'), [
            'name' => 'Northlight Films',
            'status' => 'active',
            'contacts' => [
                ['name' => 'Sara Karim', 'email' => 'sara@example.test', 'is_primary' => true],
                ['name' => '', 'email' => 'invalid-email', 'is_primary' => false],
            ],
        ])->assertSessionHasErrors(['contacts.1.name', 'contacts.1.email']);

        $this->assertDatabaseEmpty('clients');
        $this->assertDatabaseEmpty('client_contacts');
    }

    public function test_more_than_one_primary_contact_is_rejected(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->post(route('clients.store'), [
            'name' => 'Northlight Films',
            'status' => 'active',
            'contacts' => [
                ['name' => 'Sara Karim', 'is_primary' => true],
                ['name' => 'Omar Naji', 'is_primary' => true],
            ],
        ])->assertSessionHasErrors([
            'contacts' => 'Only one primary contact may be selected.',
        ]);

        $this->assertDatabaseEmpty('clients');
        $this->assertDatabaseEmpty('client_contacts');
    }

    public function test_admin_can_create_client_with_zero_contacts(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->post(route('clients.store'), [
            'name' => 'Solo Client',
            'status' => 'inactive',
            'contacts' => [],
        ])->assertRedirect();

        $client = Client::where('name', 'Solo Client')->firstOrFail();

        $this->assertSame(ClientStatus::Inactive, $client->status);
        $this->assertCount(0, $client->contacts);
    }

    public function test_update_replaces_contacts_as_one_aggregate(): void
    {
        $admin = User::factory()->admin()->create();
        $client = Client::factory()->create(['name' => 'Old Name']);
        $oldPrimary = ClientContact::factory()->for($client)->create([
            'name' => 'Old Primary',
            'is_primary' => true,
        ]);
        $oldSecondary = ClientContact::factory()->for($client)->create([
            'name' => 'Old Secondary',
            'is_primary' => false,
        ]);

        $this->actingAs($admin)->put(route('clients.update', $client), [
            'name' => 'New Name',
            'industry' => 'Film',
            'status' => 'active',
            'contacts' => [
                ['name' => 'New Primary', 'email' => 'new@example.test', 'is_primary' => true],
            ],
        ])->assertRedirect(route('clients.show', $client));

        $client->refresh();

        $this->assertSame('New Name', $client->name);
        $this->assertCount(1, $client->contacts);
        $this->assertSame('New Primary', $client->primaryContact?->name);
        $this->assertDatabaseMissing('client_contacts', ['id' => $oldPrimary->id]);
        $this->assertDatabaseMissing('client_contacts', ['id' => $oldSecondary->id]);
    }

    public function test_update_rolls_back_client_when_contact_sync_throws(): void
    {
        $admin = User::factory()->admin()->create();
        $client = Client::factory()->create(['name' => 'Original Name']);
        $contact = ClientContact::factory()->for($client)->create(['name' => 'Original Contact']);

        $this->app->bind(SyncClientContacts::class, fn () => new class extends SyncClientContacts
        {
            public function execute(Client $client, array $contacts): void
            {
                $client->contacts()->delete();

                throw new RuntimeException('Forced contact sync failure.');
            }
        });

        $response = $this->actingAs($admin)
            ->from(route('clients.edit', $client))
            ->put(route('clients.update', $client), [
                'name' => 'Changed Name',
                'status' => 'active',
                'contacts' => [
                    ['name' => 'Changed Contact', 'is_primary' => true],
                ],
            ]);

        $response
            ->assertRedirect(route('clients.edit', $client))
            ->assertSessionHasErrors([
                'client' => 'The client could not be saved. Please try again.',
            ]);
        $this->assertStringNotContainsString('Forced contact sync failure', $response->getContent());

        $this->assertDatabaseHas('clients', ['id' => $client->id, 'name' => 'Original Name']);
        $this->assertDatabaseHas('client_contacts', ['id' => $contact->id, 'name' => 'Original Contact']);
        $this->assertDatabaseMissing('clients', ['id' => $client->id, 'name' => 'Changed Name']);
    }

    public function test_contact_sync_rejects_multiple_primary_contacts_on_direct_call(): void
    {
        $client = Client::factory()->create();
        $existing = ClientContact::factory()->for($client)->create([
            'name' => 'Existing Contact',
            'is_primary' => true,
        ]);

        try {
            app(SyncClientContacts::class)->execute($client, [
                ['name' => 'First', 'is_primary' => true],
                ['name' => 'Second', 'is_primary' => true],
            ]);

            $this->fail('Multiple primary contacts were accepted.');
        } catch (InvalidArgumentException $exception) {
            $this->assertSame('Only one primary contact may be selected.', $exception->getMessage());
        }

        $this->assertDatabaseHas('client_contacts', ['id' => $existing->id, 'name' => 'Existing Contact']);
        $this->assertCount(1, $client->fresh()->contacts);
    }

    public function test_admin_can_archive_client(): void
    {
        $admin = User::factory()->admin()->create();
        $client = Client::factory()->create(['status' => ClientStatus::Active]);

        $this->actingAs($admin)
            ->patch(route('clients.archive', $client))
            ->assertRedirect(route('clients.show', $client));

        $this->assertSame(ClientStatus::Archived, $client->fresh()->status);
    }

    public function test_admin_can_reactivate_archived_client(): void
    {
        $admin = User::factory()->admin()->create();
        $client = Client::factory()->archived()->create();

        $this->actingAs($admin)
            ->patch(route('clients.reactivate', $client))
            ->assertRedirect(route('clients.show', $client));

        $this->assertSame(ClientStatus::Active, $client->fresh()->status);
    }

    #[DataProvider('statusMutationFailureCases')]
    public function test_status_mutation_failure_returns_generic_dialog_feedback(
        string $routeName,
        ClientStatus $initialStatus,
    ): void {
        $admin = User::factory()->admin()->create();
        $client = Client::factory()->create(['status' => $initialStatus]);

        Client::updating(function (): void {
            throw new RuntimeException('Sensitive database failure details.');
        });

        $response = $this->actingAs($admin)
            ->from(route('clients.show', $client))
            ->patch(route($routeName, $client));

        $response
            ->assertRedirect(route('clients.show', $client))
            ->assertSessionHasErrors([
                'client_status' => 'The client status could not be updated. Please try again.',
            ]);
        $this->assertSame($initialStatus, $client->fresh()->status);
    }

    /** @return array<string, array{string, ClientStatus}> */
    public static function statusMutationFailureCases(): array
    {
        return [
            'archive' => ['clients.archive', ClientStatus::Active],
            'reactivate' => ['clients.reactivate', ClientStatus::Archived],
        ];
    }
}
