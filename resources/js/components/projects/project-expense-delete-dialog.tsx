import { Form } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { destroy } from '@/routes/projects/expenses';
import type { ProjectExpense } from '@/types/project';
export function ProjectExpenseDeleteDialog({
    projectId,
    expense,
}: {
    projectId: number;
    expense: ProjectExpense;
}) {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    aria-label={'Delete ' + expense.label}
                >
                    Delete
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="min-w-0">
                    <DialogTitle>Delete expense?</DialogTitle>
                    <DialogDescription className="break-words">
                        “{expense.label}” will be permanently removed. The
                        project totals will be recalculated. This cannot be
                        undone.
                    </DialogDescription>
                </DialogHeader>
                <Form
                    {...destroy.form({
                        project: projectId,
                        expense: expense.id,
                    })}
                    disableWhileProcessing
                    onSuccess={() => {
                        setOpen(false);
                        requestAnimationFrame(() =>
                            document
                                .getElementById('expenses-heading')
                                ?.focus(),
                        );
                    }}
                >
                    {({ processing }) => (
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
                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={processing}
                            >
                                Delete expense
                            </Button>
                        </DialogFooter>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
