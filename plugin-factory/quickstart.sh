#!/bin/bash

# =============================================================================
#   App Factory - Claude Plugin Pipeline Quick Start
#   Build extensions for Claude Code
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
echo " ____  _             _        _____         _                   "
echo "|  _ \\| |_   _  __ _(_)_ __  |  ___|_ _  __| |_ ___  _ __ _   _ "
echo "| |_) | | | | |/ _\` | | '_ \\ | |_ / _\` |/ __| __/ _ \\| '__| | | |"
echo "|  __/| | |_| | (_| | | | | ||  _| (_| | (__| || (_) | |  | |_| |"
echo "|_|   |_|\\__,_|\\__, |_|_| |_||_|  \\__,_|\\___|\\__\\___/|_|   \\__, |"
echo "               |___/                                       |___/ "
echo -e "${NC}"
echo ""
echo -e "${BOLD}Claude Plugin Pipeline${NC}"
echo "Build extensions for Claude Code"
echo ""
echo "============================================================"
echo ""
echo -e "${BOLD}What this pipeline produces:${NC}"
echo "  - Claude Code plugin with commands"
echo "  - MCP server (optional)"
echo "  - Security documentation"
echo "  - Installation instructions"
echo ""
echo -e "${BOLD}Output directory:${NC} builds/<your-plugin>/"
echo ""
echo -e "${BOLD}After building:${NC}"
echo "  Copy to your project's .claude/plugins/ directory"
echo "  Or symlink for development"
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
echo "Describe your plugin idea in plain English."
echo ""

if command -v claude &> /dev/null; then
    exec claude
else
    echo -e "${YELLOW}Claude CLI not found.${NC}"
    echo ""
    echo "Install with: npm install -g @anthropic-ai/claude-code"
    exit 1
fi
