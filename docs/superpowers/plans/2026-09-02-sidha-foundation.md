# SIDHA Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify SIDHA's Laravel 13 technical foundation with the official React starter kit and MySQL, without business functionality.

**Architecture:** Laravel owns routing, authentication, validation, and persistence; Inertia connects Laravel routes to React TypeScript pages without a separate API. The official starter supplies Tailwind, Vite, complete authentication, and persistent light/dark/system appearance handling.

**Tech Stack:** PHP 8.3+, Composer 2, Laravel 13, React 19, TypeScript, Inertia.js, Tailwind CSS 4, Vite, MySQL 8, PHPUnit/Pest as supplied by the official starter.

**Spec:** `docs/superpowers/specs/2026-09-02-sidha-foundation-design.md`

## Global Constraints

- Use Laravel 13.x and the official Laravel React starter kit.
- Keep React source in TypeScript.
- Use MySQL and the local database name `sidha`.
- Preserve complete starter authentication and light/dark/system appearance persistence.
- Add no business module, AI feature, or final SIDHA dashboard design.
- Never commit `.env`, `vendor/`, `node_modules/`, database files, credentials, or generated build output excluded by the starter.

---

### Task 1: Provision the local runtime and scaffold the official starter

**Files:**
- Preserve: `docs/superpowers/specs/2026-09-02-sidha-foundation-design.md`
- Preserve: `docs/superpowers/plans/2026-09-02-sidha-foundation.md`
- Create: official Laravel React starter files at the repository root

**Interfaces:**
- Consumes: Ubuntu package repositories and Laravel's official Composer packages.
- Produces: a Laravel 13 application with installed Composer and npm dependencies.

- [ ] **Step 1: Install PHP, Composer, MySQL, and required PHP extensions**

Run `apt-get update` followed by installation of `php-cli`, `php-mysql`, `php-mbstring`, `php-xml`, `php-curl`, `php-zip`, `php-bcmath`, `composer`, and `mysql-server`.

- [ ] **Step 2: Record installed runtime versions**

Run `php --version`, `composer --version`, `mysql --version`, `node --version`, and `npm --version`.

- [ ] **Step 3: Generate the official React starter in a temporary directory**

Use the official Laravel installer non-interactively with React, TypeScript, built-in Laravel authentication, and no business features. Confirm `php artisan --version` reports Laravel Framework 13.x before integration.

- [ ] **Step 4: Integrate generated project files while preserving documentation and Git metadata**

Copy the generated source into the repository, retain the spec and plan, and verify `.gitignore` excludes `.env`, `vendor/`, `node_modules/`, and public build output.

### Task 2: Configure SIDHA and MySQL

**Files:**
- Modify: `.env.example`
- Create locally only: `.env`
- Verify: `config/database.php`
- Verify: `resources/js/hooks/use-appearance.ts`
- Verify: authentication routes and tests supplied by the starter

**Interfaces:**
- Consumes: the generated Laravel application and local MySQL service.
- Produces: safe MySQL defaults in `.env.example`, a local `sidha` database, and working application configuration.

- [ ] **Step 1: Configure the application identity and safe database example values**

Set `APP_NAME=SIDHA`, `DB_CONNECTION=mysql`, `DB_HOST=127.0.0.1`, `DB_PORT=3306`, and `DB_DATABASE=sidha` in `.env.example`; keep username and password values non-secret.

- [ ] **Step 2: Create local application configuration**

Copy `.env.example` to ignored `.env`, generate `APP_KEY`, and set local MySQL credentials only in `.env`.

- [ ] **Step 3: Start MySQL and create the clean local database**

Start the local MySQL daemon, create the `sidha` database and a least-privileged local application user, then confirm connectivity through Laravel.

- [ ] **Step 4: Verify starter scope**

Inspect routes, authentication pages/tests, dashboard page, and appearance hook. Confirm full authentication and light/dark/system persistence are present and no business route, model, migration, or page exists.

### Task 3: Run migrations and complete verification

**Files:**
- Verify: `database/migrations/*`
- Verify: `tests/**/*`
- Verify: `package.json`
- Verify: `vite.config.ts`

**Interfaces:**
- Consumes: configured SIDHA source and local MySQL.
- Produces: fresh evidence for migrations, Laravel tests, frontend checks, and production build.

- [ ] **Step 1: Run migrations against a clean MySQL database**

Run `php artisan migrate:fresh --force` and `php artisan migrate:status`; require exit code 0 and every migration to be marked `Ran`.

- [ ] **Step 2: Run Laravel checks**

Run `php artisan about`, `php artisan route:list`, and `php artisan test`; require Laravel 13.x, expected authentication routes, and zero test failures.

- [ ] **Step 3: Run frontend checks**

Run every non-mutating check supplied by `package.json` (type checking and lint when present), then run `npm run build`; require exit code 0.

- [ ] **Step 4: Audit repository contents**

Run `git diff --check`, inspect `git status --short`, confirm `.env` and dependency/build directories are ignored, and scan tracked candidate files for credential patterns before staging.

### Task 4: Commit and push the verified foundation

**Files:**
- Stage: all verified project source and documentation allowed by `.gitignore`

**Interfaces:**
- Consumes: verified working tree.
- Produces: a final commit on `main` and a matching `origin/main` on `aymaneelgass-dev/sidha`.

- [ ] **Step 1: Run the full verification gate again immediately before commit**

Run migrations/status, the complete Laravel test suite, frontend checks, production build, `git diff --check`, and secret/ignore checks with fresh output.

- [ ] **Step 2: Commit the foundation**

Stage allowed files and commit with message `feat: initialize SIDHA foundation`.

- [ ] **Step 3: Push main**

Push the resulting commit to `origin main`. If HTTPS Git authentication is unavailable locally, create the equivalent Git tree and commit through the configured GitHub connector, then update `refs/heads/main` without force.

- [ ] **Step 4: Verify the remote result**

Fetch the remote commit through GitHub, confirm the remote `main` SHA matches the final local source commit, and report the verified results.

