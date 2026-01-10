#!/bin/bash
# generate_launch_plan.sh - Synthesizes launch_plan.md from pipeline stage artifacts
# Usage: scripts/generate_launch_plan.sh <run_dir> <idea_dir> <build_output_dir>
#
# MANDATORY: Must run after all stages complete, before final success claim
# Output: <build_output_dir>/launch_plan.md
# Warnings: <build_output_dir>/launch_plan_warnings.md (if fields missing)

set -e

RUN_DIR="$1"
IDEA_DIR="$2"
BUILD_OUTPUT_DIR="$3"

if [[ -z "$RUN_DIR" || -z "$IDEA_DIR" || -z "$BUILD_OUTPUT_DIR" ]]; then
    echo "Usage: $0 <run_dir> <idea_dir> <build_output_dir>"
    echo "Example: $0 runs/2026-01-09/dream-xxx ideas/01_app__id_001 builds/01_app__id_001/build_xxx"
    exit 1
fi

# Resolve paths
IDEA_PATH="$RUN_DIR/$IDEA_DIR"
STAGES_DIR="$IDEA_PATH/stages"
SPEC_DIR="$IDEA_PATH/spec"
CONTRACT_DIR="$IDEA_PATH/app/_contract"

# Output files
LAUNCH_PLAN="$BUILD_OUTPUT_DIR/launch_plan.md"
WARNINGS_FILE="$BUILD_OUTPUT_DIR/launch_plan_warnings.md"

# Initialize warnings
WARNINGS=""

# Helper: Extract JSON field using jq or grep fallback
extract_json() {
    local file="$1"
    local path="$2"
    local default="$3"

    if [[ -f "$file" ]]; then
        local result=$(jq -r "$path // empty" "$file" 2>/dev/null || echo "")
        if [[ -n "$result" && "$result" != "null" ]]; then
            echo "$result"
            return
        fi
    fi
    echo "$default"
}

# Helper: Add warning
add_warning() {
    local section="$1"
    local message="$2"
    WARNINGS="${WARNINGS}\n- **$section**: $message"
}

echo "Generating launch plan for $IDEA_DIR..."

# --- Stage 02: Product Spec ---
STAGE02="$STAGES_DIR/stage02.json"
APP_NAME=$(extract_json "$STAGE02" ".product_specification.app_name // .app_name" "Unknown App")
VALUE_PROP=$(extract_json "$STAGE02" ".product_specification.value_proposition // .value_proposition" "")
TARGET_USER=$(extract_json "$STAGE02" ".product_specification.target_user // .target_user" "")
PROBLEM_SOLVED=$(extract_json "$STAGE02" ".product_specification.problem_solved // .problem_statement" "")

if [[ -z "$VALUE_PROP" ]]; then add_warning "App Overview" "value_proposition missing from Stage 02"; fi
if [[ -z "$TARGET_USER" ]]; then add_warning "App Overview" "target_user missing from Stage 02"; fi

# --- Stage 02.5: Core Loop & MVP Scope ---
STAGE025="$STAGES_DIR/stage02.5.json"
MVP_SCOPE_FILE="$IDEA_PATH/product/mvp_scope.md"

# --- Stage 04: Monetization ---
STAGE04="$STAGES_DIR/stage04.json"
FREE_LIMITS=$(extract_json "$STAGE04" ".monetization.free_tier_limits // .free_tier" "")
PRO_UNLOCKS=$(extract_json "$STAGE04" ".monetization.pro_features // .premium_features" "")
PRICING=$(extract_json "$STAGE04" ".monetization.pricing // .subscription_pricing" "")
PAYWALL_PLACEMENT=$(extract_json "$STAGE04" ".monetization.soft_paywall_strategy // .paywall_placement" "")

if [[ -z "$FREE_LIMITS" ]]; then add_warning "Monetization" "free_tier_limits missing from Stage 04"; fi

# --- Stage 05: Architecture ---
STAGE05="$STAGES_DIR/stage05.json"
MIN_IOS=$(extract_json "$STAGE05" ".technical_constraints.min_ios_version // .ios_minimum" "15.0")
MIN_ANDROID=$(extract_json "$STAGE05" ".technical_constraints.min_android_version // .android_minimum" "24")

# --- Stage 09: Release Planning ---
STAGE09="$STAGES_DIR/stage09.json"
PRIMARY_CATEGORY=$(extract_json "$STAGE09" ".aso_package.primary_category // .app_store_category" "")
SECONDARY_CATEGORY=$(extract_json "$STAGE09" ".aso_package.secondary_category" "")
SUBTITLE=$(extract_json "$STAGE09" ".aso_package.subtitle // .app_subtitle" "")
KEYWORDS=$(extract_json "$STAGE09" ".aso_package.keywords // .keyword_cluster" "")

if [[ -z "$PRIMARY_CATEGORY" ]]; then add_warning "ASO" "primary_category missing from Stage 09"; fi

# --- Build Contract (for additional data) ---
BUILD_CONTRACT="$CONTRACT_DIR/build_contract.json"

# --- Generate launch_plan.md ---
cat > "$LAUNCH_PLAN" << 'HEADER'
# Launch Plan

> Condensed synthesis of pipeline research and decisions for launch preparation.

---

HEADER

# Section 1: App Overview
cat >> "$LAUNCH_PLAN" << EOF
## 1. App Overview

| Field | Value |
|-------|-------|
| **App Name** | $APP_NAME |
| **Value Proposition** | $VALUE_PROP |
| **Target User** | $TARGET_USER |
| **Core Problem** | $PROBLEM_SOLVED |

---

EOF

# Section 2: MVP Scope
cat >> "$LAUNCH_PLAN" << 'MVPHEADER'
## 2. MVP Scope (V1)

### Core Features Included
MVPHEADER

# Try to extract features from stage02.json or mvp_scope.md
if [[ -f "$STAGE02" ]]; then
    jq -r '.product_specification.core_features[]? // .core_features[]? // empty' "$STAGE02" 2>/dev/null | while read -r feature; do
        echo "- $feature" >> "$LAUNCH_PLAN"
    done
fi

# If no features extracted, add placeholder
if ! grep -q "^- " "$LAUNCH_PLAN" 2>/dev/null; then
    echo "- See Stage 02 product specification for full feature list" >> "$LAUNCH_PLAN"
    add_warning "MVP Scope" "core_features array not found in Stage 02"
fi

cat >> "$LAUNCH_PLAN" << 'OOSHEADER'

### Out of Scope (V1)

| Feature | Reason for Deferral |
|---------|---------------------|
OOSHEADER

# Extract deferred features if available
if [[ -f "$STAGE025" ]]; then
    jq -r '.deferred_features[]? // empty | "| \(.feature // .name) | \(.reason // "Post-MVP") |"' "$STAGE025" 2>/dev/null >> "$LAUNCH_PLAN" || true
fi

# Add default row if empty
if ! grep -q "^|.*|.*|$" "$LAUNCH_PLAN" 2>/dev/null | tail -1 | grep -qv "Feature"; then
    echo "| (See Stage 02.5 for deferred scope) | - |" >> "$LAUNCH_PLAN"
fi

cat >> "$LAUNCH_PLAN" << 'EOF'

---

## 3. Post-MVP Roadmap (V1.1+)

| Feature | Target Version | Rationale |
|---------|----------------|-----------|
EOF

# Extract roadmap if available
if [[ -f "$STAGE02" ]]; then
    jq -r '.product_specification.roadmap[]? // .future_features[]? // empty | "| \(.feature // .name) | \(.version // "V1.1") | \(.rationale // "-") |"' "$STAGE02" 2>/dev/null >> "$LAUNCH_PLAN" || true
fi

echo "| (Prioritize based on user feedback) | V1.1+ | Data-driven iteration |" >> "$LAUNCH_PLAN"

cat >> "$LAUNCH_PLAN" << 'EOF'

---

## 4. MVP Success Criteria

EOF

# Extract success criteria
if [[ -f "$STAGE02" ]]; then
    jq -r '.product_specification.success_criteria[]? // .success_metrics[]? // empty' "$STAGE02" 2>/dev/null | nl -w2 -s'. ' >> "$LAUNCH_PLAN" || true
fi

# Default criteria if none found
if ! grep -q "^[0-9]" "$LAUNCH_PLAN" 2>/dev/null | tail -5; then
    cat >> "$LAUNCH_PLAN" << 'DEFAULTCRITERIA'
1. App launches without crash on iOS 15+ and Android 7+
2. Core user flow completable end-to-end
3. Subscription purchase flow functional
4. No critical accessibility violations
5. App Store submission accepted without rejection
DEFAULTCRITERIA
fi

cat >> "$LAUNCH_PLAN" << 'EOF'

---

## 5. Monetization Summary

EOF

cat >> "$LAUNCH_PLAN" << EOF
| Aspect | Details |
|--------|---------|
| **Free Tier Limits** | $FREE_LIMITS |
| **Pro Tier Unlocks** | $PRO_UNLOCKS |
| **Soft Paywall Placement** | $PAYWALL_PLACEMENT |
| **Subscription Pricing** | $PRICING |

---

## 6. ASO & Market Positioning

EOF

# Extract naming data from stage09.1.json
STAGE091="$STAGES_DIR/stage09.1.json"
if [[ -f "$STAGE091" ]]; then
    FINAL_NAME=$(jq -r '.naming.recommended_name // ""' "$STAGE091" 2>/dev/null)
    FINAL_SUBTITLE=$(jq -r '.naming.recommended_subtitle // ""' "$STAGE091" 2>/dev/null)
    COLLISION_RISK=$(jq -r '.availability_research.collision_risk_level // "unknown"' "$STAGE091" 2>/dev/null)
    POLICY_SLUG=$(jq -r '.store_metadata.final_policy_slug // ""' "$STAGE091" 2>/dev/null)

    # Use naming data if available
    if [[ -n "$FINAL_NAME" && "$FINAL_NAME" != "null" ]]; then
        APP_NAME="$FINAL_NAME"
    fi
    if [[ -n "$FINAL_SUBTITLE" && "$FINAL_SUBTITLE" != "null" ]]; then
        SUBTITLE="$FINAL_SUBTITLE"
    fi

    cat >> "$LAUNCH_PLAN" << ASOEOF
| Field | Value |
|-------|-------|
| **App Name** | $APP_NAME |
| **Subtitle (iOS)** | $SUBTITLE |
| **Primary Category** | $PRIMARY_CATEGORY |
| **Secondary Category** | $SECONDARY_CATEGORY |
| **Core Keywords** | $KEYWORDS |
| **Collision Risk** | $COLLISION_RISK |
| **Policy Slug** | $POLICY_SLUG |

### Naming Research Summary
ASOEOF

    # Add top alternates
    echo "" >> "$LAUNCH_PLAN"
    echo "**Top 3 Alternate Names:**" >> "$LAUNCH_PLAN"
    jq -r '.naming.alternates[:3][] | "- \(.name) - \(.subtitle // "-")"' "$STAGE091" >> "$LAUNCH_PLAN" 2>/dev/null || echo "- (See naming.md for full list)" >> "$LAUNCH_PLAN"

    echo "" >> "$LAUNCH_PLAN"
    echo "**Collision Notes:**" >> "$LAUNCH_PLAN"
    jq -r '.availability_research.collision_findings[:3][] | "- \(.)"' "$STAGE091" >> "$LAUNCH_PLAN" 2>/dev/null || echo "- No significant collisions identified" >> "$LAUNCH_PLAN"

    echo "" >> "$LAUNCH_PLAN"
    echo "> **Manual Verification Required**: Confirm name in App Store Connect / Play Console before submission." >> "$LAUNCH_PLAN"
else
    cat >> "$LAUNCH_PLAN" << NONAMINGEOF
| Field | Value |
|-------|-------|
| **Primary Category** | $PRIMARY_CATEGORY |
| **Secondary Category** | $SECONDARY_CATEGORY |
| **App Name** | $APP_NAME |
| **Subtitle (iOS)** | $SUBTITLE |
| **Core Keywords** | $KEYWORDS |

> **Note**: Run Stage 09.1 for complete naming research and collision analysis.
NONAMINGEOF
    add_warning "ASO" "stage09.1.json not found - naming research incomplete"
fi

cat >> "$LAUNCH_PLAN" << 'DIFFHEADER'

### Differentiation
DIFFHEADER

# Extract differentiation from stage02 or stage01
if [[ -f "$STAGE02" ]]; then
    DIFF=$(jq -r '.product_specification.differentiation // .competitive_advantage // empty' "$STAGE02" 2>/dev/null)
    if [[ -n "$DIFF" && "$DIFF" != "null" ]]; then
        echo "$DIFF" >> "$LAUNCH_PLAN"
    else
        echo "See Stage 02 competitive analysis for positioning details." >> "$LAUNCH_PLAN"
    fi
fi

cat >> "$LAUNCH_PLAN" << EOF

---

## 7. Technical Constraints

| Constraint | Value |
|------------|-------|
| **Minimum iOS** | $MIN_IOS |
| **Minimum Android** | API $MIN_ANDROID |
| **Expo SDK** | 52+ |
| **Offline Support** | Required for core features |
| **Free Tier Limits** | $FREE_LIMITS |

---

## 8. Privacy & Compliance

EOF

# Extract privacy data from stage09.2.json
STAGE092="$STAGES_DIR/stage09.2.json"
if [[ -f "$STAGE092" ]]; then
    POLICY_URL=$(jq -r '.policy_data.policy_url // ""' "$STAGE092" 2>/dev/null)
    DEVELOPER_NAME=$(jq -r '.policy_data.developer_entity_name // "Second Order Co."' "$STAGE092" 2>/dev/null)
    SUPPORT_EMAIL=$(jq -r '.policy_data.support_email // "support@secondorderco.com"' "$STAGE092" 2>/dev/null)

    cat >> "$LAUNCH_PLAN" << PRIVACYEOF
| Aspect | Details |
|--------|---------|
| **Privacy Policy URL** | $POLICY_URL |
| **Developer Entity** | $DEVELOPER_NAME |
| **Support Email** | $SUPPORT_EMAIL |
| **GDPR Applicable** | $(jq -r '.compliance_flags.gdpr_applicable // false' "$STAGE092" 2>/dev/null) |
| **CCPA Applicable** | $(jq -r '.compliance_flags.ccpa_applicable // false' "$STAGE092" 2>/dev/null) |
| **App Tracking Transparency** | $(jq -r '.compliance_flags.app_tracking_transparency // false' "$STAGE092" 2>/dev/null) |

### Data Practices Summary
PRIVACYEOF

    # Add data collected summary
    DATA_COLLECTED=$(jq -r '.data_practices.data_collected // []' "$STAGE092" 2>/dev/null)
    DATA_COUNT=$(echo "$DATA_COLLECTED" | jq 'length' 2>/dev/null || echo "0")

    if [[ "$DATA_COUNT" -gt 0 ]]; then
        echo "| Category | Storage | Shared |" >> "$LAUNCH_PLAN"
        echo "|----------|---------|--------|" >> "$LAUNCH_PLAN"
        echo "$DATA_COLLECTED" | jq -r '.[] | "| \(.category) | \(if .stored_locally then "Local" else "" end)\(if .stored_cloud then "+Cloud" else "" end) | \(if .shared_externally then "Yes" else "No" end) |"' >> "$LAUNCH_PLAN" 2>/dev/null
    else
        echo "- All data stored locally on device" >> "$LAUNCH_PLAN"
        echo "- No data shared with third parties" >> "$LAUNCH_PLAN"
    fi

    # Add third-party processors
    THIRD_PARTIES=$(jq -r '.third_party_processors // []' "$STAGE092" 2>/dev/null)
    TP_COUNT=$(echo "$THIRD_PARTIES" | jq 'length' 2>/dev/null || echo "0")

    if [[ "$TP_COUNT" -gt 0 ]]; then
        echo "" >> "$LAUNCH_PLAN"
        echo "### Third-Party Processors" >> "$LAUNCH_PLAN"
        echo "$THIRD_PARTIES" | jq -r '.[] | "- **\(.name)**: \(.purpose)"' >> "$LAUNCH_PLAN" 2>/dev/null
    fi
else
    cat >> "$LAUNCH_PLAN" << NOPRIVACYEOF
| Aspect | Details |
|--------|---------|
| **Privacy Policy URL** | (See stage09.2 - not yet generated) |
| **Developer Entity** | Second Order Co. |
| **Support Email** | support@secondorderco.com |

> **Note**: Run Stage 09.2 to generate complete privacy policy data.
NOPRIVACYEOF
    add_warning "Privacy" "stage09.2.json not found - privacy data incomplete"
fi

cat >> "$LAUNCH_PLAN" << 'EOF'

---

## 9. Launch Checklist

- [ ] Build proof passed (npm install, expo start verified)
- [ ] App icon generated (1024x1024)
- [ ] Splash screen generated
- [ ] Onboarding flow present (2-5 screens)
- [ ] Soft paywall present (dismissible)
- [ ] Settings screen with subscription management
- [ ] Review prompt implemented
- [ ] Export/share works (if applicable)
- [ ] Offline behavior verified
- [ ] RevenueCat configured with products
- [ ] Privacy policy URL set
- [ ] Terms of service URL set
- [ ] App Store screenshots prepared
- [ ] App Store description written

---

*Generated by App Factory Pipeline*
*Build: $(basename "$BUILD_OUTPUT_DIR")*
*Date: $(date -u +"%Y-%m-%dT%H:%M:%SZ")*
EOF

echo "Launch plan written to: $LAUNCH_PLAN"

# Write warnings file if any
if [[ -n "$WARNINGS" ]]; then
    cat > "$WARNINGS_FILE" << EOF
# Launch Plan Warnings

The following fields were missing or incomplete during launch plan generation:
$WARNINGS

**Action Required**: Review the indicated stages and ensure required fields are populated.

*Generated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")*
EOF
    echo "Warnings written to: $WARNINGS_FILE"
fi

# Verify output exists
if [[ -f "$LAUNCH_PLAN" && -s "$LAUNCH_PLAN" ]]; then
    echo "✅ Launch plan generated successfully"
    exit 0
else
    echo "❌ Failed to generate launch plan"
    exit 1
fi
