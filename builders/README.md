# App Factory Builder System

The Builder is Phase 2 of the App Factory pipeline, responsible for transforming specifications into functional Flutter application scaffolds.

## What the Builder Does

The Builder consumes complete specifications from Phase 1 (Plan) and generates:

- **Runnable Flutter app structure** with proper architecture
- **RevenueCat integration stubs** for subscription management
- **Standards-compliant accessibility** implementation
- **Testing framework** with example tests
- **Development-ready foundation** for store submission

## How It Works

### Input: Completed Specification Run
```
runs/YYYY-MM-DD/<project>/spec/
├── 04_product_spec.md        # Features and requirements
├── 05_ux.md                  # User experience design
├── 06_monetization.md        # Subscription strategy
├── 07_architecture.md        # Technical design
├── 08_builder_handoff.md     # Implementation guide
└── [other spec files...]
```

### Output: Flutter App Scaffold
```
runs/YYYY-MM-DD/<project>/app/
├── lib/
│   ├── main.dart             # App entry point
│   ├── models/
│   │   ├── app_user.dart     # User model
│   │   └── subscription.dart # Subscription model
│   ├── services/
│   │   ├── revenue_cat_service.dart  # Subscription management
│   │   ├── analytics_service.dart    # Analytics abstraction
│   │   └── storage_service.dart      # Local storage
│   ├── screens/
│   │   ├── onboarding/       # First-time user experience
│   │   ├── paywall/          # Subscription purchase flow
│   │   ├── main/             # Primary app screens
│   │   └── settings/         # App configuration
│   ├── widgets/
│   │   ├── design_system/    # Material 3 components
│   │   └── accessibility/    # WCAG 2.1 AA helpers
│   └── theme/
│       ├── app_theme.dart    # Material 3 theme
│       └── colors.dart       # Brand colors
├── test/
│   ├── unit/                 # Business logic tests
│   ├── widget/               # UI component tests
│   └── integration/          # End-to-end tests
├── pubspec.yaml              # Dependencies and configuration
├── ios/                      # iOS platform configuration
├── android/                  # Android platform configuration
└── BUILD_REPORT.md           # Generated app summary
```

## How to Run the Builder

### Prerequisites
- Completed Phase 1 specification run
- Flutter SDK (latest stable)
- Development environment (iOS: Xcode, Android: Android Studio)

### Command Usage
```bash
# Basic build (uses most recent completed run)
./bin/appfactory build

# Build specific run
./bin/appfactory build --run runs/2026-01-05/my-app

# Force rebuild (overwrites existing app/)
./bin/appfactory build --force

# Build with verbose output
./bin/appfactory build --verbose
```

### What Gets Generated

1. **Core Architecture**
   - Clean Architecture with layers (presentation, domain, data)
   - Provider/Riverpod state management (based on complexity)
   - Service locator pattern for dependency injection

2. **RevenueCat Integration**
   - Subscription service with purchase flow
   - Entitlement-based feature gating
   - Restore purchases functionality
   - Purchase error handling

3. **Analytics & Monitoring**
   - Firebase Analytics integration
   - Custom event tracking
   - Crash reporting setup
   - Performance monitoring

4. **UI Foundation**
   - Material 3 design system
   - Responsive layouts
   - Dark/light theme support
   - Platform-specific adaptations

5. **Testing Infrastructure**
   - Unit test examples
   - Widget test setup
   - Integration test framework
   - Mock services for testing

## Builder Configuration

The Builder reads specifications and applies these transformations:

### From Product Spec
- **Features** → Screen implementations
- **User personas** → Onboarding flows  
- **Success metrics** → Analytics events
- **MVP scope** → Development priorities

### From UX Design
- **User flows** → Navigation structure
- **Components** → Widget implementations
- **Accessibility** → WCAG 2.1 AA compliance
- **Responsive design** → Layout systems

### From Monetization Strategy
- **Subscription tiers** → RevenueCat configuration
- **Paywall design** → Purchase flow UI
- **Pricing strategy** → Product definitions
- **A/B testing** → Experiment framework

### From Architecture Spec
- **Technology stack** → Dependencies and setup
- **State management** → Provider/Bloc implementation
- **Data storage** → Local database setup
- **API design** → Service interfaces

## Standards Enforcement

The Builder enforces all requirements from `/standards/mobile_app_best_practices_2026.md`:

### Subscription Compliance
- ✅ RevenueCat SDK integration
- ✅ Entitlement-based access control
- ✅ Store guideline compliance
- ✅ Transparent pricing disclosure

### Accessibility Requirements  
- ✅ WCAG 2.1 AA compliance
- ✅ Touch target sizing (44pt iOS, 48dp Android)
- ✅ Color contrast ratios
- ✅ Screen reader support

### Performance Standards
- ✅ <3 second startup time
- ✅ 60fps UI interactions
- ✅ Memory optimization
- ✅ Offline functionality

### Security Implementation
- ✅ Secure storage for tokens
- ✅ No hardcoded secrets
- ✅ Input validation
- ✅ HTTPS enforcement

## Adding New Builders

The Builder system is extensible for different platforms:

### Current Builders
- **Flutter Builder** (default) - Cross-platform iOS + Android

### Planned Builders
- **React Native Builder** - Alternative cross-platform
- **Native iOS Builder** - Swift/SwiftUI implementation
- **Native Android Builder** - Kotlin/Jetpack Compose

### Creating Custom Builders

1. Create builder in `/builders/implementations/`
2. Implement `BuilderInterface`:
   ```dart
   abstract class BuilderInterface {
     Future<BuildResult> build(SpecificationSet specs);
     List<String> get requiredSpecs;
     String get platformName;
   }
   ```
3. Register in `/builders/registry.dart`
4. Add CLI command support
5. Update tests and documentation

## Troubleshooting

### Common Issues

**Build fails with "specifications incomplete"**
- Ensure Phase 1 completed successfully
- Check all required spec files exist
- Validate spec file formats

**Generated app won't compile**
- Update Flutter SDK to latest stable
- Run `flutter pub get` in app directory
- Check platform-specific requirements

**RevenueCat integration errors**
- Verify RevenueCat configuration in specs
- Check product IDs match specification
- Ensure sandbox environment setup

**Testing framework issues**
- Install test dependencies: `flutter test`
- Check mock service implementations
- Validate test environment setup

### Debug Commands
```bash
# Validate specification completeness
./bin/appfactory build --dry-run

# Check generated app structure
./bin/appfactory build --validate

# Test generated app compilation
cd runs/YYYY-MM-DD/project/app && flutter analyze
```

## Development Workflow

### From Generated Scaffold to Store

1. **Review BUILD_REPORT.md** - Understand what was generated
2. **Customize business logic** - Implement app-specific features
3. **Design UI polish** - Apply brand and visual design
4. **Test thoroughly** - Unit, widget, and integration tests
5. **Configure app signing** - iOS certificates, Android keystore
6. **Submit to stores** - Follow platform-specific guidelines

### Recommended Next Steps

After Builder generates scaffold:

1. **Test the foundation**
   ```bash
   cd runs/YYYY-MM-DD/project/app
   flutter test
   flutter run
   ```

2. **Customize for your app**
   - Update brand colors in `/lib/theme/`
   - Implement business logic in `/lib/services/`
   - Customize screens in `/lib/screens/`

3. **Configure subscriptions**
   - Set up RevenueCat dashboard
   - Configure iOS/Android products
   - Test purchase flows in sandbox

4. **Prepare for launch**
   - Complete app store assets
   - Finalize privacy policy
   - Set up analytics and monitoring

## Builder Quality Gates

Every generated app must pass:

### Functional Requirements
- ✅ App compiles without errors
- ✅ All screens navigate correctly
- ✅ Subscription flow works in sandbox
- ✅ Core features functional

### Quality Requirements
- ✅ Performance standards met
- ✅ Accessibility compliance verified
- ✅ Cross-platform consistency
- ✅ Testing coverage >80%

### Business Requirements
- ✅ RevenueCat integration functional
- ✅ Analytics tracking operational
- ✅ Store submission ready
- ✅ Documentation complete

---

**Next Steps**: See `ARCHITECTURE.md` for technical implementation details and `CONTRIBUTING.md` for development guidelines.