# Next Prompts for Ralph Iterations 2-5

**Purpose:** Human-in-the-loop prompts for continuing the polish run.

---

## How to Use

1. Open terminal in repo root
2. Run `claude`
3. Paste one prompt below
4. Let Claude diagnose, fix, verify, and log
5. Repeat for next iteration

---

## Iteration 2 Prompts

### app-factory — Iteration 2

```
Ralph run: app-factory iteration 2

Read:
- app-factory/README.md
- app-factory/CLAUDE.md
- ralph/COMMON_ACCEPTANCE.md

Check against acceptance criteria. Find the single biggest remaining gap.
Make one surgical fix. Verify with a concrete check (grep, file exists, command works).
Log to ralph/RUN_LOG.md following the existing format.

Focus areas for iteration 2:
- Verify all internal links resolve
- Check examples section completeness
- Confirm "How to Start" commands work
```

### dapp-factory — Iteration 2

```
Ralph run: dapp-factory iteration 2

Read:
- dapp-factory/README.md
- dapp-factory/CLAUDE.md
- ralph/COMMON_ACCEPTANCE.md

Check against acceptance criteria. Find the single biggest remaining gap.
Make one surgical fix. Verify with a concrete check.
Log to ralph/RUN_LOG.md.

Focus areas for iteration 2:
- Verify Agent Decision Gate documentation is clear
- Check Mode A vs Mode B explanation in README
- Confirm all Rig framework links work
```

### agent-factory — Iteration 2

```
Ralph run: agent-factory iteration 2

Read:
- agent-factory/README.md
- agent-factory/CLAUDE.md
- ralph/COMMON_ACCEPTANCE.md

Check against acceptance criteria. Find the single biggest remaining gap.
Make one surgical fix. Verify with a concrete check.
Log to ralph/RUN_LOG.md.

Focus areas for iteration 2:
- Remove or update stale IMPLEMENTATION_CHECKLIST.md
- Verify example in examples/codebase-explainer/ is complete
- Check all npm scripts documented match actual scripts
```

### plugin-factory — Iteration 2

```
Ralph run: plugin-factory iteration 2

Read:
- plugin-factory/README.md
- plugin-factory/CLAUDE.md
- ralph/COMMON_ACCEPTANCE.md

Check against acceptance criteria. Find the single biggest remaining gap.
Make one surgical fix. Verify with a concrete check.
Log to ralph/RUN_LOG.md.

Focus areas for iteration 2:
- Verify examples/ directory has working examples
- Check MCP server template completeness
- Confirm Claude Code plugin structure matches docs
```

### website-pipeline — Iteration 2

```
Ralph run: website-pipeline iteration 2

Read:
- website-pipeline/README.md
- website-pipeline/CLAUDE.md
- ralph/COMMON_ACCEPTANCE.md

Check against acceptance criteria. Find the single biggest remaining gap.
Make one surgical fix. Verify with a concrete check.
Log to ralph/RUN_LOG.md.

Focus areas for iteration 2:
- Verify example/ contains complete reference implementation
- Check skills audit documentation completeness
- Confirm Ralph/Playwright structure in example matches CLAUDE.md
```

---

## Iteration 3 Prompts

### All Pipelines — Iteration 3

```
Ralph run: [PIPELINE] iteration 3

Read the pipeline README and CLAUDE.md.
Check against ralph/COMMON_ACCEPTANCE.md.

Iteration 3 focus: USABILITY
- Can a new user follow the quickstart without errors?
- Are error messages helpful?
- Is the "What Gets Generated" section accurate?

Find one usability gap. Fix it. Verify. Log.
```

Replace `[PIPELINE]` with: app-factory, dapp-factory, agent-factory, plugin-factory, or website-pipeline

---

## Iteration 4 Prompts

### All Pipelines — Iteration 4

```
Ralph run: [PIPELINE] iteration 4

Read the pipeline README and CLAUDE.md.
Check against ralph/COMMON_ACCEPTANCE.md.

Iteration 4 focus: CORRECTNESS
- Do documented commands actually work?
- Does the output structure match reality?
- Are version numbers consistent?

Find one correctness gap. Fix it. Verify. Log.
```

---

## Iteration 5 Prompts

### All Pipelines — Iteration 5

```
Ralph run: [PIPELINE] iteration 5

Read the pipeline README and CLAUDE.md.
Check against ralph/COMMON_ACCEPTANCE.md.

Iteration 5 focus: FINAL POLISH
- Any remaining broken links?
- Any placeholder text?
- Any inconsistencies with other pipelines?

Find one final polish item. Fix it. Verify. Log.

If pipeline now meets ALL acceptance criteria, add this to RUN_LOG.md:

PIPELINE_POLISHED: [PIPELINE] meets all acceptance criteria.
```

---

## Batch Run (All Pipelines, One Iteration)

For running iteration N across all pipelines:

```
Ralph batch run: Iteration N for all pipelines

For each of these pipelines:
- app-factory
- dapp-factory
- agent-factory
- plugin-factory
- website-pipeline

1. Read README.md and CLAUDE.md
2. Check against ralph/COMMON_ACCEPTANCE.md
3. Find one improvement
4. Fix it
5. Verify with concrete check
6. Log to ralph/RUN_LOG.md

Focus for iteration N:
- Iteration 2: Link validation, example completeness
- Iteration 3: Usability (can new users follow quickstart?)
- Iteration 4: Correctness (do commands work?)
- Iteration 5: Final polish (any remaining issues?)
```

---

## Completion Criteria

A pipeline is DONE when RUN_LOG.md contains:

```
PIPELINE_POLISHED: [pipeline-name] meets all acceptance criteria.
```

The entire Ralph run is DONE when all 5 pipelines have this marker.

---

## Progress Tracking

After each iteration, update this section:

| Pipeline         | Iter 1 | Iter 2 | Iter 3 | Iter 4 | Iter 5 | Polished |
| ---------------- | ------ | ------ | ------ | ------ | ------ | -------- |
| app-factory      | DONE   | DONE   | DONE   | DONE   | DONE   | ✅       |
| dapp-factory     | DONE   | DONE   | DONE   | DONE   | DONE   | ✅       |
| agent-factory    | DONE   | DONE   | DONE   | DONE   | DONE   | ✅       |
| plugin-factory   | DONE   | DONE   | DONE   | DONE   | DONE   | ✅       |
| website-pipeline | DONE   | DONE   | DONE   | DONE   | DONE   | ✅       |

---

**Version:** 1.0 (2026-01-18)
