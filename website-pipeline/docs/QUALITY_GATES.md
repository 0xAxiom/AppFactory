# Website Pipeline Quality Gates

**Pipeline:** website-pipeline
**Version:** 1.0

---

## Overview

Quality gates are mandatory checkpoints that validate websites against skills before shipping. Unlike other pipelines, website-pipeline has **three mandatory audit phases** that must all pass.

---

## Gate 1: Skills Audit (Phase 6)

**Trigger:** After Phase 5 (Build) completes
**Blocks:** Phase 7 (SEO Review)

### Skills Checked

| Skill                 | Weight | Pass Threshold     |
| --------------------- | ------ | ------------------ |
| react-best-practices  | 55%    | ≥95%, no CRITICAL  |
| web-design-guidelines | 45%    | ≥90%, no HIGH a11y |

### Invocation

```markdown
### Skill: react-best-practices

**ID:** `website-pipeline:react-best-practices`
**Trigger:** Build phase complete
**Inputs:**

- Code paths: `website-builds/<slug>/src/**/*.{ts,tsx}`
- Performance budget: LCP < 2.5s, bundle < 200KB
  **Outputs:**
- Report: `website-builds/<slug>/audits/react-best-practices.md`
  **Gate Criteria:**
- BLOCKED if any CRITICAL violation
- FAIL if score < 95%
- PASS if ≥95%

### Skill: web-design-guidelines

**ID:** `website-pipeline:web-design-guidelines`
**Trigger:** Build phase complete
**Inputs:**

- Code paths: `website-builds/<slug>/src/**/*.tsx`
- Accessibility standard: WCAG 2.1 AA
  **Outputs:**
- Report: `website-builds/<slug>/audits/web-design-guidelines.md`
  **Gate Criteria:**
- BLOCKED if any HIGH accessibility violation
- FAIL if score < 90%
- PASS if ≥90%
```

### Pass Criteria

```
Gate 1 PASS if:
  - react-best-practices: ≥95% AND no CRITICAL
  - web-design-guidelines: ≥90% AND no HIGH a11y violations
  - Both audits produce reports in audits/
```

### On Failure

1. Claude identifies all violations
2. Claude fixes violations automatically
3. Re-run Gate 1 (max 3 attempts)
4. If still failing: manual intervention required

---

## Gate 2: SEO Review (Phase 7)

**Trigger:** After Gate 1 passes
**Blocks:** Phase 8 (Ralph Polish Loop)

### SEO Checklist

All items must pass:

#### Technical SEO

- [ ] robots.txt exists and is valid
- [ ] sitemap.xml is generated (or sitemap.ts)
- [ ] Canonical URLs are set
- [ ] Structured data (JSON-LD) present on relevant pages
- [ ] No broken internal links
- [ ] HTTPS ready

#### On-Page SEO

- [ ] Unique title tags on all pages (< 60 chars)
- [ ] Meta descriptions on all pages (150-160 chars)
- [ ] One H1 per page
- [ ] Proper heading hierarchy (no skipped levels)
- [ ] Alt text on all images
- [ ] Descriptive anchor text for links

#### Performance SEO

- [ ] LCP < 2.5s (Lighthouse)
- [ ] Images use next/image
- [ ] Fonts use next/font
- [ ] No render-blocking resources

#### Social SEO

- [ ] Open Graph tags present
- [ ] Twitter Card tags present
- [ ] OG image exists (1200x630)

### Output

```
website-builds/<slug>/
└── audits/
    └── seo_review.md
```

### Pass Criteria

```
Gate 2 PASS if:
  - All Technical SEO items pass
  - All On-Page SEO items pass
  - All Performance SEO items pass
  - All Social SEO items pass
```

---

## Gate 3: Ralph Quality Gate (Phase 8)

**Trigger:** After Gate 2 passes
**Blocks:** Final output

### Ralph's Checklist

```markdown
## Ralph Quality Report

### Build Quality (20% weight)

- [ ] npm install succeeds
- [ ] npm run build succeeds
- [ ] npm run dev starts on localhost:3000
- [ ] No TypeScript errors
- [ ] vercel.json is valid

### Skills Compliance (30% weight)

- [ ] react-best-practices audit: PASS
- [ ] web-design-guidelines audit: PASS
- [ ] All CRITICAL issues resolved
- [ ] All HIGH issues resolved
- [ ] Audit reports present in audits/

### SEO Quality (20% weight)

- [ ] SEO review: PASS
- [ ] All Technical SEO items pass
- [ ] All On-Page SEO items pass
- [ ] OG image present and correct size

### Content Quality (15% weight)

- [ ] No placeholder text ("Lorem ipsum", "TODO")
- [ ] All images have meaningful alt text
- [ ] Contact form functional (if present)
- [ ] All internal links work
- [ ] 404 page is designed (not default)

### Documentation Quality (15% weight)

- [ ] README.md explains the website
- [ ] DEPLOYMENT.md has working steps
- [ ] .env.example lists all variables
- [ ] Design system documented in planning/
```

### Pass Criteria

```
Ralph PASS if:
  - Overall score ≥97%
  - No CRITICAL items failed
  - Gates 1 and 2 passed
  - All audit reports exist
```

---

## Report Output Locations

All reports are saved to the website build directory:

```
website-builds/<slug>/
├── audits/
│   ├── react-best-practices.md    # Gate 1
│   ├── web-design-guidelines.md   # Gate 1
│   ├── audit_summary.md           # Gate 1 combined
│   └── seo_review.md              # Gate 2
├── research/
│   ├── market_research.md
│   ├── competitor_analysis.md
│   └── positioning.md
└── planning/
    ├── sitemap.md
    ├── content_model.md
    ├── navigation.md
    └── design_system.md
```

Execution logs are saved separately:

```
runs/YYYY-MM-DD/website-<timestamp>/
├── inputs/
│   ├── raw_input.md
│   ├── normalized_prompt.md
│   └── dream_spec.md
└── polish/
    ├── ralph_report_1.md
    ├── ralph_report_2.md
    └── ralph_final_verdict.md
```

---

## Gate Summary Format

```markdown
# Quality Gate Summary

**Website:** <slug>
**Timestamp:** <ISO timestamp>

## Gate 1: Skills Audit

| Skill                 | Score | Violations | Verdict |
| --------------------- | ----- | ---------- | ------- |
| react-best-practices  | 97%   | 1 MEDIUM   | PASS    |
| web-design-guidelines | 92%   | 2 MEDIUM   | PASS    |

**Gate 1 Verdict:** PASS

## Gate 2: SEO Review

| Category        | Passed | Failed |
| --------------- | ------ | ------ |
| Technical SEO   | 8      | 0      |
| On-Page SEO     | 10     | 0      |
| Performance SEO | 6      | 0      |
| Social SEO      | 5      | 0      |

**Gate 2 Verdict:** PASS

## Gate 3: Ralph Polish

**Iteration:** 1
**Score:** 98%
**Verdict:** PASS

## Overall Pipeline Verdict

**PASS** - All gates satisfied, website ready for deployment
```

---

## Troubleshooting

### "Gate 1 fails on react-best-practices"

1. Check `audits/react-best-practices.md` for violations
2. Common issues:
   - Barrel imports (`import from '@/components'`)
   - Unnecessary `'use client'` directives
   - Missing dynamic imports for heavy components
   - Sequential await instead of Promise.all

### "Gate 1 fails on web-design-guidelines"

1. Check `audits/web-design-guidelines.md` for violations
2. Common issues:
   - Missing ARIA labels on buttons/links
   - No Framer Motion page transitions
   - Missing skeleton loaders
   - Poor color contrast

### "Gate 2 fails on SEO"

1. Check `audits/seo_review.md` for issues
2. Common issues:
   - Missing sitemap.ts file
   - Meta descriptions too short
   - Missing OG image
   - Images without alt text

### "Ralph fails after 3 iterations"

Pipeline enters manual intervention:

1. Review `runs/.../polish/ralph_final_verdict.md`
2. Fix remaining issues manually
3. Run verification commands
4. Resume pipeline

---

## Version History

- **1.0** (2026-01-18): Initial quality gates specification
