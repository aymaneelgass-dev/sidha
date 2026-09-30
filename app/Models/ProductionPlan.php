<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $project_id
 * @property array<string, mixed> $content
 * @property string $provider
 * @property string $model
 * @property string|null $response_id
 * @property Carbon $generated_at
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
#[Fillable(['project_id', 'content', 'provider', 'model', 'response_id', 'generated_at'])]
class ProductionPlan extends Model
{
    protected $dateFormat = 'Y-m-d H:i:s.u';

    /** @return array<string, string> */
    protected function casts(): array
    {
        return ['content' => 'array', 'generated_at' => 'datetime'];
    }

    /** @return BelongsTo<Project, $this> */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
