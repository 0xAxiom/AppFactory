# Acceptance Criteria

**Project:** Luminary Studio
**Generated:** 2026-01-18

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
- [ ] `npm run typecheck` passes
- [ ] No console errors in browser

### E2E Tests

- [ ] `npm run test:e2e` passes
- [ ] Smoke test verifies home page loads
- [ ] Smoke test verifies navigation works
- [ ] Contact form test passes

### UI Quality

- [ ] Responsive design works (mobile 375px, tablet 768px, desktop 1280px)
- [ ] Dark mode toggle works correctly
- [ ] All interactive elements have hover/focus states
- [ ] Loading states shown for images
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
- [ ] Contact information is present

### Performance

- [ ] LCP < 2.5s on simulated 3G
- [ ] No layout shift on page load
- [ ] Images use next/image optimization

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

| Severity | Description | Blocks Promise? |
|----------|-------------|-----------------|
| CRITICAL | App crash, data loss, security | YES |
| HIGH | Major feature broken, bad UX | YES |
| MEDIUM | Minor feature issue, cosmetic | NO (document in QA_NOTES) |
| LOW | Nice-to-have improvement | NO |

---

## Sign-off

When all criteria are met, write the completion promise to `PROGRESS.md`.

Do NOT write the completion promise if:

- Any E2E test fails
- Any CRITICAL or HIGH issue exists
- Build or lint fails
- Acceptance criteria are not verified

The completion promise is a commitment, not a formality.
