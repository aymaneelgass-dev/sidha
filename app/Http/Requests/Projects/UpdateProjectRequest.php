<?php

namespace App\Http\Requests\Projects;

use App\Models\Project;

class UpdateProjectRequest extends StoreProjectRequest
{
    protected function prepareForValidation(): void
    {
        $project = $this->route('project');
        if ($project instanceof Project) {
            foreach (['start_date', 'deadline'] as $field) {
                if (! $this->exists($field)) {
                    $this->merge([$field => $project->{$field}?->format('Y-m-d')]);
                }
            }
        }
    }

    public function authorize(): bool
    {
        $project = $this->route('project');

        return $project instanceof Project && ($this->user()?->can('update', $project) ?? false);
    }
}
