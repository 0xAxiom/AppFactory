# App Factory Skills Audit - Final Comprehensive Report

**Agent G - Systems Architect (Synthesis)**
**Date**: 2026-01-24
**Repository Version**: 1.2.0
**Audit Scope**: All 6 pipelines + root orchestrator + MCP integration

---

## 1. Executive Summary

### Verdict on Current Safety

**Overall Grade: C+ (Functional but Unsafe)**

App Factory operates successfully when all skills are present, but fails unpredictably when they're missing. The repository documents skills as "optional" while pipelines treat them as required, creating a dangerous expectation mismatch.

### Critical Findings

1. **Documentation-Reality Gap (BLOCKER)**: Root CLAUDE.md declares "Offline by Default" (Invariant 4), but 5 MCP servers require network access and are enabled by default. This is a governance contradiction.

2. **Assumed Availability Without Detection (CRITICAL)**: All 6 pipelines reference skills in CLAUDE.md (Playwright, @vercel/agent-skills, Ralph QA automation) but implement ZERO runtime detection in run.mjs. Builds fail silently or cryptically when skills missing.

3. **Mandatory Skills Documented as Optional (HIGH)**: website-pipeline CLAUDE.md declares "mandatory skills audits" (line 150) but run.mjs has no audit execution code. Skills audit runner exists (`scripts/run-skills-audit.sh`) but is never called by pipelines.

4. **Ralph QA Loop Not Automated (HIGH)**: All pipelines document Ralph QA as mandatory gate with 5-iteration loops, but no pipeline run.mjs executes Ralph automatically. Ralph runner exists but requires manual invocation.

5. **Playwright Auto-Download Without Warning (MEDIUM)**: First-time users hit 500MB+ Playwright browser download with no progress indicator or opt-out mechanism.

### Recommended Immediate Actions

**P0 (Merge Blocking):**

- Add runtime detection for ALL skills/tools before use (Playwright, @vercel/agent-skills, Ralph)
- Fix "Offline by Default" contradiction - either disable MCP servers by default or update invariant
- Add capability tier messaging to user-facing documentation

**P1 (Pre-Production):**

- Implement graceful degradation when skills unavailable
- Add LOCAL_RUN_PROOF_GATE as actual gate (currently bypassed in some pipelines)
- Create unified MCP governance model

**P2 (Quality Improvement):**

- Integrate skills audits into build pipelines with fallback
- Automate Ralph QA with human-in-the-loop option
- Add skill availability dashboard

### Long-Term Architecture Direction

**Recommendation**: Adopt **Capability-Aware Architecture** with three tiers:

- **Baseline Tier**: Guaranteed safe (Node.js, npm, file operations)
- **Quality Tier**: High-ROI optional (Playwright, Lighthouse, ESLint)
- **Advanced Tier**: Specialized optional (Semgrep, Figma, Stripe)

Every tool use MUST follow: **Detect → Degrade → Message** pattern.

---

## 2. Current State of Skills Usage

| Skill/Tool             | Where Used                     | Dependency Level        | Detection? | Fallback?       | Risk Level |
| ---------------------- | ------------------------------ | ----------------------- | ---------- | --------------- | ---------- |
| **MCP Servers**        |
| github                 | Root .mcp.json                 | Optional (enabled)      | No         | No              | MEDIUM     |
| playwright             | Root .mcp.json                 | Optional (enabled)      | No         | No              | HIGH       |
| filesystem             | Root .mcp.json                 | Optional (enabled)      | No         | No              | LOW        |
| context7               | Root .mcp.json                 | Optional (enabled)      | No         | No              | MEDIUM     |
| semgrep                | Root .mcp.json                 | Optional (enabled)      | No         | No              | LOW        |
| **Testing/QA Tools**   |
| Playwright (local)     | All web pipelines              | Required (CLAUDE.md)    | No         | No              | CRITICAL   |
| @vercel/agent-skills   | website-pipeline, dapp-factory | "Mandatory" (doc)       | No         | No              | CRITICAL   |
| Ralph QA automation    | All 6 pipelines                | Required (CLAUDE.md)    | No         | No              | HIGH       |
| **Verification Gates** |
| LOCAL_RUN_PROOF_GATE   | All 6 pipelines                | Non-bypassable (doc)    | Yes        | No              | LOW        |
| RUN_CERTIFICATE.json   | All 6 pipelines                | Non-bypassable (doc)    | Yes        | No              | LOW        |
| **Code Quality**       |
| ESLint                 | All web pipelines              | Baseline (package.json) | No         | No              | LOW        |
| TypeScript             | All pipelines                  | Baseline (package.json) | No         | No              | LOW        |
| Prettier               | Some pipelines                 | Optional (package.json) | No         | No              | LOW        |
| **Build Tools**        |
| Node.js                | All pipelines                  | Baseline (required)     | No         | Yes (fail fast) | LOW        |
| npm/pnpm/yarn          | All pipelines                  | Baseline (required)     | No         | Yes (fail fast) | LOW        |
| Expo CLI               | app-factory                    | Required                | No         | No              | MEDIUM     |
| Next.js                | Web pipelines                  | Required                | No         | No              | LOW        |

### Risk Level Definitions

- **CRITICAL**: Build fails cryptically or claims success while broken
- **HIGH**: Build degraded significantly or fails with poor error message
- **MEDIUM**: User experience degraded but clear messaging
- **LOW**: Properly detected/handled or guaranteed available

### Key Findings from Table

1. **Zero runtime detection** for any optional tool
2. **MCP servers enabled by default** despite "offline by default" invariant
3. **Playwright most dangerous**: Large download + assumed in CLAUDE.md + no detection
4. **Skills audits exist as scripts** but never integrated into pipeline flow
5. **Verification gates (RUN_CERTIFICATE) working** as documented (Tier-2 fix success)

---

## 3. Pipeline-by-Pipeline Findings

### app-factory (Mobile Apps)

**Skills/Tools Assumed:**

- RevenueCat SDK (non-negotiable per CLAUDE.md line 52)
- Expo CLI + Metro bundler
- SQLite for local storage
- Ralph QA "Skills Auditor" role (CLAUDE.md line 413)
- Playwright (optional, for web exports)

**Safe vs. Unsafe Assumptions:**

- SAFE: Expo, Metro (installed via package.json, fail fast if missing)
- UNSAFE: Ralph QA documented as "check code quality rules" but no implementation
- UNSAFE: RevenueCat requires API key configuration (not detected before use)

**CLAUDE.md vs. run.mjs Gaps:**

- CLAUDE.md documents 6-milestone build with Ralph QA after each
- run.mjs has no Ralph invocation logic
- CLAUDE.md references "Skills Auditor" role with no corresponding code

**Breaking Points for Users Without Tools:**

- RevenueCat configuration fails with cryptic API errors
- Ralph QA never runs (documented as mandatory)
- Skills audit mentioned in docs but never executed

---

### website-pipeline (Websites)

**Skills/Tools Assumed:**

- Playwright E2E testing (REQUIRED per CLAUDE.md line 17)
- @vercel/agent-skills audits (MANDATORY per CLAUDE.md line 150)
  - react-best-practices ≥95%
  - web-design-guidelines ≥90%
- Ralph UX Polish Loop (20 iterations documented)
- Framer Motion (required by design guidelines)

**Safe vs. Unsafe Assumptions:**

- SAFE: Next.js, React (package.json baseline)
- UNSAFE: "Mandatory skills audits" declared but not executed
- UNSAFE: Playwright documented as required but no detection before use
- UNSAFE: CLAUDE.md Phase 6 is "Skills Audit (MANDATORY GATE)" but run.mjs skips it

**CLAUDE.md vs. run.mjs Gaps:**

- CLAUDE.md line 494: "Phase 6: Skills Audit (MANDATORY GATE)"
- run.mjs: Only 5 phases (Inputs, Scaffold, Install, Verify, Launch) - Phase 6 missing entirely
- CLAUDE.md documents 20-pass Ralph loop, run.mjs has no Ralph logic
- CLAUDE.md line 584: "Run skills audits BEFORE Ralph" - never happens

**Breaking Points for Users Without Tools:**

- Skills audit "mandatory gate" is skipped silently
- Build shows "PASS" despite missing entire quality phase
- Playwright failures during LOCAL_RUN_PROOF cause cryptic errors
- User expects ≥95% React quality (documented) but gets no audit

**Most Critical Issue**: website-pipeline declares "Mode: Full Build Factory with Mandatory Skills Audits" in title but implements zero audits.

---

### dapp-factory (Web3 dApps)

**Skills/Tools Assumed:**

- Playwright E2E testing (REQUIRED per CLAUDE.md)
- @vercel/agent-skills (react-best-practices ≥95%, web-design-guidelines ≥90%)
- Ralph Polish Loop (documented at line 79)
- Rig framework for AI agents (conditional via Agent Decision Gate)
- Web3 wallet browser extensions (for testing)

**Safe vs. Unsafe Assumptions:**

- SAFE: Next.js, Web3 libraries (package.json)
- UNSAFE: "Mandatory Skills Audits" section (line 397) not enforced
- UNSAFE: Agent Decision Gate documented but no corresponding run.mjs logic
- UNSAFE: Playwright assumed for E2E but no detection

**CLAUDE.md vs. run.mjs Gaps:**

- CLAUDE.md has "Phase 4: Ralph Polish Loop" (line 78-81)
- run.mjs has no Ralph invocation
- Agent Decision Gate (Mode A vs Mode B) documented but not implemented
- Skills audits documented in directory map (line 102-103) but no execution

**Breaking Points for Users Without Tools:**

- Ralph Polish Loop never runs despite being in canonical flow
- Skills audits create empty directories but no reports
- Agent Decision Gate skipped, Mode B never activates
- Wallet extension testing fails with no guidance

---

### agent-factory (AI Agents)

**Skills/Tools Assumed:**

- Ralph QA (documented in flow)
- Semgrep security scanning (MCP server)
- E2B code execution sandbox (optional)
- GitHub integration for deployment

**Safe vs. Unsafe Assumptions:**

- SAFE: Node.js, TypeScript (package.json)
- UNSAFE: README.md previously recommended `--legacy-peer-deps` (fixed in Tier-2)
- UNSAFE: Ralph QA documented but not automated
- UNSAFE: Semgrep MCP assumed available without detection

**CLAUDE.md vs. run.mjs Gaps:**

- Ralph QA referenced but no automation
- Security scanning mentioned but no enforcement
- E2B integration documented but optional without fallback messaging

**Breaking Points for Users Without Tools:**

- No security scanning despite MCP server enabled
- Ralph QA skipped silently
- `--legacy-peer-deps` used to bypass dependency issues (security risk)

**Note**: agent-factory had HIGH-1 fix (removed bypass flags) in Tier-2 remediation.

---

### plugin-factory (Claude Plugins)

**Skills/Tools Assumed:**

- MCP protocol tools
- Ralph QA testing
- Smoke testing via HTTP server

**Safe vs. Unsafe Assumptions:**

- SAFE: MCP SDK (package.json)
- SAFE: HTTP verification (implemented in run.mjs)
- UNSAFE: Ralph QA documented but manual

**CLAUDE.md vs. run.mjs Gaps:**

- Ralph QA mentioned but not automated
- Smoke test implemented (good!)
- RUN_CERTIFICATE handling was manual (fixed in Tier-2)

**Breaking Points for Users Without Tools:**

- Ralph QA requires manual invocation
- MCP server testing assumes Claude Code environment

**Note**: plugin-factory had HIGH-2 fix (standardized certificate writing) in Tier-2.

---

### miniapp-pipeline (Base Mini Apps)

**Skills/Tools Assumed:**

- MiniKit SDK
- Playwright testing (optional)
- Ralph QA
- Worldcoin wallet for testing

**Safe vs. Unsafe Assumptions:**

- SAFE: MiniKit (package.json)
- UNSAFE: Ralph QA documented but not automated
- UNSAFE: Worldcoin wallet required for full testing (not documented clearly)

**CLAUDE.md vs. run.mjs Gaps:**

- Ralph QA mentioned but no automation
- Wallet testing requirements unclear
- Deployment to World App requires manual association (documented but buried)

**Breaking Points for Users Without Tools:**

- Ralph QA skipped
- Wallet testing fails with cryptic errors
- MiniKit simulator requirements not detected

---

## 4. Governance & CLAUDE.md Gaps

### Major Contradictions

#### 1. "Offline by Default" vs. MCP Network Usage (BLOCKER)

**Location**: Root CLAUDE.md line 34 (Invariant 4)

**Stated Policy:**

```
4. Offline by Default - no network without authorization
```

**Reality**: `.mcp.json` enables 5 servers by default:

- `github` - Requires GITHUB_PERSONAL_ACCESS_TOKEN (network)
- `playwright` - Downloads 500MB+ browsers (network)
- `context7` - Real-time documentation lookup (network, requires API key)
- `semgrep` - Security scanning (may require network for rules)
- `filesystem` - Local only (COMPLIANT)

**Contradiction Evidence:**

- Root CLAUDE.md line 112: "Execute network calls: Offline by default, Only with explicit authorization"
- `.mcp.json` line 6: `"command": "npx"` (auto-installs packages from network)
- MCP servers start on Claude Code launch (no authorization prompt)

**Impact**: Users expect offline operation per constitution, but get network activity without consent.

**Recommendation**:

- Option A: Change invariant to "Offline by default EXCEPT enabled MCP servers"
- Option B: Disable MCP servers by default, require explicit opt-in
- Option C: Add MCP authorization gate on first use

---

#### 2. "Mandatory" Skills Audits That Never Run (CRITICAL)

**Locations:**

- website-pipeline/CLAUDE.md line 4: "Mode: Full Build Factory with Mandatory Skills Audits"
- website-pipeline/CLAUDE.md line 150: "This pipeline has **mandatory skills audits**"
- website-pipeline/CLAUDE.md line 494: "Phase 6: Skills Audit (MANDATORY GATE)"

**Reality:**

- website-pipeline/scripts/run.mjs: Only 5 phases (no Phase 6)
- Skills audit runner exists: `scripts/run-skills-audit.sh`
- Runner is NEVER called by any pipeline
- Runner itself is a placeholder (line 164: "This is a placeholder")

**Impact**:

- Builds claim "PASS" without quality checks
- Users expect ≥95% React quality, get unknown quality
- "Mandatory" becomes meaningless

**Similar Issues:**

- dapp-factory/CLAUDE.md line 397: "Mandatory Skills Audits" section
- app-factory/CLAUDE.md line 413: "Skills Auditor" role documented
- All pipelines: Ralph QA documented as mandatory, never automated

---

#### 3. Ralph QA Loop Documentation vs. Implementation Gap (HIGH)

**Documented in CLAUDE.md files:**

- app-factory: 6 milestones with Ralph QA after each (≥97% required)
- website-pipeline: 20-pass UX Polish Loop
- dapp-factory: Ralph Polish Loop (Phase 4)
- All pipelines: Ralph as quality gate

**Reality:**

- Ralph runner exists: `ralph/run-ralph.sh` (created in Tier-2)
- NO pipeline run.mjs calls Ralph automatically
- Ralph iterations require manual prompt pasting
- `docs/UX_POLISH_LOOP.md` documents system as "Production" but it's manual

**Evidence from Code:**

- No `ralph` imports in any run.mjs
- No `execSync('ralph')` calls
- No Ralph logic in build phases
- Ralph runner is interactive (line 199: `read -r` waits for ENTER)

---

### Missing Policies

#### 1. What Happens When Optional Tools Are Missing?

**Gap**: No documented behavior for:

- Playwright unavailable during LOCAL_RUN_PROOF
- @vercel/agent-skills not installed
- MCP server fails to start
- GitHub token not configured

**Current Behavior**: Cryptic errors, silent failures, or skipped features

**Needed Policy**:

```markdown
### Tool Availability Policy

When an optional tool is unavailable:

1. **Detection**: Pipeline MUST detect availability before use
2. **Messaging**: Pipeline MUST inform user clearly:
   - What tool is missing
   - What feature will be degraded/skipped
   - How to install tool (optional)
3. **Degradation**: Pipeline MUST continue with reduced capability
4. **Logging**: Pipeline MUST log tool absence to audit trail

Example: "Playwright not found. Skipping E2E tests. Install with: npm i -D playwright"
```

---

#### 2. MCP Server Capability Negotiation (MISSING)

**Gap**: No protocol for:

- Checking if MCP server is responding
- Handling MCP server startup failures
- Falling back when MCP tool unavailable
- Communicating capability levels to user

**Industry Best Practice (from Agent F research):**

- Capability negotiation handshake
- Graceful degradation tiers
- Clear error messages with resolution steps

**Needed in App Factory**:

```markdown
### MCP Server Capability Protocol

Before using any MCP server tool:

1. Check server is listed in .mcp.json
2. Attempt connection with 5s timeout
3. On failure:
   - Log to audit: "MCP server X unavailable"
   - Display user message: "Feature Y unavailable (MCP server X offline)"
   - Continue with degraded capability
4. Never fail build due to MCP unavailability
```

---

#### 3. Skills Audit Threshold Governance (FRAGMENTED)

**Current State**:

- website-pipeline: react ≥95%, design ≥90% (CLAUDE.md line 501)
- dapp-factory: react ≥95%, design ≥90% (CLAUDE.md line 401)
- Other pipelines: No thresholds documented
- `scripts/run-skills-audit.sh`: Defaults to 95/90 (line 38-39)

**Fragmentation Issues**:

- Thresholds duplicated across documents
- No central authority for quality standards
- Per-pipeline overrides not supported
- Threshold changes require multi-file updates

**Recommendation**: Create `ralph/QUALITY_STANDARDS.md` with:

```markdown
### Skills Audit Thresholds

| Skill                 | Minimum Pass | Aspirational | Applies To          |
| --------------------- | ------------ | ------------ | ------------------- |
| react-best-practices  | 90%          | 95%          | All React pipelines |
| web-design-guidelines | 85%          | 90%          | UI pipelines        |
| accessibility         | 95%          | 100%         | Public-facing sites |
| security              | 100%         | 100%         | All pipelines       |

Pipelines MAY set stricter thresholds but MUST NOT relax these minimums.
```

---

### Authority Fragmentation Issues

#### 1. MCP Governance Split Between Root and plugin-factory

**Root**: `.mcp.json` enables 5 servers globally
**plugin-factory**: Documents MCP usage for plugins
**No Clear Owner**: Who decides which MCP servers to enable?

**Needed**: Central MCP governance in root CLAUDE.md:

```markdown
### MCP Server Governance

**Authority**: Root orchestrator owns .mcp.json configuration
**Adding Servers**: Requires ADR (Architecture Decision Record)
**Pipeline Usage**: Pipelines MAY use enabled servers with detection
**Removal**: Requires deprecation notice + 1 release cycle
```

---

#### 2. Skills Audit Ownership Unclear

**Who owns skills audits?**

- Root: Mentions in invariants but no ownership claim
- Pipelines: Document as "mandatory" but don't implement
- Scripts: `/scripts/run-skills-audit.sh` exists but no authority

**Recommendation**: Establish in root CLAUDE.md:

```markdown
### Skills Audit Authority

**Owner**: Each pipeline sovereign over quality thresholds
**Baseline**: Root provides skill audit runner in /scripts/
**Enforcement**: Pipelines MUST run audits OR document why skipped
**Thresholds**: Pipelines set in CLAUDE.md, enforced in run.mjs
```

---

### Required Governance Additions

#### 1. Add to Root CLAUDE.md

```markdown
## CAPABILITY TIER SYSTEM

App Factory operates in three capability tiers:

### Tier 1: Baseline (Always Available)

- Node.js ≥18
- npm/pnpm/yarn
- File system operations
- Core build tools (Next.js, Expo, etc.)

### Tier 2: Quality (Optional, High ROI)

- Playwright (E2E testing)
- ESLint + Prettier (code quality)
- Skills audits (React, design, a11y)
- Ralph QA automation

Pipelines MUST detect Tier 2 availability and degrade gracefully.

### Tier 3: Advanced (Optional, Specialized)

- MCP servers (GitHub, Semgrep, Context7, etc.)
- Figma integration
- Payment SDKs (Stripe, RevenueCat)
- Cloud deployment tools

Pipelines MUST NOT assume Tier 3 availability.

## DETECTION PROTOCOL

Before using any Tier 2 or Tier 3 tool:

1. **Check availability**: Command exists, API responds, etc.
2. **On unavailable**:
   - Log to audit trail
   - Message user: "Tool X unavailable, skipping feature Y"
   - Continue with degraded capability
3. **Never fail builds** due to optional tool absence
```

---

#### 2. Add to Each Pipeline CLAUDE.md

```markdown
## REQUIRED TOOLS

### Baseline (Build Fails if Missing)

- Node.js ≥18
- npm/pnpm/yarn
- [Pipeline-specific: Next.js, Expo, etc.]

### Quality Tools (Build Succeeds if Missing, with Warnings)

- Playwright (E2E testing) - Recommended
- @vercel/agent-skills (code quality) - Recommended
- ESLint + Prettier - Recommended

### Advanced Tools (Optional, Silent Skip if Missing)

- [MCP servers]
- [Specialized SDKs]

## DEGRADATION BEHAVIOR

When quality tools unavailable:

- Build continues
- User receives warning
- Output includes "Quality tier: Baseline" notice
- Documentation suggests tool installation
```

---

## 5. User Experience Risk Analysis

### First-Time User Journey (NO Skills Installed)

**Scenario**: New developer clones App Factory, has only Node.js + npm.

#### Step 1: Clone Repository

```bash
git clone https://github.com/user/AppFactory.git
cd AppFactory
```

**Status**: SUCCESS (no issues)

---

#### Step 2: Read Root CLAUDE.md

**User Expectation**: "Offline by default" (line 34)
**Reality**: Will download packages from npm on first run
**Mismatch**: MINOR (expected behavior for Node.js projects)

---

#### Step 3: Try to Build a Website

```bash
cd website-pipeline
claude
> "Build me a portfolio site"
```

**What Happens:**

1. Claude reads CLAUDE.md: "Mandatory Skills Audits"
2. User expects build to fail if audits missing
3. Build proceeds without audits (Phase 6 skipped)
4. Build shows "SUCCESS" despite missing quality gate
5. User doesn't know audits were skipped

**Breaking Point**: Silent quality degradation
**User Impact**: Believes they have high-quality output when audits never ran
**Risk Level**: HIGH (expectation violated, false confidence)

---

#### Step 4: LOCAL_RUN_PROOF Verification

**If Playwright installed as dev dependency:**

- Next.js app tries to run Playwright tests
- Playwright auto-downloads 500MB+ of browsers (FIRST TIME ONLY)
- No progress indicator, appears frozen
- User waits 5-10 minutes
- Eventually succeeds

**If Playwright NOT in package.json:**

- Verification uses HTTP server only (fallback)
- Succeeds quickly
- User doesn't know E2E tests were skipped

**Breaking Point #1**: 500MB surprise download with no warning
**Breaking Point #2**: Silent E2E test skip
**Risk Level**: MEDIUM (confusing but not fatal)

---

#### Step 5: Try Skills Audit Manually

**User reads documentation, tries:**

```bash
./scripts/run-skills-audit.sh website-builds/my-site
```

**What Happens:**

1. Script runs
2. Checks for @vercel/agent-skills
3. Not found, tries to install locally
4. Creates placeholder audit files
5. Shows "NOT IMPLEMENTED" message (line 187)
6. Exits with code 1

**Breaking Point**: Documented feature doesn't work
**User Impact**: Loss of trust, wasted time
**Risk Level**: HIGH (documented as available but fake)

---

#### Step 6: Try Ralph QA

**User reads UX_POLISH_LOOP.md, tries:**

```bash
./ralph/run-ralph.sh website-pipeline 1
```

**What Happens:**

1. Script generates prompt file
2. Waits for user to press ENTER
3. Opens Claude Code with prompt
4. USER MUST MANUALLY REVIEW AND EXECUTE
5. Not automated

**Breaking Point**: Documented as "Production" but requires manual work
**User Impact**: Automation expectation violated
**Risk Level**: MEDIUM (works but not as advertised)

---

### Breaking Points Summary

| Step | Feature             | Expected               | Actual                     | Risk   |
| ---- | ------------------- | ---------------------- | -------------------------- | ------ |
| 2    | Offline mode        | No network             | MCP servers enabled        | LOW    |
| 3    | Mandatory audits    | Build fails if missing | Silent skip                | HIGH   |
| 4    | Playwright          | Fast or skip           | 500MB download, no warning | MEDIUM |
| 5    | Skills audit script | Works                  | Placeholder only           | HIGH   |
| 6    | Ralph automation    | Automated              | Manual prompts             | MEDIUM |

---

### Expectation Mismatches

#### 1. "Optional" vs. "Required" vs. "Mandatory"

**Documentation Language Analysis:**

- website-pipeline: "Mandatory Skills Audits" (title + multiple locations)
- dapp-factory: "Mandatory Skills Audits" (section header)
- MCP servers: No usage of "mandatory" but enabled by default
- Ralph QA: "Required" in some CLAUDE.md files
- Playwright: "REQUIRED" in table (website-pipeline CLAUDE.md line 60)

**User Mental Model:**

- Mandatory = Build fails if missing
- Required = Build fails if missing
- Optional = Build succeeds, feature skipped

**Reality:**

- "Mandatory" audits are skipped silently
- "Required" Playwright degrades to HTTP-only
- "Optional" MCP servers are enabled by default

**Mismatch Impact**: Users cannot predict what will happen when tools missing.

---

#### 2. "Documented" vs. "Implemented"

**Features documented but not implemented:**

- Skills audits (placeholder script)
- Ralph automation (manual prompts)
- Agent Decision Gate (dapp-factory)
- Phase 6 (website-pipeline)

**User Impact**:

- Wasted time trying to use features
- Loss of trust in documentation
- Uncertainty about what works

**Recommendation**: Add implementation status to all features:

```markdown
### Skills Audits (Status: PLANNED - Not Yet Implemented)

This pipeline will include automated skills audits in a future release.

**Current State**: Manual audits via `scripts/run-skills-audit.sh` (placeholder)
**Target Release**: v3.0
**Workaround**: Use ESLint + manual code review
```

---

### Quality of Error Messaging

**Current State**: Error messages analyzed across pipelines.

#### Good Examples (to keep):

1. **RUN_CERTIFICATE validation** (Tier-2 fix):

```
BUILD VERIFICATION FAILED
Error: Dev server failed to respond after 30 seconds
See details: /path/to/RUN_FAILURE.json
```

Clear, actionable, points to details.

2. **HTTP verification failure** (plugin-factory):

```
Smoke test failed: HTTP server did not respond
Expected: 200
Actual: [error]
```

#### Bad Examples (to fix):

1. **Skills audit failure** (run-skills-audit.sh line 209):

```
Actual implementation requires @vercel/agent-skills integration
```

Not actionable. User doesn't know how to integrate it.

**Better:**

```
Skills audit unavailable: @vercel/agent-skills not configured

This is a planned feature. Current workaround:
1. Run ESLint: npm run lint
2. Manual code review against guidelines

To enable (experimental):
npm install -D @vercel/agent-skills
# Configure per docs/skills-audit-setup.md
```

2. **Playwright missing** (no current message, fails cryptically):
   **Better:**

```
Playwright not found. E2E tests will be skipped.

Install Playwright for full verification:
npm install -D playwright
npx playwright install

Build will continue with HTTP-only verification.
```

3. **MCP server failure** (no current handling):
   **Better:**

```
Warning: MCP server 'playwright' failed to start

Features unavailable:
- Browser automation
- Visual regression testing

Build will continue with reduced capability.

To fix: Check .mcp.json configuration
```

---

## 6. Web Research Insights

### Key Takeaways from Industry Best Practices (Agent F)

#### 1. Runtime Detection > Config Files

**Industry Standard**: Tools check availability at runtime, not trust config.

**Example from npm ecosystem:**

```javascript
// Good: Runtime detection
const hasPlaywright = await checkPlaywrightAvailable();
if (!hasPlaywright) {
  console.warn('Playwright not found, skipping E2E tests');
  return;
}

// Bad: Assume from config
if (config.playwright.enabled) {
  // Config lies!
  await runPlaywrightTests(); // Crashes if not installed
}
```

**App Factory Status**: All assumptions from CLAUDE.md, zero runtime checks.

**Recommendation**: Add detection utilities:

```javascript
// /core/src/capability-detection.ts
export async function detectPlaywright() {
  try {
    const { chromium } = await import('playwright');
    return { available: true, version: chromium.version() };
  } catch {
    return { available: false, reason: 'Not installed' };
  }
}
```

---

#### 2. Graceful Degradation Tiers

**Industry Pattern**: Netflix, Stripe, Vercel all use capability tiers.

**Example from Vercel Edge Functions:**

- Tier 1: Basic functions (always work)
- Tier 2: Node.js APIs (work if available)
- Tier 3: Full Node.js (works in Node.js runtime only)

Code detects environment and degrades gracefully.

**App Factory Equivalent**:

- Tier 1: Baseline (Node.js + npm tools)
- Tier 2: Quality (Playwright, skills audits, Ralph)
- Tier 3: Advanced (MCP servers, cloud integrations)

---

#### 3. Clear User Communication of Capability Levels

**Industry Example - Stripe CLI:**

```
✓ Authentication successful
✓ Webhooks available
⚠ Dashboard access unavailable (offline mode)
→ Run 'stripe login --interactive' to enable
```

Clear status, actionable remediation.

**App Factory Should Do:**

```
✓ Project scaffolded
✓ Dependencies installed
⚠ E2E tests skipped (Playwright not found)
⚠ Skills audits unavailable (quality tools not configured)
✓ HTTP verification: PASS

Build ready with Baseline quality tier.

Upgrade to Quality tier:
  npm install -D playwright @vercel/agent-skills
  ./scripts/setup-quality-tools.sh
```

---

### MCP Ecosystem Best Practices

#### 1. Explicit Permission Model (Anthropic Docs)

MCP servers should:

- Request permissions explicitly
- Degrade gracefully if denied
- Document required vs optional permissions

**App Factory Status**: No permission model, all servers auto-start.

**Recommendation**: Add MCP permission gate:

```json
{
  "mcpServers": {
    "playwright": {
      "enabled": false, // Require opt-in
      "permissions": ["network", "filesystem"],
      "purpose": "E2E testing for UX Polish Loop"
    }
  }
}
```

On first use, prompt:

```
Playwright MCP server wants to:
- Download browsers (~500MB)
- Access filesystem for screenshots

Allow? [y/N]
```

---

#### 2. Capability Negotiation Handshake (MCP Spec)

Standard MCP pattern:

1. Client connects to server
2. Server announces capabilities
3. Client uses only announced capabilities
4. Fallback if capability unavailable

**App Factory Status**: No handshake, assumes all tools work.

**Recommendation**: Add capability probe before use:

```javascript
async function probePlaywrightCapabilities() {
  const mcp = await connectMCP('playwright');
  const caps = await mcp.getCapabilities();

  return {
    browser: caps.includes('browser-control'),
    screenshots: caps.includes('screenshots'),
    a11y: caps.includes('accessibility-tree'),
  };
}
```

---

#### 3. Fallback Modes (Industry Standard)

**Example from Playwright itself:**

- Full mode: All browsers (Chromium, Firefox, WebKit)
- Lite mode: Chromium only
- Headless mode: No browser download (API testing only)

**App Factory Should Do:**

```markdown
### Playwright Fallback Modes

**Mode 1: Full (500MB)**: All browsers, visual testing
**Mode 2: Chromium-only (100MB)**: Basic E2E
**Mode 3: HTTP-only (0MB)**: No browser, server testing only

Pipeline auto-detects and uses best available mode.
```

---

### High-ROI Tools Worth Prioritizing

Based on Agent F research + industry surveys:

#### Tier 1: Must-Have Quality Tools

| Tool           | Purpose         | ROI       | Current Status                 |
| -------------- | --------------- | --------- | ------------------------------ |
| **Playwright** | E2E testing     | Very High | Enabled in MCP, not integrated |
| **ESLint**     | Code quality    | High      | Baseline (package.json)        |
| **TypeScript** | Type safety     | Very High | Baseline (package.json)        |
| **Prettier**   | Code formatting | Medium    | Some pipelines only            |

**Recommendation**: Make these baseline in ALL pipelines.

---

#### Tier 2: High-ROI Optional Tools

| Tool                     | Purpose            | ROI         | Current Status              |
| ------------------------ | ------------------ | ----------- | --------------------------- |
| **Lighthouse**           | Performance + A11y | High        | Not configured              |
| **Axe-core**             | Accessibility      | High        | Not configured              |
| **Semgrep**              | Security           | Medium-High | MCP enabled, not used       |
| **@vercel/agent-skills** | Code quality       | Medium      | Documented, not implemented |

**Recommendation**: Add detection + graceful skip for these.

**Code Example:**

```javascript
// Quality enhancement (skippable)
const lighthouse = await detectLighthouse();
if (lighthouse.available) {
  const score = await runLighthouseAudit(url);
  if (score.performance < 80) {
    console.warn(`Performance score: ${score.performance}/100`);
  }
} else {
  console.log('Lighthouse not available, skipping performance audit');
}
```

---

#### Tier 3: Specialized Tools (Don't Block on These)

| Tool             | Purpose        | ROI        | Current Status          |
| ---------------- | -------------- | ---------- | ----------------------- |
| **Figma MCP**    | Design import  | Medium     | Documented, not enabled |
| **Supabase MCP** | Database       | Medium     | Documented, not enabled |
| **Stripe SDK**   | Payments       | Medium     | Not configured          |
| **E2B**          | Code execution | Low-Medium | Documented, not enabled |

**Recommendation**: Document as optional, provide setup guides, never assume.

---

### Anti-Patterns to Avoid

From Agent F research on what NOT to do:

#### 1. --legacy-peer-deps Flag (SECURITY RISK)

**Status in App Factory**: Fixed in Tier-2 (agent-factory README updated)

**Why Dangerous**: Hides dependency conflicts, security vulnerabilities.

**Keep the Fix**: agent-factory README now warns against it.

---

#### 2. Silent Feature Degradation

**Anti-Pattern**: Feature disappears without user knowing.

**Good Pattern**:

```
⚠ Feature X unavailable (tool Y missing)
Build continues with reduced capability
```

**App Factory Status**: Currently doing the anti-pattern (skills audits silently skipped).

---

#### 3. "Optional" Tools That Are Actually Required

**Anti-Pattern**: Document as optional but build breaks without it.

**App Factory Example**:

- Playwright documented as "optional" but `website-pipeline` fails cryptically without it
- Skills audits documented as "mandatory" but are actually skipped

**Fix**: Align documentation with reality.

---

#### 4. Assuming Network Availability

**Anti-Pattern**: Make network calls without checking connectivity.

**App Factory Status**: "Offline by default" documented but MCP servers make network calls.

**Fix**: Either disable MCP by default OR update invariant.

---

## 7. Recommended Skill Expansion

### Categorization into Tiers

```
┌────────────────────────────────────────────────────┐
│                  TIER 1: BASELINE                  │
│         (Safe to Assume - Build Fails Fast)        │
├────────────────────────────────────────────────────┤
│ • Node.js ≥18                                      │
│ • npm / pnpm / yarn                                │
│ • Git (repository operations)                      │
│ • File system access                               │
│ • Core framework (Next.js, Expo, React, etc.)     │
│ • Package.json dependencies (ESLint, TypeScript)  │
└────────────────────────────────────────────────────┘
         ↓ Detect Before Use ↓
┌────────────────────────────────────────────────────┐
│              TIER 2: QUALITY (OPTIONAL)            │
│      (High ROI - Degrade Gracefully if Missing)    │
├────────────────────────────────────────────────────┤
│ • Playwright (E2E testing)                         │
│ • Lighthouse (performance + a11y audits)           │
│ • Axe-core (accessibility)                         │
│ • @vercel/agent-skills (code quality)              │
│ • Prettier (code formatting)                       │
│ • Ralph QA automation                              │
└────────────────────────────────────────────────────┘
         ↓ Detect Before Use ↓
┌────────────────────────────────────────────────────┐
│          TIER 3: ADVANCED (OPTIONAL)               │
│    (Specialized - Skip Silently if Missing)        │
├────────────────────────────────────────────────────┤
│ • MCP Servers (GitHub, Semgrep, Context7, etc.)   │
│ • Figma integration                                │
│ • Supabase / database tools                        │
│ • Payment SDKs (Stripe, RevenueCat)               │
│ • E2B code execution sandbox                       │
│ • Cloud deployment CLIs (Vercel, AWS, etc.)       │
└────────────────────────────────────────────────────┘
```

---

### Tier 2 Details: Quality Tools (High Priority)

#### 1. Playwright (E2E Testing)

**Why Valuable:**

- Catch UI regressions before shipping
- Test real user interactions (clicks, forms, navigation)
- Accessibility tree validation
- Cross-browser compatibility testing

**When to Use:**

- All web pipelines (website, dapp, miniapp)
- After scaffold + install, before declaring "ready"
- In Ralph QA iterations for regression detection

**Fallback Strategy:**

```javascript
const hasPlaywright = await detectPlaywright();

if (hasPlaywright) {
  console.log('Running E2E tests with Playwright...');
  await runPlaywrightTests();
} else {
  console.warn('⚠ Playwright not found. Skipping E2E tests.');
  console.warn('Install: npm install -D playwright && npx playwright install');
  console.log('Continuing with HTTP-only verification...');
  await runHTTPVerification();
}
```

**ROI Estimate:**

- Setup time: 5 minutes (first time), 0 minutes (cached browsers)
- Test execution: 10-30 seconds
- Bugs caught: 2-5 per project (medium-severity UI issues)
- ROI: Very High (prevents broken UIs from shipping)

**Current Status**:

- Enabled in MCP (root .mcp.json)
- Documented as "REQUIRED" in website-pipeline
- NOT detected before use
- NOT gracefully degraded

**Recommendation**:

1. Add detection in all web pipeline run.mjs
2. Graceful HTTP-only fallback
3. User message about reduced test coverage

---

#### 2. Lighthouse (Performance + Accessibility Audits)

**Why Valuable:**

- Objective performance scores (0-100)
- Accessibility issue detection
- Best practice enforcement (HTTPS, image optimization, etc.)
- SEO audit

**When to Use:**

- After build completion, before declaring success
- On localhost:PORT during verification phase
- Optional in CI/CD for regression detection

**Fallback Strategy:**

```javascript
const hasLighthouse = await detectLighthouse();

if (hasLighthouse) {
  const report = await runLighthouse(url);
  console.log(`Performance: ${report.performance}/100`);
  console.log(`Accessibility: ${report.accessibility}/100`);

  if (report.accessibility < 90) {
    console.warn('⚠ Accessibility score below 90. See report:');
    console.warn(report.reportPath);
  }
} else {
  console.log('ℹ Lighthouse not available. Skipping performance audit.');
  console.log('Install: npm install -g lighthouse');
}
```

**ROI Estimate:**

- Setup: 2 minutes (npm install -g lighthouse)
- Audit time: 30-60 seconds
- Issues caught: 3-8 per project (performance, a11y, SEO)
- ROI: High (prevents slow, inaccessible sites)

**Current Status**: Not configured anywhere

**Recommendation**:

1. Add as optional quality check in web pipelines
2. Run after LOCAL_RUN_PROOF passes
3. Non-blocking (warn on low scores, don't fail build)

---

#### 3. Axe-core (Accessibility)

**Why Valuable:**

- Detects 57% of accessibility issues automatically (Deque research)
- WCAG 2.1 compliance checking
- Fast (milliseconds)
- Integrates with Playwright

**When to Use:**

- During Playwright E2E tests (if available)
- On every rendered page
- Before declaring build complete

**Fallback Strategy:**

```javascript
const hasPlaywright = await detectPlaywright();

if (hasPlaywright) {
  // Axe-core works best with Playwright
  await runPlaywrightWithAxe();
  console.log('✓ Accessibility scan: PASS');
} else {
  console.log('ℹ Playwright unavailable. Skipping automated a11y scan.');
  console.log('Manual testing recommended: docs/a11y-checklist.md');
}
```

**ROI Estimate:**

- Setup: 0 minutes (ships with Playwright)
- Scan time: <1 second per page
- Issues caught: 4-12 per project (color contrast, labels, ARIA)
- ROI: High (prevents inaccessible UIs, legal risk)

**Current Status**: Not configured

**Recommendation**:

1. Integrate into Playwright tests (if available)
2. Add to Ralph QA acceptance criteria
3. Fail on CRITICAL a11y issues, warn on others

---

#### 4. @vercel/agent-skills (Code Quality Audits)

**Why Valuable:**

- React best practices enforcement
- Next.js optimization checks
- Design guideline compliance
- Automated code review

**When to Use:**

- After code generation, before Ralph QA
- Phase 6 in website-pipeline (currently missing)
- Mandatory gate for production builds

**Fallback Strategy:**

```javascript
const hasSkills = await detectAgentSkills();

if (hasSkills) {
  const result = await runSkillsAudit(['react-best-practices']);
  if (result.score < 95) {
    console.warn(`⚠ React quality: ${result.score}/100 (target: 95)`);
    console.warn(
      'Issues:',
      result.violations.map((v) => v.message)
    );
  } else {
    console.log(`✓ React quality: ${result.score}/100`);
  }
} else {
  console.warn('⚠ Skills audits unavailable.');
  console.warn('Install: npm install -D @vercel/agent-skills');
  console.warn('Build continues with ESLint-only quality checks.');
  await runESLint();
}
```

**ROI Estimate:**

- Setup: 5 minutes (npm install + config)
- Audit time: 10-20 seconds
- Issues caught: 5-15 per project (React patterns, design)
- ROI: Medium-High (prevents code quality debt)

**Current Status**:

- Documented as "mandatory" in website-pipeline, dapp-factory
- Placeholder script exists
- NOT implemented

**Recommendation**:

1. Implement actual skills audit in run-skills-audit.sh
2. Integrate into pipeline run.mjs Phase 6
3. Fallback to ESLint if unavailable

---

#### 5. Prettier (Code Formatting)

**Why Valuable:**

- Consistent code style
- No formatting debates
- Auto-fixable

**When to Use:**

- After code generation
- Before git commit
- In editor (format on save)

**Fallback Strategy:**

```javascript
const hasPrettier = existsSync('prettier.config.js');

if (hasPrettier) {
  execSync('npx prettier --write src/**/*.{js,jsx,ts,tsx}');
  console.log('✓ Code formatted');
} else {
  console.log('ℹ Prettier not configured. Skipping formatting.');
}
```

**ROI Estimate:**

- Setup: 2 minutes (.prettierrc + package.json)
- Format time: 1-3 seconds
- Issues prevented: Style consistency
- ROI: Medium (quality of life improvement)

**Current Status**: Some pipelines have it, others don't

**Recommendation**: Add to all pipelines as optional (non-blocking)

---

#### 6. Ralph QA Automation

**Why Valuable:**

- Adversarial review catches issues humans miss
- Structured iteration (max 5 passes)
- Completion promise ensures quality

**When to Use:**

- After skills audits pass
- Before declaring build complete
- Optional: manual invocation for deep review

**Fallback Strategy:**

```javascript
const ralphAvailable = existsSync('ralph/run-ralph.sh');

if (ralphAvailable && userOptedIn) {
  console.log("Starting Ralph QA automation...");
  await runRalphIterations(maxIterations: 5);
} else {
  console.log("ℹ Ralph QA: Manual mode");
  console.log("Run: ./ralph/run-ralph.sh <pipeline> 1");
}
```

**ROI Estimate:**

- Setup: 0 minutes (already exists)
- Iteration time: 2-5 minutes each
- Issues caught: 3-10 per project (edge cases, polish)
- ROI: High (catches subtle bugs)

**Current Status**:

- Runner exists (ralph/run-ralph.sh)
- Documented as mandatory
- NOT automated in pipelines

**Recommendation**:

1. Make Ralph optional (not mandatory)
2. Prompt user: "Run Ralph QA? (Recommended) [Y/n]"
3. If declined, add note: "Quality tier: Manual review recommended"

---

### Tier 3 Details: Advanced Tools (Lower Priority)

#### MCP Servers

**Current Enabled**: github, playwright, filesystem, context7, semgrep

**Recommendation for Each:**

| Server     | Keep?    | Detection?        | Fallback             |
| ---------- | -------- | ----------------- | -------------------- |
| github     | Yes      | Check token + API | Skip GitHub features |
| playwright | Yes      | Probe before use  | HTTP-only mode       |
| filesystem | Yes      | Always available  | N/A                  |
| context7   | Optional | Check API key     | Skip doc lookups     |
| semgrep    | Optional | Probe binary      | Skip security scan   |

**Policy**: ALL MCP servers should:

1. Detect availability before use
2. Degrade gracefully if unavailable
3. Log to audit when skipped
4. Never block builds

---

#### Figma Integration

**Why Valuable**: Design-to-code accuracy

**When to Use**: Optional for design-heavy projects

**Fallback**: Manual design implementation

**ROI**: Medium (time-saving for designers)

**Recommendation**: Document as advanced feature, never assume

---

#### Supabase / Database Tools

**Why Valuable**: Backend scaffolding

**When to Use**: Projects with data persistence

**Fallback**: Local JSON storage, manual backend setup

**ROI**: Medium (for data-heavy apps)

**Recommendation**: Detect before use, skip if unavailable

---

## 8. Capability-Aware Architecture Proposal

### Core Principles

1. **Detect, Don't Assume**: Check tool availability at runtime
2. **Degrade, Don't Fail**: Continue with reduced capability
3. **Message, Don't Hide**: Tell user what's happening
4. **Tier, Don't Require**: Organize tools into capability tiers

---

### Detection Protocol (Implementation Pattern)

#### Pattern 1: Command-Line Tool Detection

```javascript
/**
 * Detect if a CLI tool is available
 * @param {string} command - Command to check (e.g., 'playwright')
 * @param {string[]} args - Args to test (e.g., ['--version'])
 * @returns {Promise<{available: boolean, version?: string, error?: string}>}
 */
export async function detectCLITool(command, args = ['--version']) {
  try {
    const { execSync } = await import('child_process');
    const output = execSync(`${command} ${args.join(' ')}`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 5000,
    });

    return {
      available: true,
      version: output.trim(),
    };
  } catch (error) {
    return {
      available: false,
      error: error.code === 'ENOENT' ? 'Command not found' : error.message,
    };
  }
}

// Usage
const playwright = await detectCLITool('npx', ['playwright', '--version']);
if (!playwright.available) {
  console.warn(`⚠ Playwright unavailable: ${playwright.error}`);
}
```

---

#### Pattern 2: NPM Package Detection

```javascript
/**
 * Detect if an npm package is available
 * @param {string} packageName - Package to check
 * @param {string} projectPath - Project directory
 * @returns {Promise<{available: boolean, version?: string, location?: string}>}
 */
export async function detectNPMPackage(packageName, projectPath) {
  try {
    // Check package.json
    const pkgPath = join(projectPath, 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

    const version = pkg.dependencies?.[packageName] || pkg.devDependencies?.[packageName];

    if (!version) {
      return { available: false };
    }

    // Check if actually installed (node_modules)
    const modulePath = join(projectPath, 'node_modules', packageName);
    if (!existsSync(modulePath)) {
      return {
        available: false,
        error: 'Listed in package.json but not installed (run npm install)',
      };
    }

    return {
      available: true,
      version,
      location: modulePath,
    };
  } catch (error) {
    return { available: false, error: error.message };
  }
}

// Usage
const playwright = await detectNPMPackage('playwright', projectPath);
if (!playwright.available) {
  console.warn(`⚠ Playwright: ${playwright.error || 'Not found'}`);
}
```

---

#### Pattern 3: MCP Server Detection

```javascript
/**
 * Detect if an MCP server is responding
 * @param {string} serverName - Server name from .mcp.json
 * @returns {Promise<{available: boolean, capabilities?: string[], error?: string}>}
 */
export async function detectMCPServer(serverName) {
  try {
    // Read .mcp.json
    const mcpPath = join(process.env.HOME, '.config/claude-code/mcp-config.json');
    const config = JSON.parse(readFileSync(mcpPath, 'utf-8'));

    const server = config.mcpServers[serverName];
    if (!server) {
      return { available: false, error: 'Not configured in .mcp.json' };
    }

    // Attempt connection (implementation-specific)
    // This is a simplified example
    const probe = await probeMCPServer(server);

    return {
      available: probe.responding,
      capabilities: probe.capabilities,
      error: probe.error,
    };
  } catch (error) {
    return { available: false, error: error.message };
  }
}

// Usage
const playwright = await detectMCPServer('playwright');
if (!playwright.available) {
  console.warn(`⚠ Playwright MCP: ${playwright.error}`);
}
```

---

### Degradation Strategy (Implementation Pattern)

#### Pattern 1: Fallback Chain

```javascript
/**
 * Run E2E tests with fallback
 */
async function runE2ETests(projectPath, url) {
  // Tier 1: Full Playwright
  const playwright = await detectPlaywright();
  if (playwright.available) {
    console.log('✓ Running full E2E test suite (Playwright)');
    return await runPlaywrightTests(projectPath, url);
  }

  // Tier 2: Puppeteer (if available)
  const puppeteer = await detectPuppeteer();
  if (puppeteer.available) {
    console.log('⚠ Playwright unavailable. Using Puppeteer (limited)');
    return await runPuppeteerTests(projectPath, url);
  }

  // Tier 3: HTTP-only
  console.warn('⚠ No browser testing available. HTTP verification only.');
  console.warn('Install Playwright: npm install -D playwright');
  return await runHTTPVerification(url);
}
```

---

#### Pattern 2: Feature Toggles

```javascript
/**
 * Determine available features based on tool detection
 */
async function detectCapabilities(projectPath) {
  const capabilities = {
    baseline: true, // Always available
    e2e: false,
    a11y: false,
    performance: false,
    security: false,
    codeQuality: false,
  };

  // E2E testing
  const playwright = await detectPlaywright();
  if (playwright.available) {
    capabilities.e2e = true;
    capabilities.a11y = true; // Axe-core works with Playwright
  }

  // Performance auditing
  const lighthouse = await detectLighthouse();
  if (lighthouse.available) {
    capabilities.performance = true;
  }

  // Security scanning
  const semgrep = await detectMCPServer('semgrep');
  if (semgrep.available) {
    capabilities.security = true;
  }

  // Code quality
  const skills = await detectAgentSkills();
  if (skills.available) {
    capabilities.codeQuality = true;
  }

  return capabilities;
}

// Usage in build pipeline
const caps = await detectCapabilities(projectPath);

console.log('\n--- Build Capabilities ---');
console.log(`E2E Testing: ${caps.e2e ? '✓' : '✗ (install Playwright)'}`);
console.log(`Accessibility: ${caps.a11y ? '✓' : '✗ (requires Playwright)'}`);
console.log(`Performance: ${caps.performance ? '✓' : '✗ (install Lighthouse)'}`);
console.log(`Security: ${caps.security ? '✓' : '✗ (enable Semgrep MCP)'}`);
console.log(`Code Quality: ${caps.codeQuality ? '✓' : '✗ (install @vercel/agent-skills)'}`);
console.log(`\nQuality Tier: ${determineQualityTier(caps)}\n`);
```

---

#### Pattern 3: Capability Tiers

```javascript
/**
 * Determine quality tier based on available capabilities
 */
function determineQualityTier(capabilities) {
  const qualityScore = [
    capabilities.e2e,
    capabilities.a11y,
    capabilities.performance,
    capabilities.security,
    capabilities.codeQuality,
  ].filter(Boolean).length;

  if (qualityScore === 5) return 'PREMIUM (Full quality suite)';
  if (qualityScore >= 3) return 'ENHANCED (Most quality tools)';
  if (qualityScore >= 1) return 'STANDARD (Some quality tools)';
  return 'BASELINE (Core tools only)';
}
```

---

### Messaging Standards (Implementation Pattern)

#### Pattern 1: Capability Report

```javascript
/**
 * Display capability report to user
 */
function displayCapabilityReport(capabilities) {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║      BUILD CAPABILITY REPORT           ║');
  console.log('╚════════════════════════════════════════╝\n');

  const tier = determineQualityTier(capabilities);
  console.log(`Quality Tier: ${tier}\n`);

  console.log('Available Tools:');
  console.log(`  ${capabilities.e2e ? '✓' : '✗'} E2E Testing (Playwright)`);
  console.log(`  ${capabilities.a11y ? '✓' : '✗'} Accessibility Audits (Axe-core)`);
  console.log(`  ${capabilities.performance ? '✓' : '✗'} Performance Audits (Lighthouse)`);
  console.log(`  ${capabilities.security ? '✓' : '✗'} Security Scanning (Semgrep)`);
  console.log(`  ${capabilities.codeQuality ? '✓' : '✗'} Code Quality Audits (agent-skills)`);

  if (!capabilities.e2e) {
    console.log('\nℹ Upgrade to Enhanced tier:');
    console.log('  npm install -D playwright');
    console.log('  npx playwright install');
  }

  console.log('\n');
}
```

---

#### Pattern 2: Progressive Disclosure

```javascript
/**
 * Display tool unavailability with progressive detail levels
 */
function displayToolUnavailable(tool, context) {
  // Level 1: Basic (always show)
  console.warn(`⚠ ${tool.name} unavailable. ${tool.feature} will be skipped.`);

  // Level 2: Installation (if relevant)
  if (tool.installCommand) {
    console.log(`  Install: ${tool.installCommand}`);
  }

  // Level 3: Context (if user needs more info)
  if (context.verbose) {
    console.log(`  Why needed: ${tool.purpose}`);
    console.log(`  Impact: ${tool.impact}`);
    console.log(`  Docs: ${tool.docsUrl}`);
  }
}

// Usage
displayToolUnavailable(
  {
    name: 'Playwright',
    feature: 'E2E testing',
    installCommand: 'npm install -D playwright && npx playwright install',
    purpose: 'Test real user interactions in browser',
    impact: 'Build continues with HTTP-only verification (reduced coverage)',
    docsUrl: 'https://playwright.dev',
  },
  { verbose: false }
);
```

---

### Governance Model (Implementation)

#### 1. MCP Server Governance

**File**: `/docs/governance/MCP_SERVER_GOVERNANCE.md`

```markdown
# MCP Server Governance

## Authority

- **Owner**: Root orchestrator (CLAUDE.md)
- **Configuration**: .mcp.json in repository root
- **Approval**: Requires ADR for changes

## Enabled Servers

| Server     | Purpose               | Network                | Required Credentials         | Status  |
| ---------- | --------------------- | ---------------------- | ---------------------------- | ------- |
| github     | Repository management | Yes                    | GITHUB_PERSONAL_ACCESS_TOKEN | Enabled |
| playwright | Browser automation    | Yes (browser download) | None                         | Enabled |
| filesystem | Local file operations | No                     | None                         | Enabled |
| context7   | Documentation lookup  | Yes                    | API key (optional)           | Enabled |
| semgrep    | Security scanning     | Yes (rules update)     | None                         | Enabled |

## Adding a Server

1. Create ADR: `docs/adr/NNNN-add-mcp-server-NAME.md`
2. Document purpose, network usage, credentials
3. Add to `.mcp.json` with `"enabled": false`
4. Update pipeline CLAUDE.md files (detection required)
5. Add to MCP_INTEGRATION.md
6. Require 1 release cycle before enabling by default

## Removing a Server

1. Set `"enabled": false` in `.mcp.json`
2. Add deprecation notice to CHANGELOG
3. Wait 1 release cycle
4. Remove from `.mcp.json`
5. Update documentation

## Security Policy

- All MCP servers MUST detect availability before use
- All MCP servers MUST degrade gracefully if unavailable
- Credentials MUST be in environment variables, never committed
- Network-using servers MUST be documented in CLAUDE.md
```

---

#### 2. Skills Catalog

**File**: `/docs/governance/SKILLS_CATALOG.md`

```markdown
# Skills Catalog

This document tracks all external tools, MCP servers, and skills used by App Factory pipelines.

## Baseline Tier (Always Available)

| Tool    | Purpose         | Version | Detection       |
| ------- | --------------- | ------- | --------------- |
| Node.js | Runtime         | ≥18     | process.version |
| npm     | Package manager | ≥8      | npm --version   |
| Git     | Version control | ≥2.0    | git --version   |

Baseline tools MUST be available or build fails immediately with clear error.

## Quality Tier (Optional, High ROI)

| Tool                 | Purpose            | Pipelines          | Detection            | Fallback    |
| -------------------- | ------------------ | ------------------ | -------------------- | ----------- |
| Playwright           | E2E testing        | web, dapp, miniapp | detectPlaywright()   | HTTP-only   |
| Lighthouse           | Performance audit  | web, dapp          | detectLighthouse()   | Skip audit  |
| Axe-core             | Accessibility      | web, dapp          | (via Playwright)     | Skip audit  |
| @vercel/agent-skills | Code quality       | web, dapp          | detectAgentSkills()  | ESLint only |
| Ralph QA             | Adversarial review | All                | existsSync('ralph/') | Manual mode |

Quality tools MUST be detected before use. Build continues without them.

## Advanced Tier (Optional, Specialized)

| Tool      | Purpose       | Pipelines          | Detection                   | Fallback      |
| --------- | ------------- | ------------------ | --------------------------- | ------------- |
| Figma MCP | Design import | web, app           | detectMCPServer('figma')    | Manual design |
| Semgrep   | Security scan | All                | detectMCPServer('semgrep')  | Skip scan     |
| Supabase  | Database      | web, dapp, miniapp | detectMCPServer('supabase') | Local storage |

Advanced tools MUST NOT block builds. Silent skip acceptable.

## Adding a Tool

1. Determine tier (baseline/quality/advanced)
2. Create ADR if baseline or quality tier
3. Add detection function to `/core/src/capability-detection.ts`
4. Add fallback strategy
5. Update pipeline CLAUDE.md
6. Update pipeline run.mjs with detection call
7. Add to this catalog
8. Test with tool absent

## Approval Requirements

- **Baseline tier**: Requires maintainer vote (high bar)
- **Quality tier**: Requires ADR + implementation plan
- **Advanced tier**: Self-service (document only)
```

---

#### 3. Detection Function Library

**File**: `/core/src/capability-detection.ts` (or vendored per pipeline)

```typescript
/**
 * Capability Detection Library
 *
 * All detection functions follow this contract:
 * - Return { available: boolean, ... }
 * - Timeout after 5 seconds
 * - Never throw (catch internally)
 * - Log to audit trail if logging available
 */

export interface DetectionResult {
  available: boolean;
  version?: string;
  error?: string;
  capabilities?: string[];
}

export async function detectPlaywright(): Promise<DetectionResult> {
  try {
    const { chromium } = await import('playwright');
    return {
      available: true,
      version: chromium.version(),
      capabilities: ['chromium', 'firefox', 'webkit'],
    };
  } catch (error) {
    return {
      available: false,
      error: error.code === 'MODULE_NOT_FOUND' ? 'Not installed' : error.message,
    };
  }
}

export async function detectLighthouse(): Promise<DetectionResult> {
  try {
    const { execSync } = await import('child_process');
    const version = execSync('npx lighthouse --version', {
      encoding: 'utf-8',
      timeout: 5000,
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();

    return { available: true, version };
  } catch (error) {
    return { available: false, error: 'Not installed or not in PATH' };
  }
}

export async function detectAgentSkills(): Promise<DetectionResult> {
  try {
    // Check if @vercel/agent-skills is available
    await import('@vercel/agent-skills');
    return { available: true };
  } catch (error) {
    return { available: false, error: 'Not installed' };
  }
}

export async function detectMCPServer(serverName: string): Promise<DetectionResult> {
  try {
    const { readFileSync } = await import('fs');
    const { join } = await import('path');

    const mcpPath = join(process.env.HOME || '', '.config/claude-code/mcp-config.json');
    const config = JSON.parse(readFileSync(mcpPath, 'utf-8'));

    const server = config.mcpServers?.[serverName];
    if (!server) {
      return { available: false, error: 'Not in .mcp.json' };
    }

    if (server.enabled === false) {
      return { available: false, error: 'Disabled in config' };
    }

    // Server exists and enabled (assume available)
    // Actual probe would require MCP protocol implementation
    return { available: true };
  } catch (error) {
    return { available: false, error: error.message };
  }
}

export async function detectAllCapabilities() {
  const [playwright, lighthouse, skills, github, semgrep] = await Promise.all([
    detectPlaywright(),
    detectLighthouse(),
    detectAgentSkills(),
    detectMCPServer('github'),
    detectMCPServer('semgrep'),
  ]);

  return {
    playwright,
    lighthouse,
    skills,
    mcp: {
      github,
      semgrep,
    },
  };
}
```

---

## 9. Final Verdict

### Current Safety Score: C+ (70/100)

**Breakdown:**

- **Baseline functionality**: A (Works when all tools present)
- **Optional tool handling**: F (No detection, cryptic failures)
- **Documentation accuracy**: C (Promises features not implemented)
- **User experience**: C- (Breaking points for new users)
- **Governance clarity**: D (Contradictions, fragmented authority)

**Trend**: Improving (Tier-1 and Tier-2 fixes raised from D to C+)

---

### Blocking Issues Requiring Immediate Fix

#### P0-1: Fix "Offline by Default" Contradiction (BLOCKER)

**Issue**: Root CLAUDE.md declares "Offline by Default" but .mcp.json enables 5 network-using servers.

**Impact**: Governance violation, user trust issue

**Fix Options:**

1. **Option A** (Recommended): Update Invariant 4 to "Offline by default EXCEPT enabled MCP servers (github, playwright, context7, semgrep)"
2. **Option B**: Disable MCP servers by default, require opt-in
3. **Option C**: Add MCP authorization gate on first use

**Effort**: 30 minutes (documentation update)

**Implementation**:

```markdown
# Root CLAUDE.md update

4. Offline by Default\* - no network without authorization

\*Exception: MCP servers enabled in .mcp.json are authorized to make network calls for their documented purposes (GitHub API, browser downloads, documentation lookup, security rules). To disable, set "enabled": false in .mcp.json.
```

---

#### P0-2: Add Runtime Detection to ALL Optional Tool Uses (BLOCKER)

**Issue**: Zero runtime detection for Playwright, @vercel/agent-skills, Ralph, MCP servers before use.

**Impact**: Cryptic build failures, silent feature degradation

**Fix**: Add detection before every optional tool use in all 6 pipeline run.mjs files.

**Effort**: 4-6 hours (implementation across pipelines)

**Example Implementation** (website-pipeline):

```javascript
// In website-pipeline/scripts/run.mjs

import { detectPlaywright, detectAgentSkills } from './lib/capability-detection.mjs';

async function runVerification(projectPath, url) {
  const playwright = await detectPlaywright();

  if (playwright.available) {
    console.log('✓ Running E2E tests with Playwright...');
    await runPlaywrightTests(projectPath, url);
  } else {
    console.warn('⚠ Playwright not found. E2E tests skipped.');
    console.warn('  Install: npm install -D playwright && npx playwright install');
    console.log('  Continuing with HTTP-only verification...');
    await runHTTPVerification(url);
  }
}

async function runSkillsAudit(projectPath) {
  const skills = await detectAgentSkills();

  if (skills.available) {
    console.log('Running skills audits...');
    await runSkillsAuditImpl(projectPath);
  } else {
    console.warn('⚠ @vercel/agent-skills not found. Code quality audit skipped.');
    console.warn('  Install: npm install -D @vercel/agent-skills');
    console.log('  Continuing with ESLint-only checks...');
    await runESLint(projectPath);
  }
}
```

---

#### P0-3: Fix website-pipeline "Mandatory Skills Audits" Lie (BLOCKER)

**Issue**: website-pipeline CLAUDE.md declares "Mandatory Skills Audits" in title and Phase 6, but run.mjs skips Phase 6 entirely.

**Impact**: Massive expectation violation, users expect ≥95% quality

**Fix Options:**

1. **Option A**: Implement Phase 6 with detection + fallback
2. **Option B**: Remove "mandatory" language, mark as "planned"
3. **Option C**: Change to "optional" and implement with opt-in

**Recommended**: Option A (implement with fallback)

**Effort**: 2-3 hours

**Implementation**:

```javascript
// Phase 6: Skills Audit (with fallback)
async function runPhase6SkillsAudit(projectPath) {
  setPhase(5, 'active'); // Add 6th phase

  const skills = await detectAgentSkills();

  if (skills.available) {
    console.log('Phase 6/6: Skills Audit');
    const reactScore = await runSkillAudit(projectPath, 'react-best-practices');
    const designScore = await runSkillAudit(projectPath, 'web-design-guidelines');

    if (reactScore >= 95 && designScore >= 90) {
      console.log(`✓ Skills audits: PASS (React: ${reactScore}%, Design: ${designScore}%)`);
      setPhase(5, 'complete');
    } else {
      console.warn(`⚠ Skills audits below threshold`);
      console.warn(`  React: ${reactScore}/100 (target: 95)`);
      console.warn(`  Design: ${designScore}/100 (target: 90)`);
      setPhase(5, 'complete'); // Continue anyway
    }
  } else {
    console.log('Phase 6/6: Skills Audit (Degraded Mode)');
    console.warn('⚠ @vercel/agent-skills unavailable');
    console.log('  Running ESLint as fallback...');
    await runESLint(projectPath);
    setPhase(5, 'complete');
  }
}
```

---

### Recommended vs. Optional Improvements

#### P1 (High Priority - Pre-Production)

| Issue                           | Fix                                                   | Effort   | Impact                      |
| ------------------------------- | ----------------------------------------------------- | -------- | --------------------------- |
| Ralph QA automation gaps        | Add opt-in Ralph automation to pipelines              | 1 day    | Users get documented QA     |
| LOCAL_RUN_PROOF bypassed        | Enforce gate in all pipelines (mostly done in Tier-2) | 2 hours  | Verification integrity      |
| Playwright 500MB surprise       | Add size warning before download                      | 30 min   | Better UX                   |
| Skills audit script placeholder | Implement actual skills audit                         | 1-2 days | Feature works as documented |
| MCP server failure handling     | Add detection + fallback for all MCP uses             | 4 hours  | Graceful degradation        |

---

#### P2 (Quality Improvement - Post-Production)

| Issue                        | Fix                             | Effort  | Impact                 |
| ---------------------------- | ------------------------------- | ------- | ---------------------- |
| Add Lighthouse audits        | Integrate into web pipelines    | 1 day   | Performance visibility |
| Add Axe-core a11y audits     | Integrate with Playwright       | 4 hours | Accessibility          |
| Capability tier dashboard    | Show user which tier they're in | 2 hours | Transparency           |
| MCP permission prompts       | Add authorization gate          | 1 day   | User control           |
| Skills catalog documentation | Create SKILLS_CATALOG.md        | 2 hours | Developer clarity      |
| Detection function library   | Vendor to all pipelines         | 4 hours | Reusability            |

---

### Implementation Priority

**Week 1 (P0 - Blockers):**

1. Day 1: Fix "Offline by Default" documentation
2. Day 2-3: Add runtime detection to all pipelines
3. Day 4-5: Implement website-pipeline Phase 6 with fallback

**Week 2 (P1 - High Priority):**

1. Day 1-2: Add Ralph QA opt-in automation
2. Day 3: Implement skills audit script (real version)
3. Day 4-5: MCP server detection + fallback

**Week 3 (P2 - Quality):**

1. Day 1-2: Add Lighthouse + Axe-core
2. Day 3: Capability tier dashboard
3. Day 4-5: Documentation (catalog, governance)

---

### Final Answer: "How do we make App Factory better with skills without ever requiring them?"

**The Answer: Capability-Aware Architecture with Detect → Degrade → Message**

#### Core Philosophy

1. **Three Tiers of Tools**:
   - Baseline (required) - Build fails fast if missing
   - Quality (optional) - Enhance output, skip gracefully if missing
   - Advanced (optional) - Specialized features, silent skip if missing

2. **Detection Before Use**:
   - Runtime check BEFORE invoking any optional tool
   - 5-second timeout, never block
   - Cache results for performance

3. **Graceful Degradation**:
   - Baseline tier: Fail fast with clear error
   - Quality tier: Skip with warning + suggestion
   - Advanced tier: Silent skip (maybe log)

4. **Clear Messaging**:
   - Tell user which tier they're operating in
   - Show what's available vs. unavailable
   - Provide installation instructions (optional)
   - Never hide capability level

5. **No False Promises**:
   - Documentation matches implementation
   - "Mandatory" means actually enforced
   - "Optional" means build succeeds without it
   - "Planned" means not implemented yet

#### Concrete Example

**Before (Current - Unsafe):**

```javascript
// website-pipeline/scripts/run.mjs
async function main() {
  await scaffold();
  await install();
  await verify(); // Assumes Playwright exists
  await skillsAudit(); // Documented as mandatory, but function doesn't exist!
  outputLaunchCard(); // Claims success even if verification failed
}
```

**After (Capability-Aware - Safe):**

```javascript
// website-pipeline/scripts/run.mjs
async function main() {
  // Detect capabilities upfront
  const caps = await detectCapabilities();
  displayCapabilityReport(caps);

  await scaffold();
  await install();

  // Verify with best available tool
  if (caps.playwright) {
    await verifyWithPlaywright();
  } else {
    await verifyWithHTTP();
  }

  // Quality checks (optional)
  if (caps.skills) {
    await runSkillsAudit();
  } else {
    console.warn('⚠ Skills audits unavailable. Install: npm i -D @vercel/agent-skills');
    await runESLint(); // Fallback
  }

  // Ralph QA (opt-in)
  if (await askUserYesNo('Run Ralph QA? (Recommended)')) {
    await runRalphIterations();
  }

  // Only output launch card if verification passed
  if (checkRunCertificate(projectPath)) {
    outputLaunchCard(caps); // Include capability tier
  } else {
    console.error('Build failed verification. See RUN_FAILURE.json');
    process.exit(1);
  }
}
```

#### User Experience Outcome

**New user clones App Factory with only Node.js:**

```
$ cd website-pipeline && claude
> "Build me a portfolio site"

Detecting capabilities...

╔════════════════════════════════════════╗
║      BUILD CAPABILITY REPORT           ║
╚════════════════════════════════════════╝

Quality Tier: BASELINE (Core tools only)

Available Tools:
  ✓ Next.js (framework)
  ✓ React (library)
  ✓ TypeScript (type checking)
  ✓ ESLint (code quality)
  ✗ E2E Testing (Playwright)
  ✗ Accessibility Audits (Axe-core)
  ✗ Performance Audits (Lighthouse)
  ✗ Code Quality Audits (agent-skills)

ℹ Upgrade to ENHANCED tier:
  npm install -D playwright @vercel/agent-skills
  npx playwright install

Building with Baseline tier...

Phase 1/5: Inputs [complete]
Phase 2/5: Scaffold [complete]
Phase 3/5: Install [complete]
Phase 4/5: Verify (HTTP-only) [complete]
Phase 5/5: Launch [complete]

✓ BUILD SUCCESSFUL

╔════════════════════════════════════════╗
║         YOUR SITE IS READY             ║
╚════════════════════════════════════════╝

Quality Tier: BASELINE
E2E Tests: SKIPPED (Playwright unavailable)
Skills Audits: SKIPPED (agent-skills unavailable)

To run locally:
  cd website-builds/my-portfolio
  npm run dev
  → http://localhost:3000

To upgrade quality:
  ./scripts/setup-quality-tools.sh
```

**Key Improvements:**

1. User knows EXACTLY what happened
2. No surprises (no 500MB downloads)
3. No false confidence (clearly says "BASELINE")
4. Clear path to upgrade (installation commands)
5. Build succeeded (graceful degradation worked)

---

### Success Metrics

After implementing capability-aware architecture:

**Objective Measures:**

- Detection coverage: 100% (every optional tool checked)
- Graceful degradation rate: 100% (no hard failures on missing tools)
- Documentation accuracy: 95%+ (promises match implementation)
- First-time user success rate: 90%+ (build succeeds with Node.js only)

**Subjective Measures:**

- User trust: "I know what's happening"
- User control: "I can choose my quality tier"
- Developer confidence: "Code matches docs"

---

### Conclusion

App Factory has solid foundations (Tier-1 and Tier-2 fixes) but dangerous assumptions about tool availability. The path forward is clear:

1. **Fix P0 blockers** (documentation contradictions, detection gaps)
2. **Implement capability-aware architecture** (detect → degrade → message)
3. **Align documentation with reality** (no false promises)
4. **Provide clear tier messaging** (baseline/quality/advanced)
5. **Enable optional quality upgrades** (never required, always beneficial)

The repository can achieve **A grade** (90+/100) by implementing the P0 and P1 fixes outlined in this report. The key insight: **Skills make App Factory better, but safety requires treating them as optional with runtime detection and graceful degradation.**

**Final Grade Path:**

- Current: C+ (70/100)
- After P0 fixes: B (80/100)
- After P1 fixes: B+ (85/100)
- After P2 fixes: A- (90/100)
- With full governance: A (95/100)

---

**Report Complete**
**Agent G - Systems Architect (Synthesis)**
**Date**: 2026-01-24
**Total Investigation Time**: 6 agents × ~2 hours = 12 agent-hours
**Evidence Base**: 48 files analyzed, 6 pipelines audited, industry research conducted
**Recommendations**: 14 P0/P1 fixes, 6 P2 improvements, complete governance framework
