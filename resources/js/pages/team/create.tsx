import { Head } from '@inertiajs/react';
import { MemberForm } from '@/components/team/member-form';
import { create, index, store } from '@/routes/team';

export default function TeamCreate() {
    return (
        <>
            <Head title="New member" />

            <div className="min-w-0 space-y-5 p-4 md:p-6">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">
                        New member
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Create an account and send secure password setup and
                        email verification messages.
                    </p>
                </div>

                <MemberForm mode="create" submitForm={store.form()} />
            </div>
        </>
    );
}

TeamCreate.layout = {
    title: 'New member',
    description: 'Provision a SIDHA team account.',
    breadcrumbs: [
        { title: 'Team', href: index() },
        { title: 'New member', href: create() },
    ],
};
