<?php

namespace App\Models;

use App\Enums\ProjectStatus;
use App\Enums\ProjectType;
use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $client_id
 * @property string $name
 * @property ProjectType $type
 * @property ProjectStatus $status
 * @property string $budget
 * @property Carbon|null $start_date
 * @property Carbon|null $deadline
 * @property string|null $brief
 * @property-read string $reference
 * @property-read Client $client
 * @property-read Collection<int, ProjectExpense> $expenses
 */
#[Fillable(['client_id', 'name', 'type', 'status', 'budget', 'start_date', 'deadline', 'brief'])]
class Project extends Model
{
    /** @use HasFactory<ProjectFactory> */
    use HasFactory;

    /** @return array<string,string> */
    protected function casts(): array
    {
        return ['type' => ProjectType::class, 'status' => ProjectStatus::class, 'budget' => 'decimal:2', 'start_date' => 'date', 'deadline' => 'date'];
    }

    public function getReferenceAttribute(): string
    {
        return 'SID-'.str_pad((string) $this->id, 3, '0', STR_PAD_LEFT);
    }

    /** @return BelongsTo<Client, $this> */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /** @return HasMany<ProjectExpense, $this> */
    public function expenses(): HasMany
    {
        return $this->hasMany(ProjectExpense::class);
    }
}
