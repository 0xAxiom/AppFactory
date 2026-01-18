# Skills System

**Version:** 1.0
**Applies to:** All AppFactory pipelines with React/UI generation

---

## What is a Skill?

A **skill** is a reusable set of instructions that defines quality standards for a specific domain. Skills are consumed by Claude during code generation and review to ensure consistent, high-quality output.

Skills contain:
- **Rules**: Specific patterns to follow or avoid
- **Examples**: Good/bad code snippets
- **Severity Levels**: CRITICAL, HIGH, MEDIUM, LOW
- **Scoring Criteria**: How to evaluate compliance

---

## Skill Reference Format

### Skill ID

Each skill has a unique identifier:

```
<pipeline>:<skill-name>
```

Examples:
- `dapp-factory:react-best-practices`
- `app-factory:mobile-interface-guidelines`
- `website-pipeline:seo-guidelines`

### Skill Path

Skills are located in:

```
<pipeline>/skills/<skill-name>/
├── SKILL.md    # Human-readable reference
└── AGENTS.md   # Full rules for agent consumption
```

---

## When Skills Are Invoked

Skills are invoked at specific points in each pipeline:

### Invocation Points

| Point | Description | Purpose |
|-------|-------------|---------|
| **Review Step** | During code writing | Guide decisions in real-time |
| **Quality Gate** | After a build phase | Validate before proceeding |
| **Pre-ship Audit** | Before final output | Comprehensive compliance check |

### Pipeline-Specific Invocation

| Pipeline | Review Step | Quality Gate | Pre-ship Audit |
|----------|-------------|--------------|----------------|
| app-factory | During Milestone 2-3 | After each Milestone | Ralph Final |
| dapp-factory | During Phase 3 | After Phase 3 | Ralph Final |
| website-pipeline | During Phase 4-5 | After Phase 5 | Phase 6 Audit |

---

## Skill Invocation Block Template

When documenting skill usage in pipeline docs, use this standard block:

```markdown
### Skill: <skill-name>

**ID:** `<pipeline>:<skill-name>`
**Trigger:** <When this skill activates>
**Inputs:** <What the skill needs>
**Outputs:** <What the skill produces>
**Gate Criteria:** <Pass/fail conditions>

#### Example Invocation

```
SKILL CHECK: react-best-practices
├── Scan: src/components/**/*.tsx
├── Rules: CRITICAL (4), HIGH (8), MEDIUM (12)
├── Found: 2 violations
│   ├── [CRITICAL] bundle-imports in src/components/index.ts:12
│   └── [HIGH] server-prefer-server-components in src/app/page.tsx:1
└── Result: BLOCKED (1 CRITICAL violation)
```
```

---

## Required Outputs

When a skill is invoked, it must produce:

### 1. Compliance Report

Location: `<pipeline>/runs/<timestamp>/reports/agent_skills/<skill-name>.md`

Format:
```markdown
# <Skill Name> Compliance Report

**Generated:** <timestamp>
**Pipeline:** <pipeline-name>
**Build:** <build-id>

## Summary

| Severity | Passed | Failed | Total |
|----------|--------|--------|-------|
| CRITICAL | X | Y | Z |
| HIGH | X | Y | Z |
| MEDIUM | X | Y | Z |
| LOW | X | Y | Z |

**Overall Score:** XX%
**Verdict:** PASS | CONDITIONAL | FAIL | BLOCKED

## Violations

### [CRITICAL] <rule-id>: <rule-name>

**File:** `<path>`
**Line:** <number>
**Issue:** <description>

**Bad:**
```tsx
<code snippet>
```

**Fix:**
```tsx
<corrected code>
```

---

(Repeat for each violation)
```

### 2. Required Fixes List (if violations exist)

Location: Same file, appended

Format:
```markdown
## Required Fixes

### Must Fix Before Proceeding (CRITICAL)

1. [ ] <file>:<line> - <fix description>
2. [ ] <file>:<line> - <fix description>

### Must Fix Before Ralph (HIGH)

1. [ ] <file>:<line> - <fix description>

### Should Fix (MEDIUM)

1. [ ] <file>:<line> - <fix description>

### Optional (LOW)

1. [ ] <file>:<line> - <fix description>
```

---

## Pass/Fail Criteria

### Blocking Conditions

| Condition | Result |
|-----------|--------|
| Any CRITICAL violation | **BLOCKED** - Cannot proceed |
| >3 HIGH violations | **FAIL** - Must fix before continuing |
| Overall score <90% | **CONDITIONAL** - Fix before Ralph |

### Scoring Formula

```
score = (passed_rules / applicable_rules) × 100

Where:
- CRITICAL violations = automatic 0%
- HIGH violations count as 2× weight
- Only rules applicable to the codebase are counted
```

### Thresholds

| Score | Verdict | Action |
|-------|---------|--------|
| 100% | PASS | Proceed normally |
| 95-99% | PASS | Proceed, note minor issues |
| 90-94% | CONDITIONAL | Fix before Ralph |
| <90% | FAIL | Must fix before proceeding |
| Any CRITICAL | BLOCKED | Cannot proceed |

---

## Registered Skills by Pipeline

### app-factory

| Skill | Purpose | Invocation Point |
|-------|---------|------------------|
| `react-native-best-practices` | RN performance | After Milestone 3 |
| `mobile-ui-guidelines` | Mobile UI/UX | After Milestone 2 |
| `mobile-interface-guidelines` | Touch, a11y, perf | After Milestone 2, 3, Final |
| `expo-standards` | Expo-specific | Throughout build |

### dapp-factory

| Skill | Purpose | Invocation Point |
|-------|---------|------------------|
| `react-best-practices` | React/Next.js perf | Phase 3 (Build) |
| `web-design-guidelines` | UI/UX/a11y | Phase 4 (Ralph) |
| `web-interface-guidelines` | Web-specific | Phase 3, 4 |
| `vercel-deploy` | Deployment | Phase 4 (optional) |

### website-pipeline

| Skill | Purpose | Invocation Point |
|-------|---------|------------------|
| `react-best-practices` | React/Next.js perf | Phase 5 (Build) |
| `web-design-guidelines` | UI/UX/a11y | Phase 6 (Audit) |
| `seo-guidelines` | SEO compliance | Phase 6 (Audit) |

---

## Creating a New Skill

### Step 1: Create Directory

```
<pipeline>/skills/<skill-name>/
├── SKILL.md
└── AGENTS.md
```

### Step 2: Define SKILL.md

```markdown
# <Skill Name>

**Purpose:** <One-line description>
**Source:** <Origin if mirrored, or "Internal">

---

## When to Activate

This skill activates during:
- **Phase X** (<description>)
- **Phase Y** (<description>)

Trigger phrases:
- "<phrase 1>"
- "<phrase 2>"

---

## How to Use This Skill

1. **During Build:** <instructions>
2. **After Build:** <instructions>
3. **During Ralph:** <instructions>

---

## Rule Categories

| Priority | Category | Impact | Description |
|----------|----------|--------|-------------|
| CRITICAL | <name> | <impact> | <description> |
| HIGH | <name> | <impact> | <description> |

---

## Quick Reference

### CRITICAL Rules

```typescript
// <rule-id>: <rule-name>
// BAD
<bad code>

// GOOD
<good code>
```

---

## Compliance Scoring

```
skill_score = (passed_rules / applicable_rules) × 100

Thresholds:
- PASS: ≥95%
- CONDITIONAL: 90-94%
- FAIL: <90%
- Any CRITICAL violation: BLOCKED
```

---

## Integration with Ralph

Ralph includes this skill as a scoring category:

```markdown
### <Skill> Compliance (X% weight)

- [ ] <check 1>
- [ ] <check 2>
- [ ] Overall skill score ≥95%
```
```

### Step 3: Define AGENTS.md

Full rules document with:
- Every rule ID
- Every code example
- Detection patterns
- Severity justifications

### Step 4: Register in Pipeline

Add to pipeline's CLAUDE.md under "Skill Compliance" section.

---

## Skill Maintenance

### Updating Skills

1. Check upstream source for updates (if mirrored)
2. Review changes for breaking modifications
3. Update local copy
4. Update version in SKILL.md
5. Run test build to verify

### Deprecating Rules

1. Mark rule as deprecated in AGENTS.md
2. Keep for 2 versions for backwards compatibility
3. Remove in subsequent version
4. Document in changelog

---

## Integration with Ralph QA

Ralph uses skills as scoring categories in its polish loop:

```markdown
## Ralph Quality Report

### Build Quality (30% weight)
- [x] npm install succeeds
- [x] npm run build succeeds
- [x] No TypeScript errors

### React Skills Compliance (20% weight)
- [ ] No CRITICAL violations
- [x] No HIGH violations
- [x] Server components used by default
- [x] Overall skill score: 96%

### Web Design Skills Compliance (25% weight)
- [x] All interactive elements have accessible names
- [x] Focus states visible
- [ ] Skeleton loaders for async content
- [x] Overall skill score: 92%

### Research Quality (15% weight)
...

### Documentation Quality (10% weight)
...

---

**Overall Score:** 94%
**Verdict:** CONDITIONAL (fix skeleton loaders)
```

---

## Version History

- **1.0** (2026-01-18): Initial skills system specification
