<?php

namespace App\Http\Requests\ProjectExpenses;

use App\Models\ProjectExpense;
use Illuminate\Foundation\Http\FormRequest;

class StoreProjectExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', ProjectExpense::class) ?? false;
    }

    /** @return array<string,list<mixed>> */
    public function rules(): array
    {
        return [
            'label' => ['required', 'string', 'max:150'],
            'amount' => ['required', 'numeric', 'gt:0', 'max:9999999999.99', 'regex:/^\\d{1,10}(\\.\\d{1,2})?$/'],
            'expense_date' => ['nullable', 'date_format:Y-m-d'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
