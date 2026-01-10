#!/bin/bash

# Validate Dependencies - Check packages exist in npm registry
# Purpose: Prevent invented package names from breaking builds
# Usage: validate_dependencies.sh <package.json_path>
#
# This script validates that all dependencies in a package.json
# actually exist in the npm registry before the file is used.

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[DEP_VALIDATE]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[DEP_VALIDATE]${NC} $1"
}

log_error() {
    echo -e "${RED}[DEP_VALIDATE]${NC} $1"
}

# Known valid Expo packages (to avoid npm view overhead)
declare -A KNOWN_VALID_PACKAGES=(
    ["expo"]="valid"
    ["expo-router"]="valid"
    ["expo-status-bar"]="valid"
    ["expo-constants"]="valid"
    ["expo-linking"]="valid"
    ["expo-file-system"]="valid"
    ["expo-sqlite"]="valid"
    ["expo-image-picker"]="valid"
    ["expo-media-library"]="valid"
    ["expo-sharing"]="valid"
    ["expo-av"]="valid"
    ["expo-haptics"]="valid"
    ["expo-linear-gradient"]="valid"
    ["expo-dev-client"]="valid"
    ["expo-font"]="valid"
    ["expo-splash-screen"]="valid"
    ["expo-updates"]="valid"
    ["expo-notifications"]="valid"
    ["expo-device"]="valid"
    ["expo-crypto"]="valid"
    ["expo-localization"]="valid"
    ["expo-secure-store"]="valid"
    ["expo-image"]="valid"
    ["expo-video"]="valid"
    ["expo-blur"]="valid"
    ["react"]="valid"
    ["react-native"]="valid"
    ["react-native-purchases"]="valid"
    ["react-native-reanimated"]="valid"
    ["react-native-gesture-handler"]="valid"
    ["react-native-screens"]="valid"
    ["react-native-safe-area-context"]="valid"
    ["react-native-svg"]="valid"
    ["react-native-web"]="valid"
    ["@react-navigation/native"]="valid"
    ["@react-navigation/bottom-tabs"]="valid"
    ["@react-navigation/stack"]="valid"
    ["@react-navigation/drawer"]="valid"
    ["@react-native-async-storage/async-storage"]="valid"
    ["@expo/vector-icons"]="valid"
    ["typescript"]="valid"
    ["@babel/core"]="valid"
    ["@types/react"]="valid"
)

# Known INVALID packages (commonly invented by AI)
declare -A KNOWN_INVALID_PACKAGES=(
    ["expo-ml-kit"]="DOES_NOT_EXIST"
    ["expo-ml"]="DOES_NOT_EXIST"
    ["expo-ai"]="DOES_NOT_EXIST"
    ["expo-machine-learning"]="DOES_NOT_EXIST"
    ["react-native-ml-kit"]="DOES_NOT_EXIST"
    ["expo-async-storage"]="USE @react-native-async-storage/async-storage"
    ["@expo/async-storage"]="USE @react-native-async-storage/async-storage"
    ["expo-navigation"]="USE expo-router or @react-navigation/native"
    ["@types/react-native"]="DEPRECATED - not needed with RN 0.72+"
)

# Check if a package exists in npm registry
check_package_exists() {
    local package_name="$1"

    # Check known valid packages first (fast path)
    if [[ -n "${KNOWN_VALID_PACKAGES[$package_name]+isset}" ]]; then
        return 0
    fi

    # Check known invalid packages (fast fail)
    if [[ -n "${KNOWN_INVALID_PACKAGES[$package_name]+isset}" ]]; then
        log_error "INVALID PACKAGE: $package_name - ${KNOWN_INVALID_PACKAGES[$package_name]}"
        return 1
    fi

    # Fall back to npm view (slow but authoritative)
    if npm view "$package_name" version >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Main validation function
validate_package_json() {
    local package_json="$1"

    if [[ ! -f "$package_json" ]]; then
        log_error "package.json not found: $package_json"
        return 1
    fi

    log_info "Validating dependencies in: $package_json"

    # Extract dependencies using Python
    local deps_json=$(python3 -c "
import json
import sys

try:
    with open('$package_json', 'r') as f:
        data = json.load(f)

    deps = data.get('dependencies', {})
    dev_deps = data.get('devDependencies', {})

    all_deps = {**deps, **dev_deps}

    for name, version in all_deps.items():
        print(f'{name}')
except Exception as e:
    print(f'ERROR: {e}', file=sys.stderr)
    sys.exit(1)
")

    if [[ $? -ne 0 ]]; then
        log_error "Failed to parse package.json"
        return 1
    fi

    local invalid_packages=()
    local valid_count=0
    local total_count=0

    while IFS= read -r package_name; do
        [[ -z "$package_name" ]] && continue
        total_count=$((total_count + 1))

        if check_package_exists "$package_name"; then
            valid_count=$((valid_count + 1))
        else
            invalid_packages+=("$package_name")
            log_error "INVALID: $package_name does not exist in npm registry"
        fi
    done <<< "$deps_json"

    log_info "Validated $valid_count/$total_count packages"

    if [[ ${#invalid_packages[@]} -gt 0 ]]; then
        log_error "=================================================="
        log_error "DEPENDENCY VALIDATION FAILED"
        log_error "The following packages do not exist:"
        for pkg in "${invalid_packages[@]}"; do
            log_error "  - $pkg"
        done
        log_error "=================================================="
        return 1
    else
        log_info "=================================================="
        log_info "DEPENDENCY VALIDATION PASSED"
        log_info "All $total_count packages verified to exist in npm"
        log_info "=================================================="
        return 0
    fi
}

# Main
main() {
    if [[ $# -ne 1 ]]; then
        echo "Usage: $0 <package.json_path>"
        echo "Example: $0 builds/01_myapp__app_001/build_123/app/package.json"
        exit 1
    fi

    validate_package_json "$1"
}

main "$@"
