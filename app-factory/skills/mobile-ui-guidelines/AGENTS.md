# Mobile UI Guidelines - Agent Rules

**Source:** This skill's rules are documented in `SKILL.md` (same directory).

---

## Quick Reference

See `SKILL.md` for the complete ruleset with code examples.

### Rule Categories Summary

| Category | Rules | Priority | Key Focus |
|----------|-------|----------|-----------|
| Accessibility | A1-A8 | HIGH | Touch targets, labels, contrast, VoiceOver |
| Touch & Gestures | T1-T6 | HIGH | Feedback, haptics, gestures, pull-to-refresh |
| Loading States | L1-L5 | MEDIUM | Skeletons, progressive loading, optimistic updates |
| Empty States | E1-E4 | MEDIUM | Designed states, contextual messaging |
| Error States | ER1-ER4 | MEDIUM | Styled errors, validation, graceful degradation |
| Platform Conventions | P1-P5 | MEDIUM | iOS gestures, Android back, safe areas |

---

## Critical Rules (Must Pass)

1. **A1: Touch Target Sizes** - Minimum 44x44pt (iOS) / 48x48dp (Android)
2. **A2: Accessibility Labels** - All interactive elements need labels
3. **A3: Color Contrast** - 4.5:1 contrast ratio (WCAG AA)
4. **T1: Visual Touch Feedback** - All touchables show feedback
5. **P5: Safe Area Handling** - Respect notch and home indicator

---

## Integration

This skill contributes to Ralph's **Mobile UI Skills** category (5% weight).

Pass threshold: ≥95%
HIGH priority violations count double.

---

## Full Documentation

For complete rules with code examples, see: `SKILL.md`
