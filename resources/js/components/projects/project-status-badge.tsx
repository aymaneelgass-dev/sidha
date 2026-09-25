import { projectStatuses } from '@/types/project';
import type { ProjectStatus } from '@/types/project';
export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
    return (
        <span className="inline-flex items-center gap-2 text-xs font-medium">
            <span
                aria-hidden="true"
                className={
                    status === 'archived'
                        ? 'bg-muted-foreground size-1.5 rounded-full'
                        : status === 'delivered'
                          ? 'size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400'
                          : 'bg-primary size-1.5 rounded-full'
                }
            />
            {projectStatuses[status]}
        </span>
    );
}
