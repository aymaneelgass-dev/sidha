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
import { cancel } from '@/routes/studio';
import type { StudioBooking } from '@/types/studio';

export function CancelBookingDialog({ booking }: { booking: StudioBooking }) {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Cancel session</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="min-w-0">
                    <DialogTitle>Cancel this session?</DialogTitle>
                    <DialogDescription className="break-words">
                        The {booking.start_time} session for{' '}
                        {booking.client.name} will remain in the history. Its
                        time slot will become available again.
                    </DialogDescription>
                </DialogHeader>
                <Form
                    {...cancel.form(booking.id)}
                    disableWhileProcessing
                    onSuccess={() => {
                        setOpen(false);
                        requestAnimationFrame(() =>
                            document.getElementById('session-title')?.focus(),
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
                                    Keep session
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="dark:bg-violet-700 dark:hover:bg-violet-800"
                            >
                                Confirm cancellation
                            </Button>
                        </DialogFooter>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
