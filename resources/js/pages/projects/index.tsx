import { Head, Link } from '@inertiajs/react';
import { Plus, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProjectList } from '@/components/projects/project-list';
import { ProjectPagination } from '@/components/projects/project-pagination';
import { create, index } from '@/routes/projects';
import { projectStatuses, projectTypes } from '@/types/project';
import type { Project, ProjectFilters } from '@/types/project';
import type { PaginatedProp } from '@/types/client';
export default function ProjectsIndex({
    projects,
    filters,
    can,
}: {
    projects: PaginatedProp<Project>;
    filters: ProjectFilters;
    can: { create: boolean };
}) {
    const filtered = Boolean(filters.search || filters.status || filters.type);
    return (
        <>
            <Head title="Projects" />
            <div className="min-w-0 p-4 md:p-8">
                <header className="flex flex-wrap items-end justify-between gap-4 pb-7">
                    <div>
                        <p className="text-primary mb-3 text-xs font-medium tracking-[0.2em] uppercase">
                            SIDHA / Production desk
                        </p>
                        <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
                            Projects
                            <span className="text-muted-foreground ml-3 align-top font-mono text-sm">
                                {String(projects.total).padStart(2, '0')}
                            </span>
                        </h2>
                        <p className="text-muted-foreground mt-3 text-sm">
                            From the first brief to the final frame.
                        </p>
                    </div>
                    {can.create && (
                        <Button asChild>
                            <Link href={create()}>
                                <Plus aria-hidden="true" />
                                New project
                            </Link>
                        </Button>
                    )}
                </header>
                <form
                    action={index.url()}
                    method="get"
                    className="mb-6 grid gap-3 border-y py-4 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_12rem_12rem_auto_auto]"
                >
                    <div>
                        <Label htmlFor="project-search">Search projects</Label>
                        <Input
                            id="project-search"
                            name="search"
                            defaultValue={filters.search}
                            placeholder="Name, reference or client"
                            maxLength={100}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label htmlFor="project-status">Status</Label>
                        <select
                            id="project-status"
                            name="status"
                            defaultValue={filters.status}
                            className="bg-background focus-visible:outline-ring mt-2 h-9 w-full rounded-md border px-3 text-sm focus-visible:outline-2"
                        >
                            <option value="">All statuses</option>
                            {Object.entries(projectStatuses).map(([v, l]) => (
                                <option key={v} value={v}>
                                    {l}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <Label htmlFor="project-type">Type</Label>
                        <select
                            id="project-type"
                            name="type"
                            defaultValue={filters.type}
                            className="bg-background focus-visible:outline-ring mt-2 h-9 w-full rounded-md border px-3 text-sm focus-visible:outline-2"
                        >
                            <option value="">All types</option>
                            {Object.entries(projectTypes).map(([v, l]) => (
                                <option key={v} value={v}>
                                    {l}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Button
                        type="submit"
                        variant="secondary"
                        className="self-end"
                    >
                        Apply filters
                    </Button>
                    {filtered && (
                        <Button variant="ghost" asChild className="self-end">
                            <Link href={index()}>Clear</Link>
                        </Button>
                    )}
                </form>
                {projects.data.length ? (
                    <ProjectList projects={projects.data} />
                ) : (
                    <section className="border-b py-12">
                        <ArrowUpRight
                            aria-hidden="true"
                            className="text-muted-foreground mb-4"
                        />
                        <h3 className="text-xl font-semibold">
                            {filtered
                                ? 'No matching productions'
                                : 'Your next production starts here'}
                        </h3>
                        <p className="text-muted-foreground mt-2 text-sm">
                            {filtered
                                ? 'Try another search or clear the filters.'
                                : can.create
                                  ? 'Create a project to bring the brief, production stage and budget together.'
                                  : 'Projects will appear here when your team creates them.'}
                        </p>
                    </section>
                )}
                <div className="mt-5">
                    <ProjectPagination page={projects} />
                </div>
            </div>
        </>
    );
}
ProjectsIndex.layout = {
    title: 'Projects',
    breadcrumbs: [{ title: 'Projects', href: index() }],
};
