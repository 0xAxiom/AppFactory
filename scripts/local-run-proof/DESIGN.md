# Local Run Proof System - Design Document

**Version**: 1.0.0
**Status**: Draft for Ralph Review

---

## Executive Summary

The Local Run Proof system is a repo-wide, non-bypassable verification gate that prevents any pipeline from outputting "To Run Locally" instructions or declaring success unless a clean install + build + boot check has passed.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    LOCAL RUN PROOF SYSTEM                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐            │
│  │   PRECHECK   │ → │    CLEAN     │ → │   INSTALL    │            │
│  │ (url safety, │   │ (node_modules│   │ (no bypass   │            │
│  │  args valid) │   │  lockfiles)  │   │   flags)     │            │
│  └──────────────┘   └──────────────┘   └──────────────┘            │
│          ↓                                    ↓                     │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐            │
│  │    BUILD     │ ← │   BOOT DEV   │ ← │ HEALTHCHECK  │            │
│  │  (optional)  │   │   SERVER     │   │  (HTTP 200)  │            │
│  └──────────────┘   └──────────────┘   └──────────────┘            │
│          ↓                                    ↓                     │
│  ┌──────────────┐   ┌──────────────────────────────────┐           │
│  │ OPEN BROWSER │   │      WRITE ARTIFACT              │           │
│  │(non-CI only) │   │ RUN_CERTIFICATE.json (PASS)      │           │
│  └──────────────┘   │ RUN_FAILURE.json    (FAIL)       │           │
│                     └──────────────────────────────────┘           │
│                                    ↓                                │
│  ┌──────────────────────────────────────────────────────┐          │
│  │                    SHUTDOWN                           │          │
│  │  (always clean up dev server, even on failure)        │          │
│  └──────────────────────────────────────────────────────┘          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## File Structure

```
scripts/local-run-proof/
├── verify.mjs              # Main harness (CLI entrypoint)
├── lib.mjs                 # Helpers (spawn, cleanup, hash, log redaction)
├── schema.json             # JSON Schema for artifacts
├── README.md               # Documentation
├── DESIGN.md               # This document
├── fixtures/
│   ├── fixture-pass/       # Minimal passing project
│   │   ├── package.json
│   │   └── server.mjs
│   └── fixture-fail/       # Minimal failing project
│       └── package.json
└── __tests__/
    └── verify.test.mjs     # Tests using node:test
```

## CLI Interface

```bash
node scripts/local-run-proof/verify.mjs \
  --cwd <path>                    # Required: target project directory
  --install "<command>"           # Required: install command (e.g., "npm install")
  --build "<command>"             # Optional: build command (e.g., "npm run build")
  --dev "<command>"               # Required if boot check: dev server command
  --url "<url>"                   # Required if boot check: health check URL
  --port <port|auto>              # Optional: port (default: auto)
  --timeout_ms <int>              # Optional: timeout (default: 90000)
  --open_browser <true|false>     # Optional: auto-open browser (default: true if not CI)
  --health_path </path>           # Optional: health check path (default: "/")
  --lockfile_policy <keep|clean>  # Optional: lockfile handling (default: clean)
  --artifacts_dir <name>          # Optional: artifact output dir (default: ".")
  --log_lines <int>               # Optional: log lines to capture (default: 200)
```

## Safety Rules

### URL Safety

- ONLY allow `http://localhost:*` or `http://127.0.0.1:*`
- REJECT any external URL, `file://`, `https://` (except localhost)
- Support `{port}` placeholder for auto-port expansion

### Install Safety

- DETECT and FAIL if command string contains:
  - `--legacy-peer-deps`
  - `--force` (npm)
  - `--ignore-engines`
  - `--ignore-scripts` (security risk if expected scripts need to run)
- Immediate failure with clear error message

### Process Safety

- Always kill child processes on exit (success or failure)
- Use process groups on Unix (SIGTERM to -pid)
- On Windows, use `taskkill /T /F /PID`
- Handle SIGINT, SIGTERM, uncaughtException, unhandledRejection

### Browser Open Safety

- Only open on localhost URLs
- Only open once per invocation
- Skip if `CI=true` or `HEADLESS=true` or `--open_browser=false`
- Log but don't fail on open errors

## Artifact Schemas

### RUN_CERTIFICATE.json (PASS)

```json
{
  "status": "PASS",
  "version": "1.0.0",
  "timestamps": {
    "start": "2026-01-20T12:00:00.000Z",
    "end": "2026-01-20T12:01:30.000Z",
    "duration_ms": 90000
  },
  "environment": {
    "os": "darwin",
    "platform": "darwin",
    "arch": "arm64",
    "node_version": "v22.0.0",
    "package_manager": "npm"
  },
  "commands": {
    "install": { "command": "npm install", "exit_code": 0, "duration_ms": 15000 },
    "build": { "command": "npm run build", "exit_code": 0, "duration_ms": 30000 },
    "dev": { "command": "npm run dev", "exit_code": null, "duration_ms": null }
  },
  "healthcheck": {
    "url": "http://localhost:3000/",
    "port": 3000,
    "status_code": 200,
    "response_time_ms": 150
  },
  "hashes": {
    "package_json_sha256": "abc123...",
    "lockfile_sha256": "def456...",
    "git_commit": "fc4ba28..."
  },
  "logs": {
    "install": ["[last 200 lines, redacted]"],
    "build": ["[last 200 lines, redacted]"],
    "dev": ["[last 200 lines, redacted]"]
  }
}
```

### RUN_FAILURE.json (FAIL)

```json
{
  "status": "FAIL",
  "version": "1.0.0",
  "step_failed": "install",
  "error_summary": "npm ERR! peer dependency conflict: @solana/web3.js@2.0.0 requires ...",
  "exit_code": 1,
  "remediation_hint": "Pin @solana/web3.js to ^1.95.0 for wallet-adapter compatibility",
  "timestamps": { ... },
  "environment": { ... },
  "commands": {
    "install": { "command": "npm install", "exit_code": 1, "duration_ms": 5000 }
  },
  "logs": {
    "install": ["[last 200 lines, redacted]"]
  }
}
```

## Secret Redaction Rules

Redact any line containing (case-insensitive):

- `API_KEY`, `ANTHROPIC_API_KEY`, `SECRET`, `TOKEN`
- `PRIVATE_KEY`, `PASSWORD`, `MNEMONIC`, `SEED`
- High-entropy strings (32+ chars of [a-zA-Z0-9+/=])

Replace with: `[REDACTED]`

## Package Manager Detection

Detect from project:

1. If `bun.lockb` exists → bun
2. If `pnpm-lock.yaml` exists → pnpm
3. If `yarn.lock` exists → yarn
4. If `package-lock.json` exists → npm
5. Default → npm

## Lockfile Policy

- `clean` (default): Remove all lockfiles before install for deterministic proof
- `keep`: Preserve existing lockfiles (faster but less strict)

When `clean`:

- Remove: `node_modules/`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `bun.lockb`
- Also remove: `.next/`, `dist/`, `build/`, `.turbo/`

## Health Check Flow

1. Start dev server as child process
2. Poll URL every 1000ms
3. Accept HTTP 200 as healthy
4. Timeout after `timeout_ms` (default 90000)
5. On success: capture port, response time
6. On failure: capture error, last N lines of output

## Browser Auto-Open

When NOT to open:

- `CI=true` environment variable
- `HEADLESS=true` environment variable
- `--open_browser=false` CLI flag

How to open:

- macOS: `open <url>`
- Linux: `xdg-open <url>`
- Windows: `cmd /c start "" "<url>"`

Timing: After healthcheck confirms HTTP 200

## Process Cleanup

On any exit (success, failure, signal):

1. Send SIGTERM to dev server process group
2. Wait 2000ms for graceful shutdown
3. If still running, send SIGKILL
4. On Windows: `taskkill /T /F /PID <pid>`

## Test Plan

### Unit Tests (verify.test.mjs)

1. **URL Safety Tests**
   - PASS: `http://localhost:3000`
   - PASS: `http://127.0.0.1:8080`
   - FAIL: `https://example.com`
   - FAIL: `file:///etc/passwd`

2. **Install Flag Detection Tests**
   - FAIL: `npm install --legacy-peer-deps`
   - FAIL: `npm install --force`
   - FAIL: `npm install --ignore-engines`
   - PASS: `npm install`

3. **Fixture Tests**
   - fixture-pass: Writes RUN_CERTIFICATE.json
   - fixture-fail: Writes RUN_FAILURE.json

4. **Redaction Tests**
   - Redacts API_KEY patterns
   - Redacts high-entropy strings

## Integration with Pipelines

### Enforcement Points

Each pipeline CLAUDE.md must include:

```markdown
## LOCAL RUN PROOF GATE (MANDATORY)

Before outputting "To Run Locally" instructions or declaring success:

1. Run `node scripts/local-run-proof/verify.mjs` against the build
2. If RUN_CERTIFICATE.json exists with status=PASS: proceed
3. If RUN_FAILURE.json exists: output failure summary, NOT run instructions
4. Claude MUST NOT output run instructions without PASS certificate
```

### Non-Bypassability

The constraint is enforced at the constitution level:

- CLAUDE.md says run instructions require PASS
- No code path can skip the check
- Prompt variations cannot override constitution

## Risk Analysis

| Risk                   | Mitigation                                        |
| ---------------------- | ------------------------------------------------- |
| Process not killed     | Multiple cleanup hooks, Windows-specific handling |
| External URL opened    | Strict localhost validation                       |
| Secrets in logs        | Aggressive redaction patterns                     |
| CI environment blocked | CI/HEADLESS detection                             |
| Flaky health check     | Configurable timeout, multiple retries            |
| Port conflicts         | Auto-port detection via {port} placeholder        |

---

**Design Status**: Ready for Ralph Review (Sweep 1)
