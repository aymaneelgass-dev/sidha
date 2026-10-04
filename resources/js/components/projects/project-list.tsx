import { Link } from '@inertiajs/react';
import { show } from '@/routes/projects';
import { projectTypes } from '@/types/project';
import type { Project } from '@/types/project';
import { money, productionDate } from './project-format';
import { ProjectStatusBadge } from './project-status-badge';
export function ProjectList({ projects }: { projects: readonly Project[] }) {
    return (
        <ul aria-label="Productions" className="divide-y border-t border-b">
            {projects.map((project) => (
                <li
                    key={project.id}
                    className="grid min-w-0 gap-4 py-6 md:grid-cols-[7rem_minmax(0,1fr)] xl:grid-cols-[8rem_minmax(0,1fr)_21rem]"
                >
                    <div className="flex items-center gap-3 md:block">
                        <p className="font-mono text-sm tracking-tight">
                            {project.reference}
                        </p>
                        <p className="text-muted-foreground text-[10px] tracking-widest uppercase md:mt-2">
                            {projectTypes[project.type]}
                        </p>
                    </div>
                    <div className="min-w-0">
                        <Link
                            href={show(project.id)}
                            className="hover:text-primary focus-visible:outline-ring rounded-sm text-2xl leading-tight font-semibold tracking-tight break-words focus-visible:outline-2 focus-visible:outline-offset-4"
                        >
                            {project.name}
                        </Link>
                        <p className="text-muted-foreground mt-2 text-sm break-words">
                            {project.client.name}
                        </p>
                    </div>
                    <div className="grid min-w-0 grid-cols-2 gap-3 md:col-start-2 xl:col-start-auto">
                        <div className="col-span-2">
                            <ProjectStatusBadge status={project.status} />
                        </div>
                        <div>
                            <p className="text-muted-foreground text-[10px] tracking-widest uppercase">
                                Deadline
                            </p>
                            <p className="mt-1 text-sm">
                                {productionDate(project.deadline)}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground text-[10px] tracking-widest uppercase">
                                Budget
                            </p>
                            <p className="mt-1 text-sm font-semibold break-words tabular-nums">
                                {money(project.budget)}
                            </p>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}
