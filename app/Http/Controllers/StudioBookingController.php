<?php

namespace App\Http\Controllers;

use App\Actions\Studio\SaveStudioBooking;
use App\Enums\StudioBookingStatus;
use App\Http\Requests\Studio\StoreStudioBookingRequest;
use App\Http\Requests\Studio\StudioIndexRequest;
use App\Http\Requests\Studio\UpdateStudioBookingRequest;
use App\Models\Client;
use App\Models\StudioBooking;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class StudioBookingController extends Controller
{
    public function index(StudioIndexRequest $request): Response
    {
        Gate::authorize('viewAny', StudioBooking::class);
        $filters = $request->safe()->only(['view', 'search', 'status', 'service_type', 'date']);
        $view = $filters['view'] ?? 'upcoming';
        $now = now(config('studio.timezone'));
        $today = $now->format('Y-m-d');
        $time = $now->format('H:i:s');
        $bookings = StudioBooking::query()->with('client:id,name');
        if ($view === 'upcoming') {
            $bookings->whereIn('status', ['scheduled', 'in-progress'])
                ->where(fn (Builder $q) => $q->where('booking_date', '>', $today)->orWhere(fn (Builder $q) => $q->where('booking_date', $today)->where('end_time', '>', $time)));
        } else {
            $bookings->where(fn (Builder $q) => $q->whereIn('status', ['completed', 'cancelled'])->orWhere('booking_date', '<', $today)->orWhere(fn (Builder $q) => $q->where('booking_date', $today)->where('end_time', '<=', $time)));
        }
        $bookings
            ->when($filters['search'] ?? null, fn (Builder $q, string $search) => $q->whereHas('client', fn (Builder $q) => $q->where('name', 'like', "%{$search}%")))
            ->when($filters['status'] ?? null, fn (Builder $q, string $status) => $q->where('status', $status))
            ->when($filters['service_type'] ?? null, fn (Builder $q, string $service) => $q->where('service_type', $service))
            ->when($filters['date'] ?? null, fn (Builder $q, string $date) => $q->where('booking_date', $date))
            ->orderBy('booking_date', $view === 'upcoming' ? 'asc' : 'desc')->orderBy('start_time')->orderBy('id');

        return Inertia::render('studio/index', [
            'bookings' => $bookings->paginate(12)->withQueryString()->through(fn (StudioBooking $booking) => $this->bookingData($booking)),
            'filters' => ['view' => $view, 'search' => $filters['search'] ?? '', 'status' => $filters['status'] ?? '', 'service_type' => $filters['service_type'] ?? '', 'date' => $filters['date'] ?? ''],
            'today' => $today, 'timezone' => config('studio.timezone'),
            'can' => ['create' => $request->user()->can('create', StudioBooking::class)],
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', StudioBooking::class);

        return Inertia::render('studio/create', ['clients' => $this->clients(), 'today' => now(config('studio.timezone'))->format('Y-m-d'), 'timezone' => config('studio.timezone')]);
    }

    public function store(StoreStudioBookingRequest $request, SaveStudioBooking $save): RedirectResponse
    {
        $booking = $save->execute($request->validated());
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Studio session booked.']);

        return to_route('studio.show', $booking);
    }

    public function show(Request $request, StudioBooking $booking): Response
    {
        Gate::authorize('view', $booking);
        $booking->load('client:id,name');

        return Inertia::render('studio/show', ['booking' => $this->bookingData($booking), 'timezone' => config('studio.timezone'), 'can' => ['update' => $request->user()->can('update', $booking), 'cancel' => $request->user()->can('cancel', $booking)]]);
    }

    public function edit(StudioBooking $booking): Response
    {
        Gate::authorize('update', $booking);
        $booking->load('client:id,name');

        return Inertia::render('studio/edit', ['booking' => $this->bookingData($booking), 'clients' => $this->clients($booking->client_id), 'timezone' => config('studio.timezone')]);
    }

    public function update(UpdateStudioBookingRequest $request, StudioBooking $booking, SaveStudioBooking $save): RedirectResponse
    {
        $save->execute($request->validated(), $booking);
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Studio session updated.']);

        return to_route('studio.show', $booking);
    }

    public function cancel(StudioBooking $booking, SaveStudioBooking $save): RedirectResponse
    {
        Gate::authorize('cancel', $booking);
        $save->execute(['status' => StudioBookingStatus::Cancelled], $booking);
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Session cancelled. The time slot is available again.']);

        return to_route('studio.show', $booking);
    }

    /** @return Collection<int,Client> */
    private function clients(?int $current = null): Collection
    {
        return Client::query()->where(function (Builder $q) use ($current): void {
            $q->where('status', '!=', 'archived');
            if ($current !== null) {
                $q->orWhere('id', $current);
            }
        })->orderBy('name')->get(['id', 'name', 'status']);
    }

    /** @return array<string,mixed> */
    private function bookingData(StudioBooking $booking): array
    {
        return ['id' => $booking->id, 'client_id' => $booking->client_id, 'client' => ['id' => $booking->client->id, 'name' => $booking->client->name], 'service_type' => $booking->service_type->value, 'booking_date' => $booking->booking_date->format('Y-m-d'), 'start_time' => substr($booking->start_time, 0, 5), 'end_time' => substr($booking->end_time, 0, 5), 'price' => $booking->price, 'status' => $booking->status->value, 'notes' => $booking->notes];
    }
}
