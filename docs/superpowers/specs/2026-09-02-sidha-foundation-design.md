# SIDHA Technical Foundation Design

## Objective

Create a clean, functional foundation for SIDHA without any business module or AI feature. The result must be ready for later product development while remaining limited to framework setup, authentication, database connectivity, theming, and verification.

## Architecture

- Laravel 13 provides routing, controllers, authentication, validation, persistence, and automated backend tests.
- The official Laravel React starter kit provides React with TypeScript, Inertia.js, Tailwind CSS, and the authentication user interface.
- Inertia.js connects Laravel routes to React pages without introducing a separate API layer.
- MySQL is the application database. Credentials stay in `.env`; `.env.example` contains safe local placeholders only.
- Vite compiles the TypeScript, React, and Tailwind frontend.

## Authentication Scope

The foundation includes the complete authentication flow supplied by the official starter kit:

- registration;
- login and logout;
- forgotten-password and password-reset flows;
- password confirmation;
- email verification;
- authenticated dashboard access.

Authentication infrastructure is technical foundation work, not a SIDHA business module.

## User Interface Scope

- Keep only the starter's essential public, authentication, account, and empty dashboard screens.
- Brand the application as `SIDHA` where the starter exposes the application name.
- Preserve light, dark, and system appearance modes.
- Persist the selected appearance mode across navigation and browser sessions.
- Do not add audiovisual workflows, CRM features, bookings, projects, AI tools, analytics, or other business functionality.

## Database

- Configure Laravel for MySQL through environment variables.
- Use a local database named `sidha` by default.
- Run the starter migrations against MySQL and confirm their success.
- Do not add business tables or seed business data.

## Quality and Verification

The completed foundation must satisfy all of the following checks:

1. Laravel reports version 13.x and boots successfully.
2. MySQL migrations complete successfully on a clean `sidha` database.
3. The complete Laravel automated test suite passes.
4. Frontend formatting or static checks supplied by the starter pass when available.
5. `npm run build` completes successfully and produces the Vite production bundle.
6. The repository contains no committed secrets, generated dependency directories, or business modules.

## Delivery

- Commit the verified foundation to the `main` branch.
- Push `main` to `aymaneelgass-dev/sidha`.
- Report the installed technologies, executed verification commands, their results, the commit identifier, and the push result.
