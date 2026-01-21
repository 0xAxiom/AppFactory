# Web3 Factory: UI Polish Checklist

**Version**: 1.0
**Purpose**: Adversarial QA process to ensure every build meets professional UI/UX standards.

---

## Overview

This checklist is used AFTER the initial build is complete. The build must pass ALL sections to be considered production-ready. A single failed section requires iteration.

---

## Section 1: First Impressions (30 seconds test)

Open the app and evaluate within 30 seconds:

- [ ] **Professional appearance**: Does it look like a real product, not a tutorial project?
- [ ] **Visual hierarchy**: Is it immediately clear what's important?
- [ ] **Brand coherence**: Does the app have a consistent visual identity?
- [ ] **Trust signal**: Would a user trust this app with their wallet?

**FAIL if**: App looks like a basic template or tutorial project

---

## Section 2: Component Quality

### 2.1 Buttons

- [ ] Primary button has clear visual weight (not just colored text)
- [ ] Secondary buttons are visually distinct from primary
- [ ] All buttons have hover states with smooth transitions (150-200ms)
- [ ] All buttons have focus states (visible focus ring)
- [ ] Disabled buttons are visually muted and non-interactive
- [ ] Loading buttons show spinner + disabled state
- [ ] Button text is clear and action-oriented

### 2.2 Cards

- [ ] Cards have proper padding (minimum 16px)
- [ ] Cards have subtle borders or shadows for depth
- [ ] Card hover states exist where cards are interactive
- [ ] Card content has proper internal spacing
- [ ] Cards don't have excessive whitespace or feel cramped

### 2.3 Forms & Inputs

- [ ] All inputs have visible labels (not just placeholders)
- [ ] Input focus states are clearly visible
- [ ] Error states show clear, helpful error messages
- [ ] Required fields are marked
- [ ] Form validation provides immediate feedback
- [ ] Input placeholder text is helpful, not redundant

### 2.4 Typography

- [ ] Body text uses sans-serif font (NOT monospace)
- [ ] Monospace is ONLY used for code, addresses, hashes
- [ ] Clear heading hierarchy (h1 > h2 > h3 > body)
- [ ] Text has appropriate line height (1.5-1.75 for body)
- [ ] No walls of text without visual breaks
- [ ] Text colors have sufficient contrast (WCAG AA)

**FAIL if**: Monospace font is used for body text, or typography lacks hierarchy

---

## Section 3: State Management

### 3.1 Loading States

- [ ] Initial page load shows skeleton loaders (not blank screen)
- [ ] Async operations show loading indicators
- [ ] Skeleton loaders match content shape
- [ ] Loading states have subtle animations
- [ ] No content flashing or layout shift during load

### 3.2 Empty States

- [ ] Empty lists/grids show designed empty state
- [ ] Empty states have helpful illustration/icon
- [ ] Empty states explain what should appear here
- [ ] Empty states include call-to-action where appropriate
- [ ] Empty states are NOT just blank space

### 3.3 Error States

- [ ] Errors are displayed in styled error containers
- [ ] Error messages are human-readable (not raw errors)
- [ ] Errors include retry action where applicable
- [ ] Network errors are handled gracefully
- [ ] 404/Not Found pages are designed

### 3.4 Success States

- [ ] Success actions show confirmation (toast, animation, etc.)
- [ ] Success feedback is proportional to action importance
- [ ] Success states guide user to next action

**FAIL if**: Loading shows blank screen, empty states are blank, or errors show raw messages

---

## Section 4: Animation & Motion

### 4.1 Page Transitions

- [ ] Page content enters with animation (fade, slide, etc.)
- [ ] Transitions feel smooth, not jarring
- [ ] No content jumping or layout shifts
- [ ] Exit animations exist for modals/overlays

### 4.2 Micro-interactions

- [ ] Buttons respond to hover (scale, color change)
- [ ] Clickable cards have hover feedback
- [ ] Interactive elements have visual feedback
- [ ] Transitions are 150-300ms (not instant, not slow)

### 4.3 Loading Animations

- [ ] Loading spinners animate smoothly
- [ ] Skeleton loaders have shimmer effect
- [ ] Progress indicators update smoothly

### 4.4 Accessibility

- [ ] Animations respect `prefers-reduced-motion`
- [ ] No animations faster than 100ms
- [ ] No flashing content (seizure risk)

**FAIL if**: No hover states, instant transitions, or animations ignore reduced motion

---

## Section 5: Layout & Spacing

### 5.1 Consistency

- [ ] Spacing follows a consistent scale (4px, 8px, 16px, etc.)
- [ ] Similar elements have similar spacing
- [ ] Page margins are consistent
- [ ] Card padding is consistent throughout

### 5.2 Visual Rhythm

- [ ] Content is grouped logically
- [ ] Related items are close together
- [ ] Sections have clear visual separation
- [ ] Whitespace is used intentionally

### 5.3 Responsive

- [ ] Layout adapts to mobile viewport
- [ ] Navigation transforms for mobile (hamburger menu)
- [ ] Text remains readable at all sizes
- [ ] Touch targets are minimum 44x44px
- [ ] No horizontal scrolling on mobile

**FAIL if**: Inconsistent spacing, mobile layout is broken, or touch targets too small

---

## Section 6: Color & Contrast

### 6.1 Palette Coherence

- [ ] Colors are used consistently
- [ ] Primary color identifies main actions
- [ ] Semantic colors used correctly (green=success, red=error)
- [ ] Color palette feels intentional, not random

### 6.2 Accessibility

- [ ] Body text has 4.5:1+ contrast ratio
- [ ] Large text has 3:1+ contrast ratio
- [ ] Interactive elements are distinguishable
- [ ] Color is not the only indicator (include icons/text)

### 6.3 Dark Mode (if applicable)

- [ ] Dark mode colors are properly inverted
- [ ] No pure white (#ffffff) on dark backgrounds
- [ ] Shadows work in dark mode
- [ ] Images/icons visible in dark mode

**FAIL if**: Contrast ratios fail WCAG AA or colors feel random

---

## Section 7: Web3-Specific UX

### 7.1 Wallet Connection

- [ ] Wallet button is visible but not dominant
- [ ] Connection flow is smooth (no jarring popups)
- [ ] Connected state shows truncated address
- [ ] Disconnect option is accessible
- [ ] Different wallet states are clear (not connected, connecting, connected)

### 7.2 Transaction UX

- [ ] Transaction buttons show signing state
- [ ] Confirmation pending state is clear
- [ ] Success/failure states are shown
- [ ] Transaction hash is accessible (copyable, linkable)
- [ ] Fee/cost information is displayed before signing

### 7.3 Blockchain Data

- [ ] Addresses are truncated appropriately
- [ ] Large numbers are formatted (commas, abbreviations)
- [ ] Token amounts show appropriate decimals
- [ ] Links to block explorers work
- [ ] Loading states for on-chain data

### 7.4 Error Handling

- [ ] Wallet connection errors are handled
- [ ] Transaction rejection is handled gracefully
- [ ] Network errors show helpful messages
- [ ] Insufficient balance errors are clear

**FAIL if**: Wallet dominates UI, transaction states are unclear, or blockchain errors show raw messages

---

## Section 8: shadcn/ui Integration

### 8.1 Component Usage

- [ ] shadcn/ui is initialized and configured
- [ ] Button component is used (not custom buttons)
- [ ] Card component is used for containers
- [ ] Input component is used with proper labels
- [ ] Dialog component is used for modals
- [ ] Toast/Sonner is used for notifications

### 8.2 Customization

- [ ] Theme colors are customized in globals.css
- [ ] Components match app's design language
- [ ] Default shadcn styling is not obviously generic

### 8.3 Icons

- [ ] Lucide React icons are used consistently
- [ ] Icon sizing is consistent (h-4 w-4, h-5 w-5)
- [ ] Icons have proper semantic meaning

**FAIL if**: App doesn't use shadcn/ui components or uses raw HTML elements

---

## Section 9: Performance

### 9.1 Initial Load

- [ ] Page loads in under 3 seconds
- [ ] No visible layout shifts
- [ ] Above-fold content loads first

### 9.2 Interactions

- [ ] Button clicks respond immediately
- [ ] Animations run at 60fps
- [ ] No jank during scrolling

### 9.3 Assets

- [ ] Images are optimized
- [ ] Fonts load without flash
- [ ] No unnecessary re-renders visible

**FAIL if**: Significant layout shifts, laggy interactions, or slow initial load

---

## Scoring & Verdict

### Scoring Guide

| Section               | Weight | Pass Criteria   |
| --------------------- | ------ | --------------- |
| First Impressions     | 15%    | All checks pass |
| Component Quality     | 20%    | All checks pass |
| State Management      | 20%    | All checks pass |
| Animation & Motion    | 10%    | All checks pass |
| Layout & Spacing      | 10%    | All checks pass |
| Color & Contrast      | 10%    | All checks pass |
| Web3-Specific UX      | 10%    | All checks pass |
| shadcn/ui Integration | 5%     | All checks pass |

### Verdict Rules

**PASS**: All sections pass, no FAIL conditions triggered

**CONDITIONAL PASS**: Minor issues in 1-2 sections that don't trigger FAIL conditions

- List specific issues
- Issues must be fixable in under 30 minutes
- Re-verify after fixes

**FAIL**: Any FAIL condition is triggered, or 3+ sections have issues

- List all failing sections
- Prioritize fixes by impact
- Re-run full checklist after fixes

---

## Iteration Protocol

1. Run full checklist after initial build
2. If FAIL: Fix issues and re-run checklist
3. Maximum 3 iterations
4. If still failing after 3 iterations: escalate for architectural review

---

## Quick Reference: Common Failures

| Issue                | Fix                                             |
| -------------------- | ----------------------------------------------- |
| Monospace body text  | Change font-family to Inter/system sans         |
| No loading states    | Add Skeleton components for async content       |
| No hover states      | Add hover: classes to all interactive elements  |
| Blank empty states   | Design EmptyState component                     |
| Raw error messages   | Wrap errors in ErrorState component             |
| Wallet dominates UI  | Move wallet button to header right, reduce size |
| Instant transitions  | Add transition-all duration-200                 |
| Inconsistent spacing | Apply consistent padding scale                  |

---

**Remember**: A polished UI isn't optional. It's the difference between a product users trust and one they abandon.
