# VS Code Tasks Reference

This document lists all VS Code tasks available in AppFactory.

---

## Running Tasks

Open Command Palette: `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)

Type: `Tasks: Run Task`

Select the task from the list.

---

## Task Categories

### Code Quality

| Task                   | Description                        | Output          |
| ---------------------- | ---------------------------------- | --------------- |
| `Claude: Verify`       | Run lint, format check, type check | Terminal output |
| `Claude: Lint`         | Run ESLint only                    | Terminal output |
| `Claude: Type Check`   | Run TypeScript type check only     | Terminal output |
| `Claude: Format Check` | Run Prettier format check only     | Terminal output |
| `Claude: Test`         | Run test suite                     | Terminal output |

### Build

| Task                         | Description                | Output               |
| ---------------------------- | -------------------------- | -------------------- |
| `Claude: Build CLI`          | Build the CLI package      | `CLI/dist/`          |
| `Claude: Build dApp Factory` | Build dapp-factory         | `dapp-factory/dist/` |
| `Claude: Full Pipeline`      | Run verify, then build all | Multiple outputs     |

### Audit

| Task                       | Description                             | Output          |
| -------------------------- | --------------------------------------- | --------------- |
| `Claude: Audit Workspace`  | Check governance, code quality, hygiene | `AUDIT.json`    |
| `Claude: Boundary Check`   | Verify working directory is correct     | `BOUNDARY.json` |
| `Claude: Dependency Check` | Check dependency status                 | Terminal output |

### Preview

| Task                                    | Description                      | Output          |
| --------------------------------------- | -------------------------------- | --------------- |
| `Factory: Preview (Auto)`               | Launch dev server, discover URL  | `PREVIEW.json`  |
| `Factory: Preview (Detect Only)`        | Show detection without launching | Terminal output |
| `Factory: Preview (Open Browser)`       | Open URL in default browser      | Browser window  |
| `Factory: Preview (Mobile Web iPhone)`  | Playwright iPhone emulation      | Browser window  |
| `Factory: Preview (Mobile Web Android)` | Playwright Android emulation     | Browser window  |
| `Factory: Preview (Mobile Web iPad)`    | Playwright iPad emulation        | Browser window  |
| `Factory: iOS Simulator (Mac Only)`     | Launch iOS Simulator             | Simulator app   |

### Utility

| Task                         | Description                           | Output          |
| ---------------------------- | ------------------------------------- | --------------- |
| `Claude: Clean`              | Remove artifacts and clean builds     | Terminal output |
| `Claude: Emergency Rollback` | Stash all changes (with confirmation) | Git stash       |

---

## Task Details

### Claude: Verify

Runs the full CI pipeline:

```
npm run ci
# Equivalent to: npm run lint && npm run format:check && npm run type-check
```

**Use when**: Before committing, to ensure code quality.

**Exit code**: 0 on success, 1 on failure.

---

### Claude: Audit Workspace

Performs comprehensive workspace audit:

1. Checks governance files exist:
   - `.claude/control.md`
   - `.claude/guardrails.md`
   - `.claude/commands.md`
   - `.claude/git-contract.md`

2. Checks workspace configuration:
   - `.vscode/tasks.json`
   - `.vscode/settings.json`
   - `.vscode/extensions.json`

3. Runs code quality checks:
   - Lint status
   - Type check status
   - Format status

4. Checks hygiene:
   - Uncommitted changes
   - Untracked files
   - node_modules presence

**Output**: `AUDIT.json`

```json
{
  "timestamp": "...",
  "audit": {
    "governance": { "control_md_present": true, "..." },
    "workspace": { "tasks_configured": true, "..." },
    "code_quality": { "lint_status": "PASS", "..." },
    "hygiene": { "uncommitted_changes": false, "..." }
  },
  "issues": []
}
```

---

### Claude: Boundary Check

Verifies the working directory matches the expected repository root.

**Use when**: After switching machines or directories, to ensure you're in the right place.

**Output**: `BOUNDARY.json`

```json
{
  "status": "pass",
  "topLevel": "/path/to/AppFactory",
  "workspaceFolder": "/path/to/AppFactory",
  "expected": "/path/to/AppFactory",
  "timestamp": "..."
}
```

---

### Factory: Preview (Auto)

Launches the dev server and discovers the URL.

**Process**:

1. Detects package manager (npm/pnpm/yarn/bun)
2. Detects dev command (dev/start/serve)
3. Runs the dev command
4. Watches stdout for URLs
5. Writes URL to PREVIEW.json

**Use when**: Starting development on a generated app.

**Output**: `.vscode/.preview/PREVIEW.json`

**Note**: Runs as background task. Server keeps running until stopped (Ctrl+C).

---

### Factory: Preview (Mobile Web \*)

Opens the URL from PREVIEW.json in Playwright with device emulation.

**Requirements**:

- `Factory: Preview (Auto)` must have run first
- PREVIEW.json must contain a valid URL

**Device settings**:

| Device  | Viewport | User Agent    |
| ------- | -------- | ------------- |
| iPhone  | 393x852  | iOS Safari    |
| Android | 412x915  | Chrome Mobile |
| iPad    | 834x1194 | iOS Safari    |

**Note**: Installs Playwright on first use if not present.

---

### Factory: Preview (Open Browser)

Opens the URL from PREVIEW.json in your default browser.

**Platform commands**:

- macOS: `open <url>`
- Linux: `xdg-open <url>`
- Windows: `start <url>`

---

### Factory: iOS Simulator (Mac Only)

Launches the iOS Simulator application.

**Requirements**:

- macOS only
- Xcode installed
- Xcode Command Line Tools

**On other platforms**: Fails gracefully with alternative suggestion.

---

### Claude: Clean

Removes generated artifacts:

```bash
rm -f SUCCESS.json FAILURE.json AUDIT.json
npm run clean
```

**Use when**: Starting fresh or troubleshooting.

---

### Claude: Emergency Rollback

Stashes all uncommitted changes:

```bash
git stash push -m "Emergency rollback <timestamp>"
```

**Requires**: User confirmation (interactive prompt).

**Recovery**: `git stash pop`

---

## Task Configuration

Tasks are defined in `.vscode/tasks.json`.

### Task Schema

```json
{
  "label": "Task Name",
  "type": "shell",
  "command": "command",
  "args": ["arg1", "arg2"],
  "problemMatcher": ["$eslint-stylish"],
  "presentation": {
    "reveal": "always",
    "panel": "shared"
  },
  "group": {
    "kind": "build",
    "isDefault": true
  }
}
```

### Problem Matchers

| Matcher           | Source            |
| ----------------- | ----------------- |
| `$eslint-stylish` | ESLint errors     |
| `$tsc`            | TypeScript errors |

These allow VS Code to highlight errors in the Problems panel.

---

## Keybindings

You can add keybindings for frequently used tasks.

Edit `keybindings.json`:

```json
{
  "key": "cmd+shift+v",
  "command": "workbench.action.tasks.runTask",
  "args": "Claude: Verify"
}
```

---

## Running Tasks from Terminal

Tasks can also be run via command line:

```bash
# Run npm scripts directly
npm run lint
npm run type-check
npm run ci

# Run preview scripts
node scripts/preview/launch-dev.mjs
node scripts/preview/open-url.mjs
```

---

**Next**: [Artifacts Reference](./artifacts.md) | [Back to Index](../index.md)
