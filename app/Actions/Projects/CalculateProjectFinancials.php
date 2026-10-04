<?php

namespace App\Actions\Projects;

use App\Models\Project;

class CalculateProjectFinancials
{
    /** @return array{budget:string,total_expenses:string,estimated_margin:string} */
    public function execute(Project $project): array
    {
        $total = 0;
        // Read source decimals, not a floating-point SUM (SQLite tests and MySQL agree).
        foreach ($project->expenses()->select(['id', 'amount'])->lazyById(500) as $expense) {
            $total += $this->cents($expense->amount);
        }

        return ['budget' => $project->budget, 'total_expenses' => $this->decimal($total), 'estimated_margin' => $this->decimal($this->cents($project->budget) - $total)];
    }

    private function cents(string $amount): int
    {
        [$whole,$fraction] = explode('.', $amount);

        return ((int) $whole) * 100 + (int) $fraction;
    }

    private function decimal(int $amount): string
    {
        $absolute = abs($amount);

        return ($amount < 0 ? '-' : '').intdiv($absolute, 100).'.'.str_pad((string) ($absolute % 100), 2, '0', STR_PAD_LEFT);
    }
}
