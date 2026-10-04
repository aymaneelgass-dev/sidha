<?php

namespace Tests\Feature\Projects;

use App\Models\Project;
use App\Models\ProjectExpense;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProjectFinancialsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_finances_are_exact_with_empty_zero_and_negative_margin(): void
    {
        $project = Project::factory()->create(['budget' => '0.00']);
        $this->actingAs(User::factory()->member()->create());
        $this->get("/projects/{$project->id}")->assertInertia(fn (Assert $p) => $p->where('financials.total_expenses', '0.00')->where('financials.estimated_margin', '0.00'));
        ProjectExpense::factory()->for($project)->create(['amount' => '0.10']);
        ProjectExpense::factory()->for($project)->create(['amount' => '0.20']);
        $this->get("/projects/{$project->id}")->assertInertia(fn (Assert $p) => $p->where('financials.total_expenses', '0.30')->where('financials.estimated_margin', '-0.30')->where('can.manageExpenses', false));
    }

    public function test_totals_include_all_pages_and_recalculate_after_mutations(): void
    {
        $project = Project::factory()->create(['budget' => '100.00']);
        ProjectExpense::factory()->count(16)->for($project)->create(['amount' => '1.01']);
        $expense = ProjectExpense::factory()->for($project)->create(['amount' => '0.10', 'expense_date' => '2026-09-24']);
        $this->actingAs(User::factory()->admin()->create());
        $this->get("/projects/{$project->id}?page=2")->assertInertia(fn (Assert $p) => $p->has('expenses.data', 2)->where('financials.total_expenses', '16.26')->where('financials.estimated_margin', '83.74'));
        $this->put("/projects/{$project->id}/expenses/{$expense->id}", ['label' => 'Updated', 'amount' => '0.20'])->assertSessionHasNoErrors();
        $this->get("/projects/{$project->id}")->assertInertia(fn (Assert $p) => $p->where('financials.total_expenses', '16.36'));
        $this->delete("/projects/{$project->id}/expenses/{$expense->id}");
        $this->get("/projects/{$project->id}")->assertInertia(fn (Assert $p) => $p->where('financials.total_expenses', '16.16'));
    }

    public function test_maximum_amounts_and_order_are_preserved(): void
    {
        $project = Project::factory()->create(['budget' => '9999999999.99']);
        ProjectExpense::factory()->for($project)->create(['amount' => '9999999999.99', 'expense_date' => null]);
        $dated = ProjectExpense::factory()->for($project)->create(['amount' => '9999999999.99', 'expense_date' => '2026-09-24']);
        $this->actingAs(User::factory()->member()->create())->get("/projects/{$project->id}")->assertInertia(fn (Assert $p) => $p->where('financials.total_expenses', '19999999999.98')->where('financials.estimated_margin', '-9999999999.99')->where('expenses.data.0.id', $dated->id));
    }
}
