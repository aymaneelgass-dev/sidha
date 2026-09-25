import type { ProjectExpense } from '@/types/project';
import type { PaginatedProp } from '@/types/client';
import { money, productionDate } from './project-format';
import { ProjectPagination } from './project-pagination';
import { ProjectExpenseDialog } from './project-expense-dialog';
import { ProjectExpenseDeleteDialog } from './project-expense-delete-dialog';
export function ProjectExpenseList({
    projectId,
    expenses,
    canManage,
}: {
    projectId: number;
    expenses: PaginatedProp<ProjectExpense>;
    canManage: boolean;
}) {
    return (
        <section aria-labelledby="expenses-heading">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3
                        id="expenses-heading"
                        tabIndex={-1}
                        className="focus-visible:outline-ring text-xl font-semibold tracking-tight focus-visible:outline-2"
                    >
                        Production expenses{' '}
                        <span className="text-muted-foreground ml-2 font-mono text-xs">
                            {expenses.total}
                        </span>
                    </h3>
                    <p className="text-muted-foreground mt-1 text-xs">
                        The costs behind the production.
                    </p>
                </div>
                {canManage && <ProjectExpenseDialog projectId={projectId} />}
            </div>
            {expenses.data.length ? (
                <ul className="divide-y border-t">
                    {expenses.data.map((expense) => (
                        <li
                            key={expense.id}
                            className="grid min-w-0 gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto]"
                        >
                            <div className="min-w-0">
                                <p className="text-sm font-medium break-words">
                                    {expense.label}
                                </p>
                                <p className="text-muted-foreground mt-1 text-xs">
                                    {expense.expense_date
                                        ? productionDate(expense.expense_date)
                                        : 'Date not specified'}
                                </p>
                                {expense.notes && (
                                    <p className="text-muted-foreground mt-2 max-w-2xl text-sm break-words whitespace-pre-wrap">
                                        {expense.notes}
                                    </p>
                                )}
                            </div>
                            <div className="min-w-0 sm:text-right">
                                <p className="font-medium break-words tabular-nums">
                                    {money(expense.amount)}
                                </p>
                                {canManage && (
                                    <div className="mt-2 flex flex-wrap gap-1 sm:justify-end">
                                        <ProjectExpenseDialog
                                            projectId={projectId}
                                            expense={expense}
                                        />
                                        <ProjectExpenseDeleteDialog
                                            projectId={projectId}
                                            expense={expense}
                                        />
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted-foreground border-t py-8 text-sm">
                    No expenses recorded.
                    {canManage
                        ? ' Add the first production cost when it is known.'
                        : ''}
                </p>
            )}
            <ProjectPagination page={expenses} label="expenses" />
        </section>
    );
}
