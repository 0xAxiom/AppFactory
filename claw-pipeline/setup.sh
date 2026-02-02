#!/bin/bash
# Claw Pipeline — One-Command Setup
# Usage: bash setup.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🐾 CLAW PIPELINE — Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    echo "   Install: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required. Found: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version)"
echo "✅ npm $(npm --version)"
echo ""

# Choose mode
echo "What would you like to do?"
echo "  [1] Create a new Clawbot (interactive wizard)"
echo "  [2] Run the full pipeline (automated)"
echo "  [3] Validate an existing workspace"
echo ""
read -p "Choose (1-3): " CHOICE

case $CHOICE in
    1)
        echo ""
        echo "Starting interactive configuration wizard..."
        echo ""
        node "$SCRIPT_DIR/scripts/configure.mjs"
        ;;
    2)
        echo ""
        echo "Starting pipeline..."
        echo ""
        node "$SCRIPT_DIR/scripts/run.mjs"
        ;;
    3)
        read -p "Bot slug: " SLUG
        echo ""
        node "$SCRIPT_DIR/scripts/validate-setup.mjs" --slug "$SLUG"
        ;;
    *)
        echo "Invalid choice."
        exit 1
        ;;
esac
