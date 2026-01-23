#!/bin/bash

# =============================================================================
#   ___                ______         _
#  / _ \               |  ___|       | |
# / /_\ \_ __  _ __    | |_ __ _  ___| |_ ___  _ __ _   _
# |  _  | '_ \| '_ \   |  _/ _` |/ __| __/ _ \| '__| | | |
# | | | | |_) | |_) |  | || (_| | (__| || (_) | |  | |_| |
# \_| |_/ .__/| .__/   \_| \__,_|\___|\__\___/|_|   \__, |
#       | |   | |                                    __/ |
#       |_|   |_|                                   |___/
#
#   Quick Start Script
#   Describe it. Build it. Ship it.
# =============================================================================

set -euo pipefail

# Trap handler for cleanup on error or exit
cleanup() {
    local exit_code=$?
    if [ $exit_code -ne 0 ]; then
        echo ""
        echo -e "${RED}Script exited with error code: $exit_code${NC}"
    fi
}
trap cleanup EXIT

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Script location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Print header
print_header() {
    echo ""
    echo -e "${CYAN}${BOLD}"
    echo "  ___                ______         _                   "
    echo " / _ \\               |  ___|       | |                  "
    echo "/ /_\\ \\_ __  _ __    | |_ __ _  ___| |_ ___  _ __ _   _ "
    echo "|  _  | '_ \\| '_ \\   |  _/ _\` |/ __| __/ _ \\| '__| | | |"
    echo "| | | | |_) | |_) |  | || (_| | (__| || (_) | |  | |_| |"
    echo "\\_| |_/ .__/| .__/   \\_| \\__,_|\\___|\\__\\___/|_|   \\__, |"
    echo "      | |   | |                                    __/ |"
    echo "      |_|   |_|                                   |___/ "
    echo -e "${NC}"
    echo -e "${BOLD}Describe it. Build it. Ship it.${NC}"
    echo ""
    echo "============================================================"
    echo ""
}

# Print pipeline menu
print_menu() {
    echo -e "${BOLD}What would you like to build?${NC}"
    echo ""
    echo -e "  ${CYAN}1)${NC} Mobile App      ${MAGENTA}(iOS + Android via Expo)${NC}"
    echo -e "  ${CYAN}2)${NC} dApp / Website  ${MAGENTA}(Next.js, optional AI agents)${NC}"
    echo -e "  ${CYAN}3)${NC} AI Agent        ${MAGENTA}(HTTP API with tools)${NC}"
    echo -e "  ${CYAN}4)${NC} Claude Plugin   ${MAGENTA}(Extensions for Claude Code)${NC}"
    echo -e "  ${CYAN}5)${NC} Base Mini App   ${MAGENTA}(MiniKit + Next.js)${NC}"
    echo ""
    echo -e "  ${CYAN}h)${NC} Help"
    echo -e "  ${CYAN}q)${NC} Quit"
    echo ""
}

# Print help
print_help() {
    echo ""
    echo -e "${BOLD}App Factory Quick Start Guide${NC}"
    echo ""
    echo "App Factory transforms your ideas into real, working products."
    echo "Just describe what you want in plain English, and Claude builds it."
    echo ""
    echo -e "${BOLD}Prerequisites:${NC}"
    echo "  - Node.js 18+ (run 'node --version' to check)"
    echo "  - Claude Code CLI (run 'claude --version' to check)"
    echo ""
    echo -e "${BOLD}How It Works:${NC}"
    echo "  1. Choose a pipeline (mobile app, dApp, agent, plugin, or mini app)"
    echo "  2. Describe your idea in plain English"
    echo "  3. Claude builds everything for you"
    echo "  4. Run your creation with the provided commands"
    echo ""
    echo -e "${BOLD}Quick Commands:${NC}"
    echo "  ./quickstart.sh           Interactive pipeline selector"
    echo "  ./quickstart.sh app       Quick start mobile app pipeline"
    echo "  ./quickstart.sh dapp      Quick start dApp pipeline"
    echo "  ./quickstart.sh agent     Quick start AI agent pipeline"
    echo "  ./quickstart.sh plugin    Quick start plugin pipeline"
    echo "  ./quickstart.sh miniapp   Quick start mini app pipeline"
    echo "  ./quickstart.sh check     System requirements check"
    echo ""
    echo -e "${BOLD}Documentation:${NC}"
    echo "  README.md                 Main documentation"
    echo "  examples/                 Working examples for each pipeline"
    echo "  docs/                     Architecture and learning materials"
    echo ""
}

# System check
system_check() {
    echo ""
    echo -e "${BOLD}System Requirements Check${NC}"
    echo "============================================================"
    echo ""

    local ALL_PASS=true

    # Check Node.js
    echo -n "Node.js 18+: "
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v | sed 's/v//')
        NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)
        if [ "$NODE_MAJOR" -ge 18 ]; then
            echo -e "${GREEN}PASS${NC} (v$NODE_VERSION)"
        else
            echo -e "${RED}FAIL${NC} (v$NODE_VERSION - requires 18+)"
            ALL_PASS=false
        fi
    else
        echo -e "${RED}FAIL${NC} (not installed)"
        echo ""
        echo -e "${YELLOW}To install Node.js:${NC}"
        echo "  macOS:   brew install node"
        echo "  Ubuntu:  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs"
        echo "  Windows: Download from https://nodejs.org/"
        ALL_PASS=false
    fi

    # Check npm
    echo -n "npm: "
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm -v)
        echo -e "${GREEN}PASS${NC} (v$NPM_VERSION)"
    else
        echo -e "${RED}FAIL${NC} (not installed)"
        ALL_PASS=false
    fi

    # Check Claude CLI (optional but recommended)
    echo -n "Claude CLI: "
    if command -v claude &> /dev/null; then
        CLAUDE_VERSION=$(claude --version 2>/dev/null || echo "unknown")
        echo -e "${GREEN}PASS${NC} ($CLAUDE_VERSION)"
    else
        echo -e "${YELLOW}OPTIONAL${NC} (not installed)"
        echo ""
        echo -e "${YELLOW}Claude CLI is recommended for the best experience.${NC}"
        echo "  Install: npm install -g @anthropic-ai/claude-code"
        echo "  Or use the standalone CLI in ./CLI/ directory"
    fi

    # Check Git
    echo -n "Git: "
    if command -v git &> /dev/null; then
        GIT_VERSION=$(git --version | sed 's/git version //')
        echo -e "${GREEN}PASS${NC} (v$GIT_VERSION)"
    else
        echo -e "${RED}FAIL${NC} (not installed)"
        echo ""
        echo -e "${YELLOW}Git is required for version control, hooks, and repository operations.${NC}"
        echo "  macOS:   brew install git"
        echo "  Ubuntu:  sudo apt-get install git"
        echo "  Windows: Download from https://git-scm.com/"
        ALL_PASS=false
    fi

    # Check python3 (required for app-factory validation)
    echo -n "python3: "
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 --version 2>&1 | sed 's/Python //')
        echo -e "${GREEN}PASS${NC} (v$PYTHON_VERSION)"
    else
        echo -e "${YELLOW}OPTIONAL${NC} (not installed)"
        echo ""
        echo -e "${YELLOW}python3 is required for app-factory build validation.${NC}"
        echo "  macOS:   brew install python3"
        echo "  Ubuntu:  sudo apt-get install python3"
        echo "  Windows: Download from https://www.python.org/"
    fi

    # Check lsof (required for app-factory port cleanup, macOS/Linux only)
    echo -n "lsof: "
    if command -v lsof &> /dev/null; then
        echo -e "${GREEN}PASS${NC}"
    else
        echo -e "${YELLOW}OPTIONAL${NC} (not installed)"
        echo ""
        echo -e "${YELLOW}lsof is required for app-factory Metro port cleanup (macOS/Linux).${NC}"
        echo "  Usually pre-installed on macOS/Linux"
        echo "  Windows users: Use WSL2 or Git Bash"
    fi

    # Check curl (required for deployment features)
    echo -n "curl: "
    if command -v curl &> /dev/null; then
        echo -e "${GREEN}PASS${NC}"
    else
        echo -e "${YELLOW}OPTIONAL${NC} (not installed)"
        echo ""
        echo -e "${YELLOW}curl is required for deployment features.${NC}"
        echo "  Usually pre-installed on macOS/Linux"
    fi

    # Check tar (required for deployment features)
    echo -n "tar: "
    if command -v tar &> /dev/null; then
        echo -e "${GREEN}PASS${NC}"
    else
        echo -e "${YELLOW}OPTIONAL${NC} (not installed)"
        echo ""
        echo -e "${YELLOW}tar is required for deployment features.${NC}"
        echo "  Usually pre-installed on macOS/Linux"
    fi

    # Check MCP Configuration
    echo -n "MCP Config: "
    if [ -f ".mcp.json" ] && [ -f ".claude/settings.json" ]; then
        MCP_COUNT=$(grep -o '"[^"]*":' .mcp.json | wc -l | tr -d ' ')
        echo -e "${GREEN}CONFIGURED${NC} (5 servers)"
        echo ""
        echo -e "  ${CYAN}Tip:${NC} Run 'claude' and type '/mcp' to verify connectivity"
        echo "  See docs/mcp.md for setup instructions"
    else
        echo -e "${YELLOW}NOT CONFIGURED${NC}"
        echo ""
        echo -e "  ${YELLOW}MCP servers enhance code quality but are optional.${NC}"
        echo "  To configure: see docs/mcp.md"
    fi

    echo ""
    echo "============================================================"

    if [ "$ALL_PASS" = true ]; then
        echo -e "${GREEN}${BOLD}All required dependencies are installed!${NC}"
        echo ""
        echo "You're ready to build. Run ./quickstart.sh to get started."
    else
        echo -e "${RED}${BOLD}Some dependencies are missing.${NC}"
        echo ""
        echo "Please install the missing dependencies and try again."
    fi
    echo ""
}

# Start a specific pipeline
start_pipeline() {
    local PIPELINE=$1
    local PIPELINE_DIR=""
    local PIPELINE_NAME=""
    local BUILD_DIR=""
    local RUN_CMD=""

    case $PIPELINE in
        app|1)
            PIPELINE_DIR="app-factory"
            PIPELINE_NAME="Mobile App"
            BUILD_DIR="builds/<your-app>"
            RUN_CMD="npm install && npx expo start"
            ;;
        dapp|2)
            PIPELINE_DIR="dapp-factory"
            PIPELINE_NAME="dApp / Website"
            BUILD_DIR="dapp-builds/<your-dapp>"
            RUN_CMD="npm install && npm run dev"
            ;;
        agent|3)
            PIPELINE_DIR="agent-factory"
            PIPELINE_NAME="AI Agent"
            BUILD_DIR="outputs/<your-agent>"
            RUN_CMD="npm install && npm run dev"
            ;;
        plugin|4)
            PIPELINE_DIR="plugin-factory"
            PIPELINE_NAME="Claude Plugin"
            BUILD_DIR="builds/<your-plugin>"
            RUN_CMD="Copy to your project"
            ;;
        miniapp|5)
            PIPELINE_DIR="miniapp-pipeline"
            PIPELINE_NAME="Base Mini App"
            BUILD_DIR="builds/miniapps/<your-app>/app"
            RUN_CMD="npm install && npm run dev"
            ;;
        *)
            echo -e "${RED}Unknown pipeline: $PIPELINE${NC}"
            exit 1
            ;;
    esac

    echo ""
    echo -e "${BOLD}Starting ${PIPELINE_NAME} Pipeline${NC}"
    echo "============================================================"
    echo ""
    echo -e "Directory: ${CYAN}$SCRIPT_DIR/$PIPELINE_DIR${NC}"
    echo ""
    echo -e "${BOLD}After your build completes:${NC}"
    echo -e "  cd $PIPELINE_DIR/$BUILD_DIR"
    echo -e "  $RUN_CMD"
    echo ""
    echo -e "${YELLOW}Starting Claude...${NC}"
    echo ""

    # Check if ANTHROPIC_API_KEY is set
    if [ -z "$ANTHROPIC_API_KEY" ]; then
        echo -e "${RED}ERROR: ANTHROPIC_API_KEY environment variable is not set.${NC}"
        echo ""
        echo "AppFactory requires an Anthropic API key to function."
        echo ""
        echo "Setup steps:"
        echo "  1. Copy the example environment file:"
        echo "     cp .env.example .env"
        echo ""
        echo "  2. Get your API key from: https://console.anthropic.com/"
        echo ""
        echo "  3. Add your key to .env:"
        echo "     ANTHROPIC_API_KEY=your_key_here"
        echo ""
        echo "  4. Load the environment:"
        echo "     source .env"
        echo "     (or restart your terminal)"
        echo ""
        exit 1
    fi

    # Check if Claude CLI is available
    if command -v claude &> /dev/null; then
        cd "$SCRIPT_DIR/$PIPELINE_DIR"
        echo -e "${GREEN}Entering $PIPELINE_DIR directory...${NC}"
        echo ""
        echo -e "${BOLD}Describe your idea to Claude:${NC}"
        echo ""
        exec claude
    else
        echo -e "${RED}Claude CLI not found.${NC}"
        echo ""
        echo "Please install Claude CLI:"
        echo "  npm install -g @anthropic-ai/claude-code"
        echo ""
        echo "Or manually navigate to the pipeline:"
        echo "  cd $PIPELINE_DIR"
        echo "  claude"
        exit 1
    fi
}

# Interactive mode
interactive_mode() {
    print_header
    print_menu

    echo -n "Enter your choice: "
    read -r choice

    case $choice in
        1|app)
            start_pipeline "app"
            ;;
        2|dapp)
            start_pipeline "dapp"
            ;;
        3|agent)
            start_pipeline "agent"
            ;;
        4|plugin)
            start_pipeline "plugin"
            ;;
        5|miniapp)
            start_pipeline "miniapp"
            ;;
        h|help)
            print_help
            ;;
        q|quit|exit)
            echo ""
            echo "Goodbye!"
            echo ""
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice. Please try again.${NC}"
            echo ""
            interactive_mode
            ;;
    esac
}

# Main entry point
main() {
    case ${1:-} in
        app|mobile)
            start_pipeline "app"
            ;;
        dapp|website|web)
            start_pipeline "dapp"
            ;;
        agent)
            start_pipeline "agent"
            ;;
        plugin)
            start_pipeline "plugin"
            ;;
        miniapp|mini)
            start_pipeline "miniapp"
            ;;
        check|doctor|status)
            print_header
            system_check
            ;;
        help|-h|--help)
            print_header
            print_help
            ;;
        "")
            interactive_mode
            ;;
        *)
            echo -e "${RED}Unknown command: $1${NC}"
            echo ""
            print_help
            exit 1
            ;;
    esac
}

main "$@"
