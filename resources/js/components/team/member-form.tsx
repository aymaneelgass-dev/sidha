import { Form, Link } from '@inertiajs/react';
import AlertError from '@/components/alert-error';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index } from '@/routes/team';
import type { TeamMemberDetail, TeamMemberRole } from '@/types/team';
import type { RouteFormDefinition } from '@/wayfinder';

type MemberFormProps = {
    mode: 'create' | 'edit';
    member?: TeamMemberDetail;
    submitForm: RouteFormDefinition<'post'>;
};

export function MemberForm({ mode, member, submitForm }: MemberFormProps) {
    return (
        <Form {...submitForm} disableWhileProcessing>
            {({ processing, errors, hasErrors }) => (
                <div className="space-y-5">
                    {hasErrors ? (
                        <AlertError
                            title="Please correct the member details."
                            errors={Object.values(errors).flatMap((error) =>
                                Array.isArray(error) ? error : [error],
                            )}
                        />
                    ) : null}

                    <Card>
                        <CardHeader>
                            <CardTitle>Member information</CardTitle>
                            <CardDescription>
                                Contact details, professional role, and account
                                access level.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid min-w-0 gap-5 sm:grid-cols-2">
                            <div className="grid gap-2 sm:col-span-2">
                                <Label htmlFor="member-name">Name</Label>
                                <Input
                                    id="member-name"
                                    name="name"
                                    defaultValue={member?.name ?? ''}
                                    maxLength={150}
                                    required
                                    autoFocus
                                    aria-invalid={
                                        errors.name ? true : undefined
                                    }
                                    aria-describedby={
                                        errors.name
                                            ? 'member-name-error'
                                            : undefined
                                    }
                                />
                                <InputError
                                    id="member-name-error"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="member-email">Email</Label>
                                <Input
                                    id="member-email"
                                    name="email"
                                    type="email"
                                    defaultValue={member?.email ?? ''}
                                    maxLength={255}
                                    required
                                    aria-invalid={
                                        errors.email ? true : undefined
                                    }
                                    aria-describedby={
                                        errors.email
                                            ? 'member-email-error'
                                            : undefined
                                    }
                                />
                                <InputError
                                    id="member-email-error"
                                    message={errors.email}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="member-role">Role</Label>
                                <select
                                    id="member-role"
                                    name="role"
                                    defaultValue={member?.role ?? 'member'}
                                    className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                    aria-invalid={
                                        errors.role ? true : undefined
                                    }
                                    aria-describedby={
                                        errors.role
                                            ? 'member-role-error'
                                            : undefined
                                    }
                                >
                                    <option
                                        value={
                                            'member' satisfies TeamMemberRole
                                        }
                                    >
                                        Member
                                    </option>
                                    <option
                                        value={'admin' satisfies TeamMemberRole}
                                    >
                                        Admin
                                    </option>
                                </select>
                                <InputError
                                    id="member-role-error"
                                    message={errors.role}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="member-job-title">
                                    Job title
                                </Label>
                                <Input
                                    id="member-job-title"
                                    name="job_title"
                                    defaultValue={member?.job_title ?? ''}
                                    maxLength={150}
                                    aria-invalid={
                                        errors.job_title ? true : undefined
                                    }
                                    aria-describedby={
                                        errors.job_title
                                            ? 'member-job-title-error'
                                            : undefined
                                    }
                                />
                                <InputError
                                    id="member-job-title-error"
                                    message={errors.job_title}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="member-phone">Phone</Label>
                                <Input
                                    id="member-phone"
                                    name="phone"
                                    type="tel"
                                    defaultValue={member?.phone ?? ''}
                                    maxLength={50}
                                    aria-invalid={
                                        errors.phone ? true : undefined
                                    }
                                    aria-describedby={
                                        errors.phone
                                            ? 'member-phone-error'
                                            : undefined
                                    }
                                />
                                <InputError
                                    id="member-phone-error"
                                    message={errors.phone}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-wrap justify-end gap-2">
                        <Button variant="outline" asChild>
                            <Link href={index()}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? 'Saving…'
                                : mode === 'create'
                                  ? 'Create member'
                                  : 'Save changes'}
                        </Button>
                    </div>
                </div>
            )}
        </Form>
    );
}
