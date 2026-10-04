# SIDHA Phase 4 — Studio Booking

Execution: inline, three tasks, one independent global review at the end.
Approved specification: the user's Phase 4 brief. No further design gate.
Base: `04a9da1`; branch: `feat/sidha-phase-4-studio`; initial working tree clean.

## Constraints and decisions

- Preserve Phases 1–3; reuse active Admin/Member policies, SIDHA shell and theme.
- One studio, same-day sessions, minute precision, MAD decimal prices; no billing or calendar module.
- All non-cancelled sessions occupy their interval, including completed history. Adjacent intervals are permitted.
- Validate and write under one database transaction with a persistent single-studio mutex row; this also covers an empty schedule and concurrent requests.
- Civil dates/times use Africa/Casablanca, explicitly identified in the workspace; no browser timezone conversion.
- Upcoming means Scheduled/In Progress whose end is not past. History contains everything else. Search by client, filter service/status/date.
- Existing archived clients may be retained on edit, but not newly assigned, matching Phase 3.
- No deletion: cancel retains the session history. Admin changes status through edit or explicit cancellation.
- No push, merge, deployment, destructive Git commands or Phase 5.

## Task 1 — Persistence, conflicts, authorization

- [x] Add focused HTTP tests for validation, interval boundaries, update self-exclusion, cancellation/reactivation and Admin/Member access; observe failure first.
- [x] Add StudioBooking model/factory, enums, migration, policy, requests, transactional save action and controller routes.
- [x] Run focused Studio tests. Contract: `studio.*` routes, civil dates and HH:mm times, decimal string price, policy-derived capabilities.

## Task 2 — Studio workspace and Admin flow

- [x] Session Board grouped by day, strong hour typography, client/service/duration/price/status, upcoming/history navigation, useful GET filters and pagination.
- [x] Create/edit/detail screens and cancellation dialog; shared controls, field errors, accessible labels and focus, light/dark and narrow layouts.
- [x] Add read/filter tests; run targeted tests and TypeScript verification.

## Task 3 — Demo and final verification

- [x] Add local/testing-only fictional demo seeder, repeatable without overwriting edits, covering all four services and statuses; verify conflicts and preservation.
- [x] Relevant PHP tests, then full suite once, Pint, PHPStan, TypeScript, lint, build.
- [x] Targeted browser verification of Admin/Member flows, overlap error, filters, mobile, themes, keyboard and accessibility.
- [x] One independent global review; fix only real important findings; commit final result and report SHA/status.

## Review focus

Concurrency on empty/populated dates; restoring cancelled intervals; exact adjacency; archived-client edits; filtered history pagination and narrow-screen forms.

## Execution record

- Preflight: Task 2 consumes Task 1 routes and serialized booking; Task 3 consumes the same transactional save action for safe fixtures. No interface conflicts.
- Ruling: use the user's already isolated feature branch in the current workspace; avoid extra worktrees and process artifacts to honor the lightweight workflow.
- Tasks 1–2: 9 focused tests, 168 assertions pass; TypeScript and PHPStan pass. Initial red tests confirmed absent routes/components. SQLite civil-date persistence discrepancy reproduced and corrected in the model without changing prior phases.
- Final verification resumed on 2026-09-30 after WAMP startup: full suite 159 passed / 2 skipped / 1,397 assertions; focused Studio/seeder 11 tests / 184 assertions. Pint, PHPStan (512M), TypeScript, lint/format and build pass.
- MySQL QA concurrency confirmed waiting and conflict rejection on both empty and populated days, including a pre-existing repeatable-read snapshot. Browser Admin/Member, cancellation/reactivation, filters, keyboard and 320–1440px light/dark layouts verified. Zero axe violations in checked main content and no browser errors. Automation waits were adjusted for navigation and dialog transitions; no application fix was required during this resumed verification.
- One independent global review found no important/critical defects. Local setup and verification evidence: `docs/superpowers/phase-4-operations.md`. Keep the feature branch locally; no push, merge, deployment or Phase 5.
