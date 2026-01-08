# Stage 08: Brand Identity

## AGENT-NATIVE EXECUTION
You are Claude executing Stage 08 for a SPECIFIC IDEA PACK. Create comprehensive brand identity specifications based on current naming trends and positioning strategies.

## BUILD MODE VERIFICATION (CRITICAL)
Stage 08 can ONLY be executed via `build <IDEA_ID_OR_NAME>` command:
- Verify invocation came from build mode, not `run app factory`
- Require Stage 01-07 artifacts exist (hard-fail if missing)
- Assert this stage is building ONE SPECIFIC IDEA only
- Hard-fail if executed during batch idea generation

## STANDARDS CONTRACT (MANDATORY)
Read and comply with `standards/mobile_app_best_practices_2026.md`. Your output must include a "Standards Compliance Mapping" section demonstrating brand compliance with store requirements and user expectations.

## INPUTS
- Read: `runs/.../ideas/<idea_dir>/stages/stage07.json` (quality and polish)
- Read: `runs/.../ideas/<idea_dir>/stages/stage06.json` (builder handoff)
- Read: `runs/.../ideas/<idea_dir>/stages/stage05.json` (technical architecture)
- Read: `runs/.../ideas/<idea_dir>/stages/stage04.json` (monetization strategy)
- Read: `runs/.../ideas/<idea_dir>/stages/stage03.json` (UX design)
- Read: `runs/.../ideas/<idea_dir>/stages/stage02.json` (product specification)
- Read: `runs/.../ideas/<idea_dir>/meta/idea.json` (canonical idea definition)
- Read: `runs/.../ideas/<idea_dir>/meta/boundary.json` (isolation enforcement)

## OUTPUTS
- Write: `runs/.../ideas/<idea_dir>/stages/stage08.json` (validated brand identity)
- Write: `runs/.../ideas/<idea_dir>/outputs/stage08_execution.md` (execution log with decisions)
- Write: `runs/.../ideas/<idea_dir>/outputs/stage08_research.md` (brand research citations)
- Render: `runs/.../ideas/<idea_dir>/spec/08_brand_identity.md` (specification markdown)
- Update: `runs/.../ideas/<idea_dir>/meta/stage_status.json` (progress tracking)

## FRESHNESS & SOURCES (MANDATORY WEB RESEARCH)
You MUST browse current sources to understand contemporary brand and naming patterns:

### Required Research Sources
**Brand Intelligence** (Must consult):
- **App Store Trends**: Current naming conventions and brand positioning in target category
- **Google Play Trends**: Popular app naming patterns and brand differentiation strategies
- **Brand Positioning**: How successful apps in category communicate value and differentiation
- **Visual Trends**: Current design trends in app icons, colors, and visual identity

### Research Focus Areas
1. **Naming Patterns**: Current trends in app naming for the specific category and target audience
2. **Visual Identity Trends**: Contemporary color palettes, typography, and iconography in mobile apps
3. **Brand Voice Standards**: How successful apps communicate with users through copy and messaging
4. **Competitive Differentiation**: How similar apps position themselves and create unique brand identities
5. **Cultural Sensitivity**: Current awareness around inclusive and culturally sensitive branding

### Citation Requirements
Document research in `stage08_research.md`:
- App naming trend analysis with specific examples
- Visual identity trend research with contemporary references
- Brand positioning analysis of successful category competitors
- Cultural and accessibility considerations in current branding practices

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
  "brand_identity": {
    "brand_strategy": {
      "brand_name": {
        "final_name": "string",
        "rationale": "string",
        "alternatives_considered": ["string"],
        "trademark_considerations": "string"
      },
      "brand_positioning": {
        "value_proposition": "string",
        "differentiation_strategy": "string",
        "target_audience_alignment": "string",
        "competitive_distinction": "string"
      },
      "brand_personality": {
        "core_attributes": ["string"],
        "tone_of_voice": "string",
        "communication_style": "string",
        "emotional_appeal": "string"
      }
    },
    "visual_identity": {
      "logo_concept": {
        "design_direction": "string",
        "symbol_meaning": "string",
        "scalability_considerations": "string",
        "platform_adaptations": "string"
      },
      "color_palette": {
        "primary_colors": [
          {
            "color_name": "string",
            "hex_value": "string",
            "usage": "string",
            "accessibility_rating": "string"
          }
        ],
        "secondary_colors": [
          {
            "color_name": "string", 
            "hex_value": "string",
            "usage": "string"
          }
        ],
        "color_strategy": "string"
      },
      "typography": {
        "primary_typeface": {
          "font_family": "string",
          "weights_used": ["string"],
          "rationale": "string"
        },
        "secondary_typeface": {
          "font_family": "string",
          "usage": "string"
        },
        "hierarchy_system": "string"
      },
      "iconography_style": {
        "icon_approach": "string",
        "style_characteristics": ["string"],
        "consistency_guidelines": "string"
      }
    },
    "brand_applications": {
      "app_icon": {
        "concept": "string",
        "design_elements": ["string"],
        "platform_variations": "string",
        "size_adaptations": "string"
      },
      "in_app_branding": {
        "header_treatment": "string",
        "button_styling": "string",
        "card_design": "string",
        "illustration_style": "string"
      },
      "store_presence": {
        "app_store_presentation": "string",
        "screenshot_branding": "string",
        "promotional_graphics": "string"
      }
    },
    "messaging_framework": {
      "core_messages": {
        "primary_tagline": "string",
        "value_statements": ["string"],
        "feature_descriptions": ["string"]
      },
      "content_voice": {
        "writing_style": "string",
        "vocabulary_guidelines": "string",
        "accessibility_language": "string"
      },
      "marketing_messages": {
        "app_store_description": "string",
        "social_media_voice": "string",
        "user_communication": "string"
      }
    },
    "brand_guidelines": {
      "usage_standards": {
        "logo_usage_rules": ["string"],
        "color_usage_guidelines": ["string"],
        "typography_standards": ["string"]
      },
      "accessibility_compliance": {
        "color_contrast_standards": "string",
        "text_readability": "string",
        "inclusive_language": "string"
      },
      "consistency_maintenance": {
        "brand_audit_criteria": ["string"],
        "update_procedures": "string",
        "quality_control": "string"
      }
    }
  }
}
```

## EXECUTION STEPS

### Phase 1: Brand Research & Analysis
1. Read all previous stage specifications to understand brand requirements
2. Research current app naming trends and positioning strategies in target category
3. Analyze competitive brand landscape and differentiation opportunities
4. Review visual identity trends and accessibility requirements

### Phase 2: Brand Strategy Development
5. Develop brand name with rationale based on research and positioning needs
6. Define brand positioning strategy that differentiates from competition
7. Establish brand personality and communication style aligned with target users
8. Create value proposition messaging that supports subscription model

### Phase 3: Visual Identity Design
9. Design logo concept that works across all platform requirements
10. Develop color palette that meets accessibility standards and brand goals
11. Select typography system that supports hierarchical information design
12. Define iconography style consistent with brand personality

### Phase 4: Brand Applications
13. Design app icon concept that stands out in crowded app stores
14. Plan in-app branding integration that enhances user experience
15. Specify store presence strategy for App Store and Google Play optimization
16. Create messaging framework for all user touchpoints

### Phase 5: Brand Guidelines & Standards
17. Define usage standards that ensure brand consistency across implementations
18. Ensure accessibility compliance in all brand applications
19. Create brand maintenance procedures for ongoing consistency
20. Validate brand identity against all previous stage requirements

### Phase 6: Documentation & Delivery
21. Write JSON with complete brand identity specification
22. Document research influence on brand decisions
23. Render human-readable brand identity specification
24. Update stage status with completion information

## STANDARDS COMPLIANCE MAPPING

### Design System Compliance (MANDATORY)
- **Requirement**: Material 3 baseline with iOS adaptations, consistent typography, semantic colors
- **Implementation**: Brand system aligned with platform design standards while maintaining unique identity
- **Validation**: Color palette and typography choices work within platform design systems

### Accessibility Standards
- **Requirement**: Contrast ≥4.5:1, text scaling support, inclusive design principles
- **Implementation**: All brand colors tested for accessibility compliance, inclusive language guidelines
- **Validation**: Brand applications work with accessibility features and assistive technologies

### Store Compliance
- **Requirement**: Brand presentation meets App Store and Google Play guidelines
- **Implementation**: App icon and store presence designed for platform requirements
- **Validation**: Brand applications comply with store submission guidelines

### Internationalization Readiness
- **Requirement**: Brand works across cultures and languages
- **Implementation**: Cultural sensitivity considerations and international expansion compatibility
- **Validation**: Brand identity supports localization and cultural adaptation

## SUCCESS CRITERIA
Stage 08 is complete when:
- [ ] `stage08.json` exists and validates against schema
- [ ] `stage08_research.md` documents brand and naming trend research
- [ ] Brand name and positioning strategy differentiate from competition
- [ ] Visual identity meets accessibility standards and platform requirements
- [ ] Brand applications designed for App Store optimization and user experience
- [ ] Messaging framework supports subscription model and target audience communication

## HARD FAILURE CONDITIONS
- Schema validation failure → Write `stage08_failure.md` and stop
- Missing brand research and competitive analysis → Write `stage08_failure.md` and stop
- Brand identity violates accessibility standards → Write `stage08_failure.md` and stop
- Brand applications incompatible with platform requirements → Write `stage08_failure.md` and stop
- Messaging framework conflicts with subscription positioning → Write `stage08_failure.md` and stop
- Boundary violation (reading from wrong idea pack) → Write `stage08_failure.md` and stop

DO NOT output JSON in chat. Write all artifacts to disk and continue with Stage 09.