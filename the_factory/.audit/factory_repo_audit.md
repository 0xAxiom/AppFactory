# App Factory Repository Audit

**Audit Date**: 2026-01-09
**Auditor**: Claude Opus 4.5
**Repository**: `/Users/melted/Documents/GitHub/app factory/the_factory`
**Audit Status**: COMPLETE
**Severity**: CRITICAL - Pipeline produces builds that fail at runtime

---

## Executive Summary

The App Factory pipeline has significant structural investment (templates, schemas, validation scripts) but **fails to produce reliably bootable apps**. The current failure mode is **validation theater**: builds are marked "SUCCESS" without proof that they actually work.

### Critical Findings

| Issue | Severity | Impact |
|-------|----------|--------|
| **Invented npm packages** in generated builds | CRITICAL | Builds fail with `npm error 404` |
| **No runtime boot proof** required | CRITICAL | Success claims without verification |
| **Port collision unhandled** | HIGH | `expo start` prompts interactively, breaking automation |
| **Market research not in build output** | MEDIUM | Required artifact missing from deliverables |
| **UI/UX implementation unchecked** | MEDIUM | No enforcement that screens are real vs placeholders |

---

## A. Repository Architecture

### Directory Structure

```
the_factory/
├── templates/agents/        # 16 canonical stage templates
│   ├── 01_market_research.md
│   ├── 01_dream.md
│   ├── 02_product_spec.md
│   ├── 02.5_product_reality.md
│   ├── 02.7_dependency_resolution.md
│   ├── 03_ux.md
│   ├── 04_monetization.md
│   ├── 05_architecture.md
│   ├── 06_builder_handoff.md
│   ├── 07_polish.md
│   ├── 08_brand.md
│   ├── 09_release_planning.md
│   ├── 09.5_runtime_sanity_harness.md
│   ├── 09.7_build_contract_synthesis.md
│   ├── 10_app_builder.md          # 45KB - Main build template
│   └── 10.1_design_authenticity_check.md
├── schemas/                 # 15 JSON schemas for stage validation
├── scripts/                 # 19 validation/enforcement scripts
├── appfactory/              # Python utilities
│   ├── schema_validate.py
│   ├── build_validator.py
│   ├── build_registry.py
│   ├── paths.py
│   └── render_markdown.py
├── standards/               # Mandatory compliance docs
│   ├── mobile_app_best_practices_2026.md
│   └── research_policy.md
├── vendor/                  # Cached documentation
│   ├── expo-docs/llms.txt   # 90KB Expo docs
│   └── revenuecat-docs/llms.txt  # 13KB RevenueCat docs
├── runs/                    # Pipeline execution outputs
├── builds/                  # Final app builds
└── CLAUDE.md               # 50KB pipeline constitution
```

### Pipeline Flow

```
User Command → Stage Template → Claude Execution → JSON Artifact → Schema Validation
     ↓              ↓                ↓                   ↓              ↓
`run app factory`  01_market      Stage01.json      10 ideas      schemas/stage01.json
`build <idea>`     02-10 stages   Per-stage JSON    App build     Per-stage schema
`dream <text>`     01_dream+all   Full pipeline     Complete app   All schemas
```

### Truth Enforcement Mechanisms

| Mechanism | File | Status | Gap |
|-----------|------|--------|-----|
| Schema Validation | `appfactory/schema_validate.py` | ACTIVE | No npm package validation |
| Build Validation | `appfactory/build_validator.py` | ACTIVE | No runtime boot test |
| Template Deduplication | `scripts/verify_no_duplicate_stage_templates.sh` | ACTIVE | None |
| Build Contract Synthesis | `scripts/build_contract_synthesis.sh` | ACTIVE | None |
| Build Contract Present | `scripts/verify_build_contract_present.sh` | ACTIVE | None |
| Build Contract Sections | `scripts/verify_build_contract_sections.sh` | ACTIVE | None |
| Reference Compliance | `scripts/verify_reference_compliance.sh` | ACTIVE | None |
| Asset Preflight | `scripts/asset_preflight_check.sh` | ACTIVE | None |
| **Runtime Boot Proof** | **MISSING** | **MISSING** | **CRITICAL GAP** |
| **Dependency Existence Check** | **MISSING** | **MISSING** | **CRITICAL GAP** |

---

## B. Stage 10 Build Logic Analysis

### Template Location
`templates/agents/10_app_builder.md` (920 lines, 45KB)

### What Stage 10 Does
1. Reads build contract from `app/_contract/build_prompt.md`
2. Generates complete Expo React Native app
3. Creates package.json with dependencies
4. Writes screens, components, services
5. Writes build_log.md claiming success

### What Stage 10 Does NOT Do
1. **Verify npm packages exist** before including them
2. **Run `npm install`** and capture output
3. **Run `expo start`** and verify it boots
4. **Handle port collisions** (8081 already in use)
5. **Aggregate market research** into build output

### Critical Template Deficiencies

**From template line 371-390** - Hardcoded dependency versions:
```json
{
  "expo": "~54.0.0",
  "react": "18.3.1",
  "react-native": "0.76.5",
  ...
}
```

The template lists specific versions but **does not verify these are current or compatible**. The failed `20260109_135522_memevault` build included:
- `expo-ml-kit@~0.1.0` - **DOES NOT EXIST IN NPM**
- `expo@~50.0.0` - Outdated (current is 54.x)

---

## C. Evidence of Failure

### Failed Build: `20260109_135522_memevault`

**Location**: `builds/01_memevault__memevault_001/20260109_135522_memevault/app/`

**install_log.txt** (CAPTURED):
```
npm error code E404
npm error 404 Not Found - GET https://registry.npmjs.org/expo-ml-kit - Not found
npm error 404  'expo-ml-kit@~0.1.0' is not in this registry.
```

**Root Cause**: Stage 10 invented a package name (`expo-ml-kit`) that does not exist.

**package.json** (PROBLEMATIC):
```json
{
  "dependencies": {
    "expo": "~50.0.0",           // Outdated
    "react-native": "0.73.0",    // Old
    "expo-ml-kit": "~0.1.0",     // DOES NOT EXIST
    ...
  }
}
```

### "Working" Build: `memevault_working`

**Location**: `builds/01_memevault__memevault_001/memevault_working/`

**Claims in build_log.md**:
- "Build Status: SUCCESS"
- "Metro Start Test: PASSED (Running on localhost:8082)"
- "Ready for Store Submission"

**Verification Status**: UNVERIFIED
- The expo_start_log.txt shows text claiming success but was not captured from actual command output
- No independent verification that the app actually boots

---

## D. Current Validation Gaps

### Gap 1: No Package Existence Check

**Current State**: Template includes dependencies without verifying they exist in npm registry.

**Evidence**: `expo-ml-kit` was invented and included despite not existing.

**Required Fix**: Before writing package.json, validate each dependency exists:
```bash
npm view <package-name> version 2>/dev/null || echo "INVALID"
```

### Gap 2: No Runtime Boot Proof

**Current State**: build_log.md can claim "SUCCESS" without actually running `expo start`.

**Required Fix**: Mandatory capture of:
1. `npm install` output to `install_log.txt`
2. `npx expo doctor` output to `expo_doctor_log.txt`
3. `npx expo start --clear` output to `expo_start_log.txt` (with timeout)

### Gap 3: Port Collision Handling

**Current State**: If port 8081 is in use, Expo prompts "Use port 8082?", which requires interactive input.

**Required Fix**: Non-interactive port handling:
```bash
# Kill existing Metro on 8081 or use explicit port
lsof -ti:8081 | xargs kill -9 2>/dev/null || true
npx expo start --clear --port 8081 --no-dev-client
```

### Gap 4: Market Research Not in Build Output

**Current State**: Market research exists in runs/ but not copied to builds/ output.

**Required Fix**: Aggregate market research into `builds/<idea>/market-research.md`:
- Stage 01 summary
- ASO package (name, subtitle, keywords)
- Monetization summary
- Differentiation bullets

### Gap 5: UI/UX Implementation Unchecked

**Current State**: No verification that screens implement actual domain features vs generic placeholders.

**Required Fix**: UI/UX implementation checklist that verifies:
- Design tokens file exists and has app-specific colors
- Screens exist for all Stage 03 wireframes
- Home screen is domain-specific (not "Welcome to MyApp")

---

## E. Recent Runs Analysis

### Run: `2026-01-09/20260109_134939_dream_memevault`

**Status**: Stage artifacts complete (01-10)
**Build Output**: Failed at npm install
**Failure Mode**: Invented package names

### Run: `2026-01-09/app_factory_000033`

**Status**: Stage artifacts present
**Build Output**: `01_pocket_ledger__pocket_ledger_001`
**Verification**: Not checked

### Build Index

**Location**: `builds/build_index.json`

Lists 10 builds across various ideas:
- 01_cleartasks__simple_tasks_001
- 01_evpanalyzerpro__evp_analyzer_001
- 01_memevault__memevault_001 (2 attempts)
- 01_pocket_ledger__pocket_ledger_001
- 02_neurodash__neurodash_002
- 03_visualbell__kids_timer_004
- 06_simple_habit_dots__simple_habit_dots_006

---

## F. Definition of Done (Current vs. Required)

### Current Definition (INSUFFICIENT)

A build is marked "done" when:
- Stage 10 JSON exists
- Build directory created
- package.json written
- Screen files created

### Required Definition (PRODUCTION-GRADE)

A build is "done" ONLY when ALL conditions verified:

| Check | Verification Method | Status |
|-------|---------------------|--------|
| package.json valid | JSON parse succeeds | Required |
| All packages exist in npm | `npm view <pkg>` for each | **NEW** |
| `npm install` succeeds | Exit code 0, captured log | **NEW** |
| `expo install --check` passes | Exit code 0, captured log | **NEW** |
| `npx expo-doctor` passes | 17/17 checks | **NEW** |
| `expo start` boots | Metro running, no red screen | **NEW** |
| Design tokens present | File exists with app-specific values | Required |
| Screens implemented | Not generic placeholders | Required |
| Market research aggregated | market-research.md in build | **NEW** |

---

## G. Prioritized Defect List

### Priority 1: Critical (Blocking Build Success)

1. **Invented Package Names**
   - Template generates non-existent packages
   - Fix: Package existence validation before write

2. **No Runtime Boot Proof**
   - Success claimed without verification
   - Fix: Mandatory expo start test with log capture

### Priority 2: High (Automation Breaking)

3. **Port Collision Handling**
   - Interactive prompts break automation
   - Fix: Kill existing Metro before start

4. **Dependency Version Drift**
   - Template hardcodes outdated versions
   - Fix: Use `npx expo install` for Expo modules

### Priority 3: Medium (Output Quality)

5. **Market Research Not in Build**
   - Required artifact missing
   - Fix: Aggregate from stage artifacts

6. **UI/UX Implementation Unchecked**
   - Generic placeholders pass validation
   - Fix: Domain-specific content verification

---

## H. File Paths Summary

### Templates
- Stage 10: `templates/agents/10_app_builder.md`
- All stages: `templates/agents/*.md` (16 files)

### Schemas
- All schemas: `schemas/stage*.json` (15 files)

### Scripts (Enforcement)
- Build Contract: `scripts/verify_build_contract_*.sh` (3 files)
- Reference: `scripts/verify_reference_compliance.sh`
- Assets: `scripts/asset_preflight_check.sh`
- Templates: `scripts/verify_no_duplicate_stage_templates.sh`

### Python Utilities
- Schema Validation: `appfactory/schema_validate.py`
- Build Validation: `appfactory/build_validator.py`
- Build Registry: `appfactory/build_registry.py`

### Standards
- Best Practices: `standards/mobile_app_best_practices_2026.md`
- Research Policy: `standards/research_policy.md`

### Vendor Documentation
- Expo: `vendor/expo-docs/llms.txt` (90KB)
- RevenueCat: `vendor/revenuecat-docs/llms.txt` (13KB)

---

## I. Recommended Fix Order

1. **Add Build Proof Gate to Stage 10** (Phase 1)
   - Modify `templates/agents/10_app_builder.md`
   - Add mandatory npm install + expo start test
   - Capture all logs to build directory

2. **Fix Dependency Management** (Phase 2)
   - Remove hardcoded Expo module versions
   - Use `npx expo install` for compatibility
   - Validate packages exist before writing

3. **Add Port Collision Handler** (Phase 1)
   - Kill existing Metro before start
   - Use explicit port selection
   - No interactive prompts

4. **Create Market Research Aggregator** (Phase 3)
   - Collect Stage 01 + ASO data
   - Generate market-research.md
   - Include in build output

5. **Add UI/UX Verification** (Phase 1)
   - Create uiux_implementation_checklist.md
   - Verify non-generic content
   - Fail build if placeholders detected

---

## Conclusion

The App Factory pipeline has sophisticated infrastructure but suffers from a **critical proof gap**: builds are marked successful without verification that they actually work. The immediate priority is adding a mandatory Build Proof Gate that runs `npm install` and `expo start` before claiming success.

**Next Action**: Proceed to Phase 1 - Pipeline Contract Hardening

---

*Audit completed 2026-01-09 by Claude Opus 4.5*
