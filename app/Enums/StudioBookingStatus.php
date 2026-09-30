<?php

namespace App\Enums;

enum StudioBookingStatus: string
{
    case Scheduled = 'scheduled';
    case InProgress = 'in-progress';
    case Completed = 'completed';
    case Cancelled = 'cancelled';
}
