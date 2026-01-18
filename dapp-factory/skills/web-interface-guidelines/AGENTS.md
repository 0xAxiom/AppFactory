# Web Interface Guidelines - Complete Ruleset

**Source:** [vercel-labs/web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines)
**Adapted for:** App Factory web3-factory pipeline
**Last Updated:** January 2026

---

## How to Use This Document

When generating web applications, Claude MUST follow these rules. During Ralph QA, compliance with these rules contributes to the Web Design Skills category (25% of total score).

**Priority Levels:**
- **CRITICAL** - Must pass or build fails
- **HIGH** - Should pass; failures reduce score significantly
- **MEDIUM** - Should pass; failures reduce score moderately
- **LOW** - Nice to have; minor score impact

---

## 1. Interactions

### INT-1: Keyboard Navigation (CRITICAL)

All interactive elements must be reachable and operable via keyboard.

```tsx
// GOOD: Focusable and keyboard-operable
<button onClick={handleClick}>Submit</button>

// GOOD: Custom element with keyboard support
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
  Custom Button
</div>

// BAD: Click-only, not keyboard accessible
<div onClick={handleClick}>Submit</div>
```

### INT-2: Focus Indicators (CRITICAL)

All focusable elements must have visible focus indicators using `focus-visible`.

```tsx
// GOOD: Visible focus ring
<button className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
  Submit
</button>

// BAD: Removed focus indicator
<button className="outline-none focus:outline-none">
  Submit
</button>
```

### INT-3: Touch Targets (HIGH)

Interactive elements must be at least 44x44px on touch devices.

```tsx
// GOOD: Adequate touch target
<button className="min-h-[44px] min-w-[44px] p-3">
  <Icon size={20} />
</button>

// BAD: Too small for touch
<button className="p-1">
  <Icon size={16} />
</button>
```

### INT-4: Input Font Size (HIGH)

Form inputs must use at least 16px font size to prevent iOS zoom.

```tsx
// GOOD: Prevents iOS zoom
<input className="text-base" /> // 16px

// BAD: Will cause iOS zoom
<input className="text-sm" /> // 14px
```

### INT-5: Deep Linking (MEDIUM)

Application state should be reflected in URLs where appropriate.

```tsx
// GOOD: State in URL
const [tab, setTab] = useQueryState('tab', { defaultValue: 'overview' });

// BAD: State not shareable
const [tab, setTab] = useState('overview');
```

### INT-6: Optimistic Updates (MEDIUM)

UI should update immediately, then reconcile with server response.

```tsx
// GOOD: Optimistic update with rollback
const handleLike = async () => {
  setLiked(true); // Optimistic
  try {
    await api.like(postId);
  } catch {
    setLiked(false); // Rollback
    toast.error('Failed to like');
  }
};

// BAD: Wait for server
const handleLike = async () => {
  await api.like(postId);
  setLiked(true);
};
```

### INT-7: Destructive Action Confirmation (HIGH)

Destructive actions require confirmation or undo capability.

```tsx
// GOOD: Confirmation dialog
<AlertDialog>
  <AlertDialogTrigger>Delete</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogTitle>Delete item?</AlertDialogTitle>
    <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
    <AlertDialogCancel>Cancel</AlertDialogCancel>
    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
  </AlertDialogContent>
</AlertDialog>

// GOOD: Undo capability
const handleDelete = () => {
  const item = deleteItem(id);
  toast('Deleted', {
    action: { label: 'Undo', onClick: () => restoreItem(item) }
  });
};
```

### INT-8: Link Semantics (MEDIUM)

Use `<a>` for navigation, `<button>` for actions.

```tsx
// GOOD: Link for navigation
<Link href="/settings">Settings</Link>

// GOOD: Button for action
<button onClick={handleSubmit}>Submit</button>

// BAD: Button for navigation
<button onClick={() => router.push('/settings')}>Settings</button>

// BAD: Link for action
<a href="#" onClick={handleSubmit}>Submit</a>
```

---

## 2. Animation

### ANI-1: Reduced Motion (CRITICAL)

Respect `prefers-reduced-motion` user preference.

```tsx
// GOOD: Check motion preference
import { useReducedMotion } from 'framer-motion';

function Component() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={prefersReducedMotion ? {} : { scale: 1.05 }}
      transition={{ duration: 0.2 }}
    />
  );
}

// GOOD: CSS approach
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### ANI-2: Compositor Properties (HIGH)

Only animate `transform` and `opacity` for smooth 60fps animations.

```tsx
// GOOD: GPU-accelerated properties
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
/>

// BAD: Layout-triggering properties
<motion.div
  initial={{ height: 0, marginTop: 0 }}
  animate={{ height: 100, marginTop: 20 }}
/>
```

### ANI-3: No transition: all (HIGH)

Explicitly specify which properties to transition.

```tsx
// GOOD: Specific transitions
className="transition-opacity duration-200"
className="transition-transform duration-150"
className="transition-colors duration-100"

// BAD: Transition everything
className="transition-all duration-200"
```

### ANI-4: Page Entrance Animations (MEDIUM)

Pages should have subtle entrance animations.

```tsx
// GOOD: Page entrance animation
<motion.main
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {children}
</motion.main>

// BAD: No entrance animation (jarring)
<main>{children}</main>
```

### ANI-5: Input-Driven Animation (MEDIUM)

Prefer animations that respond to user input over auto-playing.

```tsx
// GOOD: Responds to hover/interaction
<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
  Click me
</motion.button>

// BAD: Auto-playing attention-seeking animation
<motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity }} />
```

### ANI-6: Animation Duration (LOW)

Keep animations under 300ms for responsiveness.

```tsx
// GOOD: Quick, responsive
transition={{ duration: 0.15 }}

// BAD: Too slow
transition={{ duration: 0.8 }}
```

---

## 3. Layout

### LAY-1: Responsive Breakpoints (HIGH)

Support mobile, tablet, laptop, and ultra-wide viewports.

```tsx
// GOOD: Full responsive coverage
<div className="
  px-4
  sm:px-6
  md:px-8
  lg:max-w-6xl lg:mx-auto
  xl:max-w-7xl
  2xl:max-w-screen-2xl
">
```

### LAY-2: Safe Areas (HIGH)

Respect device safe areas (notch, home indicator).

```tsx
// GOOD: Safe area padding
<div className="pb-safe pt-safe">
  {/* Content */}
</div>

// In globals.css
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
```

### LAY-3: CSS Over JavaScript (MEDIUM)

Use CSS for layout calculations when possible.

```tsx
// GOOD: CSS calculation
<div className="h-[calc(100vh-64px)]">

// BAD: JavaScript calculation
const [height, setHeight] = useState(window.innerHeight - 64);
useEffect(() => {
  const handler = () => setHeight(window.innerHeight - 64);
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);
```

### LAY-4: Skeleton Matching (MEDIUM)

Loading skeletons should match content layout to prevent shifts.

```tsx
// GOOD: Skeleton matches content
function CardSkeleton() {
  return (
    <div className="p-4 space-y-3">
      <Skeleton className="h-6 w-3/4" /> {/* Title */}
      <Skeleton className="h-4 w-full" /> {/* Description line 1 */}
      <Skeleton className="h-4 w-2/3" /> {/* Description line 2 */}
    </div>
  );
}

function Card({ title, description }) {
  return (
    <div className="p-4 space-y-3">
      <h3 className="h-6">{title}</h3>
      <p className="h-4">{description}</p>
    </div>
  );
}
```

### LAY-5: Optical Alignment (LOW)

Align elements optically, not mathematically.

```tsx
// GOOD: Play icon shifted right for optical center
<div className="flex items-center justify-center pl-1">
  <PlayIcon />
</div>
```

---

## 4. Content

### CON-1: Semantic HTML (CRITICAL)

Use appropriate HTML elements for content.

```tsx
// GOOD: Semantic structure
<main>
  <article>
    <header>
      <h1>Article Title</h1>
    </header>
    <section>
      <h2>Section Heading</h2>
      <p>Paragraph content...</p>
    </section>
  </article>
</main>

// BAD: Div soup
<div>
  <div>
    <div className="title">Article Title</div>
  </div>
  <div>
    <div className="heading">Section Heading</div>
    <div>Paragraph content...</div>
  </div>
</div>
```

### CON-2: Heading Hierarchy (HIGH)

Maintain proper heading levels (h1 → h2 → h3).

```tsx
// GOOD: Proper hierarchy
<h1>Page Title</h1>
<section>
  <h2>Section Title</h2>
  <h3>Subsection Title</h3>
</section>

// BAD: Skipped levels
<h1>Page Title</h1>
<h4>Section Title</h4>
```

### CON-3: Typography Characters (MEDIUM)

Use proper typographic characters.

```tsx
// GOOD: Proper characters
<p>It&rsquo;s a &ldquo;great&rdquo; day&hellip;</p>

// BAD: Straight quotes and periods
<p>It's a "great" day...</p>
```

### CON-4: Empty States (HIGH)

Design empty states with icon, message, and action.

```tsx
// GOOD: Designed empty state
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <InboxIcon className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium">No messages yet</h3>
      <p className="text-gray-500 mt-1">Start a conversation to see messages here.</p>
      <Button className="mt-4">Send Message</Button>
    </div>
  );
}

// BAD: Plain text
<p>No messages</p>
```

### CON-5: Error States (HIGH)

Error states should explain what happened and how to fix it.

```tsx
// GOOD: Helpful error state
<div className="bg-red-50 border border-red-200 rounded-lg p-4">
  <div className="flex items-start gap-3">
    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
    <div>
      <h4 className="font-medium text-red-800">Unable to load data</h4>
      <p className="text-red-700 text-sm mt-1">
        Please check your internet connection and try again.
      </p>
      <Button variant="outline" size="sm" className="mt-3" onClick={retry}>
        Try Again
      </Button>
    </div>
  </div>
</div>

// BAD: Generic error
<p className="text-red-500">Error</p>
```

### CON-6: Locale Formatting (MEDIUM)

Format dates, numbers, and currencies according to user locale.

```tsx
// GOOD: Locale-aware formatting
const formatter = new Intl.NumberFormat(locale, {
  style: 'currency',
  currency: 'USD'
});
<span>{formatter.format(price)}</span>

const dateFormatter = new Intl.DateTimeFormat(locale, {
  dateStyle: 'medium'
});
<time>{dateFormatter.format(date)}</time>

// BAD: Hardcoded format
<span>${price.toFixed(2)}</span>
<time>{date.toLocaleDateString()}</time>
```

---

## 5. Forms

### FOR-1: Label Association (CRITICAL)

Every input must have an associated label.

```tsx
// GOOD: Proper label association
<div>
  <label htmlFor="email">Email</label>
  <input id="email" type="email" />
</div>

// GOOD: Implicit association
<label>
  Email
  <input type="email" />
</label>

// BAD: No label association
<div>
  <span>Email</span>
  <input type="email" />
</div>
```

### FOR-2: Enter Key Submission (HIGH)

Forms should submit when Enter is pressed.

```tsx
// GOOD: Form with submit handler
<form onSubmit={handleSubmit}>
  <input type="text" />
  <button type="submit">Submit</button>
</form>

// BAD: No form, Enter doesn't submit
<div>
  <input type="text" />
  <button onClick={handleSubmit}>Submit</button>
</div>
```

### FOR-3: Inline Validation (HIGH)

Show validation errors inline, near the relevant field.

```tsx
// GOOD: Inline error
<div>
  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    aria-invalid={!!error}
    aria-describedby={error ? 'email-error' : undefined}
  />
  {error && (
    <p id="email-error" className="text-red-500 text-sm mt-1">
      {error}
    </p>
  )}
</div>

// BAD: Errors at top of form only
<form>
  {errors.length > 0 && (
    <div className="text-red-500">{errors.join(', ')}</div>
  )}
  {/* Fields far from errors */}
</form>
```

### FOR-4: No Input Blocking (MEDIUM)

Never prevent keystrokes; validate after input.

```tsx
// GOOD: Validate after input
<input
  type="text"
  onChange={(e) => {
    setValue(e.target.value);
    validateOnBlur && setError(validate(e.target.value));
  }}
/>

// BAD: Prevent certain characters
<input
  onKeyDown={(e) => {
    if (!/[0-9]/.test(e.key)) e.preventDefault();
  }}
/>
```

### FOR-5: Password Manager Support (HIGH)

Use standard input attributes for password manager compatibility.

```tsx
// GOOD: Password manager friendly
<input type="email" autoComplete="email" />
<input type="password" autoComplete="current-password" />
<input type="password" autoComplete="new-password" />

// BAD: Custom implementation
<input type="text" data-type="password" />
```

### FOR-6: Required Field Indication (MEDIUM)

Clearly indicate required fields.

```tsx
// GOOD: Required indicator
<label>
  Email <span className="text-red-500">*</span>
</label>
<input type="email" required aria-required="true" />
```

### FOR-7: Form Error Summary (MEDIUM)

Provide summary of all errors for accessibility.

```tsx
// GOOD: Error summary with aria-live
{errors.length > 0 && (
  <div role="alert" aria-live="polite" className="bg-red-50 p-4 rounded mb-4">
    <h4 className="font-medium text-red-800">Please fix the following:</h4>
    <ul className="list-disc list-inside text-red-700 text-sm mt-2">
      {errors.map((error, i) => <li key={i}>{error}</li>)}
    </ul>
  </div>
)}
```

---

## 6. Performance

### PER-1: List Virtualization (CRITICAL)

Lists with more than 50 items must use virtualization.

```tsx
// GOOD: Virtualized list
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }) {
  const parentRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} className="h-[400px] overflow-auto">
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: virtualItem.start,
              height: virtualItem.size,
            }}
          >
            {items[virtualItem.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}

// BAD: Rendering all items
{items.map(item => <Item key={item.id} {...item} />)}
```

### PER-2: Image Preloading (HIGH)

Preload above-fold images; lazy-load below-fold.

```tsx
// GOOD: Priority image
<Image src={heroImage} priority alt="Hero" />

// GOOD: Lazy loaded
<Image src={galleryImage} loading="lazy" alt="Gallery" />
```

### PER-3: Minimize Re-renders (HIGH)

Use memo, useMemo, useCallback appropriately.

```tsx
// GOOD: Memoized expensive component
const MemoizedChart = memo(function Chart({ data }) {
  // Expensive rendering
});

// GOOD: Stable callback
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// GOOD: Memoized computation
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.value - b.value);
}, [data]);
```

### PER-4: Skeleton Loaders (HIGH)

Use skeleton loaders instead of spinners.

```tsx
// GOOD: Skeleton loader
function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
  );
}

// BAD: Spinner
<div className="flex justify-center">
  <Spinner />
</div>
```

### PER-5: Code Splitting (MEDIUM)

Dynamically import large components.

```tsx
// GOOD: Dynamic import
const Chart = dynamic(() => import('./Chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

// BAD: Static import of large library
import { Chart } from 'heavy-chart-library';
```

### PER-6: Debounce Input (MEDIUM)

Debounce search and filter inputs.

```tsx
// GOOD: Debounced search
const debouncedSearch = useDebouncedCallback((value) => {
  fetchResults(value);
}, 300);

<input onChange={(e) => debouncedSearch(e.target.value)} />
```

### PER-7: Batch DOM Updates (MEDIUM)

Batch state updates that trigger DOM changes.

```tsx
// GOOD: Batched updates (React 18+ auto-batches)
const handleReset = () => {
  setName('');
  setEmail('');
  setErrors({});
};
```

### PER-8: Web Workers (LOW)

Move expensive computations to Web Workers.

```tsx
// GOOD: Offload to worker
const worker = new Worker(new URL('./worker.ts', import.meta.url));
worker.postMessage({ data: largeDataset });
worker.onmessage = (e) => setResult(e.data);
```

---

## 7. Design

### DES-1: APCA Contrast (CRITICAL)

Meet APCA contrast standards (Lc 60+ for body text, 75+ for UI elements).

```tsx
// GOOD: High contrast text
<p className="text-gray-900">Body text</p> // ~90 Lc on white
<p className="text-gray-600">Secondary</p> // ~60 Lc on white

// BAD: Low contrast
<p className="text-gray-400">Hard to read</p> // ~40 Lc on white
```

### DES-2: Layered Shadows (MEDIUM)

Use layered shadows for depth, not single heavy shadows.

```tsx
// GOOD: Layered shadow
className="shadow-sm shadow-gray-200/50"
// or custom:
boxShadow: '0 1px 2px rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.05)'

// BAD: Heavy single shadow
className="shadow-2xl"
```

### DES-3: Interactive State Contrast (HIGH)

Increase contrast on hover/focus states.

```tsx
// GOOD: Darker on hover
<button className="bg-blue-500 hover:bg-blue-600">

// BAD: Lighter on hover (less visible)
<button className="bg-blue-500 hover:bg-blue-400">
```

### DES-4: Dark Mode (MEDIUM)

Support dark mode with proper color-scheme.

```tsx
// GOOD: Color scheme declaration
<html style={{ colorScheme: 'light dark' }}>

// In CSS
:root {
  color-scheme: light dark;
}

// GOOD: Dark mode classes
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
```

### DES-5: Nested Border Radius (LOW)

Inner elements should have smaller border radius than outer.

```tsx
// GOOD: Nested radius
<div className="rounded-xl p-2">
  <div className="rounded-lg"> {/* Smaller radius */}
    Content
  </div>
</div>

// BAD: Same radius creates visual tension
<div className="rounded-xl p-2">
  <div className="rounded-xl">
    Content
  </div>
</div>
```

---

## 8. Accessibility

### ACC-1: ARIA Labels (CRITICAL)

Interactive elements without text must have aria-label.

```tsx
// GOOD: Icon button with label
<button aria-label="Close dialog">
  <XIcon />
</button>

// BAD: No accessible name
<button>
  <XIcon />
</button>
```

### ACC-2: Live Regions (HIGH)

Use aria-live for dynamic content announcements.

```tsx
// GOOD: Polite announcement
<div aria-live="polite" aria-atomic="true">
  {status && <p>{status}</p>}
</div>

// GOOD: Assertive for errors
<div role="alert" aria-live="assertive">
  {error && <p>{error}</p>}
</div>
```

### ACC-3: Skip Links (MEDIUM)

Provide skip-to-content link for keyboard users.

```tsx
// GOOD: Skip link
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-blue-600"
>
  Skip to content
</a>

<main id="main-content">
  {/* Content */}
</main>
```

### ACC-4: Color Independence (HIGH)

Don't rely on color alone to convey information.

```tsx
// GOOD: Color + icon
<span className="text-red-500 flex items-center gap-1">
  <AlertCircle className="h-4 w-4" />
  Error: Invalid email
</span>

// BAD: Color only
<span className="text-red-500">Invalid email</span>
```

### ACC-5: Focus Trapping (MEDIUM)

Trap focus within modal dialogs.

```tsx
// GOOD: Focus trap in dialog
import { FocusTrap } from '@headlessui/react';

<Dialog open={isOpen}>
  <FocusTrap>
    <DialogContent>
      {/* Focus stays within */}
    </DialogContent>
  </FocusTrap>
</Dialog>
```

### ACC-6: Screen Reader Testing (HIGH)

Test with screen readers (VoiceOver, NVDA).

**Checklist:**
- [ ] All interactive elements announced correctly
- [ ] Form errors read aloud
- [ ] Dynamic content updates announced
- [ ] Heading hierarchy navigable
- [ ] Images have appropriate alt text

---

## Compliance Scoring

During Ralph QA, these rules are checked and scored:

| Category | Weight | Items |
|----------|--------|-------|
| Interactions | 20% | 8 rules |
| Animation | 10% | 6 rules |
| Layout | 10% | 5 rules |
| Content | 15% | 6 rules |
| Forms | 15% | 7 rules |
| Performance | 15% | 8 rules |
| Design | 10% | 5 rules |
| Accessibility | 15% | 6 rules |

**Pass Threshold:** 95% of HIGH/CRITICAL rules, 80% of MEDIUM rules

**Automatic Failure:** Any CRITICAL rule violation
