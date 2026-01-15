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
    echo "  ./scripts/factory_ready_check.sh web3-factory/web3-builds/my-app"
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
        echo "web3-factory"
    elif [ -f "$PROJECT_PATH/app.json" ] && [ -f "$PROJECT_PATH/expo-env.d.ts" ]; then
        echo "app-factory"
    elif [ -f "$PROJECT_PATH/app.json" ]; then
        echo "app-factory"
    else
        echo "unknown"
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

    "web3-factory")
        echo "Running web3-factory validator..."
        echo ""
        # Check if npm run validate is available
        if [ -f "$PROJECT_PATH/package.json" ]; then
            cd "$PROJECT_PATH"
            if grep -q '"validate"' package.json; then
                npm run validate
            else
                echo -e "${YELLOW}Warning: No validate script in package.json${NC}"
                echo "Add this to package.json scripts:"
                echo '  "validate": "node ../../validator/index.js"'
                exit 1
            fi
        else
            echo -e "${RED}Error: No package.json found${NC}"
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
        echo "  - next.config.js (web3-factory)"
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
