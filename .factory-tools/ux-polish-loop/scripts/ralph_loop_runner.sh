#!/bin/bash

# Ralph Loop Runner
# UX Polish Loop for React/Next.js projects
#
# Usage: ./scripts/ralph_loop_runner.sh [--max-passes N] [--auto-fix]
#
# Options:
#   --max-passes N    Maximum number of passes (default: 20)
#   --auto-fix        Attempt to auto-fix lint issues
#   --help            Show this help message

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Configuration
MAX_PASSES=20
AUTO_FIX=false
COMPLETION_PROMISE="COMPLETION_PROMISE: All acceptance criteria met. UI is production-ready."

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --max-passes)
            MAX_PASSES="$2"
            shift 2
            ;;
        --auto-fix)
            AUTO_FIX=true
            shift
            ;;
        --help)
            echo "Ralph Loop Runner - UX Polish Loop for React/Next.js projects"
            echo ""
            echo "Usage: ./scripts/ralph_loop_runner.sh [--max-passes N] [--auto-fix]"
            echo ""
            echo "Options:"
            echo "  --max-passes N    Maximum number of passes (default: 20)"
            echo "  --auto-fix        Attempt to auto-fix lint issues"
            echo "  --help            Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Functions
print_header() {
    echo ""
    echo -e "${BOLD}${BLUE}============================================================${NC}"
    echo -e "${BOLD}${BLUE}  Ralph UX Polish Loop${NC}"
    echo -e "${BOLD}${BLUE}============================================================${NC}"
    echo ""
}

print_pass_header() {
    local pass=$1
    echo ""
    echo -e "${BOLD}${CYAN}------------------------------------------------------------${NC}"
    echo -e "${BOLD}${CYAN}  Pass $pass / $MAX_PASSES${NC}"
    echo -e "${BOLD}${CYAN}------------------------------------------------------------${NC}"
    echo ""
}

check_prerequisites() {
    echo -e "${BLUE}Checking prerequisites...${NC}"

    # Check for package.json
    if [ ! -f "package.json" ]; then
        echo -e "${RED}Error: package.json not found. Are you in a project directory?${NC}"
        exit 1
    fi

    # Check for ralph directory
    if [ ! -d "ralph" ]; then
        echo -e "${RED}Error: ralph/ directory not found.${NC}"
        echo "This project needs ralph/ files for the polish loop."
        exit 1
    fi

    # Check for required ralph files
    for file in PRD.md ACCEPTANCE.md LOOP.md PROGRESS.md QA_NOTES.md; do
        if [ ! -f "ralph/$file" ]; then
            echo -e "${YELLOW}Warning: ralph/$file not found${NC}"
        fi
    done

    # Check for node_modules
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}node_modules not found. Running npm install...${NC}"
        npm install
    fi

    # Check for Playwright
    if ! grep -q '"test:e2e"' package.json; then
        echo -e "${YELLOW}Warning: test:e2e script not found in package.json${NC}"
    fi

    echo -e "${GREEN}Prerequisites OK${NC}"
    echo ""
}

run_check() {
    local name=$1
    local cmd=$2
    local result=""

    echo -n "  $name: "

    if eval "$cmd" > /tmp/ralph_check_output.txt 2>&1; then
        echo -e "${GREEN}PASS${NC}"
        result="PASS"
    else
        echo -e "${RED}FAIL${NC}"
        result="FAIL"
    fi

    echo "$result"
}

run_all_checks() {
    echo -e "${BLUE}Running checks...${NC}"

    local lint_result="N/A"
    local typecheck_result="N/A"
    local test_result="N/A"
    local e2e_result="N/A"

    # Lint
    if grep -q '"lint"' package.json; then
        if $AUTO_FIX && grep -q '"lint:fix"' package.json; then
            lint_result=$(run_check "lint (auto-fix)" "npm run lint:fix")
        else
            lint_result=$(run_check "lint" "npm run lint")
        fi
    else
        echo "  lint: N/A (no script)"
    fi

    # Typecheck
    if grep -q '"typecheck"' package.json; then
        typecheck_result=$(run_check "typecheck" "npm run typecheck")
    elif grep -q '"type-check"' package.json; then
        typecheck_result=$(run_check "typecheck" "npm run type-check")
    else
        echo "  typecheck: N/A (no script)"
    fi

    # Unit tests
    if grep -q '"test"' package.json && ! grep -q '"test": "echo' package.json; then
        test_result=$(run_check "test" "npm run test -- --passWithNoTests 2>/dev/null || npm run test")
    else
        echo "  test: N/A (no script)"
    fi

    # E2E tests
    if grep -q '"test:e2e"' package.json; then
        e2e_result=$(run_check "test:e2e" "npm run test:e2e")
    else
        echo "  test:e2e: N/A (no script)"
    fi

    echo ""

    # Export results for logging
    export LINT_RESULT="$lint_result"
    export TYPECHECK_RESULT="$typecheck_result"
    export TEST_RESULT="$test_result"
    export E2E_RESULT="$e2e_result"

    # Return failure if any check failed
    if [[ "$lint_result" == "FAIL" ]] || [[ "$typecheck_result" == "FAIL" ]] ||
       [[ "$test_result" == "FAIL" ]] || [[ "$e2e_result" == "FAIL" ]]; then
        return 1
    fi

    return 0
}

check_completion_promise() {
    if [ -f "ralph/PROGRESS.md" ]; then
        if grep -q "$COMPLETION_PROMISE" ralph/PROGRESS.md; then
            return 0
        fi
    fi
    return 1
}

log_pass() {
    local pass=$1
    local status=$2
    local issue=$3
    local timestamp=$(date '+%Y-%m-%d %H:%M')

    cat >> ralph/PROGRESS.md << EOF

## Pass $pass

**Date:** $timestamp
**Status:** $status

### Checks Run
- lint: ${LINT_RESULT:-N/A}
- typecheck: ${TYPECHECK_RESULT:-N/A}
- test: ${TEST_RESULT:-N/A}
- test:e2e: ${E2E_RESULT:-N/A}

### Issue Addressed
$issue

### Next Iteration Focus
[To be determined in next pass]

EOF
}

update_summary() {
    local total_passes=$1
    local fixes=$2
    local polish=$3
    local status=$4

    # Update the summary table at the top of PROGRESS.md
    if [ -f "ralph/PROGRESS.md" ]; then
        sed -i.bak "s/| Total Passes | .*/| Total Passes | $total_passes |/" ralph/PROGRESS.md
        sed -i.bak "s/| Fixes Applied | .*/| Fixes Applied | $fixes |/" ralph/PROGRESS.md
        sed -i.bak "s/| Polish Applied | .*/| Polish Applied | $polish |/" ralph/PROGRESS.md
        sed -i.bak "s/| Current Status | .*/| Current Status | $status |/" ralph/PROGRESS.md
        rm -f ralph/PROGRESS.md.bak
    fi
}

# Main loop
main() {
    print_header
    check_prerequisites

    local pass=0
    local fixes=0
    local polish=0

    # Check if already completed
    if check_completion_promise; then
        echo -e "${GREEN}${BOLD}Completion promise already present!${NC}"
        echo "The UX polish loop has already completed for this project."
        exit 0
    fi

    echo -e "${BLUE}Starting UX polish loop (max $MAX_PASSES passes)...${NC}"
    echo ""
    echo "This loop will:"
    echo "  1. Run lint, typecheck, and tests"
    echo "  2. Run Playwright E2E tests"
    echo "  3. Report status for human-in-the-loop fixes"
    echo "  4. Continue until completion promise or max passes"
    echo ""
    echo -e "${YELLOW}Press Ctrl+C at any time to stop.${NC}"
    echo ""

    while [ $pass -lt $MAX_PASSES ]; do
        ((pass++))
        print_pass_header $pass

        # Run all checks
        if run_all_checks; then
            echo -e "${GREEN}All checks passed!${NC}"
            echo ""
            echo "Review ACCEPTANCE.md criteria."
            echo "If all criteria are met, add the completion promise to PROGRESS.md:"
            echo ""
            echo -e "  ${CYAN}$COMPLETION_PROMISE${NC}"
            echo ""

            # Log this pass
            log_pass $pass "PASS" "All checks passed. Ready for manual review or polish improvement."
            ((polish++))

            # Wait for user input or check for completion
            echo -e "${YELLOW}Options:${NC}"
            echo "  1. Run 'claude' to implement a polish improvement"
            echo "  2. Write completion promise to ralph/PROGRESS.md if done"
            echo "  3. Press Enter to run checks again"
            echo "  4. Press Ctrl+C to stop"
            echo ""
            read -p "Press Enter to continue to next pass... "

        else
            echo -e "${RED}Some checks failed.${NC}"
            echo ""
            echo "Review the output above and fix the highest-impact issue."
            echo "Then run this script again."
            echo ""

            # Log this pass
            log_pass $pass "FAIL" "Checks failed. Human intervention needed."
            ((fixes++))

            # For human-in-the-loop, we pause here
            echo -e "${YELLOW}Fix the issue above, then press Enter to continue.${NC}"
            read -p "Press Enter after fixing... "
        fi

        update_summary $pass $fixes $polish "In Progress"

        # Check for completion promise
        if check_completion_promise; then
            echo ""
            echo -e "${GREEN}${BOLD}============================================================${NC}"
            echo -e "${GREEN}${BOLD}  COMPLETION PROMISE DETECTED!${NC}"
            echo -e "${GREEN}${BOLD}============================================================${NC}"
            echo ""
            echo "The UX polish loop has completed successfully."
            echo "Total passes: $pass"
            echo "Fixes applied: $fixes"
            echo "Polish applied: $polish"
            echo ""
            update_summary $pass $fixes $polish "COMPLETED"
            exit 0
        fi
    done

    # Max passes reached
    echo ""
    echo -e "${YELLOW}${BOLD}============================================================${NC}"
    echo -e "${YELLOW}${BOLD}  MAX PASSES REACHED ($MAX_PASSES)${NC}"
    echo -e "${YELLOW}${BOLD}============================================================${NC}"
    echo ""
    echo "The loop stopped at the maximum number of passes."
    echo "Review ralph/QA_NOTES.md and PROGRESS.md for status."
    echo ""
    echo "If the UI is ready, manually add the completion promise:"
    echo -e "  ${CYAN}$COMPLETION_PROMISE${NC}"
    echo ""

    update_summary $pass $fixes $polish "Max Passes Reached"
    exit 1
}

# Run main
main
