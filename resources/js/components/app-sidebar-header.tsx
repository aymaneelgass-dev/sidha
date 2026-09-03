import { usePage } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import { AppearanceMenu } from '@/components/shell/appearance-menu';
import { HeaderSearch } from '@/components/shell/header-search';
import { Button } from '@/components/ui/button';
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

                <div className="hidden w-full max-w-sm md:block">
                    <HeaderSearch />
                </div>

                <div className="flex shrink-0 items-center gap-1">
                    <AppearanceMenu />
                    <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        aria-label="Notifications"
                        className="relative"
                    >
                        <Bell aria-hidden="true" />
                        <span
                            className="bg-primary absolute top-2 right-2 size-1.5 rounded-full"
                            aria-hidden="true"
                        />
                    </Button>
                </div>
            </div>

            <div className="pb-3 md:hidden">
                <HeaderSearch />
            </div>
        </header>
    );
}
