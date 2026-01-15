# Web Design Guidelines

**Purpose:** UI/UX quality rules for web applications - accessibility, forms, animation, and polish.

**Source:** Mirrored from [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines)

---

## When to Activate

This skill activates during:
- **Phase 4** (Ralph Polish Loop) - As a scored compliance category (25% weight)

Trigger phrases:
- "Review my UI"
- "Check accessibility"
- "Audit design"
- "Review UX"

---

## How to Use This Skill

1. **During Build:** Reference guidelines when designing components
2. **During Ralph:** Include skill compliance score in verdict
3. **Audit Mode:** Run full compliance check against all categories

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

## Accessibility (HIGH)

### AC1: Semantic HTML

Use correct HTML elements for their purpose.

**Incorrect:**

```tsx
<div onClick={handleClick}>Click me</div>
<div className="heading">Title</div>
```

**Correct:**

```tsx
<button onClick={handleClick}>Click me</button>
<h1>Title</h1>
```

### AC2: ARIA Labels

All interactive elements need accessible names.

**Incorrect:**

```tsx
<button onClick={close}>
  <XIcon />
</button>
```

**Correct:**

```tsx
<button onClick={close} aria-label="Close dialog">
  <XIcon aria-hidden="true" />
</button>
```

### AC3: Color Contrast

Text must have 4.5:1 contrast ratio (WCAG AA).

**Incorrect:**

```tsx
<p className="text-gray-400 bg-gray-100">Low contrast text</p>
```

**Correct:**

```tsx
<p className="text-gray-700 bg-gray-100">Accessible contrast</p>
```

### AC4: Keyboard Navigation

All functionality must be keyboard accessible.

**Incorrect:**

```tsx
<div onClick={handleAction} className="clickable">
  Action
</div>
```

**Correct:**

```tsx
<button
  onClick={handleAction}
  onKeyDown={(e) => e.key === 'Enter' && handleAction()}
>
  Action
</button>
```

### AC5: Focus Management

Manage focus for modals and dynamic content.

**Incorrect:**

```tsx
function Modal({ isOpen }) {
  if (!isOpen) return null;
  return <div className="modal">Content</div>;
}
```

**Correct:**

```tsx
function Modal({ isOpen, onClose }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
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
      Content
    </div>
  );
}
```

### AC6: Skip Links

Provide skip navigation for screen readers.

**Correct:**

```tsx
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### AC7: Alt Text for Images

All images need descriptive alt text or empty alt for decorative.

**Incorrect:**

```tsx
<img src="/hero.jpg" />
<img src="/icon.svg" alt="image" />
```

**Correct:**

```tsx
<img src="/hero.jpg" alt="Team collaborating in modern office" />
<img src="/decorative-line.svg" alt="" aria-hidden="true" />
```

### AC8: Reduced Motion

Respect user's motion preferences.

**Incorrect:**

```tsx
<motion.div
  animate={{ x: 100, rotate: 360 }}
  transition={{ duration: 1 }}
/>
```

**Correct:**

```tsx
const prefersReducedMotion = useReducedMotion();

<motion.div
  animate={{ x: 100, rotate: prefersReducedMotion ? 0 : 360 }}
  transition={{ duration: prefersReducedMotion ? 0 : 1 }}
/>
```

---

## Focus States (HIGH)

### FS1: Visible Focus Indicators

Focus must be clearly visible.

**Incorrect:**

```css
button:focus {
  outline: none;
}
```

**Correct:**

```css
button:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```

### FS2: Focus-Visible Over Focus

Use `:focus-visible` to avoid focus on click.

**Incorrect:**

```css
button:focus {
  box-shadow: 0 0 0 2px blue;
}
```

**Correct:**

```css
button:focus-visible {
  box-shadow: 0 0 0 2px var(--ring);
}
```

### FS3: Custom Focus Styles

Focus styles should match your design system.

**Correct:**

```tsx
<Button
  className={cn(
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-ring focus-visible:ring-offset-2"
  )}
>
  Click me
</Button>
```

---

## Forms (MEDIUM)

### FM1: Label Association

All inputs need associated labels.

**Incorrect:**

```tsx
<label>Email</label>
<input type="email" />
```

**Correct:**

```tsx
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

### FM2: Autocomplete Attributes

Use appropriate autocomplete values.

**Incorrect:**

```tsx
<input type="text" name="name" />
<input type="email" name="email" />
```

**Correct:**

```tsx
<input type="text" name="name" autoComplete="name" />
<input type="email" name="email" autoComplete="email" />
```

### FM3: Input Types

Use correct input types for mobile keyboards.

**Incorrect:**

```tsx
<input type="text" placeholder="Phone number" />
<input type="text" placeholder="Email" />
```

**Correct:**

```tsx
<input type="tel" placeholder="Phone number" inputMode="tel" />
<input type="email" placeholder="Email" inputMode="email" />
```

### FM4: Error Messages

Show clear, specific error messages.

**Incorrect:**

```tsx
{error && <span className="error">Invalid</span>}
```

**Correct:**

```tsx
{error && (
  <span role="alert" className="text-destructive text-sm mt-1">
    Please enter a valid email address (e.g., name@example.com)
  </span>
)}
```

### FM5: Required Field Indication

Clearly mark required fields.

**Correct:**

```tsx
<label htmlFor="email">
  Email <span className="text-destructive">*</span>
  <span className="sr-only">(required)</span>
</label>
```

### FM6: Disabled State Styling

Disabled elements should look disabled.

**Correct:**

```tsx
<Button
  disabled={isSubmitting}
  className="disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</Button>
```

---

## Animation (MEDIUM)

### AN1: Page Entrance Animation

Pages should animate in, not pop.

**Incorrect:**

```tsx
export default function Page() {
  return <div>Content</div>;
}
```

**Correct:**

```tsx
import { motion } from 'framer-motion';

export default function Page() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      Content
    </motion.div>
  );
}
```

### AN2: Hover/Tap Feedback

Interactive elements need feedback.

**Incorrect:**

```tsx
<button>Click me</button>
```

**Correct:**

```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.15 }}
>
  Click me
</motion.button>
```

### AN3: No Instant Transitions

State changes should have duration > 0.

**Incorrect:**

```css
.card {
  transition: none;
}
```

**Correct:**

```css
.card {
  transition: all 0.2s ease;
}
```

### AN4: Use Transform/Opacity

Animate only transform and opacity for performance.

**Incorrect:**

```tsx
<motion.div
  animate={{ left: 100, width: 200, height: 200 }}
/>
```

**Correct:**

```tsx
<motion.div
  animate={{ x: 100, scale: 1.2 }}
/>
```

### AN5: Stagger List Animations

Animate list items with stagger.

**Correct:**

```tsx
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
  {items.map(i => (
    <motion.li key={i.id} variants={item}>
      {i.name}
    </motion.li>
  ))}
</motion.ul>
```

---

## Typography (MEDIUM)

### TY1: Sans-Serif for Body

Body text should use sans-serif, not monospace.

**Incorrect:**

```css
body {
  font-family: 'Fira Code', monospace;
}
```

**Correct:**

```css
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

code, pre, .address {
  font-family: 'JetBrains Mono', monospace;
}
```

### TY2: Proper Quotes and Apostrophes

Use curly quotes, not straight.

**Incorrect:**

```tsx
<p>"Hello," she said. "It's nice."</p>
```

**Correct:**

```tsx
<p>"Hello," she said. "It's nice."</p>
```

### TY3: Proper Ellipsis

Use ellipsis character, not three dots.

**Incorrect:**

```tsx
<span>Loading...</span>
```

**Correct:**

```tsx
<span>Loading…</span>
```

### TY4: Tabular Numbers for Data

Use tabular figures for numbers in tables.

**Correct:**

```css
.table-cell {
  font-variant-numeric: tabular-nums;
}
```

---

## Loading States (MEDIUM)

### LS1: Skeleton Loaders

Show skeletons, not spinners, for content.

**Incorrect:**

```tsx
{isLoading ? <Spinner /> : <Content data={data} />}
```

**Correct:**

```tsx
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

Buttons should show loading state.

**Correct:**

```tsx
<Button disabled={isSubmitting}>
  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {isSubmitting ? 'Saving…' : 'Save'}
</Button>
```

### LS3: Progressive Loading

Load critical content first.

**Correct:**

```tsx
<Suspense fallback={<HeaderSkeleton />}>
  <Header />
</Suspense>
<Suspense fallback={<ContentSkeleton />}>
  <MainContent />
</Suspense>
<Suspense fallback={<SidebarSkeleton />}>
  <Sidebar />
</Suspense>
```

---

## Empty/Error States (MEDIUM)

### ES1: Designed Empty States

Empty states need icon, message, and CTA.

**Incorrect:**

```tsx
{items.length === 0 && <p>No items</p>}
```

**Correct:**

```tsx
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

Errors need styled presentation and retry option.

**Incorrect:**

```tsx
{error && <p className="text-red-500">{error.message}</p>}
```

**Correct:**

```tsx
{error && (
  <Card className="border-destructive/50 bg-destructive/5 p-6">
    <div className="flex items-start gap-4">
      <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
      <div>
        <h4 className="font-semibold text-destructive">Something went wrong</h4>
        <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={retry}>
          Try Again
        </Button>
      </div>
    </div>
  </Card>
)}
```

---

## Dark Mode (LOW)

### DM1: Color Scheme Meta

Set color-scheme for native dark mode support.

**Correct:**

```tsx
// In layout.tsx or _document.tsx
<meta name="color-scheme" content="dark light" />
```

### DM2: Theme Color Meta

Set theme-color for browser chrome.

**Correct:**

```tsx
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0a0a0a" />
```

### DM3: CSS Variables for Theming

Use CSS variables for theme colors.

**Correct:**

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}
```

---

## Compliance Scoring

```
skill_score = (passed_rules / applicable_rules) × 100

Thresholds:
- PASS: ≥95%
- CONDITIONAL: 90-94%
- FAIL: <90%

HIGH priority violations count double.
```

---

## Integration with Ralph

Ralph includes this skill as a scoring category:

```markdown
### Web Design Skills Compliance (25% weight)

- [ ] All interactive elements have accessible names
- [ ] Focus states visible on all focusable elements
- [ ] Form inputs have associated labels
- [ ] Page has entrance animation (Framer Motion)
- [ ] Skeleton loaders for async content
- [ ] Designed empty states with CTAs
- [ ] Styled error states with retry options
- [ ] Sans-serif font for body text
- [ ] Overall skill score ≥95%
```

---

## Version

- **1.0** (2026-01-15): Initial release, mirrored from Vercel web-design-guidelines
