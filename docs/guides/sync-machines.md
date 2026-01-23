# How to Sync Across Machines

This guide explains how to keep AppFactory synchronized across multiple development machines.

---

## Overview

AppFactory is a Git repository. Syncing across machines uses standard Git operations:

- Clone on each machine
- Pull to receive changes
- Push to share changes

This guide covers the specific workflow for AppFactory.

---

## Initial Setup

### First Machine (Already Configured)

If you've already been working on one machine, ensure your changes are committed and pushed:

```bash
cd /path/to/AppFactory
git status        # Check for uncommitted changes
git add .         # Stage changes
git commit -m "Your message"
git push          # Push to GitHub
```

### Second Machine (New Setup)

Clone the repository:

```bash
git clone https://github.com/MeltedMindz/AppFactory.git
cd AppFactory
npm ci            # Install dependencies
```

Verify the sync:

```bash
git log -1        # Should match the first machine
```

---

## Daily Workflow

### Before Starting Work

Always pull the latest changes:

```bash
cd /path/to/AppFactory
git fetch origin
git pull --ff-only
```

The `--ff-only` flag ensures clean fast-forward merges. If it fails, you have divergent changes that need resolution.

### After Making Changes

Push your changes before switching machines:

```bash
git add .
git commit -m "Describe your changes"
git push
```

---

## VS Code Sync Verification

Use the audit task to verify sync status:

1. Open Command Palette: `Cmd+Shift+P` / `Ctrl+Shift+P`
2. Type: `Tasks: Run Task`
3. Select: `Claude: Audit Workspace`

This verifies:

- Governance files present
- Code quality checks
- Git status

---

## What to Sync

### Always Sync (Committed to Git)

| Directory                  | Contents                   |
| -------------------------- | -------------------------- |
| `.claude/`                 | Governance configuration   |
| `.vscode/`                 | VS Code settings and tasks |
| `scripts/`                 | Utility scripts            |
| `docs/`                    | Documentation              |
| Pipeline `CLAUDE.md` files | Pipeline constitutions     |

### Never Sync (In .gitignore)

| Pattern                  | Reason                   |
| ------------------------ | ------------------------ |
| `node_modules/`          | Installed per machine    |
| `.env`                   | Machine-specific secrets |
| `*.log`                  | Local logs               |
| `.vscode/.preview/`      | Local preview artifacts  |
| `builds/*/node_modules/` | Per-build dependencies   |

### Sync Optionally (Your Choice)

| Directory                   | Considerations                          |
| --------------------------- | --------------------------------------- |
| Pipeline output directories | Large, regenerable; sync only if needed |
| Research artifacts          | Useful to share; may be large           |

---

## Handling Generated Outputs

### Option 1: Regenerate on Each Machine

Don't sync generated apps. Regenerate them:

```bash
# On new machine
cd app-factory
claude
# Describe your app again
```

**Pros**: No large files in Git
**Cons**: Takes time to regenerate

### Option 2: Sync Everything

Add outputs to Git:

```bash
git add app-factory/builds/my-app/
git commit -m "Add my-app build"
git push
```

**Pros**: Instant availability
**Cons**: Large repository size

### Option 3: Selective Sync

Sync only essential outputs:

```bash
# .gitignore
app-factory/builds/*
!app-factory/builds/important-app/
```

---

## Conflict Resolution

### Fast-Forward Only

If pull fails with "not possible to fast-forward":

```bash
# Check what diverged
git log --oneline origin/main ^HEAD
git log --oneline HEAD ^origin/main

# Option 1: Rebase your changes
git rebase origin/main

# Option 2: Merge
git merge origin/main
```

### Governance File Conflicts

If `.claude/` files conflict:

1. Keep the newer version (usually origin)
2. Review changes carefully
3. Don't lose governance rules

```bash
# Accept remote version
git checkout --theirs .claude/control.md
git add .claude/control.md
```

---

## Cross-Platform Considerations

### Line Endings

Git handles line endings automatically, but verify settings:

```bash
# Check current setting
git config core.autocrlf

# Recommended: input (LF in repo, native locally)
git config core.autocrlf input
```

### Path Separators

The codebase uses forward slashes (`/`) which work on all platforms. Don't change them to backslashes.

### Node Versions

Keep Node.js versions consistent across machines:

```bash
# Check version
node --version

# Should be 18+ on all machines
```

Consider using nvm or fnm to manage versions.

---

## Sync Verification Script

Run this to verify sync status:

```bash
# Check Git state
git fetch origin
git status

# Verify HEAD matches origin
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" = "$REMOTE" ]; then
  echo "✓ Synchronized"
else
  echo "✗ Not synchronized"
  echo "  Local:  $LOCAL"
  echo "  Remote: $REMOTE"
fi
```

---

## Automated Sync Workflow

### Using VS Code Tasks

1. Open Command Palette
2. Run `Tasks: Run Task` → `Claude: Verify`
3. This runs lint, format check, and type check

If all pass, your local state is valid.

### Pre-Push Verification

Before pushing:

```bash
npm run ci        # Run full CI checks
git push
```

---

## Troubleshooting

### "Permission denied" on push

Check SSH key setup:

```bash
ssh -T git@github.com
```

### "npm ci" fails after pull

Dependencies may have changed:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Different behavior on machines

Check for:

- Different Node versions
- Different OS behavior
- Missing environment variables

---

## Best Practices

1. **Pull before starting work** - Always start with latest
2. **Push before switching machines** - Don't leave uncommitted changes
3. **Use consistent Node version** - Prevents dependency issues
4. **Don't sync node_modules** - Install fresh on each machine
5. **Keep .env files local** - Use .env.example for templates

---

**Next**: [VS Code Tasks Reference](../reference/vscode-tasks.md) | [Back to Index](../index.md)
