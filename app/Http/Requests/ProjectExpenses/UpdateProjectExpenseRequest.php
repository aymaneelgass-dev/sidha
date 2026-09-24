<?php
namespace App\Http\Requests\ProjectExpenses;
use App\Models\ProjectExpense;
class UpdateProjectExpenseRequest extends StoreProjectExpenseRequest {
 public function authorize(): bool {
  $expense=$this->route('expense');
  return $expense instanceof ProjectExpense && ($this->user()?->can('update',$expense) ?? false);
 }
}
