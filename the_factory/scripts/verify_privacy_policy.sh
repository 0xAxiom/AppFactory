#!/bin/bash
# verify_privacy_policy.sh - Verifies privacy policy artifacts exist and are valid
# Usage: scripts/verify_privacy_policy.sh <build_output_dir>
#
# Exit codes:
#   0 = All privacy policy files exist and are valid
#   1 = Missing or invalid privacy policy files

set -e

BUILD_OUTPUT_DIR="$1"

if [[ -z "$BUILD_OUTPUT_DIR" ]]; then
    echo "Usage: $0 <build_output_dir>"
    echo "Example: $0 builds/01_app__id_001/build_xxx"
    exit 1
fi

POLICY_MD="$BUILD_OUTPUT_DIR/privacy_policy.md"
POLICY_HTML="$BUILD_OUTPUT_DIR/privacy_policy.html"
POLICY_SNIPPET="$BUILD_OUTPUT_DIR/privacy_policy_snippet.md"

echo "Verifying privacy policy artifacts in: $BUILD_OUTPUT_DIR"

MISSING=""
INVALID=""

# Check privacy_policy.md
if [[ ! -f "$POLICY_MD" ]]; then
    MISSING="${MISSING}\n  - privacy_policy.md"
elif [[ ! -s "$POLICY_MD" ]]; then
    INVALID="${INVALID}\n  - privacy_policy.md (empty)"
else
    # Verify required sections in markdown
    REQUIRED_SECTIONS=(
        "# Privacy Policy"
        "## Introduction"
        "## Information We Collect"
        "## Third-Party Service Providers"
        "## Data Retention"
        "## Your Rights"
        "## Contact Us"
    )

    for section in "${REQUIRED_SECTIONS[@]}"; do
        if ! grep -q "$section" "$POLICY_MD" 2>/dev/null; then
            INVALID="${INVALID}\n  - privacy_policy.md missing section: $section"
        fi
    done
fi

# Check privacy_policy.html
if [[ ! -f "$POLICY_HTML" ]]; then
    MISSING="${MISSING}\n  - privacy_policy.html"
elif [[ ! -s "$POLICY_HTML" ]]; then
    INVALID="${INVALID}\n  - privacy_policy.html (empty)"
else
    # Verify it's valid HTML structure
    if ! grep -q "<!DOCTYPE html>" "$POLICY_HTML" 2>/dev/null; then
        INVALID="${INVALID}\n  - privacy_policy.html missing DOCTYPE"
    fi
    if ! grep -q "<title>Privacy Policy" "$POLICY_HTML" 2>/dev/null; then
        INVALID="${INVALID}\n  - privacy_policy.html missing title"
    fi
    if ! grep -q "</html>" "$POLICY_HTML" 2>/dev/null; then
        INVALID="${INVALID}\n  - privacy_policy.html incomplete (missing closing tag)"
    fi
fi

# Check privacy_policy_snippet.md
if [[ ! -f "$POLICY_SNIPPET" ]]; then
    MISSING="${MISSING}\n  - privacy_policy_snippet.md"
elif [[ ! -s "$POLICY_SNIPPET" ]]; then
    INVALID="${INVALID}\n  - privacy_policy_snippet.md (empty)"
else
    # Verify snippet has key sections
    if ! grep -q "# Privacy Policy Summary" "$POLICY_SNIPPET" 2>/dev/null; then
        INVALID="${INVALID}\n  - privacy_policy_snippet.md missing header"
    fi
    if ! grep -q "## Key Points" "$POLICY_SNIPPET" 2>/dev/null; then
        INVALID="${INVALID}\n  - privacy_policy_snippet.md missing Key Points section"
    fi
fi

# Report results
if [[ -n "$MISSING" ]]; then
    echo "❌ FAIL: Missing privacy policy files:"
    echo -e "$MISSING"
    echo ""
    echo "Run scripts/generate_privacy_policy.sh first"
    exit 1
fi

if [[ -n "$INVALID" ]]; then
    echo "❌ FAIL: Invalid privacy policy files:"
    echo -e "$INVALID"
    exit 1
fi

# All checks passed
echo "✅ PASS: All privacy policy artifacts present and valid"
echo "   - privacy_policy.md"
echo "   - privacy_policy.html"
echo "   - privacy_policy_snippet.md"

# Check for policy URL placeholder warning
if grep -q "\[Privacy Policy URL\]" "$POLICY_SNIPPET" 2>/dev/null; then
    echo ""
    echo "⚠️ Note: Privacy policy URL is a placeholder - update before store submission"
fi

exit 0
