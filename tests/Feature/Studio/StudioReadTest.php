<?php

namespace Tests\Feature\Studio;

use App\Models\Client;
use App\Models\StudioBooking;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class StudioReadTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        $this->travelTo(now('Africa/Casablanca')->setDate(2026, 10, 12)->setTime(11, 0));
    }

    public function test_member_reads_board_and_detail_without_mutation_capabilities(): void
    {
        $booking = StudioBooking::factory()->create(['start_time' => '10:00', 'end_time' => '12:00']);
        $this->actingAs(User::factory()->member()->create());
        $this->get('/studio')->assertOk()->assertInertia(fn (Assert $p) => $p->component('studio/index')->has('bookings.data', 1)->where('can.create', false)->where('bookings.data.0.start_time', '10:00')->where('bookings.data.0.booking_date', '2026-10-12'));
        $this->get("/studio/{$booking->id}")->assertOk()->assertInertia(fn (Assert $p) => $p->component('studio/show')->where('can.update', false)->where('can.cancel', false)->where('booking.notes', null));
    }

    public function test_upcoming_and_history_partition_by_local_end_time_and_status(): void
    {
        $active = StudioBooking::factory()->create(['status' => 'in-progress', 'start_time' => '10:00', 'end_time' => '12:00']);
        StudioBooking::factory()->create(['start_time' => '09:00', 'end_time' => '11:00']);
        StudioBooking::factory()->create(['booking_date' => '2026-10-11']);
        StudioBooking::factory()->create(['booking_date' => '2026-10-13', 'status' => 'cancelled']);
        StudioBooking::factory()->create(['booking_date' => '2026-10-13', 'status' => 'completed']);
        $this->actingAs(User::factory()->member()->create());
        $this->get('/studio')->assertInertia(fn (Assert $p) => $p->has('bookings.data', 1)->where('bookings.data.0.id', $active->id));
        $this->get('/studio?view=history')->assertInertia(fn (Assert $p) => $p->has('bookings.data', 4));
    }

    public function test_filters_combine_preserve_pagination_and_reject_invalid_values(): void
    {
        $client = Client::factory()->create(['name' => 'Fictional Echo Bureau']);
        StudioBooking::factory()->count(13)->for($client)->create(['service_type' => 'podcast', 'status' => 'completed']);
        StudioBooking::factory()->create();
        $this->actingAs(User::factory()->member()->create());
        $url = '/studio?view=history&search=Echo&service_type=podcast&status=completed&date=2026-10-12';
        $this->get($url)->assertInertia(fn (Assert $p) => $p->has('bookings.data', 12)->where('bookings.total', 13)->where('bookings.next_page_url', fn ($url) => str_contains($url, 'view=history') && str_contains($url, 'search=Echo')));
        $this->get($url.'&page=2')->assertInertia(fn (Assert $p) => $p->has('bookings.data', 1));
        $this->get('/studio?view=invalid&status=paid&date=bad&service_type=film&page=0')->assertSessionHasErrors(['view', 'status', 'date', 'service_type', 'page']);
    }

    public function test_access_guards_and_admin_form_data(): void
    {
        $this->get('/studio')->assertRedirect('/login');
        $this->actingAs(User::factory()->unverified()->create())->get('/studio')->assertRedirect(route('verification.notice'));
        $this->actingAs(User::factory()->suspended()->create())->get('/studio')->assertRedirect('/login');
        $client = Client::factory()->archived()->create();
        $booking = StudioBooking::factory()->for($client)->create();
        $this->actingAs(User::factory()->admin()->create());
        $this->get('/studio/create')->assertInertia(fn (Assert $p) => $p->component('studio/create')->has('clients', 0));
        $this->get("/studio/{$booking->id}/edit")->assertInertia(fn (Assert $p) => $p->component('studio/edit')->has('clients', 1)->where('clients.0.id', $client->id));
    }
}
