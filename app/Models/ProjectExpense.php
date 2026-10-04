<?php

namespace App\Models;

use Database\Factories\ProjectExpenseFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $project_id
 * @property string $label
 * @property string $amount
 * @property Carbon|null $expense_date
 * @property string|null $notes
 * @property-read Project $project
 */
#[Fillable(['label', 'amount', 'expense_date', 'notes'])]
class ProjectExpense extends Model
{
    /** @use HasFactory<ProjectExpenseFactory> */
    use HasFactory;

    /** @return array<string,string> */
    protected function casts(): array
    {
        return ['amount' => 'decimal:2', 'expense_date' => 'date'];
    }

    /** @return BelongsTo<Project, $this> */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
