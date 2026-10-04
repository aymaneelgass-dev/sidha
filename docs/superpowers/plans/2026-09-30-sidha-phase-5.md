# SIDHA Phase 5 Implementation Plan

> Execute with superpowers:executing-plans inline, as explicitly requested. Three tasks only; one final independent reviewer.

**Goal:** Persist a professional production treatment generated from an existing project brief.
**Architecture:** Laravel HTTP client → Responses API strict schema → local validation → atomic ProductionPlan write. Inertia Project Detail presents the saved treatment.
**Tech Stack:** Laravel 13, MySQL, React/TypeScript, Inertia, Tailwind, Vite.
**Spec:** `docs/superpowers/specs/2026-09-30-sidha-phase-5-design.md`

## Global constraints
Preserve existing modules; no actual OpenAI calls in tests/QA; no keys in frontend/logs/Git. No push, merge, deployment or Phase 6. Only one final local commit.

## Review focus
Stale/concurrent regeneration must not overwrite a newer plan; missing/blank brief must not spend credits; whitespace/extra fields/refusals must fail validation; members never invoke provider; failures preserve content and metadata.

### Task 1 — Persistence, OpenAI service, authorization and targeted tests
- [x] Add `tests/Feature/Projects/ProductionPlanTest.php`: Admin success + saved metadata, Member view/denial, confirmation/stale replacement, invalid JSON/schema, missing config, provider/network failures, unchanged previous plan, empty brief and project isolation. Use HTTP fakes and prevent stray requests; run and observe missing-feature failures.
- [x] Create migration/model, `app/Services/ProductionPlanner.php`, schema/validation helper and safe exception; add controller, Project relation/policy ability, configuration and nested generation route. POST consumes confirmation and expected plan updated_at; saved content is exposed as `productionPlan` on Project Detail.
- [x] Run targeted tests and resolve failures.

### Task 2 — Project Detail generation UX and treatment
- [x] Create typed `ProductionPlan` content and `resources/js/components/projects/production-desk.tsx`. Generate/confirm replacement through Inertia, show loading/errors, focus result heading; Member sees read-only content.
- [x] Integrate desk into Project Detail without altering finance/brief/expenses. Add optional fictional demo seeder with explicit provenance.
- [x] Run TypeScript and targeted backend/read tests.

### Task 3 — Final verification and one independent review
- [x] Run Pint, PHPStan, TS/lint/build, full PHP suite once; targeted browser QA for Admin/Member, empty/demo plan, confirmation, provider failure/preservation, mobile/light/dark and accessibility. No real provider call.
- [x] Dispatch exactly one independent branch review; fix only important real findings and verify affected checks.
- [x] Record outcomes, final local commit, SHA and clean git status. No push/merge/deploy.

## Execution ledger
- Preflight: correct feature branch, clean status, HEAD equals Phase 4 `97a2799`.
- Ruling: use existing user-selected feature workspace rather than create another checkout; user explicitly requires the active branch and forbids needless workflow overhead.
- Ruling: user's explicit instruction authorizes concise spec/plan and immediate execution; no additional design approval gates.
- Task 1: targeted tests observed RED (missing route/model), then GREEN: 10 tests / 93 assertions. Production persistence, permission, validation and error branches implemented. Test HTTP factory reset between variants to ensure each failure is actually exercised.
- Task 2: TypeScript check passed; demo-seeder test observed RED before implementation. Editorial desk integrated without changing existing Project sections.
- Task 2: final targeted run 16 tests / 295 assertions. Fictional demo seeder idempotent; no actual provider requests.
- Task 3: isolated local MySQL QA database `sidha_phase5_qa_20260930`, fake HTTP only. Browser confirmed Admin generate/loading/saved reload, replacement confirmation/cancel, provider error preserving existing plan, Member read-only, missing-brief disabled CTA, mobile width, light/dark screenshots, no console errors. Axe reported existing shell contrast/landmark issues and new shot-number contrast in dark; corrected the new contrast issue.
- Task 3: full PHP suite 173 tests / 171 passed / 2 skipped / 1508 assertions; Pint passed, PHPStan 0 errors, TypeScript passed, lint passed, build passed. Focused axe audit after correction: 0 violations in Planner section.
- Final independent review: one reviewer, no Critical/Important findings. Minor deferred: local validator allows 1–40 shots/checklist entries despite prompt's 4–12 and 5–12 targets. Ruling: preserve structural validation flexibility for unusually small productions; cost if wrong is accepting a sparse but still structured plan that requires human review.
- QA note: full-page dark axe reports pre-existing SIDHA shell contrast and landmark findings outside Phase 5; Planner region has no violations. No unrelated shell changes made.
