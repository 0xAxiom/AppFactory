# Repository Hygiene Report

**Repository**: AppFactory
**Generated**: 2026-01-22T10:30:00Z
**Mode**: SETUP

---

## PURPOSE

This document defines expected repository hygiene invariants and provides a checklist for Claude to verify before and after operations.

---

## HYGIENE CATEGORIES

### 1. Git Cleanliness

**Invariants**:
- No uncommitted changes to `package-lock.json` (unless intentional)
- No untracked build artifacts
- No `.DS_Store` or OS-specific files
- No temporary files (`.tmp`, `.log`, `.cache`)

**Checks**:
```bash
# Check git status
git status --porcelain

# Expected output (after setup):
M  .claude/control.md
M  .claude/guardrails.md
A  .vscode/tasks.json
```

**Red Flags**:
- `M package-lock.json` (unless you just ran npm install)
- `?? node_modules/` (should be gitignored)
- `?? .env` (secrets file not ignored)

---

### 2. Dependency Health

**Invariants**:
- `package-lock.json` exists and is committed
- `node_modules/` is gitignored
- No `npm-debug.log` files
- Dependencies are installed (`node_modules/` exists locally)

**Checks**:
```bash
# Verify lock file exists
ls -la package-lock.json

# Verify node_modules is ignored
grep "node_modules" .gitignore

# Check for debug logs
find . -name "npm-debug.log" -o -name "yarn-error.log"

# Expected: No output (no debug logs)
```

**Red Flags**:
- Missing `package-lock.json`
- `node_modules/` not in `.gitignore`
- Debug logs present

---

### 3. Code Quality

**Invariants**:
- Linting passes (`npm run lint` exits 0)
- Formatting is consistent (`npm run format:check` exits 0)
- TypeScript compilation succeeds (`npm run type-check` exits 0)
- Tests pass (`npm run test` exits 0)

**Checks**:
```bash
# Run verification suite
npm run ci

# Expected output:
# ✓ lint passed
# ✓ format check passed
# ✓ type check passed
# (exit code 0)
```

**Red Flags**:
- Lint errors (exit code 1)
- Type errors (exit code 1)
- Failing tests (exit code 1)

---

### 4. File Structure

**Invariants**:
- `.claude/` directory exists with governance files
- `.vscode/` directory exists with tasks and settings
- `.gitignore` includes agent artifacts
- No duplicate configuration files

**Checks**:
```bash
# Verify governance files
ls .claude/control.md .claude/guardrails.md .claude/commands.md

# Verify VS Code integration
ls .vscode/tasks.json .vscode/settings.json .vscode/extensions.json

# Check gitignore for agent artifacts
grep -E "(SUCCESS\.json|FAILURE\.json|AUDIT\.json)" .gitignore
```

**Red Flags**:
- Missing governance files
- Missing VS Code configuration
- Agent artifacts not gitignored

---

### 5. Security

**Invariants**:
- No `.env` files committed
- No API keys in code
- No AWS credentials in code
- No private keys committed

**Checks**:
```bash
# Check for .env files in git
git ls-files | grep "\.env"

# Expected output: (empty)

# Search for potential secrets
grep -r "API_KEY\|SECRET\|PASSWORD" --include="*.ts" --include="*.js" . | grep -v "node_modules"

# Expected: Only type definitions or placeholder examples
```

**Red Flags**:
- `.env` file committed
- Hardcoded API keys
- AWS credentials in code

---

### 6. Build Artifacts

**Invariants**:
- Build artifacts are gitignored
- `dist/` directories are gitignored
- `build/` directories are gitignored
- Coverage reports are gitignored

**Checks**:
```bash
# Verify build artifacts are ignored
grep -E "(dist/|build/|coverage/)" .gitignore

# Check for committed build artifacts
git ls-files | grep -E "(dist/|build/|coverage/)"

# Expected output: (empty)
```

**Red Flags**:
- Build artifacts committed to git
- Missing gitignore entries

---

## PRE-OPERATION CHECKLIST

Before starting any operation, Claude should verify:

- [ ] Current working directory is repository root
- [ ] Current mode is known (SETUP or FIX)
- [ ] Git status is clean (or changes are expected)
- [ ] `node_modules/` exists (dependencies installed)
- [ ] No uncommitted changes to `package-lock.json`
- [ ] Governance files are present (`.claude/`)

---

## POST-OPERATION CHECKLIST

After completing any operation, Claude should verify:

- [ ] Operation outcome logged to `.claude/audit.log`
- [ ] `SUCCESS.json` or `FAILURE.json` created
- [ ] Git status shows only expected changes
- [ ] No new untracked build artifacts
- [ ] Verification passes (if applicable: lint, type-check)
- [ ] No new uncommitted changes to `package-lock.json`

---

## CONTINUOUS HYGIENE MONITORING

### Run Hygiene Check

```bash
# Full hygiene check (via VS Code task)
# Command Palette → "Tasks: Run Task" → "Claude: Audit Workspace"

# Manual hygiene check
git status
npm run lint
npm run format:check
npm run type-check
```

### Expected Output (Healthy State)

```
Git Status:
  On branch main
  nothing to commit, working tree clean

Lint:
  ✓ 245 files checked, 0 errors, 0 warnings

Format:
  ✓ All files formatted correctly

Type Check:
  ✓ No TypeScript errors
```

---

## HYGIENE DEGRADATION PATTERNS

Watch for these patterns indicating degradation:

| Pattern | Severity | Action |
|---------|----------|--------|
| Increasing lint warnings | LOW | Address gradually |
| New type errors | MEDIUM | Fix before merging |
| Failing tests | HIGH | Fix immediately |
| Uncommitted lock file changes | MEDIUM | Commit or revert |
| Untracked `.env` file | HIGH | Add to `.gitignore` immediately |
| Build artifacts committed | HIGH | Remove from git history |

---

## HYGIENE RECOVERY

If hygiene degrades:

### Step 1: Assess
```bash
git status
npm run ci
```

### Step 2: Categorize Issues
- Linting issues → Enter FIX MODE → `npm run lint:fix`
- Format issues → Enter FIX MODE → `npm run format`
- Type errors → Enter FIX MODE → Manual fixes
- Test failures → Enter FIX MODE → Fix tests
- Git issues → Review and commit/revert

### Step 3: Verify Recovery
```bash
npm run ci
git status
```

### Step 4: Document
Log recovery actions to `.claude/audit.log`

---

## INVARIANT ENFORCEMENT

### Enforced by Git Hooks (Husky)

- **Pre-commit**: `lint-staged` runs eslint and prettier on staged files
- **Commit-msg**: `commitlint` validates commit message format

### Enforced by Claude Guardrails

- No source edits in SETUP mode
- Approval required for all file writes
- Confined writes to authorized directories
- Full audit trail of all operations

### Enforced by CI/CD (if configured)

- Lint must pass
- Type check must pass
- Tests must pass
- Format check must pass

---

## HYGIENE METRICS

Track these metrics over time:

| Metric | Command | Target |
|--------|---------|--------|
| Lint errors | `npm run lint` | 0 errors |
| Lint warnings | `npm run lint` | < 10 warnings |
| Type errors | `npm run type-check` | 0 errors |
| Test failures | `npm run test` | 0 failures |
| Test coverage | `npm run test:coverage` | > 80% |
| Outdated deps | `npm outdated` | < 5 packages |
| Security vulns | `npm audit` | 0 high/critical |

---

## AUTOMATION

### VS Code Tasks

- **Claude: Audit Workspace** → Generates `AUDIT.json`
- **Claude: Verify** → Runs `npm run ci`
- **Claude: Clean** → Removes artifacts

### Scheduled Checks (Optional)

Consider setting up:
- Daily dependency checks (`npm run deps:check`)
- Weekly security audits (`npm audit`)
- Monthly dependency updates (with approval)

---

## VERSION HISTORY

| Version | Date       | Changes                   |
| ------- | ---------- | ------------------------- |
| 1.0.0   | 2026-01-22 | Initial hygiene report    |

---

**Hygiene is maintained through continuous monitoring and automated enforcement.**
