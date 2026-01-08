# Stage 01: Market Research

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
1. Parse intake
2. Select and diversify exploration vectors
3. Conduct diversified research using intake methodology
4. Generate 10 ideas based on research evidence
5. Validate ideas against standards
6. THEN leaderboard append + global rebuild

## CLUSTERED INTAKE VECTOR CORRECTION (MANDATORY)

Rule:
- Stage 01 must treat the written intake as read-only, BUT it may apply a "query widening overlay" if the intake vectors are semantically clustered.
- This overlay must NOT rewrite the intake file.
- It must only broaden query generation and lens selection.

How:
- If 2+ vectors contain productivity-cluster tokens (focus, flow, routine, ADHD, executive function), Stage 01 must:
  - select additional non-productivity domain lenses for research prompts
  - generate query families primarily from those non-productivity lenses
  - still allow one vector to remain in the productivity domain (no bans)

Important:
- This overlay is widening-only and does not reject the intake or alter it.
- It exists because a clustered vector seed collapses exploration.

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

## FRESHNESS & SOURCES (MANDATORY WEB RESEARCH)
You MUST browse current web sources to ensure up-to-date market intelligence:

### Required Research Sources

**Primary Sources** (Must prioritize; consult multiple):
- **App Store / Play Store 1–2★ reviews** (recent)
- **App Store Q&A / Play Store Q&A** (where available)
- **YouTube comments** on "how to X" / "why X fails"
- **Extension store reviews** (Chrome/Firefox)
- **Marketplace reviews** (Gumroad/Etsy) for templates/planners/trackers
- **Forum comments & support comment threads**
- **Twitter replies / quote tweets** (short-form)

**Secondary / Confirmatory Sources** (Allowed; lower weight):
- **Reddit** (confirmatory only, per intake rule)
- **IndieHackers / HN** (confirmatory; do not let founder/AI discourse define framing)

### Reddit Usage Rule
Reddit may be used ONLY to:
- Confirm a problem seen elsewhere
- Extract short, concrete complaints
- Validate demand magnitude

Reddit MUST NOT:
- Define the core framing of the problem
- Introduce AI-first language by default
- Be the sole source for an idea

### Research Method
1. **Start with Low-Friction Sources**: Begin research with promoted primary sources (reviews/Q&A/comments)
2. **Use Exploration Vectors**: Apply the 3-5 vectors from intake to focus research
3. **Query Frame Matching (MANDATORY)**: Generate queries using native user language of each vector domain
4. **Rotate Query Patterns**: Use different search patterns per vector
5. **Gather Evidence**: Collect direct quotes and specific complaints
6. **Use Reddit Last**: Only for confirmation of problems found elsewhere
7. **Avoid Stale Sources**: Prefer sources from last 6-12 months
8. **Translation Required**: Convert research into specific market opportunities

### Query Frame Matching (MANDATORY)

**Frame must match the vector domain**:
For each selected exploration vector, generate search queries using language that typical users in that domain would type.

**Example guidance**:
- Elder-friendly tech: "simple phone launcher for seniors", "grandma can't use smartphone", "bigger text app older adults"
- Offline study: "offline flashcards app", "study app no internet", "downloadable quiz app", "works on airplane"
- Digital self-expression: "private journaling app", "creative prompts app", "share art without algorithm", "low pressure social app"
- Household/logistics: "grocery list app too complicated", "simple pantry tracker", "meal planning app frustrating"
- Creativity: "writer's block app", "daily sketch prompts", "creative tracking app"

**Soft suppression of productivity keywords for non-productivity vectors**:
When the vector domain is NOT productivity/focus:
- Do NOT include these terms in initial queries unless the vector explicitly includes them: "productivity", "focus", "ADHD", "routine", "habit", "burnout", "flow", "executive function"
- If those concepts appear organically in a discovered source, they may be included in follow-up queries — but they must not be the starting frame.

This is not a ban. It is a "don't default to it" rule.

**Separate query batches by vector**:
Stage 01 must generate and execute queries in distinct batches per selected vector. Do not mix terms across vectors in a single query.

**Evidence sourcing must follow the frame**:
When writing evidence_summary and framing the problem:
- Prefer quotes that match the vector's native user language
- Avoid reframing everything into productivity jargon unless the source uses it

**Output requirement (lightweight)**:
In stage01_research.md (or the research section output), for each of the selected vectors:
- List the 3–6 exact queries used
- List the top sources used for evidence
This is documentation only; no schema change.

### Query Novelty (MANDATORY)

**Maintain a lightweight query history file**:
- Read and write: `meta/query_history.json`
- Structure:
```json
{
  "last_updated": "...",
  "queries": [
    {"run_id":"...", "run_date":"...", "vector":"...", "query":"..."},
    ...
  ]
}
```
- Keep only the most recent 200 queries (rolling window)
- If the file does not exist, create it

**Generate queries per vector in batches**:
For each selected exploration vector:
- Generate 6–10 candidate queries
- Then filter them through novelty checks below
- Execute only the best 3–6 novel queries per vector

**Novelty check (simple, deterministic)**:
Before executing a query:
- Normalize it (lowercase, trim, collapse whitespace, remove punctuation)
- Compare against the query history with:
  - exact match check AND
  - substring containment check (either direction) AND
  - token overlap heuristic (e.g., if >70% of tokens overlap, treat as near-duplicate)

If a query is a near-duplicate, do NOT execute it. Instead, rewrite it using a different lens.

**Rewrite menu (MANDATORY when duplicate detected)**:
When rewriting a near-duplicate query, change the "lens" and the wording:
- "alternatives to <X>"
- "why does <X> fail"
- "<X> is too complicated"
- "I wish there was an app that <Y>"
- "how do I <goal> without <pain>"
- "<X> app review '<quoted complaint fragment>'"

Rewrites must stay in the vector's domain-native language (per Query Frame Matching). Do not default to "productivity/focus" phrasing unless the vector is explicitly productivity.

**Audit trail (required, small)**:
In stage01_research.md (or equivalent research output):
- Include a short "Queries Executed" section listing:
  - vectors
  - exact executed queries (3–6 per vector)
This is for auditability and debugging.

**Update query history at end of Stage 01 research**:
After executing the searches:
- Append executed queries with run_id/run_date/vector into meta/query_history.json
- Trim to last 200 entries

**Query Frame Matching must apply to novelty too**:
- Novelty rewrites must preserve the vector's domain language
- Non-productivity vectors must not default to "productivity/focus/ADHD/routine" phrasing
- Productivity keywords are allowed ONLY when appropriate, not as a universal framing

### Citation Requirements
Document all research in `stage01_research.md`:
- URL and source name
- Date accessed
- Key quotes or findings  
- How this influenced specific ideas
- Evidence strength assessment

## MODE MIX PLANNING (MANDATORY)

Stage 01 MUST generate exploration prompts under each Discovery Mode:
- Practical Utility prompts (existing behavior)
- Playful/Meme prompts (new)
- Kids/Family prompts (new)

This is not a quota; it is an instruction to include these lenses in discovery.
Queries and sources must be mode-appropriate (see playbooks below).

## DOMAIN LENS SELECTION (MANDATORY)

Before ANY web search, Stage 01 MUST:

1) **Choose 3–5 "domain lenses"** for the run:
   - This is NOT a cap/bucket quota; it is a widening step for research prompts
   - At least 2 lenses should be outside productivity/attention when possible
   - No lens is banned; productivity may be included

2) **Generate discovery prompts per lens**:
   - Each lens produces its own keyword families and complaint language
   - These prompts must avoid "focus/ADHD/routine/flow" terms unless the lens is explicitly productivity/attention

3) **Write selected lenses to run metadata**:
   - Put the selected lenses inside stage01.json under exploration_config as a simple list field
   - If schema rejects it, write it to stage01_research.md instead

## QUERY FAMILY ROTATION (MANDATORY)

Purpose: Stop repeating the same search scaffolds that lead back to ADHD/focus.

Implementation:
- For each selected lens, generate queries using at least 3 different "query families", rotating phrasing:
  Examples:
  A) "why is ___ so annoying" / "___ is frustrating" / "___ takes too many steps"
  B) "best ___ app is missing ___" / "I wish ___ had ___"
  C) "alternatives to ___" (allowed, but not the only pattern)
  D) "how do I ___ without ___" / "simplest way to ___"
  E) "___ app deleted because" / "stopped using ___ because"
  F) "___ review 1 star" / "___ too complicated"

- Maintain diversification sources from earlier patches (app reviews, YouTube comments, extension reviews, etc.)
- But the query families must be lens-specific and must NOT default back to productivity terms

## CONVERGENCE CHECK (MANDATORY)

Rule: If the research notes or query list contains repeated high-frequency tokens like:
"ADHD", "focus", "routine", "flow", "pomodoro", "executive function"
AND productivity/attention is not the ONLY chosen lens,
then Stage 01 MUST:
- regenerate at least 50% of the queries for the non-productivity lenses
- using different query families
- and proceed using those regenerated queries

This is NOT a ban. It is a prompt diversification correction.

## PLAYFUL/MEME DISCOVERY PLAYBOOK (MANDATORY)

Stage 01 MUST include sources/patterns that reliably surface meme/novelty demand:

**Required Sources**:
- TikTok comments (short complaints, "someone should make an app for…", "I would pay for…")
- YouTube Shorts / Reels comments (especially "things that should exist" / "why is there no…")
- Twitter/X replies (not threads) on viral prompts
- App Store reviews for novelty apps (soundboards, widgets, pet simulators, prank timers, etc.)
- Chrome extension store reviews for "silly but useful" tools (cursor effects, sound toggles, tiny utilities)
- Etsy/Gumroad reviews for novelty templates/stickers/printables (kid charts, reward boards, joke planners)

**Query Families for Meme/Novelty** (rotate, do not repeat one pattern):
- "app that does one stupid thing"
- "I wish there was an app that ___ (funny/absurd)"
- "best prank app 2024 2025 reviews"
- "soundboard app reviews 1 star missing ___"
- "lock screen widget ideas funny"
- "most useless apps that people love"
- "tiny app that makes me laugh"
- "oddly satisfying tracker app"

## KIDS/FAMILY DISCOVERY PLAYBOOK (MANDATORY)

Stage 01 MUST include sources/patterns that surface kids demand and parent pain:

**Required Sources**:
- App Store / Google Play reviews for kids apps (parents complaining about UX, offline, ads, complexity)
- Parenting forum COMMENTS (not long posts) about screen-time tools, reward charts, routines (non-medical)
- YouTube comments on "activities for kids", "quiet time", "road trip with kids", "chore charts"
- Etsy/Gumroad reviews for chore charts, reward systems, flashcards, printable games
- Teacher forums/comments about classroom quick tools (timers, name pickers, sticker charts)

**Query Families for Kids/Family**:
- "chore chart app too complicated reviews"
- "reward chart app for kids no ads"
- "road trip kids simple games offline"
- "kids timer app parents hate"
- "screen time routine chart simple"
- "flashcards app offline simple"
- "bedtime routine chart app"

**Compliance Rules (binding)**:
- No chat/social features that connect children with strangers
- No collection of sensitive personal data by default
- Prefer offline-first, local profiles, minimal analytics
- Ensure COPPA-aware posture by minimizing data and using parental gates where relevant

**Avoid Convergence Rule**: When generating Playful/Meme or Kids/Family queries, do NOT use focus/ADHD/routine/flow language unless the idea is explicitly in Practical Utility mode.

## CONTROLLED RANDOMIZATION
Using the seed from intake file:
1. **Parse Exploration Configuration**: Extract seed phrase and vectors
2. **Exploration Widening**: Apply vector diversification to prevent semantic clustering
3. **Apply Vectors**: Focus research on the diversified exploration areas
4. **Diversify Queries**: Use seed to vary search patterns and source weighting
5. **Record Decisions**: Document how randomization influenced idea space

## Exploration Widening (MANDATORY)

**Multi-Domain Exploration Requirement**:
- Stage 01 must explore multiple consumer-life domains per run (e.g., home, food, travel, education, family, hobbies, work, wellness, productivity, etc.) WITHOUT banning any domain
- Use at least 4 distinct signal channels per run such as:
  - App Store / Play Store 1–2★ reviews
  - YouTube comments on relevant topics
  - Extension store reviews
  - Forums / comment sections
  - Q&A pages and support forums
  - Twitter replies to relevant posts

**Query Diversification Requirements**:
- Avoid repeating identical search phrasing across runs by:
  - Rewriting queries in different user language patterns
  - Using "alternatives to X" and "why does X fail" patterns  
  - Sampling adjacent categories even when exploring similar pain points
  - Rotating between formal and casual query formulations

**Vector Pre-Processing Step (MANDATORY)**:
Before any web search, research, or query generation:
- Review the selected exploration vectors for semantic adjacency
- If multiple vectors are closely related (e.g., focus + routine + burnout), probabilistically replace one or more with vectors from different consumer-life domains
- Vector replacement must:
  - Preserve randomness and eligibility of all vectors
  - Occur BEFORE any search queries are generated
  - Ensure selected vectors span at least 2-3 distinct conceptual clusters when possible

**Implicit Semantic Clustering** (conceptual guidance only):
- Productivity & attention
- Wellness & self-regulation  
- Household & logistics
- Learning & skill development
- Creativity & expression
- Social & communication
- Utilities & lightweight tools
- Personal organization (non-productivity)
- Commerce & tracking (non-financial)

This is a widening heuristic to prevent all vectors from the same cluster, not a validation gate or quota system.

## JSON SCHEMA

```json
{
  "exploration_config": {
    "seed_phrase": "string",
    "vectors": ["array of exploration vectors used"],
    "research_timestamp": "ISO timestamp",
    "non_repetition_check": "Non-repetition check performed by varying domain lenses and query families; no leaderboard content used."
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
      "core_loop": ["string"],
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

## VALIDATION REQUIREMENTS

Generate exactly 10 subscription-based mobile app ideas based on:

### Evidence Standards
- **Signal Strength (40%)**: Direct quotes from user complaints/requests
- **Competition Gap (30%)**: Clear market opportunity with evidence  
- **Subscription Fit (20%)**: Logical recurring value proposition
- **MVP Feasibility (10%)**: Buildable in single development stage

### Quality Mechanisms (MANDATORY)
- **Current Workarounds**: Document 2-4 bullets showing how users solve this today
- **Behavior-Change Risk**: Classify as Low/Medium/High, prefer Low (replaces existing actions) over High (requires new habits)
- **Score Justifications**: One evidence-based sentence explaining each scoring component

### Business Model Constraints
- Subscription-viable business models only
- Avoid: medical, gambling, crypto/trading (per standards)
- Target: low/medium competition markets
- MVP scope: buildable in single stage

### Research Quality Gates
- All ideas backed by recent evidence (6-12 months)
- Direct quotes from users/reviews included
- Competitive analysis with specific gaps identified
- Sources cited for all market claims

## EXECUTION STEPS (BATCH MODE)

### Phase 1: Research Setup
1. Read intake file and extract exploration configuration
2. Apply vector pre-processing to ensure semantic diversity (BEFORE research)
3. Plan research approach using diversified vectors and seed

### Phase 2: Market Research
4. Start with promoted primary sources (App Store reviews, YouTube comments, etc.)
5. Browse required sources using query patterns
6. Gather evidence with focus on exploration vectors  
7. Use Reddit only for confirmation of problems found elsewhere
8. Collect direct quotes and market signals
9. Document all sources in research log

### Phase 3: Idea Generation
10. Generate EXACTLY 10 app ideas conforming to JSON schema
11. For each idea, include Discovery Mode + Ship Profile tags in description:
    - Discovery Mode: Practical Utility | Playful/Meme | Kids/Family
    - Ship Profile: Client-only | Offline-first | Light-backend | Heavy-backend
    - Playful/Meme and Kids/Family ideas should default to client-only or offline-first unless strictly necessary
12. For each idea, document current workarounds (2-4 bullets) in research log
13. Assess behavior-change risk (Low/Medium/High) with preference for Low
14. Validate each against standards exclusions
15. Score using evidence-based criteria with justification sentences
16. Write JSON to `runs/.../stage01/stages/stage01.json`

### Phase 4: Validation & Documentation
17. Validate: Hard-fail if idea count != 10 or missing unique idea_ids
18. Document execution in `stage01_execution.md` with research summary
19. Write detailed research citations to `stage01_research.md` including per-idea workarounds, behavior-change risk, and score justifications
20. Render specification: `stage01_spec/01_market_research.md`

### Phase 5: Idea Pack Setup
21. Create `runs/.../meta/idea_index.json` with rank/slug/directory mapping
22. For each of the 10 ideas, create directory: `runs/.../ideas/<rank>_<slug>__<idea_id>/`
23. For each idea pack, create:
    - `meta/idea.json` (canonical frozen idea definition)
    - `meta/boundary.json` (isolation enforcement)
    - `meta/name.alias` (human-readable name)
    - `meta/stage_status.json` (progress tracking)

### Phase 6: Global Leaderboard Update (MANDATORY)
24. **Non-Repetition Check**: NOW read `leaderboards/app_factory_all_time.json` to check for concept overlap
25. **Update Raw Leaderboard**:
    - Read current: `leaderboards/app_factory_all_time.json`
    - For each of the 10 ideas from stage01.json:
      - Create leaderboard entry with all required fields
      - Add Build Profile metadata using derivation heuristics
    - Append entries to JSON file (never rewrite existing)
    - Update derived CSV file with same data
    - If append fails: write `leaderboards/leaderboard_failure.md` and STOP

26. **Rebuild Global Leaderboard**:
    - Execute: `python3 scripts/rebuild_global_leaderboard.py`
    - This creates/updates: `leaderboards/app_factory_global.json` and `.csv`
    - If rebuild fails: write `leaderboards/global_rebuild_failure.md` and STOP

### Phase 7: Stop After Stage 01 (MANDATORY)
27. `run app factory` ends after Stage 01 completion
28. Idea bin remains metadata-only (no Stages 02-09 execution)
29. Individual idea development occurs ONLY via `build <IDEA_ID_OR_NAME>`
30. Stage 01 provides the foundation for selective building

## BUILD PROFILE DERIVATION (HEURISTICS)

### Backend Required Assessment
- TRUE if: Real-time collaboration, user matching, complex data processing, or synchronization across users
- FALSE if: Personal productivity, offline-capable, client-side analytics, local data only

### External API Required Assessment  
- TRUE if: Integration with third-party services, live data feeds, payment processing beyond RevenueCat
- FALSE if: Self-contained functionality, offline operations, local calculations

### AI Required Assessment
- NONE: No AI features mentioned in core loop
- OPTIONAL: AI could enhance but core value exists without it  
- REQUIRED: Core value proposition depends on AI/ML functionality

### Default Bias Rules
- Prefer client_only or offline_first cost profiles
- Default backend_required to FALSE unless core loop requires server
- Default external_api_required to FALSE unless integration is essential
- Default ai_required to NONE unless specifically mentioned

## SUCCESS CRITERIA

Stage 01 is complete when:
- [ ] `stage01.json` exists with EXACTLY 10 ideas (validated)
- [ ] `stage01_research.md` documents all sources with citations
- [ ] `stage01_execution.md` created with execution log
- [ ] `spec/01_market_research.md` rendered specification
- [ ] `idea_index.json` created with all mappings
- [ ] 10 idea pack directories created with proper naming (metadata-only)
- [ ] Raw leaderboard updated successfully
- [ ] Global leaderboard rebuilt successfully
- [ ] No errors in Stage 01 execution

## HARD FAILURE CONDITIONS
- Idea count != 10 → Write `stage01_failure.md` and stop
- Duplicate idea_ids → Write `stage01_failure.md` and stop  
- Schema validation failure → Write `stage01_failure.md` and stop
- Standards violation (excluded categories) → Write `stage01_failure.md` and stop
- Missing required research citations → Write `stage01_failure.md` and stop

## STANDARDS COMPLIANCE MAPPING
### Subscription & Store Compliance
- **Requirement**: Subscription-only business models
- **Implementation**: All 10 ideas must have logical recurring value propositions
- **Validation**: Each idea includes subscription_fit field with reasoning

### Excluded Categories  
- **Requirement**: No dating, gambling, crypto, medical diagnosis apps
- **Implementation**: Hard validation against excluded categories from standards
- **Validation**: All ideas checked against exclusion list before inclusion

DO NOT output JSON in chat. Write to disk only. Stop after Stage 01 completion.