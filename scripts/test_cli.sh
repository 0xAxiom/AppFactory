#!/bin/bash
# App Factory CLI Test Harness
# Comprehensive test suite for the complete CLI pipeline

set -euo pipefail

# Source helper functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/helpers.sh"

# Test configuration
TEST_PROJECT_NAME="test-pipeline-$(date +%s)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Cleanup function
cleanup_test() {
    local test_run_path="$1"
    if [[ -n "$test_run_path" && -d "$test_run_path" ]]; then
        log_info "Cleaning up test run: $test_run_path"
        rm -rf "$test_run_path"
    fi
    
    # Clean active run if it's our test (XDG location)
    local config_dir="${XDG_CONFIG_HOME:-$HOME/.config}/appfactory"
    if [[ -f "$config_dir/active_run.json" ]]; then
        local active_run_id
        active_run_id=$(python3 -c "
import json, sys
try:
    with open('$config_dir/active_run.json', 'r') as f:
        data = json.load(f)
        print(data.get('run_id', ''))
except:
    print('')
")
        if [[ "$active_run_id" == "$TEST_PROJECT_NAME" ]]; then
            rm -f "$config_dir/active_run.json"
        fi
    fi
}

# Test 1: Forbidden flags check
test_forbidden_flags() {
    log_info "TEST 1: Checking for forbidden Claude flags..."
    
    local forbidden_found=false
    local forbidden_patterns=("dangerously-skip-permissions" "permission-mode" "bypassPermissions")
    
    for pattern in "${forbidden_patterns[@]}"; do
        # Exclude test files and documentation that mention these flags as examples
        if grep -r "$pattern" "$PROJECT_ROOT" --exclude-dir=".git" --exclude="test_cli.sh" --exclude="README.md" --exclude="PIPELINE.md" >/dev/null 2>&1; then
            log_error "Found forbidden flag: $pattern"
            forbidden_found=true
        fi
    done
    
    if [[ "$forbidden_found" == "true" ]]; then
        log_error "TEST 1 FAILED: Forbidden flags detected"
        return 1
    fi
    
    log_success "TEST 1 PASSED: No forbidden flags found"
}

# Test 2: Dependencies check
test_dependencies() {
    log_info "TEST 2: Checking dependencies..."
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        log_error "TEST 2 FAILED: Python 3 not found"
        return 1
    fi
    
    # Check Node.js (if needed)
    if ! command -v node &> /dev/null; then
        log_warning "Node.js not found (may be required for some features)"
    fi
    
    # Claude CLI check (in stub mode this is okay to be missing)
    if ! command -v claude &> /dev/null; then
        log_info "Claude CLI not found (acceptable for stub mode testing)"
    fi
    
    log_success "TEST 2 PASSED: Core dependencies available"
}

# Test 3: Local date compliance
test_local_date() {
    log_info "TEST 3: Checking local date compliance..."
    
    # Test helper function
    local date_output
    date_output=$(get_date)
    
    if [[ ! "$date_output" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
        log_error "TEST 3 FAILED: Invalid date format: $date_output"
        return 1
    fi
    
    # Verify it's local date (not UTC)
    local system_date
    system_date=$(date +%Y-%m-%d)
    
    if [[ "$date_output" != "$system_date" ]]; then
        log_error "TEST 3 FAILED: Date mismatch - helper: $date_output, system: $system_date"
        return 1
    fi
    
    log_success "TEST 3 PASSED: Local date compliance verified"
}

# Test 4: Test mode pipeline execution
test_stub_pipeline() {
    log_info "TEST 4: Running complete test mode pipeline..."
    
    # Run complete pipeline in test mode using new test variable
    local pipeline_output
    pipeline_output=$(APPFACTORY_TEST_MODE=1 "$PROJECT_ROOT/bin/appfactory" run "$TEST_PROJECT_NAME" 2>&1)
    local exit_code=$?
    
    if [[ $exit_code -ne 0 ]]; then
        log_error "TEST 4 FAILED: Pipeline execution failed"
        echo "$pipeline_output"
        return 1
    fi
    
    # Find the actual test run path from active_run.json (XDG location)
    local config_dir="${XDG_CONFIG_HOME:-$HOME/.config}/appfactory"
    local active_run_file="$config_dir/active_run.json"
    if [[ ! -f "$active_run_file" ]]; then
        log_error "TEST 4 FAILED: Active run file not found"
        return 1
    fi
    
    local test_run_path
    test_run_path=$(python3 -c "
import json
try:
    with open('$active_run_file', 'r') as f:
        data = json.load(f)
        print(data.get('run_path', ''))
except:
    print('')
")
    
    if [[ -z "$test_run_path" || ! -d "$test_run_path" ]]; then
        log_error "TEST 4 FAILED: Run directory not found: $test_run_path"
        return 1
    fi
    
    # Store for cleanup
    echo "$test_run_path" > "/tmp/appfactory_test_path"
    
    log_success "TEST 4 PASSED: Stub pipeline executed successfully"
    log_info "Test run path: $test_run_path"
}

# Test 5: Artifact verification
test_artifacts() {
    log_info "TEST 5: Verifying generated artifacts..."
    
    # Get test run path
    local test_run_path
    if [[ -f "/tmp/appfactory_test_path" ]]; then
        test_run_path=$(cat "/tmp/appfactory_test_path")
    else
        log_error "TEST 5 FAILED: Could not find test run path"
        return 1
    fi
    
    local spec_dir="$test_run_path/spec"
    if [[ ! -d "$spec_dir" ]]; then
        log_error "TEST 5 FAILED: Spec directory not found"
        return 1
    fi
    
    # Expected files (based on get_expected_files function)
    local expected_files=(
        "spec/01_market_research.md"
        "spec/02_ideas.md" 
        "spec/03_pricing.md"
        "spec/02_idea_selection.md"
        "spec/04_product_spec.md"
        "spec/05_ux.md"
        "spec/06_monetization.md"
        "spec/07_architecture.md"
        "spec/08_builder_handoff.md"
        "spec/09_polish.md"
        "spec/10_brand.md"
        "spec/11_release_checklist.md"
    )
    
    local missing_files=()
    local empty_files=()
    
    for file in "${expected_files[@]}"; do
        local full_path="$test_run_path/$file"
        
        if [[ ! -f "$full_path" ]]; then
            missing_files+=("$file")
        elif [[ ! -s "$full_path" ]]; then
            empty_files+=("$file")
        fi
    done
    
    if [[ ${#missing_files[@]} -gt 0 ]]; then
        log_error "TEST 5 FAILED: Missing files: ${missing_files[*]}"
        return 1
    fi
    
    if [[ ${#empty_files[@]} -gt 0 ]]; then
        log_error "TEST 5 FAILED: Empty files: ${empty_files[*]}"
        return 1
    fi
    
    # Check for archived ideas
    local unused_ideas_dir="$test_run_path/spec/unused_ideas"
    if [[ ! -d "$unused_ideas_dir" ]]; then
        log_error "TEST 5 FAILED: Unused ideas directory not found"
        return 1
    fi
    
    local unused_count
    unused_count=$(find "$unused_ideas_dir" -name "*.md" | wc -l)
    if [[ $unused_count -lt 1 ]]; then
        log_error "TEST 5 FAILED: Expected archived ideas, found $unused_count"
        return 1
    fi
    
    log_success "TEST 5 PASSED: All expected artifacts generated"
    log_info "Generated $(echo "${expected_files[@]}" | wc -w) spec files"
    log_info "Archived $unused_count unused ideas"
}

# Test 6: File content quality
test_content_quality() {
    log_info "TEST 6: Checking content quality..."
    
    local test_run_path
    test_run_path=$(cat "/tmp/appfactory_test_path")
    
    local min_line_threshold=10
    local quality_issues=()
    
    # Check major spec files for reasonable content
    local key_files=(
        "spec/01_market_research.md"
        "spec/04_product_spec.md"
        "spec/06_monetization.md"
        "spec/08_builder_handoff.md"
    )
    
    for file in "${key_files[@]}"; do
        local full_path="$test_run_path/$file"
        local line_count
        line_count=$(wc -l < "$full_path")
        
        if [[ $line_count -lt $min_line_threshold ]]; then
            quality_issues+=("$file: only $line_count lines (expected >$min_line_threshold)")
        fi
    done
    
    if [[ ${#quality_issues[@]} -gt 0 ]]; then
        log_error "TEST 6 FAILED: Content quality issues:"
        for issue in "${quality_issues[@]}"; do
            log_error "  - $issue"
        done
        return 1
    fi
    
    log_success "TEST 6 PASSED: Content quality acceptable"
}

# Test 7: Active run tracking
test_active_run_tracking() {
    log_info "TEST 7: Testing active run tracking..."
    
    # Check if active run file exists (XDG location)
    local config_dir="${XDG_CONFIG_HOME:-$HOME/.config}/appfactory"
    local active_run_file="$config_dir/active_run.json"
    if [[ ! -f "$active_run_file" ]]; then
        log_error "TEST 7 FAILED: Active run file not created"
        return 1
    fi
    
    # Validate JSON structure
    local run_id run_path
    run_id=$(python3 -c "
import json, sys
try:
    with open('$active_run_file', 'r') as f:
        data = json.load(f)
        print(data.get('run_id', ''))
except Exception as e:
    print('ERROR: ' + str(e), file=sys.stderr)
    sys.exit(1)
")
    
    if [[ -z "$run_id" || "$run_id" != "$TEST_PROJECT_NAME" ]]; then
        log_error "TEST 7 FAILED: Invalid run_id in active_run.json"
        return 1
    fi
    
    log_success "TEST 7 PASSED: Active run tracking working"
}

# Test 8: CLI commands
test_cli_commands() {
    log_info "TEST 8: Testing CLI commands..."
    
    # Test status command
    local status_output
    status_output=$("$PROJECT_ROOT/bin/appfactory" status 2>&1)
    
    if [[ ! "$status_output" =~ "Complete!" ]]; then
        log_error "TEST 8 FAILED: Status command doesn't show completion"
        return 1
    fi
    
    # Test list-runs command
    local list_output
    list_output=$("$PROJECT_ROOT/bin/appfactory" list-runs 2>&1)
    
    if [[ ! "$list_output" =~ "$TEST_PROJECT_NAME" ]]; then
        log_error "TEST 8 FAILED: List-runs doesn't show test run"
        return 1
    fi
    
    log_success "TEST 8 PASSED: CLI commands working"
}

# Test 9: Clean command functionality
test_clean_command() {
    log_info "TEST 9: Testing clean command functionality..."
    
    # Test dry run
    if ! ./bin/appfactory clean --dry-run >/dev/null 2>&1; then
        echo "❌ TEST 9 FAILED: Clean dry run failed"
        return 1
    fi
    
    # Test actual clean
    if ! ./bin/appfactory clean --all-runs >/dev/null 2>&1; then
        echo "❌ TEST 9 FAILED: Clean command failed"
        return 1
    fi
    
    log_success "TEST 9 PASSED: Clean command working"
    return 0
}

# Test 10: Spinner and progress functions
test_spinner_functions() {
    log_info "TEST 10: Testing spinner and progress functions..."
    
    # Check for required functions
    local required_functions=("show_claude_progress" "stream_claude_output" "execute_claude")
    for func in "${required_functions[@]}"; do
        if ! grep -q "$func" "$PROJECT_ROOT/scripts/pipeline_functions.sh"; then
            echo "❌ TEST 10 FAILED: Function $func missing"
            return 1
        fi
    done
    
    # Check for streaming support
    if ! grep -q "APPFACTORY_STREAM_OUTPUT" "$PROJECT_ROOT/scripts/pipeline_functions.sh"; then
        echo "❌ TEST 10 FAILED: Streaming mode support missing"
        return 1
    fi
    
    log_success "TEST 10 PASSED: Spinner and streaming functions implemented"
    return 0
}

# Main test execution
main() {
    log_info "🧪 App Factory CLI Test Suite"
    echo ""
    
    local tests=(
        "test_forbidden_flags"
        "test_dependencies"
        "test_local_date"
        "test_stub_pipeline"
        "test_artifacts"
        "test_content_quality"
        "test_active_run_tracking"
        "test_cli_commands"
        "test_clean_command"
        "test_spinner_functions"
    )
    
    local failed_tests=()
    local test_run_path=""
    
    # Set up signal handlers for cleanup  
    trap 'cleanup_test "$(cat /tmp/appfactory_test_path 2>/dev/null || echo "")"' EXIT INT TERM
    
    for test in "${tests[@]}"; do
        echo ""
        if ! $test; then
            failed_tests+=("$test")
        fi
        
        # Store test run path after pipeline test
        if [[ "$test" == "test_stub_pipeline" && -f "/tmp/appfactory_test_path" ]]; then
            test_run_path=$(cat "/tmp/appfactory_test_path")
        fi
    done
    
    echo ""
    echo "📊 TEST RESULTS"
    echo "==============="
    
    local passed=$((${#tests[@]} - ${#failed_tests[@]}))
    echo "Passed: $passed/${#tests[@]}"
    
    if [[ ${#failed_tests[@]} -eq 0 ]]; then
        log_success "🎉 ALL TESTS PASSED - App Factory is ready to ship!"
        echo ""
        echo "Ship Criteria Met:"
        echo "✅ No forbidden flags detected"
        echo "✅ Pipeline executes end-to-end in test mode"
        echo "✅ All expected artifacts generated"
        echo "✅ Content quality standards met"
        echo "✅ CLI commands functional"
        echo "✅ Local time compliance verified"
        echo "✅ Active run tracking working"
        echo "✅ Automatic idea selection implemented"
        echo "✅ Clean command functional with dry-run support"
        echo "✅ Spinner and live output streaming implemented"
        
        return 0
    else
        log_error "❌ TESTS FAILED: ${#failed_tests[@]} tests failed"
        echo ""
        echo "Failed tests:"
        for test in "${failed_tests[@]}"; do
            echo "  - $test"
        done
        echo ""
        log_error "App Factory is NOT ready to ship"
        return 1
    fi
}

main "$@"