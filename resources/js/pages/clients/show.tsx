import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    BriefcaseBusiness,
    Globe,
    Mail,
    MapPin,
    Phone,
    UserRound,
} from 'lucide-react';
import { ClientStatusBadge } from '@/components/clients/client-status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { index, show } from '@/routes/clients';
import type { ClientDetail } from '@/types/client';

type ClientShowProps = {
    client: ClientDetail;
    can: {
        update: boolean;
        archive: boolean;
        reactivate: boolean;
    };
};

function safeWebsiteUrl(website: string): string | null {
    try {
        const url = new URL(website);

        return url.protocol === 'http:' || url.protocol === 'https:'
            ? url.toString()
            : null;
    } catch {
        return null;
    }
}

export default function ClientShow({ client, can }: ClientShowProps) {
    const websiteUrl = client.website ? safeWebsiteUrl(client.website) : null;
    const canMutate = can.update || can.archive || can.reactivate;

    return (
        <>
            <Head title={client.name} />

            <div className="min-w-0 space-y-5 p-4 md:p-6">
                <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={index()}>
                                <ArrowLeft aria-hidden="true" />
                                Back to clients
                            </Link>
                        </Button>
                        <div className="mt-3 flex min-w-0 flex-wrap items-center gap-3">
                            <h2 className="min-w-0 text-2xl font-semibold tracking-tight break-words">
                                {client.name}
                            </h2>
                            <ClientStatusBadge status={client.status} />
                        </div>
                        <p className="text-muted-foreground mt-1 text-sm break-words">
                            {client.industry ?? 'Industry not specified'}
                        </p>
                    </div>
                    {canMutate ? (
                        <div
                            data-slot="client-mutation-actions"
                            className="flex shrink-0 flex-wrap items-center gap-2"
                        />
                    ) : null}
                </div>

                <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
                    <div className="min-w-0 space-y-5">
                        <Card className="min-w-0">
                            <CardHeader>
                                <CardTitle>Business details</CardTitle>
                                <CardDescription>
                                    Contact and location information for this
                                    client.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <dl className="grid min-w-0 gap-5 sm:grid-cols-2">
                                    <div className="min-w-0">
                                        <dt className="text-muted-foreground flex items-center gap-2 text-sm">
                                            <BriefcaseBusiness
                                                className="size-4 shrink-0"
                                                aria-hidden="true"
                                            />
                                            Industry
                                        </dt>
                                        <dd className="mt-1 font-medium break-words">
                                            {client.industry ?? 'Not specified'}
                                        </dd>
                                    </div>
                                    <div className="min-w-0">
                                        <dt className="text-muted-foreground flex items-center gap-2 text-sm">
                                            <Phone
                                                className="size-4 shrink-0"
                                                aria-hidden="true"
                                            />
                                            Phone
                                        </dt>
                                        <dd className="mt-1 min-w-0 font-medium break-words">
                                            {client.phone ? (
                                                <a
                                                    href={`tel:${client.phone}`}
                                                    className="hover:text-primary underline-offset-4 hover:underline"
                                                >
                                                    {client.phone}
                                                </a>
                                            ) : (
                                                'Not specified'
                                            )}
                                        </dd>
                                    </div>
                                    <div className="min-w-0">
                                        <dt className="text-muted-foreground flex items-center gap-2 text-sm">
                                            <Globe
                                                className="size-4 shrink-0"
                                                aria-hidden="true"
                                            />
                                            Website
                                        </dt>
                                        <dd className="mt-1 min-w-0 font-medium break-all">
                                            {websiteUrl ? (
                                                <a
                                                    href={websiteUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="hover:text-primary underline-offset-4 hover:underline"
                                                >
                                                    {client.website}
                                                </a>
                                            ) : (
                                                (client.website ??
                                                'Not specified')
                                            )}
                                        </dd>
                                    </div>
                                    <div className="min-w-0">
                                        <dt className="text-muted-foreground flex items-center gap-2 text-sm">
                                            <MapPin
                                                className="size-4 shrink-0"
                                                aria-hidden="true"
                                            />
                                            Address
                                        </dt>
                                        <dd className="mt-1 font-medium break-words whitespace-pre-line">
                                            {client.address ?? 'Not specified'}
                                        </dd>
                                    </div>
                                </dl>
                            </CardContent>
                        </Card>

                        <Card className="min-w-0">
                            <CardHeader>
                                <CardTitle>Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm leading-6 break-words whitespace-pre-wrap">
                                    {client.notes ??
                                        'No notes have been recorded for this client.'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <section
                        aria-labelledby="client-contacts-heading"
                        className="min-w-0"
                    >
                        <Card className="min-w-0">
                            <CardHeader>
                                <CardTitle id="client-contacts-heading">
                                    Contacts
                                </CardTitle>
                                <CardDescription>
                                    {client.contacts.length} contact
                                    {client.contacts.length === 1 ? '' : 's'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {client.contacts.length === 0 ? (
                                    <div className="flex flex-col items-center py-6 text-center">
                                        <div className="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-full">
                                            <UserRound
                                                className="size-5"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <p className="mt-3 font-medium">
                                            No contacts yet
                                        </p>
                                        <p className="text-muted-foreground mt-1 text-sm">
                                            Contact records will appear here.
                                        </p>
                                    </div>
                                ) : (
                                    client.contacts.map((contact) => (
                                        <article
                                            key={contact.id}
                                            className="min-w-0 rounded-lg border p-4"
                                        >
                                            <div className="flex min-w-0 flex-wrap items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold break-words">
                                                        {contact.name}
                                                    </h3>
                                                    {contact.job_title ? (
                                                        <p className="text-muted-foreground mt-0.5 text-sm break-words">
                                                            {contact.job_title}
                                                        </p>
                                                    ) : null}
                                                </div>
                                                {contact.is_primary ? (
                                                    <Badge variant="secondary">
                                                        Primary
                                                    </Badge>
                                                ) : null}
                                            </div>
                                            <div className="mt-3 grid min-w-0 gap-2 text-sm">
                                                {contact.email ? (
                                                    <a
                                                        href={`mailto:${contact.email}`}
                                                        className="text-muted-foreground hover:text-primary flex min-w-0 items-center gap-2 underline-offset-4 hover:underline"
                                                    >
                                                        <Mail
                                                            className="size-4 shrink-0"
                                                            aria-hidden="true"
                                                        />
                                                        <span className="min-w-0 break-all">
                                                            {contact.email}
                                                        </span>
                                                    </a>
                                                ) : null}
                                                {contact.phone ? (
                                                    <a
                                                        href={`tel:${contact.phone}`}
                                                        className="text-muted-foreground hover:text-primary flex min-w-0 items-center gap-2 underline-offset-4 hover:underline"
                                                    >
                                                        <Phone
                                                            className="size-4 shrink-0"
                                                            aria-hidden="true"
                                                        />
                                                        <span className="min-w-0 break-words">
                                                            {contact.phone}
                                                        </span>
                                                    </a>
                                                ) : null}
                                            </div>
                                        </article>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </div>
        </>
    );
}

ClientShow.layout = ({ client }: ClientShowProps) => ({
    title: client.name,
    description: 'Client profile and contacts.',
    breadcrumbs: [
        { title: 'Clients', href: index() },
        { title: client.name, href: show(client.id) },
    ],
});
