# Project Architecture & Code Review

> This document describes the actual architecture and implementation of the existing Laravel backend and Next.js frontend. It is based on direct inspection of the repository and does not assume undocumented architecture.

**Project Name:** Laravel Sanctum SPA (Fusion Academy LMS)  
**Review Date:** 2026-09-10  
**Backend:** Laravel 13.17 (PHP 8.3+)  
**Frontend:** Next.js 16.3.4 (App Router, React 19.2.8, TypeScript)  
**Database:** SQLite (default), MySQL/PostgreSQL configs available  
**Auth:** Laravel Sanctum 4.3 (stateful SPA cookie-based)  
**State Management:** Redux Toolkit + RTK Query  
**API Communication:** Cookie-based session + CSRF token  
**Build:** Turbopack (Next.js 16 built-in), PHP 8.4  

## Executive Summary

> This is an early-stage Laravel + Next.js SPA implementing authentication and basic user management. The backend provides 12 API routes for auth flows (register, login, logout, password reset, email verification, profile). The frontend uses RTK Query for API communication with automatic CSRF handling, Redux for state, and React Hook Form + Zod for validation. The project is cleanly structured with single-action controllers, proper Form Requests, and comprehensive test coverage for auth endpoints. It has not yet reached feature-complete status for its intended LMS use case.

---

## 1. High-Level System Architecture

```
Browser (localhost:3000)
   |
   | HTTP/HTTPS
   | Credentials: cookies (laravel-session, XSRF-TOKEN)
   v
Next.js Frontend (App Router)
   |
   | RTK Query → fetchBaseQuery (credentials: "include")
   | Auto CSRF: GET /sanctum/csrf-cookie → X-XSRF-TOKEN header
   |
   | HTTP requests to localhost:8000
   v
Laravel API Backend (localhost:8000)
   |
   +--> statefulApi() middleware (Sanctum SPA auth)
   |
   +--> Controllers (single-action, invokable)
   |
   +--> Form Requests (validation)
   |
   +--> Models (Eloquent)
   |
   v
SQLite Database
   |
   +--> users, sessions, personal_access_tokens, cache, jobs
```

### Communication Flow

- **Frontend → Backend:** REST API via `fetch` with `credentials: "include"` (sends cookies cross-origin)
- **CSRF Protection:** Before mutations, frontend fetches `/sanctum/csrf-cookie`, reads `XSRF-TOKEN` cookie (JS-readable), sends as `X-XSRF-TOKEN` header
- **Session:** Laravel database session (`laravel-session` cookie, HttpOnly)
- **No JWT / No localStorage tokens:** All auth via cookies
- **CORS:** `supports_credentials: true`, allowed origin is `FRONTEND_URL`

---

## 2. Repository Structure

```
lara next/
├── backend/                    # Laravel 13 API
│   ├── app/
│   │   ├── Enums/Role.php
│   │   ├── Http/
│   │   │   ├── Controllers/Api/Auth/  (9 controllers)
│   │   │   ├── Controllers/Api/User/  (1 controller)
│   │   │   ├── Middleware/EnsureUserHasRole.php
│   │   │   └── Requests/Api/          (6 form requests)
│   │   ├── Models/User.php
│   │   ├── Notifications/     (2 notifications)
│   │   └── Providers/AppServiceProvider.php
│   ├── bootstrap/app.php
│   ├── config/                (standard Laravel configs)
│   ├── database/
│   │   ├── migrations/        (5 migration files)
│   │   ├── seeders/DatabaseSeeder.php
│   │   └── factories/UserFactory.php
│   ├── routes/api.php, web.php, console.php
│   └── tests/Feature/AuthenticationTest.php (408 lines, 26+ test cases)
├── frontend/                  # Next.js 16 App Router
│   └── src/
│       ├── app/               (layouts, pages, route groups)
│       ├── components/        (layout/, shared/, ui/)
│       ├── features/          (auth/, dashboard/, settings/)
│       ├── lib/api/           (base-query, api-tags)
│       └── store/             (Redux store, provider, hooks)
├── architecture-report.md     # Existing architecture doc
└── phases.md                  # Implementation phase checklist
```

### Backend Directory Purpose

| Directory | Purpose |
|---|---|
| `app/Enums/` | PHP 8.3+ enums (Role) |
| `app/Http/Controllers/Api/Auth/` | Single-action auth controllers |
| `app/Http/Controllers/Api/User/` | Profile controller (show/update) |
| `app/Http/Middleware/` | Custom role-check middleware |
| `app/Http/Requests/` | Form Request validation classes |
| `app/Models/` | Eloquent models (User only) |
| `app/Notifications/` | Queueable mail notifications |
| `app/Providers/` | Service providers (rate limiters) |
| `database/migrations/` | Schema definitions |
| `database/seeders/` | Default data (2 users) |
| `tests/Feature/` | Integration tests |

### Frontend Directory Purpose

| Directory | Purpose |
|---|---|
| `src/app/` | Next.js App Router pages/layouts |
| `src/app/(auth)/` | Route group: public auth pages |
| `src/app/(dashboard)/` | Route group: protected dashboard pages |
| `src/components/layout/` | Header, Sidebar, DashboardHeader |
| `src/components/shared/` | PageHeader, LoadingState, ErrorState, EmptyState |
| `src/components/ui/` | shadcn/ui primitives (Button, Card, Input, etc.) |
| `src/features/auth/` | Auth domain: API, hooks, types, components, guards |
| `src/features/dashboard/` | Dashboard domain components |
| `src/features/settings/` | Settings domain components |
| `src/lib/api/` | RTK Query base query, tag types |
| `src/store/` | Redux store configuration, typed hooks, provider |

---

## 3. Laravel Backend Architecture

### 3.1 Application Flow

```
Route (routes/api.php)
   ↓
Middleware (StartSession, auth:sanctum, role:admin, throttle)
   ↓
Form Request (validation + authorize)
   ↓
Controller (invokable __invoke method)
   ↓
Eloquent Model
   ↓
Database (SQLite)
   ↓
JsonResponse (manual array, no API Resources)
```

### 3.2 Routes

**Public Routes:**

| Method | Endpoint | Controller | Middleware | Purpose |
|---|---|---|---|---|
| `POST` | `/api/register` | `RegisterController` | `throttle:register` | Create account |
| `POST` | `/api/login` | `LoginController` | `StartSession, throttle:login` | Authenticate |
| `POST` | `/api/forgot-password` | `ForgotPasswordController` | `throttle:forgot-password` | Request reset link |
| `POST` | `/api/reset-password` | `ResetPasswordController` | `throttle:reset-password` | Consume reset token |
| `GET` | `/api/email/verify/{id}/{hash}` | `EmailVerificationController@verify` | `signed` | Verify email |

**Authenticated Routes (`auth:sanctum`):**

| Method | Endpoint | Controller | Extra Middleware | Purpose |
|---|---|---|---|---|
| `GET` | `/api/me` | `MeController` | — | Current user |
| `POST` | `/api/logout` | `LogoutController` | `StartSession` | Invalidate session |
| `POST` | `/api/logout-all` | `LogoutAllController` | `StartSession, throttle:logout-all` | Terminate all sessions |
| `POST` | `/api/change-password` | `ChangePasswordController` | `StartSession` | Change password |
| `POST` | `/api/email/verification-notification` | `EmailVerificationController@send` | `throttle:verification` | Resend verification |
| `GET` | `/api/user/profile` | `ProfileController@show` | — | Get profile |
| `PATCH` | `/api/user/profile` | `ProfileController@update` | — | Update profile |

**Admin Routes (`auth:sanctum` + `role:admin`):**

| Method | Endpoint | Handler | Middleware | Purpose |
|---|---|---|---|---|
| `GET` | `/api/admin/users` | Inline closure | `auth:sanctum, role:admin` | List all users |

### 3.3 Controllers

All auth controllers are **single-action (invokable)** using `__invoke`. Business logic is minimal and lives directly in controllers. No service layer or repository pattern exists.

- **RegisterController** — Creates user, sends verification email, returns user fields
- **LoginController** — Validates credentials via `Hash::check`, calls `Auth::login()`, regenerates session
- **LogoutController** — Invalidates session, regenerates CSRF token
- **LogoutAllController** — Deletes all user sessions from DB, invalidates current session
- **MeController** — Returns authenticated user fields
- **ForgotPasswordController** — Creates reset token, generates frontend reset URL, dispatches notification
- **ResetPasswordController** — Uses `Password::reset()`, returns success/failure
- **ChangePasswordController** — Verifies current password, updates, regenerates session
- **EmailVerificationController** — `send()` dispatches verification; `verify()` validates signed URL hash
- **ProfileController** — `show()` returns user profile; `update()` handles email change (re-verifies)

### 3.4 Models

**User Model** (`backend/app/Models/User.php`):

- Table: `users`
- Traits: `HasApiTokens`, `HasFactory`, `Notifiable`
- Implements: `MustVerifyEmail`
- Fillable: `name`, `email`, `password`, `role` (via `#[Fillable]` attribute)
- Hidden: `password`, `remember_token` (via `#[Hidden]` attribute)
- Casts: `email_verified_at` → datetime, `password` → hashed, `role` → `Role` enum
- Methods: `isAdmin()`, `isCustomer()`
- Relationships: **NONE defined** (no hasMany, belongsTo, etc.)

**Role Enum** (`backend/app/Enums/Role.php`):

- `Customer = 'customer'`
- `Admin = 'admin'`

### 3.5 Form Requests

| Request | Rules |
|---|---|
| `RegisterRequest` | name: required, string, max:255; email: required, email, max:255, unique:users; password: required, min:8, confirmed |
| `LoginRequest` | email: required, email; password: required |
| `ForgotPasswordRequest` | email: required, email |
| `ResetPasswordRequest` | token: required; email: required, email; password: required, min:8, confirmed |
| `ChangePasswordRequest` | current_password: required; password: required, min:8, confirmed, different:current_password |
| `UpdateProfileRequest` | name: required, max:255; email: required, email, unique:users,email,{userId} |

All `authorize()` methods return `true`. Authorization is handled by middleware, not form requests.

### 3.6 API Responses

All responses use manual arrays with consistent envelope:

```json
{
  "success": true,
  "message": "Login successful.",
  "user": { "id": 1, "name": "...", "email": "...", "role": "customer", "email_verified_at": "..." }
}
```

No API Resources or Transformers are used. User data is returned via `$user->only(...)` or `$user->only('id', 'name', 'email', 'role', 'email_verified_at')`.

### 3.7 Middleware

| Middleware | Alias | Purpose |
|---|---|---|
| `EnsureUserHasRole` | `role` | Checks user role against variadic Role enum args |
| Sanctum `statefulApi` | — | SPA cookie authentication for `api/*` |
| `StartSession` | — | Explicitly started on routes that need session |
| `throttle:{name}` | — | Rate limiting per IP or user ID |
| `signed` | — | URL signature verification |

### 3.8 Rate Limiting

| Limiter | Limit | Key |
|---|---|---|
| `register` | 5/min | IP |
| `login` | 5/min | IP |
| `forgot-password` | 3/min | IP |
| `reset-password` | 3/min | IP |
| `verification` | 3/min | User ID or IP |
| `logout-all` | 3/min | User ID or IP |

### 3.9 Notifications

- **PasswordResetNotification** — `ShouldQueue`, sends mail with frontend reset URL
- **VerifyEmailNotification** — `ShouldQueue`, sends mail with signed verification URL (60min expiry)

---

## 4. Database Architecture

### Tables

**`users`:**
| Column | Type | Notes |
|---|---|---|
| `id` | bigIncrements | PK |
| `name` | string | |
| `email` | string | unique |
| `role` | string | default `'customer'` |
| `email_verified_at` | timestamp | nullable |
| `password` | string | hashed |
| `remember_token` | string | hidden |
| `created_at` / `updated_at` | timestamps | |

**`sessions`:**
| Column | Type | Notes |
|---|---|---|
| `id` | string | PK |
| `user_id` | foreignId | nullable, indexed |
| `ip_address` | string(45) | nullable |
| `user_agent` | text | nullable |
| `payload` | longText | |
| `last_activity` | integer | indexed |

**`personal_access_tokens`:**
| Column | Type | Notes |
|---|---|---|
| `id` | bigIncrements | PK |
| `tokenable_type` / `tokenable_id` | morphs | |
| `name` | string | |
| `token` | string(64) | unique |
| `abilities` | text | |
| `last_used_at` | timestamp | nullable |
| `expires_at` | timestamp | nullable, indexed |

**`password_reset_tokens`:**
| Column | Type | Notes |
|---|---|---|
| `email` | string | PK |
| `token` | string | |
| `created_at` | timestamp | nullable |

**`cache`, `cache_locks`, `jobs`, `job_batches`, `failed_jobs`:** Standard Laravel tables.

### Relationship Diagram

```
users (1) ----< sessions (many)           [user_id FK]
users (1) ----< personal_access_tokens    [tokenable morphs]
users (1) ----< password_reset_tokens     [email, no FK]
```

Note: No Eloquent relationships are defined on the User model. Joins are implicit via session queries in `LogoutAllController`.

---

## 5. Authentication Architecture

### 5.1 Mechanism

**Laravel Sanctum Stateful SPA Authentication:**

- Session-based (database driver)
- Cookies: `laravel-session` (HttpOnly), `XSRF-TOKEN` (JS-readable)
- No JWT, no localStorage tokens
- CSRF protection via `X-XSRF-TOKEN` header

### 5.2 Registration Flow

```
Browser → POST /api/register (throttle:register)
   ↓
RegisterRequest validates: name, email (unique), password (min:8, confirmed)
   ↓
User::create() — password auto-hashed via 'hashed' cast
   ↓
Sends email verification notification (ShouldQueue)
   ↓
Response: 201 { success, message, user }
```

### 5.3 Login Flow

```
Browser → GET /sanctum/csrf-cookie (sets XSRF-TOKEN + laravel-session)
   ↓
Browser → POST /api/login (X-XSRF-TOKEN header + session cookie)
   ↓
LoginRequest validates: email, password
   ↓
User::where('email') → Hash::check()
   ↓
Auth::login($user) → session()->regenerate()
   ↓
Response: 200 { success, message, user }
```

### 5.4 Get Current User Flow

```
Browser → GET /api/me (session cookie)
   ↓
auth:sanctum middleware → AuthenticateSession → User from session
   ↓
Response: 200 { success, user }
```

### 5.5 Logout Flow

```
Browser → POST /api/logout (session cookie)
   ↓
session()->invalidate() → session()->regenerateToken()
   ↓
Response: 200 { success, message }
```

### 5.6 Logout All Sessions Flow

```
Browser → POST /api/logout-all (session cookie)
   ↓
DB::table('sessions')->where('user_id', $id)->delete()
   ↓
session()->invalidate() → session()->regenerateToken()
   ↓
Response: 200 { success, message }
```

### 5.7 Password Reset Flow

```
Browser → POST /api/forgot-password
   ↓
Password::createToken($user) → generates token
   ↓
Reset URL: FRONTEND_URL/reset-password?token=...&email=...
   ↓
PasswordResetNotification sent (ShouldQueue)
   ↓
Response: 200 { success, message } (generic, no email enumeration)
   ↓
Browser → POST /api/reset-password (token, email, password, password_confirmation)
   ↓
Password::reset() → updates password, fires PasswordReset event
   ↓
Response: 200 { success, message }
```

### 5.8 Email Verification Flow

```
Browser → POST /api/email/verification-notification
   ↓
Sends VerifyEmailNotification with signed URL (60min expiry)
   ↓
User clicks link → GET /api/email/verify/{id}/{hash} (signed)
   ↓
hash_equals(sha1(email), $hash) → markEmailAsVerified()
   ↓
Response: 200 { success, message }
```

### 5.9 Authentication Failure

- **401:** Returned by `auth:sanctum` middleware when no valid session
- **403:** Returned by `EnsureUserHasRole` middleware when role doesn't match
- **422:** Validation errors from Form Requests (standard Laravel format)
- **419:** CSRF token expired (handled by frontend with auto-retry)

---

## 6. Authorization / Roles / Permissions

### Roles

| Role | Backend Protection | Frontend Protection |
|---|---|---|
| `admin` | `role:admin` middleware on `/api/admin/users` | `useIsAdmin()` hook, `RoleGuard` component |
| `customer` | Default role on registration | `useHasRole('customer')` hook |

### Authorization Mechanisms

- **Backend:** `EnsureUserHasRole` middleware (checks against `Role` enum)
- **Frontend:** `AuthGuard`, `PublicOnlyGuard`, `RoleGuard` components (client-side only)

### Findings

- Only one admin-protected route exists (`GET /api/admin/users`)
- The admin route uses an inline closure, not a controller
- Role comparison in `EnsureUserHasRole` uses `in_array()` with Role enum
- Frontend type definition includes `TEACHER` and `STUDENT` roles that don't exist in backend `Role` enum
- No Policies or Gates are implemented

---

## 7. API Architecture

### API Prefix & Versioning

- Prefix: `/api` (no versioning)
- All routes defined in `routes/api.php`

### Response Envelope

```json
{
  "success": true,
  "message": "optional message",
  "data": {},
  "errors": {}
}
```

Note: `data` wrapper is NOT used. Top-level fields are returned directly. `errors` follows Laravel's standard validation format.

### Status Codes

| Code | Usage |
|---|---|
| 200 | Success |
| 201 | Registration success |
| 401 | Unauthenticated |
| 403 | Forbidden (role check) |
| 404 | Invalid verification link |
| 422 | Validation errors |
| 429 | Rate limited |

### Validation Error Format

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email has already been taken."]
  }
}
```

---

## 8. Next.js Frontend Architecture

### 8.1 Configuration

- **Next.js:** 16.3.4 (App Router)
- **React:** 19.2.8
- **TypeScript:** ^5 (strict mode)
- **Tailwind CSS:** v4 (CSS-first config, no `tailwind.config.ts`)
- **shadcn/ui:** base-nova style (uses `@base-ui/react`, NOT Radix)
- **Build:** Turbopack (built into Next.js 16)

### 8.2 Route Structure

| Route | Page | Layout | Auth Guard | Purpose |
|---|---|---|---|---|
| `/` | `page.tsx` | Root | None | Home (auth-aware) |
| `/login` | `login/page.tsx` | Auth | `PublicOnlyGuard` | Login form |
| `/register` | `register/page.tsx` | Auth | `PublicOnlyGuard` | Registration form |
| `/forgot-password` | `forgot-password/page.tsx` | Auth | `PublicOnlyGuard` | Request reset |
| `/reset-password` | `reset-password/page.tsx` | Auth | `PublicOnlyGuard` | Reset password (token in URL) |
| `/dashboard` | `dashboard/page.tsx` | Dashboard | `DashboardGuard` | User profile + verification |
| `/settings/profile` | `settings/profile/page.tsx` | Dashboard | `DashboardGuard` | Edit name/email |
| `/settings/security` | `settings/security/page.tsx` | Dashboard | `DashboardGuard` | Change password + logout all |

### 8.3 Layout Hierarchy

```
Root Layout (fonts, Providers wrapper)
   |
   ├── (auth) layout → PublicOnlyGuard + Header + centered main
   |
   └── (dashboard) layout → DashboardGuard + DashboardSidebar + DashboardHeader + main
```

### 8.4 Server vs Client Components

- All pages are **client components** (`"use client"`)
- No server-side data fetching
- No `getServerSideProps` or `getStaticProps`
- Root layout and page shells are server components (default in App Router)
- All actual content is rendered client-side

### 8.5 No Middleware

- No `middleware.ts` file exists
- `src/proxy.ts` exists but is documentation-only, not wired as middleware
- All route protection is client-side via guard components

---

## 9. Frontend State Management

### Redux Store

```typescript
{
  authApi: RTK Query cache reducer,
  auth: AuthState { user, status }
}
```

### Auth Slice

```typescript
interface AuthState {
  user: User | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
}
```

Reducers: `setCredentials`, `setUser`, `setStatus`, `logout`

### RTK Query API

**Base URL:** `NEXT_PUBLIC_API_URL` (default `http://localhost:8000`)

**Base Query:** Custom `baseQueryWithCsrf` that:
1. Auto-fetches `/sanctum/csrf-cookie` before mutations if no XSRF token
2. Retries once on 419 (CSRF expired) after re-fetching csrf-cookie
3. Dispatches `logout()` on 401 responses
4. Uses `credentials: "include"` for cookie-based auth

**11 Endpoints:**

| Endpoint | Type | Method | URL | Cache Tags |
|---|---|---|---|---|
| `register` | mutation | POST | `/api/register` | — |
| `login` | mutation | POST | `/api/login` | — |
| `me` | query | GET | `/api/me` | provides: `["User"]` |
| `logout` | mutation | POST | `/api/logout` | invalidates: `["User"]` |
| `logoutAll` | mutation | POST | `/api/logout-all` | invalidates: `["User"]` |
| `forgotPassword` | mutation | POST | `/api/forgot-password` | — |
| `resetPassword` | mutation | POST | `/api/reset-password` | — |
| `changePassword` | mutation | POST | `/api/change-password` | — |
| `getProfile` | query | GET | `/api/user/profile` | provides: `["User"]` |
| `updateProfile` | mutation | PATCH | `/api/user/profile` | invalidates: `["User"]` |
| `sendVerificationEmail` | mutation | POST | `/api/email/verification-notification` | — |

**Side Effects:**
- `login` → `onQueryStarted`: dispatches `setCredentials` with user
- `logout` / `logoutAll` → `onQueryStarted`: dispatches `logoutAction` in `finally` block

### Auth Bootstrap

`AuthBootstrap` component (rendered inside Redux Provider):
- Calls `useMeQuery()` on every page load
- On success: dispatches `setCredentials` with user
- On error (after loading): dispatches `logout()`
- Uses `didLogout` ref to prevent re-setting credentials after explicit logout

---

## 10. Frontend Authentication Flow

### Auth Guard Components

| Guard | Behavior |
|---|---|
| `AuthGuard` | Redirects to `/login` if unauthenticated. Renders nothing while loading. |
| `PublicOnlyGuard` | Redirects to role home if authenticated. Renders nothing while authenticated. |
| `RoleGuard` | Redirects to role home if authenticated but not in allowed roles. |

### Role Home Mapping

```typescript
{ ADMIN: "/dashboard/admin", TEACHER: "/dashboard/teacher", STUDENT: "/dashboard" }
```

### Token Storage

- **httpOnly cookies:** `laravel-session` (session), `XSRF-TOKEN` (CSRF, JS-readable)
- **localStorage:** NOT used for auth tokens
- **sessionStorage:** NOT used for auth tokens
- **Redux:** Stores user object and auth status (derived from API responses, not tokens)

### Security Implications

- No tokens in localStorage = XSS-resistant auth storage
- CSRF handled via Sanctum's double-submit cookie pattern
- Session regeneration on login/password change prevents session fixation

---

## 11. Component Architecture

### UI Components (`src/components/ui/`)

| Component | Base | Notes |
|---|---|---|
| `Button` | `@base-ui/react/button` + CVA | 6 variants, 8 sizes |
| `Card` | Native div | Sub-components: Header, Title, Description, Action, Content, Footer |
| `Input` | `@base-ui/react/input` | Built-in password toggle |
| `Label` | Native label | Client component |
| `Alert` | Native div + CVA | 2 variants (default, destructive) |
| `Skeleton` | Native div | Pulse animation |
| `Sheet` | `@base-ui/react/dialog` | Full dialog-based sheet (4 sides) |
| `Separator` | `@base-ui/react/separator` | Horizontal/vertical |

### Layout Components (`src/components/layout/`)

| Component | Description |
|---|---|
| `Header` | Public sticky header (desktop nav + mobile Sheet hamburger) |
| `DashboardHeader` | Dashboard sticky header (mobile trigger + user name + logout) |
| `DashboardSidebar` | Fixed left sidebar (256px desktop, Sheet on mobile) |

### Shared Components (`src/components/shared/`)

| Component | Description |
|---|---|
| `PageHeader` | Page title + description + action slot |
| `LoadingState` | Skeleton loading placeholder |
| `ErrorState` | Error display with optional action link |
| `EmptyState` | Empty content with optional CTA |

### Feature Components

**Auth (`src/features/auth/components/`):**
- `LoginForm`, `RegisterForm`, `ForgotPasswordForm`, `ResetPasswordForm`, `ChangePasswordForm`
- `LogoutButton`, `VerifyEmailCard`
- `AuthGuard`, `PublicOnlyGuard`, `RoleGuard`
- `AuthBootstrap`

**Dashboard (`src/features/dashboard/components/`):**
- `DashboardContent` — Profile info, email verification banner, sign-out

**Settings (`src/features/settings/components/`):**
- `ProfileContent` — Edit name/email
- `SecurityContent` — Change password + logout all sessions

### Auth Hooks (`src/features/auth/auth-hooks.ts`)

| Hook | Returns |
|---|---|
| `useAuth()` | `{ user, status }` |
| `useUser()` | `User \| null` |
| `useRole()` | `Role \| undefined` |
| `useIsAuthenticated()` | `boolean` |
| `useIsLoading()` | `boolean` |
| `useHasRole(role)` | `boolean` |
| `useHasAnyRole(roles)` | `boolean` |
| `useIsAdmin()` | `boolean` |

---

## 12. Forms & Validation

### Frontend Validation

- **Library:** React Hook Form + Zod v4
- **Resolver:** `@hookform/resolvers/zod`
- **Pattern:** Zod schema → `zodResolver(schema)` → React Hook Form

### Form Flow

```
Frontend validation (Zod schema)
   ↓
API request (RTK Query mutation)
   ↓
Laravel validation (Form Request)
   ↓
Validation error response (422)
   ↓
Frontend error mapping (useEffect maps server errors to form fields)
```

### Forms

| Form | Fields | Zod Validation |
|---|---|---|
| `LoginForm` | email, password | email required, password required |
| `RegisterForm` | name, email, password, password_confirmation | name max:255, email, password min:8, confirmed |
| `ForgotPasswordForm` | email | email required |
| `ResetPasswordForm` | email, password, password_confirmation | email, password min:8, confirmed |
| `ChangePasswordForm` | current_password, password, password_confirmation | current required, password min:8, confirmed |
| `ProfileContent` | name, email | name required, email format |

All forms show loading/disabled states during submission. Server errors are mapped to field errors via `useEffect` watching `error?.data?.errors`.

---

## 13. Error Handling

### Backend

- **Validation:** Laravel standard 422 response with `errors` object
- **Authentication:** 401 via `auth:sanctum` middleware
- **Authorization:** 403 via `EnsureUserHasRole` middleware
- **404:** Invalid verification links
- **Exceptions:** JSON rendering for `api/*` requests (configured in `bootstrap/app.php`)

### Frontend

- **API errors:** RTK Query `error` state with `error.data.errors` mapping
- **Network errors:** RTK Query automatic handling
- **401:** Auto-logout via `baseQueryWithCsrf` → dispatches `logout()`
- **419:** Auto-retry after CSRF cookie re-fetch
- **Loading states:** Skeleton components via `LoadingState`
- **Error states:** `ErrorState` component with optional action links
- **No error boundaries:** No `error.tsx` or `not-found.tsx` files exist

---

## 14. Security Review

### Findings

#### 1. Sanctum Session Authentication (Implemented)

**Severity:** Informational  
**Status:** Implemented  
**Evidence:** `bootstrap/app.php` configures `statefulApi()`, `config/sanctum.php` uses `web` guard, session driver is database.  
**Impact:** Proper session-based auth with HttpOnly cookies.  
**Recommendation:** No action needed.

#### 2. CSRF Protection (Implemented)

**Severity:** Informational  
**Status:** Implemented  
**Evidence:** Frontend `baseQueryWithCsrf` auto-fetches `/sanctum/csrf-cookie` and sends `X-XSRF-TOKEN` header. 419 retry logic exists.  
**Impact:** CSRF attacks prevented.  
**Recommendation:** No action needed.

#### 3. Password Hashing (Implemented)

**Severity:** Informational  
**Status:** Implemented  
**Evidence:** User model casts `password` → `hashed`. bcrypt used.  
**Impact:** Passwords stored securely.  
**Recommendation:** No action needed.

#### 4. Rate Limiting (Implemented)

**Severity:** Informational  
**Status:** Implemented  
**Evidence:** `AppServiceProvider` defines rate limiters for register (5/min), login (5/min), forgot-password (3/min), reset-password (3/min), verification (3/min), logout-all (3/min).  
**Impact:** Brute force attacks mitigated.  
**Recommendation:** No action needed.

#### 5. Email Enumeration Protection (Implemented)

**Severity:** Informational  
**Status:** Implemented  
**Evidence:** `ForgotPasswordController` returns generic message regardless of email existence.  
**Impact:** Attackers cannot enumerate valid email addresses.  
**Recommendation:** No action needed.

#### 6. Session Regeneration (Implemented)

**Severity:** Informational  
**Status:** Implemented  
**Evidence:** `LoginController` calls `session()->regenerate()` after successful auth. `ChangePasswordController` also regenerates.  
**Impact:** Session fixation attacks prevented.  
**Recommendation:** No action needed.

#### 7. Admin Route Uses Inline Closure (Potential Issue)

**Severity:** Low  
**Status:** Potential issue  
**Evidence:** `GET /api/admin/users` in `routes/api.php` uses an inline closure instead of a controller.  
**Impact:** Inconsistent with single-action controller pattern used elsewhere. Harder to test.  
**Recommendation:** Move to a dedicated `Admin\UserController` for consistency.

#### 8. Frontend Roles Don't Match Backend Roles (Inconsistency)

**Severity:** Medium  
**Status:** Inconsistency  
**Evidence:** Frontend `auth-types.ts` defines `Role = "ADMIN" | "TEACHER" | "STUDENT" | string`. Backend `Role` enum has only `Customer` and `Admin`. The frontend `auth-utils.ts` uses case-insensitive comparison which bridges the gap.  
**Impact:** Type mismatch could cause confusion. `TEACHER` and `STUDENT` roles are undefined in backend.  
**Recommendation:** Align frontend Role type with backend Role enum.

#### 9. No Server-Side Route Protection (Potential Issue)

**Severity:** Medium  
**Status:** Potential issue  
**Evidence:** No `middleware.ts` in frontend. All route protection is client-side via React components.  
**Impact:** Protected pages are accessible via direct URL navigation before JavaScript loads. Content flashes briefly.  
**Recommendation:** Consider adding Next.js middleware for server-side auth checks.

#### 10. No Error Boundaries (Missing)

**Severity:** Low  
**Status:** Missing  
**Evidence:** No `error.tsx` or `not-found.tsx` files in any route segment.  
**Impact:** Unhandled errors show default Next.js error page.  
**Recommendation:** Add `error.tsx` and `not-found.tsx` for graceful error handling.

#### 11. User Model Has No Relationships (Potential Issue)

**Severity:** Low  
**Status:** Potential issue  
**Evidence:** `User` model defines zero Eloquent relationships. `LogoutAllController` uses raw `DB::table('sessions')` query.  
**Impact:** Future features requiring relationships (orders, courses, etc.) will need retroactive addition.  
**Recommendation:** Define relationships as the domain model grows.

#### 12. `role` Column Added After `email` (Informational)

**Severity:** Informational  
**Status:** Implemented  
**Evidence:** Migration `2026_09_10_000000_add_role_to_users_table.php` adds `role` after `email` column.  
**Impact:** Works correctly. Schema is clean.  
**Recommendation:** No action needed.

#### 13. No `not-found.tsx` Route (Missing)

**Severity:** Low  
**Status:** Missing  
**Evidence:** No `not-found.tsx` files exist in the frontend.  
**Impact:** 404 routes show default Next.js page.  
**Recommendation:** Add `not-found.tsx` for user-friendly 404 pages.

#### 14. Sanctum Token Expiration Set to Null (Informational)

**Severity:** Informational  
**Status:** Implemented  
**Evidence:** `config/sanctum.php` sets `expiration` to `null` (tokens never expire).  
**Impact:** Personal access tokens don't expire (SPA session is used instead).  
**Recommendation:** Appropriate for SPA auth. No action needed.

#### 15. Session Lifetime 120 Minutes (Informational)

**Severity:** Informational  
**Status:** Implemented  
**Evidence:** `config/session.php` sets `lifetime` to `120`.  
**Impact:** Sessions expire after 2 hours of inactivity.  
**Recommendation:** Appropriate for most use cases.

---

## 15. Data Flow — Authentication

```
┌─────────┐     ┌──────────┐     ┌──────────────┐     ┌──────────┐     ┌──────────┐
│ Browser  │────>│ Next.js  │────>│ Laravel API  │────>│ Session  │────>│ Database │
│          │<────│ Frontend │<────│              │<────│ Handler  │<────│          │
└─────────┘     └──────────┘     └──────────────┘     └──────────┘     └──────────┘
```

### Registration

```
1. User fills RegisterForm (Zod validation)
2. POST /api/register
3. RegisterRequest validates (name, email unique, password min:8 confirmed)
4. User::create() — password auto-hashed
5. Email verification notification queued
6. Response: 201 → redirect to /login
```

### Login

```
1. User fills LoginForm (Zod validation)
2. GET /sanctum/csrf-cookie → sets XSRF-TOKEN + laravel-session
3. POST /api/login (X-XSRF-TOKEN header + session cookie)
4. LoginRequest validates (email, password)
5. User::where('email') → Hash::check()
6. Auth::login() → session()->regenerate()
7. Response: 200 → Redux setCredentials → redirect to role home
```

### Auth Bootstrap (Every Page Load)

```
1. AuthBootstrap component renders inside Redux Provider
2. useMeQuery() → GET /api/me (session cookie)
3. auth:sanctum middleware → session → User
4. Response: 200 → dispatch setCredentials → Redux state updated
5. Guards (AuthGuard, PublicOnlyGuard) check Redux state → redirect if needed
```

### Logout

```
1. User clicks LogoutButton
2. POST /api/logout (session cookie)
3. session()->invalidate() + regenerateToken()
4. Response: 200 → dispatch logoutAction → redirect to /login
```

### CRUD Flow (Representative — Profile Update)

```
1. ProfileContent renders → useGetProfileQuery() → GET /api/user/profile
2. User edits name/email fields
3. Submit → useUpdateProfileMutation() → PATCH /api/user/profile
4. UpdateProfileRequest validates (name required, email unique ignoring self)
5. ProfileController@update → User::update()
6. Response: 200 → RTK Query invalidates ["User"] tag → refetch profile
```

---

## 16. File Upload / Storage

No file upload functionality exists in the codebase. The `FILESYSTEM_DISK=local` configuration is present but unused.

---

## 17. Third-Party Services

| Service | Purpose | Backend/Frontend | Configuration | Failure Handling |
|---|---|---|---|---|
| Laravel Mail | Password reset + email verification | Backend | `MAIL_MAILER=log` | Emails logged, not sent |

No payment providers, OAuth providers, analytics, external APIs, queues, or notifications services are configured.

---

## 18. Testing Architecture

### Backend Tests

| Test File | Framework | Coverage | Status |
|---|---|---|---|
| `tests/Feature/AuthenticationTest.php` | PHPUnit + Laravel | 26+ test cases: registration, login, me, logout, change password, forgot password, reset password, logout all, profile, email verification, unauthenticated | All passing |
| `tests/Feature/ExampleTest.php` | PHPUnit | GET / returns 200 | Passing |
| `tests/Unit/ExampleTest.php` | PHPUnit | assertTrue | Passing |

**Test results:** 28 tests, 28 passed, 92 assertions.

### Frontend Tests

No frontend tests exist. No test framework is configured in `package.json`.

### E2E Tests

No E2E tests exist.

---

## 19. Code Quality Review

### Strengths

- **Clean controller pattern:** Single-action invokable controllers keep methods focused
- **Form Request validation:** Dedicated validation classes separate concerns
- **Consistent response format:** All responses use `{ success, message, user }` envelope
- **CSRF handling:** Automatic CSRF cookie fetch with 419 retry is robust
- **Rate limiting:** All sensitive endpoints have appropriate rate limits
- **Session security:** Regeneration on login/password change prevents fixation
- **Email enumeration protection:** Generic responses on password reset
- **Feature-based frontend organization:** Clear domain separation (auth/, dashboard/, settings/)
- **Comprehensive auth test suite:** 26+ test cases covering all auth flows

### Weaknesses

- **No API Resources:** User data returned via `$user->only()` — no transformation layer
- **No service layer:** Business logic in controllers (acceptable at current scale)
- **No Eloquent relationships:** User model has zero relationships defined
- **No frontend tests:** Zero test coverage on frontend
- **No error boundaries:** No `error.tsx` or `not-found.tsx` files
- **No server-side route protection:** All auth guards are client-side
- **Inline admin route:** `GET /api/admin/users` uses closure instead of controller
- **Role type mismatch:** Frontend defines roles not in backend enum

### Technical Debt

- Frontend `auth-types.ts` `Role` type includes `TEACHER` and `STUDENT` not in backend
- `src/proxy.ts` exists as documentation but is not wired as middleware
- No `loading.tsx` files for route-level loading states
- `architecture-report.md` references file structure that has since been refactored (e.g., `src/lib/api.ts` → `src/lib/api/base-query.ts`)

---

## 20. Performance Review

### Backend

- **N+1 queries:** Not applicable — no relationships to eager load
- **Pagination:** Not implemented — `User::all()` in admin route (fine for small datasets)
- **Caching:** Database cache driver configured but no explicit caching logic
- **Query efficiency:** Minimal queries per request — each controller makes 1-2 queries

### Frontend

- **Client-side rendering:** All pages are client components — initial load downloads JS bundle before rendering
- **No SSR data fetching:** No `getServerSideProps` — first paint is blank, then JavaScript hydrates
- **RTK Query caching:** Automatic deduplication and caching via tag-based invalidation
- **Bundle size:** Minimal dependencies — no heavy libraries beyond Redux and React Hook Form

---

## 21. Architectural Consistency

| Area | Pattern | Consistency | Notes |
|---|---|---|---|
| Controllers | Single-action invokable | Consistent | All auth controllers follow pattern |
| Validation | Form Request classes | Consistent | All endpoints use dedicated requests |
| Responses | Manual array envelope | Consistent | `{ success, message, user }` format |
| Auth | Sanctum session cookie | Consistent | All protected routes use `auth:sanctum` |
| Rate limiting | Named limiters | Consistent | All sensitive endpoints rate-limited |
| Frontend API | RTK Query | Consistent | All 11 endpoints use RTK Query |
| Frontend forms | React Hook Form + Zod | Consistent | All forms use same pattern |
| Frontend guards | Guard components | Consistent | AuthGuard/PublicOnlyGuard/RoleGuard |
| Component organization | Feature-based | Consistent | `features/{domain}/components/` |

---

## 22. Dependency Review

### Backend (`composer.json`)

| Dependency | Version | Purpose | Critical? |
|---|---|---|---|
| `laravel/framework` | ^13.17 | Core framework | Yes |
| `laravel/sanctum` | ^4.3 | SPA authentication | Yes |
| `laravel/tinker` | ^3.0 | REPL | No |
| `phpunit/phpunit` | ^12.5.12 | Testing | Dev only |
| `laravel/pint` | ^1.27 | Code style | Dev only |

### Frontend (`package.json`)

| Dependency | Version | Purpose | Critical? |
|---|---|---|---|
| `next` | 16.3.4 | Framework | Yes |
| `react` / `react-dom` | 19.2.8 | UI library | Yes |
| `@reduxjs/toolkit` | ^2.12.0 | State management | Yes |
| `react-redux` | ^9.3.0 | React-Redux bindings | Yes |
| `react-hook-form` | ^7.87.0 | Form management | Yes |
| `zod` | ^4.6.1 | Schema validation | Yes |
| `@hookform/resolvers` | ^5.9.1 | Zod-React Hook Form bridge | Yes |
| `shadcn` | ^4.21.0 | Component CLI | No |
| `@base-ui/react` | ^1.8.0 | Base UI primitives | Yes (shadcn base-nova) |
| `class-variance-authority` | ^0.7.1 | Component variants | Yes |
| `cn` | ^0.2.6 | className merge | Yes |
| `lucide-react` | ^1.43.0 | Icons | Yes |
| `tw-animate-css` | ^1.4.0 | Tailwind animations | No |

---

## 23. Environment & Configuration

### Backend `.env.example` Variables

```
APP_NAME=Laravel
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
DB_CONNECTION=sqlite
SESSION_DRIVER=database
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:3000
QUEUE_CONNECTION=database
CACHE_STORE=database
BROADCAST_CONNECTION=log
MAIL_MAILER=log
FILESYSTEM_DISK=local
```

### Frontend `.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Key Configuration Files

| File | Purpose |
|---|---|
| `config/sanctum.php` | Stateful domains, guard, token expiration |
| `config/cors.php` | Allowed origins, credentials support |
| `config/session.php` | Driver (database), lifetime (120min), same-site (lax) |
| `config/database.php` | SQLite default, MySQL/PostgreSQL available |
| `bootstrap/app.php` | Middleware registration, routing, exception handling |

---

## 24. Deployment Architecture

No deployment configuration exists. No Docker, CI/CD, or hosting configuration files were found.

**Expected deployment (based on `.env.example`):**

```
Frontend: localhost:3000 (Next.js dev server)
Backend: localhost:8000 (Laravel dev server)
Database: SQLite file
```

---

## 25. Complete Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER                                   │
│  cookies: laravel-session (HttpOnly), XSRF-TOKEN (JS-readable)  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP (credentials: include)
                           v
┌─────────────────────────────────────────────────────────────────┐
│                   NEXT.JS FRONTEND (localhost:3000)              │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  App Router   │  │  Redux Store  │  │  RTK Query API       │  │
│  │  (Pages)      │  │  (auth slice) │  │  (11 endpoints)      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                 │                      │               │
│  ┌──────┴───────┐  ┌──────┴───────┐  ┌──────────┴───────────┐  │
│  │  Guards       │  │  AuthBootstrap│  │  baseQueryWithCsrf   │  │
│  │  (client)     │  │  (useMeQuery) │  │  (CSRF + 419 retry) │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP requests
                           v
┌─────────────────────────────────────────────────────────────────┐
│                   LARAVEL API (localhost:8000)                    │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Routes       │  │  Middleware   │  │  Controllers         │  │
│  │  (api.php)    │  │  (Sanctum,   │  │  (single-action,     │  │
│  │  12 endpoints │  │   role,      │  │   invokable)         │  │
│  └──────────────┘  │   throttle)  │  └──────────┬───────────┘  │
│                    └──────────────┘             │               │
│                                                 v               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Form Requests│  │  Models      │  │  Notifications       │  │
│  │  (validation) │  │  (User)      │  │  (PasswordReset,     │  │
│  └──────────────┘  └──────────────┘  │   VerifyEmail)       │  │
│                                       └──────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           v
┌─────────────────────────────────────────────────────────────────┐
│                    SQLITE DATABASE                               │
│  users | sessions | personal_access_tokens | password_reset_tokens│
│  cache | cache_locks | jobs | job_batches | failed_jobs          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 26. Important Architectural Decisions

| Decision | Evidence | Reasoning |
|---|---|---|
| Sanctum SPA (cookie-based) | `bootstrap/app.php`: `statefulApi()` | Standard Laravel SPA auth pattern — no JWT complexity |
| Single-action controllers | All controllers use `__invoke` | Keeps methods focused, follows Laravel invokable pattern |
| No API Resources | Controllers use `$user->only()` | Simplicity at current scale; no transformation needs yet |
| Feature-based frontend | `src/features/auth/`, `dashboard/`, `settings/` | Domain-driven organization, scalable |
| RTK Query for API | `src/features/auth/auth-api.ts` | Automatic caching, CSRF handling, tag-based invalidation |
| Client-side auth guards | `role-guard.tsx` components | Simplicity; no middleware complexity |
| Database session driver | `SESSION_DRIVER=database` | Required for Sanctum SPA auth + logout-all functionality |
| Zod for validation | Both frontend (React Hook Form) and backend (Form Request) | Type-safe schemas, shared validation rules possible |

---

## 27. Issues & Findings

| ID | Area | Finding | Severity | Status | Evidence |
|---|---|---|---|---|---|
| 1 | Frontend Types | `Role` type includes TEACHER/STUDENT not in backend enum | Medium | Inconsistency | `auth-types.ts` vs `Role.php` |
| 2 | Frontend Auth | No server-side route protection (middleware.ts) | Medium | Potential issue | No `middleware.ts` file |
| 3 | Backend Routes | Admin endpoint uses inline closure | Low | Potential issue | `routes/api.php` |
| 4 | Frontend | No error boundaries (error.tsx, not-found.tsx) | Low | Missing | No files exist |
| 5 | Frontend | No frontend tests | Medium | Missing | No test framework in package.json |
| 6 | Backend | User model has no relationships | Low | Potential issue | `User.php` |
| 7 | Frontend | All pages are client components (no SSR) | Informational | Implemented | All pages use `"use client"` |
| 8 | Backend | No API Resources for response transformation | Low | Potential issue | Controllers use `$user->only()` |
| 9 | Frontend | `proxy.ts` is documentation, not wired middleware | Informational | Implemented | File exists but unused |
| 10 | Architecture | `architecture-report.md` references outdated file structure | Low | Technical debt | References `src/lib/api.ts` (now `src/lib/api/base-query.ts`) |

---

## 28. What Is Good

- **Clean authentication architecture:** Sanctum SPA with proper CSRF handling, session regeneration, and HttpOnly cookies
- **Consistent backend patterns:** All controllers are single-action, all validation uses Form Requests, all responses follow a consistent envelope
- **Comprehensive auth tests:** 26+ test cases covering all auth edge cases
- **Robust CSRF handling:** Automatic CSRF cookie fetch with 419 retry in RTK Query base query
- **Rate limiting on all sensitive endpoints:** Prevents brute force attacks
- **Feature-based frontend organization:** Clear domain separation that scales well
- **Proper form validation:** Zod schemas on frontend, Form Requests on backend
- **Email enumeration protection:** Generic responses on password reset
- **Session security:** Regeneration on login/password change
- **No localStorage auth tokens:** XSS-resistant token storage

---

## 29. What Should Be Improved

### Priority 1 — Medium

| Problem | Why It Matters | Affected Area | Recommendation |
|---|---|---|---|
| Frontend Role type mismatch with backend | Confusion, potential bugs when adding roles | `auth-types.ts`, `Role.php` | Align types: backend enum should be source of truth |
| No server-side route protection | Protected content visible before JS loads | Frontend auth | Add Next.js middleware for server-side checks |
| No frontend tests | Zero confidence in frontend correctness | Frontend | Add Vitest or Playwright for component/E2E tests |

### Priority 2 — Low

| Problem | Why It Matters | Affected Area | Recommendation |
|---|---|---|---|
| No error boundaries | Poor UX on unhandled errors | Frontend routing | Add `error.tsx` and `not-found.tsx` files |
| Inline admin route closure | Inconsistent with controller pattern | Backend routes | Extract to dedicated controller |
| User model has no relationships | Will need retroactive addition | Backend models | Define relationships as domain grows |
| Outdated architecture-report.md | Confuses developers | Documentation | Update to match current file structure |

### Priority 3 — Informational

| Problem | Why It Matters | Affected Area | Recommendation |
|---|---|---|---|
| No API Resources | Response transformation inconsistent | Backend responses | Add when response structure grows |
| No SSR data fetching | First paint is blank | Frontend performance | Consider server components for public pages |
| `proxy.ts` unused | Dead code | Frontend | Remove or wire as middleware |

---

## 30. Final Architecture Verdict

| Area | Rating | Notes |
|---|---|---|
| Architecture | Good | Clean separation, consistent patterns, scalable structure |
| Security | Good | Proper Sanctum SPA auth, CSRF, rate limiting, session security |
| Maintainability | Good | Feature-based organization, single-action controllers, Form Requests |
| Scalability | Fair | Works for current scale; no caching, no queues beyond notifications |
| Frontend Quality | Good | Clean component architecture, RTK Query, consistent patterns |
| Backend Quality | Good | Minimal but correct; no over-engineering |
| Testing | Fair | Backend well-tested; frontend has zero tests |

**Final Verdict:** This is a well-architected early-stage project. The authentication system is solid and follows Laravel best practices. The frontend is cleanly organized with proper state management. The main gaps are frontend testing, server-side route protection, and role type alignment. The project is not production-ready due to missing features (it's an LMS with only auth implemented) but the foundation is strong.

---

*Document generated from direct repository inspection. All findings are based on actual source code.*
