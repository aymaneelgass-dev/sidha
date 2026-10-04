<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Services\ProductionPlanner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ProductionPlanController extends Controller
{
    public function store(Request $request, Project $project, ProductionPlanner $planner): RedirectResponse
    {
        Gate::authorize('generatePlan', $project);
        $data = $request->validate(['replace' => ['sometimes', 'boolean'], 'expected_updated_at' => ['nullable', 'string', 'max:100']]);
        $planner->generate($project, (bool) ($data['replace'] ?? false), $data['expected_updated_at'] ?? null);
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Production plan saved. Review it before production.']);

        return to_route('projects.show', $project);
    }
}
