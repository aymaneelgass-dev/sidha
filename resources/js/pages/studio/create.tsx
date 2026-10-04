import { Head } from '@inertiajs/react';
import { BookingForm } from '@/components/studio/booking-form';
import { index, store } from '@/routes/studio';
import type { StudioClient } from '@/types/studio';

export default function StudioCreate({
    clients,
    today,
    timezone,
}: {
    clients: StudioClient[];
    today: string;
    timezone: string;
}) {
    return (
        <>
            <Head title="Book a session" />
            <div className="min-w-0 space-y-8 p-4 md:p-8">
                <header>
                    <p className="text-primary text-xs tracking-widest uppercase">
                        Studio / New session
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                        Make room for sound.
                    </h2>
                </header>
                <BookingForm
                    clients={clients}
                    today={today}
                    timezone={timezone}
                    submitForm={store.form()}
                />
            </div>
        </>
    );
}
StudioCreate.layout = {
    title: 'Book a session',
    breadcrumbs: [{ title: 'Studio', href: index() }],
};
