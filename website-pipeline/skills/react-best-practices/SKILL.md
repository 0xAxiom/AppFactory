# React Best Practices

**Purpose:** Performance optimization rules for React and Next.js websites.

**Source:** Mirrored from [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices)

---

## When to Activate

This skill activates during:
- **Phase 5** (Build) - During active development
- **Phase 6** (Skills Audit) - As MANDATORY compliance check

Trigger phrases:
- "Check React performance"
- "Review code for best practices"
- "Optimize component performance"
- "Audit bundle size"

---

## How to Use This Skill

1. **During Build:** Reference rules in `AGENTS.md` when writing components
2. **Phase 6 Audit:** Run full compliance check - MUST pass to continue
3. **Gate Criteria:** ≥95% score, no CRITICAL violations

---

## Rule Categories (by Priority)

| Priority | Category | Impact | Description |
|----------|----------|--------|-------------|
| 1 | Eliminating Waterfalls | CRITICAL | Async patterns that prevent sequential blocking |
| 2 | Bundle Size Optimization | CRITICAL | Import patterns and code splitting |
| 3 | Server-Side Performance | HIGH | Server components and caching |
| 4 | Client-Side Data Fetching | MEDIUM-HIGH | SWR, React Query patterns |
| 5 | Re-render Optimization | MEDIUM | Memoization and state patterns |
| 6 | Rendering Performance | MEDIUM | DOM and layout optimization |
| 7 | JavaScript Performance | LOW-MEDIUM | Micro-optimizations |
| 8 | Advanced Patterns | LOW | Edge case optimizations |

---

## CRITICAL Rules (Must Not Violate)

### async-parallel: Use Promise.all for independent operations

```typescript
// BAD - Sequential, creates waterfall
async function getData(userId: string) {
  const user = await getUser(userId);
  const posts = await getPosts(userId);
  const settings = await getSettings(userId);
  return { user, posts, settings };
}

// GOOD - Parallel, no waterfall
async function getData(userId: string) {
  const [user, posts, settings] = await Promise.all([
    getUser(userId),
    getPosts(userId),
    getSettings(userId),
  ]);
  return { user, posts, settings };
}
```

### async-defer-await: Defer await until needed

```typescript
// BAD - Await blocks even when not needed
async function getData(userId: string, skipCache: boolean) {
  const data = await fetchData(userId);
  if (skipCache) return { fresh: true };
  return data;
}

// GOOD - Early return before await
async function getData(userId: string, skipCache: boolean) {
  if (skipCache) return { fresh: true };
  const data = await fetchData(userId);
  return data;
}
```

### bundle-imports: Avoid barrel file imports

```typescript
// BAD - Imports entire barrel, poor tree shaking
import { Button, Card, Text } from '@/components';
import { formatDate, formatCurrency } from '@/utils';

// GOOD - Direct imports, optimal tree shaking
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/utils/date';
```

### bundle-dynamic-imports: Code split large dependencies

```typescript
// BAD - Loads Chart.js in initial bundle
import { Chart } from 'chart.js';

export function Dashboard() {
  return <Chart data={data} />;
}

// GOOD - Lazy loads Chart.js only when needed
import dynamic from 'next/dynamic';

const Chart = dynamic(
  () => import('chart.js').then(mod => mod.Chart),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);

export function Dashboard() {
  return <Chart data={data} />;
}
```

---

## HIGH Rules

### server-prefer-server-components: Default to Server Components

```typescript
// BAD - Making everything a client component
'use client';

export function StaticHeader() {
  return (
    <header>
      <h1>Welcome to My Site</h1>
      <p>Static content that never changes</p>
    </header>
  );
}

// GOOD - Server Component by default (no 'use client')
export function StaticHeader() {
  return (
    <header>
      <h1>Welcome to My Site</h1>
      <p>Static content that never changes</p>
    </header>
  );
}

// Client Component ONLY when needed
'use client';

export function InteractiveNav() {
  const [isOpen, setIsOpen] = useState(false);
  return <nav>{/* ... */}</nav>;
}
```

### server-cache-react: Cache server data fetches

```typescript
// BAD - No caching, refetches every request
async function getData() {
  const res = await fetch('https://api.example.com/data');
  return res.json();
}

// GOOD - Cached with revalidation
import { unstable_cache } from 'next/cache';

const getData = unstable_cache(
  async () => {
    const res = await fetch('https://api.example.com/data');
    return res.json();
  },
  ['data-key'],
  { revalidate: 3600 } // 1 hour
);
```

---

## Website-Specific Rules

### image-next: Use next/image for all images

```typescript
// BAD - Standard img tag
<img src="/hero.jpg" alt="Hero" />

// GOOD - Optimized with next/image
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero image showing the product"
  width={1200}
  height={600}
  priority // For above-the-fold images
/>
```

### font-next: Use next/font for fonts

```typescript
// BAD - External font link
// In layout.tsx or _document
<link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet" />

// GOOD - Optimized with next/font
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

---

## Compliance Scoring

```
skill_score = (passed_rules / applicable_rules) × 100

Thresholds:
- PASS: ≥95% (proceed to SEO review)
- CONDITIONAL: 90-94% (fix before Ralph, can proceed)
- FAIL: <90% (must fix, retry audit)
- Any CRITICAL violation: BLOCKED (cannot proceed)
```

---

## Audit Report Format

```markdown
# react-best-practices Audit Report

**Website:** <slug>
**Scanned:** <timestamp>
**Files:** X files scanned

## Summary

| Severity | Passed | Failed | Total |
|----------|--------|--------|-------|
| CRITICAL | 4 | 0 | 4 |
| HIGH | 8 | 1 | 9 |
| MEDIUM | 12 | 2 | 14 |

**Score:** 93%
**Verdict:** CONDITIONAL

## Violations

### [HIGH] server-prefer-server-components

**File:** `src/app/about/page.tsx:1`
**Issue:** Unnecessary 'use client' on static page
**Fix:** Remove 'use client' directive

### [MEDIUM] image-next

**File:** `src/components/sections/hero.tsx:15`
**Issue:** Using <img> instead of next/image
**Fix:** Replace with Image component from next/image
```

---

## Version

- **1.0** (2026-01-18): Initial release for website-pipeline
