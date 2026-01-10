# App Factory Control Plane

**Version**: 3.1
**Status**: MANDATORY — CONSTITUTION FOR ALL CLAUDE OPERATIONS
**Applies to**: All pipeline stages, agents, and Claude interactions

---

## EXECUTION IDENTITY (CANONICAL DECLARATION)

All pipeline stages execute as **Claude Code (Opus 4.5)** in agent-native, filesystem-authoritative execution mode.

This declaration is authoritative.

---

## 🎯 PURPOSE (NON-NEGOTIABLE)

The sole purpose of the App Factory pipeline is to produce **fully polished, store-ready Expo React Native apps** that can be submitted to the Apple App Store and Google Play without additional manual work.

Stages 01–10 are tools. The final build artifact is the objective. A working, shippable mobile application is the only successful outcome.

**Conflict Resolution Rule**: If there is ever a conflict between (a) completing a stage "correctly" and (b) producing a polished, shippable app, **the shippable app always wins**.

Passing stages without producing a shippable app is a pipeline failure. Technical compliance without app store readiness violates pipeline intent.

## 🔒 EXECUTION SCOPE & EDITING MODE (MANDATORY)

This document defines behavior.  
Editing this file MUST NOT trigger execution.

Claude MUST treat all instructions in this file as specification and enforcement rules, not as commands to run immediately.

Execution only occurs when the user explicitly types a supported command listed below.  

---

## ARCHITECTURE: CLAUDE IS THE BUILDER (AGENT-NATIVE)

App Factory is an end-to-end system that researches markets, generates validated app ideas, designs UX/monetization/brand, produces launch-ready specs, and builds real React Native apps. Claude executes all stages directly within this repository without subprocess calls or hand-holding.

**Stage 01**: Executed during `run app factory` - generates 10 ranked ideas
**Stages 02-10**: Executed during `build <IDEA_ID_OR_NAME>` - builds selected idea only

### Core Execution Model
- **Claude reads** stage templates from `templates/agents/`
- **Claude reads** prior stage outputs from runs directories
- **Claude writes** JSON stage artifacts to disk with strict validation
- **Claude validates** against schemas with hard-fail on mismatch
- **Claude renders** markdown specifications automatically
- **Claude logs** execution details with binding proof
- **Claude never outputs** raw JSON in chat - only disk artifacts

### Truth Enforcement
- **Filesystem is source of truth**: If artifacts aren't on disk, it didn't happen
- **No stubs, no placeholders, no false success claims**
- **Fail fast**: Schema validation failures stop execution immediately
- **Isolation enforcement**: Each idea pack has strict boundary controls

---

## COMMAND DISPATCH (MANDATORY — NO GUESSING)

When the user types one of the supported commands, Claude MUST treat it as an immediate execution request and MUST execute the corresponding workflow defined in this repository using the stage templates and runbooks.

Claude MUST NOT:
- Attempt to locate or run binaries, scripts, or CLIs (bin/, ./pipeline.sh, make, etc.)
- Enter repo discovery mode (listing files, searching for entrypoints, guessing execution paths)
- Invent alternate commands or aliases
- Modify the command string shown to the user

The ONLY supported user-facing commands are:
- `run app factory`
- `build <IDEA_ID_OR_NAME>`
- `dream <IDEA_TEXT>`
- `validate run`
- `show status`

Once a supported command is received:
- Claude MUST immediately execute the documented algorithm
- Claude MUST NOT ask follow-up questions
- Claude MUST NOT pause between stages
- Claude MUST NOT wait for "continue"

If execution cannot proceed due to missing templates, schemas, or runbooks:
- Claude MUST hard-fail immediately
- Claude MUST write a failure artifact explaining exactly what is missing
- No partial execution, no guessing, no recovery attempts

## INTAKE CREATION POLICY (MANDATORY)

During `run app factory` execution:
- Claude MUST create `runs/.../inputs/00_intake.md`
- If the user provided a custom intake in the immediately preceding message, Claude MUST use it verbatim
- Otherwise, Claude MUST generate the intake using `python -m appfactory.intake_generator <run_id>` to ensure semantic clustering detection

**Intake Generation Requirements**:
- MUST use the intake_generator utility to enforce template rules
- MUST check for semantic clustering and regenerate vectors if needed
- MUST apply domain-lens-first sampling (3-5 domain lenses before vectors)
- MUST avoid productivity/attention as default unless user requests it
- MUST use neutrally phrased vectors spanning multiple consumer-life domains

The generated intake MUST include:
- A deterministic randomization seed
- Diverse exploration vectors (no semantic clustering)
- Market research constraints from standards and research policy

Claude MUST NOT invent ad-hoc intake formats or bypass the clustering detection system.

## EXECUTION MODE LOCK

Once a supported command is received, Claude enters Execution Mode.

In Execution Mode:
- No file exploration
- No CLI guessing
- No explanatory narration
- Only deterministic stage execution, artifact writing, validation, and logging

Claude exits Execution Mode ONLY when:
- The workflow completes successfully, OR
- A hard failure artifact is written, OR
- The user explicitly interrupts

## COMMAND INTERFACE

Claude supports exactly these commands when opened in this repository:

## COMMANDS (THE ONLY SUPPORTED UX)

### Command: `run app factory`
Generates and ranks 10 app ideas for selective building.

**Behavior (MANDATORY)**:
- Executes Stage 01 ONLY and generates EXACTLY 10 ranked app ideas
- Creates idea directories with metadata ONLY (no stages 02-10)
- Updates global leaderboard with ranked ideas
- DOES NOT execute Stages 02-10 for any idea
- DOES NOT build any apps
- Leaves ideas in "idea bin" state for later selective building

**No Auto-Continue Beyond Stage 01**:
- Stage 01 execution completes once 10 ideas are generated and ranked
- Claude MUST NOT proceed to Stages 02-10 automatically
- Ideas remain unbuilt until explicit `build <IDEA_ID_OR_NAME>` command

### Command: `build <IDEA_ID_OR_NAME>`
Builds ONE selected idea from the idea bin into a complete Expo React Native app.

**BUILD CONTRACT (MANDATORY)**:
When user runs `build <IDEA>`:

1) **Resolve the idea target**:
   - Search runs/*/meta/idea_index.json for matching slug OR name alias
   - Prefer the MOST RECENT run containing the slug
   - Identify:
     - run_dir
     - idea_dir
     - idea_id
     - idea pack path

2) **Determine completeness**:
   - If idea pack contains stages/stage02.json ... stage09.json → complete
   - If missing any stage02..stage09 → incomplete

3) **If incomplete**:
   - Execute missing stages 02..09 IN ORDER for THIS SINGLE IDEA ONLY
   - Use existing stage templates to produce outputs
   - Write outputs to:
     runs/<date>/<run_id>/ideas/<idea_dir>/stages/stage0X.json
   - Update:
     runs/<...>/ideas/<...>/meta/stage_status.json
   - Do NOT rerun Stage 01 web research
   - Do NOT touch other idea packs
   - Do NOT rebuild leaderboards during build

4) **After stage09.json exists**:
   - Execute Stage 10 app building
   - Write complete Expo app to builds/<idea_dir>/ (or repo's established build output convention)

5) **If any stage fails**:
   - Write a failure file:
     runs/<...>/ideas/<...>/meta/build_failure.md
     Include:
       - stage that failed
       - reason
       - missing input files (if any)
       - paths

**Enforces strict isolation and NO CROSS-CONTAMINATION**
**❌ Never write builds to a fixed `/mobile` directory**

### Command: `validate run`
Validates the most recent run (or current run if active):
- Confirms run_manifest.json exists and is valid
- Confirms Stage JSON artifacts exist on disk and validate against schemas
- Confirms Stage 01 produced exactly 10 ideas
- For idea bin validation: confirms metadata-only structure
- For built ideas: confirms complete stage artifacts (stages 02-10)
- Validates stage gates: all required artifacts per stage exist
- No generation. Validation only.

### Command: `dream <IDEA_TEXT>`
Transforms a raw app idea into a complete, store-ready Expo React Native app via end-to-end pipeline execution.

**Behavior (MANDATORY)**:
When user runs `dream <IDEA_TEXT>`:

1) **Parse raw idea and create run**:
   - Create new run directory: `runs/YYYY-MM-DD/dream-<timestamp>-<hash>/`
   - Write `runs/.../inputs/dream_intake.md` containing raw idea text verbatim
   - Generate deterministic run_id from idea text hash

2) **Execute Dream Stage 01 (Single Idea Validation)**:
   - Transform raw idea into structured idea pack format
   - Perform lightweight web research for validation and differentiation
   - Enforce standards exclusions and subscription viability
   - Write `runs/.../stage01_dream/stages/stage01_dream.json` 
   - Create single idea pack: `runs/.../ideas/01_<slug>__<idea_id>/`

3) **Execute Stages 02-09 automatically**:
   - Run missing stages 02-09 IN ORDER for the single idea
   - Use existing stage templates and schemas
   - Write all stage artifacts to idea pack directory

4) **Execute Stage 10 build**:
   - Build complete Expo app to `builds/<idea_dir>/<build_id>/app/`
   - Include RevenueCat integration, store-ready screens, production hygiene

**Single-Shot Execution**:
- Dream Mode executes Stages 01-10 end-to-end without pause
- No leaderboard updates (single idea, not batch generation)
- Produces ONE store-ready app from raw idea text
- MUST enforce standards exclusions and offline-first bias

### Command: `show status`
Prints the current run status using run_manifest.json and per-idea stage_status.json files.
- No generation. No mutation.

### Command Execution Semantics

## 🏗️ RUN MANIFEST CONTRACT (MANDATORY)

Every run MUST create and maintain a canonical manifest:

### Required Files
```
runs/YYYY-MM-DD/<run_name>/meta/run_manifest.json
```

### Manifest Schema (MANDATORY)
```json
{
  "run_id": "string",
  "run_name": "string", 
  "date": "ISO timestamp",
  "command_invoked": "run app factory | build <idea> | dream <idea_text>",
  "expected_idea_count": 10,
  "expected_stages_run_factory": ["01"],
  "expected_stages_build_idea": ["02","02.5","02.7","03","04","05","06","07","08","08.5","09","09.5","09.7","10.1","10"],
  "expected_stages_dream": ["01_dream","02","02.5","02.7","03","04","05","06","07","08","08.5","09","09.5","09.7","10.1","10"],
  "expected_stage_artifacts": {
    "stage01": ["stages/stage01.json", "outputs/stage01_execution.md", "spec/01_market_research.md"],
    "stage02": ["stages/stage02.json", "outputs/stage02_execution.md", "spec/02_product_spec.md"],
    "stage02.5": ["stages/stage02.5.json", "outputs/stage02.5_execution.md", "product/core_loop.md", "product/domain_model.json", "product/mvp_scope.md"],
    "stage02.7": ["stages/stage02.7.json", "outputs/stage02.7_execution.md", "technical/navigation_plan.json", "technical/dependency_plan.json", "technical/compatibility_matrix.md"],
    "stage03": ["stages/stage03.json", "outputs/stage03_execution.md", "spec/03_ux_design.md", "uiux/uiux_prompt.md", "uiux/design_tokens.json", "uiux/component_inventory.md", "uiux/interaction_expectations.md"],
    "stage04": ["stages/stage04.json", "outputs/stage04_execution.md", "spec/04_monetization.md"],
    "stage05": ["stages/stage05.json", "outputs/stage05_execution.md", "spec/05_architecture.md"],
    "stage06": ["stages/stage06.json", "outputs/stage06_execution.md", "spec/06_builder_handoff.md"],
    "stage07": ["stages/stage07.json", "outputs/stage07_execution.md", "spec/07_polish.md"],
    "stage08": ["stages/stage08.json", "outputs/stage08_execution.md", "spec/08_brand.md"],
    "stage08.5": ["stages/stage08.5.json", "outputs/stage08.5_execution.md", "spec/08.5_visual_identity_assets.md", "assets/asset_concept.md", "assets/assets_quality_checklist.md", "assets/svg/icon.svg", "assets/svg/adaptive-icon-foreground.svg", "assets/svg/splash.svg"],
    "stage09": ["stages/stage09.json", "outputs/stage09_execution.md", "spec/09_release_planning.md"],
    "stage09.5": ["stages/stage09.5.json", "outputs/stage09.5_execution.md", "runtime/boot_sequence.json", "runtime/flow_validation.json", "runtime/error_scenarios.json", "runtime/sanity_checklist.md"],
    "stage09.7": ["stages/stage09.7.json", "outputs/stage09.7_execution.md", "app/_contract/build_contract.json", "app/_contract/build_prompt.md", "app/_contract/contract_sources.json"],
    "stage10.1": ["stages/stage10.1.json", "outputs/stage10.1_execution.md", "design/authenticity_report.md", "design/implementation_plan.json", "design/visual_consistency_check.json"],
    "stage10": ["stages/stage10.json", "outputs/stage10_build.log"],
    "stage01_dream": ["stages/stage01_dream.json", "outputs/stage01_dream_execution.md", "dream_research.md"]
  },
  "idea_index_path": "meta/idea_index.json",
  "leaderboard_paths": ["leaderboards/app_factory_all_time.json", "leaderboards/app_factory_all_time.csv"],
  "builds_root": "builds/",
  "per_idea": {
    "idea_id_001": {
      "idea_dir": "01_idea_name__idea_id_001",
      "status": "unbuilt|building|built|failed",
      "stages_completed": ["list of completed stages"],
      "missing_artifacts": ["list of missing files"],
      "build_id": "string|null"
    }
  },
  "run_status": "running|failed|completed",
  "failure": null | {
    "idea_id": "string",
    "idea_dir": "string", 
    "stage": "string",
    "reason": "string",
    "artifact_paths": ["list"]
  }
}
```

### Manifest Updates (MANDATORY)
- **Create**: At run start with initial structure
- **Update**: After each stage completion
- **Final**: Mark run_status as "completed" or "failed"
- **Fail Fast**: If any stage fails, update failure object and stop

## 🌐 GLOBAL LEADERBOARD (CROSS-RUN, APPEND-ONLY)

### Purpose
App Factory MUST maintain a global, cross-run leaderboard that aggregates all app ideas generated across all runs, using Stage 01 ranking signals.

This leaderboard exists for:
- long-term idea quality tracking
- analytics
- external tools (e.g. App Miner)
- dashboards

It MUST NOT affect downstream stages.

### Canonical Files (MANDATORY)
```
leaderboards/
  app_factory_all_time.json   # raw append-only audit log
  app_factory_all_time.csv    # raw audit log mirror
  app_factory_global.json     # derived global ranking
  app_factory_global.csv      # derived global ranking mirror
```

### When the Leaderboard Is Updated
- The raw leaderboard MUST be updated immediately after Stage 01 completes successfully
- The global leaderboard MUST be rebuilt after raw leaderboard append succeeds
- It MUST NOT wait for Stages 02–09
- If Stage 01 fails, the leaderboards MUST NOT be modified
- If global rebuild fails, Stage 01 execution MUST be considered failed

### Leaderboard Entry Rules

#### Raw Leaderboard (Append-Only Audit)
- One entry per idea per run (10 entries per successful Stage 01)
- Append-only. Never rewrite or re-rank historical entries
- Identity key: idea_id + run_id
- Field `rank` represents per-run ranking (1-10)
- Each entry MUST include:
  - run_id
  - run_date
  - rank (1–10, local to the run)
  - score (if available)
  - idea_id
  - idea_name
  - idea_slug
  - market
  - target_user
  - core_loop
  - evidence_summary
  - source paths to the originating run + stage01.json

#### Global Leaderboard (Derived Ranking)
- Rebuilt deterministically after every Stage 01 completion
- All entries from raw leaderboard, sorted globally
- Adds `global_rank` field (1..N across all entries)
- Preserves original `rank` as `run_rank`
- Same data fields as raw, plus ranking enrichment

### Sorting Semantics (GLOBAL VIEW)
Global ordering is defined as:
1. score (descending, missing scores treated as -1)
2. run_date (descending)
3. rank (ascending, per-run rank as tiebreaker)
4. idea_id (ascending)
5. run_id (ascending)

### Isolation Rule (CRITICAL)
- Stages 02–10 MUST NOT read from the leaderboard
- The leaderboard is write-only at Stage 01 and read-only for humans and external tools
- Idea packs remain fully isolated
- **Leaderboard updates happen ONLY during `run app factory` (Stage 01)**
- **Individual builds via `build <idea>` NEVER affect the leaderboard**
- Leaderboard serves as discovery and ranking surface, not build tracking

### Failure Handling
If leaderboard append fails:
- Write `leaderboards/leaderboard_failure.md` with:
  - run_id
  - missing/invalid fields
  - remediation steps
- Stop execution immediately

If global leaderboard rebuild fails:
- Write `leaderboards/global_rebuild_failure.md` with:
  - run_id
  - rebuild error details
  - remediation steps
- Stop execution immediately

**Output Structure (After `run app factory`)**:
```
runs/YYYY-MM-DD/<run_name>/
  stage01/stages/stage01.json (10 ideas)
  ideas/01_focusflow_ai__focus_ai_001/meta/ (idea bin - metadata ONLY)
  ideas/02_deepwork_zones__deep_work_002/meta/ (idea bin - metadata ONLY)  
  ...10 idea directories with metadata only (no stages 02-10)
  meta/idea_index.json
  meta/run_manifest.json
```

## 🚪 STAGE GATES (DEFINITION OF DONE)

### Stage Completion Requirements
For each stage to be considered complete, ALL artifacts MUST exist:

#### Stage 01 Gates
- [ ] `stage01/stages/stage01.json` exists and validates against schema
- [ ] Contains EXACTLY 10 ideas with unique idea_ids
- [ ] `stage01/outputs/stage01_execution.md` exists
- [ ] `stage01/spec/01_market_research.md` rendered
- [ ] Raw leaderboard updated with 10 new entries
- [ ] Global leaderboard rebuilt successfully
- [ ] `meta/idea_index.json` created
- [ ] 10 idea pack directories created with proper naming

#### Stages 02-09 Gates (Per Selected Idea Only)
For the ONE idea being built via `build <IDEA_ID_OR_NAME>`:
- [ ] `ideas/<idea_dir>/stages/stageNN.json` exists and validates
- [ ] `ideas/<idea_dir>/outputs/stageNN_execution.md` exists
- [ ] `ideas/<idea_dir>/spec/NN_*.md` rendered
- [ ] `ideas/<idea_dir>/meta/stage_status.json` updated
- [ ] JSON includes required meta fields (run_id, idea_id, boundary_path)

#### Stage 09 Additional Gates
- [ ] ASO package completed with store-ready metadata
- [ ] Launch planning completed with realistic timelines
- [ ] Release specifications ready for Stage 10 consumption

## LEGACY BATCH SEMANTICS (NON-USER-VISIBLE)
Historical internal behavior for reference only:
- Batch completion concepts exist in schemas for internal validation
- No user-facing batch commands or success criteria
- All user interaction occurs via selective execution model

## 📱 STAGE 10: MOBILE APP GENERATION (DIRECT BUILD)

Stage 10 directly generates complete, production-ready Expo React Native apps:

### Stage 10 Responsibilities  
- Read ONLY that idea's Stage 02–09 JSON artifacts (direct consumption)
- Enforce strict idea boundary and meta field consistency
- Perform bounded web research for Expo Router, RevenueCat, Firebase patterns
- Scaffold, implement, and finalize complete Expo app with all features
- Integrate RevenueCat SDK correctly for subscription functionality
- Apply brand identity, UX design, and ASO metadata throughout
- **Accountability**: If upstream stages fail to provide sufficient inputs to produce a polished app, Stage 10 MUST fail the run and identify the upstream violation

### Build Output Contract (IMMUTABLE)
Stage 10 MUST output to:
```
builds/<idea_dir>/<build_id>/app/
```

Where:
- `idea_dir` = deterministic Finder-friendly name from idea pack
- `build_id` = deterministic hash from run_id + idea_id + stage02-09 hashes

### Required Build Artifacts
- `builds/<idea_dir>/<build_id>/app/` - Complete Expo React Native app
- `builds/<idea_dir>/<build_id>/build_log.md` - Build execution log
- `builds/<idea_dir>/<build_id>/sources.md` - Research citations
- `runs/.../ideas/<idea_dir>/stages/stage10.json` - Build plan
- `runs/.../ideas/<idea_dir>/outputs/stage10_build.log` - Binding proof

## 📘 README ENFORCEMENT (UX CONSISTENCY)

README.md MUST present only these two user-facing commands:
- `run app factory`
- `build <IDEA_NAME>`

Any mention of:
- `run app factory (batch specs)`
- or other variants

MUST be removed or treated as internal aliases only.

### IMPLEMENTATION NOTE (NON-NEGOTIABLE)
Internally, "batch specs mode" may still exist as a concept, but it MUST be implicit and default.

Concretely:
- `run app factory` == batch workflow
- No other modes are user-visible
- CLAUDE.md and README.md must agree

---

## RUN DIRECTORY CONTRACT

### Idea Generation Structure
`run app factory` creates this structure:

```
runs/YYYY-MM-DD/<run_name>/
├── inputs/
│   └── 00_intake.md                    # User requirements input
├── stage01/                           # Market research (shared)
│   ├── stages/stage01.json            # 10 validated app ideas  
│   ├── outputs/stage01_execution.md
│   └── spec/01_market_research.md
├── ideas/                             # Idea bin (metadata only)
│   ├── 01_focusflow_ai__focus_ai_001/
│   │   └── meta/
│   │       ├── idea.json              # Canonical idea definition
│   │       ├── boundary.json          # Isolation enforcement
│   │       ├── name.alias             # Human-readable name
│   │       └── stage_status.json      # Shows "unbuilt" status
│   ├── 02_deepwork_zones__deep_work_002/
│   │   └── meta/ [same metadata structure]
│   └── ...10 idea directories with metadata only
└── meta/
    ├── idea_index.json                # ID->name->directory mapping
    ├── run_manifest.json              # Run metadata
    └── batch_status.json              # Overall progress
```

### Build Mode Structure  
`build app <IDEA_ID_OR_NAME>` adds to the selected idea:

```
builds/<idea_dir>/<build_id>/app/      # Complete Expo app
├── package.json                   
├── app.json
├── App.js
├── src/screens/...
└── README.md

builds/<idea_dir>/<build_id>/
├── build_log.md                       # Build execution log
└── sources.md                         # Sources consulted

runs/.../ideas/<idea_dir>/             # Adds to selected idea only
├── stages/
│   ├── stage02.json...stage10.json   # All stages 02-10
├── outputs/ 
│   ├── stage02_execution.md...stage10_build.log
└── spec/
    └── 02_product_spec.md...10_mobile_app.md
```

### Dream Mode Structure
`dream <IDEA_TEXT>` creates end-to-end pipeline:

```
runs/YYYY-MM-DD/dream-<timestamp>-<hash>/
├── inputs/
│   └── dream_intake.md                # Raw idea text verbatim
├── stage01_dream/                     # Dream Stage 01 (single idea validation)
│   ├── stages/stage01_dream.json      # Single validated app idea
│   ├── outputs/stage01_dream_execution.md
│   └── dream_research.md              # Lightweight validation research
├── ideas/                             # Single idea pack
│   └── 01_<slug>__<idea_id>/
│       ├── stages/
│       │   ├── stage02.json...stage10.json  # Complete pipeline stages
│       ├── outputs/
│       │   ├── stage02_execution.md...stage10_build.log
│       ├── spec/
│       │   └── 02_product_spec.md...10_mobile_app.md
│       └── meta/
│           ├── idea.json, boundary.json, stage_status.json
└── meta/
    ├── idea_index.json                # Single idea mapping  
    └── run_manifest.json              # Dream run metadata

builds/<idea_dir>/<build_id>/app/      # Complete store-ready Expo app
├── package.json, app.json, App.js
├── src/screens/... (onboarding, paywall, settings)
└── RevenueCat integration + production hygiene
```

### Finder-Friendly Naming (MANDATORY)
Idea directories use deterministic naming: `<rank>_<idea_slug>__<idea_id>`
- `rank`: 01-10 from Stage 01 ranking  
- `idea_slug`: sanitized name (lowercase, underscores, alphanumeric only)
- `idea_id`: canonical ID from Stage 01
- Example: `01_focusflow_ai__focus_ai_001`

### IDEA BIN SEMANTICS (CRITICAL STATE)

After `run app factory` completes, ideas exist in the **IDEA BIN** state:

**What the Idea Bin Contains**:
- 10 idea directories with deterministic naming
- Metadata only: `idea.json`, `boundary.json`, `stage_status.json` 
- `stage_status.json` shows status "unbuilt"
- NO specification artifacts (stages/, outputs/, spec/ directories are empty/missing)
- NO built apps (builds/ directory empty for these ideas)

**Idea Bin Purpose**:
- Discovery surface for ranked app ideas
- Selective building entry point  
- Token efficiency through choice
- No commitment until explicit `build` command

**Transition Out of Idea Bin**:
- Only via explicit `build <IDEA_ID_OR_NAME>` command
- Builds EXACTLY ONE idea from unbuilt to fully built
- Other 9 ideas remain in idea bin state (unchanged)

---

## INCOMPLETE IDEA PACKS (MANDATORY BUILD PATH)

**Stage 01 Output State**:
- Stage 01 may exist without Stages 02–09
- That is NORMAL and EXPECTED behavior
- `run app factory` creates idea packs with metadata ONLY
- Ideas remain in "idea bin" state until `build <IDEA>` is executed

**Build Command Responsibility**:
- `build <IDEA>` is responsible for completing the idea pack by running missing stages
- Only Stage 10 requires stages 02–09 — but build will generate them if absent
- If stages/ directory is missing: create runs/<...>/ideas/<...>/stages/ before executing Stage 02
- Do NOT treat missing stages 02-09 as an error during build

**No Leaderboard Side Effects During Build**:
- During `build <IDEA>`, leaderboard append/rebuild MUST NOT run
- Leaderboards are a Stage 01 post-process only
- Build operations are isolated from global state changes

---

## ISOLATION AND BOUNDARY ENFORCEMENT

### Idea Pack Boundaries (MANDATORY)
Each idea pack in `runs/.../ideas/<idea_dir>/` has strict isolation:

**Allowed Paths** (per idea pack):
- `runs/.../ideas/<idea_dir>/` - ONLY this specific idea directory  
- `runs/.../stage01/stages/stage01.json` - lookup/confirmation only
- `runs/.../meta/idea_index.json` - lookup only

**Forbidden Paths**:
- `runs/.../ideas/` (other idea directories)
- Any other runs directories
- Any stage JSON files outside the idea pack's boundary

**Enforcement**:
- Every Stage 02-10 JSON MUST include meta fields:
  ```json
  "meta": {
    "run_id": "string",
    "idea_id": "string", 
    "idea_name": "string",
    "idea_dir": "string",
    "source_root": "runs/.../ideas/<idea_dir>/",
    "input_stage_paths": ["explicit list of files read"],
    "boundary_path": "runs/.../ideas/<idea_dir>/meta/boundary.json"
  }
  ```

**Cross-Contamination Prevention**:
- Stage 10 MUST verify all consumed Stage 02-09 JSONs have identical run_id and idea_id
- Stage 10 MUST verify all paths reside under the correct idea pack directory
- If mismatch detected: write `stage10_failure.md` and stop without building

### Stage Execution Contract

#### Stage 01 (Market Research) 
- Generates EXACTLY 10 ideas with unique idea_ids
- Validation fails if count != 10
- Creates shared stage01 directory structure
- Creates idea_index.json mapping

#### Stages 02-09 (Build Mode Only)
**Executed ONLY during `build <IDEA_ID_OR_NAME>` for selected idea:**

**Single Idea Execution (MANDATORY)**:
- Execute missing stages 02-09 IN ORDER for THIS SINGLE IDEA ONLY
- Create stages/ directory if missing: `runs/.../ideas/<idea_dir>/stages/`
- Read: `runs/.../ideas/<idea_dir>/meta/idea.json` (canonical idea)
- Read: `runs/.../stage01/stages/stage01.json` (lookup only)
- Read: Prior stage JSONs from same idea pack only
- Write: `runs/.../ideas/<idea_dir>/stages/stageNN.json` 
- Validate: Against schema with boundary enforcement
- Log: `runs/.../ideas/<idea_dir>/outputs/stageNN_execution.md`
- Render: `runs/.../ideas/<idea_dir>/spec/NN_*.md`
- Update: `runs/.../ideas/<idea_dir>/meta/stage_status.json`

**Isolation Rules**:
- Do NOT rerun Stage 01 web research
- Do NOT touch other idea packs
- Do NOT rebuild leaderboards during build

#### Stage 09.7: Build Contract Synthesis (MANDATORY PRE-STAGE 10 GATE)
**Executed AFTER Stage 09.5 and BEFORE Stage 10**:
- Execute: `scripts/build_contract_synthesis.sh <idea_dir>`
- Synthesize: ALL stage 02-09.5 outputs into single build contract
- Generate: `app/_contract/build_prompt.md` (authoritative build instructions)
- Generate: `app/_contract/build_contract.json` (normalized structured data)
- Generate: `app/_contract/contract_sources.json` (traceability manifest)
- Validate: `scripts/verify_build_contract_present.sh` AND `scripts/verify_build_contract_sections.sh`
- **Hard Gate**: Stage 10 CANNOT proceed without complete, validated build contract

#### Stage 10 (Build Mode - Contract Driven)
- Triggered by: `build app <IDEA_ID_OR_NAME>` (AFTER Stage 09.7 completes)
- **MANDATORY Gate**: Run build contract verifiers before ANY code generation
- Reads: ONLY `app/_contract/build_prompt.md` (sole authoritative source)
- **FORBIDDEN**: Reading individual stage JSONs (stage02.json through stage09.json)
- Validates: Build contract completeness and traceability
- Writes: Complete Expo app to `builds/<idea_dir>/`
- Proves: Full implementation of contract specifications with no improvisation

---

## DEFINITION OF DONE

### Idea Generation Mode (`run app factory`)
**MUST verify ALL of these before claiming completion:**

**Run Manifest**:
- [ ] `runs/.../meta/run_manifest.json` exists and tracks progress
- [ ] `run_status` marked as "completed" (not "failed" or "running")

**Stage 01 Complete**:
- [ ] `runs/.../stage01/stages/stage01.json` exists with EXACTLY 10 ideas
- [ ] Each idea has unique idea_id
- [ ] `runs/.../meta/idea_index.json` created with rank/slug/directory mapping
- [ ] Global leaderboard updated with 10 new entries

**Idea Bin Populated**:
- [ ] 10 directories: `runs/.../ideas/01_*__*/ ... 10_*__*/`
- [ ] Each has `meta/idea.json`, `meta/boundary.json`, `meta/stage_status.json`
- [ ] Each `stage_status.json` shows status "unbuilt"
- [ ] NO stages/stageNN.json files exist (stages 02-10)
- [ ] NO outputs/ or spec/ directories exist (reserved for build mode)

**Completion Semantics**:
- Stage 01 execution completes once all 10 ideas are ranked and in idea bin
- NO automatic progression to Stages 02-10
- Ideas remain unbuilt until explicit `build <IDEA_ID_OR_NAME>` command

### Build Mode (`build app <IDEA_ID_OR_NAME>`)
**MUST verify ALL of these:**

**Build Contract Artifacts (Stage 09.7)**:
- [ ] `runs/.../ideas/<idea_dir>/stages/stage09.7.json` exists
- [ ] `runs/.../ideas/<idea_dir>/app/_contract/build_contract.json` exists and validates
- [ ] `runs/.../ideas/<idea_dir>/app/_contract/build_prompt.md` exists with all 14 required sections
- [ ] `runs/.../ideas/<idea_dir>/app/_contract/contract_sources.json` exists with source traceability
- [ ] `scripts/verify_build_contract_present.sh <idea_dir>` passes
- [ ] `scripts/verify_build_contract_sections.sh <idea_dir>` passes

**Final App Artifacts (Stage 10)**:
- [ ] `builds/<idea_dir>/<build_id>/app/` exists with complete Expo app
- [ ] `builds/<idea_dir>/<build_id>/app/package.json` has required dependencies  
- [ ] `builds/<idea_dir>/<build_id>/app/src/` contains screens, components, services
- [ ] `builds/<idea_dir>/<build_id>/build_log.md` (execution log)
- [ ] `builds/<idea_dir>/<build_id>/sources.md` (research citations)
- [ ] `runs/.../ideas/<idea_dir>/stages/stage10.json` (plan-only JSON)
- [ ] `runs/.../ideas/<idea_dir>/outputs/stage10_build.log` (binding proof)
- [ ] Build contract consumption verified (no individual stage JSON reading)

**CRITICAL**: If ANY artifact is missing, Claude MUST write failure report and stop.

---

## ERROR HANDLING

### Schema Validation Failures
1. Read validation error from `python -m appfactory.schema_validate`
2. Fix JSON output to conform to schema
3. Re-validate (maximum 3 attempts)
4. If still failing, write detailed error to execution log and stop

### File Write Failures  
1. Check directory permissions
2. Verify disk space
3. Try alternative file path if needed
4. Log failure details and stop if unrecoverable

### Missing Dependencies
1. Check that previous stages completed successfully
2. Verify required input files exist
3. Log missing dependencies and stop

---

## STAGE TEMPLATES CONTRACT

All templates in `templates/agents/` must be agent-native compatible:

### Required Template Structure
```markdown
# Stage NN: [Name]

## AGENT-NATIVE EXECUTION
You are Claude executing this stage directly. Write artifacts to disk.

## INPUTS
- Read: runs/.../stages/stage*.json (previous stages)
- Read: runs/.../inputs/00_intake.md

## OUTPUTS
- Write: runs/.../stages/stageNN.json
- Write: runs/.../outputs/stageNN_execution.md  
- Render: runs/.../spec/NN_*.md

## JSON SCHEMA
[Schema definition]

## EXECUTION STEPS
1. Read inputs from run directory
2. Generate JSON conforming to schema  
3. Write and validate JSON file
4. Log execution details
5. Render specification markdown

DO NOT output JSON in chat. Write to disk only.
```

### Forbidden Template Patterns
- ❌ "Respond with ONLY JSON"
- ❌ "Output raw JSON"
- ❌ References to subprocess execution
- ❌ Instructions to print JSON to stdout

---

## VALIDATION AND UTILITIES

### Schema Validation
```bash
python -m appfactory.schema_validate <schema_path> <json_path>
```
Returns exit code 0 on success, non-zero on failure.

### Markdown Rendering  
```bash
python -m appfactory.render_markdown <stage_num> <stage_json_path>
```
Renders templates to specification markdown.

### Status Checking
```bash
python -m appfactory.paths current_run
python -m appfactory.paths validate_structure <run_path>
```

---

## DEFAULT APP COMPLEXITY BIAS (MANDATORY)

App Factory MUST default to generating and favoring apps that are:

- Client-side or offline-first by default
- Minimal or no backend servers
- Minimal or no AI API usage
- Low ongoing operational cost
- Simple data models
- Deterministic logic over probabilistic AI where possible

These apps are PRIORITIZED because the goal is:
- Quantity of shippable apps
- Low marginal cost per app
- Faster iteration
- Discovery of "sticky" winners

### HEAVY BACKEND / AI APPS (EXCEPTION ONLY)

Apps that require:
- Dedicated backend servers
- Complex databases
- Continuous AI inference
- Paid third-party APIs

MUST be treated as **EXCEPTIONS**, not defaults.

They may ONLY be generated when:
- Market evidence is materially stronger than simpler alternatives
- Subscription pricing clearly supports higher operating costs
- The value proposition collapses without backend or AI

When such an app is generated, Stage 01 MUST explicitly justify:
- Why a simpler, client-side version is insufficient
- Why cost is acceptable relative to expected revenue

### SCORING & PRIORITIZATION RULE

During Stage 01 ranking:
- Simple, client-side apps with similar evidence MUST rank higher
- Lower MVP complexity MUST be favored when scores are close
- AI-heavy or backend-heavy apps MUST be penalized unless strongly justified

This is a WEIGHTING CHANGE, not a schema change.

## GLOBAL CONSTRAINTS

### Technology Stack (Stage 10)
- React Native with Expo (latest stable)
- TypeScript for type safety
- RevenueCat for subscriptions
- React Navigation for navigation
- AsyncStorage for persistence

### Business Requirements
- Subscription-only monetization
- Guest-first authentication
- iOS + Android support
- Store submission ready
- GDPR/CCPA compliant

### File Naming Conventions
- Stage files: `stageNN.json` (zero-padded)
- Execution logs: `stageNN_execution.md`
- Validation files: `stageNN_validation.json`
- Specs: `NN_descriptive_name.md`

---

## INTERPRETATION RULE (PIPELINE INTENT)

When instructions, schemas, or templates are ambiguous, they MUST be interpreted in the way that most directly supports producing a polished, production-quality mobile app.

UX completeness, design consistency, accessibility, onboarding completeness, monetization correctness, and App Store readiness take precedence over minimal compliance.

A technically "passing" run that produces a non-shippable app violates pipeline intent.

---

## STANDARDS CONTRACT

### Mobile App Best Practices (PIPELINE-BLOCKING)
**File**: `standards/mobile_app_best_practices_2026.md`
**Status**: READ-ONLY and MANDATORY for all stages

This standards file is PIPELINE-BLOCKING:
- **Stages 01**: Must respect excluded categories and business model constraints
- **Stages 02-10**: Must include "Standards Compliance Mapping" section in execution log and/or rendered spec
- **All stages**: Must halt pipeline if mandatory requirements cannot be met

Violation of any mandatory standard results in immediate pipeline failure.

### Template Execution Rules
All stage templates are agent-native and must:
- Write JSON artifacts to disk with schema validation
- Generate execution logs with research citations where applicable  
- Render specification markdown
- Update stage status tracking
- Hard-fail with detailed error reports if validation fails

---

## PIPELINE-LEVEL INVARIANT: Asset Contract + Deterministic Placeholder Generation
(MANDATORY FOR EVERY RUN, Stages 02–10)

### Purpose
All assets referenced by Expo configuration must exist on disk before Stage 10 build.
If the product/brand stage has not delivered final assets yet, the pipeline must generate deterministic placeholders using a defined, guaranteed toolchain, and record them as build artifacts.

### Asset Contract (Authoritative)
At the start of Stage 07 and enforced again at Stage 10, the pipeline must:

Parse and enumerate all image asset references from:
- `app.json`, `app.config.js/ts`
- expo fields (icon, splash, adaptiveIcon, notification icon, etc.)
- Any platform-specific assets (iOS/Android)

Produce a single file:
```
app/_assets/asset_contract.json
```

With:
- `type` (icon, splash, adaptiveIconForeground, adaptiveIconBackground, favicon, notificationIcon, etc.)
- `path`
- `required_dimensions` (if applicable)
- `format` (png, jpg)
- `source` (which config field referenced it)
- `status` (present | missing | generated)
- `sha256`

### Preflight Gate (Build-Blocking)
Before Stage 10 runs `npm install`, `expo install --check`, or any native build step, it must run:
```
ASSET_PREFLIGHT_CHECK
```

Verify every referenced asset path exists.
Verify file format matches expected type (PNG where required).
Verify dimensions meet minimum requirements (e.g., icon should be 1024×1024 PNG).

If any required asset is missing:
- The pipeline must generate placeholders deterministically
- Re-run ASSET_PREFLIGHT_CHECK
- Only proceed if the check passes

### Deterministic Placeholder Generator (No Tool Guessing Allowed)
The pipeline must not "try random tools" (convert) at build time.

Instead, it must define one canonical generator and use it everywhere.

**Canonical generator rule**:
- **Preferred**: Node-based generator (no OS assumptions) using a small dependency such as `sharp`.
- **Allowed fallback**: macOS `sips` only if Node-based generation is unavailable.
- **Disallowed**: "hope ImageMagick exists."

**Requirement**: The pipeline must implement (or vendor) a script:
```
scripts/generate_placeholders_assets.mjs
```

That generates (at minimum):
- `icon.png` (1024×1024)
- `adaptive-icon.png` foreground if needed
- `splash.png` (at least 1284×2778 or appropriate baseline)
- `favicon.png` if web is enabled

All generated assets must:
- Be valid PNGs
- Match required dimensions
- Use a deterministic style (e.g., single solid background + centered label)
- Be written to the exact paths referenced by config

### Proof Artifacts (Non-Negotiable)
The pipeline must write:
```
app/_assets/asset_contract.json
app/_assets/asset_generation_log.md
```

`asset_generation_log.md` must include:
- What was missing
- What was generated
- Tool used (node/sharp or sips)
- Paths + hashes

### Final Rule
**Stage 10 must never discover missing assets.**
If Stage 10 finds missing assets, that is a pipeline violation.

---

## PIPELINE-LEVEL INVARIANT: Canonical Docs + Upstream Reference Synchronization
(MANDATORY FOR EVERY RUN, Stages 02–10)

### Status
**NON-OPTIONAL · NON-BYPASSABLE · AUTO-ENFORCED ON EVERY PIPELINE EXECUTION**

This policy is a core pipeline invariant. It is not a suggestion, not a prompt option, and not dependent on any user command.
It is executed automatically for every run, including partial runs, and enforced as a build-blocking gate.

No stage, agent, or partial execution is exempt.

### Purpose (Global, Always-On)
Every build must be grounded in authoritative, locally cached sources that already exist inside the repository.

The system must never rely on:
- Model memory
- Inference
- Prior runs as implicit truth
- External browsing without local persistence
- Undocumented assumptions

Applies to:
- Fresh builds
- Regenerations
- Partial stage runs
- Fix-up / recovery runs
- CI or local executions

### Source-of-Truth Hierarchy (HARD ORDER)
No stage may violate or reorder this hierarchy:

1. **Expo SDK compatibility rules** (hard gate, build-blocking)
2. **Locally cached Expo + RevenueCat documentation** (canonical vendor docs + run-layer extensions)
3. **Locally cached React Native upstream references** (facebook/react-native cache)
4. **Application code**

If two sources conflict, the higher item always wins.

### PART A — Canonical Documentation Directories
(Bound to existing repo structure; enforced on every run)

#### 1) Canonical docs locations (EXISTING + REQUIRED)
The pipeline must treat these existing repo directories as canonical:
```
vendor/expo-docs/
vendor/revenuecat-docs/
```

These are authoritative and must be referenced during every run.
They are not optional, not replaceable, and not advisory.

**RevenueCat canonical anchor (explicit)**:
`vendor/revenuecat-docs/` must include (and the pipeline must reference) the RevenueCat LLM index file (commonly `llms.txt`) as the canonical map of doc endpoints and .md mirrors.

#### 2) Mandatory run extension layer (PER RUN)
In addition to vendor docs, every run must create and maintain:
```
app/_docs/
app/_docs/INDEX.md
app/_docs/sources.json
```

**Purpose**:
- Run-specific augmentation layer
- Stores any additional docs required by the run (including gaps not covered by vendor docs)
- Links back to vendor canonical docs rather than duplicating unnecessarily

🚫 If either the vendor docs OR `app/_docs/` is missing, incomplete, or stale, the run is invalid.

#### 3) Required documentation coverage (EVERY RUN)

**Expo (SDK compatibility + modules)**:
The pipeline must ensure Expo documentation exists locally:
- Prefer `vendor/expo-docs/`
- Supplement into `app/_docs/` only if gaps exist

Coverage must include:
- Expo SDK compatibility & upgrade rules
- `expo install --check` behavior
- Expo module versioning expectations

**Rules**:
- If present in vendor docs: reference it (do not duplicate).
- If missing/outdated: add to `app/_docs/` and link back in `INDEX.md`.

**RevenueCat (React Native SDK)**:
The pipeline must treat `vendor/revenuecat-docs/` as canonical and must reference it directly during builds.

If additional RevenueCat material is required beyond vendor docs:
- Add to `app/_docs/`
- Link back in `app/_docs/INDEX.md`
- Update `app/_docs/sources.json` accordingly

**React Native iOS (archive + upstream)**:
RN iOS documentation must be available locally, sourced from:
- Archived RN docs (if already vendored, reference them)
- Upstream GitHub references via the upstream cache (Part B)

These may live in:
- `vendor/` (if already present)
- `app/_docs/` (if newly fetched during this run)

#### 4) Docs manifest (NON-NEGOTIABLE)
Every document referenced during the run—vendor or newly added—must be registered in:
```
app/_docs/sources.json
```

Each entry must include:
- `url` (original source; null allowed only for vendor docs with repo-local provenance)
- `local_path`
- `downloaded_at_iso` OR `verified_at_iso` (vendor docs use verified)
- `sha256`
- `used_for` (stage(s) + decision supported)

`app/_docs/INDEX.md` must summarize:
- Which Expo docs were used (vendor vs added)
- Which RevenueCat docs were used (vendor vs added)
- Which RN references were used
- How each influenced decisions in this run

### PART B — React Native Upstream Reference Cache
(Auto-executed and enforced on every run)

#### 5) Mandatory upstream cache
The pipeline must create and maintain:
```
app/_upstream/react-native/
app/_upstream/react-native/manifest.json
app/_upstream/react-native/INDEX.md
```

This cache is:
- Read-only
- Reference-only
- Never vendored into app code

#### 6) Authorized upstream sources
Explicitly authorized:
- `https://github.com/facebook/react-native`
- `https://github.com/facebook/react-native-website` (docs source)

#### 7) Usage rules
Upstream files must be pulled whenever needed for authoritative clarification on:
- iOS native modules
- Autolinking
- CocoaPods/build scripts
- New Architecture
- Hermes
- App extensions
- Native build tooling edge cases

🚫 Guessing is forbidden.

Every pulled file must be recorded in `manifest.json` with:
- `source_repo`
- `source_ref`
- `source_path`
- `local_path`
- `sha256`
- `reason` (stage + decision)

### PART C — Expo Is the Hard Compatibility Gate
(Stage 10, build-blocking, no bypass)

#### 8) Absolute Expo rule
Before any dependency install:
- Identify Expo SDK version
- Run: `npx expo install --check`
- Treat expected versions output as authoritative

**Hard failures**:
- Silencing errors with resolutions
- Upgrading Expo to chase dependencies
- Pinning versions that conflict with Expo expectations

#### 9) Mandatory install loop
Only allowed sequence:
1. Confirm Expo SDK
2. Run `expo install --check`
3. Align mismatches to expected versions
4. Re-run until clean
5. Then `npm install` / `npm ci`

### PART D — RevenueCat Integration Rules
(Always enforced)

RevenueCat integration must follow locally cached docs in:
- `vendor/revenuecat-docs/` (canonical)
- plus any run extensions in `app/_docs/`

Implementation must:
- Fetch Offerings at runtime
- Gate features strictly via Entitlements
- Provide restore purchases UI
- Handle offline/error states
- Prevent paywall bypass

### PART E — Stage Usage Rules (02–10)

**Stages 02–09**:
May consult vendor docs, `app/_docs`, and upstream cache.

**Stage 10 (Build)**:
MUST consult:
- `vendor/expo-docs/`
- `vendor/revenuecat-docs/`
- `app/_upstream/react-native/`

MUST cite local files in `build_log.md`

🚫 Any uncached reference is invalid.

### PART F — Required Proof Artifacts
(Build cannot complete without these)

`build_log.md` must include:
- Expo SDK version
- Summary of `expo install --check`
- Dependency mismatch → expected → fix table
- Links to:
  - `vendor/expo-docs/`
  - `vendor/revenuecat-docs/`
  - `app/_docs/INDEX.md`
  - `app/_upstream/react-native/INDEX.md`

### PART G — Pipeline Enforcement (AUTO-RUN, EVERY RUN)

#### 10) Mandatory pipeline step (NO PROMPTING)
`UPSTREAM_REFERENCE_SYNC` is an automatic pipeline hook.
It runs without asking the user.

**Execution**:
- **Stage 02 start**: `scripts/upstream_reference_sync.sh` (initialize cache infrastructure)
- **Stage 10 start**: `scripts/rn_upstream_cache.sh proactive` (pull common build references)
- **Stage 10 preflight**: `scripts/verify_rn_upstream_usage.sh` (verify cache usage)

**The run fails if**:
- Vendor docs are missing
- `app/_docs` is missing/incomplete
- `app/_upstream/react-native` is missing or invalid
- Upstream cache manifest lacks required fields
- Stage 10 cites uncached upstream sources
- Any stage attempts to bypass this by asking "which command should I run"

### FINAL HARD RULE (GLOBAL)
Claude must never rely on memory, inference, or undocumented assumptions for Expo, RevenueCat, or React Native behavior.

If a decision matters:
- the source must exist locally,
- be hashed,
- and be explicitly cited.

This applies to every pipeline run, without exception.

## GENERATED ARTIFACTS & CLEANUP

### Generated Directories (Non-Source)
- **`runs/`** - All pipeline execution outputs, logs, and specifications
- **`builds/`** - Complete React Native apps built from selected ideas  

These directories contain generated artifacts and are ignored by git.

### Mode-Specific Behavior
- **EDIT MODE**: Claude may delete `runs/` and `builds/` as part of cleanup requests
- **RUN MODE**: These are the ONLY places new artifacts should be written
- **Build output**: MUST go to `builds/<idea_dir>/` (never `/mobile`)

### Repository Hygiene
Generated artifacts are cleaned via `scripts/clean_repo.sh` and ship-readiness verified via `scripts/ship_check.sh`. Source code directories (`templates/`, `schemas/`, `standards/`, `runbooks/`, `scripts/`) are never modified during cleanup.

---

## ISOLATION FROM WEB3 FACTORY (MANDATORY)

App Factory MUST operate in complete isolation from Web3 Factory:

**Strict Separation Rules**:
- **NO access** to `/web3-factory/` directory or any of its subdirectories  
- **NO reference** to Web3 Factory stages (W1-W5), schemas, or templates
- **NO modification** of Web3 Factory runs, builds, or configuration files
- **NO shared** execution state, leaderboards, or run tracking between systems

**Technology Stack Isolation**:
- App Factory generates **React Native mobile apps** with subscription monetization
- Web3 Factory generates **web apps** with token-based monetization
- These are SEPARATE technology stacks and business models

**Command Isolation**:
- App Factory commands (`run app factory`, `build <idea>`, `dream <idea>`) operate ONLY on App Factory directory structure
- Web3 Factory commands (`web3 idea <idea>`) operate ONLY on Web3 Factory directory structure
- Claude MUST NOT execute cross-system commands or attempt system integration

**File System Isolation**:
- App Factory operates under `/the_factory/` directory exclusively
- Web3 Factory operates under `/web3-factory/` directory exclusively  
- These systems are designed to coexist without interaction or data sharing

This isolation ensures both systems can evolve independently without conflicts or contamination.

---

**CONSTITUTION END**: This document defines the complete agent-native execution framework. Claude must follow these specifications exactly. When in doubt, prioritize file evidence over claims.