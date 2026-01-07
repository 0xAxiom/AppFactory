# App Factory Agent-Native Constitution

**Version**: 2.0  
**Status**: BINDING CONSTITUTION FOR ALL CLAUDE OPERATIONS  
**Scope**: Agent-native execution where Claude is the primary runner  

---

## ARCHITECTURE: CLAUDE IS THE BUILDER (AGENT-NATIVE)

App Factory operates as an agent-native pipeline where Claude executes all stages directly within this repository. There are no subprocess calls to external Claude instances. Claude owns correctness, artifact generation, and pipeline orchestration.

### Core Execution Model
- **Claude reads** stage templates from `templates/agents/`
- **Claude reads** prior stage outputs from `runs/.../stages/`
- **Claude writes** JSON stage artifacts to disk
- **Claude validates** JSON against schemas
- **Claude renders** markdown specifications
- **Claude logs** execution details
- **Claude never outputs** raw JSON in chat

### Truth Enforcement
- Filesystem is the source of truth
- No stage is complete without artifacts on disk
- Success claims require file existence verification
- No stubs, no placeholder content, no false success

---

## COMMAND INTERFACE

Claude supports exactly these commands when opened in this repository:

### Primary Commands
- **`run app factory`** - Execute full pipeline (stages 01-10)
- **`run stage 01`** - Execute specific stage
- **`run stages 01-09`** - Execute stage range (specs only)
- **`run stage 10`** - Execute Stage 10 (build /mobile app)
- **`resume last run`** - Continue interrupted pipeline
- **`validate run`** - Check current run artifacts
- **`show status`** - Display pipeline progress

### Command Execution Rules
1. Create run directory if none exists
2. Read stage template and requirements
3. Generate and validate JSON output
4. Write artifacts to disk
5. Print only file paths, never JSON content

---

## RUN DIRECTORY CONTRACT

Every pipeline execution creates this exact structure:

```
runs/YYYY-MM-DD/<run_name>/
├── inputs/
│   └── 00_intake.md              # User requirements input
├── outputs/  
│   ├── stage01_execution.md      # What Claude did for each stage
│   ├── stage02_execution.md
│   ├── ...
│   ├── stage01_validation.json   # Schema validation results
│   ├── stage02_validation.json
│   └── ...
├── stages/
│   ├── stage01.json              # Raw JSON output (schema-validated)
│   ├── stage02.json
│   ├── ...
│   └── stage10.json
├── spec/
│   ├── 01_market_research.md     # Human-readable specifications
│   ├── 02_product_spec.md
│   ├── ...
│   └── 10_react_native_app.md
└── meta/
    ├── stage_status.json         # Pipeline progress tracking
    └── run_manifest.json         # Run configuration and metadata
```

### Stage 10 Additional Output
When Stage 10 executes, it also creates:
```
/mobile/                          # Complete Expo React Native app
├── package.json
├── app.json
├── App.js
├── src/
│   ├── screens/
│   ├── components/
│   └── services/
└── README.md
```

---

## STAGE EXECUTION CONTRACT

For each stage (01-10), Claude must:

### 1. Read Requirements
- Template: `templates/agents/NN_*.md`
- Prior outputs: `runs/.../stages/stage*.json` (for stages > 01)
- Schemas: Extract from template or use `schemas/stageNN.json`

### 2. Generate JSON Output
- Create valid JSON conforming to stage schema
- Include all required fields
- Use real data, no placeholders

### 3. Write and Validate Artifacts
```
# Write JSON
Write: runs/.../stages/stageNN.json

# Validate against schema  
Run: python -m appfactory.schema_validate schemas/stageNN.json runs/.../stages/stageNN.json

# Write validation results
Write: runs/.../outputs/stageNN_validation.json

# Write execution log
Write: runs/.../outputs/stageNN_execution.md
```

### 4. Render Specification
```
# Render human-readable spec
Run: python -m appfactory.render_markdown stageNN runs/.../stages/stageNN.json

# Verify spec file exists
Verify: runs/.../spec/NN_*.md exists
```

### 5. Update Status
```
# Update pipeline progress
Update: runs/.../meta/stage_status.json
```

---

## DEFINITION OF DONE

Claude must NEVER claim stage completion without verifying:

### Per Stage Requirements
- [ ] `runs/.../stages/stageNN.json` exists and validates
- [ ] `runs/.../outputs/stageNN_execution.md` documents actions taken
- [ ] `runs/.../outputs/stageNN_validation.json` shows validation passed
- [ ] `runs/.../spec/NN_*.md` specification exists and is non-empty
- [ ] `runs/.../meta/stage_status.json` marks stage as completed

### Stage 10 Additional Requirements  
- [ ] `/mobile/` directory exists with complete Expo project
- [ ] `/mobile/package.json` has required dependencies
- [ ] `/mobile/src/` contains screens, components, services
- [ ] `/mobile/README.md` has setup instructions

### Pipeline Completion Requirements
- [ ] All stages 01-10 show "completed" in stage_status.json
- [ ] All JSON files validate against schemas
- [ ] All spec markdown files exist and are substantial
- [ ] No execution logs show errors
- [ ] For Stage 10: /mobile app can theoretically run with `npx expo start`

**CRITICAL**: If any artifact is missing, Claude must report failure and stop.

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

**CONSTITUTION END**: This document defines the complete agent-native execution framework. Claude must follow these specifications exactly. When in doubt, prioritize file evidence over claims.