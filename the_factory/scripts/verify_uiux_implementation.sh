#!/bin/bash

# Verify UI/UX Implementation - Check for non-generic UI
# Purpose: Ensure screens implement actual domain features
# Usage: verify_uiux_implementation.sh <app_directory>
#
# This script verifies that the app has:
# 1. Design tokens file with app-specific colors
# 2. Non-generic home screen content
# 3. Required screen files present
# 4. Services implemented (not placeholders)

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[UIUX_CHECK]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[UIUX_CHECK]${NC} $1"
}

log_error() {
    echo -e "${RED}[UIUX_CHECK]${NC} $1"
}

# Generic content patterns to detect placeholders
# Note: "Placeholder" is excluded because placeholder="" is valid React Native
GENERIC_PATTERNS=(
    "Welcome to My App"
    "Hello World"
    "Getting Started"
    "Your App Name"
    "Lorem ipsum"
    "Sample App"
    "TODO: Implement"
    "Not implemented"
    "Coming soon"
    "Under construction"
    "PLACEHOLDER_"
)

# Check design tokens
check_design_tokens() {
    local app_dir=$1
    local checklist_file=$2

    log_info "Checking design tokens..."

    local tokens_file=""
    local possible_locations=(
        "$app_dir/src/design/tokens.ts"
        "$app_dir/src/design/tokens.js"
        "$app_dir/src/ui/tokens.ts"
        "$app_dir/src/ui/tokens.js"
        "$app_dir/src/theme/tokens.ts"
        "$app_dir/src/constants/design.ts"
        "$app_dir/src/styles/tokens.ts"
    )

    for loc in "${possible_locations[@]}"; do
        if [[ -f "$loc" ]]; then
            tokens_file="$loc"
            break
        fi
    done

    if [[ -z "$tokens_file" ]]; then
        echo "- [ ] Design tokens file exists" >> "$checklist_file"
        log_warn "Design tokens file not found"
        return 1
    fi

    echo "- [x] Design tokens file exists: $(basename $tokens_file)" >> "$checklist_file"

    # Check for color definitions
    if grep -q "Colors\|colors\|COLORS" "$tokens_file"; then
        echo "- [x] Color definitions present" >> "$checklist_file"
    else
        echo "- [ ] Color definitions present" >> "$checklist_file"
        log_warn "No color definitions found in tokens file"
    fi

    # Check for non-generic colors (not default gray/white only)
    if grep -qE "#[0-9A-Fa-f]{6}" "$tokens_file"; then
        local color_count=$(grep -oE "#[0-9A-Fa-f]{6}" "$tokens_file" | sort -u | wc -l)
        if [[ $color_count -gt 5 ]]; then
            echo "- [x] Custom color palette ($color_count unique colors)" >> "$checklist_file"
        else
            echo "- [ ] Custom color palette (only $color_count colors - too generic)" >> "$checklist_file"
        fi
    fi

    log_info "Design tokens: OK"
    return 0
}

# Check for required screens
check_required_screens() {
    local app_dir=$1
    local checklist_file=$2

    log_info "Checking required screens..."

    local screens_dir=""
    local possible_dirs=(
        "$app_dir/src/screens"
        "$app_dir/app"
        "$app_dir/screens"
    )

    for dir in "${possible_dirs[@]}"; do
        if [[ -d "$dir" ]]; then
            screens_dir="$dir"
            break
        fi
    done

    if [[ -z "$screens_dir" ]]; then
        echo "- [ ] Screens directory exists" >> "$checklist_file"
        log_warn "No screens directory found"
        return 1
    fi

    echo "- [x] Screens directory exists: $screens_dir" >> "$checklist_file"

    # Required screens for a complete app
    local required_screens=(
        "Home"
        "Settings"
    )

    local optional_screens=(
        "Onboarding"
        "Paywall"
        "Search"
    )

    for screen in "${required_screens[@]}"; do
        if find "$screens_dir" -name "*${screen}*" -type f 2>/dev/null | grep -q .; then
            echo "- [x] $screen screen implemented" >> "$checklist_file"
        else
            echo "- [ ] $screen screen implemented" >> "$checklist_file"
            log_warn "Required screen missing: $screen"
        fi
    done

    for screen in "${optional_screens[@]}"; do
        if find "$screens_dir" -name "*${screen}*" -type f 2>/dev/null | grep -q .; then
            echo "- [x] $screen screen implemented (optional)" >> "$checklist_file"
        fi
    done

    local screen_count=$(find "$screens_dir" -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.jsx" 2>/dev/null | wc -l)
    echo "- [x] Total screens: $screen_count" >> "$checklist_file"

    log_info "Screens check complete"
    return 0
}

# Check for generic content
check_for_generic_content() {
    local app_dir=$1
    local checklist_file=$2

    log_info "Checking for generic/placeholder content..."

    local generic_found=false
    local src_dir="$app_dir/src"

    if [[ ! -d "$src_dir" ]]; then
        src_dir="$app_dir"
    fi

    echo "" >> "$checklist_file"
    echo "### Generic Content Check" >> "$checklist_file"

    for pattern in "${GENERIC_PATTERNS[@]}"; do
        if grep -ri "$pattern" "$src_dir" --include="*.tsx" --include="*.ts" --include="*.js" 2>/dev/null | head -1 | grep -q .; then
            echo "- [ ] No generic content: Found '$pattern'" >> "$checklist_file"
            log_warn "Generic content detected: '$pattern'"
            generic_found=true
        fi
    done

    if ! $generic_found; then
        echo "- [x] No generic/placeholder content detected" >> "$checklist_file"
        log_info "No generic content found"
        return 0
    fi

    return 1
}

# Check services implementation
check_services() {
    local app_dir=$1
    local checklist_file=$2

    log_info "Checking services implementation..."

    local services_dir=""
    local possible_dirs=(
        "$app_dir/src/services"
        "$app_dir/services"
        "$app_dir/src/lib"
    )

    for dir in "${possible_dirs[@]}"; do
        if [[ -d "$dir" ]]; then
            services_dir="$dir"
            break
        fi
    done

    echo "" >> "$checklist_file"
    echo "### Services Implementation" >> "$checklist_file"

    if [[ -z "$services_dir" ]]; then
        echo "- [ ] Services directory exists" >> "$checklist_file"
        return 1
    fi

    echo "- [x] Services directory exists: $services_dir" >> "$checklist_file"

    # Check for RevenueCat service
    if find "$services_dir" -name "*[Pp]urchase*" -o -name "*[Rr]evenue*" -o -name "*[Ss]ubscription*" 2>/dev/null | grep -q .; then
        echo "- [x] Subscription/RevenueCat service implemented" >> "$checklist_file"
    else
        echo "- [ ] Subscription/RevenueCat service implemented" >> "$checklist_file"
    fi

    # Check for data storage service
    if find "$services_dir" -name "*[Ss]torage*" -o -name "*[Dd]atabase*" -o -name "*[Dd]ata*" 2>/dev/null | grep -q .; then
        echo "- [x] Data storage service implemented" >> "$checklist_file"
    else
        echo "- [ ] Data storage service implemented" >> "$checklist_file"
    fi

    log_info "Services check complete"
    return 0
}

# Check for reusable components
check_components() {
    local app_dir=$1
    local checklist_file=$2

    log_info "Checking reusable components..."

    echo "" >> "$checklist_file"
    echo "### Reusable Components" >> "$checklist_file"

    local components_dir=""
    local possible_dirs=(
        "$app_dir/src/components"
        "$app_dir/components"
        "$app_dir/src/ui/components"
    )

    for dir in "${possible_dirs[@]}"; do
        if [[ -d "$dir" ]]; then
            components_dir="$dir"
            break
        fi
    done

    if [[ -z "$components_dir" ]]; then
        echo "- [ ] Components directory exists" >> "$checklist_file"
        return 1
    fi

    local component_count=$(find "$components_dir" -name "*.tsx" -o -name "*.ts" 2>/dev/null | wc -l)
    echo "- [x] Components directory exists: $components_dir ($component_count components)" >> "$checklist_file"

    # Check for Button component
    if find "$components_dir" -name "*[Bb]utton*" 2>/dev/null | grep -q .; then
        echo "- [x] Button component" >> "$checklist_file"
    else
        echo "- [ ] Button component" >> "$checklist_file"
    fi

    log_info "Components check complete"
    return 0
}

# Main function
main() {
    if [[ $# -ne 1 ]]; then
        echo "Usage: $0 <app_directory>"
        echo "Example: $0 builds/01_myapp__app_001/build_123/app"
        exit 1
    fi

    local app_dir="$1"

    if [[ ! -d "$app_dir" ]]; then
        log_error "App directory does not exist: $app_dir"
        exit 1
    fi

    app_dir=$(cd "$app_dir" && pwd)

    local checklist_file="$app_dir/uiux_implementation_checklist.md"

    log_info "Starting UI/UX implementation verification for: $app_dir"
    log_info "=================================================="

    # Create checklist file
    cat > "$checklist_file" << EOF
# UI/UX Implementation Checklist

**App Directory**: $app_dir
**Verified At**: $(date -Iseconds)

## Verification Results

### Design System
EOF

    local all_passed=true

    # Run all checks
    if ! check_design_tokens "$app_dir" "$checklist_file"; then
        all_passed=false
    fi

    echo "" >> "$checklist_file"
    echo "### Screen Implementation" >> "$checklist_file"

    if ! check_required_screens "$app_dir" "$checklist_file"; then
        all_passed=false
    fi

    if ! check_for_generic_content "$app_dir" "$checklist_file"; then
        all_passed=false
    fi

    check_services "$app_dir" "$checklist_file"
    check_components "$app_dir" "$checklist_file"

    # Write summary
    echo "" >> "$checklist_file"
    echo "---" >> "$checklist_file"
    echo "" >> "$checklist_file"

    if $all_passed; then
        echo "## Summary: PASSED" >> "$checklist_file"
        echo "" >> "$checklist_file"
        echo "The UI/UX implementation meets quality standards." >> "$checklist_file"
        log_info "=================================================="
        log_info "UI/UX IMPLEMENTATION CHECKLIST: PASSED"
        log_info "See $checklist_file for details"
        log_info "=================================================="
        exit 0
    else
        echo "## Summary: NEEDS ATTENTION" >> "$checklist_file"
        echo "" >> "$checklist_file"
        echo "Some UI/UX implementation items need review." >> "$checklist_file"
        log_warn "=================================================="
        log_warn "UI/UX IMPLEMENTATION CHECKLIST: NEEDS ATTENTION"
        log_warn "See $checklist_file for details"
        log_warn "=================================================="
        exit 1
    fi
}

main "$@"
