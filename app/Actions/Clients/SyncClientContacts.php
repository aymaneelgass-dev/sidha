<?php

namespace App\Actions\Clients;

use App\Models\Client;
use InvalidArgumentException;

class SyncClientContacts
{
    /**
     * @param  array<int, array<string, mixed>>  $contacts
     */
    public function execute(Client $client, array $contacts): void
    {
        $primaryContacts = collect($contacts)->filter(
            fn (array $contact): bool => filter_var(
                $contact['is_primary'] ?? false,
                FILTER_VALIDATE_BOOLEAN,
            ),
        );

        if ($primaryContacts->count() > 1) {
            throw new InvalidArgumentException('Only one primary contact may be selected.');
        }

        $client->contacts()->delete();

        if ($contacts !== []) {
            $client->contacts()->createMany($contacts);
        }
    }
}
