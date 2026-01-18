# Design System

**Phase:** 4 - Design System
**Timestamp:** 2026-01-18T10:15:00Z

---

## Color Palette

### Semantic Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--background` | `#FFFFFF` | `#0A0A0A` | Page background |
| `--foreground` | `#0A0A0A` | `#FAFAFA` | Primary text |
| `--card` | `#FFFFFF` | `#141414` | Card backgrounds |
| `--card-foreground` | `#0A0A0A` | `#FAFAFA` | Card text |
| `--popover` | `#FFFFFF` | `#141414` | Popover backgrounds |
| `--popover-foreground` | `#0A0A0A` | `#FAFAFA` | Popover text |
| `--primary` | `#0A0A0A` | `#FAFAFA` | Primary buttons, links |
| `--primary-foreground` | `#FAFAFA` | `#0A0A0A` | Text on primary |
| `--secondary` | `#F4F4F5` | `#27272A` | Secondary buttons |
| `--secondary-foreground` | `#0A0A0A` | `#FAFAFA` | Text on secondary |
| `--muted` | `#F4F4F5` | `#27272A` | Muted backgrounds |
| `--muted-foreground` | `#71717A` | `#A1A1AA` | Muted text |
| `--accent` | `#6366F1` | `#818CF8` | Accent color |
| `--accent-foreground` | `#FFFFFF` | `#FFFFFF` | Text on accent |
| `--destructive` | `#EF4444` | `#DC2626` | Error states |
| `--destructive-foreground` | `#FFFFFF` | `#FFFFFF` | Text on destructive |
| `--border` | `#E4E4E7` | `#27272A` | Borders |
| `--input` | `#E4E4E7` | `#27272A` | Input borders |
| `--ring` | `#0A0A0A` | `#FAFAFA` | Focus rings |

### CSS Variables

```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 4%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 4%;
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 4%;
  --primary: 0 0% 4%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 5% 96%;
  --secondary-foreground: 0 0% 4%;
  --muted: 240 5% 96%;
  --muted-foreground: 240 4% 46%;
  --accent: 239 84% 67%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 240 6% 90%;
  --input: 240 6% 90%;
  --ring: 0 0% 4%;
  --radius: 0.5rem;
}

.dark {
  --background: 0 0% 4%;
  --foreground: 0 0% 98%;
  --card: 0 0% 8%;
  --card-foreground: 0 0% 98%;
  --popover: 0 0% 8%;
  --popover-foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 0 0% 4%;
  --secondary: 240 4% 16%;
  --secondary-foreground: 0 0% 98%;
  --muted: 240 4% 16%;
  --muted-foreground: 240 5% 65%;
  --accent: 239 84% 74%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 72% 51%;
  --destructive-foreground: 0 0% 100%;
  --border: 240 4% 16%;
  --input: 240 4% 16%;
  --ring: 0 0% 98%;
}
```

---

## Typography

### Font Stack

```typescript
// lib/fonts.ts
import { Inter, JetBrains_Mono } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});
```

### Type Scale

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| Display | 72px / 4.5rem | 700 | 1.0 | -0.02em |
| H1 | 48px / 3rem | 700 | 1.1 | -0.02em |
| H2 | 36px / 2.25rem | 600 | 1.2 | -0.01em |
| H3 | 24px / 1.5rem | 600 | 1.3 | 0 |
| H4 | 20px / 1.25rem | 600 | 1.4 | 0 |
| Body Large | 18px / 1.125rem | 400 | 1.6 | 0 |
| Body | 16px / 1rem | 400 | 1.6 | 0 |
| Body Small | 14px / 0.875rem | 400 | 1.5 | 0 |
| Caption | 12px / 0.75rem | 500 | 1.4 | 0.02em |

### Tailwind Typography Classes

```css
/* Utility classes */
.text-display { @apply text-7xl font-bold tracking-tight leading-none; }
.text-h1 { @apply text-5xl font-bold tracking-tight; }
.text-h2 { @apply text-4xl font-semibold tracking-tight; }
.text-h3 { @apply text-2xl font-semibold; }
.text-h4 { @apply text-xl font-semibold; }
.text-body-lg { @apply text-lg leading-relaxed; }
.text-body { @apply text-base leading-relaxed; }
.text-body-sm { @apply text-sm leading-normal; }
.text-caption { @apply text-xs font-medium tracking-wide uppercase; }
```

---

## Spacing Scale

Based on 4px base unit.

| Token | Value | Usage |
|-------|-------|-------|
| `1` | 4px | Tight gaps |
| `2` | 8px | Icon gaps |
| `3` | 12px | Small padding |
| `4` | 16px | Default padding |
| `6` | 24px | Section gaps |
| `8` | 32px | Component spacing |
| `12` | 48px | Section padding |
| `16` | 64px | Large sections |
| `24` | 96px | Page sections |
| `32` | 128px | Hero sections |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Small buttons, badges |
| `--radius` | 8px | Cards, inputs |
| `--radius-md` | 12px | Larger cards |
| `--radius-lg` | 16px | Modals, large containers |
| `--radius-xl` | 24px | Hero elements |
| `--radius-full` | 9999px | Pills, avatars |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| `--shadow` | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | Cards |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)` | Dropdowns |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | Modals |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)` | Large overlays |

---

## Animation

### Timing Functions

```css
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}
```

### Duration Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | 150ms | Micro-interactions |
| `--duration-base` | 300ms | Standard transitions |
| `--duration-slow` | 500ms | Page transitions |

### Framer Motion Variants

```typescript
// lib/animations.ts
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
};

export const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.1 },
  },
};

export const scaleOnHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.15 },
};
```

---

## Components

### Button Variants

| Variant | Background | Text | Border |
|---------|------------|------|--------|
| Primary | `--primary` | `--primary-foreground` | none |
| Secondary | `--secondary` | `--secondary-foreground` | none |
| Outline | transparent | `--foreground` | `--border` |
| Ghost | transparent | `--foreground` | none |
| Link | transparent | `--primary` | none |

### Button Sizes

| Size | Padding | Font Size | Height |
|------|---------|-----------|--------|
| sm | `px-3 py-1.5` | 14px | 32px |
| md | `px-4 py-2` | 16px | 40px |
| lg | `px-6 py-3` | 18px | 48px |

### Card Styles

```tsx
// Default card
<Card className="bg-card border border-border rounded-lg p-6">
  {/* content */}
</Card>

// Interactive card
<Card className="bg-card border border-border rounded-lg p-6 transition-all hover:border-foreground/20 hover:shadow-md">
  {/* content */}
</Card>
```

---

## Breakpoints

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Container Widths

```css
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container { padding: 0 1.5rem; }
}

@media (min-width: 1024px) {
  .container { padding: 0 2rem; }
}
```

---

## Iconography

### Icon Library
- **Primary**: Lucide React
- **Size Scale**: 16px, 20px, 24px, 32px
- **Stroke Width**: 2px (default)

### Common Icons

| Usage | Icon |
|-------|------|
| Menu | `Menu` |
| Close | `X` |
| Arrow Right | `ArrowRight` |
| External Link | `ExternalLink` |
| Theme Toggle | `Sun` / `Moon` |
| Social | `Twitter`, `Linkedin`, `Dribbble`, `Instagram` |

---

## Design Tokens (TypeScript)

```typescript
// styles/design-tokens.ts
export const tokens = {
  colors: {
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary))',
    muted: 'hsl(var(--muted))',
    accent: 'hsl(var(--accent))',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '9999px',
  },
  fonts: {
    sans: 'var(--font-inter)',
    mono: 'var(--font-mono)',
  },
} as const;
```
