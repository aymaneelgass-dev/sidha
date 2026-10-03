import { Link, type InertiaLinkProps } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';

type SidhaAiCardProps = {
    href: NonNullable<InertiaLinkProps['href']>;
};

export function SidhaAiCard({ href }: SidhaAiCardProps) {
    return (
        <div className="sidha-surface-glow border-sidebar-border bg-sidebar-accent/50 rounded-xl border p-3 group-data-[collapsible=icon]:hidden">
            <Sparkles className="text-primary mb-3 size-5" aria-hidden="true" />
            <p className="text-sm font-medium">AI Production Planner</p>
            <p className="text-sidebar-foreground/60 mt-1 text-xs">
                Build a production treatment from a saved project brief.
            </p>
            <Link
                href={href}
                className="bg-primary text-primary-foreground mt-3 inline-flex h-8 w-full items-center justify-center rounded-lg text-xs font-semibold"
            >
                Browse projects
            </Link>
        </div>
    );
}
