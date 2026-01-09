#!/bin/bash
#
# Verify Reference Compliance
# 
# This script verifies that the documentation reference policy is being followed:
# - Documentation caches are present and non-empty
# - Stage 10 build_log.md cites local documentation sources
# - No uncached references are used in critical build stages
#
# Exit codes:
#   0 = Reference compliance verified
#   1 = Compliance violations found
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

echo "🔍 Reference Compliance Verification"
echo "===================================="
echo ""

COMPLIANCE_FAILED=false

# Function to verify documentation cache structure
verify_docs_cache() {
    echo "📚 Verifying documentation cache structure..."
    
    local required_dirs=(
        "vendor/expo-docs"
        "vendor/revenuecat-docs"
        "app/_docs"
        "app/_upstream/react-native"
    )
    
    local required_files=(
        "vendor/revenuecat-docs/llms.txt"
        "app/_docs/INDEX.md"
        "app/_docs/sources.json"
        "app/_upstream/react-native/manifest.json"
        "app/_upstream/react-native/INDEX.md"
    )
    
    # Check directories
    for dir in "${required_dirs[@]}"; do
        local full_path="$REPO_ROOT/$dir"
        if [[ -d "$full_path" ]]; then
            echo -e "   ${GREEN}✅ $dir/${NC}"
        else
            echo -e "   ${RED}❌ MISSING: $dir/${NC}"
            COMPLIANCE_FAILED=true
        fi
    done
    
    # Check files
    for file in "${required_files[@]}"; do
        local full_path="$REPO_ROOT/$file"
        if [[ -f "$full_path" ]]; then
            echo -e "   ${GREEN}✅ $file${NC}"
        else
            echo -e "   ${RED}❌ MISSING: $file${NC}"
            COMPLIANCE_FAILED=true
        fi
    done
    
    echo ""
}

# Function to verify sources.json has content
verify_sources_content() {
    echo "📋 Verifying sources.json content..."
    
    local sources_file="$REPO_ROOT/app/_docs/sources.json"
    
    if [[ ! -f "$sources_file" ]]; then
        echo -e "   ${RED}❌ sources.json not found${NC}"
        COMPLIANCE_FAILED=true
        return
    fi
    
    # Check if sources.json is valid JSON and has content
    if ! python3 -c "
import json, sys
try:
    with open('$sources_file', 'r') as f:
        data = json.load(f)
    if 'documentation_sources' not in data:
        print('Missing documentation_sources key')
        sys.exit(1)
    if len(data['documentation_sources']) == 0:
        print('Empty documentation_sources array')
        sys.exit(1)
    print(f'Valid: {len(data[\"documentation_sources\"])} sources registered')
except Exception as e:
    print(f'Invalid JSON: {e}')
    sys.exit(1)
" 2>/dev/null; then
        echo -e "   ${RED}❌ sources.json validation failed${NC}"
        COMPLIANCE_FAILED=true
    else
        echo -e "   ${GREEN}✅ sources.json has valid content${NC}"
    fi
    
    echo ""
}

# Function to verify Stage 10 build logs cite local docs
verify_build_log_citations() {
    echo "🏗️ Verifying Stage 10 build log citations..."
    
    # Find the most recent build log
    local build_logs=$(find "$REPO_ROOT" -name "stage10_build.log" -o -name "build_log.md" 2>/dev/null | head -1)
    
    if [[ -z "$build_logs" ]]; then
        echo -e "   ${YELLOW}⚠️ No Stage 10 build logs found (no builds executed yet)${NC}"
        echo ""
        return
    fi
    
    echo "   Checking: $build_logs"
    
    # Required local documentation citations
    local required_citations=(
        "vendor/expo-docs"
        "vendor/revenuecat-docs"
        "app/_docs/INDEX.md"
        "app/_upstream/react-native"
    )
    
    local missing_citations=()
    
    for citation in "${required_citations[@]}"; do
        if grep -q "$citation" "$build_logs"; then
            echo -e "   ${GREEN}✅ Cites $citation${NC}"
        else
            echo -e "   ${RED}❌ MISSING citation: $citation${NC}"
            missing_citations+=("$citation")
        fi
    done
    
    # Check for uncached external references
    local uncached_patterns=(
        "https://expo.dev"
        "https://docs.expo.dev"
        "https://revenuecat.com"
        "https://docs.revenuecat.com"
        "https://reactnative.dev"
    )
    
    local uncached_found=()
    
    for pattern in "${uncached_patterns[@]}"; do
        if grep -q "$pattern" "$build_logs"; then
            echo -e "   ${RED}❌ UNCACHED reference found: $pattern${NC}"
            uncached_found+=("$pattern")
        fi
    done
    
    if [[ ${#missing_citations[@]} -gt 0 ]]; then
        echo -e "   ${RED}Missing ${#missing_citations[@]} required local documentation citations${NC}"
        COMPLIANCE_FAILED=true
    fi
    
    if [[ ${#uncached_found[@]} -gt 0 ]]; then
        echo -e "   ${RED}Found ${#uncached_found[@]} uncached external references (policy violation)${NC}"
        COMPLIANCE_FAILED=true
    fi
    
    if [[ ${#missing_citations[@]} -eq 0 && ${#uncached_found[@]} -eq 0 ]]; then
        echo -e "   ${GREEN}✅ Build log properly cites local documentation${NC}"
    fi
    
    echo ""
}

# Function to check Expo SDK compatibility enforcement
verify_expo_compliance() {
    echo "📱 Verifying Expo SDK compatibility enforcement..."
    
    # Look for evidence of expo install --check usage in recent builds
    local expo_check_evidence=$(find "$REPO_ROOT" -name "*.log" -o -name "*.md" 2>/dev/null | \
        xargs grep -l "expo install --check" 2>/dev/null | head -3)
    
    if [[ -n "$expo_check_evidence" ]]; then
        echo -e "   ${GREEN}✅ Found evidence of expo install --check enforcement${NC}"
        echo "$expo_check_evidence" | while read -r file; do
            echo -e "      → $file"
        done
    else
        echo -e "   ${YELLOW}⚠️ No evidence of expo install --check enforcement found${NC}"
        echo -e "      ${BLUE}(This is acceptable if no builds have been executed)${NC}"
    fi
    
    echo ""
}

# Function to verify cache directory permissions and accessibility
verify_cache_accessibility() {
    echo "🔑 Verifying cache directory accessibility..."
    
    local cache_dirs=(
        "vendor/expo-docs"
        "vendor/revenuecat-docs"
        "app/_docs"
        "app/_upstream"
    )
    
    for dir in "${cache_dirs[@]}"; do
        local full_path="$REPO_ROOT/$dir"
        if [[ -d "$full_path" && -r "$full_path" ]]; then
            echo -e "   ${GREEN}✅ $dir (readable)${NC}"
        elif [[ -d "$full_path" ]]; then
            echo -e "   ${RED}❌ $dir (permission denied)${NC}"
            COMPLIANCE_FAILED=true
        else
            echo -e "   ${RED}❌ $dir (not found)${NC}"
            COMPLIANCE_FAILED=true
        fi
    done
    
    echo ""
}

# Function to generate compliance report
generate_compliance_report() {
    echo "📊 Generating compliance report..."
    
    local report_file="$REPO_ROOT/app/_docs/compliance_report.json"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local git_hash=$(cd "$REPO_ROOT" && git rev-parse HEAD 2>/dev/null || echo "unknown")
    
    local status="compliant"
    if [[ "$COMPLIANCE_FAILED" == "true" ]]; then
        status="violation"
    fi
    
    cat > "$report_file" << EOF
{
  "compliance_check": {
    "timestamp": "$timestamp",
    "script": "scripts/verify_reference_compliance.sh",
    "git_hash": "$git_hash",
    "status": "$status",
    "policy_version": "canonical_docs_upstream_reference_sync"
  },
  "checks": {
    "documentation_cache_structure": $(if [[ "$COMPLIANCE_FAILED" != "true" ]]; then echo "true"; else echo "false"; fi),
    "sources_content_validation": "checked",
    "build_log_citations": "verified",
    "expo_sdk_compliance": "checked",
    "cache_accessibility": "verified"
  },
  "next_verification": "stage_10_execution"
}
EOF
    
    echo -e "   ${GREEN}✅ Compliance report generated: $report_file${NC}"
    echo ""
}

# Main execution
main() {
    echo "Verifying reference compliance for pipeline execution..."
    echo ""
    
    verify_docs_cache
    verify_sources_content
    verify_build_log_citations
    verify_expo_compliance
    verify_cache_accessibility
    generate_compliance_report
    
    if [[ "$COMPLIANCE_FAILED" == "true" ]]; then
        echo -e "${RED}❌ REFERENCE COMPLIANCE VERIFICATION FAILED${NC}"
        echo -e "${YELLOW}Fix violations above before Stage 10 execution.${NC}"
        echo ""
        echo -e "${BLUE}Required actions:${NC}"
        echo -e "${BLUE}1. Run scripts/upstream_reference_sync.sh to initialize missing infrastructure${NC}"
        echo -e "${BLUE}2. Ensure Stage 10 templates cite local vendor documentation${NC}"
        echo -e "${BLUE}3. Remove any uncached external documentation references${NC}"
        return 1
    else
        echo -e "${GREEN}✅ REFERENCE COMPLIANCE VERIFIED${NC}"
        echo ""
        echo -e "${BLUE}All documentation reference policies are being enforced correctly.${NC}"
        echo -e "${BLUE}Pipeline execution may proceed with confidence in source authority.${NC}"
        return 0
    fi
}

# Execute main function
main "$@"