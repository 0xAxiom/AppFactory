# React Native Best Practices

**Purpose:** Performance optimization rules adapted from Vercel's react-best-practices for React Native/Expo applications.

**Source:** Adapted from [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices)

---

## When to Activate

This skill activates during:

- **Milestone 3** (Feature Implementation) - After core features are built
- **Phase 4** (Final Ralph QA) - As a scored compliance category

Trigger phrases:

- "Check React Native performance"
- "Review code for best practices"
- "Optimize component performance"

---

## How to Use This Skill

1. **During Build:** Reference rules in `AGENTS.md` when writing components
2. **After Milestone:** Run compliance check against all rules
3. **During Ralph:** Include skill compliance score in verdict

---

## Rule Categories (by Priority)

| Priority | Category               | Impact   | Description                                     |
| -------- | ---------------------- | -------- | ----------------------------------------------- |
| 1        | Eliminating Waterfalls | CRITICAL | Async patterns that prevent sequential blocking |
| 2        | Bundle Optimization    | CRITICAL | Import patterns that reduce bundle size         |
| 3        | List Performance       | HIGH     | FlatList/SectionList optimization               |
| 4        | Re-render Prevention   | MEDIUM   | Memoization and state patterns                  |
| 5        | Memory Management      | MEDIUM   | Cleanup and resource handling                   |
| 6        | Animation Performance  | MEDIUM   | Reanimated and gesture patterns                 |
| 7        | Platform Patterns      | LOW      | iOS/Android specific optimizations              |

---

## Quick Reference

### CRITICAL Rules (Must Pass)

```typescript
// async-defer-await: Move await into conditional branches
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
const comments = await getComments();

// GOOD
const [user, posts, comments] = await Promise.all([getUser(), getPosts(), getComments()]);
```

```typescript
// bundle-imports: Avoid barrel file imports
// BAD
import { Button, Text, Card } from '@/components';

// GOOD
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Card } from '@/components/Card';
```

### HIGH Rules

```typescript
// list-flatlist: Use FlatList for lists > 10 items
// BAD
<ScrollView>
  {items.map(item => <ItemCard key={item.id} item={item} />)}
</ScrollView>

// GOOD
<FlatList
  data={items}
  renderItem={({ item }) => <ItemCard item={item} />}
  keyExtractor={item => item.id}
  removeClippedSubviews
  maxToRenderPerBatch={10}
  windowSize={5}
/>
```

```typescript
// memory-cleanup: Clean up effects and listeners
// BAD
useEffect(() => {
  const subscription = eventEmitter.addListener('event', handler);
}, []);

// GOOD
useEffect(() => {
  const subscription = eventEmitter.addListener('event', handler);
  return () => subscription.remove();
}, []);
```

---

## Compliance Scoring

```
skill_score = (passed_rules / applicable_rules) × 100

Thresholds:
- PASS: ≥95% (proceed normally)
- CONDITIONAL: 90-94% (fix before next milestone)
- FAIL: <90% (must fix before proceeding)
- Any CRITICAL violation: BLOCKED
```

---

## Integration with Ralph

Ralph includes this skill as a scoring category:

```markdown
### React Native Skills Compliance (5% weight)

- [ ] No CRITICAL violations (async-defer-await, async-parallel, bundle-imports)
- [ ] No HIGH violations (list-flatlist, memory-cleanup)
- [ ] MEDIUM/LOW violations documented
- [ ] Overall skill score ≥95%
```

---

## Files

- `SKILL.md` - This file (usage and quick reference)
- `AGENTS.md` - Complete rules document for agent consumption
- `rules/` - Individual rule definitions

---

## Version

- **1.0** (2026-01-15): Initial release, adapted from Vercel react-best-practices
