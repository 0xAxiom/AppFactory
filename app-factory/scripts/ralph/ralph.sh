#!/bin/bash
#
# Ralph Wiggum - Iterative Claude Code Loop
#
# A bash-driven iteration loop that re-feeds prompts into Claude Code
# repeatedly and tracks progress via prd.json until quality criteria are met.
#
# Usage:
#   ./ralph.sh <max_iterations> [--milestone <n>] [--run-dir <path>]
#
# Requirements:
#   - jq (JSON processor)
#   - claude (Claude Code CLI)
#
# Output:
#   - progress.txt: Human-readable progress log
#   - prd.json: Machine-readable story/milestone status
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RALPH_DIR="$SCRIPT_DIR"

# Default values
MAX_ITERATIONS="${1:-5}"
MILESTONE=""
RUN_DIR=""
QUALITY_THRESHOLD=97

# Parse arguments
shift || true
while [[ $# -gt 0 ]]; do
    case $1 in
        --milestone)
            MILESTONE="$2"
            shift 2
            ;;
        --run-dir)
            RUN_DIR="$2"
            shift 2
            ;;
        --threshold)
            QUALITY_THRESHOLD="$2"
            shift 2
            ;;
        *)
            echo "Unknown argument: $1"
            exit 1
            ;;
    esac
done

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[RALPH]${NC} $1"
    echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] INFO: $1" >> "$PROGRESS_FILE"
}

log_success() {
    echo -e "${GREEN}[RALPH]${NC} $1"
    echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] SUCCESS: $1" >> "$PROGRESS_FILE"
}

log_warn() {
    echo -e "${YELLOW}[RALPH]${NC} $1"
    echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] WARN: $1" >> "$PROGRESS_FILE"
}

log_error() {
    echo -e "${RED}[RALPH]${NC} $1"
    echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] ERROR: $1" >> "$PROGRESS_FILE"
}

# Check dependencies
check_dependencies() {
    if ! command -v jq &> /dev/null; then
        log_error "jq is required but not installed. Install with: brew install jq"
        exit 1
    fi

    if ! command -v claude &> /dev/null; then
        log_error "claude CLI is required but not installed."
        exit 1
    fi
}

# Initialize or load PRD
init_prd() {
    if [[ -n "$RUN_DIR" ]] && [[ -f "$RUN_DIR/ralph/prd.json" ]]; then
        PRD_FILE="$RUN_DIR/ralph/prd.json"
        PROGRESS_FILE="$RUN_DIR/ralph/progress.txt"
        PROMPT_FILE="$RUN_DIR/ralph/prompt.md"
        mkdir -p "$RUN_DIR/ralph"
    else
        PRD_FILE="$RALPH_DIR/prd.json"
        PROGRESS_FILE="$RALPH_DIR/progress.txt"
        PROMPT_FILE="$RALPH_DIR/prompt.md"
    fi

    # Initialize progress file if not exists
    if [[ ! -f "$PROGRESS_FILE" ]]; then
        echo "# Ralph Wiggum Progress Log" > "$PROGRESS_FILE"
        echo "# Started: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> "$PROGRESS_FILE"
        echo "" >> "$PROGRESS_FILE"
    fi

    # Initialize PRD if not exists
    if [[ ! -f "$PRD_FILE" ]]; then
        cat > "$PRD_FILE" << 'EOFPRD'
{
  "version": "1.0",
  "project": "app-factory-build",
  "created": "",
  "updated": "",
  "milestones": [],
  "current_milestone": 0,
  "total_iterations": 0,
  "status": "pending"
}
EOFPRD
        # Set creation timestamp
        local now=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
        jq --arg now "$now" '.created = $now | .updated = $now' "$PRD_FILE" > "$PRD_FILE.tmp" && mv "$PRD_FILE.tmp" "$PRD_FILE"
    fi
}

# Calculate quality percentage for a milestone
calculate_quality() {
    local milestone_idx="$1"

    local total=$(jq -r ".milestones[$milestone_idx].checklist | length" "$PRD_FILE")
    local passed=$(jq -r ".milestones[$milestone_idx].checklist | map(select(.status == \"passed\")) | length" "$PRD_FILE")
    local critical_failed=$(jq -r ".milestones[$milestone_idx].checklist | map(select(.critical == true and .status == \"failed\")) | length" "$PRD_FILE")

    # If any critical item failed, quality is 0
    if [[ "$critical_failed" -gt 0 ]]; then
        echo "0"
        return
    fi

    if [[ "$total" -eq 0 ]]; then
        echo "100"
        return
    fi

    # Calculate percentage
    local percentage=$((passed * 100 / total))
    echo "$percentage"
}

# Update milestone status in PRD
update_milestone_status() {
    local milestone_idx="$1"
    local status="$2"
    local quality="$3"

    local now=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    jq --argjson idx "$milestone_idx" \
       --arg status "$status" \
       --argjson quality "$quality" \
       --arg now "$now" \
       '.milestones[$idx].status = $status | .milestones[$idx].quality = $quality | .updated = $now' \
       "$PRD_FILE" > "$PRD_FILE.tmp" && mv "$PRD_FILE.tmp" "$PRD_FILE"
}

# Update checklist item status
update_checklist_item() {
    local milestone_idx="$1"
    local item_idx="$2"
    local status="$3"

    jq --argjson m_idx "$milestone_idx" \
       --argjson i_idx "$item_idx" \
       --arg status "$status" \
       '.milestones[$m_idx].checklist[$i_idx].status = $status' \
       "$PRD_FILE" > "$PRD_FILE.tmp" && mv "$PRD_FILE.tmp" "$PRD_FILE"
}

# Increment total iterations
increment_iterations() {
    jq '.total_iterations += 1' "$PRD_FILE" > "$PRD_FILE.tmp" && mv "$PRD_FILE.tmp" "$PRD_FILE"
}

# Generate milestone-specific prompt
generate_prompt() {
    local milestone_idx="$1"

    local milestone_name=$(jq -r ".milestones[$milestone_idx].name" "$PRD_FILE")
    local milestone_desc=$(jq -r ".milestones[$milestone_idx].description" "$PRD_FILE")
    local checklist=$(jq -r ".milestones[$milestone_idx].checklist | map(\"- [ ] \" + .item + if .critical then \" (CRITICAL)\" else \"\" end) | join(\"\n\")" "$PRD_FILE")

    cat > "$PROMPT_FILE" << EOFPROMPT
# Ralph Wiggum - Milestone Review

## Current Milestone: $milestone_name

### Description
$milestone_desc

### Verification Checklist
$checklist

### Instructions

1. Review the current state of the build for this milestone
2. Run any verification commands (tests, lint, typecheck, build)
3. For each checklist item:
   - If it passes, note it as PASSED
   - If it fails, fix the issue and verify
4. Continue until all items pass or you've exhausted reasonable fixes
5. Report final status with:
   - List of passed items
   - List of failed items (with reasons)
   - Quality percentage: (passed / total) * 100

### Quality Threshold: ${QUALITY_THRESHOLD}%

All critical items must pass. Overall quality must reach ${QUALITY_THRESHOLD}% to proceed.

### Output Format

At the end of your work, write a JSON block with the results:

\`\`\`json
{
  "milestone": "$milestone_name",
  "quality_percentage": <number>,
  "passed_items": [<indices of passed items>],
  "failed_items": [<indices of failed items>],
  "critical_failures": <number>,
  "status": "passed" | "failed",
  "notes": "<summary>"
}
\`\`\`
EOFPROMPT

    log_info "Generated prompt for milestone: $milestone_name"
}

# Run Claude Code iteration
run_claude_iteration() {
    local iteration="$1"

    log_info "Starting iteration $iteration of $MAX_ITERATIONS"

    # Run claude with the prompt file
    if [[ -f "$PROMPT_FILE" ]]; then
        # Use claude with the prompt file as input
        # The --print flag outputs result without interactive mode
        local result_file="$RALPH_DIR/iteration_${iteration}_result.md"

        claude --print < "$PROMPT_FILE" > "$result_file" 2>&1 || {
            log_warn "Claude returned non-zero exit code"
        }

        log_info "Iteration $iteration complete. Results in: $result_file"
        return 0
    else
        log_error "No prompt file found at $PROMPT_FILE"
        return 1
    fi
}

# Main Ralph loop
run_ralph_loop() {
    local milestone_idx="${MILESTONE:-0}"

    log_info "Starting Ralph Wiggum loop"
    log_info "Max iterations: $MAX_ITERATIONS"
    log_info "Quality threshold: $QUALITY_THRESHOLD%"

    if [[ -n "$MILESTONE" ]]; then
        log_info "Target milestone: $MILESTONE"
    fi

    local iteration=1
    local quality=0

    while [[ $iteration -le $MAX_ITERATIONS ]]; do
        log_info "=== Iteration $iteration ==="

        # Generate milestone-specific prompt
        generate_prompt "$milestone_idx"

        # Run Claude iteration
        run_claude_iteration "$iteration"

        # Calculate quality after iteration
        quality=$(calculate_quality "$milestone_idx")

        log_info "Quality after iteration $iteration: $quality%"

        # Check if we've reached threshold
        if [[ "$quality" -ge "$QUALITY_THRESHOLD" ]]; then
            log_success "Quality threshold reached: $quality% >= $QUALITY_THRESHOLD%"
            update_milestone_status "$milestone_idx" "completed" "$quality"
            break
        else
            log_warn "Quality below threshold: $quality% < $QUALITY_THRESHOLD%"
            update_milestone_status "$milestone_idx" "in_progress" "$quality"
        fi

        increment_iterations
        iteration=$((iteration + 1))
    done

    if [[ "$quality" -lt "$QUALITY_THRESHOLD" ]]; then
        log_error "Failed to reach quality threshold after $MAX_ITERATIONS iterations"
        update_milestone_status "$milestone_idx" "failed" "$quality"
        return 1
    fi

    return 0
}

# Print summary
print_summary() {
    echo ""
    echo "=========================================="
    echo "         RALPH WIGGUM SUMMARY           "
    echo "=========================================="
    echo ""

    local total_milestones=$(jq -r '.milestones | length' "$PRD_FILE")
    local completed=$(jq -r '.milestones | map(select(.status == "completed")) | length' "$PRD_FILE")
    local failed=$(jq -r '.milestones | map(select(.status == "failed")) | length' "$PRD_FILE")
    local total_iterations=$(jq -r '.total_iterations' "$PRD_FILE")

    echo "Milestones: $completed/$total_milestones completed"
    echo "Failed: $failed"
    echo "Total iterations: $total_iterations"
    echo ""

    if [[ "$failed" -eq 0 ]] && [[ "$completed" -eq "$total_milestones" ]]; then
        echo -e "${GREEN}STATUS: ALL MILESTONES PASSED${NC}"
    elif [[ "$failed" -gt 0 ]]; then
        echo -e "${RED}STATUS: FAILED${NC}"
    else
        echo -e "${YELLOW}STATUS: IN PROGRESS${NC}"
    fi

    echo ""
    echo "Progress log: $PROGRESS_FILE"
    echo "PRD file: $PRD_FILE"
}

# Main entry point
main() {
    echo ""
    echo "=========================================="
    echo "         RALPH WIGGUM v1.0              "
    echo "     Iterative Quality Assurance        "
    echo "=========================================="
    echo ""

    check_dependencies
    init_prd

    if run_ralph_loop; then
        print_summary
        exit 0
    else
        print_summary
        exit 1
    fi
}

# Run if executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main
fi
