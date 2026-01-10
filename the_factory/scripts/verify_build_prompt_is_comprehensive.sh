#!/bin/bash

# Comprehensive Build Prompt Quality Gate Verifier
# Purpose: Enforce comprehensive build prompt standards before Stage 10
# Execution: Called as mandatory gate before Stage 10 code generation
# Scope: Single idea pack only

set -euo pipefail

# Function to log with timestamp
log() {
    echo "[$(date -Iseconds)] BUILD_PROMPT_VERIFIER: $1"
}

# Function to check if section exists and has content
check_section() {
    local file_path="$1"
    local section_name="$2"
    local min_lines="${3:-3}"
    
    # Check if section heading exists
    if ! grep -q "^## $section_name$" "$file_path"; then
        return 1
    fi
    
    # Extract section content
    local section_content
    section_content=$(awk "/^## $section_name$/,/^## / {if (/^## / && !/^## $section_name$/) exit; if (!/^## $section_name$/) print}" "$file_path")
    
    # Check if section has enough content (not just empty lines or placeholders)
    local content_lines
    content_lines=$(echo "$section_content" | grep -v '^$' | grep -v '^\s*$' | grep -v 'TBD\|TODO\|PLACEHOLDER' | wc -l)
    
    if [[ "$content_lines" -lt "$min_lines" ]]; then
        return 2
    fi
    
    return 0
}

# Function to check monetization rules completeness
check_monetization_rules() {
    local file_path="$1"
    
    # Required monetization elements
    local required_monetization=(
        "revenuecat"
        "restor"
        "purchase"
        "subscription"
        "anti.*bypass\|bypass"
        "offline"
        "free.*tier\|free.*limit\|limitation"
        "premium\|pro"
    )
    
    # Extract monetization section
    local monetization_section
    monetization_section=$(awk '/^## MONETIZATION RULES$/,/^## / {if (/^## / && !/^## MONETIZATION RULES$/) exit; print}' "$file_path")
    
    local missing_elements=()
    
    for element in "${required_monetization[@]}"; do
        if ! echo "$monetization_section" | grep -qi "$element"; then
            missing_elements+=("$element")
        fi
    done
    
    if [[ ${#missing_elements[@]} -gt 0 ]]; then
        log "ERROR: MONETIZATION RULES section missing required elements:"
        printf '  - %s\n' "${missing_elements[@]}"
        return 1
    fi
    
    return 0
}

# Function to check technical requirements completeness  
check_technical_requirements() {
    local file_path="$1"
    
    # Required technical elements
    local required_technical=(
        "vendor.*expo\|expo.*vendor"
        "vendor.*revenuecat\|revenuecat.*vendor"  
        "expo.*install\|npx.*expo"
        "improvisation"
        "typescript"
        "navigation"
        "asyncstorage\|storage"
    )
    
    # Extract technical requirements section
    local technical_section
    technical_section=$(awk '/^## TECHNICAL REQUIREMENTS$/,/^## / {if (/^## / && !/^## TECHNICAL REQUIREMENTS$/) exit; print}' "$file_path")
    
    local missing_elements=()
    
    for element in "${required_technical[@]}"; do
        if ! echo "$technical_section" | grep -qi "$element"; then
            missing_elements+=("$element")
        fi
    done
    
    if [[ ${#missing_elements[@]} -gt 0 ]]; then
        log "ERROR: TECHNICAL REQUIREMENTS section missing required elements:"
        printf '  - %s\n' "${missing_elements[@]}"
        return 1
    fi
    
    return 0
}

# Function to check assets section completeness
check_assets_section() {
    local file_path="$1"
    
    # Required asset elements
    local required_assets=(
        "app.*icon\|icon"
        "launch.*screen\|splash"
        "brand.*spec\|stage.*08\|stage.*8"
        "deterministic.*generat\|asset.*generat"
        "store.*submission\|screenshot"
    )
    
    # Extract assets section
    local assets_section
    assets_section=$(awk '/^## ASSETS$/,/^## / {if (/^## / && !/^## ASSETS$/) exit; print}' "$file_path")
    
    local missing_elements=()
    
    for element in "${required_assets[@]}"; do
        if ! echo "$assets_section" | grep -qi "$element"; then
            missing_elements+=("$element")
        fi
    done
    
    if [[ ${#missing_elements[@]} -gt 0 ]]; then
        log "ERROR: ASSETS section missing required elements:"
        printf '  - %s\n' "${missing_elements[@]}"
        return 1
    fi
    
    return 0
}

# Function to check pipeline enforcement section
check_pipeline_enforcement() {
    local file_path="$1"
    
    # Required pipeline elements
    local required_pipeline=(
        "traceab"
        "generic"
        "stage.*02\|stage.*2"
        "standards.*complian\|complian"
        "runtime.*validation\|stage.*09\|stage.*9"
        "improvisation"
    )
    
    # Extract pipeline enforcement section
    local pipeline_section
    pipeline_section=$(awk '/^## PIPELINE ENFORCEMENT$/,/^## / {if (/^## / && !/^## PIPELINE ENFORCEMENT$/) exit; print}' "$file_path")
    
    local missing_elements=()
    
    for element in "${required_pipeline[@]}"; do
        if ! echo "$pipeline_section" | grep -qi "$element"; then
            missing_elements+=("$element")
        fi
    done
    
    if [[ ${#missing_elements[@]} -gt 0 ]]; then
        log "ERROR: PIPELINE ENFORCEMENT section missing required elements:"
        printf '  - %s\n' "${missing_elements[@]}"
        return 1
    fi
    
    return 0
}

# Function to check output expectations section
check_output_expectations() {
    local file_path="$1"
    
    # Required output elements
    local required_output=(
        "ready"
        "builds"
        "revenuecat.*subscription\|subscription.*flow"
        "readme"
        "store.*submission"
        "complete.*app"
    )
    
    # Extract output expectations section
    local output_section
    output_section=$(awk '/^## OUTPUT EXPECTATIONS$/,/^## / {if (/^## / && !/^## OUTPUT EXPECTATIONS$/) exit; print}' "$file_path")
    
    local missing_elements=()
    
    for element in "${required_output[@]}"; do
        if ! echo "$output_section" | grep -qi "$element"; then
            missing_elements+=("$element")
        fi
    done
    
    if [[ ${#missing_elements[@]} -gt 0 ]]; then
        log "ERROR: OUTPUT EXPECTATIONS section missing required elements:"
        printf '  - %s\n' "${missing_elements[@]}"
        return 1
    fi
    
    return 0
}

# Function to validate build prompt comprehensiveness
validate_prompt_comprehensiveness() {
    local prompt_file="$1"
    
    log "Validating build prompt comprehensiveness..."
    
    # Required sections in exact order
    local required_sections=(
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
    
    local verification_passed="true"
    local missing_sections=()
    local insufficient_sections=()
    
    # Check all required sections exist and have content
    for section in "${required_sections[@]}"; do
        if ! check_section "$prompt_file" "$section"; then
            local section_result=$?
            if [[ "$section_result" -eq 1 ]]; then
                missing_sections+=("$section")
                verification_passed="false"
            elif [[ "$section_result" -eq 2 ]]; then
                insufficient_sections+=("$section")
                verification_passed="false"
            fi
        fi
    done
    
    # Report missing sections
    if [[ ${#missing_sections[@]} -gt 0 ]]; then
        log "ERROR: Missing required sections:"
        printf '  - %s\n' "${missing_sections[@]}"
    fi
    
    # Report insufficient sections
    if [[ ${#insufficient_sections[@]} -gt 0 ]]; then
        log "ERROR: Sections with insufficient content (less than 3 meaningful lines):"
        printf '  - %s\n' "${insufficient_sections[@]}"
    fi
    
    # Check monetization rules completeness
    if ! check_monetization_rules "$prompt_file"; then
        verification_passed="false"
    fi
    
    # Check technical requirements completeness
    if ! check_technical_requirements "$prompt_file"; then
        verification_passed="false"
    fi
    
    # Check assets section completeness
    if ! check_assets_section "$prompt_file"; then
        verification_passed="false"
    fi
    
    # Check pipeline enforcement completeness
    if ! check_pipeline_enforcement "$prompt_file"; then
        verification_passed="false"
    fi
    
    # Check output expectations completeness
    if ! check_output_expectations "$prompt_file"; then
        verification_passed="false"
    fi
    
    # Final verification result
    if [[ "$verification_passed" == "true" ]]; then
        log "✅ BUILD PROMPT COMPREHENSIVENESS VERIFICATION PASSED"
        log "All 14 required sections present with comprehensive content"
        log "All critical requirements validated"
        return 0
    else
        log "❌ BUILD PROMPT COMPREHENSIVENESS VERIFICATION FAILED"
        log "Build prompt does not meet comprehensive quality standards"
        log "Stage 10 execution blocked until prompt meets requirements"
        return 1
    fi
}

# Main execution function
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
    
    # Validate build prompt file exists
    if [[ ! -f "$prompt_file" ]]; then
        log "ERROR: Build prompt file does not exist: $prompt_file"
        log "Run build contract synthesis first: scripts/build_contract_synthesis.sh $idea_dir"
        exit 1
    fi
    
    log "Starting comprehensive build prompt verification for: $idea_dir"
    
    # Execute comprehensive validation
    if validate_prompt_comprehensiveness "$prompt_file"; then
        log "✅ Comprehensive build prompt quality gate PASSED"
        log "Stage 10 may proceed with contract-driven build"
        return 0
    else
        log "❌ Comprehensive build prompt quality gate FAILED" 
        log "Regenerate build contract with complete stage outputs"
        exit 1
    fi
}

# Execute main function
main "$@"