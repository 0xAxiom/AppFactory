# Pipeline State Map

**Generated**: January 9, 2026  
**Status**: PRODUCTION-READY DETERMINISTIC PIPELINE  
**Version**: Post-Hardening v1.0

## Executive Summary

The App Factory pipeline has been successfully transformed from a prose-only specification into a **deterministic, self-enforcing, production-grade system** with executable enforcement mechanisms and fail-fast behavior.

### Key Achievements

✅ **Eliminated duplicate stage templates** - Single canonical source in `templates/agents/`  
✅ **Implemented documentation enforcement** - Vendor docs + upstream cache validation  
✅ **Created asset contract system** - No late-stage build failures due to missing assets  
✅ **Added fail-fast mechanisms** - All invariants backed by executable scripts  
✅ **Established clean architecture** - Zero competing sources of truth

---

## Pipeline Architecture

### Execution Flow

```
User Command → Stage Template → Enforcement Scripts → Output Validation
     ↓              ↓                    ↓                    ↓
- run app factory   Stage 01-10       Scripts verify:      JSON + MD + Assets
- build <idea>      templates/agents/  • Templates          Written to runs/
- dream <text>      (15 templates)     • Documentation      and builds/
                                      • Assets
                                      • References
```

### Command Mapping

| Command | Stages Executed | Templates Used | Outputs |
|---------|----------------|----------------|---------|
| `run app factory` | 01 only | `01_market_research.md` | 10 ideas in idea bin |
| `build <idea>` | 02-10 | All stages for selected idea | Complete Expo app |
| `dream <text>` | 01_dream, 02-10 | Dream + full pipeline | Store-ready app |

---

## Enforcement Points (EXECUTABLE)

### 1. Template Canonicalization
**Script**: `scripts/verify_no_duplicate_stage_templates.sh`
**Trigger**: Build validation
**Enforces**:
- Single stage template per stage number
- All templates in `templates/agents/` only
- Proper Stage 01 variants (market_research + dream)
- No templates outside canonical directory

### 2. Documentation Reference Sync  
**Script**: `scripts/upstream_reference_sync.sh`
**Trigger**: Stage 02 start, Stage 10 start
**Enforces**:
- `vendor/expo-docs/` and `vendor/revenuecat-docs/` exist
- `app/_docs/` infrastructure created
- `app/_upstream/react-native/` cache initialized
- Source tracking via `sources.json`

### 3. Reference Compliance Validation
**Script**: `scripts/verify_reference_compliance.sh`  
**Trigger**: Stage 10 start (build-blocking)
**Enforces**:
- Build logs cite local vendor documentation
- No uncached external references
- Documentation infrastructure integrity
- Expo SDK compatibility evidence

### 4. Asset Contract + Preflight Gate
**Script**: `scripts/asset_preflight_check.sh`
**Trigger**: Stage 07, Stage 10 start
**Enforces**:
- All Expo config asset references exist on disk
- Missing assets auto-generated as deterministic placeholders
- Asset dimensions meet requirements
- Asset contract tracking via JSON

### 5. Asset Generation (Fallback)
**Script**: `scripts/generate_simple_assets.sh`
**Trigger**: Called by asset preflight when needed
**Enforces**:
- Deterministic placeholder generation using macOS sips
- Reliable fallback when Sharp/Node.js unavailable
- Consistent visual design with app branding

---

## Stage Template Resolution (DETERMINISTIC)

### Canonical Template Directory
**Location**: `templates/agents/`
**Status**: Single source of truth for all stage execution

| Stage | Template File | Purpose |
|-------|---------------|---------|
| 01 (Market) | `01_market_research.md` | Generate 10 ranked app ideas |
| 01 (Dream) | `01_dream.md` | Single idea validation for dream mode |
| 02 | `02_product_spec.md` | Product specification |
| 02.5 | `02.5_product_reality.md` | Product reality check |
| 02.7 | `02.7_dependency_resolution.md` | Technical dependency planning |
| 03 | `03_ux.md` | UX design specification |
| 04 | `04_monetization.md` | Subscription monetization |
| 05 | `05_architecture.md` | Technical architecture |
| 06 | `06_builder_handoff.md` | Builder handoff specification |
| 07 | `07_polish.md` | Polish and refinement |
| 08 | `08_brand.md` | Brand identity |
| 09 | `09_release_planning.md` | App store release planning |
| 09.5 | `09.5_runtime_sanity_harness.md` | Runtime validation |
| 10 | `10_app_builder.md` | **CANONICAL** - Complete Expo app building |
| 10.1 | `10.1_design_authenticity_check.md` | Design validation |

### Deprecated Templates
**Location**: `deprecated/`
**Status**: Quarantined competing stage templates

- `stage10_builder.md` → Replaced by `templates/agents/10_app_builder.md`
- `stage10_runtime_validation.md` → Merged into canonical template
- `stage10_validation_procedure.md` → Merged into canonical template
- `10_stage10_build.md` → Deprecated runbook
- `stage10_definition_of_done.md` → Deprecated documentation

---

## Documentation Infrastructure

### Vendor Documentation (Canonical)
```
vendor/
├── expo-docs/              # Expo SDK compatibility rules
└── revenuecat-docs/        # RevenueCat integration patterns
    └── llms.txt           # Canonical documentation index
```

### Run-Specific Documentation Layer
```
app/
├── _docs/
│   ├── INDEX.md           # Documentation manifest
│   ├── sources.json       # Source tracking with hashes
│   ├── compliance_report.json  # Compliance status
│   └── sync_provenance.json    # Sync history
├── _assets/
│   ├── asset_contract.json     # Asset tracking
│   └── asset_generation_log.md # Generation history
└── _upstream/
    └── react-native/
        ├── manifest.json   # Upstream file cache
        └── INDEX.md        # Cache documentation
```

### Source-of-Truth Hierarchy
1. **Expo SDK compatibility rules** (hard gate, build-blocking)
2. **Locally cached vendor docs** (`vendor/expo-docs/`, `vendor/revenuecat-docs/`)
3. **Locally cached React Native upstream** (`app/_upstream/react-native/`)
4. **Application code**

---

## Asset Management

### Asset Contract System
- **Parser**: Extracts asset references from `app.json`/`app.config.*`
- **Validator**: Verifies existence, dimensions, format
- **Generator**: Creates deterministic placeholders for missing assets
- **Tracker**: Records all assets in `asset_contract.json`

### Deterministic Asset Generation
- **Primary**: Node.js with Sharp library (when available)
- **Fallback**: macOS sips (reliable backup)
- **Style**: Blue background, white text, emerald accents
- **Deterministic**: Same app name → same asset appearance

### Required Assets
- `icon.png` (1024×1024) - App icon
- `splash.png` (1284×2778) - Splash screen
- `adaptive-icon.png` (1024×1024) - Android adaptive icon
- `favicon.png` (32×32) - Web favicon (if enabled)

---

## Failure Modes & Diagnostics

### Template Resolution Failures
**Symptom**: Stage cannot find template  
**Cause**: Multiple or missing stage templates  
**Fix**: Run `scripts/verify_no_duplicate_stage_templates.sh`

### Documentation Reference Failures
**Symptom**: Build fails citing missing vendor docs  
**Cause**: Documentation infrastructure not initialized  
**Fix**: Run `scripts/upstream_reference_sync.sh`

### Asset Build Failures  
**Symptom**: Expo build fails due to missing assets  
**Cause**: Asset preflight not run or failed  
**Fix**: Run `scripts/asset_preflight_check.sh`

### Schema Validation Failures
**Symptom**: Stage JSON does not match schema  
**Cause**: Template output format mismatch  
**Fix**: Check `appfactory/schema_validate.py` output

---

## Production Readiness Checklist

### ✅ Enforcement Mechanisms
- [x] Template canonicalization enforced
- [x] Documentation reference compliance enforced  
- [x] Asset contract preflight enforced
- [x] Fail-fast behavior on all violations
- [x] No prose-only policies remaining

### ✅ Deterministic Behavior
- [x] Stage → template mapping explicit
- [x] No filesystem-order dependencies
- [x] Reproducible asset generation
- [x] Source tracking with hashes

### ✅ Error Prevention
- [x] Duplicate template prevention
- [x] Late-stage asset failure prevention
- [x] Uncached reference prevention
- [x] Schema validation on all outputs

### ✅ Maintenance
- [x] Deprecated files quarantined
- [x] .gitignore updated for generated directories
- [x] Pipeline integrity validation script
- [x] Complete documentation of enforcement points

---

## Usage Examples

### Generate Ideas
```bash
# User runs this command
run app factory

# Pipeline automatically:
# 1. Creates run directory
# 2. Executes Stage 01 template
# 3. Validates 10 ideas generated
# 4. Updates global leaderboard
# 5. Creates idea bin with metadata
```

### Build Selected App  
```bash
# User runs this command
build focusflow_ai

# Pipeline automatically:
# 1. Runs upstream_reference_sync.sh
# 2. Resolves idea from most recent run
# 3. Executes missing stages 02-09 for that idea only
# 4. Runs asset_preflight_check.sh at Stage 07
# 5. Runs verify_reference_compliance.sh at Stage 10
# 6. Builds complete Expo app to builds/
```

### Dream Mode (End-to-End)
```bash  
# User runs this command
dream "A meditation app with nature sounds"

# Pipeline automatically:
# 1. Creates dream run directory
# 2. Executes Stage 01_dream for idea validation
# 3. Executes Stages 02-10 for complete build
# 4. Produces store-ready Expo app
```

---

## Monitoring & Validation

### Continuous Validation
Run pipeline integrity check before major changes:
```bash
scripts/validate_pipeline_integrity.sh
```

### Manual Verification Commands
```bash
# Verify template canonicalization
scripts/verify_no_duplicate_stage_templates.sh

# Initialize documentation infrastructure  
scripts/upstream_reference_sync.sh

# Check reference compliance
scripts/verify_reference_compliance.sh

# Test asset generation
scripts/asset_preflight_check.sh
```

---

## Architecture Decisions

### Why Agent-Native Execution?
- **Performance**: Direct Claude execution without subprocess overhead
- **Reliability**: No dependency on external pipeline runners
- **Flexibility**: Easy to modify stage templates without toolchain changes

### Why Executable Enforcement?
- **Reliability**: Prose-only policies drift; code-backed policies are enforced
- **Fail-Fast**: Issues caught early rather than at build completion
- **Deterministic**: Same inputs → same outputs, always

### Why Vendor Doc Caching?
- **Authority**: Decisions grounded in authoritative sources, not model memory
- **Reproducibility**: Same cached docs → same technical decisions
- **Compliance**: Audit trail of all sources consulted

### Why Asset Preflight?
- **User Experience**: No late-stage surprises due to missing assets  
- **Development Velocity**: Deterministic placeholders allow immediate testing
- **Production Readiness**: Clear asset replacement workflow

---

## Conclusion

The App Factory pipeline is now a **production-grade, deterministic system** with:

- **Zero prose-only policies** - All invariants backed by executable enforcement
- **Zero competing sources of truth** - Canonical templates and documentation
- **Zero late-stage surprises** - Fail-fast behavior at every enforcement point
- **Zero reliance on assumptions** - All decisions grounded in cached sources

The system is ready for production use with confidence in reliability, maintainability, and deterministic behavior.

---

**Next Steps**: Use the pipeline with confidence. All enforcement mechanisms are active and will prevent common failure modes automatically.