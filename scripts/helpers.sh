#!/bin/bash
# App Factory Helper Functions
# Shared utilities for the App Factory pipeline

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Resolve Claude CLI binary path (single source of truth)
resolve_claude_binary() {
    # Use type -P for absolute path resolution (preferred over command -v)
    local claude_bin=""
    claude_bin=$(type -P claude 2>/dev/null || true)
    
    if [[ -z "$claude_bin" ]]; then
        log_error "Claude CLI not found in PATH"
        log_error "Install from https://claude.ai/code and ensure 'claude' is accessible"
        return 1
    fi
    
    # Verify it's executable
    if [[ ! -x "$claude_bin" ]]; then
        log_error "Claude binary found but not executable: $claude_bin"
        return 1
    fi
    
    # Return the absolute path
    echo "$claude_bin"
    return 0
}

# Test Claude CLI connectivity and authentication
test_claude_connectivity() {
    local claude_bin="$1"
    local test_output
    local exit_code
    
    log_info "Testing Claude CLI connectivity: $claude_bin"
    
    # Test --version first
    if ! test_output=$("$claude_bin" --version 2>&1); then
        exit_code=$?
        log_error "Claude CLI version check failed (exit code: $exit_code)"
        log_error "Output: $test_output"
        log_error "Try running: \"$claude_bin\" --version manually"
        return 1
    fi
    
    log_info "Claude CLI version: $test_output"
    
    # Test basic prompt execution
    if ! test_output=$(echo "Hello" | "$claude_bin" -p 2>&1); then
        exit_code=$?
        log_error "Claude CLI basic test failed (exit code: $exit_code)"
        log_error "Output: $test_output"
        log_error "Authentication may be required. Try: \"$claude_bin\" auth login"
        return 1
    fi
    
    log_success "Claude CLI connectivity test passed"
    return 0
}

# Get current date in YYYY-MM-DD format (local time)
get_date() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS - local time
        date +%Y-%m-%d
    else
        # Linux - local time
        date +%Y-%m-%d
    fi
}

# Validate app name (lowercase, kebab-case)
validate_app_name() {
    local name="$1"
    if [[ ! "$name" =~ ^[a-z0-9-]+$ ]]; then
        log_error "App name must be lowercase, kebab-case (letters, numbers, hyphens only)"
        log_error "Valid examples: focus-buddy, meal-tracker, habit-builder"
        return 1
    fi
    return 0
}

# Check if required file exists
check_file_exists() {
    local file="$1"
    local description="$2"
    if [[ ! -f "$file" ]]; then
        log_error "$description not found: $file"
        return 1
    fi
    return 0
}

# Check if directory exists
check_dir_exists() {
    local dir="$1"
    local description="$2"
    if [[ ! -d "$dir" ]]; then
        log_error "$description not found: $dir"
        return 1
    fi
    return 0
}

# Create directory if it doesn't exist
ensure_dir() {
    local dir="$1"
    if [[ ! -d "$dir" ]]; then
        log_info "Creating directory: $dir"
        mkdir -p "$dir"
    fi
}

# Copy file with validation
copy_file() {
    local src="$1"
    local dest="$2"
    local description="$3"
    
    if [[ ! -f "$src" ]]; then
        log_error "Source file not found: $src"
        return 1
    fi
    
    log_info "Copying $description: $(basename "$dest")"
    cp "$src" "$dest"
}

# Validate App Factory project structure
validate_project_structure() {
    log_info "Validating App Factory project structure..."
    
    local required_files=(
        "README.md"
        "PIPELINE.md" 
        "pipeline.yaml"
        "standards/mobile_app_best_practices_2026.md"
        "builder/MASTER_BUILDER_PROMPT.md"
    )
    
    local required_dirs=(
        "templates/agents"
        "templates/spec"
        "scripts"
        "runs"
    )
    
    local failed=0
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            log_error "Required file missing: $file"
            failed=1
        fi
    done
    
    for dir in "${required_dirs[@]}"; do
        if [[ ! -d "$dir" ]]; then
            log_error "Required directory missing: $dir"
            failed=1
        fi
    done
    
    if [[ $failed -eq 1 ]]; then
        return 1
    fi
    
    log_success "Project structure validation passed"
    return 0
}

# Validate run directory structure
validate_run_structure() {
    local run_dir="$1"
    
    if [[ ! -d "$run_dir" ]]; then
        log_error "Run directory not found: $run_dir"
        return 1
    fi
    
    log_info "Validating run structure: $run_dir"
    
    local required_dirs=(
        "spec"
        "stages"
        "outputs"
    )
    
    local failed=0
    
    for dir in "${required_dirs[@]}"; do
        if [[ ! -d "$run_dir/$dir" ]]; then
            log_error "Required run directory missing: $run_dir/$dir"
            failed=1
        fi
    done
    
    if [[ $failed -eq 1 ]]; then
        return 1
    fi
    
    log_success "Run structure validation passed"
    return 0
}

# Check idea selection gate
check_idea_selection() {
    local run_dir="$1"
    local selection_file="$run_dir/spec/02_idea_selection.md"
    
    if [[ ! -f "$selection_file" ]]; then
        log_warning "Idea selection file not found: $selection_file"
        log_warning "Pipeline will halt at Stage 02 until ideas are selected"
        return 1
    fi
    
    # Check if file has actual content (more than just template)
    local line_count=$(wc -l < "$selection_file")
    if [[ $line_count -lt 10 ]]; then
        log_warning "Idea selection file appears empty or incomplete"
        log_warning "Pipeline will halt until ideas are properly selected"
        return 1
    fi
    
    log_success "Idea selection gate: PASSED"
    return 0
}

# List available agent templates
list_agents() {
    log_info "Available agent templates:"
    for agent in templates/agents/*.md; do
        if [[ -f "$agent" ]]; then
            local filename=$(basename "$agent" .md)
            local stage_num=$(echo "$filename" | cut -d'_' -f1)
            local stage_name=$(echo "$filename" | cut -d'_' -f2- | tr '_' ' ' | sed 's/\b\w/\U&/g')
            echo "  Stage $stage_num: $stage_name"
        fi
    done
}

# Get app name from run directory
get_app_name_from_run() {
    local run_dir="$1"
    basename "$run_dir"
}

# Get run date from run directory
get_run_date_from_path() {
    local run_path="$1"
    echo "$run_path" | sed -E 's|.*/([0-9]{4}-[0-9]{2}-[0-9]{2})/.*|\1|'
}

# Create stage directory structure
create_stage_dirs() {
    local run_dir="$1"
    local stages_dir="$run_dir/stages"
    
    ensure_dir "$stages_dir"
    
    local stages=(
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
    
    for stage in "${stages[@]}"; do
        ensure_dir "$stages_dir/$stage"
        
        # Copy agent template to stage directory
        local agent_template="templates/agents/${stage}.md"
        local stage_claude="$stages_dir/$stage/claude.md"
        
        if [[ -f "$agent_template" ]]; then
            copy_file "$agent_template" "$stage_claude" "agent template for $stage"
        else
            log_warning "Agent template not found: $agent_template"
        fi
    done
}

# Display pipeline status for a run
show_pipeline_status() {
    local run_dir="$1"
    local app_name=$(get_app_name_from_run "$run_dir")
    
    echo ""
    log_info "Pipeline Status for: $app_name"
    echo "================================"
    
    # Check each spec file
    local specs=(
        "00_intake:Intake"
        "01_market_research:Market Research"  
        "02_ideas:Ideas Generated"
        "02_idea_selection:Idea Selection (GATE)"
        "03_pricing:Pricing Research"
        "04_product_spec:Product Specification"
        "05_ux_flows:UX Design"
        "06_monetization:Monetization"
        "07_architecture:Architecture"
        "08_builder_handoff:Builder Handoff"
        "09_polish_checklist:Polish Requirements"
        "10_brand:Brand Design"
        "11_release_checklist:Release Checklist"
    )
    
    for spec in "${specs[@]}"; do
        local file_prefix=$(echo "$spec" | cut -d':' -f1)
        local description=$(echo "$spec" | cut -d':' -f2)
        local spec_file="$run_dir/spec/${file_prefix}.md"
        
        if [[ -f "$spec_file" ]]; then
            if [[ "$file_prefix" == "02_idea_selection" ]]; then
                if check_idea_selection "$run_dir" >/dev/null 2>&1; then
                    log_success "✓ $description"
                else
                    log_warning "⚠ $description (incomplete)"
                fi
            else
                log_success "✓ $description"
            fi
        else
            echo "  ○ $description"
        fi
    done
    
    echo ""
}

# Check if we're in an App Factory project
check_app_factory_project() {
    if [[ ! -f "pipeline.yaml" ]] || [[ ! -d "templates" ]]; then
        log_error "Not in an App Factory project directory"
        log_error "Please run this script from the app-factory root directory"
        return 1
    fi
    return 0
}

# Attribution footer functionality (opt-out, transparent)
should_add_attribution() {
    local run_dir="$1"
    local config_file="$run_dir/.appfactory_config"
    
    # Check for --no-attribution flag in environment
    if [[ "${APPFACTORY_NO_ATTRIBUTION:-}" == "true" ]]; then
        return 1  # Don't add attribution
    fi
    
    # Check for run-specific config
    if [[ -f "$config_file" ]]; then
        if grep -q "attribution=false" "$config_file" 2>/dev/null; then
            return 1  # Don't add attribution
        fi
    fi
    
    return 0  # Add attribution (default)
}

# Add attribution footer to spec file
add_attribution_footer() {
    local file_path="$1"
    local run_dir="$2"
    
    if ! should_add_attribution "$run_dir"; then
        return 0  # Skip attribution
    fi
    
    # Only add to .md files in spec/ directory
    if [[ "$file_path" == */spec/*.md ]]; then
        echo "" >> "$file_path"
        echo "---" >> "$file_path"
        echo "" >> "$file_path"
        echo "*Created with [App Factory](https://github.com/your-repo/app-factory)*" >> "$file_path"
    fi
}

# Configure attribution for current run
configure_attribution() {
    local run_dir="$1"
    local enable="$2"  # "true" or "false"
    local config_file="$run_dir/.appfactory_config"
    
    ensure_dir "$(dirname "$config_file")"
    
    if [[ "$enable" == "false" ]]; then
        echo "attribution=false" > "$config_file"
        log_info "Attribution disabled for this run"
    else
        # Remove attribution=false line if it exists
        if [[ -f "$config_file" ]]; then
            grep -v "attribution=false" "$config_file" > "$config_file.tmp" 2>/dev/null || true
            mv "$config_file.tmp" "$config_file" 2>/dev/null || rm -f "$config_file.tmp"
        fi
        log_info "Attribution enabled for this run"
    fi
}

# XDG Base Directory compliance (2025-2026 best practice)
get_config_dir() {
    echo "${XDG_CONFIG_HOME:-$HOME/.config}/appfactory"
}

get_data_dir() {
    echo "${XDG_DATA_HOME:-$HOME/.local/share}/appfactory"
}

get_cache_dir() {
    echo "${XDG_CACHE_HOME:-$HOME/.cache}/appfactory"
}

# Initialize XDG-compliant directories
init_xdg_dirs() {
    ensure_dir "$(get_config_dir)"
    ensure_dir "$(get_data_dir)" 
    ensure_dir "$(get_cache_dir)"
}

# Export functions for use in other scripts
export -f log_info log_success log_warning log_error
export -f get_date validate_app_name check_file_exists check_dir_exists ensure_dir copy_file
export -f validate_project_structure validate_run_structure check_idea_selection
export -f list_agents get_app_name_from_run get_run_date_from_path
export -f create_stage_dirs show_pipeline_status check_app_factory_project
export -f should_add_attribution add_attribution_footer configure_attribution
export -f get_config_dir get_data_dir get_cache_dir init_xdg_dirs