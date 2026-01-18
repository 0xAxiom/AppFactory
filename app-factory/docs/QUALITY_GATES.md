# App Factory Quality Gates

**Pipeline:** app-factory
**Version:** 7.1

---

## Overview

Quality gates are mandatory checkpoints that validate code against skills before proceeding to the next milestone. All mobile apps must pass these gates to reach completion.

---

## Gate 1: Post-Milestone-2 UI Check

**Trigger:** After Milestone 2 (Core Screens) completes
**Blocks:** Milestone 3 (Feature Implementation)

### Skills Checked

| Skill | Weight | Pass Threshold |
|-------|--------|----------------|
| mobile-ui-guidelines | 50% | ≥85%, no CRITICAL |
| mobile-interface-guidelines | 50% | ≥85% |

### Invocation

```markdown
### Skill: mobile-ui-guidelines

**ID:** `app-factory:mobile-ui-guidelines`
**Trigger:** Screen components present in builds/<slug>/app/
**Inputs:**
  - Code paths: `builds/<slug>/app/**/*.tsx`
  - Code paths: `builds/<slug>/src/components/**/*.tsx`
**Outputs:**
  - Report: `runs/<timestamp>/reports/agent_skills/mobile-ui-guidelines.md`
**Gate Criteria:**
  - BLOCKED if touch target < 44pt
  - FAIL if score < 85%
  - PASS if ≥85%
```

```markdown
### Skill: mobile-interface-guidelines

**ID:** `app-factory:mobile-interface-guidelines`
**Trigger:** UI code present
**Inputs:**
  - Code paths: `builds/<slug>/**/*.tsx`
**Outputs:**
  - Report: `runs/<timestamp>/reports/agent_skills/mobile-interface-guidelines.md`
**Gate Criteria:**
  - BLOCKED if CRITICAL violation (a11y, safe areas)
  - FAIL if score < 85%
  - PASS if ≥85%
```

---

## Gate 2: Post-Milestone-3 Performance Check

**Trigger:** After Milestone 3 (Feature Implementation) completes
**Blocks:** Milestone 4 (Monetization)

### Skills Checked

| Skill | Weight | Pass Threshold |
|-------|--------|----------------|
| react-native-best-practices | 60% | ≥90%, no CRITICAL |
| expo-standards | 40% | ≥85% |

### Invocation

```markdown
### Skill: react-native-best-practices

**ID:** `app-factory:react-native-best-practices`
**Trigger:** React Native code present
**Inputs:**
  - Code paths: `builds/<slug>/src/**/*.{ts,tsx}`
  - Code paths: `builds/<slug>/app/**/*.tsx`
**Outputs:**
  - Report: `runs/<timestamp>/reports/agent_skills/react-native-best-practices.md`
**Gate Criteria:**
  - BLOCKED if any CRITICAL violation
  - FAIL if score < 90%
  - CONDITIONAL if 90-94%
  - PASS if ≥95%
```

### Critical Rules

```typescript
// CRITICAL: Use Promise.all for parallel fetching
// BAD
const user = await getUser();
const settings = await getSettings();

// GOOD
const [user, settings] = await Promise.all([getUser(), getSettings()]);
```

```typescript
// CRITICAL: Avoid barrel imports
// BAD
import { Button, Card, Text } from '@/components';

// GOOD
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
```

```typescript
// CRITICAL: Use FlatList for lists > 10 items
// BAD
{items.map(item => <Item key={item.id} {...item} />)}

// GOOD
<FlatList
  data={items}
  renderItem={({ item }) => <Item {...item} />}
  keyExtractor={item => item.id}
/>
```

```typescript
// CRITICAL: Clean up useEffect subscriptions
// BAD
useEffect(() => {
  const sub = subscribe(callback);
}, []);

// GOOD
useEffect(() => {
  const sub = subscribe(callback);
  return () => sub.unsubscribe();
}, []);
```

---

## Gate 3: Ralph Quality Gate

**Trigger:** During Phase 4 (Ralph Polish Loop)
**Blocks:** Final output to builds/

### Skills as Ralph Categories

```markdown
## Ralph Quality Report

### Build Quality (25% weight)
- [ ] npm install succeeds
- [ ] npx expo start launches
- [ ] No TypeScript errors
- [ ] App runs in Expo Go

### React Native Skills Compliance (20% weight)
- [ ] No CRITICAL violations
- [ ] Promise.all for parallel operations
- [ ] FlatList for long lists
- [ ] useEffect cleanup present
- [ ] No barrel imports
- [ ] Overall skill score ≥95%

### Mobile UI Skills Compliance (25% weight)
- [ ] Touch targets ≥44pt (iOS) / 48dp (Android)
- [ ] Accessibility labels on all interactive elements
- [ ] Skeleton loaders for async content
- [ ] Designed empty/error states with CTAs
- [ ] Safe areas respected (SafeAreaView)
- [ ] prefers-reduced-motion respected
- [ ] Overall skill score ≥95%

### Monetization Quality (15% weight)
- [ ] RevenueCat SDK integrated
- [ ] Paywall screen implemented
- [ ] Premium features gated
- [ ] Sandbox mode works

### Research & ASO Quality (15% weight)
- [ ] market_research.md is substantive
- [ ] competitor_analysis.md names real apps
- [ ] ASO materials complete
```

### Pass Criteria

```
Ralph PASS if:
  - Overall score ≥97%
  - No CRITICAL items failed
  - All HIGH items passed or explicitly deferred
```

---

## Report Output Location

All skill reports are saved to:

```
app-factory/
└── runs/
    └── YYYY-MM-DD/
        └── build-<timestamp>/
            └── reports/
                └── agent_skills/
                    ├── react-native-best-practices.md
                    ├── mobile-ui-guidelines.md
                    ├── mobile-interface-guidelines.md
                    ├── expo-standards.md
                    └── gate_summary.md
```

---

## Troubleshooting

### "Gate 2 keeps failing on react-native-best-practices"

1. Check for sequential awaits - convert to Promise.all
2. Check for barrel imports (`@/components/index.ts`)
3. Check for inline functions in FlatList renderItem
4. Verify all useEffect have cleanup functions

### "Ralph fails on mobile-ui-guidelines"

1. Check touch target sizes (44pt minimum)
2. Add accessibilityLabel to all Pressable/TouchableOpacity
3. Add SafeAreaView to root layouts
4. Verify skeleton loaders exist for data fetching

### "Max attempts reached"

Pipeline enters manual intervention mode:
1. Review all reports in `reports/agent_skills/`
2. Fix violations manually
3. Run `npx expo start` to verify
4. Resume pipeline

---

## Version History

- **1.0** (2026-01-18): Initial quality gates specification
