<?php

namespace App\Actions\Team;

use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CreateMember
{
    public function __construct(
        private readonly SendMemberPasswordSetup $sendMemberPasswordSetup,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     * @return array{member: User, passwordStatus: string}
     */
    public function execute(array $data): array
    {
        $member = User::create([
            ...$data,
            'password' => Hash::make(Str::password(40)),
            'status' => UserStatus::Active,
            'email_verified_at' => null,
        ]);

        event(new Registered($member));

        return [
            'member' => $member,
            'passwordStatus' => $this->sendMemberPasswordSetup->execute($member),
        ];
    }
}
