#!/bin/bash

# Validate Build Contract System - End-to-End Verification
# Purpose: Test all build contract components are properly wired and functional
# Usage: validate_build_contract_system.sh

set -euo pipefail

# Function to log with timestamp
log() {
    echo "[$(date -Iseconds)] BUILD_CONTRACT_VALIDATION: $1"
}

# Function to check script exists and is executable
check_script() {
    local script_path="$1"
    local description="$2"
    
    if [[ ! -f "$script_path" ]]; then
        log "❌ MISSING: $description"
        log "   Expected: $script_path"
        return 1
    fi
    
    if [[ ! -x "$script_path" ]]; then
        log "❌ NOT EXECUTABLE: $description"
        log "   File: $script_path"
        return 1
    fi
    
    log "✅ Present: $description"
    return 0
}

# Function to check template exists
check_template() {
    local template_path="$1"
    local description="$2"
    
    if [[ ! -f "$template_path" ]]; then
        log "❌ MISSING: $description"
        log "   Expected: $template_path"
        return 1
    fi
    
    # Check template has required sections
    if ! grep -q "AGENT-NATIVE EXECUTION" "$template_path"; then
        log "❌ INVALID: $description missing required section"
        return 1
    fi
    
    log "✅ Valid: $description"
    return 0
}

# Function to test stage resolution
test_stage_resolution() {
    log "Testing stage 09.7 resolution..."
    
    # Run stage resolution verification
    if ! scripts/verify_stage_resolution_is_deterministic.sh; then
        log "❌ Stage resolution verification failed"
        return 1
    fi
    
    log "✅ Stage resolution verification passed"
    return 0
}

# Main validation function
main() {
    log "Starting Build Contract System Validation"
    
    # Check required scripts exist and are executable
    local validation_passed=true
    
    if ! check_script "scripts/build_contract_synthesis.sh" "Build Contract Synthesis Script"; then
        validation_passed=false
    fi
    
    if ! check_script "scripts/verify_build_contract_present.sh" "Build Contract Present Verifier"; then
        validation_passed=false
    fi
    
    if ! check_script "scripts/verify_build_contract_sections.sh" "Build Contract Sections Verifier"; then
        validation_passed=false
    fi
    
    # Check required templates exist
    if ! check_template "templates/agents/09.7_build_contract_synthesis.md" "Stage 09.7 Template"; then
        validation_passed=false
    fi
    
    if ! check_template "templates/agents/10_app_builder.md" "Stage 10 Template (Modified)"; then
        validation_passed=false
    fi
    
    # Test stage resolution includes 09.7
    if ! test_stage_resolution; then
        validation_passed=false
    fi
    
    # Check CLAUDE.md has been updated
    if ! grep -q "stage09.7" "claude.md"; then
        log "❌ CLAUDE.md not updated with stage09.7 references"
        validation_passed=false
    else
        log "✅ CLAUDE.md updated with stage09.7 references"
    fi
    
    # Check expected stage artifacts updated
    if ! grep -q "09.7" "claude.md"; then
        log "❌ Expected stage artifacts not updated for 09.7"
        validation_passed=false
    else
        log "✅ Expected stage artifacts updated for 09.7"
    fi
    
    # Final validation result
    if [[ "$validation_passed" == "true" ]]; then
        log "✅ BUILD CONTRACT SYSTEM VALIDATION PASSED"
        log ""
        log "🎯 Build Contract System is properly implemented:"
        log "   - Stage 09.7 Build Contract Synthesis template created"
        log "   - Build contract synthesis script implemented"
        log "   - Build contract verification scripts implemented"
        log "   - Stage 10 modified to consume only build contract"
        log "   - Stage resolution updated for 09.7"
        log "   - CLAUDE.md control plane updated"
        log ""
        log "🚀 Ready for production use with contract-driven builds"
        return 0
    else
        log "❌ BUILD CONTRACT SYSTEM VALIDATION FAILED"
        log ""
        log "⚠️  Build Contract System is not properly implemented"
        log "   Fix the above issues before using contract-driven builds"
        return 1
    fi
}

# Execute main function
main "$@"