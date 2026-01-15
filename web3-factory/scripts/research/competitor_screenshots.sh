#!/usr/bin/env bash
#
# competitor_screenshots.sh - Automated competitor UI screenshots
#
# REQUIRES: agent-browser (optional tool)
#   npm install -g agent-browser && agent-browser install
#
# Usage:
#   ./competitor_screenshots.sh <url> [output-dir]
#
# Examples:
#   ./competitor_screenshots.sh https://competitor.com
#   ./competitor_screenshots.sh https://competitor.com ./research/competitor_screenshots
#

set -euo pipefail

URL="${1:-}"
OUTPUT_DIR="${2:-./research/competitor_screenshots}"

if [ -z "$URL" ]; then
  echo "Usage: $0 <url> [output-dir]"
  echo ""
  echo "Captures screenshots of competitor websites for research."
  echo ""
  echo "Examples:"
  echo "  $0 https://competitor.com"
  echo "  $0 https://competitor.com ./custom-output"
  exit 1
fi

# Check if agent-browser is installed
if ! command -v agent-browser &> /dev/null; then
  echo "================================================"
  echo "agent-browser not installed (optional tool)"
  echo ""
  echo "To enable automated screenshots, install:"
  echo "  npm install -g agent-browser"
  echo "  agent-browser install"
  echo ""
  echo "Skipping automated screenshot capture."
  echo "================================================"
  exit 0
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Extract domain for filename
DOMAIN=$(echo "$URL" | sed -E 's|https?://||' | sed 's|/.*||' | tr '.' '-')
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
FILENAME="${DOMAIN}-${TIMESTAMP}.png"

echo "Capturing screenshot of: $URL"
echo "Output: $OUTPUT_DIR/$FILENAME"

# Use agent-browser to capture screenshot
agent-browser open "$URL"
sleep 3  # Wait for page load

agent-browser screenshot --path "$OUTPUT_DIR/$FILENAME"

echo ""
echo "Screenshot saved: $OUTPUT_DIR/$FILENAME"

# Capture mobile viewport as well
MOBILE_FILENAME="${DOMAIN}-mobile-${TIMESTAMP}.png"
echo "Capturing mobile viewport..."

agent-browser resize 375 812  # iPhone X dimensions
sleep 1
agent-browser screenshot --path "$OUTPUT_DIR/$MOBILE_FILENAME"

echo "Mobile screenshot saved: $OUTPUT_DIR/$MOBILE_FILENAME"

# Reset viewport
agent-browser resize 1440 900

echo ""
echo "Done! Screenshots saved to $OUTPUT_DIR/"
