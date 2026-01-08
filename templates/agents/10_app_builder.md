# Stage 10: Mobile App Generation (Direct Build)

## AGENT-NATIVE EXECUTION
You are Claude executing Stage 10 for a SPECIFIC IDEA PACK. Build a complete, production-ready Expo React Native app directly from the idea's specifications with strict isolation.

## BUILD MODE VERIFICATION (CRITICAL)
Stage 10 can ONLY be executed via `build <IDEA_ID_OR_NAME>` command:
- Verify invocation came from build mode, not `run app factory`
- Require Stage 01-09 artifacts exist (hard-fail if missing)
- Assert this stage is building ONE SPECIFIC IDEA only
- NO looping, NO batch processing, SINGLE IDEA CONTEXT ONLY

## STANDARDS CONTRACT (MANDATORY)
Read and comply with `standards/mobile_app_best_practices_2026.md`. Your implementation must demonstrate complete adherence to all subscription, accessibility, security, and technical requirements.

## SPEC EXHAUSTION RULE (MANDATORY)

Before generating ANY code, Stage 10 MUST:

1) **Load and parse ALL available artifacts** for the selected idea:
   - Stage 02: Product spec
   - Stage 03: UX flows and IA
   - Stage 04: Monetization
   - Stage 05: Architecture
   - Stage 06: Builder handoff
   - Stage 07: Polish
   - Stage 08: Brand
   - Stage 09: Launch/Store readiness (if present)

2) **Construct an internal "Build Plan"** that maps:
   - Each feature → source stage(s)
   - Each screen → Stage 03 UX definition
   - Each monetization rule → Stage 04
   - Each architectural choice → Stage 05
   - Each non-functional requirement → Stage 06/07
   - Each visual decision → Stage 08

This plan does NOT need to be output, but MUST be followed.

**BINDING SPECIFICATION PRINCIPLE**: 
The entire purpose of running Stages 01–09 is to maximize the information available to Stage 10.
Stage 10 MUST treat Stages 01–09 artifacts as binding constraints and MUST implement them.
If a field is present in Stages 02–09, Stage 10 must either (a) implement it, or (b) write a short 'implementation_exception.md' into the build explaining why it was not implemented.
No silent skipping.

**FORBIDDEN BEHAVIORS**:
- Using generic Expo starter patterns
- Using default navigation layouts if Stage 03 defines screens
- Inventing features already specified upstream
- Omitting features "for simplicity" if they are defined in prior stages

If Stage 10 cannot implement something as specified, it MUST:
- Fail the build
- Write a clear explanation of what could not be implemented and why

## DIRECT SPECIFICATION CONSUMPTION (MANDATORY INPUT)
**MUST read ONLY from this idea pack's stage artifacts:**
- Read: `runs/.../ideas/<idea_dir>/meta/idea.json` (canonical idea definition)
- Read: `runs/.../ideas/<idea_dir>/meta/boundary.json` (verify isolation)
- Read: `runs/.../ideas/<idea_dir>/stages/stage02.json` (product specifications)
- Read: `runs/.../ideas/<idea_dir>/stages/stage03.json` (UX design and wireframes)
- Read: `runs/.../ideas/<idea_dir>/stages/stage04.json` (monetization and RevenueCat)
- Read: `runs/.../ideas/<idea_dir>/stages/stage05.json` (technical architecture)
- Read: `runs/.../ideas/<idea_dir>/stages/stage06.json` (builder handoff priorities)
- Read: `runs/.../ideas/<idea_dir>/stages/stage07.json` (quality and polish requirements)
- Read: `runs/.../ideas/<idea_dir>/stages/stage08.json` (brand identity and visual design)
- Read: `runs/.../ideas/<idea_dir>/stages/stage09.json` (ASO package and launch planning)

**BOUNDARY VALIDATION**: 
- Verify all stage JSONs have identical run_id, idea_id, and idea_dir
- Verify all input_stage_paths are within the correct idea pack directory
- **If boundary violations detected**: write `stage10_failure.md` and stop immediately

## OUTPUTS
- Write: `runs/.../ideas/<idea_dir>/stages/stage10.json` (build plan with mapping proof)
- Write: `runs/.../ideas/<idea_dir>/outputs/stage10_build.log` (complete binding proof)
- Write: `runs/.../ideas/<idea_dir>/outputs/stage10_research.md` (sources consulted)
- Render: `runs/.../ideas/<idea_dir>/spec/10_mobile_app.md` (app specification)
- **Create: Complete Expo App** (MANDATORY):
  - `builds/<idea_dir>/<build_id>/app/` (complete Expo React Native app)
  - `builds/<idea_dir>/<build_id>/build_log.md` (execution log)
  - `builds/<idea_dir>/<build_id>/sources.md` (research citations)

## REQUIRED RESEARCH (ONLINE)
MUST consult these sources and cite in stage10_research.md:
1. **Official Expo Router docs** - latest navigation patterns and file-based routing
2. **Official RevenueCat docs** - React Native/Expo integration and subscription flows:
   - https://www.revenuecat.com/docs/getting-started/installation/reactnative
   - https://www.revenuecat.com/docs/getting-started/configuring-sdk 
   - https://www.revenuecat.com/docs/getting-started/entitlements
   - https://www.revenuecat.com/docs/getting-started/making-purchases
   - https://www.revenuecat.com/docs/getting-started/restoring-purchases
3. **SQLite/Expo SQLite docs** - local database setup and migrations
4. **Category-specific patterns** - search for relevant open-source Expo app examples

Research constraints:
- Use official documentation as authoritative source
- Translate patterns into implementation decisions, don't copy code directly
- Document how research influenced specific architectural choices
- Cite all sources with URLs, dates accessed, and brief relevance notes

## BUILD OUTPUT STRUCTURE (MANDATORY)

Generate deterministic `build_id` from hash of:
- run_id + idea_id + concatenated hashes of stage02-09 JSON files

Create complete app structure at `builds/<idea_dir>/<build_id>/app/`:

```
builds/<idea_dir>/<build_id>/app/
├── package.json              # Complete dependencies from stage05 + RevenueCat + Expo + SQLite
├── app.json                  # Expo config with ASO metadata from stage09
├── babel.config.js           # Standard Expo Babel configuration
├── metro.config.js           # Metro bundler configuration
├── .env.example             # RevenueCat environment variables template
├── App.js                    # Main entry point with RevenueCat init and navigation
├── src/
│   ├── screens/              # All screens from stage03 wireframes
│   │   ├── OnboardingScreen.js
│   │   ├── HomeScreen.js
│   │   ├── PaywallScreen.js
│   │   ├── SettingsScreen.js
│   │   └── [other screens from stage02 features]
│   ├── components/           # Reusable components from stage03
│   │   ├── ui/              # Basic UI components (loading, error states)
│   │   ├── feature/         # Feature-specific components
│   │   └── paywall/         # RevenueCat paywall components
│   ├── navigation/
│   │   └── AppNavigator.js   # Navigation structure from stage03
│   ├── services/
│   │   ├── purchases.js      # Full RevenueCat integration from stage04
│   │   ├── database.js       # SQLite setup, migrations, repositories
│   │   ├── analytics.js      # Analytics setup for monitoring
│   │   └── api.js           # API service layer if needed
│   ├── database/
│   │   ├── schema.js        # SQLite table definitions
│   │   ├── migrations.js    # Database migration scripts
│   │   └── repositories/    # Data access layer
│   ├── hooks/
│   │   ├── usePurchases.js  # RevenueCat subscription state
│   │   └── useDatabase.js   # SQLite data hooks
│   ├── styles/
│   │   ├── theme.js         # Brand identity from stage08
│   │   ├── colors.js        # Color palette from stage08
│   │   └── typography.js    # Typography system from stage08
│   ├── utils/
│   │   ├── storage.js       # AsyncStorage for preferences only
│   │   └── helpers.js       # General utility functions
│   └── constants/
│       ├── config.js        # App configuration with env vars
│       ├── strings.js       # Text content and copy
│       └── entitlements.js  # RevenueCat entitlement constants
├── assets/
│   ├── images/              # App icons and imagery (placeholders generated)
│   │   ├── icon.png        # App icon placeholder
│   │   ├── splash.png      # Splash screen placeholder
│   │   └── adaptive-icon.png # Android adaptive icon
│   └── fonts/               # Custom fonts if specified
├── app.config.js            # Dynamic Expo configuration with env
├── spec_map.md              # Evidence of stage02-09 consumption
└── README.md                # Setup instructions and RevenueCat configuration
```

## MOBILE APP REQUIREMENTS (PRODUCTION-READY)

### Core Configuration
- **Framework**: Expo SDK 50+ with React Native 0.73+
- **Navigation**: Expo Router v3 file-based routing from stage03 wireframes
- **Monetization**: RevenueCat React Native SDK fully integrated with offerings, entitlements
- **Data Storage**: SQLite as primary data store, AsyncStorage for preferences only
- **State Management**: Context API or Zustand (based on stage05 architecture)
- **Styling**: React Native Elements + custom theme from stage08

### Required Dependencies
```json
{
  "expo": "~50.0.0",
  "react": "18.2.0", 
  "react-native": "0.73.0",
  "expo-router": "^3.0.0",
  "react-native-purchases": "^7.0.0",
  "expo-sqlite": "~13.4.0",
  "react-native-elements": "^3.4.3",
  "@react-navigation/native": "^6.1.0",
  "expo-dev-client": "~3.3.0",
  "react-native-async-storage": "^1.19.0",
  "expo-linear-gradient": "~12.7.0",
  "expo-constants": "~15.4.0",
  "expo-linking": "~6.2.2",
  "expo-status-bar": "~1.11.1"
}
```

### RevenueCat Integration Requirements (MANDATORY)
1. **Environment Configuration**:
   - No hardcoded API keys in source code
   - Support EXPO_PUBLIC_REVENUECAT_IOS_KEY and EXPO_PUBLIC_REVENUECAT_ANDROID_KEY
   - Include .env.example with placeholder keys
   - Graceful failure with dev-only warning if keys missing

2. **SDK Setup**:
   - Configure Purchases at app start with platform-specific keys
   - Anonymous user identification with stable app-scoped ID
   - Support for safe user aliasing when upgrading to accounts

3. **Offerings & Entitlements**:
   - Fetch current offerings and display packages in paywall
   - Drive premium features from customerInfo.entitlements.active
   - Include restore purchases functionality
   - Include manage subscriptions deep link

4. **Error Handling & Offline**:
   - Handle empty offerings, network errors, store unavailability
   - Provide loading, empty, and retry states
   - Fallback to free mode with clear UX if RevenueCat fails

5. **Subscription Compliance**:
   - Paywall includes price, billing period, trial messaging, auto-renew disclosure
   - Cancel-anytime instructions and terms/privacy links
   - Restore purchases and manage subscription entry points

### SQLite Data Architecture (MANDATORY)
- Replace AsyncStorage as primary data store with expo-sqlite
- Include schema definitions and migration system
- Repository/data access layer for clean separation
- Keep AsyncStorage only for user preferences (theme, onboarding completed)

### Feature Implementation (MAP FROM STAGES)
- **Stage02 → App Screens**: Each core feature becomes a screen with navigation
- **Stage03 → UI Implementation**: Wireframes become actual component layouts with onboarding flow
- **Stage04 → Subscription Logic**: RevenueCat products, paywalls, and subscription gates
- **Stage05 → Architecture**: State management, SQLite data persistence, and service layers
- **Stage06 → Quality Gates**: Error handling, loading states, and accessibility
- **Stage07 → Polish**: Animations, micro-interactions, and performance optimization
- **Stage08 → Brand Application**: Theme, colors, typography, and visual identity
- **Stage09 → App Store Setup**: Bundle ID, app name, description, and icon

### Ship-Ready UX Requirements (MANDATORY)
- **Onboarding Flow**: 2-4 screens matching Stage 03 UX and Stage 02 product spec
- **Paywall Screen**: Full-screen paywall (not alert dialogs) with subscription messaging
- **Settings Screen**: Manage subscription, restore, privacy/terms, support, app version
- **Empty States**: All primary screens have appropriate empty state UX
- **Loading States**: Loading indicators and optimistic UI where appropriate
- **Error Boundary**: Safe error surfaces with recovery options
- **Accessibility**: Labels, hit targets, contrast, Dynamic Type support
- **Asset Placeholders**: App icon, splash screen, adaptive icon generated
- **Production Toggles**: Development-only logging, lint/format scripts

## JSON SCHEMA (Build Plan with Mapping Proof)

```json
{
  "$ref": "schemas/_shared/meta.schema.json",
  "type": "object",
  "properties": {
    "build_execution": {
      "type": "object",
      "properties": {
        "build_id": {"type": "string"},
        "output_path": {"type": "string"},
        "consumed_stages": {"type": "array", "items": {"type": "string"}},
        "boundary_verification": {"type": "string", "enum": ["passed", "failed"]},
        "research_completed": {"type": "boolean"}
      },
      "required": ["build_id", "output_path", "consumed_stages", "boundary_verification", "research_completed"]
    },
    "app_specification": {
      "type": "object", 
      "properties": {
        "app_name": {"type": "string"},
        "bundle_id": {"type": "string"},
        "expo_version": {"type": "string"},
        "main_dependencies": {"type": "array", "items": {"type": "string"}},
        "screens_implemented": {"type": "array", "items": {"type": "string"}},
        "navigation_structure": {"type": "object"},
        "revenuecat_configuration": {"type": "object"},
        "theme_system": {"type": "object"}
      },
      "required": ["app_name", "bundle_id", "expo_version", "main_dependencies", "screens_implemented"]
    },
    "constraints_mapping": {
      "type": "object",
      "properties": {
        "stage02_to_screens": {"type": "object"},
        "stage03_to_ui": {"type": "object"},
        "stage04_to_subscriptions": {"type": "object"},
        "stage05_to_architecture": {"type": "object"},
        "stage08_to_branding": {"type": "object"},
        "stage09_to_metadata": {"type": "object"}
      },
      "required": ["stage02_to_screens", "stage03_to_ui", "stage04_to_subscriptions", "stage05_to_architecture", "stage08_to_branding", "stage09_to_metadata"]
    },
    "verification_proof": {
      "type": "object",
      "properties": {
        "all_features_implemented": {"type": "boolean"},
        "revenuecat_integrated": {"type": "boolean"},
        "brand_applied": {"type": "boolean"},
        "navigation_complete": {"type": "boolean"},
        "app_runnable": {"type": "boolean"}
      },
      "required": ["all_features_implemented", "revenuecat_integrated", "brand_applied", "navigation_complete", "app_runnable"]
    }
  },
  "required": ["build_execution", "app_specification", "constraints_mapping", "verification_proof"]
}
```

## STAGE COVERAGE CHECKLIST (MANDATORY)

Before code generation begins, Stage 10 MUST verify:

- [ ] Stage 02 features are fully represented in planned components/screens
- [ ] Stage 03 UX flows map to navigation structure
- [ ] Stage 04 monetization rules map to RevenueCat config and UI
- [ ] Stage 05 architecture choices are reflected in storage, state, and structure
- [ ] Stage 06 constraints are respected (platforms, frameworks, limits)
- [ ] Stage 07 polish requirements are addressed (copy, empty states, loading, errors)
- [ ] Stage 08 brand rules are applied consistently (colors, typography, tone)

**If ANY box cannot be checked, Stage 10 MUST NOT proceed.**

**Output Fidelity Requirement**: The generated app MUST feel like a deliberate implementation of a detailed spec, not a demo, scaffold, or MVP shortcut.

**Mental Model**: "Stages 01–09 wrote the app in English. Stage 10 translates it into code."

## EXECUTION STEPS (BUILD THE COMPLETE APP)

### Phase 1: Boundary Validation and Research
1. **Load and Validate All Stage Artifacts**:
   - Read stages 02-09 JSON files from idea pack directory
   - Verify meta field consistency (run_id, idea_id, boundary paths)
   - Document input sources in stage10.json

2. **Conduct Required Research**:
   - Research Expo Router patterns for navigation from stage03
   - Research RevenueCat integration: installation, configuration, entitlements, purchases, restore
   - Research Expo SQLite setup, migrations, and best practices
   - Research accessibility patterns and production hardening
   - Document all sources in stage10_research.md

### Phase 2: Build Planning and Directory Setup
3. **Generate Build Plan**:
   - Create deterministic build_id from stage content hashes
   - Map each stage constraint to specific implementation approach
   - Plan complete app structure and file organization

4. **Prepare Build Directory**:
   - Create `builds/<idea_dir>/<build_id>/app/` directory structure
   - Initialize as fresh Expo React Native project

### Phase 3: Core App Implementation
5. **Implement App Configuration**:
   - Generate package.json with all required dependencies (RevenueCat, SQLite, etc.)
   - Create app.json with metadata from stage09 ASO package
   - Set up Expo configuration files (babel.config.js, metro.config.js, app.config.js)
   - Create .env.example with RevenueCat key placeholders

6. **Set Up Data Layer**:
   - Implement SQLite schema and migration system
   - Create repository/data access layer
   - Set up database initialization and seeding

7. **Create Navigation and Screens**:
   - Implement navigation structure from stage03 wireframes
   - Create onboarding flow (2-4 screens) from stage03
   - Create all screens specified in stage02 core features
   - Apply UX patterns and layouts from stage03 specifications

8. **Integrate RevenueCat Subscriptions**:
   - Set up RevenueCat SDK with environment-based configuration
   - Implement offerings fetching and entitlement checking
   - Create full-screen paywall with subscription messaging
   - Add restore purchases and manage subscriptions functionality
   - Create subscription gating logic throughout app

### Phase 4: Styling and Polish
9. **Apply Brand Identity**:
   - Create theme system from stage08 brand specifications
   - Implement color palette and typography from stage08
   - Apply brand voice and messaging throughout interface

10. **Implement Quality Requirements**:
    - Add accessibility features from stage07 requirements
    - Implement error handling, loading states, and empty states
    - Add error boundary and safe error surfaces
    - Generate app icon, splash screen, and asset placeholders
    - Add performance optimizations from stage07

### Phase 5: Production Hardening
11. **Complete Production Features**:
    - Create Settings screen with subscription management
    - Add terms/privacy links and support contact
    - Implement production toggles and development-only logging
    - Add lint/format scripts to package.json
    - Set up analytics service if specified in stage05

12. **Generate Documentation**:
    - Create spec_map.md showing stage02-09 consumption mapping
    - Write comprehensive README with RevenueCat setup instructions
    - Document exact mapping from each stage constraint to implementation
    - Write complete build log with constraint verification

### Phase 6: Verification and Output
13. **Validate Complete App**:
    - Verify all stage02 features are implemented as screens/functionality
    - Verify RevenueCat integration is functional with proper error handling
    - Verify SQLite data layer is complete with migrations
    - Verify brand identity is applied consistently throughout
    - Verify app structure is complete and runnable

14. **Write Final Artifacts**:
    - Complete stage10.json with full mapping proof
    - Write stage10_build.log with binding verification
    - Render stage10 specification markdown

## CONSTRAINT BINDING REQUIREMENTS (MANDATORY)

**NO GENERIC FALLBACKS**: Stage 10 is FORBIDDEN from using generic Expo starter patterns when upstream stages provide specifications.

For every specification from stages 02-09, you MUST:

1. **Identify the Constraint**: Extract specific requirement from stage JSON
2. **Map to Implementation**: Document exactly how constraint becomes code
3. **Verify Implementation**: Confirm constraint is correctly applied
4. **Document Proof**: Write mapping in stage10_build.log

**Exhaustive Implementation Rule**: If upstream stages define:
- Onboarding → it MUST exist as specified
- Paywall → it MUST be implemented per Stage 04 monetization
- Settings → it MUST include all defined items from Stage 03
- Storage rules → they MUST be respected per Stage 05
- Monetization language → it MUST be used verbatim where applicable
- Brand elements → they MUST be applied per Stage 08

Example constraint binding:
```
Stage02.product_specification.core_features[0]: "Smart Focus Sessions with AI recommendations"
→ Mapped to: src/screens/FocusSessionScreen.js + src/services/recommendations.js
→ Implementation: AI suggestion logic with user preference learning
→ Verification: ✓ Feature fully implemented with UI and backend logic
```

**Implementation Verification**: The generated app MUST demonstrate that Stages 01–09 provided the maximum possible information and Stage 10 used ALL of it.

## FAILURE CONDITIONS (HARD STOPS)

Stage 10 MUST fail and stop execution if:
- Any stage02-09 JSON has boundary violations (wrong run_id/idea_id)
- Required research cannot be completed (official docs inaccessible)
- RevenueCat integration cannot be properly configured
- Any core feature from stage02 cannot be implemented
- App structure is incomplete or non-functional
- **Stage Coverage Checklist cannot be completed** (any checkbox remains unchecked)
- **Upstream specification cannot be fully implemented** as defined in prior stages
- **Generic fallback patterns would be required** due to insufficient upstream detail

**Spec Compliance Failure Examples**:
- Stage 03 defines specific onboarding flow but cannot implement due to technical limitations
- Stage 04 monetization rules conflict with RevenueCat capabilities
- Stage 08 brand requirements cannot be applied consistently throughout app
- Stage 05 architecture choices are incompatible with Expo framework

Write detailed failure report to `stage10_failure.md` with:
- Exact failure reason and stage constraint that could not be satisfied
- Missing dependencies or implementation blockers
- Specific upstream specification that failed to implement
- Remediation steps required to resolve the issue

## STANDARDS COMPLIANCE MAPPING

### Subscription & Store Compliance (MANDATORY)
- **Requirement**: RevenueCat integration with proper subscription lifecycle
- **Implementation**: Full RevenueCat SDK integration with dev build configuration, subscription products from stage04, paywall UI from stage03, restore purchases functionality

### Accessibility & Design (MANDATORY)  
- **Requirement**: WCAG 2.1 AA compliance with platform design guidelines
- **Implementation**: Accessibility labels on all interactive elements, proper color contrast from stage08 theme, text scaling support, VoiceOver/TalkBack compatibility

### Privacy & Analytics (MANDATORY)
- **Requirement**: Privacy-compliant analytics and data handling
- **Implementation**: Firebase Analytics setup with opt-out controls, minimal data collection approach, privacy policy links from stage09

### App Store Readiness (MANDATORY)
- **Requirement**: Production-ready app structure and metadata
- **Implementation**: Complete app.json with stage09 ASO package, proper bundle configuration, app icon and assets, README with setup instructions

DO NOT output JSON in chat. Write complete Expo app to disk with full constraint binding proof.