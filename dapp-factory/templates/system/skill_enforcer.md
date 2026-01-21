# Skill Enforcer - Web3 Factory

**Purpose:** Verify code against registered skills before proceeding to Ralph QA phase.

---

## Registered Skills

| Skill                 | Location                        | When Checked   | Weight |
| --------------------- | ------------------------------- | -------------- | ------ |
| react-best-practices  | `skills/react-best-practices/`  | During Phase 3 | 20%    |
| web-design-guidelines | `skills/web-design-guidelines/` | Before Phase 4 | 25%    |
| vercel-deploy         | `skills/vercel-deploy/`         | On request     | N/A    |

---

## Activation Triggers

### During Phase 3 (Build)

- **Skill:** react-best-practices
- **Focus:** Async patterns, bundle optimization, server components

### Before Phase 4 (Ralph Loop)

- **Skill:** web-design-guidelines
- **Focus:** Accessibility, animations, loading/empty/error states

### Phase 5 (Optional - On Request)

- **Skill:** vercel-deploy
- **Focus:** Deploy to Vercel after Ralph PASS

---

## Enforcement Process

### Step 1: Load Skill Rules

```
Read skills/<skill-name>/AGENTS.md (if exists)
Read skills/<skill-name>/SKILL.md for quick reference
Parse all rules into checklist format
Identify applicable rules based on code patterns
```

### Step 2: Analyze Code

```
For each rule:
  1. Identify applicable files (by pattern)
  2. Search for violation patterns (grep/AST)
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
**App:** {{app-slug}}
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

| Score        | Status    | Action                           |
| ------------ | --------- | -------------------------------- |
| ≥95%         | PROCEED   | Continue to Ralph QA             |
| 90-94%       | FIX FIRST | Fix HIGH violations before Ralph |
| <90%         | BLOCKED   | Fix all CRITICAL/HIGH violations |
| Any CRITICAL | BLOCKED   | Cannot proceed until resolved    |

---

## Common Violations & Fixes

### React Best Practices

| Violation                | Quick Fix                           |
| ------------------------ | ----------------------------------- |
| Sequential awaits        | Use `Promise.all([...])`            |
| Barrel imports           | Import directly from component file |
| Missing dynamic import   | Use `dynamic()` for heavy deps      |
| Client component overuse | Remove `'use client'` if not needed |
| No caching               | Add `unstable_cache()` wrapper      |

### Web Design Guidelines

| Violation          | Quick Fix                               |
| ------------------ | --------------------------------------- |
| Missing aria-label | Add `aria-label` to interactive element |
| No focus-visible   | Add focus-visible styles                |
| No page animation  | Wrap with motion.div + fade/slide       |
| Spinner loading    | Replace with Skeleton component         |
| Empty "No items"   | Add icon, message, and CTA              |
| Raw error text     | Add styled error card with retry        |
| Monospace body     | Use Inter/system sans-serif             |

---

## Integration with Ralph

Skill enforcement feeds into Ralph QA:

1. **During Build:** Skills checked as advisory
2. **During Ralph:** Skill compliance becomes scoring categories

Ralph's verdict calculation includes:

- React Skills Compliance: 20% weight
- Web Design Skills Compliance: 25% weight

Total skill weight: **45%** of Ralph score

---

## Enforcement Levels

### Level 1: Advisory (during build)

- Show violations in output
- Don't block progress
- Track for Ralph QA

### Level 2: Warning (before Ralph)

- Show violations prominently
- Require acknowledgment
- Add to Ralph checklist

### Level 3: Blocking (Ralph QA)

- CRITICAL violations fail build
- Must fix before PASS verdict

---

## Validator Integration

The build validator (`validator/index.ts`) includes skill compliance checking:

```typescript
// Skill compliance is checked as part of validation
function checkSkillCompliance(buildDir: string): CheckResult[] {
  // Checks react-best-practices violations
  // Checks web-design-guidelines violations
  // Returns compliance score
}
```

Output in `factory_ready.json`:

```json
{
  "gates": {
    "skill_compliance": {
      "status": "PASS",
      "react_best_practices": "96%",
      "web_design_guidelines": "98%",
      "details": "All critical rules passed"
    }
  }
}
```

---

## Version

- **1.0** (2026-01-15): Initial release
