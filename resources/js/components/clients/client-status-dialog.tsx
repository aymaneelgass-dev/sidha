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

type ClientStatusDialogProps = {
    clientName: string;
    action: 'archive' | 'reactivate';
    submitForm: RouteFormDefinition<'post'>;
};

export function ClientStatusDialog({
    clientName,
    action,
    submitForm,
}: ClientStatusDialogProps) {
    const [open, setOpen] = useState(false);
    const isArchive = action === 'archive';

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={isArchive ? 'destructive' : 'default'}>
                    {isArchive ? 'Archive' : 'Reactivate'}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isArchive ? 'Archive client?' : 'Reactivate client?'}
                    </DialogTitle>
                    <DialogDescription>
                        {isArchive
                            ? `${clientName} will remain available as an archived record.`
                            : `${clientName} will return to active client status.`}
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
                                    title={`Unable to ${action} this client.`}
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
                                        isArchive ? 'destructive' : 'default'
                                    }
                                    disabled={processing}
                                >
                                    {processing
                                        ? 'Updatingâ€¦'
                                        : isArchive
                                          ? 'Archive client'
                                          : 'Reactivate client'}
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
