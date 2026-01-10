#!/bin/bash
#
# rasterize_svg_assets.sh - Convert SVG sources to PNG assets
#
# MANDATORY STAGE 08.5 SCRIPT
# SVG is source of truth. PNGs are derived artifacts.
#
# Usage: scripts/rasterize_svg_assets.sh <idea_dir_path>
#
# Example: scripts/rasterize_svg_assets.sh runs/2026-01-09/dream-123/ideas/01_my_app__app_001
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Validate arguments
if [ -z "$1" ]; then
    log_error "Usage: $0 <idea_dir_path>"
    log_error "Example: $0 runs/2026-01-09/dream-123/ideas/01_my_app__app_001"
    exit 1
fi

IDEA_DIR="$1"
SVG_DIR="${IDEA_DIR}/assets/svg"
OUTPUT_DIR="${IDEA_DIR}/app/assets"
REPORT_FILE="${IDEA_DIR}/assets/rasterization_report.md"

# Validate SVG source directory exists
if [ ! -d "$SVG_DIR" ]; then
    log_error "SVG source directory does not exist: $SVG_DIR"
    log_error "Stage 08.5 must create SVG sources before rasterization"
    exit 2
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Check for rasterization toolchain
TOOLCHAIN=""

# Check for Node.js with sharp
if command -v node &> /dev/null; then
    # Test if sharp is available
    if node -e "try { require('sharp'); process.exit(0); } catch(e) { process.exit(1); }" 2>/dev/null; then
        TOOLCHAIN="sharp"
        log_info "Using sharp (Node.js) for rasterization"
    fi
fi

# Fallback to sips on macOS
if [ -z "$TOOLCHAIN" ] && command -v sips &> /dev/null; then
    TOOLCHAIN="sips"
    log_warn "Falling back to sips (macOS) for rasterization"
fi

# No toolchain available
if [ -z "$TOOLCHAIN" ]; then
    log_error "No rasterization toolchain available"
    log_error "Install sharp: npm install -g sharp-cli"
    log_error "Or use macOS with sips"
    exit 3
fi

# Define rasterization jobs
declare -A RASTER_JOBS=(
    ["icon.svg"]="icon.png:1024:1024"
    ["adaptive-icon-foreground.svg"]="adaptive-icon-foreground.png:1024:1024"
    ["adaptive-icon-background.svg"]="adaptive-icon-background.png:1024:1024"
    ["splash.svg"]="splash.png:1284:2778"
)

# Additional job for combined adaptive icon
ADAPTIVE_ICON_JOB="adaptive-icon.png:1024:1024"

# Start report
cat > "$REPORT_FILE" << EOF
# SVG Rasterization Report

**Generated**: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
**Toolchain**: $TOOLCHAIN
**Source Directory**: $SVG_DIR
**Output Directory**: $OUTPUT_DIR

## Rasterization Jobs

EOF

FAILURES=0
SUCCESSES=0

# Rasterize using sharp (Node.js)
rasterize_with_sharp() {
    local svg_file="$1"
    local png_file="$2"
    local width="$3"
    local height="$4"

    # Create inline Node.js script for rasterization
    node << NODESCRIPT
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = '${svg_file}';
const pngPath = '${png_file}';
const width = ${width};
const height = ${height};

async function rasterize() {
    try {
        const svgBuffer = fs.readFileSync(svgPath);
        await sharp(svgBuffer)
            .resize(width, height, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .png()
            .toFile(pngPath);
        console.log('SUCCESS');
    } catch (error) {
        console.error('FAILED:', error.message);
        process.exit(1);
    }
}

rasterize();
NODESCRIPT
}

# Rasterize using sips (macOS)
rasterize_with_sips() {
    local svg_file="$1"
    local png_file="$2"
    local width="$3"
    local height="$4"

    # sips doesn't handle SVG directly, need to use qlmanage or convert first
    # For now, use qlmanage as fallback
    if command -v qlmanage &> /dev/null; then
        # Generate thumbnail and resize
        local temp_png="${png_file}.temp.png"
        qlmanage -t -s "${width}" -o "$(dirname "$png_file")" "$svg_file" 2>/dev/null

        # qlmanage creates file with different name, rename it
        local generated_name="$(basename "$svg_file").png"
        local generated_path="$(dirname "$png_file")/${generated_name}"

        if [ -f "$generated_path" ]; then
            mv "$generated_path" "$png_file"
            # Resize if needed
            sips -z "$height" "$width" "$png_file" 2>/dev/null
            echo "SUCCESS"
        else
            echo "FAILED: qlmanage did not generate output"
            return 1
        fi
    else
        echo "FAILED: No SVG rasterization available on this system"
        return 1
    fi
}

# Process each SVG
for svg_name in "${!RASTER_JOBS[@]}"; do
    svg_path="${SVG_DIR}/${svg_name}"

    # Parse job spec
    IFS=':' read -r png_name width height <<< "${RASTER_JOBS[$svg_name]}"
    png_path="${OUTPUT_DIR}/${png_name}"

    echo "| ${svg_name} | ${png_name} | ${width}x${height} |" >> "$REPORT_FILE"

    if [ ! -f "$svg_path" ]; then
        log_warn "SVG source not found: $svg_path"
        echo "  - **Status**: SKIPPED (source not found)" >> "$REPORT_FILE"
        continue
    fi

    log_info "Rasterizing: $svg_name -> $png_name (${width}x${height})"

    # Rasterize based on toolchain
    if [ "$TOOLCHAIN" = "sharp" ]; then
        result=$(rasterize_with_sharp "$svg_path" "$png_path" "$width" "$height" 2>&1)
    else
        result=$(rasterize_with_sips "$svg_path" "$png_path" "$width" "$height" 2>&1)
    fi

    if [[ "$result" == *"SUCCESS"* ]] && [ -f "$png_path" ]; then
        file_size=$(stat -f%z "$png_path" 2>/dev/null || stat -c%s "$png_path" 2>/dev/null)
        log_info "  Created: $png_path ($file_size bytes)"
        echo "  - **Status**: SUCCESS ($file_size bytes)" >> "$REPORT_FILE"
        ((SUCCESSES++))
    else
        log_error "  Failed to rasterize: $svg_name"
        log_error "  Error: $result"
        echo "  - **Status**: FAILED - $result" >> "$REPORT_FILE"
        ((FAILURES++))
    fi
done

# Generate favicon (48x48) from icon.svg
FAVICON_SVG="${SVG_DIR}/icon.svg"
FAVICON_PNG="${OUTPUT_DIR}/favicon.png"
if [ -f "$FAVICON_SVG" ]; then
    log_info "Generating favicon from icon.svg"
    if [ "$TOOLCHAIN" = "sharp" ]; then
        result=$(rasterize_with_sharp "$FAVICON_SVG" "$FAVICON_PNG" "48" "48" 2>&1)
    else
        result=$(rasterize_with_sips "$FAVICON_SVG" "$FAVICON_PNG" "48" "48" 2>&1)
    fi

    if [[ "$result" == *"SUCCESS"* ]] && [ -f "$FAVICON_PNG" ]; then
        file_size=$(stat -f%z "$FAVICON_PNG" 2>/dev/null || stat -c%s "$FAVICON_PNG" 2>/dev/null)
        log_info "  Created: favicon.png ($file_size bytes)"
        echo "" >> "$REPORT_FILE"
        echo "| icon.svg | favicon.png | 48x48 | SUCCESS ($file_size bytes) |" >> "$REPORT_FILE"
        ((SUCCESSES++))
    else
        log_error "  Failed to generate favicon"
        ((FAILURES++))
    fi
fi

# Summary
echo "" >> "$REPORT_FILE"
echo "## Summary" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "- **Successful**: $SUCCESSES" >> "$REPORT_FILE"
echo "- **Failed**: $FAILURES" >> "$REPORT_FILE"
echo "- **Toolchain**: $TOOLCHAIN" >> "$REPORT_FILE"

if [ $FAILURES -gt 0 ]; then
    log_error "Rasterization completed with $FAILURES failures"
    echo "" >> "$REPORT_FILE"
    echo "**STATUS**: FAILED" >> "$REPORT_FILE"
    exit 4
fi

log_info "Rasterization completed successfully: $SUCCESSES assets generated"
echo "" >> "$REPORT_FILE"
echo "**STATUS**: SUCCESS" >> "$REPORT_FILE"

exit 0
