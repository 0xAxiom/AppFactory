# QA Notes

**Project:** Luminary Studio
**Last Updated:** 2026-01-18

---

## Purpose

This document captures manual QA observations, known issues that don't block completion, and recommendations for future improvement.

---

## Manual Testing Checklist

### Desktop (1920x1080)

- [ ] Home page loads correctly
- [ ] Navigation works
- [ ] All pages accessible
- [ ] Contact form works
- [ ] Animations smooth

### Tablet (768px)

- [ ] Layout adapts correctly
- [ ] Touch interactions work
- [ ] No horizontal scroll
- [ ] Navigation collapses appropriately

### Mobile (375px)

- [ ] Layout adapts correctly
- [ ] Touch targets >= 44px
- [ ] No horizontal scroll
- [ ] Forms usable
- [ ] Text readable without zoom

### Dark Mode

- [ ] All pages render correctly
- [ ] No contrast issues
- [ ] Images/icons visible
- [ ] Toggle works smoothly

---

## Known Issues (Non-Blocking)

| ID | Severity | Description | Workaround |
|----|----------|-------------|------------|
| - | - | No issues recorded yet | - |

---

## Browser Testing Results

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | Latest | Pending | |
| Firefox | Latest | Pending | |
| Safari | Latest | Pending | |
| Edge | Latest | Pending | |
| Mobile Safari | iOS 14+ | Pending | |
| Chrome Mobile | Android | Pending | |

---

## Accessibility Testing

### Keyboard Navigation

- [ ] All interactive elements focusable
- [ ] Focus order logical
- [ ] Focus visible
- [ ] Skip links work (if present)

### Screen Reader

- [ ] Page structure announced correctly
- [ ] Images have alt text
- [ ] Forms labeled
- [ ] Buttons descriptive

### Color & Contrast

- [ ] Color contrast >= 4.5:1
- [ ] Information not conveyed by color alone
- [ ] Links distinguishable from text

---

## Performance Observations

| Metric | Measured | Target | Status |
|--------|----------|--------|--------|
| LCP | - | < 2.5s | Pending |
| FID | - | < 100ms | Pending |
| CLS | - | < 0.1 | Pending |
| Bundle Size | - | < 200KB | Pending |

---

## Recommendations for Future

### High Priority

1. Consider adding image lazy loading indicators
2. Add error boundary for contact form

### Medium Priority

1. Add loading skeletons for portfolio images
2. Consider adding breadcrumbs for navigation

### Nice to Have

1. Add keyboard shortcuts for gallery navigation

---

## Sign-off

**QA Completed By:** Pending
**Date:** Pending
**Verdict:** NEEDS_WORK
