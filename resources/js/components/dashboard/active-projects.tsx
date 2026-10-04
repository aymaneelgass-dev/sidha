import { DashboardCard } from '@/components/dashboard/dashboard-card';
import type { ActiveProject, ProjectStage } from '@/types';

const stageClasses: Record<ProjectStage, string> = {
    Planning: 'bg-muted text-muted-foreground',
    Production: 'bg-primary/12 text-primary',
    'Post-production': 'bg-chart-3/12 text-chart-3',
};

export function ActiveProjects({
    projects,
}: {
    projects: readonly ActiveProject[];
}) {
    return (
        <DashboardCard
            title="Active Projects"
            description="Current creative work in progress"
            className="xl:col-span-7"
            contentClassName="pt-4"
        >
            <ul className="divide-y" aria-label="Active projects">
                {projects.map((project) => (
                    <li key={project.id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                                <div className="flex min-w-0 flex-wrap items-center gap-2">
                                    <h3 className="truncate font-medium">
                                        {project.name}
                                    </h3>
                                    <span
                                        className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${stageClasses[project.stage]}`}
                                    >
                                        {project.stage}
                                    </span>
                                </div>
                                <p className="text-muted-foreground mt-1 text-sm">
                                    {project.client}
                                </p>
                            </div>
                            <div
                                className="flex shrink-0 items-center gap-2"
                                aria-label={`Project team: ${project.team.join(', ')}`}
                            >
                                {project.team.map((initials) => (
                                    <span
                                        key={initials}
                                        className="bg-muted text-muted-foreground inline-flex size-7 items-center justify-center rounded-full text-[10px] font-semibold"
                                    >
                                        {initials}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="text-muted-foreground mt-3 grid gap-2 text-xs sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:gap-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <div
                                    className="bg-muted h-1.5 min-w-0 flex-1 overflow-hidden rounded-full"
                                    role="progressbar"
                                    aria-label={`${project.name} progress`}
                                    aria-valuenow={project.progress}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                >
                                    <div
                                        className="bg-primary h-full rounded-full"
                                        style={{
                                            width: `${project.progress}%`,
                                        }}
                                    />
                                </div>
                                <span className="text-foreground shrink-0 font-medium">
                                    {project.progress}%
                                </span>
                            </div>
                            <span className="whitespace-nowrap">
                                Due {project.deadline}
                            </span>
                            <span className="text-foreground font-medium whitespace-nowrap">
                                {project.budget}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </DashboardCard>
    );
}
