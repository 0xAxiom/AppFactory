#!/bin/bash
#
# Verify Design System Compliance
# 
# This script ensures that generated Expo apps follow the canonical design system:
# - Design tokens exist and are properly structured
# - Component primitives use tokens consistently
# - Accessibility requirements are met
# - No random styles scattered across screens
#
# Exit codes:
#   0 = Design system compliance verified
#   1 = Design system violations found
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

echo "🎨 Design System Compliance Verification"
echo "======================================="
echo ""

# Configuration
BUILD_DIR="${1:-}"
DESIGN_VIOLATIONS=0

# Function to find build directory
find_build_directory() {
    if [[ -n "$BUILD_DIR" && -d "$BUILD_DIR" ]]; then
        echo "$BUILD_DIR"
        return 0
    fi
    
    # Look for most recent build with app/src structure
    local recent_build=$(find "$REPO_ROOT/builds" -type d -path "*/app/src" | head -1 | sed 's|/app/src||' 2>/dev/null || echo "")
    if [[ -n "$recent_build" && -d "$recent_build" ]]; then
        echo "$recent_build"
        return 0
    fi
    
    echo ""
    return 1
}

# Function to verify design tokens structure
verify_design_tokens() {
    local build_dir="$1"
    local app_dir="$build_dir/app"
    local tokens_file=""
    
    echo "🎯 Verifying design tokens structure..."
    
    # Look for design tokens file
    if [[ -f "$app_dir/src/ui/tokens.ts" ]]; then
        tokens_file="$app_dir/src/ui/tokens.ts"
        echo -e "   ${GREEN}✅ Design tokens found: src/ui/tokens.ts${NC}"
    elif [[ -f "$app_dir/src/ui/theme.ts" ]]; then
        tokens_file="$app_dir/src/ui/theme.ts"
        echo -e "   ${GREEN}✅ Design tokens found: src/ui/theme.ts${NC}"
    else
        echo -e "   ${RED}❌ VIOLATION: No design tokens file found${NC}"
        echo -e "   ${YELLOW}Expected: src/ui/tokens.ts or src/ui/theme.ts${NC}"
        ((DESIGN_VIOLATIONS++))
        return 1
    fi
    
    # Verify required token categories
    local required_tokens=("colors" "typography" "spacing" "borderRadius")
    local missing_tokens=()
    
    for token in "${required_tokens[@]}"; do
        if grep -q "export.*$token\|$token:" "$tokens_file" 2>/dev/null; then
            echo -e "   ${GREEN}✅ $token tokens defined${NC}"
        else
            echo -e "   ${RED}❌ MISSING: $token tokens${NC}"
            missing_tokens+=("$token")
            ((DESIGN_VIOLATIONS++))
        fi
    done
    
    # Check for accessibility tokens
    if grep -q "touchTarget\|accessibility\|childDesign" "$tokens_file" 2>/dev/null; then
        echo -e "   ${GREEN}✅ Accessibility tokens present${NC}"
    else
        echo -e "   ${YELLOW}⚠️ No accessibility tokens found${NC}"
    fi
    
    echo ""
}

# Function to verify component primitives
verify_component_primitives() {
    local build_dir="$1"
    local app_dir="$build_dir/app"
    local ui_components_dir="$app_dir/src/ui/components"
    
    echo "🧩 Verifying component primitives..."
    
    if [[ ! -d "$ui_components_dir" ]]; then
        echo -e "   ${RED}❌ VIOLATION: No UI components directory found${NC}"
        echo -e "   ${YELLOW}Expected: src/ui/components/${NC}"
        ((DESIGN_VIOLATIONS++))
        return 1
    fi
    
    # Check for essential component primitives
    local required_components=("Button" "Card")
    local optional_components=("Screen" "Text" "Input" "Modal")
    
    for component in "${required_components[@]}"; do
        if find "$ui_components_dir" -name "*$component*.tsx" -o -name "*$component*.ts" | grep -q .; then
            echo -e "   ${GREEN}✅ $component component found${NC}"
        else
            echo -e "   ${RED}❌ MISSING: $component component${NC}"
            ((DESIGN_VIOLATIONS++))
        fi
    done
    
    for component in "${optional_components[@]}"; do
        if find "$ui_components_dir" -name "*$component*.tsx" -o -name "*$component*.ts" | grep -q .; then
            echo -e "   ${GREEN}✅ $component component found${NC}"
        else
            echo -e "   ${YELLOW}⚠️ Optional: $component component not found${NC}"
        fi
    done
    
    echo ""
}

# Function to verify component token usage
verify_token_usage() {
    local build_dir="$1"
    local app_dir="$build_dir/app"
    local ui_components_dir="$app_dir/src/ui/components"
    
    echo "🔗 Verifying component token usage..."
    
    if [[ ! -d "$ui_components_dir" ]]; then
        echo -e "   ${YELLOW}⚠️ No UI components to verify${NC}"
        return 0
    fi
    
    # Look for components importing tokens
    local components_using_tokens=0
    local total_components=0
    
    for component_file in "$ui_components_dir"/*.tsx "$ui_components_dir"/*.ts; do
        if [[ -f "$component_file" ]]; then
            ((total_components++))
            local component_name=$(basename "$component_file" .tsx)
            
            if grep -q "import.*tokens\|import.*theme\|from.*tokens\|from.*theme" "$component_file" 2>/dev/null; then
                echo -e "   ${GREEN}✅ $component_name uses design tokens${NC}"
                ((components_using_tokens++))
            else
                echo -e "   ${RED}❌ VIOLATION: $component_name doesn't import tokens${NC}"
                ((DESIGN_VIOLATIONS++))
            fi
        fi
    done
    
    if [[ $total_components -gt 0 ]]; then
        echo -e "   ${BLUE}Token usage: $components_using_tokens/$total_components components${NC}"
    fi
    
    echo ""
}

# Function to check for random inline styles
verify_style_consistency() {
    local build_dir="$1"
    local app_dir="$build_dir/app"
    local screens_dir="$app_dir/src/screens"
    
    echo "🎭 Verifying style consistency (no random styles)..."
    
    if [[ ! -d "$screens_dir" ]]; then
        echo -e "   ${YELLOW}⚠️ No screens directory to verify${NC}"
        return 0
    fi
    
    # Look for inline styles in screens (problematic pattern)
    local screens_with_inline_styles=0
    local total_screens=0
    
    for screen_file in "$screens_dir"/*.tsx "$screens_dir"/*.ts; do
        if [[ -f "$screen_file" ]]; then
            ((total_screens++))
            local screen_name=$(basename "$screen_file" .tsx)
            
            # Check for problematic inline style patterns
            local inline_style_count=$(grep -c "style={{.*}}\|backgroundColor:.*#\|color:.*#\|fontSize:.*[0-9]" "$screen_file" 2>/dev/null || echo "0")
            inline_style_count=${inline_style_count:-0}
            
            if [[ $inline_style_count -gt 0 ]]; then
                echo -e "   ${YELLOW}⚠️ $screen_name has $inline_style_count inline style patterns${NC}"
                ((screens_with_inline_styles++))
            else
                echo -e "   ${GREEN}✅ $screen_name follows style consistency${NC}"
            fi
        fi
    done
    
    if [[ $screens_with_inline_styles -gt 3 ]]; then
        echo -e "   ${RED}❌ VIOLATION: Too many screens with inline styles ($screens_with_inline_styles/$total_screens)${NC}"
        ((DESIGN_VIOLATIONS++))
    elif [[ $screens_with_inline_styles -gt 0 ]]; then
        echo -e "   ${YELLOW}⚠️ Some inline styles found - consider consolidating to design system${NC}"
    fi
    
    echo ""
}

# Function to verify accessibility compliance
verify_accessibility_compliance() {
    local build_dir="$1"
    local app_dir="$build_dir/app"
    
    echo "♿ Verifying accessibility compliance..."
    
    # Check for accessibility-related imports and usage
    local accessibility_evidence=$(find "$app_dir/src" -name "*.tsx" -o -name "*.ts" | xargs grep -l "accessibilityRole\|accessibilityLabel\|accessibilityHint\|touchTarget\|minHeight.*44" 2>/dev/null | wc -l || echo "0")
    
    if [[ $accessibility_evidence -gt 0 ]]; then
        echo -e "   ${GREEN}✅ Accessibility patterns found in $accessibility_evidence files${NC}"
    else
        echo -e "   ${RED}❌ VIOLATION: No accessibility patterns found${NC}"
        echo -e "   ${YELLOW}Required: accessibilityRole, touch targets ≥44dp${NC}"
        ((DESIGN_VIOLATIONS++))
    fi
    
    # Check for minimum touch target implementation
    if grep -r "minHeight.*44\|minHeight.*64\|touchTarget" "$app_dir/src" >/dev/null 2>&1; then
        echo -e "   ${GREEN}✅ Touch target sizing implemented${NC}"
    else
        echo -e "   ${RED}❌ VIOLATION: No touch target sizing found${NC}"
        ((DESIGN_VIOLATIONS++))
    fi
    
    echo ""
}

# Function to verify dark mode support
verify_dark_mode_support() {
    local build_dir="$1"
    local app_dir="$build_dir/app"
    
    echo "🌙 Verifying dark mode support..."
    
    # Check for dark mode tokens or theme switching
    if find "$app_dir/src" -name "*.ts" -o -name "*.tsx" | xargs grep -l "dark.*theme\|theme.*dark\|ColorScheme\|useColorScheme" 2>/dev/null | head -1 >/dev/null; then
        echo -e "   ${GREEN}✅ Dark mode support implemented${NC}"
    else
        echo -e "   ${YELLOW}⚠️ No dark mode support found (optional)${NC}"
    fi
    
    echo ""
}

# Function to generate design system report
generate_design_system_report() {
    local build_dir="$1"
    local report_file="$build_dir/design_system_compliance_report.json"
    
    echo "📊 Generating design system compliance report..."
    
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local compliance_status="compliant"
    if [[ $DESIGN_VIOLATIONS -gt 0 ]]; then
        compliance_status="non_compliant"
    fi
    
    cat > "$report_file" << EOF
{
  "design_system_compliance": {
    "timestamp": "$timestamp",
    "script": "scripts/verify_design_system_compliance.sh",
    "violations_found": $DESIGN_VIOLATIONS,
    "status": "$compliance_status"
  },
  "checks_performed": [
    "design_tokens_structure",
    "component_primitives",
    "token_usage_verification",
    "style_consistency",
    "accessibility_compliance",
    "dark_mode_support"
  ],
  "required_fixes": [
    {
      "condition": "violations > 0",
      "action": "Implement missing design system components"
    },
    {
      "condition": "missing tokens",
      "action": "Add required design token categories"
    },
    {
      "condition": "accessibility violations",
      "action": "Add accessibility properties and touch targets"
    }
  ]
}
EOF
    
    echo -e "   ${GREEN}✅ Compliance report: $report_file${NC}"
}

# Main execution
main() {
    local build_dir
    
    echo "🔍 Locating build directory for design system verification..."
    if build_dir=$(find_build_directory); then
        echo -e "   ${GREEN}✅ Build directory: $build_dir${NC}"
        echo ""
    else
        echo -e "   ${YELLOW}⚠️ No build directory found - skipping design system verification${NC}"
        echo -e "   ${BLUE}This is acceptable if no builds have been executed yet.${NC}"
        exit 0
    fi
    
    # Run all verification checks
    verify_design_tokens "$build_dir"
    verify_component_primitives "$build_dir"
    verify_token_usage "$build_dir"
    verify_style_consistency "$build_dir"
    verify_accessibility_compliance "$build_dir"
    verify_dark_mode_support "$build_dir"
    generate_design_system_report "$build_dir"
    
    echo ""
    
    # Final result
    if [[ $DESIGN_VIOLATIONS -eq 0 ]]; then
        echo -e "${GREEN}✅ DESIGN SYSTEM COMPLIANCE VERIFIED${NC}"
        echo "All design system requirements satisfied."
        exit 0
    else
        echo -e "${RED}❌ DESIGN SYSTEM COMPLIANCE FAILED${NC}"
        echo -e "${YELLOW}Found $DESIGN_VIOLATIONS design system violations.${NC}"
        echo ""
        echo -e "${BLUE}Required actions:${NC}"
        echo -e "${BLUE}1. Implement missing design tokens (colors, typography, spacing, borderRadius)${NC}"
        echo -e "${BLUE}2. Create essential component primitives (Button, Card)${NC}"
        echo -e "${BLUE}3. Ensure all components import and use design tokens${NC}"
        echo -e "${BLUE}4. Add accessibility properties (accessibilityRole, touch targets)${NC}"
        echo -e "${BLUE}5. Minimize inline styles in screens${NC}"
        exit 1
    fi
}

# Execute main function
main "$@"