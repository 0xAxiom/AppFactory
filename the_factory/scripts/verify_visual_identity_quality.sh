#!/bin/bash
#
# verify_visual_identity_quality.sh - Enforce Stage 08.5 quality requirements
#
# MANDATORY BUILD-BLOCKING GATE
# Builds MUST fail if visual identity assets don't meet professional standards.
#
# Usage: scripts/verify_visual_identity_quality.sh <idea_dir_path>
#
# Exit codes:
#   0 - All quality checks passed
#   1 - Missing arguments
#   2 - Missing asset concept document
#   3 - Typography-only icon without justification
#   4 - Icon lacks domain relevance (generic)
#   5 - PNG below minimum size threshold
#   6 - PNG invalid or corrupt
#   7 - Splash is flat placeholder
#   8 - No SVG sources found
#   9 - Embedded raster in SVG
#  10 - Quality checklist indicates failure
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_check() {
    echo -e "${CYAN}[CHECK]${NC} $1"
}

# Validate arguments
if [ -z "$1" ]; then
    log_error "Usage: $0 <idea_dir_path>"
    log_error "Example: $0 runs/2026-01-09/dream-123/ideas/01_my_app__app_001"
    exit 1
fi

IDEA_DIR="$1"
ASSETS_DIR="${IDEA_DIR}/assets"
SVG_DIR="${ASSETS_DIR}/svg"
APP_ASSETS_DIR="${IDEA_DIR}/app/assets"
CONCEPT_FILE="${ASSETS_DIR}/asset_concept.md"
CHECKLIST_FILE="${ASSETS_DIR}/assets_quality_checklist.md"
STAGE_JSON="${IDEA_DIR}/stages/stage08.5.json"

# Validation report
REPORT_FILE="${ASSETS_DIR}/quality_validation_report.md"
FAILURES=()
WARNINGS=()

add_failure() {
    FAILURES+=("$1")
    log_error "$1"
}

add_warning() {
    WARNINGS+=("$1")
    log_warn "$1"
}

# Start report
mkdir -p "$ASSETS_DIR"
cat > "$REPORT_FILE" << EOF
# Visual Identity Quality Validation Report

**Generated**: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
**Idea Directory**: $IDEA_DIR
**Validator**: verify_visual_identity_quality.sh

## Validation Results

EOF

#==============================================================================
# CHECK 1: Asset Concept Document Exists
#==============================================================================
log_check "Checking asset concept document..."

if [ ! -f "$CONCEPT_FILE" ]; then
    add_failure "asset_concept.md not found at $CONCEPT_FILE"
    echo "### Asset Concept Document" >> "$REPORT_FILE"
    echo "- **Status**: FAILED - File not found" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
else
    log_info "asset_concept.md exists"
    echo "### Asset Concept Document" >> "$REPORT_FILE"
    echo "- **Status**: PRESENT" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
fi

#==============================================================================
# CHECK 2: SVG Sources Exist
#==============================================================================
log_check "Checking SVG source files..."

echo "### SVG Sources" >> "$REPORT_FILE"

REQUIRED_SVGS=("icon.svg" "adaptive-icon-foreground.svg" "splash.svg")
SVG_MISSING=0

for svg in "${REQUIRED_SVGS[@]}"; do
    svg_path="${SVG_DIR}/${svg}"
    if [ ! -f "$svg_path" ]; then
        add_failure "Required SVG missing: $svg"
        echo "- **$svg**: MISSING" >> "$REPORT_FILE"
        SVG_MISSING=1
    else
        file_size=$(stat -f%z "$svg_path" 2>/dev/null || stat -c%s "$svg_path" 2>/dev/null)
        log_info "Found: $svg ($file_size bytes)"
        echo "- **$svg**: PRESENT ($file_size bytes)" >> "$REPORT_FILE"
    fi
done

echo "" >> "$REPORT_FILE"

if [ $SVG_MISSING -eq 1 ]; then
    add_failure "SVG sources not found - Stage 08.5 must create vector sources"
fi

#==============================================================================
# CHECK 3: No Embedded Raster in SVGs
#==============================================================================
log_check "Checking for embedded raster images in SVGs..."

echo "### Embedded Raster Check" >> "$REPORT_FILE"

RASTER_FOUND=0
if [ -d "$SVG_DIR" ]; then
    for svg_file in "$SVG_DIR"/*.svg; do
        if [ -f "$svg_file" ]; then
            svg_name=$(basename "$svg_file")
            # Check for base64 image data or xlink:href to external images
            if grep -q -E '(<image|xlink:href.*data:|base64)' "$svg_file" 2>/dev/null; then
                add_failure "Embedded raster found in: $svg_name"
                echo "- **$svg_name**: FAILED - Contains embedded raster" >> "$REPORT_FILE"
                RASTER_FOUND=1
            else
                log_info "No embedded raster in: $svg_name"
                echo "- **$svg_name**: PASS - True vector" >> "$REPORT_FILE"
            fi
        fi
    done
fi

echo "" >> "$REPORT_FILE"

#==============================================================================
# CHECK 4: Typography-Only Icon Detection
#==============================================================================
log_check "Checking for typography-only icon..."

echo "### Typography-Only Check" >> "$REPORT_FILE"

ICON_SVG="${SVG_DIR}/icon.svg"
TYPOGRAPHY_ONLY=0
TYPOGRAPHY_JUSTIFIED=0

if [ -f "$ICON_SVG" ]; then
    # Check if icon contains <text> elements
    TEXT_ELEMENTS=$(grep -c '<text' "$ICON_SVG" 2>/dev/null || echo "0")
    # Check for path/shape elements (non-text visual elements)
    SHAPE_ELEMENTS=$(grep -c -E '<(path|circle|rect|polygon|ellipse)' "$ICON_SVG" 2>/dev/null || echo "0")

    if [ "$TEXT_ELEMENTS" -gt 0 ] && [ "$SHAPE_ELEMENTS" -lt 2 ]; then
        # Icon appears to be typography-heavy, check for justification
        if [ -f "$CONCEPT_FILE" ]; then
            if grep -q -i "typography.*justification\|text-only.*justified\|typography_justification" "$CONCEPT_FILE" 2>/dev/null; then
                TYPOGRAPHY_JUSTIFIED=1
                log_info "Typography-heavy icon with justification found"
                echo "- **Status**: JUSTIFIED EXCEPTION - Typography use explained in concept" >> "$REPORT_FILE"
            else
                TYPOGRAPHY_ONLY=1
                add_failure "Icon appears typography-only without justification"
                echo "- **Status**: FAILED - Typography-only without justification" >> "$REPORT_FILE"
            fi
        else
            TYPOGRAPHY_ONLY=1
            add_failure "Icon appears typography-only, no concept document to check"
            echo "- **Status**: FAILED - Typography-only, no concept document" >> "$REPORT_FILE"
        fi
    else
        log_info "Icon contains sufficient symbolic elements"
        echo "- **Status**: PASS - Contains symbolic visual elements" >> "$REPORT_FILE"
    fi
else
    log_warn "Icon SVG not found for typography check"
    echo "- **Status**: SKIPPED - Icon SVG not found" >> "$REPORT_FILE"
fi

echo "" >> "$REPORT_FILE"

#==============================================================================
# CHECK 5: PNG File Validation
#==============================================================================
log_check "Validating PNG files..."

echo "### PNG File Validation" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "| Asset | Exists | Size | Min Size | PNG Valid | Status |" >> "$REPORT_FILE"
echo "|-------|--------|------|----------|-----------|--------|" >> "$REPORT_FILE"

# Define minimum sizes (bytes)
declare -A MIN_SIZES=(
    ["icon.png"]="10000"
    ["adaptive-icon.png"]="5000"
    ["adaptive-icon-foreground.png"]="5000"
    ["adaptive-icon-background.png"]="1000"
    ["splash.png"]="20000"
    ["favicon.png"]="500"
)

PNG_INVALID=0

for png_name in "${!MIN_SIZES[@]}"; do
    png_path="${APP_ASSETS_DIR}/${png_name}"
    min_size="${MIN_SIZES[$png_name]}"

    if [ ! -f "$png_path" ]; then
        echo "| $png_name | NO | - | $min_size | - | MISSING |" >> "$REPORT_FILE"
        add_warning "PNG not found: $png_name"
        continue
    fi

    # Get file size
    file_size=$(stat -f%z "$png_path" 2>/dev/null || stat -c%s "$png_path" 2>/dev/null)

    # Check minimum size
    size_ok="YES"
    if [ "$file_size" -lt "$min_size" ]; then
        size_ok="NO"
        add_failure "PNG below minimum size: $png_name ($file_size < $min_size bytes)"
        PNG_INVALID=1
    fi

    # Check PNG magic bytes
    magic=$(xxd -l 8 -p "$png_path" 2>/dev/null)
    png_valid="NO"
    if [ "$magic" = "89504e470d0a1a0a" ]; then
        png_valid="YES"
    else
        add_failure "Invalid PNG magic bytes: $png_name"
        PNG_INVALID=1
    fi

    # Check for IDAT chunk (actual pixel data)
    if ! xxd "$png_path" 2>/dev/null | grep -q "IDAT"; then
        png_valid="NO"
        add_failure "PNG missing IDAT chunk (no pixel data): $png_name"
        PNG_INVALID=1
    fi

    # Determine status
    if [ "$size_ok" = "YES" ] && [ "$png_valid" = "YES" ]; then
        status="PASS"
        log_info "Valid: $png_name ($file_size bytes)"
    else
        status="FAIL"
    fi

    echo "| $png_name | YES | $file_size | $min_size | $png_valid | $status |" >> "$REPORT_FILE"
done

echo "" >> "$REPORT_FILE"

#==============================================================================
# CHECK 6: Splash Screen Quality
#==============================================================================
log_check "Checking splash screen quality..."

echo "### Splash Screen Quality" >> "$REPORT_FILE"

SPLASH_SVG="${SVG_DIR}/splash.svg"
SPLASH_FLAT=0

if [ -f "$SPLASH_SVG" ]; then
    # Check for gradient definitions
    HAS_GRADIENT=$(grep -c -E '<(linearGradient|radialGradient)' "$SPLASH_SVG" 2>/dev/null || echo "0")
    # Check for multiple visual elements
    ELEMENT_COUNT=$(grep -c -E '<(path|circle|rect|polygon|ellipse|g id)' "$SPLASH_SVG" 2>/dev/null || echo "0")
    # Check for pattern definitions
    HAS_PATTERN=$(grep -c '<pattern' "$SPLASH_SVG" 2>/dev/null || echo "0")

    if [ "$HAS_GRADIENT" -eq 0 ] && [ "$ELEMENT_COUNT" -lt 3 ] && [ "$HAS_PATTERN" -eq 0 ]; then
        # Splash appears to be flat color + simple logo
        SPLASH_FLAT=1
        add_failure "Splash appears to be flat placeholder (no gradient, pattern, or branded elements)"
        echo "- **Status**: FAILED - Flat color + centered logo detected" >> "$REPORT_FILE"
        echo "- **Gradients**: $HAS_GRADIENT" >> "$REPORT_FILE"
        echo "- **Visual Elements**: $ELEMENT_COUNT" >> "$REPORT_FILE"
        echo "- **Patterns**: $HAS_PATTERN" >> "$REPORT_FILE"
    else
        log_info "Splash has visual treatment (gradients: $HAS_GRADIENT, elements: $ELEMENT_COUNT)"
        echo "- **Status**: PASS - Has visual treatment" >> "$REPORT_FILE"
        echo "- **Gradients**: $HAS_GRADIENT" >> "$REPORT_FILE"
        echo "- **Visual Elements**: $ELEMENT_COUNT" >> "$REPORT_FILE"
        echo "- **Patterns**: $HAS_PATTERN" >> "$REPORT_FILE"
    fi
else
    log_warn "Splash SVG not found for quality check"
    echo "- **Status**: SKIPPED - Splash SVG not found" >> "$REPORT_FILE"
fi

echo "" >> "$REPORT_FILE"

#==============================================================================
# CHECK 7: Domain Relevance (from concept document)
#==============================================================================
log_check "Checking domain relevance documentation..."

echo "### Domain Relevance" >> "$REPORT_FILE"

DOMAIN_DOCUMENTED=0
if [ -f "$CONCEPT_FILE" ]; then
    # Check for domain connection documentation
    if grep -q -i -E '(domain.*connection|domain.*relevance|represents.*app|symbol.*meaning)' "$CONCEPT_FILE" 2>/dev/null; then
        DOMAIN_DOCUMENTED=1
        log_info "Domain relevance documented in concept"
        echo "- **Status**: DOCUMENTED - Concept explains domain connection" >> "$REPORT_FILE"
    else
        add_warning "Domain relevance not clearly documented in concept"
        echo "- **Status**: WARNING - Domain connection not explicit in concept" >> "$REPORT_FILE"
    fi
else
    add_failure "Cannot verify domain relevance - concept document missing"
    echo "- **Status**: FAILED - Concept document missing" >> "$REPORT_FILE"
fi

echo "" >> "$REPORT_FILE"

#==============================================================================
# CHECK 8: Quality Checklist Exists and Passes
#==============================================================================
log_check "Checking quality checklist..."

echo "### Quality Checklist" >> "$REPORT_FILE"

if [ -f "$CHECKLIST_FILE" ]; then
    # Check if checklist indicates overall pass
    if grep -q -i "overall.*pass\|stage.*ready\|status.*pass" "$CHECKLIST_FILE" 2>/dev/null; then
        log_info "Quality checklist indicates PASS"
        echo "- **Status**: PRESENT - Indicates PASS" >> "$REPORT_FILE"
    elif grep -q -i "fail\|blocked" "$CHECKLIST_FILE" 2>/dev/null; then
        add_failure "Quality checklist indicates FAILURE"
        echo "- **Status**: FAILED - Checklist indicates failure" >> "$REPORT_FILE"
    else
        log_warn "Quality checklist status unclear"
        echo "- **Status**: WARNING - Status unclear" >> "$REPORT_FILE"
    fi
else
    add_warning "Quality checklist not found - should be generated by Stage 08.5"
    echo "- **Status**: MISSING - Should be created by Stage 08.5" >> "$REPORT_FILE"
fi

echo "" >> "$REPORT_FILE"

#==============================================================================
# SUMMARY
#==============================================================================
echo "## Summary" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

if [ ${#FAILURES[@]} -gt 0 ]; then
    echo "### Failures (BUILD-BLOCKING)" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    for failure in "${FAILURES[@]}"; do
        echo "- $failure" >> "$REPORT_FILE"
    done
    echo "" >> "$REPORT_FILE"
fi

if [ ${#WARNINGS[@]} -gt 0 ]; then
    echo "### Warnings" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    for warning in "${WARNINGS[@]}"; do
        echo "- $warning" >> "$REPORT_FILE"
    done
    echo "" >> "$REPORT_FILE"
fi

# Determine exit code based on specific failure types
EXIT_CODE=0

if [ ${#FAILURES[@]} -gt 0 ]; then
    echo "**OVERALL STATUS**: FAILED" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"

    # Determine specific exit code
    if [ ! -f "$CONCEPT_FILE" ]; then
        EXIT_CODE=2
    elif [ $TYPOGRAPHY_ONLY -eq 1 ]; then
        EXIT_CODE=3
    elif [ $SVG_MISSING -eq 1 ]; then
        EXIT_CODE=8
    elif [ $RASTER_FOUND -eq 1 ]; then
        EXIT_CODE=9
    elif [ $PNG_INVALID -eq 1 ]; then
        # Check if size issue or format issue
        for failure in "${FAILURES[@]}"; do
            if [[ "$failure" == *"below minimum size"* ]]; then
                EXIT_CODE=5
                break
            elif [[ "$failure" == *"Invalid PNG"* ]] || [[ "$failure" == *"IDAT"* ]]; then
                EXIT_CODE=6
                break
            fi
        done
    elif [ $SPLASH_FLAT -eq 1 ]; then
        EXIT_CODE=7
    else
        EXIT_CODE=10  # Generic quality failure
    fi

    log_error "Visual identity quality validation FAILED with ${#FAILURES[@]} errors"
    log_error "See report: $REPORT_FILE"
else
    echo "**OVERALL STATUS**: PASSED" >> "$REPORT_FILE"
    log_info "Visual identity quality validation PASSED"
fi

exit $EXIT_CODE
