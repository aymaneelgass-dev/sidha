import { Head } from '@inertiajs/react';
import { BookingForm } from '@/components/studio/booking-form';
import { index, update } from '@/routes/studio';
import type { StudioBooking, StudioClient } from '@/types/studio';

export default function StudioEdit({
    booking,
    clients,
    timezone,
}: {
    booking: StudioBooking;
    clients: StudioClient[];
    timezone: string;
}) {
    return (
        <>
            <Head title="Edit session" />
            <div className="min-w-0 space-y-8 p-4 md:p-8">
                <header>
                    <p className="text-primary font-mono text-xs">
                        SESSION / {String(booking.id).padStart(3, '0')}
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight break-words md:text-4xl">
                        Adjust the session.
                    </h2>
                    <p className="text-muted-foreground mt-2 text-sm break-words">
                        {booking.client.name}
                    </p>
                </header>
                <BookingForm
                    booking={booking}
                    clients={clients}
                    timezone={timezone}
                    submitForm={update.form(booking.id)}
                />
            </div>
        </>
    );
}
StudioEdit.layout = {
    title: 'Edit session',
    breadcrumbs: [{ title: 'Studio', href: index() }],
};
