#!/bin/bash

# Aggregate Market Research - Compile research into build output
# Purpose: Create market-research.md from stage artifacts
# Usage: aggregate_market_research.sh <run_dir> <idea_dir> <build_output_dir>
#
# This script aggregates market research and ASO data from pipeline stages
# and creates a comprehensive market-research.md file in the build output.
#
# NO SILENT DEGRADATION POLICY:
# - All fallbacks to secondary paths are logged
# - All missing fields emit warnings
# - A warning artifact is created if ANY field falls back
# - "Not available" outputs are tracked and reported

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Global tracking arrays
declare -a FALLBACK_WARNINGS=()
declare -a MISSING_FIELDS=()
declare -a EXTRACTION_LOG=()

log_info() {
    echo -e "${GREEN}[MARKET_RESEARCH]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[MARKET_RESEARCH]${NC} $1"
}

log_error() {
    echo -e "${RED}[MARKET_RESEARCH]${NC} $1"
}

# Track a fallback occurrence
track_fallback() {
    local stage=$1
    local field=$2
    local primary_path=$3
    local fallback_path=$4
    FALLBACK_WARNINGS+=("Stage $stage: Field '$field' - Primary path '$primary_path' failed, used fallback '$fallback_path'")
    log_warn "FALLBACK: Stage $stage field '$field' using secondary path"
}

# Track a missing field
track_missing() {
    local stage=$1
    local field=$2
    local paths_tried=$3
    MISSING_FIELDS+=("Stage $stage: Field '$field' - Not found in any path: $paths_tried")
    log_warn "MISSING: Stage $stage field '$field' not available"
}

# Track successful extraction
track_success() {
    local stage=$1
    local field=$2
    local path=$3
    EXTRACTION_LOG+=("Stage $stage: Field '$field' - Extracted from '$path'")
}

# Extract JSON field using Python with tracking
extract_json_field_tracked() {
    local json_file=$1
    local field_path=$2
    local stage=$3
    local field_name=$4
    local default_value=${5:-""}

    if [[ ! -f "$json_file" ]]; then
        echo "$default_value"
        return 1
    fi

    local result
    result=$(python3 -c "
import json
import sys

try:
    with open('$json_file', 'r') as f:
        data = json.load(f)

    # Navigate nested path like 'product.name'
    keys = '$field_path'.split('.')
    value = data
    for key in keys:
        if isinstance(value, dict) and key in value:
            value = value[key]
        elif isinstance(value, list) and key.isdigit():
            value = value[int(key)]
        else:
            sys.exit(1)

    if value is None:
        sys.exit(1)
    elif isinstance(value, (list, dict)):
        print(json.dumps(value, indent=2))
    else:
        print(str(value))
except Exception as e:
    sys.exit(1)
" 2>/dev/null) && {
        track_success "$stage" "$field_name" "$field_path"
        echo "$result"
        return 0
    } || {
        echo "$default_value"
        return 1
    }
}

# Extract field with fallback tracking
extract_with_fallback() {
    local json_file=$1
    local stage=$2
    local field_name=$3
    local primary_path=$4
    local fallback_path=$5
    local default_value=${6:-"Not available"}

    local result

    # Try primary path
    result=$(extract_json_field_tracked "$json_file" "$primary_path" "$stage" "$field_name" "")
    if [[ -n "$result" && "$result" != "" ]]; then
        echo "$result"
        return
    fi

    # Try fallback path
    result=$(extract_json_field_tracked "$json_file" "$fallback_path" "$stage" "$field_name" "")
    if [[ -n "$result" && "$result" != "" ]]; then
        track_fallback "$stage" "$field_name" "$primary_path" "$fallback_path"
        echo "$result"
        return
    fi

    # Both paths failed
    track_missing "$stage" "$field_name" "$primary_path, $fallback_path"
    echo "$default_value"
}

# Write warning artifact
write_warning_artifact() {
    local output_dir=$1
    local warning_file="$output_dir/market-research-warnings.md"

    if [[ ${#FALLBACK_WARNINGS[@]} -eq 0 && ${#MISSING_FIELDS[@]} -eq 0 ]]; then
        log_info "No warnings or fallbacks - all fields extracted from primary paths"
        return
    fi

    log_warn "Writing warning artifact: $warning_file"

    cat > "$warning_file" << EOF
# Market Research Aggregation Warnings

**Generated**: $(date -Iseconds)
**Status**: DEGRADED EXTRACTION

This artifact documents fields that could not be extracted from primary JSON paths.
Review the source stage JSON files to ensure structured output requirements are met.

---

EOF

    if [[ ${#FALLBACK_WARNINGS[@]} -gt 0 ]]; then
        echo "## Fallback Extractions" >> "$warning_file"
        echo "" >> "$warning_file"
        echo "The following fields were extracted using fallback paths instead of primary paths:" >> "$warning_file"
        echo "" >> "$warning_file"
        for warning in "${FALLBACK_WARNINGS[@]}"; do
            echo "- $warning" >> "$warning_file"
        done
        echo "" >> "$warning_file"
    fi

    if [[ ${#MISSING_FIELDS[@]} -gt 0 ]]; then
        echo "## Missing Fields" >> "$warning_file"
        echo "" >> "$warning_file"
        echo "The following fields could not be extracted from any path:" >> "$warning_file"
        echo "" >> "$warning_file"
        for missing in "${MISSING_FIELDS[@]}"; do
            echo "- $missing" >> "$warning_file"
        done
        echo "" >> "$warning_file"
    fi

    echo "## Remediation" >> "$warning_file"
    echo "" >> "$warning_file"
    echo "To fix these warnings:" >> "$warning_file"
    echo "" >> "$warning_file"
    echo "1. Ensure upstream stages (02, 04, 08, 09) emit structured JSON with required field paths" >> "$warning_file"
    echo "2. Check that stage JSON schemas match the expected extraction paths" >> "$warning_file"
    echo "3. Re-run the affected stages to regenerate properly structured output" >> "$warning_file"
    echo "" >> "$warning_file"
    echo "---" >> "$warning_file"
    echo "" >> "$warning_file"
    echo "*This is NOT a silent failure - the warning artifact documents all degradation.*" >> "$warning_file"

    log_warn "=================================================="
    log_warn "WARNING: ${#FALLBACK_WARNINGS[@]} fallbacks, ${#MISSING_FIELDS[@]} missing fields"
    log_warn "See: $warning_file"
    log_warn "=================================================="
}

# Main function
main() {
    if [[ $# -ne 3 ]]; then
        echo "Usage: $0 <run_dir> <idea_dir_name> <build_output_dir>"
        echo "Example: $0 runs/2026-01-09/dream_run ideas/01_myapp__app_001 builds/01_myapp/123/app"
        exit 1
    fi

    local run_dir="$1"
    local idea_dir_name="$2"
    local build_output_dir="$3"

    local idea_dir="$run_dir/$idea_dir_name"

    log_info "Aggregating market research..."
    log_info "Run: $run_dir"
    log_info "Idea: $idea_dir_name"
    log_info "Output: $build_output_dir"

    local output_file="$build_output_dir/market-research.md"

    # Find stage JSON files
    local stage01_json=""
    local stage02_json=""
    local stage04_json=""
    local stage08_json=""
    local stage09_json=""

    # Look for stage01 in different locations (dream vs regular run)
    for possible in "$run_dir/stage01/stages/stage01.json" "$run_dir/stage01_dream/stages/stage01_dream.json" "$idea_dir/stages/stage01.json"; do
        if [[ -f "$possible" ]]; then
            stage01_json="$possible"
            break
        fi
    done

    # Other stages are in idea directory
    stage02_json="$idea_dir/stages/stage02.json"
    stage04_json="$idea_dir/stages/stage04.json"
    stage08_json="$idea_dir/stages/stage08.json"
    stage09_json="$idea_dir/stages/stage09.json"

    # Start building the markdown
    cat > "$output_file" << 'EOF'
# Market Research Bundle

*Aggregated from App Factory Pipeline Stages*

---

EOF

    # Section 1: Market Evidence (Stage 01)
    echo "## 1. Market Evidence" >> "$output_file"
    echo "" >> "$output_file"

    if [[ -f "$stage01_json" ]]; then
        log_info "Found Stage 01: $stage01_json"
        echo "**Source**: Stage 01 Market Research" >> "$output_file"
        echo "" >> "$output_file"

        local app_name=$(extract_with_fallback "$stage01_json" "01" "app_name" \
            "generated_ideas.0.idea_name" "ideas.0.idea_name" "Unknown App")

        local problem=$(extract_with_fallback "$stage01_json" "01" "problem_solved" \
            "generated_ideas.0.pain_point_evidence" "ideas.0.problem_solved" "Not available")

        local target=$(extract_with_fallback "$stage01_json" "01" "target_user" \
            "generated_ideas.0.target_user" "ideas.0.target_user" "Not available")

        local evidence=$(extract_with_fallback "$stage01_json" "01" "market_evidence" \
            "market_research.monetization_trends" "ideas.0.evidence_summary" "Not available")

        echo "### App Concept" >> "$output_file"
        echo "- **Name**: $app_name" >> "$output_file"
        echo "- **Problem Solved**: $problem" >> "$output_file"
        echo "- **Target User**: $target" >> "$output_file"
        echo "" >> "$output_file"
        echo "### Market Evidence" >> "$output_file"
        echo "$evidence" >> "$output_file"
        echo "" >> "$output_file"
    else
        log_warn "Stage 01 JSON not found"
        track_missing "01" "entire_stage" "$run_dir/stage01/stages/stage01.json"
        echo "*Stage 01 data not available*" >> "$output_file"
        echo "" >> "$output_file"
    fi

    # Section 2: Product Differentiation (Stage 02)
    echo "## 2. Product Differentiation" >> "$output_file"
    echo "" >> "$output_file"

    if [[ -f "$stage02_json" ]]; then
        log_info "Found Stage 02: $stage02_json"
        echo "**Source**: Stage 02 Product Specification" >> "$output_file"
        echo "" >> "$output_file"

        local value_prop=$(extract_with_fallback "$stage02_json" "02" "core_value_proposition" \
            "product_specification.app_concept.core_value_proposition" \
            "product_specification.core_value_proposition" "Not available")

        local positioning=$(extract_with_fallback "$stage02_json" "02" "competitive_positioning" \
            "product_specification.competitive_analysis.positioning" \
            "product_specification.positioning" "Not available")

        local tagline=$(extract_with_fallback "$stage02_json" "02" "tagline" \
            "product_specification.app_concept.tagline" \
            "product_specification.tagline" "Not available")

        echo "### Core Value Proposition" >> "$output_file"
        echo "$value_prop" >> "$output_file"
        echo "" >> "$output_file"
        echo "### Product Tagline" >> "$output_file"
        echo "$tagline" >> "$output_file"
        echo "" >> "$output_file"
        echo "### Competitive Positioning" >> "$output_file"
        echo "$positioning" >> "$output_file"
        echo "" >> "$output_file"
    else
        log_warn "Stage 02 JSON not found"
        track_missing "02" "entire_stage" "$stage02_json"
        echo "*Stage 02 data not available*" >> "$output_file"
        echo "" >> "$output_file"
    fi

    # Section 3: Monetization Strategy (Stage 04)
    echo "## 3. Monetization Strategy" >> "$output_file"
    echo "" >> "$output_file"

    if [[ -f "$stage04_json" ]]; then
        log_info "Found Stage 04: $stage04_json"
        echo "**Source**: Stage 04 Monetization" >> "$output_file"
        echo "" >> "$output_file"

        local monthly_price=$(extract_with_fallback "$stage04_json" "04" "monthly_price" \
            "monetization_strategy.pricing_strategy.monthly_subscription.price" \
            "monetization.pricing_strategy.monthly_subscription.price" "Not available")

        local annual_price=$(extract_with_fallback "$stage04_json" "04" "annual_price" \
            "monetization_strategy.pricing_strategy.annual_subscription.price" \
            "monetization.pricing_strategy.annual_subscription.price" "Not available")

        local trial_duration=$(extract_with_fallback "$stage04_json" "04" "trial_duration" \
            "monetization_strategy.pricing_strategy.trial_strategy.duration" \
            "monetization.pricing_strategy.trial_strategy.duration" "Not available")

        local free_features=$(extract_with_fallback "$stage04_json" "04" "free_features" \
            "monetization_strategy.business_model.free_tier.features" \
            "monetization.business_model.free_tier.features" "Not available")

        echo "### Pricing" >> "$output_file"
        echo "- **Monthly**: $monthly_price" >> "$output_file"
        echo "- **Annual**: $annual_price" >> "$output_file"
        echo "- **Trial**: $trial_duration" >> "$output_file"
        echo "" >> "$output_file"
        echo "### Free Tier Features" >> "$output_file"
        echo "$free_features" >> "$output_file"
        echo "" >> "$output_file"
    else
        log_warn "Stage 04 JSON not found"
        track_missing "04" "entire_stage" "$stage04_json"
        echo "*Stage 04 data not available*" >> "$output_file"
        echo "" >> "$output_file"
    fi

    # Section 4: Brand Identity (Stage 08)
    echo "## 4. Brand Identity" >> "$output_file"
    echo "" >> "$output_file"

    if [[ -f "$stage08_json" ]]; then
        log_info "Found Stage 08: $stage08_json"
        echo "**Source**: Stage 08 Brand" >> "$output_file"
        echo "" >> "$output_file"

        local brand_name=$(extract_with_fallback "$stage08_json" "08" "brand_name" \
            "brand_identity.brand_strategy.brand_name.final_name" \
            "brand.name" "Not available")

        local tagline=$(extract_with_fallback "$stage08_json" "08" "tagline" \
            "brand_identity.messaging_framework.core_messages.primary_tagline" \
            "brand.tagline" "Not available")

        local personality=$(extract_with_fallback "$stage08_json" "08" "personality" \
            "brand_identity.brand_strategy.brand_personality.core_attributes" \
            "brand.personality" "Not available")

        local value_prop=$(extract_with_fallback "$stage08_json" "08" "brand_value_proposition" \
            "brand_identity.brand_strategy.brand_positioning.value_proposition" \
            "brand.value_proposition" "Not available")

        local primary_color=$(extract_with_fallback "$stage08_json" "08" "primary_color" \
            "brand_identity.visual_identity.color_palette.primary_colors.0.hex_value" \
            "brand.primary_color" "Not available")

        echo "- **Brand Name**: $brand_name" >> "$output_file"
        echo "- **Tagline**: $tagline" >> "$output_file"
        echo "- **Value Proposition**: $value_prop" >> "$output_file"
        echo "- **Brand Personality**: $personality" >> "$output_file"
        echo "- **Primary Color**: $primary_color" >> "$output_file"
        echo "" >> "$output_file"
    else
        log_warn "Stage 08 JSON not found"
        track_missing "08" "entire_stage" "$stage08_json"
        echo "*Stage 08 data not available*" >> "$output_file"
        echo "" >> "$output_file"
    fi

    # Section 5: ASO Package (Stage 09)
    echo "## 5. App Store Optimization (ASO)" >> "$output_file"
    echo "" >> "$output_file"

    if [[ -f "$stage09_json" ]]; then
        log_info "Found Stage 09: $stage09_json"
        echo "**Source**: Stage 09 Release Planning" >> "$output_file"
        echo "" >> "$output_file"

        local store_name=$(extract_with_fallback "$stage09_json" "09" "app_store_name" \
            "release_planning.aso_package.ios_app_store.app_name" \
            "aso.app_store_name" "Not available")

        local subtitle=$(extract_with_fallback "$stage09_json" "09" "subtitle" \
            "release_planning.aso_package.ios_app_store.subtitle" \
            "aso.subtitle" "Not available")

        local keywords=$(extract_with_fallback "$stage09_json" "09" "keywords" \
            "release_planning.aso_package.ios_app_store.keywords" \
            "aso.keywords" "Not available")

        local description=$(extract_with_fallback "$stage09_json" "09" "description" \
            "release_planning.aso_package.ios_app_store.description" \
            "aso.description" "Not available")

        local category=$(extract_with_fallback "$stage09_json" "09" "category" \
            "release_planning.aso_package.ios_app_store.primary_category" \
            "aso.category" "Not available")

        local release_approach=$(extract_with_fallback "$stage09_json" "09" "release_approach" \
            "release_planning.launch_strategy.release_approach" \
            "launch_strategy.release_approach" "Not available")

        local primary_keywords=$(extract_with_fallback "$stage09_json" "09" "primary_keywords" \
            "release_planning.aso_package.keyword_strategy.primary_keywords" \
            "aso.primary_keywords" "Not available")

        echo "### Store Listing" >> "$output_file"
        echo "- **App Store Name**: $store_name" >> "$output_file"
        echo "- **Subtitle**: $subtitle" >> "$output_file"
        echo "- **Category**: $category" >> "$output_file"
        echo "- **Release Approach**: $release_approach" >> "$output_file"
        echo "" >> "$output_file"
        echo "### Keywords (iOS)" >> "$output_file"
        echo "$keywords" >> "$output_file"
        echo "" >> "$output_file"
        echo "### Primary Keywords" >> "$output_file"
        echo "$primary_keywords" >> "$output_file"
        echo "" >> "$output_file"
        echo "### App Description" >> "$output_file"
        echo "$description" >> "$output_file"
        echo "" >> "$output_file"
    else
        log_warn "Stage 09 JSON not found"
        track_missing "09" "entire_stage" "$stage09_json"
        echo "*Stage 09 data not available*" >> "$output_file"
        echo "" >> "$output_file"
    fi

    # Section 6: Sources and Traceability
    echo "## 6. Sources & Traceability" >> "$output_file"
    echo "" >> "$output_file"
    echo "This market research bundle was aggregated from the following pipeline artifacts:" >> "$output_file"
    echo "" >> "$output_file"

    for stage_file in "$stage01_json" "$stage02_json" "$stage04_json" "$stage08_json" "$stage09_json"; do
        if [[ -f "$stage_file" ]]; then
            echo "- \`$stage_file\`" >> "$output_file"
        fi
    done

    echo "" >> "$output_file"
    echo "---" >> "$output_file"
    echo "" >> "$output_file"
    echo "*Generated by App Factory Pipeline on $(date -Iseconds)*" >> "$output_file"

    # Write warning artifact if there were any fallbacks or missing fields
    write_warning_artifact "$build_output_dir"

    log_info "=================================================="
    log_info "Market research aggregated successfully"
    log_info "Output: $output_file"
    if [[ ${#FALLBACK_WARNINGS[@]} -gt 0 || ${#MISSING_FIELDS[@]} -gt 0 ]]; then
        log_warn "WARNINGS: Check market-research-warnings.md"
    fi
    log_info "=================================================="
}

main "$@"
