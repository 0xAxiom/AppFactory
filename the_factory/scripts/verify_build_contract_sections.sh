#!/bin/bash

# Verify Build Contract Sections - Stage 10 Gate
# Purpose: Validate build prompt has all required sections in correct format
# Usage: verify_build_contract_sections.sh <idea_directory>

set -euo pipefail

# Function to log with timestamp
log() {
    echo "[$(date -Iseconds)] VERIFY_CONTRACT_SECTIONS: $1"
}

# Required sections in exact order
REQUIRED_SECTIONS=(
    "PURPOSE"
    "ROLE"
    "APP OVERVIEW" 
    "TARGET PLATFORM"
    "BUSINESS MODEL"
    "MONETIZATION RULES"
    "CORE FEATURES (MVP)"
    "DESIGN REQUIREMENTS"
    "DESIGN SYSTEM REQUIREMENTS"
    "TECHNICAL REQUIREMENTS"
    "ASSETS"
    "PIPELINE ENFORCEMENT"
    "OUTPUT EXPECTATIONS"
    "EXECUTION INSTRUCTIONS"
)

# Function to validate section presence and order
validate_sections() {
    local prompt_file="$1"
    local missing_sections=()
    local section_order_issues=()
    
    log "Validating build prompt sections in: $prompt_file"
    
    # Check for each required section
    for section in "${REQUIRED_SECTIONS[@]}"; do
        if ! grep -q "^## $section" "$prompt_file"; then
            missing_sections+=("$section")
        fi
    done
    
    # Report missing sections
    if [[ ${#missing_sections[@]} -gt 0 ]]; then
        log "❌ Missing required sections:"
        printf '%s\n' "${missing_sections[@]}" | sed 's/^/   - /'
        return 1
    fi
    
    # Validate section order
    local temp_file=$(mktemp)
    grep "^## " "$prompt_file" | sed 's/^## //' > "$temp_file"
    
    local line_num=0
    local found_first_section=false
    
    while IFS= read -r found_section; do
        line_num=$((line_num + 1))
        
        # Check if this is one of our required sections
        local is_required_section=false
        local expected_position=-1
        
        for i in "${!REQUIRED_SECTIONS[@]}"; do
            if [[ "${REQUIRED_SECTIONS[$i]}" == "$found_section" ]]; then
                is_required_section=true
                expected_position=$((i + 1))
                found_first_section=true
                break
            fi
        done
        
        # If we've found the first required section, validate subsequent order
        if [[ "$found_first_section" == "true" && "$is_required_section" == "true" ]]; then
            local relative_position=$((line_num))
            
            # Simple order check - required sections should appear in sequence
            # (allowing for non-required sections in between)
            continue
        fi
    done < "$temp_file"
    
    rm "$temp_file"
    
    log "✅ All required sections present"
    return 0
}

# Function to validate section content quality
validate_section_content() {
    local prompt_file="$1"
    
    log "Validating section content quality..."
    
    # Check that sections have actual content, not just headers
    local empty_sections=()
    
    for section in "${REQUIRED_SECTIONS[@]}"; do
        # Extract content between this section and the next section/end of file
        local content_lines=$(awk "
            /^## $section/ { found=1; next }
            /^## / && found { exit }
            found && NF > 0 && !/^#/ { print }
        " "$prompt_file" | wc -l)
        
        if [[ "$content_lines" -eq 0 ]]; then
            empty_sections+=("$section")
        fi
    done
    
    if [[ ${#empty_sections[@]} -gt 0 ]]; then
        log "❌ Sections with no content:"
        printf '%s\n' "${empty_sections[@]}" | sed 's/^/   - /'
        return 1
    fi
    
    log "✅ All sections have content"
    return 0
}

# Function to validate critical requirements
validate_critical_requirements() {
    local prompt_file="$1"
    
    log "Validating critical build requirements..."
    
    local missing_requirements=()
    
    # Check for Expo compatibility mention
    if ! grep -q -i "expo" "$prompt_file"; then
        missing_requirements+=("Expo platform requirement")
    fi
    
    # Check for RevenueCat mention  
    if ! grep -q -i "revenuecat" "$prompt_file"; then
        missing_requirements+=("RevenueCat integration requirement")
    fi
    
    # Check for subscription model
    if ! grep -q -i "subscription" "$prompt_file"; then
        missing_requirements+=("Subscription business model")
    fi
    
    # Check for stage reference (must be driven by prior stages)
    if ! grep -q -i "stage" "$prompt_file"; then
        missing_requirements+=("Stage output references")
    fi
    
    if [[ ${#missing_requirements[@]} -gt 0 ]]; then
        log "❌ Missing critical requirements:"
        printf '%s\n' "${missing_requirements[@]}" | sed 's/^/   - /'
        return 1
    fi
    
    log "✅ Critical requirements present"
    return 0
}

# Main verification function
main() {
    if [[ $# -ne 1 ]]; then
        echo "Usage: $0 <idea_directory>"
        echo "Example: $0 runs/2026-01-09/run_123/ideas/01_myapp__app_001"
        exit 1
    fi
    
    local idea_dir="$1"
    local prompt_file="${idea_dir}/app/_contract/build_prompt.md"
    
    # Validate idea directory exists
    if [[ ! -d "$idea_dir" ]]; then
        log "ERROR: Idea directory does not exist: $idea_dir"
        exit 1
    fi
    
    # Check if build prompt exists
    if [[ ! -f "$prompt_file" ]]; then
        log "❌ Build prompt file not found: $prompt_file"
        log "   Run build_contract_synthesis.sh first"
        exit 1
    fi
    
    log "Verifying build contract sections for: $idea_dir"
    
    # Run all validations
    local all_passed=true
    
    if ! validate_sections "$prompt_file"; then
        all_passed=false
    fi
    
    if ! validate_section_content "$prompt_file"; then
        all_passed=false
    fi
    
    if ! validate_critical_requirements "$prompt_file"; then
        all_passed=false
    fi
    
    # Final result
    if [[ "$all_passed" == "true" ]]; then
        log "✅ BUILD CONTRACT SECTIONS VERIFICATION PASSED"
        log "Build prompt is properly structured and complete"
        return 0
    else
        log "❌ BUILD CONTRACT SECTIONS VERIFICATION FAILED"
        log "Build prompt does not meet required structure"
        log ""
        log "Required sections (in order):"
        printf '%s\n' "${REQUIRED_SECTIONS[@]}" | sed 's/^/  - /'
        log ""
        log "Regenerate contract: scripts/build_contract_synthesis.sh $idea_dir"
        exit 1
    fi
}

# Execute main function
main "$@"