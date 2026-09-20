import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { TeamMemberStatus } from '@/types/team';

const statusPresentation: Record<
    TeamMemberStatus,
    { label: string; className: string }
> = {
    active: {
        label: 'Active',
        className:
            'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
    },
    suspended: {
        label: 'Suspended',
        className:
            'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
    },
};

type MemberStatusBadgeProps = {
    status: TeamMemberStatus;
    className?: string;
};

export function MemberStatusBadge({
    status,
    className,
}: MemberStatusBadgeProps) {
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
