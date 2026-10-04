import { Form } from '@inertiajs/react';
import { useState } from 'react';
import AlertError from '@/components/alert-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import type { RouteFormDefinition } from '@/wayfinder';

type MemberStatusDialogProps = {
    memberName: string;
    action: 'suspend' | 'reactivate';
    submitForm: RouteFormDefinition<'post'>;
};

export function MemberStatusDialog({
    memberName,
    action,
    submitForm,
}: MemberStatusDialogProps) {
    const [open, setOpen] = useState(false);
    const isSuspend = action === 'suspend';

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant={isSuspend ? 'destructive' : 'default'}
                    aria-label={`${isSuspend ? 'Suspend' : 'Reactivate'} ${memberName}`}
                >
                    {isSuspend ? 'Suspend' : 'Reactivate'}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isSuspend
                            ? 'Suspend team member?'
                            : 'Reactivate team member?'}
                    </DialogTitle>
                    <DialogDescription>
                        {isSuspend
                            ? `${memberName} will immediately lose access to SIDHA. You cannot suspend yourself or the last active Admin.`
                            : `${memberName} will regain access after signing in with a verified account.`}
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...submitForm}
                    options={{ preserveScroll: true }}
                    disableWhileProcessing
                    onSuccess={() => setOpen(false)}
                >
                    {({ processing, errors, hasErrors }) => (
                        <div className="space-y-4">
                            {hasErrors ? (
                                <AlertError
                                    title={`Unable to ${action} this member.`}
                                    errors={Object.values(errors).flatMap(
                                        (error) =>
                                            Array.isArray(error)
                                                ? error
                                                : [error],
                                    )}
                                />
                            ) : null}
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
                                    variant={
                                        isSuspend ? 'destructive' : 'default'
                                    }
                                    disabled={processing}
                                >
                                    {processing
                                        ? 'Updating…'
                                        : isSuspend
                                          ? 'Suspend member'
                                          : 'Reactivate member'}
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
