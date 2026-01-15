# Documentation Cache Index - VisualBell App

## Expo References

### expo_sdk_compat.html
- **Source**: Expo SDK Upgrade Walkthrough
- **Purpose**: SDK compatibility rules, version checking behavior, upgrade guidance
- **Used in**: Stage 10 - Dependency validation and Expo compatibility enforcement
- **Key Rules**: 
  - Expo SDK versions must be upgraded incrementally
  - `expo install --check` output is authoritative
  - Never silence errors with arbitrary resolutions

### expo_install_check.html  
- **Source**: Expo CLI Documentation
- **Purpose**: `expo install --check` behavior, version validation, compatibility checks
- **Used in**: Stage 10 - Package version alignment and compatibility verification
- **Key Rules**:
  - React Native is not backwards compatible
  - Expected versions must be respected
  - Use `--fix` to align to expected versions

## RevenueCat References

### revenuecat_rn_install.html
- **Source**: RevenueCat React Native SDK Documentation
- **Purpose**: Installation requirements, platform setup, integration steps  
- **Used in**: Stage 04 (Monetization), Stage 10 (Build)
- **Key Requirements**:
  - React Native > 0.64
  - iOS deployment target ≥ 13.4
  - Android minimum API 23

### revenuecat_paywalls.html
- **Source**: RevenueCat Displaying Products Documentation
- **Purpose**: Paywalls, offerings, product display, dynamic configuration
- **Used in**: Stage 04 (Monetization), Stage 10 (Build)
- **Key Implementation Rules**:
  - Fetch offerings at runtime
  - Handle offline states
  - Make paywalls dynamic
  - Support variable product choices

### revenuecat_entitlements.html
- **Source**: RevenueCat Entitlements Documentation  
- **Purpose**: Feature gating, entitlement checks, restore purchases behavior
- **Used in**: Stage 04 (Monetization), Stage 10 (Build)
- **Key Implementation Rules**:
  - Gate features by Entitlements only
  - Never check products directly
  - Provide restore purchases UI
  - Prevent deep-link bypass of paywalls

## How Each is Used in This Build

### Stage 02-09: Specification Phases
- RevenueCat references inform monetization architecture decisions
- Expo references ensure SDK compatibility during planning

### Stage 10: Build Phase
- **Expo SDK Compatibility**: Hard gate - all dependencies must align with `expo install --check` expectations
- **RevenueCat Integration**: Must follow cached docs for offerings, entitlements, and restore purchases
- **Version Alignment**: No arbitrary resolutions allowed - must respect Expo expected versions

### Source of Truth Hierarchy
1. **Expo SDK compatibility rules** (hard gate, non-negotiable)
2. **Locally cached Expo + RevenueCat documentation** (this directory)
3. **Locally cached React Native upstream references** (_upstream directory)
4. **Application code** (src directory)

**No stage may bypass this hierarchy.**