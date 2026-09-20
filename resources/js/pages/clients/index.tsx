import { Head, Link } from '@inertiajs/react';
import { Plus, Search, UsersRound } from 'lucide-react';
import { ClientList } from '@/components/clients/client-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { create, index } from '@/routes/clients';
import type {
    ClientCounts,
    ClientFilters,
    ClientListItem,
    ClientStatus,
    PaginatedProp,
} from '@/types/client';

type ClientIndexProps = {
    clients: PaginatedProp<ClientListItem>;
    filters: ClientFilters;
    counts: ClientCounts;
    can: {
        create: boolean;
    };
};

const countCards: readonly {
    key: keyof ClientCounts;
    label: string;
    description: string;
}[] = [
    { key: 'all', label: 'All clients', description: 'Total records' },
    { key: 'active', label: 'Active', description: 'Current relationships' },
    { key: 'inactive', label: 'Inactive', description: 'Paused relationships' },
    { key: 'archived', label: 'Archived', description: 'Historical records' },
];

function paginationLabel(label: string): string {
    return label.replace('&laquo;', '‹').replace('&raquo;', '›');
}

export default function ClientIndex({
    clients,
    filters,
    counts,
    can,
}: ClientIndexProps) {
    const hasFilters = filters.search !== '' || filters.status !== '';

    return (
        <>
            <Head title="Clients" />

            <div className="min-w-0 space-y-5 p-4 md:p-6">
                <section aria-labelledby="client-directory-heading">
                    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div className="min-w-0">
                            <h2
                                id="client-directory-heading"
                                className="text-xl font-semibold tracking-tight"
                            >
                                Client directory
                            </h2>
                            <p className="text-muted-foreground mt-1 text-sm">
                                Browse client relationships and their primary
                                contacts.
                            </p>
                        </div>
                        {can.create ? (
                            <div
                                data-slot="client-create-actions"
                                className="flex shrink-0 items-center gap-2"
                            >
                                <Button asChild>
                                    <Link href={create()}>
                                        <Plus aria-hidden="true" />
                                        New client
                                    </Link>
                                </Button>
                            </div>
                        ) : null}
                    </div>

                    <div className="mt-5 grid min-w-0 grid-cols-2 gap-3 xl:grid-cols-4">
                        {countCards.map((card) => (
                            <Card key={card.key} className="min-w-0 py-0">
                                <CardContent className="min-w-0 p-4">
                                    <p className="text-muted-foreground truncate text-xs font-medium uppercase">
                                        {card.label}
                                    </p>
                                    <p className="mt-2 text-2xl font-semibold">
                                        {counts[card.key]}
                                    </p>
                                    <p className="text-muted-foreground mt-1 hidden truncate text-xs sm:block">
                                        {card.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section
                    aria-labelledby="client-results-heading"
                    className="min-w-0 space-y-4"
                >
                    <h2 id="client-results-heading" className="sr-only">
                        Client results
                    </h2>

                    <form
                        action={index.url()}
                        method="get"
                        className="bg-card grid min-w-0 gap-3 rounded-xl border p-4 sm:grid-cols-[minmax(0,1fr)_12rem_auto]"
                    >
                        <div className="min-w-0">
                            <label
                                htmlFor="client-search"
                                className="mb-1.5 block text-sm font-medium"
                            >
                                Search clients
                            </label>
                            <div className="relative min-w-0">
                                <Search
                                    className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                                    aria-hidden="true"
                                />
                                <Input
                                    id="client-search"
                                    name="search"
                                    type="search"
                                    maxLength={100}
                                    defaultValue={filters.search}
                                    placeholder="Name, industry, or contact"
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="client-status"
                                className="mb-1.5 block text-sm font-medium"
                            >
                                Status
                            </label>
                            <select
                                id="client-status"
                                name="status"
                                defaultValue={filters.status}
                                className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                            >
                                <option value="">All statuses</option>
                                <option value={'active' satisfies ClientStatus}>
                                    Active
                                </option>
                                <option
                                    value={'inactive' satisfies ClientStatus}
                                >
                                    Inactive
                                </option>
                                <option
                                    value={'archived' satisfies ClientStatus}
                                >
                                    Archived
                                </option>
                            </select>
                        </div>

                        <div className="flex flex-wrap items-end gap-2">
                            <Button type="submit">Apply filters</Button>
                            {hasFilters ? (
                                <Button variant="ghost" asChild>
                                    <Link href={index()}>Reset</Link>
                                </Button>
                            ) : null}
                        </div>
                    </form>

                    {clients.data.length > 0 ? (
                        <>
                            <ClientList clients={clients.data} />

                            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-muted-foreground text-sm">
                                    Showing {clients.from}–{clients.to} of{' '}
                                    {clients.total}
                                </p>
                                {clients.last_page > 1 ? (
                                    <nav
                                        aria-label="Client pagination"
                                        className="flex flex-wrap gap-1"
                                    >
                                        {clients.links.map((link) =>
                                            link.url === null ? (
                                                <span
                                                    key={link.label}
                                                    className="text-muted-foreground inline-flex h-9 items-center rounded-md px-3 text-sm opacity-50"
                                                    aria-disabled="true"
                                                >
                                                    {paginationLabel(
                                                        link.label,
                                                    )}
                                                </span>
                                            ) : (
                                                <Button
                                                    key={link.label}
                                                    variant={
                                                        link.active
                                                            ? 'secondary'
                                                            : 'outline'
                                                    }
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={link.url}
                                                        aria-current={
                                                            link.active
                                                                ? 'page'
                                                                : undefined
                                                        }
                                                    >
                                                        {paginationLabel(
                                                            link.label,
                                                        )}
                                                    </Link>
                                                </Button>
                                            ),
                                        )}
                                    </nav>
                                ) : null}
                            </div>
                        </>
                    ) : (
                        <Card className="py-0">
                            <CardContent className="flex flex-col items-center px-5 py-12 text-center">
                                <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
                                    <UsersRound
                                        className="size-6"
                                        aria-hidden="true"
                                    />
                                </div>
                                <h3 className="mt-4 font-semibold">
                                    {counts.all === 0
                                        ? 'No clients yet'
                                        : 'No clients match your filters'}
                                </h3>
                                <p className="text-muted-foreground mt-1 max-w-md text-sm">
                                    {counts.all === 0
                                        ? 'Client records will appear here once they are added.'
                                        : 'Try a different search term or clear the status filter.'}
                                </p>
                                {counts.all > 0 && hasFilters ? (
                                    <Button
                                        variant="outline"
                                        className="mt-5"
                                        asChild
                                    >
                                        <Link href={index()}>
                                            Clear filters
                                        </Link>
                                    </Button>
                                ) : null}
                            </CardContent>
                        </Card>
                    )}
                </section>
            </div>
        </>
    );
}

ClientIndex.layout = {
    title: 'Clients',
    description: 'Client relationships and production context.',
    breadcrumbs: [{ title: 'Clients', href: index() }],
};
