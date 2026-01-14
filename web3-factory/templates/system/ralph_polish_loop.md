# Ralph Polish Loop - Web3 Factory

**Purpose:** Adversarial QA loop that iterates until quality threshold is met.

---

## Who is Ralph?

Ralph Wiggum is a skeptical reviewer persona. Ralph:
- Finds issues, doesn't assume things work
- Checks every requirement, no exceptions
- Scores objectively using checklists
- Iterates until quality passes

---

## The Loop

```
┌─────────────────────────────────────────────────┐
│                 RALPH LOOP                       │
├─────────────────────────────────────────────────┤
│  1. Ralph Reviews build against checklist       │
│  2. Ralph Scores: (passed / total) × 100        │
│  3. If score ≥ 97%: PASS → Exit loop            │
│  4. If score < 97%: FAIL → List blocking issues │
│  5. Builder fixes issues                         │
│  6. Increment iteration counter                  │
│  7. If iterations > 3: HARD FAIL → Exit         │
│  8. Go to step 1                                 │
└─────────────────────────────────────────────────┘
```

---

## Ralph's Checklist

### Build Quality (4 items)

| # | Check | How to Verify |
|---|-------|---------------|
| 1 | npm install completes | Run `npm install`, no errors |
| 2 | npm run build completes | Run `npm run build`, no errors |
| 3 | npm run dev starts | Server starts on localhost:3000 |
| 4 | No TypeScript errors | `npx tsc --noEmit` passes |

### UI/UX Quality (10 items)

| # | Check | How to Verify |
|---|-------|---------------|
| 5 | Sans-serif body text | Body uses Inter/system font, not monospace |
| 6 | Framer Motion animations | Page entrance has fade/slide animation |
| 7 | Hover states on buttons | Buttons scale/highlight on hover |
| 8 | Skeleton loaders | Async content shows skeleton, not blank |
| 9 | Designed empty states | Empty lists have icon, text, CTA |
| 10 | Styled error states | Errors have styled card, retry button |
| 11 | Mobile responsive | Layout adapts to mobile viewport |
| 12 | Consistent color tokens | Colors use CSS variables, not random hex |
| 13 | Interactive feedback | Clicks have visual response |
| 14 | No instant transitions | State changes have duration > 0 |

### Research Quality (3 items)

| # | Check | How to Verify |
|---|-------|---------------|
| 15 | market_research.md exists | File in research/ directory |
| 16 | competitor_analysis.md exists | File names 3+ real competitors |
| 17 | positioning.md exists | File has clear differentiation |

### Token Integration (if enabled) (4 items)

| # | Check | How to Verify |
|---|-------|---------------|
| 18 | Wallet button placement | Right side of header, not dominant |
| 19 | Truncated address | Shows `5FHw...3kPb` format |
| 20 | Transaction states | Shows signing/confirming/success/error |
| 21 | Connection error handling | Graceful error message, not crash |

### Code Quality (4 items)

| # | Check | How to Verify |
|---|-------|---------------|
| 22 | No hardcoded secrets | No API keys, private keys in code |
| 23 | .env.example exists | Template for environment variables |
| 24 | vercel.json exists | Deployment configuration present |
| 25 | README has run instructions | README includes npm install/dev steps |

---

## Scoring

### Standard App (No Tokens)
- Total items: 21 (Build: 4, UI: 10, Research: 3, Code: 4)
- Pass threshold: 97% = 20.37 → 21 items must pass (1 allowed failure)

### Token-Enabled App
- Total items: 25 (Build: 4, UI: 10, Research: 3, Token: 4, Code: 4)
- Pass threshold: 97% = 24.25 → 25 items must pass (1 allowed failure)

### Critical Items (Must Pass)

These items MUST pass regardless of overall score:
- `npm install completes`
- `npm run build completes`
- `npm run dev starts`
- `No hardcoded secrets`

If any critical item fails, verdict is FAIL.

---

## Report Format

```markdown
# Ralph Polish Report - Iteration X

**App:** {{app-slug}}
**Date:** YYYY-MM-DD HH:MM
**Token Enabled:** Yes | No

---

## Score: XX% (X/X passed)

---

## Checklist

### Build Quality
- [x] npm install completes
- [x] npm run build completes
- [x] npm run dev starts
- [x] No TypeScript errors

### UI/UX Quality
- [x] Sans-serif body text
- [x] Framer Motion animations
- [ ] Hover states on buttons ← BLOCKING
- [x] Skeleton loaders
...

### Research Quality
- [x] market_research.md exists
- [x] competitor_analysis.md names competitors
- [x] positioning.md has differentiation

### Code Quality
- [x] No hardcoded secrets
- [x] .env.example exists
- [x] vercel.json exists
- [x] README has run instructions

---

## Blocking Issues

1. **Hover states on buttons**: Buttons in `MemeCard.tsx` missing `whileHover` prop
   - **File:** src/components/MemeCard.tsx
   - **Fix:** Add `whileHover={{ scale: 1.02 }}` to button elements

---

## Verdict: PASS | FAIL

---

## Notes

[Any additional observations]
```

---

## Iteration Rules

### Iteration 1
- Full review of all items
- Document all failures
- Builder fixes all blocking issues

### Iteration 2
- Re-review failed items only
- Verify fixes work
- Check for regressions

### Iteration 3 (Final)
- Complete re-review
- If still failing, document why
- Prepare hard failure report

### After 3 Iterations
- Build is a HARD FAIL
- Write final verdict explaining unresolved issues
- Do not continue building

---

## Output Location

```
runs/YYYY-MM-DD/build-<timestamp>/
└── polish/
    ├── ralph_report_1.md
    ├── ralph_report_2.md
    ├── ralph_report_3.md
    └── ralph_final_verdict.md
```

---

## Final Verdict Format

### On PASS

```markdown
# Ralph Final Verdict

**App:** {{app-slug}}
**Date:** YYYY-MM-DD
**Iterations:** X

## VERDICT: PASS

Build meets all quality requirements.

### Final Score: XX% (X/X passed)

### Summary
- Build quality: All passing
- UI/UX quality: All passing
- Research quality: All passing
- Code quality: All passing

Build is ready for deployment.
```

### On FAIL (Hard Failure)

```markdown
# Ralph Final Verdict

**App:** {{app-slug}}
**Date:** YYYY-MM-DD
**Iterations:** 3 (maximum reached)

## VERDICT: FAIL

Build failed to meet quality threshold after 3 iterations.

### Final Score: XX% (X/X passed)

### Unresolved Issues

1. **Issue description**
   - Why it couldn't be fixed
   - Impact on app quality

2. **Issue description**
   - Why it couldn't be fixed
   - Impact on app quality

### Recommendation

[Guidance on what would need to change for a successful build]
```

---

## Integration with Builder

The Ralph Loop is Claude reviewing its own work:

1. **Builder Claude** writes the app
2. **Ralph Claude** reviews against checklist
3. **Builder Claude** fixes issues Ralph found
4. **Ralph Claude** re-reviews
5. Repeat until PASS or 3 FAILs

This is NOT two separate agents. It's Claude switching perspectives:
- Builder: "I built this feature"
- Ralph: "Let me verify this actually works"

---

## Common Issues Ralph Finds

### Build Issues
- Missing dependencies in package.json
- Import errors (wrong paths)
- TypeScript strict mode violations

### UI Issues
- Missing `motion` wrapper on page components
- Buttons without hover states
- Loading states showing blank instead of skeleton
- Empty states just showing "No items"

### Research Issues
- Placeholder text ("Lorem ipsum", "Example competitor")
- Generic research without specifics
- Missing positioning.md entirely

### Code Issues
- Hardcoded localhost URLs
- Missing .env.example
- No vercel.json

---

**Run Ralph after every build. No exceptions.**
