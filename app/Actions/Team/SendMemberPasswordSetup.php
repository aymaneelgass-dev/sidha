<?php

namespace App\Actions\Team;

use App\Models\User;
use Illuminate\Support\Facades\Password;

class SendMemberPasswordSetup
{
    public function execute(User $member): string
    {
        return Password::broker()->sendResetLink([
            'email' => $member->email,
        ]);
    }
}
