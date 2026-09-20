import { Form, Link } from '@inertiajs/react';
import { useId, useRef, useState } from 'react';
import AlertError from '@/components/alert-error';
import {
    ContactFields,
    type ContactRow,
} from '@/components/clients/contact-fields';
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
import { Textarea } from '@/components/ui/textarea';
import { index, show } from '@/routes/clients';
import type { ClientDetail, ClientStatus } from '@/types/client';
import type { RouteFormDefinition } from '@/wayfinder';

type ClientFormProps = {
    mode: 'create' | 'edit';
    client?: ClientDetail;
    submitForm: RouteFormDefinition<'post'>;
};

export function ClientForm({ mode, client, submitForm }: ClientFormProps) {
    const generatedId = useId();
    const nextRowId = useRef(0);
    const [contacts, setContacts] = useState<ContactRow[]>(() =>
        (client?.contacts ?? []).map((contact) => ({
            key: `contact-${contact.id}`,
            name: contact.name,
            job_title: contact.job_title,
            email: contact.email,
            phone: contact.phone,
            is_primary: contact.is_primary,
        })),
    );
    const [primaryKey, setPrimaryKey] = useState<string | null>(() => {
        const primary = client?.contacts.find((contact) => contact.is_primary);

        return primary ? `contact-${primary.id}` : null;
    });

    const addContact = () => {
        const key = `${generatedId}-contact-${nextRowId.current++}`;

        setContacts((current) => [
            ...current,
            {
                key,
                name: '',
                job_title: null,
                email: null,
                phone: null,
                is_primary: false,
            },
        ]);
    };

    const removeContact = (key: string) => {
        setContacts((current) =>
            current.filter((contact) => contact.key !== key),
        );
        setPrimaryKey((current) => (current === key ? null : current));
    };

    return (
        <Form
            {...submitForm}
            options={{ preserveScroll: true }}
            disableWhileProcessing
            className="space-y-5"
        >
            {({ processing, errors, hasErrors }) => (
                <>
                    {hasErrors ? (
                        <AlertError
                            title="Please review the client details."
                            errors={Object.values(errors).flatMap((error) =>
                                Array.isArray(error) ? error : [error],
                            )}
                        />
                    ) : null}

                    <Card>
                        <CardHeader>
                            <CardTitle>Client information</CardTitle>
                            <CardDescription>
                                Core business and contact details for this
                                relationship.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid min-w-0 gap-5 sm:grid-cols-2">
                            <div className="grid gap-2 sm:col-span-2">
                                <Label htmlFor="client-name">Name</Label>
                                <Input
                                    id="client-name"
                                    name="name"
                                    defaultValue={client?.name ?? ''}
                                    maxLength={150}
                                    required
                                    autoFocus
                                    aria-invalid={
                                        errors.name ? true : undefined
                                    }
                                    aria-describedby={
                                        errors.name
                                            ? 'client-name-error'
                                            : undefined
                                    }
                                />
                                <InputError
                                    id="client-name-error"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="client-industry">
                                    Industry
                                </Label>
                                <Input
                                    id="client-industry"
                                    name="industry"
                                    defaultValue={client?.industry ?? ''}
                                    maxLength={100}
                                    aria-invalid={
                                        errors.industry ? true : undefined
                                    }
                                    aria-describedby={
                                        errors.industry
                                            ? 'client-industry-error'
                                            : undefined
                                    }
                                />
                                <InputError
                                    id="client-industry-error"
                                    message={errors.industry}
                                />
                            </div>

                            <div className="grid gap-2">
                                {client?.status === 'archived' ? (
                                    <>
                                        <Label htmlFor="client-status">
                                            Status
                                        </Label>
                                        <Input
                                            id="client-status"
                                            name="status"
                                            value={
                                                'archived' satisfies ClientStatus
                                            }
                                            readOnly
                                            className="capitalize"
                                            aria-invalid={
                                                errors.status ? true : undefined
                                            }
                                            aria-describedby={
                                                errors.status
                                                    ? 'client-status-error'
                                                    : undefined
                                            }
                                        />
                                        <p className="text-muted-foreground text-sm">
                                            Use the confirmation action on the
                                            client detail page to reactivate
                                            this record.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <Label htmlFor="client-status">
                                            Status
                                        </Label>
                                        <select
                                            id="client-status"
                                            name="status"
                                            defaultValue={
                                                client?.status ?? 'active'
                                            }
                                            className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                            aria-invalid={
                                                errors.status ? true : undefined
                                            }
                                            aria-describedby={
                                                errors.status
                                                    ? 'client-status-error'
                                                    : undefined
                                            }
                                        >
                                            <option
                                                value={
                                                    'active' satisfies ClientStatus
                                                }
                                            >
                                                Active
                                            </option>
                                            <option
                                                value={
                                                    'inactive' satisfies ClientStatus
                                                }
                                            >
                                                Inactive
                                            </option>
                                        </select>
                                    </>
                                )}
                                <InputError
                                    id="client-status-error"
                                    message={errors.status}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="client-phone">Phone</Label>
                                <Input
                                    id="client-phone"
                                    name="phone"
                                    type="tel"
                                    defaultValue={client?.phone ?? ''}
                                    maxLength={50}
                                    aria-invalid={
                                        errors.phone ? true : undefined
                                    }
                                    aria-describedby={
                                        errors.phone
                                            ? 'client-phone-error'
                                            : undefined
                                    }
                                />
                                <InputError
                                    id="client-phone-error"
                                    message={errors.phone}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="client-website">Website</Label>
                                <Input
                                    id="client-website"
                                    name="website"
                                    type="url"
                                    defaultValue={client?.website ?? ''}
                                    maxLength={2048}
                                    placeholder="https://example.com"
                                    aria-invalid={
                                        errors.website ? true : undefined
                                    }
                                    aria-describedby={
                                        errors.website
                                            ? 'client-website-error'
                                            : undefined
                                    }
                                />
                                <InputError
                                    id="client-website-error"
                                    message={errors.website}
                                />
                            </div>

                            <div className="grid gap-2 sm:col-span-2">
                                <Label htmlFor="client-address">Address</Label>
                                <Textarea
                                    id="client-address"
                                    name="address"
                                    defaultValue={client?.address ?? ''}
                                    maxLength={2000}
                                    aria-invalid={
                                        errors.address ? true : undefined
                                    }
                                    aria-describedby={
                                        errors.address
                                            ? 'client-address-error'
                                            : undefined
                                    }
                                />
                                <InputError
                                    id="client-address-error"
                                    message={errors.address}
                                />
                            </div>

                            <div className="grid gap-2 sm:col-span-2">
                                <Label htmlFor="client-notes">
                                    Internal notes
                                </Label>
                                <Textarea
                                    id="client-notes"
                                    name="notes"
                                    defaultValue={client?.notes ?? ''}
                                    maxLength={5000}
                                    aria-invalid={
                                        errors.notes ? true : undefined
                                    }
                                    aria-describedby={
                                        errors.notes
                                            ? 'client-notes-error'
                                            : undefined
                                    }
                                />
                                <InputError
                                    id="client-notes-error"
                                    message={errors.notes}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <ContactFields
                                contacts={contacts}
                                errors={errors}
                                primaryKey={primaryKey}
                                disabled={processing}
                                onAdd={addContact}
                                onRemove={removeContact}
                                onPrimaryChange={setPrimaryKey}
                            />
                        </CardContent>
                    </Card>

                    <div className="flex flex-wrap justify-end gap-2">
                        <Button variant="outline" asChild>
                            <Link href={client ? show(client.id) : index()}>
                                Cancel
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? 'Savingâ€¦'
                                : mode === 'create'
                                  ? 'Create client'
                                  : 'Save changes'}
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
