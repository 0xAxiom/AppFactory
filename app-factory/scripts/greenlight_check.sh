#!/bin/bash

# App Factory - Apple App Store Compliance Check
# Uses RevylAI/greenlight to scan for App Store rejection risks
# Run this before submitting ANY iOS/mobile app build

set -e

PROJECT_PATH="${1:-.}"
IPA_PATH="${2:-}"

echo "=== Apple App Store Compliance Check ==="
echo "Project: $PROJECT_PATH"
[ -n "$IPA_PATH" ] && echo "IPA: $IPA_PATH"
echo

# Check greenlight is installed
if ! command -v greenlight &>/dev/null; then
    echo "❌ greenlight not installed"
    echo "   Install: brew install revylai/tap/greenlight"
    exit 1
fi

# Build the command
CMD="greenlight preflight $PROJECT_PATH"
[ -n "$IPA_PATH" ] && CMD="$CMD --ipa $IPA_PATH"

# Run full preflight scan
echo "Running preflight scan..."
echo "---"
$CMD
RESULT=$?
echo "---"

if [ $RESULT -eq 0 ]; then
    echo ""
    echo "✅ App Store compliance check PASSED"
    echo "   No rejection risks detected"
else
    echo ""
    echo "⚠️ App Store compliance issues found"
    echo "   Review the report above and fix before submitting"
fi

# Also run individual scanners for detailed output
echo ""
echo "=== Detailed Code Scan ==="
greenlight codescan "$PROJECT_PATH" || true

echo ""
echo "=== Privacy Manifest Check ==="
greenlight privacy "$PROJECT_PATH" || true

if [ -n "$IPA_PATH" ]; then
    echo ""
    echo "=== IPA Binary Inspection ==="
    greenlight ipa "$IPA_PATH" || true
fi

# JSON report for CI/CD integration
REPORT_DIR="$PROJECT_PATH/.greenlight"
mkdir -p "$REPORT_DIR"
greenlight preflight "$PROJECT_PATH" --format json --output "$REPORT_DIR/report.json" 2>/dev/null || true

if [ -f "$REPORT_DIR/report.json" ]; then
    echo ""
    echo "📄 JSON report saved to: $REPORT_DIR/report.json"
fi

exit $RESULT
