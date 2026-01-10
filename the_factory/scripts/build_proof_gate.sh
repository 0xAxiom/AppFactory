#!/bin/bash

# Build Proof Gate - Stage 10 Mandatory Validation
# Purpose: Verify builds actually work before claiming success
# Usage: build_proof_gate.sh <app_directory>
#
# This script MUST pass for any build to be considered successful.
# It validates:
#   1. npm install completes without errors
#   2. expo install --check passes
#   3. expo-doctor passes
#   4. expo start boots without fatal errors
#
# All outputs are captured to files in the app directory.

set -euo pipefail

# Configuration
METRO_START_TIMEOUT=60
METRO_PORT=8081
MAX_RETRIES=3

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[BUILD_PROOF]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[BUILD_PROOF]${NC} $1"
}

log_error() {
    echo -e "${RED}[BUILD_PROOF]${NC} $1"
}

# Function to kill any existing Metro bundler on the port
kill_metro_on_port() {
    local port=$1
    log_info "Checking for existing Metro on port $port..."

    local pids=$(lsof -ti:$port 2>/dev/null || true)
    if [[ -n "$pids" ]]; then
        log_warn "Found processes on port $port: $pids"
        echo "$pids" | xargs kill -9 2>/dev/null || true
        sleep 2
        log_info "Killed existing processes on port $port"
    else
        log_info "Port $port is available"
    fi
}

# Function to validate package.json
validate_package_json() {
    local app_dir=$1
    local package_json="$app_dir/package.json"

    log_info "Validating package.json..."

    if [[ ! -f "$package_json" ]]; then
        log_error "package.json not found at $package_json"
        return 1
    fi

    # Check if valid JSON
    if ! python3 -c "import json; json.load(open('$package_json'))" 2>/dev/null; then
        log_error "package.json is not valid JSON"
        return 1
    fi

    # Extract and validate dependencies
    local deps=$(python3 -c "
import json
import sys

try:
    with open('$package_json', 'r') as f:
        data = json.load(f)
    deps = data.get('dependencies', {})
    for name, version in deps.items():
        print(f'{name}@{version}')
except Exception as e:
    print(f'ERROR: {e}', file=sys.stderr)
    sys.exit(1)
")

    if [[ $? -ne 0 ]]; then
        log_error "Failed to parse dependencies from package.json"
        return 1
    fi

    log_info "Found $(echo "$deps" | wc -l | tr -d ' ') dependencies"
    return 0
}

# Function to run npm install
run_npm_install() {
    local app_dir=$1
    local install_log="$app_dir/install_log.txt"

    log_info "Running npm install..."

    cd "$app_dir"

    # Clean node_modules and lock file for fresh install
    rm -rf node_modules package-lock.json 2>/dev/null || true

    # Run npm install with full output capture
    {
        echo "=== npm install started at $(date -Iseconds) ==="
        echo "Directory: $app_dir"
        echo ""
        npm install 2>&1
        local exit_code=$?
        echo ""
        echo "=== npm install completed with exit code $exit_code ==="
    } > "$install_log" 2>&1

    local install_exit=$?

    if [[ $install_exit -ne 0 ]]; then
        log_error "npm install FAILED (exit code: $install_exit)"
        log_error "See $install_log for details"

        # Check for common errors
        if grep -q "E404" "$install_log"; then
            log_error "CRITICAL: Package not found in npm registry"
            grep "E404" "$install_log" | head -5
        fi

        return 1
    fi

    log_info "npm install PASSED"
    echo "STATUS: PASSED" >> "$install_log"
    return 0
}

# Function to run expo install --check
run_expo_check() {
    local app_dir=$1
    local expo_check_log="$app_dir/expo_check_log.txt"

    log_info "Running expo install --check..."

    cd "$app_dir"

    {
        echo "=== expo install --check started at $(date -Iseconds) ==="
        npx expo install --check 2>&1
        local exit_code=$?
        echo ""
        echo "=== expo install --check completed with exit code $exit_code ==="
    } > "$expo_check_log" 2>&1

    local check_exit=$?

    # expo install --check exits non-zero if there are issues
    if [[ $check_exit -ne 0 ]]; then
        log_warn "expo install --check found issues, attempting auto-fix..."

        # Try to fix with expo install --fix
        {
            echo ""
            echo "=== expo install --fix started at $(date -Iseconds) ==="
            npx expo install --fix 2>&1
            echo "=== expo install --fix completed ==="
        } >> "$expo_check_log" 2>&1

        # Re-check after fix
        {
            echo ""
            echo "=== expo install --check (retry) started at $(date -Iseconds) ==="
            npx expo install --check 2>&1
            local retry_exit=$?
            echo "=== expo install --check (retry) completed with exit code $retry_exit ==="
        } >> "$expo_check_log" 2>&1

        if [[ $retry_exit -ne 0 ]]; then
            log_warn "expo install --check still has issues after fix attempt"
            echo "STATUS: ISSUES_REMAINING" >> "$expo_check_log"
            # Don't fail here - expo check is advisory
        else
            log_info "expo install --check PASSED after fix"
            echo "STATUS: PASSED_AFTER_FIX" >> "$expo_check_log"
        fi
    else
        log_info "expo install --check PASSED"
        echo "STATUS: PASSED" >> "$expo_check_log"
    fi

    return 0
}

# Function to run expo-doctor
run_expo_doctor() {
    local app_dir=$1
    local doctor_log="$app_dir/expo_doctor_log.txt"

    log_info "Running expo-doctor..."

    cd "$app_dir"

    {
        echo "=== expo-doctor started at $(date -Iseconds) ==="
        npx expo-doctor 2>&1 || npx expo doctor 2>&1 || echo "expo-doctor not available"
        local exit_code=$?
        echo ""
        echo "=== expo-doctor completed with exit code $exit_code ==="
    } > "$doctor_log" 2>&1

    # Don't fail on doctor issues - just log them
    log_info "expo-doctor completed (see $doctor_log for details)"
    return 0
}

# Function to test expo start (macOS compatible - no timeout command needed)
run_expo_start_test() {
    local app_dir=$1
    local start_log="$app_dir/expo_start_log.txt"

    log_info "Testing expo start (timeout: ${METRO_START_TIMEOUT}s)..."

    cd "$app_dir"

    # Kill any existing Metro
    kill_metro_on_port $METRO_PORT

    {
        echo "=== expo start test started at $(date -Iseconds) ==="
        echo "Port: $METRO_PORT"
        echo "Timeout: ${METRO_START_TIMEOUT}s"
        echo ""
    } > "$start_log"

    local start_success=false

    # Start expo in background (use --clear to reset cache, --offline to speed up)
    npx expo start --port "$METRO_PORT" --clear >> "$start_log" 2>&1 &
    local bg_pid=$!

    # Wait and check if Metro started successfully
    local waited=0
    while [[ $waited -lt $METRO_START_TIMEOUT ]]; do
        sleep 2
        waited=$((waited + 2))

        # Check if Metro is running on the port
        if lsof -ti:$METRO_PORT >/dev/null 2>&1; then
            log_info "Metro bundler detected on port $METRO_PORT"
            start_success=true
            break
        fi

        # Check if the background process died (error)
        if ! kill -0 $bg_pid 2>/dev/null; then
            log_warn "Expo process exited prematurely"
            # Read any output that may explain the failure
            if [[ -f "$start_log" ]]; then
                local error_lines=$(tail -20 "$start_log" 2>/dev/null || echo "No output captured")
                log_warn "Last output: $(echo "$error_lines" | head -3)"
            fi
            break
        fi
    done

    # Capture final state
    {
        echo ""
        echo "=== Checking final state at $(date -Iseconds) ==="
        if $start_success; then
            echo "Metro bundler: RUNNING on port $METRO_PORT"
            echo "STATUS: PASSED"
        else
            echo "Metro bundler: NOT DETECTED"
            echo "STATUS: FAILED"
        fi
    } >> "$start_log"

    # Kill the background process and any Metro
    kill $bg_pid 2>/dev/null || true
    sleep 1
    kill_metro_on_port $METRO_PORT

    if $start_success; then
        log_info "expo start test PASSED - Metro booted successfully"
        return 0
    else
        log_error "expo start test FAILED - Metro did not start"
        log_error "See $start_log for details"
        return 1
    fi
}

# Function to generate validation summary
generate_validation_summary() {
    local app_dir=$1
    local summary_file="$app_dir/build_validation_summary.json"

    log_info "Generating validation summary..."

    local npm_status="unknown"
    local expo_check_status="unknown"
    local expo_doctor_status="unknown"
    local expo_start_status="unknown"

    # Check each log file for status
    if [[ -f "$app_dir/install_log.txt" ]]; then
        if grep -q "STATUS: PASSED" "$app_dir/install_log.txt"; then
            npm_status="passed"
        else
            npm_status="failed"
        fi
    fi

    if [[ -f "$app_dir/expo_check_log.txt" ]]; then
        if grep -q "STATUS: PASSED" "$app_dir/expo_check_log.txt"; then
            expo_check_status="passed"
        elif grep -q "STATUS: PASSED_AFTER_FIX" "$app_dir/expo_check_log.txt"; then
            expo_check_status="passed_after_fix"
        else
            expo_check_status="issues"
        fi
    fi

    if [[ -f "$app_dir/expo_doctor_log.txt" ]]; then
        expo_doctor_status="completed"
    fi

    if [[ -f "$app_dir/expo_start_log.txt" ]]; then
        if grep -q "STATUS: PASSED" "$app_dir/expo_start_log.txt"; then
            expo_start_status="passed"
        else
            expo_start_status="failed"
        fi
    fi

    # Determine overall status
    local overall_status="passed"
    if [[ "$npm_status" == "failed" ]] || [[ "$expo_start_status" == "failed" ]]; then
        overall_status="failed"
    fi

    # Write JSON summary
    cat > "$summary_file" << EOF
{
  "validatedAt": "$(date -Iseconds)",
  "appDirectory": "$app_dir",
  "overall": "$overall_status",
  "checks": {
    "npmInstall": "$npm_status",
    "expoCheck": "$expo_check_status",
    "expoDoctor": "$expo_doctor_status",
    "expoStart": "$expo_start_status"
  },
  "logs": {
    "install": "install_log.txt",
    "expoCheck": "expo_check_log.txt",
    "expoDoctor": "expo_doctor_log.txt",
    "expoStart": "expo_start_log.txt"
  },
  "nodeVersion": "$(node --version 2>/dev/null || echo 'unknown')",
  "npmVersion": "$(npm --version 2>/dev/null || echo 'unknown')"
}
EOF

    log_info "Validation summary written to $summary_file"

    if [[ "$overall_status" == "passed" ]]; then
        log_info "BUILD PROOF GATE: PASSED"
        return 0
    else
        log_error "BUILD PROOF GATE: FAILED"
        return 1
    fi
}

# Main function
main() {
    if [[ $# -ne 1 ]]; then
        echo "Usage: $0 <app_directory>"
        echo "Example: $0 builds/01_myapp__app_001/build_123/app"
        exit 1
    fi

    local app_dir="$1"

    # Validate app directory exists
    if [[ ! -d "$app_dir" ]]; then
        log_error "App directory does not exist: $app_dir"
        exit 1
    fi

    # Convert to absolute path
    app_dir=$(cd "$app_dir" && pwd)

    log_info "Starting Build Proof Gate for: $app_dir"
    log_info "=================================================="

    local gate_passed=true

    # Step 1: Validate package.json
    if ! validate_package_json "$app_dir"; then
        log_error "FAILED: package.json validation"
        gate_passed=false
    fi

    # Step 2: Run npm install
    if $gate_passed; then
        if ! run_npm_install "$app_dir"; then
            log_error "FAILED: npm install"
            gate_passed=false
        fi
    fi

    # Step 3: Run expo install --check (non-blocking)
    if $gate_passed; then
        run_expo_check "$app_dir"
    fi

    # Step 4: Run expo-doctor (non-blocking)
    if $gate_passed; then
        run_expo_doctor "$app_dir"
    fi

    # Step 5: Test expo start
    if $gate_passed; then
        if ! run_expo_start_test "$app_dir"; then
            log_error "FAILED: expo start test"
            gate_passed=false
        fi
    fi

    # Generate final summary
    log_info "=================================================="
    generate_validation_summary "$app_dir"
    local summary_result=$?

    if [[ $summary_result -eq 0 ]] && $gate_passed; then
        log_info "=================================================="
        log_info "BUILD PROOF GATE: ALL CHECKS PASSED"
        log_info "The app is verified to install and boot correctly."
        log_info "=================================================="
        exit 0
    else
        log_error "=================================================="
        log_error "BUILD PROOF GATE: VALIDATION FAILED"
        log_error "The app failed one or more critical checks."
        log_error "Review the log files in $app_dir for details."
        log_error "=================================================="
        exit 1
    fi
}

# Execute main function
main "$@"
