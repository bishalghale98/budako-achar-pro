# Universal Design System & UI Engineering Guidelines

## Purpose

This document defines the universal UI/UX and frontend implementation standards for all projects.

These guidelines should be treated as the default design and implementation rules unless a project-specific design system explicitly overrides them.

The primary goal is to create interfaces that are:

* Mobile-first
* Responsive
* Accessible
* Touch-friendly
* Visually consistent
* Theme-aware
* Maintainable
* Component-driven
* Content-focused
* Free from unnecessary visual complexity

---

# 1. Mobile-First Design

**Mobile is the primary layout. Desktop is an enhancement of the mobile experience, not the other way around.**

Design and implement the smallest viewport first, then progressively enhance the interface at larger breakpoints.

### Mobile requirements

* Remove unnecessary outer container borders.
* Remove unnecessary horizontal padding.
* Avoid decorative background cards around primary content.
* Use `px-0`, `border-0`, `rounded-none`, and transparent backgrounds where appropriate.
* Allow primary content to span the full viewport width.
* Avoid unnecessary nested containers.
* Minimize visual wrappers around content.
* Prioritize usable content space over decorative elements.
* Avoid layouts that force horizontal scrolling unless horizontal scrolling is intentional.
* Ensure important content is visible without excessive scrolling.

### Progressive enhancement

At `sm:`, `md:`, `lg:`, or larger breakpoints, progressively introduce:

* Constrained content widths
* Horizontal padding
* Borders
* Rounded corners
* Card backgrounds
* Shadows
* Larger spacing
* Multi-column layouts
* Desktop navigation
* Additional visual grouping

Example:

```tsx
<div className="w-full bg-background sm:mx-auto sm:max-w-5xl sm:rounded-xl sm:border sm:border-border sm:bg-card">
  ...
</div>
```

Do not force desktop-style cards onto mobile when they reduce usable space.

---

# 2. Responsive Layout

Every page must work naturally across:

* Small mobile devices
* Large mobile devices
* Tablets
* Laptops
* Desktop monitors
* Large desktop screens

Do not simply shrink desktop layouts.

Instead, determine how the information hierarchy should change at each breakpoint.

### Prefer

```text
Mobile
↓
Single column
↓
Tablet
↓
Flexible two-column layout
↓
Desktop
↓
Constrained multi-column layout
```

### Avoid

```text
Desktop layout
↓
Shrunk desktop layout
↓
Overflow
↓
Tiny text
↓
Poor mobile UX
```

Use responsive Tailwind utilities instead of JavaScript-based viewport detection whenever possible.

---

# 3. Container Strategy

Avoid excessive container nesting.

A page should generally follow:

```text
Page
 └── Main container
      ├── Header
      ├── Primary content
      └── Secondary content
```

Avoid:

```text
Page
 └── Card
      └── Card
           └── Card
                └── Content
```

unless each layer has a meaningful semantic purpose.

### Container principles

* One primary page container should normally be sufficient.
* Do not wrap every section in a card.
* Use full-width sections when appropriate.
* Use cards only when visual grouping improves comprehension.
* Do not use borders merely because a section can have a border.
* Do not use shadows merely for decoration.

---

# 4. Modular Component Architecture

Complex pages must be broken into small, single-responsibility components.

Avoid large page components containing:

* Data fetching
* Forms
* Dialogs
* Lists
* Tables
* Cards
* Navigation
* Business logic
* Multiple unrelated UI sections

### Prefer feature-based component organization

Example:

```text
features/
└── course/
    ├── components/
    │   ├── course-header.tsx
    │   ├── course-overview.tsx
    │   ├── course-instructor.tsx
    │   ├── course-curriculum.tsx
    │   ├── course-enrollment.tsx
    │   └── course-card.tsx
    │
    ├── hooks/
    ├── api/
    ├── types/
    └── utils/
```

### Component principles

Each component should have:

* One clear responsibility
* Predictable props
* Minimal coupling
* Reusable behavior where appropriate
* Clear naming
* Strong TypeScript types

Avoid premature abstraction.

Do not create components simply to reduce the number of lines in a file.

Create components when they represent a meaningful UI or behavioral unit.

---

# 5. Semantic Tailwind Design Tokens

Prefer semantic design tokens over hardcoded colors.

### Preferred

```tsx
bg-background
bg-card
bg-muted
bg-accent
text-foreground
text-muted-foreground
border-border
border-border/50
ring-ring
```

### Avoid

```tsx
bg-white
text-black
border-gray-200
bg-gray-100
text-gray-500
```

unless a hardcoded color is specifically required by the project's visual identity.

Semantic tokens ensure components work correctly across themes and allow the design system to evolve without modifying every component.

---

# 6. Dark Mode & Theme Support

Every reusable component should support both light and dark themes automatically.

Do not assume a white background or black text.

Prefer:

```tsx
bg-background
bg-card
text-foreground
text-muted-foreground
border-border
```

instead of:

```tsx
bg-white
text-black
border-gray-200
```

Avoid adding unnecessary `dark:` overrides when semantic tokens already handle the theme.

### Theme principle

Components should inherit the project's theme rather than implementing their own theme system.

---

# 7. Shadcn/UI & Primitive Reuse

When Shadcn/UI or another established component system exists in the project, reuse its primitives.

Prefer existing components such as:

* `Button`
* `Input`
* `Textarea`
* `Select`
* `Dialog`
* `Sheet`
* `DropdownMenu`
* `Tabs`
* `Card`
* `Badge`
* `Avatar`
* `Tooltip`
* `Alert`
* `Separator`
* `Skeleton`

Do not recreate equivalent components without a strong reason.

### Before creating a custom component

Ask:

1. Does an existing primitive already solve this?
2. Can an existing primitive be composed?
3. Can it be extended safely?
4. Is the custom component genuinely required?

Consistency is more important than creating a unique component for every screen.

---

# 8. Touch-Optimized Interactions

All interactive elements must be comfortable to use on touch devices.

This applies to:

* Buttons
* Links
* Inputs
* Tabs
* Dropdowns
* Checkboxes
* Radio buttons
* Navigation items
* Cards with click behavior
* Pagination controls

Avoid unnecessarily small controls.

Prefer sufficient:

* Height
* Width
* Padding
* Gap
* Spacing between neighboring actions

### Touch principle

Interactive elements should be easy to tap without accidentally activating nearby controls.

Do not sacrifice usability merely to make the interface visually compact.

---

# 9. Content Density

Prioritize useful information over decorative UI.

Avoid:

* Excessive card wrappers
* Excessive borders
* Excessive shadows
* Large empty spaces
* Repeated headings
* Redundant labels
* Decorative containers
* Unnecessary separators

Use whitespace intentionally.

Whitespace should establish hierarchy rather than simply consume space.

---

# 10. Visual Hierarchy

Every page should have a clear visual hierarchy.

The user should be able to quickly identify:

1. What page they are on
2. What the primary action is
3. What information is most important
4. What information is secondary
5. What actions are available

Use:

* Typography
* Spacing
* Position
* Contrast
* Size
* Grouping

to establish hierarchy.

Do not rely exclusively on color.

---

# 11. Typography

Typography should be consistent and responsive.

Prefer the project's existing typography system.

Use semantic hierarchy:

```text
Page title
↓
Section heading
↓
Subsection heading
↓
Body text
↓
Supporting text
```

Avoid excessive font-size variation.

Do not make text extremely small simply to fit more content.

Supporting text should remain readable on mobile.

Use appropriate:

* `leading-*`
* `tracking-*`
* `font-*`
* responsive text sizes

where necessary.

---

# 12. Spacing

Use a consistent spacing system.

Prefer Tailwind's spacing scale:

```text
gap-2
gap-3
gap-4
gap-6
gap-8
```

rather than arbitrary values everywhere.

Avoid excessive one-off values such as:

```text
mt-[13px]
px-[19px]
gap-[7px]
```

unless the design genuinely requires pixel-level precision.

Spacing should communicate relationships between elements.

---

# 13. Cards & Surfaces

Cards should have a purpose.

Use cards when they help:

* Group related information
* Separate independent content
* Establish hierarchy
* Highlight an important object
* Represent an actionable entity

Avoid turning every section into a card.

### Mobile rule

A card that improves desktop hierarchy may need to become a flat section on mobile.

Example:

```tsx
<div className="bg-background sm:rounded-xl sm:border sm:border-border sm:bg-card">
  ...
</div>
```

---

# 14. Forms

Forms should be:

* Simple
* Clearly labeled
* Easy to scan
* Touch-friendly
* Accessible
* Responsive

Use existing form primitives and validation patterns.

Every input should have:

* A meaningful label
* Appropriate placeholder when useful
* Clear validation feedback
* Accessible error messaging

Do not use placeholder text as the only label.

Group related fields logically.

On mobile, forms should normally use a single-column layout.

---

# 15. Buttons & Actions

Buttons must communicate their importance through hierarchy.

Use appropriate variants such as:

* Primary
* Secondary
* Outline
* Ghost
* Destructive

Avoid making every button visually dominant.

A page should generally have one clear primary action.

Buttons should:

* Have comfortable touch targets
* Clearly indicate disabled/loading states
* Prevent accidental duplicate submissions
* Use icons consistently
* Maintain readable text

---

# 16. Loading, Empty & Error States

Every data-driven interface should consider:

### Loading

Use:

* Skeletons
* Loading indicators
* Disabled actions where appropriate

Avoid blank screens while data is loading.

### Empty

Clearly explain:

* What is empty
* Why it may be empty
* What the user can do next

### Error

Errors should:

* Be understandable
* Explain what happened when possible
* Provide a recovery action when possible
* Avoid exposing internal implementation details

---

# 17. Accessibility

Accessibility is a core requirement, not an optional enhancement.

Ensure:

* Keyboard navigation works
* Interactive elements are focusable
* Focus states are visible
* Form controls have labels
* Images have meaningful `alt` text where appropriate
* Decorative images use appropriate accessibility handling
* Color is not the only way to communicate information
* Contrast is sufficient
* Dialogs and menus are keyboard accessible
* Semantic HTML is used where possible

Prefer semantic elements:

```html
button
nav
main
header
section
article
form
label
```

instead of using generic `div` elements for everything.

---

# 18. Icons

Use the project's existing icon library.

Do not mix multiple icon libraries unnecessarily.

Icons should:

* Have consistent visual weight
* Be appropriately sized
* Align with surrounding text
* Have accessible labels when they are the only indication of an action

Icon-only buttons should use tooltips or accessible labels where appropriate.

---

# 19. Images & Media

Images should be responsive and optimized.

Consider:

* Aspect ratio
* Object positioning
* Loading behavior
* Responsive sizing
* Accessibility
* Performance

Do not allow images to unexpectedly overflow their containers.

Use appropriate cropping rather than distorting images.

Profile images and avatars should use a consistent component such as the project's `Avatar` primitive when available.

---

# 20. Responsive Navigation

Navigation should adapt to the available screen size.

On mobile, prefer patterns such as:

* Sheet/drawer navigation
* Compact navigation
* Bottom navigation where appropriate
* Simplified menus

Do not force a large desktop navigation bar onto small screens.

---

# 21. Tables

Tables should be designed intentionally for mobile.

When a table cannot reasonably fit on mobile:

* Allow controlled horizontal scrolling, or
* Transform the information into a mobile-friendly list/card representation.

Do not simply shrink table text until it becomes unreadable.

---

# 22. Performance

Avoid unnecessary rendering and expensive UI operations.

Prefer:

* Server components where appropriate
* Lazy loading for heavy components
* Optimized images
* Pagination for large datasets
* Virtualization for very large lists
* Efficient data fetching
* Avoiding unnecessary client-side JavaScript

Do not optimize prematurely.

Measure first when performance becomes a concern.

---

# 23. State & Data Handling

UI components should not contain unnecessary business logic.

Separate:

```text
UI
↓
Hooks / state
↓
API/data layer
↓
Backend
```

Keep API calls, validation, transformations, and business rules in appropriate layers.

Do not duplicate backend business logic inside frontend components.

---

# 24. URL & Navigation State

When UI state is naturally represented by the URL, prefer URL state.

Examples:

* Search
* Filters
* Pagination
* Tabs
* Selected entities
* Course/lesson identifiers

This improves:

* Refresh behavior
* Deep linking
* Browser navigation
* Shareability

---

# 25. Avoid Magic Values

Do not scatter arbitrary values throughout components.

Prefer:

* Design tokens
* Shared constants
* Configuration
* Theme variables
* Existing utility classes

Hardcoded values are acceptable when they are genuinely component-specific and meaningful.

---

# 26. Consistency Over Novelty

Do not introduce a new visual pattern when an existing pattern already solves the problem.

Before creating a new UI pattern:

1. Search the existing project.
2. Identify similar components.
3. Reuse existing primitives.
4. Follow existing spacing and typography.
5. Extend existing patterns when appropriate.

The application should feel like one coherent product.

---

# 27. Desktop Enhancement

Desktop should provide additional space and richer organization without changing the fundamental usability of the interface.

At larger breakpoints, it is appropriate to introduce:

* Wider content areas
* Sidebars
* Multi-column layouts
* Cards
* Borders
* Shadows
* Larger spacing
* Additional metadata
* Expanded navigation

However, desktop enhancements must not compromise the mobile-first information hierarchy.

---

# 28. Design Decision Priority

When design decisions conflict, use this priority order:

```text
1. Accessibility
2. Usability
3. Mobile experience
4. Content hierarchy
5. Consistency
6. Responsiveness
7. Maintainability
8. Visual polish
9. Decoration
```

Do not sacrifice usability for visual decoration.

---

# 29. Implementation Rules for AI Coding Agents

When modifying or creating UI, an AI coding agent must:

1. Inspect the existing project structure before making changes.
2. Inspect existing components before creating new ones.
3. Identify the project's existing design system.
4. Reuse existing Shadcn/UI primitives.
5. Reuse existing utility classes and design tokens.
6. Follow the project's existing naming conventions.
7. Follow mobile-first responsive principles.
8. Avoid unnecessary nested containers.
9. Avoid hardcoded colors when semantic tokens exist.
10. Avoid creating duplicate components.
11. Keep components focused and maintainable.
12. Preserve existing functionality.
13. Avoid unrelated refactoring.
14. Verify responsive behavior after implementation.
15. Verify light and dark theme behavior.
16. Verify loading, empty, error, and disabled states where applicable.
17. Verify keyboard and touch interactions.
18. Run the project's relevant lint, typecheck, and test commands when available.

---

# 30. Before/After UI Audit

Before considering a UI task complete, review:

### Mobile

* Does the content use the full available width?
* Are unnecessary borders removed?
* Are unnecessary cards flattened?
* Is horizontal padding appropriate?
* Are controls easy to tap?
* Is text readable?
* Is there unnecessary nested UI?

### Tablet

* Does the layout use available space effectively?
* Do columns appear at the appropriate breakpoint?
* Is spacing balanced?

### Desktop

* Is content appropriately constrained?
* Are cards and borders used intentionally?
* Is the visual hierarchy clear?
* Is whitespace intentional?

### Theme

* Does the UI work in light mode?
* Does the UI work in dark mode?
* Are semantic tokens being used?

### Accessibility

* Can the interface be navigated with a keyboard?
* Are controls labeled?
* Are focus states visible?
* Is contrast sufficient?

### Architecture

* Is the page unnecessarily large?
* Can independent UI sections be isolated?
* Are existing components being reused?
* Is business logic separated from presentation?

---

# Core Principle

> **Mobile is the primary experience, not a smaller version of the desktop experience.**

Build the simplest usable layout first.

Then progressively introduce visual grouping, containers, cards, borders, spacing, and richer layouts as screen size increases.

The best interface is not the one with the most UI.

**It is the one that communicates the most while requiring the least unnecessary interaction.**
