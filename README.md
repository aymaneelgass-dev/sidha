# SIDHA

SIDHA is an internal creative production workspace built with Laravel, Inertia, React and MySQL. The implemented paths are Dashboard, Clients, Team, Projects with project expenses, Studio bookings, and the AI Production Planner on Project Detail. Calendar and the broader SIDHA AI page are explicitly marked as future areas.

## Local setup

1. Copy `.env.example` to `.env` and set the local MySQL connection and `APP_KEY`. Keep `.env` untracked.
2. Run `composer install` and `npm install` if dependencies are not installed.
3. Run `php artisan migrate` to apply outstanding migrations without replacing existing data.
4. Run `npm run build`, then `php artisan serve` to open the application.
5. Sign in with an existing Admin account. Admin can manage records and generate plans; Member can read the main modules but cannot change business records.

The Dashboard contains a clearly labeled **illustrative preview**. Its figures and activity are fictional samples, separate from saved MySQL records. Use Clients, Projects, Project Detail, and Studio to demonstrate persisted data.

## Fictional demonstration data

These optional seeders run only in local/testing, use fictional `.test` clients, and preserve their existing demo groups when rerun:

```sh
php artisan db:seed --class=SidhaPhaseThreeDemoSeeder
php artisan db:seed --class=SidhaPhaseFourDemoSeeder
php artisan db:seed --class=SidhaPhaseFiveDemoSeeder
```

Phase 3 adds projects and expenses; Phase 4 adds studio bookings; Phase 5 adds a handwritten Production Plan labeled as demo content. Review the current database before seeding. Do not run `migrate:fresh` against an existing installation.

## AI Production Planner

Set `OPENAI_API_KEY` only in the server's untracked `.env`. `OPENAI_MODEL` is optional and defaults to `gpt-5-mini`. After changing configuration, run `php artisan config:clear`. In SIDHA, an Admin opens a project with a creative brief and selects **Generate Production Plan**. Regeneration requires confirmation and replaces the saved plan; failed requests preserve it. A real generation calls OpenAI and may incur cost. The key never belongs in frontend code or Git.

See [Phase 5 documentation](docs/phase-5-ai-production-planner.md) for the request format, validation and safeguards.

## Quality checks

```sh
php artisan test
php vendor/bin/pint --test
php vendor/bin/phpstan analyse --no-progress --memory-limit=512M
npm run types:check
npm run check
npm run build
```
