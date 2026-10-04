<?php

namespace Tests\Feature\Database;

use App\Models\Client;
use App\Models\Project;
use App\Models\StudioBooking;
use Database\Seeders\SidhaPhaseFourDemoSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SidhaPhaseFourDemoSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_fictional_demo_covers_services_statuses_and_preserves_existing_edits(): void
    {
        $project = Project::factory()->create(['budget' => '99.99']);
        $existing = StudioBooking::factory()->create(['booking_date' => now('Africa/Casablanca')->addDay()->format('Y-m-d'), 'start_time' => '00:00', 'end_time' => '23:59']);
        $this->seed(SidhaPhaseFourDemoSeeder::class);
        $this->assertSame(7, StudioBooking::count());
        $this->assertSame(4, StudioBooking::query()->distinct()->count('service_type'));
        $this->assertSame(4, StudioBooking::query()->distinct()->count('status'));
        $clientCount = Client::count();
        $demo = StudioBooking::where('id', '!=', $existing->id)->firstOrFail();
        $demo->update(['notes' => 'Edited by user', 'price' => '42.00']);
        $this->seed(SidhaPhaseFourDemoSeeder::class);
        $this->assertSame(7, StudioBooking::count());
        $this->assertSame($clientCount, Client::count());
        $this->assertSame('42.00', $demo->fresh()->price);
        $this->assertSame('Edited by user', $demo->fresh()->notes);
        $this->assertSame('99.99', $project->fresh()->budget);
        $this->assertSame('23:59:00', $existing->fresh()->end_time);
        foreach (StudioBooking::where('status', '!=', 'cancelled')->get() as $booking) {
            $this->assertFalse(StudioBooking::where('id', '!=', $booking->id)->where('status', '!=', 'cancelled')->where('booking_date', $booking->booking_date->format('Y-m-d'))->where('start_time', '<', $booking->end_time)->where('end_time', '>', $booking->start_time)->exists());
        }
    }

    public function test_demo_refuses_non_local_non_testing_environments(): void
    {
        $this->app->detectEnvironment(fn () => 'staging');
        $this->expectException(\LogicException::class);
        $this->seed(SidhaPhaseFourDemoSeeder::class);
    }
}
