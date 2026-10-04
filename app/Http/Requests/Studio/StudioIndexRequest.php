<?php

namespace App\Http\Requests\Studio;

use App\Enums\StudioBookingStatus;
use App\Enums\StudioServiceType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StudioIndexRequest extends FormRequest
{
    /** @return array<string,list<mixed>> */
    public function rules(): array
    {
        return ['view' => ['nullable', Rule::in(['upcoming', 'history'])], 'search' => ['nullable', 'string', 'max:100'], 'status' => ['nullable', Rule::enum(StudioBookingStatus::class)], 'service_type' => ['nullable', Rule::enum(StudioServiceType::class)], 'date' => ['nullable', 'date_format:Y-m-d'], 'page' => ['nullable', 'integer', 'min:1']];
    }
}
