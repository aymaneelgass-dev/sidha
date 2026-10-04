import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import { money } from '@/components/projects/project-format';
import {
    sessionDate,
    sessionDuration,
} from '@/components/studio/studio-format';
import { StudioStatus } from '@/components/studio/studio-status';
import { show } from '@/routes/studio';
import { studioServices } from '@/types/studio';
import type { StudioBooking } from '@/types/studio';

export function SessionBoard({
    bookings,
    today,
}: {
    bookings: readonly StudioBooking[];
    today: string;
}) {
    const days: Record<string, StudioBooking[]> = {};
    for (const booking of bookings) {
        (days[booking.booking_date] ??= []).push(booking);
    }

    return (
        <div className="space-y-9">
            {Object.entries(days).map(([date, sessions]) => (
                <section key={date} aria-labelledby={`day-${date}`}>
                    <header className="flex flex-wrap items-center gap-3 border-b pb-3">
                        <h3
                            id={`day-${date}`}
                            className="text-sm font-semibold"
                        >
                            <time dateTime={date}>{sessionDate(date)}</time>
                        </h3>
                        {date === today && (
                            <span className="text-primary text-xs font-semibold uppercase">
                                Today
                            </span>
                        )}
                        <span className="text-muted-foreground ml-auto font-mono text-xs">
                            {String(sessions.length).padStart(2, '0')} on this
                            page
                        </span>
                    </header>
                    <ol>
                        {sessions.map((booking) => (
                            <li key={booking.id} className="border-b">
                                <Link
                                    href={show(booking.id)}
                                    className="group hover:bg-muted/40 focus-visible:outline-ring grid min-w-0 gap-4 px-2 py-6 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 sm:grid-cols-[10rem_minmax(0,1fr)] xl:grid-cols-[12rem_minmax(0,1fr)_auto]"
                                >
                                    <div>
                                        <div className="flex items-baseline gap-2 font-mono tabular-nums sm:block">
                                            <span className="text-3xl font-medium tracking-tight lg:text-4xl">
                                                {booking.start_time}
                                            </span>
                                            <span className="text-muted-foreground text-lg sm:mt-1 sm:block">
                                                <span className="sr-only">
                                                    to{' '}
                                                </span>
                                                <span aria-hidden="true">
                                                    —{' '}
                                                </span>
                                                {booking.end_time}
                                            </span>
                                        </div>
                                        <p className="text-muted-foreground mt-2 text-xs">
                                            {sessionDuration(
                                                booking.start_time,
                                                booking.end_time,
                                            )}
                                        </p>
                                    </div>
                                    <div className="min-w-0 self-center">
                                        <p className="text-primary mb-2 text-xs font-medium tracking-[0.14em] uppercase">
                                            {
                                                studioServices[
                                                    booking.service_type
                                                ]
                                            }
                                        </p>
                                        <h4 className="text-xl font-semibold tracking-tight break-words md:text-2xl">
                                            {booking.client.name}
                                        </h4>
                                        <p className="text-muted-foreground mt-2 font-mono text-xs">
                                            SESSION /{' '}
                                            {String(booking.id).padStart(
                                                3,
                                                '0',
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-between gap-3 sm:col-start-2 xl:col-start-3 xl:flex-col xl:items-end xl:justify-center xl:gap-4">
                                        <StudioStatus status={booking.status} />
                                        <span className="flex items-center gap-4 font-mono text-sm tabular-nums">
                                            {money(booking.price)}
                                            <ArrowUpRight
                                                aria-hidden="true"
                                                className="text-muted-foreground group-hover:text-primary size-4"
                                            />
                                        </span>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ol>
                </section>
            ))}
        </div>
    );
}
