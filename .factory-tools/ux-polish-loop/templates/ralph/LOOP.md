# UX Polish Loop Instructions

**Project:** {{PROJECT_NAME}}
**Max Passes:** 20

---

## How to Run the Loop

### Option 1: Script Runner (Recommended)

```bash
./scripts/ralph_loop_runner.sh
```

### Option 2: Manual with Claude

```bash
claude
# Say: "Run the UX polish loop following ralph/LOOP.md"
```

### Option 3: Fully Manual

Follow the pass structure below for each iteration.

---

## Pass Structure

Each pass follows this exact sequence:

### 1. Run Checks

```bash
npm run lint
npm run typecheck  # if available
npm run test       # if unit tests exist
npm run test:e2e
```

### 2. Evaluate Results

**If any check fails:**
- Identify the highest-impact failure
- Fix ONLY that one issue
- Document in PROGRESS.md
- Proceed to next pass

**If all checks pass:**
- Review acceptance criteria in ACCEPTANCE.md
- Identify one high-leverage polish improvement
- Implement ONLY that one improvement
- Document in PROGRESS.md
- Proceed to next pass

### 3. Check for Completion

After each pass, ask:

1. Do all checks pass?
2. Are all acceptance criteria verified?
3. Are there any CRITICAL or HIGH issues remaining?

If YES to #1, #2 and NO to #3: Write the completion promise.

---

## What Is "High-Leverage Polish"?

When all tests pass, prioritize improvements by impact:

### Priority 1: User-Facing Bugs
- Broken interactions
- Visual glitches
- Missing states (loading, error, empty)

### Priority 2: Accessibility
- Missing alt text
- Poor focus states
- Keyboard navigation issues

### Priority 3: Performance
- Slow page loads
- Large bundle size
- Unnecessary re-renders

### Priority 4: Visual Polish
- Alignment issues
- Inconsistent spacing
- Animation timing

### Priority 5: Code Quality
- Component refactoring
- Type improvements
- Test coverage

---

## Progress Documentation

After EVERY pass, update `ralph/PROGRESS.md`:

```markdown
## Pass {{N}}

**Date:** {{TIMESTAMP}}
**Status:** {{PASS|FAIL}}

### Checks Run
- lint: {{PASS|FAIL}}
- typecheck: {{PASS|FAIL}}
- test: {{PASS|FAIL}}
- test:e2e: {{PASS|FAIL}}

### Issue Addressed
{{DESCRIPTION_OF_FIX_OR_IMPROVEMENT}}

### Files Changed
- {{FILE_1}}
- {{FILE_2}}

### Next Iteration Focus
{{WHAT_SHOULD_BE_ADDRESSED_NEXT}}
```

---

## Stopping Conditions

### Stop with Completion Promise (Success)

When ALL of these are true:
- All checks pass
- All acceptance criteria verified
- No CRITICAL or HIGH issues

Write to PROGRESS.md:
```
COMPLETION_PROMISE: All acceptance criteria met. UI is production-ready.
```

### Stop at Pass 20 (Max Iterations)

If pass 20 completes without completion promise:
- Document remaining issues in QA_NOTES.md
- Flag for manual review
- Do NOT write completion promise

### Stop on Blocker (Manual Intervention)

If an issue cannot be resolved:
- Document in QA_NOTES.md
- Stop the loop
- Request human assistance

---

## Rules

1. **One fix per pass.** Do not batch multiple fixes.
2. **Document every pass.** No undocumented changes.
3. **Highest impact first.** Fix critical issues before polish.
4. **Verify before promise.** The completion promise is earned.
5. **Stop at 20.** Do not exceed max passes.

---

## Example Pass Sequence

```
Pass 1: Fix - TypeScript error in Header.tsx
Pass 2: Fix - E2E test failing on contact form
Pass 3: Fix - Missing alt text on hero image
Pass 4: Polish - Add loading skeleton to project grid
Pass 5: Polish - Improve focus ring visibility
Pass 6: Polish - Optimize hero image size
Pass 7: Polish - Add keyboard shortcut for nav
Pass 8: COMPLETION_PROMISE written - all criteria met
```
