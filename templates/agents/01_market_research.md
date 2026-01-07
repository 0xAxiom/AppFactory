# Stage 01: Market Research

## AGENT-NATIVE EXECUTION
You are Claude executing Stage 01 directly. Write artifacts to disk in the current run directory.

## INPUTS
- Read: `runs/.../inputs/00_intake.md` (user requirements)

## OUTPUTS
- Write: `runs/.../stages/stage01.json` (validated JSON)
- Write: `runs/.../outputs/stage01_execution.md` (execution log)  
- Render: `runs/.../spec/01_market_research.md` (specification)

## JSON SCHEMA

```json
{
  "market_research": {
    "trends": [
      {
        "name": "string",
        "description": "string",
        "evidence": "string", 
        "opportunity_level": "High|Medium|Low"
      }
    ],
    "competition_landscape": {
      "oversaturated": ["string"],
      "underexplored": ["string"]
    },
    "monetization_trends": "string"
  },
  "app_ideas": [
    {
      "id": "string",
      "name": "string", 
      "validation_score": "number (1-10)",
      "signal_source": "string",
      "description": "string",
      "target_user": "string",
      "pain_point_evidence": "string",
      "core_loop": ["string"],
      "differentiation": "string",
      "subscription_fit": "string",
      "mvp_complexity": "S|M|L",
      "pricing": {
        "monthly_range": "string",
        "annual_range": "string", 
        "trial_strategy": "string"
      }
    }
  ]
}
```

## RESEARCH REQUIREMENTS

Generate exactly 10 subscription-based mobile app ideas based on:

### Signal Sources
- Reddit complaints and feature requests
- App Store negative reviews
- TikTok/social media workflow frustrations  
- IndieHackers validated discussions

### Constraints
- Subscription-viable business models only
- Avoid: medical, gambling, crypto/trading
- Target: low/medium competition markets
- MVP scope: buildable in single stage

### Validation Scoring (1-10)
- Signal Strength (40%): Evidence of real demand
- Competition Gap (30%): Market saturation level  
- Subscription Fit (20%): Monthly payment viability
- MVP Feasibility (10%): Development complexity

## EXECUTION STEPS

1. Read user requirements from `runs/.../inputs/00_intake.md`
2. Generate market research and 10 app ideas conforming to JSON schema
3. Write JSON to `runs/.../stages/stage01.json`  
4. Validate: `python -m appfactory.schema_validate schemas/stage01.json runs/.../stages/stage01.json`
5. Write validation results to `runs/.../outputs/stage01_validation.json`
6. Document execution in `runs/.../outputs/stage01_execution.md`
7. Render specification: `python -m appfactory.render_markdown 01 runs/.../stages/stage01.json`
8. Update `runs/.../meta/stage_status.json` to mark stage completed

## SUCCESS CRITERIA

Stage 01 is complete when:
- [ ] `stage01.json` exists and validates against schema
- [ ] All 10 app ideas have validation scores and evidence
- [ ] Market research identifies clear trends and opportunities
- [ ] Execution log documents research process
- [ ] Specification markdown rendered successfully

DO NOT output JSON in chat. Write to disk only.