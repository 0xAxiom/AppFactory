#!/bin/bash

# Verify Build Contract Present - Stage 10 Gate
# Purpose: Fail-fast verification that build contract exists before Stage 10
# Usage: verify_build_contract_present.sh <idea_directory>

set -euo pipefail

# Function to log with timestamp
log() {
    echo "[$(date -Iseconds)] VERIFY_BUILD_CONTRACT: $1"
}

# Function to check file exists and is not empty
check_file_exists() {
    local file_path="$1"
    local description="$2"
    
    if [[ ! -f "$file_path" ]]; then
        log "❌ MISSING: $description"
        log "   Expected: $file_path"
        return 1
    fi
    
    if [[ ! -s "$file_path" ]]; then
        log "❌ EMPTY: $description"
        log "   File exists but is empty: $file_path"
        return 1
    fi
    
    log "✅ Present: $description"
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
    
    # Validate idea directory exists
    if [[ ! -d "$idea_dir" ]]; then
        log "ERROR: Idea directory does not exist: $idea_dir"
        exit 1
    fi
    
    log "Verifying build contract presence for: $idea_dir"
    
    # Check for contract directory
    local contract_dir="${idea_dir}/app/_contract"
    if [[ ! -d "$contract_dir" ]]; then
        log "❌ MISSING: Build contract directory"
        log "   Expected: $contract_dir"
        log "   Run build_contract_synthesis.sh before Stage 10"
        exit 1
    fi
    
    # Track verification results
    local verification_passed=true
    
    # Check required contract files
    if ! check_file_exists "${contract_dir}/build_prompt.md" "Build prompt markdown"; then
        verification_passed=false
    fi
    
    if ! check_file_exists "${contract_dir}/build_contract.json" "Build contract JSON"; then
        verification_passed=false
    fi
    
    if ! check_file_exists "${contract_dir}/contract_sources.json" "Contract sources manifest"; then
        verification_passed=false
    fi
    
    # Check contract sources has actual content
    local sources_json="${contract_dir}/contract_sources.json"
    if [[ -f "$sources_json" ]]; then
        local source_count=$(python3 -c "
import json
try:
    with open('$sources_json', 'r') as f:
        data = json.load(f)
        print(len(data.get('sources', [])))
except:
    print(0)
")
        
        if [[ "$source_count" -eq 0 ]]; then
            log "❌ EMPTY: Contract sources manifest has no sources"
            verification_passed=false
        else
            log "✅ Contract sources: $source_count files traced"
        fi
    fi
    
    # Final verification result
    if [[ "$verification_passed" == "true" ]]; then
        log "✅ BUILD CONTRACT VERIFICATION PASSED"
        log "Stage 10 can proceed with contract-driven build"
        return 0
    else
        log "❌ BUILD CONTRACT VERIFICATION FAILED"
        log "Stage 10 cannot proceed without complete build contract"
        log "Required files:"
        log "  - ${contract_dir}/build_prompt.md"
        log "  - ${contract_dir}/build_contract.json"  
        log "  - ${contract_dir}/contract_sources.json"
        log ""
        log "Run: scripts/build_contract_synthesis.sh $idea_dir"
        exit 1
    fi
}

# Execute main function
main "$@"