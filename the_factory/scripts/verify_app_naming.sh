#!/bin/bash
# verify_app_naming.sh - Verifies naming.md exists and stage09.1.json meets requirements
# Usage: scripts/verify_app_naming.sh <idea_path> <build_output_dir>
#
# Exit codes:
#   0 = Naming artifacts valid
#   1 = Missing or invalid naming artifacts

set -e

IDEA_PATH="$1"
BUILD_OUTPUT_DIR="$2"

if [[ -z "$IDEA_PATH" || -z "$BUILD_OUTPUT_DIR" ]]; then
    echo "Usage: $0 <idea_path> <build_output_dir>"
    echo "Example: $0 runs/.../ideas/01_app__id_001 builds/01_app__id_001/build_xxx"
    exit 1
fi

STAGE091="$IDEA_PATH/stages/stage09.1.json"
NAMING_MD="$BUILD_OUTPUT_DIR/naming.md"

echo "Verifying app naming artifacts..."

ERRORS=""

# Check stage09.1.json exists
if [[ ! -f "$STAGE091" ]]; then
    ERRORS="${ERRORS}\n  - stage09.1.json does not exist"
else
    # Validate recommended_name
    NAME=$(jq -r '.naming.recommended_name // ""' "$STAGE091" 2>/dev/null)
    if [[ -z "$NAME" || "$NAME" == "null" ]]; then
        ERRORS="${ERRORS}\n  - No recommended_name in stage09.1.json"
    fi

    # Validate character count
    CHAR_COUNT=$(jq -r '.naming.character_count // 0' "$STAGE091" 2>/dev/null)
    if [[ $CHAR_COUNT -gt 30 ]]; then
        ERRORS="${ERRORS}\n  - Recommended name exceeds 30 characters ($CHAR_COUNT)"
    fi

    # Validate subtitle character count
    SUBTITLE_COUNT=$(jq -r '.naming.subtitle_character_count // 0' "$STAGE091" 2>/dev/null)
    if [[ $SUBTITLE_COUNT -gt 30 ]]; then
        ERRORS="${ERRORS}\n  - Subtitle exceeds 30 characters ($SUBTITLE_COUNT)"
    fi

    # Validate alternates count
    ALTERNATES=$(jq '.naming.alternates | length' "$STAGE091" 2>/dev/null || echo "0")
    if [[ $ALTERNATES -lt 8 ]]; then
        ERRORS="${ERRORS}\n  - Fewer than 8 alternates provided ($ALTERNATES found, minimum 8)"
    fi

    # Validate web research evidence
    SEARCHES=$(jq '.availability_research.search_queries_executed | length' "$STAGE091" 2>/dev/null || echo "0")
    if [[ $SEARCHES -lt 4 ]]; then
        ERRORS="${ERRORS}\n  - Insufficient web research evidence ($SEARCHES queries, minimum 4)"
    fi

    # Validate collision findings documented
    if ! jq -e '.availability_research.collision_findings' "$STAGE091" > /dev/null 2>&1; then
        ERRORS="${ERRORS}\n  - collision_findings not documented"
    fi

    # Validate policy slug
    SLUG=$(jq -r '.store_metadata.final_policy_slug // ""' "$STAGE091" 2>/dev/null)
    if [[ -z "$SLUG" || "$SLUG" == "null" ]]; then
        ERRORS="${ERRORS}\n  - No final_policy_slug in stage09.1.json"
    fi
fi

# Check naming.md exists
if [[ ! -f "$NAMING_MD" ]]; then
    ERRORS="${ERRORS}\n  - naming.md does not exist in build output"
elif [[ ! -s "$NAMING_MD" ]]; then
    ERRORS="${ERRORS}\n  - naming.md is empty"
else
    # Verify required sections in naming.md
    if ! grep -q "## Final Chosen Name" "$NAMING_MD" 2>/dev/null; then
        ERRORS="${ERRORS}\n  - naming.md missing 'Final Chosen Name' section"
    fi
    if ! grep -q "## Alternate Names" "$NAMING_MD" 2>/dev/null; then
        ERRORS="${ERRORS}\n  - naming.md missing 'Alternate Names' section"
    fi
    if ! grep -q "## Collision Research Summary" "$NAMING_MD" 2>/dev/null; then
        ERRORS="${ERRORS}\n  - naming.md missing 'Collision Research Summary' section"
    fi
    if ! grep -q "## Manual Reservation Required" "$NAMING_MD" 2>/dev/null; then
        ERRORS="${ERRORS}\n  - naming.md missing 'Manual Reservation Required' section"
    fi
fi

# Report results
if [[ -n "$ERRORS" ]]; then
    echo "❌ FAIL: App naming verification failed:"
    echo -e "$ERRORS"
    exit 1
fi

echo "✅ PASS: App naming artifacts valid"
echo "   - stage09.1.json: Complete with research evidence"
echo "   - naming.md: All required sections present"
echo "   - Recommended name: $(jq -r '.naming.recommended_name' "$STAGE091")"
echo "   - Alternates: $(jq '.naming.alternates | length' "$STAGE091") provided"
echo "   - Research queries: $(jq '.availability_research.search_queries_executed | length' "$STAGE091") executed"

exit 0
