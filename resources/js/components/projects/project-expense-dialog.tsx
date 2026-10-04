import { Form } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { store, update } from '@/routes/projects/expenses';
import type { ProjectExpense } from '@/types/project';
export function ProjectExpenseDialog({
    projectId,
    expense,
}: {
    projectId: number;
    expense?: ProjectExpense;
}) {
    const [open, setOpen] = useState(false);
    const prefix = 'expense-' + (expense?.id ?? 'new');
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={expense ? 'ghost' : 'default'}
                    size="sm"
                    aria-label={expense ? 'Edit ' + expense.label : undefined}
                >
                    {expense ? 'Edit' : 'Add expense'}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90dvh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {expense ? 'Edit expense' : 'Add expense'}
                    </DialogTitle>
                    <DialogDescription>
                        Record a production cost in MAD.
                    </DialogDescription>
                </DialogHeader>
                <Form
                    {...(expense
                        ? update.form({
                              project: projectId,
                              expense: expense.id,
                          })
                        : store.form(projectId))}
                    disableWhileProcessing
                    options={{ preserveScroll: true }}
                    onSuccess={() => setOpen(false)}
                >
                    {({ errors, processing }) => (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor={prefix + '-label'}>Label</Label>
                                <Input
                                    id={prefix + '-label'}
                                    name="label"
                                    required
                                    maxLength={150}
                                    defaultValue={expense?.label}
                                    aria-invalid={!!errors.label}
                                    aria-describedby={prefix + '-label-error'}
                                    className="mt-2"
                                />
                                <InputError
                                    id={prefix + '-label-error'}
                                    message={errors.label}
                                />
                            </div>
                            <div>
                                <Label htmlFor={prefix + '-amount'}>
                                    Amount (MAD)
                                </Label>
                                <Input
                                    id={prefix + '-amount'}
                                    name="amount"
                                    type="number"
                                    inputMode="decimal"
                                    min="0.01"
                                    max="9999999999.99"
                                    step="0.01"
                                    required
                                    defaultValue={expense?.amount}
                                    aria-invalid={!!errors.amount}
                                    aria-describedby={prefix + '-amount-error'}
                                    className="mt-2"
                                />
                                <InputError
                                    id={prefix + '-amount-error'}
                                    message={errors.amount}
                                />
                            </div>
                            <div>
                                <Label htmlFor={prefix + '-date'}>
                                    Expense date (optional)
                                </Label>
                                <Input
                                    id={prefix + '-date'}
                                    name="expense_date"
                                    type="date"
                                    defaultValue={expense?.expense_date ?? ''}
                                    aria-invalid={!!errors.expense_date}
                                    aria-describedby={prefix + '-date-error'}
                                    className="mt-2"
                                />
                                <InputError
                                    id={prefix + '-date-error'}
                                    message={errors.expense_date}
                                />
                            </div>
                            <div>
                                <Label htmlFor={prefix + '-notes'}>
                                    Notes (optional)
                                </Label>
                                <Textarea
                                    id={prefix + '-notes'}
                                    name="notes"
                                    rows={3}
                                    maxLength={5000}
                                    defaultValue={expense?.notes ?? ''}
                                    aria-invalid={!!errors.notes}
                                    aria-describedby={prefix + '-notes-error'}
                                    className="mt-2"
                                />
                                <InputError
                                    id={prefix + '-notes-error'}
                                    message={errors.notes}
                                />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={processing}
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving…' : 'Save expense'}
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
