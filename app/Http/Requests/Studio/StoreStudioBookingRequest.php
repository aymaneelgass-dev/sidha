<?php

namespace App\Http\Requests\Studio;

use App\Enums\StudioBookingStatus;
use App\Enums\StudioServiceType;
use App\Models\StudioBooking;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStudioBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', StudioBooking::class) ?? false;
    }

    /** @return array<string,list<mixed>> */
    public function rules(): array
    {
        $booking = $this->route('booking');
        $existingClient = $booking instanceof StudioBooking ? $booking->client_id : null;

        return [
            'client_id' => ['required', 'integer', Rule::exists('clients', 'id')->where(function (Builder $query) use ($existingClient): void {
                $query->where(function (Builder $query) use ($existingClient): void {
                    $query->where('status', '!=', 'archived');
                    if ($existingClient !== null) {
                        $query->orWhere('id', $existingClient);
                    }
                });
            })],
            'service_type' => ['required', Rule::enum(StudioServiceType::class)],
            'booking_date' => ['required', 'date_format:Y-m-d'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'price' => ['required', 'numeric', 'min:0', 'max:9999999999.99', 'regex:/^\d{1,10}(\.\d{1,2})?$/'],
            'status' => ['required', Rule::enum(StudioBookingStatus::class)],
            'notes' => ['nullable', 'string', 'max:10000'],
        ];
    }
}
