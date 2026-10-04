import { Plus, Trash2 } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ClientContact } from '@/types/client';

export type ContactRow = Omit<ClientContact, 'id'> & {
    key: string;
};

type ContactFieldsProps = {
    contacts: readonly ContactRow[];
    errors: Record<string, string>;
    primaryKey: string | null;
    disabled: boolean;
    onAdd: () => void;
    onRemove: (key: string) => void;
    onPrimaryChange: (key: string | null) => void;
};

export function ContactFields({
    contacts,
    errors,
    primaryKey,
    disabled,
    onAdd,
    onRemove,
    onPrimaryChange,
}: ContactFieldsProps) {
    return (
        <fieldset
            className="space-y-4"
            disabled={disabled}
            aria-invalid={errors.contacts ? true : undefined}
            aria-describedby={errors.contacts ? 'contacts-error' : undefined}
        >
            <legend className="sr-only">Client contacts</legend>

            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h3 className="font-semibold">Contacts</h3>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Add any people associated with this client and choose at
                        most one primary contact.
                    </p>
                </div>
                <Button type="button" variant="outline" onClick={onAdd}>
                    <Plus aria-hidden="true" />
                    Add contact
                </Button>
            </div>

            <InputError id="contacts-error" message={errors.contacts} />

            {contacts.length === 0 ? (
                <div className="text-muted-foreground rounded-lg border border-dashed p-5 text-center text-sm">
                    No contacts added. You can save this client without one.
                </div>
            ) : (
                <div className="space-y-4">
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="radio"
                            name="primary-contact"
                            checked={primaryKey === null}
                            onChange={() => onPrimaryChange(null)}
                            aria-invalid={errors.contacts ? true : undefined}
                            aria-describedby={
                                errors.contacts ? 'contacts-error' : undefined
                            }
                        />
                        No primary contact
                    </label>

                    {contacts.map((contact, index) => {
                        const prefix = `contacts.${index}`;
                        const fieldPrefix = `contacts[${index}]`;
                        const primaryErrorId = `contact-${contact.key}-primary-error`;
                        const nameErrorId = `contact-${contact.key}-name-error`;
                        const jobTitleErrorId = `contact-${contact.key}-job-title-error`;
                        const emailErrorId = `contact-${contact.key}-email-error`;
                        const phoneErrorId = `contact-${contact.key}-phone-error`;
                        const primaryDescribedBy = [
                            errors.contacts ? 'contacts-error' : null,
                            errors[`${prefix}.is_primary`]
                                ? primaryErrorId
                                : null,
                        ]
                            .filter(Boolean)
                            .join(' ');

                        return (
                            <section
                                key={contact.key}
                                aria-labelledby={`contact-${contact.key}-heading`}
                                className="min-w-0 space-y-4 rounded-lg border p-4"
                            >
                                <div className="flex min-w-0 items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <h4
                                            id={`contact-${contact.key}-heading`}
                                            className="font-medium"
                                        >
                                            Contact {index + 1}
                                        </h4>
                                        <label className="mt-2 flex items-center gap-2 text-sm">
                                            <input
                                                type="radio"
                                                name="primary-contact"
                                                checked={
                                                    primaryKey === contact.key
                                                }
                                                onChange={() =>
                                                    onPrimaryChange(contact.key)
                                                }
                                                aria-invalid={
                                                    errors.contacts ||
                                                    errors[
                                                        `${prefix}.is_primary`
                                                    ]
                                                        ? true
                                                        : undefined
                                                }
                                                aria-describedby={
                                                    primaryDescribedBy ||
                                                    undefined
                                                }
                                            />
                                            Primary contact
                                        </label>
                                        <input
                                            type="hidden"
                                            name={`${fieldPrefix}[is_primary]`}
                                            value={
                                                primaryKey === contact.key
                                                    ? '1'
                                                    : '0'
                                            }
                                        />
                                        <InputError
                                            id={primaryErrorId}
                                            message={
                                                errors[`${prefix}.is_primary`]
                                            }
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        aria-label={`Remove ${contact.name || `contact ${index + 1}`}`}
                                        title={`Remove ${contact.name || `contact ${index + 1}`}`}
                                        onClick={() => onRemove(contact.key)}
                                    >
                                        <Trash2 aria-hidden="true" />
                                    </Button>
                                </div>

                                <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor={`contact-${contact.key}-name`}
                                        >
                                            Name
                                        </Label>
                                        <Input
                                            id={`contact-${contact.key}-name`}
                                            name={`${fieldPrefix}[name]`}
                                            defaultValue={contact.name}
                                            maxLength={150}
                                            required
                                            aria-invalid={
                                                errors[`${prefix}.name`]
                                                    ? true
                                                    : undefined
                                            }
                                            aria-describedby={
                                                errors[`${prefix}.name`]
                                                    ? nameErrorId
                                                    : undefined
                                            }
                                        />
                                        <InputError
                                            id={nameErrorId}
                                            message={errors[`${prefix}.name`]}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor={`contact-${contact.key}-job-title`}
                                        >
                                            Job title
                                        </Label>
                                        <Input
                                            id={`contact-${contact.key}-job-title`}
                                            name={`${fieldPrefix}[job_title]`}
                                            defaultValue={
                                                contact.job_title ?? ''
                                            }
                                            maxLength={150}
                                            aria-invalid={
                                                errors[`${prefix}.job_title`]
                                                    ? true
                                                    : undefined
                                            }
                                            aria-describedby={
                                                errors[`${prefix}.job_title`]
                                                    ? jobTitleErrorId
                                                    : undefined
                                            }
                                        />
                                        <InputError
                                            id={jobTitleErrorId}
                                            message={
                                                errors[`${prefix}.job_title`]
                                            }
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor={`contact-${contact.key}-email`}
                                        >
                                            Email
                                        </Label>
                                        <Input
                                            id={`contact-${contact.key}-email`}
                                            name={`${fieldPrefix}[email]`}
                                            type="email"
                                            defaultValue={contact.email ?? ''}
                                            maxLength={255}
                                            aria-invalid={
                                                errors[`${prefix}.email`]
                                                    ? true
                                                    : undefined
                                            }
                                            aria-describedby={
                                                errors[`${prefix}.email`]
                                                    ? emailErrorId
                                                    : undefined
                                            }
                                        />
                                        <InputError
                                            id={emailErrorId}
                                            message={errors[`${prefix}.email`]}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor={`contact-${contact.key}-phone`}
                                        >
                                            Phone
                                        </Label>
                                        <Input
                                            id={`contact-${contact.key}-phone`}
                                            name={`${fieldPrefix}[phone]`}
                                            type="tel"
                                            defaultValue={contact.phone ?? ''}
                                            maxLength={50}
                                            aria-invalid={
                                                errors[`${prefix}.phone`]
                                                    ? true
                                                    : undefined
                                            }
                                            aria-describedby={
                                                errors[`${prefix}.phone`]
                                                    ? phoneErrorId
                                                    : undefined
                                            }
                                        />
                                        <InputError
                                            id={phoneErrorId}
                                            message={errors[`${prefix}.phone`]}
                                        />
                                    </div>
                                </div>
                            </section>
                        );
                    })}
                </div>
            )}
        </fieldset>
    );
}
