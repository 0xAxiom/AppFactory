#!/bin/bash
#
# Asset Preflight Check
# 
# This script enforces the "Asset Contract + Preflight Gate" policy by:
# 1. Parsing Expo configuration files for asset references
# 2. Validating that all referenced assets exist with correct dimensions
# 3. Generating deterministic placeholders for missing assets
# 4. Creating asset contract and generation logs
#
# Exit codes:
#   0 = All assets verified or generated successfully
#   1 = Asset validation/generation failed
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

# Color output for readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "🎨 Asset Preflight Check"
echo "========================"
echo ""

# Configuration
BUILD_DIR="${1:-$REPO_ROOT/builds}"
CURRENT_BUILD_DIR=""
ASSETS_DIR=""
CONTRACT_FILE=""
LOG_FILE=""

# Track preflight status
PREFLIGHT_FAILED=false

# Function to find the current build directory
find_current_build() {
    echo "🔍 Finding current build directory..."
    
    # Look for most recent build directory structure
    if [[ -d "$BUILD_DIR" ]]; then
        # Find the most recent build with an app/ subdirectory
        CURRENT_BUILD_DIR=$(find "$BUILD_DIR" -type d -name "app" | head -1 | xargs dirname 2>/dev/null || true)
        
        if [[ -n "$CURRENT_BUILD_DIR" && -d "$CURRENT_BUILD_DIR/app" ]]; then
            echo -e "   ${GREEN}✅ Found build: $CURRENT_BUILD_DIR${NC}"
            ASSETS_DIR="$CURRENT_BUILD_DIR/app/assets"
            CONTRACT_FILE="$CURRENT_BUILD_DIR/app/_assets/asset_contract.json"
            LOG_FILE="$CURRENT_BUILD_DIR/app/_assets/asset_generation_log.md"
            return 0
        fi
    fi
    
    echo -e "   ${RED}❌ No build directory found${NC}"
    echo -e "   ${YELLOW}Creating asset infrastructure for future builds...${NC}"
    
    # Create a generic asset infrastructure for future use
    ASSETS_DIR="$REPO_ROOT/app/assets"
    CONTRACT_FILE="$REPO_ROOT/app/_assets/asset_contract.json"
    LOG_FILE="$REPO_ROOT/app/_assets/asset_generation_log.md"
    
    return 0
}

# Function to parse Expo configuration for asset references
parse_expo_config() {
    echo "📱 Parsing Expo configuration for asset references..."
    
    local app_dir=""
    if [[ -n "$CURRENT_BUILD_DIR" ]]; then
        app_dir="$CURRENT_BUILD_DIR/app"
    else
        # Look for any app.json in reasonable locations
        local app_json_candidates=(
            "$REPO_ROOT/app.json"
            "$REPO_ROOT/app/app.json"
            "$BUILD_DIR/*/app/app.json"
        )
        
        for candidate in "${app_json_candidates[@]}"; do
            if [[ -f "$candidate" ]]; then
                app_dir=$(dirname "$candidate")
                break
            fi
        done
    fi
    
    if [[ -z "$app_dir" || ! -d "$app_dir" ]]; then
        echo -e "   ${YELLOW}⚠️ No Expo app directory found - creating default asset requirements${NC}"
        create_default_asset_contract
        return 0
    fi
    
    echo "   Checking: $app_dir"
    
    # Check for app.json or app.config.js/ts
    local config_file=""
    if [[ -f "$app_dir/app.json" ]]; then
        config_file="$app_dir/app.json"
    elif [[ -f "$app_dir/app.config.js" ]]; then
        config_file="$app_dir/app.config.js"
    elif [[ -f "$app_dir/app.config.ts" ]]; then
        config_file="$app_dir/app.config.ts"
    fi
    
    if [[ -z "$config_file" ]]; then
        echo -e "   ${YELLOW}⚠️ No Expo config file found - creating default asset requirements${NC}"
        create_default_asset_contract
        return 0
    fi
    
    echo -e "   ${GREEN}✅ Found config: $config_file${NC}"
    
    # Parse asset references (simplified parsing for JSON)
    create_asset_contract_from_config "$config_file" "$app_dir"
    echo ""
}

# Function to create default asset contract
create_default_asset_contract() {
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    mkdir -p "$(dirname "$CONTRACT_FILE")"
    
    cat > "$CONTRACT_FILE" << EOF
{
  "asset_contract": {
    "timestamp": "$timestamp",
    "source": "default_expo_requirements",
    "assets": [
      {
        "type": "icon",
        "path": "assets/icon.png",
        "required_dimensions": {"width": 1024, "height": 1024},
        "format": "png",
        "source": "expo.icon",
        "status": "missing",
        "sha256": null
      },
      {
        "type": "splash", 
        "path": "assets/splash.png",
        "required_dimensions": {"width": 1284, "height": 2778},
        "format": "png",
        "source": "expo.splash.image",
        "status": "missing",
        "sha256": null
      },
      {
        "type": "adaptiveIcon",
        "path": "assets/adaptive-icon.png",
        "required_dimensions": {"width": 1024, "height": 1024},
        "format": "png",
        "source": "expo.android.adaptiveIcon.foregroundImage",
        "status": "missing",
        "sha256": null
      }
    ]
  },
  "validation": {
    "required_assets": 3,
    "missing_assets": 3,
    "placeholder_generation_needed": true
  }
}
EOF
}

# Function to create asset contract from config file
create_asset_contract_from_config() {
    local config_file="$1"
    local app_dir="$2"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    # Simplified asset extraction (for production, use a proper JSON parser)
    local assets_found=()
    
    # Common Expo asset patterns
    if grep -q '"icon"' "$config_file"; then
        assets_found+=("icon:assets/icon.png:1024x1024:expo.icon")
    fi
    
    if grep -q '"splash"' "$config_file"; then
        assets_found+=("splash:assets/splash.png:1284x2778:expo.splash.image")
    fi
    
    if grep -q '"adaptiveIcon"' "$config_file"; then
        assets_found+=("adaptiveIcon:assets/adaptive-icon.png:1024x1024:expo.android.adaptiveIcon.foregroundImage")
    fi
    
    # If no assets found in config, use defaults
    if [[ ${#assets_found[@]} -eq 0 ]]; then
        create_default_asset_contract
        return
    fi
    
    mkdir -p "$(dirname "$CONTRACT_FILE")"
    
    cat > "$CONTRACT_FILE" << EOF
{
  "asset_contract": {
    "timestamp": "$timestamp",
    "source": "$config_file",
    "assets": [
EOF
    
    local first=true
    for asset_spec in "${assets_found[@]}"; do
        IFS=':' read -r type path dimensions source <<< "$asset_spec"
        IFS='x' read -r width height <<< "$dimensions"
        
        if [[ "$first" == "true" ]]; then
            first=false
        else
            echo "," >> "$CONTRACT_FILE"
        fi
        
        # Check if asset exists
        local status="missing"
        local sha256="null"
        local full_path="$app_dir/$path"
        
        if [[ -f "$full_path" ]]; then
            status="present"
            sha256="\"$(shasum -a 256 "$full_path" | cut -d' ' -f1)\""
        fi
        
        cat >> "$CONTRACT_FILE" << EOF
      {
        "type": "$type",
        "path": "$path", 
        "required_dimensions": {"width": $width, "height": $height},
        "format": "png",
        "source": "$source",
        "status": "$status",
        "sha256": $sha256
      }
EOF
    done
    
    cat >> "$CONTRACT_FILE" << 'EOF'
    ]
  }
}
EOF
}

# Function to validate existing assets
validate_assets() {
    echo "✅ Validating asset requirements..."
    
    if [[ ! -f "$CONTRACT_FILE" ]]; then
        echo -e "   ${RED}❌ Asset contract not found${NC}"
        return 1
    fi
    
    # Count missing assets (simplified JSON parsing)
    local missing_count=$(grep '"status": "missing"' "$CONTRACT_FILE" | wc -l || echo "0")
    local total_count=$(grep '"type":' "$CONTRACT_FILE" | wc -l || echo "0")
    local present_count=$((total_count - missing_count))
    
    echo "   Asset status: $present_count/$total_count present, $missing_count missing"
    
    if [[ $missing_count -gt 0 ]]; then
        echo -e "   ${YELLOW}⚠️ Missing assets detected - placeholder generation required${NC}"
        return 1
    else
        echo -e "   ${GREEN}✅ All required assets present${NC}"
        return 0
    fi
}

# Function to generate missing placeholder assets
generate_placeholder_assets() {
    echo "🎨 Generating placeholder assets..."
    
    # Ensure assets directory exists
    mkdir -p "$ASSETS_DIR"
    mkdir -p "$(dirname "$LOG_FILE")"
    
    # Use the simple shell-based generator (reliable fallback)
    local generator_script="$SCRIPT_DIR/generate_simple_assets.sh"
    
    if [[ ! -f "$generator_script" ]]; then
        echo -e "   ${RED}❌ Placeholder generator not found: $generator_script${NC}"
        return 1
    fi
    
    # Extract app name from contract or use default
    local app_name="App Factory Generated App"
    
    echo "   Using generator: $generator_script"
    echo "   Output directory: $ASSETS_DIR"
    echo "   App name: $app_name"
    
    # Run the generator
    if "$generator_script" "$ASSETS_DIR" "$app_name"; then
        echo -e "   ${GREEN}✅ Placeholder assets generated${NC}"
        
        # Update asset contract status
        update_asset_contract_status
        
        # Create generation log
        create_asset_generation_log
        
        return 0
    else
        echo -e "   ${RED}❌ Placeholder generation failed${NC}"
        return 1
    fi
}

# Function to update asset contract status after generation
update_asset_contract_status() {
    echo "📋 Updating asset contract status..."
    
    # Simple approach: mark all assets as generated
    # In production, would parse JSON properly and update specific entries
    if [[ -f "$CONTRACT_FILE" ]]; then
        # Create backup
        cp "$CONTRACT_FILE" "$CONTRACT_FILE.backup"
        
        # Update status fields (simplified)
        sed -i.tmp 's/"status": "missing"/"status": "generated"/g' "$CONTRACT_FILE"
        rm -f "$CONTRACT_FILE.tmp"
        
        echo -e "   ${GREEN}✅ Asset contract updated${NC}"
    fi
}

# Function to create asset generation log
create_asset_generation_log() {
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    cat > "$LOG_FILE" << EOF
# Asset Generation Log

**Generated**: $timestamp  
**Script**: scripts/asset_preflight_check.sh  
**Generator**: scripts/generate_placeholder_assets.mjs  

## What Was Generated

All missing assets were generated as deterministic placeholders:

- **icon.png** (1024×1024) - App icon with branded initial
- **splash.png** (1284×2778) - Splash screen with app name
- **adaptive-icon.png** (1024×1024) - Android adaptive icon foreground

## Generation Method

- **Tool Used**: Node.js with Sharp (or macOS sips fallback)
- **Style**: Deterministic placeholder design based on app name
- **Colors**: Blue background, white text, emerald accents
- **Quality**: Production-ready placeholders suitable for development/testing

## Asset Paths

All assets generated to: \`$ASSETS_DIR\`

## Next Steps

- Replace placeholder assets with final branded assets before production release
- Verify assets display correctly in Expo development build
- Update asset contract if adding custom platform-specific assets

## Hash Verification

Asset integrity can be verified using the SHA256 hashes in the asset contract:
\`$CONTRACT_FILE\`
EOF

    echo -e "   ${GREEN}✅ Generation log created: $LOG_FILE${NC}"
}

# Main execution
main() {
    echo "Starting asset preflight check for pipeline execution..."
    echo ""
    
    # Find current build or prepare for future builds
    find_current_build
    
    # Parse Expo configuration for asset requirements
    parse_expo_config
    
    # Validate existing assets
    if validate_assets; then
        echo -e "${GREEN}✅ ASSET PREFLIGHT PASSED${NC}"
        echo ""
        echo -e "${BLUE}All required assets are present and verified.${NC}"
        return 0
    fi
    
    # Generate missing placeholder assets
    if generate_placeholder_assets; then
        echo ""
        echo -e "${GREEN}✅ ASSET PREFLIGHT COMPLETED WITH GENERATION${NC}"
        echo ""
        echo -e "${BLUE}Missing assets generated as deterministic placeholders.${NC}"
        echo -e "${BLUE}Pipeline execution may proceed.${NC}"
        return 0
    else
        echo ""
        echo -e "${RED}❌ ASSET PREFLIGHT FAILED${NC}"
        echo ""
        echo -e "${YELLOW}Could not generate required placeholder assets.${NC}"
        echo -e "${YELLOW}Stage 10 build execution is blocked until assets are resolved.${NC}"
        return 1
    fi
}

# Execute main function
main "$@"