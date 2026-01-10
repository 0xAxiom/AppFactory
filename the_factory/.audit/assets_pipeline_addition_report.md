# Assets & Iconography Pipeline Addition Report

**Date**: 2026-01-09
**Status**: COMPLETE
**Pipeline Version**: 3.1

---

## Executive Summary

Added first-class Assets & Iconography capability to the App Factory pipeline. This ensures every build produces complete, platform-compliant visual assets including app icons, splash screens, adaptive icons, and in-app icon sets.

---

## Files Created

### 1. Stage Template: `templates/agents/08.5_assets.md`
**Purpose**: New pipeline stage for Visual Asset Specification

**Key Features**:
- Consumes Stage 08 brand identity outputs (color palette, iconography style, app icon concept)
- Consumes Stage 03 design tokens for color system consistency
- Full JSON schema for asset specifications including:
  - `app_icon`: iOS (1024x1024 no transparency) and Android adaptive (foreground + background)
  - `splash_screen`: Minimum 1284x2778 PNG for modern devices
  - `in_app_icons`: Style system, color mapping, and inventory (minimum 12 icons)
  - `illustration_guidelines`: Optional style guidance for onboarding/empty states
  - `asset_generation_config`: Tooling and regeneration specifications

**Outputs**:
- `stages/stage08.5.json` - Validated asset specification
- `outputs/stage08.5_execution.md` - Execution log
- `assets/asset_spec.json` - Detailed asset manifest
- `assets/icon_inventory.md` - In-app icon catalog
- `spec/08.5_assets.md` - Human-readable specification

### 2. Generation Script: `scripts/generate_assets.sh`
**Purpose**: Deterministic asset generation using Node.js/sharp

**Key Features**:
- Platform-agnostic (Node.js, no OS assumptions)
- Extracts colors from design tokens for consistency
- Generates all required platform assets:
  - `icon.png` (1024x1024 PNG, no transparency)
  - `adaptive-icon-foreground.png` (1024x1024 PNG with transparency)
  - `splash.png` (1284x2778 PNG)
  - `favicon.png` (32x32 PNG for web)
- Creates 18 in-app icon components in `src/ui/icons/`:
  - Navigation: Home, Back, Menu, Close, Search
  - Actions: Add, Edit, Delete, Save, Share, Filter, Sort
  - Status: Check, Error, Warning, Info
  - UI: Settings, ChevronRight

**Usage**:
```bash
scripts/generate_assets.sh <build_app_path>
# Example: scripts/generate_assets.sh builds/my_app/build_123/app
```

### 3. Validation Script: `scripts/verify_assets_present.sh`
**Purpose**: Validate all required assets exist and meet specifications

**Validations Performed**:
- App icon exists and is 1024x1024 PNG
- Adaptive icon foreground exists
- Splash screen exists with minimum dimensions
- In-app icon set has minimum 12 icons
- Icons use dynamic color props (not hardcoded hex values)
- App config (app.json) properly references assets

**Exit Codes**:
- 0 = All validations passed
- 1 = Missing arguments
- 2 = Missing required asset
- 3 = Asset validation failure (wrong size, etc.)
- 4 = Icon set validation failure

**Usage**:
```bash
scripts/verify_assets_present.sh <build_app_path>
# Example: scripts/verify_assets_present.sh builds/my_app/build_123/app
```

---

## Files Modified

### 1. `templates/agents/10_app_builder.md`
**Changes**:
- Added scripts to Script Library (lines 60-61)
- Added Gate 5: Asset Generation after UI/UX verification
- Added Gate 6: Asset Validation after asset generation
- Added ASSET & ICONOGRAPHY REQUIREMENTS section
- Added asset artifacts to mandatory proof artifacts table

**New Enforcement Gates**:
```
5. AFTER UI/UX Verification (Asset Generation):
   scripts/generate_assets.sh builds/<idea_dir>/<build_id>/app/

6. AFTER Asset Generation (Asset Validation):
   scripts/verify_assets_present.sh builds/<idea_dir>/<build_id>/app/
```

### 2. `templates/agents/08_brand.md`
**Changes**:
- Updated continuation instruction to reference Stage 08.5
- Added DOWNSTREAM STAGE INTEGRATION section documenting output mappings:
  - `visual_identity.color_palette` → Asset color tokens
  - `visual_identity.iconography_style` → In-app icon style system
  - `brand_applications.app_icon` → App icon design specifications
  - `brand_strategy.brand_name` → Asset labeling and generation

---

## Assets Guaranteed for Every Build

After this pipeline addition, EVERY successful build will include:

### Platform Assets (in `assets/`)
| Asset | Dimensions | Format | Platform |
|-------|-----------|--------|----------|
| `icon.png` | 1024x1024 | PNG (no transparency) | iOS App Store |
| `adaptive-icon-foreground.png` | 1024x1024 | PNG (transparency OK) | Android Adaptive |
| `adaptive-icon-background.png` | Color value | N/A | Android Adaptive |
| `splash.png` | 1284x2778 | PNG | iOS + Android |
| `favicon.png` | 32x32 | PNG | Web (if enabled) |

### In-App Icons (in `src/ui/icons/`)
| Category | Icons | Purpose |
|----------|-------|---------|
| Navigation | Home, Back, Menu, Close, Search | Core navigation |
| Actions | Add, Edit, Delete, Save, Share, Filter, Sort | User actions |
| Status | Check, Error, Warning, Info | Feedback indicators |
| UI | Settings, ChevronRight | UI elements |

**Total**: 18 icons minimum (exceeds 12-icon minimum requirement)

---

## Stage 10 Enforcement Details

### Gate Sequence
Stage 10 now enforces assets through a specific gate sequence:

1. **Gate 1**: Build contract verification (pre-existing)
2. **Gate 2**: Dependency alignment with Expo SDK (pre-existing)
3. **Gate 3**: Upstream reference verification (pre-existing)
4. **Gate 4**: UI/UX verification (pre-existing)
5. **Gate 5**: Asset Generation (NEW)
6. **Gate 6**: Asset Validation (NEW)
7. **Gate 7**: Final app verification (pre-existing)

### Failure Handling
- If Gate 5 (generation) fails → Build halts, error logged
- If Gate 6 (validation) fails → Build halts, specific failures identified
- Missing assets are never silently ignored

### Proof Artifacts
Stage 10 now produces additional proof artifacts:
- Asset generation log in build output
- Asset validation report confirming compliance
- Icon component inventory with export counts

---

## How to Regenerate Assets Deterministically

### Prerequisites
```bash
# Ensure Node.js is available
node --version

# Ensure sharp is installed (script handles this automatically)
npm install sharp --save-dev
```

### Regeneration Command
```bash
# From repository root
scripts/generate_assets.sh builds/<idea_dir>/<build_id>/app

# With custom design tokens
# (edit uiux/design_tokens.json first, then regenerate)
scripts/generate_assets.sh builds/<idea_dir>/<build_id>/app
```

### Regeneration Guarantees
- Same design tokens → Same asset colors
- Same brand identity → Same icon styling
- Generation is idempotent (running twice produces identical output)
- All colors sourced from design_tokens.json (no hardcoded values)

### Validation After Regeneration
```bash
# Verify assets meet specifications
scripts/verify_assets_present.sh builds/<idea_dir>/<build_id>/app
```

---

## Pipeline Stage Sequencing

The new stage integrates into the pipeline as follows:

```
Stage 08 (Brand Identity)
    ↓
    ├── brand_strategy.brand_name
    ├── visual_identity.color_palette
    ├── visual_identity.iconography_style
    └── brand_applications.app_icon
    ↓
Stage 08.5 (Assets & Iconography) ← NEW
    ↓
    ├── asset_specification.app_icon
    ├── asset_specification.splash_screen
    ├── asset_specification.in_app_icons
    └── asset_generation_config
    ↓
Stage 09 (Release Planning)
    ↓
Stage 10 (Build)
    ├── Gate 5: generate_assets.sh
    └── Gate 6: verify_assets_present.sh
```

---

## Compliance with CLAUDE.md Invariants

This addition complies with the PIPELINE-LEVEL INVARIANT for Asset Contract:

- ✅ Canonical generator defined (Node.js/sharp)
- ✅ No tool guessing at build time
- ✅ Deterministic placeholder generation
- ✅ All assets validated before build proceeds
- ✅ Proof artifacts produced (asset_contract.json, asset_generation_log.md)
- ✅ Stage 10 never discovers missing assets (Gate 6 prevents this)

---

## Testing Recommendations

1. **New Build Test**: Run `build <IDEA>` on a fresh idea and verify all assets appear
2. **Validation Test**: Manually remove an asset and verify Gate 6 catches it
3. **Regeneration Test**: Modify design_tokens.json colors and regenerate to verify color updates
4. **Platform Test**: Verify generated assets work in Expo preview on iOS and Android

---

**Report Generated**: 2026-01-09
**Pipeline Stage**: 08.5 (Assets & Iconography)
**Enforcement Location**: Stage 10, Gates 5-6
