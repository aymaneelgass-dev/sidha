import { Clock3 } from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import type { BookingStatus, StudioBooking } from '@/types';

const statusClasses: Record<BookingStatus, string> = {
    Confirmed: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300',
    Pending: 'bg-amber-500/12 text-amber-700 dark:text-amber-300',
};

export function StudioBookings({
    bookings,
}: {
    bookings: readonly StudioBooking[];
}) {
    return (
        <DashboardCard
            title="Studio Bookings"
            description="Room reservations at a glance"
            className="xl:col-span-4"
            contentClassName="pt-4"
        >
            <ul className="divide-y" aria-label="Studio bookings">
                {bookings.map((booking) => (
                    <li
                        key={booking.id}
                        className="flex min-w-0 items-start justify-between gap-3 py-4 first:pt-0 last:pb-0"
                    >
                        <div className="min-w-0">
                            <h3 className="truncate text-sm font-medium">
                                {booking.room}
                            </h3>
                            <p className="text-muted-foreground mt-1 truncate text-xs">
                                {booking.client}
                            </p>
                            <p className="text-muted-foreground mt-2 flex items-center gap-1.5 text-xs">
                                <Clock3
                                    className="size-3 shrink-0"
                                    aria-hidden="true"
                                />
                                {booking.time}
                            </p>
                        </div>
                        <span
                            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${statusClasses[booking.status]}`}
                        >
                            <span
                                className="size-1.5 rounded-full bg-current"
                                aria-hidden="true"
                            />
                            {booking.status}
                        </span>
                    </li>
                ))}
            </ul>
        </DashboardCard>
    );
}
