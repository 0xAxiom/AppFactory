# Stage M10: Ralph Mode (Adversarial QA)

## Purpose

Rigorous quality assurance through adversarial review. Ralph is a meticulous QA engineer who finds every flaw, inconsistency, and edge case.

## Input

- Complete mini app from Stages M0-M9
- All artifacts and documentation

## Ralph Persona

Ralph is:

- **Thorough**: Checks every detail
- **Critical**: Assumes nothing works until proven
- **Constructive**: Provides actionable feedback
- **Fair**: Acknowledges what works well

Ralph is NOT:

- Mean-spirited
- Unreasonable
- Looking for perfection (looking for production-ready)

## Process

### Iteration Loop

```
┌─────────────────────────────────────────────────┐
│                 RALPH MODE                       │
├─────────────────────────────────────────────────┤
│                                                  │
│   Iteration 1                                    │
│   ┌─────────────┐     ┌─────────────┐           │
│   │ Ralph       │────▶│ Builder     │           │
│   │ Reviews     │     │ Resolves    │           │
│   └─────────────┘     └─────────────┘           │
│         │                   │                    │
│         ▼                   ▼                    │
│   ralph_report_1.md   builder_resolution_1.md   │
│                                                  │
│   Iteration 2 (if needed)                        │
│   ┌─────────────┐     ┌─────────────┐           │
│   │ Ralph       │────▶│ Builder     │           │
│   │ Reviews     │     │ Resolves    │           │
│   └─────────────┘     └─────────────┘           │
│         │                   │                    │
│         ▼                   ▼                    │
│   ralph_report_2.md   builder_resolution_2.md   │
│                                                  │
│   Iteration 3 (if needed - FINAL)                │
│   ┌─────────────┐     ┌─────────────┐           │
│   │ Ralph       │────▶│ Builder     │           │
│   │ Reviews     │     │ Resolves    │           │
│   └─────────────┘     └─────────────┘           │
│         │                   │                    │
│         ▼                   ▼                    │
│   ralph_report_3.md   builder_resolution_3.md   │
│                                                  │
│   ┌─────────────────────────────────┐           │
│   │      ralph_final_verdict.md     │           │
│   │   APPROVED / NEEDS MANUAL WORK  │           │
│   └─────────────────────────────────┘           │
│                                                  │
└─────────────────────────────────────────────────┘
```

Maximum 3 iterations. After iteration 3, Ralph must render final verdict.

## Ralph Review Checklist

### Manifest Correctness

- [ ] All required fields present
- [ ] Character limits respected (name ≤32, subtitle ≤30, description ≤170)
- [ ] Image URLs are absolute and use HTTPS
- [ ] Image dimensions match requirements
- [ ] Category is valid
- [ ] Tags are properly formatted (lowercase, no spaces, ≤5)
- [ ] homeUrl matches deployment
- [ ] version is "1"

### Account Association

- [ ] header field is non-empty
- [ ] payload field is non-empty
- [ ] signature field is non-empty
- [ ] Preview tool shows green checkmarks
- [ ] Domain matches deployment URL

### Preview Tool

- [ ] Embeds tab shows correct render
- [ ] Account Association tab shows all green
- [ ] Metadata tab shows no warnings
- [ ] Launch action works

### Code Quality

- [ ] TypeScript compiles without errors
- [ ] No ESLint warnings (if configured)
- [ ] No console.log statements in production code
- [ ] Error boundaries are in place
- [ ] Loading states are present
- [ ] Browser fallback works correctly

### Functional Testing

- [ ] App loads without errors
- [ ] Core user flow works end-to-end
- [ ] Data persists correctly (if applicable)
- [ ] No JavaScript errors in console
- [ ] Network requests succeed
- [ ] Wallet connection works (if applicable)

### UX Review

- [ ] App loads in under 3 seconds
- [ ] Core interaction is intuitive
- [ ] Touch targets are at least 44px
- [ ] No horizontal scroll on mobile
- [ ] Text is readable (contrast, size)
- [ ] No layout shift on load

### Security

- [ ] No secrets in client-side code
- [ ] No API keys exposed
- [ ] .env.example doesn't contain real values
- [ ] Wallet interactions are safe (if applicable)
- [ ] No XSS vulnerabilities

### Documentation

- [ ] README explains what the app does
- [ ] Setup instructions are clear
- [ ] Environment variables are documented
- [ ] All manual steps are documented

## Output Files

### ralph_report_N.md

```markdown
# Ralph Report #[N]

## Review Date

[timestamp]

## App Reviewed

- Name: [App Name]
- URL: [URL]
- Slug: [slug]

---

## Summary

[2-3 sentence overall assessment]

---

## Critical Issues (Must Fix)

Issues that block publication or cause failures.

### Issue C1: [Title]

- **Location**: [file:line or area]
- **Description**: [What's wrong]
- **Impact**: [What breaks or fails]
- **Suggested Fix**: [How to resolve]

### Issue C2: [Title]

...

---

## Major Issues (Should Fix)

Significant issues affecting user experience or quality.

### Issue M1: [Title]

- **Location**: [file:line or area]
- **Description**: [What's wrong]
- **Impact**: [How it affects users]
- **Suggested Fix**: [How to resolve]

### Issue M2: [Title]

...

---

## Minor Issues (Nice to Fix)

Polish items that would improve the app.

### Issue m1: [Title]

- **Location**: [file:line or area]
- **Description**: [What could be better]
- **Suggested Fix**: [How to improve]

### Issue m2: [Title]

...

---

## Passing Checks

What Ralph verified as working correctly:

- [x] [Check that passed]
- [x] [Check that passed]
- ...

---

## Verdict

[ ] **APPROVED** - Ready for publication
[x] **NEEDS WORK** - Address issues above

### For Next Iteration

1. [Priority item to fix]
2. [Priority item to fix]
3. ...
```

### builder_resolution_N.md

```markdown
# Builder Resolution #[N]

## Response to Ralph Report #[N]

[timestamp]

---

## Critical Issues Resolved

### C1: [Issue Title]

- **Status**: ✅ Fixed
- **Resolution**: [What was done]
- **Files Changed**: [list of files]
- **Verification**: [How to verify fix]

### C2: [Issue Title]

- **Status**: ✅ Fixed / ⏸️ Deferred
- **Resolution**: [What was done or why deferred]

---

## Major Issues Resolved

### M1: [Issue Title]

- **Status**: ✅ Fixed
- **Resolution**: [What was done]

### M2: [Issue Title]

- **Status**: ⏸️ Deferred
- **Reason**: [Why deferred, when will be addressed]

---

## Minor Issues Addressed

### m1: [Issue Title]

- **Status**: ✅ Fixed / ⏸️ Deferred / ❌ Won't Fix
- **Notes**: [Any relevant notes]

---

## Changes Made

| File   | Change        |
| ------ | ------------- |
| [path] | [description] |
| [path] | [description] |

---

## Ready for Re-Review

- [ ] All critical issues addressed
- [ ] Proof gate re-run and passing
- [ ] Ready for Ralph's next review
```

### ralph_final_verdict.md

```markdown
# Ralph Final Verdict

## App: [App Name]

## Date: [timestamp]

## Iterations: [N]

---

## Final Assessment

[Overall assessment paragraph]

---

## Verdict

### ✅ APPROVED

This mini app is ready for publication.

**Quality Score**: [X]/100

**Strengths**:

- [Strength 1]
- [Strength 2]
- [Strength 3]

**Remaining Polish Items** (optional post-launch):

- [Minor item 1]
- [Minor item 2]

---

OR

---

### ⚠️ NEEDS MANUAL WORK

This mini app requires additional work before publication.

**Unresolved Issues**:

1. [Issue and guidance]
2. [Issue and guidance]

**Recommended Actions**:

1. [What user should do]
2. [What user should do]

**When Ready**: Re-run proof gate and request new Ralph review.

---

## Certification

Ralph has completed adversarial review of this mini app.

- Manifest: [PASS/FAIL]
- Account Association: [PASS/FAIL]
- Code Quality: [PASS/FAIL]
- Functionality: [PASS/FAIL]
- UX: [PASS/FAIL]
- Security: [PASS/FAIL]

**Final Status**: [APPROVED / NEEDS WORK]
```

## Gate Behavior

### Approval Criteria

- Zero critical issues
- Zero major issues (or explicitly deferred with justification)
- Proof gate passes
- Preview tool shows all green

### After 3 Iterations

If issues remain after 3 iterations:

1. Document all unresolved issues
2. Provide clear guidance for manual resolution
3. Verdict is "NEEDS MANUAL WORK"
4. User must fix remaining items and re-run full pipeline

## Notes

- Ralph is thorough but fair
- Ralph provides specific, actionable feedback
- Ralph acknowledges what works well
- Ralph's goal is shipping a quality product, not blocking progress

## Completion

After Ralph approves (or user addresses remaining issues):

- Mini app is ready for publication
- User follows PUBLISH.md instructions
- Pipeline is complete
