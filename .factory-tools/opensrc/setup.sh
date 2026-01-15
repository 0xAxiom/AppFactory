#!/usr/bin/env bash
#
# opensrc setup script
#
# opensrc is an OPTIONAL tool for App Factory that enables:
# - Fetching dependency source code during build phase
# - Reducing hallucination when using unfamiliar packages
# - Looking up exact API signatures
#
# Requirements:
# - Node.js 18+
# - Network access to npm/GitHub
#
# Source: https://github.com/vercel-labs/opensrc
# License: Apache-2.0
#

set -euo pipefail

echo "========================================"
echo "  opensrc Setup"
echo "========================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "ERROR: Node.js is required but not installed."
  echo "Install from: https://nodejs.org/"
  exit 1
fi

echo "Node.js: $(node -v)"
echo ""

# opensrc can be used directly with npx (no global install required)
echo "opensrc can be used in two ways:"
echo ""
echo "1. Direct usage with npx (no installation):"
echo "   npx opensrc <package-name>"
echo "   npx opensrc react@18.2.0"
echo "   npx opensrc @solana/web3.js"
echo ""
echo "2. Global installation (faster repeated use):"
echo "   npm install -g opensrc"
echo ""

read -p "Install globally? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Installing opensrc globally..."
  npm install -g opensrc
  echo ""
  echo "Installed! Use: opensrc <package-name>"
else
  echo "Skipping global install. Use: npx opensrc <package-name>"
fi

echo ""
echo "========================================"
echo "  Setup Complete"
echo "========================================"
echo ""
echo "Examples:"
echo "  opensrc next              # Look up Next.js source"
echo "  opensrc framer-motion     # Look up Framer Motion"
echo "  opensrc @solana/web3.js   # Look up Solana SDK"
echo ""
echo "The source code is fetched to help Claude understand"
echo "exact API signatures during code generation."
echo ""
