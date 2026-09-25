<?php

namespace Tests\Feature\Projects;

use App\Models\Project;
use App\Models\ProjectExpense;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectExpenseTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_admin_can_add_update_delete_expenses_without_reassigning_parent(): void
    {
        $project = Project::factory()->create();
        $other = Project::factory()->create();
        $this->actingAs(User::factory()->admin()->create());
        $this->post("/projects/{$project->id}/expenses", ['label' => ' Camera hire ', 'amount' => '100.25', 'project_id' => $other->id])->assertSessionHasNoErrors()->assertRedirect();
        $expense = $project->expenses()->firstOrFail();
        $this->assertSame('Camera hire', $expense->label);
        $this->put("/projects/{$project->id}/expenses/{$expense->id}", ['label' => 'Camera hire', 'amount' => '150.50', 'project_id' => $other->id])->assertSessionHasNoErrors();
        $this->assertSame($project->id, $expense->fresh()->project_id);
        $this->assertSame('150.50', $expense->fresh()->amount);
        $this->delete("/projects/{$project->id}/expenses/{$expense->id}")->assertRedirect();
        $this->assertDatabaseMissing('project_expenses', ['id' => $expense->id]);
    }

    public function test_member_cannot_mutate_any_expense(): void
    {
        $expense = ProjectExpense::factory()->create();
        $base = "/projects/{$expense->project_id}/expenses";
        $this->actingAs(User::factory()->member()->create());
        $this->post($base, [])->assertForbidden();
        $this->put("$base/{$expense->id}", [])->assertForbidden();
        $this->delete("$base/{$expense->id}")->assertForbidden();
    }

    public function test_admin_cannot_address_an_expense_through_another_project(): void
    {
        $expense = ProjectExpense::factory()->create();
        $other = Project::factory()->create();
        $this->actingAs(User::factory()->admin()->create());
        $this->put("/projects/{$other->id}/expenses/{$expense->id}", ['label' => 'Wrong', 'amount' => '1'])->assertNotFound();
        $this->delete("/projects/{$other->id}/expenses/{$expense->id}")->assertNotFound();
        $this->assertSame('1500.00', $expense->fresh()->amount);
    }

    public function test_invalid_expenses_do_not_write_and_return_field_errors(): void
    {
        $project = Project::factory()->create();
        $this->actingAs(User::factory()->admin()->create());
        foreach (['0', '-2', '1.001', '10000000000', '1e2'] as $amount) {
            $this->post("/projects/{$project->id}/expenses", ['label' => 'Hire', 'amount' => $amount])->assertSessionHasErrors('amount');
        }
        $this->post("/projects/{$project->id}/expenses", ['label' => ' ', 'amount' => '1', 'expense_date' => '2026-02-30', 'notes' => str_repeat('a', 5001)])->assertSessionHasErrors(['label', 'expense_date', 'notes']);
        $this->assertDatabaseEmpty('project_expenses');
    }
}
