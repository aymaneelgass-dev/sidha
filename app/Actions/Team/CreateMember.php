<?php

namespace App\Actions\Team;

use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Throwable;

class CreateMember
{
    public function __construct(
        private readonly SendMemberPasswordSetup $sendMemberPasswordSetup,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     * @return array{member: User, passwordStatus: string, verificationSent: bool}
     */
    public function execute(array $data): array
    {
        $member = User::create([
            ...$data,
            'password' => Hash::make(Str::password(40)),
            'status' => UserStatus::Active,
            'email_verified_at' => null,
        ]);

        $verificationSent = true;
        try {
            event(new Registered($member));
        } catch (Throwable $exception) {
            report($exception);
            $verificationSent = false;
        }

        try {
            $passwordStatus = $this->sendMemberPasswordSetup->execute($member);
        } catch (Throwable $exception) {
            report($exception);
            $passwordStatus = Password::INVALID_USER;
        }

        return [
            'member' => $member,
            'passwordStatus' => $passwordStatus,
            'verificationSent' => $verificationSent,
        ];
    }
}
