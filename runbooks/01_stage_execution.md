# Stage Execution Algorithm

This defines the exact steps Claude must follow when executing any pipeline stage.

## Universal Stage Algorithm

For every stage (01-10), Claude must execute this sequence:

### 1. Setup
```
Create run directory if not exists: runs/YYYY-MM-DD/<run_name>/
Create subdirectories: inputs/, outputs/, stages/, spec/, meta/
```

### 2. Read Requirements  
```
Read template: templates/agents/NN_*.md
Read intake: runs/.../inputs/00_intake.md
Read prior stages: runs/.../stages/stage*.json (if stage > 01)
Extract schema from template
```

### 3. Generate JSON Output
```
Generate JSON conforming to extracted schema
Include all required fields with real data (no placeholders)
Validate completeness and correctness
```

### 4. Write and Validate
```
Write: runs/.../stages/stageNN.json
Run: python -m appfactory.schema_validate schemas/stageNN.json runs/.../stages/stageNN.json
Write validation results: runs/.../outputs/stageNN_validation.json
```

### 5. Document Execution
```
Write execution log: runs/.../outputs/stageNN_execution.md
Include: actions taken, files created, validation status, any issues
```

### 6. Render Specification
```
Run: python -m appfactory.render_markdown stageNN runs/.../stages/stageNN.json  
Verify: runs/.../spec/NN_*.md exists and is substantial
```

### 7. Update Status
```
Update: runs/.../meta/stage_status.json
Mark stage as completed with timestamp
```

## Stage 10 Special Requirements

Stage 10 additionally must:

### 8. Generate Mobile App
```
Read: Stage 02-09 JSONs from runs/.../ideas/<idea_dir>/stages/
Verify: Boundary constraints and meta field consistency
Create: builds/<idea_dir>/<build_id>/app/ directory
Generate: Complete Expo React Native application
Include: package.json, app.json, App.js, src/ code
Ensure: All screens, components, services from prior stages
```

### 9. Validate Mobile Structure
```
Verify: builds/<idea_dir>/<build_id>/app/package.json exists with required dependencies
Verify: builds/<idea_dir>/<build_id>/app/src/ contains screens, components, services  
Verify: builds/<idea_dir>/<build_id>/app/README.md has setup instructions
Write: builds/<idea_dir>/<build_id>/build_log.md (execution log)
Write: builds/<idea_dir>/<build_id>/sources.md (research citations)
Log: Mobile app generation details
```

## Error Handling

### Schema Validation Failure
```
Attempt 1: Fix JSON and re-validate
Attempt 2: Fix JSON and re-validate  
Attempt 3: Fix JSON and re-validate
If all fail: Write detailed error log and STOP
```

### File Write Failure
```
Check: Directory permissions
Check: Disk space
Retry: With error handling
If persistent: Write error log and STOP
```

### Missing Dependencies
```
Check: Previous stage completion in meta/stage_status.json
Check: Required input files exist
If missing: Write dependency error and STOP
```

## Success Verification

Before marking any stage complete, verify:

```
✓ runs/.../stages/stageNN.json exists and validates
✓ runs/.../outputs/stageNN_execution.md exists  
✓ runs/.../outputs/stageNN_validation.json shows success
✓ runs/.../spec/NN_*.md exists and is non-empty
✓ runs/.../meta/stage_status.json updated
```

For Stage 10, additionally verify:
```
✓ builds/<idea_dir>/<build_id>/app/ directory exists
✓ builds/<idea_dir>/<build_id>/app/package.json has Expo dependencies
✓ builds/<idea_dir>/<build_id>/app/src/ contains application code
✓ builds/<idea_dir>/<build_id>/app/README.md exists
✓ builds/<idea_dir>/<build_id>/build_log.md exists
✓ builds/<idea_dir>/<build_id>/sources.md exists
✓ Stage 02-09 JSONs were consumed correctly
```

## Template Requirements

All stage templates must follow agent-native pattern:

```markdown
# Stage NN: [Name]

## AGENT-NATIVE EXECUTION
You are Claude executing this stage. Write artifacts to disk.

## INPUTS
- Read: runs/.../inputs/00_intake.md
- Read: runs/.../stages/stage*.json (if stage > 01)

## OUTPUTS  
- Write: runs/.../stages/stageNN.json
- Write: runs/.../outputs/stageNN_execution.md

## JSON SCHEMA
[Schema definition]

## EXECUTION STEPS
1. Read inputs from run directory
2. Generate JSON conforming to schema
3. Write and validate JSON
4. Log execution details  
5. Render specification markdown

DO NOT output JSON in chat. Write to disk only.
```

**Critical**: Templates must never instruct Claude to output JSON to chat.