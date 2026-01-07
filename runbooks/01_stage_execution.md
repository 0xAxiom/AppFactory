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
Create: /mobile/ directory
Generate: Complete Expo React Native application
Include: package.json, app.json, App.js, src/ code
Ensure: All screens, components, services from prior stages
```

### 9. Validate Mobile Structure
```
Verify: /mobile/package.json exists with required dependencies
Verify: /mobile/src/ contains screens, components, services  
Verify: /mobile/README.md has setup instructions
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
✓ /mobile/ directory exists
✓ /mobile/package.json has Expo dependencies
✓ /mobile/src/ contains application code
✓ /mobile/README.md exists
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