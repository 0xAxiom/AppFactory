#!/usr/bin/env bash
#
# competitor_screenshots.sh - Automated competitor app screenshots via App Store web
#
# REQUIRES: agent-browser (optional tool)
#   npm install -g agent-browser && agent-browser install
#
# Usage:
#   ./competitor_screenshots.sh <app-store-url> [output-dir]
#
# Examples:
#   ./competitor_screenshots.sh https://apps.apple.com/app/headspace-sleep-meditation/id493145008
#   ./competitor_screenshots.sh https://apps.apple.com/app/calm/id571800810 ./research/competitor_screenshots
#

set -euo pipefail

URL="${1:-}"
OUTPUT_DIR="${2:-./research/competitor_screenshots}"

if [ -z "$URL" ]; then
  echo "Usage: $0 <app-store-url> [output-dir]"
  echo ""
  echo "Captures screenshots of competitor App Store pages for research."
  echo ""
  echo "Examples:"
  echo "  $0 https://apps.apple.com/app/headspace-sleep-meditation/id493145008"
  echo "  $0 https://apps.apple.com/app/calm/id571800810 ./custom-output"
  echo ""
  echo "Note: Works best with Apple App Store URLs for UI screenshot reference."
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

# Extract app name from URL for filename
APP_NAME=$(echo "$URL" | sed -E 's|.*/app/([^/]+)/.*|\1|' | tr '[:upper:]' '[:lower:]')
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

if [ -z "$APP_NAME" ] || [ "$APP_NAME" = "$URL" ]; then
  APP_NAME="competitor"
fi

FILENAME="${APP_NAME}-${TIMESTAMP}.png"

echo "Capturing App Store page: $URL"
echo "Output: $OUTPUT_DIR/$FILENAME"

# Use agent-browser to capture screenshot
# Set mobile viewport to see mobile-optimized App Store page
agent-browser resize 430 932  # iPhone 14 Pro Max dimensions

agent-browser open "$URL"
sleep 4  # Wait for page load (App Store pages can be slow)

agent-browser screenshot --path "$OUTPUT_DIR/$FILENAME"

echo ""
echo "Screenshot saved: $OUTPUT_DIR/$FILENAME"

# Scroll down to capture more content (screenshots section)
echo "Capturing scrolled view (app screenshots section)..."
agent-browser scroll down 500
sleep 1

SCROLLED_FILENAME="${APP_NAME}-screenshots-${TIMESTAMP}.png"
agent-browser screenshot --path "$OUTPUT_DIR/$SCROLLED_FILENAME"

echo "Scrolled screenshot saved: $OUTPUT_DIR/$SCROLLED_FILENAME"

# Scroll to reviews section
echo "Capturing reviews section..."
agent-browser scroll down 800
sleep 1

REVIEWS_FILENAME="${APP_NAME}-reviews-${TIMESTAMP}.png"
agent-browser screenshot --path "$OUTPUT_DIR/$REVIEWS_FILENAME"

echo "Reviews screenshot saved: $OUTPUT_DIR/$REVIEWS_FILENAME"

# Reset viewport
agent-browser resize 1440 900

echo ""
echo "Done! Screenshots saved to $OUTPUT_DIR/"
echo ""
echo "Captured:"
echo "  - $FILENAME (header/hero)"
echo "  - $SCROLLED_FILENAME (screenshots section)"
echo "  - $REVIEWS_FILENAME (reviews section)"
