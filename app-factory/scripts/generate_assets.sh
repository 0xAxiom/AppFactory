#!/bin/bash
#
# generate_assets.sh - Deterministic asset generation for Expo React Native apps
#
# Usage: scripts/generate_assets.sh <build_app_path>
#
# This script generates or updates all required visual assets:
#   - assets/icon.png (1024x1024)
#   - assets/adaptive-icon-foreground.png (1024x1024)
#   - assets/splash.png (1284x2778 minimum)
#   - src/ui/icons/ (SVG icon components)
#
# Prerequisites:
#   - Node.js installed
#   - sharp package (installed via npm)
#
# Exit codes:
#   0 = success
#   1 = missing arguments
#   2 = missing dependencies
#   3 = generation failure
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
    log_error "Usage: $0 <build_app_path>"
    log_error "Example: $0 builds/my_app/build_123/app"
    exit 1
fi

BUILD_APP_PATH="$1"
ASSETS_DIR="$BUILD_APP_PATH/assets"
ICONS_DIR="$BUILD_APP_PATH/src/ui/icons"

log_info "Starting asset generation for: $BUILD_APP_PATH"

# Check if build path exists
if [ ! -d "$BUILD_APP_PATH" ]; then
    log_error "Build path does not exist: $BUILD_APP_PATH"
    exit 1
fi

# Create directories if they don't exist
mkdir -p "$ASSETS_DIR"
mkdir -p "$ICONS_DIR"

# Check for design tokens to extract colors
TOKENS_FILE="$BUILD_APP_PATH/src/theme/colors.ts"
TOKENS_JSON="$BUILD_APP_PATH/src/theme/tokens.json"

# Default colors (will be overridden if design tokens exist)
BG_COLOR="#1a1a2e"
FG_COLOR="#ffffff"
PRIMARY_COLOR="#4a90d9"
ACCENT_COLOR="#e94560"

# Try to extract colors from design tokens
if [ -f "$TOKENS_JSON" ]; then
    log_info "Found design tokens at $TOKENS_JSON"
    # Extract colors using node
    BG_COLOR=$(node -e "const t = require('$TOKENS_JSON'); console.log(t.colors?.background || t.bg || '#1a1a2e')" 2>/dev/null || echo "#1a1a2e")
    PRIMARY_COLOR=$(node -e "const t = require('$TOKENS_JSON'); console.log(t.colors?.primary || t.primary || '#4a90d9')" 2>/dev/null || echo "#4a90d9")
    FG_COLOR=$(node -e "const t = require('$TOKENS_JSON'); console.log(t.colors?.foreground || t.fg || '#ffffff')" 2>/dev/null || echo "#ffffff")
fi

log_info "Using colors: BG=$BG_COLOR, FG=$FG_COLOR, PRIMARY=$PRIMARY_COLOR"

# Create asset generator Node script
GENERATOR_SCRIPT="$BUILD_APP_PATH/_asset_generator.mjs"

cat > "$GENERATOR_SCRIPT" << 'GENERATOR_EOF'
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const assetsDir = args[0] || './assets';
const bgColor = args[1] || '#1a1a2e';
const fgColor = args[2] || '#ffffff';
const primaryColor = args[3] || '#4a90d9';
const appName = args[4] || 'App';

// Ensure directory exists
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

// Generate app icon (1024x1024)
async function generateAppIcon() {
    const size = 1024;
    const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="${bgColor}"/>
        <circle cx="${size/2}" cy="${size/2}" r="${size/3}" fill="${primaryColor}"/>
        <text x="${size/2}" y="${size/2 + 80}"
              font-family="Arial, sans-serif"
              font-size="280"
              font-weight="bold"
              fill="${fgColor}"
              text-anchor="middle">${appName.charAt(0).toUpperCase()}</text>
    </svg>`;

    await sharp(Buffer.from(svg))
        .resize(size, size)
        .png()
        .toFile(path.join(assetsDir, 'icon.png'));

    console.log('Generated: icon.png (1024x1024)');
}

// Generate adaptive icon foreground (1024x1024 with transparency)
async function generateAdaptiveForeground() {
    const size = 1024;
    const safeZone = size * 0.66; // 66% safe zone
    const offset = (size - safeZone) / 2;

    const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size/2}" cy="${size/2}" r="${safeZone/2.5}" fill="${primaryColor}"/>
        <text x="${size/2}" y="${size/2 + 70}"
              font-family="Arial, sans-serif"
              font-size="250"
              font-weight="bold"
              fill="${fgColor}"
              text-anchor="middle">${appName.charAt(0).toUpperCase()}</text>
    </svg>`;

    await sharp(Buffer.from(svg))
        .resize(size, size)
        .png()
        .toFile(path.join(assetsDir, 'adaptive-icon-foreground.png'));

    console.log('Generated: adaptive-icon-foreground.png (1024x1024)');
}

// Generate splash screen (1284x2778)
async function generateSplash() {
    const width = 1284;
    const height = 2778;
    const logoSize = width * 0.4;

    const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="${bgColor}"/>
        <circle cx="${width/2}" cy="${height/2}" r="${logoSize/2}" fill="${primaryColor}"/>
        <text x="${width/2}" y="${height/2 + 50}"
              font-family="Arial, sans-serif"
              font-size="180"
              font-weight="bold"
              fill="${fgColor}"
              text-anchor="middle">${appName.charAt(0).toUpperCase()}</text>
    </svg>`;

    await sharp(Buffer.from(svg))
        .resize(width, height)
        .png()
        .toFile(path.join(assetsDir, 'splash.png'));

    console.log('Generated: splash.png (1284x2778)');
}

// Generate favicon for web (if needed)
async function generateFavicon() {
    const size = 48;
    const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="${bgColor}"/>
        <circle cx="${size/2}" cy="${size/2}" r="${size/3}" fill="${primaryColor}"/>
        <text x="${size/2}" y="${size/2 + 6}"
              font-family="Arial, sans-serif"
              font-size="24"
              font-weight="bold"
              fill="${fgColor}"
              text-anchor="middle">${appName.charAt(0).toUpperCase()}</text>
    </svg>`;

    await sharp(Buffer.from(svg))
        .resize(size, size)
        .png()
        .toFile(path.join(assetsDir, 'favicon.png'));

    console.log('Generated: favicon.png (48x48)');
}

// Run all generators
async function main() {
    try {
        await generateAppIcon();
        await generateAdaptiveForeground();
        await generateSplash();
        await generateFavicon();
        console.log('\nAll assets generated successfully!');
    } catch (error) {
        console.error('Asset generation failed:', error);
        process.exit(3);
    }
}

main();
GENERATOR_EOF

# Check if sharp is installed, install if needed
log_info "Checking for sharp dependency..."
cd "$BUILD_APP_PATH"

if ! node -e "require('sharp')" 2>/dev/null; then
    log_warn "sharp not found, installing..."
    npm install sharp --save-dev 2>/dev/null || {
        log_error "Failed to install sharp. Please run: npm install sharp --save-dev"
        exit 2
    }
fi

# Extract app name from package.json or app.json
APP_NAME="App"
if [ -f "$BUILD_APP_PATH/app.json" ]; then
    APP_NAME=$(node -e "const a = require('./app.json'); console.log(a.expo?.name || a.name || 'App')" 2>/dev/null || echo "App")
elif [ -f "$BUILD_APP_PATH/package.json" ]; then
    APP_NAME=$(node -e "const p = require('./package.json'); console.log(p.name || 'App')" 2>/dev/null || echo "App")
fi

log_info "App name: $APP_NAME"

# Run the generator
log_info "Running asset generator..."
node "$GENERATOR_SCRIPT" "$ASSETS_DIR" "$BG_COLOR" "$FG_COLOR" "$PRIMARY_COLOR" "$APP_NAME"

# Clean up generator script
rm -f "$GENERATOR_SCRIPT"

# Generate in-app icon components
log_info "Generating in-app icon components..."

ICONS_INDEX="$ICONS_DIR/index.ts"
mkdir -p "$ICONS_DIR"

# Create base icon components
cat > "$ICONS_DIR/Icon.tsx" << 'ICON_EOF'
import React from 'react';
import Svg, { Path, Circle, Rect, G, SvgProps } from 'react-native-svg';

export interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

const defaultSize = 24;
const defaultColor = '#000000';

// Home icon
export const HomeIcon: React.FC<IconProps> = ({ size = defaultSize, color = defaultColor, ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9 22V12h6v10" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// Settings icon
export const SettingsIcon: React.FC<IconProps> = ({ size = defaultSize, color = defaultColor, ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={2}/>
    <Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// Back/Arrow Left icon
export const BackIcon: React.FC<IconProps> = ({ size = defaultSize, color = defaultColor, ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// Close/X icon
export const CloseIcon: React.FC<IconProps> = ({ size = defaultSize, color = defaultColor, ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// Menu/Hamburger icon
export const MenuIcon: React.FC<IconProps> = ({ size = defaultSize, color = defaultColor, ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M3 12h18M3 6h18M3 18h18" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// Search icon
export const SearchIcon: React.FC<IconProps> = ({ size = defaultSize, color = defaultColor, ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx={11} cy={11} r={8} stroke={color} strokeWidth={2}/>
    <Path d="M21 21l-4.35-4.35" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// Add/Plus icon
export const AddIcon: React.FC<IconProps> = ({ size = defaultSize, color = defaultColor, ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// Edit/Pencil icon
export const EditIcon: React.FC<IconProps> = ({ size = defaultSize, color = defaultColor, ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// Delete/Trash icon
export const DeleteIcon: React.FC<IconProps> = ({ size = defaultSize, color = defaultColor, ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// Save/Check icon
export const SaveIcon: React.FC<IconProps> = ({ size = defaultSize, color = defaultColor, ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M17 21v-8H7v8M7 3v5h8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// Share icon
export const ShareIcon: React.FC<IconProps> = ({ size = defaultSize, color = defaultColor, ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx={18} cy={5} r={3} stroke={color} strokeWidth={2}/>
    <Circle cx={6} cy={12} r={3} stroke={color} strokeWidth={2}/>
    <Circle cx={18} cy={19} r={3} stroke={color} strokeWidth={2}/>
    <Path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke={color} strokeWidth={2}/>
  </Svg>
);

// Check/Success icon
export const CheckIcon: React.FC<IconProps> = ({ size = defaultSize, color = defaultColor, ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// Error/Alert Circle icon
export const ErrorIcon: React.FC<IconProps> = ({ size = defaultSize, color = defaultColor, ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={2}/>
    <Path d="M12 8v4M12 16h.01" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// Warning/Alert Triangle icon
export const WarningIcon: React.FC<IconProps> = ({ size = defaultSize, color = defaultColor, ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// Info icon
export const InfoIcon: React.FC<IconProps> = ({ size = defaultSize, color = defaultColor, ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={2}/>
    <Path d="M12 16v-4M12 8h.01" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// Star icon
export const StarIcon: React.FC<IconProps> = ({ size = defaultSize, color = defaultColor, ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// Heart icon
export const HeartIcon: React.FC<IconProps> = ({ size = defaultSize, color = defaultColor, ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// User icon
export const UserIcon: React.FC<IconProps> = ({ size = defaultSize, color = defaultColor, ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Circle cx={12} cy={7} r={4} stroke={color} strokeWidth={2}/>
  </Svg>
);
ICON_EOF

# Create index file
cat > "$ICONS_INDEX" << 'INDEX_EOF'
export {
  IconProps,
  HomeIcon,
  SettingsIcon,
  BackIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
  AddIcon,
  EditIcon,
  DeleteIcon,
  SaveIcon,
  ShareIcon,
  CheckIcon,
  ErrorIcon,
  WarningIcon,
  InfoIcon,
  StarIcon,
  HeartIcon,
  UserIcon,
} from './Icon';
INDEX_EOF

log_info "Generated 18 icon components in $ICONS_DIR"

# Post-generation PNG validation (MANDATORY)
log_info "Validating generated PNG assets..."

# Define required assets with minimum sizes
declare -A REQUIRED_PNG_ASSETS=(
    ["icon.png"]="5000"           # 5KB minimum
    ["adaptive-icon-foreground.png"]="5000"  # 5KB minimum
    ["splash.png"]="10000"        # 10KB minimum
    ["favicon.png"]="500"         # 500B minimum
)

GENERATION_FAILED=false

for asset in "${!REQUIRED_PNG_ASSETS[@]}"; do
    ASSET_PATH="$ASSETS_DIR/$asset"
    MIN_SIZE="${REQUIRED_PNG_ASSETS[$asset]}"

    if [[ ! -f "$ASSET_PATH" ]]; then
        log_error "$asset was not generated"
        GENERATION_FAILED=true
        continue
    fi

    # Check file size
    FILE_SIZE=$(stat -f%z "$ASSET_PATH" 2>/dev/null || stat -c%s "$ASSET_PATH" 2>/dev/null || echo "0")
    if [[ $FILE_SIZE -lt $MIN_SIZE ]]; then
        log_error "$asset is too small (${FILE_SIZE} bytes, minimum ${MIN_SIZE}) - rasterization may have failed"
        GENERATION_FAILED=true
        continue
    fi

    # Check PNG magic bytes
    MAGIC=$(xxd -l 8 -p "$ASSET_PATH" 2>/dev/null)
    if [[ "$MAGIC" != "89504e470d0a1a0a" ]]; then
        log_error "$asset is not a valid PNG (invalid magic bytes)"
        GENERATION_FAILED=true
        continue
    fi

    # Check MIME type
    MIME=$(file --mime-type -b "$ASSET_PATH" 2>/dev/null)
    if [[ "$MIME" != "image/png" ]]; then
        log_error "$asset has wrong MIME type: $MIME (expected image/png)"
        GENERATION_FAILED=true
        continue
    fi

    # Check for IDAT chunk (actual pixel data)
    if ! xxd "$ASSET_PATH" 2>/dev/null | grep -q "IDAT"; then
        log_error "$asset has no IDAT chunk (no pixel data)"
        GENERATION_FAILED=true
        continue
    fi

    log_info "✓ $asset validated (${FILE_SIZE} bytes, PNG, has pixel data)"
done

if [[ "$GENERATION_FAILED" == "true" ]]; then
    log_error "Asset generation/validation failed. Build cannot proceed."
    exit 3
fi

# Summary
echo ""
log_info "=== Asset Generation Complete ==="
echo ""
echo "Generated and validated assets:"
echo "  - $ASSETS_DIR/icon.png (1024x1024) ✓"
echo "  - $ASSETS_DIR/adaptive-icon-foreground.png (1024x1024) ✓"
echo "  - $ASSETS_DIR/splash.png (1284x2778) ✓"
echo "  - $ASSETS_DIR/favicon.png (48x48) ✓"
echo "  - $ICONS_DIR/Icon.tsx (18 icon components)"
echo "  - $ICONS_DIR/index.ts (exports)"
echo ""
echo "All PNG assets passed validation (PNG magic, IDAT chunk, size threshold)"
echo ""

exit 0
