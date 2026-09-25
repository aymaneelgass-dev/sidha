<?php

namespace Tests\Feature\Projects;

use App\Enums\ProjectStatus;
use App\Models\Client;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProjectReadTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_member_can_read_project_but_has_no_mutation_capability(): void
    {
        $project = Project::factory()->create();
        $this->actingAs(User::factory()->member()->create())->get('/projects')->assertOk()->assertInertia(fn (Assert $p) => $p->component('projects/index')->has('projects.data', 1)->where('can.create', false));
        $this->get("/projects/{$project->id}")->assertOk()->assertInertia(fn (Assert $p) => $p->component('projects/show')->where('project.reference', 'SID-001')->where('can.update', false));
    }

    public function test_filters_search_and_pagination_are_combined_and_preserved(): void
    {
        $client = Client::factory()->create(['name' => 'Fictional Beacon']);
        Project::factory()->count(16)->for($client)->create(['name' => 'Night film', 'status' => 'production']);
        Project::factory()->create(['status' => 'archived', 'type' => 'corporate']);
        $this->actingAs(User::factory()->member()->create());
        $this->get('/projects?search=Beacon&status=production&type=music-video')->assertInertia(fn (Assert $p) => $p->has('projects.data', 15)->where('projects.total', 16)->where('filters.search', 'Beacon')->where('projects.next_page_url', fn ($url) => str_contains($url, 'status=production') && str_contains($url, 'search=Beacon')));
        $this->get('/projects?search=SID-001')->assertInertia(fn (Assert $p) => $p->has('projects.data', 1)->where('projects.data.0.id', 1));
        $this->get('/projects?status=archived')->assertInertia(fn (Assert $p) => $p->has('projects.data', 1));
    }

    public function test_guests_unverified_and_suspended_accounts_cannot_access_projects(): void
    {
        $this->get('/projects')->assertRedirect('/login');
        $this->actingAs(User::factory()->unverified()->create())->get('/projects')->assertRedirect(route('verification.notice'));
        $this->actingAs(User::factory()->suspended()->create())->get('/projects')->assertRedirect('/login');
    }

    public function test_detail_preserves_each_stage_optional_values_and_civil_dates(): void
    {
        $this->actingAs(User::factory()->member()->create());
        foreach (ProjectStatus::cases() as $status) {
            $project = Project::factory()->create(['status' => $status, 'start_date' => '2026-10-01', 'deadline' => '2026-10-18', 'brief' => "First frame.\nLast frame."]);
            $this->get("/projects/{$project->id}")->assertInertia(fn (Assert $p) => $p->where('project.status', $status->value)->where('project.start_date', '2026-10-01')->where('project.deadline', '2026-10-18')->where('project.brief', "First frame.\nLast frame.")->where('project.client.id', $project->client_id));
        }
        $empty = Project::factory()->create();
        $this->get("/projects/{$empty->id}")->assertInertia(fn (Assert $p) => $p->where('project.brief', null)->where('project.deadline', null));
    }
}
