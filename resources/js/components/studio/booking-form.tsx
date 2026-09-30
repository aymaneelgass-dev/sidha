import { Form, Link } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { sessionDuration } from '@/components/studio/studio-format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { create as createClient } from '@/routes/clients';
import { index, show } from '@/routes/studio';
import { studioServices, studioStatuses } from '@/types/studio';
import type { StudioBooking, StudioClient } from '@/types/studio';
import type { RouteFormDefinition } from '@/wayfinder';

export function BookingForm({
    booking,
    clients,
    today,
    timezone,
    submitForm,
}: {
    booking?: StudioBooking;
    clients: StudioClient[];
    today?: string;
    timezone: string;
    submitForm: RouteFormDefinition<'post'>;
}) {
    const [start, setStart] = useState(booking?.start_time ?? '');
    const [end, setEnd] = useState(booking?.end_time ?? '');
    const selectClass =
        'bg-background focus-visible:outline-ring mt-2 h-10 w-full rounded-md border px-3 text-sm focus-visible:outline-2';
    return (
        <Form
            {...submitForm}
            disableWhileProcessing
            onError={(errors) =>
                requestAnimationFrame(() =>
                    document.getElementById(Object.keys(errors)[0])?.focus(),
                )
            }
        >
            {({ errors, processing }) => (
                <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                    <div className="min-w-0 space-y-8">
                        <section
                            className="space-y-5 border-t pt-5"
                            aria-labelledby="identity-heading"
                        >
                            <h3
                                id="identity-heading"
                                className="text-xs font-medium tracking-widest uppercase"
                            >
                                01 / The session
                            </h3>
                            <div>
                                <Label htmlFor="client_id">Client</Label>
                                <select
                                    id="client_id"
                                    name="client_id"
                                    defaultValue={booking?.client_id ?? ''}
                                    required
                                    aria-invalid={!!errors.client_id}
                                    aria-describedby={
                                        errors.client_id
                                            ? 'client_id-error'
                                            : undefined
                                    }
                                    className={selectClass}
                                >
                                    <option value="" disabled>
                                        Select a client
                                    </option>
                                    {clients.map((client) => (
                                        <option
                                            key={client.id}
                                            value={client.id}
                                        >
                                            {client.name}
                                            {client.status === 'archived'
                                                ? ' (archived)'
                                                : ''}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    className="text-red-700 dark:text-red-400"
                                    id="client_id-error"
                                    message={errors.client_id}
                                />
                                {!clients.length && (
                                    <p className="text-muted-foreground mt-2 text-sm">
                                        Create a client before booking a
                                        session.{' '}
                                        <Link
                                            href={createClient()}
                                            className="text-primary underline underline-offset-4"
                                        >
                                            Add client
                                        </Link>
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="service_type">
                                    Session type
                                </Label>
                                <select
                                    id="service_type"
                                    name="service_type"
                                    defaultValue={
                                        booking?.service_type ??
                                        'music-recording'
                                    }
                                    required
                                    aria-invalid={!!errors.service_type}
                                    aria-describedby={
                                        errors.service_type
                                            ? 'service_type-error'
                                            : undefined
                                    }
                                    className={selectClass}
                                >
                                    {Object.entries(studioServices).map(
                                        ([v, label]) => (
                                            <option key={v} value={v}>
                                                {label}
                                            </option>
                                        ),
                                    )}
                                </select>
                                <InputError
                                    className="text-red-700 dark:text-red-400"
                                    id="service_type-error"
                                    message={errors.service_type}
                                />
                            </div>
                        </section>
                        <section
                            className="space-y-5 border-t pt-5"
                            aria-labelledby="timing-heading"
                        >
                            <h3
                                id="timing-heading"
                                className="text-xs font-medium tracking-widest uppercase"
                            >
                                02 / Time in the studio
                            </h3>
                            <p
                                id="time-help"
                                className="text-muted-foreground text-sm"
                            >
                                All times are local to {timezone}. Sessions
                                start and finish on the same day.
                            </p>
                            <div>
                                <Label htmlFor="booking_date">
                                    Session date
                                </Label>
                                <Input
                                    id="booking_date"
                                    name="booking_date"
                                    type="date"
                                    defaultValue={
                                        booking?.booking_date ?? today
                                    }
                                    required
                                    aria-invalid={!!errors.booking_date}
                                    aria-describedby={
                                        errors.booking_date
                                            ? 'booking_date-error'
                                            : undefined
                                    }
                                    className="mt-2 min-w-0"
                                />
                                <InputError
                                    className="text-red-700 dark:text-red-400"
                                    id="booking_date-error"
                                    message={errors.booking_date}
                                />
                            </div>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor="start_time">
                                        Start time
                                    </Label>
                                    <Input
                                        id="start_time"
                                        name="start_time"
                                        type="time"
                                        step={60}
                                        value={start}
                                        onChange={(event) =>
                                            setStart(event.target.value)
                                        }
                                        required
                                        aria-invalid={!!errors.start_time}
                                        aria-describedby={
                                            errors.start_time
                                                ? 'time-help start_time-error'
                                                : 'time-help'
                                        }
                                        className="mt-2 min-w-0"
                                    />
                                    <InputError
                                        className="text-red-700 dark:text-red-400"
                                        id="start_time-error"
                                        message={errors.start_time}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="end_time">End time</Label>
                                    <Input
                                        id="end_time"
                                        name="end_time"
                                        type="time"
                                        step={60}
                                        value={end}
                                        onChange={(event) =>
                                            setEnd(event.target.value)
                                        }
                                        required
                                        aria-invalid={!!errors.end_time}
                                        aria-describedby={
                                            errors.end_time
                                                ? 'time-help end_time-error'
                                                : 'time-help'
                                        }
                                        className="mt-2 min-w-0"
                                    />
                                    <InputError
                                        className="text-red-700 dark:text-red-400"
                                        id="end_time-error"
                                        message={errors.end_time}
                                    />
                                </div>
                            </div>
                        </section>
                        <section
                            className="space-y-5 border-t pt-5"
                            aria-labelledby="details-heading"
                        >
                            <h3
                                id="details-heading"
                                className="text-xs font-medium tracking-widest uppercase"
                            >
                                03 / Session details
                            </h3>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor="price">Price (MAD)</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        min="0"
                                        max="9999999999.99"
                                        step="0.01"
                                        defaultValue={booking?.price}
                                        required
                                        aria-invalid={!!errors.price}
                                        aria-describedby={
                                            errors.price
                                                ? 'price-error'
                                                : undefined
                                        }
                                        className="mt-2"
                                    />
                                    <InputError
                                        className="text-red-700 dark:text-red-400"
                                        id="price-error"
                                        message={errors.price}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="status">Status</Label>
                                    <select
                                        id="status"
                                        name="status"
                                        defaultValue={
                                            booking?.status ?? 'scheduled'
                                        }
                                        required
                                        aria-invalid={!!errors.status}
                                        aria-describedby={
                                            errors.status
                                                ? 'status-error'
                                                : undefined
                                        }
                                        className={selectClass}
                                    >
                                        {Object.entries(studioStatuses).map(
                                            ([v, label]) => (
                                                <option key={v} value={v}>
                                                    {label}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                    <InputError
                                        className="text-red-700 dark:text-red-400"
                                        id="status-error"
                                        message={errors.status}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="notes">
                                    Session notes{' '}
                                    <span className="text-muted-foreground font-normal">
                                        (optional)
                                    </span>
                                </Label>
                                <Textarea
                                    id="notes"
                                    name="notes"
                                    defaultValue={booking?.notes ?? ''}
                                    rows={5}
                                    maxLength={10000}
                                    placeholder="Preparation, direction or details for the session…"
                                    aria-invalid={!!errors.notes}
                                    aria-describedby={
                                        errors.notes ? 'notes-error' : undefined
                                    }
                                    className="mt-2"
                                />
                                <InputError
                                    className="text-red-700 dark:text-red-400"
                                    id="notes-error"
                                    message={errors.notes}
                                />
                            </div>
                        </section>
                        <div className="flex flex-wrap gap-3 border-t pt-5">
                            <Button
                                type="submit"
                                className="dark:bg-violet-700 dark:hover:bg-violet-800"
                                disabled={processing || !clients.length}
                            >
                                {processing
                                    ? 'Saving…'
                                    : booking
                                      ? 'Save session'
                                      : 'Book session'}
                            </Button>
                            <Button asChild variant="outline">
                                <Link
                                    href={booking ? show(booking.id) : index()}
                                >
                                    Back
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <aside className="bg-muted/40 border-primary h-fit min-w-0 border-t-2 p-5 lg:sticky lg:top-6">
                        <p className="text-xs font-medium tracking-widest uppercase">
                            Session time
                        </p>
                        <div className="mt-6 space-y-2 font-mono text-4xl tracking-tight tabular-nums">
                            <p>{start || '--:--'}</p>
                            <p className="text-muted-foreground">
                                <span className="sr-only">to </span>
                                {end || '--:--'}
                            </p>
                        </div>
                        <p
                            aria-live="polite"
                            className="mt-5 text-sm font-medium"
                        >
                            {sessionDuration(start, end)}
                        </p>
                        <p className="text-muted-foreground mt-6 border-t pt-4 text-sm leading-relaxed">
                            One studio, one session at a time. Cancelled
                            sessions release their slot. Availability is checked
                            when you save.
                        </p>
                    </aside>
                </div>
            )}
        </Form>
    );
}
