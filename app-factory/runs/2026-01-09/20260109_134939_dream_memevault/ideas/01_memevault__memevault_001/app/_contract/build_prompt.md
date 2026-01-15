# Build Contract - MemeVault

## PURPOSE

Build a fully polished, production-ready MemeVault mobile application that is immediately submissible to Apple App Store and Google Play Store. This application must meet all quality, performance, and compliance standards defined in the comprehensive pipeline stages 02-09.5. The contract synthesizes all stage outputs into a deterministic, executable build specification that eliminates any need for Stage 10 improvisation or interpretation.

## ROLE

You are a Principal Mobile Applications Engineer with expertise in React Native, Expo framework, and subscription-based mobile app architecture. Your responsibility is to implement this build contract with zero deviation, zero improvisation, and complete adherence to the specifications derived from the comprehensive pipeline stages. Every implementation decision must be traceable back to explicit stage requirements.

## APP OVERVIEW

**App Name**: MemeVault
**Description**: A clean, fast meme library app that lets users save, organize, caption, and share memes with a polished UI and subscription-gated power features
**Target User**: Meme enthusiasts, social media content creators, and digital asset collectors who need efficient meme organization
**Value Proposition**: Premium mobile experience with subscription-gated features

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

**Free Tier Limitations**:

**Premium Subscription Tiers**:

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

**Navigation Structure**: Tab-based navigation

**Feature Implementation Requirements**:
1. **Save meme from camera roll, screenshot, or import**
2. **Auto-tag with AI or add custom tags/captions**
3. **Browse organized library with search and filtering**
4. **Share individual memes or curated collections**
5. **Discover trending memes from integrated feeds**

## DESIGN REQUIREMENTS

**Visual Design Implementation**:
- Implement exact user flows, wireframes, and interaction patterns from Stage 03 UX design specifications
- Clean, modern interface with intuitive user experience
- Color scheme adherence: Brand-consistent color implementation
- Typography system: Consistent font hierarchy and sizing
- Component consistency across all screens with reusable UI primitives

**User Experience Requirements**:
- Onboarding flow: Guided introduction to core features
- Navigation patterns: Intuitive navigation with clear information architecture
- Loading states and error handling for all user interactions
- Micro-interactions and animations for enhanced user engagement
- Responsive design for various device sizes and orientations

## DESIGN SYSTEM REQUIREMENTS

**Design Tokens Implementation**:

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

**Development Stack**:

**Data Management**:
- AsyncStorage for local persistence
- Local-first data architecture with optional cloud sync
- Data encryption for sensitive user information
- Efficient data loading and caching strategies

**Integration Requirements**:
- RevenueCat SDK integration following vendor/revenuecat-docs/ specifications
- Minimal external dependencies
- API integration patterns with proper error handling and retry logic
- Push notification setup (if required by features)

**Performance Requirements**:
- App launch time: < 3 seconds
- Screen transition time: < 500ms
- Memory usage optimization for low-end devices
- Bundle size optimization with code splitting where applicable

**Quality Gates**:

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
- Consistent brand integration across all visual elements
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
- Full application structure in builds/memevault/ directory
- All screens, components, and features from stages 02-09.5 implemented completely
- RevenueCat subscription flows fully functional with proper error handling
- Store submission readiness with complete metadata and assets

**Required Application Structure**:
- package.json with all required dependencies and proper Expo configuration
- app.json with store-ready metadata, permissions, and build configuration
- Complete source code structure with proper TypeScript implementation
- README.md with setup instructions, feature documentation, and deployment guide

**Store Submission Readiness**:
- Complete store submission package
- All required metadata for App Store and Google Play submissions
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
