# Stage 01: Market Research v3 (IdeaMiner Methodology)

<!--
STAGE 01 v3 RESET: Replaced complex query/lens system with IdeaMiner's evidence-first methodology.
- Simplified overgrown query scaffolding and novelty tracking systems  
- Implemented evidence-first source mining with 3+ source validation requirement
- Added IdeaMiner 8-factor scoring rubric for systematic validation
- Maintains all App Factory output contracts (10 ideas, JSON schema, leaderboard, standards)
- Prevents abstract convergence through evidence requirement rather than complex constraints
-->

## AGENT-NATIVE EXECUTION
You are Claude executing Stage 01 directly. Stage 01 generates market research and 10 app ideas, then STOPS. Individual idea development occurs only via `build <IDEA_ID_OR_NAME>`.

## Leaderboard Non-Influence Rule (MANDATORY)

**During idea generation and market research**, you MUST NOT:
- Read or reference prior leaderboard entries, past idea titles, or recurring keywords as inspiration or priors
- Select exploration vectors by looking at what performed well historically
- Use historical idea patterns to guide research direction or ideation approach
- Allow past run outputs to influence the current research methodology

**Leaderboard interaction is permitted ONLY AFTER** 10 ideas are fully generated and validated for:
- Appending entries to the raw leaderboard
- Rebuilding the global leaderboard
- Non-repetition checking (post-generation only)

**Workflow Order (ENFORCED)**:
1. Parse intake and extract seed phrase for deterministic evidence ordering
2. Execute PASS 1: Broad evidence sweep (30-60 signal cards)
3. Execute PASS 2: Emergent clustering (derive 6-10 vectors from evidence)
4. Execute PASS 3: Generate exactly 10 ideas from strongest clusters with IdeaMiner scoring
5. Validate against standards and cross-validate all ideas with 3+ sources
6. THEN leaderboard append + global rebuild

## STANDARDS CONTRACT (MANDATORY)
Read and comply with `standards/mobile_app_best_practices_2026.md`. Your output must respect excluded categories and business model constraints from this file.

## INPUTS
- Read: `runs/.../inputs/00_intake.md` (user requirements with randomization seed)

**LEADERBOARD ACCESS RESTRICTION**: Do NOT read leaderboard files during idea generation. Leaderboard access is permitted only AFTER idea generation is complete for non-repetition checking and entry appending.

## OUTPUTS  
- Write: `runs/.../stage01/stages/stage01.json` (validated JSON with EXACTLY 10 ideas)
- Write: `runs/.../stage01/outputs/stage01_execution.md` (execution log with research citations)  
- Write: `runs/.../stage01/outputs/stage01_research.md` (research sources and citations)
- Render: `runs/.../stage01/spec/01_market_research.md` (specification)
- Create: `runs/.../meta/idea_index.json` (idea ID to directory mapping)
- Create: 10 idea pack directories with isolation boundaries

## IDEAMINER METHODOLOGY (EVIDENCE-FIRST)

### Evidence-First Two-Pass Methodology
1. PASS 1: Broad evidence sweep across primary sources (no ideas yet)
2. Collect 30-60 signal cards with quotes, context, workarounds
3. PASS 2: Cluster signal cards by workflow similarity into 6-10 derived vectors
4. PASS 3: Generate exactly 10 ideas from strongest clusters

### PHASE A — SOURCE MINING (Evidence-First)

**Prioritized Demand Surfaces** (execute in order):
1. **App Store / Play Store reviews** (1-2★ with specific complaints)
2. **YouTube comments** on "how to X" videos and app reviews  
3. **Extension store reviews** (Chrome/Firefox users requesting features)
4. **Forum comments** (not posts) in niche communities
5. **Twitter replies** to product/service complaints
6. **Reddit** (confirmatory only, not dominant source)

**Signal Capture Format** (for each potential idea):
- **Problem**: ≤25-word exact quote from user
- **Context**: Persona/use case where this occurs  
- **Pain Indicators**: Urgent/Important/Nice-to-have classification
- **Frequency**: Daily/Weekly/Monthly user behavior
- **Source URL**: Direct link to evidence

**Research Execution**:
- Execute 3-5 targeted queries per exploration vector
- Use vectors to inform search patterns and query themes
- Focus on complaint/request extraction, not broad market analysis
- Capture direct quotes, not paraphrased summaries
- Record source URLs for all evidence

### PHASE B — CROSS-VALIDATION (Fail Closed)

**Every Idea MUST Have**:
- **3+ Independent Sources**: Different platforms/communities citing same problem
- **2+ Direct User Quotes**: ≤25 words each, showing organic demand
- **Evidence of Existing Workaround**: Users solving this manually or with poor tools

**Immediate Rejection Criteria**:
- Cannot meet 3-source evidence standard
- Requires behavior change or new habits as primary value  
- Depends on network effects/multi-sided marketplace to function
- Falls into excluded categories (dating, gambling, crypto, medical, financial, 18+)

### PHASE C — IDEA SYNTHESIS

**Convert Validated Problems to Solutions**:
- **MVP Solves ONE Workflow**: Single, focused user journey
- **Explicit Monetization Path**: Subscription-only with clear recurring value
- **Solo-Buildable MVP Scope**: No complex backend/AI dependencies  
- **Mobile Fit Rationale**: Why this needs to be a mobile app specifically

**Core Loop Requirement**: 4+ sequential user actions describing specific behaviors, not abstract states

### PHASE D — IDEAMINER SCORING (0-100 Points)

Score each idea using 8-factor rubric:

1. **Pain Intensity** (0-20): How painful is the problem? (Minor inconvenience vs Major frustration)
2. **Frequency** (0-15): How often do users encounter this? (Daily vs Monthly)  
3. **Monetization/WTP Signals** (0-15): Evidence users pay for solutions or workarounds
4. **Competition/Saturation** (0-15): Market gap and competitive landscape
5. **MVP Feasibility** (0-10): Buildable as solo developer in single stage
6. **Distribution/Acquisition** (0-10): Clear path to reach target users
7. **Retention/Continuity** (0-10): Logical reasons for continued usage
8. **Mobile Fit** (0-5): Why mobile app vs web/desktop

**Score Conversion**: `validation_score = round((score_100 / 10), 1)` capped at 1.0-10.0

### PHASE E — OUTPUT GENERATION

Generate EXACTLY 10 ideas conforming to JSON schema:

```json
{
  "exploration_config": {
    "seed_phrase": "string",
    "vectors": ["array of exploration vectors used"],
    "research_timestamp": "ISO timestamp",
    "non_repetition_check": "Evidence-first validation performed; no leaderboard content used."
  },
  "market_research": {
    "trends": [
      {
        "name": "string",
        "description": "string", 
        "evidence": "string with sources",
        "opportunity_level": "High|Medium|Low"
      }
    ],
    "competition_landscape": {
      "oversaturated": ["string"],
      "underexplored": ["string"]
    },
    "monetization_trends": "string with evidence"
  },
  "app_ideas": [
    {
      "id": "string",
      "name": "string",
      "validation_score": "number (1-10)",
      "signal_source": "string with direct quotes",
      "description": "string",
      "target_user": "string", 
      "pain_point_evidence": "string with citations",
      "core_loop": ["4+ sequential user actions describing specific behaviors"],
      "differentiation": "string",
      "subscription_fit": "string with reasoning",
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

## EXECUTION PHASES

### PASS 1: Evidence Sweep (NO IDEAS)
1. Read intake file and extract seed phrase for deterministic ordering
2. Execute broad evidence sweep using intake's query patterns
3. Mine prioritized demand surfaces in seed-controlled order:
   - App Store/Play Store reviews (1-2★ complaints) 
   - YouTube comments on "how to X" and app reviews
   - Extension store reviews (feature requests)
   - Forum comments in niche communities
   - Twitter replies to complaints
   - Reddit (confirmatory only, not dominant)
4. Collect 30-60 SIGNAL CARDS, each with:
   - Exact quote (≤25 words from actual user)
   - Context (persona/use case where this occurs)
   - Frequency (daily/weekly/monthly behavior)
   - Workaround (how users handle this today)
   - Source URL (direct link to evidence)
   - Source type (App Store, YouTube, forum, etc.)
5. Write all signal cards to stage01_research.md BEFORE any idea naming

### PASS 2: Emergent Clustering (DERIVED VECTORS)
6. Cluster signal cards into 6-10 groups based on workflow similarity
7. Each cluster gets a short, concrete label (becomes a "Derived Vector")
8. Clusters must be workflow-objective labels, not abstract states
9. Record Derived Vectors in:
   - stage01_research.md (cluster listing + which cards belong)
   - stage01.json -> exploration_config.vectors (array of derived vector labels)
10. Select strongest clusters based on evidence density + WTP signals + workaround prevalence

### PASS 3: Idea Synthesis (10 IDEAS)
11. Generate EXACTLY 10 ideas derived from strongest clusters
12. Apply 3+ source requirement to each idea (fail closed)
13. Verify 2+ direct user quotes per idea
14. Confirm evidence of existing workarounds per idea
15. Reject ideas failing validation criteria
16. Define core loops with 4+ sequential actions
17. Ensure mobile fit and subscription viability
18. Apply IdeaMiner 8-factor scoring rubric

### PASS 4: Scoring + Outputs
19. Convert scores to validation_score using existing formula
20. Validate exactly 10 ideas generated
21. Confirm standards compliance (excluded categories)
22. Verify all ideas have evidence backing
23. Write JSON to `runs/.../stage01/stages/stage01.json`

### Phase 5: Documentation
24. Document execution in `stage01_execution.md` including evidence sweep and clustering process
25. Write signal cards and cluster analysis to `stage01_research.md` with URLs and quotes
26. Render specification: `stage01_spec/01_market_research.md`

### Phase 6: Idea Pack Setup
27. Create `runs/.../meta/idea_index.json` with rank/slug/directory mapping
28. Create 10 idea pack directories: `runs/.../ideas/<rank>_<slug>__<idea_id>/`
29. Initialize metadata files for each idea pack

### Phase 7: Leaderboard Update (MANDATORY)
30. **Non-Repetition Check**: Read `leaderboards/app_factory_all_time.json` for concept overlap
31. **Derived Vector Documentation**: Document derived vector coverage from evidence clusters (post-hoc only)
32. **Update Raw Leaderboard**: Append 10 new entries with all required fields
33. **Rebuild Global Leaderboard**: Execute `python3 scripts/rebuild_global_leaderboard.py`

### Phase 8: Completion
34. Mark run status as completed
35. Stage 01 ends - no progression to Stages 02-10
36. Ideas remain unbuilt until explicit `build <IDEA_ID_OR_NAME>` command

## BUSINESS MODEL CONSTRAINTS
- Subscription-only monetization (RevenueCat integration mandatory)
- No ads, one-time purchases, or freemium models
- Guest-first authentication with optional progressive registration
- iOS + Android simultaneous support required
- Store submission ready (Apple App Store + Google Play)

## SUCCESS CRITERIA
Stage 01 is complete when:
- [ ] `stage01.json` exists with EXACTLY 10 ideas (validated)
- [ ] All ideas have 3+ source evidence backing
- [ ] `stage01_research.md` documents sources with URLs and quotes
- [ ] `stage01_execution.md` created with execution log
- [ ] `idea_index.json` created with all mappings
- [ ] 10 idea pack directories created with proper naming
- [ ] Raw leaderboard updated successfully
- [ ] Global leaderboard rebuilt successfully

## HARD FAILURE CONDITIONS
- Idea count != 10 → Write `stage01_failure.md` and stop
- Any idea lacks 3+ sources → Write `stage01_failure.md` and stop
- Schema validation failure → Write `stage01_failure.md` and stop
- Standards violation (excluded categories) → Write `stage01_failure.md` and stop
- Missing source citations → Write `stage01_failure.md` and stop

DO NOT output JSON in chat. Write to disk only. Stop after Stage 01 completion.