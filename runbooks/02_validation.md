# Validation and Truth Enforcement

App Factory enforces truth through filesystem artifacts. This document explains validation processes and how to verify pipeline success.

## Schema Validation

Every stage output must validate against its JSON schema.

### Validation Process
```bash
# Validate single stage
python -m appfactory.schema_validate schemas/stage01.json runs/.../stages/stage01.json

# Return codes
0 = Validation passed
1 = Validation failed  
2 = File not found
3 = Schema error
```

### Validation Results
```json
// runs/.../outputs/stageNN_validation.json
{
  "stage": "01",
  "schema_path": "schemas/stage01.json", 
  "json_path": "runs/.../stages/stage01.json",
  "valid": true,
  "errors": [],
  "timestamp": "2026-01-07T10:30:00Z"
}
```

## Artifact Verification

### Required Files Per Stage
```
runs/.../stages/stageNN.json          ✓ Exists and validates
runs/.../outputs/stageNN_execution.md ✓ Documents actions taken  
runs/.../outputs/stageNN_validation.json ✓ Shows validation passed
runs/.../spec/NN_*.md                 ✓ Specification rendered
```

### Verification Commands
```bash
# Check file exists and is non-empty
test -s runs/.../stages/stage01.json && echo "✓ stage01.json exists"

# Check validation passed  
grep '"valid": true' runs/.../outputs/stage01_validation.json

# Check execution completed
grep "Stage completed successfully" runs/.../outputs/stage01_execution.md

# Check spec rendered
test -s runs/.../spec/01_*.md && echo "✓ spec exists"
```

## Pipeline Status Verification

### Stage Status Tracking
```json
// runs/.../meta/stage_status.json  
{
  "run_id": "2026-01-07-productivity-app",
  "stages": {
    "01": {
      "status": "completed",
      "started_at": "2026-01-07T10:00:00Z", 
      "completed_at": "2026-01-07T10:05:00Z",
      "artifacts": [
        "stages/stage01.json",
        "outputs/stage01_execution.md", 
        "spec/01_market_research.md"
      ]
    }
  }
}
```

### Status Verification
```bash
# Check stage completed
jq '.stages."01".status' runs/.../meta/stage_status.json
# Should return: "completed"

# Check all stages complete
jq '[.stages[] | select(.status != "completed")] | length' runs/.../meta/stage_status.json  
# Should return: 0
```

## Stage 10 Mobile App Verification

### Required Mobile Structure
```
/mobile/
├── package.json        ✓ Contains Expo dependencies
├── app.json           ✓ Valid Expo configuration  
├── App.js             ✓ Application entry point
├── src/
│   ├── screens/       ✓ Screen components
│   ├── components/    ✓ Reusable components
│   └── services/      ✓ Business logic
└── README.md          ✓ Setup instructions
```

### Mobile App Verification  
```bash
# Check mobile directory exists
test -d /mobile && echo "✓ Mobile app directory exists"

# Check package.json has Expo
grep '"expo"' /mobile/package.json && echo "✓ Expo dependency found"

# Check app structure
test -d /mobile/src/screens && echo "✓ Screens directory exists"
test -d /mobile/src/components && echo "✓ Components directory exists"
test -f /mobile/README.md && echo "✓ README exists"

# Verify React Native structure
find /mobile/src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | wc -l
# Should return: > 0 (source files exist)
```

## Common Validation Failures

### JSON Schema Errors
```
Error: Missing required field 'app_ideas'
Fix: Add missing field to stage JSON

Error: Invalid enum value 'Large' for 'mvp_complexity'  
Fix: Use valid enum: 'S', 'M', 'L'
```

### File System Errors
```
Error: Permission denied writing to runs/
Fix: Check directory permissions

Error: No space left on device
Fix: Free disk space
```

### Template Errors
```
Error: Template outputs JSON to chat
Fix: Update template to write files only

Error: Missing AGENT-NATIVE EXECUTION section
Fix: Add required template structure
```

## Truth Enforcement Checklist

Before accepting pipeline completion:

### Basic Verification
- [ ] Run directory exists with correct date structure
- [ ] All required subdirectories exist (inputs/, outputs/, stages/, spec/, meta/)  
- [ ] Stage status shows all stages "completed"

### Per-Stage Verification
- [ ] All JSON files exist and validate against schemas
- [ ] All execution logs exist and show success
- [ ] All validation results show "valid": true
- [ ] All specification markdown files exist and are substantial

### Stage 10 Verification
- [ ] /mobile directory exists with complete app structure
- [ ] package.json contains required Expo dependencies
- [ ] Source code exists in src/ directory
- [ ] README.md provides setup instructions

### Content Quality
- [ ] JSON files contain real data, not placeholders
- [ ] Execution logs document actual work performed
- [ ] Specification files have complete content
- [ ] Mobile app has implementation, not TODO comments

**Remember**: If files don't exist on disk, the work wasn't done.