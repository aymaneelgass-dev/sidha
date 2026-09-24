<?php
namespace Tests\Unit\Models;
use App\Models\ProjectExpense;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
class ProjectExpenseTest extends TestCase {
 use RefreshDatabase;
 public function test_expense_belongs_to_project_and_preserves_cents(): void {
  $expense = ProjectExpense::factory()->create(['amount'=>'275.45', 'expense_date'=>null]);
  $this->assertSame('275.45', $expense->fresh()->amount);
  $this->assertNull($expense->expense_date);
  $this->assertTrue($expense->project->expenses->contains($expense));
 }
}

