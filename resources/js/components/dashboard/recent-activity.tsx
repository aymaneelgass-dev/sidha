import {
    CalendarCheck2,
    CheckCircle2,
    FolderPlus,
    Upload,
    type LucideIcon,
} from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import type { ActivityKind, RecentActivity } from '@/types';

const iconByActivityKind: Record<ActivityKind, LucideIcon> = {
    approval: CheckCircle2,
    upload: Upload,
    project: FolderPlus,
    booking: CalendarCheck2,
};

export function RecentActivityList({
    activities,
}: {
    activities: readonly RecentActivity[];
}) {
    return (
        <DashboardCard
            title="Recent Activity"
            description="Latest updates from your workspace"
            className="xl:col-span-4"
            contentClassName="pt-4"
        >
            <ul className="divide-y" aria-label="Recent activity">
                {activities.map((activity) => {
                    const Icon = iconByActivityKind[activity.kind];

                    return (
                        <li
                            key={activity.id}
                            className="flex gap-3 py-4 first:pt-0 last:pb-0"
                        >
                            <span className="bg-muted text-muted-foreground inline-flex size-8 shrink-0 items-center justify-center rounded-lg">
                                <Icon className="size-4" aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-sm leading-5">
                                    {activity.message}
                                </p>
                                <time className="text-muted-foreground mt-1 block text-xs">
                                    {activity.time}
                                </time>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </DashboardCard>
    );
}
