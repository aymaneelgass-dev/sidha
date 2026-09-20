import { Head } from '@inertiajs/react';
import { ClientForm } from '@/components/clients/client-form';
import { create, index, store } from '@/routes/clients';

export default function ClientCreate() {
    return (
        <>
            <Head title="New client" />

            <div className="min-w-0 space-y-5 p-4 md:p-6">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">
                        New client
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Add a client record and its contacts.
                    </p>
                </div>

                <ClientForm mode="create" submitForm={store.form()} />
            </div>
        </>
    );
}

ClientCreate.layout = {
    title: 'New client',
    description: 'Create a client and contact record.',
    breadcrumbs: [
        { title: 'Clients', href: index() },
        { title: 'New client', href: create() },
    ],
};
