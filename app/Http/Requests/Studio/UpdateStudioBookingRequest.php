<?php

namespace App\Http\Requests\Studio;

use App\Models\StudioBooking;

class UpdateStudioBookingRequest extends StoreStudioBookingRequest
{
    public function authorize(): bool
    {
        $booking = $this->route('booking');

        return $booking instanceof StudioBooking && ($this->user()?->can('update', $booking) ?? false);
    }
}
