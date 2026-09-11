# Admin Dashboard Layout & Design

## Overview

The admin dashboard uses a **sidebar + header + main content** layout pattern, common in admin panels. It's built with Next.js App Router under `(protected)/admin/` routes.

---

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                    DashboardHeader                       │
│  [≡ Mobile Menu]                    [User Name]         │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ Sidebar  │              Main Content                    │
│  (w-64)  │              (max-w-5xl)                     │
│          │                                              │
│ ┌──────┐ │  ┌─────────────────────────────────────────┐ │
│ │ Logo │ │  │  PageHeader: "Dashboard"                │ │
│ ├──────┤ │  ├─────────────────────────────────────────┤ │
│ │      │ │  │                                         │ │
│ │ Nav  │ │  │  [Email Verification Banner]            │ │
│ │      │ │  │  (if unverified)                        │ │
│ │ • Dash│ │  │                                         │ │
│ │ • Prof│ │  ├─────────────────────────────────────────┤ │
│ │      │ │  │  Profile Section                        │ │
│ ├──────┤ │  │  ┌───────────────────────────────────┐  │ │
│ │ User │ │  │  │  Name:        [value]             │  │ │
│ │ Info │ │  │  │  ─────────────────────────────── │  │ │
│ │ +    │ │  │  │  Email:       [value]             │  │ │
│ │ Role │ │  │  │  ─────────────────────────────── │  │ │
│ │ +    │ │  │  │  Verified:    [Yes/No]            │  │ │
│ │Logout│ │  │  └───────────────────────────────────┘  │ │
│ └──────┘ │  │                                         │ │
│          │  ├─────────────────────────────────────────┤ │
│          │  │  Session Section                        │ │
│          │  │  ┌───────────────────────────────────┐  │ │
│          │  │  │  [Sign out] button (destructive)  │  │ │
│          │  │  └───────────────────────────────────┘  │ │
│          │  └─────────────────────────────────────────┘ │
└──────────┴──────────────────────────────────────────────┘
```

---

## Components

### 1. DashboardSidebar (`components/layout/dashboard-sidebar.tsx`)

**Desktop:** Fixed left sidebar (`w-64`, `lg:fixed`)
**Mobile:** Hidden, triggered via Sheet (slide-out drawer)

| Section | Content |
|---------|---------|
| **Logo** | `wordmark.png` image, h-7 |
| **Navigation** | Vertical nav links |
| **User** | Avatar (initials), name, email, role badge, logout button |

**Navigation Items:**
```typescript
const sidebarNav = [
  { title: "Dashboard", href: "/admin/dashboard" },
  { title: "Profile", href: "/admin/profile" },
];
```

**Active State:** `bg-maroon/10 text-maroon font-semibold`
**Inactive State:** `text-sidebar-foreground/70 hover:bg-sidebar-accent/50`

**User Section:**
- Avatar: `h-9 w-9 rounded-full bg-maroon/10 text-xs font-bold text-maroon`
- Role badge: `bg-gold/15 text-maroon text-[11px] font-bold capitalize`
- Logout: `text-red-500 hover:bg-red-500/10`

---

### 2. DashboardHeader (`components/layout/dashboard-header.tsx`)

Sticky top header (`h-14`, `z-40`)

| Left | Right |
|------|-------|
| Mobile sidebar trigger (≡) | User name (hidden on mobile) |

**Styling:**
- `border-b border-border`
- `bg-white/95 backdrop-blur`
- `dark:bg-dark-surface/95`

---

### 3. DashboardContent (`features/dashboard/components/dashboard-content.tsx`)

**Container:** `mx-auto w-full max-w-5xl`

#### Email Verification Banner (conditional)
```
┌─────────────────────────────────────────────────────┐
│ ⚠ Please verify your email address.    [Verify]    │
└─────────────────────────────────────────────────────┘
```
- `border-yellow-300 bg-yellow-50`
- Button: `variant="outline"`

#### Profile Section
```
┌─────────────────────────────────────────────────────┐
│ Profile                                             │
│ ─────────────────────────────────────────────────── │
│ Name              │ John Doe                        │
│ ─────────────────────────────────────────────────── │
│ Email             │ john@example.com                │
│ ─────────────────────────────────────────────────── │
│ Verified          │ Yes                             │
└─────────────────────────────────────────────────────┘
```

- Card: `rounded-lg border bg-background p-4 sm:border-border sm:bg-card`
- Header: `text-sm font-medium text-muted-foreground`
- Row: `flex justify-between text-sm`
- Label: `text-muted-foreground`
- Value: `font-medium`
- Separator between rows

#### Session Section
```
┌─────────────────────────────────────────────────────┐
│ Session                                             │
│ ─────────────────────────────────────────────────── │
│ [Sign out] (destructive button)                     │
└─────────────────────────────────────────────────────┘
```

---

## Color Tokens

| Token | Usage |
|-------|-------|
| `bg-background` / `bg-card` | Card backgrounds |
| `border-border` / `border-slate-100` | Borders |
| `text-muted-foreground` | Labels, secondary text |
| `text-maroon` / `bg-maroon/10` | Active nav, brand accent |
| `bg-gold/15` | Role badge background |
| `text-red-500` | Destructive actions |

---

## Typography

| Element | Classes |
|---------|---------|
| Page title | `PageHeader` component |
| Section header | `text-sm font-medium text-muted-foreground` |
| Data label | `text-sm text-muted-foreground` |
| Data value | `text-sm font-medium` |
| Nav item | `text-sm font-medium` |
| User name | `text-sm font-medium` |
| User email | `text-xs text-sidebar-foreground/50` |

---

## Responsive Behavior

| Breakpoint | Sidebar | Header |
|------------|---------|--------|
| `< lg` | Hidden (Sheet drawer) | Shows mobile menu trigger |
| `≥ lg` | Fixed left (`w-64`) | Shows user name |

**Main content:** Always `px-4 py-6 sm:px-6 sm:py-8`

---

## Routing

```
/admin/dashboard    → DashboardContent
/admin/profile      → ProfileContent + SecurityContent (merged)
/admin/security     → Redirects to /admin/profile
```

---

## Skeleton Loading

```tsx
<div className="space-y-4">
  <Skeleton className="mb-6 h-7 w-32" />  {/* Page title */}
  <Skeleton className="h-20" />            {/* Profile card */}
  <Skeleton className="h-20" />            {/* Session card */}
</div>
```

---

## File Structure

```
frontend/src/
├── app/(protected)/
│   ├── layout.tsx                    # DashboardGuard + Sidebar + Header
│   └── admin/
│       ├── dashboard/page.tsx        # → DashboardContent
│       ├── profile/page.tsx          # → ProfileContent + SecurityContent
│       └── security/page.tsx         # → Redirects to /admin/profile
├── components/layout/
│   ├── dashboard-sidebar.tsx         # Sidebar + MobileSidebarTrigger
│   └── dashboard-header.tsx          # Sticky header
└── features/dashboard/components/
    └── dashboard-content.tsx         # Main dashboard content
```
