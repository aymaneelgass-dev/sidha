<?php
namespace Tests\Unit\Policies;
use App\Models\{User, Project};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
class ProjectPolicyTest extends TestCase {
 use RefreshDatabase;
 public function test_active_admin_alone_can_mutate(): void {
  $record = Project::factory()->create();
  $admin=User::factory()->admin()->create();
  $member=User::factory()->member()->create();
  $suspended=User::factory()->admin()->suspended()->create();
  foreach (['update', 'archive'] as $ability) {
   $this->assertTrue($admin->can($ability,$record));
   $this->assertFalse($member->can($ability,$record));
   $this->assertFalse($suspended->can($ability,$record));
  }
  $this->assertTrue($admin->can('create',Project::class));
  $this->assertFalse($member->can('create',Project::class));
  $this->assertTrue($member->can('view',$record));
  $this->assertFalse($suspended->can('view',$record));
 }
}

