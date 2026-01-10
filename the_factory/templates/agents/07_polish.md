# Stage 07: Polish & Quality

## AGENT-NATIVE EXECUTION

You are Claude Code (Opus 4.5) operating under the execution identity defined in CLAUDE.md.

Create comprehensive quality and polish specifications based on current store requirements and quality standards.

## BUILD MODE VERIFICATION (CRITICAL)
Stage 07 can ONLY be executed via `build <IDEA_ID_OR_NAME>` command:
- Verify invocation came from build mode, not `run app factory`
- Require Stage 01-06 artifacts exist (hard-fail if missing)
- Assert this stage is building ONE SPECIFIC IDEA only
- Hard-fail if executed during batch idea generation

## STANDARDS CONTRACT (MANDATORY)
Read and comply with `standards/mobile_app_best_practices_2026.md`. Your output must include a "Standards Compliance Mapping" section demonstrating performance, accessibility, and quality implementation requirements.

## INPUTS
- Read: `runs/.../ideas/<idea_dir>/stages/stage06.json` (builder handoff)
- Read: `runs/.../ideas/<idea_dir>/stages/stage05.json` (technical architecture)
- Read: `runs/.../ideas/<idea_dir>/stages/stage04.json` (monetization strategy)
- Read: `runs/.../ideas/<idea_dir>/stages/stage03.json` (UX design)
- Read: `runs/.../ideas/<idea_dir>/stages/stage02.json` (product specification)
- Read: `runs/.../ideas/<idea_dir>/meta/idea.json` (canonical idea definition)
- Read: `runs/.../ideas/<idea_dir>/meta/boundary.json` (isolation enforcement)

## OUTPUTS
- Write: `runs/.../ideas/<idea_dir>/stages/stage07.json` (validated quality specification)
- Write: `runs/.../ideas/<idea_dir>/outputs/stage07_execution.md` (execution log with decisions)
- Write: `runs/.../ideas/<idea_dir>/outputs/stage07_research.md` (quality standards research)
- Render: `runs/.../ideas/<idea_dir>/spec/07_polish_quality.md` (specification markdown)
- Update: `runs/.../ideas/<idea_dir>/meta/stage_status.json` (progress tracking)

## FRESHNESS & SOURCES (MANDATORY WEB RESEARCH)
You MUST browse current sources for up-to-date quality and rejection prevention:

### Required Research Sources
**Quality Standards** (Must consult):
- **App Store Review Guidelines**: Latest review criteria and common rejection reasons
- **Google Play Policy Center**: Current quality guidelines and policy updates
- **Accessibility Guidelines**: WCAG 2.1 AA updates and mobile accessibility best practices
- **Performance Standards**: Current mobile app performance benchmarks and testing tools

### Research Focus Areas
1. **Store Rejection Patterns**: Most common reasons for app rejection in current review climate
2. **Performance Benchmarks**: Current user expectations for app performance and responsiveness
3. **Quality Assurance Standards**: Industry best practices for mobile app QA processes
4. **Accessibility Requirements**: Latest platform accessibility features and testing requirements
5. **User Experience Polish**: Current expectations for app fit and finish

### Citation Requirements
Document research in `stage07_research.md`:
- Store review guideline updates and common rejection reasons
- Performance benchmark data and testing methodologies
- Accessibility requirement interpretations and implementation approaches
- Quality assurance best practices and testing strategies

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
  "quality_polish": {
    "performance_optimization": {
      "startup_performance": {
        "target_metrics": {
          "cold_start_time": "string",
          "warm_start_time": "string", 
          "first_meaningful_paint": "string"
        },
        "optimization_strategies": ["string"],
        "measurement_approach": "string"
      },
      "runtime_performance": {
        "ui_responsiveness": {
          "target_fps": "60fps",
          "scroll_performance": "string",
          "animation_smoothness": "string"
        },
        "memory_management": {
          "peak_memory_limit": "string",
          "memory_leak_prevention": ["string"],
          "garbage_collection_optimization": "string"
        },
        "network_efficiency": {
          "request_optimization": "string",
          "caching_strategy": "string",
          "offline_behavior": "string"
        }
      }
    },
    "accessibility_implementation": {
      "screen_reader_support": {
        "voiceover_ios": {
          "element_labeling": "string",
          "navigation_order": "string",
          "custom_actions": ["string"]
        },
        "talkback_android": {
          "content_descriptions": "string", 
          "navigation_logic": "string",
          "live_regions": "string"
        }
      },
      "visual_accessibility": {
        "color_contrast": {
          "minimum_ratios": "4.5:1 normal, 3:1 large text",
          "validation_process": "string",
          "alternative_indicators": "string"
        },
        "text_scaling": {
          "dynamic_type_support": "up to 200% scaling",
          "layout_adaptation": "string",
          "readability_preservation": "string"
        }
      },
      "motor_accessibility": {
        "touch_targets": {
          "minimum_size": "44pt iOS, 48dp Android", 
          "spacing_requirements": "string",
          "alternative_inputs": "string"
        },
        "gesture_alternatives": {
          "voice_control": "string",
          "switch_control": "string",
          "assistive_touch": "string"
        }
      }
    },
    "user_experience_polish": {
      "interface_refinement": {
        "visual_consistency": {
          "design_system_adherence": "string",
          "component_standardization": "string",
          "brand_consistency": "string"
        },
        "interaction_feedback": {
          "haptic_feedback": "string",
          "visual_feedback": "string",
          "audio_feedback": "string"
        },
        "error_handling": {
          "graceful_degradation": "string",
          "user_friendly_messages": "string",
          "recovery_mechanisms": "string"
        }
      },
      "onboarding_polish": {
        "micro_interactions": {
          "screen_transitions": "string (smooth, theme-aligned animations)",
          "progress_indicators": "dots|bars|custom (clear progress visualization)",
          "button_feedback": "string (tap responses, loading states)",
          "illustration_animations": "string (subtle motion for engagement)"
        },
        "visual_consistency": {
          "theme_alignment": "string (onboarding feels like part of the app)",
          "typography_hierarchy": "string (clear reading flow)",
          "color_usage": "string (consistent with app palette)"
        },
        "transition_to_core_app": {
          "completion_animation": "string (satisfying finish moment)",
          "navigation_handoff": "string (clear path to main experience)",
          "state_persistence": "string (remember onboarding completed)"
        }
      },
      "soft_paywall_polish": {
        "visual_hierarchy": {
          "value_proposition_prominence": "string (benefits clearly visible)",
          "pricing_clarity": "string (transparent, no hidden costs)",
          "cta_design": "string (attractive but not aggressive)"
        },
        "trust_cues": {
          "app_store_compliant_language": "string (auto-renew disclosure, cancel terms)",
          "trial_messaging": "string (clear trial duration, what happens after)",
          "restore_purchases_visibility": "string (easily accessible)"
        },
        "micro_interactions": {
          "plan_selection_feedback": "string (clear selected state)",
          "purchase_loading": "string (appropriate loading indicator)",
          "success_celebration": "string (positive feedback on upgrade)"
        },
        "dismiss_experience": {
          "close_button_visibility": "string (clear, not hidden)",
          "dismiss_animation": "string (smooth, no guilt)",
          "return_to_app": "string (seamless continuation)"
        }
      },
      "review_prompt_polish": {
        "timing_refinement": {
          "post_onboarding_delay": "string (moment after onboarding, not immediate)",
          "positive_moment_detection": "string (trigger after user success)",
          "interruption_avoidance": "string (never during active task)"
        },
        "visual_presentation": {
          "style": "modal|toast|inline (matches app aesthetic)",
          "animation": "string (smooth appearance, not jarring)",
          "theme_consistency": "string (uses app colors and typography)"
        },
        "copy_polish": {
          "request_tone": "grateful|appreciative (never demanding)",
          "explanation_clarity": "string (why review helps the app)",
          "app_store_compliance": "string (follows platform review guidelines)"
        },
        "dismissal_behavior": {
          "close_action": "string (easy, no guilt)",
          "no_penalty": "string (app continues normally)",
          "reminder_policy": "string (respect user choice, don't nag)"
        }
      },
      "content_quality": {
        "copywriting": {
          "tone_consistency": "string",
          "clarity_standards": "string",
          "localization_readiness": "string"
        },
        "visual_assets": {
          "image_optimization": "string",
          "icon_consistency": "string",
          "illustration_standards": "string"
        }
      }
    },
    "testing_validation": {
      "automated_testing": {
        "unit_test_coverage": {
          "target_percentage": "string",
          "critical_components": ["string"],
          "testing_framework": "string"
        },
        "integration_testing": {
          "api_integration": "string",
          "subscription_flows": "string",
          "data_persistence": "string"
        },
        "ui_testing": {
          "critical_user_flows": ["string"],
          "accessibility_testing": "string",
          "cross_device_validation": "string"
        }
      },
      "manual_testing": {
        "device_matrix": {
          "ios_devices": ["string"],
          "android_devices": ["string"],
          "os_versions": ["string"]
        },
        "scenario_testing": {
          "edge_cases": ["string"],
          "error_conditions": ["string"],
          "network_conditions": ["string"]
        }
      }
    },
    "store_readiness": {
      "submission_requirements": {
        "ios_app_store": {
          "metadata_completeness": ["string"],
          "screenshot_requirements": "string",
          "privacy_compliance": "string",
          "content_rating": "string"
        },
        "google_play": {
          "store_listing_optimization": "string",
          "content_policy_compliance": "string",
          "target_api_level": "string",
          "app_bundle_requirements": "string"
        }
      },
      "quality_gates": {
        "performance_validation": ["string"],
        "accessibility_validation": ["string"],
        "subscription_validation": ["string"],
        "content_review": ["string"],
        "revenuecat_integration_validation": {
          "hard_gate_checklist": [
            "SDK properly installed and configured",
            "Initialization with environment keys verified",
            "Entitlement model consistently implemented",
            "Paywall accessible from required locations",
            "Purchase and restore flows functional",
            "Premium features properly gated",
            "Debug confirmation working",
            "Empty offerings handled gracefully"
          ],
          "testing_scenarios": [
            "Purchase flow with successful payment",
            "Purchase flow with user cancellation",
            "Restore purchases for existing subscriber",
            "Feature access with active entitlement",
            "Feature blocking without entitlement",
            "Empty offerings error handling"
          ],
          "failure_criteria": "Missing any hard gate requirement causes build failure"
        }
      }
    }
  }
}
```

## EXECUTION STEPS

### Phase 1: Quality Standards Research
1. Read all previous stage specifications to understand complete quality requirements
2. Research current store review guidelines and common rejection reasons
3. Analyze accessibility standards and platform-specific implementation requirements
4. Review performance benchmarks and optimization best practices

### Phase 2: Performance Optimization Planning
5. Define performance targets based on user expectations and platform standards
6. Plan startup optimization strategies for cold and warm app launches
7. Specify runtime performance requirements for UI responsiveness and memory usage
8. Design network efficiency and offline behavior optimization

### Phase 3: Accessibility Implementation
9. Plan comprehensive screen reader support for both iOS and Android
10. Define visual accessibility requirements including contrast and text scaling
11. Specify motor accessibility features and alternative input methods
12. Create accessibility testing and validation procedures

### Phase 4: User Experience Polish
13. Define interface refinement standards for visual consistency and interaction feedback
14. Plan content quality standards for copywriting and visual assets
15. Specify error handling and graceful degradation patterns
16. Design user feedback and satisfaction measurement approaches

### Phase 4.5: Onboarding, Paywall & Review Prompt Polish (MANDATORY)

**Onboarding Polish**:
17. **Design Micro-Interactions**: Screen transitions, progress indicators, button feedback
18. **Ensure Visual Consistency**: Theme alignment, typography hierarchy, color usage
19. **Polish Core-App Transition**: Completion animation, navigation handoff, state persistence

**Soft Paywall Polish**:
20. **Refine Visual Hierarchy**: Value proposition prominence, pricing clarity, CTA design
21. **Add Trust Cues**: App Store compliant language, trial messaging, restore visibility
22. **Design Micro-Interactions**: Plan selection feedback, purchase loading, success celebration
23. **Perfect Dismiss Experience**: Clear close button, smooth dismiss, seamless return

**Review Prompt Polish**:
24. **Refine Timing**: Post-onboarding delay, positive moment detection, interruption avoidance
25. **Design Visual Presentation**: Style, animation, theme consistency
26. **Polish Copy**: Grateful tone, clear explanation, App Store compliance
27. **Perfect Dismissal**: Easy close, no penalty, respectful reminder policy

### Phase 5: Testing & Validation Strategy
17. Plan comprehensive automated testing coverage for critical components
18. Define manual testing matrix covering devices, scenarios, and edge cases
19. Specify store submission requirements and quality gates
20. Create quality validation checklists and measurement criteria

### Phase 6: Documentation & Delivery
21. Validate quality specifications against all previous stage requirements
22. Ensure compliance with store submission and accessibility standards
23. Write JSON with complete quality and polish specification
24. Document research influence on quality decisions
25. Render human-readable quality specification

## STANDARDS COMPLIANCE MAPPING

### Performance Standards (MANDATORY)
- **Requirement**: <3 seconds to first interactive screen, 60fps UI, efficient memory/battery
- **Implementation**: Performance targets with measurement approaches and optimization strategies
- **Validation**: Performance testing procedures covering startup, runtime, and efficiency metrics

### Accessibility Standards (MANDATORY)
- **Requirement**: WCAG 2.1 AA compliance, screen reader support, motor accessibility
- **Implementation**: Comprehensive accessibility features with platform-specific implementations
- **Validation**: Accessibility testing procedures covering all interaction methods and user needs

### Store Quality Requirements
- **Requirement**: Meet all App Store and Google Play quality guidelines
- **Implementation**: Quality gates addressing all submission requirements and common rejection reasons
- **Validation**: Store readiness checklists with validation procedures

### Testing Standards
- **Requirement**: Unit tests, integration tests, accessibility testing, device matrix testing
- **Implementation**: Comprehensive testing strategy covering automated and manual validation
- **Validation**: Testing procedures ensure quality across all supported devices and scenarios

## SUCCESS CRITERIA
Stage 07 is complete when:
- [ ] `stage07.json` exists and validates against schema
- [ ] `stage07_research.md` documents quality standards and store requirements research
- [ ] Performance optimization targets defined with measurement and achievement strategies
- [ ] Accessibility implementation covers all WCAG 2.1 AA requirements with platform-specific features
- [ ] Testing strategy ensures comprehensive validation across devices and scenarios
- [ ] Store readiness requirements address all submission guidelines and quality standards
- [ ] **Onboarding polish defined** (micro-interactions, transitions, visual consistency)
- [ ] **Soft paywall polish defined** (visual hierarchy, trust cues, dismiss experience)
- [ ] **Review prompt polish defined** (timing, presentation, copy, dismissal)
- [ ] **All polish elements use App Store compliant language**

## HARD FAILURE CONDITIONS
- Schema validation failure → Write `stage07_failure.md` and stop
- Missing quality standards research → Write `stage07_failure.md` and stop
- Performance targets unrealistic or insufficient → Write `stage07_failure.md` and stop
- Accessibility requirements not comprehensively addressed → Write `stage07_failure.md` and stop
- Testing strategy insufficient for store submission → Write `stage07_failure.md` and stop
- **RevenueCat integration incomplete** → Write `stage07_failure.md` and stop
- **Missing onboarding polish specifications** → Write `stage07_failure.md` and stop
- **Missing soft paywall polish specifications** → Write `stage07_failure.md` and stop
- **Missing review prompt polish specifications** → Write `stage07_failure.md` and stop
- **Paywall or review prompt uses non-compliant language** → Write `stage07_failure.md` and stop
- Boundary violation (reading from wrong idea pack) → Write `stage07_failure.md` and stop

## RevenueCat Integration — Build Failure Gate (MANDATORY)

**This stage MUST verify all RevenueCat hard gate requirements are met. Build completion is NOT allowed without:**

1. **SDK Integration Verified**: react-native-purchases + react-native-purchases-ui properly installed
2. **Configuration Complete**: Initialization code with environment key handling 
3. **Paywall Functional**: Accessible paywall screen with offerings display
4. **Purchase Flows Working**: Purchase and restore functionality implemented
5. **Feature Gating Active**: Premium features properly gated behind entitlements
6. **Error Handling Present**: Empty offerings and purchase error handling
7. **Debug Visibility**: Debug confirmation of SDK state and functionality

**If ANY requirement is missing, Stage 07 must FAIL with detailed explanation of what needs to be implemented.**

DO NOT output JSON in chat. Write all artifacts to disk and continue with Stage 08.