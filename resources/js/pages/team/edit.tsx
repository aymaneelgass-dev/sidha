import { Head } from '@inertiajs/react';
import { MemberForm } from '@/components/team/member-form';
import { edit, index, update } from '@/routes/team';
import type { TeamMemberDetail } from '@/types/team';

type TeamEditProps = {
    member: TeamMemberDetail;
};

export default function TeamEdit({ member }: TeamEditProps) {
    return (
        <>
            <Head title={`Edit ${member.name}`} />

            <div className="min-w-0 space-y-5 p-4 md:p-6">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Edit {member.name}
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Update professional details and account role. Status
                        changes remain separate confirmation actions.
                    </p>
                </div>

                <MemberForm
                    mode="edit"
                    member={member}
                    submitForm={update.form(member.id)}
                />
            </div>
        </>
    );
}

TeamEdit.layout = ({ member }: TeamEditProps) => ({
    title: `Edit ${member.name}`,
    description: 'Update team member information.',
    breadcrumbs: [
        { title: 'Team', href: index() },
        { title: member.name, href: edit(member.id) },
    ],
});
