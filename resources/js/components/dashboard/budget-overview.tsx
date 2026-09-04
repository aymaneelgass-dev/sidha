import { DashboardCard } from '@/components/dashboard/dashboard-card';
import type { BudgetOverview } from '@/types';

const amountFormatter = new Intl.NumberFormat('en-US');

function formatAmount(amount: number) {
    return `${amountFormatter.format(amount)} MAD`;
}

export function BudgetOverviewCard({ budget }: { budget: BudgetOverview }) {
    return (
        <DashboardCard
            title="Budget Overview"
            description="Current production budget allocation"
            className="xl:col-span-4"
            contentClassName="pt-4"
        >
            <dl className="grid grid-cols-3 gap-3">
                <div className="min-w-0">
                    <dt className="text-muted-foreground text-xs">Total</dt>
                    <dd className="mt-1 truncate text-sm font-semibold">
                        {formatAmount(budget.total)}
                    </dd>
                </div>
                <div className="min-w-0">
                    <dt className="text-muted-foreground text-xs">Used</dt>
                    <dd className="mt-1 truncate text-sm font-semibold">
                        {formatAmount(budget.used)}
                    </dd>
                </div>
                <div className="min-w-0">
                    <dt className="text-muted-foreground text-xs">Remaining</dt>
                    <dd className="mt-1 truncate text-sm font-semibold">
                        {formatAmount(budget.remaining)}
                    </dd>
                </div>
            </dl>
            <div className="mt-5">
                <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                    <span className="text-muted-foreground">Budget used</span>
                    <span className="font-medium">{budget.percentage}%</span>
                </div>
                <div
                    className="bg-muted h-2 overflow-hidden rounded-full"
                    role="progressbar"
                    aria-label="Budget used"
                    aria-valuenow={budget.percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                >
                    <div
                        className="bg-primary h-full rounded-full"
                        style={{ width: `${budget.percentage}%` }}
                    />
                </div>
            </div>
            <ul className="mt-5 space-y-3" aria-label="Budget allocations">
                {budget.allocations.map((allocation) => (
                    <li
                        key={allocation.label}
                        className="flex min-w-0 items-center justify-between gap-3 text-sm"
                    >
                        <span className="flex min-w-0 items-center gap-2">
                            <span
                                className="size-2.5 shrink-0 rounded-full"
                                style={{ backgroundColor: allocation.color }}
                                aria-hidden="true"
                            />
                            <span className="truncate">{allocation.label}</span>
                        </span>
                        <span className="shrink-0 font-medium">
                            {formatAmount(allocation.amount)}
                        </span>
                    </li>
                ))}
            </ul>
        </DashboardCard>
    );
}
