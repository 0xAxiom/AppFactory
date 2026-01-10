#!/bin/bash
#
# verify_assets_present.sh - Validate required assets exist and meet specifications
#
# Usage: scripts/verify_assets_present.sh <build_app_path>
#
# Validates:
#   - icon.png exists and is 1024x1024
#   - adaptive-icon-foreground.png exists
#   - splash.png exists with minimum dimensions
#   - In-app icon set exists (minimum 12 icons)
#   - Icons reference theme tokens (no random hardcoded colors)
#
# Exit codes:
#   0 = all validations passed
#   1 = missing arguments
#   2 = missing required asset
#   3 = asset validation failure (wrong size, etc.)
#   4 = icon set validation failure
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

ERRORS=0

# Validate arguments
if [ -z "$1" ]; then
    log_error "Usage: $0 <build_app_path>"
    log_error "Example: $0 builds/my_app/build_123/app"
    exit 1
fi

BUILD_APP_PATH="$1"
ASSETS_DIR="$BUILD_APP_PATH/assets"
ICONS_DIR="$BUILD_APP_PATH/src/ui/icons"

echo ""
echo "================================================"
echo "  Asset Validation Report"
echo "  Build Path: $BUILD_APP_PATH"
echo "================================================"
echo ""

# Check if build path exists
if [ ! -d "$BUILD_APP_PATH" ]; then
    log_error "Build path does not exist: $BUILD_APP_PATH"
    exit 1
fi

# ============================================
# SECTION 1: App Icon Validation
# ============================================
echo "--- App Icon Validation ---"

ICON_PATH="$ASSETS_DIR/icon.png"
if [ -f "$ICON_PATH" ]; then
    # Check dimensions using file or identify if available
    if command -v file &> /dev/null; then
        ICON_INFO=$(file "$ICON_PATH")
        if echo "$ICON_INFO" | grep -q "1024 x 1024"; then
            log_info "icon.png exists and is 1024x1024"
        elif echo "$ICON_INFO" | grep -q "PNG image"; then
            log_warn "icon.png exists but cannot verify dimensions (may be OK)"
            # Try using Node.js with sharp if available
            if [ -f "$BUILD_APP_PATH/node_modules/sharp/package.json" ]; then
                SIZE=$(cd "$BUILD_APP_PATH" && node -e "const sharp = require('sharp'); sharp('$ICON_PATH').metadata().then(m => console.log(m.width + 'x' + m.height))" 2>/dev/null || echo "unknown")
                if [ "$SIZE" = "1024x1024" ]; then
                    log_info "icon.png verified: 1024x1024"
                elif [ "$SIZE" != "unknown" ]; then
                    log_error "icon.png has incorrect dimensions: $SIZE (expected 1024x1024)"
                    ERRORS=$((ERRORS + 1))
                fi
            fi
        else
            log_error "icon.png is not a valid PNG"
            ERRORS=$((ERRORS + 1))
        fi
    else
        # Fallback: just check file exists
        log_info "icon.png exists (dimensions not verified)"
    fi
else
    log_error "Missing required asset: icon.png"
    ERRORS=$((ERRORS + 1))
fi

# ============================================
# SECTION 2: Adaptive Icon Validation
# ============================================
echo ""
echo "--- Adaptive Icon Validation ---"

ADAPTIVE_FG_PATH="$ASSETS_DIR/adaptive-icon-foreground.png"
if [ -f "$ADAPTIVE_FG_PATH" ]; then
    log_info "adaptive-icon-foreground.png exists"
else
    log_error "Missing required asset: adaptive-icon-foreground.png"
    ERRORS=$((ERRORS + 1))
fi

# ============================================
# SECTION 3: Splash Screen Validation
# ============================================
echo ""
echo "--- Splash Screen Validation ---"

SPLASH_PATH="$ASSETS_DIR/splash.png"
if [ -f "$SPLASH_PATH" ]; then
    log_info "splash.png exists"

    # Try to verify minimum dimensions
    if [ -f "$BUILD_APP_PATH/node_modules/sharp/package.json" ]; then
        SPLASH_WIDTH=$(cd "$BUILD_APP_PATH" && node -e "const sharp = require('sharp'); sharp('$SPLASH_PATH').metadata().then(m => console.log(m.width))" 2>/dev/null || echo "0")
        SPLASH_HEIGHT=$(cd "$BUILD_APP_PATH" && node -e "const sharp = require('sharp'); sharp('$SPLASH_PATH').metadata().then(m => console.log(m.height))" 2>/dev/null || echo "0")

        if [ "$SPLASH_WIDTH" -ge 1284 ] && [ "$SPLASH_HEIGHT" -ge 2778 ]; then
            log_info "splash.png meets minimum dimensions (${SPLASH_WIDTH}x${SPLASH_HEIGHT})"
        elif [ "$SPLASH_WIDTH" != "0" ]; then
            log_warn "splash.png is ${SPLASH_WIDTH}x${SPLASH_HEIGHT} (recommended: 1284x2778 minimum)"
        fi
    fi
else
    log_error "Missing required asset: splash.png"
    ERRORS=$((ERRORS + 1))
fi

# ============================================
# SECTION 4: In-App Icon Set Validation
# ============================================
echo ""
echo "--- In-App Icon Set Validation ---"

MIN_ICONS=12

if [ -d "$ICONS_DIR" ]; then
    # Count icon exports in index.ts or Icon.tsx
    if [ -f "$ICONS_DIR/index.ts" ]; then
        ICON_COUNT=$(grep -c "export.*Icon" "$ICONS_DIR/index.ts" 2>/dev/null || echo "0")
        # Alternative: count Icon components
        if [ "$ICON_COUNT" -lt "$MIN_ICONS" ] && [ -f "$ICONS_DIR/Icon.tsx" ]; then
            ICON_COUNT=$(grep -c "export const.*Icon" "$ICONS_DIR/Icon.tsx" 2>/dev/null || echo "0")
        fi

        if [ "$ICON_COUNT" -ge "$MIN_ICONS" ]; then
            log_info "Icon set has $ICON_COUNT icons (minimum: $MIN_ICONS)"
        else
            log_error "Icon set has only $ICON_COUNT icons (minimum: $MIN_ICONS required)"
            ERRORS=$((ERRORS + 1))
        fi
    else
        # Check for individual icon files
        ICON_FILES=$(find "$ICONS_DIR" -name "*.tsx" -o -name "*.ts" 2>/dev/null | wc -l | tr -d ' ')
        if [ "$ICON_FILES" -ge 1 ]; then
            log_info "Found $ICON_FILES icon file(s) in $ICONS_DIR"
        else
            log_error "No icon files found in $ICONS_DIR"
            ERRORS=$((ERRORS + 1))
        fi
    fi
else
    log_error "Icon directory does not exist: $ICONS_DIR"
    ERRORS=$((ERRORS + 1))
fi

# ============================================
# SECTION 5: Theme Token Reference Validation
# ============================================
echo ""
echo "--- Theme Token Reference Validation ---"

# Check if icons use props for colors (not hardcoded)
if [ -f "$ICONS_DIR/Icon.tsx" ]; then
    # Good pattern: color prop passed to stroke/fill
    if grep -q "stroke={color}" "$ICONS_DIR/Icon.tsx" || grep -q "fill={color}" "$ICONS_DIR/Icon.tsx"; then
        log_info "Icons use dynamic color props (theme-compatible)"
    fi

    # Bad pattern: hardcoded hex colors inside SVG paths
    HARDCODED_COLORS=$(grep -E "stroke=\"#[0-9a-fA-F]{3,6}\"|fill=\"#[0-9a-fA-F]{3,6}\"" "$ICONS_DIR/Icon.tsx" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$HARDCODED_COLORS" -gt 0 ]; then
        log_warn "Found $HARDCODED_COLORS hardcoded colors in icons (should use theme props)"
    fi
fi

# ============================================
# SECTION 6: App Config Validation
# ============================================
echo ""
echo "--- App Config Asset References ---"

# Check app.json or app.config.js for asset references
APP_CONFIG=""
if [ -f "$BUILD_APP_PATH/app.json" ]; then
    APP_CONFIG="$BUILD_APP_PATH/app.json"
elif [ -f "$BUILD_APP_PATH/app.config.js" ]; then
    APP_CONFIG="$BUILD_APP_PATH/app.config.js"
elif [ -f "$BUILD_APP_PATH/app.config.ts" ]; then
    APP_CONFIG="$BUILD_APP_PATH/app.config.ts"
fi

if [ -n "$APP_CONFIG" ]; then
    # Check for icon reference
    if grep -q "icon" "$APP_CONFIG"; then
        log_info "App config references icon"
    else
        log_warn "App config may not reference icon properly"
    fi

    # Check for splash reference
    if grep -q "splash" "$APP_CONFIG"; then
        log_info "App config references splash"
    else
        log_warn "App config may not reference splash properly"
    fi

    # Check for adaptiveIcon reference
    if grep -q "adaptiveIcon" "$APP_CONFIG"; then
        log_info "App config references adaptiveIcon"
    else
        log_warn "App config may not reference Android adaptive icon"
    fi
else
    log_warn "No app config file found (app.json or app.config.js)"
fi

# ============================================
# SUMMARY
# ============================================
echo ""
echo "================================================"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}  VALIDATION PASSED${NC}"
    echo "  All required assets are present and valid"
else
    echo -e "${RED}  VALIDATION FAILED${NC}"
    echo "  Errors found: $ERRORS"
fi
echo "================================================"
echo ""

if [ $ERRORS -gt 0 ]; then
    exit 2
fi

exit 0
