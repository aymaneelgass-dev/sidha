# SIDHA Phase 1 Shell and Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build SIDHA's premium authenticated application shell and responsive demonstration dashboard without adding business persistence or changing authentication behavior.

**Architecture:** Extend the official starter's `AppLayout`, sidebar primitives, user menu, and appearance hook. Keep presentation data in a typed `dashboardDemoData` module, pass narrow data slices into reusable dashboard components, and route undeveloped modules to one generic Inertia page.

**Tech Stack:** PHP 8.3, Laravel 13, Fortify, Inertia.js 3, React 19, TypeScript 5, Tailwind CSS 4, Lucide React, Recharts, Vite 8, MySQL 8, PHPUnit 12, Pint, and PHPStan.

**Spec:** `docs/superpowers/specs/2026-09-02-sidha-phase-1-shell-dashboard-design.md`

## Global Constraints

- Preserve the existing Laravel 13 authentication, email verification, profile, security, passkeys, two-factor authentication, logout, and Light/Dark/System persistence behavior.
- Keep the existing five foundation migrations as the complete migration set; create no migration, model, business controller, seeder, table, service, policy, job, or event.
- Add only one production frontend dependency: Recharts.
- Use `Instrument Sans`, Tailwind CSS semantic tokens, Lucide icons, and existing Radix-based UI primitives.
- Keep Projects, Studio, Clients, Calendar, SIDHA AI, and Team presentation-only through one generic `Coming soon` page.
- Keep Settings connected to the starter's existing Profile, Security, and Appearance pages.
- Keep search, notifications, SIDHA AI, project controls, and booking controls non-operational in this phase.
- Store all dashboard records in `resources/js/data/dashboard-demo.ts`; do not send business data from Laravel.
- Maintain keyboard access, visible focus, accessible names, reduced-motion support, responsive behavior, and zero horizontal overflow at 375 pixels.
- Do not edit `app/Models/User.php`, Fortify actions/providers, authentication pages, settings controllers, or existing migration files.
- Start execution from the current remote `main`, use an isolated worktree, and never force-push.

## File Map

### Create

- `resources/js/components/shell/appearance-menu.tsx` — compact Light/Dark/System menu backed by `useAppearance`.
- `resources/js/components/shell/header-search.tsx` — presentational, non-submitting search field.
- `resources/js/components/shell/sidha-ai-card.tsx` — sidebar promotional card linking to the generic SIDHA AI page.
- `resources/js/components/dashboard/dashboard-card.tsx` — shared card frame and heading contract.
- `resources/js/components/dashboard/dashboard-kpi-card.tsx` — one typed KPI tile.
- `resources/js/components/dashboard/revenue-overview.tsx` — responsive Recharts area chart.
- `resources/js/components/dashboard/project-status-chart.tsx` — responsive Recharts donut and text legend.
- `resources/js/components/dashboard/active-projects.tsx` — demonstration project summaries.
- `resources/js/components/dashboard/upcoming-schedule.tsx` — chronological event list.
- `resources/js/components/dashboard/studio-bookings.tsx` — demonstration booking list.
- `resources/js/components/dashboard/recent-activity.tsx` — activity feed.
- `resources/js/components/dashboard/budget-overview.tsx` — totals, progress, and allocation breakdown.
- `resources/js/data/dashboard-demo.ts` — the only source of dashboard demonstration records.
- `resources/js/pages/coming-soon.tsx` — shared page for six undeveloped modules.
- `resources/js/types/dashboard.ts` — stable presentation contracts.
- `tests/Feature/ComingSoonPagesTest.php` — route protection and exact Inertia prop tests.

### Modify

- `package.json` and `package-lock.json` — install and lock Recharts.
- `resources/css/app.css` — SIDHA semantic light/dark tokens and safe decorative utilities.
- `resources/js/app.tsx` — update the Inertia progress color only.
- `resources/js/components/app-logo.tsx` — SIDHA name and `Creative Production` lockup.
- `resources/js/components/app-logo-icon.tsx` — compact SIDHA mark.
- `resources/js/components/app-sidebar.tsx` — ordered navigation, generic page routes, Settings, AI card, and user footer.
- `resources/js/components/app-sidebar-header.tsx` — sticky page header orchestration.
- `resources/js/components/nav-main.tsx` — badges, active state, accessible current-page state, and collapsed tooltips.
- `resources/js/components/ui/sidebar.tsx` — change only sidebar width constants and formatting touched by the starter generator if required.
- `resources/js/layouts/app-layout.tsx` — pass title and description metadata through.
- `resources/js/layouts/app/app-sidebar-layout.tsx` — pass header metadata and page spacing.
- `resources/js/pages/dashboard.tsx` — compose all dashboard sections from demo data.
- `resources/js/types/index.ts` — export dashboard types.
- `resources/js/types/navigation.ts` — add optional navigation badge.
- `resources/js/types/ui.ts` — add optional layout title and description.
- `routes/web.php` — six explicit authenticated and verified generic module routes.
- `tests/Feature/DashboardTest.php` — assert the Inertia component and absence of backend dashboard data.

### Preserve Without Modification

- `resources/js/hooks/use-appearance.tsx`
- `resources/js/layouts/settings/layout.tsx`
- `routes/settings.php`
- `app/Http/Middleware/HandleInertiaRequests.php`
- `app/Http/Middleware/HandleAppearance.php`
- all authentication pages, Fortify classes, models, and migrations

---

### Task 1: Establish the Baseline and Add Recharts

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: the verified foundation on remote `main` and the existing npm lockfile.
- Produces: a locked `recharts` dependency available to dashboard chart components.

- [ ] **Step 1: Create the isolated implementation worktree**

Invoke `superpowers:using-git-worktrees`, create branch `feat/sidha-phase-1-shell-dashboard` from the latest `origin/main`, and verify that `composer.lock` and `package-lock.json` are present.

- [ ] **Step 2: Record the immutable baseline**

Run:

```bash
git status --short
find database/migrations -maxdepth 1 -type f -name '*.php' | sort
php artisan test
npm run check
npm run types:check
npm run build
```

Expected: clean status, exactly five migration files, 39 passing Laravel tests with 136 assertions, and successful frontend checks and build.

- [ ] **Step 3: Install Recharts and update the npm lockfile**

Run:

```bash
npm install recharts
npm ls recharts --depth=0
```

Expected: `recharts` appears in `dependencies`, npm resolves one installed version, and both manifest and lockfile change.

- [ ] **Step 4: Verify the dependency-only change**

Run:

```bash
npm run check
npm run types:check
npm run build
git diff --check
```

Expected: every command exits 0.

- [ ] **Step 5: Commit the dependency**

```bash
git add package.json package-lock.json
git commit -m "build: add Recharts for dashboard visualizations"
```

---

### Task 2: Add Protected Generic Module Routes

**Files:**
- Create: `tests/Feature/ComingSoonPagesTest.php`
- Modify: `routes/web.php`
- Create: `resources/js/pages/coming-soon.tsx`

**Interfaces:**
- Consumes: Laravel `auth` and `verified` middleware, Inertia, `AppLayout`, and Lucide.
- Produces: named routes `projects.index`, `studio.index`, `clients.index`, `calendar.index`, `sidha-ai.index`, and `team.index`; page props `pageTitle: string`, `pageDescription: string`, and `moduleIcon: ModuleIconName`.

- [ ] **Step 1: Write the failing route feature tests**

Create `tests/Feature/ComingSoonPagesTest.php` with a data provider containing these exact contracts:

```php
<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class ComingSoonPagesTest extends TestCase
{
    use RefreshDatabase;

    public static function modules(): array
    {
        return [
            'projects' => ['projects.index', 'Projects', 'clapperboard'],
            'studio' => ['studio.index', 'Studio', 'audio-lines'],
            'clients' => ['clients.index', 'Clients', 'users-round'],
            'calendar' => ['calendar.index', 'Calendar', 'calendar-days'],
            'sidha ai' => ['sidha-ai.index', 'SIDHA AI', 'sparkles'],
            'team' => ['team.index', 'Team', 'users'],
        ];
    }

    #[DataProvider('modules')]
    public function test_guests_are_redirected_from_future_modules(
        string $routeName,
        string $_title,
        string $_icon,
    ): void {
        $this->get(route($routeName))->assertRedirect(route('login'));
    }

    #[DataProvider('modules')]
    public function test_unverified_users_are_redirected_from_future_modules(
        string $routeName,
        string $_title,
        string $_icon,
    ): void {
        $user = User::factory()->unverified()->create();

        $this->actingAs($user)
            ->get(route($routeName))
            ->assertRedirect(route('verification.notice'));
    }

    #[DataProvider('modules')]
    public function test_authenticated_users_can_view_a_generic_module_page(
        string $routeName,
        string $title,
        string $icon,
    ): void {
        $user = User::factory()->create(['email_verified_at' => now()]);

        $this->actingAs($user)
            ->get(route($routeName))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('coming-soon')
                ->where('pageTitle', $title)
                ->where('moduleIcon', $icon)
                ->has('pageDescription')
            );
    }
}
```

- [ ] **Step 2: Run the new tests and confirm the expected failure**

Run:

```bash
php artisan test tests/Feature/ComingSoonPagesTest.php
```

Expected: FAIL because the six named routes do not exist.

- [ ] **Step 3: Define six explicit routes with presentation props**

Inside the existing `auth` and `verified` route group in `routes/web.php`, add six `Route::inertia` declarations. Use these exact paths and props:

```php
Route::inertia('projects', 'coming-soon', [
    'pageTitle' => 'Projects',
    'pageDescription' => 'Plan, produce, and deliver creative work from one place.',
    'moduleIcon' => 'clapperboard',
])->name('projects.index');

Route::inertia('studio', 'coming-soon', [
    'pageTitle' => 'Studio',
    'pageDescription' => 'Coordinate recording spaces, sessions, and studio resources.',
    'moduleIcon' => 'audio-lines',
])->name('studio.index');

Route::inertia('clients', 'coming-soon', [
    'pageTitle' => 'Clients',
    'pageDescription' => 'Keep client relationships and production context organized.',
    'moduleIcon' => 'users-round',
])->name('clients.index');

Route::inertia('calendar', 'coming-soon', [
    'pageTitle' => 'Calendar',
    'pageDescription' => 'Bring shoots, sessions, meetings, and deadlines together.',
    'moduleIcon' => 'calendar-days',
])->name('calendar.index');

Route::inertia('sidha-ai', 'coming-soon', [
    'pageTitle' => 'SIDHA AI',
    'pageDescription' => 'A future creative assistant for the SIDHA production workflow.',
    'moduleIcon' => 'sparkles',
])->name('sidha-ai.index');

Route::inertia('team', 'coming-soon', [
    'pageTitle' => 'Team',
    'pageDescription' => 'Coordinate collaborators, responsibilities, and production roles.',
    'moduleIcon' => 'users',
])->name('team.index');
```

- [ ] **Step 4: Build the generic page**

Create a strict union and icon mapping in `coming-soon.tsx`:

```tsx
type ModuleIconName =
    | 'clapperboard'
    | 'audio-lines'
    | 'users-round'
    | 'calendar-days'
    | 'sparkles'
    | 'users';

type ComingSoonPageProps = {
    pageTitle: string;
    pageDescription: string;
    moduleIcon: ModuleIconName;
};

const moduleIcons = {
    'clapperboard': Clapperboard,
    'audio-lines': AudioLines,
    'users-round': UsersRound,
    'calendar-days': CalendarDays,
    sparkles: Sparkles,
    users: Users,
} satisfies Record<ModuleIconName, LucideIcon>;
```

Render `Head`, one centered premium card, the mapped icon, `Coming soon`, `pageTitle`, and `pageDescription`. Do not render forms, buttons that imply an action, counters, or demonstration records.

- [ ] **Step 5: Verify routes, tests, and generated route types**

Run:

```bash
php artisan route:list --path=projects
php artisan route:list --path=sidha-ai
php artisan test tests/Feature/ComingSoonPagesTest.php
npm run build
npm run types:check
```

Expected: all eighteen data-provider test cases pass and Wayfinder generates usable route helpers.

- [ ] **Step 6: Commit generic navigation destinations**

```bash
git add routes/web.php tests/Feature/ComingSoonPagesTest.php resources/js/pages/coming-soon.tsx
git commit -m "feat: add protected coming-soon module routes"
```

---

### Task 3: Establish SIDHA Theme and Layout Metadata

**Files:**
- Modify: `resources/css/app.css`
- Modify: `resources/js/app.tsx`
- Modify: `resources/js/types/ui.ts`
- Modify: `resources/js/layouts/app-layout.tsx`
- Modify: `resources/js/layouts/app/app-sidebar-layout.tsx`

**Interfaces:**
- Consumes: current Tailwind semantic variables and existing `AppLayoutProps`.
- Produces: `AppLayoutProps.title?: string`, `AppLayoutProps.description?: string`, and SIDHA semantic colors usable by every shell/dashboard component.

- [ ] **Step 1: Extend the layout metadata contract**

Change `AppLayoutProps` in `resources/js/types/ui.ts` to:

```ts
export type AppLayoutProps = {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    title?: string;
    description?: string;
};
```

Pass both optional values unchanged through `AppLayout` and `AppSidebarLayout` into `AppSidebarHeader`. Keep breadcrumbs working for the existing Settings pages.

- [ ] **Step 2: Replace neutral theme tokens with SIDHA semantic tokens**

In `resources/css/app.css`, preserve all token names consumed by UI primitives. Set light and dark values to the palette in the spec, including background, foreground, card, popover, primary, accent, border, ring, chart colors, and all sidebar tokens. Add only these reusable utilities:

```css
@layer utilities {
    .sidha-surface-glow {
        background-image: radial-gradient(
            circle at top right,
            color-mix(in oklab, var(--primary) 12%, transparent),
            transparent 42%
        );
    }

    .sidha-grid-fade {
        background-image:
            linear-gradient(to right, color-mix(in oklab, var(--border) 50%, transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in oklab, var(--border) 50%, transparent) 1px, transparent 1px);
        background-size: 32px 32px;
    }
}
```

Add a reduced-motion media rule that removes non-essential transition duration without disabling focus feedback.

- [ ] **Step 3: Align global progress feedback**

Change the Inertia progress color in `resources/js/app.tsx` from neutral gray to `#8B5CF6`. Do not change layout selection, providers, Toaster, or `initializeTheme()`.

- [ ] **Step 4: Run static checks**

Run:

```bash
npm run check
npm run types:check
npm run build
git diff --check
```

Expected: all commands exit 0; authentication and Settings source files remain untouched.

- [ ] **Step 5: Commit the theme foundation**

```bash
git add resources/css/app.css resources/js/app.tsx resources/js/types/ui.ts resources/js/layouts/app-layout.tsx resources/js/layouts/app/app-sidebar-layout.tsx
git commit -m "feat: establish SIDHA application theme"
```

---

### Task 4: Build the SIDHA Sidebar

**Files:**
- Modify: `resources/js/components/app-logo.tsx`
- Modify: `resources/js/components/app-logo-icon.tsx`
- Modify: `resources/js/components/app-sidebar.tsx`
- Modify: `resources/js/components/nav-main.tsx`
- Modify: `resources/js/components/ui/sidebar.tsx`
- Modify: `resources/js/types/navigation.ts`
- Create: `resources/js/components/shell/sidha-ai-card.tsx`

**Interfaces:**
- Consumes: six Wayfinder route helpers from Task 2, `profile.edit`, current `NavUser`, and `Sidebar` primitives.
- Produces: `NavItem.badge?: string`, ordered SIDHA navigation, branded lockup, and reusable `SidhaAiCard`.

- [ ] **Step 1: Extend navigation item typing**

Add one optional property only:

```ts
export type NavItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    badge?: string;
};
```

- [ ] **Step 2: Update the brand lockup**

Make `AppLogo` render `SIDHA` and `Creative Production` directly rather than the generic app name. Keep the icon visible in collapsed mode and hide subtitle/text through existing sidebar group selectors. Replace the Laravel path in `AppLogoIcon` with this compact current-color mark:

```tsx
export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="28" height="28" rx="9" fill="currentColor" opacity="0.16" />
            <path
                d="M22.5 9.5C20.7 8.1 18.6 7.4 16.1 7.4C12.4 7.4 9.8 9.3 9.8 12.1C9.8 15 12.1 16.2 16.2 17C19.1 17.6 20.2 18.2 20.2 19.6C20.2 21 18.8 21.9 16.6 21.9C14.1 21.9 11.8 21 9.8 19.2L8.2 22C10.4 24 13.3 25 16.5 25C20.5 25 23.4 23 23.4 19.6C23.4 16.8 21.4 15.4 17.1 14.5C14.1 13.9 13 13.4 13 12.1C13 11 14.2 10.3 16.1 10.3C18 10.3 19.7 10.9 21.1 12L22.5 9.5Z"
                fill="currentColor"
            />
        </svg>
    );
}
```

- [ ] **Step 3: Create the sidebar AI card**

Implement this public contract:

```tsx
type SidhaAiCardProps = {
    href: NonNullable<InertiaLinkProps['href']>;
};

export function SidhaAiCard({ href }: SidhaAiCardProps) {
    return (
        <div className="sidha-surface-glow border-sidebar-border bg-sidebar-accent/50 group-data-[collapsible=icon]:hidden rounded-xl border p-3">
            <Sparkles className="text-primary mb-3 size-5" aria-hidden="true" />
            <p className="text-sm font-medium">Create faster with SIDHA AI</p>
            <p className="text-sidebar-foreground/60 mt-1 text-xs">Your creative production assistant is coming soon.</p>
            <Link href={href} className="bg-primary text-primary-foreground mt-3 inline-flex h-8 w-full items-center justify-center rounded-lg text-xs font-semibold">
                Open SIDHA AI
            </Link>
        </div>
    );
}
```

The card uses the shared violet tokens, one restrained glow, and no AI response, input, counter, or backend request.

- [ ] **Step 4: Replace starter navigation with the approved order**

Import the generated Wayfinder functions with explicit aliases:

```ts
import { index as projects } from '@/routes/projects';
import { index as studio } from '@/routes/studio';
import { index as clients } from '@/routes/clients';
import { index as calendar } from '@/routes/calendar';
import { index as sidhaAi } from '@/routes/sidha-ai';
import { index as team } from '@/routes/team';
import { edit as editProfile } from '@/routes/profile';
```

Use these exact `NavItem` entries in `AppSidebar`:

```ts
const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutDashboard },
    { title: 'Projects', href: projects(), icon: Clapperboard },
    { title: 'Studio', href: studio(), icon: AudioLines },
    { title: 'Clients', href: clients(), icon: UsersRound },
    { title: 'Calendar', href: calendar(), icon: CalendarDays },
    { title: 'SIDHA AI', href: sidhaAi(), icon: Sparkles, badge: 'AI' },
    { title: 'Team', href: team(), icon: Users },
    { title: 'Settings', href: editProfile(), icon: Settings },
];
```

Remove the starter Repository and Documentation footer links. Render `SidhaAiCard` and then the unchanged `NavUser` in `SidebarFooter`.

- [ ] **Step 5: Refine active and collapsed navigation behavior**

In `NavMain`, render `SidebarMenuBadge` when `item.badge` exists, pass the item title to the existing collapsed tooltip, and apply `aria-current="page"` only to the active Inertia link. Use semantic sidebar tokens; do not hardcode dark-only neutral colors.

- [ ] **Step 6: Adjust sidebar dimensions**

In `components/ui/sidebar.tsx`, change only:

```ts
const SIDEBAR_WIDTH = '16.75rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3.75rem';
```

Retain cookie persistence, keyboard shortcut, mobile sheet, context behavior, and exports.

- [ ] **Step 7: Verify navigation and regression behavior**

Run:

```bash
npm run check
npm run types:check
npm run build
php artisan test tests/Feature/ComingSoonPagesTest.php tests/Feature/Settings
```

Expected: all commands pass; Settings continues to resolve to `profile.edit`.

- [ ] **Step 8: Commit the sidebar**

```bash
git add resources/js/components/app-logo.tsx resources/js/components/app-logo-icon.tsx resources/js/components/app-sidebar.tsx resources/js/components/nav-main.tsx resources/js/components/ui/sidebar.tsx resources/js/components/shell/sidha-ai-card.tsx resources/js/types/navigation.ts
git commit -m "feat: build the SIDHA application sidebar"
```

---

### Task 5: Build the Responsive Header

**Files:**
- Create: `resources/js/components/shell/appearance-menu.tsx`
- Create: `resources/js/components/shell/header-search.tsx`
- Modify: `resources/js/components/app-sidebar-header.tsx`

**Interfaces:**
- Consumes: `useAppearance`, existing dropdown primitives, `SidebarTrigger`, layout metadata, breadcrumbs, and optional generic page props.
- Produces: `AppearanceMenu`, `HeaderSearch`, and a sticky responsive application header.

- [ ] **Step 1: Create the appearance menu without altering persistence**

Implement this exact mode list against the existing hook:

```tsx
const modes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
] satisfies ReadonlyArray<{
    value: Appearance;
    label: string;
    icon: LucideIcon;
}>;
```

The trigger displays the `resolvedAppearance` icon, has accessible name `Change appearance`, and the active menu item receives a `Check` icon. Call only `updateAppearance(mode)`; do not recreate storage or cookie logic.

- [ ] **Step 2: Create a non-submitting header search field**

Implement:

```tsx
export function HeaderSearch() {
    return (
        <div role="search" aria-label="Search SIDHA" className="relative">
            <Search aria-hidden="true" />
            <Input
                type="search"
                aria-label="Search SIDHA"
                placeholder="Search SIDHA"
                onKeyDown={(event) => {
                    if (event.key === 'Enter') event.preventDefault();
                }}
            />
        </div>
    );
}
```

The field may accept local text but must not submit, navigate, fetch, filter records, or claim results.

- [ ] **Step 3: Compose the sticky application header**

`AppSidebarHeader` accepts `breadcrumbs`, `title`, and `description`. Resolve metadata in this order:

1. `page.props.pageTitle` and `page.props.pageDescription` for the generic page.
2. Explicit layout `title` and `description`.
3. Last breadcrumb title.
4. `Dashboard` as a defensive fallback.

Render the sidebar trigger, title/description, desktop search, appearance menu, and a notification icon with `aria-label="Notifications"`. The unread dot is decorative demonstration state and the button performs no action. On mobile, keep the trigger/title/actions on the first row and place the search field on a full-width second row.

- [ ] **Step 4: Verify header types and theme preservation**

Run:

```bash
npm run check
npm run types:check
npm run build
php artisan test tests/Feature/Auth tests/Feature/Settings
```

Expected: all checks pass and the appearance hook file has no diff.

- [ ] **Step 5: Commit the header**

```bash
git add resources/js/components/shell/appearance-menu.tsx resources/js/components/shell/header-search.tsx resources/js/components/app-sidebar-header.tsx
git commit -m "feat: add the SIDHA responsive header"
```

---

### Task 6: Define Dashboard Types and Demonstration Data

**Files:**
- Create: `resources/js/types/dashboard.ts`
- Modify: `resources/js/types/index.ts`
- Create: `resources/js/data/dashboard-demo.ts`
- Modify: `tests/Feature/DashboardTest.php`

**Interfaces:**
- Consumes: no backend data and no React state.
- Produces: `DashboardData` and `dashboardDemoData`, the only data contract consumed by Tasks 7 and 8.

- [ ] **Step 1: Strengthen the dashboard route test**

Update the authenticated assertion in `DashboardTest`:

```php
use Inertia\Testing\AssertableInertia as Assert;

$response->assertOk()
    ->assertInertia(fn (Assert $page) => $page
        ->component('dashboard')
        ->missing('dashboard')
        ->missing('projects')
        ->missing('revenue')
    );
```

This proves Laravel does not supply a business dataset during Phase 1.

- [ ] **Step 2: Run the focused backend test**

Run:

```bash
php artisan test tests/Feature/DashboardTest.php
```

Expected: PASS; the route already satisfies the backend isolation contract.

- [ ] **Step 3: Define exact presentation types**

Create `resources/js/types/dashboard.ts` with these unions and interfaces:

```ts
export type KpiTone = 'violet' | 'rose' | 'emerald' | 'blue';
export type ProjectStage = 'Planning' | 'Production' | 'Post-production';
export type BookingStatus = 'Confirmed' | 'Pending';
export type ActivityKind = 'approval' | 'upload' | 'project' | 'booking';

export type DashboardKpi = {
    id: string;
    label: string;
    value: string;
    trend: string;
    tone: KpiTone;
};

export type RevenuePoint = { month: string; revenue: number; expenses: number };
export type ProjectStatusPoint = { name: ProjectStage; value: number; color: string };
export type ActiveProject = {
    id: string;
    name: string;
    client: string;
    stage: ProjectStage;
    progress: number;
    deadline: string;
    budget: string;
    team: readonly string[];
};
export type ScheduleItem = { id: string; date: string; time: string; title: string; location: string; kind: 'shoot' | 'studio' | 'meeting' };
export type StudioBooking = { id: string; room: string; client: string; time: string; status: BookingStatus };
export type RecentActivity = { id: string; message: string; time: string; kind: ActivityKind };
export type BudgetAllocation = { label: string; amount: number; color: string };
export type BudgetOverview = { total: number; used: number; remaining: number; percentage: number; allocations: readonly BudgetAllocation[] };

export type DashboardData = {
    kpis: readonly DashboardKpi[];
    revenue: readonly RevenuePoint[];
    projectStatus: readonly ProjectStatusPoint[];
    activeProjects: readonly ActiveProject[];
    upcomingSchedule: readonly ScheduleItem[];
    studioBookings: readonly StudioBooking[];
    recentActivity: readonly RecentActivity[];
    budget: BudgetOverview;
};
```

Export these types from `resources/js/types/index.ts`.

- [ ] **Step 4: Create the isolated demonstration dataset**

Create `dashboardDemoData` with the four exact KPI values, revenue points `Apr 78,000/39,000`, `May 92,500/44,300`, `Jun 88,400/41,000`, `Jul 109,800/48,200`, `Aug 115,200/50,100`, and `Sep 120,450/52,230`, plus project status values `2/3/2`.

Add these exact presentation records before the budget object:

```ts
activeProjects: [
    { id: 'project-1', name: 'Atlas Energy Film', client: 'Atlas Energy', stage: 'Production', progress: 72, deadline: '12 Sep', budget: '285,000 MAD', team: ['NA', 'YK'] },
    { id: 'project-2', name: 'Noor Sessions', client: 'Noor Records', stage: 'Post-production', progress: 88, deadline: '16 Sep', budget: '96,000 MAD', team: ['SM', 'AR'] },
    { id: 'project-3', name: 'Casa After Dark', client: 'Maison 33', stage: 'Planning', progress: 34, deadline: '24 Sep', budget: '174,000 MAD', team: ['IK', 'LM'] },
    { id: 'project-4', name: 'Pulse Campaign', client: 'Pulse Mobile', stage: 'Production', progress: 61, deadline: '30 Sep', budget: '210,000 MAD', team: ['YA', 'NB'] },
],
upcomingSchedule: [
    { id: 'schedule-1', date: '06 Sep', time: '09:00', title: 'Atlas Energy location shoot', location: 'Casablanca', kind: 'shoot' },
    { id: 'schedule-2', date: '07 Sep', time: '14:30', title: 'Noor Sessions vocal recording', location: 'Studio A', kind: 'studio' },
    { id: 'schedule-3', date: '09 Sep', time: '11:00', title: 'Pulse Campaign review', location: 'Client room', kind: 'meeting' },
],
studioBookings: [
    { id: 'booking-1', room: 'Studio A', client: 'Noor Records', time: 'Today · 14:30–18:00', status: 'Confirmed' },
    { id: 'booking-2', room: 'Studio B', client: 'Rima Voice', time: 'Tomorrow · 10:00–12:00', status: 'Pending' },
    { id: 'booking-3', room: 'Mix Suite', client: 'Maison 33', time: '08 Sep · 16:00–20:00', status: 'Confirmed' },
],
recentActivity: [
    { id: 'activity-1', message: 'Atlas Energy approved the shooting treatment', time: '18 min ago', kind: 'approval' },
    { id: 'activity-2', message: 'New edit uploaded for Noor Sessions', time: '1 hr ago', kind: 'upload' },
    { id: 'activity-3', message: 'Casa After Dark project space created', time: '3 hrs ago', kind: 'project' },
    { id: 'activity-4', message: 'Studio A booking confirmed', time: 'Yesterday', kind: 'booking' },
],
```

Use this internally consistent budget:

```ts
budget: {
    total: 240000,
    used: 148600,
    remaining: 91400,
    percentage: 62,
    allocations: [
        { label: 'Production', amount: 82000, color: '#8B5CF6' },
        { label: 'Studio', amount: 28600, color: '#6366F1' },
        { label: 'Post-production', amount: 38000, color: '#22C55E' },
    ],
},
```

Add the source comment `// Presentation-only demo data. Replace with typed Inertia props when business modules are implemented.` and use `satisfies DashboardData` to reject shape drift.

- [ ] **Step 5: Verify arithmetic and type consistency**

Confirm manually in the diff that `120450 - 52230 = 68220`, project statuses total `7`, allocations total `148600`, and `148600 + 91400 = 240000`. Then run:

```bash
npm run check
npm run types:check
php artisan test tests/Feature/DashboardTest.php
```

Expected: all commands pass.

- [ ] **Step 6: Commit data contracts**

```bash
git add resources/js/types/dashboard.ts resources/js/types/index.ts resources/js/data/dashboard-demo.ts tests/Feature/DashboardTest.php
git commit -m "feat: define typed dashboard demonstration data"
```

---

### Task 7: Build Shared Cards, KPIs, and Charts

**Files:**
- Create: `resources/js/components/dashboard/dashboard-card.tsx`
- Create: `resources/js/components/dashboard/dashboard-kpi-card.tsx`
- Create: `resources/js/components/dashboard/revenue-overview.tsx`
- Create: `resources/js/components/dashboard/project-status-chart.tsx`

**Interfaces:**
- Consumes: `DashboardKpi`, `RevenuePoint[]`, and `ProjectStatusPoint[]` from Task 6.
- Produces: four reusable visual components used by the Dashboard page in Task 8.

- [ ] **Step 1: Create the shared dashboard card frame**

Expose this contract:

```tsx
type DashboardCardProps = PropsWithChildren<{
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
    contentClassName?: string;
}>;
```

Render a semantic section with a single heading, optional description/action, consistent card tokens, `min-w-0`, and no section-specific data.

- [ ] **Step 2: Create the KPI card**

Expose `DashboardKpiCard({ kpi }: { kpi: DashboardKpi })`. Map KPI IDs to `WalletCards`, `ReceiptText`, `TrendingUp`, and `Clapperboard`; map tones to semantic icon surfaces. Render label, value, and trend without parsing formatted currency strings.

- [ ] **Step 3: Create the Revenue Overview chart**

Expose:

```tsx
export function RevenueOverview({ data }: { data: readonly RevenuePoint[] })
```

Use `ResponsiveContainer`, `AreaChart`, `CartesianGrid`, `XAxis`, `YAxis`, `Tooltip`, `Area`, and `Line`. Copy readonly input before passing it to Recharts if its types require mutable arrays. Format axis and tooltip amounts using `Intl.NumberFormat('en-US', { notation: 'compact' })` and append `MAD` in the tooltip. Include visible text `Revenue and expenses over the last six months` for non-visual context.

- [ ] **Step 4: Create the Project Status donut**

Expose:

```tsx
export function ProjectStatusChart({ data }: { data: readonly ProjectStatusPoint[] })
```

Calculate total with `data.reduce`, render `ResponsiveContainer`, `PieChart`, `Pie`, `Cell`, and `Tooltip`, place total `7` in an absolutely positioned center label, and render a text legend containing each status name and value.

- [ ] **Step 5: Verify charts and component contracts**

Run:

```bash
npm run check
npm run types:check
npm run build
```

Expected: all commands exit 0 and the production build resolves Recharts without warnings.

- [ ] **Step 6: Commit dashboard foundations**

```bash
git add resources/js/components/dashboard/dashboard-card.tsx resources/js/components/dashboard/dashboard-kpi-card.tsx resources/js/components/dashboard/revenue-overview.tsx resources/js/components/dashboard/project-status-chart.tsx
git commit -m "feat: add SIDHA dashboard metrics and charts"
```

---

### Task 8: Build Operational Cards and Assemble the Dashboard

**Files:**
- Create: `resources/js/components/dashboard/active-projects.tsx`
- Create: `resources/js/components/dashboard/upcoming-schedule.tsx`
- Create: `resources/js/components/dashboard/studio-bookings.tsx`
- Create: `resources/js/components/dashboard/recent-activity.tsx`
- Create: `resources/js/components/dashboard/budget-overview.tsx`
- Modify: `resources/js/pages/dashboard.tsx`

**Interfaces:**
- Consumes: remaining Task 6 types/data and all Task 7 components.
- Produces: the complete responsive SIDHA Dashboard page.

- [ ] **Step 1: Build Active Projects**

Expose `ActiveProjects({ projects }: { projects: readonly ActiveProject[] })`. Each row renders client/name, typed stage badge, deadline, budget, initials, and a native progress element or accessible progressbar with `aria-valuenow`, `aria-valuemin="0"`, and `aria-valuemax="100"`.

```tsx
export function ActiveProjects({ projects }: { projects: readonly ActiveProject[] })
```

- [ ] **Step 2: Build Upcoming Schedule**

Expose `UpcomingSchedule({ items }: { items: readonly ScheduleItem[] })`. Render an ordered list with date block, title, time, location, and a Lucide icon selected by the `kind` union. Do not render edit/add controls.

```tsx
export function UpcomingSchedule({ items }: { items: readonly ScheduleItem[] })
```

- [ ] **Step 3: Build Studio Bookings**

Expose `StudioBookings({ bookings }: { bookings: readonly StudioBooking[] })`. Render room/client/time and status badges with both text and color. Do not render confirmation or cancellation actions.

```tsx
export function StudioBookings({ bookings }: { bookings: readonly StudioBooking[] })
```

- [ ] **Step 4: Build Recent Activity**

Expose `RecentActivityList({ activities }: { activities: readonly RecentActivity[] })`. Map each `kind` to one Lucide icon and render message/time in a semantic list. Avoid links because activity destinations do not exist.

```tsx
export function RecentActivityList({ activities }: { activities: readonly RecentActivity[] })
```

- [ ] **Step 5: Build Budget Overview**

Expose `BudgetOverviewCard({ budget }: { budget: BudgetOverview })`. Format all amounts with `Intl.NumberFormat('en-US')`, append `MAD`, render total/used/remaining, an accessible 62% progressbar, and the three allocation lines.

```tsx
export function BudgetOverviewCard({ budget }: { budget: BudgetOverview })
```

- [ ] **Step 6: Assemble the Dashboard page**

Replace all starter placeholders in `dashboard.tsx`. Import `dashboardDemoData`, give the page `Head title="Dashboard"`, and compose this exact order:

```tsx
<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {dashboardDemoData.kpis.map((kpi) => (
        <DashboardKpiCard key={kpi.id} kpi={kpi} />
    ))}
</div>

<div className="grid min-w-0 gap-4 xl:grid-cols-12">
    <RevenueOverview data={dashboardDemoData.revenue} />
    <ProjectStatusChart data={dashboardDemoData.projectStatus} />
    <ActiveProjects projects={dashboardDemoData.activeProjects} />
    <UpcomingSchedule items={dashboardDemoData.upcomingSchedule} />
    <StudioBookings bookings={dashboardDemoData.studioBookings} />
    <RecentActivityList activities={dashboardDemoData.recentActivity} />
    <BudgetOverviewCard budget={dashboardDemoData.budget} />
</div>
```

Apply `xl:col-span-8/4`, `xl:col-span-7/5`, and three `xl:col-span-4` spans to match the specification. Set layout metadata to `title: 'Dashboard'` and description `Creative production at a glance.`

- [ ] **Step 7: Run focused automated verification**

Run:

```bash
php artisan test tests/Feature/DashboardTest.php
npm run check
npm run types:check
npm run build
git diff --check
```

Expected: all commands pass and no starter placeholder component remains imported by Dashboard.

- [ ] **Step 8: Commit the complete dashboard**

```bash
git add resources/js/components/dashboard resources/js/pages/dashboard.tsx
git commit -m "feat: build the SIDHA demonstration dashboard"
```

---

### Task 9: Perform Visual, Responsive, and Full Regression Verification

**Files:**
- Modify only if verification exposes a defect in a Phase 1 file.
- Verify: all files listed by this plan.

**Interfaces:**
- Consumes: the completed Phase 1 implementation.
- Produces: fresh proof that the shell/dashboard works and the foundation remains intact.

- [ ] **Step 1: Confirm database scope before tests**

Run:

```bash
find database/migrations -maxdepth 1 -type f -name '*.php' | sort
php artisan migrate:fresh --force
php artisan migrate:status
```

Expected: exactly the same five foundation migrations and every migration marked `Ran`.

- [ ] **Step 2: Run the complete backend verification**

Run:

```bash
composer run lint:check
composer run types:check
php artisan test
```

Expected: Pint and PHPStan pass; all original 39 tests plus the 18 new Coming soon route cases pass with zero failures.

- [ ] **Step 3: Run the complete frontend verification**

Run:

```bash
npm run check
npm run types:check
npm run build
```

Expected: lint, formatting, TypeScript, and the production Vite build all exit 0.

- [ ] **Step 4: Start the application for browser verification**

Run the existing development command:

```bash
composer dev
```

Create or use a verified local test account. Do not seed business records.

- [ ] **Step 5: Verify authenticated interactions in a browser**

At 1440, 1024, 768, and 375 pixel widths, verify:

- login redirects to Dashboard;
- desktop sidebar collapses and restores its state;
- mobile sidebar opens and closes;
- every navigation item reaches the correct page without 404;
- Settings opens the existing Profile page and Profile/Security/Appearance remain usable;
- the profile menu and logout still work;
- Light, Dark, and System update immediately and persist after reload;
- search accepts local text but issues no navigation/request;
- Notifications issues no navigation/request;
- both charts resize without clipping;
- the page has no horizontal overflow at 375 pixels.

- [ ] **Step 6: Inspect accessibility and contrast**

Keyboard through the sidebar, header actions, appearance menu, user menu, and Settings navigation. Verify visible focus, accessible icon-button names, `aria-current` on the active route, textual chart legends, text-backed status badges, and readable contrast in both themes.

- [ ] **Step 7: Audit repository scope**

Run:

```bash
git diff --check
git status --short
git diff --name-only origin/main...HEAD
git grep -nE '(AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|github_pat_|BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY)' -- . ':!docs' || true
```

Confirm the diff contains no `.env`, generated dependency directories, business model, business controller, migration, or credential.

- [ ] **Step 8: Commit verification-only corrections if any were required**

If a Phase 1 defect required a correction, stage only the affected Phase 1 files and commit:

```bash
git commit -m "fix: complete SIDHA phase 1 verification"
```

If the working tree is already clean, do not create an empty commit.

- [ ] **Step 9: Run the final gate immediately before handoff**

Run again with fresh output:

```bash
php artisan migrate:status
php artisan test
npm run check
npm run types:check
npm run build
git diff --check
git status --short
```

Expected: five migrations, zero test failures, successful frontend checks/build, and a clean working tree.

- [ ] **Step 10: Prepare the delivery summary**

Report changed files, new dependency version, migration count, Laravel test/ assertion totals, frontend check results, build result, visual viewport/theme coverage, commit SHAs, and any remote push or PR result explicitly requested for the implementation session.
