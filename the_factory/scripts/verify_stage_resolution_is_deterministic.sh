#!/bin/bash
#
# Verify Stage Resolution is Deterministic
# 
# This script ensures that stage template resolution is deterministic and predictable:
# - All stage templates exist at expected canonical paths
# - Stage resolution produces consistent results
# - No ambiguous template naming that could cause resolution failures
#
# Exit codes:
#   0 = Stage resolution is deterministic
#   1 = Stage resolution is non-deterministic or templates missing
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
CANONICAL_TEMPLATE_DIR="$REPO_ROOT/templates/agents"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🎯 Verifying stage resolution determinism..."
echo "Canonical directory: $CANONICAL_TEMPLATE_DIR"
echo ""

# Track any resolution issues
RESOLUTION_ISSUES=0

# Function to resolve stage template path (simulates Claude's resolution logic)
resolve_stage_template() {
    local stage_identifier="$1"
    
    # Stage resolution logic based on CLAUDE.md patterns:
    case "$stage_identifier" in
        "01"|"stage01"|"market_research"|"01_market")
            echo "$CANONICAL_TEMPLATE_DIR/01_market_research.md"
            ;;
        "01_dream"|"dream"|"stage01_dream")
            echo "$CANONICAL_TEMPLATE_DIR/01_dream.md"
            ;;
        "02"|"stage02"|"product_spec"|"02_product")
            echo "$CANONICAL_TEMPLATE_DIR/02_product_spec.md"
            ;;
        "02.5"|"stage02.5"|"product_reality"|"02.5_product")
            echo "$CANONICAL_TEMPLATE_DIR/02.5_product_reality.md"
            ;;
        "02.7"|"stage02.7"|"dependency_resolution"|"02.7_dependency")
            echo "$CANONICAL_TEMPLATE_DIR/02.7_dependency_resolution.md"
            ;;
        "03"|"stage03"|"ux"|"03_ux")
            echo "$CANONICAL_TEMPLATE_DIR/03_ux.md"
            ;;
        "04"|"stage04"|"monetization"|"04_monetization")
            echo "$CANONICAL_TEMPLATE_DIR/04_monetization.md"
            ;;
        "05"|"stage05"|"architecture"|"05_architecture")
            echo "$CANONICAL_TEMPLATE_DIR/05_architecture.md"
            ;;
        "06"|"stage06"|"builder_handoff"|"06_builder")
            echo "$CANONICAL_TEMPLATE_DIR/06_builder_handoff.md"
            ;;
        "07"|"stage07"|"polish"|"07_polish")
            echo "$CANONICAL_TEMPLATE_DIR/07_polish.md"
            ;;
        "08"|"stage08"|"brand"|"08_brand")
            echo "$CANONICAL_TEMPLATE_DIR/08_brand.md"
            ;;
        "09"|"stage09"|"release_planning"|"09_release")
            echo "$CANONICAL_TEMPLATE_DIR/09_release_planning.md"
            ;;
        "09.5"|"stage09.5"|"runtime_sanity"|"09.5_runtime")
            echo "$CANONICAL_TEMPLATE_DIR/09.5_runtime_sanity_harness.md"
            ;;
        "09.7"|"stage09.7"|"build_contract"|"contract_synthesis"|"09.7_build_contract")
            echo "$CANONICAL_TEMPLATE_DIR/09.7_build_contract_synthesis.md"
            ;;
        "10"|"stage10"|"app_builder"|"10_app"|"mobile_app")
            echo "$CANONICAL_TEMPLATE_DIR/10_app_builder.md"
            ;;
        "10.1"|"stage10.1"|"design_authenticity"|"10.1_design")
            echo "$CANONICAL_TEMPLATE_DIR/10.1_design_authenticity_check.md"
            ;;
        *)
            echo "UNRESOLVED:$stage_identifier"
            ;;
    esac
}

# Function to test stage resolution
test_stage_resolution() {
    echo "🔍 Testing stage template resolution..."
    
    # Test cases covering various resolution patterns
    local -a test_cases=(
        "01:01_market_research.md"
        "stage01:01_market_research.md"
        "market_research:01_market_research.md"
        "01_dream:01_dream.md"
        "dream:01_dream.md"
        "02:02_product_spec.md"
        "02.5:02.5_product_reality.md"
        "02.7:02.7_dependency_resolution.md"
        "03:03_ux.md"
        "04:04_monetization.md"
        "05:05_architecture.md"
        "06:06_builder_handoff.md"
        "07:07_polish.md"
        "08:08_brand.md"
        "09:09_release_planning.md"
        "09.5:09.5_runtime_sanity_harness.md"
        "10:10_app_builder.md"
        "stage10:10_app_builder.md"
        "app_builder:10_app_builder.md"
        "mobile_app:10_app_builder.md"
        "10.1:10.1_design_authenticity_check.md"
    )
    
    local test_passed=0
    local test_total=0
    
    for test_case in "${test_cases[@]}"; do
        IFS=':' read -r input expected <<< "$test_case"
        ((test_total++))
        
        resolved_path=$(resolve_stage_template "$input")
        expected_path="$CANONICAL_TEMPLATE_DIR/$expected"
        
        if [[ "$resolved_path" == "$expected_path" ]]; then
            if [[ -f "$resolved_path" ]]; then
                echo -e "  ${GREEN}✅ $input → $(basename "$resolved_path")${NC}"
                ((test_passed++))
            else
                echo -e "  ${RED}❌ $input → $(basename "$resolved_path") (FILE MISSING)${NC}"
                ((RESOLUTION_ISSUES++))
            fi
        else
            echo -e "  ${RED}❌ $input → WRONG PATH${NC}"
            echo -e "     Expected: $expected_path"
            echo -e "     Got:      $resolved_path"
            ((RESOLUTION_ISSUES++))
        fi
    done
    
    echo ""
    echo -e "${BLUE}Resolution test results: $test_passed/$test_total passed${NC}"
    echo ""
}

# Function to test for ambiguous stage identifiers
test_ambiguous_identifiers() {
    echo "🔀 Testing for ambiguous stage identifiers..."
    
    # Test cases that should NOT resolve (ambiguous or invalid)
    local -a ambiguous_cases=(
        "stage"
        "template"
        "build" 
        "validation"
        "spec"
        "1"
        "2"
        "stage1"
        "stage2"
    )
    
    local ambiguous_found=false
    
    for identifier in "${ambiguous_cases[@]}"; do
        resolved=$(resolve_stage_template "$identifier")
        if [[ "$resolved" != "UNRESOLVED:$identifier" ]]; then
            echo -e "  ${RED}❌ AMBIGUOUS: '$identifier' resolves to $(basename "$resolved")${NC}"
            ambiguous_found=true
            ((RESOLUTION_ISSUES++))
        else
            echo -e "  ${GREEN}✅ '$identifier' correctly unresolved${NC}"
        fi
    done
    
    if [[ "$ambiguous_found" == "false" ]]; then
        echo -e "${GREEN}✅ No ambiguous stage identifiers found${NC}"
    fi
    echo ""
}

# Function to verify all expected templates are reachable
verify_template_reachability() {
    echo "🎯 Verifying all templates are reachable via resolution..."
    
    # All canonical templates should be reachable via at least one identifier
    local reachable_templates=()
    
    # Test primary identifiers for each stage
    local -a primary_identifiers=(
        "01" "01_dream" "02" "02.5" "02.7" "03" "04" "05" 
        "06" "07" "08" "09" "09.5" "09.7" "10" "10.1"
    )
    
    for identifier in "${primary_identifiers[@]}"; do
        resolved_path=$(resolve_stage_template "$identifier")
        if [[ -f "$resolved_path" ]]; then
            local template_name=$(basename "$resolved_path")
            local already_found=false
            if [[ ${#reachable_templates[@]} -gt 0 ]]; then
                for existing in "${reachable_templates[@]}"; do
                    if [[ "$existing" == "$template_name" ]]; then
                        already_found=true
                        break
                    fi
                done
            fi
            if [[ "$already_found" == "false" ]]; then
                reachable_templates+=("$template_name")
            fi
        fi
    done
    
    # Check if all canonical templates are reachable
    local all_templates=($(find "$CANONICAL_TEMPLATE_DIR" -name "*.md" -exec basename {} \; | sort))
    local unreachable_count=0
    
    for template in "${all_templates[@]}"; do
        local is_reachable=false
        if [[ ${#reachable_templates[@]} -gt 0 ]]; then
            for reachable in "${reachable_templates[@]}"; do
                if [[ "$template" == "$reachable" ]]; then
                    is_reachable=true
                    break
                fi
            done
        fi
        
        if [[ "$is_reachable" == "true" ]]; then
            echo -e "  ${GREEN}✅ $template (reachable)${NC}"
        else
            echo -e "  ${RED}❌ $template (UNREACHABLE)${NC}"
            ((unreachable_count++))
            ((RESOLUTION_ISSUES++))
        fi
    done
    
    echo ""
    echo -e "${BLUE}Reachability: ${#reachable_templates[@]}/${#all_templates[@]} templates reachable${NC}"
    
    if [[ $unreachable_count -gt 0 ]]; then
        echo -e "${YELLOW}Warning: $unreachable_count templates cannot be resolved via standard identifiers${NC}"
    fi
    echo ""
}

# Function to test resolution consistency (multiple calls return same result)
test_resolution_consistency() {
    echo "🔄 Testing resolution consistency..."
    
    local -a consistency_tests=("01" "10" "02.5" "09.5")
    local consistency_passed=true
    
    for identifier in "${consistency_tests[@]}"; do
        local first_resolution=$(resolve_stage_template "$identifier")
        local second_resolution=$(resolve_stage_template "$identifier") 
        local third_resolution=$(resolve_stage_template "$identifier")
        
        if [[ "$first_resolution" == "$second_resolution" && "$second_resolution" == "$third_resolution" ]]; then
            echo -e "  ${GREEN}✅ $identifier resolution consistent${NC}"
        else
            echo -e "  ${RED}❌ $identifier resolution INCONSISTENT${NC}"
            echo -e "     First:  $first_resolution"
            echo -e "     Second: $second_resolution" 
            echo -e "     Third:  $third_resolution"
            consistency_passed=false
            ((RESOLUTION_ISSUES++))
        fi
    done
    
    if [[ "$consistency_passed" == "true" ]]; then
        echo -e "${GREEN}✅ All tested identifiers resolve consistently${NC}"
    fi
    echo ""
}

# Run all checks
test_stage_resolution
test_ambiguous_identifiers
verify_template_reachability  
test_resolution_consistency

# Generate resolution map for documentation
generate_resolution_map() {
    echo "📋 Stage Resolution Map:"
    echo "========================"
    echo "| Stage | Primary ID | Template File |"
    echo "|-------|------------|---------------|"
    local -a map_stages=("01" "01_dream" "02" "02.5" "02.7" "03" "04" "05" "06" "07" "08" "09" "09.5" "09.7" "10" "10.1")
    for stage in "${map_stages[@]}"; do
        local resolved=$(resolve_stage_template "$stage")
        local template_name=$(basename "$resolved" 2>/dev/null || echo "MISSING")
        printf "| %-5s | %-10s | %-25s |\n" "$stage" "$stage" "$template_name"
    done
    echo ""
}

generate_resolution_map

# Final result
if [[ $RESOLUTION_ISSUES -eq 0 ]]; then
    echo -e "${GREEN}✅ STAGE RESOLUTION IS DETERMINISTIC${NC}"
    echo "All stage identifiers resolve predictably to canonical templates."
    exit 0
else
    echo -e "${RED}❌ STAGE RESOLUTION IS NON-DETERMINISTIC${NC}"
    echo -e "${YELLOW}Found $RESOLUTION_ISSUES resolution issues. Fix before pipeline execution.${NC}"
    exit 1
fi