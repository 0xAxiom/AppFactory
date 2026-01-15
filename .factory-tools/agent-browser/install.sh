#!/usr/bin/env bash
#
# agent-browser installation script
#
# agent-browser is an OPTIONAL tool for App Factory that enables:
# - Automated competitor screenshots during research phase
# - UI smoke testing after builds
#
# Requirements:
# - Node.js 18+
# - ~684MB disk space for Chromium (or ~50MB with @sparticuz/chromium)
#
# Source: https://github.com/anthropics/agent-browser
# License: Apache-2.0
#

set -euo pipefail

echo "========================================"
echo "  agent-browser Installation"
echo "========================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "ERROR: Node.js is required but not installed."
  echo "Install from: https://nodejs.org/"
  exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "ERROR: Node.js 18+ required, found v$NODE_VERSION"
  exit 1
fi

echo "Node.js: $(node -v)"
echo ""

# Check if already installed
if command -v agent-browser &> /dev/null; then
  INSTALLED_VERSION=$(agent-browser --version 2>/dev/null || echo "unknown")
  echo "agent-browser already installed: $INSTALLED_VERSION"
  echo ""
  read -p "Reinstall? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Skipping installation."
    exit 0
  fi
fi

echo "Installing agent-browser globally..."
npm install -g agent-browser

echo ""
echo "Installing browser dependencies (Chromium)..."
echo "This may take a few minutes (~684MB download)..."
agent-browser install

echo ""
echo "========================================"
echo "  Installation Complete"
echo "========================================"
echo ""
echo "Verify installation:"
echo "  agent-browser --version"
echo ""
echo "Test it:"
echo "  agent-browser open https://example.com"
echo "  agent-browser screenshot --path test.png"
echo ""
echo "Usage in App Factory:"
echo "  web3-factory: scripts/research/competitor_screenshots.sh"
echo "  app-factory:  scripts/research/competitor_screenshots.sh"
echo ""
