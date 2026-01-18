# Ralph Workspace

**Purpose:** Iterative polish and quality assurance for App Factory pipelines.

---

## What Is Ralph?

Ralph is our "picky reviewer" methodology for ensuring documentation quality, consistency, and usability across all App Factory pipelines. Named after the skeptical QA persona, Ralph runs are structured improvement passes.

---

## How Ralph Runs Work

### Per-Pipeline Runs

Each pipeline receives up to **5 iterations** of polish:

1. **Diagnose** - Identify the single biggest gap in docs/UX
2. **Fix** - Make one surgical improvement
3. **Verify** - Concrete check (file exists, command works, links valid)
4. **Log** - Document in `RUN_LOG.md`
5. **Repeat or Complete** - Continue until acceptance met or 5 iterations done

### Acceptance Criteria

A pipeline is "polished" when it meets all criteria in `COMMON_ACCEPTANCE.md`.

---

## Files in This Directory

| File | Purpose |
|------|---------|
| `README.md` | This file - explains Ralph runs |
| `PIPELINE_INDEX.md` | Inventory of all pipelines |
| `RUN_LOG.md` | Append-only log of all iterations |
| `COMMON_ACCEPTANCE.md` | Shared acceptance checklist |
| `NEXT_PROMPTS.md` | Human-in-the-loop prompts for remaining iterations |

---

## Running a Ralph Session

### Automated (via Claude)

```bash
cd <repo-root>
claude
# Paste the next prompt from NEXT_PROMPTS.md
```

### Manual

1. Read the pipeline's README and CLAUDE.md
2. Check against COMMON_ACCEPTANCE.md
3. Identify one improvement
4. Implement it
5. Verify with a concrete check
6. Log in RUN_LOG.md

---

## Conventions

### Naming

- Pipeline names use kebab-case: `app-factory`, `dapp-factory`
- Build output directories match pipeline pattern: `builds/`, `dapp-builds/`, `outputs/`

### How to Run Sections

Every pipeline README must have:

```markdown
## How to Run

\`\`\`bash
cd <pipeline-name>
claude
# Describe your idea
# When done:
cd <output-dir>/<slug>
npm install
npm run dev
\`\`\`
```

### Quality Gates

Every pipeline must document its quality gates, even if minimal:

```markdown
## Quality Gates

- [ ] Build compiles without errors
- [ ] Ralph QA passes (≥97%)
- [ ] Required artifacts exist
```

---

## Version History

- **1.0** (2026-01-18): Initial Ralph workspace setup
