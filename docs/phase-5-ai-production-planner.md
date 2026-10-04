# Phase 5 — AI Production Planner

Project Detail contains a saved production treatment with objective, creative concept, script, shot list, optional voice over and production checklist. Admins generate or confirm replacement; Members read only. A nonempty saved brief is required. Treat every result as a proposal requiring team/client validation.

## Configuration

Run `php artisan migrate` to add `production_plans`. Set `OPENAI_API_KEY` in the server environment or untracked `.env`. `OPENAI_MODEL` defaults to `gpt-5-mini`; override it with a Responses/Structured Outputs compatible model available to your account. Clear/rebuild Laravel config cache after changing configuration. No key is passed to React or logged by this integration.

Laravel's HTTP client calls `https://api.openai.com/v1/responses` with strict `text.format` JSON Schema, `store: false`, an 8,000-token output limit, 10-second connection timeout and 90-second request timeout. There are no automatic retries or external tools. Responses are locally validated before an atomic write. A unique project foreign key, project cache lock and revision check protect one active plan per project. No history is retained.

Expected errors are safe validation messages. Missing config/brief, refusal, incomplete output, invalid JSON/schema, network timeout and provider errors preserve the previous content and metadata. With Laravel's database cache, the per-project lock spans web workers. Generation is limited to ten requests per minute per authenticated user.

## Fictional demonstration

Optional, local/testing only: `php artisan db:seed --class=SidhaPhaseFiveDemoSeeder`. Adds one fictional client/project and a handwritten treatment, labeled “Fictional demo · No OpenAI call” in the UI. Reruns leave the existing demo group and user edits alone. It does not call OpenAI and is not included automatically in the default seeder.

## Verification

Tests use HTTP fakes and prevent stray requests: `php -d xdebug.mode=off vendor/phpunit/phpunit/phpunit tests/Feature/Projects/ProductionPlanTest.php`. Browser QA must use fictional data and fake responses or disabled configuration, never a live provider key.

Official references verified during implementation: [Responses structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs), [GPT-5 mini](https://developers.openai.com/api/docs/models/gpt-5-mini).
