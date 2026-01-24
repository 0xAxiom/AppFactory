# Network-Enabled Skills Architecture - Implementation Summary

**Date**: 2026-01-24
**Philosophy Change**: Removed "offline by default" → Network-enabled by default
**Status**: Phase 1 Complete (Governance + Library), Phase 2 In Progress (Pipeline Wiring)

---

## EXECUTIVE SUMMARY

App Factory has transitioned from a contradictory "offline by default" model to an honest **network-enabled by default** model with **capability-aware execution**. This implementation removes false claims from governance documents, enhances the skill detection library, and lays the foundation for Detect → Degrade → Message patterns across all pipelines.

### What Changed

1. **Root Constitution** ([CLAUDE.md](CLAUDE.md)) - Updated Invariant 4 from "Offline by Default" to "Capability-Aware Execution"
2. **All 6 Pipeline Constitutions** - Removed network access prohibitions
3. **Skill Detection Library** ([scripts/lib/skill-detection.mjs](scripts/lib/skill-detection.mjs)) - Enhanced with 30+ detectors, tier system, and messaging framework
4. **Vendored Libraries** - Copied enhanced skill-detection.mjs to all 6 pipeline `scripts/lib/` directories

### What Remains

1. **Pipeline Wiring** - Integrate detection into all 6 pipeline `run.mjs` files
2. **Skills Audit Implementation** - Replace placeholder in `scripts/run-skills-audit.sh`
3. **Ralph QA Automation** - Wire auto-run logic into pipelines (optional opt-in)
4. **Testing** - Verify graceful degradation works when tools are missing

---

## PHASE 1: GOVERNANCE & LIBRARY (✅ COMPLETE)

### 1.1 Root Constitution Changes

**File**: [CLAUDE.md](CLAUDE.md)

#### Invariant 4: Changed Definition

**Before**:
```markdown
4. Offline by Default - no network without authorization
```

**After**:
```markdown
4. Capability-Aware Execution - tools are optional, network is available
```

#### Added Network Access Note

```markdown
**Note on Network Access**: App Factory is network-enabled by default. Claude, MCP servers
(github, playwright, context7, semgrep), and quality tools (Lighthouse, skills audits) use
network access for their functions. Network connectivity is assumed available unless
explicitly disabled. Tools degrade gracefully if unavailable—network access itself is not gated.
```

#### Removed Network Prohibition References

- Line 27: Changed "Make network calls" description
- Line 179: Updated example approval card text
- Line 460: Updated conflict resolution language
- Line 586: Updated inheritance table
- Line 612: Updated non-override guarantee

**Impact**: Root constitution now accurately reflects reality (5 MCP servers enabled by default).

---

### 1.2 Pipeline Constitution Changes

Updated all 6 pipeline CLAUDE.md files to remove contradictory network prohibitions:

#### [app-factory/CLAUDE.md](app-factory/CLAUDE.md)
- ✅ Updated Invariant 4 (line 638): "Offline by Default" → "Capability-Aware Execution"
- ✅ Removed "Execute network calls without authorization" from prohibitions (line 469)
- ✅ Kept application feature "Offline-first apps" (line 47) - this refers to *generated app behavior*, not pipeline behavior

#### [website-pipeline/CLAUDE.md](website-pipeline/CLAUDE.md)
- ✅ Updated Invariant 4 (line 760)
- ✅ Removed "Execute network calls without authorization" prohibition (line 612)
- ✅ Removed "Make it work offline first" refusal (line 626)

#### [dapp-factory/CLAUDE.md](dapp-factory/CLAUDE.md)
- ✅ Removed "Make network calls without auth | Offline by default" (line 24)
- ✅ Removed "MUST NOT make network calls without explicit authorization" (line 330)

#### [agent-factory/CLAUDE.md](agent-factory/CLAUDE.md)
- ✅ Removed "Make network calls without auth | Offline by default" (line 26)

#### [plugin-factory/CLAUDE.md](plugin-factory/CLAUDE.md)
- ✅ Removed "Make network calls without auth | Offline by default" (line 29)

#### [miniapp-pipeline/CLAUDE.md](miniapp-pipeline/CLAUDE.md)
- ✅ No changes needed (already had no "offline" references)

**Impact**: All pipeline constitutions now align with root orchestrator's honest network-enabled model.

---

### 1.3 Enhanced Skill Detection Library

**File**: [scripts/lib/skill-detection.mjs](scripts/lib/skill-detection.mjs)

#### Added Detectors (30+ total)

**Quality Tier**:
- `playwright` - E2E testing (existing, enhanced)
- `lighthouse` - Performance audits
- `axe` - Accessibility testing
- `vercel-agent-skills` - Code quality audits (existing)
- `eslint` - Linting (existing)
- `prettier` - Code formatting (existing)
- `ralph` - QA automation (existing)
- `npm-audit` - Security scanning (existing)
- `semgrep` - Advanced security (existing)

**Advanced Tier**:
- `vercel-cli` - Deployment
- `expo-cli` - Mobile deployment
- `supabase` - Database tools
- `stripe` - Payment SDKs
- `revenuecat` - In-app purchase SDKs (env var detection)
- `e2b` - Code execution sandbox
- `figma` - Design tools (env var detection)

**MCP Servers**:
- `mcp-github` - GitHub integration (existing)
- `mcp-playwright` - Browser automation (existing)
- `mcp-context7` - Documentation lookup (existing)
- `mcp-semgrep` - Security scanning (existing)
- `mcp-figma` - Design import
- `mcp-supabase` - Database integration
- `mcp-filesystem` - Local file operations (existing)

#### New Functions

**Detection**:
- `detectHeavyDependency(skillName)` - Detects heavy dependencies like Playwright browsers (~500MB)
- `checkEnvironmentVars(varNames)` - Checks for required env vars
- `getDetailedCapabilities(options)` - Comprehensive capability analysis with tier determination

**Tier Analysis**:
- `detectSkillsByTier(skillsByTier)` - Batch detection with tier-level recommendations
- Returns: `{ tier, missing, available, recommendations }`

**Messaging**:
- `detectDegradeMessage(skillName, onAvailable, onUnavailable, options)` - Complete Detect → Degrade → Message pattern
- Enhanced `DEGRADATION_MESSAGES` with fallback and alternative fields for all skills
- Enhanced `printCapabilityReport()` with detailed tier display

#### Usage Example

```javascript
import {
  detectSkill,
  getDetailedCapabilities,
  printCapabilityReport,
  detectDegradeMessage
} from './lib/skill-detection.mjs';

// Upfront capability detection
const capabilities = await getDetailedCapabilities();
printCapabilityReport(capabilities, { detailed: true });
// Displays: "Quality Tier: BASELINE (Core tools only)" with upgrade suggestions

// Use Detect → Degrade → Message pattern
await detectDegradeMessage(
  'playwright',
  async () => {
    // Playwright available - run E2E tests
    await runPlaywrightTests();
  },
  async () => {
    // Playwright unavailable - fallback to HTTP-only verification
    await runHTTPVerification();
  }
);
// Automatically displays: "⚠️ Playwright not available - skipping browser verification"
//                         "Using HTTP-only verification instead"
//                         "💡 Install Playwright: npm install -D playwright && npx playwright install"
```

#### Vendored to All Pipelines

The enhanced library (905 lines) was copied to all 6 pipeline lib directories:
- ✅ `app-factory/scripts/lib/skill-detection.mjs`
- ✅ `dapp-factory/scripts/lib/skill-detection.mjs`
- ✅ `website-pipeline/scripts/lib/skill-detection.mjs`
- ✅ `agent-factory/scripts/lib/skill-detection.mjs`
- ✅ `plugin-factory/scripts/lib/skill-detection.mjs`
- ✅ `miniapp-pipeline/scripts/lib/skill-detection.mjs`

**Impact**: All pipelines now have access to comprehensive capability detection with graceful degradation messaging.

---

## PHASE 2: PIPELINE WIRING (⏳ IN PROGRESS)

### 2.1 Partial Implementation: website-pipeline

**File**: [website-pipeline/scripts/run.mjs](website-pipeline/scripts/run.mjs)

**Current State**:
- ✅ Already has `runSkillsAudits()` function (lines 581-620)
- ✅ Detects `vercel-agent-skills` and shows degradation messages
- ✅ Calls skills audit script if available

**Still Needed**:
1. Add upfront capability detection at start of `main()`
2. Display capability report to user
3. Add Playwright detection in `verifyProject()` phase
4. Add Lighthouse detection after verification
5. Add Ralph QA opt-in prompt at end

### 2.2 Implementation Pattern (Reference)

Here's the recommended pattern for wiring detection into all pipelines:

#### Step 1: Import Detection Library (Top of File)

```javascript
import {
  getDetailedCapabilities,
  printCapabilityReport,
  detectDegradeMessage
} from './lib/skill-detection.mjs';
```

#### Step 2: Add Capability Detection Phase (Start of main())

```javascript
async function main() {
  const config = parseArgs();

  console.log(`\n${BOLD}${CYAN}Website Pipeline${RESET}\n`);

  // ═══ CAPABILITY DETECTION PHASE ═══
  console.log(`${CYAN}Detecting available capabilities...${RESET}\n`);

  const capabilities = await getDetailedCapabilities({
    checkBaseline: true,
    checkQuality: true,
    checkAdvanced: false // Skip advanced for faster startup
  });

  printCapabilityReport(capabilities, {
    detailed: true,
    showAll: true
  });

  // Continue with existing phases...
  await gatherInputs(config.skipPrompts);
  // ...
}
```

**Output to User**:
```
Detecting available capabilities...

╔═════════════════════════════════════════╗
║      BUILD CAPABILITY REPORT            ║
╚═════════════════════════════════════════╝

Quality Tier: BASELINE (Core tools only)

Quality Tools:
  ✗ playwright
  ✗ lighthouse
  ✗ axe
  ✗ agent-skills
  ✓ eslint
  ✓ prettier
  ✗ ralph

ℹ Upgrade to QUALITY tier:
  npm install -D playwright @vercel/agent-skills
  npx playwright install
```

#### Step 3: Use Detect → Degrade → Message in Verification Phase

```javascript
async function verifyProject(projectPath, port) {
  console.log(`${CYAN}Phase 4: Verification${RESET}\n`);

  // Detect → Degrade → Message for Playwright E2E tests
  await detectDegradeMessage(
    'playwright',
    async () => {
      // Playwright available - run full E2E tests
      console.log(`${GREEN}Running E2E tests with Playwright...${RESET}`);
      await runPlaywrightTests(projectPath, port);
    },
    async () => {
      // Playwright unavailable - fallback to HTTP-only
      console.log(`${YELLOW}Running HTTP-only verification...${RESET}`);
      await runHTTPVerification(projectPath, port);
    },
    { showMessages: true, fallbackMessage: true }
  );

  // Detect → Degrade → Message for Lighthouse performance audit
  await detectDegradeMessage(
    'lighthouse',
    async () => {
      console.log(`${GREEN}Running Lighthouse performance audit...${RESET}`);
      const score = await runLighthouse(projectPath, port);
      console.log(`${GREEN}✓ Performance score: ${score}/100${RESET}`);
    },
    async () => {
      console.log(`${DIM}Lighthouse unavailable - skipping performance audit${RESET}`);
    },
    { showMessages: true }
  );

  return true;
}
```

#### Step 4: Add Ralph QA Opt-In (End of main())

```javascript
async function main() {
  // ... existing phases ...

  // Phase 6: Launch card (only shown if certificate exists with PASS)
  showLaunchCard(projectPath, config.port);

  // ═══ OPTIONAL: RALPH QA ═══
  const hasRalph = await detectSkill('ralph');
  if (hasRalph && !config.skipPrompts) {
    const runRalph = await askYesNo('Run Ralph QA adversarial review? (Recommended)', 'y');

    if (runRalph) {
      console.log(`${CYAN}Starting Ralph QA loop (max 5 iterations)...${RESET}\n`);
      await runRalphIterations(projectPath, 5);
    } else {
      console.log(`${DIM}Skipping Ralph QA - manual review recommended for production${RESET}\n`);
    }
  }
}
```

### 2.3 Remaining Pipeline Wiring Work

| Pipeline | File | Status | Effort |
|----------|------|--------|--------|
| website-pipeline | `scripts/run.mjs` | Partial (has skills audit detection) | 2 hours |
| app-factory | `scripts/run.mjs` | Not started | 2 hours |
| dapp-factory | `scripts/run.mjs` | Not started | 2 hours |
| agent-factory | `scripts/run.mjs` | Not started | 1.5 hours |
| plugin-factory | `scripts/run.mjs` | Not started | 1.5 hours |
| miniapp-pipeline | `scripts/run.mjs` | Not started | 2 hours |

**Total Estimated Effort**: 11 hours (1-2 days)

### 2.4 Testing Checklist

After wiring detection, test each pipeline in these scenarios:

**Baseline Tier** (only Node.js + npm):
- [ ] Pipeline runs without crashing
- [ ] Capability report shows "BASELINE (Core tools only)"
- [ ] Degradation messages appear for missing quality tools
- [ ] Build completes successfully
- [ ] Output artifacts are functional

**Quality Tier** (+ Playwright + agent-skills):
- [ ] Capability report shows "QUALITY (Enhanced with quality tools)"
- [ ] E2E tests run with Playwright
- [ ] Skills audits execute
- [ ] No degradation messages for quality tools
- [ ] Build completes successfully

**Advanced Tier** (+ MCP servers + specialized tools):
- [ ] Capability report shows "ADVANCED (Full suite available)"
- [ ] All quality + advanced features work
- [ ] MCP servers are detected and used
- [ ] Build completes successfully

---

## PHASE 3: SKILLS AUDIT IMPLEMENTATION (⏸️ PENDING)

### Current State

**File**: [scripts/run-skills-audit.sh](scripts/run-skills-audit.sh)

**Problem**: Script exists but is a placeholder (line 187: "NOT IMPLEMENTED")

```bash
# Current implementation (non-functional)
function run_audit() {
  local PROJECT_PATH="$1"
  local SKILL_NAME="$2"

  echo "⚠️  Skills audit functionality not yet implemented"
  echo "Actual implementation requires @vercel/agent-skills integration"
  return 1
}
```

### Recommended Implementation

#### Option A: Use @vercel/agent-skills (if available)

```bash
function run_audit() {
  local PROJECT_PATH="$1"
  local SKILL_NAME="$2"
  local THRESHOLD="${3:-95}"

  # Check if @vercel/agent-skills is available
  if ! command -v agent-skills &> /dev/null; then
    echo "⚠️  @vercel/agent-skills not found"
    echo "Install: npm install -g @vercel/agent-skills"
    return 1
  fi

  # Run skill audit
  echo "Running skill audit: $SKILL_NAME (threshold: $THRESHOLD%)"

  local SCORE=$(agent-skills audit "$PROJECT_PATH" --skill "$SKILL_NAME" --format json | jq '.score')

  if [ "$SCORE" -ge "$THRESHOLD" ]; then
    echo "✓ $SKILL_NAME: $SCORE% (PASS)"
    return 0
  else
    echo "✗ $SKILL_NAME: $SCORE% (FAIL - threshold: $THRESHOLD%)"
    return 1
  fi
}
```

#### Option B: Fallback to ESLint + Custom Rules

```bash
function run_audit_fallback() {
  local PROJECT_PATH="$1"
  local SKILL_NAME="$2"

  echo "⚠️  @vercel/agent-skills not available - using ESLint fallback"

  cd "$PROJECT_PATH"

  case "$SKILL_NAME" in
    react-best-practices)
      npx eslint . --ext .js,.jsx,.ts,.tsx --format json > /tmp/eslint-report.json
      # Parse and score ESLint results
      local ERRORS=$(jq '[.[] | .errorCount] | add' /tmp/eslint-report.json)
      if [ "$ERRORS" -eq 0 ]; then
        echo "✓ ESLint: 0 errors (PASS)"
        return 0
      else
        echo "✗ ESLint: $ERRORS errors (FAIL)"
        return 1
      fi
      ;;
    *)
      echo "⚠️  No fallback available for skill: $SKILL_NAME"
      return 1
      ;;
  esac
}
```

#### Option C: Mark as Planned Feature

If implementing skills audits is not a priority:

```bash
function run_audit() {
  local PROJECT_PATH="$1"
  local SKILL_NAME="$2"

  echo "ℹ️  Skills audit: $SKILL_NAME (Status: PLANNED - Not Yet Implemented)"
  echo ""
  echo "Current workaround:"
  echo "  1. Run ESLint: cd $PROJECT_PATH && npm run lint"
  echo "  2. Manual code review against best practices"
  echo ""
  echo "To enable skills audits (experimental):"
  echo "  npm install -D @vercel/agent-skills"
  echo "  # Configure per docs/skills-audit-setup.md"
  echo ""
  return 0  # Don't fail build
}
```

**Recommendation**: Use Option C for now (mark as planned), implement Option A when @vercel/agent-skills is ready.

---

## PHASE 4: RALPH QA AUTOMATION (⏸️ PENDING)

### Current State

**File**: [ralph/run-ralph.sh](ralph/run-ralph.sh)

**Current Behavior**: Interactive script that requires manual prompt pasting.

```bash
# Waits for user to press ENTER
echo "Press ENTER when ready to start iteration $ITERATION..."
read -r

# Opens Claude Code with prompt
open "claude://prompt?file=$PROMPT_FILE"
```

### Automation Approach

Ralph QA is inherently human-in-the-loop (adversarial review requires human judgment). **Do not attempt to fully automate**.

#### Recommended: Opt-In with User Approval

```javascript
// In pipeline run.mjs
async function offerRalphQA(projectPath) {
  const hasRalph = await detectSkill('ralph');

  if (!hasRalph) {
    console.log(`${DIM}Ralph QA runner not configured${RESET}`);
    console.log(`${DIM}Manual: ./ralph/run-ralph.sh <pipeline> <iteration>${RESET}\n`);
    return;
  }

  const runRalph = await askYesNo('Run Ralph QA adversarial review? (Recommended)', 'y');

  if (runRalph) {
    console.log(`${CYAN}Starting Ralph QA loop...${RESET}\n`);

    // Run ralph interactively (user must execute each iteration)
    execSync(`bash ${REPO_ROOT}/ralph/run-ralph.sh ${pipelineName} 1`, {
      stdio: 'inherit'
    });

    console.log(`${GREEN}✓ Ralph QA iteration 1 complete${RESET}`);
    console.log(`${DIM}Continue manually: ./ralph/run-ralph.sh ${pipelineName} 2${RESET}\n`);
  } else {
    console.log(`${YELLOW}⚠️  Skipping Ralph QA - manual review recommended for production${RESET}\n`);
  }
}
```

#### Enhanced Ralph Runner

Update [ralph/run-ralph.sh](ralph/run-ralph.sh) to support non-interactive mode:

```bash
# Add --auto flag for automation
if [ "$AUTO_MODE" = true ]; then
  # Skip ENTER prompt
  echo "Auto mode: skipping manual confirmation"

  # Execute Claude Code with prompt
  claude-code --prompt-file "$PROMPT_FILE"
else
  # Existing interactive mode
  echo "Press ENTER when ready to start iteration $ITERATION..."
  read -r

  open "claude://prompt?file=$PROMPT_FILE"
fi
```

**Recommendation**: Keep Ralph as interactive opt-in. Do not force automation on inherently human tasks.

---

## GOVERNANCE UPDATES

### Files Updated

1. [CLAUDE.md](CLAUDE.md) - Root orchestrator constitution
2. [app-factory/CLAUDE.md](app-factory/CLAUDE.md)
3. [website-pipeline/CLAUDE.md](website-pipeline/CLAUDE.md)
4. [dapp-factory/CLAUDE.md](dapp-factory/CLAUDE.md)
5. [agent-factory/CLAUDE.md](agent-factory/CLAUDE.md)
6. [plugin-factory/CLAUDE.md](plugin-factory/CLAUDE.md)
7. [miniapp-pipeline/CLAUDE.md](miniapp-pipeline/CLAUDE.md) (no changes needed)

### Key Governance Changes

#### Old Model (Contradictory)
```
✗ "Offline by Default" invariant
✗ 5 MCP servers enabled (require network)
✗ Skills audits "mandatory" but not enforced
✗ Playwright "required" but not detected
✗ False promises in documentation
```

#### New Model (Honest)
```
✓ "Capability-Aware Execution" invariant
✓ Network-enabled by default (MCP servers, Claude, quality tools)
✓ Skills audits optional with graceful degradation
✓ Playwright detected before use, fallback to HTTP-only
✓ Documentation matches reality
```

### Capability Tiers

**Baseline Tier** (Always Available):
- Node.js ≥18
- npm/pnpm/yarn
- Git
- Core framework (Next.js, Expo, React, etc.)
- Package.json dependencies (ESLint, TypeScript)

**Quality Tier** (Optional, High ROI):
- Playwright (E2E testing)
- Lighthouse (performance audits)
- Axe-core (accessibility)
- @vercel/agent-skills (code quality)
- Prettier (code formatting)
- Ralph QA (adversarial review)

**Advanced Tier** (Optional, Specialized):
- MCP servers (GitHub, Semgrep, Context7, Playwright, etc.)
- Figma integration
- Supabase/database tools
- Payment SDKs (Stripe, RevenueCat)
- Cloud deployment tools (Vercel, AWS, etc.)

### Detect → Degrade → Message Protocol

All optional tools MUST follow this pattern:

1. **DETECT**: Check availability at runtime before use
2. **DEGRADE**: Continue with reduced capability if unavailable
3. **MESSAGE**: Tell user clearly what's happening

Example:
```
⚠️  Playwright not available - skipping browser verification
Using HTTP-only verification instead
💡 Install Playwright: npm install -D playwright && npx playwright install
```

---

## COMMIT STRATEGY

### Incremental Commits (Recommended)

```bash
# Commit 1: Governance updates
git add CLAUDE.md */CLAUDE.md
git commit -m "docs: remove 'offline by default', add capability-aware execution

- Update root Invariant 4: Offline by Default → Capability-Aware Execution
- Remove network access prohibitions from all 6 pipeline constitutions
- Add honest note about network-enabled default (MCP servers, Claude, quality tools)
- Align documentation with reality

Fixes governance contradiction identified in skills audit.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Commit 2: Enhanced skill detection library
git add scripts/lib/skill-detection.mjs
git commit -m "feat(skills): enhance detection library with 30+ skills and tier system

Added detectors:
- Quality tier: playwright, lighthouse, axe, vercel-agent-skills, prettier
- Advanced tier: vercel-cli, expo-cli, supabase, stripe, revenuecat, e2b, figma
- MCP servers: mcp-figma, mcp-supabase, mcp-filesystem

New functions:
- detectHeavyDependency() - detect Playwright browsers (~500MB)
- getDetailedCapabilities() - comprehensive capability analysis with tiers
- detectSkillsByTier() - batch detection with recommendations
- detectDegradeMessage() - complete Detect → Degrade → Message pattern

Enhanced messaging:
- Expanded DEGRADATION_MESSAGES with fallback/alternative for all skills
- Enhanced printCapabilityReport() with detailed tier display

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Commit 3: Vendor library to all pipelines
git add */scripts/lib/skill-detection.mjs
git commit -m "chore(skills): vendor enhanced detection library to all 6 pipelines

Copied enhanced skill-detection.mjs (905 lines) to:
- app-factory/scripts/lib/
- dapp-factory/scripts/lib/
- website-pipeline/scripts/lib/
- agent-factory/scripts/lib/
- plugin-factory/scripts/lib/
- miniapp-pipeline/scripts/lib/

All pipelines now have access to comprehensive capability detection.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Commit 4: Implementation summary
git add IMPLEMENTATION_SUMMARY.md
git commit -m "docs: add implementation summary for network-enabled architecture

Documents:
- Phase 1 complete: Governance + library updates
- Phase 2 in progress: Pipeline wiring
- Phase 3 pending: Skills audit implementation
- Phase 4 pending: Ralph QA automation

Includes implementation patterns, testing checklists, and remaining work.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## NEXT STEPS

### Immediate (P0)

1. ✅ **Complete Governance Updates** (DONE)
2. ✅ **Enhance Skill Detection Library** (DONE)
3. ✅ **Vendor Library to Pipelines** (DONE)
4. ⏳ **Wire Detection into run.mjs Files** (IN PROGRESS)
   - Start with website-pipeline as reference implementation
   - Follow pattern outlined in Section 2.2
   - Test in all 3 capability tiers
5. ⏳ **Test Graceful Degradation**
   - Remove Playwright, verify HTTP-only fallback works
   - Remove @vercel/agent-skills, verify ESLint fallback works
   - Verify no crashes when tools are missing

### Short-Term (P1)

1. **Implement Skills Audit** (Option C: Mark as planned)
   - Update [scripts/run-skills-audit.sh](scripts/run-skills-audit.sh)
   - Add clear messaging about planned status
   - Provide ESLint workaround instructions

2. **Ralph QA Opt-In** (Keep interactive)
   - Add opt-in prompts to pipeline run.mjs files
   - Update [ralph/run-ralph.sh](ralph/run-ralph.sh) with --auto flag
   - Document as human-in-the-loop process

3. **Testing Matrix**
   - Test all 6 pipelines × 3 capability tiers = 18 test runs
   - Document test results in `docs/testing/capability-tier-tests.md`

### Long-Term (P2)

1. **Capability Dashboard**
   - Create `scripts/check-capabilities.mjs` CLI tool
   - Shows user which tier they're in
   - Provides upgrade instructions

2. **MCP Server Management**
   - Create `docs/governance/MCP_SERVER_GOVERNANCE.md`
   - Add MCP server detection to all uses
   - Implement capability negotiation protocol

3. **Skills Catalog**
   - Create `docs/governance/SKILLS_CATALOG.md`
   - Document all skills by tier
   - Maintain approval requirements

---

## ROLLBACK PLAN

If issues arise, revert commits in reverse order:

```bash
# Revert implementation summary (safe)
git revert <commit-4-hash>

# Revert library vendoring (safe, pipelines will use local lib/)
git revert <commit-3-hash>

# Revert library enhancements (revert to 354-line version)
git revert <commit-2-hash>

# Revert governance updates (restore "offline by default")
git revert <commit-1-hash>
```

Commits are designed to be independently revertible without breaking dependencies.

---

## RISK ASSESSMENT

### Low Risk
- ✅ Governance documentation updates (no code changes)
- ✅ Library enhancements (additive, no breaking changes)
- ✅ Library vendoring (copies, no overwrites)

### Medium Risk
- ⚠️ Pipeline run.mjs wiring (requires testing in all capability tiers)
- ⚠️ Skills audit implementation (may have @vercel/agent-skills API changes)

### High Risk
- ❌ Ralph QA automation (DO NOT fully automate - keep human-in-the-loop)

### Mitigation
- Test in all 3 capability tiers before merging
- Start with one pipeline (website-pipeline) as proof-of-concept
- Keep existing behavior as fallback
- Never break builds when optional tools are missing

---

## TESTING COMMANDS

### Test Capability Detection

```bash
# Test in baseline tier (no quality tools)
cd website-pipeline
node scripts/run.mjs --skip-prompts

# Expected: Shows "BASELINE (Core tools only)", completes successfully

# Test in quality tier (with playwright + agent-skills)
npm install -D playwright @vercel/agent-skills
npx playwright install
node scripts/run.mjs --skip-prompts

# Expected: Shows "QUALITY (Enhanced with quality tools)", runs E2E tests
```

### Test Graceful Degradation

```bash
# Remove Playwright
npm uninstall playwright
node scripts/run.mjs --skip-prompts

# Expected: Shows "⚠️ Playwright not available", uses HTTP-only, completes successfully
```

### Test Skills Audit

```bash
# Run skills audit script
bash scripts/run-skills-audit.sh website-builds/test-site --skill react-best-practices

# Expected: Shows "Status: PLANNED - Not Yet Implemented" with workaround instructions
```

---

## CONCLUSION

**Phase 1** successfully removes the contradictory "offline by default" model and replaces it with an honest **network-enabled by default** model with **capability-aware execution**. The enhanced skill detection library provides a robust foundation for Detect → Degrade → Message patterns across all pipelines.

**Phase 2** (pipeline wiring) is the next critical step. Follow the reference implementation pattern outlined in Section 2.2, starting with website-pipeline.

**Phases 3-4** (skills audit and Ralph QA) are lower priority and can be implemented as planned features with clear workarounds.

The architecture now supports three capability tiers (Baseline, Quality, Advanced) with graceful degradation at each level. Users will see honest, transparent messaging about which features are available and how to upgrade.

**Next Action**: Wire detection into website-pipeline/scripts/run.mjs as reference implementation, then replicate pattern to remaining 5 pipelines.

---

**Report Complete**
**Date**: 2026-01-24
**Author**: Claude Sonnet 4.5
**Status**: Phase 1 Complete ✅, Phase 2 In Progress ⏳
