import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ProjectArchiveDialog } from '@/components/projects/project-archive-dialog';
import { ProjectFinancialSummary } from '@/components/projects/project-financial-summary';
import { ProjectExpenseList } from '@/components/projects/project-expense-list';
import { ProjectWorkflow } from '@/components/projects/project-workflow';
import { ProjectFacts } from '@/components/projects/project-facts';
import { projectTypes } from '@/types/project';
import { index, edit } from '@/routes/projects';
import type {
    Project,
    ProjectExpense,
    ProjectFinancials,
} from '@/types/project';
import type { PaginatedProp } from '@/types/client';
export default function ProjectShow({
    project,
    can,
    financials,
    expenses,
}: {
    project: Project;
    can: { update: boolean; archive: boolean; manageExpenses: boolean };
    financials: ProjectFinancials;
    expenses: PaginatedProp<ProjectExpense>;
}) {
    return (
        <>
            <Head title={project.reference + ' — ' + project.name} />
            <div className="min-w-0 space-y-7 p-4 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Link
                        href={index()}
                        className="text-muted-foreground text-sm underline underline-offset-4"
                    >
                        Back to projects
                    </Link>
                    <div className="flex flex-wrap gap-2">
                        {can.update && (
                            <Button variant="outline" asChild>
                                <Link href={edit(project.id)}>
                                    Edit project
                                </Link>
                            </Button>
                        )}
                        {can.archive && project.status !== 'archived' && (
                            <ProjectArchiveDialog project={project} />
                        )}
                    </div>
                </div>
                <header className="grid min-w-0 gap-7 py-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                    <div className="min-w-0">
                        <div className="mb-6 flex flex-wrap items-center gap-4 text-xs">
                            <span className="font-mono">
                                {project.reference}
                            </span>
                            <span className="text-primary tracking-[0.15em] uppercase">
                                {projectTypes[project.type]}
                            </span>
                        </div>
                        <h2
                            id="project-title"
                            tabIndex={-1}
                            className="focus-visible:outline-ring text-4xl leading-[1.05] font-semibold tracking-tight break-words focus-visible:outline-2 sm:text-5xl xl:text-6xl"
                        >
                            {project.name}
                        </h2>
                        <p className="text-muted-foreground mt-5 text-xs tracking-widest uppercase">
                            Production file / SIDHA
                        </p>
                    </div>
                    <ProjectFacts project={project} />
                </header>
                <ProjectWorkflow status={project.status} />
                <ProjectFinancialSummary financials={financials} />
                <section
                    aria-labelledby="brief-heading"
                    className="grid gap-4 border-b pb-7 md:grid-cols-[10rem_minmax(0,1fr)]"
                >
                    <h3
                        id="brief-heading"
                        className="text-xs font-medium tracking-widest uppercase"
                    >
                        Creative brief
                    </h3>
                    <p className="max-w-3xl text-sm leading-7 break-words whitespace-pre-wrap">
                        {project.brief ?? 'No brief added yet.'}
                    </p>
                </section>
                <ProjectExpenseList
                    projectId={project.id}
                    expenses={expenses}
                    canManage={can.manageExpenses}
                />
            </div>
        </>
    );
}
ProjectShow.layout = {
    title: 'Project',
    breadcrumbs: [{ title: 'Projects', href: index() }],
};
