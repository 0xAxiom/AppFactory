#!/bin/bash
# Validate App Factory project and run structure

set -euo pipefail

# Source helper functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

show_usage() {
    cat << EOF
Usage: $0 [RUN_PATH]

Validate App Factory project structure and optionally a specific run.

Arguments:
  RUN_PATH    Optional path to specific run (e.g., 2026-01-04/focus-buddy)

Examples:
  $0                           # Validate project structure only
  $0 2026-01-04/focus-buddy   # Validate project + specific run
  $0 runs/2026-01-04/focus-buddy  # Also accepts full path

The script validates:
  - App Factory project structure (templates, scripts, etc.)
  - Run directory structure (if specified)
  - Idea selection gate status
  - Agent template availability
EOF
}

validate_agent_templates() {
    log_info "Validating agent templates..."
    
    local expected_agents=(
        "01_market_research"
        "02_product_spec"
        "03_ux"
        "04_monetization" 
        "05_architecture"
        "06_builder_handoff"
        "07_polish"
        "08_brand"
        "09_release"
    )
    
    local failed=0
    
    for agent in "${expected_agents[@]}"; do
        local agent_file="templates/agents/${agent}.md"
        if [[ ! -f "$agent_file" ]]; then
            log_error "Agent template missing: $agent_file"
            failed=1
        fi
    done
    
    if [[ $failed -eq 1 ]]; then
        return 1
    fi
    
    log_success "Agent templates validation passed"
    return 0
}

validate_template_files() {
    log_info "Validating template files..."
    
    local template_files=(
        "templates/spec/00_intake.template.md"
        "templates/spec/02_idea_selection.template.md"
        "templates/stage-claude.template.md"
    )
    
    local failed=0
    
    for template in "${template_files[@]}"; do
        if [[ ! -f "$template" ]]; then
            log_error "Template file missing: $template"
            failed=1
        fi
    done
    
    if [[ $failed -eq 1 ]]; then
        return 1
    fi
    
    log_success "Template files validation passed"
    return 0
}

validate_scripts() {
    log_info "Validating scripts..."
    
    local script_files=(
        "scripts/helpers.sh"
        "scripts/new_run.sh"
        "scripts/check_structure.sh"
        "scripts/demo.sh"
    )
    
    local failed=0
    
    for script in "${script_files[@]}"; do
        if [[ ! -f "$script" ]]; then
            log_error "Script missing: $script"
            failed=1
        elif [[ ! -x "$script" ]]; then
            log_warning "Script not executable: $script (fixing...)"
            chmod +x "$script"
        fi
    done
    
    if [[ $failed -eq 1 ]]; then
        return 1
    fi
    
    log_success "Scripts validation passed"
    return 0
}

test_idea_selection_gate() {
    local run_dir="$1"
    
    log_info "Testing idea selection gate enforcement..."
    
    # Test without selection file
    if check_idea_selection "$run_dir" >/dev/null 2>&1; then
        log_warning "Idea selection gate test: Expected failure but passed"
        log_warning "This might indicate the gate is not properly enforcing"
    else
        log_success "Idea selection gate test: Correctly blocking without selection"
    fi
    
    return 0
}

analyze_run_progress() {
    local run_dir="$1"
    
    log_info "Analyzing run progress..."
    
    local total_stages=13
    local completed_stages=0
    
    local spec_files=(
        "00_intake.md"
        "01_market_research.md"
        "02_ideas.md"
        "02_idea_selection.md"
        "03_pricing.md"
        "04_product_spec.md"
        "05_ux_flows.md"
        "06_monetization.md"
        "07_architecture.md"
        "08_builder_handoff.md"
        "09_polish_checklist.md"
        "10_brand.md"
        "11_release_checklist.md"
    )
    
    for spec_file in "${spec_files[@]}"; do
        if [[ -f "$run_dir/spec/$spec_file" ]]; then
            ((completed_stages++))
        fi
    done
    
    local progress_percent=$((completed_stages * 100 / total_stages))
    
    echo ""
    log_info "Run Progress: $completed_stages/$total_stages stages ($progress_percent%)"
    
    # Show next recommended action
    if [[ ! -f "$run_dir/spec/00_intake.md" ]]; then
        echo "   Next: Fill out intake form (spec/00_intake.md)"
    elif [[ ! -f "$run_dir/spec/01_market_research.md" ]]; then
        echo "   Next: Run Agent 01 (Market Research)"
    elif [[ ! -f "$run_dir/spec/02_idea_selection.md" ]]; then
        echo "   Next: Select ideas manually (spec/02_idea_selection.md)"
    elif [[ ! -f "$run_dir/spec/04_product_spec.md" ]]; then
        echo "   Next: Run Agent 02 (Product Specification)"
    elif [[ $completed_stages -eq $total_stages ]]; then
        echo "   Next: Execute Master Builder (builder/MASTER_BUILDER_PROMPT.md)"
    else
        echo "   Next: Continue with sequential agent execution"
    fi
    
    echo ""
}

main() {
    # Parse arguments
    if [[ $# -gt 1 ]]; then
        log_error "Too many arguments provided"
        show_usage
        exit 1
    fi
    
    if [[ $# -eq 1 ]] && ([[ "$1" == "-h" ]] || [[ "$1" == "--help" ]]); then
        show_usage
        exit 0
    fi
    
    # Check if we're in the right directory
    if ! check_app_factory_project; then
        exit 1
    fi
    
    echo ""
    log_info "App Factory Structure Validation"
    echo "======================================="
    echo ""
    
    # Validate core project structure
    local validation_failed=0
    
    if ! validate_project_structure; then
        validation_failed=1
    fi
    
    if ! validate_agent_templates; then
        validation_failed=1
    fi
    
    if ! validate_template_files; then
        validation_failed=1
    fi
    
    if ! validate_scripts; then
        validation_failed=1
    fi
    
    # If run path provided, validate that too
    if [[ $# -eq 1 ]]; then
        local run_path="$1"
        
        # Normalize run path (handle both relative and full paths)
        if [[ "$run_path" == runs/* ]]; then
            run_dir="$run_path"
        else
            run_dir="runs/$run_path"
        fi
        
        echo ""
        log_info "Run-specific validation: $run_dir"
        echo "--------------------------------------"
        
        if ! validate_run_structure "$run_dir"; then
            validation_failed=1
        else
            show_pipeline_status "$run_dir"
            test_idea_selection_gate "$run_dir"
            analyze_run_progress "$run_dir"
        fi
    fi
    
    # Final result
    echo ""
    if [[ $validation_failed -eq 0 ]]; then
        log_success "✅ All validations passed!"
        echo ""
        if [[ $# -eq 0 ]]; then
            log_info "Project is ready for new runs. Use: ./scripts/new_run.sh APP_NAME"
        else
            log_info "Run is structurally valid and ready for pipeline execution."
        fi
    else
        log_error "❌ Validation failed!"
        echo ""
        log_error "Please fix the issues above before proceeding."
        exit 1
    fi
    
    echo ""
}

main "$@"