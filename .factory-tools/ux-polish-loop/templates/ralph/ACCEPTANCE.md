# Acceptance Criteria

**Project:** {{PROJECT_NAME}}
**Generated:** {{TIMESTAMP}}

---

## The Completion Promise

The UX polish loop completes when this exact string is written to `PROGRESS.md`:

```
COMPLETION_PROMISE: All acceptance criteria met. UI is production-ready.
```

This promise can ONLY be made when ALL criteria below are verified.

---

## Criteria Checklist

### Build Quality

- [ ] `npm install` completes without errors
- [ ] `npm run build` completes without errors
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes (if available)
- [ ] No console errors in browser

### E2E Tests

- [ ] `npm run test:e2e` passes
- [ ] Smoke test verifies home page loads
- [ ] Smoke test verifies navigation works
- [ ] All critical user flows tested

### UI Quality

- [ ] Responsive design works (mobile, tablet, desktop)
- [ ] Dark mode works (if applicable)
- [ ] All interactive elements have hover/focus states
- [ ] Loading states shown for async operations
- [ ] Error states handle gracefully

### Accessibility

- [ ] All images have alt text
- [ ] Forms have labels
- [ ] Focus order is logical
- [ ] Color contrast passes (>= 4.5:1)
- [ ] Keyboard navigation works

### Content

- [ ] No placeholder text ("Lorem ipsum", "TODO", "FIXME")
- [ ] All links work (no 404s)
- [ ] Images load correctly
- [ ] Copy is proofread

### Performance

- [ ] LCP < 2.5s on 3G
- [ ] No layout shift on page load
- [ ] Images optimized (next/image or equivalent)

---

## Verification Method

For each criterion:

1. **Manual:** Visually inspect the UI
2. **Automated:** E2E test covers it
3. **Tool:** Lighthouse, axe, etc.

Mark as verified only when you can prove it passes.

---

## Blocking Issues

Issues that MUST be fixed before completion promise:

| Severity | Description                    | Blocks Promise?           |
| -------- | ------------------------------ | ------------------------- |
| CRITICAL | App crash, data loss, security | YES                       |
| HIGH     | Major feature broken, bad UX   | YES                       |
| MEDIUM   | Minor feature issue, cosmetic  | NO (document in QA_NOTES) |
| LOW      | Nice-to-have improvement       | NO                        |

---

## Sign-off

When all criteria are met, write the completion promise to `PROGRESS.md`.

Do NOT write the completion promise if:

- Any E2E test fails
- Any CRITICAL or HIGH issue exists
- Build or lint fails
- Acceptance criteria are not verified

The completion promise is a commitment, not a formality.
