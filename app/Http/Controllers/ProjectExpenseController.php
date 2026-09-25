<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProjectExpenses\StoreProjectExpenseRequest;
use App\Http\Requests\ProjectExpenses\UpdateProjectExpenseRequest;
use App\Models\Project;
use App\Models\ProjectExpense;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ProjectExpenseController extends Controller
{
    public function store(StoreProjectExpenseRequest $request, Project $project): RedirectResponse
    {
        $project->expenses()->create($request->validated());
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Expense added.']);

        return to_route('projects.show', $project);
    }

    public function update(UpdateProjectExpenseRequest $request, Project $project, ProjectExpense $expense): RedirectResponse
    {
        $expense->update($request->validated());
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Expense updated.']);

        return to_route('projects.show', $project);
    }

    public function destroy(Project $project, ProjectExpense $expense): RedirectResponse
    {
        Gate::authorize('delete', $expense);
        $expense->delete();
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Expense deleted.']);

        return to_route('projects.show', $project);
    }
}
