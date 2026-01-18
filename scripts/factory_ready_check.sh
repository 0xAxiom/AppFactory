#!/bin/bash

# Factory Ready Check
# Unified validation script for all App Factory pipelines
#
# Usage: ./scripts/factory_ready_check.sh <project-path>
#
# Detects pipeline type and runs appropriate validation.
# Outputs factory_ready.json on success.

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check argument
if [ -z "$1" ]; then
    echo "Usage: ./scripts/factory_ready_check.sh <project-path>"
    echo ""
    echo "Examples:"
    echo "  ./scripts/factory_ready_check.sh dapp-factory/dapp-builds/my-app"
    echo "  ./scripts/factory_ready_check.sh agent-factory/outputs/my-agent"
    echo "  ./scripts/factory_ready_check.sh app-factory/builds/my-mobile-app"
    exit 1
fi

PROJECT_PATH="$1"

# Resolve to absolute path
if [[ "$PROJECT_PATH" != /* ]]; then
    PROJECT_PATH="$(pwd)/$PROJECT_PATH"
fi

# Check project exists
if [ ! -d "$PROJECT_PATH" ]; then
    echo -e "${RED}Error: Project not found: $PROJECT_PATH${NC}"
    exit 1
fi

echo ""
echo "============================================================"
echo "  Factory Ready Check"
echo "============================================================"
echo ""
echo "Project: $PROJECT_PATH"
echo ""

# Detect pipeline type
detect_pipeline() {
    if [ -f "$PROJECT_PATH/agent.json" ]; then
        echo "agent-factory"
    elif [ -f "$PROJECT_PATH/next.config.js" ] || [ -f "$PROJECT_PATH/next.config.mjs" ] || [ -f "$PROJECT_PATH/next.config.ts" ]; then
        # Distinguish between website-pipeline and dapp-factory
        if echo "$PROJECT_PATH" | grep -q "website-builds"; then
            echo "website-pipeline"
        elif echo "$PROJECT_PATH" | grep -q "dapp-builds"; then
            echo "dapp-factory"
        else
            echo "dapp-factory"
        fi
    elif [ -f "$PROJECT_PATH/app.json" ] && [ -f "$PROJECT_PATH/expo-env.d.ts" ]; then
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
    echo -e "${YELLOW}Running UX Polish Gate (Ralph + Playwright)...${NC}"
    echo ""

    local PASS=true

    # Check for ralph/ directory
    if [ ! -d "$PROJECT_PATH/ralph" ]; then
        echo -e "${RED}FAIL: ralph/ directory not found${NC}"
        PASS=false
    else
        echo -e "${GREEN}PASS: ralph/ directory exists${NC}"

        # Check for ACCEPTANCE.md with completion promise
        if [ ! -f "$PROJECT_PATH/ralph/ACCEPTANCE.md" ]; then
            echo -e "${RED}FAIL: ralph/ACCEPTANCE.md not found${NC}"
            PASS=false
        else
            echo -e "${GREEN}PASS: ralph/ACCEPTANCE.md exists${NC}"
        fi
    fi

    # Check for Playwright config
    if [ ! -f "$PROJECT_PATH/playwright.config.ts" ] && [ ! -f "$PROJECT_PATH/playwright.config.js" ]; then
        echo -e "${RED}FAIL: Playwright config not found${NC}"
        PASS=false
    else
        echo -e "${GREEN}PASS: Playwright config exists${NC}"
    fi

    # Check for E2E tests
    if [ ! -d "$PROJECT_PATH/tests/e2e" ] && [ ! -d "$PROJECT_PATH/test/e2e" ]; then
        echo -e "${RED}FAIL: E2E tests directory not found${NC}"
        PASS=false
    else
        E2E_DIR="$PROJECT_PATH/tests/e2e"
        [ ! -d "$E2E_DIR" ] && E2E_DIR="$PROJECT_PATH/test/e2e"
        SPEC_COUNT=$(find "$E2E_DIR" -name "*.spec.ts" -o -name "*.spec.js" 2>/dev/null | wc -l | tr -d ' ')
        if [ "$SPEC_COUNT" -eq 0 ]; then
            echo -e "${RED}FAIL: No E2E test files found${NC}"
            PASS=false
        else
            echo -e "${GREEN}PASS: Found $SPEC_COUNT E2E test file(s)${NC}"
        fi
    fi

    # Check for runner script
    if [ ! -f "$PROJECT_PATH/scripts/ralph_loop_runner.sh" ]; then
        echo -e "${YELLOW}WARN: ralph_loop_runner.sh not found (optional)${NC}"
    else
        echo -e "${GREEN}PASS: ralph_loop_runner.sh exists${NC}"
    fi

    if [ "$PASS" = true ]; then
        echo ""
        echo -e "${GREEN}UX Polish Gate: PASS${NC}"
        return 0
    else
        echo ""
        echo -e "${RED}UX Polish Gate: FAIL${NC}"
        return 1
    fi
}

PIPELINE=$(detect_pipeline)
echo "Detected pipeline: $PIPELINE"
echo ""

# Run appropriate validator
case $PIPELINE in
    "agent-factory")
        echo "Running agent-factory validator..."
        echo ""
        # Find the validator script
        SCRIPT_DIR="$(dirname "$(dirname "$0")")"
        VALIDATOR="$SCRIPT_DIR/agent-factory/scripts/validate.js"
        if [ -f "$VALIDATOR" ]; then
            node "$VALIDATOR" "$PROJECT_PATH"
        else
            echo -e "${RED}Error: Validator not found at $VALIDATOR${NC}"
            exit 1
        fi
        ;;

    "website-pipeline")
        echo "Running website-pipeline validator..."
        echo ""

        # Basic checks
        PASS=true

        if [ ! -f "$PROJECT_PATH/package.json" ]; then
            echo -e "${RED}FAIL: Missing package.json${NC}"
            PASS=false
        else
            echo -e "${GREEN}PASS: package.json exists${NC}"
        fi

        if [ ! -d "$PROJECT_PATH/src" ]; then
            echo -e "${RED}FAIL: Missing src/ directory${NC}"
            PASS=false
        else
            echo -e "${GREEN}PASS: src/ directory exists${NC}"
        fi

        if [ ! -d "$PROJECT_PATH/audits" ]; then
            echo -e "${YELLOW}WARN: Missing audits/ directory${NC}"
        else
            echo -e "${GREEN}PASS: audits/ directory exists${NC}"
        fi

        # UX Polish Gate (MANDATORY for website-pipeline)
        check_ux_polish_gate || PASS=false

        if [ "$PASS" = true ]; then
            echo ""
            echo -e "${GREEN}PASSED${NC}"
        else
            echo ""
            echo -e "${RED}FAILED${NC}"
            exit 1
        fi
        ;;

    "dapp-factory")
        echo "Running dapp-factory validator..."
        echo ""

        # Basic checks
        PASS=true

        if [ ! -f "$PROJECT_PATH/package.json" ]; then
            echo -e "${RED}FAIL: Missing package.json${NC}"
            PASS=false
        else
            echo -e "${GREEN}PASS: package.json exists${NC}"
        fi

        if [ ! -d "$PROJECT_PATH/src" ]; then
            echo -e "${RED}FAIL: Missing src/ directory${NC}"
            PASS=false
        else
            echo -e "${GREEN}PASS: src/ directory exists${NC}"
        fi

        if [ ! -d "$PROJECT_PATH/research" ]; then
            echo -e "${YELLOW}WARN: Missing research/ directory${NC}"
        else
            echo -e "${GREEN}PASS: research/ directory exists${NC}"
        fi

        # UX Polish Gate (MANDATORY for dapp-factory)
        check_ux_polish_gate || PASS=false

        if [ "$PASS" = true ]; then
            echo ""
            echo -e "${GREEN}PASSED${NC}"
        else
            echo ""
            echo -e "${RED}FAILED${NC}"
            exit 1
        fi
        ;;


    "app-factory")
        echo "Running app-factory validator..."
        echo ""
        SCRIPT_DIR="$(dirname "$(dirname "$0")")"
        PROOF_GATE="$SCRIPT_DIR/app-factory/scripts/build_proof_gate.sh"
        if [ -f "$PROOF_GATE" ]; then
            bash "$PROOF_GATE" "$PROJECT_PATH"
        else
            echo -e "${YELLOW}Warning: Proof gate script not found${NC}"
            echo "Running basic checks..."

            # Basic checks for mobile apps
            PASS=true

            if [ ! -f "$PROJECT_PATH/package.json" ]; then
                echo -e "${RED}FAIL: Missing package.json${NC}"
                PASS=false
            else
                echo -e "${GREEN}PASS: package.json exists${NC}"
            fi

            if [ ! -f "$PROJECT_PATH/app.json" ]; then
                echo -e "${RED}FAIL: Missing app.json${NC}"
                PASS=false
            else
                echo -e "${GREEN}PASS: app.json exists${NC}"
            fi

            if [ ! -d "$PROJECT_PATH/app" ] && [ ! -d "$PROJECT_PATH/src" ]; then
                echo -e "${RED}FAIL: Missing app/ or src/ directory${NC}"
                PASS=false
            else
                echo -e "${GREEN}PASS: Source directory exists${NC}"
            fi

            if [ "$PASS" = true ]; then
                echo ""
                echo -e "${GREEN}PASSED${NC}"
            else
                echo ""
                echo -e "${RED}FAILED${NC}"
                exit 1
            fi
        fi
        ;;

    *)
        echo -e "${RED}Error: Could not detect pipeline type${NC}"
        echo ""
        echo "Expected one of:"
        echo "  - agent.json (agent-factory)"
        echo "  - next.config.js (dapp-factory)"
        echo "  - app.json + expo-env.d.ts (app-factory)"
        exit 1
        ;;
esac

echo ""
echo "============================================================"
echo -e "  ${GREEN}Factory Ready Check Complete${NC}"
echo "============================================================"
echo ""
echo "Next steps:"
echo "  1. Push to GitHub"
echo "  2. Import on factoryapp.dev (Repo Mode)"
echo ""
