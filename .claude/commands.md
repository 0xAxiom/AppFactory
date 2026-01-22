# Claude Allowed Commands

**Repository**: AppFactory
**Version**: 1.0.0
**Last Updated**: 2026-01-22

---

## PURPOSE

This document defines the exact commands and operations Claude is authorized to execute in this repository. All commands are subject to guardrails defined in `guardrails.md` and mode constraints in `control.md`.

---

## COMMAND AUTHORIZATION MATRIX

### READ-ONLY OPERATIONS (Always Allowed)

| Command Pattern | Purpose | Constraints |
|-----------------|---------|-------------|
| `ls`, `find`, `tree` | Directory inspection | No modifications |
| `cat`, `head`, `tail`, `less` | File reading | No modifications |
| `grep`, `rg`, `ag` | Content search | No modifications |
| `git status`, `git log`, `git diff` | Repository inspection | No commits/pushes |
| `npm list`, `npm outdated` | Dependency inspection | No installs |
| `node --version`, `npm --version` | Version checking | No modifications |

**Approval Required**: No (read-only)
**Mode Restriction**: None (allowed in all modes)

---

### VERIFICATION OPERATIONS (Allowed, Logged)

| Command Pattern | Purpose | Constraints |
|-----------------|---------|-------------|
| `npm run lint` | Linting check | No auto-fix in Setup Mode |
| `npm run format:check` | Format verification | No auto-fix in Setup Mode |
| `npm run type-check` | TypeScript verification | No source edits in Setup Mode |
| `npm run test` | Test execution | No test modifications |
| `npm run ci` | Full verification | No modifications |
| `npm run validate` | Validation suite | No modifications |

**Approval Required**: No (verification only)
**Mode Restriction**: Output-only in Setup Mode
**Logging**: All executions logged to audit log

---

### MAINTENANCE OPERATIONS (Approval Required)

| Command Pattern | Purpose | Constraints |
|-----------------|---------|-------------|
| `npm install` | Install dependencies | Requires approval + network auth |
| `npm audit` | Security audit | Requires approval + network auth |
| `npm run clean` | Clean artifacts | Requires approval, show plan first |
| `npm run deps:check` | Check dependencies | No modifications |
| `npm run deps:audit` | Audit all workspaces | Requires approval + network auth |

**Approval Required**: Yes
**Mode Restriction**: Setup Mode for clean operations, Fix Mode for installs
**Logging**: All executions logged to audit log

---

### BUILD OPERATIONS (Approval Required, Fix Mode Only)

| Command Pattern | Purpose | Constraints |
|-----------------|---------|-------------|
| `npm run build:cli` | Build CLI package | Fix Mode only |
| `npm run build:dapp` | Build dApp factory | Fix Mode only |
| `cd CLI && npm run build` | CLI-specific build | Fix Mode only |
| `cd dapp-factory && npm run build` | dApp-specific build | Fix Mode only |

**Approval Required**: Yes (show build plan first)
**Mode Restriction**: FIX MODE ONLY
**Logging**: All executions logged to audit log

---

### FIX OPERATIONS (Approval Required, Fix Mode Only)

| Command Pattern | Purpose | Constraints |
|-----------------|---------|-------------|
| `npm run lint:fix` | Auto-fix lint errors | Fix Mode only, show diff first |
| `npm run format` | Auto-format code | Fix Mode only, show diff first |
| `eslint --fix <file>` | Fix specific file | Fix Mode only, show diff first |
| `prettier --write <file>` | Format specific file | Fix Mode only, show diff first |

**Approval Required**: Yes (show diff first)
**Mode Restriction**: FIX MODE ONLY
**Logging**: All executions + diffs logged to audit log

---

### GIT OPERATIONS (Restricted, Approval Required)

| Command Pattern | Purpose | Constraints |
|-----------------|---------|-------------|
| `git status` | Check working tree | Always allowed |
| `git diff` | View changes | Always allowed |
| `git log` | View history | Always allowed |
| `git add <files>` | Stage changes | Approval required, show staged files |
| `git commit -m "..."` | Commit changes | Approval required, show commit message |
| `git push` | Push to remote | Explicit approval + network auth |
| `git pull` | Pull from remote | Explicit approval + network auth |
| `git checkout <file>` | Discard changes | Explicit approval (destructive) |
| `git reset` | Reset changes | PROHIBITED (use Emergency Rollback) |

**Approval Required**: Yes for write operations
**Mode Restriction**: Commits allowed in Fix Mode only
**Logging**: All git operations logged to audit log

**PROHIBITED GIT OPERATIONS**:
- `git reset --hard` (use Emergency Rollback task instead)
- `git push --force` (destructive)
- `git clean -fd` (destructive)
- `git checkout .` (use rollback procedure)

---

### FILE OPERATIONS

#### Setup Mode File Operations

| Operation | Allowed Paths | Constraints |
|-----------|---------------|-------------|
| Write/Create | `.claude/**` | Always allowed |
| Write/Create | `.vscode/**` | Always allowed |
| Append | `.gitignore` | Agent artifacts only |
| Append | `README.md` | "Claude Workflow" section only |

**Approval Required**: Yes (show plan first)
**Logging**: All writes logged to audit log

#### Fix Mode File Operations (Additional)

| Operation | Allowed Paths | Constraints |
|-----------|---------------|-------------|
| Edit | Source files | Approval required, show diff |
| Edit | Config files | Approval required, show diff |
| Edit | Test files | Approval required, show diff |
| Delete | Generated files | Approval required, list files |

**Approval Required**: Yes (show diff first)
**Logging**: All writes + diffs logged to audit log

**PROHIBITED FILE OPERATIONS**:
- Writing to `/etc/**`, `~/.ssh/**`, `~/.aws/**`
- Writing to `.env` files (can read for debugging)
- Deleting `.git` directory
- Modifying `package-lock.json` directly (use npm commands)

---

## COMMAND EXECUTION PROTOCOL

All command executions MUST follow this protocol:

### 1. Pre-Execution Check
```
VERIFY current_mode allows command
VERIFY command matches allowed pattern
VERIFY required approvals obtained
```

### 2. Show Execution Plan
```
Command: npm run lint
Purpose: Verify code quality
Expected Outcome: Exit 0 if no errors, Exit 1 with error list if errors found
Side Effects: None (read-only)
Approval Required: No (verification only)
```

### 3. Execute and Log
```
[2026-01-22T10:30:00Z] EXEC npm run lint
[2026-01-22T10:30:05Z] EXIT 0 (success)
```

### 4. Report Results
```
✓ Lint check passed
  - 0 errors
  - 0 warnings
  - 245 files checked
```

---

## EMERGENCY ROLLBACK PROCEDURE

If operations go wrong, use this procedure (NOT raw git commands):

### Via VS Code Task
1. Open Command Palette (Cmd+Shift+P)
2. Run: "Tasks: Run Task"
3. Select: "Claude: Emergency Rollback"
4. Confirm when prompted

### Manual Rollback
```bash
# 1. Check what will be discarded
git status

# 2. Stash current changes (preserves work)
git stash push -m "Emergency rollback $(date)"

# 3. View stashed changes
git stash list

# 4. Recover later if needed
git stash pop  # Apply most recent stash
```

**NEVER use `git reset --hard` directly.** Always use stash-based rollback to preserve work.

---

## NETWORK AUTHORIZATION

Commands requiring network access MUST request authorization:

### Authorization Request Template
```
I need to run: npm install lodash

This requires network access to:
- Registry: https://registry.npmjs.org
- Purpose: Download package

Approve network access? (yes/no)
```

### Authorized Network Operations
- `npm install` (package registry)
- `npm audit` (security API)
- `git push/pull` (git remote)

### Prohibited Network Operations
- Arbitrary `curl` / `wget` without approval
- API calls to non-package services
- Uploading logs or data to external services

---

## COMMAND SANDBOXING

All commands run with these constraints:

1. **Working Directory**: Repository root or designated subdirectory
2. **Environment**: Inherited from user's shell (no modification)
3. **Timeout**: 5 minutes for verification, 15 minutes for builds
4. **Output Capture**: stdout and stderr captured for logging
5. **Exit Code Handling**: Non-zero exits trigger failure protocol

---

## FAILURE HANDLING

If a command fails:

1. **Capture** full error output
2. **Log** to audit log
3. **Create** `FAILURE.json` artifact
4. **Report** to user with recovery suggestions
5. **Do NOT retry** without user approval

**Example Failure Report**:
```json
{
  "status": "FAILURE",
  "command": "npm run lint",
  "exit_code": 1,
  "stderr": "error  'foo' is assigned a value but never used  @typescript-eslint/no-unused-vars",
  "affected_files": ["src/utils/helper.ts"],
  "recovery_suggestions": [
    "Enter FIX MODE to allow auto-fixing",
    "Manually fix the unused variable",
    "Run 'npm run lint:fix' after entering FIX MODE"
  ]
}
```

---

## CUSTOM COMMAND REQUESTS

If user requests a command not in this authorization matrix:

1. **Evaluate** if command is safe and necessary
2. **Check** if command violates guardrails
3. **Request explicit approval** with risk explanation
4. **Log** custom command execution to audit log

**Example**:
```
User: Can you run 'chmod 777 script.sh'?

Claude: This command would make 'script.sh' executable with full permissions for all users.

Risk: Overly permissive permissions (777 is dangerous)
Recommendation: Use 'chmod +x script.sh' (safer)

Approve original command or use safer alternative?
```

---

## REPO BOUNDARY CHECK COMMANDS

### Boundary Verification

| Command Pattern | Purpose | Constraints |
|-----------------|---------|-------------|
| `pwd` | Check current directory | Always allowed |
| `git rev-parse --show-toplevel` | Get repository root | Always allowed |
| Boundary check task | Verify working directory matches repo root | Always allowed |

**Approval Required**: No (verification only)
**Mode Restriction**: None (allowed in all modes)
**Logging**: Boundary violations logged to audit log

### Command: Repo Boundary Check

**Purpose**: Verify that the current working directory is within the AppFactory repository boundaries.

**Execution**:
```bash
# Get git repository root
git_root=$(git rev-parse --show-toplevel)

# Get expected root
expected_root="/Users/melted/Documents/GitHub/AppFactory"

# Compare
if [ "$git_root" = "$expected_root" ]; then
  echo "✓ Boundary check PASS"
  echo "  Working in: $git_root"
else
  echo "✗ Boundary check FAIL"
  echo "  Expected: $expected_root"
  echo "  Actual: $git_root"
  exit 1
fi
```

**VS Code Task**: Available as "Claude: Boundary Check" (see `.vscode/tasks.json`)

**Output Artifact**: `BOUNDARY.json`
```json
{
  "status": "pass",
  "topLevel": "/Users/melted/Documents/GitHub/AppFactory",
  "workspaceFolder": "/Users/melted/Documents/GitHub/AppFactory",
  "timestamp": "2026-01-22T12:00:00Z"
}
```

### Command: List External Repos (Informational)

**Purpose**: Display the list of known external repositories that must remain separate from AppFactory.

**Execution**:
```bash
# Read from memory.json
cat .claude/memory.json | jq '.external_repos'
```

**Example Output**:
```json
[
  {
    "name": "factoryapp",
    "expected_path": "~/Documents/GitHub/factoryapp",
    "notes": "factoryapp.dev website/product repo; must remain separate"
  }
]
```

**Use Case**: When user requests cross-repo operations, display this list and enforce boundary rules.

---

## VERSION HISTORY

| Version | Date       | Changes                  |
| ------- | ---------- | ------------------------ |
| 1.0.0   | 2026-01-22 | Initial command policies |

---

**All commands subject to guardrails in `guardrails.md` and mode constraints in `control.md`.**
