<?php

namespace Tests\Feature\Database;

use App\Models\Client;
use App\Models\Project;
use App\Models\ProjectExpense;
use Database\Seeders\SidhaPhaseThreeDemoSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SidhaPhaseThreeDemoSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_demo_data_covers_stages_and_is_repeatable_without_overwriting_records(): void
    {
        $existing = Project::factory()->create(['name' => 'Existing production', 'budget' => '12.00']);
        $this->seed(SidhaPhaseThreeDemoSeeder::class);
        $this->assertSame(8, Project::count());
        $this->assertSame(7, Project::query()->distinct()->count('status'));
        $this->assertSame(4, Project::query()->distinct()->count('type'));
        $expenseCount = ProjectExpense::count();
        $clientCount = Client::count();
        $demo = Project::where('name', 'Night Current')->firstOrFail();
        $demo->update(['name' => 'Renamed by user', 'budget' => '99.99']);
        $this->seed(SidhaPhaseThreeDemoSeeder::class);
        $this->assertSame(8, Project::count());
        $this->assertSame($expenseCount, ProjectExpense::count());
        $this->assertSame($clientCount, Client::count());
        $this->assertSame('99.99', $demo->fresh()->budget);
        $this->assertSame('12.00', $existing->fresh()->budget);
    }

    public function test_seeder_refuses_non_local_non_testing_environments(): void
    {
        $this->app->detectEnvironment(fn () => 'staging');
        $this->expectException(\LogicException::class);
        $this->seed(SidhaPhaseThreeDemoSeeder::class);
    }
}
