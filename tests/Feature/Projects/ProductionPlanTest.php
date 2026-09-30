<?php

namespace Tests\Feature\Projects;

use App\Models\ProductionPlan;
use App\Models\Project;
use App\Models\User;
use Database\Seeders\SidhaPhaseFiveDemoSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Factory;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProductionPlanTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        Http::preventStrayRequests();
        config(['services.openai.key' => 'test-key-not-real', 'services.openai.model' => 'gpt-5-mini']);
        $this->actingAs(User::factory()->admin()->create());
    }

    private function content(): array
    {
        return [
            'objective' => 'Introduce the fictional Aurora studio.',
            'creative_concept' => 'A tactile portrait of craft in natural light.',
            'script' => 'Open on hands at work. Reveal the studio. Close on its name.',
            'shot_list' => [['number' => 1, 'description' => 'Hands shape a clay bowl.', 'framing' => 'Close-up', 'notes' => 'Capture room tone.']],
            'voice_over' => ['required' => false, 'text' => null, 'notes' => 'Natural sound carries this portrait.'],
            'production_checklist' => [['category' => 'Permissions', 'task' => 'Confirm location and talent releases.']],
        ];
    }

    private function fakeResponse(?array $content = null): void
    {
        $this->resetHttp();
        Http::fake(['api.openai.com/v1/responses' => Http::response([
            'id' => 'resp_fictional', 'model' => 'gpt-5-mini-2025-08-07', 'status' => 'completed',
            'output' => [['type' => 'message', 'role' => 'assistant', 'content' => [['type' => 'output_text', 'text' => json_encode($content ?? $this->content())]]]],
        ])]);
    }

    private function resetHttp(): void
    {
        Http::swap(new Factory);
        Http::preventStrayRequests();
    }

    private function project(): Project
    {
        return Project::factory()->create(['name' => 'Aurora portrait', 'brief' => 'A natural-sound portrait of a fictional pottery studio. No voice over.', 'type' => 'corporate']);
    }

    private function saved(Project $project): ProductionPlan
    {
        return ProductionPlan::create(['project_id' => $project->id, 'content' => $this->content(), 'provider' => 'openai', 'model' => 'previous-model', 'response_id' => 'resp_previous', 'generated_at' => now()->subDay()]);
    }

    private function url(Project $project): string
    {
        return "/projects/{$project->id}/production-plan";
    }

    public function test_admin_generates_persists_and_exposes_a_structured_plan(): void
    {
        $project = $this->project();
        $this->fakeResponse();
        $this->post($this->url($project))->assertRedirect(route('projects.show', $project))->assertSessionHasNoErrors();
        $plan = ProductionPlan::sole();
        $this->assertSame($project->id, $plan->project_id);
        $this->assertSame($this->content(), $plan->content);
        $this->assertSame('openai', $plan->provider);
        $this->assertSame('gpt-5-mini-2025-08-07', $plan->model);
        $this->assertSame('resp_fictional', $plan->response_id);
        $this->assertNotNull($plan->generated_at);
        Http::assertSent(fn (Request $r) => $r->url() === 'https://api.openai.com/v1/responses'
            && $r['model'] === 'gpt-5-mini' && $r['store'] === false
            && $r['text']['format']['strict'] === true
            && str_contains($r['input'], $project->brief)
            && str_contains($r['input'], $project->client->name));
        $this->get(route('projects.show', $project))->assertInertia(fn (Assert $page) => $page
            ->component('projects/show')->where('productionPlan.content.objective', $this->content()['objective'])->where('can.generatePlan', true));
    }

    public function test_member_can_read_but_cannot_generate_or_replace(): void
    {
        $project = $this->project();
        $plan = $this->saved($project);
        $this->actingAs(User::factory()->member()->create());
        $this->get(route('projects.show', $project))->assertInertia(fn (Assert $page) => $page->where('productionPlan.id', $plan->id)->where('can.generatePlan', false));
        $this->post($this->url($project), ['replace' => true, 'expected_updated_at' => $plan->updated_at->toISOString()])->assertForbidden();
        $this->post($this->url($this->project()))->assertForbidden();
        Http::assertNothingSent();
    }

    public function test_replacement_requires_confirmation_and_current_revision(): void
    {
        $project = $this->project();
        $plan = $this->saved($project);
        $this->post($this->url($project))->assertSessionHasErrors('production_plan');
        $this->post($this->url($project), ['replace' => true, 'expected_updated_at' => 'stale'])->assertSessionHasErrors('production_plan');
        Http::assertNothingSent();
        $this->fakeResponse([...$this->content(), 'objective' => 'A refreshed treatment.']);
        $this->post($this->url($project), ['replace' => true, 'expected_updated_at' => $plan->updated_at->toISOString()])->assertSessionHasNoErrors();
        $this->assertDatabaseCount('production_plans', 1);
        $this->assertSame($plan->id, ProductionPlan::sole()->id);
        $this->assertSame('A refreshed treatment.', $plan->fresh()->content['objective']);
    }

    public function test_invalid_outputs_preserve_the_previous_plan(): void
    {
        $project = $this->project();
        $plan = $this->saved($project);
        $before = $plan->fresh()->getAttributes();
        foreach ([['objective' => 'Incomplete'], [...$this->content(), 'objective' => '   '], [...$this->content(), 'shot_list' => []], [...$this->content(), 'extra' => 'Unexpected'], [...$this->content(), 'voice_over' => ['required' => false, 'text' => 'Invented VO', 'notes' => 'None']]] as $content) {
            $this->fakeResponse($content);
            $this->post($this->url($project), ['replace' => true, 'expected_updated_at' => $plan->updated_at->toISOString()])->assertSessionHasErrors('production_plan');
            $this->assertSame($before, $plan->fresh()->getAttributes());
        }
    }

    public function test_provider_failures_and_malformed_json_preserve_the_previous_plan(): void
    {
        $project = $this->project();
        $plan = $this->saved($project);
        $before = $plan->fresh()->getAttributes();
        foreach ([Http::response(['error' => ['message' => 'Private provider error']], 429), Http::response(['status' => 'incomplete', 'output' => []]), Http::response(['status' => 'completed', 'output' => [['type' => 'message', 'content' => [['type' => 'refusal', 'refusal' => 'No']]]]]), Http::response(['status' => 'completed', 'output' => [['type' => 'message', 'content' => [['type' => 'output_text', 'text' => '{invalid']]]]])] as $response) {
            $this->resetHttp();
            Http::fake(['*' => $response]);
            $this->post($this->url($project), ['replace' => true, 'expected_updated_at' => $plan->updated_at->toISOString()])->assertSessionHasErrors('production_plan');
            $this->assertSame($before, $plan->fresh()->getAttributes());
        }
        $this->resetHttp();
        Http::fake(['*' => Http::failedConnection()]);
        $this->post($this->url($project), ['replace' => true, 'expected_updated_at' => $plan->updated_at->toISOString()])->assertSessionHasErrors('production_plan');
        $this->assertSame($before, $plan->fresh()->getAttributes());
    }

    public function test_missing_configuration_and_brief_do_not_call_openai(): void
    {
        $project = $this->project();
        foreach (['key', 'model'] as $key) {
            $value = config("services.openai.{$key}");
            config(["services.openai.{$key}" => ' ']);
            $this->post($this->url($project))->assertSessionHasErrors('production_plan');
            config(["services.openai.{$key}" => $value]);
        }
        $project->update(['brief' => ' ']);
        $this->post($this->url($project))->assertSessionHasErrors('production_plan');
        Http::assertNothingSent();
        $this->assertDatabaseEmpty('production_plans');
    }

    public function test_project_lock_prevents_duplicate_calls(): void
    {
        $project = $this->project();
        $lock = Cache::lock("production-plan:{$project->id}", 120);
        $lock->get();
        try {
            $this->post($this->url($project))->assertSessionHasErrors('production_plan');
            Http::assertNothingSent();
        } finally {
            $lock->release();
        }
    }

    public function test_a_plan_changed_during_generation_is_not_overwritten(): void
    {
        $project = $this->project();
        $plan = $this->saved($project);
        Http::fake(function () use ($plan) {
            $plan->update(['updated_at' => now()->addMinute(), 'content' => [...$this->content(), 'objective' => 'Newer saved treatment.']]);

            return Http::response(['status' => 'completed', 'model' => 'gpt-5-mini', 'id' => 'resp_late', 'output' => [['type' => 'message', 'content' => [['type' => 'output_text', 'text' => json_encode($this->content())]]]]]);
        });
        $revision = $plan->updated_at->toISOString();
        $this->post($this->url($project), ['replace' => true, 'expected_updated_at' => $revision])->assertSessionHasErrors('production_plan');
        $this->assertSame('Newer saved treatment.', $plan->fresh()->content['objective']);
    }

    public function test_suspended_user_cannot_generate(): void
    {
        $project = $this->project();
        $this->actingAs(User::factory()->admin()->suspended()->create());
        $this->post($this->url($project))->assertRedirect(route('login'));
        Http::assertNothingSent();
    }

    public function test_guest_cannot_generate(): void
    {
        auth()->forgetGuards();
        $this->post($this->url($this->project()))->assertRedirect(route('login'));
        Http::assertNothingSent();
    }

    public function test_missing_config_preserves_existing_plan_and_plans_are_project_scoped(): void
    {
        $project = $this->project();
        $plan = $this->saved($project);
        $before = $plan->fresh()->getAttributes();
        config(['services.openai.key' => null]);
        $this->post($this->url($project), ['replace' => true, 'expected_updated_at' => $plan->updated_at->toISOString()])->assertSessionHasErrors('production_plan');
        $this->assertSame($before, $plan->fresh()->getAttributes());
        $other = $this->project();
        $this->get(route('projects.show', $other))->assertInertia(fn (Assert $page) => $page->where('productionPlan', null));
        Http::assertNothingSent();
    }

    public function test_demo_seeder_is_fictional_idempotent_and_preserves_edits(): void
    {
        $this->seed(SidhaPhaseFiveDemoSeeder::class);
        $plan = ProductionPlan::sole();
        $this->assertSame('demo', $plan->provider);
        $this->assertSame('handwritten-fictional', $plan->model);
        $this->assertNull($plan->response_id);
        $plan->update(['content' => [...$plan->content, 'objective' => 'User edit to preserve.']]);
        $this->seed(SidhaPhaseFiveDemoSeeder::class);
        $this->assertDatabaseCount('production_plans', 1);
        $this->assertSame('User edit to preserve.', $plan->fresh()->content['objective']);
        Http::assertNothingSent();
    }
}
