#!/bin/bash
#
# Verify No Duplicate Stage Templates
# 
# This script ensures that only ONE stage template exists per stage number,
# and that ALL stage templates reside in the canonical templates/agents/ directory.
#
# Exit codes:
#   0 = No duplicates found, templates properly isolated
#   1 = Duplicate templates found or templates outside canonical directory
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
CANONICAL_TEMPLATE_DIR="$REPO_ROOT/templates/agents"

# Color output for readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Verifying stage template canonicalization..."
echo "Canonical directory: $CANONICAL_TEMPLATE_DIR"
echo ""

# Check if canonical directory exists
if [[ ! -d "$CANONICAL_TEMPLATE_DIR" ]]; then
    echo -e "${RED}❌ FATAL: Canonical template directory not found: $CANONICAL_TEMPLATE_DIR${NC}"
    exit 1
fi

# Track any violations
VIOLATIONS_FOUND=false

# Function to check for stage templates outside canonical directory
check_non_canonical_templates() {
    echo "📂 Checking for stage templates outside canonical directory..."
    
    # Look for ACTUAL stage templates (*.md files that look like execution templates)
    # Specifically target stage*template* patterns and stage*md files outside canonical location
    NON_CANONICAL=$(find "$REPO_ROOT" -type f \( \
        -name "stage[0-9]*template*" -o \
        -name "stage[0-9]*builder*" -o \
        -name "stage[0-9]*validation*" -o \
        -name "stage[0-9]*procedure*" \
    \) \
    -not -path "*/templates/agents/*" \
    -not -path "*/deprecated/*" \
    -not -path "*/.git/*" \
    -not -path "*/node_modules/*" \
    -not -path "*/.expo/*" \
    -not -path "*/__pycache__/*" \
    -not -path "*/builds/*" \
    -not -path "*/runs/*" 2>/dev/null || true)
    
    # Also check for stage template .md files outside templates/agents
    NON_CANONICAL_MD=$(find "$REPO_ROOT/templates" -type f -name "stage[0-9]*.md" \
    -not -path "*/templates/agents/*" \
    -not -path "*/deprecated/*" 2>/dev/null || true)
    
    ALL_NON_CANONICAL=$(echo -e "$NON_CANONICAL\n$NON_CANONICAL_MD" | grep -v '^$' || true)
    
    if [[ -n "$ALL_NON_CANONICAL" ]]; then
        echo -e "${RED}❌ VIOLATION: Stage templates found outside canonical directory:${NC}"
        echo "$ALL_NON_CANONICAL" | while read -r file; do
            if [[ -n "$file" ]]; then
                echo -e "  ${RED}• $file${NC}"
            fi
        done
        echo ""
        echo -e "${YELLOW}Action required: Move these files to templates/agents/ or deprecated/${NC}"
        VIOLATIONS_FOUND=true
    else
        echo -e "${GREEN}✅ No stage templates found outside canonical directory${NC}"
    fi
    echo ""
}

# Function to check for duplicate stage numbers within canonical directory
check_duplicate_stage_numbers() {
    echo "🔢 Checking for duplicate stage numbers in canonical directory..."
    
    # Extract stage numbers from filenames, excluding known valid variants
    STAGE_NUMBERS=$(find "$CANONICAL_TEMPLATE_DIR" -type f -name "*.md" | \
        sed -n 's|.*/\([0-9][0-9]*\(\.[0-9]*\)*\)_.*\.md|\1|p' | \
        sort)
    
    # Check for duplicates, but allow Stage 01 variants (market_research vs dream)
    DUPLICATES=$(echo "$STAGE_NUMBERS" | uniq -d | grep -v '^01$' || true)
    
    # Special handling for Stage 01 - ensure we have exactly the expected variants
    STAGE_01_COUNT=$(echo "$STAGE_NUMBERS" | grep '^01$' | wc -l)
    STAGE_01_FILES=$(find "$CANONICAL_TEMPLATE_DIR" -type f -name "01_*.md")
    
    if [[ "$STAGE_01_COUNT" -eq 2 ]]; then
        # Check that we have the expected Stage 01 variants
        if [[ -f "$CANONICAL_TEMPLATE_DIR/01_market_research.md" && -f "$CANONICAL_TEMPLATE_DIR/01_dream.md" ]]; then
            echo -e "${GREEN}✅ Stage 01 variants correctly configured (market_research + dream)${NC}"
        else
            echo -e "${RED}❌ VIOLATION: Stage 01 has wrong variants:${NC}"
            echo "$STAGE_01_FILES" | while read -r file; do
                echo -e "    ${RED}→ $file${NC}"
            done
            echo -e "${YELLOW}Expected: 01_market_research.md and 01_dream.md only${NC}"
            VIOLATIONS_FOUND=true
        fi
    elif [[ "$STAGE_01_COUNT" -gt 2 ]]; then
        echo -e "${RED}❌ VIOLATION: Too many Stage 01 templates found:${NC}"
        echo "$STAGE_01_FILES" | while read -r file; do
            echo -e "    ${RED}→ $file${NC}"
        done
        echo -e "${YELLOW}Expected: 01_market_research.md and 01_dream.md only${NC}"
        VIOLATIONS_FOUND=true
    fi
    
    # Check other duplicates
    if [[ -n "$DUPLICATES" ]]; then
        echo -e "${RED}❌ VIOLATION: Duplicate stage numbers found:${NC}"
        echo "$DUPLICATES" | while read -r stage_num; do
            echo -e "  ${RED}• Stage $stage_num appears multiple times:${NC}"
            find "$CANONICAL_TEMPLATE_DIR" -type f -name "${stage_num}_*.md" | while read -r file; do
                echo -e "    ${RED}→ $file${NC}"
            done
        done
        echo ""
        echo -e "${YELLOW}Action required: Consolidate duplicate stage templates${NC}"
        VIOLATIONS_FOUND=true
    else
        echo -e "${GREEN}✅ No improper duplicate stage numbers found${NC}"
    fi
    echo ""
}

# Function to list canonical stage templates for verification
list_canonical_templates() {
    echo "📋 Canonical stage templates found:"
    find "$CANONICAL_TEMPLATE_DIR" -type f -name "*.md" | sort | while read -r template; do
        basename=$(basename "$template")
        stage_num=$(echo "$basename" | sed -n 's/^\([0-9][0-9]*\(\.[0-9]*\)*\)_.*/\1/p')
        if [[ -n "$stage_num" ]]; then
            echo -e "  ${GREEN}• Stage $stage_num: $basename${NC}"
        else
            echo -e "  ${YELLOW}• Unknown format: $basename${NC}"
        fi
    done
    echo ""
}

# Function to verify expected stage templates exist
verify_expected_stages() {
    echo "🎯 Verifying expected stage templates exist..."
    
    EXPECTED_STAGES=(
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
    
    MISSING_TEMPLATES=()
    
    for template in "${EXPECTED_STAGES[@]}"; do
        if [[ -f "$CANONICAL_TEMPLATE_DIR/$template" ]]; then
            echo -e "  ${GREEN}✅ $template${NC}"
        else
            echo -e "  ${RED}❌ MISSING: $template${NC}"
            MISSING_TEMPLATES+=("$template")
            VIOLATIONS_FOUND=true
        fi
    done
    
    if [[ ${#MISSING_TEMPLATES[@]} -gt 0 ]]; then
        echo ""
        echo -e "${RED}Missing ${#MISSING_TEMPLATES[@]} expected stage templates${NC}"
    fi
    echo ""
}

# Run all checks
check_non_canonical_templates
check_duplicate_stage_numbers  
list_canonical_templates
verify_expected_stages

# Final result
if [[ "$VIOLATIONS_FOUND" == "true" ]]; then
    echo -e "${RED}❌ TEMPLATE CANONICALIZATION FAILED${NC}"
    echo -e "${YELLOW}Fix violations above before proceeding with pipeline execution.${NC}"
    exit 1
else
    echo -e "${GREEN}✅ TEMPLATE CANONICALIZATION VERIFIED${NC}"
    echo "All stage templates properly isolated in templates/agents/ directory."
    exit 0
fi