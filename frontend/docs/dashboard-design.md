# Dashboard Design Specification

## 1. Overview

**Project:** Fusion Academy — Learning Management System (LMS)
**Framework:** Next.js 16.3.4 (App Router)
**UI Library:** shadcn/ui (base-nova style) + Radix primitives via @base-ui/react
**Styling:** Tailwind CSS v4 with CSS variables
**Icons:** Lucide React
**State Management:** Redux Toolkit (RTK Query)
**Forms:** React Hook Form + Zod validation
**Toasts:** Sonner
**Rich Text:** Tiptap editor
**Dark Mode:** next-themes (class-based, system default)

---

## 2. Dashboard Routes

### Route Groups

Dashboard routes are wrapped in a `(dashboard)` route group using Next.js App Router parenthesized folders:

```text
src/app/(dashboard)/
├── layout.tsx              — wraps all dashboard pages in DashboardShell
├── dashboard-shell.tsx     — shell: SidebarProvider + Sidebar + Header + Main
└── dashboard/
    ├── page.tsx            — role-based redirect (ADMIN→/admin, TEACHER→/teacher, STUDENT→/student)
    ├── admin/
    │   ├── page.tsx        — Admin overview
    │   ├── users/page.tsx
    │   ├── teachers/page.tsx
    │   ├── categories/page.tsx
    │   ├── courses/
    │   │   ├── page.tsx
    │   │   ├── create/page.tsx
    │   │   └── [courseId]/page.tsx
    │   ├── enrollments/
    │   │   ├── page.tsx
    │   │   └── [enrollmentId]/page.tsx
    │   └── payment-management/
    │       ├── page.tsx
    │       └── [paymentId]/page.tsx
    ├── teacher/
    │   ├── page.tsx        — Teacher profile
    │   └── courses/
    │       ├── page.tsx
    │       ├── create/page.tsx
    │       └── [courseId]/page.tsx
    └── student/
        ├── page.tsx        — Student welcome
        ├── my-course/
        │   ├── page.tsx
        │   └── [enrollmentId]/page.tsx
        └── payments/page.tsx
```

### Role-Based Navigation Config

Navigation items are defined per-role in `features/dashboard/dashboard-config.ts`:

**ADMIN sidebar:**
- Dashboard (LayoutDashboardIcon) → `/dashboard/admin`
- Management section:
  - Users (UsersIcon) → `/dashboard/admin/users`
  - Teachers (UserPlusIcon) → `/dashboard/admin/teachers`
  - Categories (FolderTreeIcon) → `/dashboard/admin/categories`
  - Courses (BookOpenIcon) → `/dashboard/admin/courses`
  - Payment Management (CreditCardIcon) → `/dashboard/admin/payment-management`
  - Enrollments (UserPlusIcon) → `/dashboard/admin/enrollments`

**TEACHER sidebar:**
- Dashboard (LayoutDashboardIcon) → `/dashboard/teacher`
- Content section:
  - My Courses (BookOpenIcon) → `/dashboard/teacher/courses`

**STUDENT sidebar:**
- Dashboard (LayoutDashboardIcon) → `/dashboard/student`
- My Courses (BookOpenIcon) → `/dashboard/student/my-course`
- Payments (CreditCardIcon) → `/dashboard/student/payments`

---

## 3. Global Layout

### Overall Architecture

```text
┌──────────────────────────────────────────────────────────────┐
│                        SIDEBAR                               │
│                    (fixed, collapsible)                       │
├──────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐  │
│  │                     HEADER                             │  │
│  │              (sticky top, flex row)                    │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │                                                        │  │
│  │                   MAIN CONTENT                         │  │
│  │              (flex-1, scrollable)                      │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### Implementation

```tsx
// DashboardShell (src/app/(dashboard)/dashboard-shell.tsx)
<SidebarProvider>
  <DashboardSidebar />
  <SidebarInset>
    <DashboardHeader />
    <main className="flex-1 px-0 py-4 sm:p-4 sm:p-6">
      {children}
    </main>
  </SidebarInset>
</SidebarProvider>
```

### Layout Dimensions

| Element | Desktop | Mobile |
|---------|---------|--------|
| Sidebar width (expanded) | 16rem (256px) | 18rem (288px) as Sheet |
| Sidebar width (collapsed/icon) | 3rem (48px) | N/A (Sheet overlay) |
| Header height | Auto (content-driven, ~48px) | Auto |
| Main content padding | `px-0 py-4 sm:p-4 sm:p-6` | `px-0 py-4` |
| Sidebar rail width | 4px (w-16/4 = w-4) | Hidden |
| Full viewport | `min-h-svh` on wrapper | Same |

### SidebarProvider CSS Variables

```css
--sidebar-width: 16rem;
--sidebar-width-icon: 3rem;
```

### SidebarInset Behavior

- `relative flex w-full flex-1 flex-col bg-background min-w-0`
- On desktop with `variant=inset`: `md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm`
- Current variant: default (not inset)

---

## 4. Sidebar

### Structure

```text
Sidebar (collapsible="icon")
├── SidebarHeader
│   └── Brand Logo + Name
├── SidebarContent
│   └── Navigation Groups (role-based)
│       ├── SidebarGroup
│       │   ├── SidebarGroupLabel (section title, optional)
│       │   └── SidebarGroupContent
│       │       └── SidebarMenu
│       │           └── SidebarMenuItem
│       │               └── SidebarMenuButton (with icon + text)
│       └── ... more groups
├── SidebarFooter
│   └── UserMenu (dropdown)
└── SidebarRail (resize handle)
```

### Brand Section

- **Logo:** 8×8 (size-8) square, rounded-lg, `bg-brand text-brand-foreground`
- **Logo content:** Letter "F" in `font-semibold`
- **Brand text:** "Fusion" (normal) + " Academy" (in `text-brand`)
- **Typography:** `font-semibold`
- **Layout:** Flex row, `gap-2`, items center

### Navigation Items

**SidebarMenuButton states:**

| Property | Value |
|----------|-------|
| Default size | `h-8 text-sm` |
| Small size | `h-7 text-xs` |
| Large size | `h-12 text-sm` |
| Padding | `p-2` |
| Border radius | `rounded-md` |
| Icon size | `size-4` |
| Gap (icon to text) | `gap-2` |
| Hover | `hover:bg-sidebar-accent hover:text-sidebar-accent-foreground` |
| Active | `data-active:bg-brand data-active:font-medium data-active:text-brand-foreground` |
| Focus | `focus-visible:ring-2 focus-visible:ring-ring` |
| Collapsed state | `group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!` |
| Text truncation | `[&>span:last-child]:truncate` |

**SidebarGroupLabel:**
- Height: `h-8`
- Padding: `px-2`
- Font: `text-xs font-medium`
- Color: `text-sidebar-foreground/70`
- Collapsed: `-mt-8 opacity-0` (hidden)

### User Menu (Sidebar Footer)

- Trigger: `SidebarMenuButton size="lg"`
- Avatar: 8×8 rounded-lg, with fallback initials
- Name: `font-medium`, truncated
- Role: `text-xs text-muted-foreground`, truncated
- Chevron: `ChevronsUpDown` icon, `ml-auto size-4`
- Dropdown: `side="top" align="start"`, min-width 56, rounded-lg
- Dropdown header: Avatar (8×8, rounded-md) + name + email
- Sign out: Destructive variant, `LogOutIcon`

### Mobile Behavior

- On screens < 768px (`MOBILE_BREAKPOINT = 768`): sidebar becomes a Sheet overlay
- Sheet width: 18rem (288px)
- Sheet side: left (default)
- Triggered by `SidebarTrigger` button in header
- Sheet has backdrop blur: `backdrop-blur-xs`

### SidebarRail

- Width: `w-4` (16px)
- Position: Absolute, inset-y-0
- On desktop: visible on hover, shows resize handle
- Transform: `-translate-x-1/2` (left sidebar)
- Background line: `after:w-0.5 after:bg-sidebar-border`

---

## 5. Header

### Structure

```text
Header (flex row)
├── SidebarTrigger (hamburger icon button)
├── Separator (vertical, h-4)
└── Title (h1, text-sm font-medium)
```

### Implementation

```tsx
<header className="flex items-center gap-2 bg-background px-0 py-2 sm:border-b sm:px-4">
  <SidebarTrigger />
  <Separator orientation="vertical" className="mr-2 h-4" />
  <h1 className="text-sm font-medium">{title}</h1>
</header>
```

### Properties

| Property | Desktop | Mobile |
|----------|---------|--------|
| Display | flex | flex |
| Align items | center | center |
| Gap | 2 (8px) | 2 (8px) |
| Background | bg-background | bg-background |
| Padding | `px-4 py-2` | `px-0 py-2` |
| Border bottom | `sm:border-b` | None |
| Separator | Visible (`mr-2 h-4`) | Visible |

### Title Logic

Title is derived from the current pathname:
- `/dashboard/admin` → "Dashboard"
- `/dashboard/teacher` → "Teacher Dashboard"
- `/dashboard/student` → "Student Dashboard"
- `/dashboard/admin/users` → "Users"
- `/dashboard/admin/teachers` → "Teachers"
- `/dashboard/admin/categories` → "Categories"
- `/dashboard/admin/courses` → "Courses"
- Fallback: "Dashboard"

### SidebarTrigger

- Component: `Button variant="ghost" size="icon-sm"`
- Icon: `PanelLeftIcon` from Lucide
- Size: 28×28 (size-7 from icon-sm)
- Keyboard shortcut: Ctrl/Cmd + B

---

## 6. Main Content

### Page Container

Main content is the `<main>` element inside `SidebarInset`:

```html
<main class="flex-1 px-0 py-4 sm:p-4 sm:p-6">
  <!-- Page content -->
</main>
```

### Standard Page Pattern

```text
Main Content
│
├── PageHeader
│   ├── Title (text-2xl font-bold tracking-tight)
│   ├── Description (text-sm text-muted-foreground)
│   └── Actions (flex items-center gap-2)
│
├── Content Section
│   ├── Grid layouts
│   ├── Cards
│   ├── Tables
│   └── Forms
```

### Common Wrapper Classes

Most pages use `space-y-6` as the vertical spacing wrapper:

```html
<div class="space-y-6">
  <PageHeader />
  <!-- Content -->
</div>
```

---

## 7. Page Headers

### Component: `PageHeader`

```html
<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <div>
    <h1 class="text-2xl font-bold tracking-tight">{title}</h1>
    <p class="mt-1 text-sm text-muted-foreground">{description}</p>
  </div>
  <div class="flex items-center gap-2">{actions}</div>
</div>
```

### Properties

| Element | Desktop | Mobile |
|---------|---------|--------|
| Container | `flex-row items-center justify-between` | `flex-col gap-4` |
| Title | `text-2xl font-bold tracking-tight` | Same |
| Description | `mt-1 text-sm text-muted-foreground` | Same |
| Actions | `flex items-center gap-2` | Same |

---

## 8. Cards

### Component: `Card`

```html
<div class="group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10">
```

### Card Variants

**Default card:**
- Background: `bg-card`
- Border: `ring-1 ring-foreground/10`
- Radius: `rounded-xl`
- Padding (vertical): `--card-spacing: --spacing(4)` (16px)
- Padding (horizontal): `px-(--card-spacing)` on CardContent

**Small card (`size="sm"`):**
- Padding: `--card-spacing: --spacing(3)` (12px)

### Card Sub-components

| Component | Styling |
|-----------|---------|
| CardHeader | `grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing)` |
| CardTitle | `font-heading text-base leading-snug font-medium` (small: `text-sm`) |
| CardDescription | `text-sm text-muted-foreground` |
| CardAction | `col-start-2 row-span-2 row-start-1 self-start justify-self-end` |
| CardContent | `px-(--card-spacing)` |
| CardFooter | `flex items-center rounded-b-xl border-t bg-muted/50 p-(--card-spacing)` |

### Quick Action Cards (Admin Dashboard)

```html
<a class="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted">
  <Icon class="size-5 text-muted-foreground" />
  <div>
    <p class="font-medium">Title</p>
    <p class="text-sm text-muted-foreground">Description</p>
  </div>
</a>
```

- Border: `border` (default border color)
- Padding: `p-4`
- Radius: `rounded-lg`
- Hover: `hover:bg-muted`
- Transition: `transition-colors`

### Student Course Card

```html
<button class="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card text-left transition-all duration-200 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-black/5">
```

- Radius: `rounded-2xl` (larger than standard card)
- Border: `border-border/50` (softer)
- Hover: lift (`-translate-y-1`) + brand border + shadow
- Thumbnail: aspect-video, `object-cover`
- Content: `p-5`, gap-3
- Title: `text-lg font-bold leading-snug tracking-tight`, hover → `text-brand`
- Description: `text-sm leading-relaxed text-muted-foreground`, line-clamp-2
- Progress bar: `h-1.5 rounded-full bg-muted`, fill: `bg-brand`
- Teacher section: border-t, avatar (size-8 rounded-full), name text-sm font-medium

### Detail Info Cards (Enrollment/Payment detail)

Used for displaying detail information:

```html
<Card>
  <CardHeader>
    <CardTitle className="text-base">Section Title</CardTitle>
  </CardHeader>
  <CardContent>
    <dl class="divide-y divide-border/40">
      <div class="flex items-start justify-between gap-4 py-2.5">
        <dt class="text-sm text-muted-foreground shrink-0 pt-px">Label</dt>
        <dd class="text-sm font-medium text-right break-all">Value</dd>
      </div>
    </dl>
  </CardContent>
</Card>
```

---

## 9. Tables

### Component: `DataTable`

A reusable data table wrapper that handles loading, empty, and responsive states.

### Table Structure

```html
<div class="relative w-full overflow-x-auto">
  <table class="w-full caption-bottom text-sm">
    <thead class="[&_tr]:border-b">
      <tr>
        <th class="h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground">
          Header
        </th>
      </tr>
    </thead>
    <tbody class="[&_tr:last-child]:border-0">
      <tr class="border-b transition-colors hover:bg-muted/50">
        <td class="p-2 align-middle whitespace-nowrap">Cell</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Table Properties

| Property | Value |
|----------|-------|
| Container | `relative w-full overflow-x-auto` |
| Table width | `w-full` |
| Text size | `text-sm` |
| Header row border | `[&_tr]:border-b` |
| Header cell height | `h-10` |
| Header cell padding | `px-2` |
| Header font | `font-medium` |
| Header color | `text-foreground` |
| Body row border | `border-b` |
| Last row border | `[&_tr:last-child]:border-0` |
| Row hover | `hover:bg-muted/50` |
| Row transition | `transition-colors` |
| Selected row | `data-[state=selected]:bg-muted` |
| Cell padding | `p-2` |
| Cell alignment | `align-middle whitespace-nowrap` |
| Footer | `border-t bg-muted/50 font-medium` |

### Responsive Table Behavior

On mobile (< 640px), tables with `renderMobileCard` switch to card-based layout:

```html
<div class="grid gap-3 sm:hidden">
  <!-- Mobile cards -->
</div>
<div class="hidden sm:block">
  <!-- Desktop table -->
</div>
```

**Mobile card pattern:**

```html
<div class="rounded-lg border border-border/60 bg-card p-4 space-y-2">
  <div class="flex items-center justify-between">
    <span class="font-medium">Name</span>
    <Badge variant="...">Status</Badge>
  </div>
  <p class="text-sm text-muted-foreground truncate">Details</p>
  <div class="flex items-center justify-between pt-1">
    <span class="text-xs text-muted-foreground">Date</span>
    <!-- Actions -->
  </div>
</div>
```

---

## 10. Forms

### Standard Form Pattern

```html
<form class="flex w-full flex-col gap-4">
  <div class="flex flex-col gap-1.5">
    <Label for="...">Label</Label>
    <Input id="..." aria-invalid={Boolean(error)} />
    <p class="text-sm text-destructive" role="alert">Error message</p>
  </div>
  <Button type="submit" disabled={isLoading}>Submit</Button>
</form>
```

### Form Layout Patterns

**Single column (default):** Most forms

**Two-column grid:** Course form, teacher profile
```html
<div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
  <!-- Main content -->
  <!-- Sidebar panel -->
</div>
```

**Two-column admin pages:**
```html
<div class="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
  <!-- Data table -->
  <!-- Create form -->
</div>
```

### Input Styling

```html
<input class="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30" />
```

### Textarea Styling

```html
<textarea class="flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30" />
```

### Label Styling

```html
<label class="flex items-center gap-2 text-sm leading-none font-medium select-none">
```

### Error States

- Input: `aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20`
- Error text: `text-sm text-destructive` with `role="alert"`

### Course Form Sidebar (Sticky Panel)

```html
<div class="space-y-6 lg:sticky lg:top-6 lg:self-start">
  <div class="rounded-lg border border-border/50 bg-background p-4 sm:p-5">
    <div class="space-y-5">
      <!-- Sidebar panels (Publish, Category, Thumbnail, Teacher) -->
    </div>
  </div>
</div>
```

---

## 11. Buttons

### Button Variants

| Variant | Styling |
|---------|---------|
| **default** | `bg-primary text-primary-foreground hover:bg-[color-mix(in_oklch,var(--primary),black_12%)]` |
| **info** | `bg-info text-info-foreground hover:bg-[color-mix(in_oklch,var(--info),black_12%)]` |
| **outline** | `border-border bg-background hover:bg-muted hover:text-foreground dark:border-input dark:bg-input/30` |
| **secondary** | `bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]` |
| **ghost** | `hover:bg-muted hover:text-foreground dark:hover:bg-muted/50` |
| **destructive** | `bg-destructive/10 text-destructive hover:bg-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30` |
| **link** | `text-primary underline-offset-4 hover:underline` |

### Button Sizes

| Size | Height | Padding | Notes |
|------|--------|---------|-------|
| `default` | `h-8` | `px-2.5 gap-1.5` | |
| `xs` | `h-6` | `px-2 gap-1 text-xs` | radius: `min(var(--radius-md),10px)` |
| `sm` | `h-7` | `px-2.5 gap-1 text-[0.8rem]` | radius: `min(var(--radius-md),12px)` |
| `lg` | `h-9` | `px-2.5 gap-1.5` | |
| `icon` | `size-8` | — | 32×32 |
| `icon-xs` | `size-6` | — | 24×24, radius: `min(var(--radius-md),10px)` |
| `icon-sm` | `size-7` | — | 28×28, radius: `min(var(--radius-md),12px)` |
| `icon-lg` | `size-9` | — | 36×36 |

### Common Button Styles

- All buttons: `inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-all outline-none select-none`
- Focus: `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`
- Active: `active:translate-y-px` (except popup buttons)
- Disabled: `disabled:pointer-events-none disabled:opacity-50`
- Invalid: `aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20`
- SVG default size: `[&_svg:not([class*='size-'])]:size-4`

---

## 12. Typography

### Font Families

```css
--font-geist-sans: Geist (variable font, sans-serif)
--font-geist-mono: Geist Mono (variable font, monospace)
--font-sans: var(--font-geist-sans)
--font-mono: var(--font-geist-mono)
--font-heading: var(--font-sans)
```

### Common Typography Styles

| Element | Classes | Approximate Size |
|---------|---------|-----------------|
| Page title (h1) | `text-2xl font-bold tracking-tight` | 24px / 700 weight |
| Section title (h2) | `text-sm font-medium text-muted-foreground` | 14px / 500 weight |
| Card title | `font-heading text-base leading-snug font-medium` | 16px / 500 weight |
| Dialog title | `font-heading text-base leading-none font-medium` | 16px / 500 weight |
| Body text | `text-sm` | 14px |
| Small text | `text-xs` | 12px |
| Input text | `text-base md:text-sm` | 16px mobile / 14px desktop |
| Button text | `text-sm font-medium` | 14px / 500 weight |
| Navigation text | `text-sm` (default) / `text-xs` (small) | 14px / 12px |
| Table header | `font-medium` | 14px / 500 weight |
| Table cell | `text-sm` | 14px |
| Label | `text-sm font-medium leading-none` | 14px / 500 weight |
| Code/slug | `text-sm font-mono` | 14px / monospace |
| Group label (sidebar) | `text-xs font-medium` | 12px / 500 weight |
| Badge | `text-xs font-medium` | 12px / 500 weight |
| Tooltip | `text-xs` | 12px |

---

## 13. Color System

### Brand Colors (Static)

```css
--color-brand-orange: #ff5500;
--color-brand-orange-hover: #e04b00;
--color-brand-blue: #1e3a8a;
--color-brand-dark-blue: #172554;
```

### Light Mode (Fusion Academy Overrides)

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#ff5500` | Fusion orange — primary action color |
| `--primary-foreground` | `#ffffff` | |
| `--secondary` | `oklch(0.95 0.025 255)` | |
| `--secondary-foreground` | `oklch(0.3 0.08 255)` | |
| `--muted` | `oklch(0.96 0.005 255)` | |
| `--muted-foreground` | `oklch(0.47 0.02 255)` | |
| `--accent` | `oklch(0.95 0.025 255)` | |
| `--accent-foreground` | `oklch(0.3 0.08 255)` | |
| `--destructive` | `oklch(0.577 0.245 27.325)` | |
| `--success` | `#10b981` | |
| `--success-foreground` | `#ffffff` | |
| `--warning` | `#f59e0b` | |
| `--warning-foreground` | `#ffffff` | |
| `--info` | `#1e3a8a` | |
| `--info-foreground` | `#ffffff` | |
| `--brand` | `#ff5500` | |
| `--brand-foreground` | `#ffffff` | |
| `--brand-hover` | `#e04b00` | |
| `--brand-soft` | `oklch(0.95 0.12 40)` | |
| `--border` | `oklch(0.9 0.015 255)` | |
| `--input` | `oklch(0.9 0.015 255)` | |
| `--ring` | `#ff5500` | |
| `--background` | `oklch(0.985 0 0)` (first override) → `oklch(1 0 0)` (second override wins) | Near-white |
| `--foreground` | `oklch(0.145 0 0)` | Near-black |
| `--card` | `oklch(1 0 0)` | White |
| `--card-foreground` | `oklch(0.145 0 0)` | Near-black |
| `--popover` | `oklch(1 0 0)` | White |
| `--popover-foreground` | `oklch(0.145 0 0)` | Near-black |

**Note:** The `globals.css` has two `:root` blocks. The second one (starting at line 161) overrides some values from the first. The effective values are from the second `:root` block.

### Sidebar Colors (Light)

| Token | Value |
|-------|-------|
| `--sidebar` | `oklch(0.985 0 0)` |
| `--sidebar-foreground` | `oklch(0.145 0 0)` |
| `--sidebar-primary` | `#1e3a8a` |
| `--sidebar-primary-foreground` | `#ffffff` |
| `--sidebar-accent` | `oklch(0.95 0.025 255)` |
| `--sidebar-accent-foreground` | `oklch(0.3 0.08 255)` |
| `--sidebar-border` | `oklch(0.9 0.015 255)` |
| `--sidebar-ring` | `#1e3a8a` |

### Dark Mode Colors

| Token | Value |
|-------|-------|
| `--background` | `#0f172a` |
| `--foreground` | `#f8fafc` |
| `--card` | `#1e293b` |
| `--card-foreground` | `#f8fafc` |
| `--popover` | `#1e293b` |
| `--popover-foreground` | `#f8fafc` |
| `--primary` | `#ff5500` |
| `--primary-foreground` | `#ffffff` |
| `--secondary` | `#334155` |
| `--secondary-foreground` | `#f8fafc` |
| `--muted` | `#243244` |
| `--muted-foreground` | `#94a3b8` |
| `--accent` | `#334155` |
| `--accent-foreground` | `#f8fafc` |
| `--destructive` | `oklch(0.704 0.191 22.216)` |
| `--success` | `#10b981` |
| `--success-foreground` | `#052e16` |
| `--warning` | `#f59e0b` |
| `--warning-foreground` | `#431407` |
| `--info` | `#2563eb` |
| `--info-foreground` | `#ffffff` |
| `--brand` | `#ff5500` |
| `--brand-foreground` | `#ffffff` |
| `--brand-hover` | `#e04b00` |
| `--brand-soft` | `oklch(0.4 0.15 40)` |
| `--border` | `oklch(1 0 0 / 12%)` |
| `--input` | `oklch(1 0 0 / 15%)` |
| `--ring` | `#ff5500` |
| `--sidebar` | `#1e293b` |
| `--sidebar-foreground` | `#f8fafc` |
| `--sidebar-primary` | `#ff5500` |
| `--sidebar-primary-foreground` | `#ffffff` |
| `--sidebar-accent` | `#334155` |
| `--sidebar-accent-foreground` | `#f8fafc` |
| `--sidebar-border` | `oklch(1 0 0 / 12%)` |
| `--sidebar-ring` | `#ff5500` |

### Chart Colors

| Token | Light | Dark |
|-------|-------|------|
| `--chart-1` | `#ff5500` | `#ff5500` |
| `--chart-2` | `#1e3a8a` | `#3b82f6` |
| `--chart-3` | `#10b981` | `#10b981` |
| `--chart-4` | `#f59e0b` | `#f59e0b` |
| `--chart-5` | `#172554` | `#1e3a8a` |

---

## 14. Spacing System

### Base Scale (Tailwind CSS default + project usage)

| Value | Pixels | Usage |
|-------|--------|-------|
| `0.5` | 2px | Minimal gaps |
| `1` | 4px | Tight gaps |
| `1.5` | 6px | Form field gaps |
| `2` | 8px | Button gaps, icon gaps, padding |
| `2.5` | 10px | Gap in detail rows |
| `3` | 12px | Card padding (sm), lesson list items |
| `4` | 16px | Standard card spacing, content padding |
| `5` | 20px | Course form sidebar padding |
| `6` | 24px | Section spacing (`space-y-6`), grid gaps |
| `8` | 32px | Dashboard overview section gap (`gap-8`) |
| `12` | 48px | Empty state padding |
| `16` | 64px | Loading/error state vertical padding |
| `20` | 80px | Welcome empty state vertical padding |

### Spacing Patterns

| Context | Value |
|---------|-------|
| Page vertical spacing | `space-y-6` (24px) |
| Dashboard overview section gap | `gap-8` (32px) |
| Card internal spacing | `--card-spacing: --spacing(4)` = 16px |
| Grid gaps | `gap-3` (12px) or `gap-6` (24px) |
| Form field gaps | `gap-1.5` (6px) between label-input-error |
| Form section gaps | `gap-4` (16px) |
| Button gaps | `gap-1` to `gap-2` (4-8px) |
| Navigation item gaps | `gap-2` (8px) |
| Sidebar group padding | `p-2` (8px) |
| Header padding | `px-4 py-2` (16px horizontal, 8px vertical) |
| Detail row padding | `py-2.5` (10px) |
| Module block padding | `px-3 py-2.5` (12px horizontal, 10px vertical) |
| Lesson list item padding | `px-2 py-1.5` (8px horizontal, 6px vertical) |

---

## 15. Border Radius

### Token System

```css
--radius: 0.625rem; /* 10px */
--radius-sm: calc(var(--radius) * 0.6);   /* 6px */
--radius-md: calc(var(--radius) * 0.8);   /* 8px */
--radius-lg: var(--radius);               /* 10px */
--radius-xl: calc(var(--radius) * 1.4);   /* 14px */
--radius-2xl: calc(var(--radius) * 1.8);  /* 18px */
--radius-3xl: calc(var(--radius) * 2.2);  /* ~22px */
--radius-4xl: calc(var(--radius) * 2.6);  /* ~26px */
```

### Component Usage

| Component | Radius |
|-----------|--------|
| Buttons (default) | `rounded-lg` (10px) |
| Buttons (xs, sm) | `rounded-[min(var(--radius-md),10px)]` or `rounded-[min(var(--radius-md),12px)]` |
| Cards | `rounded-xl` (14px) |
| Inputs | `rounded-lg` (10px) |
| Dialogs | `rounded-xl` (14px) |
| Dropdown menus | `rounded-lg` (10px) |
| Badges | `rounded-4xl` (pill/fully rounded) |
| Sidebar menu items | `rounded-md` |
| Sidebar logo | `rounded-lg` |
| Avatars | `rounded-full` (circle) or `rounded-lg` / `rounded-md` |
| Empty state icon | `rounded-xl` |
| Module blocks | `rounded-xl` |
| Quick action cards | `rounded-lg` |
| Student course card | `rounded-2xl` |
| Progress bar | `rounded-full` (pill) |
| Select dropdowns | `rounded-lg` |
| Tooltips | `rounded-md` |

---

## 16. Borders and Shadows

### Borders

| Context | Styling |
|---------|---------|
| Base border color | `--border: oklch(0.9 0.015 255)` (light) |
| Sidebar border (right) | `group-data-[side=left]:border-r group-data-[side=right]:border-l` |
| Table header | `[&_tr]:border-b` |
| Table rows | `border-b` |
| Cards | `ring-1 ring-foreground/10` |
| Input border | `border border-input` |
| Dropdown/Select | `ring-1 ring-foreground/10` |
| Dialog | `ring-1 ring-foreground/10` |
| Empty state | `border border-dashed` or `border border-dashed border-border/60` |
| Detail row divider | `divide-y divide-border/40` |
| Module block | `rounded-xl border bg-card` |
| Module lesson section | `border-t` |
| Course form sidebar panel | `rounded-lg border border-border/50` |
| Enrollment detail divider | `bg-border/40` |

### Shadows

| Context | Shadow |
|---------|--------|
| Cards | `ring-1 ring-foreground/10` (ring-based, no box-shadow) |
| Dropdowns | `shadow-md` |
| Select dropdown | `shadow-md` |
| Tooltips | No additional shadow (solid bg) |
| Dialogs | No additional shadow (ring-based) |
| Sheets | `shadow-lg` |
| Sidebar (floating/inset variant) | `shadow-sm ring-1 ring-sidebar-border` |
| SidebarInset (inset variant) | `shadow-sm` |
| Course card hover | `hover:shadow-xl hover:shadow-black/5` |
| SidebarRail hover | No shadow |

**Note:** The dashboard primarily uses `ring-1 ring-foreground/10` for card elevation rather than traditional `box-shadow`. This gives a very subtle border effect.

---

## 17. Icons

### Icon Library

**Lucide React** (`lucide-react` package)

### Default Sizes

| Context | Size | Tailwind |
|---------|------|----------|
| Navigation icons (sidebar) | 16×16 | `size-4` or `[&_svg]:size-4` |
| Button icons (default) | 16×16 | `[&_svg:not([class*='size-'])]:size-4` |
| Button icons (xs) | 12×12 | `[&_svg:not([class*='size-'])]:size-3` |
| Button icons (sm) | 14×14 | `[&_svg:not([class*='size-'])]:size-3.5` |
| Table action icons | 16×16 | `h-4 w-4` |
| Empty state icon | 48×48 | `size-12` or `h-7 w-7` (in 56×56 container) |
| Loading spinner | 16×16 | `size-4` |
| Search icon | 16×16 | `h-4 w-4` |
| Toast icons | 16×16 | `size-4` |
| User menu chevron | 16×16 | `size-4` |
| Sidebar trigger | 28×28 button with 16×16 icon | `size-7` button |
| Module block icon | 16×16 | `size-4` |
| Lesson action icons | 14×14 | `size-3.5` |

### Icon Colors

| Context | Color |
|---------|-------|
| Sidebar active | `text-brand-foreground` (on brand bg) |
| Sidebar inactive | Default foreground |
| Navigation icons | Default |
| Muted icons | `text-muted-foreground` |
| Destructive actions | `text-destructive` |
| Brand logo | `text-brand-foreground` (on brand bg) |
| Search icon | `text-muted-foreground` |
| Loading spinner | `text-brand` |
| Empty state icon | `text-brand` (on `bg-brand-soft`) |

### Common Icons

- `LayoutDashboardIcon` — Dashboard navigation
- `UsersIcon` — Users management
- `UserPlusIcon` — Teachers/Enrollments
- `FolderTreeIcon` — Categories
- `BookOpenIcon` — Courses, Student dashboard
- `CreditCardIcon` — Payments
- `PanelLeftIcon` — Sidebar toggle
- `ChevronsUpDownIcon` — User menu trigger
- `LogOutIcon` — Sign out
- `SearchIcon` — Search input
- `PencilIcon` — Edit actions
- `Trash2Icon` — Delete actions
- `EyeIcon` — View details
- `BanIcon` — Cancel actions
- `ArrowLeftIcon` — Back navigation
- `CheckCircle2Icon` — Verify/success
- `XCircleIcon` — Reject/error
- `ExternalLinkIcon` — External link
- `FolderOpenIcon` — Module
- `FolderPlusIcon` — Add module
- `ListPlusIcon` — Add lesson
- `PlayIcon` — Course play overlay
- `Loader2Icon` — Loading spinner
- `AlertCircleIcon` — Error state
- `CircleCheckIcon`, `InfoIcon`, `TriangleAlertIcon`, `OctagonXIcon` — Toast icons

---

## 18. Responsive Design

### Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | < 768px | Sidebar becomes Sheet overlay, single column layouts |
| Desktop | >= 768px | Fixed sidebar, multi-column layouts |

The `useIsMobile()` hook uses `window.innerWidth < 768` as the breakpoint.

### Sidebar Responsive Behavior

| Screen | Behavior |
|--------|----------|
| Desktop (>=768px) | Fixed left sidebar, collapsible to icon width (3rem) |
| Mobile (<768px) | Sidebar hidden, opens as Sheet (drawer) from left side |
| Mobile Sheet width | 18rem (288px) |
| Mobile trigger | `SidebarTrigger` button in header |

### Layout Changes

| Element | Desktop | Mobile |
|---------|---------|--------|
| Sidebar | Fixed, visible | Hidden, Sheet overlay |
| Header padding | `px-4` | `px-0` |
| Header border | `sm:border-b` | None |
| Main content padding | `sm:p-4 sm:p-6` | `px-0 py-4` |
| Page header | `sm:flex-row sm:items-center sm:justify-between` | `flex-col gap-4` |
| Grid layouts | Multi-column | Single column |

### Grid Responsive Patterns

**Users page:** `grid items-start gap-6 lg:grid-cols-[1fr_360px]`
- Desktop: Table + create form side by side
- Mobile: Stacked

**Categories page:** `grid items-start gap-6 lg:grid-cols-[340px_1fr]`
- Desktop: Create form + table side by side
- Mobile: Stacked

**Course form:** `grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]`
- Desktop: Main content + sticky sidebar
- Mobile: Stacked

**Teacher profile:** `grid gap-6 lg:grid-cols-2`
- Desktop: Two equal columns
- Mobile: Stacked

**Admin dashboard quick actions:** `grid gap-3 sm:grid-cols-2 lg:grid-cols-3`
- Mobile: Single column
- Tablet: 2 columns
- Desktop: 3 columns

**Student my-course grid:** `grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3`
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

**Enrollment detail:** `grid gap-6 lg:grid-cols-2`
- Desktop: Two columns
- Mobile: Stacked

**Payment detail:** `grid gap-6 lg:grid-cols-[1.1fr_0.9fr]`
- Desktop: Two columns (left wider)
- Mobile: Stacked

### Table Responsive Behavior

The `DataTable` component supports dual rendering:
- Desktop (>=640px): Standard HTML table (`hidden sm:block`)
- Mobile (<640px): Card-based layout (`grid gap-3 sm:hidden`)

---

## 19. Dark Mode / Theme

### Implementation

- Provider: `next-themes` with `ThemeProvider`
- Attribute: `class` (adds `.dark` class to `<html>`)
- Default: `system` (follows OS preference)
- Transition: Disabled on theme change (`disableTransitionOnChange`)
- Toggle: System-controlled (no manual toggle button in the dashboard)

### Activation

Dark mode activates via `.dark` class on the HTML element:

```css
.dark {
  --background: #0f172a;
  --foreground: #f8fafc;
  /* ... */
}
```

### Dark Mode Color Palette

Uses Slate palette for backgrounds:
- Background: `#0f172a` (slate-900)
- Card: `#1e293b` (slate-800)
- Secondary/Accent: `#334155` (slate-700)
- Muted: `#243244`
- Borders: `oklch(1 0 0 / 12%)` (white at 12% opacity)
- Foreground: `#f8fafc` (slate-50)

Brand orange (`#ff5500`) stays consistent in both modes.

---

## 20. UI States

### Loading States

**Page loading (route-level):** `loading.tsx` files use `<LoadingState label="..." />`

```html
<div class="flex items-center justify-center gap-2 rounded-xl border px-6 py-16 text-sm text-muted-foreground">
  <Loader2Icon class="size-4 animate-spin text-brand" />
  <span>Loading…</span>
</div>
```

**Data table loading:** `<DataTable isLoading />` renders the same `LoadingState`.

**Sidebar skeleton loading:** When nav items aren't loaded yet:
```html
<div class="flex h-8 items-center gap-2 rounded-md px-2">
  <span class="size-4 animate-pulse rounded-md bg-muted" />
  <span class="h-3.5 w-24 animate-pulse rounded bg-muted" />
</div>
```

### Empty States

```html
<div class="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-16 text-center">
  <div class="mb-2 flex size-12 items-center justify-center rounded-xl bg-brand-soft text-brand">
    {icon}
  </div>
  <h3 class="font-semibold">Title</h3>
  <p class="max-w-sm text-sm text-muted-foreground">Description</p>
  <div class="mt-4">{action}</div>
</div>
```

**Student dashboard empty state (welcome):**
```html
<div class="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/60 py-20 text-center">
  <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
    <BookOpenIcon class="h-7 w-7 text-muted-foreground" />
  </div>
  <h3 class="text-lg font-semibold">Welcome to your dashboard</h3>
  <p class="max-w-sm text-sm text-muted-foreground">Description</p>
</div>
```

**Student courses empty state:**
```html
<div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card p-12 text-center shadow-sm">
  <p class="text-base font-semibold text-foreground">No courses found</p>
  <p class="mt-1 text-sm text-muted-foreground">Description</p>
</div>
```

### Error States

```html
<div class="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-6 py-16 text-center">
  <AlertCircleIcon class="mb-2 size-8 text-destructive" />
  <h3 class="font-medium">Something went wrong</h3>
  <p class="max-w-sm text-sm text-muted-foreground">Error message</p>
  <button class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
    Try again
  </button>
</div>
```

### Success/Toast Notifications

Toast notifications via Sonner:
```html
<div class="cn-toast" style="--normal-bg: var(--popover); --normal-text: var(--popover-foreground); --normal-border: var(--border); --border-radius: var(--radius);">
  <!-- Toast content with icons -->
</div>
```

Toast icons: `CircleCheckIcon` (success), `InfoIcon` (info), `TriangleAlertIcon` (warning), `OctagonXIcon` (error), `Loader2Icon` (loading)

### Confirm Dialog (Destructive Actions)

```html
<AlertDialogContent>
  <AlertDialogHeader>
    <AlertDialogTitle>Title</AlertDialogTitle>
    <AlertDialogDescription>Description</AlertDialogDescription>
  </AlertDialogHeader>
  <!-- Optional: children (e.g., textarea for rejection reason) -->
  <AlertDialogFooter>
    <AlertDialogCancel>Cancel</AlertDialogCancel>
    <AlertDialogAction class="bg-destructive text-destructive-foreground">Confirm</AlertDialogAction>
  </AlertDialogFooter>
</AlertDialogContent>
```

---

## 21. Dialogs / Modals / Drawers

### Dialog

| Property | Value |
|----------|-------|
| Overlay | `bg-black/10 backdrop-blur-xs` |
| Position | Fixed center (`top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`) |
| Max width | `max-w-[calc(100%-2rem)]`, sm: `sm:max-w-sm` |
| Border radius | `rounded-xl` |
| Background | `bg-popover` |
| Padding | `p-4` |
| Ring | `ring-1 ring-foreground/10` |
| Animation | `data-open:fade-in-0 data-open:zoom-in-95`, `data-closed:fade-out-0 data-closed:zoom-out-95` |
| Close button | Top-right, `Button variant="ghost" size="icon-sm"`, `XIcon` |

### Dialog Header/Footer

- Header: `flex flex-col gap-2`
- Footer: `-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end`

### Sheet (Drawer)

| Property | Value |
|----------|-------|
| Overlay | `bg-black/10 backdrop-blur-xs` |
| Width (left/right) | `w-3/4 sm:max-w-sm` |
| Background | `bg-popover` |
| Animation | Slide in from side |
| Close button | Top-right, `Button variant="ghost" size="icon-sm"` |

### AlertDialog (Confirm Dialog)

Used for destructive confirmations:
- Same overlay as Dialog
- Max width: `max-w-xs`, sm: `sm:max-w-sm`
- Same styling as Dialog
- Footer has muted background: `bg-muted/50`
- Destructive action button uses `bg-destructive text-destructive-foreground`

---

## 22. Dropdowns / Menus

### DropdownMenu

| Property | Value |
|----------|-------|
| Width | `w-(--anchor-width) min-w-32` |
| Background | `bg-popover` |
| Text color | `text-popover-foreground` |
| Border radius | `rounded-lg` |
| Padding | `p-1` |
| Shadow | `shadow-md` |
| Ring | `ring-1 ring-foreground/10` |
| Item height | Auto (py-1, text-sm) |
| Item padding | `px-1.5 py-1` |
| Item radius | `rounded-md` |
| Hover | `focus:bg-accent focus:text-accent-foreground` |
| Separator | `-mx-1 my-1 h-px bg-border` |
| Animation | `data-open:fade-in-0 data-open:zoom-in-95` |

### Destructive Menu Items

```html
<MenuItem variant="destructive" class="text-destructive focus:bg-destructive/10 focus:text-destructive">
```

### User Menu Dropdown

- Width: `w-(--radix-dropdown-menu-trigger-width) min-w-56`
- Radius: `rounded-lg`
- Header section: `px-1 py-1.5` with avatar + name + email
- Content: `side="top" align="start"`

---

## 23. Notifications / Toasts

### Toast System (Sonner)

- Provider: `Toaster` from sonner, wrapped in ThemeProvider
- Theme-aware: follows `next-themes` system
- Position: Default (top-right, not customized)
- Border radius: `--border-radius: var(--radius)` = 10px
- Background: `var(--popover)`
- Text: `var(--popover-foreground)`
- Border: `var(--border)`
- Icons: Lucide icons (size-4)
  - Success: `CircleCheckIcon`
  - Info: `InfoIcon`
  - Warning: `TriangleAlertIcon`
  - Error: `OctagonXIcon`
  - Loading: `Loader2Icon` with `animate-spin`

---

## 24. Component Architecture

### Dashboard Component Hierarchy

```text
DashboardLayout (src/app/(dashboard)/layout.tsx)
│
└── DashboardShell (src/app/(dashboard)/dashboard-shell.tsx)
    │
    ├── SidebarProvider
    │
    ├── DashboardSidebar (src/features/dashboard/components/dashboard-sidebar.tsx)
    │   ├── Sidebar
    │   │   ├── SidebarHeader → BrandLogo
    │   │   ├── SidebarContent → Navigation (role-based from navConfig)
    │   │   │   ├── SidebarGroup
    │   │   │   │   ├── SidebarGroupLabel (optional section title)
    │   │   │   │   └── SidebarGroupContent
    │   │   │   │       └── SidebarMenu
    │   │   │   │           └── SidebarMenuItem
    │   │   │   │               └── SidebarMenuButton (with icon + text)
    │   │   │   └── ... more groups
    │   │   ├── SidebarFooter → UserMenu
    │   │   │   └── DropdownMenu
    │   │   │       ├── Trigger (Avatar + Name + Role + Chevron)
    │   │   │       └── Content (User info + Sign out)
    │   │   └── SidebarRail
    │
    └── SidebarInset (main area)
        ├── DashboardHeader (src/features/dashboard/components/dashboard-header.tsx)
        │   └── header
        │       ├── SidebarTrigger
        │       ├── Separator (vertical)
        │       └── Title (h1)
        │
        └── main (content area)
            └── {children} ← page content
```

### Shared Component Tree

```text
components/
├── shared/
│   ├── PageHeader          — page title + description + actions
│   ├── EmptyState          — centered empty content with icon + CTA
│   ├── ErrorState          — error display with retry
│   ├── LoadingState        — spinner + label
│   ├── ConfirmDialog       — AlertDialog wrapper for confirmations
│   └── DataTable           — responsive table with loading/empty/mobile card support
│
├── ui/                     — shadcn/ui base components
│   ├── alert-dialog.tsx
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── checkbox.tsx
│   ├── collapsible.tsx
│   ├── command.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── input.tsx
│   ├── input-group.tsx
│   ├── label.tsx
│   ├── pagination.tsx
│   ├── popover.tsx
│   ├── scroll-area.tsx
│   ├── select.tsx
│   ├── separator.tsx
│   ├── sheet.tsx
│   ├── sidebar.tsx
│   ├── skeleton.tsx
│   ├── sonner.tsx
│   ├── table.tsx
│   ├── tabs.tsx
│   ├── textarea.tsx
│   └── tooltip.tsx
│
├── editor/
│   └── rich-text-editor.tsx (Tiptap)
│
├── student/
│   ├── card.tsx            — CourseCard (enrolled course card)
│   ├── course-detail.tsx   — CoursePlayerLayout
│   └── my-course.tsx       — MyCourse grid
│
└── theme-provider.tsx      — ThemeProvider + TooltipProvider + Toaster
```

---

## 25. Page-by-Page Analysis

### Admin Dashboard Home

**Route:** `/dashboard/admin`
**Layout:** Default dashboard shell
**Page Header:** Inline (not using PageHeader component)
**Content:**
- Greeting section: Time-based greeting + user first name + subtitle
- Quick actions section: 2-column (mobile) / 3-column (desktop) grid of action cards
- Overview section: Card with EmptyState ("Analytics coming soon")

### Admin Users

**Route:** `/dashboard/admin/users`
**Layout:** `space-y-6`
**Page Header:** `<PageHeader title="Users" description="Manage user accounts and their roles." />`
**Content:**
- Two-column layout: `grid items-start gap-6 lg:grid-cols-[1fr_360px]`
  - Left: UserManagement (Card with search + DataTable + mobile cards)
  - Right: CreateUserForm (Card with form)

### Admin Teachers

**Route:** `/dashboard/admin/teachers`
**Layout:** `space-y-6`
**Page Header:** `<PageHeader title="Teachers" description="View teacher profiles and manage their roles." />`
**Content:** Single Card with DataTable + mobile cards

### Admin Categories

**Route:** `/dashboard/admin/categories`
**Layout:** `space-y-6`
**Page Header:** `<PageHeader title="Categories" description="Organize courses into a clear learning hierarchy." />`
**Content:** Two-column layout: `grid items-start gap-6 lg:grid-cols-[340px_1fr]`
- Left: CategoryAddForm
- Right: Card with CategoryTable (hierarchical flattened table)

### Admin Courses

**Route:** `/dashboard/admin/courses`
**Layout:** `space-y-6`
**Page Header:** With "Create Course" button
**Content:** Card with CourseManagement (DataTable + mobile cards)

### Admin Course Create

**Route:** `/dashboard/admin/courses/create`
**Layout:** `space-y-6`
**Page Header:** `<PageHeader title="Create Course" description="Add a new course to the platform." />`
**Content:** CourseForm (two-column: main form + sidebar panels)

### Admin Course Edit

**Route:** `/dashboard/admin/courses/[courseId]`
**Layout:** `space-y-6`
**Page Header:** `<PageHeader title="Edit Course" description='Editing "title"' />`
**Content:** Tabs (Basic Information / Curriculum) → CourseForm or CurriculumManager

### Admin Enrollments

**Route:** `/dashboard/admin/enrollments`
**Layout:** `space-y-6`
**Page Header:** Inline `<h1>` (not using PageHeader)
**Content:** Card with DataTable

### Admin Enrollment Detail

**Route:** `/dashboard/admin/enrollments/[enrollmentId]`
**Layout:** `space-y-6 p-8`
**Page Header:** With cancel + back buttons
**Content:** Two-column grid `lg:grid-cols-2`:
- Student Information Card
- Course Information Card
- Payment Information Card (if exists)

### Admin Payment Management

**Route:** `/dashboard/admin/payment-management`
**Layout:** `space-y-6`
**Page Header:** `<PageHeader title="Payment Management" description="Review and manage student payment requests." />`
**Content:** Card with DataTable + mobile cards

### Admin Payment Detail

**Route:** `/dashboard/admin/payment-management/[paymentId]`
**Layout:** `space-y-6 p-8`
**Page Header:** With verify/reject + back buttons
**Content:** Two-column grid `lg:grid-cols-[1.1fr_0.9fr]`:
- Left: Payment Screenshot Card + Student Info Card
- Right: Payment Info Card + Rejection Reason Card (if rejected) + Last updated text

### Teacher Dashboard

**Route:** `/dashboard/teacher`
**Layout:** `space-y-6`
**Page Header:** `<PageHeader title="Teacher Dashboard" description="Manage your teacher profile" />`
**Content:** TeacherProfileEdit (two-column `lg:grid-cols-2`: Profile picture Card + Profile details Card)

### Teacher Courses

**Route:** `/dashboard/teacher/courses`
**Layout:** `space-y-6`
**Page Header:** With "Create Course" button
**Content:** Card with CourseManagement

### Teacher Course Create/Edit

Same pattern as admin, but with teacher-specific API hooks.

### Student Dashboard

**Route:** `/dashboard/student`
**Layout:** `space-y-6`
**Page Header:** Inline `<h1>` (not using PageHeader)
**Content:** Welcome empty state with dashed border

### Student My Courses

**Route:** `/dashboard/student/my-course`
**Layout:** `space-y-6`
**Page Header:** Inline (title + description)
**Content:** Responsive grid of CourseCards (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)

### Student Course Player

**Route:** `/dashboard/student/my-course/[enrollmentId]`
**Layout:** Default
**Content:** CoursePlayerLayout (specialized component)

### Student Payments

**Route:** `/dashboard/student/payments`
**Layout:** `space-y-6`
**Page Header:** Inline `<h1>`
**Content:** Card with DataTable

---

## 26. ASCII Wireframes

### Admin Dashboard (Desktop)

```
┌──────────────────────────────────────────────────────────────────┐
│ [F] Fusion Academy                                               │
├──────────────────────────────────────────────────────────────────┤
│ Dashboard    │ Header: [☰] | Dashboard                           │
│              │                                                   │
│ Management   │ ┌──────────────────────────────────────────────┐  │
│ ├ Users      │ │ Dashboard                                    │  │
│ ├ Teachers   │ │ Good morning, Name. This is your LMS overview│  │
│ ├ Categories │ └──────────────────────────────────────────────┘  │
│ ├ Courses    │                                                   │
│ ├ Payment    │ Quick actions                                     │
│ │ Management │ ┌──────────────┐ ┌──────────────┐ ┌────────────┐ │
│ └ Enrollments│ │ 📋           │ │ 📁           │ │            │ │
│              │ │ Manage users │ │ Manage       │ │            │ │
│ ──────────── │ │              │ │ categories   │ │            │ │
│ [Avatar]     │ └──────────────┘ └──────────────┘ └────────────┘ │
│ Name         │                                                   │
│ admin        │ Overview                                         │
│              │ ┌──────────────────────────────────────────────┐  │
│              │ │ 📊 Analytics coming soon                     │  │
│              │ └──────────────────────────────────────────────┘  │
└──────────────┴──────────────────────────────────────────────────┘
```

### Admin Users Page (Desktop)

```
┌──────────────────────────────────────────────────────────────────┐
│ [F] Fusion Academy                                               │
├──────────────────────────────────────────────────────────────────┤
│ Dashboard    │ Header: [☰] | Users                               │
│              │                                                   │
│ Management   │ Users                                            │
│ ├ Users      │ Manage user accounts and their roles.            │
│ ├ Teachers   │                                                   │
│ ├ Categories │ ┌──────────────────────────┐ ┌─────────────────┐ │
│ ├ Courses    │ │ Users                    │ │ Create user     │ │
│ ├ Payment    │ │ 🔍 Search...             │ │                 │ │
│ │ Management │ │                          │ │ Name: [_______] │ │
│ └ Enrollments│ │ Name    Email   Role Act.│ │ Email:[_______] │ │
│              │ │ ───── ─────── ───── ─── │ │ Pass: [_______] │ │
│ ──────────── │ │ Alice  a@b.c  Admin  [▾]│ │ Role: [Student▾]│ │
│ [Avatar]     │ │ Bob    b@c.d  Teach  [▾]│ │                 │ │
│ Name         │ │ Carol  c@d.e  Stud  [▾]│ │ [Create user]   │ │
│ admin        │ └──────────────────────────┘ └─────────────────┘ │
└──────────────┴──────────────────────────────────────────────────┘
```

### Student My Courses (Desktop)

```
┌──────────────────────────────────────────────────────────────────┐
│ [F] Fusion Academy                                               │
├──────────────────────────────────────────────────────────────────┤
│ Dashboard    │ Header: [☰] | Student Dashboard                   │
│ My Courses   │                                                   │
│ Payments     │ My Courses                                        │
│              │ Pick up right where you left off.                 │
│              │                                                   │
│              │ ┌──────────────┐ ┌──────────────┐ ┌────────────┐ │
│              │ │ [Thumbnail]  │ │ [Thumbnail]  │ │ [Gradient] │ │
│              │ │              │ │              │ │    📖       │ │
│              │ ├──────────────┤ ├──────────────┤ ├────────────┤ │
│              │ │ Course Title │ │ Course Title │ │ Course     │ │
│              │ │ Description  │ │ Description  │ │ Title      │ │
│              │ │ ━━━━━━ 60%   │ │ ━━━━━━ 30%   │ │            │ │
│              │ │ 👤 Teacher   │ │ 👤 Teacher   │ │ 👤 Teacher │ │
│              │ └──────────────┘ └──────────────┘ └────────────┘ │
└──────────────┴──────────────────────────────────────────────────┘
```

### Course Form (Desktop)

```
┌──────────────────────────────────────────────────────────────────┐
│ ┌────────────────────────────────────┐ ┌──────────────────────┐ │
│ │ Course Title                       │ │ ┌──────────────────┐ │ │
│ │ [____________________________]     │ │ │ Publish          │ │ │
│ │                                    │ │ │ Status: [DRAFT▾] │ │ │
│ │ Permalink                          │ │ │                  │ │ │
│ │ /courses/[_______________]         │ │ │ Price            │ │ │
│ │                                    │ │ │ [0_______]       │ │ │
│ │ Short Description                  │ │ │                  │ │ │
│ │ [____________________________]     │ │ │ Duration         │ │ │
│ │ [____________________________]     │ │ │ [__________]     │ │ │
│ │                                    │ │ │                  │ │ │
│ │ Description                        │ │ │ [Save] [Cancel]  │ │ │
│ │ ┌──────────────────────────────┐   │ │ └──────────────────┘ │ │
│ │ │ Rich text editor             │   │ │                      │ │
│ │ │                              │   │ │ ┌──────────────────┐ │ │
│ │ │                              │   │ │ │ Category         │ │ │
│ │ └──────────────────────────────┘   │ │ │ [Select...   ▾]  │ │ │
│ │                                    │ │ └──────────────────┘ │ │
│ │                                    │ │                      │ │
│ │                                    │ │ ┌──────────────────┐ │ │
│ │                                    │ │ │ Thumbnail        │ │ │
│ │                                    │ │ │ [Upload...]      │ │ │
│ │                                    │ │ └──────────────────┘ │ │
│ └────────────────────────────────────┘ └──────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

## 27. Design Tokens

### Colors

```yaml
brand:
  orange: "#ff5500"
  orange-hover: "#e04b00"
  blue: "#1e3a8a"
  dark-blue: "#172554"
  soft-light: "oklch(0.95 0.12 40)"
  soft-dark: "oklch(0.4 0.15 40)"

primary:
  light: "#ff5500"
  dark: "#ff5500"
  foreground-light: "#ffffff"
  foreground-dark: "#ffffff"

background:
  light: "oklch(1 0 0)"
  dark: "#0f172a"

foreground:
  light: "oklch(0.145 0 0)"
  dark: "#f8fafc"

card:
  light: "oklch(1 0 0)"
  dark: "#1e293b"

muted:
  light: "oklch(0.97 0 0)"
  dark: "#243244"

muted-foreground:
  light: "oklch(0.556 0 0)"
  dark: "#94a3b8"

border:
  light: "oklch(0.922 0 0)"
  dark: "oklch(1 0 0 / 10%)"

destructive:
  light: "oklch(0.577 0.245 27.325)"
  dark: "oklch(0.704 0.191 22.216)"

success:
  light: "#10b981"
  dark: "#10b981"

warning:
  light: "#f59e0b"
  dark: "#f59e0b"

info:
  light: "#1e3a8a"
  dark: "#2563eb"

sidebar:
  bg-light: "oklch(0.985 0 0)"
  bg-dark: "#1e293b"
  primary-light: "#1e3a8a"
  primary-dark: "#ff5500"
```

### Typography

```yaml
fonts:
  sans: "Geist, system-ui, sans-serif"
  mono: "Geist Mono, monospace"
  heading: "var(--font-sans)"

sizes:
  xs: "0.75rem"      # 12px
  sm: "0.875rem"     # 14px
  base: "1rem"       # 16px
  lg: "1.125rem"     # 18px
  xl: "1.25rem"      # 20px
  2xl: "1.5rem"      # 24px

weights:
  normal: 400
  medium: 500
  semibold: 600
  bold: 700
```

### Spacing

```yaml
scale:
  0.5: "2px"
  1: "4px"
  1.5: "6px"
  2: "8px"
  2.5: "10px"
  3: "12px"
  4: "16px"
  5: "20px"
  6: "24px"
  8: "32px"
  12: "48px"
  16: "64px"
  20: "80px"

patterns:
  page-vertical: "space-y-6"
  section-gap: "gap-8"
  card-spacing: "16px"
  grid-gap: "gap-3 or gap-6"
  form-field-gap: "gap-1.5"
  form-section-gap: "gap-4"
  button-gap: "gap-1 to gap-2"
  nav-gap: "gap-2"
```

### Radius

```yaml
base: "0.625rem"     # 10px
sm: "6px"
md: "8px"
lg: "10px"
xl: "14px"
2xl: "18px"
3xl: "22px"
4xl: "26px"
full: "9999px"

component-radius:
  button: "rounded-lg"         # 10px
  card: "rounded-xl"           # 14px
  input: "rounded-lg"          # 10px
  dialog: "rounded-xl"         # 14px
  dropdown: "rounded-lg"       # 10px
  badge: "rounded-4xl"         # pill
  sidebar-item: "rounded-md"   # 8px
  avatar: "rounded-full"       # circle
  course-card: "rounded-2xl"   # 18px
  progress-bar: "rounded-full" # pill
  tooltip: "rounded-md"        # 8px
  module-block: "rounded-xl"   # 14px
  quick-action: "rounded-lg"   # 10px
```

### Shadows & Borders

```yaml
shadows:
  dropdown: "shadow-md"
  select: "shadow-md"
  sheet: "shadow-lg"
  sidebar-floating: "shadow-sm"
  course-card-hover: "shadow-xl shadow-black/5"

borders:
  card: "ring-1 ring-foreground/10"
  input: "border border-input"
  dropdown: "ring-1 ring-foreground/10"
  dialog: "ring-1 ring-foreground/10"
  table-row: "border-b"
  empty-state: "border border-dashed"
  sidebar-right: "border-r"
  detail-divider: "divide-y divide-border/40"
```

### Breakpoints

```yaml
mobile: 768px    # Below this = mobile (Sheet sidebar)
sm: 640px        # Table→card switch, padding changes
lg: 1024px       # Multi-column grids activate
```

### Container/Component Heights

```yaml
button:
  xs: "h-6"       # 24px
  sm: "h-7"       # 28px
  default: "h-8"  # 32px
  lg: "h-9"       # 36px
  icon-xs: "size-6"  # 24×24
  icon-sm: "size-7"  # 28×28
  icon: "size-8"     # 32×32
  icon-lg: "size-9"  # 36×36

input:
  default: "h-8"  # 32px

select:
  default: "h-8"  # 32px
  sm: "h-7"       # 28px

badge: "h-5"       # 20px

table-header: "h-10"  # 40px

sidebar:
  menu-button: "h-8"     # 32px
  menu-button-sm: "h-7"  # 28px
  menu-button-lg: "h-12" # 48px
  group-label: "h-8"     # 32px
```

---

## 28. Reusable Design Patterns

### Page Header Pattern

Used on most dashboard pages for consistent title/description/actions:

```html
<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <div>
    <h1 class="text-2xl font-bold tracking-tight">Title</h1>
    <p class="mt-1 text-sm text-muted-foreground">Description</p>
  </div>
  <div class="flex items-center gap-2">
    <!-- Action buttons -->
  </div>
</div>
```

### Card + DataTable Pattern

Most list views follow this pattern:

```html
<Card>
  <CardHeader>
    <CardTitle>Section Title</CardTitle>
    <!-- Optional: search input, filters -->
  </CardHeader>
  <CardContent>
    <DataTable
      columns={...}
      data={...}
      renderMobileCard={...}  <!-- Responsive mobile cards -->
    />
  </CardContent>
</Card>
```

### Two-Column Form Pattern

Complex forms (course, users, categories) use a two-column layout:

```html
<div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
  <!-- Main form content -->
  <div class="space-y-6">...</div>
  
  <!-- Sticky sidebar panels -->
  <div class="space-y-6 lg:sticky lg:top-6 lg:self-start">
    <div class="rounded-lg border border-border/50 bg-background p-4 sm:p-5">
      <div class="space-y-5">...</div>
    </div>
  </div>
</div>
```

### Detail Info Pattern

Detail pages use a definition-list pattern for key-value pairs:

```html
<dl class="divide-y divide-border/40">
  <div class="flex items-start justify-between gap-4 py-2.5">
    <dt class="text-sm text-muted-foreground shrink-0 pt-px">Label</dt>
    <dd class="text-sm font-medium text-right break-all">Value</dd>
  </div>
</dl>
```

### Loading → Error → Content Pattern

Every data-fetching page follows this sequence:

```tsx
if (isLoading) return <LoadingState label="Loading..." />;
if (error) return <ErrorState title="..." message="..." onRetry={refetch} />;
// Render content
```

### Confirm Dialog Pattern

Destructive actions use a consistent confirmation pattern:

```tsx
<ConfirmDialog
  open={pending !== null}
  onOpenChange={(open) => !open && setPending(null)}
  title="Action?"
  description={`Description of the action...`}
  confirmLabel={saving ? 'Processing…' : 'Confirm'}
  destructive
  onConfirm={handleConfirm}
/>
```

### Mobile Card Pattern

Tables on mobile switch to card-based layouts:

```html
<div class="rounded-lg border border-border/60 bg-card p-4 space-y-2">
  <div class="flex items-center justify-between">
    <span class="font-medium">Name</span>
    <Badge variant="...">Status</Badge>
  </div>
  <p class="text-sm text-muted-foreground truncate">Details</p>
  <div class="flex items-center justify-between pt-1">
    <span class="text-xs text-muted-foreground">Date</span>
    <div class="flex items-center gap-1">
      <!-- Action buttons -->
    </div>
  </div>
</div>
```

### Empty State Pattern

```html
<div class="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-16 text-center">
  <div class="mb-2 flex size-12 items-center justify-center rounded-xl bg-brand-soft text-brand">
    {Icon}
  </div>
  <h3 class="font-semibold">Title</h3>
  <p class="max-w-sm text-sm text-muted-foreground">Description</p>
  <div class="mt-4">{CTA}</div>
</div>
```

### Error State Pattern

```html
<div class="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-6 py-16 text-center">
  <AlertCircleIcon class="mb-2 size-8 text-destructive" />
  <h3 class="font-medium">Error title</h3>
  <p class="max-w-sm text-sm text-muted-foreground">Error message</p>
  <button class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
    Try again
  </button>
</div>
```

---

## 29. Implementation References

### Core Layout

- `src/app/layout.tsx` — Root layout (fonts, ThemeProvider, StoreProvider)
- `src/app/(dashboard)/layout.tsx` — Dashboard layout wrapper
- `src/app/(dashboard)/dashboard-shell.tsx` — Shell (auth guard, SidebarProvider, Sidebar, Header, Main)
- `src/features/dashboard/components/dashboard-sidebar.tsx` — Sidebar component
- `src/features/dashboard/components/dashboard-header.tsx` — Header component
- `src/features/dashboard/components/user-menu.tsx` — User dropdown menu
- `src/features/dashboard/dashboard-config.ts` — Navigation config per role

### Design System

- `src/app/globals.css` — CSS variables, color tokens, Tiptap styles
- `src/components/ui/*` — All shadcn/ui base components (26 files)
- `src/components/shared/*` — Shared dashboard components (PageHeader, EmptyState, ErrorState, LoadingState, ConfirmDialog, DataTable)
- `src/lib/utils.ts` — cn() utility, formatPrice()
- `src/hooks/use-mobile.ts` — Mobile breakpoint hook (768px)
- `src/components/theme-provider.tsx` — ThemeProvider wrapper
- `src/components/ui/sonner.tsx` — Toast configuration

### Dashboard Pages

- `src/app/(dashboard)/dashboard/page.tsx` — Role redirect
- `src/app/(dashboard)/dashboard/admin/page.tsx` — Admin home
- `src/app/(dashboard)/dashboard/admin/users/page.tsx` — Users
- `src/app/(dashboard)/dashboard/admin/teachers/page.tsx` — Teachers
- `src/app/(dashboard)/dashboard/admin/categories/page.tsx` — Categories
- `src/app/(dashboard)/dashboard/admin/courses/page.tsx` — Courses list
- `src/app/(dashboard)/dashboard/admin/courses/create/page.tsx` — Create course
- `src/app/(dashboard)/dashboard/admin/courses/[courseId]/page.tsx` — Edit course
- `src/app/(dashboard)/dashboard/admin/enrollments/page.tsx` — Enrollments list
- `src/app/(dashboard)/dashboard/admin/enrollments/[enrollmentId]/page.tsx` — Enrollment detail
- `src/app/(dashboard)/dashboard/admin/payment-management/page.tsx` — Payments list
- `src/app/(dashboard)/dashboard/admin/payment-management/[paymentId]/page.tsx` — Payment detail
- `src/app/(dashboard)/dashboard/teacher/page.tsx` — Teacher profile
- `src/app/(dashboard)/dashboard/teacher/courses/page.tsx` — Teacher courses
- `src/app/(dashboard)/dashboard/teacher/courses/create/page.tsx` — Create course
- `src/app/(dashboard)/dashboard/teacher/courses/[courseId]/page.tsx` — Edit course
- `src/app/(dashboard)/dashboard/student/page.tsx` — Student welcome
- `src/app/(dashboard)/dashboard/student/my-course/page.tsx` — My courses
- `src/app/(dashboard)/dashboard/student/my-course/[enrollmentId]/page.tsx` — Course player
- `src/app/(dashboard)/dashboard/student/payments/page.tsx` — Payment history

### Feature Components

- `src/features/admin/components/admin-dashboard-overview.tsx` — Admin overview
- `src/features/admin/components/user-management.tsx` — User table + actions
- `src/features/admin/components/create-user-form.tsx` — Create user form
- `src/features/admin/components/teacher-management.tsx` — Teacher table
- `src/features/category/components/category-management.tsx` — Category management
- `src/features/category/components/category-table.tsx` — Category table
- `src/features/category/components/category-form-dialog.tsx` — Category form dialog
- `src/features/category/components/category-add-form.tsx` — Add category form
- `src/features/course/components/course-management.tsx` — Course table
- `src/features/course/components/course-form.tsx` — Course form (create/edit)
- `src/features/course/components/course-form-content.tsx` — Course form main content
- `src/features/course/components/course-form-sidebar.tsx` — Course form sidebar
- `src/features/course/components/course-editor.tsx` — Course editor (tabs)
- `src/features/teacher/components/teacher-profile-edit.tsx` — Teacher profile form
- `src/features/curriculum/components/curriculum-manager.tsx` — Module/lesson manager
- `src/features/payment/components/payment-management.tsx` — Payment table
- `src/components/student/card.tsx` — Student course card
- `src/components/student/my-course.tsx` — Student course grid
- `src/components/student/course-detail.tsx` — Course player layout

---

## 30. Final Design Summary

```text
Dashboard Style: Clean, minimal, professional LMS admin dashboard
Layout Style: Fixed left sidebar + header + scrollable main content (SidebarInset pattern)
Navigation Style: Collapsible sidebar with role-based nav items, icon+text, collapsible to icon-only
Color Style: Orange primary (#ff5500) with blue accents (#1e3a8a), white/near-white backgrounds, Slate dark mode
Typography Style: Geist font family (variable), 14px base, semibold headings, medium weight labels
Card Style: Rounded-xl, ring-1 border, no shadow (ring-based elevation), white background
Form Style: Vertical stacking, 6px field gaps, 14px labels, 32px inputs, rounded-lg borders
Table Style: Full-width, borderless rows (border-b only), hover:bg-muted/50, responsive card fallback on mobile
Responsive Strategy: 768px breakpoint — sidebar becomes Sheet overlay, grids collapse to single column, tables become cards
Overall Visual Character: Minimalist, functional, brand-forward (orange accents), consistent spacing, subtle borders, no heavy shadows
```
