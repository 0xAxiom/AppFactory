# Stage 06: Builder Handoff

## AGENT-NATIVE EXECUTION
You are Claude executing Stage 06 for a SPECIFIC IDEA PACK. Create comprehensive builder handoff specifications based on current development workflow expectations.

## BUILD MODE VERIFICATION (CRITICAL)
Stage 06 can ONLY be executed via `build <IDEA_ID_OR_NAME>` command:
- Verify invocation came from build mode, not `run app factory`
- Require Stage 01-05 artifacts exist (hard-fail if missing)
- Assert this stage is building ONE SPECIFIC IDEA only
- Hard-fail if executed during batch idea generation

## STANDARDS CONTRACT (MANDATORY)
Read and comply with `standards/mobile_app_best_practices_2026.md`. Your output must include a "Standards Compliance Mapping" section demonstrating testing, release readiness, and development workflow requirements.

## INPUTS
- Read: `runs/.../ideas/<idea_dir>/stages/stage05.json` (technical architecture)
- Read: `runs/.../ideas/<idea_dir>/stages/stage04.json` (monetization strategy)
- Read: `runs/.../ideas/<idea_dir>/stages/stage03.json` (UX design)
- Read: `runs/.../ideas/<idea_dir>/stages/stage02.json` (product specification)
- Read: `runs/.../ideas/<idea_dir>/meta/idea.json` (canonical idea definition)
- Read: `runs/.../ideas/<idea_dir>/meta/boundary.json` (isolation enforcement)

## OUTPUTS
- Write: `runs/.../ideas/<idea_dir>/stages/stage06.json` (validated builder handoff)
- Write: `runs/.../ideas/<idea_dir>/outputs/stage06_execution.md` (execution log with decisions)
- Write: `runs/.../ideas/<idea_dir>/outputs/stage06_research.md` (development workflow research)
- Render: `runs/.../ideas/<idea_dir>/spec/06_builder_handoff.md` (specification markdown)
- Update: `runs/.../ideas/<idea_dir>/meta/stage_status.json` (progress tracking)

## FRESHNESS & SOURCES (MANDATORY WEB RESEARCH)
You MUST browse current sources to ensure realistic development workflow expectations:

### Required Research Sources
**Development Best Practices** (Must consult):
- **Expo Development Build**: Latest workflow and tooling recommendations
- **React Native Testing**: Current testing framework recommendations and patterns
- **App Store Connect/Google Play**: Latest submission requirements and review guidelines
- **CI/CD Best Practices**: Current automated testing and deployment patterns for React Native

### Research Focus Areas
1. **Development Workflow**: Current Expo and React Native development environment setup
2. **Testing Standards**: What level of testing is expected for store submission
3. **Quality Assurance**: Current QA practices for mobile app development
4. **Store Submission**: Latest requirements and common rejection reasons
5. **Performance Testing**: Current tools and practices for mobile app performance validation

### Citation Requirements
Document research in `stage06_research.md`:
- Development workflow best practices with sources
- Testing requirement standards and rationale
- Store submission requirements and recent changes
- Quality assurance practices and tooling recommendations

## BOUNDARY ENFORCEMENT
This stage must ONLY read from:
- Current idea pack: `runs/.../ideas/<idea_dir>/`
- Global standards: `standards/mobile_app_best_practices_2026.md`

## JSON SCHEMA

```json
{
  "meta": {
    "run_id": "string",
    "idea_id": "string", 
    "idea_name": "string",
    "idea_dir": "string",
    "source_root": "string",
    "input_stage_paths": ["array of files read"],
    "boundary_path": "string"
  },
  "builder_handoff": {
    "implementation_priorities": {
      "phase_1_mvp": {
        "features": ["string"],
        "acceptance_criteria": ["string"],
        "estimated_effort": "string",
        "critical_dependencies": ["string"]
      },
      "phase_2_enhancement": {
        "features": ["string"],
        "rationale": "string",
        "success_metrics": ["string"]
      }
    },
    "technical_requirements": {
      "development_environment": {
        "node_version": "string",
        "expo_cli_version": "string",
        "required_tools": ["string"],
        "setup_instructions": ["string"]
      },
      "dependency_management": {
        "package_manager": "npm|yarn|pnpm",
        "critical_dependencies": ["string"],
        "version_constraints": ["string"]
      },
      "build_configuration": {
        "eas_config": "string",
        "environment_variables": ["string"],
        "build_profiles": ["string"]
      }
    },
    "quality_requirements": {
      "testing_strategy": {
        "unit_test_coverage": "string",
        "critical_user_flows": ["string"],
        "testing_framework": "string",
        "test_environment_setup": "string"
      },
      "performance_criteria": {
        "app_startup_time": "string",
        "memory_usage_limits": "string",
        "network_efficiency": "string",
        "battery_impact": "string"
      },
      "accessibility_validation": {
        "screen_reader_testing": "string",
        "keyboard_navigation": "string",
        "color_contrast_validation": "string",
        "dynamic_type_testing": "string"
      }
    },
    "deployment_specification": {
      "development_builds": {
        "testing_process": "string",
        "stakeholder_review": "string",
        "feedback_integration": "string"
      },
      "store_preparation": {
        "ios_requirements": {
          "app_store_connect_setup": "string",
          "submission_checklist": ["string"],
          "review_preparation": "string"
        },
        "android_requirements": {
          "play_console_setup": "string",
          "submission_checklist": ["string"],
          "review_preparation": "string"
        }
      },
      "monitoring_setup": {
        "analytics_configuration": "string",
        "crash_reporting": "string",
        "performance_monitoring": "string"
      }
    },
    "documentation_requirements": {
      "technical_documentation": {
        "architecture_overview": "string",
        "api_documentation": "string",
        "setup_guide": "string"
      },
      "user_documentation": {
        "feature_documentation": "string",
        "troubleshooting_guide": "string",
        "privacy_policy": "string",
        "terms_of_service": "string"
      }
    },
    "maintenance_planning": {
      "update_strategy": {
        "ota_updates": "string", 
        "binary_updates": "string",
        "version_planning": "string"
      },
      "monitoring_alerts": {
        "error_thresholds": "string",
        "performance_degradation": "string",
        "subscription_issues": "string"
      },
      "support_preparation": {
        "user_support_channels": "string",
        "escalation_procedures": "string",
        "known_issues_tracking": "string"
      }
    }
  }
}
```

## EXECUTION STEPS

### Phase 1: Requirements Analysis
1. Read all previous stage specifications to understand complete app requirements
2. Research current development workflow and tooling best practices
3. Analyze complexity and estimate implementation phases
4. Review testing and quality assurance standards

### Phase 2: Implementation Planning
5. Define MVP phase with critical features and acceptance criteria
6. Plan enhancement phases with prioritized feature additions
7. Specify technical requirements and development environment setup
8. Define quality gates and testing requirements

### Phase 3: Deployment & Operations Planning
9. Plan development build and testing workflow
10. Specify store submission requirements and preparation steps
11. Design monitoring and analytics implementation
12. Plan maintenance and update strategy

### Phase 4: Documentation & Support Planning
13. Define required technical and user documentation
14. Plan support channels and escalation procedures
15. Specify monitoring alerts and performance thresholds
16. Create handoff documentation structure

### Phase 5: Validation & Delivery
17. Validate handoff completeness against all stage requirements
18. Ensure compliance with development and submission standards
19. Write JSON with complete builder handoff specification
20. Document research influence on workflow decisions
21. Render human-readable handoff specification

## STANDARDS COMPLIANCE MAPPING

### Testing & Release Readiness (MANDATORY)
- **Requirement**: Unit tests for business logic, integration tests, accessibility testing
- **Implementation**: Jest for unit tests, Detox for E2E, accessibility testing protocols
- **Validation**: Testing strategy covers critical user flows and subscription functionality

### Quality Assurance Standards
- **Requirement**: Minimum 5 device/OS combinations, restore purchases testing, beta testing
- **Implementation**: Device matrix testing plan, subscription flow validation, TestFlight/Internal Testing
- **Validation**: QA process documented with specific testing scenarios

### Store Submission Requirements
- **Requirement**: Store assets complete, privacy labels verified, analytics live
- **Implementation**: Asset preparation checklists, privacy compliance documentation, monitoring setup
- **Validation**: Submission readiness checklist with all required components

### RevenueCat Integration — Hard Gate (MANDATORY)
- **Requirement**: Complete RevenueCat integration as specified in Stage 04 monetization strategy
- **Implementation**: SDK properly configured, paywall functional, restore purchases working, feature gating active
- **Validation**: All 6 RevenueCat hard gate criteria verified from Stage 04 template

**RevenueCat Build Verification Checklist**:
- [ ] SDK Installed + Configured (react-native-purchases + react-native-purchases-ui)
- [ ] Initialization with environment keys (placeholders with DEV warning if missing)
- [ ] Entitlement model defined and consistently used
- [ ] Paywall screen exists and accessible from onboarding/settings
- [ ] Purchase + restore flows implemented per RevenueCat docs
- [ ] At least one premium feature gated behind entitlement
- [ ] Debug confirmation of offerings/entitlement state
- [ ] Empty offerings handled with troubleshooting guidance

### Subscription Implementation Testing
- **Requirement**: RevenueCat integration tested, purchase flows validated, entitlement handling verified
- **Implementation**: Comprehensive subscription testing including edge cases and error scenarios
- **Validation**: Subscription functionality testing covers all monetization requirements

## SUCCESS CRITERIA
Stage 06 is complete when:
- [ ] `stage06.json` exists and validates against schema
- [ ] `stage06_research.md` documents development workflow research
- [ ] Implementation phases clearly defined with realistic effort estimates
- [ ] Quality requirements address all testing and accessibility standards
- [ ] Store submission preparation addresses both iOS and Android requirements
- [ ] Maintenance planning includes monitoring, updates, and support strategies

## HARD FAILURE CONDITIONS
- Schema validation failure → Write `stage06_failure.md` and stop
- Missing development workflow research → Write `stage06_failure.md` and stop
- Quality requirements insufficient for store submission → Write `stage06_failure.md` and stop
- Implementation plan unrealistic for specified architecture → Write `stage06_failure.md` and stop
- Boundary violation (reading from wrong idea pack) → Write `stage06_failure.md` and stop

DO NOT output JSON in chat. Write all artifacts to disk and continue with Stage 07.