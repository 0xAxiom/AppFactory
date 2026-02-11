#!/bin/bash
#
# Ralph QA Runner - Repository-wide quality assurance automation
#
# Runs Ralph QA iterations across any pipeline in the App Factory repository.
# Follows the methodology documented in ralph/README.md and ralph/NEXT_PROMPTS.md.
#
# Usage:
#   ./ralph/run-ralph.sh <pipeline> <iteration>
#   ./ralph/run-ralph.sh app-factory 2
#   ./ralph/run-ralph.sh all 3
#
# Arguments:
#   pipeline    - Pipeline name (app-factory, dapp-factory, agent-factory,
#                 plugin-factory, website-pipeline, miniapp-pipeline, or "all")
#   iteration   - Iteration number (1-5)
#
# Output:
#   - Updates ralph/RUN_LOG.md with iteration results
#   - Creates ralph/iterations/<pipeline>/<iteration>/ with artifacts
#
# Requirements:
#   - claude (Claude Code CLI)
#   - Repository root as working directory
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get script directory (ralph/)
RALPH_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$RALPH_DIR/.." && pwd)"

# Validation
if [[ $# -lt 2 ]]; then
    echo -e "${RED}ERROR: Missing arguments${NC}"
    echo ""
    echo "Usage: $0 <pipeline> <iteration>"
    echo ""
    echo "Examples:"
    echo "  $0 app-factory 2         # Run iteration 2 for app-factory"
    echo "  $0 website-pipeline 3    # Run iteration 3 for website-pipeline"
    echo "  $0 all 1                 # Run iteration 1 for all pipelines"
    echo ""
    echo "Pipelines:"
    echo "  - app-factory"
    echo "  - dapp-factory"
    echo "  - agent-factory"
    echo "  - plugin-factory"
    echo "  - website-pipeline"
    echo "  - miniapp-pipeline"
    echo "  - all (runs for all pipelines)"
    echo ""
    echo "Iterations: 1-5"
    exit 1
fi

PIPELINE="$1"
ITERATION="$2"

# Validate iteration number
if [[ ! "$ITERATION" =~ ^[1-5]$ ]]; then
    echo -e "${RED}ERROR: Iteration must be 1-5${NC}"
    exit 1
fi

# Pipeline list
PIPELINES=(
    "app-factory"
    "dapp-factory"
    "agent-factory"
    "plugin-factory"
    "website-pipeline"
    "miniapp-pipeline"
)

# Validate pipeline or handle "all"
if [[ "$PIPELINE" != "all" ]]; then
    VALID=false
    for p in "${PIPELINES[@]}"; do
        if [[ "$p" == "$PIPELINE" ]]; then
            VALID=true
            break
        fi
    done

    if [[ "$VALID" != "true" ]]; then
        echo -e "${RED}ERROR: Invalid pipeline: $PIPELINE${NC}"
        echo "Valid pipelines: ${PIPELINES[*]} or 'all'"
        exit 1
    fi

    TARGETS=("$PIPELINE")
else
    TARGETS=("${PIPELINES[@]}")
fi

# Generate focus area based on iteration
get_focus_area() {
    local iter="$1"
    case "$iter" in
        1) echo "Initial documentation review and structure" ;;
        2) echo "Link validation, example completeness" ;;
        3) echo "Usability - Can new users follow quickstart?" ;;
        4) echo "Correctness - Do commands actually work?" ;;
        5) echo "Final polish - Any remaining issues?" ;;
    esac
}

# Run Ralph iteration for a single pipeline
run_iteration() {
    local pipeline="$1"
    local iteration="$2"

    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}Ralph QA - $pipeline - Iteration $iteration${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""

    # Create iteration directory
    ITERATION_DIR="$RALPH_DIR/iterations/$pipeline/$iteration"
    mkdir -p "$ITERATION_DIR"

    # Generate prompt
    local focus="$(get_focus_area "$iteration")"
    local prompt_file="$ITERATION_DIR/prompt.md"

    cat > "$prompt_file" << EOFPROMPT
# Ralph QA - $pipeline - Iteration $iteration

## Objective

Run a Ralph quality assurance iteration for the **$pipeline** pipeline.

## Instructions

1. **Read the pipeline documentation:**
   - \`$pipeline/README.md\`
   - \`$pipeline/CLAUDE.md\`

2. **Read the acceptance criteria:**
   - \`ralph/COMMON_ACCEPTANCE.md\`

3. **Check against acceptance criteria:**
   - Identify the single biggest gap or improvement opportunity
   - Focus area for iteration $iteration: **$focus**

4. **Make ONE surgical fix:**
   - Fix the identified issue
   - Keep changes minimal and focused
   - Do not make unrelated changes

5. **Verify with concrete check:**
   - Run commands to verify the fix works
   - Check file existence, link validity, etc.
   - Document verification in your response

6. **Log the result:**
   - Append to \`ralph/RUN_LOG.md\` following existing format
   - Include:
     - Pipeline name
     - Iteration number
     - Issue found
     - Fix applied
     - Verification performed
     - Timestamp

## Quality Threshold

- All critical items must pass
- Overall documentation quality: aim for clarity, accuracy, and completeness

## Output

At the end of your work, summarize:
- **Issue Found:** Brief description
- **Fix Applied:** What you changed
- **Verification:** How you confirmed it works
- **Status:** PASS or needs further iteration

EOFPROMPT

    echo -e "${GREEN}Generated prompt: $prompt_file${NC}"
    echo ""
    echo -e "${YELLOW}Press ENTER to launch Claude Code with this prompt${NC}"
    echo -e "${YELLOW}(Ctrl+C to cancel)${NC}"
    read -r

    # Launch Claude Code with the prompt
    # Note: This opens an interactive session, not automated execution
    cd "$REPO_ROOT"
    claude < "$prompt_file" || {
        echo -e "${RED}Claude exited with error${NC}"
        return 1
    }

    echo ""
    echo -e "${GREEN}Iteration complete for $pipeline${NC}"
    echo ""

    return 0
}

# Main execution
main() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}Ralph QA Runner v1.0${NC}"
    echo -e "${BLUE}Repository-wide Quality Assurance${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""

    echo "Repository: $REPO_ROOT"
    echo "Ralph workspace: $RALPH_DIR"
    echo "Target(s): ${TARGETS[*]}"
    echo "Iteration: $ITERATION"
    echo ""

    for target in "${TARGETS[@]}"; do
        if ! run_iteration "$target" "$ITERATION"; then
            echo -e "${RED}Failed to complete iteration for $target${NC}"
            exit 1
        fi
    done

    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}All iterations complete${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo "Review results in: $RALPH_DIR/iterations/"
    echo "Update log: $RALPH_DIR/RUN_LOG.md"
    echo ""
}

# Run main
main
