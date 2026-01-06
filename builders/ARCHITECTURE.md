# Builder Architecture Documentation

This document describes the technical architecture of the App Factory Builder system.

## System Overview

The Builder is a specification-to-code transformation engine that converts human-readable app requirements into functional Flutter application scaffolds.

### Architecture Principles

1. **Specification-Driven**: All decisions based on Phase 1 outputs
2. **Standards-Compliant**: Enforces mobile app best practices
3. **Deterministic**: Same specs → same output (except timestamps)
4. **Extensible**: Pluggable builder implementations
5. **Quality-Gated**: Generated code must meet quality requirements

## Module Boundaries

```
builders/
├── core/                    # Core builder infrastructure
│   ├── interfaces/          # Abstract builder contracts
│   ├── models/              # Data structures
│   ├── parsers/             # Specification parsers
│   └── validators/          # Quality gates
├── implementations/         # Platform-specific builders
│   ├── flutter/             # Flutter app generator
│   ├── react_native/        # React Native generator (future)
│   └── native/              # Native iOS/Android (future)
├── templates/               # Code generation templates
│   ├── flutter/             # Flutter-specific templates
│   └── shared/              # Cross-platform templates
├── quality/                 # Quality assurance
│   ├── analyzers/           # Code quality analysis
│   ├── validators/          # Standards compliance
│   └── tests/               # Generated app testing
└── cli/                     # Command-line interface
    ├── commands/            # CLI command implementations
    ├── formatters/          # Output formatting
    └── progress/            # Progress reporting
```

## Data Flow

### Input Processing
```
Specification Files → Parser → Specification Model → Validator → Builder
```

1. **File Discovery**: Locate required spec files in run directory
2. **Content Parsing**: Extract structured data from markdown specs
3. **Model Construction**: Build internal specification representation
4. **Validation**: Ensure completeness and consistency
5. **Builder Selection**: Choose appropriate platform builder

### Code Generation
```
Specification Model → Template Engine → Code Files → Quality Gates → Output
```

1. **Template Selection**: Choose templates based on requirements
2. **Context Preparation**: Prepare data for template rendering
3. **File Generation**: Render templates to source code files
4. **Quality Validation**: Run quality gates on generated code
5. **Output Packaging**: Organize files into app structure

## Artifact Flow

### Specification Consumption

The Builder reads these specification files:

```yaml
required_specs:
  - "04_product_spec.md"      # Features, requirements, success metrics
  - "05_ux.md"                # User flows, accessibility requirements
  - "06_monetization.md"      # Subscription strategy, RevenueCat config
  - "07_architecture.md"      # Tech stack, state management decisions
  - "08_builder_handoff.md"   # Implementation guidance

optional_specs:
  - "02_idea_selection.md"    # App identity and concept
  - "09_polish.md"            # Quality requirements
  - "10_brand.md"             # Visual identity guidelines
```

### Specification Data Extraction

Each spec is parsed into structured data:

```typescript
interface ProductSpec {
  appName: string;
  coreFeatures: Feature[];
  successMetrics: Metric[];
  targetUsers: UserPersona[];
  mvpScope: string[];
}

interface UXSpec {
  userFlows: Flow[];
  screens: Screen[];
  components: Component[];
  accessibilityRequirements: A11yRequirement[];
}

interface MonetizationSpec {
  subscriptionTiers: SubscriptionTier[];
  revenueCatConfig: RevenueCatConfig;
  paywallStrategy: PaywallConfig;
  analyticsEvents: AnalyticsEvent[];
}

interface ArchitectureSpec {
  techStack: TechStack;
  stateManagement: StateManagementPattern;
  dataStorage: StorageStrategy;
  thirdPartyIntegrations: Integration[];
}
```

## Where Standards Are Applied

### Subscription Architecture
**Source**: `/standards/mobile_app_best_practices_2026.md` Section 1-3  
**Implementation**: `builders/implementations/flutter/generators/subscription_generator.dart`

- RevenueCat SDK integration
- Entitlement-based feature gating
- Store compliance (Apple App Store, Google Play)
- Purchase flow implementation
- Restore purchases functionality

**Template**: `/builders/templates/flutter/services/revenue_cat_service.dart.template`

### Analytics Abstraction
**Source**: `/standards/mobile_app_best_practices_2026.md` Section 6  
**Implementation**: `builders/implementations/flutter/generators/analytics_generator.dart`

- Firebase Analytics default implementation
- Custom event tracking
- Privacy compliance (ATT, GDPR)
- Analytics opt-out mechanisms

**Template**: `/builders/templates/flutter/services/analytics_service.dart.template`

### Accessibility Implementation
**Source**: `/standards/mobile_app_best_practices_2026.md` Section 5  
**Implementation**: `builders/implementations/flutter/generators/accessibility_generator.dart`

- WCAG 2.1 AA compliance
- Touch target sizing (44pt iOS, 48dp Android)
- Color contrast requirements
- Screen reader support
- Semantic markup

**Templates**: 
- `/builders/templates/flutter/widgets/accessibility/`
- `/builders/templates/flutter/theme/accessibility_theme.dart.template`

### Testing Strategy
**Source**: `/standards/mobile_app_best_practices_2026.md` Section 8  
**Implementation**: `builders/implementations/flutter/generators/test_generator.dart`

- Unit test structure for business logic
- Widget tests for UI components
- Integration tests for user flows
- Accessibility testing framework
- Mock service implementations

**Templates**: `/builders/templates/flutter/test/`

## Builder Implementation Details

### Flutter Builder Architecture

```
FlutterBuilder
├── ProjectStructureGenerator    # Creates folder structure
├── DependencyGenerator          # Generates pubspec.yaml
├── ThemeGenerator              # Material 3 theme system
├── ServicesGenerator           # Business logic services
├── ScreensGenerator            # UI screen implementations
├── WidgetsGenerator            # Reusable UI components
├── ModelsGenerator             # Data model classes
├── TestGenerator               # Testing framework
└── ConfigurationGenerator      # Platform-specific configs
```

### Code Generation Pipeline

1. **Specification Parsing**
   ```dart
   class SpecificationParser {
     SpecificationSet parse(List<File> specFiles);
     void validate(SpecificationSet specs);
   }
   ```

2. **Template Rendering**
   ```dart
   class TemplateEngine {
     String render(Template template, TemplateContext context);
     List<GeneratedFile> renderAll(List<Template> templates);
   }
   ```

3. **Quality Validation**
   ```dart
   class QualityValidator {
     ValidationResult validate(GeneratedProject project);
     List<QualityIssue> analyze(List<GeneratedFile> files);
   }
   ```

## RevenueCat Architecture Integration

### Configuration Flow
```
Monetization Spec → RevenueCat Config → Flutter Service → App Integration
```

1. **Product Definition**
   - Extract subscription tiers from monetization spec
   - Generate iOS/Android product IDs
   - Create entitlement mappings

2. **Service Implementation**
   - RevenueCat SDK initialization
   - Purchase flow handling
   - Entitlement checking
   - Error handling and recovery

3. **Feature Gating**
   - Entitlement-based access control
   - UI component conditional rendering
   - Navigation flow modifications

### Generated RevenueCat Integration

```dart
// Generated service interface
abstract class SubscriptionService {
  Future<bool> hasActiveSubscription();
  Future<List<Package>> getAvailablePackages();
  Future<PurchaseResult> purchase(Package package);
  Future<void> restorePurchases();
}

// Generated implementation
class RevenueCatSubscriptionService implements SubscriptionService {
  // Implementation based on monetization spec
}

// Generated entitlement checker
class EntitlementService {
  bool hasEntitlement(String entitlementId);
  List<String> getActiveEntitlements();
}
```

## Testing Strategy Implementation

### Generated Test Structure
```
test/
├── unit/
│   ├── services/              # Business logic tests
│   ├── models/                # Data model tests
│   └── helpers/               # Utility function tests
├── widget/
│   ├── screens/               # Screen widget tests
│   ├── components/            # Component widget tests
│   └── accessibility/         # A11y compliance tests
├── integration/
│   ├── onboarding_flow_test.dart
│   ├── subscription_flow_test.dart
│   └── core_features_test.dart
└── mocks/
    ├── mock_services.dart     # Service mocks
    └── mock_data.dart         # Test data
```

### Test Generation Rules

1. **Unit Tests**: Generated for all service classes and business logic
2. **Widget Tests**: Generated for custom widgets and complex screens
3. **Integration Tests**: Generated for critical user flows from UX spec
4. **Accessibility Tests**: Generated for all interactive components
5. **Mock Services**: Generated for external dependencies (RevenueCat, Analytics)

## Error Handling & Validation

### Specification Validation

```dart
class SpecificationValidator {
  ValidationResult validate(SpecificationSet specs) {
    var result = ValidationResult();
    
    // Required files check
    if (!specs.hasProductSpec()) {
      result.addError("Missing product specification");
    }
    
    // Cross-spec consistency
    if (!monetizationAlignsWith(specs.ux, specs.monetization)) {
      result.addWarning("UX flows don't include paywall integration");
    }
    
    // Standards compliance
    if (!meetsAccessibilityRequirements(specs.ux)) {
      result.addError("UX spec doesn't meet WCAG 2.1 AA requirements");
    }
    
    return result;
  }
}
```

### Build Quality Gates

```dart
class BuildQualityGate {
  Future<QualityResult> validate(GeneratedProject project) {
    var tasks = [
      _validateCompilation(project),
      _validateTestsPass(project),
      _validateAccessibility(project),
      _validatePerformance(project),
      _validateSecurity(project),
      _validateStoreCompliance(project),
    ];
    
    var results = await Future.wait(tasks);
    return QualityResult.aggregate(results);
  }
}
```

### Failure Recovery

1. **Specification Errors**: Clear error messages with remediation steps
2. **Generation Failures**: Partial generation with clear gap identification
3. **Quality Gate Failures**: Detailed reports with fix recommendations
4. **Template Errors**: Fallback to minimal viable implementations

## Configuration Interface

### Builder Configuration

```yaml
# builders/config/flutter_builder.yaml
flutter_builder:
  target_sdk_version: "latest-stable"
  state_management: "provider"  # provider | riverpod | bloc
  architecture_pattern: "clean"  # clean | mvvm | mvc
  testing_framework: "flutter_test"
  
  dependencies:
    revenue_cat: "^6.0.0"
    firebase_analytics: "^10.0.0"
    provider: "^6.0.0"
    
  quality_gates:
    min_test_coverage: 80
    max_startup_time_ms: 3000
    accessibility_compliance: "WCAG_2_1_AA"
    
  templates:
    base_path: "templates/flutter"
    custom_overrides: "custom_templates/"
```

### Environment Configuration

```bash
# Builder environment variables
APPFACTORY_BUILDER_CONFIG=builders/config/flutter_builder.yaml
APPFACTORY_TEMPLATE_PATH=builders/templates/
APPFACTORY_QUALITY_GATES=strict
APPFACTORY_FLUTTER_SDK_PATH=/usr/local/flutter
```

## Extensibility Points

### Adding New Platform Builders

1. **Implement Builder Interface**
   ```dart
   class ReactNativeBuilder implements PlatformBuilder {
     @override
     Future<BuildResult> build(SpecificationSet specs) {
       // React Native-specific implementation
     }
   }
   ```

2. **Create Template Set**
   ```
   templates/react_native/
   ├── components/
   ├── screens/
   ├── services/
   └── navigation/
   ```

3. **Register Builder**
   ```dart
   // builders/registry.dart
   class BuilderRegistry {
     static final Map<String, PlatformBuilder> _builders = {
       'flutter': FlutterBuilder(),
       'react_native': ReactNativeBuilder(),
     };
   }
   ```

### Custom Template Overrides

Developers can override default templates:

```
custom_templates/flutter/
├── screens/
│   └── paywall_screen.dart.template  # Custom paywall design
├── services/
│   └── analytics_service.dart.template # Custom analytics
└── widgets/
    └── button.dart.template           # Custom button component
```

## Performance Considerations

### Generation Performance
- Template caching for repeated builds
- Incremental generation (only changed specs)
- Parallel file generation where possible
- Memory-efficient spec parsing

### Generated App Performance
- Lazy loading of non-critical features
- Efficient state management patterns
- Optimized asset bundling
- Performance monitoring integration

## Security Architecture

### Generated App Security
- Secure storage for authentication tokens
- API key management through environment variables
- Input validation for all user inputs
- HTTPS enforcement for network calls
- Certificate pinning for critical APIs

### Build Security
- Template sanitization
- Spec content validation
- No code injection vulnerabilities
- Secure temporary file handling

---

**Version**: 1.0  
**Last Updated**: 2026-01-06  
**Next Review**: Implementation completion