# Dream Stage 01: Single Idea Validation

## AGENT-NATIVE EXECUTION

You are Claude Code (Opus 4.5) operating under the execution identity defined in CLAUDE.md.

This stage transforms a raw user idea into a validated, structured app concept ready for Stages 02-10.

## DREAM MODE CONTEXT
- **Input**: Raw idea text from user's `dream <IDEA_TEXT>` command
- **Output**: Single validated idea pack (not 10 ideas like normal Stage 01)
- **Purpose**: Convert free-form idea into structured pipeline format
- **Scope**: Lightweight validation research + standards enforcement

## INPUTS
- Read: `runs/.../inputs/dream_intake.md` (raw idea text)
- Standards: `standards/mobile_app_best_practices_2026.md` (exclusions)

## OUTPUTS
- Write: `runs/.../stage01_dream/stages/stage01_dream.json`
- Write: `runs/.../stage01_dream/outputs/stage01_dream_execution.md`
- Write: `runs/.../stage01_dream/dream_research.md`
- Create: `runs/.../ideas/01_<slug>__<idea_id>/meta/*` (idea pack)

## JSON SCHEMA
Use the same schema as `schemas/stage01.json` but with:
- `generated_ideas` array containing EXACTLY 1 idea
- `market_research.trends` focused on the specific idea domain
- `validation_summary.total_ideas` = 1

## EXECUTION STEPS

### 1. Parse Dream Intake
Read the raw idea text and extract:
- **Core concept**: What is the app supposed to do?
- **Target user**: Who would use this app?
- **Value proposition**: What problem does it solve?
- **Feature scope**: What are the main capabilities?

### 2. Standards Compliance Check
Before proceeding, verify the idea does NOT fall into excluded categories:
- Dating/relationships apps
- Gambling or betting
- Cryptocurrency or trading
- Medical diagnosis or health advice
- Regulated financial services
- 18+ or adult content

If the idea violates standards, STOP and write failure to execution log.

### 3. Idea Normalization
Transform the raw idea into structured format:
- Generate `idea_id` (lowercase, underscores, unique suffix)
- Generate `idea_slug` (URL-friendly version)
- Create `idea_name` (clean, marketable title)
- Define `target_user` (specific user segment)
- Define `core_loop` (user interaction pattern)
- Set `mvp_complexity` (S/M/L based on feature scope)

### 4. Lightweight Validation Research
Perform minimal web research to answer:
- **Similar apps**: What apps already exist in this space?
- **User complaints**: What are 1-2★ reviews saying about competitors?
- **Differentiation wedge**: How could this idea be positioned differently?
- **Subscription viability**: What premium features would users pay for?
- **Market evidence**: Is there user demand for this type of solution?

Cite sources in `dream_research.md`.

### 5. Apply Simplicity Bias
Default to offline-first, client-side architecture unless the idea fundamentally requires:
- Real-time collaboration
- Server-side computation
- External API integration
- User-generated content sharing

If backend/AI is required, justify explicitly in the idea description.

### 6. Generate Single Idea Output
Create the JSON artifact with:
- **Market research**: Focused trends relevant to this idea
- **Competition analysis**: Specific to this idea's domain
- **Generated ideas**: Array with exactly 1 validated idea
- **Scoring**: Rate the idea based on evidence strength and feasibility

### 7. Create Idea Pack Structure
Generate the idea pack directory and metadata:
```
runs/.../ideas/01_<slug>__<idea_id>/
├── meta/
│   ├── idea.json              # Canonical idea definition
│   ├── boundary.json          # Isolation enforcement  
│   ├── name.alias             # Human-readable name
│   └── stage_status.json      # Initial status "unbuilt"
```

## VALIDATION RULES
- Idea must support subscription monetization model
- Idea must be feasible as React Native/Expo app
- Idea must avoid excluded categories per standards
- Research must cite real sources (app store reviews, forums, etc.)
- Output must conform to stage01.json schema structure

## FAILURE CONDITIONS
Stop execution and write detailed failure if:
- Idea violates mobile app standards exclusions
- Idea cannot support subscription business model
- Idea requires prohibited technologies (crypto, medical diagnosis, etc.)
- Raw idea text is too vague to structure meaningfully
- Research finds no evidence of user demand or feasibility

## SUCCESS CRITERIA
Dream Stage 01 is complete when:
- [ ] `stage01_dream.json` validates against schema
- [ ] Contains exactly 1 idea with complete metadata
- [ ] Research citations support feasibility and demand
- [ ] Idea pack directory created with proper naming
- [ ] Standards compliance verified and documented
- [ ] Subscription monetization pathway defined

DO NOT output JSON in chat. Write all artifacts to disk only.