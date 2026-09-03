import type { PropsWithChildren, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type DashboardCardProps = PropsWithChildren<{
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
    contentClassName?: string;
}>;

export function DashboardCard({
    title,
    description,
    action,
    className,
    contentClassName,
    children,
}: DashboardCardProps) {
    return (
        <section
            className={cn(
                'bg-card text-card-foreground min-w-0 rounded-xl border shadow-sm',
                className,
            )}
        >
            <div className="flex min-w-0 items-start justify-between gap-4 px-5 pt-5 sm:px-6 sm:pt-6">
                <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold tracking-tight">
                        {title}
                    </h2>
                    {description ? (
                        <p className="text-muted-foreground mt-1 text-sm">
                            {description}
                        </p>
                    ) : null}
                </div>
                {action ? <div className="shrink-0">{action}</div> : null}
            </div>
            <div
                className={cn(
                    'min-w-0 px-5 pb-5 sm:px-6 sm:pb-6',
                    contentClassName,
                )}
            >
                {children}
            </div>
        </section>
    );
}
