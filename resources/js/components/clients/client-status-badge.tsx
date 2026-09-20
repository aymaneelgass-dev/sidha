import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ClientStatus } from '@/types/client';

const statusPresentation: Record<
    ClientStatus,
    { label: string; className: string }
> = {
    active: {
        label: 'Active',
        className:
            'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
    },
    inactive: {
        label: 'Inactive',
        className:
            'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
    },
    archived: {
        label: 'Archived',
        className:
            'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
    },
};

type ClientStatusBadgeProps = {
    status: ClientStatus;
    className?: string;
};

export function ClientStatusBadge({
    status,
    className,
}: ClientStatusBadgeProps) {
    const presentation = statusPresentation[status];

    return (
        <Badge
            variant="outline"
            className={cn(presentation.className, className)}
        >
            {presentation.label}
        </Badge>
    );
}
