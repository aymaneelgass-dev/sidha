import { Mail, Phone } from 'lucide-react';
import { MemberRoleBadge } from '@/components/team/member-role-badge';
import { MemberStatusBadge } from '@/components/team/member-status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useInitials } from '@/hooks/use-initials';
import type { TeamMemberListItem } from '@/types/team';

type TeamListProps = {
    members: readonly TeamMemberListItem[];
};

function MemberIdentity({ member }: { member: TeamMemberListItem }) {
    const getInitials = useInitials();

    return (
        <div className="flex min-w-0 items-center gap-3">
            <Avatar className="size-9">
                <AvatarFallback className="bg-neutral-200 text-sm font-medium text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(member.name)}
                </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
                <p className="truncate font-medium">{member.name}</p>
                <a
                    href={`mailto:${member.email}`}
                    className="text-muted-foreground hover:text-primary block truncate text-xs underline-offset-4 hover:underline"
                >
                    {member.email}
                </a>
            </div>
        </div>
    );
}

export function TeamList({ members }: TeamListProps) {
    return (
        <>
            <div className="hidden overflow-hidden rounded-xl border md:block">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                            <TableHead>Team member</TableHead>
                            <TableHead>Job title</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {members.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell>
                                    <MemberIdentity member={member} />
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {member.job_title ?? 'Not specified'}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {member.phone ?? 'Not specified'}
                                </TableCell>
                                <TableCell>
                                    <MemberRoleBadge role={member.role} />
                                </TableCell>
                                <TableCell>
                                    <MemberStatusBadge status={member.status} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="grid min-w-0 gap-3 md:hidden">
                {members.map((member) => (
                    <Card key={member.id} className="min-w-0 py-0">
                        <CardContent className="min-w-0 space-y-4 p-4">
                            <div className="flex min-w-0 items-start justify-between gap-3">
                                <MemberIdentity member={member} />
                                <MemberStatusBadge
                                    status={member.status}
                                    className="shrink-0"
                                />
                            </div>

                            <div className="border-border grid min-w-0 gap-2 border-t pt-3 text-sm">
                                <div className="flex flex-wrap items-center gap-2">
                                    <MemberRoleBadge role={member.role} />
                                    <span className="text-muted-foreground break-words">
                                        {member.job_title ??
                                            'Job title not specified'}
                                    </span>
                                </div>
                                <a
                                    href={`mailto:${member.email}`}
                                    className="text-muted-foreground hover:text-primary flex min-w-0 items-center gap-2 underline-offset-4 hover:underline"
                                >
                                    <Mail
                                        className="size-4 shrink-0"
                                        aria-hidden="true"
                                    />
                                    <span className="min-w-0 break-all">
                                        {member.email}
                                    </span>
                                </a>
                                {member.phone ? (
                                    <a
                                        href={`tel:${member.phone}`}
                                        className="text-muted-foreground hover:text-primary flex min-w-0 items-center gap-2 underline-offset-4 hover:underline"
                                    >
                                        <Phone
                                            className="size-4 shrink-0"
                                            aria-hidden="true"
                                        />
                                        <span className="min-w-0 break-words">
                                            {member.phone}
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
