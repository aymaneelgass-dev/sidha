import { Head } from '@inertiajs/react';
import { ClientForm } from '@/components/clients/client-form';
import { edit, index, show, update } from '@/routes/clients';
import type { ClientDetail } from '@/types/client';

type ClientEditProps = {
    client: ClientDetail;
};

export default function ClientEdit({ client }: ClientEditProps) {
    return (
        <>
            <Head title={`Edit ${client.name}`} />

            <div className="min-w-0 space-y-5 p-4 md:p-6">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Edit {client.name}
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Update client information and replace its contact list.
                    </p>
                </div>

                <ClientForm
                    mode="edit"
                    client={client}
                    submitForm={update.form(client.id)}
                />
            </div>
        </>
    );
}

ClientEdit.layout = ({ client }: ClientEditProps) => ({
    title: `Edit ${client.name}`,
    description: 'Update client information and contacts.',
    breadcrumbs: [
        { title: 'Clients', href: index() },
        { title: client.name, href: show(client.id) },
        { title: 'Edit', href: edit(client.id) },
    ],
});
