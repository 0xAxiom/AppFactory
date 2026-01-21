#!/bin/bash

# =============================================================================
#   Factory Ready Check
#   Unified validation script for all App Factory pipelines
#
#   Usage: ./scripts/factory_ready_check.sh <project-path>
#
#   Detects pipeline type and runs appropriate validation.
#   Provides actionable error messages with suggested fixes.
# =============================================================================

set -euo pipefail

# Trap handler for cleanup on error
cleanup() {
    local exit_code=$?
    if [ $exit_code -ne 0 ] && [ $exit_code -ne 1 ]; then
        echo ""
        echo -e "${RED:-}Script encountered an unexpected error (exit code: $exit_code)${NC:-}"
    fi
}
trap cleanup EXIT

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Helper: Print error with suggestion
print_error() {
    local message="$1"
    local suggestion="$2"
    local docs="$3"

    echo ""
    echo -e "${RED}${BOLD}ERROR:${NC} ${RED}$message${NC}"
    if [ -n "$suggestion" ]; then
        echo ""
        echo -e "${YELLOW}Suggested fix:${NC}"
        echo "  $suggestion"
    fi
    if [ -n "$docs" ]; then
        echo ""
        echo -e "${BLUE}Documentation:${NC}"
        echo "  $docs"
    fi
    echo ""
}

# Helper: Print success
print_success() {
    echo -e "${GREEN}PASS${NC}: $1"
}

# Helper: Print warning
print_warning() {
    echo -e "${YELLOW}WARN${NC}: $1"
}

# Helper: Print fail
print_fail() {
    echo -e "${RED}FAIL${NC}: $1"
}

# Print header
print_header() {
    echo ""
    echo -e "${CYAN}============================================================${NC}"
    echo -e "${CYAN}${BOLD}  Factory Ready Check${NC}"
    echo -e "${CYAN}============================================================${NC}"
    echo ""
}

# Check argument
if [ -z "$1" ]; then
    print_header
    echo -e "${BOLD}Usage:${NC} ./scripts/factory_ready_check.sh <project-path>"
    echo ""
    echo -e "${BOLD}Examples:${NC}"
    echo "  ./scripts/factory_ready_check.sh dapp-factory/dapp-builds/my-app"
    echo "  ./scripts/factory_ready_check.sh agent-factory/outputs/my-agent"
    echo "  ./scripts/factory_ready_check.sh app-factory/builds/my-mobile-app"
    echo "  ./scripts/factory_ready_check.sh miniapp-pipeline/builds/miniapps/my-app/app"
    echo "  ./scripts/factory_ready_check.sh plugin-factory/builds/my-plugin"
    echo ""
    echo -e "${BOLD}What this script does:${NC}"
    echo "  1. Detects which pipeline generated the project"
    echo "  2. Runs pipeline-specific validation checks"
    echo "  3. Reports issues with suggested fixes"
    echo ""
    exit 1
fi

PROJECT_PATH="$1"

# Resolve to absolute path
if [[ "$PROJECT_PATH" != /* ]]; then
    PROJECT_PATH="$(pwd)/$PROJECT_PATH"
fi

# Check project exists
if [ ! -d "$PROJECT_PATH" ]; then
    print_header
    print_error \
        "Project directory not found: $PROJECT_PATH" \
        "Verify the path is correct. Use tab completion to avoid typos." \
        "See examples above for correct path formats."
    exit 1
fi

print_header
echo -e "${BOLD}Project:${NC} $PROJECT_PATH"
echo ""

# Detect pipeline type
detect_pipeline() {
    # Check for miniapp (minikit.config.ts)
    if [ -f "$PROJECT_PATH/minikit.config.ts" ]; then
        echo "miniapp-pipeline"
    # Check for agent (agent.json)
    elif [ -f "$PROJECT_PATH/agent.json" ]; then
        echo "agent-factory"
    # Check for Claude plugin (.claude-plugin/plugin.json)
    elif [ -f "$PROJECT_PATH/.claude-plugin/plugin.json" ]; then
        echo "plugin-factory"
    # Check for Next.js projects
    elif [ -f "$PROJECT_PATH/next.config.js" ] || [ -f "$PROJECT_PATH/next.config.mjs" ] || [ -f "$PROJECT_PATH/next.config.ts" ]; then
        # Distinguish between website-pipeline and dapp-factory
        if echo "$PROJECT_PATH" | grep -q "website-builds"; then
            echo "website-pipeline"
        elif echo "$PROJECT_PATH" | grep -q "dapp-builds"; then
            echo "dapp-factory"
        elif echo "$PROJECT_PATH" | grep -q "miniapps"; then
            echo "miniapp-pipeline"
        else
            echo "dapp-factory"
        fi
    # Check for Expo app
    elif [ -f "$PROJECT_PATH/app.config.js" ] || [ -f "$PROJECT_PATH/app.config.ts" ]; then
        echo "app-factory"
    elif [ -f "$PROJECT_PATH/app.json" ]; then
        echo "app-factory"
    else
        echo "unknown"
    fi
}

# Check UX Polish Gate (for UI pipelines)
check_ux_polish_gate() {
    echo ""
    echo -e "${YELLOW}${BOLD}Running UX Polish Gate (Ralph + Playwright)...${NC}"
    echo ""

    local PASS=true

    # Check for ralph/ directory
    if [ ! -d "$PROJECT_PATH/ralph" ]; then
        print_fail "ralph/ directory not found"
        echo -e "       ${CYAN}Create: mkdir -p $PROJECT_PATH/ralph${NC}"
        PASS=false
    else
        print_success "ralph/ directory exists"

        # Check for ACCEPTANCE.md with completion promise
        if [ ! -f "$PROJECT_PATH/ralph/ACCEPTANCE.md" ]; then
            print_fail "ralph/ACCEPTANCE.md not found"
            echo -e "       ${CYAN}This file should contain your acceptance criteria${NC}"
            PASS=false
        else
            print_success "ralph/ACCEPTANCE.md exists"
        fi
    fi

    # Check for Playwright config
    if [ ! -f "$PROJECT_PATH/playwright.config.ts" ] && [ ! -f "$PROJECT_PATH/playwright.config.js" ]; then
        print_fail "Playwright config not found"
        echo -e "       ${CYAN}Install: npm install -D @playwright/test${NC}"
        echo -e "       ${CYAN}Init: npx playwright init${NC}"
        PASS=false
    else
        print_success "Playwright config exists"
    fi

    # Check for E2E tests
    if [ ! -d "$PROJECT_PATH/tests/e2e" ] && [ ! -d "$PROJECT_PATH/test/e2e" ]; then
        print_fail "E2E tests directory not found"
        echo -e "       ${CYAN}Create: mkdir -p $PROJECT_PATH/tests/e2e${NC}"
        echo -e "       ${CYAN}Add at least one test file: tests/e2e/smoke.spec.ts${NC}"
        PASS=false
    else
        E2E_DIR="$PROJECT_PATH/tests/e2e"
        [ ! -d "$E2E_DIR" ] && E2E_DIR="$PROJECT_PATH/test/e2e"
        SPEC_COUNT=$(find "$E2E_DIR" -name "*.spec.ts" -o -name "*.spec.js" 2>/dev/null | wc -l | tr -d ' ')
        if [ "$SPEC_COUNT" -eq 0 ]; then
            print_fail "No E2E test files found (*.spec.ts or *.spec.js)"
            echo -e "       ${CYAN}Add tests to: $E2E_DIR${NC}"
            PASS=false
        else
            print_success "Found $SPEC_COUNT E2E test file(s)"
        fi
    fi

    # Check for runner script
    if [ ! -f "$PROJECT_PATH/scripts/ralph_loop_runner.sh" ]; then
        print_warning "ralph_loop_runner.sh not found (optional but recommended)"
    else
        print_success "ralph_loop_runner.sh exists"
    fi

    if [ "$PASS" = true ]; then
        echo ""
        echo -e "${GREEN}${BOLD}UX Polish Gate: PASS${NC}"
        return 0
    else
        echo ""
        echo -e "${RED}${BOLD}UX Polish Gate: FAIL${NC}"
        echo ""
        echo "The UX Polish Gate ensures your UI has been properly tested."
        echo "See: docs/UX_POLISH_LOOP.md"
        return 1
    fi
}

# Validate agent-factory project
validate_agent() {
    echo -e "${BOLD}Running agent-factory validation...${NC}"
    echo ""

    local PASS=true

    # Required files
    if [ ! -f "$PROJECT_PATH/agent.json" ]; then
        print_fail "agent.json not found"
        PASS=false
    else
        print_success "agent.json exists"
    fi

    if [ ! -f "$PROJECT_PATH/package.json" ]; then
        print_fail "package.json not found"
        echo -e "       ${CYAN}Run: npm init -y${NC}"
        PASS=false
    else
        print_success "package.json exists"
    fi

    if [ ! -f "$PROJECT_PATH/tsconfig.json" ]; then
        print_fail "tsconfig.json not found"
        echo -e "       ${CYAN}Run: npx tsc --init${NC}"
        PASS=false
    else
        print_success "tsconfig.json exists"
    fi

    # Source directory
    if [ ! -d "$PROJECT_PATH/src" ]; then
        print_fail "src/ directory not found"
        PASS=false
    else
        print_success "src/ directory exists"

        if [ ! -f "$PROJECT_PATH/src/index.ts" ]; then
            print_fail "src/index.ts not found (entry point)"
            PASS=false
        else
            print_success "src/index.ts exists"
        fi
    fi

    # Research directory
    if [ ! -d "$PROJECT_PATH/research" ]; then
        print_warning "research/ directory not found"
        echo -e "       ${CYAN}Full builds include market research in research/${NC}"
    else
        print_success "research/ directory exists"
    fi

    # Documentation
    for doc in "RUNBOOK.md" "TESTING.md"; do
        if [ ! -f "$PROJECT_PATH/$doc" ]; then
            print_warning "$doc not found"
        else
            print_success "$doc exists"
        fi
    done

    echo ""
    if [ "$PASS" = true ]; then
        echo -e "${GREEN}${BOLD}Validation: PASS${NC}"
    else
        echo -e "${RED}${BOLD}Validation: FAIL${NC}"
        return 1
    fi
}

# Validate plugin-factory project
validate_plugin() {
    echo -e "${BOLD}Running plugin-factory validation...${NC}"
    echo ""

    local PASS=true

    # Plugin manifest
    if [ ! -f "$PROJECT_PATH/.claude-plugin/plugin.json" ]; then
        print_fail ".claude-plugin/plugin.json not found"
        echo -e "       ${CYAN}This file is required for Claude plugins${NC}"
        PASS=false
    else
        print_success ".claude-plugin/plugin.json exists"
    fi

    # Check for commands at root (common mistake is putting them in .claude-plugin)
    if [ -d "$PROJECT_PATH/.claude-plugin/commands" ]; then
        print_fail "commands/ inside .claude-plugin/ (WRONG LOCATION)"
        echo -e "       ${CYAN}Move commands to plugin root: mv .claude-plugin/commands ./${NC}"
        PASS=false
    fi

    # Commands directory
    if [ ! -d "$PROJECT_PATH/commands" ]; then
        print_warning "commands/ directory not found"
        echo -e "       ${CYAN}Add slash commands in commands/ directory${NC}"
    else
        COMMAND_COUNT=$(find "$PROJECT_PATH/commands" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
        if [ "$COMMAND_COUNT" -eq 0 ]; then
            print_warning "No command files found in commands/"
        else
            print_success "Found $COMMAND_COUNT command(s) in commands/"
        fi
    fi

    # Security documentation
    if [ ! -f "$PROJECT_PATH/SECURITY.md" ]; then
        print_fail "SECURITY.md not found"
        echo -e "       ${CYAN}Security documentation is required for all plugins${NC}"
        PASS=false
    else
        print_success "SECURITY.md exists"
    fi

    # Installation guide
    if [ ! -f "$PROJECT_PATH/INSTALL.md" ]; then
        print_warning "INSTALL.md not found"
    else
        print_success "INSTALL.md exists"
    fi

    echo ""
    if [ "$PASS" = true ]; then
        echo -e "${GREEN}${BOLD}Validation: PASS${NC}"
    else
        echo -e "${RED}${BOLD}Validation: FAIL${NC}"
        return 1
    fi
}

# Validate miniapp-pipeline project
validate_miniapp() {
    echo -e "${BOLD}Running miniapp-pipeline validation...${NC}"
    echo ""

    local PASS=true

    # MiniKit config
    if [ ! -f "$PROJECT_PATH/minikit.config.ts" ]; then
        print_fail "minikit.config.ts not found"
        echo -e "       ${CYAN}This is the single source of truth for your manifest${NC}"
        PASS=false
    else
        print_success "minikit.config.ts exists"
    fi

    # Manifest route
    if [ ! -f "$PROJECT_PATH/app/.well-known/farcaster.json/route.ts" ]; then
        print_fail "Manifest route not found at app/.well-known/farcaster.json/route.ts"
        echo -e "       ${CYAN}This route serves your mini app manifest to Base${NC}"
        PASS=false
    else
        print_success "Manifest route exists"
    fi

    # Package.json
    if [ ! -f "$PROJECT_PATH/package.json" ]; then
        print_fail "package.json not found"
        PASS=false
    else
        print_success "package.json exists"
    fi

    # Public assets
    for asset in "icon.png" "splash.png" "hero.png"; do
        if [ ! -f "$PROJECT_PATH/public/$asset" ]; then
            print_warning "public/$asset not found"
            echo -e "       ${CYAN}Required for Base app discovery${NC}"
        else
            print_success "public/$asset exists"
        fi
    done

    # Check account association (in minikit.config.ts)
    if [ -f "$PROJECT_PATH/minikit.config.ts" ]; then
        if grep -q 'header: ""' "$PROJECT_PATH/minikit.config.ts"; then
            print_warning "Account association not configured"
            echo -e "       ${CYAN}Complete account association at base.dev before deploying${NC}"
        else
            print_success "Account association appears configured"
        fi
    fi

    echo ""
    if [ "$PASS" = true ]; then
        echo -e "${GREEN}${BOLD}Validation: PASS${NC}"
    else
        echo -e "${RED}${BOLD}Validation: FAIL${NC}"
        return 1
    fi
}

PIPELINE=$(detect_pipeline)
echo -e "${BOLD}Detected pipeline:${NC} $PIPELINE"
echo ""

# Run appropriate validator
case $PIPELINE in
    "agent-factory")
        validate_agent
        ;;

    "plugin-factory")
        validate_plugin
        ;;

    "miniapp-pipeline")
        validate_miniapp
        ;;

    "website-pipeline")
        echo -e "${BOLD}Running website-pipeline validation...${NC}"
        echo ""

        PASS=true

        if [ ! -f "$PROJECT_PATH/package.json" ]; then
            print_fail "package.json not found"
            PASS=false
        else
            print_success "package.json exists"
        fi

        if [ ! -d "$PROJECT_PATH/src" ]; then
            print_fail "src/ directory not found"
            PASS=false
        else
            print_success "src/ directory exists"
        fi

        if [ ! -d "$PROJECT_PATH/audits" ]; then
            print_warning "audits/ directory not found"
        else
            print_success "audits/ directory exists"
        fi

        # UX Polish Gate (MANDATORY for website-pipeline)
        check_ux_polish_gate || PASS=false

        if [ "$PASS" = true ]; then
            echo ""
            echo -e "${GREEN}${BOLD}Validation: PASS${NC}"
        else
            echo ""
            echo -e "${RED}${BOLD}Validation: FAIL${NC}"
            exit 1
        fi
        ;;

    "dapp-factory")
        echo -e "${BOLD}Running dapp-factory validation...${NC}"
        echo ""

        PASS=true

        if [ ! -f "$PROJECT_PATH/package.json" ]; then
            print_fail "package.json not found"
            PASS=false
        else
            print_success "package.json exists"
        fi

        if [ ! -d "$PROJECT_PATH/src" ]; then
            print_fail "src/ directory not found"
            PASS=false
        else
            print_success "src/ directory exists"
        fi

        if [ ! -d "$PROJECT_PATH/research" ]; then
            print_warning "research/ directory not found"
            echo -e "       ${CYAN}Full builds include market research in research/${NC}"
        else
            print_success "research/ directory exists"
        fi

        # UX Polish Gate (MANDATORY for dapp-factory)
        check_ux_polish_gate || PASS=false

        if [ "$PASS" = true ]; then
            echo ""
            echo -e "${GREEN}${BOLD}Validation: PASS${NC}"
        else
            echo ""
            echo -e "${RED}${BOLD}Validation: FAIL${NC}"
            exit 1
        fi
        ;;

    "app-factory")
        echo -e "${BOLD}Running app-factory validation...${NC}"
        echo ""

        PASS=true

        if [ ! -f "$PROJECT_PATH/package.json" ]; then
            print_fail "package.json not found"
            echo -e "       ${CYAN}Run: npm init -y${NC}"
            PASS=false
        else
            print_success "package.json exists"
        fi

        if [ ! -f "$PROJECT_PATH/app.config.js" ] && [ ! -f "$PROJECT_PATH/app.config.ts" ] && [ ! -f "$PROJECT_PATH/app.json" ]; then
            print_fail "Expo config not found (app.config.js, app.config.ts, or app.json)"
            PASS=false
        else
            print_success "Expo config exists"
        fi

        if [ ! -d "$PROJECT_PATH/app" ] && [ ! -d "$PROJECT_PATH/src" ]; then
            print_fail "Source directory not found (app/ or src/)"
            PASS=false
        else
            print_success "Source directory exists"
        fi

        # Check for paywall (RevenueCat)
        if find "$PROJECT_PATH" -name "paywall*" -o -name "*purchases*" 2>/dev/null | head -1 | grep -q .; then
            print_success "Paywall/purchases files found"
        else
            print_warning "No paywall/purchases files found"
            echo -e "       ${CYAN}App Factory builds include RevenueCat monetization${NC}"
        fi

        # Check for research
        if [ ! -d "$PROJECT_PATH/research" ]; then
            print_warning "research/ directory not found"
            echo -e "       ${CYAN}Full builds include market research in research/${NC}"
        else
            print_success "research/ directory exists"
        fi

        if [ "$PASS" = true ]; then
            echo ""
            echo -e "${GREEN}${BOLD}Validation: PASS${NC}"
        else
            echo ""
            echo -e "${RED}${BOLD}Validation: FAIL${NC}"
            exit 1
        fi
        ;;

    *)
        print_error \
            "Could not detect pipeline type" \
            "Ensure your project has the correct marker files" \
            ""

        echo "Expected marker files by pipeline:"
        echo ""
        echo "  ${BOLD}app-factory${NC}: app.config.js, app.config.ts, or app.json"
        echo "  ${BOLD}dapp-factory${NC}: next.config.js in dapp-builds/ path"
        echo "  ${BOLD}agent-factory${NC}: agent.json"
        echo "  ${BOLD}plugin-factory${NC}: .claude-plugin/plugin.json"
        echo "  ${BOLD}miniapp-pipeline${NC}: minikit.config.ts"
        echo ""
        exit 1
        ;;
esac

echo ""
echo -e "${CYAN}============================================================${NC}"
echo -e "${GREEN}${BOLD}  Factory Ready Check Complete${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""
echo -e "${BOLD}Next steps:${NC}"
echo "  1. Run your project locally to verify it works"
echo "  2. Push to GitHub"
echo "  3. Deploy (Vercel, Expo, etc.)"
echo ""
