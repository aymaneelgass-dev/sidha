import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { TeamMemberRole } from '@/types/team';

const rolePresentation: Record<
    TeamMemberRole,
    { label: string; className: string }
> = {
    admin: {
        label: 'Admin',
        className:
            'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-300',
    },
    member: {
        label: 'Member',
        className:
            'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300',
    },
};

type MemberRoleBadgeProps = {
    role: TeamMemberRole;
    className?: string;
};

export function MemberRoleBadge({ role, className }: MemberRoleBadgeProps) {
    const presentation = rolePresentation[role];

    return (
        <Badge
            variant="outline"
            className={cn(presentation.className, className)}
        >
            {presentation.label}
        </Badge>
    );
}
