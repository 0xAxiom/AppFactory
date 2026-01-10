#!/bin/bash
# verify_launch_plan_present.sh - Verifies launch_plan.md exists and is non-empty
# Usage: scripts/verify_launch_plan_present.sh <build_output_dir>
#
# Exit codes:
#   0 = launch_plan.md exists and is valid
#   1 = launch_plan.md missing or empty

set -e

BUILD_OUTPUT_DIR="$1"

if [[ -z "$BUILD_OUTPUT_DIR" ]]; then
    echo "Usage: $0 <build_output_dir>"
    echo "Example: $0 builds/01_app__id_001/build_xxx"
    exit 1
fi

LAUNCH_PLAN="$BUILD_OUTPUT_DIR/launch_plan.md"

echo "Verifying launch plan at: $LAUNCH_PLAN"

# Check file exists
if [[ ! -f "$LAUNCH_PLAN" ]]; then
    echo "❌ FAIL: launch_plan.md does not exist"
    echo "  Expected at: $LAUNCH_PLAN"
    echo "  Run scripts/generate_launch_plan.sh first"
    exit 1
fi

# Check file is non-empty
if [[ ! -s "$LAUNCH_PLAN" ]]; then
    echo "❌ FAIL: launch_plan.md exists but is empty"
    exit 1
fi

# Verify required sections exist
REQUIRED_SECTIONS=(
    "## 1. App Overview"
    "## 2. MVP Scope"
    "## 3. Post-MVP Roadmap"
    "## 4. MVP Success Criteria"
    "## 5. Monetization Summary"
    "## 6. ASO & Market Positioning"
    "## 7. Technical Constraints"
    "## 8. Privacy & Compliance"
    "## 9. Launch Checklist"
)

MISSING_SECTIONS=""
for section in "${REQUIRED_SECTIONS[@]}"; do
    if ! grep -q "$section" "$LAUNCH_PLAN"; then
        MISSING_SECTIONS="${MISSING_SECTIONS}\n  - $section"
    fi
done

if [[ -n "$MISSING_SECTIONS" ]]; then
    echo "❌ FAIL: launch_plan.md is missing required sections:"
    echo -e "$MISSING_SECTIONS"
    exit 1
fi

# Check minimum content length (sanity check)
LINE_COUNT=$(wc -l < "$LAUNCH_PLAN")
if [[ $LINE_COUNT -lt 50 ]]; then
    echo "⚠️ WARNING: launch_plan.md seems too short ($LINE_COUNT lines)"
    echo "  Expected at least 50 lines of content"
fi

echo "✅ PASS: launch_plan.md exists with all required sections"

# Report warnings file if present
WARNINGS_FILE="$BUILD_OUTPUT_DIR/launch_plan_warnings.md"
if [[ -f "$WARNINGS_FILE" ]]; then
    echo "⚠️ Note: launch_plan_warnings.md present - some fields may be incomplete"
fi

exit 0
