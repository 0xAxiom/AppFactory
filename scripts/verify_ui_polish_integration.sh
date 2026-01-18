#!/bin/bash

# Verify UI Polish Integration
# Checks that all UI pipelines have the required UX Polish Loop templates
#
# Usage: ./scripts/verify_ui_polish_integration.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'
BOLD='\033[1m'

# Get repo root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

echo ""
echo -e "${BOLD}${BLUE}============================================================${NC}"
echo -e "${BOLD}${BLUE}  UX Polish Loop Integration Verification${NC}"
echo -e "${BOLD}${BLUE}============================================================${NC}"
echo ""

# Define UI pipelines and their requirements
UI_PIPELINES=(
    "website-pipeline:REQUIRED"
    "dapp-factory:REQUIRED"
    "app-factory:OPTIONAL"
)

# Non-UI pipelines (should NOT have Playwright)
NON_UI_PIPELINES=(
    "agent-factory"
    "plugin-factory"
)

# Required files for UI pipelines
REQUIRED_FILES=(
    ".factory-tools/ux-polish-loop/templates/ralph/PRD.md"
    ".factory-tools/ux-polish-loop/templates/ralph/ACCEPTANCE.md"
    ".factory-tools/ux-polish-loop/templates/ralph/LOOP.md"
    ".factory-tools/ux-polish-loop/templates/ralph/PROGRESS.md"
    ".factory-tools/ux-polish-loop/templates/ralph/QA_NOTES.md"
    ".factory-tools/ux-polish-loop/templates/playwright.config.ts"
    ".factory-tools/ux-polish-loop/templates/tests/e2e/smoke.spec.ts"
    ".factory-tools/ux-polish-loop/scripts/ralph_loop_runner.sh"
)

PASS=true

# Check shared module exists
echo -e "${BLUE}Checking shared UX Polish Loop module...${NC}"
echo ""

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$REPO_ROOT/$file" ]; then
        echo -e "  ${GREEN}✓${NC} $file"
    else
        echo -e "  ${RED}✗${NC} $file (MISSING)"
        PASS=false
    fi
done

echo ""

# Check UI pipelines
echo -e "${BLUE}Checking UI pipelines...${NC}"
echo ""

for pipeline_entry in "${UI_PIPELINES[@]}"; do
    pipeline="${pipeline_entry%%:*}"
    requirement="${pipeline_entry##*:}"

    echo -e "  ${BOLD}$pipeline${NC} ($requirement)"

    if [ ! -d "$REPO_ROOT/$pipeline" ]; then
        echo -e "    ${YELLOW}⚠${NC} Pipeline directory not found"
        continue
    fi

    # Check CLAUDE.md mentions UX Polish Loop
    if [ -f "$REPO_ROOT/$pipeline/CLAUDE.md" ]; then
        if grep -qi "ralph" "$REPO_ROOT/$pipeline/CLAUDE.md" && grep -qi "playwright\|e2e\|polish" "$REPO_ROOT/$pipeline/CLAUDE.md"; then
            echo -e "    ${GREEN}✓${NC} CLAUDE.md documents UX Polish Loop"
        else
            if [ "$requirement" = "REQUIRED" ]; then
                echo -e "    ${RED}✗${NC} CLAUDE.md missing UX Polish Loop documentation"
                PASS=false
            else
                echo -e "    ${YELLOW}⚠${NC} CLAUDE.md missing UX Polish Loop documentation (optional)"
            fi
        fi
    else
        echo -e "    ${RED}✗${NC} CLAUDE.md not found"
        PASS=false
    fi

    # Check for example (website-pipeline has one)
    if [ "$pipeline" = "website-pipeline" ]; then
        EXAMPLE_DIR="$REPO_ROOT/$pipeline/example/website-builds/luminary-studio"
        if [ -d "$EXAMPLE_DIR" ]; then
            # Check example has ralph/
            if [ -d "$EXAMPLE_DIR/ralph" ]; then
                echo -e "    ${GREEN}✓${NC} Example has ralph/ directory"
            else
                echo -e "    ${RED}✗${NC} Example missing ralph/ directory"
                PASS=false
            fi

            # Check example has playwright.config.ts
            if [ -f "$EXAMPLE_DIR/playwright.config.ts" ]; then
                echo -e "    ${GREEN}✓${NC} Example has playwright.config.ts"
            else
                echo -e "    ${RED}✗${NC} Example missing playwright.config.ts"
                PASS=false
            fi

            # Check example has tests/e2e/
            if [ -d "$EXAMPLE_DIR/tests/e2e" ]; then
                echo -e "    ${GREEN}✓${NC} Example has tests/e2e/"
            else
                echo -e "    ${RED}✗${NC} Example missing tests/e2e/"
                PASS=false
            fi
        else
            echo -e "    ${YELLOW}⚠${NC} No example found"
        fi
    fi

    echo ""
done

# Check non-UI pipelines don't have Playwright requirements
echo -e "${BLUE}Checking non-UI pipelines (should NOT require Playwright)...${NC}"
echo ""

for pipeline in "${NON_UI_PIPELINES[@]}"; do
    echo -e "  ${BOLD}$pipeline${NC}"

    if [ ! -d "$REPO_ROOT/$pipeline" ]; then
        echo -e "    ${YELLOW}⚠${NC} Pipeline directory not found"
        continue
    fi

    # Check CLAUDE.md doesn't have mandatory Playwright
    if [ -f "$REPO_ROOT/$pipeline/CLAUDE.md" ]; then
        if grep -qi "playwright.*REQUIRED\|MANDATORY.*playwright" "$REPO_ROOT/$pipeline/CLAUDE.md"; then
            echo -e "    ${YELLOW}⚠${NC} CLAUDE.md has mandatory Playwright (may slow down non-UI pipeline)"
        else
            echo -e "    ${GREEN}✓${NC} No mandatory Playwright requirement"
        fi
    fi

    echo ""
done

# Summary
echo -e "${BOLD}============================================================${NC}"
if [ "$PASS" = true ]; then
    echo -e "${BOLD}${GREEN}  VERIFICATION PASSED${NC}"
    echo ""
    echo "All UI pipelines have the required UX Polish Loop integration."
    exit 0
else
    echo -e "${BOLD}${RED}  VERIFICATION FAILED${NC}"
    echo ""
    echo "Some required files or configurations are missing."
    echo "Run this script from the repository root to see details."
    exit 1
fi
