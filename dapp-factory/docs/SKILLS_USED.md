# dApp Factory Skills Reference

**Pipeline:** dapp-factory
**Skills System:** See `/docs/pipelines/SKILLS_SYSTEM.md`

---

## Registered Skills

| Skill ID | Location | Source | Purpose |
|----------|----------|--------|---------|
| `dapp-factory:react-best-practices` | `skills/react-best-practices/` | Vercel agent-skills | React/Next.js performance |
| `dapp-factory:web-design-guidelines` | `skills/web-design-guidelines/` | Vercel agent-skills | UI/UX/accessibility |
| `dapp-factory:web-interface-guidelines` | `skills/web-interface-guidelines/` | Internal | Web-specific patterns |
| `dapp-factory:vercel-deploy` | `skills/vercel-deploy/` | Internal | Deployment guidance |

---

## react-best-practices

### Quick Reference

**CRITICAL Rules (must not violate):**

```typescript
// async-parallel: Use Promise.all for independent operations
// BAD
const user = await getUser();
const posts = await getPosts();

// GOOD
const [user, posts] = await Promise.all([getUser(), getPosts()]);
```

```typescript
// bundle-imports: Avoid barrel file imports
// BAD
import { Button, Card, Text } from '@/components';

// GOOD
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
```

```typescript
// bundle-dynamic-imports: Code split large dependencies
// BAD
import { Chart } from 'chart-library';

// GOOD
const Chart = dynamic(() => import('chart-library').then(m => m.Chart), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});
```

**HIGH Rules:**

```typescript
// server-prefer-server-components: Default to Server Components
// BAD - Making everything a client component
'use client';
export function StaticContent() { ... }

// GOOD - Only use 'use client' when needed
export function StaticContent() { ... }  // Server Component
'use client';
export function InteractiveButton() { ... }  // Client Component
```

```typescript
// server-cache-react: Cache server data fetches
// BAD
async function getData() {
  const res = await fetch('https://api.example.com/data');
  return res.json();
}

// GOOD
import { unstable_cache } from 'next/cache';

const getData = unstable_cache(
  async () => {
    const res = await fetch('https://api.example.com/data');
    return res.json();
  },
  ['data-key'],
  { revalidate: 3600 }
);
```

### When Checked

- **Phase 3 (Build):** During active component development
- **Gate 1:** After build completes, before Ralph
- **Phase 4 (Ralph):** As 20% weighted scoring category

### Full Rules

See `skills/react-best-practices/AGENTS.md` for complete rules.

---

## web-design-guidelines

### Quick Reference

**HIGH Rules (Accessibility):**

```tsx
// AC1: Semantic HTML
// BAD
<div onClick={handleClick}>Click me</div>

// GOOD
<button onClick={handleClick}>Click me</button>
```

```tsx
// AC2: ARIA Labels
// BAD
<button onClick={close}><XIcon /></button>

// GOOD
<button onClick={close} aria-label="Close dialog">
  <XIcon aria-hidden="true" />
</button>
```

```tsx
// FS1: Visible Focus
// BAD
button:focus { outline: none; }

// GOOD
button:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```

**MEDIUM Rules (Animation):**

```tsx
// AN1: Page Entrance Animation
// BAD
export default function Page() {
  return <div>Content</div>;
}

// GOOD
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

```tsx
// LS1: Skeleton Loaders
// BAD
{isLoading ? <Spinner /> : <Content data={data} />}

// GOOD
{isLoading ? (
  <div className="space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-4 w-full" />
  </div>
) : (
  <Content data={data} />
)}
```

### When Checked

- **Phase 4 (Ralph):** As 25% weighted scoring category
- **Gate 2:** During Ralph polish iterations

### Full Rules

See `skills/web-design-guidelines/AGENTS.md` for complete rules.

---

## web-interface-guidelines

### Quick Reference

**Form Handling:**

```tsx
// FM1: Label Association
// BAD
<label>Email</label>
<input type="email" />

// GOOD
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

```tsx
// FM4: Error Messages
// BAD
{error && <span className="error">Invalid</span>}

// GOOD
{error && (
  <span role="alert" className="text-destructive text-sm mt-1">
    Please enter a valid email address (e.g., name@example.com)
  </span>
)}
```

**Empty/Error States:**

```tsx
// ES1: Designed Empty States
// BAD
{items.length === 0 && <p>No items</p>}

// GOOD
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

### When Checked

- **Phase 3 (Build):** During form and state implementation
- **Phase 4 (Ralph):** Included in web-design-guidelines score

### Full Rules

See `skills/web-interface-guidelines/AGENTS.md` for complete rules.

---

## vercel-deploy

### Quick Reference

**Deployment Configuration:**

```javascript
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
```

**Environment Variables:**

```bash
# Required for dApp deployment
NEXT_PUBLIC_WALLET_ADAPTER_NETWORK=devnet
# Add to Vercel dashboard, not vercel.json
```

### When Used

- **Phase 4:** Optional deployment step
- **Post-Ralph:** When preparing for production

### Full Guide

See `skills/vercel-deploy/SKILL.md` for deployment workflow.

---

## Skill Compliance in Ralph

Ralph report includes skill scores:

```markdown
## Skills Compliance Summary

| Skill | Score | Status |
|-------|-------|--------|
| react-best-practices | 96% | PASS |
| web-design-guidelines | 94% | CONDITIONAL |
| web-interface-guidelines | 98% | PASS |

### Violations Found

1. **[MEDIUM] LS1** - Missing skeleton loader in `src/app/dashboard/page.tsx:45`
2. **[MEDIUM] AN1** - No entrance animation in `src/app/settings/page.tsx:1`

### Required Fixes

- [ ] Add skeleton loader for dashboard data fetch
- [ ] Add Framer Motion entrance animation to settings page
```

---

## Updating Skills

To update skills from upstream Vercel agent-skills:

1. Check https://github.com/vercel-labs/agent-skills for updates
2. Compare with local `skills/<skill>/AGENTS.md`
3. Merge changes carefully (preserve customizations)
4. Update version in `skills/<skill>/SKILL.md`
5. Test with a sample build

---

## Version History

- **1.0** (2026-01-18): Initial skills documentation
