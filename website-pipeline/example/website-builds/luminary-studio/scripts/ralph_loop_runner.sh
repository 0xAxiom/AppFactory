#!/bin/bash

# Ralph Loop Runner
# UX Polish Loop for Luminary Studio
#
# Usage: ./scripts/ralph_loop_runner.sh [--max-passes N] [--auto-fix]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'
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
            echo "Ralph Loop Runner - UX Polish Loop"
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

print_header() {
    echo ""
    echo -e "${BOLD}${BLUE}============================================================${NC}"
    echo -e "${BOLD}${BLUE}  Ralph UX Polish Loop - Luminary Studio${NC}"
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

    if [ ! -f "package.json" ]; then
        echo -e "${RED}Error: package.json not found.${NC}"
        exit 1
    fi

    if [ ! -d "ralph" ]; then
        echo -e "${RED}Error: ralph/ directory not found.${NC}"
        exit 1
    fi

    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing dependencies...${NC}"
        npm install
    fi

    # Check for Playwright
    if ! npx playwright --version > /dev/null 2>&1; then
        echo -e "${YELLOW}Installing Playwright browsers...${NC}"
        npx playwright install chromium
    fi

    echo -e "${GREEN}Prerequisites OK${NC}"
    echo ""
}

run_check() {
    local name=$1
    local cmd=$2

    echo -n "  $name: "

    if eval "$cmd" > /tmp/ralph_check_output.txt 2>&1; then
        echo -e "${GREEN}PASS${NC}"
        echo "PASS"
    else
        echo -e "${RED}FAIL${NC}"
        echo "FAIL"
    fi
}

run_all_checks() {
    echo -e "${BLUE}Running checks...${NC}"

    LINT_RESULT=$(run_check "lint" "npm run lint")
    TYPECHECK_RESULT=$(run_check "typecheck" "npm run typecheck")
    E2E_RESULT=$(run_check "test:e2e" "npm run test:e2e -- --project=chromium")

    echo ""

    if [[ "$LINT_RESULT" == "FAIL" ]] || [[ "$TYPECHECK_RESULT" == "FAIL" ]] || [[ "$E2E_RESULT" == "FAIL" ]]; then
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

    if [ -f "ralph/PROGRESS.md" ]; then
        sed -i.bak "s/| Total Passes | .*/| Total Passes | $total_passes |/" ralph/PROGRESS.md
        sed -i.bak "s/| Fixes Applied | .*/| Fixes Applied | $fixes |/" ralph/PROGRESS.md
        sed -i.bak "s/| Polish Applied | .*/| Polish Applied | $polish |/" ralph/PROGRESS.md
        sed -i.bak "s/| Current Status | .*/| Current Status | $status |/" ralph/PROGRESS.md
        rm -f ralph/PROGRESS.md.bak
    fi
}

main() {
    print_header
    check_prerequisites

    local pass=0
    local fixes=0
    local polish=0

    if check_completion_promise; then
        echo -e "${GREEN}${BOLD}Completion promise already present!${NC}"
        exit 0
    fi

    echo -e "${BLUE}Starting UX polish loop (max $MAX_PASSES passes)...${NC}"
    echo ""
    echo "This loop will:"
    echo "  1. Run lint, typecheck, and E2E tests"
    echo "  2. Report status for human-in-the-loop fixes"
    echo "  3. Continue until completion promise or max passes"
    echo ""
    echo -e "${YELLOW}Press Ctrl+C to stop.${NC}"
    echo ""

    while [ $pass -lt $MAX_PASSES ]; do
        ((pass++))
        print_pass_header $pass

        if run_all_checks; then
            echo -e "${GREEN}All checks passed!${NC}"
            echo ""
            echo "Review ACCEPTANCE.md criteria."
            echo "If all criteria met, add completion promise to PROGRESS.md:"
            echo ""
            echo -e "  ${CYAN}$COMPLETION_PROMISE${NC}"
            echo ""

            log_pass $pass "PASS" "All checks passed. Ready for review or polish."
            ((polish++))

            echo -e "${YELLOW}Options:${NC}"
            echo "  1. Run 'claude' to implement a polish improvement"
            echo "  2. Write completion promise if done"
            echo "  3. Press Enter to run checks again"
            echo ""
            read -p "Press Enter to continue... "
        else
            echo -e "${RED}Some checks failed.${NC}"
            echo ""
            echo "Review output and fix the highest-impact issue."
            echo ""

            log_pass $pass "FAIL" "Checks failed. Human intervention needed."
            ((fixes++))

            echo -e "${YELLOW}Fix the issue, then press Enter.${NC}"
            read -p "Press Enter after fixing... "
        fi

        update_summary $pass $fixes $polish "In Progress"

        if check_completion_promise; then
            echo ""
            echo -e "${GREEN}${BOLD}============================================================${NC}"
            echo -e "${GREEN}${BOLD}  COMPLETION PROMISE DETECTED!${NC}"
            echo -e "${GREEN}${BOLD}============================================================${NC}"
            echo ""
            echo "Total passes: $pass"
            echo "Fixes: $fixes, Polish: $polish"
            echo ""
            update_summary $pass $fixes $polish "COMPLETED"
            exit 0
        fi
    done

    echo ""
    echo -e "${YELLOW}${BOLD}MAX PASSES REACHED ($MAX_PASSES)${NC}"
    echo ""
    update_summary $pass $fixes $polish "Max Passes Reached"
    exit 1
}

main
