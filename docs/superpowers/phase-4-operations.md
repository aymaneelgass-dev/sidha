# SIDHA Phase 4 — Studio local setup and verification

## Local database

Use MySQL with InnoDB. The Studio migration creates `studio_bookings` and a
permanent `studio_booking_mutex` row with InnoDB. The existing `clients` table
must also use InnoDB, as required by Phase 3. Run `php artisan migrate` on a
normally backed-up existing installation; do not use `migrate:fresh`.

Verification used the separate existing MySQL database
`sidha_phase4_qa_20260925`, served at `http://127.0.0.1:8015`. The application's
default database setting was not changed during the resumed verification.
To inspect this QA database locally, set `DB_DATABASE` in the server process
environment before running `php artisan serve --host=127.0.0.1 --port=8015`.

## Optional fictional data

Run `php artisan db:seed --class=SidhaPhaseFourDemoSeeder` in local/testing.
It creates six sessions for four explicitly fictional clients, covering four
services and four statuses. Dates are relative to the first seeding day.
Older demonstration sessions move into history naturally.

The seeder skips an existing client group identified by its reserved
`.phase4-demo.test` website, preserving edited sessions and clients. Keep those
website identifiers when rerunning. Conflicting fictional slots move to another
day; existing sessions are not altered. On a populated installation, run this
seeder directly rather than rerunning the initial `DatabaseSeeder`.

## Studio behavior

- Active Admin can create/edit/cancel sessions. Active Member can read/filter
  the board and details but cannot change sessions.
- Dates and times are civil values in Africa/Casablanca, at minute precision.
  Sessions start and finish on the same day. Prices are MAD with two decimals.
- All non-cancelled sessions occupy their interval, including completed history.
  Exact adjacency is allowed. Cancellation keeps history and releases the slot;
  reactivation checks availability again.
- The transaction locks the permanent studio mutex before reloading a session,
  checking overlaps with a current locking read, and saving. This also protects
  an empty schedule and a caller's pre-existing repeatable-read snapshot.
- Archived clients cannot be newly assigned, but an existing assignment may be
  retained on edit. There is no session deletion, billing or calendar module.
- Upcoming contains scheduled/in-progress sessions whose end is still ahead;
  everything else appears in history. Filters and pagination use GET parameters.

## Verification on 2026-09-30

- Full PHP suite: 161 tests, 159 passed, 2 skipped, 1,397 assertions.
- Independent review: no important or critical findings; focused Studio/seeder
  suite passed 11 tests and 184 assertions.
- Pint, PHPStan, TypeScript, lint/format and production build passed. PHPStan
  needed `--memory-limit=512M` because the local PHP default is 128M.
- Real MySQL concurrent writers tested on empty and populated days: second
  writer waited for the first commit, then rejected the conflicting session.
- Browser: Admin create/edit/overlap rejection with retained fields and error
  focus; keyboard Escape and restored dialog focus; cancellation/history and
  reactivation; client/service/status/date filters; Member read-only controls
  and HTTP 403 on create/edit. Dashboard/Projects/Clients/Calendar returned 200.
- Light/dark/system appearance, empty states, populated board and forms checked
  at desktop, 768px, 390px and 320px. No horizontal overflow in checked layouts;
  axe reported zero violations on checked main content. No browser errors.

Reproduce quality checks:

```text
php -d xdebug.mode=off artisan test
php -d xdebug.mode=off vendor/bin/pint --test
php -d xdebug.mode=off vendor/bin/phpstan analyse --no-progress --memory-limit=512M
npm run types:check
npm run check
npm run build
```

Browser QA scripts and screenshots remain local ignored files in `storage/app`.
The QA booking created during verification is fictional. No push, merge,
deployment or Phase 5 work was performed.
