<?php
namespace Tests\Unit\Models;
use App\Models\{Client, Project};
use App\Enums\{ProjectStatus, ProjectType};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
class ProjectTest extends TestCase {
 use RefreshDatabase;
 public function test_reference_is_stable_and_supports_more_than_three_digits(): void {
  $project = Project::factory()->create(['id'=>1000, 'budget'=>'42000.10']);
  $this->assertSame('SID-1000', $project->reference);
  $project->update(['name'=>'Changed']);
  $this->assertSame('SID-1000', $project->fresh()->reference);
  $this->assertSame('42000.10', $project->fresh()->budget);
  $this->assertInstanceOf(ProjectStatus::class, $project->status);
  $this->assertInstanceOf(ProjectType::class, $project->type);
  $this->assertTrue($project->client->projects->contains($project));
 }
}

