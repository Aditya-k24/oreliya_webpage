# Oreliya Design System

Luxury Indian jewelry brand. Editorial, restrained, craft-forward. Think Cartier meets contemporary India — not a generic e-commerce template.

---

## Color Tokens

Never use raw hex codes in components. Reference these tokens by name or CSS variable.

| Token               | Value     | CSS Var                 | Usage                                                |
| ------------------- | --------- | ----------------------- | ---------------------------------------------------- |
| `brand-green`       | `#1E240A` | `--oreliya-green`       | Primary — buttons, footer bg, borders, headings      |
| `brand-green-hover` | `#2A3A1A` | `--oreliya-green-light` | Hover state for brand-green fills                    |
| `cream`             | `#F6EEDF` | `--oreliya-off-white`   | Warm page backgrounds, text on dark, dividers        |
| `white`             | `#FFFFFF` | `--oreliya-white`       | Cards, inputs, reversed button states                |
| `near-white`        | `#F8F8F8` | `--oreliya-gray`        | Subtle section alternates                            |
| `black`             | `#000000` | `--oreliya-black`       | Rarely used — prefer `brand-green` for dark elements |

### Opacity variants in use

- `white/70` — muted body text on dark backgrounds
- `white/90` — near-full text on dark backgrounds
- `[#F6EEDF]/90` — cream text at high opacity
- `[#F6EEDF]/20` — cream as subtle border on dark bg
- `[#1E240A]/20` — brand-green shadow tint

---

## Typography Scale

Two fonts. Serif for display. Sans for everything else. Never mix weights randomly.

### Fonts

```
Display: 'Playfair Display', serif   — headings, pull quotes, editorial moments
Body:    'Inter', system-ui, sans-serif — all other text
```

### Scale (8px base grid)

| Step       | Size            | Line-height | Weight | Usage                                          |
| ---------- | --------------- | ----------- | ------ | ---------------------------------------------- |
| `display`  | 3.5rem (56px)   | 1.1         | 600    | Hero headings (h1)                             |
| `title`    | 2.5rem (40px)   | 1.2         | 500    | Section headings (h2)                          |
| `subtitle` | 2rem (32px)     | 1.3         | 500    | Sub-section headings (h3)                      |
| `label`    | 0.875rem (14px) | —           | 500    | Section labels — UPPERCASE, `tracking-[0.2em]` |
| `body-lg`  | 1.125rem (18px) | relaxed     | 300    | Lead paragraphs                                |
| `body`     | 1rem (16px)     | 1.6         | 400    | Default body copy                              |
| `body-sm`  | 0.875rem (14px) | relaxed     | 300    | Captions, nav links, metadata                  |
| `button`   | 0.875rem (14px) | —           | 500    | Buttons — UPPERCASE, `tracking-wider`          |

### Rules

- All headings: `font-family: 'Playfair Display'`, `letter-spacing: -0.02em`
- Section labels always: `text-sm font-medium uppercase tracking-[0.2em]`
- Body text on dark: `font-light tracking-wide`
- Never use font-bold on display headings — 500 or 600 only
- Never use Inter for headings

---

## Spacing System

8px base grid. All spacing values are multiples of 8.

| Token      | Value | Tailwind        | Usage                                    |
| ---------- | ----- | --------------- | ---------------------------------------- |
| `space-1`  | 8px   | `p-2` / `gap-2` | Tight — icon padding, inline gaps        |
| `space-2`  | 16px  | `p-4` / `gap-4` | Form fields, small card padding          |
| `space-3`  | 24px  | `p-6` / `gap-6` | Card padding, grid gaps                  |
| `space-4`  | 32px  | `p-8` / `gap-8` | Button padding (x), section subdivisions |
| `space-6`  | 48px  | `py-12`         | Compact sections                         |
| `space-8`  | 64px  | `gap-16`        | Column gaps in multi-column layouts      |
| `space-10` | 80px  | `py-20`         | Section vertical padding (standard)      |
| `space-12` | 96px  | `gap-24`        | Large column gaps                        |

### Layout containers

```
Max width:   max-w-7xl mx-auto          — all page content
Horizontal:  px-6 lg:px-8              — all sections
Section pad: py-20 px-6 lg:px-8        — standard section rhythm
```

### Grid patterns

```
Products:     grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
Footer cols:  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-20
Category:     aspect-[4/5]             — portrait card ratio
```

---

## Component Patterns

### Buttons

Four variants. All share: `relative overflow-hidden`, shimmer `::before` pseudo-element, `uppercase tracking-wider text-sm`, `py-4 px-8`, `rounded`, `transition-all duration-500 ease-out`, `hover:-translate-y-0.5 hover:scale-[1.02]`, `active:scale-[0.98]`.

**Primary** — dark fill, inverts on hover

```tsx
className = 'btn-primary';
// bg: brand-green → white on hover
// text: white → brand-green on hover
// border: brand-green throughout
```

**Secondary** — white fill, inverts on hover

```tsx
className = 'btn-secondary';
// bg: white → brand-green on hover
// text: brand-green → white on hover
```

**Outline** — transparent, fills on hover

```tsx
className = 'btn-outline';
// bg: transparent → brand-green on hover
// border-2 brand-green
```

**White outline** — for dark/green backgrounds only

```tsx
className = 'btn-white-outline';
// bg: transparent → white on hover
// text: white → brand-green on hover
// py-3 px-6 (slightly smaller)
```

### Cards

```tsx
className =
  'bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300';
// card class: .card
// No border-radius beyond rounded (4px)
```

### Product image cards

```tsx
// Portrait ratio, rounded, scale on hover
className =
  'relative w-full aspect-[4/5] rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105';
// Always use <Image fill> with sizes prop
```

### Form inputs

```tsx
className = 'input-field';
// Bottom border only — no box
// border-b border-gray-300 focus:border-[#1E240A]
// bg-transparent, no focus ring (outline-none)
// placeholder: gray-500
// transition-colors duration-300
```

### Section label (ornament pattern)

```tsx
// Section opener — always this structure on dark bg:
<h3 className="text-[#F6EEDF] text-sm font-medium uppercase tracking-[0.2em] mb-8 pb-2 border-b border-[#F6EEDF]/20">
  Section Title
</h3>

// Decorative rule (centered):
<div className="w-24 h-px bg-[#F6EEDF] mx-auto mb-8" />

// Gradient divider:
<div className="h-px bg-gradient-to-r from-transparent via-[#F6EEDF] to-transparent opacity-50" />
```

### Footer structure

```tsx
<footer className='bg-[#1E240A] text-white relative overflow-hidden'>
  {/* Subtle radial gradient texture */}
  <div className='absolute inset-0 opacity-5'>
    <div className='absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-[#F6EEDF] to-transparent' />
  </div>
  <div className='relative max-w-7xl mx-auto px-6 lg:px-8'>{/* content */}</div>
</footer>
```

---

## Transitions & Animation

- Default: `transition-all duration-300`
- Buttons: `transition-all duration-500 ease-out`
- Shimmer on button hover: `::before` pseudo-element slides `left: -100% → 100%` via `transition: left 0.5s ease-out`
- Image zoom: `transition-transform duration-300 group-hover:scale-105`
- Shadow lift: `hover:shadow-md` (cards)
- Button lift: `hover:-translate-y-0.5 hover:scale-[1.02]`
- Button press: `active:scale-[0.98] transition-duration-100ms`

Never use `animate-bounce`, `animate-ping`, or rapid flashing animations. Motion should feel physical and deliberate.

---

## What to Avoid — Anti-patterns

These patterns produce generic AI aesthetic. Never use them in this codebase.

### Colors

- ❌ Random Tailwind colors: `bg-blue-500`, `text-purple-600`, `border-indigo-300`
- ❌ Pure black text `text-black` — use `text-gray-900` or `text-[#1E240A]`
- ❌ Bright/saturated accents — this palette is muted, natural, earthy
- ❌ Gradients on backgrounds (except the footer radial texture at opacity-5)

### Typography

- ❌ `font-bold` on headings — use 500 or 600 only
- ❌ Inter for headings — always Playfair Display
- ❌ `text-xs` for body content — minimum `text-sm`
- ❌ Tight line-height on body text — always 1.6 minimum
- ❌ Random tracking values — use `tracking-[0.2em]` for labels, `tracking-wider` for buttons

### Buttons

- ❌ `rounded-full` pill buttons — use `rounded` (4px)
- ❌ `rounded-xl` or `rounded-2xl` on any component
- ❌ Colored shadows that don't match brand: `hover:shadow-blue-500/20`
- ❌ Buttons without hover states
- ❌ Icon-only buttons without accessible labels

### Layout

- ❌ Full-width sections without `max-w-7xl mx-auto`
- ❌ Padding below 8px grid — no `p-3`, `p-5`, `p-7`
- ❌ `gap-3` in major grids — use `gap-6` minimum
- ❌ Inline styles for spacing — always Tailwind tokens

### General

- ❌ Emoji in UI (except admin/debug pages)
- ❌ Lorem ipsum text
- ❌ Placeholder gray boxes instead of real empty states
- ❌ `text-center` on long body paragraphs (only section headers)
- ❌ `shadow-xl` or `shadow-2xl` — this UI uses `shadow-sm` / `shadow-md`
- ❌ Borders everywhere — use borders sparingly, prefer space and shadow

---

## Images

- Product images: always `SignedImage` component (handles Supabase signed URL refresh)
- Static assets: `next/image` with explicit `sizes` prop
- Category cards: `aspect-[4/5]`, `fill` layout, `object-cover`
- Logo: SVG from `/assets/logos/` — two variants (`logo-white.svg`, `logo-mark-white.svg`)
- Never `<img>` tags in production components — always `next/image` or `SignedImage`

---

## Brand Voice (copy style)

- Tone: quiet confidence, not exclamatory
- ❌ "Amazing deals!", "Shop now!", "Limited time!"
- ✅ "Crafted for permanence.", "Worn for a lifetime.", "Made to order."
- Labels: sentence case for body, ALL CAPS for section labels and buttons
- Product descriptions: factual first (metal, stone, clarity), then evocative
