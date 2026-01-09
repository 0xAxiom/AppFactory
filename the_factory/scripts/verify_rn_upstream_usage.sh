#!/bin/bash
#
# Verify React Native Upstream Usage
# 
# This script enforces that the React Native upstream cache is properly
# initialized, populated, and actually USED during pipeline execution.
# It performs build-blocking verification that upstream references are
# cached locally rather than relying on external URLs or assumptions.
#
# Exit codes:
#   0 = Upstream usage verified
#   1 = Upstream usage violations found
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

echo "🔍 React Native Upstream Usage Verification"
echo "==========================================="
echo ""

USAGE_VIOLATIONS=0

# Function to check cache infrastructure exists
verify_cache_infrastructure() {
    echo "📁 Verifying upstream cache infrastructure..."
    
    if [[ ! -d "$CACHE_DIR" ]]; then
        echo -e "   ${RED}❌ FATAL: app/_upstream/react-native/ directory missing${NC}"
        echo -e "      Run: scripts/rn_upstream_cache.sh initialize${NC}"
        ((USAGE_VIOLATIONS++))
        return 1
    fi
    
    if [[ ! -f "$MANIFEST_FILE" ]]; then
        echo -e "   ${RED}❌ FATAL: manifest.json missing${NC}"
        echo -e "      Run: scripts/rn_upstream_cache.sh initialize${NC}"
        ((USAGE_VIOLATIONS++))
        return 1
    fi
    
    if [[ ! -f "$INDEX_FILE" ]]; then
        echo -e "   ${RED}❌ FATAL: INDEX.md missing${NC}"
        echo -e "      Run: scripts/rn_upstream_cache.sh initialize${NC}"
        ((USAGE_VIOLATIONS++))
        return 1
    fi
    
    echo -e "   ${GREEN}✅ Cache infrastructure present${NC}"
    echo ""
    return 0
}

# Function to validate manifest content and structure
verify_manifest_structure() {
    echo "📋 Verifying manifest structure and content..."
    
    # Check JSON validity
    if ! python3 -c "import json; json.load(open('$MANIFEST_FILE'))" 2>/dev/null; then
        echo -e "   ${RED}❌ manifest.json is invalid JSON${NC}"
        ((USAGE_VIOLATIONS++))
        return 1
    fi
    
    # Check required fields
    local required_fields=(
        "upstream_cache"
        "upstream_cache.cached_files"
        "upstream_cache.authorized_sources"
        "upstream_cache.last_updated"
        "cache_policy"
    )
    
    local missing_fields=()
    
    for field in "${required_fields[@]}"; do
        if python3 -c "
import json, sys
try:
    with open('$MANIFEST_FILE', 'r') as f:
        data = json.load(f)
    
    field_parts = '$field'.split('.')
    current = data
    for part in field_parts:
        current = current[part]
    
    print('Field $field exists')
except KeyError:
    sys.exit(1)
except Exception as e:
    sys.exit(1)
" 2>/dev/null; then
            echo -e "   ${GREEN}✅ $field${NC}"
        else
            echo -e "   ${RED}❌ MISSING: $field${NC}"
            missing_fields+=("$field")
        fi
    done
    
    if [[ ${#missing_fields[@]} -gt 0 ]]; then
        echo -e "   ${RED}Missing ${#missing_fields[@]} required manifest fields${NC}"
        ((USAGE_VIOLATIONS++))
    fi
    
    echo ""
}

# Function to verify cached files have required metadata
verify_cached_file_metadata() {
    echo "📄 Verifying cached file metadata completeness..."
    
    local cached_count=$(python3 -c "
import json
try:
    with open('$MANIFEST_FILE', 'r') as f:
        data = json.load(f)
    print(len(data['upstream_cache']['cached_files']))
except:
    print('0')
" 2>/dev/null || echo "0")
    
    if [[ "$cached_count" == "0" ]]; then
        echo -e "   ${YELLOW}⚠️ No cached files found${NC}"
        echo -e "      This may be acceptable for Stage 02, but Stage 10 should populate cache${NC}"
        echo ""
        return 0
    fi
    
    echo "   Found $cached_count cached files, verifying metadata..."
    
    # Required metadata fields for each cached file
    local required_entry_fields=(
        "source_repo"
        "source_ref"
        "source_path" 
        "local_path"
        "downloaded_at_iso"
        "sha256"
        "reason"
    )
    
    local metadata_issues=0
    
    # Verify each cached file entry has required metadata
    for i in $(seq 0 $((cached_count - 1))); do
        for field in "${required_entry_fields[@]}"; do
            if python3 -c "
import json, sys
try:
    with open('$MANIFEST_FILE', 'r') as f:
        data = json.load(f)
    
    entry = data['upstream_cache']['cached_files'][$i]
    value = entry['$field']
    
    if not value or value == '':
        sys.exit(1)
        
    print(f'Entry $i.$field: {value[:50]}...')
except:
    sys.exit(1)
" 2>/dev/null; then
                continue
            else
                echo -e "   ${RED}❌ Entry $i missing or empty field: $field${NC}"
                ((metadata_issues++))
            fi
        done
    done
    
    if [[ $metadata_issues -gt 0 ]]; then
        echo -e "   ${RED}Found $metadata_issues metadata issues in cached file entries${NC}"
        ((USAGE_VIOLATIONS++))
    else
        echo -e "   ${GREEN}✅ All cached files have complete metadata${NC}"
    fi
    
    echo ""
}

# Function to verify cached files actually exist on disk
verify_cached_files_exist() {
    echo "💾 Verifying cached files exist on disk..."
    
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
    
    if [[ -z "$cached_files" ]]; then
        echo -e "   ${YELLOW}⚠️ No cached files to verify${NC}"
        echo ""
        return 0
    fi
    
    local missing_files=()
    
    while IFS= read -r file_path; do
        local full_path="$CACHE_DIR/$file_path"
        if [[ -f "$full_path" ]]; then
            # Verify SHA256 matches manifest
            local actual_sha=$(shasum -a 256 "$full_path" | cut -d' ' -f1)
            local expected_sha=$(python3 -c "
import json
try:
    with open('$MANIFEST_FILE', 'r') as f:
        data = json.load(f)
    for entry in data['upstream_cache']['cached_files']:
        if entry['local_path'] == '$file_path':
            print(entry['sha256'])
            break
except:
    print('unknown')
" 2>/dev/null || echo "unknown")
            
            if [[ "$actual_sha" == "$expected_sha" ]]; then
                echo -e "   ${GREEN}✅ $file_path (SHA256 verified)${NC}"
            else
                echo -e "   ${RED}❌ $file_path (SHA256 mismatch)${NC}"
                echo -e "      Expected: $expected_sha${NC}"
                echo -e "      Actual:   $actual_sha${NC}"
                ((USAGE_VIOLATIONS++))
            fi
        else
            echo -e "   ${RED}❌ $file_path (file missing)${NC}"
            missing_files+=("$file_path")
        fi
    done <<< "$cached_files"
    
    if [[ ${#missing_files[@]} -gt 0 ]]; then
        echo -e "   ${RED}Missing ${#missing_files[@]} cached files from disk${NC}"
        ((USAGE_VIOLATIONS++))
    fi
    
    echo ""
}

# Function to verify Stage 10 build log citations
verify_build_log_citations() {
    echo "🏗️ Verifying Stage 10 build log citations..."
    
    # Find most recent Stage 10 build log
    local build_logs=$(find "$REPO_ROOT" \( -name "stage10_build.log" -o -name "build_log.md" \) \
        -path "*/builds/*" -o -path "*/runs/*" | head -1)
    
    if [[ -z "$build_logs" ]]; then
        echo -e "   ${YELLOW}⚠️ No Stage 10 build logs found${NC}"
        echo -e "      This is acceptable if no builds have been executed yet${NC}"
        echo ""
        return 0
    fi
    
    echo "   Checking: $build_logs"
    
    # Check for citations to upstream cache
    local upstream_citations=$(grep -c "app/_upstream/react-native" "$build_logs" 2>/dev/null || echo "0")
    
    if [[ "$upstream_citations" -gt 0 ]]; then
        echo -e "   ${GREEN}✅ Found $upstream_citations upstream cache citations${NC}"
        
        # Show examples of citations
        echo "   Citation examples:"
        grep "app/_upstream/react-native" "$build_logs" | head -3 | while read -r line; do
            echo -e "      → ${line:0:80}...${NC}"
        done
    else
        echo -e "   ${RED}❌ No upstream cache citations found${NC}"
        echo -e "      Stage 10 must cite upstream cache when making native/build decisions${NC}"
        ((USAGE_VIOLATIONS++))
    fi
    
    # Check for prohibited uncached upstream URLs
    local uncached_urls=(
        "https://github.com/facebook/react-native"
        "https://reactnative.dev"
        "raw.githubusercontent.com/facebook/react-native"
    )
    
    local uncached_violations=()
    
    for url in "${uncached_urls[@]}"; do
        if grep -q "$url" "$build_logs"; then
            echo -e "   ${RED}❌ VIOLATION: Uncached upstream URL found: $url${NC}"
            uncached_violations+=("$url")
        fi
    done
    
    if [[ ${#uncached_violations[@]} -gt 0 ]]; then
        echo -e "   ${RED}Found ${#uncached_violations[@]} uncached upstream URL violations${NC}"
        echo -e "      All upstream references must be cached locally first${NC}"
        ((USAGE_VIOLATIONS++))
    else
        echo -e "   ${GREEN}✅ No uncached upstream URLs found${NC}"
    fi
    
    echo ""
}

# Function to verify proactive pull completeness for Stage 10
verify_stage10_proactive_pull() {
    echo "🚀 Verifying Stage 10 proactive pull completeness..."
    
    # Expected proactive files that should be cached during Stage 10
    local expected_proactive=(
        "react-native/package.json"
        "scripts/validate-ios-test-env.sh"
        "scripts/process-podspecs.sh"
    )
    
    local missing_proactive=()
    
    for expected_file in "${expected_proactive[@]}"; do
        local found=$(python3 -c "
import json
try:
    with open('$MANIFEST_FILE', 'r') as f:
        data = json.load(f)
    
    for entry in data['upstream_cache']['cached_files']:
        if entry['local_path'] == '$expected_file':
            print('found')
            break
    else:
        print('missing')
except:
    print('missing')
" 2>/dev/null || echo "missing")
        
        if [[ "$found" == "found" ]]; then
            echo -e "   ${GREEN}✅ $expected_file${NC}"
        else
            echo -e "   ${YELLOW}⚠️ $expected_file (not cached)${NC}"
            missing_proactive+=("$expected_file")
        fi
    done
    
    if [[ ${#missing_proactive[@]} -gt 0 ]]; then
        echo -e "   ${YELLOW}⚠️ ${#missing_proactive[@]} expected proactive files not cached${NC}"
        echo -e "      Consider running: scripts/rn_upstream_cache.sh proactive${NC}"
    else
        echo -e "   ${GREEN}✅ All expected proactive files cached${NC}"
    fi
    
    echo ""
}

# Function to generate usage verification report
generate_usage_report() {
    echo "📊 Generating upstream usage verification report..."
    
    local report_file="$CACHE_DIR/usage_verification_report.json"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local git_hash=$(cd "$REPO_ROOT" && git rev-parse HEAD 2>/dev/null || echo "unknown")
    
    local cached_count=$(python3 -c "
import json
try:
    with open('$MANIFEST_FILE', 'r') as f:
        data = json.load(f)
    print(len(data['upstream_cache']['cached_files']))
except:
    print('0')
" 2>/dev/null || echo "0")
    
    cat > "$report_file" << EOF
{
  "usage_verification": {
    "timestamp": "$timestamp",
    "script": "scripts/verify_rn_upstream_usage.sh",
    "git_hash": "$git_hash",
    "violations_found": $USAGE_VIOLATIONS,
    "status": $(if [[ $USAGE_VIOLATIONS -eq 0 ]]; then echo '"compliant"'; else echo '"violations"'; fi)
  },
  "cache_status": {
    "infrastructure_present": $(if [[ -d "$CACHE_DIR" && -f "$MANIFEST_FILE" ]]; then echo "true"; else echo "false"; fi),
    "cached_files_count": $cached_count,
    "manifest_valid": $(if python3 -c "import json; json.load(open('$MANIFEST_FILE'))" 2>/dev/null; then echo "true"; else echo "false"; fi)
  },
  "enforcement_policy": "all_upstream_references_must_be_cached_locally",
  "next_verification": "stage_10_execution"
}
EOF
    
    echo -e "   ${GREEN}✅ Usage verification report: $report_file${NC}"
    echo ""
}

# Main execution
main() {
    echo "Verifying React Native upstream cache usage compliance..."
    echo ""
    
    # Run all verification checks
    verify_cache_infrastructure
    verify_manifest_structure
    verify_cached_file_metadata
    verify_cached_files_exist
    verify_build_log_citations
    verify_stage10_proactive_pull
    generate_usage_report
    
    # Final result
    if [[ $USAGE_VIOLATIONS -eq 0 ]]; then
        echo -e "${GREEN}✅ UPSTREAM USAGE VERIFICATION PASSED${NC}"
        echo ""
        echo -e "${BLUE}React Native upstream cache is properly implemented and used.${NC}"
        echo -e "${BLUE}All technical decisions are grounded in cached authoritative sources.${NC}"
        return 0
    else
        echo -e "${RED}❌ UPSTREAM USAGE VERIFICATION FAILED${NC}"
        echo ""
        echo -e "${YELLOW}Found $USAGE_VIOLATIONS violations of upstream cache usage policy.${NC}"
        echo -e "${YELLOW}Fix violations above before Stage 10 execution can proceed.${NC}"
        echo ""
        echo -e "${BLUE}Required actions:${NC}"
        echo -e "${BLUE}1. Run: scripts/rn_upstream_cache.sh initialize${NC}"
        echo -e "${BLUE}2. Run: scripts/rn_upstream_cache.sh proactive${NC}"
        echo -e "${BLUE}3. Ensure Stage 10 templates cite cached files, not upstream URLs${NC}"
        return 1
    fi
}

# Execute main function
main "$@"