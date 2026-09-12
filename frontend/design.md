Absolutely. Below is a **complete replacement `design.md`** that combines your original Apple/Material-inspired principles with the stronger **component architecture, file-size discipline, maintainability, accessibility, responsive behavior, and AI coding-agent rules**.

You can replace your existing `design.md` entirely with this.

````md
# Universal Design System & UI Engineering Guidelines

This document defines the default UI/UX, frontend architecture, accessibility, responsiveness, and implementation standards for all projects.

These guidelines apply unless a project-specific design system, product requirement, or established codebase convention explicitly overrides them.

The goal is to build interfaces that are:

- Mobile-first
- Responsive
- Accessible
- Touch-friendly
- Theme-aware
- Content-focused
- Visually consistent
- Component-driven
- Maintainable
- Performant
- Predictable
- Easy to understand
- Easy to extend
- Free from unnecessary visual complexity

The interface should not only look good.

The underlying code should also be well structured.

---

# 1. Core Design Philosophy

The design system combines principles inspired by established platforms such as Apple's Human Interface Guidelines and Google's Material Design.

The implementation should prioritize:

1. Accessibility
2. Usability
3. Mobile experience
4. Content hierarchy
5. Consistency
6. Responsiveness
7. Maintainability
8. Performance
9. Visual polish
10. Decoration

Never sacrifice usability, accessibility, or maintainability for visual decoration.

---

# 2. Core Principle

> **Mobile is the primary experience, not a smaller version of the desktop experience.**

Build the simplest usable layout first.

Then progressively introduce:

- Visual grouping
- Containers
- Cards
- Borders
- Shadows
- Larger spacing
- Multi-column layouts
- Desktop navigation
- Additional metadata

as screen size increases.

The best interface is not the one with the most UI.

> **It is the one that communicates the most while requiring the least unnecessary interaction.**

---

# 3. Mobile-First Design

Mobile is the primary layout.

Desktop is an enhancement of the mobile experience, not the other way around.

Design and implement the smallest practical viewport first, then progressively enhance the interface at larger breakpoints.

## Mobile requirements

Where appropriate:

- Remove unnecessary outer container borders.
- Remove unnecessary horizontal padding.
- Avoid decorative background cards around primary content.
- Use `px-0`, `border-0`, `rounded-none`, and transparent backgrounds where appropriate.
- Allow primary content to span the available viewport width.
- Avoid unnecessary nested containers.
- Minimize visual wrappers around content.
- Prioritize usable content space over decoration.
- Avoid layouts that force horizontal scrolling unless scrolling is intentional.
- Ensure important content is visible without excessive scrolling.
- Keep primary actions accessible.
- Keep text readable.
- Maintain comfortable touch targets.

Example:

```tsx
<div className="w-full bg-background sm:mx-auto sm:max-w-5xl sm:rounded-xl sm:border sm:border-border sm:bg-card">
  ...
</div>
````

Do not force desktop-style cards onto mobile when they reduce usable space.

---

# 4. Progressive Enhancement

At larger breakpoints such as `sm:`, `md:`, `lg:`, and `xl:`, progressively introduce:

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

Do not simply shrink a desktop layout.

Prefer:

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

Avoid:

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

Use responsive Tailwind utilities whenever possible instead of JavaScript-based viewport detection.

---

# 5. Responsive Layout

Every page must work naturally across:

* Small mobile devices
* Large mobile devices
* Tablets
* Laptops
* Desktop monitors
* Large desktop screens

Responsive design must adapt information hierarchy, not only dimensions.

At each breakpoint consider:

* What should remain visible?
* What should stack?
* What should collapse?
* What should move?
* What should become scrollable?
* What should become a drawer or dialog?
* What additional information becomes useful on larger screens?

Do not create separate desktop and mobile implementations unless genuinely necessary.

Prefer CSS and responsive utilities over runtime viewport detection.

---

# 6. Container Strategy

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

## Container principles

* One primary page container should normally be sufficient.
* Do not wrap every section in a card.
* Use full-width sections when appropriate.
* Use cards only when visual grouping improves comprehension.
* Do not use borders merely because a section can have a border.
* Do not use shadows merely for decoration.
* Avoid unnecessary wrapper elements.
* Avoid nested containers that provide no semantic or visual value.

---

# 7. Visual Hierarchy

Every page should have a clear visual hierarchy.

The user should quickly identify:

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

A page should generally have one clear primary action.

---

# 8. Content Density

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
* Excessive badges
* Unnecessary icons
* Repeated information

Whitespace should establish hierarchy.

Whitespace should not simply consume space.

---

# 9. Cards & Surfaces

Cards must have a purpose.

Use cards when they help:

* Group related information
* Separate independent content
* Establish hierarchy
* Highlight an important object
* Represent an actionable entity

Avoid turning every section into a card.

## Mobile card rule

A card that improves desktop hierarchy may need to become a flat section on mobile.

Example:

```tsx
<div className="bg-background sm:rounded-xl sm:border sm:border-border sm:bg-card">
  ...
</div>
```

Do not preserve desktop card decoration on mobile if it reduces usable space.

---

# 10. Semantic Design Tokens

Prefer semantic design tokens over hardcoded colors.

## Preferred

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

## Avoid

```tsx
bg-white
text-black
border-gray-200
bg-gray-100
text-gray-500
```

unless a hardcoded color is specifically required by the project's visual identity.

Semantic tokens make components easier to theme and maintain.

---

# 11. Dark Mode & Theme Support

Reusable components must support light and dark themes automatically.

Do not assume:

* White backgrounds
* Black text
* Light gray borders
* Light-only shadows

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

Avoid unnecessary `dark:` overrides when semantic tokens already handle the theme.

Components should inherit the project's theme.

Do not implement an independent theme system inside individual components.

---

# 12. Typography

Typography should be consistent and responsive.

Use the project's existing typography system whenever one exists.

Use a clear hierarchy:

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

Do not make text extremely small to fit more content.

Supporting text must remain readable on mobile.

Use appropriate:

* `font-*`
* `text-*`
* `leading-*`
* `tracking-*`

where necessary.

Do not introduce arbitrary typography values without a real design requirement.

---

# 13. Spacing

Use a consistent spacing system.

Prefer Tailwind's spacing scale:

```text
gap-2
gap-3
gap-4
gap-6
gap-8
```

Avoid arbitrary values everywhere:

```text
mt-[13px]
px-[19px]
gap-[7px]
```

unless pixel-level precision is genuinely required.

Spacing should communicate relationships.

Use:

* Smaller gaps for closely related elements.
* Medium gaps between related groups.
* Larger gaps between major sections.

Do not use large spacing simply to make a page appear more spacious.

---

# 14. Touch Targets

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
* Pagination controls
* Cards with click behavior
* Icon buttons

Use sufficiently large:

* Height
* Width
* Padding
* Gap
* Spacing between neighboring controls

As a general guideline, interactive targets should be around:

* `44x44px` minimum where practical
* `48x48dp` equivalent for touch-oriented interfaces

Do not create tiny controls simply to make the interface visually compact.

---

# 15. Accessibility

Accessibility is a core requirement.

Ensure:

* Keyboard navigation works.
* Interactive elements are focusable.
* Focus states are visible.
* Form controls have labels.
* Images have meaningful `alt` text when appropriate.
* Decorative images use appropriate accessibility handling.
* Color is not the only way to communicate information.
* Contrast is sufficient.
* Dialogs are keyboard accessible.
* Menus are keyboard accessible.
* Semantic HTML is used where possible.
* Screen-reader users can understand important states and actions.

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

instead of generic `div` elements for everything.

---

# 16. Semantic HTML

Use HTML elements according to their meaning.

Prefer:

```html
<button>
```

for actions.

Prefer:

```html
<a>
```

for navigation.

Prefer:

```html
<form>
```

for forms.

Prefer:

```html
<nav>
```

for navigation.

Prefer:

```html
<main>
```

for primary page content.

Avoid clickable `div` elements when a native interactive element exists.

Do not use semantic elements only for appearance; use them according to meaning and behavior.

---

# 17. Forms

Forms must be:

* Simple
* Clearly labeled
* Easy to scan
* Touch-friendly
* Accessible
* Responsive

Every input should have:

* A meaningful label
* Appropriate placeholder when useful
* Clear validation feedback
* Accessible error messaging

Never use placeholder text as the only label.

Group related fields logically.

On mobile, forms should normally use a single-column layout.

## Large form rule

Large forms should be divided according to meaningful information domains.

Example:

```text
Product Form

├── Basic Information
├── Pricing
├── Inventory
├── Description
├── Images
└── Actions
```

Do not place every form field and every interaction into one enormous component simply because they belong to the same HTML `<form>`.

---

# 18. Buttons & Actions

Buttons must communicate importance through hierarchy.

Use appropriate variants such as:

* Primary
* Secondary
* Outline
* Ghost
* Destructive

Avoid making every button visually dominant.

A page should generally have one primary action.

Buttons should:

* Have comfortable touch targets.
* Clearly indicate loading state.
* Clearly indicate disabled state.
* Prevent accidental duplicate submissions.
* Use icons consistently.
* Maintain readable labels.
* Preserve keyboard accessibility.

Icon-only buttons must have accessible labels.

Use tooltips when they improve discoverability.

---

# 19. Icons

Use the project's existing icon library.

Do not mix multiple icon libraries unnecessarily.

Icons should:

* Have consistent visual weight.
* Be appropriately sized.
* Align with surrounding text.
* Have accessible labels when they are the only indication of an action.

Do not use icons purely because an empty space exists.

Icons should communicate meaning.

---

# 20. Shadcn/UI & Primitive Reuse

When Shadcn/UI or another established component system exists, reuse its primitives.

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

Before creating a custom component, ask:

1. Does an existing primitive already solve this?
2. Can an existing primitive be composed?
3. Can it be extended safely?
4. Is a custom component genuinely required?

Consistency is more important than creating a unique component for every screen.

---

# 21. Component Architecture

Complex pages must be broken into meaningful, single-responsibility components.

Avoid large page components containing all of:

* Data fetching
* Forms
* Dialogs
* Lists
* Tables
* Cards
* Navigation
* Business logic
* Validation
* Multiple unrelated UI sections

Prefer feature-based organization.

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
    ├── schemas/
    └── utils/
```

Follow the existing project's architecture if one already exists.

Do not introduce a new organizational pattern unnecessarily.

---

# 22. One File = One Primary Responsibility

A file should have one primary responsibility.

For example:

```text
product-form.tsx
```

should primarily compose and manage the product form.

It should not also contain:

* Product schema
* API implementation
* Image upload infrastructure
* Image processing utilities
* Multiple unrelated dialogs
* Large data transformation functions
* Unrelated UI sections

Separate meaningful responsibilities.

Example:

```text
product/
├── components/
│   ├── product-form.tsx
│   ├── product-basic-info.tsx
│   ├── product-pricing.tsx
│   ├── product-inventory.tsx
│   ├── product-description.tsx
│   ├── product-images.tsx
│   └── product-form-actions.tsx
│
├── hooks/
│   └── use-product-form.ts
│
├── schemas/
│   └── product-schema.ts
│
├── types/
│   └── product-types.ts
│
├── api/
│   └── product-api.ts
│
└── utils/
    └── product-utils.ts
```

Only create files when the separation represents a meaningful responsibility.

---

# 23. Component Size Discipline

Line count is not the only measure of quality, but file size is a useful warning signal.

Use the following guidelines:

```text
0–200 lines
    Normal.

200–300 lines
    Review the responsibility of the component.

300–500 lines
    Refactoring is recommended if meaningful boundaries exist.

500+ lines
    Strong refactoring signal.
```

A component over 500 lines should normally be reviewed before adding more functionality.

Do not automatically split a component just because it exceeds a specific number.

The objective is:

> **Lower cognitive complexity, not lower line count.**

---

# 24. Large File Refactoring Rule

When a component exceeds approximately 500 lines:

1. Analyze its responsibilities.
2. Identify independent UI sections.
3. Identify complex state.
4. Identify API/data logic.
5. Identify validation logic.
6. Identify reusable behavior.
7. Identify custom-hook candidates.
8. Check existing project patterns.
9. Create a decomposition plan.
10. Refactor only meaningful boundaries.
11. Preserve all existing behavior.

Do not blindly split code by line count.

---

# 25. Meaningful Component Extraction

Extract a component when it:

* Has a clear visual boundary.
* Represents a meaningful UI section.
* Has independent state.
* Has independent behavior.
* Is reused.
* Has significant conditional rendering.
* Makes the parent component difficult to understand.

Good examples:

```text
ProductBasicInfo
ProductPricing
ProductInventory
ProductImages
ProductDescription
ProductFormActions
```

Bad examples:

```text
ProductNameLabel
ProductNameInput
ProductNameWrapper
ProductNameError
```

when those elements only ever work together.

> **Extract meaningful UI and behavioral units, not individual HTML elements or arbitrary line ranges.**

---

# 26. Avoid God Components

A component is becoming a God Component when it knows too much about unrelated parts of the application.

Warning signs include:

* 500+ lines
* Many `useState` calls
* Many `useEffect` calls
* Multiple API mutations
* Multiple unrelated dialogs
* Many unrelated handlers
* Large conditional rendering blocks
* Deeply nested JSX
* Multiple unrelated UI sections
* Business logic mixed with presentation
* Data fetching mixed with complex rendering

Several of these signs together indicate that refactoring should be considered.

---

# 27. Parent Component Responsibility

The parent component should primarily orchestrate the page or feature.

A good parent should make the overall structure easy to understand.

Example:

```tsx
<ProductBasicInfo />

<ProductPricing />

<ProductInventory />

<ProductImages />

<ProductDescription />

<ProductFormActions />
```

The implementation details should live inside the appropriate components.

The parent should primarily manage:

* Composition
* High-level layout
* Shared form/state context when necessary
* High-level submission behavior
* Overall feature coordination

---

# 28. Child Component Responsibility

Child components should own the details of their specific UI or behavior.

For example:

```text
ProductImages
    ↓
Upload UI
Preview
Delete
Thumbnail selection
Reordering
```

should generally be handled by the product-images feature rather than being implemented as hundreds of lines inside the parent page.

A child should expose a clear interface and avoid unnecessary coupling to unrelated application state.

---

# 29. Avoid Premature Abstraction

Componentization does not mean creating dozens of tiny files.

Do not create abstractions merely to:

* Reduce line count
* Make a file shorter
* Follow an arbitrary component count
* Move a few lines elsewhere

Create an abstraction when it provides meaningful:

* Reuse
* Separation of responsibility
* Testability
* Readability
* Maintainability
* Encapsulation

---

# 30. UI Logic vs Business Logic

UI components should not contain unnecessary business logic.

Prefer:

```text
UI
↓
Hooks / state
↓
API / data layer
↓
Backend
```

Keep:

* API calls
* Data transformation
* Validation
* Business rules
* Complex state transitions

in appropriate layers.

Do not duplicate backend business rules inside frontend components.

---

# 31. Custom Hooks

Use custom hooks when stateful behavior becomes complex or reusable.

Good candidates include:

```text
use-product-form
use-image-upload
use-pagination
use-debounce
use-dialog-state
use-course-filters
```

A custom hook should encapsulate meaningful behavior.

Do not create a hook merely to move a few simple lines out of a component.

---

# 32. API & Data Layer

API communication should follow the project's existing architecture.

For applications using RTK Query:

```text
Component
↓
RTK Query hook
↓
API endpoint
↓
Backend
```

Do not manually duplicate API calls across unrelated components.

Avoid mixing:

```text
fetch()
axios()
RTK Query
```

without a strong architectural reason.

Follow the project's established API strategy.

---

# 33. State Management

Use the smallest appropriate state scope.

Prefer:

```text
Local UI state
↓
Component
```

for simple UI state.

Use:

```text
Custom hook
```

for reusable or complex local behavior.

Use:

```text
Global state
```

only when the state genuinely needs to be shared.

Avoid placing every piece of UI state into global state.

---

# 34. URL State

When UI state naturally belongs in the URL, use URL state.

Examples:

* Search
* Filters
* Pagination
* Tabs
* Selected entities
* Course IDs
* Lesson IDs
* Sort order

Benefits include:

* Refresh persistence
* Deep linking
* Browser navigation
* Shareability
* Better user experience

Do not store URL-worthy state only in local component state.

---

# 35. Avoid Magic Values

Do not scatter arbitrary values throughout components.

Prefer:

* Design tokens
* Shared constants
* Configuration
* Theme variables
* Existing utility classes

Avoid unnecessary repeated values such as:

```tsx
const x = "some-random-value";
```

throughout unrelated components.

Hardcoded values are acceptable when they are genuinely component-specific and meaningful.

---

# 36. Loading States

Every data-driven interface should consider loading behavior.

Use:

* Skeletons
* Loading indicators
* Disabled actions
* Optimistic UI where appropriate

Avoid blank screens while waiting for data.

Loading states should preserve layout stability where practical.

Avoid unnecessary spinners for extremely fast operations.

---

# 37. Empty States

Every data-driven interface should consider the empty state.

Clearly communicate:

1. What is empty
2. Why it may be empty
3. What the user can do next

Good empty states are actionable.

Avoid:

```text
No data.
```

when additional context or an action would help.

---

# 38. Error States

Errors should:

* Be understandable.
* Explain what happened when possible.
* Provide a recovery action when possible.
* Avoid exposing internal implementation details.
* Avoid displaying raw server errors directly to users.

Do not show:

```text
SQLSTATE[23000]
```

or other internal implementation details as user-facing messages.

Translate technical errors into useful UI feedback.

---

# 39. Disabled & Submission States

Interactive operations must communicate state.

For example:

```text
Idle
↓
Submitting
↓
Success
```

or:

```text
Idle
↓
Uploading
↓
Uploaded
```

Prevent accidental duplicate submissions.

Do not allow a user to repeatedly trigger an operation that is already processing unless the behavior is intentionally designed that way.

---

# 40. Images & Media

Images must be:

* Responsive
* Optimized
* Accessible
* Correctly cropped
* Properly sized
* Performance-conscious

Consider:

* Aspect ratio
* Object positioning
* Loading behavior
* Responsive sizing
* Accessibility
* Performance

Do not distort images.

Use appropriate cropping.

Use consistent avatar/image components when available.

---

# 41. Responsive Images

Images must not unexpectedly overflow their containers.

Use appropriate responsive behavior.

Consider:

```text
object-cover
object-contain
aspect-ratio
max-width
responsive sizing
```

depending on the content.

Do not use `object-cover` blindly for images where the full image must remain visible.

---

# 42. Responsive Navigation

Navigation must adapt to screen size.

On mobile, consider:

* Sheet navigation
* Drawer navigation
* Compact navigation
* Bottom navigation where appropriate

On larger screens, consider:

* Sidebars
* Navigation rails
* Persistent navigation
* Expanded navigation

Do not force a large desktop navigation bar onto a small mobile viewport.

---

# 43. Tables

Tables must be designed intentionally for mobile.

When a table cannot reasonably fit on mobile:

Option 1:

```text
Controlled horizontal scrolling
```

Option 2:

```text
Mobile-friendly list/card representation
```

Do not shrink table text until it becomes unreadable.

For data-heavy admin interfaces, horizontal scrolling may be preferable to destroying table readability.

---

# 44. Modals, Dialogs & Sheets

Use dialogs only when the interaction genuinely requires temporary focus.

Use:

* Dialogs for focused tasks.
* Sheets/drawers for larger mobile workflows.
* Full-page layouts for complex multi-step workflows.

Do not place an entire complex application workflow inside a small modal.

Dialogs must:

* Be keyboard accessible.
* Trap focus appropriately.
* Have meaningful titles.
* Have clear close behavior.
* Preserve accessible labeling.

---

# 45. Feedback & Motion

Every meaningful user action should provide appropriate feedback.

Examples:

```text
Click
↓
Visual response

Submit
↓
Loading state

Save
↓
Success/error feedback

Delete
↓
Confirmation or immediate feedback
```

Motion should communicate meaning.

Avoid unnecessary animations.

Animations should:

* Be subtle.
* Support hierarchy.
* Explain transitions.
* Avoid distracting the user.
* Respect reduced-motion preferences where appropriate.

Do not animate every component simply because animation is available.

---

# 46. Navigation Patterns

Use platform-appropriate navigation patterns.

For mobile interfaces, consider:

* Bottom navigation
* Sheet navigation
* Compact top navigation

For desktop applications, consider:

* Sidebar navigation
* Navigation rail
* Top navigation

Choose based on information architecture rather than blindly following a platform.

---

# 47. Platform-Inspired Principles

The design system may take inspiration from:

### Apple

* Clarity
* Deference
* Depth
* Consistency
* Direct manipulation
* Immediate feedback
* Accessibility
* Adaptive typography
* Comfortable touch targets

### Material Design

* Adaptability
* Meaningful motion
* Clear hierarchy
* Responsive layouts
* Elevation when useful
* Strong interaction feedback
* Touch-friendly controls

These principles are references, not requirements to imitate Apple's or Google's visual style.

The product's own design language takes priority.

---

# 48. Design System Consistency

Do not introduce a new visual pattern when an existing pattern already solves the problem.

Before creating a new pattern:

1. Search the existing project.
2. Identify similar components.
3. Reuse existing primitives.
4. Follow existing spacing.
5. Follow existing typography.
6. Follow existing colors/tokens.
7. Extend an existing pattern where appropriate.

The application should feel like one coherent product.

---

# 49. Existing Project First

Before modifying UI, inspect the existing project.

The agent should understand:

* Project structure
* Existing components
* Existing design system
* Existing Shadcn components
* Existing Tailwind configuration
* Existing theme tokens
* Existing typography
* Existing spacing conventions
* Existing API/data patterns
* Existing naming conventions
* Existing responsive patterns

Do not assume the project structure from another project.

Do not copy an architecture blindly from a previous project.

---

# 50. Preserve Existing Functionality

When performing a UI refactor:

> **Improve the architecture without changing product behavior unless explicitly requested.**

Do not unintentionally change:

* API contracts
* Validation rules
* Business rules
* Permissions
* Routes
* Data flow
* Form behavior
* Error behavior
* Loading behavior
* Responsive behavior
* Accessibility behavior

A refactor should normally produce:

```text
Same functionality
+
Better structure
+
Lower complexity
+
Better maintainability
```

---

# 51. Avoid Unrelated Refactoring

When implementing a UI task, do not automatically refactor unrelated code.

Do not change:

* Unrelated API logic
* Backend code
* Database structure
* Authentication
* Routing
* Other features
* Unrelated components

unless the task requires it.

Keep the scope controlled.

---

# 52. Component Naming

Use clear, predictable names.

Prefer:

```text
ProductForm
ProductImages
ProductPricing
ProductInventory
CourseCard
CourseHeader
UserAvatar
OrderSummary
```

Avoid vague names such as:

```text
Box
Thing
Section1
Content2
Wrapper
Stuff
CommonComponent
```

Names should communicate purpose.

---

# 53. File Naming

Follow the project's existing naming convention.

If the project uses kebab-case:

```text
product-form.tsx
product-images.tsx
product-pricing.tsx
```

If the project uses another established convention, follow it.

Do not introduce inconsistent naming styles.

---

# 54. Component Props

Props should be:

* Predictable
* Minimal
* Strongly typed
* Meaningful

Avoid passing large unrelated objects when only a few fields are needed.

Avoid components with excessive prop counts.

If a component requires many unrelated props, review whether:

* The component has too many responsibilities.
* A domain object should be passed.
* A context/provider is appropriate.
* The component should be decomposed.

Do not use `any` simply to make component composition easier.

---

# 55. TypeScript

Use strong TypeScript types.

Prefer:

```text
Explicit interfaces/types
↓
Typed props
↓
Typed API responses
↓
Typed form values
```

Avoid:

```tsx
any
```

unless there is a legitimate unavoidable reason.

Do not weaken types merely to get code compiling.

Reuse existing domain types where appropriate.

Avoid creating duplicate types that represent the same domain concept.

---

# 56. Validation

Frontend validation should follow the project's established validation strategy.

When a schema library such as Zod is already used:

* Reuse existing conventions.
* Keep schemas separate from large UI components when they become substantial.
* Avoid duplicating validation rules unnecessarily.
* Keep frontend validation aligned with backend validation.

Frontend validation improves user experience.

Backend validation remains authoritative.

---

# 57. Business Logic

Do not duplicate backend business rules in UI components.

Bad:

```text
Component decides:
"If stock > 0 and user is admin and payment is verified..."
```

when that is actually a backend business rule.

Prefer:

```text
Frontend
↓
Display state
↓
Send request
↓
Backend validates business rules
↓
Return result
```

Frontend may provide immediate UX validation, but backend rules remain authoritative.

---

# 58. Data Transformation

Complex data transformations should not clutter presentation components.

If transformation becomes substantial:

```text
API data
↓
Transformation
↓
UI model
↓
Component
```

Consider placing transformation logic in:

* Utility functions
* Selectors
* Hooks
* Data layer

according to the project's architecture.

---

# 59. Performance

Avoid unnecessary rendering and expensive UI operations.

Prefer:

* Server components where appropriate
* Lazy loading for heavy components
* Optimized images
* Pagination for large datasets
* Virtualization for very large lists
* Efficient data fetching
* Minimal client-side JavaScript

Do not optimize prematurely.

Measure actual problems before introducing complex optimization.

---

# 60. Client vs Server Components

In Next.js, prefer Server Components by default when the component does not require client-side behavior.

Use Client Components when needed for:

* State
* Effects
* Event handlers
* Browser APIs
* Interactive UI
* Client-side hooks

Do not add `"use client"` to an entire page unnecessarily.

Keep interactive boundaries as small as practical.

---

# 61. Avoid Unnecessary JavaScript

Prefer:

```text
CSS
Tailwind responsive utilities
HTML semantics
Server rendering
```

when they can solve the problem.

Avoid JavaScript for tasks that CSS can handle.

Examples:

* Responsive visibility
* Layout changes
* Basic positioning
* Breakpoints
* Hover states
* Focus states

Do not use runtime viewport detection simply to change layout.

---

# 62. Lists & Large Data

For large datasets:

* Use pagination where appropriate.
* Use virtualization when genuinely necessary.
* Avoid rendering thousands of DOM nodes unnecessarily.
* Use stable keys.
* Avoid expensive calculations during every render.

For admin dashboards, prioritize usability and predictable data presentation over unnecessary animation.

---

# 63. Search & Filtering

Search and filtering interfaces should be responsive and predictable.

Consider:

* URL state
* Debouncing where necessary
* Loading feedback
* Empty results
* Clear filters
* Mobile-friendly controls

Do not debounce every input automatically.

Use debouncing when frequent requests or expensive operations justify it.

Prefer the project's existing React/data-fetching patterns.

---

# 64. Forms With File Uploads

File upload interfaces should clearly communicate:

```text
Idle
↓
Selecting
↓
Uploading
↓
Success
```

or:

```text
Idle
↓
Uploading
↓
Error
```

Provide:

* Preview where useful
* File type guidance
* Size guidance
* Upload progress where available
* Remove/retry actions
* Accessible status feedback

Do not mix all upload infrastructure into a giant page component.

A complex uploader should be its own meaningful feature component.

---

# 65. Rich Text Editors

Rich text editors should be isolated from unrelated form logic when they contain substantial behavior.

For example:

```text
ProductDescription
    ↓
RichTextEditor
    ↓
Editor configuration
    ↓
Upload / extensions / serialization
```

Do not place large editor configuration objects and plugin logic inside an already-large page component unless the project convention specifically requires it.

---

# 66. Confirmation & Destructive Actions

Destructive actions should communicate consequences.

Examples:

* Delete
* Remove
* Cancel changes
* Reject
* Permanently archive

Use appropriate confirmation patterns when the action is irreversible or high-impact.

Do not add confirmation dialogs to harmless actions merely because they exist.

---

# 67. Accessibility of Icon-Only Actions

Icon-only actions must remain understandable.

Use accessible labels:

```text
Delete product
Edit product
Open menu
Close dialog
Upload image
Remove image
```

Do not rely only on the icon's visual meaning.

Use tooltips when appropriate, but do not treat tooltips as the only accessibility mechanism.

---

# 68. Color & Contrast

Use sufficient contrast for text and important UI elements.

As a general accessibility target:

* Normal text should generally meet WCAG AA contrast requirements.
* Important interactive states must remain distinguishable.
* Do not communicate status only through color.

For example:

```text
Success
✓ Icon + text + color
```

is better than:

```text
Green only
```

---

# 69. Focus States

Keyboard focus must always remain visible.

Do not remove focus outlines unless they are replaced with an equally visible accessible focus indicator.

Interactive elements must have a clear focus state.

Test:

```text
Tab
↓
Shift + Tab
↓
Enter
↓
Space
↓
Escape
```

where applicable.

---

# 70. Responsive Content Priority

When space becomes limited, remove or collapse secondary information before sacrificing:

1. Primary content
2. Primary actions
3. Navigation
4. Form usability
5. Readability

Do not make important information tiny just to keep everything visible.

---

# 71. Mobile Form Layout

Forms should normally be single-column on mobile.

Prefer:

```text
Label
Input
Error

Label
Input
Error
```

rather than complex multi-column forms.

Use multi-column layouts when the fields logically belong together and the viewport provides sufficient space.

---

# 72. Desktop Enhancement

Desktop may provide:

* Wider content areas
* Sidebars
* Multi-column layouts
* Cards
* Borders
* Shadows
* Larger spacing
* Additional metadata
* Expanded navigation

Desktop enhancements must not change the fundamental information hierarchy.

---

# 73. Visual Decoration

Use decoration intentionally.

Avoid adding:

* Gradients everywhere
* Excessive shadows
* Excessive rounded corners
* Decorative borders
* Random background shapes
* Excessive icons
* Unnecessary animations
* Glassmorphism without purpose
* Excessive badges

Visual polish should support the product's purpose.

It should not compete with content.

---

# 74. Avoid Generic AI-Generated UI

Do not produce generic-looking interfaces simply because they are easy to generate.

Avoid patterns such as:

* Excessive cards
* Random gradients
* Excessive rounded corners
* Repeated glass effects
* Excessive shadows
* Huge headings without purpose
* Arbitrary color combinations
* Decorative icons everywhere
* Identical card grids for unrelated content

The interface should feel intentionally designed for the product.

Follow the project's existing visual language first.

---

# 75. Design Before Implementation

For significant UI work:

1. Understand the user flow.
2. Understand the information hierarchy.
3. Inspect existing design patterns.
4. Determine mobile layout.
5. Determine tablet layout.
6. Determine desktop enhancement.
7. Identify reusable components.
8. Identify state requirements.
9. Identify loading/error/empty states.
10. Then implement.

Do not begin by blindly writing JSX.

---

# 76. Refactoring Existing UI

When asked to refactor an existing UI:

First inspect:

* Complete page
* Related components
* Existing primitives
* Existing hooks
* API layer
* Types
* Schemas
* Styling conventions

Then identify:

```text
What is UI?
What is state?
What is business logic?
What is API logic?
What is reusable?
What is page-specific?
```

Only then refactor.

---

# 77. UI Refactoring Safety

When refactoring:

Do not change:

* Layout unless requested
* Content unless requested
* Colors unless requested
* API behavior
* Validation
* Business rules
* Routes
* Permissions
* User flow
* Existing functionality

unless the task explicitly includes those changes.

The purpose of architectural refactoring is to improve structure without changing the product.

---

# 78. Before Adding Code to a Large File

If an existing file is already large:

```text
Before adding more code
        ↓
Inspect file size
        ↓
Inspect responsibilities
        ↓
Identify extraction opportunities
        ↓
Reuse existing components
        ↓
Add code in the correct layer
```

Do not continue turning a large component into a larger monolith.

---

# 79. Large Component Decision Tree

When adding functionality to a component:

```text
Is this functionality part of the component's primary responsibility?
        │
        ├── No
        │    ↓
        │  Extract/create appropriate component or layer
        │
        └── Yes
             ↓
       Is the implementation substantial?
             │
             ├── Yes
             │    ↓
             │  Consider extracting meaningful UI/logic
             │
             └── No
                  ↓
             Keep it local
```

Use judgment.

Do not follow line-count rules mechanically.

---

# 80. Recommended Feature Structure

When appropriate, a feature may follow:

```text
features/
└── product/
    ├── components/
    │   ├── product-form.tsx
    │   ├── product-basic-info.tsx
    │   ├── product-pricing.tsx
    │   ├── product-inventory.tsx
    │   ├── product-description.tsx
    │   ├── product-images.tsx
    │   └── product-form-actions.tsx
    │
    ├── hooks/
    │   └── use-product-form.ts
    │
    ├── api/
    │   └── product-api.ts
    │
    ├── schemas/
    │   └── product-schema.ts
    │
    ├── types/
    │   └── product-types.ts
    │
    └── utils/
        └── product-utils.ts
```

This is an example, not a mandatory folder structure.

Follow the project's established conventions first.

---

# 81. Avoid Duplicate Components

Before creating a component:

1. Search the project.
2. Find similar components.
3. Determine whether the existing component can be reused.
4. Determine whether it can be extended.
5. Only create a new component if necessary.

Do not create:

```text
ProductCard
ProductCardNew
ProductCardV2
ProductCardImproved
ProductCardAdmin
```

when one well-designed component can support the required variants.

---

# 82. Variants Over Duplication

When components share the same fundamental behavior but need different appearances, prefer a variant system where appropriate.

For example:

```text
Button
├── primary
├── secondary
├── destructive
└── ghost
```

instead of separate button components.

However, do not create complicated variant systems for components that are fundamentally different.

---

# 83. Avoid Prop Drilling

If data is passed through many unrelated component layers only to reach a deeply nested component, review the architecture.

Consider:

* Component composition
* Context
* Feature-level hooks
* State management
* Better component boundaries

Do not introduce global state merely to solve a small prop-passing problem.

---

# 84. Testing Considerations

UI architecture should make important behavior testable.

Meaningful components should be easy to test independently.

Separate complex logic from presentation where doing so improves testability.

When available, run:

```text
Lint
Typecheck
Unit tests
Integration tests
Relevant build checks
```

after implementation.

---

# 85. Code Quality

Prefer code that is:

* Readable
* Predictable
* Typed
* Modular
* Consistent
* Easy to modify

Avoid clever abstractions that make straightforward UI harder to understand.

Prefer boring, obvious code over unnecessarily clever code.

---

# 86. AI Coding Agent Workflow

When modifying or creating UI, an AI coding agent must follow this workflow.

## Step 1 — Inspect

Inspect:

* Project structure
* Relevant page
* Related components
* Existing design system
* Existing Shadcn components
* Existing hooks
* Existing API/data layer
* Existing types
* Existing schemas
* Existing responsive patterns

Do not assume architecture.

---

## Step 2 — Understand

Determine:

* What the current UI does
* What data it uses
* What state it manages
* What API calls it makes
* What components already exist
* What design patterns are already established

---

## Step 3 — Plan

Before significant implementation, determine:

* Mobile layout
* Desktop enhancement
* Component boundaries
* State boundaries
* API/data boundaries
* Loading states
* Error states
* Empty states
* Accessibility requirements

---

## Step 4 — Implement

Implement using:

* Existing primitives
* Existing design tokens
* Existing project conventions
* Mobile-first Tailwind
* Strong TypeScript
* Meaningful component boundaries

---

## Step 5 — Verify

Verify:

### Functionality

* Existing functionality still works.
* API behavior is preserved.
* Validation is preserved.
* Business logic is preserved.

### Responsive

* Mobile
* Tablet
* Desktop

### Theme

* Light mode
* Dark mode

### Accessibility

* Keyboard
* Focus
* Labels
* Contrast
* Screen-reader semantics
* Touch targets

### States

* Loading
* Empty
* Error
* Disabled
* Success

### Code quality

* Lint
* Typecheck
* Tests
* Build

when available.

---

# 87. AI Agent Component Size Rules

AI coding agents must follow these guidelines when creating or modifying components.

### Under 200 lines

No special action required.

Still maintain clear responsibility.

### 200–300 lines

Review the component.

Ask:

* Does it have multiple responsibilities?
* Are there clear independent sections?
* Is there duplicated logic?

Refactor if meaningful boundaries exist.

### 300–500 lines

Perform an architecture review.

Look for:

* Independent sections
* Large JSX blocks
* Complex state
* API logic
* Validation
* Reusable behavior

Refactoring is recommended when meaningful boundaries exist.

### Over 500 lines

Treat this as a strong refactoring signal.

Before adding significant functionality:

1. Analyze responsibilities.
2. Identify meaningful extraction points.
3. Check existing project patterns.
4. Separate UI from complex logic where appropriate.
5. Refactor without changing behavior.

Do not leave a 500+ line component untouched simply because the code technically works.

---

# 88. Do Not Over-Refactor

The opposite problem is also undesirable.

Do not transform:

```text
100-line simple component
```

into:

```text
12 files
3 hooks
2 contexts
4 utility functions
```

without a meaningful reason.

Complexity should be reduced, not redistributed.

---

# 89. Definition of Good Component Architecture

Good component architecture means:

```text
Clear responsibility
+
Reasonable file size
+
Meaningful boundaries
+
Minimal coupling
+
Strong typing
+
Reusable primitives
+
Separated complex logic
+
Readable composition
```

Bad architecture means:

```text
Huge page
+
Many unrelated responsibilities
+
Duplicated UI
+
Duplicated logic
+
Hardcoded values
+
Complex state
+
Difficult testing
```

---

# 90. Final UI Audit

Before considering a UI task complete, review the following.

## Mobile

* Does content use the available width effectively?
* Are unnecessary borders removed?
* Are unnecessary cards flattened?
* Is horizontal padding appropriate?
* Are controls easy to tap?
* Is text readable?
* Is there unnecessary nested UI?
* Is important content prioritized?

## Tablet

* Does the layout use available space effectively?
* Do columns appear at appropriate breakpoints?
* Is spacing balanced?
* Are controls still comfortable?

## Desktop

* Is content appropriately constrained?
* Are cards and borders used intentionally?
* Is visual hierarchy clear?
* Is whitespace intentional?
* Does the layout take advantage of additional space?

## Theme

* Does light mode work?
* Does dark mode work?
* Are semantic tokens used?
* Are there unnecessary `dark:` overrides?

## Accessibility

* Can the interface be navigated with a keyboard?
* Are controls labeled?
* Are focus states visible?
* Is contrast sufficient?
* Are semantic HTML elements used?
* Are touch targets comfortable?

## Architecture

* Does every component have a clear responsibility?
* Is the page unnecessarily large?
* Is any component above 500 lines?
* If so, has it been reviewed for decomposition?
* Can independent UI sections be isolated?
* Are existing components being reused?
* Is business logic separated from presentation?
* Is API/data logic in the appropriate layer?
* Are there unnecessary abstractions?
* Are there duplicated components?

## Performance

* Are unnecessary client components avoided?
* Are images optimized?
* Are large datasets handled appropriately?
* Is unnecessary rendering avoided?
* Is expensive work justified?

## Quality

* Does lint pass?
* Does typecheck pass?
* Do relevant tests pass?
* Does the project build successfully?
* Were unrelated files left unchanged?

---

# 91. Non-Negotiable Rules

The following rules should be treated as default engineering requirements.

### 1.

> **Mobile-first is mandatory unless the product explicitly requires otherwise.**

### 2.

> **Accessibility is not optional.**

### 3.

> **Reuse existing components before creating new ones.**

### 4.

> **Use semantic design tokens instead of hardcoded colors when tokens exist.**

### 5.

> **Do not create unnecessary nested containers or cards.**

### 6.

> **One file should have one primary responsibility.**

### 7.

> **500+ line components are a strong refactoring signal.**

### 8.

> **Do not split components merely to reduce line count. Extract meaningful responsibilities.**

### 9.

> **Keep business logic and complex data logic out of presentation components when appropriate.**

### 10.

> **Do not duplicate existing project patterns.**

### 11.

> **Do not introduce unrelated refactoring.**

### 12.

> **Preserve existing functionality unless the task explicitly requires behavior changes.**

### 13.

> **Use responsive CSS/Tailwind rather than JavaScript viewport detection whenever possible.**

### 14.

> **Do not use decoration to compensate for poor information hierarchy.**

### 15.

> **The final code should be as maintainable as the final UI is visually polished.**

---

# 92. Core Architecture Model

The preferred mental model is:

```text
                    PAGE
                     │
                     ▼
              FEATURE COMPONENTS
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
       UI STATE             UI COMPONENTS
          │                     │
          ▼                     ▼
       HOOKS              SHADCN / PRIMITIVES
          │
          ▼
      API / DATA LAYER
          │
          ▼
       BACKEND
```

Not every feature requires every layer.

Use the smallest architecture that keeps responsibilities clear.

---

# 93. Final Principle

A high-quality frontend is not simply:

```text
Beautiful UI
```

It is:

```text
Beautiful UI
+
Accessible UX
+
Responsive behavior
+
Clear information hierarchy
+
Reusable components
+
Reasonable file sizes
+
Separated responsibilities
+
Strong TypeScript
+
Predictable state
+
Clean data flow
+
Maintainable architecture
```

The objective is not to create the most sophisticated frontend architecture.

The objective is to create the **simplest architecture that remains easy to understand, maintain, test, and extend as the application grows.**

> **Design the interface for people. Structure the code for developers. Build both for the future.**

```
```
