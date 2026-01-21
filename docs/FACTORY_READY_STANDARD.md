# Factory Ready Standard v1.0

**The single source of truth for launch-ready projects.**

Every project built by an App Factory pipeline must pass this standard before deployment. The Factory Launchpad is not yet publicly live.

---

## Quick Reference

| Gate                  | What It Proves                  | Required         |
| --------------------- | ------------------------------- | ---------------- |
| **Build**             | Code compiles without errors    | Yes              |
| **Run**               | App/agent starts and responds   | Yes              |
| **Test**              | Smoke tests pass                | Yes              |
| **Validate**          | Contract requirements met       | Yes              |
| **Package**           | Ready for deployment            | Yes              |
| **Launch Ready**      | All gates passed, docs complete | Yes              |
| **Token Integration** | Contract address configured     | Only if opted-in |

---

## Gate 1: Build

**Purpose:** Verify the project compiles and all dependencies resolve.

### Requirements

```bash
# Install dependencies
npm install

# Build (if applicable)
npm run build
```

### Pass Criteria

- [ ] `npm install` exits with code 0
- [ ] `npm run build` exits with code 0 (if build script exists)
- [ ] No TypeScript errors (if TypeScript project)
- [ ] No missing peer dependencies

### Fail Examples

- Unresolved imports
- TypeScript type errors
- Missing required dependencies
- Build script crashes

---

## Gate 2: Run

**Purpose:** Verify the project actually runs.

### Requirements

| Pipeline                  | Run Command                  | Expected Behavior                         |
| ------------------------- | ---------------------------- | ----------------------------------------- |
| **the-factory** (Mobile)  | `npx expo start`             | Expo dev server starts, QR code displayed |
| **web3-factory** (Web)    | `npm run dev`                | Next.js server starts on localhost:3000   |
| **agent-factory** (Agent) | `npm run dev` or `npm start` | HTTP server starts, responds to requests  |

### Pass Criteria

- [ ] Server/process starts without crashing
- [ ] Listens on expected port (3000 for web, 8080 for agents)
- [ ] Responds to basic request (health check or root route)

### Fail Examples

- Server crashes on startup
- Port already in use (not a code problem, but must be documented)
- Missing environment variables cause crash
- Infinite loop or hang

---

## Gate 3: Test

**Purpose:** Verify basic functionality works.

### Requirements

Each generated project must include smoke tests that verify:

| Pipeline          | Smoke Test                   | What It Checks                            |
| ----------------- | ---------------------------- | ----------------------------------------- |
| **the-factory**   | Manual boot test             | App loads without crash                   |
| **web3-factory**  | `curl localhost:3000`        | Returns 200, HTML contains expected title |
| **agent-factory** | `curl localhost:8080/health` | Returns 200, JSON with status: ok         |

### Pass Criteria

- [ ] At least one smoke test documented in TESTING.md
- [ ] Smoke test passes when run against fresh build
- [ ] Expected output documented (so user knows what "pass" looks like)

### Fail Examples

- No tests documented
- Tests documented but fail
- Tests require external services not available locally

---

## Gate 4: Validate

**Purpose:** Verify project meets pipeline contract requirements.

### Requirements

Each pipeline has a validation script:

| Pipeline          | Validator                     | Contract                |
| ----------------- | ----------------------------- | ----------------------- |
| **the-factory**   | `scripts/build_proof_gate.sh` | Expo build requirements |
| **web3-factory**  | `npm run validate`            | Factory Ready Standard  |
| **agent-factory** | `npm run validate`            | Factory Ready Standard  |

### Pass Criteria

- [ ] Required files present (see pipeline-specific contract)
- [ ] Forbidden files absent (no .env, no node_modules, no secrets)
- [ ] No hardcoded secrets or private keys
- [ ] File size limits respected
- [ ] Package.json has correct name and version

### Fail Examples

- Missing required file (e.g., no tsconfig.json)
- Forbidden file present (e.g., .env.local committed)
- Hardcoded API key in source
- Project exceeds size limit

---

## Gate 5: Package

**Purpose:** Prepare for deployment via GitHub import.

### Requirements

| Pipeline          | Package Method          | Output                          |
| ----------------- | ----------------------- | ------------------------------- |
| **the-factory**   | EAS Build or local Expo | APK/IPA for app stores          |
| **web3-factory**  | Push to GitHub          | Repository ready for deployment |
| **agent-factory** | Push to GitHub          | Repository ready for deployment |

### Pass Criteria

- [ ] Code pushed to GitHub repository
- [ ] Repository is accessible (public or with appropriate access configured)
- [ ] All required files included in commit
- [ ] No forbidden files committed (.env, node_modules, secrets)
- [ ] factory_ready.json present (generated by validator)

### Fail Examples

- Repository not pushed to GitHub
- Private repo without appropriate access configured
- Committed secrets in repository history
- Missing required files

---

## Gate 6: Launch Ready

**Purpose:** Final human checklist before deployment.

### Requirements

Every generated project must include:

| File                  | Purpose                      | Required |
| --------------------- | ---------------------------- | -------- |
| `README.md`           | Project overview             | Yes      |
| `RUNBOOK.md`          | Exact steps to run locally   | Yes      |
| `TESTING.md`          | How to verify it works       | Yes      |
| `LAUNCH_CHECKLIST.md` | Pre/post-launch checks       | Yes      |
| `FACTORY_IMPORT.md`   | Deployment preparation guide | Yes      |

### Pass Criteria

- [ ] All 5 docs present and non-empty
- [ ] RUNBOOK commands are copy-pasteable
- [ ] TESTING includes expected output
- [ ] LAUNCH_CHECKLIST has no unchecked blocking items
- [ ] FACTORY_IMPORT has preparation instructions

### Fail Examples

- Missing documentation file
- RUNBOOK commands reference files that don't exist
- TESTING doesn't say what "pass" looks like
- Documentation contains TODO placeholders

---

## Gate 7: Token Integration (Optional)

**Applies only if user opted into token integration during generation.**

If token integration is OFF, this gate is automatically PASS and no token-related code or docs should exist in the project.

### Requirements (When Opted In)

| Item               | Location                                    | Purpose                              |
| ------------------ | ------------------------------------------- | ------------------------------------ |
| Config variable    | `.env.example` or `src/config/constants.ts` | Where to paste contract address      |
| Integration module | `src/lib/token/` or `src/services/token.ts` | Clean interface for token operations |
| Documentation      | `TOKEN_INTEGRATION.md`                      | How to configure after launch        |
| Dry run mode       | Stubbed provider or mock                    | Test without real chain calls        |

### Pass Criteria (When Opted In)

- [ ] Config variable clearly documented
- [ ] Integration module compiles
- [ ] Dry run mode works without real contract
- [ ] TOKEN_INTEGRATION.md explains post-launch steps

### Fail Examples (When Opted In)

- Hardcoded contract address (must be configurable)
- Integration requires real chain connection to build
- No documentation for where to paste address
- Token logic crashes if address not configured

### Auto-Pass Criteria (When Opted Out)

- [ ] No token-related imports or dependencies
- [ ] No TOKEN_INTEGRATION.md file
- [ ] No token config variables
- [ ] Validator does not require token configuration

---

## Machine-Readable Output

Every pipeline validator must produce a `factory_ready.json` file:

```json
{
  "version": "1.0",
  "timestamp": "2026-01-13T12:00:00Z",
  "project": {
    "name": "my-app",
    "pipeline": "web3-factory",
    "path": "/path/to/project"
  },
  "gates": {
    "build": { "status": "PASS", "details": "npm install and build succeeded" },
    "run": { "status": "PASS", "details": "dev server started on port 3000" },
    "test": { "status": "PASS", "details": "smoke test returned 200" },
    "validate": { "status": "PASS", "details": "all contract requirements met" },
    "package": { "status": "PASS", "details": "ready for GitHub import" },
    "launch_ready": { "status": "PASS", "details": "all docs present" },
    "token_integration": { "status": "SKIP", "details": "not opted in" }
  },
  "overall": "PASS",
  "next_steps": ["Push to GitHub", "Prepare project metadata", "Await Factory Launchpad availability"]
}
```

### Status Values

| Status | Meaning                                                         |
| ------ | --------------------------------------------------------------- |
| `PASS` | Gate requirements fully met                                     |
| `FAIL` | Gate requirements not met (see details)                         |
| `SKIP` | Gate not applicable (e.g., token integration when not opted in) |
| `WARN` | Gate passed with non-blocking warnings                          |

### Overall Status

- `PASS` - All required gates passed, project is launch-ready
- `FAIL` - One or more required gates failed, see details for remediation

---

## Remediation Guide

### Common Build Failures

| Error                        | Likely Cause                 | Fix                                                  |
| ---------------------------- | ---------------------------- | ---------------------------------------------------- |
| `npm ERR! peer dep`          | Mismatched peer dependencies | Run `npm install --legacy-peer-deps` or fix versions |
| `Cannot find module X`       | Missing dependency           | Add to package.json and reinstall                    |
| `TS2307: Cannot find module` | Missing types                | Install `@types/X` package                           |

### Common Run Failures

| Error                  | Likely Cause                 | Fix                                          |
| ---------------------- | ---------------------------- | -------------------------------------------- |
| `EADDRINUSE`           | Port already in use          | Kill process on port or use different port   |
| `Missing required env` | Environment variable not set | Copy .env.example to .env and fill in values |
| `Crash on startup`     | Syntax error or bad import   | Check console output, fix code               |

### Common Validate Failures

| Error                       | Likely Cause            | Fix                             |
| --------------------------- | ----------------------- | ------------------------------- |
| `Missing required file`     | File not created        | Check build output, create file |
| `Forbidden file present`    | Committed something bad | Remove file, add to .gitignore  |
| `Hardcoded secret detected` | API key in source       | Move to environment variable    |

---

## Pipeline-Specific Extensions

Each pipeline may add requirements on top of this standard:

### the-factory (Mobile)

- Expo SDK version compatibility
- Required assets (icon.png, splash.png)
- RevenueCat configuration
- Privacy policy present

### web3-factory (Web)

- Next.js configuration
- Tailwind CSS setup
- Wallet adapter configuration (if token-enabled)
- Solana dependencies (if token-enabled)

### agent-factory (Agent)

- agent.json manifest valid
- HTTP interface with /health and /process endpoints
- No shell permissions by default
- Environment variables documented

---

## Version History

| Version | Date       | Changes         |
| ------- | ---------- | --------------- |
| 1.0     | 2026-01-13 | Initial release |

---

**This standard is the source of truth.** All pipeline documentation references this file. If a project passes all gates, it is Factory Ready.
