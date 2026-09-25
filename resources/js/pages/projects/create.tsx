import { Head } from '@inertiajs/react';
import { ProjectForm } from '@/components/projects/project-form';
import { index, store } from '@/routes/projects';
import type { ProjectClient } from '@/types/project';
export default function ProjectCreate({
    clients,
}: {
    clients: ProjectClient[];
}) {
    return (
        <>
            <Head title="New project" />
            <div className="min-w-0 space-y-8 p-4 md:p-8">
                <header>
                    <p className="text-primary text-xs tracking-widest uppercase">
                        Production desk / New entry
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                        Set the production in motion.
                    </h2>
                </header>
                <ProjectForm clients={clients} submitForm={store.form()} />
            </div>
        </>
    );
}
ProjectCreate.layout = {
    title: 'New project',
    breadcrumbs: [{ title: 'Projects', href: index() }],
};
