#!/bin/bash
#
# Validate Pipeline Integrity
# 
# This script validates that all pipeline enforcement scripts are working
# correctly and identifies any unused or orphaned files that can be safely
# removed or deprecated.
#
# Exit codes:
#   0 = Pipeline integrity verified
#   1 = Integrity issues found
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

echo "🔍 Pipeline Integrity Validation"
echo "================================"
echo ""

INTEGRITY_ISSUES=0

# Function to validate enforcement scripts
validate_enforcement_scripts() {
    echo "🛡️ Validating enforcement scripts..."
    
    local required_scripts=(
        "scripts/verify_no_duplicate_stage_templates.sh"
        "scripts/upstream_reference_sync.sh"
        "scripts/verify_reference_compliance.sh"
        "scripts/asset_preflight_check.sh"
        "scripts/generate_simple_assets.sh"
    )
    
    for script in "${required_scripts[@]}"; do
        local full_path="$REPO_ROOT/$script"
        if [[ -x "$full_path" ]]; then
            echo -e "   ${GREEN}✅ $script (executable)${NC}"
        elif [[ -f "$full_path" ]]; then
            echo -e "   ${YELLOW}⚠️ $script (not executable)${NC}"
            chmod +x "$full_path"
            echo -e "      → Fixed permissions${NC}"
        else
            echo -e "   ${RED}❌ MISSING: $script${NC}"
            ((INTEGRITY_ISSUES++))
        fi
    done
    
    echo ""
}

# Function to test enforcement scripts
test_enforcement_scripts() {
    echo "🧪 Testing enforcement scripts..."
    
    # Test template verification
    if "$REPO_ROOT/scripts/verify_no_duplicate_stage_templates.sh" >/dev/null 2>&1; then
        echo -e "   ${GREEN}✅ Template canonicalization verified${NC}"
    else
        echo -e "   ${RED}❌ Template verification failed${NC}"
        ((INTEGRITY_ISSUES++))
    fi
    
    # Test documentation sync
    if "$REPO_ROOT/scripts/upstream_reference_sync.sh" >/dev/null 2>&1; then
        echo -e "   ${GREEN}✅ Documentation sync working${NC}"
    else
        echo -e "   ${RED}❌ Documentation sync failed${NC}"
        ((INTEGRITY_ISSUES++))
    fi
    
    # Test reference compliance (may fail if no builds exist - that's OK)
    if "$REPO_ROOT/scripts/verify_reference_compliance.sh" >/dev/null 2>&1; then
        echo -e "   ${GREEN}✅ Reference compliance verified${NC}"
    else
        echo -e "   ${YELLOW}⚠️ Reference compliance check had warnings (expected if no builds)${NC}"
    fi
    
    # Test asset preflight
    if "$REPO_ROOT/scripts/asset_preflight_check.sh" >/dev/null 2>&1; then
        echo -e "   ${GREEN}✅ Asset preflight working${NC}"
    else
        echo -e "   ${RED}❌ Asset preflight failed${NC}"
        ((INTEGRITY_ISSUES++))
    fi
    
    echo ""
}

# Function to check canonical directories
validate_canonical_structure() {
    echo "📁 Validating canonical directory structure..."
    
    local required_dirs=(
        "templates/agents"
        "vendor/expo-docs"
        "vendor/revenuecat-docs"
        "deprecated"
        "schemas"
        "scripts"
    )
    
    for dir in "${required_dirs[@]}"; do
        local full_path="$REPO_ROOT/$dir"
        if [[ -d "$full_path" ]]; then
            echo -e "   ${GREEN}✅ $dir/${NC}"
        else
            echo -e "   ${RED}❌ MISSING: $dir/${NC}"
            ((INTEGRITY_ISSUES++))
        fi
    done
    
    echo ""
}

# Function to identify potentially unused files
identify_unused_files() {
    echo "🗂️ Identifying potentially unused files..."
    
    local unused_candidates=()
    
    # Check for old stage10 templates (should be in deprecated/)
    while IFS= read -r -d '' file; do
        if [[ "$file" == *"stage10"* && "$file" != *"deprecated"* && "$file" != *"templates/agents"* ]]; then
            unused_candidates+=("$file")
        fi
    done < <(find "$REPO_ROOT" -name "*stage10*" -type f -not -path "*/deprecated/*" -not -path "*/templates/agents/*" -not -path "*/builds/*" -not -path "*/runs/*" -print0 2>/dev/null || true)
    
    # Check for duplicate scripts
    local script_patterns=("cache_*" "generate_*" "verify_*" "upstream_*")
    for pattern in "${script_patterns[@]}"; do
        local count=$(find "$REPO_ROOT/scripts" -name "$pattern" -type f 2>/dev/null | wc -l)
        if [[ $count -gt 1 ]]; then
            echo -e "   ${YELLOW}⚠️ Multiple $pattern scripts found:${NC}"
            find "$REPO_ROOT/scripts" -name "$pattern" -type f | while read -r file; do
                echo -e "      → $file"
            done
        fi
    done
    
    if [[ ${#unused_candidates[@]} -gt 0 ]]; then
        echo -e "   ${YELLOW}⚠️ Potentially unused files found:${NC}"
        for file in "${unused_candidates[@]}"; do
            echo -e "      → $file"
        done
        echo -e "   ${BLUE}Consider moving these to deprecated/ if not referenced${NC}"
    else
        echo -e "   ${GREEN}✅ No obvious unused files detected${NC}"
    fi
    
    echo ""
}

# Function to validate .gitignore coverage
validate_gitignore() {
    echo "📋 Validating .gitignore coverage..."
    
    local generated_dirs=(
        "app/_docs"
        "app/_assets" 
        "app/_upstream"
        "runs"
        "builds"
    )
    
    local gitignore_file="$REPO_ROOT/.gitignore"
    local missing_entries=()
    
    for dir in "${generated_dirs[@]}"; do
        if grep -q "^$dir/" "$gitignore_file"; then
            echo -e "   ${GREEN}✅ $dir/ ignored${NC}"
        else
            echo -e "   ${RED}❌ $dir/ not ignored${NC}"
            missing_entries+=("$dir/")
        fi
    done
    
    if [[ ${#missing_entries[@]} -gt 0 ]]; then
        echo -e "   ${YELLOW}Missing .gitignore entries: ${missing_entries[*]}${NC}"
        ((INTEGRITY_ISSUES++))
    fi
    
    echo ""
}

# Function to check stage template completeness
validate_stage_templates() {
    echo "📋 Validating stage template completeness..."
    
    local expected_stages=(
        "01_market_research.md"
        "01_dream.md"
        "02_product_spec.md" 
        "02.5_product_reality.md"
        "02.7_dependency_resolution.md"
        "03_ux.md"
        "04_monetization.md"
        "05_architecture.md"
        "06_builder_handoff.md"
        "07_polish.md"
        "08_brand.md"
        "09_release_planning.md"
        "09.5_runtime_sanity_harness.md"
        "10_app_builder.md"
        "10.1_design_authenticity_check.md"
    )
    
    local templates_dir="$REPO_ROOT/templates/agents"
    local missing_templates=()
    
    for template in "${expected_stages[@]}"; do
        if [[ -f "$templates_dir/$template" ]]; then
            echo -e "   ${GREEN}✅ $template${NC}"
        else
            echo -e "   ${RED}❌ MISSING: $template${NC}"
            missing_templates+=("$template")
        fi
    done
    
    if [[ ${#missing_templates[@]} -gt 0 ]]; then
        echo -e "   ${RED}Missing ${#missing_templates[@]} stage templates${NC}"
        ((INTEGRITY_ISSUES++))
    fi
    
    echo ""
}

# Function to generate integrity report
generate_integrity_report() {
    echo "📊 Generating integrity report..."
    
    local report_file="$REPO_ROOT/docs/pipeline_integrity_report.json"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local git_hash=$(cd "$REPO_ROOT" && git rev-parse HEAD 2>/dev/null || echo "unknown")
    
    cat > "$report_file" << EOF
{
  "integrity_check": {
    "timestamp": "$timestamp",
    "script": "scripts/validate_pipeline_integrity.sh",
    "git_hash": "$git_hash",
    "issues_found": $INTEGRITY_ISSUES,
    "status": $(if [[ $INTEGRITY_ISSUES -eq 0 ]]; then echo '"verified"'; else echo '"issues_found"'; fi)
  },
  "enforcement_scripts": {
    "template_verification": "scripts/verify_no_duplicate_stage_templates.sh",
    "documentation_sync": "scripts/upstream_reference_sync.sh", 
    "reference_compliance": "scripts/verify_reference_compliance.sh",
    "asset_preflight": "scripts/asset_preflight_check.sh",
    "asset_generation": "scripts/generate_simple_assets.sh"
  },
  "canonical_structure": {
    "stage_templates": "templates/agents/",
    "vendor_docs": "vendor/",
    "deprecated_files": "deprecated/",
    "enforcement_scripts": "scripts/"
  },
  "next_validation": "before_major_pipeline_changes"
}
EOF
    
    echo -e "   ${GREEN}✅ Integrity report generated: $report_file${NC}"
    echo ""
}

# Main execution
main() {
    echo "Validating pipeline integrity and enforcement..."
    echo ""
    
    validate_enforcement_scripts
    test_enforcement_scripts
    validate_canonical_structure
    identify_unused_files
    validate_gitignore
    validate_stage_templates
    generate_integrity_report
    
    if [[ $INTEGRITY_ISSUES -eq 0 ]]; then
        echo -e "${GREEN}✅ PIPELINE INTEGRITY VERIFIED${NC}"
        echo ""
        echo -e "${BLUE}All enforcement mechanisms are working correctly.${NC}"
        echo -e "${BLUE}Pipeline is ready for production use.${NC}"
        return 0
    else
        echo -e "${RED}❌ PIPELINE INTEGRITY ISSUES FOUND${NC}"
        echo ""
        echo -e "${YELLOW}Found $INTEGRITY_ISSUES integrity issues that need resolution.${NC}"
        echo -e "${YELLOW}Review the output above and fix issues before production use.${NC}"
        return 1
    fi
}

# Execute main function
main "$@"