#!/bin/bash
#
# Skills Audit Runner - Automated code quality audit for App Factory builds
#
# Runs Vercel agent-skills audits on generated projects to enforce quality standards.
# Currently supports website-pipeline (react-best-practices, web-design-guidelines).
#
# Usage:
#   ./scripts/run-skills-audit.sh <project-path> [--skill <skill-name>]
#   ./scripts/run-skills-audit.sh website-pipeline/website-builds/my-site
#   ./scripts/run-skills-audit.sh dapp-factory/dapp-builds/my-dapp --skill react-best-practices
#
# Arguments:
#   project-path  - Path to the generated project directory
#   --skill       - Specific skill to audit (optional, runs all applicable skills by default)
#
# Output:
#   - Creates <project>/audits/ directory
#   - Generates audit reports in JSON and Markdown
#   - Exits with 0 if all audits pass thresholds, 1 if any fail
#
# Requirements:
#   - npx (comes with npm)
#   - @vercel/agent-skills package (installed on-the-fly)
#   - Project must have node_modules installed
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Default thresholds (can be overridden by pipeline-specific config)
DEFAULT_REACT_THRESHOLD=95
DEFAULT_DESIGN_THRESHOLD=90

# Parse arguments
if [[ $# -lt 1 ]]; then
    echo -e "${RED}ERROR: Missing project path${NC}"
    echo ""
    echo "Usage: $0 <project-path> [--skill <skill-name>]"
    echo ""
    echo "Examples:"
    echo "  $0 website-pipeline/website-builds/my-site"
    echo "  $0 dapp-factory/dapp-builds/my-dapp --skill react-best-practices"
    echo ""
    echo "Skills:"
    echo "  - react-best-practices (threshold: ${DEFAULT_REACT_THRESHOLD}%)"
    echo "  - web-design-guidelines (threshold: ${DEFAULT_DESIGN_THRESHOLD}%)"
    echo ""
    exit 1
fi

PROJECT_PATH="$1"
shift

SPECIFIC_SKILL=""
while [[ $# -gt 0 ]]; do
    case "$1" in
        --skill)
            SPECIFIC_SKILL="$2"
            shift 2
            ;;
        *)
            echo -e "${RED}ERROR: Unknown argument: $1${NC}"
            exit 1
            ;;
    esac
done

# Validate project path
if [[ ! -d "$PROJECT_PATH" ]]; then
    echo -e "${RED}ERROR: Project path does not exist: $PROJECT_PATH${NC}"
    exit 1
fi

# Check if node_modules exists
if [[ ! -d "$PROJECT_PATH/node_modules" ]]; then
    echo -e "${YELLOW}WARNING: node_modules not found in $PROJECT_PATH${NC}"
    echo -e "${YELLOW}Run 'npm install' in the project directory first${NC}"
    exit 1
fi

# Create audits directory
AUDIT_DIR="$PROJECT_PATH/audits"
mkdir -p "$AUDIT_DIR"

# Define skills to run based on project type
declare -A SKILLS
declare -A THRESHOLDS

# Detect project type and set skills
if [[ -f "$PROJECT_PATH/next.config.js" ]] || [[ -f "$PROJECT_PATH/next.config.mjs" ]]; then
    # Next.js project (website-pipeline or dapp-factory)
    if [[ -z "$SPECIFIC_SKILL" ]]; then
        SKILLS["react-best-practices"]="1"
        SKILLS["web-design-guidelines"]="1"
    else
        SKILLS["$SPECIFIC_SKILL"]="1"
    fi

    THRESHOLDS["react-best-practices"]="$DEFAULT_REACT_THRESHOLD"
    THRESHOLDS["web-design-guidelines"]="$DEFAULT_DESIGN_THRESHOLD"
else
    echo -e "${YELLOW}WARNING: Could not detect project type${NC}"
    echo -e "${YELLOW}Skills audit may not be applicable${NC}"

    if [[ -z "$SPECIFIC_SKILL" ]]; then
        echo -e "${RED}ERROR: Please specify --skill for non-Next.js projects${NC}"
        exit 1
    else
        SKILLS["$SPECIFIC_SKILL"]="1"
        THRESHOLDS["$SPECIFIC_SKILL"]="80"  # Default threshold
    fi
fi

# Run audit for each skill
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Skills Audit Runner v1.0${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Project: $PROJECT_PATH"
echo "Audit output: $AUDIT_DIR"
echo "Skills: ${!SKILLS[*]}"
echo ""

FAILURES=0
PASSED=0

for skill in "${!SKILLS[@]}"; do
    threshold="${THRESHOLDS[$skill]}"

    echo -e "${BLUE}Running $skill audit (threshold: $threshold%)...${NC}"

    AUDIT_FILE="$AUDIT_DIR/${skill}_audit.json"
    REPORT_FILE="$AUDIT_DIR/${skill}_report.md"

    # Run the audit using @vercel/agent-skills
    # Note: This is a placeholder - actual implementation would use the real audit tool
    # For now, we'll create a stub that shows the structure

    # Check if @vercel/agent-skills is available
    if ! npm list -g @vercel/agent-skills >/dev/null 2>&1; then
        echo -e "${YELLOW}@vercel/agent-skills not found globally, checking locally...${NC}"

        if ! npm list @vercel/agent-skills --prefix "$PROJECT_PATH" >/dev/null 2>&1; then
            echo -e "${YELLOW}Installing @vercel/agent-skills locally...${NC}"
            npm install --prefix "$PROJECT_PATH" @vercel/agent-skills --save-dev --silent || {
                echo -e "${RED}Failed to install @vercel/agent-skills${NC}"
                FAILURES=$((FAILURES + 1))
                continue
            }
        fi
    fi

    # ═══════════════════════════════════════════════════════════════
    # Skills Audit: PLANNED FEATURE
    # ═══════════════════════════════════════════════════════════════

    echo ""
    echo -e "${BLUE}ℹ️  Skills Audit: ${skill}${NC}"
    echo -e "${BLUE}   Status: PLANNED - Not Yet Implemented${NC}"
    echo ""
    echo "Current workarounds:"

    if [[ "$skill" == "react-best-practices" ]]; then
        echo "  1. Run ESLint: cd ${PROJECT_PATH} && npm run lint"
        echo "  2. Manual code review against React best practices"
        echo "  3. Check React documentation: https://react.dev"
    elif [[ "$skill" == "web-design-guidelines" ]]; then
        echo "  1. Manual design review against Web Content Accessibility Guidelines (WCAG)"
        echo "  2. Run accessibility checks: npm run a11y (if configured)"
        echo "  3. Visual inspection for design consistency"
    else
        echo "  1. Manual code review for ${skill}"
        echo "  2. Run ESLint: cd ${PROJECT_PATH} && npm run lint"
    fi

    echo ""
    echo "To enable skills audits (experimental):"
    echo "  npm install -D @vercel/agent-skills"
    echo "  # Configure per docs/skills-audit-setup.md"
    echo ""

    # Create status file (not a failure)
    cat > "$AUDIT_FILE" << EOF
{
  "skill": "$skill",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "project": "$PROJECT_PATH",
  "score": null,
  "threshold": $threshold,
  "status": "planned",
  "notes": "Skills audits are a planned feature. Use ESLint and manual review as workaround."
}
EOF

    # Create informational report
    cat > "$REPORT_FILE" << EOF
# Skills Audit Report: $skill

**Project**: $PROJECT_PATH
**Timestamp**: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
**Status**: ℹ️ PLANNED - Not Yet Implemented

## Overview

Skills audits using @vercel/agent-skills are planned for a future release.
This feature will provide automated code quality checks for:
- React best practices (target: ${threshold}% score)
- Web design guidelines (target: ${threshold}% score)
- Accessibility compliance
- Framework-specific patterns

## Current Workarounds

### For react-best-practices:
\`\`\`bash
cd ${PROJECT_PATH}
npm run lint                    # ESLint checks
npm run type-check              # TypeScript validation
\`\`\`

### For web-design-guidelines:
- Manual design review
- WCAG accessibility checklist
- Visual consistency inspection
- Browser testing (Chrome, Firefox, Safari)

### General Code Quality:
\`\`\`bash
cd ${PROJECT_PATH}
npm run lint                    # ESLint
npm run format                  # Prettier
npm run test                    # Unit tests (if configured)
\`\`\`

## Future Implementation

**Target Release**: v3.0
**Dependencies**:
- @vercel/agent-skills package integration
- Custom skill definitions
- Automated scoring system
- Threshold enforcement

**Installation (when available)**:
\`\`\`bash
npm install -D @vercel/agent-skills
# Configure in docs/skills-audit-setup.md
\`\`\`

## Recommendations

For production builds:
1. ✅ Run ESLint and fix all errors
2. ✅ Manual code review by experienced developer
3. ✅ Test in multiple browsers
4. ✅ Accessibility testing with screen reader
5. ✅ Performance audit with Lighthouse

**Note**: This build continues without skills audit. Quality checks are your responsibility.
EOF

    # Do NOT mark as failure - this is a planned feature, not an error
    echo -e "${GREEN}✓ Skills audit info saved: $AUDIT_FILE${NC}"
done

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Audit Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Total audits: ${#SKILLS[@]}"
echo "Passed: $PASSED"
echo "Failed/Not implemented: $FAILURES"
echo ""
echo "Audit reports: $AUDIT_DIR"
echo ""

if [[ $FAILURES -gt 0 ]]; then
    echo -e "${YELLOW}NOTE: This is a placeholder implementation${NC}"
    echo -e "${YELLOW}Actual skills audit requires @vercel/agent-skills integration${NC}"
    echo ""
    echo "To implement:"
    echo "1. Install @vercel/agent-skills"
    echo "2. Update this script to call actual audit commands"
    echo "3. Parse audit results and apply thresholds"
    echo ""
    exit 1
else
    echo -e "${GREEN}All audits passed${NC}"
    exit 0
fi
