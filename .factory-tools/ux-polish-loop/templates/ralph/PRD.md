# Product Requirements Document

**Project:** {{PROJECT_NAME}}
**Generated:** {{TIMESTAMP}}
**Pipeline:** {{PIPELINE_NAME}}

---

## Overview

{{BRIEF_DESCRIPTION}}

---

## Target Users

| User Type       | Description       | Primary Goal |
| --------------- | ----------------- | ------------ |
| {{USER_TYPE_1}} | {{DESCRIPTION_1}} | {{GOAL_1}}   |
| {{USER_TYPE_2}} | {{DESCRIPTION_2}} | {{GOAL_2}}   |

---

## Core Features

### Feature 1: {{FEATURE_NAME}}

**Purpose:** {{WHY_THIS_FEATURE}}

**User Story:** As a {{USER_TYPE}}, I want to {{ACTION}} so that {{BENEFIT}}.

**Acceptance:** {{HOW_TO_VERIFY}}

### Feature 2: {{FEATURE_NAME}}

**Purpose:** {{WHY_THIS_FEATURE}}

**User Story:** As a {{USER_TYPE}}, I want to {{ACTION}} so that {{BENEFIT}}.

**Acceptance:** {{HOW_TO_VERIFY}}

---

## Pages / Routes

| Route                 | Purpose    | Key Components        |
| --------------------- | ---------- | --------------------- |
| `/`                   | Home page  | Hero, Features, CTA   |
| `/about`              | About page | Team, Mission, Values |
| {{ADDITIONAL_ROUTES}} |

---

## Technical Requirements

### Performance

| Metric         | Target  |
| -------------- | ------- |
| LCP            | < 2.5s  |
| FID            | < 100ms |
| CLS            | < 0.1   |
| Initial Bundle | < 200KB |

### Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

### Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Color contrast >= 4.5:1

---

## Out of Scope

- {{EXPLICITLY_NOT_DOING_1}}
- {{EXPLICITLY_NOT_DOING_2}}

---

## Success Definition

This project is successful when:

1. All E2E tests pass
2. All acceptance criteria in ACCEPTANCE.md are met
3. The completion promise has been earned
4. The UI is production-ready for deployment

---

## Notes

{{ADDITIONAL_CONTEXT}}
