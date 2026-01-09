#!/bin/bash
#
# React Native Upstream Reference Cache
# 
# This script implements REAL upstream reference caching by pulling authoritative
# files from facebook/react-native and facebook/react-native-website repositories
# and caching them locally for deterministic build decisions.
#
# Exit codes:
#   0 = Cache operations successful
#   1 = Cache operations failed
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
CACHE_DIR="$REPO_ROOT/app/_upstream/react-native"
MANIFEST_FILE="$CACHE_DIR/manifest.json"
INDEX_FILE="$CACHE_DIR/INDEX.md"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Mode: initialize, proactive, or on-demand
MODE="${1:-initialize}"

echo "🔄 React Native Upstream Cache ($MODE mode)"
echo "============================================"
echo ""

# Authorized upstream repositories
REACT_NATIVE_REPO="https://github.com/facebook/react-native"
REACT_NATIVE_WEBSITE_REPO="https://github.com/facebook/react-native-website"

# Current known good commit SHAs (update periodically)
REACT_NATIVE_REF="main"  # Use latest main for current references
WEBSITE_REF="main"       # Use latest main for docs

# Function to initialize cache structure
initialize_cache() {
    echo "📁 Initializing upstream cache structure..."
    
    mkdir -p "$CACHE_DIR"
    
    # Initialize manifest if it doesn't exist
    if [[ ! -f "$MANIFEST_FILE" ]]; then
        local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
        cat > "$MANIFEST_FILE" << EOF
{
  "upstream_cache": {
    "cache_created": "$timestamp",
    "authorized_sources": [
      "$REACT_NATIVE_REPO",
      "$REACT_NATIVE_WEBSITE_REPO"
    ],
    "cached_files": [],
    "last_updated": "$timestamp"
  },
  "cache_policy": "pull_on_demand_and_proactive_stage10",
  "current_refs": {
    "react_native": "unknown",
    "website": "unknown"
  }
}
EOF
        echo -e "   ${GREEN}✅ Created manifest.json${NC}"
    else
        echo -e "   ${GREEN}✅ Manifest.json exists${NC}"
    fi
    
    # Initialize INDEX.md
    if [[ ! -f "$INDEX_FILE" ]]; then
        cat > "$INDEX_FILE" << EOF
# React Native Upstream Reference Cache

**Purpose**: Local cache for authoritative React Native upstream references

## Authorized Sources

- **facebook/react-native**: $REACT_NATIVE_REPO
- **facebook/react-native-website**: $REACT_NATIVE_WEBSITE_REPO

## Cache Policy

This cache pulls authoritative files from upstream repositories to ground
technical decisions in source code rather than model memory or inference.

### When Files Are Pulled
- **Stage 02**: Cache initialization (empty manifest)
- **Stage 10**: Proactive pull of common build/native integration files
- **On-demand**: When specific clarification needed during pipeline execution

## Cached Files

EOF
        echo -e "   ${GREEN}✅ Created INDEX.md${NC}"
    else
        echo -e "   ${GREEN}✅ INDEX.md exists${NC}"
    fi
    
    echo ""
}

# Function to get current commit SHA from upstream repo
get_current_ref() {
    local repo_url="$1"
    local ref_name="$2"
    
    # Use git ls-remote to get current SHA without cloning
    local sha=$(git ls-remote "$repo_url" "$ref_name" 2>/dev/null | cut -f1 || echo "unknown")
    echo "$sha"
}

# Function to pull a specific file from upstream
pull_upstream_file() {
    local repo_url="$1"
    local ref_sha="$2"
    local source_path="$3"
    local local_filename="$4"
    local reason="$5"
    
    local local_path="$CACHE_DIR/$local_filename"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    echo "📥 Pulling: $source_path"
    echo "   From: $repo_url"
    echo "   Ref: ${ref_sha:0:8}..."
    echo "   To: $local_filename"
    echo "   Reason: $reason"
    
    # Create directory if needed
    mkdir -p "$(dirname "$local_path")"
    
    # Pull file using raw GitHub URL
    local raw_url
    if [[ "$repo_url" == *"react-native-website"* ]]; then
        raw_url="https://raw.githubusercontent.com/facebook/react-native-website/$ref_sha/$source_path"
    else
        raw_url="https://raw.githubusercontent.com/facebook/react-native/$ref_sha/$source_path"
    fi
    
    echo "   Full URL: $raw_url"
    
    if curl -s -f "$raw_url" -o "$local_path"; then
        # Calculate SHA256
        local file_sha256=$(shasum -a 256 "$local_path" | cut -d' ' -f1)
        
        echo -e "   ${GREEN}✅ Downloaded ($file_sha256)${NC}"
        
        # Update manifest
        update_manifest_with_file "$repo_url" "$ref_sha" "$source_path" "$local_filename" "$timestamp" "$file_sha256" "$reason"
        
        # Update INDEX.md
        update_index_with_file "$local_filename" "$reason"
        
        return 0
    else
        echo -e "   ${RED}❌ Failed to download from $raw_url${NC}"
        return 1
    fi
}

# Function to update manifest with new file entry
update_manifest_with_file() {
    local source_repo="$1"
    local source_ref="$2"
    local source_path="$3"
    local local_path="$4"
    local timestamp="$5"
    local sha256="$6"
    local reason="$7"
    
    # Create new entry
    local new_entry=$(cat << EOF
    {
      "source_repo": "$source_repo",
      "source_ref": "$source_ref",
      "source_path": "$source_path",
      "local_path": "$local_path",
      "downloaded_at_iso": "$timestamp",
      "sha256": "$sha256",
      "reason": "$reason"
    }
EOF
    )
    
    # Update manifest (simplified approach - in production would use proper JSON manipulation)
    # For now, append to cached_files array manually
    local temp_manifest="$MANIFEST_FILE.tmp"
    
    # Read existing manifest and add new entry
    if python3 -c "
import json, sys

try:
    with open('$MANIFEST_FILE', 'r') as f:
        data = json.load(f)
    
    new_entry = {
        'source_repo': '$source_repo',
        'source_ref': '$source_ref', 
        'source_path': '$source_path',
        'local_path': '$local_path',
        'downloaded_at_iso': '$timestamp',
        'sha256': '$sha256',
        'reason': '$reason'
    }
    
    data['upstream_cache']['cached_files'].append(new_entry)
    data['upstream_cache']['last_updated'] = '$timestamp'
    
    with open('$MANIFEST_FILE', 'w') as f:
        json.dump(data, f, indent=2)
        
    print('Manifest updated')
except Exception as e:
    print(f'Error: {e}')
    sys.exit(1)
" 2>/dev/null; then
        echo -e "   ${GREEN}✅ Manifest updated${NC}"
    else
        echo -e "   ${YELLOW}⚠️ Manifest update failed, continuing...${NC}"
    fi
}

# Function to update INDEX.md with new file entry
update_index_with_file() {
    local local_path="$1"
    local reason="$2"
    
    # Append to INDEX.md
    echo "- **$local_path**: $reason" >> "$INDEX_FILE"
}

# Function to perform proactive pull during Stage 10
proactive_pull() {
    echo "🚀 Performing proactive pull of common build references..."
    echo ""
    
    # Get current commit SHAs
    local rn_ref=$(get_current_ref "$REACT_NATIVE_REPO" "$REACT_NATIVE_REF")
    local website_ref=$(get_current_ref "$REACT_NATIVE_WEBSITE_REPO" "$WEBSITE_REF")
    
    echo "Current upstream refs:"
    echo "  react-native: ${rn_ref:0:8}..."
    echo "  website: ${website_ref:0:8}..."
    echo ""
    
    # Define proactive pull set - files commonly needed for iOS/build/native issues
    local -a proactive_files=(
        # Package.json for dependencies
        "$REACT_NATIVE_REPO|$rn_ref|packages/react-native/package.json|react-native/package.json|React Native core dependencies"
        
        # Build validation script  
        "$REACT_NATIVE_REPO|$rn_ref|scripts/validate-ios-test-env.sh|scripts/validate-ios-test-env.sh|iOS build environment validation"
        
        # Podspec processing
        "$REACT_NATIVE_REPO|$rn_ref|scripts/process-podspecs.sh|scripts/process-podspecs.sh|CocoaPods specification processing"
    )
    
    local success_count=0
    local total_count=${#proactive_files[@]}
    
    for file_spec in "${proactive_files[@]}"; do
        IFS='|' read -r repo_url ref_sha source_path local_path reason <<< "$file_spec"
        
        if pull_upstream_file "$repo_url" "$ref_sha" "$source_path" "$local_path" "$reason"; then
            ((success_count++))
        fi
        echo ""
    done
    
    echo -e "${GREEN}✅ Proactive pull complete: $success_count/$total_count files cached${NC}"
    echo ""
}

# Function to pull a specific file on-demand
on_demand_pull() {
    local source_path="$1"
    local reason="$2"
    local repo_type="${3:-react-native}"  # react-native or website
    
    echo "📥 On-demand pull requested..."
    echo "   Source: $source_path"
    echo "   Reason: $reason"
    echo "   Repo: $repo_type"
    echo ""
    
    local repo_url
    local ref_sha
    case "$repo_type" in
        "react-native")
            repo_url="$REACT_NATIVE_REPO"
            ref_sha=$(get_current_ref "$REACT_NATIVE_REPO" "$REACT_NATIVE_REF")
            ;;
        "website")
            repo_url="$REACT_NATIVE_WEBSITE_REPO"
            ref_sha=$(get_current_ref "$REACT_NATIVE_WEBSITE_REPO" "$WEBSITE_REF")
            ;;
        *)
            echo -e "${RED}❌ Unknown repo type: $repo_type${NC}"
            return 1
            ;;
    esac
    
    local local_filename=$(basename "$source_path")
    
    if pull_upstream_file "$repo_url" "$ref_sha" "$source_path" "$local_filename" "$reason"; then
        echo -e "${GREEN}✅ On-demand pull successful${NC}"
        return 0
    else
        echo -e "${RED}❌ On-demand pull failed${NC}"
        return 1
    fi
}

# Function to validate cache integrity
validate_cache() {
    echo "🔍 Validating cache integrity..."
    
    local issues=0
    
    # Check required files exist
    if [[ ! -f "$MANIFEST_FILE" ]]; then
        echo -e "   ${RED}❌ manifest.json missing${NC}"
        ((issues++))
    fi
    
    if [[ ! -f "$INDEX_FILE" ]]; then
        echo -e "   ${RED}❌ INDEX.md missing${NC}"
        ((issues++))
    fi
    
    # Validate manifest JSON format
    if [[ -f "$MANIFEST_FILE" ]]; then
        if python3 -c "import json; json.load(open('$MANIFEST_FILE'))" 2>/dev/null; then
            echo -e "   ${GREEN}✅ manifest.json valid JSON${NC}"
        else
            echo -e "   ${RED}❌ manifest.json invalid JSON${NC}"
            ((issues++))
        fi
    fi
    
    # Check that cached files actually exist
    if [[ -f "$MANIFEST_FILE" ]]; then
        local cached_files=$(python3 -c "
import json
try:
    with open('$MANIFEST_FILE', 'r') as f:
        data = json.load(f)
    for entry in data['upstream_cache']['cached_files']:
        print(entry['local_path'])
except:
    pass
" 2>/dev/null || true)
        
        if [[ -n "$cached_files" ]]; then
            while IFS= read -r file_path; do
                local full_path="$CACHE_DIR/$file_path"
                if [[ -f "$full_path" ]]; then
                    echo -e "   ${GREEN}✅ $file_path (exists)${NC}"
                else
                    echo -e "   ${RED}❌ $file_path (missing)${NC}"
                    ((issues++))
                fi
            done <<< "$cached_files"
        else
            echo -e "   ${YELLOW}⚠️ No cached files found (empty cache)${NC}"
        fi
    fi
    
    if [[ $issues -eq 0 ]]; then
        echo -e "   ${GREEN}✅ Cache integrity verified${NC}"
        return 0
    else
        echo -e "   ${RED}❌ Found $issues integrity issues${NC}"
        return 1
    fi
    
    echo ""
}

# Main execution based on mode
main() {
    case "$MODE" in
        "initialize")
            echo "Initializing React Native upstream cache..."
            echo ""
            initialize_cache
            validate_cache
            ;;
            
        "proactive")
            echo "Running proactive upstream file caching..."
            echo ""
            initialize_cache
            proactive_pull
            validate_cache
            ;;
            
        "on-demand")
            if [[ $# -lt 3 ]]; then
                echo "Usage: $0 on-demand <source_path> <reason> [repo_type]"
                echo "Example: $0 on-demand 'scripts/react_native_pods.rb' 'CocoaPods integration issue' react-native"
                exit 1
            fi
            
            local source_path="$2"
            local reason="$3"
            local repo_type="${4:-react-native}"
            
            initialize_cache
            on_demand_pull "$source_path" "$reason" "$repo_type"
            validate_cache
            ;;
            
        "validate")
            validate_cache
            ;;
            
        *)
            echo "Usage: $0 {initialize|proactive|on-demand|validate}"
            echo ""
            echo "Modes:"
            echo "  initialize - Set up cache structure and manifest"
            echo "  proactive  - Pull common build/native reference files"  
            echo "  on-demand  - Pull specific file on demand"
            echo "  validate   - Check cache integrity"
            exit 1
            ;;
    esac
    
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}✅ UPSTREAM CACHE OPERATION COMPLETE${NC}"
        echo ""
        echo -e "${BLUE}Cache ready for pipeline usage with authoritative upstream references.${NC}"
    else
        echo -e "${RED}❌ UPSTREAM CACHE OPERATION FAILED${NC}"
        echo ""
        echo -e "${YELLOW}Cache issues must be resolved before pipeline execution.${NC}"
        exit 1
    fi
}

# Execute main function
main "$@"