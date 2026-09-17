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
}
