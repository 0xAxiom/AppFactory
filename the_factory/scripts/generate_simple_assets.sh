#!/bin/bash
#
# Generate Simple Assets
# 
# A reliable fallback asset generator using macOS sips
# Creates deterministic placeholder assets when Node.js/Sharp is unavailable
#
# Usage: generate_simple_assets.sh <output_dir> [app_name]
#

set -euo pipefail

OUTPUT_DIR="${1:-./assets}"
APP_NAME="${2:-App Factory App}"

# Color configuration
BLUE_COLOR="#2563EB"
WHITE_COLOR="#FFFFFF"

echo "🎨 Simple Asset Generator (sips fallback)"
echo "=========================================="
echo "App Name: $APP_NAME"
echo "Output Dir: $OUTPUT_DIR"
echo ""

# Ensure output directory exists
mkdir -p "$OUTPUT_DIR"

# Asset configurations (filename:dimensions)
ASSETS=(
  "icon.png:1024x1024"
  "splash.png:1284x2778"
  "adaptive-icon.png:1024x1024"
  "favicon.png:32x32"
)

# Function to create a colored image using sips
create_asset() {
  local filename="$1"
  local dimensions="$2"
  local output_path="$OUTPUT_DIR/$filename"
  
  echo "🖼️  Generating $filename ($dimensions)..."
  
  # Use a system icon as base
  local base_icon="/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericApplicationIcon.icns"
  local temp_png="$output_path.temp.png"
  
  if [[ ! -f "$base_icon" ]]; then
    base_icon="/System/Library/CoreServices/Finder.app/Contents/Resources/Finder.icns"
  fi
  
  # Convert to PNG and resize
  if sips -s format png "$base_icon" -o "$temp_png" >/dev/null 2>&1; then
    # Parse dimensions
    IFS='x' read -r width height <<< "$dimensions"
    
    # Resize to target dimensions
    sips -Z "$width" "$temp_png" >/dev/null 2>&1
    sips -p "$height" "$width" "$temp_png" >/dev/null 2>&1
    
    # Move to final location
    mv "$temp_png" "$output_path"
    
    # Calculate size and hash
    local size=$(wc -c < "$output_path" | tr -d ' ')
    local hash=$(shasum -a 256 "$output_path" | cut -d' ' -f1)
    
    echo "   ✅ $filename ($size bytes, ${width}x${height}) - SHA256: ${hash:0:16}..."
    
    return 0
  else
    echo "   ❌ Failed to generate $filename"
    return 1
  fi
}

# Generate all assets
echo "🚀 Generating placeholder assets..."
echo ""

GENERATED_COUNT=0
FAILED_COUNT=0

for asset_spec in "${ASSETS[@]}"; do
  IFS=':' read -r filename dimensions <<< "$asset_spec"
  if create_asset "$filename" "$dimensions"; then
    ((GENERATED_COUNT++))
  else
    ((FAILED_COUNT++))
  fi
done

# Create generation log
LOG_FILE="$OUTPUT_DIR/generation_log.json"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

cat > "$LOG_FILE" << EOF
{
  "generation_session": {
    "timestamp": "$TIMESTAMP",
    "app_name": "$APP_NAME",
    "output_directory": "$OUTPUT_DIR",
    "method": "sips_fallback",
    "assets_generated": $GENERATED_COUNT,
    "assets_failed": $FAILED_COUNT
  },
  "generated_assets": [
EOF

FIRST=true
for asset_spec in "${ASSETS[@]}"; do
  IFS=':' read -r filename dimensions <<< "$asset_spec"
  asset_path="$OUTPUT_DIR/$filename"
  if [[ -f "$asset_path" ]]; then
    if [[ "$FIRST" == "true" ]]; then
      FIRST=false
    else
      echo "," >> "$LOG_FILE"
    fi
    
    size=$(wc -c < "$asset_path" | tr -d ' ')
    hash=$(shasum -a 256 "$asset_path" | cut -d' ' -f1)
    IFS='x' read -r width height <<< "$dimensions"
    
    cat >> "$LOG_FILE" << EOF
    {
      "filename": "$filename",
      "dimensions": {"width": $width, "height": $height},
      "file_size": $size,
      "sha256": "$hash"
    }
EOF
  fi
done

cat >> "$LOG_FILE" << EOF

  ],
  "tools_used": {
    "sips_available": true,
    "sharp_available": false,
    "platform": "$(uname -s)"
  }
}
EOF

echo ""
if [[ $GENERATED_COUNT -gt 0 ]]; then
  echo "✅ ASSET GENERATION COMPLETE"
  echo "Generated $GENERATED_COUNT assets in $OUTPUT_DIR"
  if [[ $FAILED_COUNT -gt 0 ]]; then
    echo "⚠️  $FAILED_COUNT assets failed to generate"
  fi
else
  echo "❌ ASSET GENERATION FAILED"
  echo "No assets were generated successfully"
  exit 1
fi

echo ""
echo "📋 Generation log: $LOG_FILE"
echo ""
echo "Assets are deterministic placeholders suitable for development."
echo "Replace with branded assets before production release."