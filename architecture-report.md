# Architecture Report — Laravel Sanctum SPA

> Complete backend + frontend flow documentation.
> Generated: 2026-09-09

---

## 1. System Overview

```
┌──────────────────────────┐          ┌──────────────────────────┐
│      Next.js Frontend    │          │     Laravel Backend       │
│      localhost:3000      │  HTTP    │     localhost:8000        │
│                          │◄────────►│                          │
│  React 19 + RTK Query    │  CORS    │  Laravel 13 + Sanctum    │
│  Tailwind CSS v4         │  cookie  │  SQLite (sessions+data)  │
│  shadcn/ui (base-nova)   │          │  Session-based auth      │
└──────────────────────────┘          └──────────────────────────┘
```

**Auth mechanism:** Sanctum stateful SPA — session cookie (`laravel-session`), CSRF token (`XSRF-TOKEN`), NO JWT, NO localStorage tokens.

---

## 2. Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Backend framework | Laravel | 13.17 |
| PHP | PHP | 8.4.22 |
| Auth | Sanctum | 4.3.3 |
| Database | SQLite | (pdo_sqlite, sqlite3) |
| Session driver | database | (sessions table) |
| Frontend framework | Next.js (App Router) | 16.3.4 |
| UI library | React | 19.2.8 |
| State management | Redux Toolkit + RTK Query | 2.12.0 |
| CSS framework | Tailwind CSS | 4.3.3 |
| Component library | shadcn/ui (base-nova) | 4.21.0 |
| Build tool | Turbopack | (built into Next.js 16) |

---

## 3. Backend Architecture

### 3.1 Directory Structure

```
backend/app/
├── Http/
│   ├── Controllers/
│   │   ├── Controller.php
│   │   └── Api/
│   │       ├── Auth/
│   │       │   ├── RegisterController.php
│   │       │   ├── LoginController.php
│   │       │   ├── MeController.php
│   │       │   ├── LogoutController.php
│   │       │   ├── ForgotPasswordController.php
│   │       │   ├── ResetPasswordController.php
│   │       │   ├── ChangePasswordController.php
│   │       │   ├── EmailVerificationController.php
│   │       │   └── LogoutAllController.php
│   │       └── User/
│   │           └── ProfileController.php
│   └── Requests/
│       └── Api/
│           ├── Auth/
│           │   ├── RegisterRequest.php
│           │   ├── LoginRequest.php
│           │   ├── ForgotPasswordRequest.php
│           │   ├── ResetPasswordRequest.php
│           │   └── ChangePasswordRequest.php
│           └── User/
│               └── UpdateProfileRequest.php
├── Models/
│   └── User.php                    # implements MustVerifyEmail
├── Notifications/
│   ├── PasswordResetNotification.php
│   └── VerifyEmailNotification.php
└── Providers/
    └── AppServiceProvider.php       # rate limiters
```

### 3.2 API Endpoints (12 routes)

| Method | Path | Auth | Rate Limit | Description |
|---|---|---|---|---|
| `POST` | `/api/register` | None | 5/min | Create account |
| `POST` | `/api/login` | None | 5/min | Authenticate + session |
| `POST` | `/api/forgot-password` | None | 3/min | Request reset link |
| `POST` | `/api/reset-password` | None | 3/min | Consume reset token |
| `GET` | `/api/me` | `auth:sanctum` | — | Current user |
| `POST` | `/api/logout` | `auth:sanctum` | — | Invalidate session |
| `POST` | `/api/logout-all` | `auth:sanctum` | 3/min | Terminate all sessions |
| `POST` | `/api/change-password` | `auth:sanctum` | — | Change password |
| `POST` | `/api/email/verification-notification` | `auth:sanctum` | 3/min | Resend verification |
| `GET` | `/api/email/verify/{id}/{hash}` | `signed` | — | Verify email |
| `GET` | `/api/user/profile` | `auth:sanctum` | — | Get profile |
| `PATCH` | `/api/user/profile` | `auth:sanctum` | — | Update profile |

### 3.3 Auth Flow

```
GET /sanctum/csrf-cookie
        ↓
XSRF-TOKEN cookie (readable by JS)
laravel-session cookie (HttpOnly)
        ↓
POST /api/login
  X-XSRF-TOKEN header + session cookie
        ↓
Auth::login() → session()->regenerate()
        ↓
GET /api/me
  session cookie → AuthenticateSession → User
        ↓
POST /api/logout
  session()->invalidate() + regenerateToken()
```

### 3.4 Form Requests

| Request | Validation Rules |
|---|---|
| `RegisterRequest` | name required, email required+unique, password required+min:8+confirmed |
| `LoginRequest` | email required+email, password required |
| `ForgotPasswordRequest` | email required+email |
| `ResetPasswordRequest` | token required, email required+email, password required+min:8+confirmed |
| `ChangePasswordRequest` | current_password required, password required+min:8+confirmed+different |
| `UpdateProfileRequest` | name required, email required+unique (ignoring current user) |

### 3.5 Rate Limiting (AppServiceProvider)

| Limiter | Limit | By |
|---|---|---|
| `register` | 5/minute | IP |
| `login` | 5/minute | IP |
| `forgot-password` | 3/minute | IP |
| `reset-password` | 3/minute | IP |
| `verification` | 3/minute | User ID or IP |
| `logout-all` | 3/minute | User ID or IP |

### 3.6 User Model

```php
class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    #[Fillable(['name', 'email', 'password'])]
    #[Hidden(['password', 'remember_token'])]

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
```

### 3.7 Notifications

- **PasswordResetNotification** — Queueable, sends mail with reset URL pointing to frontend `/reset-password?token=...&email=...`
- **VerifyEmailNotification** — Queueable, sends mail with signed verification URL

### 3.8 Key Configuration

```ini
# .env
SESSION_DRIVER=database
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:3000
MAIL_MAILER=log
```

```php
// config/cors.php
'allowed_origins' => ['http://localhost:3000'],
'supports_credentials' => true,
```

```php
// bootstrap/app.php
$middleware->statefulApi();
// + explicit StartSession on session-needing routes
```

---

## 4. Frontend Architecture

### 4.1 Directory Structure

```
frontend/src/
├── app/
│   ├── layout.tsx                     # Root layout: fonts, Providers
│   ├── globals.css                    # oklch tokens, dark theme, shadcn
│   ├── page.tsx                       # Home (auth-aware)
│   ├── login/page.tsx                 # Uses LoginForm component
│   ├── register/page.tsx              # Uses RegisterForm component
│   ├── forgot-password/page.tsx       # Uses ForgotPasswordForm
│   ├── reset-password/page.tsx        # Uses ResetPasswordForm (Suspense-wrapped)
│   ├── verify-email/page.tsx          # Uses VerifyEmailCard
│   ├── dashboard/page.tsx             # Protected: profile + email banner
│   └── settings/
│       ├── profile/page.tsx           # Edit name/email
│       └── security/page.tsx          # Change password + logout-all
├── components/
│   ├── header.tsx                     # Sticky nav, auth-aware, settings link
│   ├── auth/
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   ├── forgot-password-form.tsx
│   │   ├── reset-password-form.tsx
│   │   ├── change-password-form.tsx
│   │   └── verify-email-card.tsx
│   └── ui/                            # shadcn/ui primitives
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── card.tsx
│       ├── alert.tsx
│       └── skeleton.tsx
├── lib/
│   ├── api.ts                         # RTK Query: 11 endpoints, CSRF handling
│   └── utils.ts                       # cn() utility
├── store.ts                           # Redux store (makeStore pattern)
└── providers.tsx                      # Redux Provider wrapper
```

### 4.2 RTK Query Endpoints

| Hook | Method | Path | Cache Behavior |
|---|---|---|---|
| `useRegisterMutation` | POST | `/api/register` | — |
| `useLoginMutation` | POST | `/api/login` | — |
| `useMeQuery` | GET | `/api/me` | provides `User` tag |
| `useLogoutMutation` | POST | `/api/logout` | invalidates `User` |
| `useLogoutAllMutation` | POST | `/api/logout-all` | invalidates `User` |
| `useForgotPasswordMutation` | POST | `/api/forgot-password` | — |
| `useResetPasswordMutation` | POST | `/api/reset-password` | — |
| `useChangePasswordMutation` | POST | `/api/change-password` | — |
| `useGetProfileQuery` | GET | `/api/user/profile` | provides `User` tag |
| `useUpdateProfileMutation` | PATCH | `/api/user/profile` | invalidates `User` |
| `useSendVerificationEmailMutation` | POST | `/api/email/verification-notification` | — |

### 4.3 CSRF Handling

```
Before mutating request:
  1. Check for XSRF-TOKEN cookie
  2. If missing → GET /sanctum/csrf-cookie
  3. Read cookie → set X-XSRF-TOKEN header
  4. Send request
  5. If 419 → re-fetch CSRF, retry once
```

### 4.4 Route Behavior

| Route | Auth | Behavior |
|---|---|---|
| `/` | `useMeQuery()` | Welcome if logged in, buttons if not |
| `/login` | None | LoginForm → redirect `/dashboard` |
| `/register` | None | RegisterForm → redirect `/login` |
| `/forgot-password` | None | ForgotPasswordForm → success message |
| `/reset-password` | URL token | ResetPasswordForm → redirect `/login` |
| `/verify-email` | None | VerifyEmailCard → resend button |
| `/dashboard` | `useMeQuery()` | Profile + email verification banner |
| `/settings/profile` | `useGetProfileQuery()` | Edit name/email |
| `/settings/security` | `useMeQuery()` | Change password + logout-all |

---

## 5. Complete Auth Lifecycle

```
                         REGISTER
                            │
                            ▼
                       Create User
                      Send Verification Email
                            │
                            ▼
                          LOGIN
                            │
                    Sanctum Session + Cookie
                            │
                           /ME
                            │
                         DASHBOARD
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
           Profile       Security       Logout
                            │
                  ┌─────────┼─────────┐
                  │                   │
                  ▼                   ▼
          Change Password        Logout All
```

Forgot-password branch:

```
 LOGIN
   │
   ▼
 Forgot Password → Enter Email → Laravel Password Broker
   │
   ▼
 Reset Email → Reset Password Page (token + email)
   │
   ▼
 Set New Password → Invalidate Old Sessions → LOGIN
```

---

## 6. Files Inventory

### Backend (19 new/modified files)

| File | Action | Purpose |
|---|---|---|
| `app/Http/Controllers/AuthController.php` | **Deleted** | Replaced by separate controllers |
| `app/Http/Controllers/Api/Auth/RegisterController.php` | Created | Registration |
| `app/Http/Controllers/Api/Auth/LoginController.php` | Created | Login + session |
| `app/Http/Controllers/Api/Auth/MeController.php` | Created | Current user |
| `app/Http/Controllers/Api/Auth/LogoutController.php` | Created | Session invalidation |
| `app/Http/Controllers/Api/Auth/ForgotPasswordController.php` | Created | Password reset request |
| `app/Http/Controllers/Api/Auth/ResetPasswordController.php` | Created | Password reset |
| `app/Http/Controllers/Api/Auth/ChangePasswordController.php` | Created | Authenticated password change |
| `app/Http/Controllers/Api/Auth/EmailVerificationController.php` | Created | Send + verify email |
| `app/Http/Controllers/Api/Auth/LogoutAllController.php` | Created | Terminate all sessions |
| `app/Http/Controllers/Api/User/ProfileController.php` | Created | Profile show + update |
| `app/Http/Requests/Api/Auth/*.php` | Created (5) | Form Requests |
| `app/Http/Requests/Api/User/UpdateProfileRequest.php` | Created | Profile validation |
| `app/Models/User.php` | Modified | Added `MustVerifyEmail` |
| `app/Notifications/PasswordResetNotification.php` | Created | Reset email |
| `app/Notifications/VerifyEmailNotification.php` | Created | Verification email |
| `app/Providers/AppServiceProvider.php` | Modified | Rate limiters |
| `routes/api.php` | Modified | 12 routes, StartSession middleware |
| `tests/Feature/AuthenticationTest.php` | Created | 26 test cases |

### Frontend (16 new/modified files)

| File | Action | Purpose |
|---|---|---|
| `src/lib/api.ts` | Modified | 11 endpoints, User type exported |
| `src/components/header.tsx` | Modified | Settings link added |
| `src/components/auth/login-form.tsx` | Created | Extracted login form |
| `src/components/auth/register-form.tsx` | Created | Extracted register form |
| `src/components/auth/forgot-password-form.tsx` | Created | Forgot password form |
| `src/components/auth/reset-password-form.tsx` | Created | Reset password form |
| `src/components/auth/change-password-form.tsx` | Created | Change password form |
| `src/components/auth/verify-email-card.tsx` | Created | Email verification card |
| `src/app/page.tsx` | Modified | Uses Header component |
| `src/app/login/page.tsx` | Modified | Uses LoginForm component |
| `src/app/register/page.tsx` | Modified | Uses RegisterForm component |
| `src/app/dashboard/page.tsx` | Modified | Email verification banner |
| `src/app/forgot-password/page.tsx` | Created | Forgot password page |
| `src/app/reset-password/page.tsx` | Created | Reset password page (Suspense) |
| `src/app/verify-email/page.tsx` | Created | Verify email page |
| `src/app/settings/profile/page.tsx` | Created | Profile edit page |
| `src/app/settings/security/page.tsx` | Created | Security settings page |

---

## 7. Security Checklist

```
✓ Sanctum session authentication
✓ HttpOnly session cookie (laravel-session)
✓ CSRF protection (XSRF-TOKEN + X-XSRF-TOKEN header)
✓ Session regeneration after login
✓ Session invalidation after logout
✓ All-sessions termination (logout-all via DB)
✓ Secure password hashing (bcrypt via hashed cast)
✓ Password reset tokens (Laravel Password Broker)
✓ Password reset expiration (60 minutes)
✓ Password reset token invalidation after use
✓ Login rate limiting (5/min per IP)
✓ Forgot-password rate limiting (3/min per IP)
✓ Email enumeration protection (generic response)
✓ Verification link signature validation (signed URL)
✓ Verification resend rate limiting (3/min)
✓ Sensitive fields hidden (password, remember_token)
✓ No JWT
✓ No localStorage authentication tokens
✓ No plaintext passwords in responses
✓ No session IDs in responses
✓ No reset tokens in responses
✓ Email re-verification required on email change
```

---

## 8. Validation Results

### `php artisan route:list --path=api`
```
12 routes — all properly namespaced under Api\Auth\ and Api\User\
```

### `php artisan test`
```
28 tests, 28 passed, 92 assertions
```

### `npm run lint`
```
0 errors, 0 warnings
```

### `npm run build`
```
10 routes compiled successfully
TypeScript: passed
```

---

## 9. Known Limitations

| Item | Status | Detail |
|---|---|---|
| Mail driver | `log` | Password reset/verification emails logged, not sent. Switch to SMTP/SES for production. |
| Logout-all test coverage | Limited | `actingAs()` in tests doesn't use session, so session invalidation can't be integration-tested this way. Works in production. |
| Email change flow | Simplified | Changing email invalidates verification. Full double-opt-in for new email is a future extension. |
| Account deletion | Not implemented | No requirement specified. Can be added as `DELETE /api/user/account`. |

---

## 10. How to Run

```bash
# Backend
cd backend
php artisan migrate
php artisan serve --port=8000

# Frontend (separate terminal)
cd frontend
npm run dev
```

Open `http://localhost:3000`. Register → Verify → Login → Dashboard → Settings.
