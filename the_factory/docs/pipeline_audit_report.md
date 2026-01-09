# Pipeline Audit Report - Phase 0 Inventory

**Date**: 2026-01-09  
**Version**: 3.1  
**Status**: COMPLETE  
**Repository**: App Factory  
**Path**: `/Users/melted/Documents/GitHub/app factory/the_factory`

## Executive Summary

The App Factory repository contains a multi-stage pipeline system with **stage templates, validation utilities, and vendor documentation** but lacks **deterministic execution enforcement** and has **multiple competing sources of truth**.

### Critical Issues Found

1. **NO CANONICAL PIPELINE RUNNER** - Commands are executed via CLAUDE.md prose but no executable pipeline orchestrator
2. **STAGE TEMPLATE DUPLICATION** - Multiple stage 10 templates and scattered validation docs
3. **UNENFORCED DOCUMENTATION POLICIES** - Vendor docs + upstream reference policy exists only in CLAUDE.md
4. **MISSING ASSET CONTRACT ENFORCEMENT** - No scripts to validate assets before build
5. **NO FAIL-FAST MECHANISMS** - All invariants are prose-only, not code-enforced

---

## A. Pipeline Execution Flow

### Current Execution Model
- **User Commands**: `run app factory`, `build <IDEA>`, `dream <TEXT>` (defined in CLAUDE.md)
- **Execution Agent**: Claude Code directly (agent-native)
- **Stage Templates**: `templates/agents/` directory
- **Validation**: Python utilities in `appfactory/` module
- **Output**: `runs/` and `builds/` directories

### Pipeline Runner Analysis
**NO DEDICATED PIPELINE RUNNER FOUND**

The system relies on:
1. CLAUDE.md constitutional document (47KB specification)
2. Stage templates in `templates/agents/` (15 files)
3. Python utilities (`appfactory/schema_validate.py`, `appfactory/paths.py`)
4. Manual stage execution via Claude Code

### Validation Mechanisms Found

| Script/Tool | Purpose | Status |
|-------------|---------|--------|
| `appfactory/schema_validate.py` | JSON schema validation | ✅ Active |
| `appfactory/paths.py` | Path resolution utilities | ✅ Active |
| `appfactory/build_validator.py` | Build validation logic | ✅ Active |
| `scripts/clean_repo.sh` | Repository cleanup | ✅ Active |
| `scripts/ship_check.sh` | Pre-ship validation | ✅ Active |

---

## B. Stage Template Inventory

### Canonical Stage Templates (`templates/agents/`)

| Stage | Template File | Status | Notes |
|-------|---------------|--------|-------|
| 01 (Market) | `01_market_research.md` | ✅ Primary | - |
| 01 (Dream) | `01_dream.md` | ✅ Primary | Dream mode variant |
| 02 | `02_product_spec.md` | ✅ Primary | - |
| 02.5 | `02.5_product_reality.md` | ✅ Primary | - |
| 02.7 | `02.7_dependency_resolution.md` | ✅ Primary | - |
| 03 | `03_ux.md` | ✅ Primary | - |
| 04 | `04_monetization.md` | ✅ Primary | - |
| 05 | `05_architecture.md` | ✅ Primary | - |
| 06 | `06_builder_handoff.md` | ✅ Primary | - |
| 07 | `07_polish.md` | ✅ Primary | - |
| 08 | `08_brand.md` | ✅ Primary | - |
| 09 | `09_release_planning.md` | ✅ Primary | - |
| 09.5 | `09.5_runtime_sanity_harness.md` | ✅ Primary | - |
| 10 | `10_app_builder.md` | ✅ Primary | 45KB template |
| 10.1 | `10.1_design_authenticity_check.md` | ✅ Primary | - |

### **DUPLICATE/COMPETING STAGE 10 TEMPLATES FOUND**

| File | Purpose | Action Required |
|------|---------|-----------------|
| `templates/agents/10_app_builder.md` | **Primary Stage 10** | ✅ Keep as canonical |
| `templates/stage10_builder.md` | Secondary Stage 10 | ❌ **DEPRECATE** |
| `templates/stage10_runtime_validation.md` | Stage 10 validation | ❌ **MERGE INTO PRIMARY** |
| `templates/stage10_validation_procedure.md` | Stage 10 validation | ❌ **MERGE INTO PRIMARY** |

---

## C. Documentation Cache Analysis

### Vendor Documentation (COMPLIANT)

| Directory | Status | Contents |
|-----------|--------|----------|
| `vendor/expo-docs/` | ✅ Present | Expo SDK documentation cache |
| `vendor/revenuecat-docs/` | ✅ Present | RevenueCat docs + `llms.txt` index |

### Missing Documentation Infrastructure

| Required Path | Status | Impact |
|---------------|--------|--------|
| `app/_docs/` | ❌ Missing | Run-specific documentation layer |
| `app/_docs/INDEX.md` | ❌ Missing | Documentation manifest |
| `app/_docs/sources.json` | ❌ Missing | Source tracking |
| `app/_upstream/react-native/` | ❌ Missing | React Native upstream cache |

---

## D. Asset Management Analysis

### Current Asset Handling
- **Asset References**: Parsed in Stage 10 templates
- **Placeholder Generation**: Mentioned in CLAUDE.md but NO IMPLEMENTATION
- **Validation**: NO PREFLIGHT CHECKS

### Missing Asset Infrastructure

| Required Component | Status | Impact |
|--------------------|--------|--------|
| `scripts/generate_placeholder_assets.mjs` | ❌ Missing | No asset generation |
| `scripts/asset_preflight_check.sh` | ❌ Missing | No asset validation |
| `app/_assets/asset_contract.json` | ❌ Missing | No asset tracking |

---

## E. Enforcement vs. Documentation Gap

### What IS Enforced (Code-Backed)

| Invariant | Enforcement Mechanism | Status |
|-----------|----------------------|--------|
| JSON Schema Validation | `appfactory/schema_validate.py` | ✅ Active |
| Build Structure | `appfactory/build_validator.py` | ✅ Active |
| Repository Cleanup | `scripts/clean_repo.sh` | ✅ Active |

### What is DOCUMENTED ONLY (No Enforcement)

| Policy | Documentation Location | Enforcement Status |
|--------|----------------------|-------------------|
| **Canonical Docs + Upstream Reference Sync** | CLAUDE.md lines 989-1241 | ❌ **PROSE ONLY** |
| **Asset Contract + Preflight Gate** | CLAUDE.md lines 899-985 | ❌ **PROSE ONLY** |
| **Stage Template Resolution** | CLAUDE.md (multiple sections) | ❌ **PROSE ONLY** |
| **Expo SDK Compatibility Gate** | CLAUDE.md Part C | ❌ **PROSE ONLY** |

---

## F. Proposed Canonical Mapping

### Stage Template Resolution (DETERMINISTIC)

```
Stage 01 Market → templates/agents/01_market_research.md
Stage 01 Dream → templates/agents/01_dream.md
Stage 02 → templates/agents/02_product_spec.md
Stage 02.5 → templates/agents/02.5_product_reality.md
Stage 02.7 → templates/agents/02.7_dependency_resolution.md
Stage 03 → templates/agents/03_ux.md
Stage 04 → templates/agents/04_monetization.md
Stage 05 → templates/agents/05_architecture.md
Stage 06 → templates/agents/06_builder_handoff.md
Stage 07 → templates/agents/07_polish.md
Stage 08 → templates/agents/08_brand.md
Stage 09 → templates/agents/09_release_planning.md
Stage 09.5 → templates/agents/09.5_runtime_sanity_harness.md
Stage 10 → templates/agents/10_app_builder.md (CANONICAL)
Stage 10.1 → templates/agents/10.1_design_authenticity_check.md
```

### Scripts to Implement

| Script | Purpose | Auto-Run Trigger |
|--------|---------|------------------|
| `scripts/upstream_reference_sync.sh` | Enforce docs + upstream cache | Stage 02 start, Stage 10 start |
| `scripts/verify_reference_compliance.sh` | Verify local docs citations | Stage 10 start |
| `scripts/asset_preflight_check.sh` | Asset contract validation | Stage 07, Stage 10 start |
| `scripts/generate_placeholder_assets.mjs` | Create missing assets | Called by asset_preflight |
| `scripts/verify_no_duplicate_stage_templates.sh` | Prevent template duplication | Build validation |

---

## G. Immediate Actions Required

### PHASE 1: Canonicalization
1. **DEPRECATE** `templates/stage10_*.md` files → move to `/deprecated/`
2. **IMPLEMENT** `scripts/verify_no_duplicate_stage_templates.sh`
3. **UPDATE** all template references to use `templates/agents/` exclusively

### PHASE 2: Documentation Enforcement
1. **IMPLEMENT** `scripts/upstream_reference_sync.sh`
2. **IMPLEMENT** `scripts/verify_reference_compliance.sh`
3. **WIRE** into Stage 02 and Stage 10 execution

### PHASE 3: Asset Contract
1. **IMPLEMENT** `scripts/generate_placeholder_assets.mjs`
2. **IMPLEMENT** `scripts/asset_preflight_check.sh`
3. **WIRE** into Stage 07 and Stage 10 execution

### PHASE 4: Cleanup
1. **REMOVE** unused scripts and templates
2. **VALIDATE** end-to-end pipeline
3. **DOCUMENT** final pipeline state map

---

## H. Risk Assessment

### High Risk Issues
- **Late-stage build failures** due to missing assets
- **Documentation drift** with no enforcement of vendor docs usage
- **Template ambiguity** causing inconsistent stage execution
- **Silent policy violations** with no fail-fast behavior

### Medium Risk Issues
- **Maintenance overhead** from duplicate templates
- **Debugging difficulty** without clear pipeline state tracking

---

## Conclusion

The App Factory pipeline requires **immediate conversion from prose-only policies to executable enforcement**. The core architecture is sound, but **critical invariants exist only in documentation** without code backing.

**Next Steps**: Proceed to PHASE 1 implementation immediately.