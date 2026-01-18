# Web Design Guidelines

**Purpose:** UI/UX quality rules for websites - accessibility, forms, animation, and polish.

**Source:** Mirrored from [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines)

---

## When to Activate

This skill activates during:
- **Phase 5** (Build) - Reference during component development
- **Phase 6** (Skills Audit) - As MANDATORY compliance check

Trigger phrases:
- "Review my UI"
- "Check accessibility"
- "Audit design"
- "Review UX"

---

## How to Use This Skill

1. **During Build:** Reference guidelines when designing components
2. **Phase 6 Audit:** Run full compliance check - MUST pass to continue
3. **Gate Criteria:** ≥90% score, no HIGH accessibility violations

---

## Rule Categories

| Category | Rules | Priority |
|----------|-------|----------|
| Accessibility | 12 | HIGH |
| Focus States | 6 | HIGH |
| Forms | 10 | MEDIUM |
| Animation | 8 | MEDIUM |
| Typography | 6 | MEDIUM |
| Images | 5 | MEDIUM |
| Loading States | 6 | MEDIUM |
| Empty/Error States | 6 | MEDIUM |
| Dark Mode | 4 | LOW |
| Localization | 4 | LOW |

---

## Accessibility (HIGH) - Cannot Violate

### AC1: Semantic HTML

```tsx
// BAD
<div onClick={handleClick}>Click me</div>
<div className="heading">Title</div>
<span onClick={navigate}>Go to page</span>

// GOOD
<button onClick={handleClick}>Click me</button>
<h1>Title</h1>
<a href="/page">Go to page</a>
```

### AC2: ARIA Labels

```tsx
// BAD
<button onClick={close}>
  <XIcon />
</button>
<input type="search" />

// GOOD
<button onClick={close} aria-label="Close dialog">
  <XIcon aria-hidden="true" />
</button>
<input type="search" aria-label="Search the site" />
```

### AC3: Color Contrast

```tsx
// BAD - 2.5:1 contrast ratio
<p className="text-gray-400 bg-gray-100">Hard to read</p>

// GOOD - 4.5:1 contrast ratio (WCAG AA)
<p className="text-gray-700 bg-gray-100">Easy to read</p>
```

### AC4: Keyboard Navigation

```tsx
// BAD - Not keyboard accessible
<div onClick={handleAction} className="clickable">
  Action
</div>

// GOOD - Fully keyboard accessible
<button onClick={handleAction}>
  Action
</button>

// If must use div, add proper attributes
<div
  role="button"
  tabIndex={0}
  onClick={handleAction}
  onKeyDown={(e) => e.key === 'Enter' && handleAction()}
>
  Action
</div>
```

### AC5: Focus Management

```tsx
// BAD - No focus management
function Modal({ isOpen, children }) {
  if (!isOpen) return null;
  return <div className="modal">{children}</div>;
}

// GOOD - Proper focus management
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
      // Trap focus inside modal
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      {children}
    </div>
  );
}
```

### AC8: Reduced Motion

```tsx
// BAD - No motion preference check
<motion.div
  animate={{ x: 100, rotate: 360 }}
  transition={{ duration: 1 }}
/>

// GOOD - Respects user preference
import { useReducedMotion } from 'framer-motion';

function AnimatedCard() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={{
        x: 100,
        rotate: prefersReducedMotion ? 0 : 360
      }}
      transition={{
        duration: prefersReducedMotion ? 0 : 1
      }}
    />
  );
}
```

---

## Animation (MEDIUM)

### AN1: Page Entrance Animation (REQUIRED)

```tsx
// BAD - Page just appears
export default function Page() {
  return <div>Content</div>;
}

// GOOD - Page animates in
import { motion } from 'framer-motion';

export default function Page() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      Content
    </motion.div>
  );
}
```

### AN2: Hover/Tap Feedback

```tsx
// BAD - No feedback
<button>Click me</button>

// GOOD - Visual feedback
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.15 }}
>
  Click me
</motion.button>
```

### AN5: Stagger List Animations

```tsx
// GOOD - Staggered entrance
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map((i) => (
    <motion.li key={i.id} variants={item}>
      {i.name}
    </motion.li>
  ))}
</motion.ul>
```

---

## Loading States (MEDIUM)

### LS1: Skeleton Loaders

```tsx
// BAD - Generic spinner
{isLoading ? <Spinner /> : <Content data={data} />}

// GOOD - Skeleton that matches content shape
{isLoading ? (
  <div className="space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </div>
) : (
  <Content data={data} />
)}
```

### LS2: Button Loading States

```tsx
// GOOD - Button shows loading state
import { Loader2 } from 'lucide-react';

<Button disabled={isSubmitting}>
  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {isSubmitting ? 'Saving…' : 'Save'}
</Button>
```

---

## Empty/Error States (MEDIUM)

### ES1: Designed Empty States

```tsx
// BAD
{items.length === 0 && <p>No items</p>}

// GOOD - Designed with icon, message, CTA
{items.length === 0 && (
  <div className="flex flex-col items-center py-16">
    <div className="rounded-full bg-muted p-4 mb-4">
      <InboxIcon className="h-8 w-8 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-2">No items yet</h3>
    <p className="text-muted-foreground text-center max-w-sm mb-6">
      Get started by creating your first item.
    </p>
    <Button>Create Item</Button>
  </div>
)}
```

### ES2: Styled Error States

```tsx
// BAD
{error && <p className="text-red-500">{error.message}</p>}

// GOOD - Styled with icon and retry
{error && (
  <Card className="border-destructive/50 bg-destructive/5 p-6">
    <div className="flex items-start gap-4">
      <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
      <div>
        <h4 className="font-semibold text-destructive">
          Something went wrong
        </h4>
        <p className="text-sm text-muted-foreground mt-1">
          {error.message}
        </p>
        <Button variant="outline" size="sm" className="mt-4" onClick={retry}>
          Try Again
        </Button>
      </div>
    </div>
  </Card>
)}
```

---

## Typography (MEDIUM)

### TY1: Sans-Serif for Body

```css
/* BAD */
body {
  font-family: 'Fira Code', monospace;
}

/* GOOD */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

code, pre {
  font-family: 'JetBrains Mono', monospace;
}
```

---

## Compliance Scoring

```
skill_score = (passed_rules / applicable_rules) × 100

Note: HIGH priority violations count as 2× weight

Thresholds:
- PASS: ≥90%
- CONDITIONAL: 85-89%
- FAIL: <85%
- Any HIGH accessibility violation: BLOCKED
```

---

## Audit Report Format

```markdown
# web-design-guidelines Audit Report

**Website:** <slug>
**Scanned:** <timestamp>

## Summary

| Category | Passed | Failed | Score |
|----------|--------|--------|-------|
| Accessibility | 11 | 1 | 92% |
| Focus States | 6 | 0 | 100% |
| Animation | 7 | 1 | 88% |
| Loading States | 5 | 1 | 83% |
| Empty/Error | 6 | 0 | 100% |

**Overall Score:** 92%
**Verdict:** PASS

## Violations

### [MEDIUM] AN1 - Missing page entrance animation

**File:** `src/app/contact/page.tsx`
**Fix:** Add Framer Motion entrance animation

### [MEDIUM] LS1 - Missing skeleton loader

**File:** `src/components/sections/testimonials.tsx`
**Fix:** Add skeleton loader for async testimonials fetch
```

---

## Version

- **1.0** (2026-01-18): Initial release for website-pipeline
