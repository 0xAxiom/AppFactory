#!/bin/bash

# =============================================================================
#   App Factory - AI Agent Pipeline Quick Start
#   Build production-ready AI agents with HTTP APIs
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
echo "    _                    _   _____         _                   "
echo "   / \\   __ _  ___ _ __ | |_|  ___|_ _  __| |_ ___  _ __ _   _ "
echo "  / _ \\ / _\` |/ _ \\ '_ \\| __| |_ / _\` |/ __| __/ _ \\| '__| | | |"
echo " / ___ \\ (_| |  __/ | | | |_|  _| (_| | (__| || (_) | |  | |_| |"
echo "/_/   \\_\\__, |\\___|_| |_|\\__|_|  \\__,_|\\___|\\__\\___/|_|   \\__, |"
echo "        |___/                                             |___/ "
echo -e "${NC}"
echo ""
echo -e "${BOLD}AI Agent Pipeline${NC}"
echo "Build production-ready AI agents with HTTP APIs"
echo ""
echo "============================================================"
echo ""
echo -e "${BOLD}What this pipeline produces:${NC}"
echo "  - Complete Node.js/TypeScript agent"
echo "  - HTTP API with /health and /process endpoints"
echo "  - Rig-aligned architecture"
echo "  - Market research and positioning"
echo ""
echo -e "${BOLD}Output directory:${NC} outputs/<your-agent>/"
echo ""
echo -e "${BOLD}After building, run:${NC}"
echo "  cd outputs/<your-agent>"
echo "  npm install"
echo "  npm run dev"
echo "  curl http://localhost:8080/health"
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
echo "Describe your AI agent idea in plain English."
echo ""

if command -v claude &> /dev/null; then
    exec claude
else
    echo -e "${YELLOW}Claude CLI not found.${NC}"
    echo ""
    echo "Install with: npm install -g @anthropic-ai/claude-code"
    exit 1
fi
