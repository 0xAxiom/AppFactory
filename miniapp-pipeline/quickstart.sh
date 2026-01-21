#!/bin/bash

# =============================================================================
#   App Factory - Base Mini App Pipeline Quick Start
#   Build mini apps for the Base ecosystem
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
echo " __  __ _       _    _                  ____  _            _ _            "
echo "|  \\/  (_)_ __ (_)  / \\   _ __  _ __   |  _ \\(_)_ __   ___| (_)_ __   ___ "
echo "| |\\/| | | '_ \\| | / _ \\ | '_ \\| '_ \\  | |_) | | '_ \\ / _ \\ | | '_ \\ / _ \\"
echo "| |  | | | | | | |/ ___ \\| |_) | |_) | |  __/| | |_) |  __/ | | | | |  __/"
echo "|_|  |_|_|_| |_|_/_/   \\_\\ .__/| .__/  |_|   |_| .__/ \\___|_|_|_| |_|\\___|"
echo "                         |_|   |_|             |_|                        "
echo -e "${NC}"
echo ""
echo -e "${BOLD}Base Mini App Pipeline${NC}"
echo "Build mini apps for the Base ecosystem"
echo ""
echo "============================================================"
echo ""
echo -e "${BOLD}What this pipeline produces:${NC}"
echo "  - Complete Next.js mini app"
echo "  - MiniKit configuration"
echo "  - Manifest route for Base"
echo "  - Account association guidance"
echo ""
echo -e "${BOLD}Output directory:${NC} builds/miniapps/<your-app>/app/"
echo ""
echo -e "${BOLD}After building:${NC}"
echo "  cd builds/miniapps/<your-app>/app"
echo "  npm install"
echo "  npm run dev"
echo ""
echo -e "${YELLOW}Note: You must complete account association at base.dev${NC}"
echo -e "${YELLOW}before your mini app can appear in the Base app.${NC}"
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
echo "Describe your mini app idea in plain English."
echo ""

if command -v claude &> /dev/null; then
    exec claude
else
    echo -e "${YELLOW}Claude CLI not found.${NC}"
    echo ""
    echo "Install with: npm install -g @anthropic-ai/claude-code"
    exit 1
fi
