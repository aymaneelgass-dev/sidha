<?php

namespace App\Console\Commands;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class MakeAdminCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sidha:make-admin {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create or promote an active SIDHA administrator';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email = strtolower(trim((string) $this->argument('email')));
        $emailValidator = Validator::make(
            ['email' => $email],
            ['email' => ['required', 'string', 'email']],
        );

        if ($emailValidator->fails()) {
            $this->error($emailValidator->errors()->first('email'));

            return self::FAILURE;
        }

        $user = User::query()->where('email', $email)->first();

        if ($user !== null) {
            $user->update([
                'role' => UserRole::Admin,
                'status' => UserStatus::Active,
            ]);

            $this->info('The account has been promoted to an active administrator.');

            return self::SUCCESS;
        }

        $attributes = [
            'name' => $this->ask('Name'),
            'password' => $this->secret('Password'),
            'password_confirmation' => $this->secret('Confirm password'),
        ];
        $validator = Validator::make($attributes, [
            'name' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', Password::default(), 'confirmed'],
        ]);

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }

            return self::FAILURE;
        }

        $user = new User([
            'name' => $attributes['name'],
            'email' => $email,
            'password' => $attributes['password'],
            'role' => UserRole::Admin,
            'status' => UserStatus::Active,
        ]);
        $user->forceFill(['email_verified_at' => now()]);
        $user->save();

        $this->info('The active administrator account has been created.');

        return self::SUCCESS;
    }
}
