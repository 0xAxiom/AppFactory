# Artifacts Specification

**Repository**: AppFactory
**Version**: 1.0.0
**Last Updated**: 2026-01-22

---

## PURPOSE

This document defines the machine-readable artifact formats used for Claude operation outcomes. These artifacts enable deterministic CI/CD integration and programmatic workflow automation.

---

## ARTIFACT TYPES

| Artifact | Purpose | Location | Format |
|----------|---------|----------|--------|
| `SUCCESS.json` | Task completion confirmation | Repository root | JSON |
| `FAILURE.json` | Task failure details | Repository root | JSON |
| `AUDIT.json` | Workspace audit results | Repository root | JSON |
| `.claude/audit.log` | Operation history | `.claude/` | Text log |
| `.claude/mode-transitions.log` | Mode switch history | `.claude/` | Text log |

---

## SUCCESS.json

Created when a task completes successfully.

### Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["status", "timestamp", "task", "outcome"],
  "properties": {
    "status": {
      "type": "string",
      "enum": ["SUCCESS"]
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "task": {
      "type": "string",
      "description": "Description of completed task"
    },
    "mode": {
      "type": "string",
      "enum": ["SETUP", "FIX"]
    },
    "outcome": {
      "type": "object",
      "properties": {
        "files_created": {
          "type": "array",
          "items": { "type": "string" }
        },
        "files_modified": {
          "type": "array",
          "items": { "type": "string" }
        },
        "commands_executed": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "command": { "type": "string" },
              "exit_code": { "type": "integer" },
              "duration_ms": { "type": "integer" }
            }
          }
        },
        "verification": {
          "type": "object",
          "properties": {
            "lint": { "type": "boolean" },
            "type_check": { "type": "boolean" },
            "tests": { "type": "boolean" },
            "build": { "type": "boolean" }
          }
        }
      }
    },
    "next_steps": {
      "type": "array",
      "items": { "type": "string" }
    }
  }
}
```

### Example

```json
{
  "status": "SUCCESS",
  "timestamp": "2026-01-22T10:30:00Z",
  "task": "Setup Claude governance layer and VS Code integration",
  "mode": "SETUP",
  "outcome": {
    "files_created": [
      ".claude/control.md",
      ".claude/guardrails.md",
      ".claude/commands.md",
      ".claude/git-contract.md",
      ".claude/artifacts-spec.md",
      ".claude/memory.json",
      ".claude/hygiene-report.md",
      ".vscode/tasks.json",
      ".vscode/settings.json",
      ".vscode/extensions.json"
    ],
    "files_modified": [
      ".gitignore"
    ],
    "commands_executed": [
      {
        "command": "npm run lint",
        "exit_code": 0,
        "duration_ms": 2341
      },
      {
        "command": "npm run type-check",
        "exit_code": 0,
        "duration_ms": 4523
      }
    ],
    "verification": {
      "lint": true,
      "type_check": true,
      "tests": null,
      "build": null
    }
  },
  "next_steps": [
    "Review created files in .claude/ and .vscode/",
    "Run VS Code task 'Claude: Verify' to validate setup",
    "Commit changes: git add .claude .vscode .gitignore && git commit -m 'setup: add Claude governance layer'",
    "Push to remote if desired: git push"
  ]
}
```

---

## FAILURE.json

Created when a task fails or encounters errors.

### Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["status", "timestamp", "task", "error"],
  "properties": {
    "status": {
      "type": "string",
      "enum": ["FAILURE"]
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "task": {
      "type": "string",
      "description": "Description of failed task"
    },
    "mode": {
      "type": "string",
      "enum": ["SETUP", "FIX"]
    },
    "error": {
      "type": "object",
      "required": ["type", "message"],
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "MODE_VIOLATION",
            "GUARDRAIL_VIOLATION",
            "COMMAND_FAILED",
            "FILE_OPERATION_FAILED",
            "VERIFICATION_FAILED",
            "NETWORK_ERROR",
            "PERMISSION_DENIED",
            "CONFLICT",
            "USER_REJECTED"
          ]
        },
        "message": {
          "type": "string"
        },
        "details": {
          "type": "object"
        }
      }
    },
    "recovery_suggestions": {
      "type": "array",
      "items": { "type": "string" }
    }
  }
}
```

### Example: Mode Violation

```json
{
  "status": "FAILURE",
  "timestamp": "2026-01-22T10:45:00Z",
  "task": "Fix TypeScript errors in CLI/src/generator.ts",
  "mode": "SETUP",
  "error": {
    "type": "MODE_VIOLATION",
    "message": "Source file modification attempted in SETUP mode",
    "details": {
      "requested_operation": "Edit CLI/src/generator.ts",
      "current_mode": "SETUP",
      "required_mode": "FIX",
      "violated_constraint": "Confined File Writes (Guardrail #3)"
    }
  },
  "recovery_suggestions": [
    "Say 'ENTER FIX MODE' to allow source modifications",
    "Review the change plan and approve",
    "Claude will execute with full audit logging"
  ]
}
```

### Example: Command Failed

```json
{
  "status": "FAILURE",
  "timestamp": "2026-01-22T11:00:00Z",
  "task": "Verify codebase",
  "mode": "SETUP",
  "error": {
    "type": "COMMAND_FAILED",
    "message": "npm run lint exited with code 1",
    "details": {
      "command": "npm run lint",
      "exit_code": 1,
      "stderr": "error  'foo' is assigned a value but never used  @typescript-eslint/no-unused-vars\n  at CLI/src/generator.ts:42:7",
      "affected_files": ["CLI/src/generator.ts"],
      "error_count": 3
    }
  },
  "recovery_suggestions": [
    "Enter FIX MODE to allow auto-fixing: 'ENTER FIX MODE'",
    "Manually fix the unused variable in CLI/src/generator.ts:42",
    "Run 'npm run lint:fix' after entering FIX MODE"
  ]
}
```

### Example: User Rejected

```json
{
  "status": "FAILURE",
  "timestamp": "2026-01-22T11:15:00Z",
  "task": "Push changes to remote",
  "mode": "FIX",
  "error": {
    "type": "USER_REJECTED",
    "message": "User rejected the proposed operation",
    "details": {
      "proposed_operation": "git push origin main",
      "user_response": "reject",
      "reason": "User wants to review changes locally first"
    }
  },
  "recovery_suggestions": [
    "Review changes with 'git diff origin/main..HEAD'",
    "Request push again when ready",
    "Or push manually with 'git push'"
  ]
}
```

---

## AUDIT.json

Created by the "Claude: Audit Workspace" VS Code task.

### Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["timestamp", "repository", "audit"],
  "properties": {
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "repository": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "path": { "type": "string" },
        "branch": { "type": "string" },
        "remote": { "type": "string" }
      }
    },
    "audit": {
      "type": "object",
      "properties": {
        "governance": {
          "type": "object",
          "properties": {
            "control_md_present": { "type": "boolean" },
            "guardrails_md_present": { "type": "boolean" },
            "commands_md_present": { "type": "boolean" },
            "git_contract_md_present": { "type": "boolean" },
            "current_mode": { "type": "string" }
          }
        },
        "workspace": {
          "type": "object",
          "properties": {
            "tasks_configured": { "type": "boolean" },
            "settings_configured": { "type": "boolean" },
            "extensions_recommended": { "type": "boolean" }
          }
        },
        "code_quality": {
          "type": "object",
          "properties": {
            "lint_status": { "type": "string", "enum": ["PASS", "FAIL", "SKIP"] },
            "type_check_status": { "type": "string", "enum": ["PASS", "FAIL", "SKIP"] },
            "test_status": { "type": "string", "enum": ["PASS", "FAIL", "SKIP"] },
            "format_status": { "type": "string", "enum": ["PASS", "FAIL", "SKIP"] }
          }
        },
        "hygiene": {
          "type": "object",
          "properties": {
            "uncommitted_changes": { "type": "boolean" },
            "untracked_files": { "type": "integer" },
            "node_modules_present": { "type": "boolean" },
            "lock_file_present": { "type": "boolean" }
          }
        }
      }
    },
    "issues": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "severity": { "type": "string", "enum": ["ERROR", "WARNING", "INFO"] },
          "category": { "type": "string" },
          "message": { "type": "string" },
          "suggestion": { "type": "string" }
        }
      }
    }
  }
}
```

### Example

```json
{
  "timestamp": "2026-01-22T12:00:00Z",
  "repository": {
    "name": "AppFactory",
    "path": "/Users/melted/Documents/GitHub/AppFactory",
    "branch": "main",
    "remote": "origin"
  },
  "audit": {
    "governance": {
      "control_md_present": true,
      "guardrails_md_present": true,
      "commands_md_present": true,
      "git_contract_md_present": true,
      "current_mode": "SETUP"
    },
    "workspace": {
      "tasks_configured": true,
      "settings_configured": true,
      "extensions_recommended": true
    },
    "code_quality": {
      "lint_status": "PASS",
      "type_check_status": "PASS",
      "test_status": "SKIP",
      "format_status": "PASS"
    },
    "hygiene": {
      "uncommitted_changes": true,
      "untracked_files": 0,
      "node_modules_present": true,
      "lock_file_present": true
    }
  },
  "issues": [
    {
      "severity": "INFO",
      "category": "git",
      "message": "Uncommitted changes in .claude/ and .vscode/",
      "suggestion": "Commit setup changes: git add .claude .vscode && git commit -m 'setup: add Claude governance'"
    }
  ]
}
```

---

## AUDIT LOG FORMAT

`.claude/audit.log` is an append-only text log.

### Format

```
[TIMESTAMP] OPERATION details
```

### Example Entries

```
[2026-01-22T10:30:00Z] WRITE .claude/control.md (3456 bytes)
[2026-01-22T10:30:01Z] WRITE .claude/guardrails.md (5678 bytes)
[2026-01-22T10:30:15Z] EXEC npm run lint (exit 0, 2341ms)
[2026-01-22T10:30:20Z] EXEC npm run type-check (exit 0, 4523ms)
[2026-01-22T10:35:00Z] MODE_TRANSITION SETUP->FIX (user approved)
[2026-01-22T10:35:15Z] READ CLI/src/generator.ts (245 lines)
[2026-01-22T10:35:30Z] EDIT CLI/src/generator.ts (removed unused variable 'foo')
[2026-01-22T10:35:31Z] WRITE CLI/src/generator.ts (243 lines)
[2026-01-22T10:35:45Z] EXEC npm run lint (exit 0, 2156ms)
[2026-01-22T10:36:00Z] GIT_STAGE CLI/src/generator.ts
[2026-01-22T10:36:05Z] GIT_COMMIT "fix(cli): remove unused variable" (abc1234)
```

---

## MODE TRANSITIONS LOG FORMAT

`.claude/mode-transitions.log` tracks mode switches.

### Format

```
[TIMESTAMP] MODE_SWITCH: OLD_MODE -> NEW_MODE (trigger)
```

### Example Entries

```
[2026-01-22T10:30:00Z] MODE_INIT: SETUP (initial state)
[2026-01-22T10:35:00Z] MODE_SWITCH: SETUP -> FIX (user request)
[2026-01-22T11:00:00Z] MODE_SWITCH: FIX -> SETUP (user request)
[2026-01-22T11:30:00Z] MODE_SWITCH: SETUP -> FIX (user request)
[2026-01-22T12:00:00Z] SESSION_END: FIX (session terminated)
```

---

## ARTIFACT LIFECYCLE

### Creation

Artifacts are created at task completion or failure:

1. Task completes → Create `SUCCESS.json` or `FAILURE.json`
2. Audit task runs → Create `AUDIT.json`
3. Any operation → Append to `.claude/audit.log`
4. Mode transition → Append to `.claude/mode-transitions.log`

### Retention

- `SUCCESS.json` / `FAILURE.json`: Overwritten each task
- `AUDIT.json`: Overwritten each audit
- `.claude/audit.log`: Append-only, persists across sessions
- `.claude/mode-transitions.log`: Append-only, persists across sessions

### Cleanup

Artifacts can be cleaned with "Claude: Clean" task:

- Removes `SUCCESS.json`, `FAILURE.json`, `AUDIT.json`
- Preserves `.claude/audit.log` and `.claude/mode-transitions.log`
- Requires user approval

---

## GITIGNORE INTEGRATION

Add to `.gitignore`:

```gitignore
# Claude Agent Artifacts
SUCCESS.json
FAILURE.json
AUDIT.json
.claude/audit.log
.claude/mode-transitions.log
```

Logs are local-only, not committed to repository.

---

## PROGRAMMATIC USAGE

CI/CD pipelines can parse artifacts:

```bash
# Check if task succeeded
if [ -f SUCCESS.json ]; then
  echo "Task completed successfully"
  jq -r '.next_steps[]' SUCCESS.json
else
  echo "Task failed"
  jq -r '.error.message' FAILURE.json
  exit 1
fi
```

```javascript
// Node.js example
const fs = require('fs');

if (fs.existsSync('SUCCESS.json')) {
  const result = JSON.parse(fs.readFileSync('SUCCESS.json', 'utf8'));
  console.log(`Task: ${result.task}`);
  console.log(`Files created: ${result.outcome.files_created.length}`);
} else if (fs.existsSync('FAILURE.json')) {
  const failure = JSON.parse(fs.readFileSync('FAILURE.json', 'utf8'));
  console.error(`Error: ${failure.error.message}`);
  process.exit(1);
}
```

---

## VERSION HISTORY

| Version | Date       | Changes                    |
| ------- | ---------- | -------------------------- |
| 1.0.0   | 2026-01-22 | Initial artifacts spec     |

---

**Artifacts enable deterministic, machine-readable workflow automation.**
