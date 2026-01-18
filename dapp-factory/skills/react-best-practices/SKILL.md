# React Best Practices

**Purpose:** Performance optimization rules for React and Next.js applications.

**Source:** Mirrored from [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices)

---

## When to Activate

This skill activates during:
- **Phase 3** (Build) - During active development
- **Phase 4** (Ralph Polish Loop) - As a scored compliance category

Trigger phrases:
- "Check React performance"
- "Review code for best practices"
- "Optimize component performance"
- "Audit bundle size"

---

## How to Use This Skill

1. **During Build:** Reference rules in `AGENTS.md` when writing components
2. **After Build:** Run compliance check against all rules
3. **During Ralph:** Include skill compliance score in verdict (20% weight)

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

## Quick Reference

### CRITICAL Rules

```typescript
// async-defer-await: Defer await until needed
// BAD
async function getData(userId: string, skipCache: boolean) {
  const data = await fetchData(userId);
  if (skipCache) return { fresh: true };
  return data;
}

// GOOD
async function getData(userId: string, skipCache: boolean) {
  if (skipCache) return { fresh: true };
  const data = await fetchData(userId);
  return data;
}
```

```typescript
// async-parallel: Use Promise.all for independent operations
// BAD
const user = await getUser();
const posts = await getPosts();

// GOOD
const [user, posts] = await Promise.all([getUser(), getPosts()]);
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

```typescript
// bundle-imports: Avoid barrel file imports
// BAD
import { Button, Text } from '@/components';

// GOOD
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
```

### HIGH Rules

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

```typescript
// server-prefer-server-components: Default to Server Components
// BAD - Making everything a client component
'use client';
export function StaticContent() { ... }

// GOOD - Only use 'use client' when needed
// Server Component by default
export function StaticContent() { ... }

// Client Component only for interactivity
'use client';
export function InteractiveButton() { ... }
```

---

## Compliance Scoring

```
skill_score = (passed_rules / applicable_rules) × 100

Thresholds:
- PASS: ≥95% (proceed normally)
- CONDITIONAL: 90-94% (fix before Ralph)
- FAIL: <90% (must fix before proceeding)
- Any CRITICAL violation: BLOCKED
```

---

## Integration with Ralph

Ralph includes this skill as a scoring category:

```markdown
### React Skills Compliance (20% weight)

- [ ] No CRITICAL violations (async patterns, bundle imports)
- [ ] No HIGH violations (server components, caching)
- [ ] Server components used by default
- [ ] Dynamic imports for heavy dependencies
- [ ] Overall skill score ≥95%
```

---

## Files

- `SKILL.md` - This file (usage and quick reference)
- `AGENTS.md` - Complete rules document for agent consumption
- `rules/` - Individual rule definitions

---

## Version

- **1.0** (2026-01-15): Initial release, mirrored from Vercel react-best-practices
