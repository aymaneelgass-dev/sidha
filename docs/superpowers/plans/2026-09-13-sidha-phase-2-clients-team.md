# SIDHA Phase 2 — Clients & Team Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Clients and Team Coming Soon pages with persisted, responsive, and access-controlled MVP modules for one internal audiovisual production company.

**Architecture:** Extend the existing `User` model with two backed-enum roles and an active/suspended state, and add separate `Client` and `ClientContact` aggregates. Laravel Form Requests, Policies, middleware, focused actions, and database transactions enforce the business rules; Inertia and React render typed server-driven pages without adding a JSON API or external permission package.

**Tech Stack:** PHP 8.3+, Laravel 13.17+, Fortify 1.37+, PHPUnit 12.5+, MySQL, Larastan/PHPStan, Laravel Pint, Inertia 3, React 19, TypeScript 5.7, Tailwind CSS 4, Wayfinder, Vite Plus.

**Spec:** `docs/superpowers/specs/2026-09-13-sidha-phase-2-clients-team-design.md`

## Global Constraints

- Work only in the isolated branch `feat/sidha-phase-2-clients-team`, based on Phase 1 commit `bb6026026c9529d0022d79b29a65d864477c1cbb`.
- SIDHA remains a single-company internal application.
- Use the existing `User` model as the team profile; do not create an employee or team-member table.
- V1 roles are exactly `Admin` and `Member`; Member access to Clients and Team is read-only.
- Do not add a permission package, invitation model, client portal, multi-tenancy, file uploads, or a separate JSON API.
- Disable public registration and reuse Laravel password-reset and email-verification features for Admin-created accounts.
- Preserve passkeys, two-factor authentication, profile, security, appearance, dashboard, shell, and all remaining Coming Soon modules.
- Keep the Phase 1 dashboard demonstration dataset unchanged.
- UI copy remains in English.
- All new pages must support Light, Dark, and System themes and must not overflow horizontally at 375 px.
- Use TDD for each task: run the focused test red, implement the minimum behavior, run it green, then run the named regression set.
- Use a fresh implementer subagent per task and complete specification-compliance review followed by code-quality review before accepting each task.
- Record task status, commands, results, review findings, rulings, and commit SHAs in `.superpowers/sdd/2026-09-13-sidha-phase-2-clients-team/progress.md` during execution.
- Do not push, merge, deploy, or modify `main` while executing this plan.

---

### Task 1: Persist the Client aggregate

**Files:**
- Create: `app/Enums/ClientStatus.php`
- Create: `app/Models/Client.php`
- Create: `app/Models/ClientContact.php`
- Create: `database/factories/ClientFactory.php`
- Create: `database/factories/ClientContactFactory.php`
- Create: `database/migrations/2026_09_13_000001_create_clients_table.php`
- Create: `database/migrations/2026_09_13_000002_create_client_contacts_table.php`
- Test: `tests/Unit/Models/ClientTest.php`

**Interfaces:**
- Produces: `App\Enums\ClientStatus` with `Active`, `Inactive`, and `Archived` cases.
- Produces: `Client::contacts(): HasMany` and `Client::primaryContact(): HasOne`.
- Produces: `ClientContact::client(): BelongsTo`.
- Produces: `ClientFactory::inactive()` and `ClientFactory::archived()` states.

- [ ] **Step 1: Write failing model and schema tests**

```php
<?php

namespace Tests\Unit\Models;

use App\Enums\ClientStatus;
use App\Models\Client;
use App\Models\ClientContact;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientTest extends TestCase
{
    use RefreshDatabase;

    public function test_client_casts_status_and_owns_contacts(): void
    {
        $client = Client::factory()->create(['status' => ClientStatus::Active]);
        $primary = ClientContact::factory()->for($client)->create(['is_primary' => true]);
        ClientContact::factory()->for($client)->create(['is_primary' => false]);

        $this->assertSame(ClientStatus::Active, $client->status);
        $this->assertCount(2, $client->contacts);
        $this->assertTrue($client->primaryContact->is($primary));
    }

    public function test_client_can_exist_without_contacts(): void
    {
        $client = Client::factory()->create();

        $this->assertCount(0, $client->contacts);
        $this->assertNull($client->primaryContact);
    }
}
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `php artisan test tests/Unit/Models/ClientTest.php`

Expected: FAIL because `ClientStatus`, `Client`, `ClientContact`, their tables, and factories do not exist.

- [ ] **Step 3: Add the enum and migrations**

```php
<?php

namespace App\Enums;

enum ClientStatus: string
{
    case Active = 'active';
    case Inactive = 'inactive';
    case Archived = 'archived';
}
```

Create `clients` with `name`, nullable `industry`, `phone`, `website`, `address`, `notes`, indexed `status` defaulting to `active`, and timestamps. Create `client_contacts` with a cascading `client_id`, `name`, nullable `job_title`, `email`, `phone`, boolean `is_primary` defaulting to false, timestamps, and an index on `client_id, is_primary`.

- [ ] **Step 4: Add focused models and factories**

```php
// Client.php
#[Fillable(['name', 'industry', 'phone', 'website', 'address', 'notes', 'status'])]
class Client extends Model
{
    /** @use HasFactory<ClientFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return ['status' => ClientStatus::class];
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(ClientContact::class)->orderByDesc('is_primary')->orderBy('name');
    }

    public function primaryContact(): HasOne
    {
        return $this->hasOne(ClientContact::class)->where('is_primary', true);
    }
}
```

`ClientContact` exposes only the six persisted business fields through `#[Fillable]`, casts `is_primary` to boolean, and defines `client(): BelongsTo`. Factories generate fictional `.test` data and never create real names, emails, or phone numbers.

- [ ] **Step 5: Run focused tests and model static analysis**

Run: `php artisan test tests/Unit/Models/ClientTest.php && vendor/bin/phpstan analyse app/Enums app/Models database/factories --memory-limit=1G`

Expected: PASS with 0 failures and 0 PHPStan errors.

- [ ] **Step 6: Commit Task 1**

```bash
git add app/Enums/ClientStatus.php app/Models/Client.php app/Models/ClientContact.php database/factories/ClientFactory.php database/factories/ClientContactFactory.php database/migrations/2026_09_13_000001_create_clients_table.php database/migrations/2026_09_13_000002_create_client_contacts_table.php tests/Unit/Models/ClientTest.php
git commit -m "feat: add client and contact persistence"
```

---

### Task 2: Extend User into the Team profile

**Files:**
- Create: `app/Enums/UserRole.php`
- Create: `app/Enums/UserStatus.php`
- Create: `database/migrations/2026_09_13_000003_add_team_fields_to_users_table.php`
- Modify: `app/Models/User.php`
- Modify: `database/factories/UserFactory.php`
- Modify: `resources/js/types/auth.ts`
- Test: `tests/Unit/Models/UserTeamProfileTest.php`

**Interfaces:**
- Produces: `UserRole::Admin` and `UserRole::Member`.
- Produces: `UserStatus::Active` and `UserStatus::Suspended`.
- Produces: `User::isAdmin(): bool` and `User::isActive(): bool`.
- Produces: `UserFactory::admin()`, `member()`, and `suspended()` states.

- [ ] **Step 1: Write failing Team-profile tests**

```php
public function test_user_defaults_to_active_member(): void
{
    $user = User::factory()->create();

    $this->assertSame(UserRole::Member, $user->role);
    $this->assertSame(UserStatus::Active, $user->status);
    $this->assertFalse($user->isAdmin());
    $this->assertTrue($user->isActive());
}

public function test_admin_and_suspended_factory_states_are_explicit(): void
{
    $admin = User::factory()->admin()->create();
    $suspended = User::factory()->suspended()->create();

    $this->assertTrue($admin->isAdmin());
    $this->assertFalse($suspended->isActive());
}
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `php artisan test tests/Unit/Models/UserTeamProfileTest.php`

Expected: FAIL because the enums, columns, methods, and factory states do not exist.

- [ ] **Step 3: Add enums and the additive users migration**

Use string-backed enums. Add nullable `job_title` and `phone`, indexed `role` defaulting to `member`, and indexed `status` defaulting to `active`. The down migration drops only these four Phase 2 columns.

- [ ] **Step 4: Extend User without disturbing authentication traits**

```php
#[Fillable(['name', 'email', 'password', 'role', 'job_title', 'phone', 'status'])]
class User extends Authenticatable implements MustVerifyEmail, PasskeyUser
{
    // Preserve every existing trait.

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'status' => UserStatus::class,
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === UserRole::Admin;
    }

    public function isActive(): bool
    {
        return $this->status === UserStatus::Active;
    }
}
```

Update the frontend `User` type with `role: 'admin' | 'member'`, `status: 'active' | 'suspended'`, and nullable `job_title` and `phone`.

- [ ] **Step 5: Run focused and authentication regressions**

Run: `php artisan test tests/Unit/Models/UserTeamProfileTest.php tests/Feature/Auth tests/Feature/Settings`

Expected: PASS with no authentication or settings regression.

- [ ] **Step 6: Commit Task 2**

```bash
git add app/Enums/UserRole.php app/Enums/UserStatus.php app/Models/User.php database/factories/UserFactory.php database/migrations/2026_09_13_000003_add_team_fields_to_users_table.php resources/js/types/auth.ts tests/Unit/Models/UserTeamProfileTest.php
git commit -m "feat: extend users with team roles and status"
```

---

### Task 3: Close public registration and enforce active internal accounts

**Files:**
- Create: `app/Http/Middleware/EnsureUserIsActive.php`
- Create: `app/Console/Commands/MakeAdminCommand.php`
- Modify: `bootstrap/app.php`
- Modify: `config/fortify.php`
- Modify: `routes/web.php`
- Modify: `routes/settings.php`
- Modify: `app/Http/Controllers/Settings/ProfileController.php`
- Modify: `tests/Feature/Settings/ProfileUpdateTest.php`
- Create: `tests/Feature/Auth/InternalAccessTest.php`
- Create: `tests/Feature/Console/MakeAdminCommandTest.php`

**Interfaces:**
- Produces: route middleware alias `active` backed by `EnsureUserIsActive`.
- Produces: `php artisan sidha:make-admin {email}` for explicit first-Admin bootstrap or promotion.
- Preserves: Fortify reset password, email verification, 2FA, passkeys, and password confirmation.

- [ ] **Step 1: Write failing registration and suspended-session tests**

```php
public function test_public_registration_is_disabled(): void
{
    $this->get('/register')->assertNotFound();
    $this->post('/register', [
        'name' => 'Public User',
        'email' => 'public@example.test',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertNotFound();
}

public function test_suspended_user_with_existing_session_is_logged_out(): void
{
    $user = User::factory()->suspended()->create();

    $this->actingAs($user)->get(route('dashboard'))->assertRedirect(route('login'));
    $this->assertGuest();
}
```

- [ ] **Step 2: Write failing last-Admin deletion and command tests**

```php
public function test_last_active_admin_cannot_delete_their_profile(): void
{
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->delete(route('profile.destroy'), ['password' => 'password'])
        ->assertSessionHasErrors('account');

    $this->assertNotNull($admin->fresh());
}

public function test_command_promotes_existing_user_to_active_admin(): void
{
    $user = User::factory()->member()->suspended()->create();

    $this->artisan('sidha:make-admin', ['email' => $user->email])->assertSuccessful();

    $this->assertSame(UserRole::Admin, $user->refresh()->role);
    $this->assertSame(UserStatus::Active, $user->status);
}
```

Also test invalid-email refusal and the new-account path with interactive name/password confirmation. Assert the command output never contains the entered password, generated hashes, reset tokens, or verification URLs.

- [ ] **Step 3: Run the focused tests and verify RED**

Run: `php artisan test tests/Feature/Auth/InternalAccessTest.php tests/Feature/Console/MakeAdminCommandTest.php tests/Feature/Settings/ProfileUpdateTest.php`

Expected: FAIL because registration is enabled, the middleware and command do not exist, and profile deletion has no last-Admin guard.

- [ ] **Step 4: Disable only Fortify registration**

Remove `Features::registration()` from `config/fortify.php`. Do not remove reset passwords, email verification, 2FA, or passkeys. The existing registration tests will skip through their Fortify feature guard; `InternalAccessTest` becomes the explicit closed-registration regression.

- [ ] **Step 5: Implement active-account middleware and apply it**

```php
public function handle(Request $request, Closure $next): Response
{
    $user = $request->user();

    if ($user !== null && ! $user->isActive()) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->withErrors([
            'email' => __('Your account has been suspended.'),
        ]);
    }

    return $next($request);
}
```

Register `'active' => EnsureUserIsActive::class` in `bootstrap/app.php`. Apply middleware in the order `auth`, `active`, `verified` to Dashboard, all business modules, and verified Settings routes. Apply `auth`, `active` to profile-edit/update routes so a suspended session cannot reach Settings.

- [ ] **Step 6: Implement first-Admin bootstrap and last-Admin deletion guard**

`sidha:make-admin {email}` lowercases and validates the email. If the account exists, set `role=admin` and `status=active`. If it does not exist, prompt for name, password, and password confirmation; validate using Laravel’s default `Password` rule, create a verified active Admin, and never print the password.

Before profile deletion, run the active-Admin count and deletion inside one database transaction, locking active Admin rows with `lockForUpdate()`. Deny with an `account` validation error when the authenticated user is an active Admin and no other active Admin exists. Preserve the existing password validation, logout, session invalidation, and deletion behavior for every allowed case.

- [ ] **Step 7: Run focused and full Auth/Settings regressions**

Run: `php artisan test tests/Feature/Auth/InternalAccessTest.php tests/Feature/Console/MakeAdminCommandTest.php tests/Feature/Auth tests/Feature/Settings`

Expected: PASS; Registration tests are skipped because the feature is intentionally disabled, while closed-registration tests pass.

- [ ] **Step 8: Commit Task 3**

```bash
git add app/Http/Middleware/EnsureUserIsActive.php app/Console/Commands/MakeAdminCommand.php bootstrap/app.php config/fortify.php routes/web.php routes/settings.php app/Http/Controllers/Settings/ProfileController.php tests/Feature/Auth/InternalAccessTest.php tests/Feature/Console/MakeAdminCommandTest.php tests/Feature/Settings/ProfileUpdateTest.php
git commit -m "feat: secure internal team access"
```

---

### Task 4: Define the Admin and Member authorization matrix

**Files:**
- Create: `app/Policies/ClientPolicy.php`
- Create: `app/Policies/UserPolicy.php`
- Test: `tests/Unit/Policies/ClientPolicyTest.php`
- Test: `tests/Unit/Policies/UserPolicyTest.php`

**Interfaces:**
- Produces: `ClientPolicy::{viewAny,view,create,update,archive,reactivate}`.
- Produces: `UserPolicy::{viewAny,view,create,update,suspend,reactivate,resendPassword}`.
- Consumes: `User::isAdmin()`, `User::isActive()`, and the two domain models.

- [ ] **Step 1: Write a failing policy matrix test**

```php
public function test_member_can_read_but_cannot_mutate_clients(): void
{
    $member = User::factory()->member()->create();
    $client = Client::factory()->create();
    $policy = new ClientPolicy;

    $this->assertTrue($policy->viewAny($member));
    $this->assertTrue($policy->view($member, $client));
    $this->assertFalse($policy->create($member));
    $this->assertFalse($policy->update($member, $client));
    $this->assertFalse($policy->archive($member, $client));
}
```

Add corresponding assertions that Admin receives every client capability, both roles can view Team, and only Admin receives Team mutation capabilities.

- [ ] **Step 2: Run both policy tests and verify RED**

Run: `php artisan test tests/Unit/Policies/ClientPolicyTest.php tests/Unit/Policies/UserPolicyTest.php`

Expected: FAIL because the policies do not exist.

- [ ] **Step 3: Implement explicit boolean policies**

```php
public function viewAny(User $user): bool
{
    return $user->isActive();
}

public function create(User $user): bool
{
    return $user->isActive() && $user->isAdmin();
}

public function update(User $user, Client $client): bool
{
    return $user->isActive() && $user->isAdmin();
}
```

Implement every named method explicitly; do not add a broad `before()` shortcut. Keep last-Admin and self-suspension invariants in the Team mutation action as state-dependent business rules, not in UI code.

- [ ] **Step 4: Run focused policy tests and PHPStan**

Run: `php artisan test tests/Unit/Policies && vendor/bin/phpstan analyse app/Policies --memory-limit=1G`

Expected: PASS with 0 failures and 0 PHPStan errors.

- [ ] **Step 5: Commit Task 4**

```bash
git add app/Policies/ClientPolicy.php app/Policies/UserPolicy.php tests/Unit/Policies/ClientPolicyTest.php tests/Unit/Policies/UserPolicyTest.php
git commit -m "feat: define client and team authorization"
```

---

### Task 5: Deliver read-only Client list and detail flows

**Files:**
- Create: `app/Http/Controllers/ClientController.php`
- Create: `app/Http/Requests/Clients/ClientIndexRequest.php`
- Modify: `routes/web.php`
- Create: `resources/js/types/client.ts`
- Modify: `resources/js/types/index.ts`
- Create: `resources/js/components/clients/client-status-badge.tsx`
- Create: `resources/js/components/clients/client-list.tsx`
- Create: `resources/js/components/ui/table.tsx`
- Create: `resources/js/pages/clients/index.tsx`
- Create: `resources/js/pages/clients/show.tsx`
- Modify: `tests/Feature/ComingSoonPagesTest.php`
- Test: `tests/Feature/Clients/ClientReadTest.php`

**Interfaces:**
- Produces: `clients.index` and `clients.show` routes.
- Produces: `ClientController::index(ClientIndexRequest): Response` and `show(Client): Response`.
- Produces: TypeScript `ClientListItem`, `ClientDetail`, `ClientContact`, `ClientFilters`, and paginated-prop types.
- Consumes: Client Policy view capabilities and `Client::primaryContact()`.

- [ ] **Step 1: Write failing route, authorization, filter, and Inertia tests**

```php
public function test_member_can_filter_clients_and_preserve_query_string(): void
{
    $member = User::factory()->member()->create();
    Client::factory()->create(['name' => 'Atlas Films', 'status' => ClientStatus::Active]);
    Client::factory()->archived()->create(['name' => 'Hidden Studio']);

    $this->actingAs($member)
        ->get(route('clients.index', ['search' => 'Atlas', 'status' => 'active']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('clients/index')
            ->where('filters.search', 'Atlas')
            ->where('filters.status', 'active')
            ->has('clients.data', 1)
            ->where('clients.data.0.name', 'Atlas Films')
            ->has('counts.active')
            ->has('can.create')
        );
}
```

Add tests for guest, unverified, and suspended redirects; contact-name/email search; invalid status validation; 15-row pagination; Client Detail with ordered contacts; Admin `can.create=true`; Member `can.create=false`.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `php artisan test tests/Feature/Clients/ClientReadTest.php`

Expected: FAIL because Clients still renders `coming-soon` and the new controller/pages do not exist.

- [ ] **Step 3: Implement the validated server-side query**

`ClientIndexRequest` accepts nullable `search` capped at 100 characters and nullable `status` constrained to `ClientStatus`. The controller authorizes `viewAny`, applies grouped name/industry/contact search, filters status, eager-loads the primary contact, orders by name, calls `paginate(15)->withQueryString()`, and returns real status counts plus `can.create`.

`show()` authorizes `view`, loads ordered contacts, and returns a typed plain array that excludes no secret because Client has no authentication fields.

- [ ] **Step 4: Replace only Clients Coming Soon routes and expectations**

```php
Route::middleware(['auth', 'active', 'verified'])->group(function () {
    Route::get('clients', [ClientController::class, 'index'])->name('clients.index');
    Route::get('clients/{client}', [ClientController::class, 'show'])->name('clients.show');
});
```

Remove `clients` from the Coming Soon data provider while leaving Projects, Studio, Calendar, SIDHA AI, and Team unchanged.

- [ ] **Step 5: Build responsive Client index and detail pages**

Use semantic headings and the existing App layout contract. The index renders status-count cards, a GET search/filter form, desktop table, mobile cards, empty state, no-results state, and pagination links. The detail renders business fields, notes, and ordered contact cards. `ClientStatusBadge` always renders text in addition to color.

Both pages use `can` props to omit mutation actions for Member; Task 6 adds Admin actions to the existing slots.

- [ ] **Step 6: Generate Wayfinder routes and run focused checks**

Run: `php artisan wayfinder:generate --with-form && php artisan test tests/Feature/Clients/ClientReadTest.php tests/Feature/ComingSoonPagesTest.php && npm run check && npm run types:check`

Expected: PASS; all remaining future modules still use `coming-soon`.

- [ ] **Step 7: Commit Task 5**

```bash
git add app/Http/Controllers/ClientController.php app/Http/Requests/Clients/ClientIndexRequest.php routes/web.php resources/js/types/client.ts resources/js/types/index.ts resources/js/components/clients resources/js/components/ui/table.tsx resources/js/pages/clients tests/Feature/Clients/ClientReadTest.php tests/Feature/ComingSoonPagesTest.php
git commit -m "feat: add client directory and detail views"
```

---

### Task 6: Add transactional Admin Client management

**Files:**
- Create: `app/Actions/Clients/SyncClientContacts.php`
- Create: `app/Http/Requests/Clients/StoreClientRequest.php`
- Create: `app/Http/Requests/Clients/UpdateClientRequest.php`
- Modify: `app/Http/Controllers/ClientController.php`
- Modify: `routes/web.php`
- Create: `resources/js/components/clients/client-form.tsx`
- Create: `resources/js/components/clients/contact-fields.tsx`
- Create: `resources/js/components/clients/client-status-dialog.tsx`
- Create: `resources/js/components/ui/textarea.tsx`
- Create: `resources/js/pages/clients/create.tsx`
- Create: `resources/js/pages/clients/edit.tsx`
- Modify: `resources/js/pages/clients/index.tsx`
- Modify: `resources/js/pages/clients/show.tsx`
- Test: `tests/Feature/Clients/ClientManagementTest.php`

**Interfaces:**
- Produces: `SyncClientContacts::execute(Client $client, array $contacts): void`.
- Produces: `clients.create`, `store`, `edit`, `update`, `archive`, and `reactivate` routes.
- Consumes: `ClientPolicy` mutation capabilities and Client TypeScript types.

- [ ] **Step 1: Write failing Admin CRUD and Member-denial tests**

```php
public function test_admin_creates_client_and_contacts_atomically(): void
{
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->post(route('clients.store'), [
        'name' => 'Northlight Films',
        'industry' => 'Advertising',
        'status' => 'active',
        'contacts' => [
            ['name' => 'Sara Karim', 'email' => 'sara@example.test', 'is_primary' => true],
            ['name' => 'Omar Naji', 'email' => 'omar@example.test', 'is_primary' => false],
        ],
    ])->assertRedirect();

    $client = Client::where('name', 'Northlight Films')->firstOrFail();
    $this->assertCount(2, $client->contacts);
    $this->assertSame('Sara Karim', $client->primaryContact->name);
}

public function test_member_cannot_call_any_client_mutation_route(): void
{
    $member = User::factory()->member()->create();
    $client = Client::factory()->create();

    $this->actingAs($member)->get(route('clients.create'))->assertForbidden();
    $this->actingAs($member)->post(route('clients.store'), ['name' => 'Denied'])->assertForbidden();
    $this->actingAs($member)->get(route('clients.edit', $client))->assertForbidden();
    $this->actingAs($member)->put(route('clients.update', $client), ['name' => 'Denied'])->assertForbidden();
    $this->actingAs($member)->patch(route('clients.archive', $client))->assertForbidden();
}
```

Add tests for nested indexed errors, more than one primary contact, zero contacts, contact replacement on update, rollback on action exception, archive, reactivate, and Member reactivate denial.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `php artisan test tests/Feature/Clients/ClientManagementTest.php`

Expected: FAIL because mutation routes, requests, and action do not exist.

- [ ] **Step 3: Implement shared validation with explicit primary-contact rule**

Both Form Requests authorize through the relevant Policy and validate:

```php
return [
    'name' => ['required', 'string', 'max:150'],
    'industry' => ['nullable', 'string', 'max:100'],
    'phone' => ['nullable', 'string', 'max:50'],
    'website' => ['nullable', 'url', 'max:2048'],
    'address' => ['nullable', 'string', 'max:2000'],
    'notes' => ['nullable', 'string', 'max:5000'],
    'status' => ['required', Rule::enum(ClientStatus::class)],
    'contacts' => ['array'],
    'contacts.*.name' => ['required', 'string', 'max:150'],
    'contacts.*.job_title' => ['nullable', 'string', 'max:150'],
    'contacts.*.email' => ['nullable', 'email', 'max:255'],
    'contacts.*.phone' => ['nullable', 'string', 'max:50'],
    'contacts.*.is_primary' => ['required', 'boolean'],
];
```

Attach an `after()` validator that adds `contacts` error text `Only one primary contact may be selected.` when more than one row is primary. Normalize nullable empty strings to null and trim scalar strings in `prepareForValidation()`.

- [ ] **Step 4: Implement atomic create and update**

```php
DB::transaction(function () use ($request, &$client): void {
    $data = $request->safe()->except('contacts');
    $client = Client::create($data);
    $this->syncClientContacts->execute($client, $request->validated('contacts', []));
});
```

`SyncClientContacts` replaces the aggregate’s contacts with the validated rows inside the caller’s transaction and rejects a direct call containing more than one primary contact. Update follows the same transaction pattern. Archive and reactivate update only `ClientStatus`, authorize explicit Policy abilities, flash existing-format success toasts, and redirect to Client Detail.

- [ ] **Step 5: Build accessible Admin forms and state dialogs**

`ClientForm` accepts exact `mode`, optional `client`, and submit-form Wayfinder props. It uses stable client-generated row keys, names fields as `contacts[index][field]`, exposes an Add Contact button, prevents accidental removal without a labelled button, and implements primary selection as a single radio group. Create/Edit pages supply breadcrumbs and Head titles.

Index and Detail display Admin-only actions. Archive/reactivate confirmation uses the existing Radix Dialog, names the affected client, returns focus to the trigger, disables controls while processing, and exposes validation/server failure feedback.

- [ ] **Step 6: Generate routes and run Task 6 gates**

Run: `php artisan wayfinder:generate --with-form && php artisan test tests/Feature/Clients && npm run check && npm run types:check`

Expected: PASS with Member mutations returning 403 and Admin workflows persisting real data.

- [ ] **Step 7: Commit Task 6**

```bash
git add app/Actions/Clients app/Http/Requests/Clients app/Http/Controllers/ClientController.php routes/web.php resources/js/components/clients resources/js/components/ui/textarea.tsx resources/js/pages/clients tests/Feature/Clients/ClientManagementTest.php
git commit -m "feat: add admin client management"
```

---

### Task 7: Deliver the read-only Team directory

**Files:**
- Create: `app/Http/Controllers/TeamController.php`
- Create: `app/Http/Requests/Team/TeamIndexRequest.php`
- Modify: `routes/web.php`
- Create: `resources/js/types/team.ts`
- Modify: `resources/js/types/index.ts`
- Create: `resources/js/components/team/member-status-badge.tsx`
- Create: `resources/js/components/team/member-role-badge.tsx`
- Create: `resources/js/components/team/team-list.tsx`
- Create: `resources/js/pages/team/index.tsx`
- Modify: `tests/Feature/ComingSoonPagesTest.php`
- Test: `tests/Feature/Team/TeamReadTest.php`

**Interfaces:**
- Produces: `team.index` route and `TeamController::index(TeamIndexRequest): Response`.
- Produces: TypeScript `TeamMemberListItem`, `TeamFilters`, and pagination types.
- Consumes: `UserPolicy::viewAny`, User enums, and existing initials UI.

- [ ] **Step 1: Write failing Team list tests**

```php
public function test_member_can_filter_the_team_directory(): void
{
    $viewer = User::factory()->member()->create(['name' => 'Viewer']);
    User::factory()->admin()->create(['name' => 'Amina Director']);
    User::factory()->member()->suspended()->create(['name' => 'Suspended Editor']);

    $this->actingAs($viewer)
        ->get(route('team.index', ['role' => 'admin', 'search' => 'Amina']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('team/index')
            ->where('filters.role', 'admin')
            ->has('members.data', 1)
            ->where('members.data.0.name', 'Amina Director')
            ->where('can.create', false)
        );
}
```

Add guest, unverified, suspended, Admin `can.create=true`, status filter, invalid filter, and pagination tests. Assert Inertia props omit password, remember token, 2FA secrets, and recovery codes.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `php artisan test tests/Feature/Team/TeamReadTest.php`

Expected: FAIL because Team still renders `coming-soon`.

- [ ] **Step 3: Implement the Team server query and route**

Validate nullable `search` max 100, `role` through `UserRole`, and `status` through `UserStatus`. Authorize `viewAny`, select only public Team fields, search name/email, filter role/status, order active before suspended then by name, paginate 15 with query string, and return `can.create`.

Replace only `team.index` Coming Soon route and remove only Team from the Coming Soon test provider.

- [ ] **Step 4: Build the responsive Team directory**

Render real count cards, GET search/filters, desktop table, mobile cards, text-labelled role/status badges, empty and no-results states, and pagination. Render initials through the existing user-info pattern. Members see no mutation control.

- [ ] **Step 5: Generate routes and run Task 7 gates**

Run: `php artisan wayfinder:generate --with-form && php artisan test tests/Feature/Team/TeamReadTest.php tests/Feature/ComingSoonPagesTest.php && npm run check && npm run types:check`

Expected: PASS; only Projects, Studio, Calendar, and SIDHA AI remain in the Coming Soon provider.

- [ ] **Step 6: Commit Task 7**

```bash
git add app/Http/Controllers/TeamController.php app/Http/Requests/Team/TeamIndexRequest.php routes/web.php resources/js/types/team.ts resources/js/types/index.ts resources/js/components/team resources/js/pages/team/index.tsx tests/Feature/Team/TeamReadTest.php tests/Feature/ComingSoonPagesTest.php
git commit -m "feat: add read-only team directory"
```

---

### Task 8: Add Admin member provisioning and lifecycle management

**Files:**
- Create: `app/Actions/Team/CreateMember.php`
- Create: `app/Actions/Team/UpdateMember.php`
- Create: `app/Actions/Team/SendMemberPasswordSetup.php`
- Create: `app/Http/Requests/Team/StoreMemberRequest.php`
- Create: `app/Http/Requests/Team/UpdateMemberRequest.php`
- Modify: `app/Http/Controllers/TeamController.php`
- Modify: `routes/web.php`
- Create: `resources/js/components/team/member-form.tsx`
- Create: `resources/js/components/team/member-status-dialog.tsx`
- Create: `resources/js/pages/team/create.tsx`
- Create: `resources/js/pages/team/edit.tsx`
- Modify: `resources/js/pages/team/index.tsx`
- Test: `tests/Feature/Team/TeamManagementTest.php`

**Interfaces:**
- Produces: `CreateMember::execute(array $data): array{member: User, passwordStatus: string}`.
- Produces: `UpdateMember::execute(User $member, array $data): User` with self/last-Admin invariants.
- Produces: `SendMemberPasswordSetup::execute(User $member): string`, returning a Laravel Password broker status.
- Produces: `team.create`, `store`, `edit`, `update`, `suspend`, `reactivate`, and `resend-password` routes.

- [ ] **Step 1: Write failing provisioning and notification tests**

```php
public function test_admin_creates_member_and_sends_existing_security_notifications(): void
{
    Notification::fake();
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->post(route('team.store'), [
        'name' => 'Yasmine Editor',
        'email' => 'yasmine@example.test',
        'job_title' => 'Video Editor',
        'phone' => '+212600000000',
        'role' => 'member',
    ])->assertRedirect(route('team.index'));

    $member = User::where('email', 'yasmine@example.test')->firstOrFail();
    $this->assertSame(UserRole::Member, $member->role);
    Notification::assertSentTo($member, ResetPassword::class);
    Notification::assertSentTo($member, VerifyEmail::class);
}
```

- [ ] **Step 2: Write failing lifecycle and invariant tests**

Test every Team mutation route as Member and expect 403. Test Admin edit, suspend, reactivate, resend, duplicate email, invalid enum, self-suspension refusal, last-active-Admin demotion refusal, and successful Admin demotion when another active Admin exists.

- [ ] **Step 3: Run focused tests and verify RED**

Run: `php artisan test tests/Feature/Team/TeamManagementTest.php`

Expected: FAIL because actions, requests, routes, and pages do not exist.

- [ ] **Step 4: Implement requests and focused actions**

Store validation uses required name/email/role; nullable job title/phone; global unique email; and `Rule::enum(UserRole::class)`. Update ignores the target member for unique email and accepts the same profile fields plus role. Only Admin passes `authorize()`.

`CreateMember` hashes `Str::password(40)`, creates an active unverified User, dispatches Laravel’s `Registered` event for the existing verification notification, calls `SendMemberPasswordSetup`, and returns both the User and broker status. The controller flashes success only for `Password::RESET_LINK_SENT`; otherwise it retains the created account, flashes a warning, and exposes the Admin-only resend action.

`UpdateMember` performs role/status changes transactionally. Before a demotion or suspension, lock the active Admin rows with `lockForUpdate()` and evaluate the invariant inside the same transaction. Throw a validation error on `status` for self-suspension and on `role` or `status` when the mutation would leave zero active Admins.

`SendMemberPasswordSetup` calls `Password::broker()->sendResetLink(['email' => $member->email])`; the controller treats `Password::RESET_LINK_SENT` as success and every other broker status as a translated validation error. Apply `throttle:3,1` to resend.

- [ ] **Step 5: Implement Admin member pages and confirmations**

Create/Edit forms expose only name, email, job title, phone, and role. Status changes remain separate confirmation actions. Team Index renders Admin-only edit, suspend/reactivate, and resend controls; Member renders none. Confirmation dialogs name the member, explain the effect, preserve focus, and disable while submitting.

- [ ] **Step 6: Generate routes and run Task 8 gates**

Run: `php artisan wayfinder:generate --with-form && php artisan test tests/Feature/Team tests/Feature/Auth tests/Feature/Settings && npm run check && npm run types:check`

Expected: PASS; notifications are faked in tests and no credential or token appears in responses.

- [ ] **Step 7: Commit Task 8**

```bash
git add app/Actions/Team app/Http/Requests/Team app/Http/Controllers/TeamController.php routes/web.php resources/js/components/team resources/js/pages/team tests/Feature/Team/TeamManagementTest.php
git commit -m "feat: add admin team management"
```

---

### Task 9: Add explicit fictional defense data

**Files:**
- Create: `database/seeders/SidhaDemoSeeder.php`
- Modify: `database/seeders/DatabaseSeeder.php`
- Test: `tests/Feature/Database/SidhaDemoSeederTest.php`

**Interfaces:**
- Produces: `php artisan db:seed --class=SidhaDemoSeeder` for non-production demonstration data.
- Consumes: Client, ClientContact, User factories and enum states.

- [ ] **Step 1: Write the failing seeder test**

```php
public function test_demo_seeder_creates_fictional_clients_contacts_and_team(): void
{
    $this->seed(SidhaDemoSeeder::class);

    $this->assertDatabaseHas('users', ['email' => 'admin@sidha.test', 'role' => 'admin']);
    $this->assertDatabaseCount('clients', 8);
    $this->assertDatabaseHas('client_contacts', ['is_primary' => true]);
}
```

Add a test that forces the app environment to production and expects the seeder to throw `LogicException` before inserting any record.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `php artisan test tests/Feature/Database/SidhaDemoSeederTest.php`

Expected: FAIL because the seeder does not exist.

- [ ] **Step 3: Implement an explicitly invoked, non-production seeder**

Create one verified active Admin (`admin@sidha.test`), three fictional Members including one suspended account, eight fictional Clients across all statuses, and one to three contacts per Client with at most one primary. Use only `.test` emails and clearly fictional names. Throw `LogicException('SIDHA demo data cannot be seeded in production.')` before writes when `app()->isProduction()`.

Keep `DatabaseSeeder` safe: call `SidhaDemoSeeder` only in `local` and `testing`, never in production.

- [ ] **Step 4: Run seeder, model, and page tests**

Run: `php artisan test tests/Feature/Database/SidhaDemoSeederTest.php tests/Unit/Models tests/Feature/Clients/ClientReadTest.php tests/Feature/Team/TeamReadTest.php`

Expected: PASS with deterministic record counts.

- [ ] **Step 5: Commit Task 9**

```bash
git add database/seeders/SidhaDemoSeeder.php database/seeders/DatabaseSeeder.php tests/Feature/Database/SidhaDemoSeederTest.php
git commit -m "test: add fictional SIDHA demo data"
```

---

### Task 10: Complete regression, visual verification, and final review

**Files:**
- Modify only if a verified Phase 2 defect requires it: Phase 2 files from Tasks 1–9
- Create: `.superpowers/sdd/2026-09-13-sidha-phase-2-clients-team/task-10-verification-report.md` (ignored execution evidence)
- Update: `.superpowers/sdd/2026-09-13-sidha-phase-2-clients-team/progress.md` (ignored execution ledger)

**Interfaces:**
- Consumes: every Phase 2 route, page, policy, action, middleware, factory, and seeder.
- Produces: a clean reviewed branch and reproducible verification evidence; no new product capability.

- [ ] **Step 1: Re-read the approved spec and build a traceability checklist**

Map each acceptance criterion 1–11 to its implementing commit, focused automated test, and visual scenario in the verification report. Treat any unmapped criterion as a blocking gap.

- [ ] **Step 2: Run the complete backend quality gate**

Run:

```bash
php artisan config:clear
php artisan test
vendor/bin/pint --parallel --test
vendor/bin/phpstan analyse --memory-limit=1G
```

Expected: all tests pass, Pint reports no formatting changes required, and PHPStan reports 0 errors.

- [ ] **Step 3: Run the complete frontend quality gate**

Run:

```bash
php artisan wayfinder:generate --with-form
npm run check
npm run types:check
npm run build
```

Expected: formatter/lint pass, TypeScript exits 0, and the production build exits 0.

- [ ] **Step 4: Verify the browser role matrix**

Using fictional seeded data, verify:

- Admin sees and successfully uses Client create/edit/archive/reactivate.
- Member sees Client list/detail and no mutation controls.
- Crafted Member POST/PUT/PATCH requests are rejected with 403, as already covered by automated tests.
- Admin sees Team management controls and completes create/edit/suspend/reactivate/resend.
- Member sees the Team directory and no management controls.
- Suspended accounts are logged out and cannot reopen Dashboard, Clients, Team, or Settings.
- Public `/register` returns 404 while login, forgot/reset password, email verification, passkeys, 2FA, profile, security, and appearance remain available as designed.

Record console errors and failed HTTP requests; expected authorization responses from deliberate negative tests are the only permitted 4xx responses.

- [ ] **Step 5: Execute the visual and accessibility matrix**

At 1440, 1024, 768, and 375 px, verify Client Index, Client Detail, Client Create/Edit, Team Index, and Member Create/Edit in Light, Dark, and System themes. Cover expanded/collapsed desktop sidebar, mobile sidebar, active navigation, tables/cards, filters, pagination, repeatable contacts, confirmation dialogs, keyboard-only operation, visible focus, labels, error association, text-labelled statuses, clipping, and horizontal overflow.

Run automated axe checks on at least Client Index, Client Form, Team Index, and Member Form in both a desktop and 375 px viewport. Expected: 0 serious or critical violations.

- [ ] **Step 6: Request two-stage independent review**

First reviewer compares the complete diff against the approved spec and plan. After every compliance finding is resolved and focused regressions pass, a second reviewer inspects correctness, security, maintainability, query efficiency, accessibility, and test quality. Resolve findings only within Phase 2 scope and rerun affected gates.

- [ ] **Step 7: Run final Git scope verification**

Run:

```bash
git diff --check bb6026026c9529d0022d79b29a65d864477c1cbb...HEAD
git diff --stat bb6026026c9529d0022d79b29a65d864477c1cbb...HEAD
git status --short
git log --oneline --decorate bb6026026c9529d0022d79b29a65d864477c1cbb..HEAD
```

Expected: no whitespace errors, changes limited to the approved specification/plan and Phase 2 implementation, clean worktree, and readable task-sized commits.

- [ ] **Step 8: Commit only verified correction changes if required**

If Step 2–6 identified a Phase 2 defect, stage only its affected files and verification regression test, then commit:

```bash
git commit -m "fix: complete SIDHA phase 2 verification"
```

If no tracked correction is required, do not create an empty commit. Stop before any push, merge, or deployment and present the final Phase 2 report.
