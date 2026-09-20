<?php

namespace App\Http\Controllers;

use App\Enums\ClientStatus;
use App\Http\Requests\Clients\ClientIndexRequest;
use App\Models\Client;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    public function index(ClientIndexRequest $request): Response
    {
        Gate::authorize('viewAny', Client::class);

        $filters = $request->validated();
        $search = $filters['search'] ?? null;
        $status = $filters['status'] ?? null;

        $clients = Client::query()
            ->with('primaryContact')
            ->when($search !== null && $search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('industry', 'like', "%{$search}%")
                        ->orWhereHas('contacts', function (Builder $query) use ($search): void {
                            $query
                                ->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->when($status, fn (Builder $query, string $status) => $query->where('status', $status))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Client $client): array => $this->listItem($client));

        $statusCounts = Client::query()
            ->selectRaw('status, count(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        return Inertia::render('clients/index', [
            'clients' => $clients,
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? '',
            ],
            'counts' => [
                'all' => $statusCounts->sum(),
                'active' => (int) ($statusCounts[ClientStatus::Active->value] ?? 0),
                'inactive' => (int) ($statusCounts[ClientStatus::Inactive->value] ?? 0),
                'archived' => (int) ($statusCounts[ClientStatus::Archived->value] ?? 0),
            ],
            'can' => [
                'create' => $request->user()->can('create', Client::class),
            ],
        ]);
    }

    public function show(Request $request, Client $client): Response
    {
        Gate::authorize('view', $client);

        $client->load('contacts');

        return Inertia::render('clients/show', [
            'client' => [
                'id' => $client->id,
                'name' => $client->name,
                'industry' => $client->industry,
                'phone' => $client->phone,
                'website' => $client->website,
                'address' => $client->address,
                'notes' => $client->notes,
                'status' => $client->status->value,
                'created_at' => $client->created_at?->toISOString(),
                'updated_at' => $client->updated_at?->toISOString(),
                'contacts' => $client->contacts->map(fn ($contact): array => [
                    'id' => $contact->id,
                    'name' => $contact->name,
                    'job_title' => $contact->job_title,
                    'email' => $contact->email,
                    'phone' => $contact->phone,
                    'is_primary' => $contact->is_primary,
                ])->all(),
            ],
            'can' => [
                'update' => $request->user()->can('update', $client),
                'archive' => $request->user()->can('archive', $client),
                'reactivate' => $request->user()->can('reactivate', $client),
            ],
        ]);
    }

    /** @return array<string, mixed> */
    private function listItem(Client $client): array
    {
        return [
            'id' => $client->id,
            'name' => $client->name,
            'industry' => $client->industry,
            'phone' => $client->phone,
            'status' => $client->status->value,
            'primary_contact' => $client->primaryContact === null ? null : [
                'id' => $client->primaryContact->id,
                'name' => $client->primaryContact->name,
                'email' => $client->primaryContact->email,
                'phone' => $client->primaryContact->phone,
                'job_title' => $client->primaryContact->job_title,
                'is_primary' => $client->primaryContact->is_primary,
            ],
        ];
    }
}
