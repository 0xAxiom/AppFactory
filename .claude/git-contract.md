# Git Contract

**Repository**: AppFactory
**Version**: 1.0.0
**Last Updated**: 2026-01-22

---

## PURPOSE

This document defines safe git workflows for Claude operations in this repository. All git operations MUST follow these contracts to prevent data loss and maintain clean history.

---

## CORE PRINCIPLES

1. **Never Force Push** (especially to main/master)
2. **Always Show Diff Before Commit**
3. **Never Reset Hard** (use stash-based rollback)
4. **Preserve User Work** (stash before destructive operations)
5. **Clean Commit Messages** (follow conventional commits)
6. **Full Transparency** (user sees all git operations)

---

## SAFE DIFF WORKFLOW

### Before Making Any Changes

```bash
# 1. Check current state
git status

# 2. Show what will change (before modifications)
git diff

# 3. Make changes (file edits, writes, etc.)

# 4. Show what changed (after modifications)
git diff

# 5. Show untracked files
git status

# 6. Present plan to user:
#    "I will stage: <files>
#     Commit message: <message>
#     Approve?"
```

### Commit Workflow

```bash
# 1. Stage specific files (never 'git add .')
git add .claude/control.md .claude/guardrails.md .vscode/tasks.json

# 2. Show staged changes
git diff --staged

# 3. Present commit message
git commit -m "setup: add Claude governance layer and VS Code tasks

- Add .claude/ governance files (control, guardrails, commands, git-contract)
- Add .vscode/ workspace integration (tasks, settings, extensions)
- Configure deterministic verification pipeline
- Add emergency rollback procedure

Refs: Setup Mode (no source modifications)"

# 4. Confirm commit created
git log -1 --oneline
```

### Conventional Commit Format

Use conventional commit format for all commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, no code change
- `refactor`: Code change that neither fixes bug nor adds feature
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Build process or auxiliary tool changes
- `setup`: Initial setup or governance changes

**Examples**:
```
setup(claude): add governance layer and VS Code integration
fix(cli): resolve TypeScript errors in generator.ts
feat(dapp): add Web3 provider configuration
docs(readme): add Claude workflow section
```

---

## ROLLBACK PROCEDURES

### Stash-Based Rollback (Safe)

**Use this instead of `git reset --hard`**

```bash
# 1. Check what will be saved
git status

# 2. Stash all changes (preserves work)
git stash push -m "Rollback point $(date +%Y-%m-%d_%H-%M-%S)"

# 3. Verify clean state
git status

# 4. View stashed changes
git stash list

# 5. Recover later if needed
git stash show stash@{0}  # View contents
git stash pop             # Apply and remove from stash
# OR
git stash apply           # Apply but keep in stash
```

### Emergency Rollback (VS Code Task)

VS Code task will execute:
```bash
#!/bin/bash
echo "=== EMERGENCY ROLLBACK ==="
echo "Current changes will be stashed (not lost)"
echo ""
git status
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" = "yes" ]; then
    timestamp=$(date +%Y-%m-%d_%H-%M-%S)
    git stash push -m "Emergency rollback $timestamp"
    echo "✓ Changes stashed"
    echo "✓ Working tree clean"
    echo ""
    echo "To recover: git stash pop"
else
    echo "Rollback cancelled"
fi
```

### File-Specific Rollback

To discard changes to specific files:

```bash
# 1. Show what will be discarded
git diff path/to/file.ts

# 2. Confirm with user

# 3. Restore from HEAD
git restore path/to/file.ts

# 4. Verify restoration
git status
```

**NEVER** use `git checkout .` or `git reset --hard` without explicit user approval and clear warning.

---

## PROHIBITED GIT OPERATIONS

These operations are **NEVER allowed** without explicit user override:

| Operation | Risk | Alternative |
|-----------|------|-------------|
| `git reset --hard` | Loses uncommitted work | `git stash` |
| `git push --force` | Rewrites remote history | `git push --force-with-lease` (with approval) |
| `git clean -fd` | Deletes untracked files | Manual review + selective delete |
| `git checkout .` | Discards all changes | `git stash` |
| `git rebase` on shared branches | Rewrites history | `git merge` |
| `git commit --amend` on pushed commits | Rewrites history | New commit |

---

## BRANCH STRATEGY

### Main Branch Protection

**Branch**: `main` (or `master`)

**Rules**:
1. Never force push to main
2. All commits should be meaningful and tested
3. Prefer feature branches for experimental work
4. Use pull requests for significant changes (when working with team)

### Feature Branch Workflow (Optional)

For larger changes:

```bash
# 1. Create feature branch
git checkout -b setup/claude-governance

# 2. Make changes and commit
git add .claude/ .vscode/
git commit -m "setup: add Claude governance layer"

# 3. Push feature branch
git push -u origin setup/claude-governance

# 4. User can create PR or merge locally
git checkout main
git merge setup/claude-governance
```

---

## COMMIT MESSAGE TEMPLATES

### Setup Mode Commits

```
setup(claude): add governance layer and VS Code integration

- Add .claude/ governance files
- Add .vscode/ tasks for verification pipeline
- Configure emergency rollback procedure
- Update .gitignore for agent artifacts

Refs: Setup Mode (no source modifications)
```

### Fix Mode Commits

```
fix(cli): resolve TypeScript errors in generator.ts

- Fix unused variable 'config'
- Add proper error handling for file operations
- Update type annotations for clarity

Fixes: TS2532, TS6133
Refs: Fix Mode (approved by user)
```

### Documentation Commits

```
docs(readme): add Claude workflow section

- Document VS Code tasks
- Explain Setup vs Fix modes
- Add emergency rollback instructions

Refs: Setup Mode
```

---

## PRE-COMMIT CHECKLIST

Before any commit, verify:

- [ ] Changes match current mode (Setup or Fix)
- [ ] User has seen and approved diff
- [ ] Commit message follows conventional format
- [ ] Only intended files are staged
- [ ] No secrets or sensitive data in commit
- [ ] Tests pass (if in Fix Mode)
- [ ] Linting passes (if in Fix Mode)

---

## COMMIT SIGNING (Optional)

If user has GPG signing configured:

```bash
# Check if signing is configured
git config --get user.signingkey

# Commit with signing
git commit -S -m "setup: add governance layer"

# Verify signature
git log --show-signature -1
```

Claude will respect existing git config but won't require signing.

---

## HANDLING MERGE CONFLICTS

If merge conflicts occur:

1. **HALT** automatic resolution
2. **SHOW** conflict files to user
3. **EXPLAIN** conflicting changes
4. **REQUEST** user resolution or guidance
5. **NEVER** auto-resolve conflicts

```bash
# 1. Detect conflict
git status
# Shows: "both modified: file.ts"

# 2. Show conflict markers
cat file.ts
# Shows: <<<<<<< HEAD ... ======= ... >>>>>>> branch

# 3. Present to user
echo "Conflict detected in file.ts"
echo "Option 1: Resolve manually"
echo "Option 2: Abort merge with 'git merge --abort'"
echo "Option 3: I can help resolve if you explain intent"
```

---

## GIT HOOKS INTEGRATION

This repository uses Husky for git hooks:

### Pre-Commit Hook
- Runs `lint-staged` (linting and formatting)
- Enforced by Husky
- Claude respects these hooks (does not bypass with `--no-verify`)

### Commit-Msg Hook
- Validates commit message format
- Enforced by commitlint
- Claude follows conventional commit format to pass validation

**Claude NEVER bypasses hooks** with `--no-verify` unless explicitly instructed.

---

## REMOTE OPERATIONS

### Push Protocol

```bash
# 1. Verify local commits
git log origin/main..HEAD

# 2. Show what will be pushed
git diff origin/main..HEAD

# 3. Request approval
echo "I will push N commits to remote. Approve?"

# 4. Push (never force)
git push

# 5. Confirm success
git status
```

### Pull Protocol

```bash
# 1. Check remote status
git fetch
git status

# 2. Show incoming changes
git log HEAD..origin/main

# 3. Request approval
echo "Remote has N new commits. Pull? (may cause conflicts)"

# 4. Pull with rebase or merge
git pull --rebase  # Or: git pull

# 5. Handle conflicts if any (see Merge Conflicts section)
```

---

## SAFETY CHECKLIST

Before any git operation, Claude verifies:

- [ ] Operation matches allowed commands (see commands.md)
- [ ] User has seen diff/status
- [ ] User has approved operation
- [ ] Operation will not lose uncommitted work
- [ ] Operation will not rewrite shared history
- [ ] Commit message follows conventions
- [ ] No secrets in staged files
- [ ] Git hooks will not be bypassed

---

## RECOVERY FROM MISTAKES

If a git operation goes wrong:

### Undo Last Commit (Not Pushed)
```bash
# Undo commit, keep changes staged
git reset --soft HEAD~1

# Undo commit, keep changes unstaged
git reset HEAD~1

# Show what was undone
git log -1
git status
```

### Recover Lost Commits
```bash
# View reflog (shows all HEAD movements)
git reflog

# Recover specific commit
git cherry-pick <commit-hash>

# Or reset to that commit
git reset --hard <commit-hash>  # Only with explicit approval
```

### Recover Deleted Branch
```bash
# Find branch in reflog
git reflog | grep branch-name

# Recreate branch at that commit
git checkout -b branch-name <commit-hash>
```

---

## VERSION HISTORY

| Version | Date       | Changes                 |
| ------- | ---------- | ----------------------- |
| 1.0.0   | 2026-01-22 | Initial git contract    |

---

**All git operations subject to guardrails and approval requirements.**
