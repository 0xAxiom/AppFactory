# Stage 09: Release Planning + ASO

## AGENT-NATIVE EXECUTION

You are Claude Code (Opus 4.5) operating under the execution identity defined in CLAUDE.md.

Create comprehensive release planning and ASO specifications based on current App Store optimization practices.

## BUILD MODE VERIFICATION (CRITICAL)
Stage 09 can ONLY be executed via `build <IDEA_ID_OR_NAME>` command:
- Verify invocation came from build mode, not `run app factory`
- Require Stage 01-08 artifacts exist (hard-fail if missing)
- Assert this stage is building ONE SPECIFIC IDEA only
- Hard-fail if executed during batch idea generation

## STANDARDS CONTRACT (MANDATORY)
Read and comply with `standards/mobile_app_best_practices_2026.md`. Your output must include a "Standards Compliance Mapping" section demonstrating store submission readiness and ASO implementation requirements.

## INPUTS
- Read: `runs/.../ideas/<idea_dir>/stages/stage08.json` (brand identity)
- Read: `runs/.../ideas/<idea_dir>/stages/stage07.json` (quality and polish)
- Read: `runs/.../ideas/<idea_dir>/stages/stage06.json` (builder handoff)
- Read: `runs/.../ideas/<idea_dir>/stages/stage05.json` (technical architecture)
- Read: `runs/.../ideas/<idea_dir>/stages/stage04.json` (monetization strategy)
- Read: `runs/.../ideas/<idea_dir>/stages/stage03.json` (UX design)
- Read: `runs/.../ideas/<idea_dir>/stages/stage02.json` (product specification)
- Read: `runs/.../ideas/<idea_dir>/meta/idea.json` (canonical idea definition)
- Read: `runs/.../ideas/<idea_dir>/meta/boundary.json` (isolation enforcement)

## OUTPUTS
- Write: `runs/.../ideas/<idea_dir>/stages/stage09.json` (validated release plan with ASO)
- Write: `runs/.../ideas/<idea_dir>/outputs/stage09_execution.md` (execution log with decisions)
- Write: `runs/.../ideas/<idea_dir>/outputs/stage09_research.md` (ASO research citations)
- Render: `runs/.../ideas/<idea_dir>/spec/09_release_planning.md` (specification markdown)
- Update: `runs/.../ideas/<idea_dir>/meta/stage_status.json` (progress tracking)

## FRESHNESS & SOURCES (MANDATORY WEB RESEARCH)
You MUST browse current sources for up-to-date ASO and store optimization:

### Required Research Sources
**ASO Intelligence** (Must consult):
- **Apple App Store Connect**: Latest ASO guidance and metadata requirements
- **Google Play Console**: Current ASO best practices and optimization features
- **App Store Review Guidelines**: Latest submission requirements and review criteria
- **ASO Industry Research**: Current keyword research and optimization strategies

### Research Focus Areas
1. **Keyword Research**: Current search trends and keyword difficulty in target app category
2. **Screenshot Conventions**: Latest visual trends and effective screenshot strategies
3. **Store Listing Optimization**: Current best practices for app descriptions and metadata
4. **Review and Rating Strategies**: Effective approaches for encouraging positive reviews
5. **Launch Strategy**: Successful app launch patterns and timeline best practices

### Citation Requirements
Document research in `stage09_research.md`:
- ASO keyword research methodology and competitive analysis
- Screenshot strategy research with current effective examples
- Store listing optimization best practices with recent guideline updates
- Launch strategy research including timing and promotional approaches

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
  "release_planning": {
    "launch_strategy": {
      "release_approach": "soft_launch|global_launch|phased_rollout",
      "target_timeline": {
        "development_completion": "string",
        "testing_phase": "string",
        "store_submission": "string",
        "public_launch": "string"
      },
      "launch_phases": [
        {
          "phase_name": "string",
          "duration": "string",
          "objectives": ["string"],
          "success_criteria": ["string"]
        }
      ]
    },
    "aso_package": {
      "ios_app_store": {
        "app_name": "string (max 30 chars)",
        "subtitle": "string (max 30 chars)",
        "keywords": "string (max 100 chars)",
        "description": "string",
        "primary_category": "string",
        "secondary_category": "string",
        "screenshots_plan": [
          {
            "title": "string",
            "description": "string",
            "visual_focus": "string",
            "device_type": "string"
          }
        ],
        "app_preview_concept": "string"
      },
      "android_play_store": {
        "app_name": "string (max 50 chars)",
        "short_description": "string (max 80 chars)",
        "full_description": "string (max 4000 chars)",
        "category": "string",
        "feature_graphic_concept": "string",
        "screenshots_plan": [
          {
            "title": "string",
            "description": "string",
            "visual_focus": "string"
          }
        ]
      },
      "keyword_strategy": {
        "primary_keywords": ["string"],
        "secondary_keywords": ["string"],
        "long_tail_keywords": ["string"],
        "competitor_analysis": "string",
        "keyword_difficulty_assessment": "string"
      }
    },
    "marketing_launch_plan": {
      "pre_launch": {
        "audience_building": ["string"],
        "content_preparation": ["string"],
        "press_outreach": "string",
        "beta_testing_program": "string"
      },
      "launch_day": {
        "announcement_strategy": "string",
        "social_media_campaign": "string",
        "pr_activities": ["string"],
        "community_engagement": "string"
      },
      "post_launch": {
        "user_onboarding_optimization": "string",
        "feedback_collection": "string",
        "iteration_planning": "string",
        "growth_marketing": ["string"]
      }
    },
    "success_metrics_and_kpis": {
      "download_targets": {
        "first_week": "string",
        "first_month": "string",
        "first_quarter": "string"
      },
      "engagement_metrics": {
        "day_1_retention": "string",
        "day_7_retention": "string",
        "day_30_retention": "string",
        "session_length": "string"
      },
      "monetization_targets": {
        "trial_conversion_rate": "string",
        "revenue_per_user": "string",
        "monthly_recurring_revenue": "string"
      },
      "store_performance": {
        "app_store_rating": "string",
        "review_velocity": "string",
        "keyword_ranking_targets": ["string"]
      }
    },
    "risk_mitigation": {
      "potential_risks": [
        {
          "risk": "string",
          "probability": "low|medium|high",
          "impact": "low|medium|high",
          "mitigation_strategy": "string"
        }
      ],
      "contingency_plans": [
        {
          "scenario": "string",
          "response_plan": "string",
          "decision_criteria": "string"
        }
      ]
    },
    "post_launch_roadmap": {
      "immediate_updates": [
        {
          "update_type": "string",
          "timeline": "string",
          "rationale": "string"
        }
      ],
      "feature_pipeline": [
        {
          "feature": "string",
          "priority": "high|medium|low",
          "estimated_timeline": "string",
          "user_value": "string"
        }
      ],
      "platform_expansion": {
        "additional_platforms": ["string"],
        "international_markets": ["string"],
        "localization_plan": "string"
      }
    }
  }
}
```

## EXECUTION STEPS

### Phase 1: Release Strategy & Timeline
1. Read all previous stage specifications to understand complete app requirements
2. Research current app launch strategies and ASO best practices
3. Plan launch approach based on app category and competitive landscape
4. Define release timeline with realistic milestones and dependencies

### Phase 2: ASO Package Development
5. Conduct keyword research for target app category and audience
6. Create App Store metadata optimized for discovery and conversion
7. Plan screenshot strategy showcasing key features and value proposition
8. Develop Google Play Store listing with platform-specific optimizations

### Phase 3: Marketing & Launch Planning
9. Design pre-launch audience building and content strategy
10. Plan launch day announcement and promotional activities
11. Create post-launch optimization and growth marketing approach
12. Establish feedback collection and iteration planning processes

### Phase 4: Success Metrics & KPIs
13. Define realistic download and engagement targets based on market research
14. Set monetization targets aligned with subscription model and pricing strategy
15. Establish store performance metrics for ongoing optimization
16. Create measurement and tracking implementation plan

### Phase 5: Risk Assessment & Roadmap
17. Identify potential launch risks and develop mitigation strategies
18. Plan contingency scenarios for common launch challenges
19. Create post-launch feature roadmap based on user needs and market opportunities
20. Plan platform expansion and internationalization strategy

### Phase 6: Validation & Documentation
21. Validate release plan against all previous stage requirements
22. Ensure ASO package meets store guidelines and optimization best practices
23. Write JSON with complete release planning and ASO specification
24. Document research influence on ASO and launch decisions
25. Render human-readable release planning specification

## STANDARDS COMPLIANCE MAPPING

### Store Submission Requirements (MANDATORY)
- **Requirement**: Complete metadata, privacy compliance, content rating, submission readiness
- **Implementation**: ASO package addresses all App Store and Google Play submission requirements
- **Validation**: Store listings prepared with all required metadata and compliance elements

### ASO Best Practices
- **Requirement**: Keyword optimization, visual asset strategy, conversion optimization
- **Implementation**: ASO package based on current keyword research and visual best practices
- **Validation**: ASO strategy aligned with target audience search behavior and competitive landscape

### Marketing Compliance
- **Requirement**: Honest representation, subscription transparency, user privacy respect
- **Implementation**: Marketing materials accurately represent app capabilities and pricing
- **Validation**: All promotional content complies with platform advertising policies

### Success Measurement
- **Requirement**: Realistic targets, measurable KPIs, iteration planning
- **Implementation**: Success metrics based on market research and business model requirements
- **Validation**: KPI targets achievable and aligned with subscription monetization strategy

## SUCCESS CRITERIA
Stage 09 is complete when:
- [ ] `stage09.json` exists and validates against schema
- [ ] `stage09_research.md` documents ASO keyword research and competitive analysis
- [ ] ASO package optimized for both App Store and Google Play with platform-specific strategies
- [ ] Launch strategy includes realistic timeline and comprehensive marketing approach
- [ ] Success metrics defined with measurable KPIs and realistic targets
- [ ] Risk mitigation and post-launch roadmap address potential challenges and growth opportunities

## HARD FAILURE CONDITIONS
- Schema validation failure → Write `stage09_failure.md` and stop
- Missing ASO research and keyword analysis → Write `stage09_failure.md` and stop
- ASO package violates store guidelines or character limits → Write `stage09_failure.md` and stop
- Success metrics unrealistic or unmeasurable → Write `stage09_failure.md` and stop
- Launch strategy incompatible with subscription model → Write `stage09_failure.md` and stop
- Boundary violation (reading from wrong idea pack) → Write `stage09_failure.md` and stop

DO NOT output JSON in chat. Write all artifacts to disk and complete batch execution for all remaining ideas.