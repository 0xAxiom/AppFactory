# AppFactory Repository Review

**Reviewer:** Scout (Research Specialist)  
**Date:** February 3, 2026  
**Version Reviewed:** v11.0.0  
**Scope:** Documentation, Architecture, Onboarding, Roadmap, Dependencies

---

## Executive Summary

AppFactory is a well-architected monorepo for AI-powered application generation across 7 distinct pipelines (mobile, dApp, website, agent, plugin, miniapp, claw). The project demonstrates **strong documentation practices**, **thoughtful architectural decisions**, and a **comprehensive governance model**.

**Overall Assessment: B+ (Solid foundation with room for improvement)**

The documentation is extensive but could benefit from consolidation. The architecture is sound with clear separation of concerns. Onboarding is good but has friction points. Dependencies show some age and security concerns that need attention.

### Quick Stats

| Metric                   | Value             | Assessment                 |
| ------------------------ | ----------------- | -------------------------- |
| Pipelines                | 7                 | Complete coverage          |
| Test Coverage            | 252 tests passing | Good                       |
| Documentation Files      | 50+               | Extensive (maybe too much) |
| Security Vulnerabilities | 7 moderate        | Needs attention            |
| Outdated Dependencies    | 12+               | Needs update cycle         |
| Template Coverage        | 10 templates      | Good variety               |

---

## Strengths

### 1. **Exceptional Documentation Architecture** ⭐⭐⭐⭐⭐

The documentation strategy is remarkably well-thought-out:

- **Root CLAUDE.md** serves as orchestrator constitution with clear authority hierarchy
- **Pipeline-specific CLAUDE.md** files provide sovereign governance within each directory
- **8 Inherited Invariants** from `plugins/factory/INVARIANTS.md` create consistent safety guarantees
- **Phase detection protocols** are explicit and well-documented

```
Authority Hierarchy (well-defined):
ROOT ORCHESTRATOR → /factory COMMAND → PIPELINE CONSTITUTIONS → USER INPUT
```

### 2. **Sound Monorepo Architecture** ⭐⭐⭐⭐

The structure follows best practices:

```
AppFactory/
├── core/              # Shared library (@appfactory/core) ✓
├── CLI/               # Standalone CLI tool ✓
├── *-factory/         # Generation pipelines ✓
├── *-pipeline/        # Additional pipelines ✓
├── templates/         # Starter templates (well-organized) ✓
├── scripts/           # Maintenance utilities ✓
└── docs/              # Comprehensive documentation ✓
```

**Notable strengths:**

- Clean separation between `core/` shared library and pipeline-specific code
- Each pipeline is independently operable (`cd <pipeline> && claude`)
- Consistent output directory patterns (`builds/`, `outputs/`, `*-builds/`)
- Well-defined boundary enforcement

### 3. **Robust Quality Assurance** ⭐⭐⭐⭐

Ralph QA mode is a standout feature:

- 97% quality threshold before completion
- Adversarial review process
- Milestone-driven builds with QA gates
- UX Polish Loop with 20-pass refinement
- Playwright E2E testing integration

### 4. **Security-Conscious Design** ⭐⭐⭐⭐

Strong security practices evident:

- No hardcoded secrets (enforced via pre-commit hooks)
- Path validation to prevent traversal attacks
- Prompt injection defense documented
- Secret scanning integrated
- `LOCAL_RUN_PROOF_GATE` prevents false "build complete" claims
- Forbidden bypass patterns list (`--legacy-peer-deps`, `--force`, etc.)

### 5. **Comprehensive Testing** ⭐⭐⭐⭐

252 tests passing with good coverage:

- Unit tests for path safety, validation
- Integration tests for artifact generation
- Cross-pipeline artifact comparison tests
- Security-focused test scenarios

### 6. **Template System** ⭐⭐⭐⭐

Well-designed template architecture:

- 10 templates covering major use cases
- Clear TEMPLATE.md format for each
- Phase 0 integration for template suggestions
- Contribution guidelines for new templates

---

## Issues Found (Prioritized)

### 🔴 HIGH PRIORITY

#### H1: Outdated Dependencies with Security Vulnerabilities

**Severity:** HIGH  
**Impact:** Security exposure, potential build failures

Current state:

```
npm audit output:
- 7 moderate severity vulnerabilities
- lodash 4.0.0-4.17.21 has Prototype Pollution vulnerability
- vitest/vite chain has vulnerable esbuild versions
```

Outdated packages:
| Package | Current | Latest | Delta |
|---------|---------|--------|-------|
| @commitlint/cli | 19.x | 20.4.1 | Major |
| vitest | 2.1.9 | 4.0.18 | Major |
| @vitest/coverage-v8 | 2.1.9 | 4.0.18 | Major |
| globals | 15.x | 17.3.0 | Major |
| eslint-config-prettier | 9.x | 10.1.8 | Major |

CLI dependencies are severely outdated:
| Package | Wanted | Latest |
|---------|--------|--------|
| @anthropic-ai/sdk | 0.32.1 | **0.72.1** |
| commander | 12.1.0 | 14.0.3 |
| inquirer | 12.x | 13.2.2 |
| dotenv | 16.x | 17.2.3 |

**Recommendation:**

1. Run `npm audit fix` immediately
2. Create PR to update vitest to v4.x (breaking changes expected)
3. Update CLI dependencies (significant SDK changes)
4. Add Renovate/Dependabot for automated updates (note: `renovate.json` exists but may not be active)

---

#### H2: CLI Dependencies Not Installed

**Severity:** HIGH  
**Impact:** CLI is unusable without manual `npm install`

```bash
cd CLI && npm outdated
# Shows all deps as MISSING
```

The root `package.json` runs type-check on CLI but doesn't install its deps. First-time users who run `npm install` at root won't have CLI working.

**Recommendation:**

1. Add `"postinstall": "cd CLI && npm install"` to root package.json
2. Or document clearly in QUICKSTART.md
3. Consider using npm workspaces for unified dependency management

---

#### H3: Documentation Fragmentation

**Severity:** MEDIUM-HIGH  
**Impact:** Cognitive overload, discovery difficulties

The documentation is extensive but fragmented across too many locations:

```
Documentation exists in:
- README.md (27KB) - good overview
- QUICKSTART.md (5KB) - setup guide
- CLAUDE.md (27KB) - orchestrator guide
- docs/index.md - doc hub
- docs/GETTING_STARTED.md - overlaps with QUICKSTART
- docs/CONTRIBUTING.md - duplicates root CONTRIBUTING.md
- docs/FAQ.md, docs/TROUBLESHOOTING.md
- Each pipeline has its own README.md and CLAUDE.md
```

**Specific issues:**

- `docs/CONTRIBUTING.md` and root `CONTRIBUTING.md` - which is canonical?
- `QUICKSTART.md` vs `docs/GETTING_STARTED.md` - significant overlap
- 50+ documentation files makes finding info difficult

**Recommendation:**

1. Consolidate `QUICKSTART.md` and `docs/GETTING_STARTED.md` into one
2. Remove duplicate `docs/CONTRIBUTING.md` (keep root version)
3. Create clear documentation hierarchy in `docs/index.md`
4. Consider using doc site generator (Docusaurus, VitePress) for navigation

---

### 🟡 MEDIUM PRIORITY

#### M1: Incomplete Core Library Integration

**Severity:** MEDIUM  
**Impact:** Code duplication, inconsistent behavior

The `core/` library is well-structured but appears underutilized:

```typescript
// core/src/index.ts exports:
export * from './types/index.js';
export * from './ralph/index.js';
export * from './utils/index.js';
export * from './config/index.js';
export * from './constants/index.js';
```

However, pipelines don't consistently import from `@appfactory/core`:

- `dapp-factory/` has its own `utils/`, `schemas/`, `constants/`
- `claw-pipeline/` has its own `utils/`, `constants/`
- No evidence of `@appfactory/core` being used in pipeline code

**Recommendation:**

1. Audit each pipeline for code that should be in `core/`
2. Create migration plan to centralize shared code
3. Add `core/` as workspace dependency for pipelines
4. Document shared code usage in CONTRIBUTING.md

---

#### M2: Missing npm Workspaces Configuration

**Severity:** MEDIUM  
**Impact:** Dependency management complexity, installation friction

The repo has multiple `package.json` files but no npm workspaces config:

- Root `package.json`
- `CLI/package.json`
- `core/package.json`
- `dapp-factory/package.json`

Each must be installed separately.

**Recommendation:**
Add to root `package.json`:

```json
{
  "workspaces": ["core", "CLI", "dapp-factory"]
}
```

This enables:

- Single `npm install` at root
- Cross-package imports work automatically
- Hoisted dependencies reduce duplication

---

#### M3: Inconsistent Pipeline Structure

**Severity:** MEDIUM  
**Impact:** Learning curve, maintenance burden

Pipelines have structural inconsistencies:

| Pipeline         | Has package.json | Has quickstart.sh | Output Dir Pattern |
| ---------------- | ---------------- | ----------------- | ------------------ |
| app-factory      | ❌               | ✅                | `builds/`          |
| dapp-factory     | ✅               | ✅                | `dapp-builds/`     |
| agent-factory    | ✅               | ✅                | `outputs/`         |
| plugin-factory   | ❌               | ✅                | `builds/`          |
| miniapp-pipeline | ❌               | ❌                | `builds/miniapps/` |
| website-pipeline | ❌               | ❌                | `website-builds/`  |
| claw-pipeline    | ✅               | ✅                | `builds/claws/`    |

**Recommendation:**

1. Standardize output directory naming (`builds/<type>/` pattern)
2. Ensure all pipelines have `quickstart.sh` for consistency
3. Document the structural differences if intentional

---

#### M4: Examples Directory Incomplete

**Severity:** MEDIUM  
**Impact:** Onboarding difficulty for new developers

`examples/` directory mentions examples but structure is thin:

```
examples/
├── README.md
├── agent/
├── dapp/
├── miniapp/
├── mobile-app/
└── plugin/
```

Missing: `website/`, `claw/` examples

**Recommendation:**

1. Add working examples for all 7 pipelines
2. Ensure each example is self-contained and runnable
3. Add CI job to verify examples build successfully

---

### 🟢 LOW PRIORITY

#### L1: ROADMAP.md Could Be More Actionable

The roadmap is well-structured but:

- Q1 2026 targets are approaching (February 2026 now)
- Template system marked as v11.1 target but already exists in v11.0
- No issue/milestone links for tracking

**Recommendation:**

1. Link roadmap items to GitHub issues
2. Update completed items (template system is done)
3. Add "Last Updated" automation or reminder

---

#### L2: Test Coverage Could Be Broader

252 tests is good, but coverage appears focused on:

- Path safety
- Artifact generation structure
- File validation

Missing test coverage for:

- Ralph QA scoring logic
- Intent normalization
- Phase detection
- Pipeline routing

**Recommendation:**

1. Add tests for Ralph scoring algorithm
2. Test intent normalization edge cases
3. Integration tests for end-to-end pipeline execution

---

#### L3: Stale/Unused Files

Found potentially stale files:

- `CLAUDE.md.old` - old version, should be deleted or archived
- `REVIEW-code.md`, `REVIEW-structure.md` - appear to be from previous reviews
- `dapp-factory/web3factory.png` - legacy naming from before rename

**Recommendation:**

1. Delete `CLAUDE.md.old`
2. Move review files to `docs/reports/` or delete if obsolete
3. Rename or remove legacy assets

---

#### L4: Missing CODEOWNERS File

No `CODEOWNERS` file for GitHub PR auto-assignment.

**Recommendation:**
Add `.github/CODEOWNERS`:

```
# Default owner
* @MeltedMindz

# Pipeline-specific owners
/app-factory/ @MeltedMindz
/dapp-factory/ @MeltedMindz
...
```

---

## Specific Recommendations

### Immediate Actions (This Week)

1. **Run `npm audit fix`** - Address the 7 moderate vulnerabilities
2. **Add postinstall script** - Fix CLI dependency issue
3. **Update Anthropic SDK** - 0.32 → 0.72 is a significant jump
4. **Delete `CLAUDE.md.old`** - Clean up stale files

### Short-Term (Next 2 Weeks)

1. **Consolidate documentation** - Merge QUICKSTART.md and GETTING_STARTED.md
2. **Add npm workspaces** - Simplify multi-package management
3. **Update vitest to v4.x** - Major version with breaking changes, needs careful migration
4. **Add missing examples** - website-pipeline and claw-pipeline examples

### Medium-Term (Next Month)

1. **Migrate shared code to `core/`** - Reduce duplication
2. **Standardize pipeline structure** - Consistent output dirs and scripts
3. **Expand test coverage** - Ralph, intent normalization, routing
4. **Set up Dependabot/Renovate** - Automated dependency updates

### Documentation Improvements

1. Create `docs/CANONICAL.md` explaining which docs are authoritative
2. Add search functionality (Algolia or similar) to docs
3. Create visual architecture diagram for the monorepo
4. Add video walkthrough for first-time setup

---

## Roadmap Priority Assessment

Based on ROADMAP.md, recommended prioritization:

### Should Prioritize Higher

| Feature        | Current Priority | Recommended  | Rationale                       |
| -------------- | ---------------- | ------------ | ------------------------------- |
| Security Scan  | HIGH (Q1)        | **CRITICAL** | Dependencies already have vulns |
| Build History  | MEDIUM (Q1)      | HIGH         | Would improve DX significantly  |
| Enhanced Ralph | HIGH (Q1)        | HIGH         | Core differentiator             |

### Can Deprioritize

| Feature          | Current Priority | Recommended | Rationale                     |
| ---------------- | ---------------- | ----------- | ----------------------------- |
| Build Comparison | LOW (Q1)         | Defer       | Nice-to-have                  |
| Team Workspaces  | Q3               | Defer       | Complex, less immediate value |

### Missing from Roadmap

1. **npm workspaces migration** - Should be Q1
2. **Documentation consolidation** - Should be Q1
3. **Dependency automation** - Should be immediate
4. **Core library adoption** - Should be Q2

---

## Conclusion

AppFactory is a sophisticated, well-designed project with strong fundamentals. The main areas needing attention are:

1. **Dependency hygiene** - Security vulnerabilities and outdated packages
2. **Documentation consolidation** - Too many overlapping docs
3. **Build tooling** - npm workspaces would simplify significantly
4. **Core library adoption** - Reduce code duplication across pipelines

The architecture is sound, the quality assurance systems are excellent, and the security model is thoughtful. With the recommended improvements, this project would move from B+ to A-grade.

---

**Review completed:** February 3, 2026  
**Next review recommended:** After dependency updates (2 weeks)
