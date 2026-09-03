import { Head } from '@inertiajs/react';
import {
    AudioLines,
    CalendarDays,
    Clapperboard,
    Sparkles,
    Users,
    UsersRound,
    type LucideIcon,
} from 'lucide-react';

type ModuleIconName =
    | 'clapperboard'
    | 'audio-lines'
    | 'users-round'
    | 'calendar-days'
    | 'sparkles'
    | 'users';

type ComingSoonPageProps = {
    pageTitle: string;
    pageDescription: string;
    moduleIcon: ModuleIconName;
};

const moduleIcons = {
    clapperboard: Clapperboard,
    'audio-lines': AudioLines,
    'users-round': UsersRound,
    'calendar-days': CalendarDays,
    sparkles: Sparkles,
    users: Users,
} satisfies Record<ModuleIconName, LucideIcon>;

export default function ComingSoon({
    pageTitle,
    pageDescription,
    moduleIcon,
}: ComingSoonPageProps) {
    const ModuleIcon = moduleIcons[moduleIcon];

    return (
        <>
            <Head title={pageTitle} />

            <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-10 sm:px-6">
                <section className="w-full max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <ModuleIcon className="size-7" aria-hidden="true" />
                    </div>

                    <p className="mt-6 text-sm font-semibold tracking-wide text-primary uppercase">
                        Coming soon
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                        {pageTitle}
                    </h1>
                    <p className="mx-auto mt-4 max-w-md text-base leading-7 text-muted-foreground">
                        {pageDescription}
                    </p>
                </section>
            </main>
        </>
    );
}
