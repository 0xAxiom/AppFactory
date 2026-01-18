# dApp Factory Quality Gates

**Pipeline:** dapp-factory
**Version:** 8.0

---

## Overview

Quality gates are mandatory checkpoints that validate code against skills before proceeding to the next phase. All dApps must pass these gates to reach completion.

---

## Gate 1: Post-Build Skills Check

**Trigger:** After Phase 3 (Build) completes
**Blocks:** Phase 4 (Ralph Polish Loop)

### Skills Checked

| Skill | Weight | Pass Threshold |
|-------|--------|----------------|
| react-best-practices | 40% | ≥90%, no CRITICAL |
| web-interface-guidelines | 30% | ≥85% |
| web-design-guidelines | 30% | ≥85% |

### Invocation

```markdown
### Skill: react-best-practices

**ID:** `dapp-factory:react-best-practices`
**Trigger:** React/Next.js code present in dapp-builds/<slug>/src/
**Inputs:**
  - Code paths: `dapp-builds/<slug>/src/**/*.{ts,tsx}`
  - Performance budget: LCP < 2.5s, bundle < 200KB
**Outputs:**
  - Report: `runs/<timestamp>/reports/agent_skills/react-best-practices.md`
  - Fixes list: Appended to report
**Gate Criteria:**
  - BLOCKED if any CRITICAL violation
  - FAIL if score < 90%
  - CONDITIONAL if 90-94%
  - PASS if ≥95%
```

```markdown
### Skill: web-design-guidelines

**ID:** `dapp-factory:web-design-guidelines`
**Trigger:** UI components present in dapp-builds/<slug>/src/components/
**Inputs:**
  - Code paths: `dapp-builds/<slug>/src/**/*.tsx`
  - Accessibility standard: WCAG 2.1 AA
**Outputs:**
  - Report: `runs/<timestamp>/reports/agent_skills/web-design-guidelines.md`
**Gate Criteria:**
  - FAIL if score < 85%
  - PASS if ≥85%
```

### Pass Criteria

```
Gate 1 PASS if:
  - react-best-practices: ≥90% AND no CRITICAL
  - web-interface-guidelines: ≥85%
  - web-design-guidelines: ≥85%
  - Weighted average: ≥88%
```

### On Failure

1. Claude identifies all violations
2. Claude fixes violations automatically
3. Re-run Gate 1
4. Max 3 attempts before manual intervention required

---

## Gate 2: Ralph Quality Gate

**Trigger:** During Phase 4 (Ralph Polish Loop)
**Blocks:** Final output to dapp-builds/

### Skills as Ralph Categories

Ralph incorporates skills as scoring categories:

```markdown
## Ralph Quality Report

### Build Quality (25% weight)
- [ ] npm install succeeds
- [ ] npm run build succeeds
- [ ] npm run dev starts on localhost:3000
- [ ] No TypeScript errors

### React Skills Compliance (20% weight)
- [ ] No CRITICAL violations (async patterns, bundle imports)
- [ ] No HIGH violations (server components, caching)
- [ ] Server components used by default
- [ ] Dynamic imports for heavy dependencies
- [ ] Overall skill score ≥95%

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

### Research Quality (15% weight)
- [ ] market_research.md is substantive
- [ ] competitor_analysis.md names real competitors
- [ ] positioning.md has clear differentiation

### Documentation Quality (15% weight)
- [ ] README.md explains the dApp
- [ ] DEPLOYMENT.md has working steps
- [ ] .env.example lists all variables
```

### Pass Criteria

```
Ralph PASS if:
  - Overall score ≥97%
  - No CRITICAL items failed
  - All HIGH items passed or explicitly deferred
```

---

## Gate 3: Agent Architecture Gate (Mode B Only)

**Trigger:** If Agent Decision = Mode B
**Blocks:** Ralph Final Verdict

### Additional Checks

```markdown
### Agent Skills Compliance (Mode B - 15% weight)

- [ ] Agent definition follows Rig patterns
- [ ] All tools have typed args/output (Zod)
- [ ] Execution loop handles tool calls
- [ ] Max iterations enforced
- [ ] Agent preamble is substantive
- [ ] Agent responses render cleanly in UI
- [ ] Loading states during agent reasoning
- [ ] Error handling for agent failures
- [ ] Transaction confirmation required
- [ ] Rate limiting on agent calls
```

---

## Report Output Location

All skill reports are saved to:

```
dapp-factory/
└── runs/
    └── YYYY-MM-DD/
        └── build-<timestamp>/
            └── reports/
                └── agent_skills/
                    ├── react-best-practices.md
                    ├── web-design-guidelines.md
                    ├── web-interface-guidelines.md
                    └── gate_summary.md
```

### gate_summary.md Format

```markdown
# Quality Gate Summary

**Build:** <build-id>
**Timestamp:** <ISO timestamp>

## Gate 1: Post-Build Skills Check

| Skill | Score | Verdict |
|-------|-------|---------|
| react-best-practices | 96% | PASS |
| web-interface-guidelines | 92% | PASS |
| web-design-guidelines | 88% | CONDITIONAL |

**Gate 1 Verdict:** CONDITIONAL (2 fixes required)

## Gate 2: Ralph Integration

**Ralph Iteration:** 2
**Final Score:** 97%
**Final Verdict:** PASS

## Overall Pipeline Verdict

**PASS** - All gates satisfied
```

---

## Troubleshooting

### "Gate 1 keeps failing"

1. Check `reports/agent_skills/react-best-practices.md` for violations
2. Common issues:
   - Barrel imports (`import from '@/components'`)
   - Missing `'use client'` directive awareness
   - Sequential await instead of Promise.all

### "Ralph fails on web-design-guidelines"

1. Check for missing accessibility attributes
2. Verify Framer Motion animations on page load
3. Ensure skeleton loaders exist for data fetching

### "Max attempts reached"

Pipeline enters manual intervention mode:
1. Review all reports in `reports/agent_skills/`
2. Fix violations manually
3. Run `npm run build` to verify
4. Resume pipeline

---

## Version History

- **1.0** (2026-01-18): Initial quality gates specification
