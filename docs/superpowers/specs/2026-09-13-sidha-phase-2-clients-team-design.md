# SIDHA Phase 2 — Clients & Team Design

**Date:** 2026-09-13

**Status:** Approved design, pending implementation plan

**Base:** Phase 1 final commit `bb6026026c9529d0022d79b29a65d864477c1cbb`

**Branch:** `feat/sidha-phase-2-clients-team`

## 1. Purpose

Phase 2 replaces the Clients and Team “Coming Soon” pages with the first persisted business modules in SIDHA. It establishes a clean client directory and a small internal access model that later phases can reuse for projects, audiovisual production, studio bookings, tasks, expenses and margins, calendar events, and SIDHA AI.

SIDHA remains a professional, explainable MVP for one audiovisual production company. The design deliberately avoids multi-tenancy, a client portal, a broad CRM, and fine-grained permission packages so that complexity remains available for the product’s differentiating production and AI capabilities.

## 2. Product Decisions

- SIDHA is a single-company internal application.
- Existing `User` accounts are the team-member profiles; there is no separate employee or team-member table.
- V1 has exactly two roles: `Admin` and `Member`.
- Clients and client contacts never authenticate in SIDHA.
- Public registration is disabled.
- Admins create member accounts by reusing Laravel’s existing password-reset and email-verification capabilities.
- No custom invitation-token table or third-party permission package is introduced.
- Existing authentication, email verification, password reset, passkeys, two-factor authentication, profile, security, and appearance behavior is preserved.
- `Admin` has full management access to clients and team members.
- `Member` has read-only access to clients and team members.

## 3. Domain Model

### 3.1 Client

The `clients` table stores the company or person receiving SIDHA’s services.

Proposed fields:

| Field | Type | Rules |
|---|---|---|
| `id` | bigint | Primary key |
| `name` | string | Required, trimmed |
| `industry` | nullable string | Optional business sector |
| `phone` | nullable string | Optional, normalized for display |
| `website` | nullable string | Optional valid URL |
| `address` | nullable text | Optional postal address |
| `notes` | nullable text | Internal notes only |
| `status` | string | `active`, `inactive`, or `archived`; defaults to `active` |
| timestamps | timestamps | Standard Laravel timestamps |

Client names are not globally unique because separate entities or branches may legitimately use similar names. Archived clients remain in the database and may be reactivated by an Admin. The application exposes no permanent deletion action.

### 3.2 Client Contact

The `client_contacts` table stores one or more people associated with a client.

Proposed fields:

| Field | Type | Rules |
|---|---|---|
| `id` | bigint | Primary key |
| `client_id` | foreign key | Required; belongs to a client |
| `name` | string | Required, trimmed |
| `job_title` | nullable string | Optional role or function |
| `email` | nullable string | Optional valid email |
| `phone` | nullable string | Optional |
| `is_primary` | boolean | Defaults to false |
| timestamps | timestamps | Standard Laravel timestamps |

A client may exist without contacts. A client may have many contacts but no more than one primary contact. The application enforces this invariant transactionally rather than relying on a MySQL-specific partial index. Contact email addresses are not globally unique because one person may represent more than one client entity.

### 3.3 User as Team Member

The existing `users` table is extended instead of creating a second employee profile.

Proposed additional fields:

| Field | Type | Rules |
|---|---|---|
| `role` | string | `admin` or `member`; defaults to `member` |
| `job_title` | nullable string | Optional professional function |
| `phone` | nullable string | Optional |
| `status` | string | `active` or `suspended`; defaults to `active` |

Backed PHP enums define the allowed role and status values while database columns remain portable strings. The existing initial-based avatar is retained; file uploads are outside this phase.

Existing users are not granted administrative privileges implicitly. A dedicated console command provides an explicit, auditable setup path to create or promote the first Admin. Factories provide clear `admin`, `member`, and `suspended` states for tests.

## 4. Account Provisioning

Public registration is disabled because SIDHA is an internal application. New accounts are provisioned only by an Admin.

The account flow is:

1. The Admin enters the member’s name, email, job title, phone, and role.
2. SIDHA creates a `User` with an unguessable generated password that is never displayed or transmitted.
3. SIDHA invokes Laravel’s existing password-reset notification so the member can define a password.
4. Laravel’s existing email-verification flow is preserved and used before business routes become accessible.
5. The Admin may resend the password-definition notification with throttling.

This flow reuses the existing password reset tokens and notifications. It adds no invitation model, custom token lifecycle, or parallel authentication implementation.

A console command supports first-Admin bootstrap on a new installation and promotion of an existing account. The command must avoid printing passwords or secrets and must refuse invalid email input.

## 5. Authorization and Account State

Authorization is enforced server-side with Laravel Policies and middleware. React conditionally displays controls for usability, but hidden controls are never treated as a security boundary.

| Capability | Admin | Member |
|---|---:|---:|
| List and view clients and contacts | Yes | Yes |
| Create or edit clients and contacts | Yes | No |
| Archive or reactivate clients | Yes | No |
| List and view team members | Yes | Yes |
| Create or edit members | Yes | No |
| Change roles or statuses | Yes | No |
| Resend password-definition notification | Yes | No |

Business routes require authentication, a verified email, and an active account. A suspended user is denied on every protected request, not only at login, so an existing session cannot bypass suspension. The user is logged out safely and returned to login with a clear message.

The following safeguards are mandatory:

- an Admin cannot suspend their own account;
- the last active Admin cannot be suspended or changed to Member;
- users cannot change their own role through profile settings or crafted requests;
- role and status values are validated against the defined enums;
- account deletion is not offered in Team management;
- the existing personal profile deletion feature remains available, but deletion is denied when the requester is the last active Admin; this invariant receives a regression test.

## 6. Client Experience

### 6.1 Client Index

`Clients` replaces the current Coming Soon route with a real server-backed page containing:

- page title and description;
- an Admin-only `New client` action;
- real counts for active, inactive, and archived clients;
- search by client name, industry, or contact name/email;
- status filter;
- server-side pagination;
- desktop table and mobile cards;
- empty and no-results states.

Filters and pagination live in the URL query string and survive page refresh and navigation. Pagination preserves active filters. Queries eager-load only the data required for the list and avoid per-row queries.

### 6.2 Client Detail

The detail page shows:

- name and status;
- industry, phone, website, and address;
- internal notes;
- contact list with a clear primary-contact marker;
- timestamps where useful;
- Admin-only edit, archive, or reactivate actions.

Members see the same business information without mutation controls. No fake project list or business metric is displayed before the Projects phase supplies real data.

### 6.3 Client Form

Create and edit use dedicated responsive pages rather than oversized dialogs. The form has two sections:

1. client information;
2. a repeatable contact editor.

Admins can add and remove contact rows and select one primary contact. Validation errors appear next to the relevant client or contact field. Client and contact changes are committed inside one database transaction; a failure rolls the entire operation back.

## 7. Team Experience

### 7.1 Team Index

`Team` replaces its Coming Soon route with a real page containing:

- active and suspended members;
- name, initials, email, job title, phone, role, and status;
- search by name or email;
- role and status filters;
- server-side pagination;
- desktop table and mobile cards;
- Admin-only `New member` action and management controls.

Members have a read-only view. Admin-only controls are both hidden in the UI and rejected by server authorization when called directly.

### 7.2 Member Management

Admin pages support:

- account creation;
- professional-profile editing;
- role changes;
- suspension and reactivation;
- password-definition notification resend.

Sensitive state changes use an accessible confirmation dialog. The interface explains why self-suspension or removal of the last active Admin is refused.

## 8. Application and Data Flow

The phase follows existing Laravel, Inertia, React, and TypeScript conventions:

1. React submits forms and query parameters through Inertia.
2. Form Request classes authorize, validate, and normalize input.
3. Policies enforce resource permissions.
4. Controllers coordinate narrowly scoped use cases.
5. Models and small domain actions apply transactional changes.
6. Eloquent persists to MySQL.
7. Inertia returns typed props and paginated resources.
8. Existing flash toasts report success or failure.

Client/contact synchronization belongs in a focused action or service rather than a large controller method. Member provisioning similarly uses a focused action that creates the account and invokes Laravel’s standard notification. No separate JSON API is introduced.

Expected route groups include conventional resource-style routes for client list, create, store, show, edit, and update plus explicit archive/reactivate actions. Team uses list, create, store, edit, and update plus explicit suspend/reactivate and resend-password actions. Route names replace the existing `clients.index` and `team.index` Coming Soon names without changing sidebar navigation contracts.

## 9. Validation and Error Handling

- Required values are trimmed and bounded by explicit maximum lengths.
- Email, URL, enum, and nested-contact inputs receive server validation.
- User email remains globally unique.
- Invalid nested contact data returns indexed errors to the correct row.
- Authorization failures return `403`; missing resources return `404`.
- Transaction failures preserve the previous database state and return a generic user-facing error without leaking internals.
- Duplicate submissions are guarded through disabled submitting controls and normal database constraints.
- Passwords, hashes, reset tokens, two-factor secrets, and recovery codes are never exposed in Inertia props.
- CSRF protection remains enabled.
- Notification resend endpoints are throttled.

## 10. Visual and Accessibility Requirements

The existing SIDHA shell, active navigation, English interface language, and Light/Dark/System themes remain intact.

The new pages must provide:

- semantic headings, tables, forms, and buttons;
- programmatic labels and descriptions;
- visible keyboard focus;
- accessible validation summaries and inline errors;
- keyboard-operable repeatable contacts and confirmation dialogs;
- status information that does not rely on color alone;
- consistent empty, filtered-empty, loading/submitting, success, and error states;
- no clipping or horizontal overflow at 375 px.

The header’s global search and notification bell remain non-operational in this phase. Only the local Clients and Team searches are functional.

## 11. Included Scope

- Client and Client Contact migrations, models, enums, relationships, factories, and focused actions.
- User role, professional profile, and status migration and model changes.
- First-Admin bootstrap command.
- Public registration disablement.
- Active-account middleware and role/resource policies.
- Admin client management and Member client read-only access.
- Admin team management and Member team read-only access.
- Password-definition notification based on Laravel’s existing reset flow.
- Clients and Team Inertia pages, typed props, responsive components, filters, pagination, forms, and confirmation dialogs.
- Fictional, non-sensitive factories and an explicitly invoked demo seeder suitable for local development and the project defense.
- Regression coverage for all affected foundation and Phase 1 behavior.

## 12. Explicitly Out of Scope

- Multi-company tenancy.
- Client authentication or client portal.
- Lead pipeline, communication history, reminders, or advanced CRM behavior.
- Fine-grained permissions or a permission package.
- A custom invitation model or token system.
- File uploads and profile-image storage.
- Client/member permanent deletion through Team or Clients.
- Bulk import/export.
- Document storage.
- Custom audit-log subsystem.
- Projects, production workflow, Studio, Tasks, Expenses/Margin, Calendar, or SIDHA AI.
- Global header search and business notifications.
- Conversion of the Phase 1 dashboard demonstration dataset to live data.

## 13. Testing Strategy

### 13.1 Backend

Feature and unit tests cover:

- migrations, casts, enum behavior, factories, and relationships;
- Admin client create, edit, archive, and reactivate flows;
- Member list/detail access and denial of every client mutation;
- search, status filters, contact search, and pagination preservation;
- client/contact validation and atomic persistence;
- zero-or-one primary contact invariant;
- Admin member creation, edit, role change, suspend, reactivate, and notification resend;
- Member team read access and denial of team mutations;
- self-suspension and last-active-Admin guards;
- last-active-Admin protection through the existing personal profile deletion flow;
- suspended-account access revocation, including existing sessions;
- disabled public registration;
- first-Admin bootstrap command;
- reset-password and verification notifications without exposing secrets;
- guest and unverified-user route protection.

The complete existing Auth, Email Verification, Settings, Dashboard, and Coming Soon suites remain regression gates. Existing Coming Soon expectations are updated only for Clients and Team; all other module expectations remain unchanged.

### 13.2 Frontend and Browser

Required checks include:

- formatter and lint checks;
- TypeScript compilation;
- production Vite build;
- browser console and failed-request inspection;
- keyboard navigation and focus order;
- automated accessibility checks where supported;
- Light, Dark, and System themes;
- expanded, collapsed, and mobile sidebar behavior;
- active Clients and Team navigation;
- tables, cards, forms, dialogs, filters, and pagination.

The responsive matrix is 1440, 1024, 768, and 375 pixels for Client Index, Client Detail, Client Create/Edit, Team Index, and Member Create/Edit.

### 13.3 Quality Gates

The final phase gate requires:

- complete PHPUnit suite;
- Laravel Pint;
- PHPStan with zero errors;
- frontend format/lint check;
- TypeScript check;
- production build;
- independent code review;
- final scope and diff review;
- clean isolated worktree.

## 14. Acceptance Criteria

Phase 2 is accepted only when:

1. Clients and contacts are persisted in MySQL and rendered from real data.
2. Admin can create, edit, archive, and reactivate clients and manage contacts atomically.
3. Member can list and view clients but every client mutation is denied server-side.
4. Team renders real `User` accounts without a duplicate employee table.
5. Only Admin can create or manage member accounts.
6. Public registration is unavailable and new members use the existing secure password and verification flows.
7. Suspended accounts cannot access protected SIDHA routes, even with an existing session.
8. Self-suspension and removal of the last active Admin are prevented.
9. Existing authentication, settings, dashboard, shell, and remaining Coming Soon modules continue to work.
10. All new pages are keyboard accessible, theme-compatible, and free from horizontal overflow at 375 px.
11. All automated, static-analysis, build, visual, and independent-review gates pass.
