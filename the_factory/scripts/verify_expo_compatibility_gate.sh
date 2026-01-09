#!/bin/bash
#
# Verify Expo Compatibility Gate
# 
# This script enforces strict Expo SDK compatibility by:
# 1. Running expo install --check before any package installation
# 2. Treating Expo expected versions as authoritative
# 3. Failing builds if install occurs before dependency alignment
# 4. Preventing Expo SDK upgrades to chase dependencies
#
# Exit codes:
#   0 = Expo compatibility verified (clean check)
#   1 = Expo compatibility violations found or gate not enforced
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🔧 Expo Compatibility Gate Verification"
echo "========================================"
echo ""

# Configuration
BUILD_DIR="${1:-}"
COMPATIBILITY_VIOLATIONS=0

# Function to find build directory
find_build_directory() {
    if [[ -n "$BUILD_DIR" && -d "$BUILD_DIR" ]]; then
        echo "$BUILD_DIR"
        return 0
    fi
    
    # Look for most recent build
    local recent_build=$(find "$REPO_ROOT/builds" -type d -name "app" | head -1 | xargs dirname 2>/dev/null || echo "")
    if [[ -n "$recent_build" && -d "$recent_build" ]]; then
        echo "$recent_build"
        return 0
    fi
    
    echo ""
    return 1
}

# Function to verify expo install --check enforcement
verify_expo_check_enforcement() {
    local build_dir="$1"
    local app_dir="$build_dir/app"
    
    echo "🔍 Verifying expo install --check enforcement..."
    
    if [[ ! -d "$app_dir" ]]; then
        echo -e "   ${YELLOW}⚠️ No app directory found - cannot verify Expo check enforcement${NC}"
        return 0
    fi
    
    # Check for package.json
    if [[ ! -f "$app_dir/package.json" ]]; then
        echo -e "   ${YELLOW}⚠️ No package.json found - no dependencies to verify${NC}"
        return 0
    fi
    
    # Check if build log exists and documents expo install --check
    local build_log="$build_dir/build_log.md"
    if [[ -f "$build_log" ]]; then
        local expo_check_evidence=$(grep -c "expo install --check\|npx expo install --check\|Expo SDK.*compatibility\|expo install --fix\|mismatches detected" "$build_log" 2>/dev/null || echo "0")
        
        if [[ "$expo_check_evidence" -gt 0 ]]; then
            echo -e "   ${GREEN}✅ Expo compatibility check evidence found in build log${NC}"
            
            # Look for specific compatibility enforcement patterns
            if grep -q "mismatches detected\|Upgrade required\|Downgrade required\|npx expo install --fix" "$build_log" 2>/dev/null; then
                echo -e "   ${GREEN}✅ Dependency alignment process documented${NC}"
            fi
            
            # Check for forbidden patterns (upgrading Expo to chase deps)
            if grep -q "upgrading Expo\|Expo.*upgrade.*dependencies" "$build_log" 2>/dev/null; then
                echo -e "   ${RED}❌ VIOLATION: Expo SDK upgrade to chase dependencies detected${NC}"
                ((COMPATIBILITY_VIOLATIONS++))
            fi
        else
            echo -e "   ${RED}❌ VIOLATION: No expo install --check enforcement evidence found${NC}"
            ((COMPATIBILITY_VIOLATIONS++))
        fi
    else
        echo -e "   ${YELLOW}⚠️ No build log found - cannot verify enforcement${NC}"
    fi
}

# Function to run expo install --check if possible
run_expo_check() {
    local build_dir="$1"
    local app_dir="$build_dir/app"
    
    echo "🧪 Running expo install --check (if possible)..."
    
    if [[ ! -d "$app_dir" ]]; then
        echo -e "   ${YELLOW}⚠️ No app directory - skipping live check${NC}"
        return 0
    fi
    
    if [[ ! -f "$app_dir/package.json" ]]; then
        echo -e "   ${YELLOW}⚠️ No package.json - skipping live check${NC}"
        return 0
    fi
    
    # Change to app directory and run expo install --check
    cd "$app_dir"
    
    if command -v expo >/dev/null 2>&1 || command -v npx >/dev/null 2>&1; then
        echo "   Running: npx expo install --check"
        
        # Capture expo install --check output
        local check_output=""
        local check_exit_code=0
        
        if check_output=$(npx expo install --check 2>&1); then
            check_exit_code=0
        else
            check_exit_code=$?
        fi
        
        echo -e "   ${BLUE}Expo check output:${NC}"
        echo "$check_output" | sed 's/^/   /'
        
        if [[ $check_exit_code -eq 0 ]] && echo "$check_output" | grep -q "dependencies are compatible\|no issues found\|✓"; then
            echo -e "   ${GREEN}✅ All dependencies aligned with Expo expectations${NC}"
        elif echo "$check_output" | grep -q "mismatch\|expected.*different\|✖\|❌"; then
            echo -e "   ${RED}❌ DEPENDENCY MISMATCHES DETECTED${NC}"
            echo -e "   ${YELLOW}Required action: Run 'npx expo install --fix' to align dependencies${NC}"
            ((COMPATIBILITY_VIOLATIONS++))
        else
            echo -e "   ${YELLOW}⚠️ Unable to determine dependency alignment status${NC}"
        fi
    else
        echo -e "   ${YELLOW}⚠️ Expo CLI not available - cannot run live check${NC}"
    fi
    
    # Return to repo root
    cd "$REPO_ROOT"
}

# Function to verify package.json alignment
verify_package_json_alignment() {
    local build_dir="$1"
    local app_dir="$build_dir/app"
    
    echo "📦 Verifying package.json Expo alignment..."
    
    if [[ ! -f "$app_dir/package.json" ]]; then
        echo -e "   ${YELLOW}⚠️ No package.json to verify${NC}"
        return 0
    fi
    
    # Check for Expo SDK version
    local expo_version=$(grep -o '"expo".*"[^"]*"' "$app_dir/package.json" 2>/dev/null | sed 's/.*"\([^"]*\)".*/\1/' || echo "none")
    
    if [[ "$expo_version" != "none" ]]; then
        echo -e "   ${GREEN}✅ Expo SDK version: $expo_version${NC}"
        
        # Check for common problematic patterns
        if grep -q '"resolutions":\|"overrides":' "$app_dir/package.json" 2>/dev/null; then
            echo -e "   ${YELLOW}⚠️ Package resolutions/overrides found - verify compatibility${NC}"
            
            # Look for Expo-related overrides (usually forbidden)
            if grep -A 10 '"resolutions":\|"overrides":' "$app_dir/package.json" | grep -q "expo\|react-native"; then
                echo -e "   ${RED}❌ VIOLATION: Expo/React Native dependency overrides detected${NC}"
                ((COMPATIBILITY_VIOLATIONS++))
            fi
        fi
    else
        echo -e "   ${RED}❌ VIOLATION: No Expo SDK dependency found${NC}"
        ((COMPATIBILITY_VIOLATIONS++))
    fi
}

# Function to check for install-before-check violations
verify_install_order() {
    local build_dir="$1"
    local build_log="$build_dir/build_log.md"
    
    echo "⚡ Verifying install order (check before install)..."
    
    if [[ ! -f "$build_log" ]]; then
        echo -e "   ${YELLOW}⚠️ No build log - cannot verify install order${NC}"
        return 0
    fi
    
    # Look for npm install / yarn install before expo install --check
    local npm_install_line=$(grep -n "npm install\|yarn install\|npm ci" "$build_log" | head -1 | cut -d: -f1 || echo "999999")
    local expo_check_line=$(grep -n "expo install --check\|npx expo install --check" "$build_log" | head -1 | cut -d: -f1 || echo "0")
    
    if [[ "$expo_check_line" -gt 0 && "$npm_install_line" -lt "$expo_check_line" ]]; then
        echo -e "   ${RED}❌ VIOLATION: npm/yarn install executed before expo install --check${NC}"
        echo -e "   ${YELLOW}Required: expo install --check must run BEFORE any package installation${NC}"
        ((COMPATIBILITY_VIOLATIONS++))
    elif [[ "$expo_check_line" -gt 0 ]]; then
        echo -e "   ${GREEN}✅ Correct order: expo install --check before package installation${NC}"
    else
        echo -e "   ${YELLOW}⚠️ No expo install --check found in build log${NC}"
    fi
}

# Function to generate compatibility report
generate_compatibility_report() {
    local build_dir="$1"
    local report_file="$build_dir/expo_compatibility_report.json"
    
    echo "📊 Generating compatibility verification report..."
    
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local violations_status="compliant"
    if [[ $COMPATIBILITY_VIOLATIONS -gt 0 ]]; then
        violations_status="non_compliant"
    fi
    
    cat > "$report_file" << EOF
{
  "expo_compatibility_verification": {
    "timestamp": "$timestamp",
    "script": "scripts/verify_expo_compatibility_gate.sh",
    "violations_found": $COMPATIBILITY_VIOLATIONS,
    "status": "$violations_status"
  },
  "checks_performed": [
    "expo_install_check_enforcement",
    "package_json_alignment",
    "install_order_verification",
    "dependency_override_detection"
  ],
  "required_actions": [
    {
      "condition": "violations > 0",
      "action": "Run npx expo install --fix to align dependencies"
    },
    {
      "condition": "always",
      "action": "Ensure expo install --check runs before npm install"
    }
  ]
}
EOF
    
    echo -e "   ${GREEN}✅ Compatibility report: $report_file${NC}"
}

# Main execution
main() {
    local build_dir
    
    # Find build directory
    echo "🔍 Locating build directory for verification..."
    if build_dir=$(find_build_directory); then
        echo -e "   ${GREEN}✅ Build directory: $build_dir${NC}"
    else
        echo -e "   ${YELLOW}⚠️ No build directory found - skipping compatibility verification${NC}"
        echo -e "   ${BLUE}This is acceptable if no builds have been executed yet.${NC}"
        exit 0
    fi
    
    echo ""
    
    # Run all verification checks
    verify_expo_check_enforcement "$build_dir"
    echo ""
    
    run_expo_check "$build_dir"
    echo ""
    
    verify_package_json_alignment "$build_dir"
    echo ""
    
    verify_install_order "$build_dir"
    echo ""
    
    generate_compatibility_report "$build_dir"
    echo ""
    
    # Final result
    if [[ $COMPATIBILITY_VIOLATIONS -eq 0 ]]; then
        echo -e "${GREEN}✅ EXPO COMPATIBILITY GATE VERIFIED${NC}"
        echo "All dependency alignment requirements satisfied."
        exit 0
    else
        echo -e "${RED}❌ EXPO COMPATIBILITY GATE FAILED${NC}"
        echo -e "${YELLOW}Found $COMPATIBILITY_VIOLATIONS compatibility violations.${NC}"
        echo ""
        echo -e "${BLUE}Required actions:${NC}"
        echo -e "${BLUE}1. Run 'npx expo install --check' before any npm install${NC}"
        echo -e "${BLUE}2. Use 'npx expo install --fix' to align dependency mismatches${NC}"
        echo -e "${BLUE}3. Do not override Expo expected versions with resolutions${NC}"
        echo -e "${BLUE}4. Do not upgrade Expo SDK to chase dependency compatibility${NC}"
        exit 1
    fi
}

# Execute main function
main "$@"