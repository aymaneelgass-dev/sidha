<?php

namespace Tests\Unit\Models;

use App\Enums\ClientStatus;
use App\Models\Client;
use App\Models\ClientContact;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientTest extends TestCase
{
    use RefreshDatabase;

    public function test_client_casts_status_and_owns_contacts(): void
    {
        $client = Client::factory()->create(['status' => ClientStatus::Active]);
        $primary = ClientContact::factory()->for($client)->create(['is_primary' => true]);
        ClientContact::factory()->for($client)->create(['is_primary' => false]);

        $this->assertSame(ClientStatus::Active, $client->status);
        $this->assertCount(2, $client->contacts);
        $this->assertTrue($client->primaryContact->is($primary));
    }

    public function test_client_can_exist_without_contacts(): void
    {
        $client = Client::factory()->create();

        $this->assertCount(0, $client->contacts);
        $this->assertNull($client->primaryContact);
    }

    public function test_factories_use_explicitly_fictional_client_and_contact_identity_data(): void
    {
        $client = Client::factory()->make();
        $contact = ClientContact::factory()->make();

        $this->assertMatchesRegularExpression('/^Example Client \d{4}$/', $client->name);
        $this->assertSame('123 Example Way', $client->address);
        $this->assertMatchesRegularExpression('/^Contact \d{4}$/', $contact->name);
    }
}
