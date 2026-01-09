#!/bin/bash
#
# Audit Unused Files
# 
# This script identifies scripts, templates, and docs that are not referenced
# by the pipeline, documentation, or active usage patterns.
#
# Exit codes:
#   0 = Audit complete (may have found unused files)
#   1 = Audit failed
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

echo "📋 Unused Files Audit"
echo "====================="
echo ""

# Function to check if a file is referenced
is_file_referenced() {
    local file_to_check="$1"
    local base_name=$(basename "$file_to_check")
    local name_without_ext="${base_name%.*}"
    
    # Search for references in active directories (excluding generated content)
    local references=$(grep -r "$base_name\|$name_without_ext" \
        "$REPO_ROOT"/{scripts,templates,docs,runbooks,standards,CLAUDE.md,README.md} \
        --exclude-dir=deprecated \
        --exclude="$file_to_check" \
        2>/dev/null | wc -l || echo "0")
    
    echo "$references"
}

# Function to audit script files
audit_scripts() {
    echo "🔧 Auditing script files..."
    
    local unused_scripts=()
    local total_scripts=0
    
    for script in "$REPO_ROOT/scripts"/*.{sh,js,mjs,py}; do
        if [[ -f "$script" ]]; then
            ((total_scripts++))
            local script_name=$(basename "$script")
            local references=$(is_file_referenced "$script")
            
            if [[ $references -eq 0 ]]; then
                unused_scripts+=("$script_name")
                echo -e "   ${YELLOW}⚠️ $script_name (0 references)${NC}"
            else
                echo -e "   ${GREEN}✅ $script_name ($references references)${NC}"
            fi
        fi
    done
    
    echo ""
    echo -e "${BLUE}Scripts audit: ${#unused_scripts[@]}/$total_scripts potentially unused${NC}"
    
    if [[ ${#unused_scripts[@]} -gt 0 ]]; then
        echo -e "${YELLOW}Potentially unused scripts:${NC}"
        for script in "${unused_scripts[@]}"; do
            echo -e "   • $script"
        done
    fi
    
    echo ""
}

# Function to audit template files
audit_templates() {
    echo "📄 Auditing template files..."
    
    local unused_templates=()
    local total_templates=0
    
    # Check main templates directory
    for template in "$REPO_ROOT/templates"/**/*.md; do
        if [[ -f "$template" && "$template" != *"/deprecated/"* ]]; then
            ((total_templates++))
            local template_name=$(basename "$template")
            local references=$(is_file_referenced "$template")
            
            if [[ $references -eq 0 ]]; then
                unused_templates+=("$template_name")
                echo -e "   ${YELLOW}⚠️ $template_name (0 references)${NC}"
            else
                echo -e "   ${GREEN}✅ $template_name ($references references)${NC}"
            fi
        fi
    done
    
    echo ""
    echo -e "${BLUE}Templates audit: ${#unused_templates[@]}/$total_templates potentially unused${NC}"
    
    if [[ ${#unused_templates[@]} -gt 0 ]]; then
        echo -e "${YELLOW}Potentially unused templates:${NC}"
        for template in "${unused_templates[@]}"; do
            echo -e "   • $template"
        done
    fi
    
    echo ""
}

# Function to audit documentation files
audit_docs() {
    echo "📚 Auditing documentation files..."
    
    local unused_docs=()
    local total_docs=0
    
    for doc in "$REPO_ROOT/docs"/*.md "$REPO_ROOT/runbooks"/*.md "$REPO_ROOT/standards"/*.md; do
        if [[ -f "$doc" ]]; then
            ((total_docs++))
            local doc_name=$(basename "$doc")
            local references=$(is_file_referenced "$doc")
            
            # Special handling for primary docs that may not be directly referenced
            if [[ "$doc_name" == "README.md" || "$doc_name" == "CLAUDE.md" ]]; then
                echo -e "   ${GREEN}✅ $doc_name (primary documentation)${NC}"
            elif [[ $references -eq 0 ]]; then
                unused_docs+=("$doc_name")
                echo -e "   ${YELLOW}⚠️ $doc_name (0 references)${NC}"
            else
                echo -e "   ${GREEN}✅ $doc_name ($references references)${NC}"
            fi
        fi
    done
    
    echo ""
    echo -e "${BLUE}Documentation audit: ${#unused_docs[@]}/$total_docs potentially unused${NC}"
    
    if [[ ${#unused_docs[@]} -gt 0 ]]; then
        echo -e "${YELLOW}Potentially unused documentation:${NC}"
        for doc in "${unused_docs[@]}"; do
            echo -e "   • $doc"
        done
    fi
    
    echo ""
}

# Function to audit deprecated files
audit_deprecated() {
    echo "🗑️  Auditing deprecated files isolation..."
    
    local deprecated_refs=0
    
    # Check if any active files reference deprecated content
    for deprecated_file in "$REPO_ROOT/deprecated"/*; do
        if [[ -f "$deprecated_file" ]]; then
            local deprecated_name=$(basename "$deprecated_file")
            local active_refs=$(grep -r "$deprecated_name" \
                "$REPO_ROOT"/{scripts,templates/agents,runbooks,standards,CLAUDE.md} \
                2>/dev/null | wc -l || echo "0")
            
            if [[ $active_refs -gt 0 ]]; then
                echo -e "   ${RED}❌ $deprecated_name still referenced in active code${NC}"
                ((deprecated_refs++))
            else
                echo -e "   ${GREEN}✅ $deprecated_name properly isolated${NC}"
            fi
        fi
    done
    
    if [[ $deprecated_refs -eq 0 ]]; then
        echo -e "   ${GREEN}✅ All deprecated files properly isolated${NC}"
    else
        echo -e "   ${RED}❌ $deprecated_refs deprecated files still referenced${NC}"
    fi
    
    echo ""
}

# Function to suggest cleanup actions
suggest_cleanup() {
    echo "🧹 Cleanup Suggestions"
    echo "======================"
    echo ""
    
    echo -e "${BLUE}Safe cleanup candidates:${NC}"
    echo "• Documentation files with 0 references (verify manually)"
    echo "• Script files with 0 references (check git history first)"
    echo "• Template files with 0 references (ensure not used by Claude directly)"
    echo ""
    
    echo -e "${YELLOW}Before removing any files:${NC}"
    echo "1. Check git history: git log --follow <file>"
    echo "2. Search full codebase: grep -r <filename> ."
    echo "3. Verify not used by CLI tools or external systems"
    echo "4. Move to deprecated/ instead of deleting"
    echo ""
    
    echo -e "${BLUE}Files to never remove:${NC}"
    echo "• CLAUDE.md (pipeline constitution)"
    echo "• README.md (repository documentation)"
    echo "• Active verification scripts (verify_*.sh)"
    echo "• Stage templates in templates/agents/"
    echo ""
}

# Main execution
main() {
    echo "Starting comprehensive unused files audit..."
    echo ""
    
    audit_scripts
    audit_templates  
    audit_docs
    audit_deprecated
    suggest_cleanup
    
    echo -e "${GREEN}✅ UNUSED FILES AUDIT COMPLETE${NC}"
    echo ""
    echo -e "${BLUE}Review suggestions above before making any changes.${NC}"
    echo -e "${BLUE}When in doubt, move files to deprecated/ instead of deleting.${NC}"
}

# Execute main function
main "$@"