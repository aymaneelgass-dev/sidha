<?php

namespace App\Http\Requests\Projects;

use App\Enums\ProjectStatus;
use App\Enums\ProjectType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectIndexRequest extends FormRequest
{
    /** @return array<string,list<mixed>> */
    public function rules(): array
    {
        return ['search' => ['nullable', 'string', 'max:100'], 'status' => ['nullable', Rule::enum(ProjectStatus::class)], 'type' => ['nullable', Rule::enum(ProjectType::class)], 'page' => ['nullable', 'integer', 'min:1']];
    }
}
