import {
    CalendarDays,
    MapPin,
    Mic2,
    Video,
    type LucideIcon,
} from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import type { ScheduleItem } from '@/types';

const iconByScheduleKind: Record<ScheduleItem['kind'], LucideIcon> = {
    shoot: Video,
    studio: Mic2,
    meeting: CalendarDays,
};

export function UpcomingSchedule({
    items,
}: {
    items: readonly ScheduleItem[];
}) {
    return (
        <DashboardCard
            title="Upcoming Schedule"
            description="The next sessions and meetings"
            className="xl:col-span-5"
            contentClassName="pt-4"
        >
            <ol className="divide-y" aria-label="Upcoming schedule">
                {items.map((item) => {
                    const Icon = iconByScheduleKind[item.kind];

                    return (
                        <li
                            key={item.id}
                            className="flex gap-3 py-4 first:pt-0 last:pb-0"
                        >
                            <span className="bg-muted text-muted-foreground flex w-12 shrink-0 items-center justify-center rounded-lg px-1 py-2 text-center text-xs font-semibold">
                                {item.date}
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="flex min-w-0 items-start gap-2">
                                    <span className="bg-primary/12 text-primary inline-flex size-7 shrink-0 items-center justify-center rounded-lg">
                                        <Icon
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <h3 className="min-w-0 pt-0.5 text-sm font-medium">
                                        {item.title}
                                    </h3>
                                </div>
                                <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                                    <time dateTime={item.time}>
                                        {item.time}
                                    </time>
                                    <span className="flex items-center gap-1">
                                        <MapPin
                                            className="size-3"
                                            aria-hidden="true"
                                        />
                                        {item.location}
                                    </span>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </DashboardCard>
    );
}
