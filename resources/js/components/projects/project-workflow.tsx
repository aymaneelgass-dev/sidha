import { projectStatuses } from '@/types/project';
import type { ProjectStatus } from '@/types/project';
const stages: ProjectStatus[] = [
    'brief',
    'pre-production',
    'production',
    'post-production',
    'validation',
    'delivered',
];
export function ProjectWorkflow({ status }: { status: ProjectStatus }) {
    return (
        <section aria-label="Production workflow" className="border-y py-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-medium tracking-widest uppercase">
                    Production sequence
                </h3>
                <p className="text-muted-foreground text-xs">
                    {status === 'archived'
                        ? 'Archived / no current stage'
                        : 'Current stage / ' + projectStatuses[status]}
                </p>
            </div>
            <ol className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
                {stages.map((stage, i) => (
                    <li
                        key={stage}
                        aria-current={status === stage ? 'step' : undefined}
                        className={
                            status === stage
                                ? 'border-primary bg-primary/5 border-l-2 px-3 py-3'
                                : 'border-l-2 px-3 py-3'
                        }
                    >
                        <span className="text-muted-foreground block font-mono text-[10px]">
                            {String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                            className={
                                'mt-2 block text-xs ' +
                                (status === stage
                                    ? 'text-primary font-semibold'
                                    : 'text-muted-foreground')
                            }
                        >
                            {projectStatuses[stage]}
                        </span>
                        {status === stage && (
                            <span className="mt-1 block text-[10px]">
                                Current stage
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </section>
    );
}
