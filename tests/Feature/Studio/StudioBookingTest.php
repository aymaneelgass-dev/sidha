<?php

namespace Tests\Feature\Studio;

use App\Models\Client;
use App\Models\StudioBooking;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudioBookingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    private function payload(): array
    {
        return ['client_id' => Client::factory()->create()->id, 'service_type' => 'voice-over', 'booking_date' => '2026-10-12', 'start_time' => '10:00', 'end_time' => '12:00', 'price' => '1800.50', 'status' => 'scheduled', 'notes' => null];
    }

    public function test_admin_can_create_update_and_cancel_a_booking(): void
    {
        $this->actingAs(User::factory()->admin()->create());
        $data = $this->payload();
        $this->post('/studio', $data)->assertSessionHasNoErrors()->assertRedirect();
        $booking = StudioBooking::firstOrFail();
        $this->assertSame('1800.50', $booking->price);
        $this->assertSame('2026-10-12', $booking->getRawOriginal('booking_date'));
        $this->assertSame($data['client_id'], $booking->client->id);
        $this->put("/studio/{$booking->id}", [...$data, 'status' => 'in-progress', 'notes' => '  Two takes.  '])->assertSessionHasNoErrors();
        $this->assertSame('Two takes.', $booking->fresh()->notes);
        $this->patch("/studio/{$booking->id}/cancel")->assertRedirect();
        $this->assertSame('cancelled', $booking->fresh()->status->value);
    }

    public function test_every_overlap_shape_is_rejected_but_adjacent_and_other_days_are_allowed(): void
    {
        $this->actingAs(User::factory()->admin()->create());
        $data = $this->payload();
        $this->post('/studio', $data)->assertSessionHasNoErrors();
        foreach ([['09:00', '11:00'], ['11:00', '13:00'], ['10:30', '11:30'], ['09:00', '13:00'], ['10:00', '12:00']] as [$start, $end]) {
            $this->post('/studio', [...$data, 'start_time' => $start, 'end_time' => $end])->assertSessionHasErrors('start_time');
        }
        $this->assertDatabaseCount('studio_bookings', 1);
        $this->post('/studio', [...$data, 'start_time' => '08:00', 'end_time' => '10:00'])->assertSessionHasNoErrors();
        $this->post('/studio', [...$data, 'start_time' => '12:00', 'end_time' => '13:00'])->assertSessionHasNoErrors();
        $this->post('/studio', [...$data, 'booking_date' => '2026-10-13'])->assertSessionHasNoErrors();
        $this->assertDatabaseCount('studio_bookings', 4);
    }

    public function test_cancelled_slots_are_free_but_reactivation_and_moves_recheck_conflicts(): void
    {
        $this->actingAs(User::factory()->admin()->create());
        $data = $this->payload();
        $this->post('/studio', [...$data, 'status' => 'cancelled'])->assertSessionHasNoErrors();
        $cancelled = StudioBooking::firstOrFail();
        $this->post('/studio', $data)->assertSessionHasNoErrors();
        $active = StudioBooking::latest('id')->firstOrFail();
        $this->put("/studio/{$cancelled->id}", $data)->assertSessionHasErrors('start_time');
        $this->assertSame('cancelled', $cancelled->fresh()->status->value);
        // A booking must not conflict with itself, even when its status changes.
        $this->put("/studio/{$active->id}", [...$data, 'status' => 'completed'])->assertSessionHasNoErrors();
        $this->post('/studio', $data)->assertSessionHasErrors('start_time');
        $other = StudioBooking::factory()->create(['booking_date' => '2026-10-14', 'start_time' => '10:00', 'end_time' => '12:00']);
        $this->put("/studio/{$other->id}", $data)->assertSessionHasErrors('start_time');
        $this->assertSame('2026-10-14', $other->fresh()->booking_date->format('Y-m-d'));
    }

    public function test_invalid_fields_never_write_and_archived_clients_can_only_be_retained(): void
    {
        $this->actingAs(User::factory()->admin()->create());
        $data = $this->payload();
        foreach (['-1', '1.001', '1e3', '10000000000'] as $price) {
            $this->post('/studio', [...$data, 'price' => $price])->assertSessionHasErrors('price');
        }
        foreach (['09:59', '10:00', '00:30'] as $end) {
            $this->post('/studio', [...$data, 'end_time' => $end])->assertSessionHasErrors('end_time');
        }
        $this->post('/studio', [...$data, 'client_id' => 999999, 'service_type' => 'video', 'status' => 'paid', 'booking_date' => '2026-02-30', 'start_time' => '25:00'])->assertSessionHasErrors(['client_id', 'service_type', 'status', 'booking_date', 'start_time']);
        $this->post('/studio', [...$data, 'start_time' => '10:00:30'])->assertSessionHasErrors('start_time');
        $this->assertDatabaseEmpty('studio_bookings');
        $archived = Client::factory()->archived()->create();
        $this->post('/studio', [...$data, 'client_id' => $archived->id])->assertSessionHasErrors('client_id');
        $booking = StudioBooking::factory()->for($archived)->create();
        $this->put("/studio/{$booking->id}", [...$data, 'client_id' => $archived->id, 'price' => '0'])->assertSessionHasNoErrors();
    }

    public function test_member_cannot_write_or_access_admin_forms(): void
    {
        $booking = StudioBooking::factory()->create();
        $this->actingAs(User::factory()->member()->create());
        $this->get('/studio/create')->assertForbidden();
        $this->get("/studio/{$booking->id}/edit")->assertForbidden();
        $this->post('/studio', [])->assertForbidden();
        $this->put("/studio/{$booking->id}", [])->assertForbidden();
        $this->patch("/studio/{$booking->id}/cancel")->assertForbidden();
        $this->assertSame('scheduled', $booking->fresh()->status->value);
    }
}
