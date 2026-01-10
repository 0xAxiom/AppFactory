# Stage 02: Product Specification

## AGENT-NATIVE EXECUTION

You are Claude Code (Opus 4.5) operating under the execution identity defined in CLAUDE.md.

Create comprehensive product specifications based on Stage 01 market research and current product trends.

## BUILD MODE VERIFICATION (CRITICAL)
Stage 02 can ONLY be executed via `build <IDEA_ID_OR_NAME>` command:
- Verify invocation came from build mode, not `run app factory`
- Require Stage 01 artifacts exist (hard-fail if missing)
- Assert this stage is building ONE SPECIFIC IDEA only
- Hard-fail if executed during batch idea generation

## STANDARDS CONTRACT (MANDATORY)
Read and comply with `standards/mobile_app_best_practices_2026.md`. Your output must include a "Standards Compliance Mapping" section demonstrating how your deliverables meet relevant requirements.

## INPUTS
- Read: `runs/.../ideas/<idea_dir>/meta/idea.json` (canonical idea definition)
- Read: `runs/.../ideas/<idea_dir>/meta/boundary.json` (isolation enforcement)  
- Read: `runs/.../stage01/stages/stage01.json` (market research for context)

## OUTPUTS
- Write: `runs/.../ideas/<idea_dir>/stages/stage02.json` (validated product specification)
- Write: `runs/.../ideas/<idea_dir>/outputs/stage02_execution.md` (execution log with decisions)
- Write: `runs/.../ideas/<idea_dir>/outputs/stage02_research.md` (research citations)
- Render: `runs/.../ideas/<idea_dir>/spec/02_product_spec.md` (specification markdown)
- Update: `runs/.../ideas/<idea_dir>/meta/stage_status.json` (progress tracking)

## FRESHNESS & SOURCES (MANDATORY WEB RESEARCH)
You MUST browse current sources to avoid outdated MVP assumptions:

### Required Research Sources
**Competitive Analysis** (Must consult):
- **Live Apps**: Browse 3-5 apps in the same category (App Store/Google Play)
- **Feature Expectations**: Current feature sets users expect in this category
- **User Complaints**: Recent reviews identifying gaps in existing solutions
- **Platform Guidelines**: Apple HIG and Material Design for platform expectations

### Research Focus Areas  
1. **Feature Standards**: What features are now table-stakes vs premium
2. **User Onboarding**: Current best practices for app category
3. **Core Workflows**: How users expect to accomplish primary tasks
4. **Integration Expectations**: What third-party integrations users expect

### Citation Requirements
Document research in `stage02_research.md`:
- Competitor analysis with specific apps reviewed
- Feature gap identification with evidence
- User experience patterns observed
- How research influenced product decisions

## BOUNDARY ENFORCEMENT
This stage must ONLY read from:
- Current idea pack directory: `runs/.../ideas/<idea_dir>/`
- Shared Stage 01 for market context: `runs/.../stage01/stages/stage01.json`
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
  "product_specification": {
    "app_concept": {
      "name": "string",
      "tagline": "string (under 50 chars)",
      "category": "string",
      "core_value_proposition": "string"
    },
    "target_users": {
      "primary": {
        "segment": "string",
        "pain_points": ["string"],
        "goals": ["string"],
        "demographics": "string"
      },
      "secondary": {
        "segment": "string",
        "pain_points": ["string"],
        "goals": ["string"]
      }
    },
    "core_features": {
      "mvp_features": [
        {
          "name": "string",
          "description": "string",
          "user_story": "string",
          "acceptance_criteria": ["string"],
          "complexity_estimate": "S|M|L"
        }
      ],
      "premium_features": [
        {
          "name": "string",
          "description": "string",
          "justification": "string"
        }
      ]
    },
    "success_metrics": {
      "user_engagement": {
        "daily_active_users": "string",
        "session_length": "string",
        "retention_rate": "string"
      },
      "business_metrics": {
        "conversion_to_paid": "string",
        "monthly_revenue_per_user": "string",
        "churn_rate": "string"
      }
    },
    "competitive_analysis": {
      "direct_competitors": [
        {
          "name": "string",
          "strengths": ["string"],
          "weaknesses": ["string"],
          "differentiation": "string"
        }
      ],
      "positioning": "string"
    }
  }
}
```

## EXECUTION STEPS

### Phase 1: Research & Analysis
1. Read canonical idea definition from meta/idea.json
2. Research current competitive landscape and feature expectations
3. Analyze user needs based on Stage 01 evidence
4. Document research findings and competitive gaps

### Phase 2: Product Design
5. Define core value proposition based on market research
6. Specify target user segments with pain points and goals  
7. Design MVP feature set aligned with subscription model
8. Define premium features that justify ongoing payment
9. Establish success metrics and competitive positioning

### Phase 3: Validation & Documentation
10. Validate feature set against market evidence
11. Ensure MVP scope is achievable for single development stage
12. Write JSON to disk with full product specification
13. Document execution decisions and research influence
14. Render human-readable specification markdown

### Phase 4: Status Updates
15. Update stage_status.json with completion
16. Validate JSON against schema
17. Verify boundary compliance

## STANDARDS COMPLIANCE MAPPING

### Subscription & Store Compliance
- **Requirement**: Clear premium value distinction for subscription model
- **Implementation**: MVP vs premium feature separation with logical upgrade path
- **Validation**: Premium features provide ongoing value justifying recurring payment

### User Experience Standards
- **Requirement**: Guest-first design with optional progressive registration  
- **Implementation**: Core features accessible without account creation
- **Validation**: Account creation only required for premium features or data sync

### Platform Compliance
- **Requirement**: Follow platform design guidelines and user expectations
- **Implementation**: Feature set aligned with iOS HIG and Material Design principles  
- **Validation**: No features that violate platform policies or user expectations

## SUCCESS CRITERIA
Stage 02 is complete when:
- [ ] `stage02.json` exists and validates against schema
- [ ] `stage02_research.md` documents competitive analysis
- [ ] Product specification includes clear MVP/premium distinction
- [ ] Success metrics aligned with subscription business model
- [ ] Standards compliance mapping demonstrates adherence to requirements
- [ ] Features designed for guest-first, subscription-based mobile app

## HARD FAILURE CONDITIONS
- Schema validation failure → Write `stage02_failure.md` and stop
- Missing competitive research → Write `stage02_failure.md` and stop
- Feature set incompatible with subscription model → Write `stage02_failure.md` and stop
- Boundary violation (reading from wrong idea pack) → Write `stage02_failure.md` and stop

DO NOT output JSON in chat. Write all artifacts to disk and continue with Stage 03.