import { Form, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { create as createClient } from '@/routes/clients';
import { index, show } from '@/routes/projects';
import { projectStatuses, projectTypes } from '@/types/project';
import type { Project, ProjectClient } from '@/types/project';
import type { RouteFormDefinition } from '@/wayfinder';
export function ProjectForm({
    project,
    clients,
    submitForm,
}: {
    project?: Project;
    clients: ProjectClient[];
    submitForm: RouteFormDefinition<'post'>;
}) {
    return (
        <Form {...submitForm} disableWhileProcessing>
            {({ errors, processing }) => (
                <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                    <section className="min-w-0 space-y-5 border-t pt-5">
                        <h3 className="text-xs tracking-widest uppercase">
                            01 / Production identity
                        </h3>
                        <div>
                            <Label htmlFor="name">Project name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={project?.name}
                                required
                                maxLength={150}
                                aria-invalid={!!errors.name}
                                aria-describedby="name-error"
                                className="mt-2"
                            />
                            <InputError id="name-error" message={errors.name} />
                        </div>
                        <div>
                            <Label htmlFor="client_id">Client</Label>
                            <select
                                id="client_id"
                                name="client_id"
                                defaultValue={project?.client_id ?? ''}
                                required
                                aria-invalid={!!errors.client_id}
                                aria-describedby="client-error"
                                className="bg-background focus-visible:outline-ring mt-2 h-10 w-full rounded-md border px-3 text-sm focus-visible:outline-2"
                            >
                                <option value="" disabled>
                                    Select a client
                                </option>
                                {clients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.name}
                                        {client.status === 'archived'
                                            ? ' (archived)'
                                            : ''}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                id="client-error"
                                message={errors.client_id}
                            />
                            {!clients.length && (
                                <p className="mt-2 text-sm">
                                    Add a client before creating a project.{' '}
                                    <Link
                                        className="text-primary underline"
                                        href={createClient()}
                                    >
                                        Create client
                                    </Link>
                                </p>
                            )}
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            {[
                                {
                                    name: 'type',
                                    label: 'Type',
                                    options: projectTypes,
                                    value: project?.type ?? 'music-video',
                                },
                                {
                                    name: 'status',
                                    label: 'Production stage',
                                    options: projectStatuses,
                                    value: project?.status ?? 'brief',
                                },
                            ].map((field) => (
                                <div key={field.name}>
                                    <Label htmlFor={field.name}>
                                        {field.label}
                                    </Label>
                                    <select
                                        id={field.name}
                                        name={field.name}
                                        defaultValue={field.value}
                                        aria-invalid={!!errors[field.name]}
                                        aria-describedby={field.name + '-error'}
                                        className="bg-background focus-visible:outline-ring mt-2 h-10 w-full rounded-md border px-3 text-sm focus-visible:outline-2"
                                    >
                                        {Object.entries(field.options)
                                            .filter(
                                                ([value]) =>
                                                    value !== 'archived' ||
                                                    project?.status ===
                                                        'archived',
                                            )
                                            .map(([v, l]) => (
                                                <option key={v} value={v}>
                                                    {l}
                                                </option>
                                            ))}
                                    </select>
                                    <InputError
                                        id={field.name + '-error'}
                                        message={errors[field.name]}
                                    />
                                </div>
                            ))}
                        </div>
                        <div>
                            <Label htmlFor="brief">
                                Creative brief{' '}
                                <span className="text-muted-foreground">
                                    (optional)
                                </span>
                            </Label>
                            <Textarea
                                id="brief"
                                name="brief"
                                defaultValue={project?.brief ?? ''}
                                maxLength={10000}
                                rows={7}
                                aria-invalid={!!errors.brief}
                                aria-describedby="brief-error"
                                className="mt-2"
                            />
                            <InputError
                                id="brief-error"
                                message={errors.brief}
                            />
                        </div>
                    </section>
                    <section className="min-w-0 space-y-5 border-t pt-5">
                        <h3 className="text-xs tracking-widest uppercase">
                            02 / Production parameters
                        </h3>
                        <div>
                            <Label htmlFor="budget">Budget (MAD)</Label>
                            <Input
                                id="budget"
                                name="budget"
                                type="number"
                                inputMode="decimal"
                                min="0"
                                max="9999999999.99"
                                step="0.01"
                                required
                                defaultValue={project?.budget}
                                aria-invalid={!!errors.budget}
                                aria-describedby="budget-error"
                                className="mt-2"
                            />
                            <InputError
                                id="budget-error"
                                message={errors.budget}
                            />
                        </div>
                        {(['start_date', 'deadline'] as const).map((name) => (
                            <div key={name}>
                                <Label htmlFor={name}>
                                    {name === 'start_date'
                                        ? 'Start date'
                                        : 'Deadline'}{' '}
                                    <span className="text-muted-foreground">
                                        (optional)
                                    </span>
                                </Label>
                                <Input
                                    id={name}
                                    name={name}
                                    type="date"
                                    defaultValue={project?.[name] ?? ''}
                                    aria-invalid={!!errors[name]}
                                    aria-describedby={name + '-error'}
                                    className="mt-2"
                                />
                                <InputError
                                    id={name + '-error'}
                                    message={errors[name]}
                                />
                            </div>
                        ))}
                        <p className="text-muted-foreground border-t pt-4 text-sm">
                            Budget and expenses are tracked in MAD. You can
                            update the production stage at any time.
                        </p>
                    </section>
                    <div className="flex flex-wrap gap-3 border-t pt-5 lg:col-span-2">
                        <Button
                            type="submit"
                            disabled={processing || !clients.length}
                        >
                            {processing
                                ? 'Saving…'
                                : project
                                  ? 'Save changes'
                                  : 'Create project'}
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link href={project ? show(project.id) : index()}>
                                Cancel
                            </Link>
                        </Button>
                    </div>
                </div>
            )}
        </Form>
    );
}
