<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\StudioBooking;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<StudioBooking> */
class StudioBookingFactory extends Factory
{
    /** @return array<string,mixed> */
    public function definition(): array
    {
        return ['client_id' => Client::factory(), 'service_type' => 'music-recording', 'booking_date' => '2026-10-12', 'start_time' => '14:00', 'end_time' => '16:00', 'price' => '2400.00', 'status' => 'scheduled', 'notes' => null];
    }
}
