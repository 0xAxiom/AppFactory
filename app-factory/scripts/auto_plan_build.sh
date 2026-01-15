#!/bin/bash
#
# Auto Plan + Build Mode (Ralph-Gated)
#
# Primary entrypoint for App Factory that executes:
# 1. Planning phase - Generate comprehensive plan artifact
# 2. Implementation phase - Build milestone by milestone
# 3. Ralph gating - Quality assurance at ≥97% per milestone
#
# Usage:
#   ./auto_plan_build.sh --idea "Your app idea here"
#   ./auto_plan_build.sh --idea-file path/to/idea.md
#   ./auto_plan_build.sh  (interactive mode)
#
# Requirements:
#   - jq (JSON processor)
#   - claude (Claude Code CLI)
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FACTORY_DIR="$(dirname "$SCRIPT_DIR")"
RALPH_DIR="$SCRIPT_DIR/ralph"

# Default values
IDEA=""
IDEA_FILE=""
INTERACTIVE=false
QUALITY_THRESHOLD=97
MAX_ITERATIONS_PER_MILESTONE=5

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Print banner
print_banner() {
    echo ""
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}     ${BOLD}APP FACTORY - Auto Plan + Build Mode${NC}                     ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}     ${BLUE}Ralph-Gated Quality Assurance (≥97%)${NC}                     ${CYAN}║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo ""
    echo -e "${BOLD}${CYAN}▶ $1${NC}"
    echo ""
}

# Print usage
print_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --idea \"<description>\"   App idea as a string"
    echo "  --idea-file <path>       Path to file containing app idea"
    echo "  --threshold <number>     Quality threshold (default: 97)"
    echo "  --max-iterations <n>     Max iterations per milestone (default: 5)"
    echo "  --help                   Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --idea \"A meditation app with guided sessions\""
    echo "  $0 --idea-file ~/ideas/my-app.md"
    echo "  $0  # Interactive mode"
}

# Parse arguments
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --idea)
                IDEA="$2"
                shift 2
                ;;
            --idea-file)
                IDEA_FILE="$2"
                shift 2
                ;;
            --threshold)
                QUALITY_THRESHOLD="$2"
                shift 2
                ;;
            --max-iterations)
                MAX_ITERATIONS_PER_MILESTONE="$2"
                shift 2
                ;;
            --help|-h)
                print_usage
                exit 0
                ;;
            *)
                log_error "Unknown argument: $1"
                print_usage
                exit 1
                ;;
        esac
    done
}

# Check dependencies
check_dependencies() {
    log_step "Checking dependencies..."

    local missing=()

    if ! command -v jq &> /dev/null; then
        missing+=("jq")
    fi

    if ! command -v claude &> /dev/null; then
        missing+=("claude")
    fi

    if [[ ${#missing[@]} -gt 0 ]]; then
        log_error "Missing required dependencies: ${missing[*]}"
        echo ""
        echo "Install instructions:"
        for dep in "${missing[@]}"; do
            case $dep in
                jq)
                    echo "  brew install jq"
                    ;;
                claude)
                    echo "  npm install -g @anthropic/claude-code"
                    ;;
            esac
        done
        exit 1
    fi

    log_success "All dependencies satisfied"
}

# Get idea from user interactively
get_idea_interactive() {
    log_step "Interactive Mode"

    echo "Describe the app you want to build."
    echo "You can write multiple lines. Press Ctrl+D (or Enter twice) when done."
    echo ""
    echo -e "${CYAN}Your app idea:${NC}"

    IDEA=""
    local empty_line_count=0

    while IFS= read -r line; do
        if [[ -z "$line" ]]; then
            empty_line_count=$((empty_line_count + 1))
            if [[ $empty_line_count -ge 2 ]]; then
                break
            fi
        else
            empty_line_count=0
        fi
        IDEA="${IDEA}${line}"$'\n'
    done

    # Trim trailing newlines
    IDEA=$(echo "$IDEA" | sed -e 's/[[:space:]]*$//')

    if [[ -z "$IDEA" ]]; then
        log_error "No idea provided. Exiting."
        exit 1
    fi

    echo ""
    log_info "Captured idea (${#IDEA} characters)"
}

# Load idea from file
load_idea_from_file() {
    if [[ ! -f "$IDEA_FILE" ]]; then
        log_error "Idea file not found: $IDEA_FILE"
        exit 1
    fi

    IDEA=$(cat "$IDEA_FILE")

    if [[ -z "$IDEA" ]]; then
        log_error "Idea file is empty: $IDEA_FILE"
        exit 1
    fi

    log_info "Loaded idea from file: $IDEA_FILE (${#IDEA} characters)"
}

# Create run directory
create_run_directory() {
    log_step "Creating run directory..."

    local date_dir=$(date +"%Y-%m-%d")
    local timestamp=$(date +"%H%M%S")
    RUN_ID="plan-${timestamp}"
    RUN_DIR="$FACTORY_DIR/runs/$date_dir/$RUN_ID"

    mkdir -p "$RUN_DIR/inputs"
    mkdir -p "$RUN_DIR/planning"
    mkdir -p "$RUN_DIR/build"
    mkdir -p "$RUN_DIR/ralph"

    log_success "Run directory: $RUN_DIR"
}

# Save raw input
save_raw_input() {
    local input_file="$RUN_DIR/inputs/user_prompt.md"

    cat > "$input_file" << EOF
# User Prompt

**Captured**: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
**Mode**: Auto Plan + Build

## Raw Input

$IDEA
EOF

    log_info "Saved raw input to: $input_file"
}

# Generate plan artifact
generate_plan() {
    log_step "Phase 1: Generating Plan Artifact..."

    local plan_file="$RUN_DIR/planning/plan.md"
    local plan_prompt="$RUN_DIR/planning/plan_prompt.md"

    # Create the planning prompt
    cat > "$plan_prompt" << 'EOFPROMPT'
# Auto Plan Mode - Generate Implementation Plan

You are Claude Code generating a comprehensive implementation plan for an Expo React Native mobile app.

## Requirements

Generate a thorough plan that includes ALL of the following sections:

### 1. PROJECT OVERVIEW
- App name and one-line pitch
- Value proposition (why users will pay)
- Target audience and use case

### 2. CORE USER LOOP
- Step-by-step flow of primary user interaction
- What triggers the user to open the app
- What value they get each session

### 3. TECH STACK (COMMITTED)
Pick ONE option for each, no alternatives:
- Framework: Expo SDK 54+ with React Native
- Navigation: Expo Router v4
- Language: TypeScript
- State: [Zustand / Context / AsyncStorage]
- Database: [expo-sqlite / AsyncStorage only]
- Monetization: RevenueCat

### 4. PROJECT STRUCTURE
```
builds/<app-slug>/
├── package.json
├── app.config.js
├── tsconfig.json
├── app/           # Expo Router screens
│   ├── _layout.tsx
│   ├── index.tsx
│   └── ...
├── src/
│   ├── components/
│   ├── services/
│   ├── hooks/
│   └── ui/
├── assets/
├── research/
└── aso/
```

### 5. KEY SYSTEMS
For each major system, describe:
- Purpose
- Key files
- Dependencies
- Integration points

Systems to cover:
- Navigation & Routing
- Data Persistence
- Monetization (RevenueCat)
- UI/Design System

### 6. MILESTONES (NUMBERED)

Break implementation into 5-6 milestones:

#### Milestone 1: Project Scaffold
- [ ] Create package.json with dependencies
- [ ] Configure TypeScript
- [ ] Set up Expo Router structure
- [ ] Verify: npm install completes

#### Milestone 2: Core Screens
- [ ] Implement home screen
- [ ] Implement [main feature] screen
- [ ] Basic navigation working
- [ ] Verify: npx expo start boots

#### Milestone 3: Feature Implementation
- [ ] [Feature 1] working
- [ ] [Feature 2] working
- [ ] Data persistence working
- [ ] Verify: Core flow works end-to-end

#### Milestone 4: Monetization
- [ ] RevenueCat SDK integrated
- [ ] Paywall screen complete
- [ ] Premium gating working
- [ ] Verify: Subscription flow works

#### Milestone 5: Polish & Assets
- [ ] Onboarding flow
- [ ] Settings screen
- [ ] App icon and splash screen
- [ ] Verify: All screens polished

#### Milestone 6: Documentation & QA
- [ ] Market research complete
- [ ] ASO artifacts complete
- [ ] Privacy policy
- [ ] Final validation
- [ ] Verify: Ralph Mode PASS

### 7. VERIFICATION STRATEGY
For each milestone, specify:
- Commands to run (npm install, npx expo start, etc.)
- Manual checks needed
- Quality criteria (what "done" looks like)

### 8. RISKS & MITIGATIONS
- Potential blockers
- Fallback strategies

## Output

Write the complete plan as markdown. This plan will be saved to disk and followed during implementation. Be specific and actionable - every item should be implementable without ambiguity.
EOFPROMPT

    # Append the user's idea
    echo "" >> "$plan_prompt"
    echo "## USER'S APP IDEA" >> "$plan_prompt"
    echo "" >> "$plan_prompt"
    echo "$IDEA" >> "$plan_prompt"

    log_info "Created planning prompt"
    log_info "Invoking Claude to generate plan..."

    # Run claude with the planning prompt
    # Note: In actual use, this would invoke claude CLI
    # For now, we create a placeholder that Claude Code will fill in

    cat > "$plan_file" << EOF
# Implementation Plan

**Generated**: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
**Run ID**: $RUN_ID
**Status**: PENDING GENERATION

---

## User Input

$IDEA

---

## Plan Generation

This plan will be generated by Claude Code when the Auto Plan + Build mode is invoked.

The plan should follow the structure defined in:
- \`$plan_prompt\`

And include all 8 required sections:
1. Project Overview
2. Core User Loop
3. Tech Stack
4. Project Structure
5. Key Systems
6. Milestones (numbered with checklists)
7. Verification Strategy
8. Risks & Mitigations

---

*Plan generation pending...*
EOF

    log_info "Plan template created at: $plan_file"
    log_info "To complete: Run claude in $RUN_DIR with the planning prompt"
}

# Initialize Ralph PRD for this run
init_ralph_prd() {
    log_step "Initializing Ralph PRD..."

    local ralph_prd="$RUN_DIR/ralph/prd.json"
    local now=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    # Copy template PRD and customize
    cp "$RALPH_DIR/prd.json" "$ralph_prd"

    # Update timestamps and project name
    jq --arg now "$now" --arg project "$RUN_ID" \
       '.created = $now | .updated = $now | .project = $project' \
       "$ralph_prd" > "$ralph_prd.tmp" && mv "$ralph_prd.tmp" "$ralph_prd"

    log_success "Ralph PRD initialized: $ralph_prd"
}

# Run Ralph for a specific milestone
run_ralph_milestone() {
    local milestone="$1"

    log_step "Running Ralph for Milestone $milestone..."

    "$RALPH_DIR/ralph.sh" "$MAX_ITERATIONS_PER_MILESTONE" \
        --milestone "$milestone" \
        --run-dir "$RUN_DIR" \
        --threshold "$QUALITY_THRESHOLD"

    local exit_code=$?

    if [[ $exit_code -eq 0 ]]; then
        log_success "Milestone $milestone: PASSED (≥${QUALITY_THRESHOLD}%)"
        return 0
    else
        log_error "Milestone $milestone: FAILED to reach ${QUALITY_THRESHOLD}%"
        return 1
    fi
}

# Build summary
create_build_summary() {
    log_step "Creating build summary..."

    local summary_file="$RUN_DIR/build/summary.md"

    cat > "$summary_file" << EOF
# Build Summary

**Run ID**: $RUN_ID
**Completed**: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
**Quality Threshold**: ${QUALITY_THRESHOLD}%

## Input

$(head -c 500 <<< "$IDEA")...

## Artifacts

- Plan: \`planning/plan.md\`
- PRD: \`ralph/prd.json\`
- Progress: \`ralph/progress.txt\`

## Next Steps

1. Review the generated plan in \`planning/plan.md\`
2. Run Claude Code in the run directory to execute the plan
3. Ralph will gate each milestone at ≥${QUALITY_THRESHOLD}% quality

## Commands

\`\`\`bash
# Navigate to run directory
cd $RUN_DIR

# Execute plan with Claude
claude

# Run Ralph manually
../../../scripts/ralph/ralph.sh 5 --run-dir .
\`\`\`
EOF

    log_success "Build summary created: $summary_file"
}

# Print completion message
print_completion() {
    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║${NC}     ${BOLD}AUTO PLAN + BUILD INITIALIZED${NC}                            ${GREEN}║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BOLD}Run Directory:${NC} $RUN_DIR"
    echo ""
    echo -e "${BOLD}Next Steps:${NC}"
    echo "  1. cd $RUN_DIR"
    echo "  2. claude  # Execute the plan"
    echo ""
    echo -e "${BOLD}Files Created:${NC}"
    echo "  - inputs/user_prompt.md"
    echo "  - planning/plan.md"
    echo "  - planning/plan_prompt.md"
    echo "  - ralph/prd.json"
    echo "  - build/summary.md"
    echo ""
    echo -e "${BOLD}Ralph Integration:${NC}"
    echo "  Quality threshold: ${QUALITY_THRESHOLD}%"
    echo "  Max iterations per milestone: ${MAX_ITERATIONS_PER_MILESTONE}"
    echo ""
}

# Main function
main() {
    print_banner

    parse_args "$@"
    check_dependencies

    # Get the idea
    if [[ -n "$IDEA" ]]; then
        log_info "Using idea from --idea argument"
    elif [[ -n "$IDEA_FILE" ]]; then
        load_idea_from_file
    else
        INTERACTIVE=true
        get_idea_interactive
    fi

    # Create run structure
    create_run_directory
    save_raw_input

    # Generate plan
    generate_plan

    # Initialize Ralph
    init_ralph_prd

    # Create summary
    create_build_summary

    # Done
    print_completion
}

# Run if executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
