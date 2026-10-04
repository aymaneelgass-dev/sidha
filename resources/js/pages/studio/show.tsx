import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowUpRight, Pencil } from 'lucide-react';
import { money } from '@/components/projects/project-format';
import { CancelBookingDialog } from '@/components/studio/cancel-booking-dialog';
import {
    sessionDate,
    sessionDuration,
} from '@/components/studio/studio-format';
import { StudioStatus } from '@/components/studio/studio-status';
import { Button } from '@/components/ui/button';
import { show as showClient } from '@/routes/clients';
import { edit, index } from '@/routes/studio';
import { studioServices } from '@/types/studio';
import type { StudioBooking } from '@/types/studio';

export default function StudioShow({
    booking,
    timezone,
    can,
}: {
    booking: StudioBooking;
    timezone: string;
    can: { update: boolean; cancel: boolean };
}) {
    return (
        <>
            <Head
                title={`${studioServices[booking.service_type]} · ${booking.client.name}`}
            />
            <div className="min-w-0 p-4 md:p-8">
                <Link
                    href={index()}
                    className="text-muted-foreground hover:text-foreground focus-visible:outline-ring inline-flex items-center gap-2 text-sm focus-visible:outline-2"
                >
                    <ArrowLeft aria-hidden="true" className="size-4" />
                    Session board
                </Link>
                <header className="mt-7 flex flex-wrap items-end justify-between gap-5 border-b pb-7">
                    <div className="min-w-0">
                        <p className="text-primary mb-3 text-xs font-medium tracking-widest uppercase">
                            Studio / {studioServices[booking.service_type]}
                        </p>
                        <h2
                            id="session-title"
                            tabIndex={-1}
                            className="focus-visible:outline-ring text-3xl font-semibold tracking-tight break-words focus-visible:outline-2 md:text-5xl"
                        >
                            {booking.client.name}
                        </h2>
                        <p className="text-muted-foreground mt-3 font-mono text-xs">
                            SESSION / {String(booking.id).padStart(3, '0')}
                        </p>
                    </div>
                    <StudioStatus status={booking.status} />
                </header>
                <div className="grid gap-8 py-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                    <section className="min-w-0" aria-label="Session schedule">
                        <p className="text-sm font-medium">
                            <time dateTime={booking.booking_date}>
                                {sessionDate(booking.booking_date)}
                            </time>
                        </p>
                        <div className="my-7 flex flex-wrap items-baseline gap-x-4 gap-y-2 font-mono text-5xl tracking-tight tabular-nums sm:text-6xl xl:text-7xl">
                            <span>{booking.start_time}</span>
                            <span className="text-muted-foreground text-2xl">
                                <span className="sr-only">to</span>
                                <span aria-hidden="true">—</span>
                            </span>
                            <span className="text-muted-foreground">
                                {booking.end_time}
                            </span>
                        </div>
                        <div className="text-muted-foreground flex flex-wrap gap-x-6 gap-y-2 text-sm">
                            <span>
                                {sessionDuration(
                                    booking.start_time,
                                    booking.end_time,
                                )}
                            </span>
                            <span>{timezone}</span>
                        </div>
                        <div className="mt-9 border-t pt-6">
                            <h3 className="text-xs font-medium tracking-widest uppercase">
                                Session notes
                            </h3>
                            <p className="text-muted-foreground mt-4 text-sm leading-relaxed break-words whitespace-pre-wrap">
                                {booking.notes || 'No session notes added.'}
                            </p>
                        </div>
                    </section>
                    <aside className="border-primary min-w-0 space-y-6 border-t-2 pt-5">
                        <div>
                            <p className="text-muted-foreground text-xs tracking-widest uppercase">
                                Session price
                            </p>
                            <p className="mt-3 font-mono text-2xl break-words tabular-nums">
                                {money(booking.price)}
                            </p>
                        </div>
                        <div className="border-t pt-5">
                            <p className="text-muted-foreground mb-3 text-xs tracking-widest uppercase">
                                Client
                            </p>
                            <Link
                                href={showClient(booking.client_id)}
                                className="focus-visible:outline-ring inline-flex max-w-full items-center gap-2 text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2"
                            >
                                <span className="min-w-0 break-words">
                                    {booking.client.name}
                                </span>
                                <ArrowUpRight
                                    aria-hidden="true"
                                    className="size-4 shrink-0"
                                />
                            </Link>
                        </div>
                        {booking.status === 'cancelled' && (
                            <p className="text-muted-foreground border-t pt-5 text-sm">
                                This session is cancelled. Its time slot is
                                available for other bookings.
                            </p>
                        )}
                        {can.update && (
                            <div className="flex flex-wrap gap-3 border-t pt-5">
                                <Button
                                    asChild
                                    className="dark:bg-violet-700 dark:hover:bg-violet-800"
                                >
                                    <Link href={edit(booking.id)}>
                                        <Pencil aria-hidden="true" />
                                        Edit session
                                    </Link>
                                </Button>
                                {can.cancel &&
                                    booking.status !== 'cancelled' && (
                                        <CancelBookingDialog
                                            booking={booking}
                                        />
                                    )}
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </>
    );
}
StudioShow.layout = {
    title: 'Studio session',
    breadcrumbs: [{ title: 'Studio', href: index() }],
};
