<?php

namespace App\Http\Requests\Clients;

use App\Models\Client;

class UpdateClientRequest extends StoreClientRequest
{
    public function authorize(): bool
    {
        $client = $this->route('client');

        return $client instanceof Client
            && ($this->user()?->can('update', $client) ?? false);
    }
}
