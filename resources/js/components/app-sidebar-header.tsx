import { usePage } from '@inertiajs/react';
import { AppearanceMenu } from '@/components/shell/appearance-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

type HeaderPageProps = {
    pageTitle?: string;
    pageDescription?: string;
};

export function AppSidebarHeader({
    breadcrumbs = [],
    title,
    description,
}: {
    breadcrumbs?: BreadcrumbItemType[];
    title?: string;
    description?: string;
}) {
    const page = usePage<HeaderPageProps>();
    const lastBreadcrumb = breadcrumbs.at(-1)?.title;
    const pageTitle =
        page.props.pageTitle || title || lastBreadcrumb || 'Dashboard';
    const pageDescription = page.props.pageDescription || description;

    return (
        <header
            className="border-sidebar-border/70 bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-20 shrink-0 border-b px-4 backdrop-blur md:px-6"
            data-page-description={pageDescription}
            data-page-title={pageTitle}
        >
            <div className="flex h-16 min-w-0 items-center gap-3">
                <SidebarTrigger className="shrink-0" />

                <div className="min-w-0 flex-1">
                    <h1 className="truncate text-sm font-semibold tracking-tight sm:text-base">
                        {pageTitle}
                    </h1>
                    {pageDescription && (
                        <p className="text-muted-foreground hidden truncate text-xs sm:block">
                            {pageDescription}
                        </p>
                    )}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                    <AppearanceMenu />
                </div>
            </div>
        </header>
    );
}
