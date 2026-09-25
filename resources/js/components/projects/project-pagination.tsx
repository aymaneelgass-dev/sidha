import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import type { PaginatedProp } from '@/types/client';
export function ProjectPagination({
    page,
    label = 'projects',
}: {
    page: Omit<PaginatedProp<unknown>, 'data'>;
    label?: string;
}) {
    return (
        <nav
            aria-label={label + ' pagination'}
            className="flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-sm"
        >
            <p className="text-muted-foreground">
                {page.from ?? 0}–{page.to ?? 0} of {page.total} {label}
            </p>
            {page.last_page > 1 && (
                <div className="flex items-center gap-2">
                    {page.prev_page_url ? (
                        <Button variant="outline" size="sm" asChild>
                            <Link href={page.prev_page_url} preserveScroll>
                                Previous
                            </Link>
                        </Button>
                    ) : (
                        <Button variant="outline" size="sm" disabled>
                            Previous
                        </Button>
                    )}
                    <span className="text-xs">
                        {page.current_page} / {page.last_page}
                    </span>
                    {page.next_page_url ? (
                        <Button variant="outline" size="sm" asChild>
                            <Link href={page.next_page_url} preserveScroll>
                                Next
                            </Link>
                        </Button>
                    ) : (
                        <Button variant="outline" size="sm" disabled>
                            Next
                        </Button>
                    )}
                </div>
            )}
        </nav>
    );
}
