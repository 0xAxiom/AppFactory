# Stage M8: Proof Gate (MANDATORY)

## Purpose

Verify the build meets all technical requirements before declaring completion. This is a **mandatory gate** - the build cannot proceed without passing all checks.

## Input

- Hardened app from Stage M7
- `minikit.config.ts` with account association

## Gate Behavior

**This is a hard gate.** ALL checks must pass.

If any check fails:

1. Identify the failing check
2. Return to appropriate stage to fix
3. Re-run proof gate
4. Repeat until all pass

## Checks

### 1. npm install

Verifies dependencies install cleanly.

```bash
npm install
# Exit code must be 0
```

### 2. npm run build

Verifies production build succeeds.

```bash
npm run build
# Exit code must be 0
```

### 3. npm run lint (if configured)

Verifies no linting errors.

```bash
npm run lint
# Exit code must be 0 (or skip if not configured)
```

### 4. npm run typecheck (if configured)

Verifies TypeScript compiles.

```bash
npm run typecheck
# Or: npx tsc --noEmit
# Exit code must be 0
```

### 5. Manifest Valid

Verifies manifest route returns valid JSON.

```bash
# Start dev server
npm run dev &
sleep 5

# Fetch manifest
curl -s http://localhost:3000/.well-known/farcaster.json | jq .

# Must return valid JSON with required fields
```

### 6. Account Association Present

Verifies all three association fields are non-empty.

```typescript
const { header, payload, signature } = minikitConfig.accountAssociation;
assert(header.length > 0, 'header is empty');
assert(payload.length > 0, 'payload is empty');
assert(signature.length > 0, 'signature is empty');
```

### 7. Assets Exist

Verifies all referenced assets exist in public/.

```bash
# Check each asset file exists
test -f public/icon.png
test -f public/splash.png
test -f public/hero.png
test -f public/og.png
test -f public/screenshots/1.png
```

## Output

File: `artifacts/stage08/build_validation_summary.json`

```json
{
  "timestamp": "2026-01-18T10:00:00.000Z",
  "slug": "[slug]",
  "version": "1.0.0",
  "checks": {
    "npm_install": {
      "status": "pass",
      "duration_ms": 5000,
      "output": "added 150 packages"
    },
    "npm_build": {
      "status": "pass",
      "duration_ms": 15000,
      "output": "Build completed successfully"
    },
    "npm_lint": {
      "status": "pass",
      "duration_ms": 2000,
      "output": "No lint errors"
    },
    "npm_typecheck": {
      "status": "pass",
      "duration_ms": 3000,
      "output": "No type errors"
    },
    "manifest_valid": {
      "status": "pass",
      "manifest": {
        "name": "[app name]",
        "version": "1",
        "hasAccountAssociation": true
      }
    },
    "account_association": {
      "status": "pass",
      "fields": {
        "header": true,
        "payload": true,
        "signature": true
      }
    },
    "assets_exist": {
      "status": "pass",
      "assets_checked": 5,
      "assets": [
        { "path": "public/icon.png", "exists": true },
        { "path": "public/splash.png", "exists": true },
        { "path": "public/hero.png", "exists": true },
        { "path": "public/og.png", "exists": true },
        { "path": "public/screenshots/1.png", "exists": true }
      ]
    }
  },
  "overall": "PASS",
  "failedChecks": [],
  "notes": []
}
```

### Failure Example

```json
{
  "timestamp": "2026-01-18T10:00:00.000Z",
  "slug": "[slug]",
  "checks": {
    "npm_build": {
      "status": "fail",
      "duration_ms": 8000,
      "output": "Type error: Property 'foo' does not exist",
      "error": "Build failed with exit code 1"
    },
    "account_association": {
      "status": "fail",
      "fields": {
        "header": true,
        "payload": true,
        "signature": false
      },
      "error": "signature field is empty"
    }
  },
  "overall": "FAIL",
  "failedChecks": ["npm_build", "account_association"],
  "notes": ["Fix TypeScript error before proceeding", "Complete account association in Stage M5"]
}
```

## Script Implementation

See `scripts/miniapp_proof_gate.sh` for the full implementation.

## Failure Recovery

| Failed Check        | Recovery                                  |
| ------------------- | ----------------------------------------- |
| npm_install         | Check package.json, network, node version |
| npm_build           | Fix TypeScript/build errors in code       |
| npm_lint            | Fix linting errors (or configure eslint)  |
| npm_typecheck       | Fix type errors                           |
| manifest_valid      | Fix manifest route or config              |
| account_association | Return to Stage M5                        |
| assets_exist        | Generate missing assets                   |

## Validation

The proof gate is complete when:

- [ ] `overall` is "PASS"
- [ ] `failedChecks` is empty array
- [ ] `build_validation_summary.json` is written

## Notes

- This gate cannot be bypassed
- All checks must pass before proceeding
- The script should be idempotent (can run multiple times)
- Each run overwrites the previous summary

## Next Stage

After proof gate passes, proceed to Stage M9 (Publish Checklist).
