import { Head } from '@inertiajs/react';
import { ProjectForm } from '@/components/projects/project-form';
import { index, update } from '@/routes/projects';
import type { Project, ProjectClient } from '@/types/project';
export default function ProjectEdit({
    project,
    clients,
}: {
    project: Project;
    clients: ProjectClient[];
}) {
    return (
        <>
            <Head title={'Edit ' + project.reference} />
            <div className="min-w-0 space-y-8 p-4 md:p-8">
                <header>
                    <p className="text-primary font-mono text-xs">
                        {project.reference} / EDIT
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight break-words">
                        {project.name}
                    </h2>
                </header>
                <ProjectForm
                    project={project}
                    clients={clients}
                    submitForm={update.form(project.id)}
                />
            </div>
        </>
    );
}
ProjectEdit.layout = {
    title: 'Edit project',
    breadcrumbs: [{ title: 'Projects', href: index() }],
};
