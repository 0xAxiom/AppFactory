# UX Polish Loop (Ralph)

**Version:** 1.0
**Status:** Production

---

## Overview

The UX Polish Loop is App Factory's structured quality assurance system for React UIs. It combines:

- **Ralph** - A 20-pass iterative polish methodology
- **Playwright** - E2E browser testing
- **Completion Promise** - A verifiable definition of done

Every UI-generating pipeline automatically includes this system.

---

## How It Works

### The 20-Pass System

Each pass follows this sequence:

1. **Run checks** - lint, typecheck, E2E tests
2. **Evaluate results**:
   - If failures: fix highest-impact issue
   - If passing: make one high-leverage polish improvement
3. **Document** in `ralph/PROGRESS.md`
4. **Check for completion** - are all acceptance criteria met?
5. **Continue or complete** - write completion promise or proceed to next pass

The loop continues until either:

- **Completion promise** is earned (success)
- **20 passes** are reached (max iterations)

### The Completion Promise

The loop stops early ONLY when this exact string is written to `ralph/PROGRESS.md`:

```
COMPLETION_PROMISE: All acceptance criteria met. UI is production-ready.
```

This is not a formality. The promise requires:

- All E2E tests passing
- All lint/typecheck passing
- All acceptance criteria in `ralph/ACCEPTANCE.md` verified
- No CRITICAL or HIGH issues remaining

---

## Which Pipelines Use This?

| Pipeline             | Playwright | Notes                                         |
| -------------------- | ---------- | --------------------------------------------- |
| **website-pipeline** | REQUIRED   | Next.js websites                              |
| **dapp-factory**     | REQUIRED   | Next.js dApps                                 |
| **app-factory**      | OPTIONAL   | Mobile-first; Playwright for web exports only |
| **agent-factory**    | NO         | HTTP API, no UI                               |
| **plugin-factory**   | NO         | CLI/API based                                 |

---

## Directory Structure

Generated UI projects include:

```
<project>/
├── ralph/
│   ├── PRD.md              # Product requirements
│   ├── ACCEPTANCE.md       # Acceptance criteria + completion promise
│   ├── LOOP.md             # Loop execution instructions
│   ├── PROGRESS.md         # Pass-by-pass progress log
│   └── QA_NOTES.md         # Manual QA observations
├── tests/
│   └── e2e/
│       ├── smoke.spec.ts   # Core smoke tests
│       └── [feature].spec.ts
├── playwright.config.ts    # Playwright configuration
└── scripts/
    └── ralph_loop_runner.sh  # Human-in-the-loop runner
```

---

## Running the Loop

### Option 1: Script Runner (Recommended)

```bash
cd <project>
npm install
npm run polish:ux
```

The script will guide you through each pass.

### Option 2: With Claude Code

```bash
cd <project>
claude
# Say: "Run the UX polish loop following ralph/LOOP.md"
```

### Option 3: Manual

```bash
npm run lint
npm run typecheck
npm run test:e2e

# Review results
# Fix issues or make improvements
# Update ralph/PROGRESS.md
# Repeat
```

---

## Package Scripts

Generated projects include these scripts:

```json
{
  "scripts": {
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "polish:ux": "./scripts/ralph_loop_runner.sh"
  }
}
```

---

## Default E2E Tests

Every UI project gets these smoke tests:

### smoke.spec.ts

1. **Home page loads** - Title exists, no error states
2. **Main content visible** - Main element has content
3. **Navigation works** - Can navigate between pages
4. **No console errors** - Critical errors fail the test
5. **Responsive design** - No horizontal scroll on mobile
6. **Accessibility basics** - h1 exists, images have alt, keyboard navigation

### form.spec.ts (if forms present)

1. **Form visible** - Contact/search forms render
2. **Validation works** - Empty submit shows errors
3. **Fields labeled** - All inputs have labels

---

## Selector Conventions

### Priority Order

1. `data-testid` - Best stability
2. Role + Name - Accessibility-focused
3. Label/Placeholder - Form fields
4. Text content - Use sparingly
5. CSS classes - Avoid

### Naming Pattern

```
data-testid="{section}-{component}-{element}"
```

Examples:

```
data-testid="header-nav-link-about"
data-testid="contact-form-email-input"
data-testid="hero-cta-button"
```

---

## Priority for "High-Leverage Polish"

When all tests pass, prioritize improvements:

1. **User-facing bugs** - Broken interactions, visual glitches
2. **Accessibility** - Missing alt text, focus states
3. **Performance** - Slow loads, large bundles
4. **Visual polish** - Alignment, spacing, animation timing
5. **Code quality** - Refactoring, types, test coverage

---

## Pipeline Gate Enforcement

UI pipelines include a "UX Polish Gate" that verifies:

- `ralph/` directory exists
- `ralph/ACCEPTANCE.md` exists with completion promise
- Playwright config exists
- At least one E2E test file exists
- Runner script exists (optional but recommended)

Run the gate check:

```bash
./scripts/factory_ready_check.sh <project-path>
```

---

## Verification

Verify all pipelines are properly integrated:

```bash
./scripts/verify_ui_polish_integration.sh
```

This checks:

- Shared module templates exist
- UI pipelines document the loop
- Non-UI pipelines don't require Playwright

---

## Templates Location

Shared templates are in:

```
.factory-tools/ux-polish-loop/
├── README.md
├── templates/
│   ├── ralph/
│   │   ├── PRD.md
│   │   ├── ACCEPTANCE.md
│   │   ├── LOOP.md
│   │   ├── PROGRESS.md
│   │   └── QA_NOTES.md
│   ├── playwright.config.ts
│   └── tests/e2e/
│       ├── smoke.spec.ts
│       ├── form.spec.ts
│       └── CONVENTIONS.md
└── scripts/
    └── ralph_loop_runner.sh
```

---

## Example

See the working example:

```
website-pipeline/example/website-builds/luminary-studio/
├── ralph/              # Filled-in templates
├── tests/e2e/          # Working tests
├── playwright.config.ts
├── scripts/ralph_loop_runner.sh
└── package.json        # With test:e2e script
```

To test it:

```bash
cd website-pipeline/example/website-builds/luminary-studio
npm install
npx playwright install chromium
npm run test:e2e
```

---

## FAQ

### Why 20 passes?

20 passes is enough to fix most issues and reach completion, but bounded to prevent infinite loops. If 20 passes aren't enough, manual intervention is needed.

### Can I skip the loop?

For production UI: No. The completion promise is required.
For prototypes: You can skip, but document why in QA_NOTES.md.

### What if E2E tests are flaky?

1. Use stable selectors (`data-testid`)
2. Add explicit waits (`waitForLoadState`)
3. Retry on CI only (`retries: process.env.CI ? 2 : 0`)

### How do I add project-specific tests?

Create new `.spec.ts` files in `tests/e2e/`. Follow the patterns in `smoke.spec.ts`.

---

## Version History

- **1.0** (2026-01-18): Initial release with Playwright E2E testing
