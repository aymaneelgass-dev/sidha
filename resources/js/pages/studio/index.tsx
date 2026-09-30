import { Head, Link } from '@inertiajs/react';
import { AudioLines, Plus } from 'lucide-react';
import { ProjectPagination } from '@/components/projects/project-pagination';
import { SessionBoard } from '@/components/studio/session-board';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { create, index } from '@/routes/studio';
import type { PaginatedProp } from '@/types/client';
import { studioServices, studioStatuses } from '@/types/studio';
import type { StudioBooking, StudioFilters } from '@/types/studio';

export default function StudioIndex({
    bookings,
    filters,
    today,
    timezone,
    can,
}: {
    bookings: PaginatedProp<StudioBooking>;
    filters: StudioFilters;
    today: string;
    timezone: string;
    can: { create: boolean };
}) {
    const filtered = Boolean(
        filters.search ||
        filters.status ||
        filters.service_type ||
        filters.date,
    );
    const selectClass =
        'bg-background focus-visible:outline-ring mt-2 h-10 w-full rounded-md border px-3 text-sm focus-visible:outline-2';
    return (
        <>
            <Head title="Studio" />
            <div className="min-w-0 p-4 md:p-8">
                <header className="flex flex-wrap items-end justify-between gap-5 pb-8">
                    <div>
                        <p className="text-primary mb-3 text-xs font-medium tracking-[0.2em] uppercase">
                            SIDHA / Sound department
                        </p>
                        <h2 className="text-5xl font-semibold tracking-tight md:text-6xl">
                            Studio<span className="text-primary">.</span>
                        </h2>
                        <p className="text-muted-foreground mt-3 text-sm">
                            Space for the next take. Time for every voice.
                        </p>
                    </div>
                    <div className="space-y-3 sm:text-right">
                        {can.create && (
                            <Button
                                asChild
                                className="dark:bg-violet-700 dark:hover:bg-violet-800"
                            >
                                <Link href={create()}>
                                    <Plus aria-hidden="true" />
                                    Book a session
                                </Link>
                            </Button>
                        )}
                        <p className="text-muted-foreground text-xs">
                            All times · {timezone}
                        </p>
                    </div>
                </header>
                <nav
                    aria-label="Studio views"
                    className="flex flex-wrap gap-6 border-b"
                >
                    {(
                        [
                            ['upcoming', 'Upcoming sessions'],
                            ['history', 'History & other statuses'],
                        ] as const
                    ).map(([view, label]) => (
                        <Link
                            key={view}
                            href={index({ query: { view } })}
                            aria-current={
                                filters.view === view ? 'page' : undefined
                            }
                            className={cn(
                                'focus-visible:outline-ring border-b-2 py-3 text-sm focus-visible:outline-2',
                                filters.view === view
                                    ? 'border-primary font-semibold'
                                    : 'text-muted-foreground hover:text-foreground border-transparent',
                            )}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>
                <form
                    key={JSON.stringify(filters)}
                    action={index.url()}
                    method="get"
                    className="grid items-end gap-3 border-b py-5 sm:grid-cols-2 xl:grid-cols-[minmax(10rem,1fr)_10rem_10rem_10rem_auto]"
                >
                    <input type="hidden" name="view" value={filters.view} />
                    <div>
                        <Label htmlFor="search">Client search</Label>
                        <Input
                            id="search"
                            name="search"
                            defaultValue={filters.search}
                            placeholder="Find a client"
                            maxLength={100}
                            className="mt-2 h-10"
                        />
                    </div>
                    <div>
                        <Label htmlFor="service-filter">Session type</Label>
                        <select
                            id="service-filter"
                            name="service_type"
                            defaultValue={filters.service_type}
                            className={selectClass}
                        >
                            <option value="">All services</option>
                            {Object.entries(studioServices).map(
                                ([v, label]) => (
                                    <option key={v} value={v}>
                                        {label}
                                    </option>
                                ),
                            )}
                        </select>
                    </div>
                    <div>
                        <Label htmlFor="status-filter">Status</Label>
                        <select
                            id="status-filter"
                            name="status"
                            defaultValue={filters.status}
                            className={selectClass}
                        >
                            <option value="">All statuses</option>
                            {Object.entries(studioStatuses)
                                .filter(
                                    ([v]) =>
                                        filters.view === 'history' ||
                                        v === 'scheduled' ||
                                        v === 'in-progress',
                                )
                                .map(([v, label]) => (
                                    <option key={v} value={v}>
                                        {label}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div>
                        <Label htmlFor="date-filter">Session date</Label>
                        <Input
                            id="date-filter"
                            type="date"
                            name="date"
                            defaultValue={filters.date}
                            className="mt-2 h-10 min-w-0"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            variant="secondary"
                            className="h-10"
                        >
                            Apply filters
                        </Button>
                        {filtered && (
                            <Button asChild variant="ghost" className="h-10">
                                <Link
                                    href={index({
                                        query: { view: filters.view },
                                    })}
                                >
                                    Clear
                                </Link>
                            </Button>
                        )}
                    </div>
                </form>
                <div className="flex flex-wrap items-baseline justify-between gap-3 py-6">
                    <h3 className="text-xs font-medium tracking-[0.18em] uppercase">
                        {filters.view === 'upcoming'
                            ? 'Session board'
                            : 'Session archive'}
                    </h3>
                    <p className="text-muted-foreground font-mono text-xs">
                        {String(bookings.total).padStart(2, '0')}{' '}
                        {bookings.total === 1 ? 'session' : 'sessions'}
                    </p>
                </div>
                {bookings.data.length ? (
                    <SessionBoard bookings={bookings.data} today={today} />
                ) : (
                    <section className="py-12">
                        <AudioLines
                            aria-hidden="true"
                            className="text-primary mb-5 size-8"
                        />
                        <h3 className="text-2xl font-semibold tracking-tight">
                            {filtered
                                ? 'No sessions match these filters.'
                                : filters.view === 'upcoming'
                                  ? 'The studio is ready for its next session.'
                                  : 'Every session leaves a record.'}
                        </h3>
                        <p className="text-muted-foreground mt-3 max-w-lg text-sm">
                            {filtered
                                ? 'Try a different client, date or session type.'
                                : filters.view === 'upcoming'
                                  ? 'Scheduled and in-progress sessions appear here until their end time.'
                                  : 'Past, completed and cancelled sessions appear here, with their original details.'}
                        </p>
                        {filtered ? (
                            <Button asChild variant="outline" className="mt-6">
                                <Link
                                    href={index({
                                        query: { view: filters.view },
                                    })}
                                >
                                    Clear filters
                                </Link>
                            </Button>
                        ) : (
                            can.create && (
                                <Button
                                    asChild
                                    variant="outline"
                                    className="mt-6"
                                >
                                    <Link href={create()}>Book a session</Link>
                                </Button>
                            )
                        )}
                    </section>
                )}
                <div className="mt-6">
                    <ProjectPagination page={bookings} label="sessions" />
                </div>
            </div>
        </>
    );
}

StudioIndex.layout = {
    title: 'Studio',
    breadcrumbs: [{ title: 'Studio', href: index() }],
};
