#!/bin/bash

# =============================================================================
#   App Factory - Mobile App Pipeline Quick Start
#   Build iOS & Android apps with Expo + React Native
# =============================================================================

set -e

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
echo "  ___              _____         _                   "
echo " / _ \\            |  ___|       | |                  "
echo "/ /_\\ \\_ __  _ __ | |_ __ _  ___| |_ ___  _ __ _   _ "
echo "|  _  | '_ \\| '_ \\|  _/ _\` |/ __| __/ _ \\| '__| | | |"
echo "| | | | |_) | |_) | || (_| | (__| || (_) | |  | |_| |"
echo "\\_| |_/ .__/| .__/\\_| \\__,_|\\___|\\__\\___/|_|   \\__, |"
echo "      | |   | |                                 __/ |"
echo "      |_|   |_|         MOBILE APPS            |___/ "
echo -e "${NC}"
echo ""
echo -e "${BOLD}Mobile App Pipeline${NC}"
echo "Build iOS & Android apps with Expo + React Native"
echo ""
echo "============================================================"
echo ""
echo -e "${BOLD}What this pipeline produces:${NC}"
echo "  - Complete Expo React Native app"
echo "  - RevenueCat monetization"
echo "  - Market research and ASO materials"
echo "  - Store-ready assets"
echo ""
echo -e "${BOLD}Output directory:${NC} builds/<your-app>/app/"
echo ""
echo -e "${BOLD}After building, run:${NC}"
echo "  cd builds/<your-app>/app"
echo "  npm install"
echo "  npx expo start"
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
echo "Describe your mobile app idea in plain English."
echo ""

if command -v claude &> /dev/null; then
    exec claude
else
    echo -e "${YELLOW}Claude CLI not found.${NC}"
    echo ""
    echo "Install with: npm install -g @anthropic-ai/claude-code"
    echo ""
    echo "Or use the standalone CLI:"
    echo "  cd ../CLI && npm install && npm start"
    exit 1
fi
