# Local Run Proof System

**Version**: 1.0.0
**Status**: Production

---

## Overview

The Local Run Proof system is a **non-bypassable verification gate** that prevents any AppFactory pipeline from:

- Outputting "To Run Locally" instructions
- Declaring success

...unless a **clean install + build + boot check has PASSED**.

When verification passes, the harness automatically **opens the app in the user's default browser**.

## Quick Start

```bash
# Basic verification (install only)
node scripts/local-run-proof/verify.mjs \
  --cwd ./dapp-builds/my-app \
  --install "npm install"

# Full verification with boot check
node scripts/local-run-proof/verify.mjs \
  --cwd ./dapp-builds/my-app \
  --install "npm install" \
  --build "npm run build" \
  --dev "npm run dev" \
  --url "http://localhost:3000/"
```

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    VERIFICATION FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. PRECHECK                                                    │
│     - Validate CLI arguments                                    │
│     - Verify target directory exists                            │
│     - Check URL is localhost only                               │
│     - Detect forbidden install flags                            │
│                                                                 │
│  2. CLEAN (if lockfile_policy=clean)                           │
│     - Remove node_modules, lockfiles, build artifacts           │
│     - Ensures deterministic, clean-room verification            │
│                                                                 │
│  3. INSTALL                                                     │
│     - Run install command                                       │
│     - FAIL if uses --legacy-peer-deps, --force, etc.           │
│                                                                 │
│  4. BUILD (optional)                                            │
│     - Run build command                                         │
│     - FAIL on TypeScript errors, missing modules, etc.         │
│                                                                 │
│  5. BOOT + HEALTHCHECK                                          │
│     - Start dev server                                          │
│     - Poll URL until HTTP 200 or timeout                        │
│                                                                 │
│  6. OPEN BROWSER (if not CI/headless)                          │
│     - Auto-open in default browser                              │
│                                                                 │
│  7. SHUTDOWN                                                    │
│     - Always clean up dev server process                        │
│                                                                 │
│  8. WRITE ARTIFACT                                              │
│     - RUN_CERTIFICATE.json on PASS                              │
│     - RUN_FAILURE.json on FAIL                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## CLI Reference

```
REQUIRED OPTIONS:
  --cwd <path>              Target project directory
  --install "<command>"     Install command (e.g., "npm install")

OPTIONAL OPTIONS:
  --build "<command>"       Build command (e.g., "npm run build")
  --dev "<command>"         Dev server command (required for boot check)
  --url "<url>"             Health check URL (required for boot check)
  --port <port|auto>        Port number or "auto" (default: auto)
  --timeout_ms <int>        Health check timeout in ms (default: 90000)
  --open_browser <bool>     Auto-open browser on success (default: true)
  --health_path <path>      Health check path (default: "/")
  --lockfile_policy <str>   "clean" or "keep" (default: clean)
  --artifacts_dir <name>    Artifact output directory (default: ".")
  --log_lines <int>         Log lines to capture (default: 200)
  -h, --help                Show help
  -v, --version             Show version
```

## Safety Rules

### URL Safety

Only `localhost` or `127.0.0.1` URLs are allowed:

- `http://localhost:3000` ✓
- `http://127.0.0.1:8080` ✓
- `https://example.com` ✗ (rejected)
- `file:///etc/passwd` ✗ (rejected)

### Install Safety

The following flags are **FORBIDDEN** and will cause immediate failure:

- `--legacy-peer-deps` (bypasses peer dependency resolution)
- `--force` (ignores errors)
- `--ignore-engines` (ignores Node version requirements)

These flags "paper over" dependency problems rather than fixing them.

### Process Safety

- Dev server processes are **always** cleaned up
- Works on macOS, Linux, and Windows
- Handles SIGINT, SIGTERM, and crashes

### Browser Safety

- Only opens localhost URLs
- Opens exactly once per verification
- Skipped in CI environments (`CI=true`, `GITHUB_ACTIONS`, etc.)

## Artifacts

### RUN_CERTIFICATE.json (PASS)

Written when verification succeeds:

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
    "node_version": "v22.0.0",
    "package_manager": "npm"
  },
  "commands": {
    "install": { "command": "npm install", "exit_code": 0 },
    "build": { "command": "npm run build", "exit_code": 0 }
  },
  "healthcheck": {
    "url": "http://localhost:3000/",
    "status_code": 200
  },
  "hashes": {
    "package_json_sha256": "abc123...",
    "git_commit": "fc4ba28..."
  }
}
```

### RUN_FAILURE.json (FAIL)

Written when verification fails:

```json
{
  "status": "FAIL",
  "version": "1.0.0",
  "step_failed": "install",
  "error_summary": "Peer dependency conflict detected",
  "exit_code": 1,
  "remediation_hint": "Fix dependency versions, do NOT use --legacy-peer-deps",
  "logs": {
    "install": ["[redacted logs]"]
  }
}
```

## Pipeline Integration

### For Pipeline Authors

Pipelines MUST call this harness before outputting "To Run Locally" instructions:

```bash
# In your pipeline finalization
node scripts/local-run-proof/verify.mjs \
  --cwd "$BUILD_DIR" \
  --install "npm install" \
  --build "npm run build" \
  --dev "npm run dev" \
  --url "http://localhost:3000/"

# Check result
if [ -f "$BUILD_DIR/RUN_CERTIFICATE.json" ]; then
  echo "## To Run Locally"
  echo "cd $BUILD_DIR && npm install && npm run dev"
else
  echo "## Build Failed"
  echo "See RUN_FAILURE.json for details"
fi
```

### Non-Bypassability Contract

The only acceptable proof of "works locally" is `RUN_CERTIFICATE.json` with `status: "PASS"`.

Pipelines **MUST NOT**:

- Output run instructions without a PASS certificate
- Use bypass flags to make install "succeed"
- Skip the verification gate for any reason

## Testing

```bash
# Run all tests
node --test scripts/local-run-proof/__tests__/verify.test.mjs

# Or via npm (if configured)
npm run test:local-run-proof
```

## Troubleshooting

### "Peer dependency conflict detected"

The project has incompatible dependencies. Fix the versions in `package.json`:

```bash
# See what's conflicting
npm ls --all

# Common fix: pin specific versions
```

**DO NOT** use `--legacy-peer-deps`. Fix the actual conflict.

### "Health check failed: Timeout"

The dev server didn't respond in time. Check:

1. Is the server actually starting?
2. Is it listening on the right port?
3. Is something else using the port?

### "Forbidden install flag detected"

Remove the bypass flag and fix the underlying issue. The harness intentionally rejects these flags because they hide real problems.

## Files

```
scripts/local-run-proof/
├── verify.mjs              # Main harness (CLI entrypoint)
├── lib.mjs                 # Helpers (spawn, cleanup, hash, redaction)
├── schema.json             # JSON Schema for artifacts
├── README.md               # This documentation
├── DESIGN.md               # Architecture design document
├── fixtures/
│   ├── fixture-pass/       # Minimal passing project
│   └── fixture-fail/       # Minimal failing project
└── __tests__/
    └── verify.test.mjs     # Test suite
```

## Version History

| Version | Date       | Changes                |
| ------- | ---------- | ---------------------- |
| 1.0.0   | 2026-01-20 | Initial implementation |

---

**Local Run Proof v1.0.0**: If it doesn't have a certificate, it doesn't run.
