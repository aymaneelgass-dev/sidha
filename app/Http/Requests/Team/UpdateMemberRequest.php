<?php

namespace App\Http\Requests\Team;

use App\Models\User;
use Illuminate\Validation\Rule;

class UpdateMemberRequest extends StoreMemberRequest
{
    public function authorize(): bool
    {
        $member = $this->route('member');

        return $member instanceof User
            && ($this->user()?->can('update', $member) ?? false);
    }

    /** @return array<string, list<mixed>> */
    public function rules(): array
    {
        $rules = parent::rules();
        $member = $this->route('member');

        $rules['email'] = [
            'required',
            'string',
            'lowercase',
            'email',
            'max:255',
            Rule::unique(User::class)->ignore($member instanceof User ? $member->id : null),
        ];

        return $rules;
    }
}
