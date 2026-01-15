# Skill Enforcer - Mobile Factory

**Purpose:** Verify code against registered skills before proceeding to next build phase.

---

## Registered Skills

| Skill | Location | When Checked |
|-------|----------|--------------|
| react-native-best-practices | `skills/react-native-best-practices/` | After Milestone 3 |
| mobile-ui-guidelines | `skills/mobile-ui-guidelines/` | After Milestone 2 |
| expo-standards | `skills/expo-standards/` | Throughout build |

---

## Activation Triggers

### After Milestone 2 (Core Screens)
- **Skill:** mobile-ui-guidelines
- **Focus:** Accessibility, touch targets, loading/empty/error states

### After Milestone 3 (Feature Implementation)
- **Skill:** react-native-best-practices
- **Focus:** Async patterns, list performance, re-render prevention

### Before Milestone 5 (Polish)
- **Skills:** Both react-native-best-practices AND mobile-ui-guidelines
- **Focus:** Full compliance check before final polish

---

## Enforcement Process

### Step 1: Load Skill Rules

```
Read skills/<skill-name>/AGENTS.md
Parse all rules into checklist format
Identify applicable rules based on code patterns
```

### Step 2: Analyze Code

```
For each rule:
  1. Identify applicable files (by pattern)
  2. Search for violation patterns
  3. Record severity + location
```

### Step 3: Calculate Score

```
skill_score = (passed_rules / applicable_rules) × 100

Severity weights:
- CRITICAL violation: -5 points (blocks build)
- HIGH violation: -3 points
- MEDIUM violation: -2 points
- LOW violation: -1 point
```

### Step 4: Generate Report

```markdown
# Skill Enforcement Report

**Skill:** {{skill-name}}
**Milestone:** {{milestone-number}}
**Date:** YYYY-MM-DD HH:MM

---

## Score: XX% (X/X rules passed)

---

## Violations by Severity

### CRITICAL (blocks build)
- [ ] {{rule-id}}: {{description}}
  - File: {{file-path}}:{{line}}
  - Fix: {{suggested-fix}}

### HIGH (should fix now)
- [ ] {{rule-id}}: {{description}}
  - File: {{file-path}}:{{line}}
  - Fix: {{suggested-fix}}

### MEDIUM (fix before Ralph)
- [ ] {{rule-id}}: {{description}}
  - File: {{file-path}}:{{line}}

### LOW (can defer)
- [x] {{rule-id}}: {{description}}
  - Deferred (non-blocking)

---

## Recommendation: PROCEED | FIX FIRST | BLOCKED

---

## Next Steps
[If BLOCKED: List critical fixes required]
[If FIX FIRST: List high-priority fixes]
[If PROCEED: Confirmation to continue]
```

### Step 5: Take Action

| Score | Status | Action |
|-------|--------|--------|
| ≥95% | PROCEED | Continue to next milestone |
| 90-94% | FIX FIRST | Fix HIGH violations before proceeding |
| <90% | BLOCKED | Fix all CRITICAL/HIGH violations |
| Any CRITICAL | BLOCKED | Cannot proceed until resolved |

---

## Common Violations & Fixes

### React Native Best Practices

| Violation | Quick Fix |
|-----------|-----------|
| Sequential awaits | Use `Promise.all([...])` |
| Barrel imports | Import directly from component file |
| ScrollView + map | Replace with FlatList |
| Missing cleanup | Add return function to useEffect |
| Inline styles | Use StyleSheet.create |

### Mobile UI Guidelines

| Violation | Quick Fix |
|-----------|-----------|
| Small touch target | Add minWidth/minHeight: 44 |
| Missing a11y label | Add accessibilityLabel prop |
| Spinner loading | Replace with Skeleton component |
| Empty "No items" | Add icon, message, and CTA |
| Raw error text | Add styled error card with retry |

---

## Integration with Ralph

Skill enforcement feeds into Ralph QA:

1. **During Build:** Skills checked after milestones (advisory)
2. **During Ralph:** Skill compliance becomes scoring category (mandatory)

Ralph's verdict calculation includes:
- React Native Skills Compliance: 5% weight
- Mobile UI Skills Compliance: 5% weight

---

## Enforcement Levels

### Level 1: Advisory (during build)
- Show violations in output
- Don't block progress
- Track for Ralph QA

### Level 2: Warning (before milestones)
- Show violations prominently
- Require acknowledgment
- Add to Ralph checklist

### Level 3: Blocking (Ralph QA)
- CRITICAL violations fail build
- Must fix before PASS

---

## Version

- **1.0** (2026-01-15): Initial release
