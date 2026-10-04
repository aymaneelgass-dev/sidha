import { cn } from '@/lib/utils';
import { studioStatuses } from '@/types/studio';
import type { StudioBooking } from '@/types/studio';

const styles = {
    scheduled: 'border-border text-foreground',
    'in-progress': 'border-primary/30 bg-primary/10 text-primary',
    completed: 'border-border bg-muted text-muted-foreground',
    cancelled: 'border-dashed border-border text-muted-foreground',
};

export function StudioStatus({ status }: { status: StudioBooking['status'] }) {
    return (
        <span
            className={cn(
                'inline-flex shrink-0 items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium',
                styles[status],
            )}
        >
            <span
                aria-hidden="true"
                className={cn(
                    'size-1.5 rounded-full bg-current',
                    status === 'cancelled' && 'opacity-40',
                )}
            />
            {studioStatuses[status]}
        </span>
    );
}
