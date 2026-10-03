import { useForm } from '@inertiajs/react';
import {
    ArrowUpRight,
    Clapperboard,
    LoaderCircle,
    RotateCcw,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { store } from '@/routes/projects/production-plan';
import type { Project } from '@/types/project';
import type { ProductionPlan } from '@/types/production-plan';

function SectionLabel({
    number,
    children,
    id,
}: {
    number: string;
    children: string;
    id: string;
}) {
    return (
        <h4
            id={id}
            className="flex items-baseline gap-3 text-xs font-semibold tracking-[0.14em] uppercase"
        >
            <span
                aria-hidden="true"
                className="text-muted-foreground font-mono tracking-normal"
            >
                {number}
            </span>
            {children}
        </h4>
    );
}

export function ProductionDesk({
    project,
    plan,
    aiProvider,
    canGenerate,
}: {
    project: Project;
    plan: ProductionPlan | null;
    aiProvider: string;
    canGenerate: boolean;
}) {
    const [open, setOpen] = useState(false);
    const form = useForm<{
        replace: boolean;
        expected_updated_at: string | null;
    }>({ replace: false, expected_updated_at: null });
    const error = Object.values(form.errors)[0];
    const hasBrief = Boolean(project.brief?.trim());

    function generate(replace: boolean) {
        form.clearErrors();
        form.transform(() => ({
            replace,
            expected_updated_at: replace ? (plan?.updated_at ?? null) : null,
        }));
        form.post(store(project.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                requestAnimationFrame(() =>
                    document.getElementById('production-desk-title')?.focus(),
                );
            },
            onError: () => {
                setOpen(false);
                requestAnimationFrame(() =>
                    document.getElementById('production-plan-error')?.focus(),
                );
            },
        });
    }

    const action =
        canGenerate &&
        (plan ? (
            <Dialog
                open={open}
                onOpenChange={(value) => {
                    if (!form.processing) setOpen(value);
                }}
            >
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        disabled={form.processing || !hasBrief}
                    >
                        <RotateCcw aria-hidden="true" /> Regenerate plan
                    </Button>
                </DialogTrigger>
                <DialogContent
                    onCloseAutoFocus={(event) => {
                        if (form.wasSuccessful || error) {
                            event.preventDefault();
                            document
                                .getElementById(
                                    error
                                        ? 'production-plan-error'
                                        : 'production-desk-title',
                                )
                                ?.focus();
                        }
                    }}
                >
                    <DialogHeader>
                        <DialogTitle>Replace this production plan?</DialogTitle>
                        <DialogDescription>
                            A new plan will use the current project brief and
                            replace this saved treatment. There is no version
                            history. If generation fails, your saved plan
                            remains available.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            disabled={form.processing}
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={form.processing}
                            onClick={() => generate(true)}
                        >
                            {form.processing ? (
                                <LoaderCircle
                                    aria-hidden="true"
                                    className="animate-spin"
                                />
                            ) : (
                                <RotateCcw aria-hidden="true" />
                            )}
                            {form.processing
                                ? 'Generating…'
                                : 'Replace production plan'}
                        </Button>
                    </DialogFooter>
                    <p role="status" className="text-muted-foreground text-sm">
                        {form.processing
                            ? 'Creating your new treatment. This may take up to 90 seconds.'
                            : ''}
                    </p>
                </DialogContent>
            </Dialog>
        ) : (
            <Button
                disabled={form.processing || !hasBrief}
                onClick={() => generate(false)}
            >
                {form.processing ? (
                    <LoaderCircle aria-hidden="true" className="animate-spin" />
                ) : (
                    <ArrowUpRight aria-hidden="true" />
                )}
                {form.processing
                    ? 'Generating production plan…'
                    : 'Generate Production Plan'}
            </Button>
        ));

    return (
        <section
            aria-labelledby="production-desk-title"
            className="min-w-0 border-y py-7"
        >
            <div className="mb-7 flex flex-wrap items-start justify-between gap-5">
                <div>
                    <p className="text-primary mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase">
                        <Clapperboard aria-hidden="true" size={16} /> AI
                        Production Planner
                    </p>
                    <h3
                        id="production-desk-title"
                        tabIndex={-1}
                        className="focus-visible:outline-ring text-3xl font-semibold tracking-tight focus-visible:outline-2 sm:text-4xl"
                    >
                        {plan
                            ? 'Creative production treatment'
                            : 'From brief to production.'}
                    </h3>
                    <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-6">
                        {plan
                            ? 'A working direction for your next production. Review with your team and client before the shoot.'
                            : 'Turn this project’s creative brief into a practical concept, script and shooting plan.'}
                    </p>
                    {aiProvider === 'demo' && (
                        <p className="text-muted-foreground mt-2 text-xs">
                            Demo mode  simulated AI output
                        </p>
                    )}
                </div>
                {action}
            </div>
            {!hasBrief && canGenerate && (
                <p className="text-muted-foreground mb-5 text-sm">
                    Add a creative brief using Edit project to enable
                    generation.
                </p>
            )}
            <div
                role="status"
                aria-live="polite"
                className={
                    form.processing
                        ? 'bg-muted mb-6 flex items-center gap-3 border p-4 text-sm'
                        : 'sr-only'
                }
            >
                {form.processing && (
                    <>
                        <LoaderCircle
                            aria-hidden="true"
                            className="size-4 shrink-0 animate-spin"
                        />
                        <span>
                            Building your production treatment. This may take up
                            to 90 seconds. Your saved plan stays available.
                        </span>
                    </>
                )}
            </div>
            {error && (
                <p
                    id="production-plan-error"
                    role="alert"
                    tabIndex={-1}
                    className="text-destructive border-destructive focus-visible:outline-ring mb-6 border-l-2 py-2 pl-4 text-sm leading-6 focus-visible:outline-2"
                >
                    {error}
                </p>
            )}
            {plan ? (
                <Treatment plan={plan} project={project} />
            ) : (
                <div className="grid gap-7 border-t pt-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                    <p className="max-w-md text-lg leading-8">
                        One focused production desk, built around{' '}
                        <span className="font-semibold break-words">
                            {project.name}
                        </span>
                        .
                    </p>
                    <div className="space-y-4">
                        <p className="text-muted-foreground text-xs leading-6 tracking-[0.08em] uppercase">
                            Objective / Creative concept / Script
                            <br />
                            Shot list / Voice over / Production checklist
                        </p>
                        <p className="text-muted-foreground text-sm">
                            {canGenerate
                                ? 'Generated plans are saved to this project. You can return to them at any time.'
                                : 'No production plan yet. An administrator can generate one from the project brief.'}
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}

function Treatment({
    plan,
    project,
}: {
    plan: ProductionPlan;
    project: Project;
}) {
    const content = plan.content;
    const demo = plan.provider === 'demo';
    return (
        <article className="bg-card min-w-0 border px-5 py-7 sm:px-8 sm:py-9">
            <header className="text-muted-foreground mb-9 flex flex-wrap justify-between gap-3 border-b pb-4 text-xs">
                <span className="font-mono">
                    {project.reference} / PRODUCTION DESK
                </span>
                <span>
                    {demo
                        ? 'Demo mode  simulated AI output'
                        : 'OpenAI · Saved'}{' '}
                    ·{' '}
                    <time dateTime={plan.generated_at}>
                        {new Intl.DateTimeFormat('en', {
                            dateStyle: 'medium',
                        }).format(new Date(plan.generated_at))}
                    </time>
                </span>
            </header>
            <div className="grid gap-9 pb-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
                <section aria-labelledby="plan-objective">
                    <SectionLabel number="01" id="plan-objective">
                        Objective
                    </SectionLabel>
                    <p className="mt-5 text-xl leading-relaxed font-medium break-words whitespace-pre-wrap sm:text-2xl">
                        {content.objective}
                    </p>
                </section>
                <section
                    aria-labelledby="plan-concept"
                    className="lg:border-l lg:pl-9"
                >
                    <SectionLabel number="02" id="plan-concept">
                        Creative concept
                    </SectionLabel>
                    <p className="mt-5 text-base leading-8 break-words whitespace-pre-wrap">
                        {content.creative_concept}
                    </p>
                </section>
            </div>
            <section
                aria-labelledby="plan-script"
                className="grid gap-5 border-t py-8 md:grid-cols-[10rem_minmax(0,1fr)]"
            >
                <SectionLabel number="03" id="plan-script">
                    Script
                </SectionLabel>
                <p className="max-w-3xl font-mono text-sm leading-7 break-words whitespace-pre-wrap">
                    {content.script}
                </p>
            </section>
            <section aria-labelledby="plan-shots" className="border-t py-8">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <SectionLabel number="04" id="plan-shots">
                        Shot list
                    </SectionLabel>
                    <span className="text-muted-foreground font-mono text-xs">
                        {content.shot_list.length} shots
                    </span>
                </div>
                <div
                    aria-hidden="true"
                    className="text-muted-foreground hidden grid-cols-[3rem_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.4fr)] gap-4 border-b pb-3 text-xs tracking-wider uppercase md:grid"
                >
                    <span>No.</span>
                    <span>Scene / Action</span>
                    <span>Framing</span>
                    <span>Production notes</span>
                </div>
                <ol className="divide-y border-b">
                    {content.shot_list.map((shot) => (
                        <li
                            key={shot.number}
                            className="grid min-w-0 grid-cols-[2rem_minmax(0,1fr)] gap-x-4 gap-y-3 py-5 md:grid-cols-[3rem_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.4fr)]"
                        >
                            <span className="text-primary font-mono text-sm dark:text-violet-300">
                                {String(shot.number).padStart(2, '0')}
                            </span>
                            <p className="text-sm leading-6 font-medium break-words whitespace-pre-wrap">
                                {shot.description}
                            </p>
                            <p className="text-muted-foreground col-start-2 text-sm leading-6 break-words md:col-start-auto">
                                <span className="sr-only">Framing: </span>
                                {shot.framing}
                            </p>
                            <p className="text-muted-foreground col-start-2 text-sm leading-6 break-words whitespace-pre-wrap md:col-start-auto">
                                <span className="sr-only">
                                    Production notes:{' '}
                                </span>
                                {shot.notes}
                            </p>
                        </li>
                    ))}
                </ol>
            </section>
            <section
                aria-labelledby="plan-voice"
                className="grid gap-5 border-t py-8 md:grid-cols-[10rem_minmax(0,1fr)]"
            >
                <SectionLabel number="05" id="plan-voice">
                    Voice over
                </SectionLabel>
                <div className="max-w-3xl space-y-4">
                    {content.voice_over.required ? (
                        <p className="border-primary border-l-2 pl-5 text-lg leading-8 break-words whitespace-pre-wrap">
                            {content.voice_over.text}
                        </p>
                    ) : (
                        <p className="text-sm font-medium">
                            No voice over required.
                        </p>
                    )}
                    <p className="text-muted-foreground text-sm leading-7 break-words whitespace-pre-wrap">
                        {content.voice_over.notes}
                    </p>
                </div>
            </section>
            <section aria-labelledby="plan-checklist" className="border-t pt-8">
                <SectionLabel number="06" id="plan-checklist">
                    Production checklist
                </SectionLabel>
                <ul className="mt-6 grid gap-x-9 md:grid-cols-2">
                    {content.production_checklist.map((item, index) => (
                        <li
                            key={index}
                            className="flex min-w-0 items-start gap-3 border-b py-4"
                        >
                            <span
                                aria-hidden="true"
                                className="border-muted-foreground mt-1 size-3 shrink-0 border"
                            />
                            <div className="min-w-0">
                                <p className="text-muted-foreground text-xs font-semibold tracking-wider break-words uppercase">
                                    {item.category}
                                </p>
                                <p className="mt-2 text-sm leading-6 break-words whitespace-pre-wrap">
                                    {item.task}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
            <footer className="text-muted-foreground mt-8 text-xs leading-6">
                {demo
                    ? 'Handwritten fictional demonstration treatment.'
                    : 'AI-assisted proposal.'}{' '}
                Validate creative direction, practical details and client claims
                before production.
            </footer>
        </article>
    );
}
