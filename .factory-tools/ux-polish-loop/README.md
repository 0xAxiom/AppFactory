# UX Polish Loop (Ralph)

**Version:** 1.0

A reusable module for iterative UX quality assurance across all UI-generating pipelines in App Factory.

---

## What Is This?

The UX Polish Loop is a structured 20-pass iterative improvement system for React UIs. Each pass:

1. Runs lint, typecheck, and unit tests (if any)
2. Runs Playwright E2E tests
3. If failures exist: fix highest-impact issue
4. If passing: make one high-leverage polish improvement
5. Documents progress in `ralph/PROGRESS.md`

The loop continues until a **completion promise** is emitted or 20 passes complete.

---

## Directory Structure

When integrated into a generated project:

```
<project>/
├── ralph/
│   ├── PRD.md              # Product requirements document
│   ├── ACCEPTANCE.md       # Acceptance criteria with completion promise
│   ├── LOOP.md             # Loop execution instructions
│   ├── PROGRESS.md         # Pass-by-pass progress log
│   └── QA_NOTES.md         # Manual QA observations
├── tests/
│   └── e2e/
│       └── smoke.spec.ts   # Minimum viable E2E tests
├── playwright.config.ts    # Playwright configuration
└── scripts/
    └── ralph_loop_runner.sh  # Runner script
```

---

## The Completion Promise

The loop stops early ONLY when this exact string appears in `ralph/PROGRESS.md`:

```
COMPLETION_PROMISE: All acceptance criteria met. UI is production-ready.
```

This must be earned, not assumed. The promise means:

- All E2E tests pass
- All lint/typecheck passes
- No critical UX issues remain
- Acceptance criteria from `ACCEPTANCE.md` are verified

---

## Running the Loop

### Manual (Recommended for Human-in-the-Loop)

```bash
cd <generated-project>
./scripts/ralph_loop_runner.sh
```

The script will:

1. Check prerequisites (npm, playwright)
2. Run up to 20 passes
3. Stop early on completion promise
4. Output final status

### With Claude Code

```bash
cd <generated-project>
claude
# Say: "Run the UX polish loop"
```

Claude will follow `ralph/LOOP.md` instructions.

---

## Integration for Pipelines

Pipelines that generate React UIs should:

1. Copy `ralph/` templates into generated projects
2. Copy Playwright config and smoke tests
3. Copy `scripts/ralph_loop_runner.sh`
4. Add package.json scripts:
   - `"test:e2e"` - runs Playwright
   - `"polish:ux"` - runs ralph loop runner

---

## Files in This Module

| File                                | Purpose                           |
| ----------------------------------- | --------------------------------- |
| `templates/ralph/PRD.md`            | Template for product requirements |
| `templates/ralph/ACCEPTANCE.md`     | Template for acceptance criteria  |
| `templates/ralph/LOOP.md`           | Instructions for running the loop |
| `templates/ralph/PROGRESS.md`       | Template for progress tracking    |
| `templates/ralph/QA_NOTES.md`       | Template for manual QA notes      |
| `templates/playwright.config.ts`    | Playwright config template        |
| `templates/tests/e2e/smoke.spec.ts` | Minimal smoke test template       |
| `scripts/ralph_loop_runner.sh`      | The main runner script            |

---

## Which Pipelines Use This?

| Pipeline         | Uses UX Polish Loop? | Reason                                      |
| ---------------- | -------------------- | ------------------------------------------- |
| website-pipeline | YES                  | Generates Next.js websites                  |
| dapp-factory     | YES                  | Generates Next.js dApps                     |
| app-factory      | OPTIONAL             | Mobile-first, but web exports can be tested |
| agent-factory    | NO                   | HTTP API, no UI                             |
| plugin-factory   | NO                   | CLI/API based                               |

---

## Verification

Run from repo root:

```bash
./scripts/verify_ui_polish_integration.sh
```

This checks that all UI pipelines have the required templates.
