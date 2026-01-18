# Navigation Structure

**Phase:** 3 - Information Architecture
**Timestamp:** 2026-01-18T10:12:00Z

---

## Primary Navigation (Header)

```typescript
const primaryNav = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
```

### Behavior
- Logo links to home (`/`)
- Links styled as minimal text
- Active state: underline or bold
- Mobile: hamburger menu → slide-in drawer

---

## Mobile Navigation

```typescript
const mobileNav = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
```

### Behavior
- Hamburger icon (3 lines)
- Slide-in from right
- Full-height overlay
- Focus trap when open
- Close on link click
- Close on escape key

---

## Footer Navigation

### Column 1: Pages
```typescript
const footerPages = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
```

### Column 2: Legal
```typescript
const footerLegal = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];
```

### Column 3: Social
```typescript
const footerSocial = [
  { label: 'Twitter', href: 'https://twitter.com/luminary', icon: 'Twitter' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/luminary', icon: 'Linkedin' },
  { label: 'Dribbble', href: 'https://dribbble.com/luminary', icon: 'Dribbble' },
  { label: 'Instagram', href: 'https://instagram.com/luminary', icon: 'Instagram' },
];
```

---

## Breadcrumbs

Only on case study pages.

```typescript
// /work/nexus-tech
const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'Nexus Tech', href: '/work/nexus-tech', current: true },
];
```

### Implementation
```tsx
// components/ui/breadcrumbs.tsx
import Link from 'next/link';

interface Breadcrumb {
  label: string;
  href: string;
  current?: boolean;
}

export function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden="true">/</span>}
            {item.current ? (
              <span aria-current="page">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-foreground">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

---

## Skip Navigation

For accessibility.

```tsx
// components/layout/skip-link.tsx
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-background focus:px-4 focus:py-2 focus:ring-2"
    >
      Skip to main content
    </a>
  );
}
```

---

## Navigation States

### Link States
| State | Style |
|-------|-------|
| Default | `text-muted-foreground` |
| Hover | `text-foreground` |
| Active (current page) | `text-foreground font-medium` |
| Focus | `ring-2 ring-offset-2` |

### Mobile Menu States
| State | Style |
|-------|-------|
| Closed | Hidden, hamburger visible |
| Open | Full-screen overlay, X close button |
| Transitioning | Fade + slide animation (300ms) |

---

## Keyboard Navigation

- Tab through all links in order
- Enter to activate links
- Escape to close mobile menu
- Arrow keys in mobile menu (optional enhancement)

---

## Navigation Component Structure

```
components/layout/
├── header.tsx          # Header with logo + nav
├── nav.tsx             # Desktop navigation
├── mobile-nav.tsx      # Mobile menu
├── footer.tsx          # Footer with columns
└── skip-link.tsx       # Accessibility skip link
```
