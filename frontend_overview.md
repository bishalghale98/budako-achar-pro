# Buda Ko Achar — Frontend Overview

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.3.4 (App Router) |
| React | 19.2.8 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + tw-animate-css |
| UI Library | shadcn/ui (base-nova style, lucide icons) |
| State Management | Redux Toolkit + RTK Query |
| Forms | react-hook-form + @hookform/resolvers |
| Validation | Zod v4 |
| HTTP Client | Axios + native fetch (base query) |
| Backend | Laravel Sanctum SPA (CSRF, XSRF-TOKEN) |

---

## Path Aliases

```
@/* -> ./src/*
```

---

## Design System

### Brand Colors (globals.css)

| Token | Value | Usage |
|-------|-------|-------|
| `--maroon` | `#7A1F1F` | Primary brand, buttons, accents |
| `--maroon-hover` | `#651919` | Button hover state |
| `--maroon-dark` | `#9E2A2B` | Dark mode primary |
| `--gold` | `#F2B705` | Accent, highlights |
| `--cream` | `#FFF3E0` | Light accent backgrounds |
| `--light-bg` | `#F8F6F2` | Body background |
| `--dark-text` | `#1A1A1A` | Primary text |
| `--muted-text` | `#64748B` | Secondary text |
| `--dark-bg` | `#120E0E` | Dark mode background |
| `--dark-surface` | `#1A1212` | Dark mode cards |
| `--dark-muted` | `#A89F91` | Dark mode muted text |

### Fonts

| Font | Variable | Usage |
|------|----------|-------|
| Inter | `--font-inter` | Body, sans-serif |
| Playfair Display | `--font-playfair` | Headings, serif |

### Dark Mode

Class-based (`.dark` on `<html>`)

---

## File Structure

```
frontend/src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, Providers, TooltipProvider)
│   ├── globals.css               # Tailwind v4 config, brand tokens
│   ├── proxy.ts                  # Routing middleware
│   │
│   ├── (public)/                 # Public storefront
│   │   ├── layout.tsx            # PublicHeader + PublicFooter
│   │   ├── page.tsx              # Homepage (SSR)
│   │   ├── products/
│   │   │   ├── page.tsx          # Product listing
│   │   │   └── [slug]/page.tsx   # Product detail (SSR)
│   │   ├── cart/page.tsx         # Shopping cart
│   │   ├── checkout/page.tsx     # Checkout
│   │   ├── order-success/        # Order confirmation
│   │   ├── about/page.tsx        # About page
│   │   ├── contact/page.tsx      # Contact page
│   │   ├── terms/page.tsx        # Terms of service
│   │   └── privacy/page.tsx      # Privacy policy
│   │
│   ├── (auth)/                   # Authentication
│   │   ├── layout.tsx            # PublicOnlyGuard wrapper
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── verify-email/page.tsx
│   │
│   ├── (protected)/              # Admin dashboard
│   │   ├── layout.tsx            # DashboardSidebar + Header + AuthGuard
│   │   └── admin/
│   │       ├── dashboard/page.tsx
│   │       └── profile/page.tsx  # Profile + Security (merged)
│   │
│   └── (customer)/               # Customer dashboard
│       ├── layout.tsx            # Sidebar nav (Dashboard, Orders, etc.)
│       └── customer/
│           ├── page.tsx          # Dashboard
│           └── loading.tsx       # Skeleton
│
├── components/
│   ├── ui/                       # shadcn primitives (11)
│   │   ├── alert.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── skeleton.tsx
│   │   ├── textarea.tsx
│   │   └── tooltip.tsx
│   │
│   ├── shared/                   # Reusable app components
│   │   ├── loading-state.tsx
│   │   ├── error-state.tsx
│   │   ├── empty-state.tsx
│   │   ├── page-header.tsx
│   │   ├── policy-content.tsx
│   │   └── app-breadcrumb.tsx
│   │
│   ├── layout/                   # App shell
│   │   ├── public-header.tsx     # Storefront header
│   │   ├── public-footer.tsx     # Storefront footer + WhatsApp FAB
│   │   ├── header.tsx
│   │   ├── dashboard-sidebar.tsx # Admin sidebar + mobile sheet
│   │   └── dashboard-header.tsx  # Admin sticky header
│   │
│   ├── home/                     # Landing page
│   │   ├── hero-section.tsx
│   │   ├── trust-section.tsx
│   │   ├── featured-products.tsx
│   │   ├── product-card.tsx
│   │   ├── brand-story.tsx
│   │   ├── why-choose-us.tsx
│   │   ├── testimonials.tsx
│   │   ├── testimonial-card.tsx
│   │   └── cta-section.tsx
│   │
│   ├── about/                    # About page
│   │   ├── about-hero-section.tsx
│   │   ├── brand-story-section.tsx
│   │   ├── timeline-section.tsx
│   │   ├── values-section.tsx
│   │   └── about-cta-section.tsx
│   │
│   ├── products/                 # Product listing
│   │   ├── product-card.tsx
│   │   ├── product-grid.tsx
│   │   ├── product-list.tsx
│   │   ├── sidebar-filters.tsx
│   │   └── search-sort-bar.tsx
│   │
│   ├── product-details/          # Product detail page
│   │   ├── product-gallery.tsx
│   │   ├── product-image.tsx
│   │   ├── thumbnail-list.tsx
│   │   ├── product-info.tsx
│   │   ├── product-rating.tsx
│   │   ├── quantity-selector.tsx
│   │   ├── add-to-cart-button.tsx
│   │   ├── buy-now-button.tsx
│   │   └── product-details-section.tsx
│   │
│   ├── cart/                     # Cart
│   │   ├── cart-item-card.tsx
│   │   └── order-summary.tsx
│   │
│   ├── checkout/                 # Checkout
│   │   ├── customer-form.tsx
│   │   ├── checkout-summary.tsx
│   │   ├── payment-method.tsx
│   │   └── payment-proof-upload.tsx
│   │
│   ├── contact/                  # Contact
│   │   ├── contact-form.tsx
│   │   ├── map-placeholder.tsx
│   │   └── store-info-card.tsx
│   │
│   └── order-success/            # Order confirmation
│       └── order-success-card.tsx
│
├── features/                     # Feature modules
│   ├── auth/
│   │   ├── auth-types.ts         # User, Role, AuthResponse
│   │   ├── auth-slice.ts         # Redux: setCredentials, logout
│   │   ├── auth-api.ts           # RTK Query: login, register, me, etc.
│   │   ├── auth-hooks.ts         # useAuth, useUser, useIsAdmin
│   │   ├── auth-utils.ts         # hasRole, safeRedirect
│   │   └── components/
│   │       ├── auth-bootstrap.tsx
│   │       ├── login-form.tsx
│   │       ├── register-form.tsx
│   │       ├── forgot-password-form.tsx
│   │       ├── reset-password-form.tsx
│   │       ├── change-password-form.tsx
│   │       ├── verify-email-card.tsx
│   │       ├── role-guard.tsx
│   │       └── logout-button.tsx
│   │
│   ├── products/
│   │   ├── product-types.ts
│   │   ├── product-api.ts
│   │   └── category-api.ts
│   │
│   ├── cart/
│   │   ├── cart-types.ts
│   │   ├── cart-api.ts
│   │   └── index.ts
│   │
│   ├── order/
│   │   ├── order-types.ts
│   │   ├── order-api.ts
│   │   └── index.ts
│   │
│   ├── admin/
│   │   └── admin-api.ts          # Admin CRUD (users, products, reviews)
│   │
│   ├── dashboard/
│   │   └── components/
│   │       └── dashboard-content.tsx
│   │
│   └── settings/
│       └── components/
│           ├── profile-content.tsx
│           └── security-content.tsx
│
├── store/
│   ├── index.ts                  # makeStore() factory
│   ├── hooks.ts                  # useAppDispatch, useAppSelector
│   └── provider.tsx              # Providers wrapper + AuthBootstrap
│
├── lib/
│   ├── utils.ts                  # cn() utility
│   ├── api/
│   │   ├── base-query.ts         # CSRF, 419 retry, 401 logout
│   │   ├── api-tags.ts           # RTK Query tag types
│   │   └── index.ts
│   └── server/
│       ├── api.ts                # Server-side fetch helper
│       └── product.ts            # SSR data fetching
│
├── hooks/
│   └── use-debounce.ts
│
└── data/                         # Static content
    ├── home.ts
    ├── products.ts
    ├── checkout.ts
    ├── contact.ts
    ├── about.ts
    ├── policies.ts
    └── order-success.ts
```

---

## Redux Store

### Slices

| Slice | Type | Purpose |
|-------|------|---------|
| `authApi` | RTK Query | Authentication endpoints |
| `productApi` | RTK Query | Public product endpoints |
| `categoryApi` | RTK Query | Categories |
| `adminApi` | RTK Query | Admin CRUD endpoints |
| `cartApi` | RTK Query | Cart operations |
| `orderApi` | RTK Query | Order placement |
| `auth` | Manual | User state + status |

### API Tags

`User`, `Product`, `Products`, `Categories`, `Reviews`, `Cart`, `AdminProducts`, `AdminVariants`, `AdminImages`, `AdminReviews`, `AdminUsers`

### Auth Flow

1. `AuthBootstrap` calls `useMeQuery()` on mount
2. Dispatches `setCredentials` if user found, `logout` if error
3. Guards: `AuthGuard`, `PublicOnlyGuard`, `RoleGuard` check `state.auth.status`
4. Base query handles CSRF via Sanctum (`/sanctum/csrf-cookie`), auto-retries on 419, dispatches `logout` on 401

---

## Routes

### Public (no auth required)

| Route | Page | Notes |
|-------|------|-------|
| `/` | Homepage | SSR, featured products |
| `/products` | Product listing | Filters, search, sort |
| `/products/[slug]` | Product detail | SSR, gallery, variants |
| `/cart` | Shopping cart | Requires auth |
| `/checkout` | Checkout | Guest checkout + auto account |
| `/order-success` | Order confirmation | BKA-XXXX order number |
| `/about` | About page | Brand story, timeline |
| `/contact` | Contact page | Form, map, store info |
| `/terms` | Terms of service | |
| `/privacy` | Privacy policy | |

### Auth (redirect if logged in)

| Route | Page |
|-------|------|
| `/login` | Login form |
| `/register` | Registration form |
| `/forgot-password` | Forgot password |
| `/reset-password` | Reset password |
| `/verify-email` | Email verification |

### Protected (admin, requires auth)

| Route | Page | Notes |
|-------|------|-------|
| `/admin/dashboard` | Admin dashboard | Welcome, stats, profile |
| `/admin/profile` | Profile + Security | Merged page |

### Customer (requires auth)

| Route | Page | Notes |
|-------|------|-------|
| `/customer` | Customer dashboard | Stats, quick actions, orders |
| `/customer/orders` | Order history | |
| `/customer/addresses` | Addresses | |
| `/customer/wishlist` | Wishlist | |

---

## Key Features

### Guest Checkout + Auto Account Creation

- Guest users can checkout without registering
- Backend auto-creates account with generated password
- Welcome notification dispatched after order (email + plaintext password)
- Payment methods: COD (confirmed), Digital/Bank (pending proof)

### Order System

- Order numbers: BKA-1001, BKA-1002 (via Counter model)
- Payment proof storage: `storage/app/private`
- Stock decrement with `lockForUpdate()`
- Cart items converted to orders

### Payment Methods

| Method | Order Status | Payment Status |
|--------|-------------|----------------|
| COD | Confirmed | Pending |
| Digital (eSewa/Khalti/QR) | Pending | Pending |
| Bank Transfer | Pending | Pending |

### Cart Invalidation

- RTK Query `onQueryStarted` dispatches `cartApi.util.invalidateTags(["Cart"])` after successful order

---

## Component Patterns

### Page Structure

```tsx
// Public page with layout
export default function Page() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Content */}
    </main>
  );
}
```

### Card Containers

```tsx
// Rounded-2xl card with border
<div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
  <div className="border-b border-slate-100 px-6 py-5">
    <h2 className="font-semibold text-slate-900">Title</h2>
  </div>
  <div className="px-6 py-5">
    {/* Content */}
  </div>
</div>
```

### Form Pattern

```tsx
// React Hook Form + Zod
const schema = z.object({ ... });
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});

<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
  <div className="space-y-2">
    <Label>Label</Label>
    <Input {...register("field")} />
    {errors.field && <p className="text-sm text-red-500">{errors.field.message}</p>}
  </div>
</form>
```

### Loading Skeletons

```tsx
// Matching the card design
<div className="space-y-6">
  <Skeleton className="h-9 w-48" />
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <Skeleton className="h-32 rounded-2xl" />
    <Skeleton className="h-32 rounded-2xl" />
  </div>
</div>
```

---

## Barrel Exports

Most component folders use `index.ts` for clean imports:

```tsx
import { CartItemCard, OrderSummary } from "@/components/cart";
import { ProfileContent, SecurityContent } from "@/features/settings/components";
```

---

## Total File Count

~100 source files across routes, components, features, store, lib, hooks, and data.
