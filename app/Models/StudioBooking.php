<?php

namespace App\Models;

use App\Enums\StudioBookingStatus;
use App\Enums\StudioServiceType;
use Database\Factories\StudioBookingFactory;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $client_id
 * @property StudioServiceType $service_type
 * @property Carbon $booking_date
 * @property string $start_time
 * @property string $end_time
 * @property string $price
 * @property StudioBookingStatus $status
 * @property string|null $notes
 * @property-read Client $client
 */
#[Fillable(['client_id', 'service_type', 'booking_date', 'start_time', 'end_time', 'price', 'status', 'notes'])]
class StudioBooking extends Model
{
    /** @use HasFactory<StudioBookingFactory> */
    use HasFactory;

    /** @return array<string,string> */
    protected function casts(): array
    {
        return ['service_type' => StudioServiceType::class, 'status' => StudioBookingStatus::class, 'booking_date' => 'date', 'price' => 'decimal:2'];
    }

    public function setStartTimeAttribute(string $value): void
    {
        $this->attributes['start_time'] = substr($value, 0, 5).':00';
    }

    public function setBookingDateAttribute(DateTimeInterface|string $value): void
    {
        // Keep the persisted civil date identical on MySQL and SQLite.
        $this->attributes['booking_date'] = Carbon::parse($value)->format('Y-m-d');
    }

    public function setEndTimeAttribute(string $value): void
    {
        $this->attributes['end_time'] = substr($value, 0, 5).':00';
    }

    /** @return BelongsTo<Client, $this> */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
