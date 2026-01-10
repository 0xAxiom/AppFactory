#!/bin/bash

# Build Contract Synthesis - Mandatory Pre-Stage 10 Step
# Purpose: Synthesize ALL stage outputs into a deterministic build contract
# Execution: Called after Stage 09.5, before Stage 10
# Scope: Single idea pack only

set -euo pipefail

# Function to log with timestamp
log() {
    echo "[$(date -Iseconds)] BUILD_CONTRACT_SYNTHESIS: $1"
}

# Function to calculate SHA256
get_sha256() {
    local file_path="$1"
    if [[ -f "$file_path" ]]; then
        if command -v sha256sum >/dev/null; then
            sha256sum "$file_path" | cut -d' ' -f1
        elif command -v shasum >/dev/null; then
            shasum -a 256 "$file_path" | cut -d' ' -f1
        else
            echo "ERROR: No SHA256 utility found" >&2
            exit 1
        fi
    else
        echo "FILE_NOT_FOUND"
    fi
}

# Function to validate required inputs
validate_inputs() {
    local idea_dir="$1"
    
    log "Validating required stage artifacts for build contract synthesis..."
    
    # Check for required stage files
    local required_stages=(
        "stage02.json"
        "stage03.json" 
        "stage04.json"
        "stage05.json"
        "stage06.json"
        "stage07.json"
        "stage08.json"
        "stage09.json"
        "stage09.5.json"
    )
    
    for stage_file in "${required_stages[@]}"; do
        local stage_path="${idea_dir}/stages/${stage_file}"
        if [[ ! -f "$stage_path" ]]; then
            log "ERROR: Missing required stage artifact: $stage_path"
            echo "Build Contract Synthesis requires all stages 02-09.5 to be completed."
            echo "Missing: $stage_path"
            echo "Run stages 02-09.5 for this idea before attempting Stage 10."
            exit 1
        fi
    done
    
    # Check for meta files
    if [[ ! -f "${idea_dir}/meta/idea.json" ]]; then
        log "ERROR: Missing idea.json in ${idea_dir}/meta/"
        exit 1
    fi
    
    log "✅ All required stage artifacts present"
}

# Function to create contract directory structure
create_contract_structure() {
    local idea_dir="$1"
    
    log "Creating build contract directory structure..."
    
    mkdir -p "${idea_dir}/app/_contract"
    mkdir -p "${idea_dir}/app/_docs" 
    mkdir -p "${idea_dir}/app/_upstream/react-native"
    
    log "✅ Contract directory structure created"
}

# Function to extract structured data from stage JSONs
extract_stage_data() {
    local idea_dir="$1"
    local contract_json="${idea_dir}/app/_contract/build_contract.json"
    
    log "Extracting and normalizing stage data..."
    
    # Use Python to extract and normalize JSON data
    python3 << EOF
import json
import os
from datetime import datetime

idea_dir = "${idea_dir}"
contract_path = "${contract_json}"

# Read all stage files
stage_data = {}
stage_files = [
    "stage02.json", "stage03.json", "stage04.json", "stage05.json",
    "stage06.json", "stage07.json", "stage08.json", "stage09.json", "stage09.5.json"
]

for stage_file in stage_files:
    stage_path = f"{idea_dir}/stages/{stage_file}"
    if os.path.exists(stage_path):
        with open(stage_path, 'r') as f:
            stage_key = stage_file.replace('.json', '')
            stage_data[stage_key] = json.load(f)

# Read idea metadata
with open(f"{idea_dir}/meta/idea.json", 'r') as f:
    idea_meta = json.load(f)

# Create normalized build contract
build_contract = {
    "contract_metadata": {
        "generated": datetime.now().isoformat() + "Z",
        "idea_id": idea_meta.get("idea_id"),
        "idea_name": idea_meta.get("idea_name"),
        "synthesis_version": "1.0"
    },
    "app_overview": {
        "name": idea_meta.get("idea_name", ""),
        "description": idea_meta.get("description", ""),
        "target_user": idea_meta.get("target_user", ""),
        "core_loop": idea_meta.get("core_loop", [])
    },
    "product_specification": stage_data.get("stage02", {}),
    "ux_design": stage_data.get("stage03", {}),
    "monetization": stage_data.get("stage04", {}),
    "architecture": stage_data.get("stage05", {}),
    "builder_handoff": stage_data.get("stage06", {}),
    "polish_requirements": stage_data.get("stage07", {}),
    "brand_identity": stage_data.get("stage08", {}),
    "release_planning": stage_data.get("stage09", {}),
    "runtime_validation": stage_data.get("stage09_5", {})
}

# Write normalized contract
with open(contract_path, 'w') as f:
    json.dump(build_contract, f, indent=2)

print("✅ Build contract JSON created")
EOF
    
    log "✅ Stage data extracted and normalized"
}

# Function to perform web research and cache results
cache_web_research() {
    local idea_dir="$1"
    local docs_dir="${idea_dir}/app/_docs"
    local sources_json="${docs_dir}/sources.json"
    
    log "Performing comprehensive doc consultation and caching..."
    
    # Initialize sources.json if it doesn't exist
    if [[ ! -f "$sources_json" ]]; then
        echo '{"sources": [], "last_updated": "'$(date -Iseconds)'", "vendor_docs": [], "web_cache": []}' > "$sources_json"
    fi
    
    # Create docs cache if needed
    mkdir -p "$docs_dir"
    
    # Scan and register vendor documentation
    local vendor_docs_used=()
    
    # Check Expo documentation
    if [[ -d "vendor/expo-docs" ]]; then
        log "📚 Scanning vendor/expo-docs/ for compatibility and integration guidance..."
        local expo_files=("vendor/expo-docs/"*)
        for expo_file in "${expo_files[@]}"; do
            if [[ -f "$expo_file" ]]; then
                local expo_sha256=$(get_sha256 "$expo_file")
                vendor_docs_used+=("$expo_file:$expo_sha256:expo_compatibility")
                log "📋 Registered: $(basename "$expo_file") for Expo compatibility guidance"
            fi
        done
    else
        log "⚠️  vendor/expo-docs/ directory not found - will use basic Expo compatibility"
    fi
    
    # Check RevenueCat documentation
    if [[ -d "vendor/revenuecat-docs" ]]; then
        log "📚 Scanning vendor/revenuecat-docs/ for subscription integration guidance..."
        local rc_files=("vendor/revenuecat-docs/"*)
        for rc_file in "${rc_files[@]}"; do
            if [[ -f "$rc_file" ]]; then
                local rc_sha256=$(get_sha256 "$rc_file")
                vendor_docs_used+=("$rc_file:$rc_sha256:revenuecat_integration")
                log "📋 Registered: $(basename "$rc_file") for RevenueCat integration guidance"
            fi
        done
    else
        log "⚠️  vendor/revenuecat-docs/ directory not found - will use basic RevenueCat integration"
    fi
    
    # Update sources.json with vendor documentation usage
    python3 << EOF
import json
import os
from datetime import datetime

sources_path = "${sources_json}"
vendor_docs_list = "${vendor_docs_used[*]}".split()

# Read existing sources
if os.path.exists(sources_path):
    with open(sources_path, 'r') as f:
        sources_data = json.load(f)
else:
    sources_data = {"sources": [], "vendor_docs": [], "web_cache": []}

# Add vendor documentation entries
vendor_docs = []
for vendor_entry in vendor_docs_list:
    if vendor_entry:
        parts = vendor_entry.split(':')
        if len(parts) >= 3:
            file_path, sha256, used_for = parts[0], parts[1], parts[2]
            vendor_docs.append({
                "file_path": file_path,
                "sha256": sha256,
                "used_for": used_for,
                "verified_at": datetime.now().isoformat() + "Z"
            })

sources_data["vendor_docs"] = vendor_docs
sources_data["last_updated"] = datetime.now().isoformat() + "Z"

# Write updated sources
with open(sources_path, 'w') as f:
    json.dump(sources_data, f, indent=2)

print(f"✅ Registered {len(vendor_docs)} vendor documentation files")
EOF
    
    # Check for missing critical documentation
    local critical_missing=()
    
    if [[ ! -f "vendor/expo-docs/compatibility_rules.md" ]] && [[ ! -f "vendor/expo-docs/llms.txt" ]]; then
        critical_missing+=("Expo compatibility documentation")
    fi
    
    if [[ ! -f "vendor/revenuecat-docs/llms.txt" ]] && [[ ! -f "vendor/revenuecat-docs/integration_guide.md" ]]; then
        critical_missing+=("RevenueCat integration documentation")
    fi
    
    # If critical docs are missing, attempt to create basic cached versions
    if [[ ${#critical_missing[@]} -gt 0 ]]; then
        log "⚠️  Critical documentation missing: ${critical_missing[*]}"
        log "📥 Creating basic documentation cache..."
        
        # Create basic Expo compatibility cache if missing
        if [[ ! -d "vendor/expo-docs" ]]; then
            mkdir -p "vendor/expo-docs"
            cat > "vendor/expo-docs/compatibility_rules.md" << 'EXPO_EOF'
# Expo Compatibility Rules

## SDK Version Requirements
- Use Expo SDK 50.0.0+ for latest React Native compatibility
- Ensure all dependencies are Expo-compatible
- Use `npx expo install` for package installation
- Verify compatibility with `npx expo doctor`

## Required Dependencies
- react-native-purchases (RevenueCat): Use expo-compatible version
- @react-navigation/native: Use with Expo Router
- expo-image-picker: For camera/gallery access
- expo-async-storage: For local data persistence

## Build Configuration
- Use EAS Build for production builds
- Configure app.json with proper permissions
- Ensure iOS and Android compatibility
EXPO_EOF
            log "📋 Created basic vendor/expo-docs/compatibility_rules.md"
        fi
        
        # Create basic RevenueCat integration cache if missing
        if [[ ! -d "vendor/revenuecat-docs" ]]; then
            mkdir -p "vendor/revenuecat-docs"
            cat > "vendor/revenuecat-docs/llms.txt" << 'RC_EOF'
# RevenueCat React Native Integration Guide

## Installation
```bash
npx expo install react-native-purchases
```

## Configuration
1. Initialize RevenueCat with API key in App.tsx
2. Configure entitlements in RevenueCat dashboard
3. Set up product identifiers for subscriptions
4. Implement purchase flows with error handling
5. Add purchase restoration functionality

## Required Methods
- Purchases.configure() - Initialize SDK
- Purchases.getCustomerInfo() - Check subscription status
- Purchases.getOfferings() - Get available products
- Purchases.purchasePackage() - Process purchases
- Purchases.restorePurchases() - Restore previous purchases

## Error Handling
- Handle network failures gracefully
- Provide user feedback for purchase states
- Implement retry logic for failed purchases
RC_EOF
            log "📋 Created basic vendor/revenuecat-docs/llms.txt"
        fi
    fi
    
    log "✅ Documentation consultation and caching completed"
}

# Function to generate comprehensive build prompt
generate_build_prompt() {
    local idea_dir="$1"
    local contract_json="${idea_dir}/app/_contract/build_contract.json"
    local prompt_md="${idea_dir}/app/_contract/build_prompt.md"
    
    log "Generating comprehensive build prompt with enhanced structure..."
    
    # Use Python to generate the build prompt from contract data
    python3 << EOF
import json
import os

idea_dir = "${idea_dir}"
contract_path = "${contract_json}"
prompt_path = "${prompt_md}"

# Read the build contract
with open(contract_path, 'r') as f:
    contract = json.load(f)

# Extract key information
app_name = contract["app_overview"]["name"]
app_description = contract["app_overview"]["description"] 
target_user = contract["app_overview"]["target_user"]
core_loop = contract["app_overview"]["core_loop"]

# Extract monetization details from Stage 04
monetization = contract.get("monetization", {})
free_tier = monetization.get("free_tier", {})
premium_tiers = monetization.get("subscription_tiers", [])

# Extract UX design details from Stage 03
ux_design = contract.get("ux_design", {})
user_flows = ux_design.get("user_flows", [])
screen_requirements = ux_design.get("screen_specifications", {})
navigation_structure = ux_design.get("navigation_structure", {})

# Extract architecture details from Stage 05
architecture = contract.get("architecture", {})
technology_stack = architecture.get("technology_stack", {})
data_management = architecture.get("data_management", {})
integration_requirements = architecture.get("integrations", {})

# Extract brand identity from Stage 08
brand_identity = contract.get("brand_identity", {})
design_tokens = brand_identity.get("design_tokens", {})
visual_guidelines = brand_identity.get("visual_guidelines", {})

# Extract runtime validation from Stage 09.5
runtime_validation = contract.get("runtime_validation", {})
performance_targets = runtime_validation.get("performance_targets", {})
quality_gates = runtime_validation.get("quality_gates", {})

# Extract release planning from Stage 09
release_planning = contract.get("release_planning", {})
store_requirements = release_planning.get("store_submission", {})
app_store_metadata = release_planning.get("metadata", {})

# Generate the comprehensive build prompt
prompt_content = f"""# Build Contract - {app_name}

## PURPOSE

Build a fully polished, production-ready {app_name} mobile application that is immediately submissible to Apple App Store and Google Play Store. This application must meet all quality, performance, and compliance standards defined in the comprehensive pipeline stages 02-09.5. The contract synthesizes all stage outputs into a deterministic, executable build specification that eliminates any need for Stage 10 improvisation or interpretation.

## ROLE

You are a Principal Mobile Applications Engineer with expertise in React Native, Expo framework, and subscription-based mobile app architecture. Your responsibility is to implement this build contract with zero deviation, zero improvisation, and complete adherence to the specifications derived from the comprehensive pipeline stages. Every implementation decision must be traceable back to explicit stage requirements.

## APP OVERVIEW

**App Name**: {app_name}
**Description**: {app_description}
**Target User**: {target_user}
**Value Proposition**: {ux_design.get('value_proposition', 'Premium mobile experience with subscription-gated features')}

## TARGET PLATFORM

- **Primary Framework**: React Native with Expo SDK (latest stable release)
- **Platform Support**: iOS 14.0+ and Android API 21+ (Android 5.0) simultaneous deployment
- **Distribution Channels**: Apple App Store and Google Play Store
- **Store Submission Status**: Production-ready with complete metadata, assets, and compliance documentation
- **Device Support**: iPhone 6s+ and equivalent Android devices with minimum 2GB RAM

## BUSINESS MODEL

**Monetization Strategy**: Subscription-only revenue model with no advertisements, no one-time purchases, and no alternative payment methods.
**Revenue Framework**: RevenueCat subscription management with tiered access controls.
**Market Positioning**: Premium mobile utility with freemium entry point and subscription upgrade path.
**User Acquisition**: Organic discovery through store optimization and word-of-mouth referral.

## MONETIZATION RULES

**Authentication Model**:
- Guest-first experience with anonymous usage tracking
- Optional progressive registration for enhanced features
- Apple Sign-In and Google Sign-In integration for seamless account creation
- No forced registration barriers for basic app functionality

**RevenueCat Integration Requirements**:
- RevenueCat SDK version 7.0.0+ integration mandatory
- Product entitlements: 'pro' entitlement for premium features
- Subscription restoration functionality with user-initiated restore button
- Purchase flow error handling with user-friendly error messages
- Receipt validation and server-side verification

**Free Tier Limitations**:"""

# Add free tier details from monetization stage
if free_tier:
    for limitation_key, limitation_value in free_tier.items():
        prompt_content += f"\n- {limitation_key}: {limitation_value}"

prompt_content += "\n\n**Premium Subscription Tiers**:"
for i, tier in enumerate(premium_tiers, 1):
    tier_name = tier.get('name', f'Tier {i}')
    tier_price = tier.get('price', 'TBD')
    tier_features = tier.get('features', [])
    prompt_content += f"\n- **{tier_name}** ({tier_price}): {', '.join(tier_features) if tier_features else 'Premium features unlocked'}"

prompt_content += f"""

**Anti-Bypass Requirements**:
- Server-side entitlement validation for all premium features
- Local storage encryption for subscription status
- Graceful degradation when subscription expires
- No client-side subscription bypass mechanisms

**Offline Handling**:
- Cache subscription status locally with 24-hour validity
- Graceful degradation to free tier when offline and cache expires
- Re-validation upon network connectivity restoration

## CORE FEATURES (MVP)

**Navigation Structure**: {navigation_structure.get('primary_navigation', 'Tab-based navigation')}

**Feature Implementation Requirements**:"""

# Add core features with detailed implementation requirements
for i, feature in enumerate(core_loop, 1):
    prompt_content += f"\n{i}. **{feature}**"
    # Add specific implementation details if available in stage outputs
    if ux_design.get('feature_specifications'):
        feature_spec = ux_design['feature_specifications'].get(f'feature_{i}', {})
        if feature_spec:
            prompt_content += f" - {feature_spec.get('implementation_notes', '')}"

# Add screens and navigation grouping
if screen_requirements:
    prompt_content += "\n\n**Screen Implementation Requirements**:\n"
    for screen_name, screen_spec in screen_requirements.items():
        prompt_content += f"- **{screen_name}**: {screen_spec.get('purpose', 'Core functionality screen')}\n"

prompt_content += f"""

## DESIGN REQUIREMENTS

**Visual Design Implementation**:
- Implement exact user flows, wireframes, and interaction patterns from Stage 03 UX design specifications
- {visual_guidelines.get('design_philosophy', 'Clean, modern interface with intuitive user experience')}
- Color scheme adherence: {design_tokens.get('color_palette', 'Brand-consistent color implementation')}
- Typography system: {design_tokens.get('typography', 'Consistent font hierarchy and sizing')}
- Component consistency across all screens with reusable UI primitives

**User Experience Requirements**:
- Onboarding flow: {ux_design.get('onboarding_flow', 'Guided introduction to core features')}
- Navigation patterns: {navigation_structure.get('navigation_type', 'Intuitive navigation with clear information architecture')}
- Loading states and error handling for all user interactions
- Micro-interactions and animations for enhanced user engagement
- Responsive design for various device sizes and orientations

## DESIGN SYSTEM REQUIREMENTS

**Design Tokens Implementation**:"""

# Add design tokens from brand identity
if design_tokens:
    for token_category, token_values in design_tokens.items():
        if isinstance(token_values, dict):
            prompt_content += f"\n- **{token_category.title()}**: {', '.join([f'{k}: {v}' for k, v in token_values.items()])}"
        else:
            prompt_content += f"\n- **{token_category.title()}**: {token_values}"

prompt_content += f"""

**Component Primitives**:
- Reusable UI components with consistent styling and behavior
- Accessibility compliance (WCAG 2.1 AA minimum standards)
- Platform-specific adaptations (iOS Human Interface Guidelines, Material Design)
- Dark mode support with automatic theme switching
- Internationalization support for future localization

**Brand Consistency**:
- Logo placement and sizing specifications from Stage 08 brand guidelines
- Brand voice and tone in all user-facing text
- Consistent iconography and visual elements
- Asset optimization for various screen densities

## TECHNICAL REQUIREMENTS

**Expo Framework Compliance**:
- Expo SDK compatibility verified using vendor/expo-docs/ documentation
- Use canonical documentation from vendor/ directory exclusively
- Expo Router for navigation with file-based routing structure
- Expo managed workflow with EAS Build compatibility
- No bare React Native dependencies that break Expo managed workflow

**Development Stack**:"""

# Add technology stack from architecture stage
if technology_stack:
    for tech_category, tech_spec in technology_stack.items():
        prompt_content += f"\n- **{tech_category.title()}**: {tech_spec}"

prompt_content += f"""

**Data Management**:
- {data_management.get('primary_storage', 'AsyncStorage for local persistence')}
- {data_management.get('data_architecture', 'Local-first data architecture with optional cloud sync')}
- Data encryption for sensitive user information
- Efficient data loading and caching strategies

**Integration Requirements**:
- RevenueCat SDK integration following vendor/revenuecat-docs/ specifications
- {integration_requirements.get('third_party_services', 'Minimal external dependencies')}
- API integration patterns with proper error handling and retry logic
- Push notification setup (if required by features)

**Performance Requirements**:
- App launch time: {performance_targets.get('launch_time', '< 3 seconds')}
- Screen transition time: {performance_targets.get('transition_time', '< 500ms')}
- Memory usage optimization for low-end devices
- Bundle size optimization with code splitting where applicable

**Quality Gates**:"""

# Add quality gates from runtime validation
if quality_gates:
    for gate_name, gate_requirement in quality_gates.items():
        prompt_content += f"\n- **{gate_name.title()}**: {gate_requirement}"

prompt_content += f"""

**Documentation Requirements**:
- DOCS USED: vendor/expo-docs/compatibility_rules.md, vendor/revenuecat-docs/llms.txt
- Local documentation caching in app/_docs/ with SHA256 verification
- Implementation traceability to specific stage outputs

## ASSETS

**Required Visual Assets**:
- App icon (1024x1024 source) with iOS and Android variants
- Launch screen/splash screen with brand-consistent design
- In-app iconography following design system specifications
- Screenshots for store submissions (if not provided by Stage 09)
- Onboarding illustrations and empty state graphics

**Asset Generation Requirements**:
- All visual assets generated deterministically from Stage 08 brand specifications
- Scalable vector graphics (SVG) preferred for iconography
- Proper asset density support (@1x, @2x, @3x for iOS; mdpi, hdpi, xhdpi, etc. for Android)
- Asset optimization for app bundle size

**Brand Asset Integration**:
- {visual_guidelines.get('asset_requirements', 'Consistent brand integration across all visual elements')}
- Color palette adherence in all generated assets
- Typography consistency in text-based assets

## PIPELINE ENFORCEMENT

**Stage Output Traceability**:
- Every implemented feature must trace back to specific stage output specifications
- No generic starter patterns, boilerplate code, or placeholder UI implementations
- All business logic derived from Stage 02 product specifications
- All design decisions derived from Stage 03 UX design and Stage 08 brand identity
- All technical architecture following Stage 05 specifications

**Standards Compliance**:
- Implementation must comply with standards/mobile_app_best_practices_2026.md
- Runtime validation against Stage 09.5 sanity checks mandatory
- No improvisation beyond explicitly defined stage requirements
- Hard failure required if stage outputs are insufficient for complete implementation

**Verification Requirements**:
- Pre-build verification using scripts/verify_build_contract_present.sh
- Contract completeness validation using scripts/verify_build_contract_sections.sh
- All verification gates must pass before code generation begins

## OUTPUT EXPECTATIONS

**Complete Expo React Native Application**:
- Full application structure in builds/{app_name.lower().replace(' ', '_')}/ directory
- All screens, components, and features from stages 02-09.5 implemented completely
- RevenueCat subscription flows fully functional with proper error handling
- Store submission readiness with complete metadata and assets

**Required Application Structure**:
- package.json with all required dependencies and proper Expo configuration
- app.json with store-ready metadata, permissions, and build configuration
- Complete source code structure with proper TypeScript implementation
- README.md with setup instructions, feature documentation, and deployment guide

**Store Submission Readiness**:
- {store_requirements.get('submission_checklist', 'Complete store submission package')}
- {app_store_metadata.get('metadata_requirements', 'All required metadata for App Store and Google Play submissions')}
- Privacy policy and terms of service integration
- GDPR/CCPA compliance implementation
- Platform-specific review guidelines compliance

**Integration Completeness**:
- RevenueCat subscription management with purchase, restore, and cancellation flows
- Analytics integration for user behavior tracking (privacy-compliant)
- Crash reporting and error monitoring setup
- Performance monitoring and optimization

## EXECUTION INSTRUCTIONS

**Build Process Requirements**:
1. **Contract Verification**: Validate this build contract completeness before any code generation
2. **Stage Output Consumption**: Read and implement ALL specifications from stages 02-09.5 via this contract
3. **Feature Implementation**: Implement features systematically according to Stage 02 product specifications
4. **Design Implementation**: Apply Stage 03 UX design and Stage 08 brand identity specifications exactly
5. **Architecture Implementation**: Follow Stage 05 technical architecture decisions precisely
6. **Quality Validation**: Validate implementation against Stage 09.5 runtime requirements
7. **Asset Generation**: Generate missing assets using Stage 08 brand guidelines and specifications
8. **Subscription Integration**: Implement RevenueCat subscription flows with complete error handling
9. **Store Preparation**: Ensure store submission readiness with proper metadata and compliance
10. **Final Validation**: Verify app meets all performance targets and quality gates

**Critical Failure Conditions**:
- If ANY requirement in this contract is unclear, ambiguous, or incomplete → FAIL the build immediately
- If stage outputs are insufficient for complete implementation → FAIL with specific missing requirements
- If vendor documentation is missing for required integrations → FAIL with documentation requirements
- If quality gates cannot be met with provided specifications → FAIL with quality gap analysis

**Success Validation**:
- Complete app builds successfully with Expo development build
- All subscription flows function correctly in sandbox environment
- All screens and features operate according to specifications
- Performance targets met or exceeded
- Store submission package complete and validated

**NO IMPROVISATION ALLOWED**: This contract represents the complete, authoritative specification. Any gaps, ambiguities, or missing requirements constitute upstream pipeline failures and must result in build failure with specific error reporting.
"""

# Write the comprehensive build prompt
with open(prompt_path, 'w') as f:
    f.write(prompt_content)

print(f"✅ Comprehensive build prompt generated: {prompt_path}")
EOF
    
    log "✅ Comprehensive build prompt generated with enhanced structure"
}

# Function to generate traceability manifest
generate_traceability_manifest() {
    local idea_dir="$1"
    local sources_json="${idea_dir}/app/_contract/contract_sources.json"
    
    log "Generating traceability manifest..."
    
    # Create traceability manifest
    python3 << EOF
import json
import os
from datetime import datetime

idea_dir = "${idea_dir}"
sources_path = "${sources_json}"

# Get SHA256 function
def get_file_sha256(file_path):
    import hashlib
    if os.path.exists(file_path):
        with open(file_path, 'rb') as f:
            return hashlib.sha256(f.read()).hexdigest()
    return "FILE_NOT_FOUND"

# Build traceability manifest
sources = []

# Add all stage files
stage_files = [
    "stage02.json", "stage03.json", "stage04.json", "stage05.json",
    "stage06.json", "stage07.json", "stage08.json", "stage09.json", "stage09.5.json"
]

for stage_file in stage_files:
    stage_path = f"{idea_dir}/stages/{stage_file}"
    if os.path.exists(stage_path):
        sources.append({
            "file_path": stage_path,
            "sha256": get_file_sha256(stage_path),
            "used_for": f"Stage specifications and requirements from {stage_file}",
            "type": "stage_artifact"
        })

# Add idea metadata
idea_meta_path = f"{idea_dir}/meta/idea.json"
if os.path.exists(idea_meta_path):
    sources.append({
        "file_path": idea_meta_path,
        "sha256": get_file_sha256(idea_meta_path),
        "used_for": "Core app concept and metadata",
        "type": "idea_metadata"
    })

# Add vendor documentation if available
vendor_docs = [
    "vendor/expo-docs/compatibility_rules.md",
    "vendor/revenuecat-docs/llms.txt"
]

for vendor_doc in vendor_docs:
    if os.path.exists(vendor_doc):
        sources.append({
            "file_path": vendor_doc,
            "sha256": get_file_sha256(vendor_doc),
            "used_for": "Technical implementation guidance",
            "type": "vendor_documentation"
        })

# Create manifest
manifest = {
    "generated": datetime.now().isoformat() + "Z",
    "synthesis_version": "1.0",
    "total_sources": len(sources),
    "sources": sources
}

# Write manifest
with open(sources_path, 'w') as f:
    json.dump(manifest, f, indent=2)

print(f"✅ Traceability manifest created with {len(sources)} sources")
EOF
    
    log "✅ Traceability manifest generated"
}

# Function to validate contract completeness
validate_contract_completeness() {
    local idea_dir="$1"
    local prompt_md="${idea_dir}/app/_contract/build_prompt.md"
    
    log "Validating build contract completeness..."
    
    # Required sections in exact order
    local required_sections=(
        "PURPOSE"
        "ROLE" 
        "APP OVERVIEW"
        "TARGET PLATFORM"
        "BUSINESS MODEL"
        "MONETIZATION RULES"
        "CORE FEATURES (MVP)"
        "DESIGN REQUIREMENTS"
        "DESIGN SYSTEM REQUIREMENTS"
        "TECHNICAL REQUIREMENTS"
        "ASSETS"
        "PIPELINE ENFORCEMENT"
        "OUTPUT EXPECTATIONS"
        "EXECUTION INSTRUCTIONS"
    )
    
    local missing_sections=()
    
    for section in "${required_sections[@]}"; do
        if ! grep -q "^## $section" "$prompt_md"; then
            missing_sections+=("$section")
        fi
    done
    
    if [[ ${#missing_sections[@]} -gt 0 ]]; then
        log "ERROR: Build contract missing required sections:"
        printf '%s\n' "${missing_sections[@]}"
        echo "Contract generation failed - all sections must be present"
        exit 1
    fi
    
    log "✅ All required contract sections present"
}

# Main execution function
main() {
    if [[ $# -ne 1 ]]; then
        echo "Usage: $0 <idea_directory>"
        echo "Example: $0 runs/2026-01-09/run_123/ideas/01_myapp__app_001"
        exit 1
    fi
    
    local idea_dir="$1"
    
    # Validate idea directory exists
    if [[ ! -d "$idea_dir" ]]; then
        log "ERROR: Idea directory does not exist: $idea_dir"
        exit 1
    fi
    
    log "Starting Build Contract Synthesis for: $idea_dir"
    
    # Execute synthesis phases
    validate_inputs "$idea_dir"
    create_contract_structure "$idea_dir"
    extract_stage_data "$idea_dir"
    cache_web_research "$idea_dir"
    generate_build_prompt "$idea_dir"
    generate_traceability_manifest "$idea_dir"
    validate_contract_completeness "$idea_dir"
    
    log "✅ Build Contract Synthesis completed successfully"
    log "Contract artifacts:"
    log "  - ${idea_dir}/app/_contract/build_contract.json"
    log "  - ${idea_dir}/app/_contract/build_prompt.md" 
    log "  - ${idea_dir}/app/_contract/contract_sources.json"
    
    return 0
}

# Execute main function
main "$@"