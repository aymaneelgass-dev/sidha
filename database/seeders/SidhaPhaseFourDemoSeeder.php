<?php

namespace Database\Seeders;

use App\Actions\Studio\SaveStudioBooking;
use App\Models\Client;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use LogicException;

class SidhaPhaseFourDemoSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment(['local', 'testing'])) {
            throw new LogicException('Phase 4 demo data is limited to local and testing.');
        }

        $groups = [
            ['Velvet Satellite Records (Demo)', 'velvet-satellite', 'music-recording', [
                [1, '09:00', '12:00', '3600.00', 'scheduled', 'Fictional demo. Live rhythm takes for an imaginary three-track EP.'],
                [-3, '14:00', '17:00', '3200.00', 'completed', 'Fictional demo. Vocal doubles and final harmonies.'],
            ]],
            ['Amber Frequency Stories (Demo)', 'amber-frequency', 'voice-over', [
                [1, '13:00', '14:30', '1800.00', 'scheduled', 'Fictional demo. Two narration directions for a short film.'],
            ]],
            ['Morrow Kite Audio (Demo)', 'morrow-kite', 'podcast', [
                [2, '10:00', '11:30', '1500.00', 'scheduled', 'Fictional demo. A two-voice conversation about imaginary cities.'],
                [0, '10:00', '11:30', '1500.00', 'in-progress', 'Fictional demo. Pilot episode with a short introduction and closing.'],
            ]],
            ['Cobalt Pebble Goods (Demo)', 'cobalt-pebble', 'audio-advertising', [
                [1, '15:00', '16:00', '2200.00', 'cancelled', 'Fictional demo. A 30-second audio spot. Cancelled after the brief changed.'],
            ]],
        ];

        DB::transaction(function () use ($groups): void {
            DB::table('studio_booking_mutex')->where('id', 1)->lockForUpdate()->firstOrFail();
            foreach ($groups as [$name, $slug, $service, $sessions]) {
                $website = 'https://'.$slug.'.phase4-demo.test';
                // Skip an existing group entirely, preserving user edits on reruns.
                if (Client::where('website', $website)->exists()) {
                    continue;
                }
                $client = Client::create(['name' => $name, 'website' => $website, 'status' => 'active', 'notes' => 'Entirely fictional SIDHA Phase 4 demonstration client.']);
                foreach ($sessions as [$offset, $start, $end, $price, $status, $notes]) {
                    $date = now(config('studio.timezone'))->startOfDay()->addDays($offset);
                    for ($attempt = 0; $attempt < 30; $attempt++) {
                        try {
                            app(SaveStudioBooking::class)->execute(['client_id' => $client->id, 'service_type' => $service, 'booking_date' => $date->format('Y-m-d'), 'start_time' => $start, 'end_time' => $end, 'price' => $price, 'status' => $status, 'notes' => $notes]);
                            break;
                        } catch (ValidationException $exception) {
                            if ($attempt === 29) {
                                throw $exception;
                            }
                            // Leave real sessions alone; move the fictional slot instead.
                            $date = $date->addDay();
                        }
                    }
                }
            }
        });
    }
}
