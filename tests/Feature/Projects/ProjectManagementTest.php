<?php

namespace Tests\Feature\Projects;

use App\Models\Client;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    private function payload(): array
    {
        return ['name' => '  Night current  ', 'client_id' => Client::factory()->create()->id, 'type' => 'music-video', 'status' => 'brief', 'budget' => '42000.10', 'start_date' => null, 'deadline' => null, 'brief' => null];
    }

    public function test_admin_can_create_edit_archive_and_restore_project(): void
    {
        $this->actingAs(User::factory()->admin()->create());
        $data = $this->payload();
        $this->get('/projects/create')->assertOk();
        $this->post('/projects', $data)->assertSessionHasNoErrors()->assertRedirect();
        $project = Project::firstOrFail();
        $this->assertSame('Night current', $project->name);
        $this->assertSame('42000.10', $project->budget);
        $reference = $project->reference;
        $this->get("/projects/{$project->id}/edit")->assertOk();
        $this->put("/projects/{$project->id}", [...$data, 'status' => 'post-production', 'reference' => 'FORGED'])->assertSessionHasNoErrors();
        $this->patch("/projects/{$project->id}/archive")->assertRedirect();
        $this->assertSame('archived', $project->fresh()->status->value);
        $this->put("/projects/{$project->id}", [...$data, 'status' => 'production'])->assertSessionHasNoErrors();
        $this->assertSame($reference, $project->fresh()->reference);
        $this->assertSame('production', $project->fresh()->status->value);
    }

    public function test_member_cannot_mutate_or_open_admin_forms(): void
    {
        $project = Project::factory()->create();
        $this->actingAs(User::factory()->member()->create());
        $this->get('/projects/create')->assertForbidden();
        $this->get("/projects/{$project->id}/edit")->assertForbidden();
        $this->post('/projects', [])->assertForbidden();
        $this->put("/projects/{$project->id}", [])->assertForbidden();
        $this->patch("/projects/{$project->id}/archive")->assertForbidden();
    }

    public function test_invalid_money_dates_and_enums_are_rejected_without_writing(): void
    {
        $this->actingAs(User::factory()->admin()->create());
        $data = $this->payload();
        foreach (['-1', '1.001', '10000000000', '1e3'] as $budget) {
            $this->post('/projects', [...$data, 'budget' => $budget])->assertSessionHasErrors('budget');
        }
        $this->post('/projects', [...$data, 'name' => ' ', 'client_id' => 999999, 'type' => 'studio', 'status' => 'paid', 'start_date' => '2026-10-20', 'deadline' => '2026-10-19'])->assertSessionHasErrors(['name', 'client_id', 'type', 'status', 'deadline']);
        $this->assertDatabaseEmpty('projects');
        $this->post('/projects', [...$data, 'budget' => '0', 'deadline' => '2026-10-19'])->assertSessionHasNoErrors();
    }

    public function test_archived_client_cannot_be_newly_assigned_but_can_be_retained(): void
    {
        $this->actingAs(User::factory()->admin()->create());
        $data = $this->payload();
        $client = Client::factory()->archived()->create();
        $this->post('/projects', [...$data, 'client_id' => $client->id])->assertSessionHasErrors('client_id');
        $project = Project::factory()->for($client)->create();
        $this->put("/projects/{$project->id}", [...$data, 'client_id' => $client->id])->assertSessionHasNoErrors();
    }

    public function test_partial_date_updates_cannot_invert_the_saved_schedule(): void
    {
        $this->actingAs(User::factory()->admin()->create());
        $project = Project::factory()->create(['start_date' => '2026-10-20', 'deadline' => '2026-10-30']);
        $data = ['name' => $project->name, 'client_id' => $project->client_id, 'type' => 'music-video', 'status' => 'brief', 'budget' => '100'];
        $this->put("/projects/{$project->id}", [...$data, 'deadline' => '2026-10-19'])->assertSessionHasErrors('deadline');
        $this->put("/projects/{$project->id}", [...$data, 'start_date' => '2026-11-01'])->assertSessionHasErrors('deadline');
        $this->assertSame('2026-10-20', $project->fresh()->start_date->format('Y-m-d'));
        $this->put("/projects/{$project->id}", [...$data, 'start_date' => null, 'deadline' => '2026-10-19'])->assertSessionHasNoErrors();
    }
}
