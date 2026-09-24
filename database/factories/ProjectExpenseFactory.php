<?php
namespace Database\Factories;
use App\Models\{Project,ProjectExpense};
use Illuminate\Database\Eloquent\Factories\Factory;
/** @extends Factory<ProjectExpense> */
class ProjectExpenseFactory extends Factory {
 /** @return array<string,mixed> */
 public function definition(): array { return ['project_id'=>Project::factory(),'label'=>'Camera rental','amount'=>'1500.00','expense_date'=>null,'notes'=>null]; }
}
