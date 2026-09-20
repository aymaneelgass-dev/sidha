import { Link } from '@inertiajs/react';
import { Mail, Phone } from 'lucide-react';
import { ClientStatusBadge } from '@/components/clients/client-status-badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { show } from '@/routes/clients';
import type { ClientListItem } from '@/types/client';

type ClientListProps = {
    clients: readonly ClientListItem[];
};

export function ClientList({ clients }: ClientListProps) {
    return (
        <>
            <div className="hidden overflow-hidden rounded-xl border md:block">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                            <TableHead>Client</TableHead>
                            <TableHead>Industry</TableHead>
                            <TableHead>Primary contact</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients.map((client) => (
                            <TableRow key={client.id}>
                                <TableCell className="font-medium">
                                    <Link
                                        href={show(client.id)}
                                        className="hover:text-primary focus-visible:ring-ring rounded-sm underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:outline-none"
                                    >
                                        {client.name}
                                    </Link>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {client.industry ?? 'Not specified'}
                                </TableCell>
                                <TableCell>
                                    {client.primary_contact === null ? (
                                        <span className="text-muted-foreground">
                                            No primary contact
                                        </span>
                                    ) : (
                                        <div className="min-w-0">
                                            <p className="font-medium">
                                                {client.primary_contact.name}
                                            </p>
                                            {client.primary_contact.email ? (
                                                <a
                                                    href={`mailto:${client.primary_contact.email}`}
                                                    className="text-muted-foreground hover:text-primary text-xs underline-offset-4 hover:underline"
                                                >
                                                    {
                                                        client.primary_contact
                                                            .email
                                                    }
                                                </a>
                                            ) : null}
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {client.phone ?? 'Not specified'}
                                </TableCell>
                                <TableCell>
                                    <ClientStatusBadge status={client.status} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="grid min-w-0 gap-3 md:hidden">
                {clients.map((client) => (
                    <Card key={client.id} className="min-w-0 py-0">
                        <CardContent className="min-w-0 space-y-4 p-4">
                            <div className="flex min-w-0 items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <Link
                                        href={show(client.id)}
                                        className="hover:text-primary focus-visible:ring-ring block font-semibold break-words underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:outline-none"
                                    >
                                        {client.name}
                                    </Link>
                                    <p className="text-muted-foreground mt-1 text-sm break-words">
                                        {client.industry ??
                                            'Industry not specified'}
                                    </p>
                                </div>
                                <ClientStatusBadge
                                    status={client.status}
                                    className="shrink-0"
                                />
                            </div>

                            <div className="border-border grid min-w-0 gap-2 border-t pt-3 text-sm">
                                {client.primary_contact === null ? (
                                    <p className="text-muted-foreground">
                                        No primary contact
                                    </p>
                                ) : (
                                    <div className="min-w-0">
                                        <p className="font-medium">
                                            {client.primary_contact.name}
                                        </p>
                                        {client.primary_contact.email ? (
                                            <a
                                                href={`mailto:${client.primary_contact.email}`}
                                                className="text-muted-foreground hover:text-primary mt-1 flex min-w-0 items-center gap-2 underline-offset-4 hover:underline"
                                            >
                                                <Mail
                                                    className="size-4 shrink-0"
                                                    aria-hidden="true"
                                                />
                                                <span className="min-w-0 break-all">
                                                    {
                                                        client.primary_contact
                                                            .email
                                                    }
                                                </span>
                                            </a>
                                        ) : null}
                                    </div>
                                )}
                                {client.phone ? (
                                    <a
                                        href={`tel:${client.phone}`}
                                        className="text-muted-foreground hover:text-primary flex min-w-0 items-center gap-2 underline-offset-4 hover:underline"
                                    >
                                        <Phone
                                            className="size-4 shrink-0"
                                            aria-hidden="true"
                                        />
                                        <span className="min-w-0 break-words">
                                            {client.phone}
                                        </span>
                                    </a>
                                ) : null}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
}
