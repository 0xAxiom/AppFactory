# Web Interface Guidelines Skill

**Source:** [vercel-labs/web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines)
**Version:** Adapted January 2026
**License:** MIT

---

## Purpose

Comprehensive UI/UX quality rules for building accessible, performant, and delightful web interfaces. This skill enforces production-grade standards during the Ralph QA phase.

---

## Activation

This skill activates automatically during:

- **Phase 3 (Build):** Advisory checks during code generation
- **Phase 4 (Ralph QA):** Mandatory scoring category (part of Web Design Skills, 25% weight)

---

## Categories

| Category          | Rules | Priority | Focus                                     |
| ----------------- | ----- | -------- | ----------------------------------------- |
| **Interactions**  | 8     | HIGH     | Keyboard nav, focus, touch targets        |
| **Animation**     | 6     | MEDIUM   | Motion preferences, compositor properties |
| **Layout**        | 5     | MEDIUM   | Responsive, safe areas, alignment         |
| **Content**       | 6     | MEDIUM   | Semantic HTML, typography, states         |
| **Forms**         | 7     | HIGH     | Labels, validation, accessibility         |
| **Performance**   | 8     | HIGH     | Virtualization, preloading, re-renders    |
| **Design**        | 5     | MEDIUM   | Contrast, shadows, dark mode              |
| **Accessibility** | 6     | HIGH     | ARIA, screen readers, contrast            |

---

## Quick Reference

### Critical Rules (Must Pass)

1. **Keyboard navigation** - All interactive elements reachable via Tab
2. **Focus indicators** - Visible focus-visible on all focusable elements
3. **Touch targets** - Minimum 44px on mobile viewports
4. **APCA contrast** - Text meets APCA Lc 60+ for body, 75+ for UI
5. **Form labels** - Every input has associated label element
6. **List virtualization** - Lists >50 items use virtual scrolling

### High Priority Rules

- Enter key submits forms
- prefers-reduced-motion respected
- Above-fold images preloaded
- Skeleton loaders (not spinners) for loading states
- Error states with clear messaging and recovery actions

### Medium Priority Rules

- Only animate transform/opacity (compositor properties)
- No transition: all declarations
- Responsive breakpoints cover mobile → ultra-wide
- Safe area insets respected
- Locale-aware date/number formatting

---

## Integration with Ralph

These rules contribute to the **Web Design Skills** category in Ralph scoring:

```
Web Design Skills (25% of total score)
├── Existing web-design-guidelines rules
└── NEW: web-interface-guidelines rules
    ├── Interactions (keyboard, focus, touch)
    ├── Animation (motion preferences)
    ├── Performance (virtualization)
    ├── Forms (labels, validation)
    └── Accessibility (contrast, ARIA)
```

---

## Checking Compliance

During build, Claude checks generated code against these patterns:

```typescript
// GOOD: Proper focus indicator
className="focus-visible:ring-2 focus-visible:ring-blue-500"

// BAD: No focus indicator
className="outline-none"

// GOOD: Motion preference respected
const prefersReducedMotion = useReducedMotion();
animate={prefersReducedMotion ? {} : { opacity: 1 }}

// BAD: Ignoring motion preferences
animate={{ scale: 1.1, rotate: 360 }}

// GOOD: Virtualized list
<VirtualizedList data={items} />

// BAD: Rendering 100+ items directly
{items.map(item => <Item key={item.id} />)}
```

---

## Full Rules Document

See [AGENTS.md](./AGENTS.md) for the complete ruleset with examples and rationale.

---

## Optional: agent-browser Integration

For automated UI testing, install agent-browser:

```bash
npm install -g agent-browser
agent-browser install
```

Then use `scripts/research/competitor_screenshots.sh` to capture competitor UIs for reference.
