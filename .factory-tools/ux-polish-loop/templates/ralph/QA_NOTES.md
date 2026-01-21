# QA Notes

**Project:** {{PROJECT_NAME}}
**Last Updated:** {{TIMESTAMP}}

---

## Purpose

This document captures manual QA observations, known issues that don't block completion, and recommendations for future improvement.

---

## Manual Testing Checklist

### Desktop (1920x1080)

- [ ] Home page loads correctly
- [ ] Navigation works
- [ ] All pages accessible
- [ ] Forms submit correctly
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

### Dark Mode (if applicable)

- [ ] All pages render correctly
- [ ] No contrast issues
- [ ] Images/icons visible
- [ ] Toggle works smoothly

---

## Known Issues (Non-Blocking)

| ID  | Severity | Description   | Workaround         |
| --- | -------- | ------------- | ------------------ |
| 1   | LOW      | Example issue | Example workaround |

---

## Browser Testing Results

| Browser       | Version | Status | Notes |
| ------------- | ------- | ------ | ----- |
| Chrome        | Latest  |        |       |
| Firefox       | Latest  |        |       |
| Safari        | Latest  |        |       |
| Edge          | Latest  |        |       |
| Mobile Safari | iOS 14+ |        |       |
| Chrome Mobile | Android |        |       |

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

| Metric      | Measured | Target  | Status |
| ----------- | -------- | ------- | ------ |
| LCP         |          | < 2.5s  |        |
| FID         |          | < 100ms |        |
| CLS         |          | < 0.1   |        |
| Bundle Size |          | < 200KB |        |

---

## Recommendations for Future

### High Priority

1. {{RECOMMENDATION_1}}
2. {{RECOMMENDATION_2}}

### Medium Priority

1. {{RECOMMENDATION_3}}
2. {{RECOMMENDATION_4}}

### Nice to Have

1. {{RECOMMENDATION_5}}

---

## Sign-off

**QA Completed By:** {{NAME_OR_SYSTEM}}
**Date:** {{DATE}}
**Verdict:** {{PASS_WITH_NOTES | NEEDS_WORK}}
