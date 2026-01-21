# Web Design Guidelines - Agent Rules

**Source:** This skill's rules are documented in `SKILL.md` (same directory).

---

## Quick Reference

See `SKILL.md` for the complete ruleset with code examples.

### Rule Categories Summary

| Category           | Rules   | Priority | Key Focus                                        |
| ------------------ | ------- | -------- | ------------------------------------------------ |
| Accessibility      | AC1-AC8 | HIGH     | Semantic HTML, ARIA, contrast, keyboard nav      |
| Focus States       | FS1-FS3 | HIGH     | Visible focus, focus-visible, custom styles      |
| Forms              | FM1-FM6 | MEDIUM   | Labels, autocomplete, validation errors          |
| Animation          | AN1-AN5 | MEDIUM   | Page entrance, hover feedback, transform/opacity |
| Typography         | TY1-TY4 | MEDIUM   | Sans-serif body, proper quotes, tabular nums     |
| Loading States     | LS1-LS3 | MEDIUM   | Skeletons, button states, progressive loading    |
| Empty/Error States | ES1-ES2 | MEDIUM   | Designed empty states, styled errors             |
| Dark Mode          | DM1-DM3 | LOW      | Color scheme, theme color, CSS variables         |

---

## Critical Rules (Must Pass)

1. **AC1: Semantic HTML** - Use correct HTML elements for their purpose
2. **AC2: ARIA Labels** - All interactive elements need accessible names
3. **AC3: Color Contrast** - 4.5:1 contrast ratio (WCAG AA)
4. **FS1: Visible Focus Indicators** - Focus must be clearly visible
5. **FM1: Label Association** - All inputs need associated labels
6. **AN1: Page Entrance Animation** - Pages should animate in (Framer Motion)
7. **LS1: Skeleton Loaders** - Show skeletons, not spinners
8. **ES1: Designed Empty States** - Icon, message, and CTA required

---

## Integration

This skill contributes to Ralph's **Web Design Skills** category (25% weight).

Pass threshold: ≥95%
HIGH priority violations count double.

---

## Full Documentation

For complete rules with code examples, see: `SKILL.md`
