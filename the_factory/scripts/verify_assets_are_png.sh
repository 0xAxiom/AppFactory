#!/bin/bash
# verify_assets_are_png.sh - Verifies all required assets are valid PNG binaries
# Usage: scripts/verify_assets_are_png.sh <app_dir>
#
# MANDATORY: Stage 10 build fails if ANY asset is not a valid PNG
#
# Validation checks:
#   1. File exists
#   2. File size > 5KB (catches empty/placeholder files)
#   3. PNG magic bytes (89 50 4E 47 0D 0A 1A 0A)
#   4. MIME type is image/png (not SVG or text)
#   5. Contains IDAT chunk (actual pixel data)
#
# Exit codes:
#   0 = All assets are valid PNGs
#   1 = One or more assets failed validation

set -e

APP_DIR="$1"

if [[ -z "$APP_DIR" ]]; then
    echo "Usage: $0 <app_dir>"
    echo "Example: $0 builds/01_app__id_001/build_xxx/app"
    exit 1
fi

ASSETS_DIR="$APP_DIR/assets"

# Define required assets with minimum sizes
declare -A REQUIRED_ASSETS=(
    ["icon.png"]="5000"           # 5KB minimum
    ["adaptive-icon.png"]="5000"  # 5KB minimum (adaptive-icon-foreground.png also accepted)
    ["splash.png"]="10000"        # 10KB minimum (larger image)
    ["favicon.png"]="500"         # 500B minimum (small icon)
)

# Alternative names for some assets
declare -A ASSET_ALTERNATIVES=(
    ["adaptive-icon.png"]="adaptive-icon-foreground.png"
)

echo "Verifying PNG assets in: $ASSETS_DIR"
echo "============================================"

ERRORS=""
WARNINGS=""
VALIDATION_RESULTS=""

# Function to check PNG magic bytes
check_png_magic() {
    local file="$1"
    # PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
    local magic=$(xxd -l 8 -p "$file" 2>/dev/null)
    if [[ "$magic" == "89504e470d0a1a0a" ]]; then
        return 0
    else
        return 1
    fi
}

# Function to check for IDAT chunk (pixel data)
check_idat_chunk() {
    local file="$1"
    # IDAT is the chunk containing actual image data
    if xxd "$file" 2>/dev/null | grep -q "IDAT"; then
        return 0
    else
        return 1
    fi
}

# Function to check MIME type
check_mime_type() {
    local file="$1"
    local mime=$(file --mime-type -b "$file" 2>/dev/null)
    if [[ "$mime" == "image/png" ]]; then
        return 0
    else
        echo "$mime"
        return 1
    fi
}

# Function to check if file is SVG content
check_not_svg() {
    local file="$1"
    # Check if file starts with XML/SVG markers
    local head=$(head -c 100 "$file" 2>/dev/null)
    if [[ "$head" == *"<svg"* ]] || [[ "$head" == *"<?xml"* ]] || [[ "$head" == *"<!DOCTYPE svg"* ]]; then
        return 1  # Is SVG
    fi
    return 0  # Not SVG
}

# Validate each required asset
for asset in "${!REQUIRED_ASSETS[@]}"; do
    MIN_SIZE="${REQUIRED_ASSETS[$asset]}"
    ASSET_PATH="$ASSETS_DIR/$asset"

    # Check for alternative name
    if [[ ! -f "$ASSET_PATH" ]] && [[ -n "${ASSET_ALTERNATIVES[$asset]}" ]]; then
        ALT_PATH="$ASSETS_DIR/${ASSET_ALTERNATIVES[$asset]}"
        if [[ -f "$ALT_PATH" ]]; then
            ASSET_PATH="$ALT_PATH"
            asset="${ASSET_ALTERNATIVES[$asset]}"
        fi
    fi

    echo ""
    echo "Checking: $asset"
    echo "---"

    # Check 1: File exists
    if [[ ! -f "$ASSET_PATH" ]]; then
        ERRORS="${ERRORS}\n❌ $asset: File does not exist"
        VALIDATION_RESULTS="${VALIDATION_RESULTS}\n| $asset | MISSING | - | - | - | FAIL |"
        continue
    fi

    # Check 2: File size
    FILE_SIZE=$(stat -f%z "$ASSET_PATH" 2>/dev/null || stat -c%s "$ASSET_PATH" 2>/dev/null || echo "0")
    if [[ $FILE_SIZE -lt $MIN_SIZE ]]; then
        ERRORS="${ERRORS}\n❌ $asset: File too small (${FILE_SIZE} bytes, minimum ${MIN_SIZE})"
        VALIDATION_RESULTS="${VALIDATION_RESULTS}\n| $asset | ${FILE_SIZE}B | - | - | - | FAIL (too small) |"
        continue
    fi
    echo "  Size: ${FILE_SIZE} bytes ✓"

    # Check 3: Not SVG content
    if ! check_not_svg "$ASSET_PATH"; then
        ERRORS="${ERRORS}\n❌ $asset: Contains SVG content (saved as .png but is actually SVG)"
        VALIDATION_RESULTS="${VALIDATION_RESULTS}\n| $asset | ${FILE_SIZE}B | SVG | - | - | FAIL (SVG content) |"
        continue
    fi
    echo "  Not SVG: ✓"

    # Check 4: PNG magic bytes
    if ! check_png_magic "$ASSET_PATH"; then
        ERRORS="${ERRORS}\n❌ $asset: Invalid PNG magic bytes (not a real PNG)"
        VALIDATION_RESULTS="${VALIDATION_RESULTS}\n| $asset | ${FILE_SIZE}B | - | INVALID | - | FAIL (bad magic) |"
        continue
    fi
    echo "  PNG Magic: ✓"

    # Check 5: MIME type
    MIME_RESULT=$(check_mime_type "$ASSET_PATH" || echo "unknown")
    if [[ "$MIME_RESULT" != "" ]]; then
        ERRORS="${ERRORS}\n❌ $asset: Wrong MIME type ($MIME_RESULT, expected image/png)"
        VALIDATION_RESULTS="${VALIDATION_RESULTS}\n| $asset | ${FILE_SIZE}B | $MIME_RESULT | - | - | FAIL (wrong MIME) |"
        continue
    fi
    echo "  MIME type: image/png ✓"

    # Check 6: IDAT chunk (actual pixel data)
    if ! check_idat_chunk "$ASSET_PATH"; then
        ERRORS="${ERRORS}\n❌ $asset: Missing IDAT chunk (no pixel data)"
        VALIDATION_RESULTS="${VALIDATION_RESULTS}\n| $asset | ${FILE_SIZE}B | image/png | ✓ | MISSING | FAIL (no pixels) |"
        continue
    fi
    echo "  IDAT chunk: ✓"

    # All checks passed
    echo "  Status: VALID ✓"
    VALIDATION_RESULTS="${VALIDATION_RESULTS}\n| $asset | ${FILE_SIZE}B | image/png | ✓ | ✓ | PASS |"
done

echo ""
echo "============================================"

# Generate validation report
REPORT_PATH="$APP_DIR/assets_validation_report.md"
cat > "$REPORT_PATH" << HEADER
# Asset Validation Report

> Verifies all required app assets are valid PNG binaries.

**Build Directory**: $APP_DIR
**Validation Date**: $(date -u +"%Y-%m-%dT%H:%M:%SZ")

---

## Validation Summary

| Asset | Size | MIME Type | PNG Magic | IDAT Chunk | Result |
|-------|------|-----------|-----------|------------|--------|
HEADER

echo -e "$VALIDATION_RESULTS" >> "$REPORT_PATH"

cat >> "$REPORT_PATH" << 'CHECKS'

---

## Validation Checks Performed

1. **File Exists**: Asset file must be present
2. **Minimum Size**: Files must exceed minimum byte threshold (catches empty/placeholder files)
3. **Not SVG**: File content must not be SVG markup saved as .png
4. **PNG Magic Bytes**: First 8 bytes must be `89 50 4E 47 0D 0A 1A 0A`
5. **MIME Type**: `file --mime-type` must report `image/png`
6. **IDAT Chunk**: PNG must contain IDAT chunk (actual pixel data)

---

## Asset Requirements

| Asset | Minimum Size | Dimensions |
|-------|-------------|------------|
| icon.png | 5 KB | 1024x1024 |
| adaptive-icon.png | 5 KB | 1024x1024 |
| splash.png | 10 KB | 1284x2778 |
| favicon.png | 500 B | 48x48 or 64x64 |

CHECKS

# Add errors or success message
if [[ -n "$ERRORS" ]]; then
    cat >> "$REPORT_PATH" << EOF
---

## ❌ VALIDATION FAILED

The following assets failed validation:
$(echo -e "$ERRORS")

### Required Actions

1. Regenerate failed assets using proper PNG rasterization
2. Ensure SVG sources are converted to PNG binaries
3. Verify output files are not empty or corrupt
4. Re-run asset validation

EOF
    echo "❌ FAIL: Asset validation failed"
    echo -e "$ERRORS"
    echo ""
    echo "Report written to: $REPORT_PATH"
    exit 1
else
    cat >> "$REPORT_PATH" << 'EOF'
---

## ✅ VALIDATION PASSED

All required assets are valid PNG binaries with proper pixel data.

EOF
    echo "✅ PASS: All assets are valid PNGs"
    echo "Report written to: $REPORT_PATH"
    exit 0
fi
