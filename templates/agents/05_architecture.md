# Stage 05: Technical Architecture

## AGENT-NATIVE EXECUTION
You are Claude executing Stage 05 for a SPECIFIC IDEA PACK. Design comprehensive technical architecture based on current React Native and Expo best practices.

## BUILD MODE VERIFICATION (CRITICAL)
Stage 05 can ONLY be executed via `build <IDEA_ID_OR_NAME>` command:
- Verify invocation came from build mode, not `run app factory`
- Require Stage 01-04 artifacts exist (hard-fail if missing)
- Assert this stage is building ONE SPECIFIC IDEA only
- Hard-fail if executed during batch idea generation

## STANDARDS CONTRACT (MANDATORY)
Read and comply with `standards/mobile_app_best_practices_2026.md`. Your output must include a "Standards Compliance Mapping" section demonstrating security, performance, and technical implementation requirements.

## INPUTS
- Read: `runs/.../ideas/<idea_dir>/stages/stage04.json` (monetization strategy)
- Read: `runs/.../ideas/<idea_dir>/stages/stage03.json` (UX design)
- Read: `runs/.../ideas/<idea_dir>/stages/stage02.json` (product specification)
- Read: `runs/.../ideas/<idea_dir>/meta/idea.json` (canonical idea definition)
- Read: `runs/.../ideas/<idea_dir>/meta/boundary.json` (isolation enforcement)

## OUTPUTS
- Write: `runs/.../ideas/<idea_dir>/stages/stage05.json` (validated technical architecture)
- Write: `runs/.../ideas/<idea_dir>/outputs/stage05_execution.md` (execution log with decisions)
- Write: `runs/.../ideas/<idea_dir>/outputs/stage05_research.md` (technical research citations)
- Render: `runs/.../ideas/<idea_dir>/spec/05_architecture.md` (specification markdown)
- Update: `runs/.../ideas/<idea_dir>/meta/stage_status.json` (progress tracking)

## FRESHNESS & SOURCES (MANDATORY WEB RESEARCH)
You MUST browse current sources to avoid deprecated technical patterns:

### Required Research Sources
**Framework Documentation** (Must consult):
- **Expo SDK Documentation**: Latest stable version capabilities and limitations
- **React Native Documentation**: Current best practices and performance recommendations
- **Expo Router Documentation**: Latest file-based routing patterns and implementation
- **RevenueCat Documentation**: Current React Native SDK integration patterns

### Research Focus Areas
1. **Framework Versions**: Latest stable Expo SDK and React Native versions
2. **State Management**: Current recommendations for app complexity level
3. **Data Persistence**: Best practices for offline-first architecture
4. **Security Implementation**: Current encryption and secure storage patterns
5. **Performance Optimization**: Latest React Native performance best practices
6. **Platform Integration**: Current iOS and Android platform capability access

### Citation Requirements
Document research in `stage05_research.md`:
- Framework version decisions with rationale
- Architecture pattern choices based on current best practices
- Security implementation approaches from official documentation
- Performance optimization strategies and their applicability

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
  "technical_architecture": {
    "technology_stack": {
      "framework": {
        "react_native_version": "string",
        "expo_sdk_version": "string",
        "rationale": "string"
      },
      "navigation": {
        "library": "expo-router",
        "version": "string",
        "routing_strategy": "string"
      },
      "state_management": {
        "approach": "context|redux|zustand",
        "rationale": "string",
        "data_flow_pattern": "string"
      },
      "ui_library": {
        "primary": "string",
        "components": ["string"],
        "customization_approach": "string"
      }
    },
    "data_architecture": {
      "local_storage": {
        "primary": "async_storage|expo_sqlite|mmkv",
        "rationale": "string",
        "data_structure": "string"
      },
      "cloud_sync": {
        "approach": "firebase|supabase|custom",
        "rationale": "string",
        "sync_strategy": "string"
      },
      "offline_capability": {
        "strategy": "string",
        "cached_data": ["string"],
        "conflict_resolution": "string"
      }
    },
    "subscription_integration": {
      "revenuecat_sdk": {
        "version": "string",
        "configuration": "string",
        "entitlement_handling": "string"
      },
      "purchase_flow": {
        "presentation": "string",
        "restoration": "string",
        "error_handling": "string"
      }
    },
    "security_privacy": {
      "data_encryption": {
        "at_rest": "string",
        "in_transit": "string",
        "key_management": "string"
      },
      "privacy_compliance": {
        "data_minimization": "string",
        "user_consent": "string",
        "data_export": "string"
      },
      "api_security": {
        "authentication": "string",
        "authorization": "string",
        "rate_limiting": "string"
      }
    },
    "performance_optimization": {
      "app_startup": {
        "target_time": "string",
        "optimization_strategies": ["string"]
      },
      "memory_management": {
        "image_optimization": "string",
        "component_lifecycle": "string",
        "memory_leaks_prevention": "string"
      },
      "network_optimization": {
        "caching_strategy": "string",
        "request_batching": "string",
        "offline_queue": "string"
      }
    },
    "platform_integrations": {
      "ios_specific": {
        "features": ["string"],
        "apis_used": ["string"],
        "permissions": ["string"]
      },
      "android_specific": {
        "features": ["string"],
        "apis_used": ["string"],
        "permissions": ["string"]
      },
      "cross_platform": {
        "shared_features": ["string"],
        "platform_abstractions": ["string"]
      }
    },
    "development_workflow": {
      "build_system": "eas_build",
      "testing_strategy": {
        "unit_tests": "string",
        "integration_tests": "string",
        "e2e_tests": "string"
      },
      "deployment": {
        "staging": "string",
        "production": "string",
        "rollback_strategy": "string"
      }
    }
  }
}
```

## EXECUTION STEPS

### Phase 1: Research & Framework Analysis
1. Read previous stage specifications to understand technical requirements
2. Research latest Expo SDK and React Native versions for stability and features
3. Analyze state management needs based on app complexity
4. Review RevenueCat SDK documentation for subscription integration

### Phase 2: Architecture Design
5. Select technology stack based on product requirements and current best practices
6. Design data architecture supporting offline-first usage patterns
7. Plan subscription integration with RevenueCat following current best practices
8. Specify security and privacy implementation approaches

### Phase 3: Performance & Platform Planning
9. Define performance targets and optimization strategies
10. Plan platform-specific integrations and capabilities
11. Design development workflow with testing and deployment strategy
12. Specify monitoring and analytics implementation

### Phase 4: Validation & Documentation  
13. Validate architecture against product and UX requirements
14. Ensure compliance with security and privacy standards
15. Write JSON with complete technical architecture
16. Document research influence on technical decisions
17. Render human-readable architecture specification

## STANDARDS COMPLIANCE MAPPING

### Security & Privacy (MANDATORY)
- **Requirement**: HTTPS, secure storage, no hardcoded secrets, input validation
- **Implementation**: TLS for all traffic, Expo SecureStore for sensitive data, environment variables for API keys
- **Validation**: Security architecture documented with specific implementation approaches

### Performance Standards
- **Requirement**: <3 seconds to first interactive screen, 60fps UI, efficient memory/battery usage
- **Implementation**: Startup optimization strategies, memory management patterns, performance monitoring
- **Validation**: Performance targets specified with measurement approaches

### Subscription Technical Requirements
- **Requirement**: RevenueCat integration, entitlement-based access, restore purchases
- **Implementation**: React Native Purchases SDK integration with entitlement checking
- **Validation**: Complete subscription flow architecture documented

### Platform Compliance
- **Requirement**: Follow iOS and Android technical guidelines, proper permission handling
- **Implementation**: Platform-appropriate APIs, permission request flows, capability declarations
- **Validation**: Platform-specific requirements addressed in architecture

## SUCCESS CRITERIA
Stage 05 is complete when:
- [ ] `stage05.json` exists and validates against schema
- [ ] `stage05_research.md` documents framework and best practice research
- [ ] Technology stack selections based on current stable versions
- [ ] Architecture supports offline-first usage and subscription monetization
- [ ] Security and privacy requirements addressed with specific implementations
- [ ] Performance targets defined with optimization strategies

## HARD FAILURE CONDITIONS
- Schema validation failure → Write `stage05_failure.md` and stop
- Missing framework research → Write `stage05_failure.md` and stop
- Architecture incompatible with subscription requirements → Write `stage05_failure.md` and stop
- Security requirements not addressed → Write `stage05_failure.md` and stop
- Boundary violation (reading from wrong idea pack) → Write `stage05_failure.md` and stop

DO NOT output JSON in chat. Write all artifacts to disk and continue with Stage 06.