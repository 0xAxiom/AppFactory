# AppFactory Comprehensive Audit

**Date:** March 9, 2026 | **Reviews:** 18 (Scout ×6, Cipher ×6, Forge ×6) | **Version:** 12.0.1

## Executive Summary

Architecturally mature monorepo with 7 pipelines, 252 passing tests (root), solid tooling, and professional documentation. No rewrites needed — a cleanup sprint gets this to very shippable. One real security vulnerability (shell injection), several runtime crash bugs, and typical housekeeping gaps.

---

## 🔴 Fix Immediately

### 1. Shell Injection — `CLI/src/core/stages.ts:475` — SECURITY

```ts
const command = `bash "${scriptPath}" ${args.map((a) => `"${a}"`).join(' ')}`;
```

Args double-quoted but not escaped. `"$(malicious)"` or backticks break out.
**Fix:** Use `execFile` instead of string interpolation with `execAsync`.

### 2. `timingSafeEqual` Infinite Recursion — `hashing.ts`

Imports `timingSafeEqual` from `crypto`, then defines export with same name that calls itself → stack overflow.
**Fix:** Rename export or alias import (`import { timingSafeEqual as cryptoTimingSafeEqual }`).

### 3. `writeFileSync` Missing Import — `render-demo-video.mjs:368`

Called but never imported → runtime crash.

### 4. `await` in Constructor — `web3_pipeline.ts:30`

Constructors can't be async. `Web3Pipeline` class cannot be instantiated.
**Fix:** Static factory method or top-level import.

### 5. `require('sharp')` in ESM — `file_upload.ts:257`

Project is `"type": "module"`. Bare `require()` → `ReferenceError`.
**Fix:** `await import('sharp')`.

### 6. `npm audit fix`

- rollup: Arbitrary File Write via Path Traversal (HIGH) — in CLI workspace
- minimatch: ReDoS (MODERATE, 3 instances)
- ajv: ReDoS with `$data` option (MODERATE)

### 7. CI Structure Validation Broken

`validate-structure` workflow checks for `SECURITY.md`, `CHANGELOG.md`, `CONTRIBUTING.md` at root — they live in `docs/`.
**Fix:** Symlink to root or update workflow paths.

### 8. Unused Imports — `claw-pipeline/scripts/run.mjs`

`readdirSync` and `relative` imported but never used.

### 9. dapp-factory Tests Broken (17 failures)

Vitest leaks into `base-wallet-pulse/node_modules/`, picking up test files from dependencies.
**Fix:** Add `**/node_modules` to vitest exclude pattern.

### 10. Unguarded `JSON.parse`

`core/src/utils/fs.ts:102` and `repo-attestation.ts:185` — no try/catch, malformed files crash.

---

## 🟡 Fix This Week

### Dependencies

- **`@anthropic-ai/sdk`** v0.32 → v0.78 (46 versions behind, core dependency)
- **`@types/inquirer`** — deprecated, inquirer 12+ ships own types
- **`standard-version`** — deprecated, migrate to `release-please` or `changesets`

### Infrastructure

- Add GitHub Actions CI with lint + test + type-check
- Add `core/` to workspaces (branch `fix/add-core-to-workspaces` exists)
- Add `agent-factory` and `claw-pipeline` to workspaces
- Add `type-check:core` script
- Build `core/dist/` and `CLI/dist/` — TS not compiled
- Add `bin` field to CLI `package.json`
- Add root `build` script (`core → CLI → dapp-factory` in order)
- Expand ESLint coverage — currently ignores everything except `CLI/src/`

### Security

- SIWE nonce uses `Math.random()` — use `crypto.randomBytes()` (in docs/vendor demo)
- HTTP timeouts on `launchpad-client.ts` fetch calls — add `AbortController`
- API key existence checks — `base-wallet-xray` silently fails without key
- Wallet validation — regex-only, should use `PublicKey` constructor
- Webhook secret warning — `stageLaunch()` silently sends unsigned when no secret configured

### Cleanup

- Gitignore `.next/`, `generated/`, `builds/` build artifacts
- Fix repo URL — standardize `0xAxiom` vs `MeltedMindz`
- Create missing `plugins/factory/INVARIANTS.md`
- Prune ~151 stale branches

---

## 🟠 Next Sprint

### Security Hardening

- Sanitize error messages in API responses (wallet-xray leaks raw `e.message`)
- Fix attestation timestamps — use git commit timestamp, not `new Date()` fallback
- Centralize API key injection in `bagsApiFetch` wrapper
- Verify `confirmAttestation` API response (tokenMint) against on-chain state
- Add domain separation prefix to attestation messages (prevent cross-context replay)
- Fix `verifyIntentHash` to use `crypto.timingSafeEqual` directly (currently uses `===`)
- Add attestation expiry validation client-side (`expiresAt` exists but unchecked)
- Migrate private key management from `.env` to keychain/secrets manager
- Add transaction simulation before signing (Solana launch flow)
- Rate limiting on API routes (`/api/inspect`, `/api/analyze`, `/api/gas`)
- Request body size limits on API routes
- CSP headers for generated dApps
- Add rate limiting/backoff to `resolveAllFeeClaimers`

### Code Quality

- Refactor god files: `pipeline.ts` (827 lines), `interactive.ts` (757 lines), `validator/index.ts` (1,033 lines)
- Refactor complex commands: `doctor.ts` (complexity 37), `list.ts` (complexity 41)
- Replace 41 `process.exit()` calls with thrown errors + top-level handler
- Replace `||` with `??` (15+ null safety issues, 53 ESLint warnings)
- Replace 798 raw `console.*` calls with logger module
- Pick ajv or zod, drop the other
- Standardize TypeScript version across packages
- Fix lock file TOCTOU race in `locks.ts` (use `{ flag: 'wx' }`)
- Fix `schemaValidated` always-true in `stages.ts`
- Deduplicate validation logic between `dapp-factory/validator/` and `core/ralph/checks.ts`
- Extract hardcoded partner key to single constant
- Consolidate 4 separate logger implementations into shared interface
- Clean up 13 tracked `package-lock.json` files (only workspace packages need them)
- Remove ~25 `any` types from templates/utils (propagate into generated apps)
- Set real coverage thresholds (currently 0% in dapp-factory, 10% in CLI)

### Testing

- Add tests for `core/` (RALPH engine, config, validation — zero coverage)
- Add tests for `pipeline.ts` (827 lines, zero tests)
- Add tests for `interactive.ts` (757 lines, zero tests)
- Add tests for command modules (dream, build, resume, run, list, doctor)
- Add tests for `plugins/repo-mode-launch/` (contains the recursion bug)
- Add smoke/e2e tests to CI
- Raise coverage thresholds

### Distribution

- Publish CLI to npm
- Archive internal working docs from `docs/`
- Clean up `tx-decoder-enhancement/`, `.factory-tools/`, `shared/tour-guide/`
- Document release process for skill registry
- Add more starter templates per pipeline
- Standardize output directory naming across pipelines

---

## 🟠 README vs Reality (New from Review 21)

The README makes several claims that don't match the current state:

- **Templates are empty shells** — all 11 contain only `TEMPLATE.md`, no starter code
- **Missing referenced files:** `brand/tg.png`, `brand/mascot/tour-guide.glb`, `mcp-config.example.json`, `references/mcp-servers/`, `references/blender/README.md`
- **"Rig Integration"** referenced extensively but no Rig framework code exists
- **"Ralph won't let a project finish until it's 97% perfect"** — Ralph is a QA prompt system, not an enforcement gate
- **Star History chart** points to wrong org URL
- **`demo-video/`** referenced in scripts but empty

**Priority:** Either fill the templates with real starter code or update the README to match reality. Broken references should be fixed or removed.

---

## 📊 Scores

| Aspect               | Score    |
| -------------------- | -------- |
| Project structure    | 8/10     |
| Documentation        | 9/10     |
| Code quality tooling | 8/10     |
| Dependency health    | 5/10     |
| Test coverage        | 4/10     |
| CI/CD                | 6/10     |
| Security             | 6/10     |
| Branch hygiene       | 3/10     |
| **Overall**          | **7/10** |

---

## ✅ What's Already Good

- 252 root tests passing, fast (264ms)
- Zero `any` casts in production CLI/core code
- Zero `eslint-disable` comments
- Zero TypeScript errors across all packages
- Deterministic hashing with canonical JSON
- Secret scanning tooling (scan-secrets.js + Ralph security checks)
- Build validator catches forbidden patterns (private_key, mnemonic, seed_phrase)
- No private keys in source code
- Timing-safe comparison in `launchpad-client.ts` (working correctly)
- BPS validation enforces exact 10000 total
- Partner key immutable/hardcoded
- BackpackWalletAdapter explicitly blocked
- Proper wallet adapter usage (client-side signing only)
- Well-designed attestation flow with deterministic intent hashing
- Renovate configured for weekly dependency updates
- CLAUDE.md orchestrator with phase detection, invariants, and pipeline routing

---

_Generated from 18 automated reviews across structure, security, and code quality dimensions._
