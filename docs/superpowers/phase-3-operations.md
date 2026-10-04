# SIDHA Phase 3 — local setup and verification

## Database prerequisites

Use MySQL with InnoDB tables. The Projects migration checks that the existing
`clients` table uses InnoDB before creating anything; the two Phase 3 tables
explicitly use InnoDB. An unsupported client engine produces an actionable
error. No existing table is converted automatically.

For an existing Phase 2 installation, back up through the normal database
procedure, verify the client storage engine, then run `php artisan migrate`.
Do not use `migrate:fresh` on an existing installation.

Phase 3 was verified on a separate local MySQL database. The original local
`sidha` database was not migrated or reseeded during development.

## Optional fictional data

Run `php artisan db:seed --class=SidhaPhaseThreeDemoSeeder` in local/testing.
This creates seven projects and eleven expenses for four explicitly fictional
clients. It covers all seven stages, all four types, absent dates/briefs,
zero costs and positive/zero/negative margins.

The Phase 3 seeder skips existing fixture client groups identified by their
reserved `.phase3-demo.test` website. It does not overwrite edited projects or
expenses. Do not change those fixture website identifiers if you intend to
rerun it. Run the Phase 3 seeder directly on an already populated installation;
the existing Phase 2 seeder is intended for initial setup and is not repeatable.

## Behavior

- Project references derive from the database id and are not editable.
- Admin can create/edit/archive projects and manage expenses. Member has
  read-only access, including financial data.
- Archive through the confirmation on the project detail. Restore by editing
  its production stage. Archived projects remain editable and visible.
- Amounts are MAD, at most two decimals. Budget may be zero; expenses must be
  positive. Totals and estimated margin are computed from every expense,
  independently of pagination.
- The dashboard remains the Phase 1 demonstration dashboard.

## Quality checks

```text
php artisan test
php vendor/bin/pint --test
php vendor/bin/phpstan analyse --no-progress
npm run types:check
npm run check
npm run build
```

On Windows, the local Vite/agent-browser tools may require permission to launch
child processes outside the execution sandbox. This does not require publishing,
deployment or changes to the application dependencies.
