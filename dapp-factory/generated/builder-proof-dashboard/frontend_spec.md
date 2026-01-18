# Frontend Specification: Builder Proof Dashboard

Design and UI guidelines for building the frontend.

---

## Overview

**App:** Builder Proof Dashboard
**Idea:** Build a web3 dashboard that shows on-chain proof of work, not hype. The app should connect to a wallet (read-only) and display: The user's first on-chain transaction (chain, date, age of wallet), Total number of transactions and active days, Contracts the wallet has interacted with most, A simple "Builder Score" derived from consistency over time (not balance). The UI should feel calm and factual — more like an engineering report than a trading app. No prices, no charts that move fast, no hype language. The goal is to show that time + participation matter more than speculation, and to give builders something they'd be proud to share as a credibility signal.

---

## Design System

### Colors (Dark Theme)

```css
:root {
  /* Background layers */
  --bg-base: #0a0a0b;
  --bg-surface: #111113;
  --bg-elevated: #1a1a1d;
  --bg-hover: #222226;

  /* Text */
  --text-primary: #ffffff;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;

  /* Accent (customize per app) */
  --accent: #3b82f6;
  --accent-hover: #2563eb;

  /* Status */
  --success: #22c55e;
  --warning: #f59e0b;
  --error: #ef4444;

  /* Border */
  --border: #27272a;
  --border-hover: #3f3f46;
}
```

### Typography

```css
/* Font stack */
font-family: 'Inter', system-ui, -apple-system, sans-serif;

/* Scale */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### Spacing

```css
/* Use Tailwind spacing scale */
/* p-2 = 0.5rem, p-4 = 1rem, p-6 = 1.5rem, etc */
```

---

## Component Patterns

### Button

```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
}

// Primary: solid accent color
// Secondary: bordered, transparent bg
// Ghost: no border, subtle hover
```

### Card

```tsx
// Standard card with subtle border
<div className="bg-surface border border-border rounded-xl p-6">
  {children}
</div>
```

### Input

```tsx
// Dark input with focus ring
<input
  className="w-full bg-elevated border border-border rounded-lg px-4 py-3
             text-primary placeholder-muted
             focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
/>
```

### Modal

```tsx
// Centered modal with backdrop
<div className="fixed inset-0 bg-black/60 flex items-center justify-center">
  <div className="bg-surface border border-border rounded-2xl p-6 max-w-md w-full mx-4">
    {children}
  </div>
</div>
```

---

## Layout

### Page Structure

```tsx
export default function Page() {
  return (
    <main className="min-h-screen bg-base">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Logo, nav links, wallet button */}
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page content */}
      </div>
    </main>
  );
}
```

### Responsive Breakpoints

```css
/* Tailwind defaults */
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

## Wallet UI

### Connect Button

```tsx
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

// Style override for dark theme
<WalletMultiButton className="!bg-accent hover:!bg-accent-hover" />
```

### Balance Display

```tsx
function TokenBalance() {
  const { balance, loading } = useTokenBalance();
  const { connected } = useWallet();

  if (!connected) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-elevated rounded-lg">
      <span className="text-sm text-secondary">Balance:</span>
      <span className="text-sm font-medium text-primary">
        {loading ? "..." : `${balance?.toLocaleString() ?? 0} TOKEN`}
      </span>
    </div>
  );
}
```

---

## Loading States

### Skeleton

```tsx
<div className="animate-pulse bg-elevated rounded-lg h-6 w-32" />
```

### Spinner

```tsx
<div className="animate-spin rounded-full h-5 w-5 border-2 border-accent border-t-transparent" />
```

### Full Page Loading

```tsx
<div className="min-h-screen bg-base flex items-center justify-center">
  <div className="text-center">
    <Spinner />
    <p className="mt-4 text-secondary">Loading...</p>
  </div>
</div>
```

---

## Error States

### Inline Error

```tsx
<p className="text-sm text-error mt-1">
  {errorMessage}
</p>
```

### Toast Notification

```tsx
<div className="fixed bottom-4 right-4 bg-elevated border border-error/50 rounded-lg px-4 py-3">
  <p className="text-error">{message}</p>
</div>
```

### Empty State

```tsx
<div className="text-center py-12">
  <Icon className="mx-auto h-12 w-12 text-muted" />
  <h3 className="mt-4 text-lg font-medium text-primary">No items yet</h3>
  <p className="mt-2 text-secondary">Get started by creating your first item.</p>
  <Button className="mt-6">Create Item</Button>
</div>
```

---

## Accessibility

### Requirements

- [ ] All interactive elements have focus states
- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] All images have alt text
- [ ] Forms have proper labels
- [ ] Keyboard navigation works
- [ ] Screen reader friendly

### Focus Ring

```css
focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-base
```

---

## Animations

### Transitions

```css
/* Standard transition */
transition: all 150ms ease;

/* Tailwind class */
transition-all duration-150
```

### Hover Effects

```tsx
// Subtle scale on hover
<button className="hover:scale-105 transition-transform" />

// Background change
<div className="hover:bg-hover transition-colors" />
```

---

## Mobile Considerations

- Touch targets minimum 44x44px
- No hover-dependent functionality
- Bottom navigation for main actions
- Swipe gestures where appropriate
- Responsive images
- Test on actual devices

---

## Dependencies

```json
{
  "dependencies": {
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "@radix-ui/react-toast": "^1.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "lucide-react": "^0.300.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

---

**Follow these guidelines for a consistent, polished UI.**
