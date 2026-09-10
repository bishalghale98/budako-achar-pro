# Buda Ko Achar — Design Pattern System

## Brand Palette

| Token | Hex | Tailwind Class | Role |
|-------|-----|----------------|------|
| `maroon` | `#7A1F1F` | `bg-maroon`, `text-maroon` | Primary brand |
| `maroon-hover` | `#651919` | `bg-maroon-hover` | Hover state |
| `maroon-dark` | `#9E2A2B` | `bg-maroon-dark` | Dark-mode primary |
| `gold` | `#F2B705` | `bg-gold`, `text-gold` | Accent |
| `cream` | `#FFF3E0` | `bg-cream` | Brand neutral |
| `darkText` | `#1A1A1A` | `text-darkText`, `bg-darkText` | Headings / footer bg |
| `mutedText` | `#64748B` | `text-mutedText` | Secondary text |
| `lightBg` | `#F8F6F2` | `bg-lightBg` | Page background |
| `darkBg` | `#120E0E` | `bg-darkBg` | Dark-mode bg |
| `darkSurface` | `#1A1212` | `bg-darkSurface` | Dark-mode surface |
| `darkMuted` | `#A89F91` | `text-darkMuted` | Dark-mode muted text |

### Color Distribution (Light Mode)

```
70–80%  Neutrals   lightBg, white, darkText, gray-*
15–20%  Maroon     buttons, headings, active states, CTA sections
5–10%   Gold       badges, ratings, accents, highlights
```

---

## Typography

**Fonts:** Playfair Display (serif) + Inter (sans-serif)

| Element | Classes |
|---------|---------|
| H1 Hero | `font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-darkText leading-tight` |
| H1 Page | `font-serif text-3xl lg:text-4xl font-bold text-darkText` |
| H2 Section | `font-serif text-3xl font-bold text-darkText` |
| H3 Card | `font-serif font-bold text-lg text-darkText` |
| Body | `text-gray-600` or `text-gray-600 leading-relaxed` |
| Small | `text-sm text-gray-600` |
| Label | `text-xs font-bold uppercase text-gray-500` |
| Section tag | `text-maroon font-semibold text-sm tracking-wider uppercase` |
| Price | `font-bold text-maroon text-lg` |

**Selection:** `selection:bg-gold selection:text-maroon`

---

## Layout

### Container

```
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

### Page Skeleton

```
<body class="font-sans bg-lightBg text-darkText antialiased">
  <header>  sticky, z-50, bg-white/95, backdrop-blur, border-b
  <main>
  <footer>  bg-darkText, text-gray-400
  [WhatsApp FAB]
</body>
```

### Section Spacing

| Pattern | Usage |
|---------|-------|
| `py-16` | Hero, featured products |
| `py-20` | Brand story, why-us, reviews |
| `py-12` | Product listing, cart, checkout |
| `py-8` | Trust bar |
| `mb-16` | Section header bottom margin |
| `mb-10` | Section header flex variant |

### Grid Systems

| Layout | Classes |
|--------|---------|
| 2-col split | `grid-cols-1 lg:grid-cols-2 gap-12` |
| 3-col cards | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8` |
| 4-col features | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6` |
| Sidebar layout | `grid-cols-1 lg:grid-cols-3 gap-8` |
| Form fields | `grid-cols-1 sm:grid-cols-2 gap-4` |

---

## Navigation

### Header

```
<header class="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
    Logo | Nav links | Actions (cart + mobile toggle)
  </div>
</header>
```

### Desktop Nav

```
hidden md:flex items-center gap-8 font-medium text-sm text-gray-700
Active:  text-maroon font-semibold
Inactive: hover:text-maroon transition
```

### Mobile Menu

```
Toggle:  md:hidden, hamburger SVG
Drawer:  hidden md:hidden, bg-white, border-b, px-4, space-y-3
Links:   block py-2 text-maroon font-semibold (active)
         block py-2 text-gray-700 (inactive)
```

### Simplified Header (sub-pages)

Cart, checkout, order-tracking use logo-only header.
Terms, privacy use minimal `py-4 px-6` header.

---

## Components

### Buttons

| Variant | Classes |
|---------|---------|
| Primary | `bg-maroon text-white font-medium rounded-lg hover:bg-maroon-hover transition` |
| Accent | `bg-gold text-maroon font-bold rounded-lg hover:brightness-110 transition` |
| Secondary | `bg-white text-darkText border border-gray-300 rounded-lg hover:bg-gray-50 transition` |
| Ghost | `text-maroon font-semibold hover:underline` |
| Danger | `text-red-500 hover:text-red-700 text-sm font-medium` |

**Sizes:**

| Size | Classes |
|------|---------|
| Large | `px-8 py-3.5` |
| Medium | `px-6 py-2` |
| Small | `px-4 py-2 text-sm` |
| Tiny | `px-3 py-1.5 text-xs` |

### Cards

**Product Card:**
```
bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition group
```
- Image: `h-60 bg-gray-100 overflow-hidden relative`
- Image hover: `group-hover:scale-105 transition duration-300`
- Content: `p-5`
- Badge: `absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-semibold text-maroon shadow-sm`

**Review Card:**
```
bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between
```
- Divider: `mt-6 pt-4 border-t border-gray-100`

**Feature Card:**
```
bg-white p-6 rounded-xl border border-gray-200 shadow-sm
```
- Number icon: `w-12 h-12 bg-maroon/10 text-maroon rounded-lg flex items-center justify-center font-bold text-xl mb-4`

**Cart Item:**
```
bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between
```
- Thumbnail: `w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0`

**Order Summary:**
```
bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit space-y-4
```
- Total row: `flex justify-between font-bold text-darkText text-base pt-2 border-t border-gray-100`

### Trust Bar

```
bg-white border-y border-gray-200 py-8
```
- Icons: `w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center`
- Gold icons: `text-gold bg-gold/10`
- Maroon icons: `text-maroon bg-maroon/10`

### Timeline (Order Tracking)

| State | Classes |
|-------|---------|
| Completed | `w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold` |
| Active | `w-8 h-8 rounded-full bg-gold text-maroon flex items-center justify-center text-xs font-bold` |
| Pending | `w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold` + `opacity-50` wrapper |

### Success Card

```
max-w-md w-full bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center space-y-6
```
- Check icon: `w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold`

---

## Forms

### Input

```
w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-maroon
```

### Label

```
block text-xs font-bold uppercase text-gray-500 mb-1
```

### Disabled/Pre-filled

```
w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50
```

### Select

```
w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-maroon
```

### Radio Button

```
flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50
```
- Input: `text-maroon focus:ring-maroon`

### Quantity Selector

```
inline-flex items-center border border-gray-300 rounded-lg bg-white
```
- Buttons: `px-3 py-1 text-gray-600 hover:bg-gray-100`
- Value: `px-4 py-1 text-sm font-semibold`

### Textarea

```
w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-maroon rows="4"
```

### Submit

```
w-full py-3 bg-maroon text-white font-medium rounded-lg hover:bg-maroon-hover transition text-sm
```

### Layout

- Stacked: `space-y-4`
- Side-by-side: `grid grid-cols-1 sm:grid-cols-2 gap-4`
- Search/sort: `flex flex-col sm:flex-row gap-4 items-center justify-between`

---

## Images

### Standard

```
w-full h-full object-cover
```

### Containers

| Context | Classes |
|---------|---------|
| Product card (home) | `h-60 bg-gray-100 overflow-hidden relative` |
| Product card (listing) | `h-52 bg-gray-100 relative` |
| Hero featured | `h-80 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center relative` |
| Product detail main | `h-96 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm` |
| Thumbnail | `h-20 bg-white border border-maroon rounded-lg overflow-hidden cursor-pointer` |
| Cart thumb | `w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0` |

### Badges on Images

```
absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-semibold text-maroon shadow-sm
```

### Source Pattern

```
https://images.unsplash.com/photo-XXXX?w=500&auto=format&fit=crop&q=80
```

---

## Footer

### Full Footer (index)

```
bg-darkText text-gray-400 py-16 border-t border-gray-800
```
- Grid: `grid grid-cols-1 md:grid-cols-4 gap-10`
- Brand: `font-serif text-xl font-bold text-white`
- Column header: `font-bold text-white text-sm mb-4`
- Links: `hover:text-white transition`

### Minimal Footer (sub-pages)

```
bg-darkText text-gray-400 py-12 border-t border-gray-800
```
- `max-w-7xl mx-auto px-4 text-center text-sm`

### Ultra-minimal (terms, privacy)

```
text-center py-6 text-xs text-gray-500 border-t border-gray-200
```

---

## CTA Sections

### Full-width CTA

```
bg-maroon py-16 text-white text-center
```
- Container: `max-w-4xl mx-auto px-4`
- Title: `font-serif text-3xl sm:text-4xl font-bold mb-4`
- Desc: `text-gray-200 max-w-xl mx-auto mb-8`
- Button: `inline-block px-8 py-4 bg-gold text-maroon font-bold rounded-lg shadow hover:brightness-110 transition`

### Hero Gradient

```
bg-gradient-to-br from-maroon/5 via-white to-gold/10
```

### Section Header

```
<div class="flex flex-col md:flex-row md:items-end justify-between mb-10">
  <div>
    <span class="text-maroon font-semibold text-sm tracking-wider uppercase">Tag</span>
    <h2 class="font-serif text-3xl font-bold text-darkText mt-1">Title</h2>
  </div>
  <a class="mt-4 md:mt-0 text-maroon font-semibold hover:underline">Link →</a>
</div>
```

### Centered Section Header

```
<div class="text-center max-w-2xl mx-auto mb-16">
  <span class="text-maroon font-semibold text-sm tracking-wider uppercase">Tag</span>
  <h2 class="font-serif text-3xl font-bold text-darkText mt-1">Title</h2>
</div>
```

---

## WhatsApp FAB

```
fixed bottom-6 right-6 z-50 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#20ba59] transition flex items-center gap-2 font-medium text-sm
```

---

## Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| Default | Single column, stacked, mobile nav |
| `sm:` | 2-col grids, side-by-side forms, horizontal buttons |
| `md:` | Desktop nav visible, 3-col grids |
| `lg:` | 2-col splits, sidebar layouts, 4-col grids |

---

## Interactive States

| Element | Hover | Transition |
|---------|-------|------------|
| Primary button | `hover:bg-maroon-hover` | `transition` |
| Accent button | `hover:brightness-110` | `transition` |
| Card | `hover:shadow-md` | `transition` |
| Product image | `group-hover:scale-105` | `transition duration-300` |
| Nav link | `hover:text-maroon` | `transition` |
| Footer link | `hover:text-white` | `transition` |
| Input focus | `focus:border-maroon` | `focus:outline-none` |
| Radio focus | `focus:ring-maroon` | — |

---

## File Structure

```
testui/
├── index.html          # Home — hero, featured, brand story, why-us, reviews, CTA, full footer
├── products.html       # Product listing — search/sort, 3-col grid, sidebar filters
├── product-details.html # Single product — image gallery, quantity, add-to-cart
├── cart.html           # Cart — item list, order summary sidebar
├── checkout.html       # Checkout — form, payment, order summary
├── order-success.html  # Success — centered card
├── order-tracking.html # Tracking — timeline steps
├── about.html          # About — brand story, timeline, values
├── contact.html        # Contact — form, info cards, map placeholder
├── terms.html          # Terms of Service
├── privacy.html        # Privacy Policy
└── DESIGN-PATTERNS.md  # This file
```

### Component Duplication

All 11 files share identical:
- Tailwind config (inline `<script>`)
- Google Fonts link
- Header structure (varies by page)
- Footer (3 variants)
- WhatsApp FAB

No shared CSS/JS files. No component extraction. Copy-paste across all files.

---

## Notes

- Dark mode tokens defined (`darkBg`, `darkSurface`, `darkMuted`, `maroon-dark`) but not implemented
- `cream` and `mutedText` tokens defined but unused
- Cart badge hardcoded to `2`
- Mobile menu JS only on `index.html`
- No form validation, no loading states, no pagination
- All icons are inline Heroicons SVGs (no icon library)
