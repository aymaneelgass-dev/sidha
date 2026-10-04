<?php

namespace App\Http\Controllers;

use App\Actions\Projects\CalculateProjectFinancials;
use App\Enums\ProjectStatus;
use App\Http\Requests\Projects\ProjectIndexRequest;
use App\Http\Requests\Projects\StoreProjectRequest;
use App\Http\Requests\Projects\UpdateProjectRequest;
use App\Models\Client;
use App\Models\Project;
use App\Models\ProjectExpense;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(ProjectIndexRequest $request): Response
    {
        Gate::authorize('viewAny', Project::class);
        $filters = $request->safe()->only(['search', 'status', 'type']);
        $search = $filters['search'] ?? '';
        $projects = Project::query()->with('client:id,name')
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")->orWhereHas('client', fn (Builder $q) => $q->where('name', 'like', "%{$search}%"));
                    if (preg_match('/^SID-0*(\\d+)$/i', $search, $matches)) {
                        $query->orWhere('id', $matches[1]);
                    }
                });
            })
            ->when($filters['status'] ?? null, fn (Builder $q, string $v) => $q->where('status', $v))
            ->when($filters['type'] ?? null, fn (Builder $q, string $v) => $q->where('type', $v))
            ->orderByDesc('created_at')->orderByDesc('id')->paginate(15)->withQueryString()
            ->through(fn (Project $project) => $this->projectData($project));

        return Inertia::render('projects/index', [
            'projects' => $projects, 'filters' => ['search' => $search, 'status' => $filters['status'] ?? '', 'type' => $filters['type'] ?? ''],
            'can' => ['create' => $request->user()->can('create', Project::class)],
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Project::class);

        return Inertia::render('projects/create', ['clients' => $this->clients()]);
    }

    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $project = Project::create($request->validated());
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Project created.']);

        return to_route('projects.show', $project);
    }

    public function show(Request $request, Project $project): Response
    {
        Gate::authorize('view', $project);
        $project->load('client:id,name', 'productionPlan');

        return Inertia::render('projects/show', [
            'project' => $this->projectData($project),
            'aiProvider' => config('services.ai_provider', 'openai'),
            'productionPlan' => $project->productionPlan ? [
                'id' => $project->productionPlan->id,
                'content' => $project->productionPlan->content,
                'provider' => $project->productionPlan->provider,
                'model' => $project->productionPlan->model,
                'generated_at' => $project->productionPlan->generated_at->toISOString(),
                'updated_at' => $project->productionPlan->updated_at->toISOString(),
            ] : null,
            'financials' => app(CalculateProjectFinancials::class)->execute($project),
            'expenses' => $project->expenses()->orderByRaw('expense_date IS NULL')->orderByDesc('expense_date')->orderByDesc('id')->paginate(15)->withQueryString()->through(fn (ProjectExpense $expense): array => [
                'id' => $expense->id, 'label' => $expense->label, 'amount' => $expense->amount, 'expense_date' => $expense->expense_date?->format('Y-m-d'), 'notes' => $expense->notes,
            ]),
            'can' => ['update' => $request->user()->can('update', $project), 'archive' => $request->user()->can('archive', $project), 'manageExpenses' => $request->user()->can('create', ProjectExpense::class), 'generatePlan' => $request->user()->can('generatePlan', $project)],
        ]);
    }

    public function edit(Project $project): Response
    {
        Gate::authorize('update', $project);
        $project->load('client:id,name');

        return Inertia::render('projects/edit', ['project' => $this->projectData($project), 'clients' => $this->clients($project->client_id)]);
    }

    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        $project->update($request->validated());
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Project updated.']);

        return to_route('projects.show', $project);
    }

    public function archive(Project $project): RedirectResponse
    {
        Gate::authorize('archive', $project);
        $project->update(['status' => ProjectStatus::Archived]);
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Project archived.']);

        return to_route('projects.show', $project);
    }

    /** @return Collection<int,Client> */
    private function clients(?int $current = null): Collection
    {
        return Client::query()->where(function (Builder $q) use ($current): void {
            $q->where('status', '!=', 'archived');
            if ($current !== null) {
                $q->orWhere('id', $current);
            }
        })->orderBy('name')->get(['id', 'name', 'status']);
    }

    /** @return array<string,mixed> */
    private function projectData(Project $project): array
    {
        return ['id' => $project->id, 'reference' => $project->reference, 'name' => $project->name,
            'client_id' => $project->client_id, 'client' => ['id' => $project->client->id, 'name' => $project->client->name],
            'type' => $project->type->value, 'status' => $project->status->value, 'budget' => $project->budget,
            'start_date' => $project->start_date?->format('Y-m-d'), 'deadline' => $project->deadline?->format('Y-m-d'), 'brief' => $project->brief];
    }
}
