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
                <section className="border-border bg-card w-full max-w-xl rounded-2xl border p-8 text-center shadow-sm sm:p-10">
                    <div className="bg-primary/10 text-primary mx-auto flex size-14 items-center justify-center rounded-2xl">
                        <ModuleIcon className="size-7" aria-hidden="true" />
                    </div>

                    <p className="text-primary mt-6 text-sm font-semibold tracking-wide uppercase">
                        Coming soon
                    </p>
                    <h1 className="text-foreground mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                        {pageTitle}
                    </h1>
                    <p className="text-muted-foreground mx-auto mt-4 max-w-md text-base leading-7">
                        {pageDescription}
                    </p>
                </section>
            </main>
        </>
    );
}
