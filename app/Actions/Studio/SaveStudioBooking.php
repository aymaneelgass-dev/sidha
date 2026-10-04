<?php

namespace App\Actions\Studio;

use App\Enums\StudioBookingStatus;
use App\Models\StudioBooking;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SaveStudioBooking
{
    /** @param array<string,mixed> $data */
    public function execute(array $data, ?StudioBooking $booking = null): StudioBooking
    {
        return DB::transaction(function () use ($data, $booking): StudioBooking {
            // A permanent row serializes all studio writes, even on an empty day.
            // InnoDB holds this lock until validation AND persistence have finished.
            DB::table('studio_booking_mutex')->where('id', 1)->lockForUpdate()->firstOrFail();
            $record = $booking ? StudioBooking::query()->lockForUpdate()->findOrFail($booking->id) : new StudioBooking;
            $record->fill($data);

            if ($record->status !== StudioBookingStatus::Cancelled) {
                $conflict = StudioBooking::query()
                    ->where('booking_date', $record->booking_date->format('Y-m-d'))
                    ->where('status', '!=', StudioBookingStatus::Cancelled->value)
                    ->where('start_time', '<', $record->end_time)
                    ->where('end_time', '>', $record->start_time)
                    ->when($record->exists, fn ($query) => $query->where('id', '!=', $record->id))
                    // Current read, not a stale MySQL repeatable-read snapshot.
                    ->lockForUpdate()->first();
                if ($conflict !== null) {
                    throw ValidationException::withMessages(['start_time' => 'This time overlaps another studio session. Choose a different time or cancel the existing session.']);
                }
            }

            $record->save();

            return $record;
        }, 3);
    }
}
