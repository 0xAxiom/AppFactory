#!/bin/bash
# Create a new App Factory pipeline run

set -euo pipefail

# Source helper functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

# Function to show usage
show_usage() {
    cat << EOF
Usage: $0 [APP_NAME]

Create a new App Factory pipeline run with the specified app name.

Arguments:
  APP_NAME    App name in kebab-case (e.g., focus-buddy, meal-tracker)
              If not provided, will prompt for input.

Examples:
  $0 focus-buddy
  $0 meal-tracker  
  $0 habit-builder

The script will create:
  runs/YYYY-MM-DD/APP_NAME/
  ├── spec/           # Specification files
  ├── stages/         # Agent execution contexts  
  └── outputs/        # Generated artifacts
EOF
}

# Function to prompt for app name
prompt_app_name() {
    echo ""
    log_info "Enter your app name (lowercase, kebab-case):"
    echo "  Examples: focus-buddy, meal-tracker, habit-builder"
    echo ""
    read -p "App name: " app_name
    echo ""
    
    if [[ -z "$app_name" ]]; then
        log_error "App name is required"
        exit 1
    fi
    
    echo "$app_name"
}

main() {
    # Check if we're in the right directory
    if ! check_app_factory_project; then
        exit 1
    fi
    
    # Parse arguments
    if [[ $# -gt 1 ]]; then
        log_error "Too many arguments provided"
        show_usage
        exit 1
    fi
    
    if [[ $# -eq 1 ]]; then
        if [[ "$1" == "-h" ]] || [[ "$1" == "--help" ]]; then
            show_usage
            exit 0
        fi
        app_name="$1"
    else
        app_name=$(prompt_app_name)
    fi
    
    # Trim whitespace from app name
    app_name=$(echo "$app_name" | tr -d '\n\r' | xargs)
    
    # Validate app name
    if ! validate_app_name "$app_name"; then
        exit 1
    fi
    
    # Create run directory structure using local date
    local run_date=$(get_date)
    local run_dir="runs/$run_date/$app_name"
    
    if [[ -d "$run_dir" ]]; then
        log_error "Run already exists: $run_dir"
        log_info "Use a different app name or delete the existing run"
        exit 1
    fi
    
    log_info "Creating new App Factory run: $app_name"
    log_info "Run directory: $run_dir"
    echo ""
    
    # Create directory structure
    ensure_dir "$run_dir/spec"
    ensure_dir "$run_dir/stages" 
    ensure_dir "$run_dir/outputs"
    ensure_dir "$run_dir/outputs/assets"
    ensure_dir "$run_dir/outputs/mockups"
    ensure_dir "$run_dir/outputs/builds"
    
    # Copy template files to spec directory
    log_info "Setting up specification templates..."
    
    local intake_template="templates/spec/00_intake.template.md"
    local intake_spec="$run_dir/spec/00_intake.md"
    copy_file "$intake_template" "$intake_spec" "intake template"
    
    local selection_template="templates/spec/02_idea_selection.template.md" 
    local selection_spec="$run_dir/spec/02_idea_selection.template.md"
    copy_file "$selection_template" "$selection_spec" "idea selection template"
    
    # Create stage directories with agent templates
    log_info "Setting up stage execution contexts..."
    create_stage_dirs "$run_dir"
    
    # Create a simple README for the run
    cat > "$run_dir/README.md" << EOF
# App Factory Run: $app_name

**Created**: $run_date  
**Status**: Initialized

## Quick Start

1. **Fill out intake**: Edit \`spec/00_intake.md\` with your context and constraints
2. **Run market research**: Use \`stages/01_market_research/claude.md\` with Claude
3. **Select ideas**: Create \`spec/02_idea_selection.md\` from generated ideas (REQUIRED GATE)
4. **Continue pipeline**: Execute stages 02-09 in sequence
5. **Build app**: Use \`../../builder/MASTER_BUILDER_PROMPT.md\` when specs complete

## Directory Structure

- \`spec/\` - All specifications (source of truth)
- \`stages/\` - Agent execution contexts with prompts
- \`outputs/\` - Generated artifacts, builds, and assets

## Pipeline Status

Run \`../../scripts/check_structure.sh $run_date/$app_name\` to validate progress.
EOF

    # Create/update active run tracking (XDG-compliant)
    init_xdg_dirs
    local run_path="$(pwd)/$run_dir"
    log_info "Setting active run to: $app_name"
    
    # Use local time for created_at timestamp
    local timestamp
    if [[ "$OSTYPE" == "darwin"* ]]; then
        timestamp=$(date +"%Y-%m-%dT%H:%M:%S%z")
    else
        timestamp=$(date +"%Y-%m-%dT%H:%M:%S%z")
    fi
    
    cat > "$(get_config_dir)/active_run.json" << EOF
{
  "run_id": "$app_name",
  "run_path": "$run_path",
  "created_at": "$timestamp"
}
EOF

    # Output parseable run path for CLI (CRITICAL: CLI must use this exact path)
    echo "RUN_PATH=$run_path"
    
    # Success message
    echo ""
    log_success "App Factory run created successfully!"
    echo ""
    echo "📁 Run directory: $run_dir"
    echo ""
    echo "🎯 Next steps:"
    echo "   1. cd $run_dir"
    echo "   2. Edit spec/00_intake.md with your context and constraints"
    echo "   3. Run Agent 01 (Market Research):"
    echo "      cat stages/01_market_research/claude.md"
    echo "   4. After Stage 01, run: appfactory select (Enter accepts top-ranked)"
    echo ""
    echo "📚 Documentation:"
    echo "   - Pipeline guide: ../../PIPELINE.md"
    echo "   - Standards: ../../standards/mobile_app_best_practices_2026.md"
    echo ""
    echo "✨ Seamless Selection: After Stage 01, use 'appfactory select' from repo root"
    echo "   No manual file editing required - automatic scoring and ranking!"
    echo ""
}

main "$@"