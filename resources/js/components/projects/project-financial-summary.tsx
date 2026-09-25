import type { ProjectFinancials } from '@/types/project';
import { money } from './project-format';
export function ProjectFinancialSummary({
    financials,
}: {
    financials: ProjectFinancials;
}) {
    const negative = financials.estimated_margin.startsWith('-');
    return (
        <section aria-label="Project finances" className="bg-card border-y">
            <dl className="grid divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
                {[
                    ['Budget', financials.budget],
                    ['Expenses', financials.total_expenses],
                    ['Est. margin', financials.estimated_margin],
                ].map(([label, value], i) => (
                    <div key={label} className="min-w-0 px-4 py-5 md:px-6">
                        <dt className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase">
                            {label}
                        </dt>
                        <dd
                            className={
                                'mt-3 text-2xl font-semibold tracking-tight break-words tabular-nums ' +
                                (i === 2 && negative
                                    ? 'text-red-700 dark:text-red-400'
                                    : '')
                            }
                        >
                            {money(value)}
                        </dd>
                        {i === 2 && negative && (
                            <p className="mt-2 text-xs text-red-700 dark:text-red-400">
                                Expenses exceed the project budget.
                            </p>
                        )}
                    </div>
                ))}
            </dl>
        </section>
    );
}
