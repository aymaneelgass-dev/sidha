import { Head, Link } from '@inertiajs/react';
import { Search, UsersRound } from 'lucide-react';
import { TeamList } from '@/components/team/team-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { index } from '@/routes/team';
import type {
    PaginatedTeamMembers,
    TeamCounts,
    TeamFilters,
    TeamMemberRole,
    TeamMemberStatus,
} from '@/types/team';

type TeamIndexProps = {
    members: PaginatedTeamMembers;
    filters: TeamFilters;
    counts: TeamCounts;
    can: {
        create: boolean;
    };
};

const countCards: readonly {
    key: keyof TeamCounts;
    label: string;
    description: string;
}[] = [
    { key: 'all', label: 'All members', description: 'Directory total' },
    { key: 'active', label: 'Active', description: 'Current access' },
    {
        key: 'suspended',
        label: 'Suspended',
        description: 'Access paused',
    },
];

function paginationLabel(label: string): string {
    return label.replace('&laquo;', '‹').replace('&raquo;', '›');
}

export default function TeamIndex({
    members,
    filters,
    counts,
}: TeamIndexProps) {
    const hasFilters =
        filters.search !== '' || filters.role !== '' || filters.status !== '';

    return (
        <>
            <Head title="Team" />

            <div className="min-w-0 space-y-5 p-4 md:p-6">
                <section aria-labelledby="team-directory-heading">
                    <div className="min-w-0">
                        <h2
                            id="team-directory-heading"
                            className="text-xl font-semibold tracking-tight"
                        >
                            Team directory
                        </h2>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Browse colleagues, responsibilities, and account
                            access.
                        </p>
                    </div>

                    <div className="mt-5 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3">
                        {countCards.map((card) => (
                            <Card key={card.key} className="min-w-0 py-0">
                                <CardContent className="min-w-0 p-4">
                                    <p className="text-muted-foreground truncate text-xs font-medium uppercase">
                                        {card.label}
                                    </p>
                                    <p className="mt-2 text-2xl font-semibold">
                                        {counts[card.key]}
                                    </p>
                                    <p className="text-muted-foreground mt-1 truncate text-xs">
                                        {card.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section
                    aria-labelledby="team-results-heading"
                    className="min-w-0 space-y-4"
                >
                    <h2 id="team-results-heading" className="sr-only">
                        Team results
                    </h2>

                    <form
                        action={index.url()}
                        method="get"
                        className="bg-card grid min-w-0 gap-3 rounded-xl border p-4 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_11rem_11rem_auto]"
                    >
                        <div className="min-w-0 sm:col-span-2 xl:col-span-1">
                            <label
                                htmlFor="team-search"
                                className="mb-1.5 block text-sm font-medium"
                            >
                                Search team
                            </label>
                            <div className="relative min-w-0">
                                <Search
                                    className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                                    aria-hidden="true"
                                />
                                <Input
                                    id="team-search"
                                    name="search"
                                    type="search"
                                    maxLength={100}
                                    defaultValue={filters.search}
                                    placeholder="Name or email"
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="team-role"
                                className="mb-1.5 block text-sm font-medium"
                            >
                                Role
                            </label>
                            <select
                                id="team-role"
                                name="role"
                                defaultValue={filters.role}
                                className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                            >
                                <option value="">All roles</option>
                                <option
                                    value={'admin' satisfies TeamMemberRole}
                                >
                                    Admin
                                </option>
                                <option
                                    value={'member' satisfies TeamMemberRole}
                                >
                                    Member
                                </option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="team-status"
                                className="mb-1.5 block text-sm font-medium"
                            >
                                Status
                            </label>
                            <select
                                id="team-status"
                                name="status"
                                defaultValue={filters.status}
                                className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                            >
                                <option value="">All statuses</option>
                                <option
                                    value={'active' satisfies TeamMemberStatus}
                                >
                                    Active
                                </option>
                                <option
                                    value={
                                        'suspended' satisfies TeamMemberStatus
                                    }
                                >
                                    Suspended
                                </option>
                            </select>
                        </div>

                        <div className="flex flex-wrap items-end gap-2 sm:col-span-2 xl:col-span-1">
                            <Button type="submit">Apply filters</Button>
                            {hasFilters ? (
                                <Button variant="ghost" asChild>
                                    <Link href={index()}>Reset</Link>
                                </Button>
                            ) : null}
                        </div>
                    </form>

                    {members.data.length > 0 ? (
                        <>
                            <TeamList members={members.data} />

                            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-muted-foreground text-sm">
                                    Showing {members.from}–{members.to} of{' '}
                                    {members.total}
                                </p>
                                {members.last_page > 1 ? (
                                    <nav
                                        aria-label="Team pagination"
                                        className="flex flex-wrap gap-1"
                                    >
                                        {members.links.map((link) =>
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
                                        ? 'No team members yet'
                                        : 'No team members match your filters'}
                                </h3>
                                <p className="text-muted-foreground mt-1 max-w-md text-sm">
                                    {counts.all === 0
                                        ? 'Team members will appear here once accounts are added.'
                                        : 'Try a different search term or clear the role and status filters.'}
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

TeamIndex.layout = {
    title: 'Team',
    description: 'People, responsibilities, and account access.',
    breadcrumbs: [{ title: 'Team', href: index() }],
};
