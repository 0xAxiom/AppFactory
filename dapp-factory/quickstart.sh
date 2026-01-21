#!/bin/bash

# =============================================================================
#   App Factory - dApp/Website Pipeline Quick Start
#   Build dApps and websites with Next.js
# =============================================================================

set -euo pipefail

# Trap handler for cleanup
trap 'echo ""; echo -e "\033[0;31mScript interrupted.\033[0m"' INT TERM

# Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'
BOLD='\033[1m'

# Navigate to pipeline directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo -e "${CYAN}${BOLD}"
echo "     _    ___              _____         _                   "
echo "    | |  / _ \\            |  ___|       | |                  "
echo "  __| | / /_\\ \\_ __  _ __ | |_ __ _  ___| |_ ___  _ __ _   _ "
echo " / _\` | |  _  | '_ \\| '_ \\|  _/ _\` |/ __| __/ _ \\| '__| | | |"
echo "| (_| | | | | | |_) | |_) | || (_| | (__| || (_) | |  | |_| |"
echo " \\__,_| \\_| |_/ .__/| .__/\\_| \\__,_|\\___|\\__\\___/|_|   \\__, |"
echo "              | |   | |                                 __/ |"
echo "              |_|   |_|       DAPPS & WEBSITES         |___/ "
echo -e "${NC}"
echo ""
echo -e "${BOLD}dApp/Website Pipeline${NC}"
echo "Build dApps and websites with Next.js"
echo ""
echo "============================================================"
echo ""
echo -e "${BOLD}What this pipeline produces:${NC}"
echo "  - Complete Next.js application"
echo "  - Optional AI agent integration (Mode B)"
echo "  - Market research and positioning"
echo "  - E2E tests with Playwright"
echo ""
echo -e "${BOLD}Output directory:${NC} dapp-builds/<your-dapp>/"
echo ""
echo -e "${BOLD}After building, run:${NC}"
echo "  cd dapp-builds/<your-dapp>"
echo "  npm install"
echo "  npm run dev"
echo ""
echo "============================================================"
echo ""

if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    echo -e "${BOLD}Usage:${NC}"
    echo "  ./quickstart.sh          Start interactive Claude session"
    echo "  ./quickstart.sh --help   Show this help"
    echo ""
    exit 0
fi

echo -e "${YELLOW}Starting Claude...${NC}"
echo "Describe your dApp or website idea in plain English."
echo ""

if command -v claude &> /dev/null; then
    exec claude
else
    echo -e "${YELLOW}Claude CLI not found.${NC}"
    echo ""
    echo "Install with: npm install -g @anthropic-ai/claude-code"
    exit 1
fi
