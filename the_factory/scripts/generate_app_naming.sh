#!/bin/bash
# generate_app_naming.sh - Generates naming.md from stage09.1.json
# Usage: scripts/generate_app_naming.sh <idea_path> <build_output_dir>
#
# MANDATORY: Must run after Stage 09.1 completes
# Output: <build_output_dir>/naming.md

set -e

IDEA_PATH="$1"
BUILD_OUTPUT_DIR="$2"

if [[ -z "$IDEA_PATH" || -z "$BUILD_OUTPUT_DIR" ]]; then
    echo "Usage: $0 <idea_path> <build_output_dir>"
    echo "Example: $0 runs/2026-01-09/dream-xxx/ideas/01_app__id_001 builds/01_app__id_001/build_xxx"
    exit 1
fi

# Locate stage09.1.json
STAGE091="$IDEA_PATH/stages/stage09.1.json"

if [[ ! -f "$STAGE091" ]]; then
    echo "❌ FAIL: stage09.1.json not found at $STAGE091"
    echo "  Run Stage 09.1 (App Naming & Availability Research) first"
    exit 1
fi

# Output file
NAMING_MD="$BUILD_OUTPUT_DIR/naming.md"

echo "Generating naming.md from: $STAGE091"

# Extract naming data using jq
RECOMMENDED_NAME=$(jq -r '.naming.recommended_name // "Unknown App"' "$STAGE091")
RECOMMENDED_SUBTITLE=$(jq -r '.naming.recommended_subtitle // ""' "$STAGE091")
CHAR_COUNT=$(jq -r '.naming.character_count // 0' "$STAGE091")
RATIONALE=$(jq -r '.naming.rationale // ""' "$STAGE091")
COLLISION_RISK=$(jq -r '.availability_research.collision_risk_level // "unknown"' "$STAGE091")
CONFIDENCE=$(jq -r '.availability_research.recommendation_confidence // "unknown"' "$STAGE091")
POLICY_SLUG=$(jq -r '.store_metadata.final_policy_slug // ""' "$STAGE091")
BUNDLE_SLUG=$(jq -r '.store_metadata.bundle_id_slug // ""' "$STAGE091")

# Validate required fields
if [[ -z "$RECOMMENDED_NAME" || "$RECOMMENDED_NAME" == "null" ]]; then
    echo "❌ FAIL: No recommended_name in stage09.1.json"
    exit 1
fi

if [[ $CHAR_COUNT -gt 30 ]]; then
    echo "❌ FAIL: Recommended name exceeds 30 characters ($CHAR_COUNT chars)"
    exit 1
fi

# Count alternates
ALTERNATES_COUNT=$(jq '.naming.alternates | length' "$STAGE091" 2>/dev/null || echo "0")
if [[ $ALTERNATES_COUNT -lt 8 ]]; then
    echo "❌ FAIL: Fewer than 8 alternates provided ($ALTERNATES_COUNT found)"
    exit 1
fi

# Check for research evidence
SEARCH_COUNT=$(jq '.availability_research.search_queries_executed | length' "$STAGE091" 2>/dev/null || echo "0")
if [[ $SEARCH_COUNT -lt 4 ]]; then
    echo "❌ FAIL: Insufficient web research evidence ($SEARCH_COUNT queries, minimum 4)"
    exit 1
fi

# Generate naming.md
cat > "$NAMING_MD" << HEADER
# App Naming Report

> Generated from Stage 09.1: App Naming & Availability Research

---

## Final Chosen Name

| Field | Value |
|-------|-------|
| **App Name** | $RECOMMENDED_NAME |
| **Subtitle (iOS)** | $RECOMMENDED_SUBTITLE |
| **Character Count** | $CHAR_COUNT / 30 |
| **Collision Risk** | $COLLISION_RISK |
| **Confidence** | $CONFIDENCE |

### Rationale
$RATIONALE

---

## Store Identifiers

| Identifier | Value |
|------------|-------|
| **Policy Slug** | $POLICY_SLUG |
| **Bundle ID** | com.appfactory.$BUNDLE_SLUG |

---

## Alternate Names (8+ Required)

HEADER

# Add alternates table
echo "| # | Name | Subtitle | Rationale |" >> "$NAMING_MD"
echo "|---|------|----------|-----------|" >> "$NAMING_MD"

jq -r '.naming.alternates | to_entries | .[] | "| \(.key + 1) | \(.value.name) | \(.value.subtitle // "-") | \(.value.rationale // "-") |"' "$STAGE091" >> "$NAMING_MD"

cat >> "$NAMING_MD" << 'COLLISIONHEADER'

---

## Collision Research Summary

### Search Queries Executed
COLLISIONHEADER

# Add search queries
jq -r '.availability_research.search_queries_executed[] | "- **\(.query)** (\(.platform)): \(.findings)"' "$STAGE091" >> "$NAMING_MD" 2>/dev/null || echo "- (See stage09.1.json for full search details)" >> "$NAMING_MD"

cat >> "$NAMING_MD" << 'FINDINGSHEADER'

### Collision Findings
FINDINGSHEADER

# Add collision findings
COLLISION_FINDINGS=$(jq -r '.availability_research.collision_findings // []' "$STAGE091")
FINDINGS_COUNT=$(echo "$COLLISION_FINDINGS" | jq 'length' 2>/dev/null || echo "0")

if [[ "$FINDINGS_COUNT" -gt 0 ]]; then
    echo "$COLLISION_FINDINGS" | jq -r '.[] | "- \(.)"' >> "$NAMING_MD"
else
    echo "- No significant collisions identified" >> "$NAMING_MD"
fi

# Add naming rules applied
cat >> "$NAMING_MD" << 'RULESHEADER'

---

## Naming Rules Applied
RULESHEADER

jq -r '.naming.naming_rules_applied[]? | "- \(.)"' "$STAGE091" >> "$NAMING_MD" 2>/dev/null || echo "- Standard App Store/Play Store naming guidelines" >> "$NAMING_MD"

# Add store search terms
cat >> "$NAMING_MD" << 'TERMSHEADER'

---

## Store Search Terms Used
TERMSHEADER

jq -r '.store_metadata.store_search_terms[]? | "- \(.)"' "$STAGE091" >> "$NAMING_MD" 2>/dev/null || echo "- (See stage09.1.json for search terms)" >> "$NAMING_MD"

# Add manual verification notice
cat >> "$NAMING_MD" << 'FOOTER'

---

## Manual Reservation Required

> **IMPORTANT**: This research reduces collision risk but does NOT guarantee availability.

Before app submission, you MUST manually verify:

1. **App Store Connect**: Confirm app name availability in App Store Connect
2. **Google Play Console**: Confirm package name availability in Play Console

Only the respective store consoles can definitively confirm name/package availability.

---

*Generated by App Factory Pipeline*
FOOTER

echo "✅ Generated: $NAMING_MD"
exit 0
