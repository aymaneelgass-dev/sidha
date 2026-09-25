import { Link } from '@inertiajs/react';
import { show as clientShow } from '@/routes/clients';
import type { Project } from '@/types/project';
import { productionDate } from './project-format';
import { ProjectStatusBadge } from './project-status-badge';
export function ProjectFacts({ project }: { project: Project }) {
    return (
        <dl className="grid min-w-0 grid-cols-2 gap-x-5 gap-y-5 border-t pt-5 lg:border-t-0 lg:border-l lg:pl-8">
            <div className="col-span-2 min-w-0">
                <dt className="text-muted-foreground text-[10px] tracking-widest uppercase">
                    Commissioned by
                </dt>
                <dd className="mt-2 break-words">
                    <Link
                        className="decoration-border hover:decoration-primary focus-visible:outline-ring font-medium underline underline-offset-4 focus-visible:outline-2"
                        href={clientShow(project.client_id)}
                    >
                        {project.client.name}
                    </Link>
                </dd>
            </div>
            <div className="col-span-2">
                <dt className="text-muted-foreground text-[10px] tracking-widest uppercase">
                    Production stage
                </dt>
                <dd className="mt-2">
                    <ProjectStatusBadge status={project.status} />
                </dd>
            </div>
            <div>
                <dt className="text-muted-foreground text-[10px] tracking-widest uppercase">
                    Start date
                </dt>
                <dd className="mt-2 text-sm">
                    {productionDate(project.start_date)}
                </dd>
            </div>
            <div>
                <dt className="text-muted-foreground text-[10px] tracking-widest uppercase">
                    Deadline
                </dt>
                <dd className="mt-2 text-sm">
                    {productionDate(project.deadline)}
                </dd>
            </div>
        </dl>
    );
}
