# Artifacts Reference

This document describes the JSON artifacts produced by AppFactory operations.

---

## Overview

AppFactory writes JSON files to document operation results. These artifacts:

- Provide machine-readable status
- Enable automation and scripting
- Serve as audit records

---

## Artifact Locations

| Artifact             | Location                    | Producer            |
| -------------------- | --------------------------- | ------------------- |
| PREVIEW.json         | `.vscode/.preview/`         | Preview system      |
| FAILURE.json         | `.vscode/.preview/` or root | Various             |
| AUDIT.json           | Repository root             | Audit task          |
| BOUNDARY.json        | Repository root             | Boundary check task |
| SUCCESS.json         | Repository root             | Build completion    |
| RUN_CERTIFICATE.json | Build output directory      | Local run proof     |
| RUN_FAILURE.json     | Build output directory      | Local run proof     |

---

## PREVIEW.json

Written by `Factory: Preview (Auto)` when a dev server starts successfully.

### Schema

```json
{
  "status": "success",
  "url": "http://localhost:3000",
  "platform": "darwin",
  "pm": "npm",
  "projectType": "nextjs",
  "command": "npm run dev",
  "pid": 12345,
  "cwd": "/path/to/project",
  "timestamp": "2026-01-22T10:30:00.000Z"
}
```

### Fields

| Field         | Type   | Description                               |
| ------------- | ------ | ----------------------------------------- |
| `status`      | string | Always "success"                          |
| `url`         | string | The discovered dev server URL             |
| `platform`    | string | Operating system (darwin/linux/win32)     |
| `pm`          | string | Package manager (npm/pnpm/yarn/bun)       |
| `projectType` | string | Detected framework (nextjs/vite/expo/etc) |
| `command`     | string | Command that was executed                 |
| `pid`         | number | Process ID of the running server          |
| `cwd`         | string | Working directory                         |
| `timestamp`   | string | ISO 8601 timestamp                        |

### Usage

```javascript
// Read URL programmatically
const preview = JSON.parse(fs.readFileSync('.vscode/.preview/PREVIEW.json'));
console.log(`Server running at: ${preview.url}`);
```

---

## FAILURE.json

Written when an operation fails. Location varies by operation.

### Schema

```json
{
  "status": "failure",
  "reason": "No dev command found",
  "suggestion": "Add a \"dev\", \"start\", or \"serve\" script to package.json",
  "cwd": "/path/to/project",
  "output": "...",
  "timestamp": "2026-01-22T10:30:00.000Z"
}
```

### Fields

| Field        | Type   | Description                              |
| ------------ | ------ | ---------------------------------------- |
| `status`     | string | Always "failure"                         |
| `reason`     | string | Why the operation failed                 |
| `suggestion` | string | How to fix the issue                     |
| `cwd`        | string | Working directory where failure occurred |
| `output`     | string | (Optional) Captured output/logs          |
| `command`    | string | (Optional) Command that failed           |
| `timestamp`  | string | ISO 8601 timestamp                       |

### Common Failure Reasons

| Reason                        | Cause                | Solution                       |
| ----------------------------- | -------------------- | ------------------------------ |
| "No dev command found"        | Missing dev script   | Add dev script to package.json |
| "No package manager detected" | Missing package.json | Create package.json            |
| "Timeout waiting for URL"     | Server didn't start  | Check for errors in output     |
| "Process exited with code X"  | Server crashed       | Check logs for error           |

---

## AUDIT.json

Written by `Claude: Audit Workspace` task.

### Schema

```json
{
  "timestamp": "2026-01-22T10:30:00.000Z",
  "repository": {
    "name": "AppFactory",
    "path": "/path/to/AppFactory",
    "branch": "main",
    "remote": "git@github.com:MeltedMindz/AppFactory.git"
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
      "format_status": "PASS",
      "test_status": "SKIP"
    },
    "hygiene": {
      "uncommitted_changes": false,
      "untracked_files": 0,
      "node_modules_present": true,
      "lock_file_present": true
    }
  },
  "issues": []
}
```

### Issue Format

When issues are found:

```json
{
  "issues": [
    {
      "severity": "ERROR",
      "category": "code_quality",
      "message": "Lint check failed",
      "suggestion": "Run: npm run lint:fix (requires FIX MODE)"
    }
  ]
}
```

### Severity Levels

| Level   | Meaning             |
| ------- | ------------------- |
| ERROR   | Must be fixed       |
| WARNING | Should be addressed |
| INFO    | Informational       |

---

## BOUNDARY.json

Written by `Claude: Boundary Check` task.

### Schema

```json
{
  "status": "pass",
  "topLevel": "/path/to/AppFactory",
  "workspaceFolder": "/path/to/AppFactory",
  "expected": "/path/to/AppFactory",
  "timestamp": "2026-01-22T10:30:00.000Z"
}
```

### Fields

| Field             | Type   | Description               |
| ----------------- | ------ | ------------------------- |
| `status`          | string | "pass" or "fail"          |
| `topLevel`        | string | Git repository root       |
| `workspaceFolder` | string | Current working directory |
| `expected`        | string | Expected repository path  |
| `timestamp`       | string | ISO 8601 timestamp        |

### Failure Case

```json
{
  "status": "fail",
  "topLevel": "/path/to/other-repo",
  "expected": "/path/to/AppFactory",
  "timestamp": "..."
}
```

---

## RUN_CERTIFICATE.json

Written by local run proof verification when a build passes.

### Location

Inside the build output directory:

```
app-factory/builds/my-app/RUN_CERTIFICATE.json
```

### Schema

```json
{
  "status": "PASS",
  "timestamp": "2026-01-22T10:30:00.000Z",
  "install": {
    "command": "npm install",
    "exitCode": 0,
    "duration": 5000
  },
  "build": {
    "command": "npm run build",
    "exitCode": 0,
    "duration": 10000
  },
  "devServer": {
    "command": "npm run dev",
    "url": "http://localhost:3000",
    "responseCode": 200
  }
}
```

### Meaning

This certificate proves:

- Dependencies installed without errors
- Build command succeeded
- Dev server started and responded

---

## RUN_FAILURE.json

Written when local run proof verification fails.

### Schema

```json
{
  "status": "FAIL",
  "timestamp": "2026-01-22T10:30:00.000Z",
  "phase": "install",
  "reason": "npm install exited with code 1",
  "output": "npm ERR! ...",
  "suggestion": "Check for dependency conflicts"
}
```

### Phases

| Phase     | Meaning                        |
| --------- | ------------------------------ |
| install   | Dependency installation failed |
| build     | Build command failed           |
| devServer | Server didn't start or respond |

---

## SUCCESS.json

Written when a complete build or operation succeeds.

### Schema

```json
{
  "status": "success",
  "pipeline": "app-factory",
  "output": "builds/my-app/",
  "ralph": {
    "score": 97,
    "passes": 3
  },
  "timestamp": "2026-01-22T10:30:00.000Z"
}
```

---

## Reading Artifacts Programmatically

### Node.js

```javascript
import { readFileSync, existsSync } from 'node:fs';

function readArtifact(path) {
  if (!existsSync(path)) {
    return null;
  }
  return JSON.parse(readFileSync(path, 'utf-8'));
}

const preview = readArtifact('.vscode/.preview/PREVIEW.json');
if (preview?.status === 'success') {
  console.log(`Server: ${preview.url}`);
}
```

### Bash

```bash
# Check if preview is ready
if [ -f ".vscode/.preview/PREVIEW.json" ]; then
  URL=$(jq -r '.url' .vscode/.preview/PREVIEW.json)
  echo "Server at: $URL"
fi
```

---

## Cleaning Up Artifacts

Remove all artifacts:

```bash
rm -f SUCCESS.json FAILURE.json AUDIT.json BOUNDARY.json
rm -rf .vscode/.preview/
```

Or use the VS Code task:

- Run `Tasks: Run Task` → `Claude: Clean`

---

**Next**: [Commands Reference](../API.md) | [Back to Index](../index.md)
