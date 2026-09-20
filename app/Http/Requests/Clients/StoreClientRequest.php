<?php

namespace App\Http\Requests\Clients;

use App\Enums\ClientStatus;
use App\Models\Client;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreClientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Client::class) ?? false;
    }

    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'industry' => ['nullable', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:50'],
            'website' => ['nullable', 'url', 'max:2048'],
            'address' => ['nullable', 'string', 'max:2000'],
            'notes' => ['nullable', 'string', 'max:5000'],
            'status' => ['required', Rule::enum(ClientStatus::class)],
            'contacts' => ['array'],
            'contacts.*.name' => ['required', 'string', 'max:150'],
            'contacts.*.job_title' => ['nullable', 'string', 'max:150'],
            'contacts.*.email' => ['nullable', 'email', 'max:255'],
            'contacts.*.phone' => ['nullable', 'string', 'max:50'],
            'contacts.*.is_primary' => ['required', 'boolean'],
        ];
    }

    /** @return list<callable> */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $contacts = $this->input('contacts', []);

                if (! is_array($contacts)) {
                    return;
                }

                $primaryCount = collect($contacts)->filter(
                    fn (mixed $contact): bool => is_array($contact)
                        && filter_var(
                            $contact['is_primary'] ?? false,
                            FILTER_VALIDATE_BOOLEAN,
                        ),
                )->count();

                if ($primaryCount > 1) {
                    $validator->errors()->add(
                        'contacts',
                        'Only one primary contact may be selected.',
                    );
                }
            },
        ];
    }

    protected function prepareForValidation(): void
    {
        $clientFields = [
            'name',
            'industry',
            'phone',
            'website',
            'address',
            'notes',
            'status',
        ];
        $normalized = [];

        foreach ($clientFields as $field) {
            if ($this->exists($field)) {
                $normalized[$field] = $this->normalizeScalar($this->input($field));
            }
        }

        if ($this->exists('contacts')) {
            $contacts = $this->input('contacts');

            if (is_array($contacts)) {
                $normalized['contacts'] = array_map(function (mixed $contact): mixed {
                    if (! is_array($contact)) {
                        return $contact;
                    }

                    return array_map(
                        fn (mixed $value): mixed => $this->normalizeScalar($value),
                        $contact,
                    );
                }, $contacts);
            }
        }

        $this->merge($normalized);
    }

    private function normalizeScalar(mixed $value): mixed
    {
        if (! is_string($value)) {
            return $value;
        }

        $trimmed = trim($value);

        return $trimmed === '' ? null : $trimmed;
    }
}
