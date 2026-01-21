# Web3 Factory: Design Spec Author

**Version**: 1.0
**Purpose**: Create comprehensive, production-quality UI/UX specifications for modern web applications.

---

## Overview

This template guides the creation of design specifications that result in polished, professional web applications. Apps built from this spec must look and feel like premium products, not basic prototypes.

---

## Required Sections

### Section 1: Visual Identity

Define the app's visual personality:

```markdown
## Visual Identity

### Brand Personality

- [Primary trait - e.g., "Professional yet approachable"]
- [Secondary trait - e.g., "Modern and clean"]
- [Tertiary trait - e.g., "Trust-inspiring"]

### Design Philosophy

- [Core design principle 1]
- [Core design principle 2]
- [Core design principle 3]

### Domain Alignment

- This app serves [domain/purpose]
- Visual language should evoke [relevant industry aesthetics]
- Avoid generic [crypto/tech/startup] aesthetics unless domain-appropriate
```

### Section 2: Color System

Define semantic color tokens with WCAG AA compliance:

```json
{
  "colors": {
    "background": {
      "primary": "#0a0a0a",
      "secondary": "#121212",
      "tertiary": "#1a1a1a",
      "elevated": "#222222"
    },
    "foreground": {
      "primary": "#ffffff",
      "secondary": "#a1a1a1",
      "muted": "#666666",
      "inverse": "#0a0a0a"
    },
    "accent": {
      "primary": "#3b82f6",
      "primaryHover": "#2563eb",
      "primaryMuted": "rgba(59, 130, 246, 0.15)",
      "secondary": "#8b5cf6"
    },
    "semantic": {
      "success": "#22c55e",
      "successMuted": "rgba(34, 197, 94, 0.15)",
      "warning": "#f59e0b",
      "warningMuted": "rgba(245, 158, 11, 0.15)",
      "error": "#ef4444",
      "errorMuted": "rgba(239, 68, 68, 0.15)",
      "info": "#06b6d4"
    },
    "border": {
      "default": "rgba(255, 255, 255, 0.1)",
      "hover": "rgba(255, 255, 255, 0.2)",
      "focus": "#3b82f6"
    }
  }
}
```

**Requirements**:

- All text must meet WCAG AA contrast ratios (4.5:1 for body, 3:1 for large text)
- Define both light and dark mode palettes if applicable
- Include hover, focus, and active state colors

### Section 3: Typography Scale

Define complete typography system:

```json
{
  "typography": {
    "fontFamily": {
      "sans": "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      "mono": "JetBrains Mono, SF Mono, Consolas, monospace"
    },
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem"
    },
    "fontWeight": {
      "normal": "400",
      "medium": "500",
      "semibold": "600",
      "bold": "700"
    },
    "lineHeight": {
      "tight": "1.25",
      "normal": "1.5",
      "relaxed": "1.75"
    },
    "letterSpacing": {
      "tight": "-0.025em",
      "normal": "0",
      "wide": "0.025em"
    }
  }
}
```

**Requirements**:

- Body text uses sans-serif (NEVER monospace for body)
- Monospace reserved for code, addresses, and technical data only
- Clear hierarchy: display > h1 > h2 > h3 > body > caption

### Section 4: Spacing & Layout

Define consistent spacing scale:

```json
{
  "spacing": {
    "scale": {
      "0": "0",
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1rem",
      "5": "1.25rem",
      "6": "1.5rem",
      "8": "2rem",
      "10": "2.5rem",
      "12": "3rem",
      "16": "4rem",
      "20": "5rem",
      "24": "6rem"
    },
    "containers": {
      "sm": "640px",
      "md": "768px",
      "lg": "1024px",
      "xl": "1280px",
      "2xl": "1536px"
    }
  },
  "borderRadius": {
    "none": "0",
    "sm": "0.25rem",
    "md": "0.375rem",
    "lg": "0.5rem",
    "xl": "0.75rem",
    "2xl": "1rem",
    "full": "9999px"
  }
}
```

### Section 5: Component Library

**MANDATORY**: Use shadcn/ui as the component foundation.

```bash
# Required shadcn/ui setup
npx shadcn@latest init
npx shadcn@latest add button card dialog input label tabs toast skeleton avatar badge dropdown-menu
```

**Required Components**:

| Component        | Usage                 | shadcn Component                   |
| ---------------- | --------------------- | ---------------------------------- |
| Primary Button   | Main CTAs             | `Button` variant="default"         |
| Secondary Button | Secondary actions     | `Button` variant="secondary"       |
| Ghost Button     | Tertiary actions      | `Button` variant="ghost"           |
| Card             | Content containers    | `Card` with proper padding         |
| Dialog           | Modals, confirmations | `Dialog` with backdrop blur        |
| Input            | Form fields           | `Input` with proper labels         |
| Toast            | Notifications         | `Toast` with Sonner                |
| Skeleton         | Loading states        | `Skeleton` for every async content |
| Avatar           | User/wallet display   | `Avatar` with fallback             |
| Badge            | Status indicators     | `Badge` with semantic colors       |

### Section 6: Animation & Motion

**MANDATORY**: Use Framer Motion for all animations.

```typescript
// Required animation patterns
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

const scaleOnHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.15 },
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
```

**Animation Guidelines**:

- Micro-interactions: 100-200ms (quick, responsive)
- Page transitions: 200-400ms (smooth, not sluggish)
- Loading animations: Continuous, subtle
- Hover states: Always animated, never instant
- Respect `prefers-reduced-motion`

**Required Animation Patterns**:

1. **Page/section entrance**: Fade in + slide up
2. **Card hover**: Subtle lift with shadow increase
3. **Button interactions**: Scale + color transition
4. **List items**: Staggered entrance
5. **Loading skeletons**: Shimmer effect
6. **Toast notifications**: Slide in from edge

### Section 7: Visual Depth & Effects

Define the visual depth system:

```css
/* Required shadow scale */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
--shadow-glow: 0 0 20px rgba(59, 130, 246, 0.3);

/* Glass morphism for elevated surfaces */
--glass-bg: rgba(255, 255, 255, 0.05);
--glass-border: rgba(255, 255, 255, 0.1);
--glass-blur: blur(12px);
```

**Required Effects**:

- Cards: Subtle border + hover glow
- Modals: Backdrop blur + shadow
- Buttons: Hover color shift + optional glow
- Focus states: Visible focus ring (accessibility)

### Section 8: State Design

Every interactive element MUST have defined states:

#### Loading States

```typescript
// Every async operation needs a loading state
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Loading...
    </>
  ) : (
    "Submit"
  )}
</Button>

// Content areas use skeletons, not spinners
<Skeleton className="h-32 w-full" />
```

#### Empty States

```tsx
// Empty states must be designed, not blank
function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}
```

#### Error States

```tsx
// Errors must be helpful, not raw
function ErrorState({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) {
  return (
    <Card className="p-6 border-destructive/50 bg-destructive/5">
      <div className="flex items-start gap-4">
        <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-destructive">{title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{message}</p>
          {onRetry && (
            <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
              Try Again
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
```

### Section 9: Responsive Design

Define breakpoints and mobile-first approach:

```typescript
// Tailwind breakpoints (mobile-first)
const breakpoints = {
  sm: '640px', // Large phones
  md: '768px', // Tablets
  lg: '1024px', // Laptops
  xl: '1280px', // Desktops
  '2xl': '1536px', // Large screens
};
```

**Required Responsive Patterns**:

1. **Navigation**: Hamburger menu on mobile, full nav on desktop
2. **Grid layouts**: Single column mobile, multi-column desktop
3. **Typography**: Scaled appropriately per breakpoint
4. **Touch targets**: Minimum 44x44px on mobile
5. **Spacing**: Reduced padding on mobile

### Section 10: Web3 UX Patterns

Define blockchain-specific UX:

#### Wallet Connection

```tsx
// Wallet connection must be secondary, not primary
function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <Logo />
      <nav>{/* App navigation */}</nav>
      <WalletButton /> {/* Rightmost, not dominant */}
    </header>
  );
}
```

#### Transaction States

```tsx
// All transactions need clear state feedback
type TxState = 'idle' | 'signing' | 'confirming' | 'success' | 'error';

function TransactionButton({ onSubmit }: Props) {
  const [state, setState] = useState<TxState>('idle');

  const stateContent = {
    idle: 'Send Transaction',
    signing: 'Waiting for signature...',
    confirming: 'Confirming...',
    success: 'Success!',
    error: 'Failed - Retry',
  };

  return <Button disabled={state === 'signing' || state === 'confirming'}>{stateContent[state]}</Button>;
}
```

#### Address Display

```tsx
// Addresses must be truncated and copyable
function AddressDisplay({ address }: { address: string }) {
  const truncated = `${address.slice(0, 4)}...${address.slice(-4)}`;

  return (
    <button
      onClick={() => navigator.clipboard.writeText(address)}
      className="font-mono text-sm bg-muted px-2 py-1 rounded hover:bg-muted/80"
    >
      {truncated}
      <Copy className="ml-2 h-3 w-3" />
    </button>
  );
}
```

---

## Validation Checklist

Before finalizing design spec, verify:

### Visual Quality

- [ ] Color palette defines ALL semantic colors
- [ ] Typography scale is complete with all variants
- [ ] Spacing scale is consistent (4px base or 8px base)
- [ ] All interactive states are defined (hover, focus, active, disabled)

### Component Coverage

- [ ] shadcn/ui components are specified
- [ ] Custom components have detailed specifications
- [ ] Loading skeletons defined for all async content
- [ ] Empty states designed for all list/grid views
- [ ] Error states have helpful messaging and retry actions

### Animation & Motion

- [ ] Framer Motion patterns defined
- [ ] Micro-interactions specified for all interactive elements
- [ ] Page transitions defined
- [ ] Loading animations specified
- [ ] Reduced motion alternatives considered

### Accessibility

- [ ] Color contrast meets WCAG AA (4.5:1 minimum)
- [ ] Focus states are visible
- [ ] Touch targets are 44px minimum
- [ ] Screen reader text is specified where needed
- [ ] Reduced motion is respected

### Responsive

- [ ] Mobile layout is defined
- [ ] Tablet layout is defined
- [ ] Desktop layout is defined
- [ ] Navigation adapts properly
- [ ] Typography scales appropriately

### Web3 Specific

- [ ] Wallet connection is secondary, not dominant
- [ ] Transaction states are clearly defined
- [ ] Address display is truncated and copyable
- [ ] Error handling covers blockchain-specific failures
- [ ] Gas/fee information is presented clearly

---

## Output Files

Design spec produces these artifacts:

1. **`design/design_spec.md`** - Complete design specification
2. **`design/design_tokens.json`** - Programmatic tokens for colors, typography, spacing
3. **`design/components.md`** - Component inventory with specifications
4. **`design/animations.md`** - Animation patterns and implementations

---

**Remember**: The goal is a polished, professional application that users trust and enjoy. Basic functionality with poor UI is a failure.
