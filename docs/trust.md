# Truth Verification Guide

App Factory enforces truth through filesystem artifacts. This guide explains how to verify pipeline success and debug failures.

## Core Truth Principle

**If files don't exist on disk, the work wasn't done.**

Success means:
- JSON files exist and validate against schemas
- Execution logs document actual work performed
- Specification files contain substantial content
- Mobile app (if Stage 10) is complete and runnable

## Verification Commands

### Basic Structure Check
```bash
# Verify run directory exists
ls -la runs/YYYY-MM-DD/<run-name>/

# Check required subdirectories
test -d runs/.../inputs && echo "✓ inputs"
test -d runs/.../outputs && echo "✓ outputs"  
test -d runs/.../stages && echo "✓ stages"
test -d runs/.../spec && echo "✓ spec"
test -d runs/.../meta && echo "✓ meta"
```

### Stage Completion Verification
```bash
# Check if stage JSON exists and is non-empty
test -s runs/.../stages/stage01.json && echo "✓ stage01.json exists"

# Validate against schema
python -m appfactory.schema_validate schemas/stage01.json runs/.../stages/stage01.json

# Check execution log exists
test -s runs/.../outputs/stage01_execution.md && echo "✓ execution log exists"

# Check validation results
grep '"valid": true' runs/.../outputs/stage01_validation.json && echo "✓ validation passed"

# Check spec markdown rendered
test -s runs/.../spec/01_*.md && echo "✓ specification exists"
```

### Pipeline Status Check
```bash
# View overall pipeline status
cat runs/.../meta/stage_status.json

# Check specific stage completion
jq '.stages."01".status' runs/.../meta/stage_status.json
# Should return: "completed"

# Count completed stages
jq '[.stages[] | select(.status == "completed")] | length' runs/.../meta/stage_status.json

# Find next stage to execute
python -m appfactory.logging_utils get_next_stage runs/.../
```

### Mobile App Verification (Stage 10)
```bash
# Check mobile directory exists
test -d /mobile && echo "✓ Mobile app directory exists"

# Verify core files
test -f /mobile/package.json && echo "✓ package.json"
test -f /mobile/app.json && echo "✓ app.json"
test -f /mobile/App.js && echo "✓ App.js entry point"
test -f /mobile/README.md && echo "✓ README"

# Check source structure
test -d /mobile/src/screens && echo "✓ screens directory"
test -d /mobile/src/components && echo "✓ components directory"
test -f /mobile/src/services/purchases.js && echo "✓ RevenueCat service"

# Verify dependencies
grep '"expo"' /mobile/package.json && echo "✓ Expo dependency"
grep 'react-native-purchases' /mobile/package.json && echo "✓ RevenueCat dependency"

# Count source files
find /mobile/src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | wc -l
# Should be > 0
```

## Logs and Validation Reports

### Execution Logs Location
```
runs/.../outputs/
├── stage01_execution.md      # What Claude did for stage 01
├── stage02_execution.md      # What Claude did for stage 02
├── ...
├── stage01_validation.json   # Schema validation results
├── stage02_validation.json   # Schema validation results
└── ...
```

### Reading Execution Logs
```bash
# View what was done in stage 01
cat runs/.../outputs/stage01_execution.md

# Check for errors in logs
grep -i "error\|failed\|exception" runs/.../outputs/stage*.md

# View validation results
cat runs/.../outputs/stage01_validation.json
```

### Validation Results Format
```json
{
  "stage": "01",
  "schema_path": "schemas/stage01.json",
  "json_path": "runs/.../stages/stage01.json", 
  "valid": true,
  "errors": [],
  "timestamp": "2026-01-07T10:30:00Z"
}
```

## Common Failure Modes

### Missing Stage Files
**Symptom**: `stage01.json` doesn't exist
**Check**: 
```bash
ls -la runs/.../stages/
cat runs/.../outputs/stage01_execution.md
```
**Causes**: Permission issues, disk space, interrupted execution

### Schema Validation Failures
**Symptom**: Validation shows `"valid": false`
**Check**:
```bash
cat runs/.../outputs/stage01_validation.json
python -m appfactory.schema_validate schemas/stage01.json runs/.../stages/stage01.json
```
**Causes**: Missing required fields, invalid enum values, type mismatches

### Incomplete Mobile App
**Symptom**: `/mobile` exists but missing files
**Check**:
```bash
find /mobile -type f | wc -l  # Should be substantial (>20 files)
ls -la /mobile/src/
cat /mobile/README.md
```
**Causes**: Stage 10 interrupted, incomplete specifications from prior stages

### Empty Specification Files
**Symptom**: Spec markdown files exist but are tiny
**Check**:
```bash
wc -l runs/.../spec/*.md  # Should be substantial content
grep -c "TODO\|TBD\|placeholder" runs/.../spec/*.md  # Should be 0
```
**Causes**: Template rendering issues, invalid stage JSON

## Recovery Procedures

### Restart Failed Stage
1. Check what stage failed:
   ```bash
   python -m appfactory.logging_utils get_next_stage runs/.../
   ```
2. In Claude, run specific stage:
   ```
   run stage 03
   ```

### Clean Restart Pipeline
1. Remove corrupted run:
   ```bash
   rm -rf runs/YYYY-MM-DD/<run-name>/
   ```
2. In Claude, start fresh:
   ```
   run app factory
   ```

### Fix Schema Validation Issues
1. View specific validation errors:
   ```bash
   cat runs/.../outputs/stageNN_validation.json
   ```
2. Examine the JSON file:
   ```bash
   cat runs/.../stages/stageNN.json
   ```
3. Re-run the stage in Claude to fix issues

### Repair Mobile App Generation
1. Check if all prior stages completed:
   ```bash
   jq '.stages | keys' runs/.../meta/stage_status.json
   # Should show ["01", "02", ..., "09"]
   ```
2. Re-run Stage 10:
   ```
   run stage 10
   ```

## Truth Enforcement Checklist

Before accepting pipeline as "complete":

### Basic Requirements
- [ ] Run directory exists with proper date structure
- [ ] All required subdirectories present
- [ ] Run manifest exists and is valid JSON
- [ ] Stage status tracks all stages

### Per-Stage Requirements (01-09)
- [ ] `stageNN.json` exists for each completed stage
- [ ] All JSON files validate against schemas
- [ ] All execution logs exist and show success
- [ ] All validation results show `"valid": true`
- [ ] All specification markdown files exist and are substantial

### Stage 10 Requirements
- [ ] `/mobile` directory exists with complete app
- [ ] All required configuration files present
- [ ] Source code exists in proper structure
- [ ] RevenueCat service integration complete
- [ ] README with setup instructions

### Content Quality
- [ ] JSON files contain real data, not placeholders
- [ ] Execution logs document actual work performed  
- [ ] Specification files have complete, detailed content
- [ ] Mobile app has real implementation, not TODO comments
- [ ] No critical files are empty or missing

## Automated Verification Script

Save this as `verify_run.sh`:
```bash
#!/bin/bash
# verify_run.sh <run_path>

RUN_PATH="$1"
if [ -z "$RUN_PATH" ]; then
    echo "Usage: verify_run.sh <run_path>"
    exit 1
fi

echo "🔍 Verifying App Factory run: $RUN_PATH"
ERRORS=0

# Basic structure
for dir in inputs outputs stages spec meta; do
    if [ ! -d "$RUN_PATH/$dir" ]; then
        echo "❌ Missing directory: $dir"
        ((ERRORS++))
    fi
done

# Stage files and validation
for stage in 01 02 03 04 05 06 07 08 09 10; do
    if [ -f "$RUN_PATH/stages/stage$stage.json" ]; then
        echo "✓ stage$stage.json exists"
        # Check if validation passed
        if [ -f "$RUN_PATH/outputs/stage${stage}_validation.json" ]; then
            if grep -q '"valid": true' "$RUN_PATH/outputs/stage${stage}_validation.json"; then
                echo "✓ stage$stage validation passed"
            else
                echo "❌ stage$stage validation failed"
                ((ERRORS++))
            fi
        else
            echo "⚠ stage$stage validation results missing"
        fi
    fi
done

# Mobile app check
if [ -d "/mobile" ]; then
    echo "✓ Mobile app directory exists"
    if [ -f "/mobile/package.json" ] && [ -f "/mobile/App.js" ]; then
        echo "✓ Mobile app core files present"
    else
        echo "❌ Mobile app incomplete"
        ((ERRORS++))
    fi
else
    echo "ℹ Mobile app not generated (Stage 10 not run)"
fi

if [ $ERRORS -eq 0 ]; then
    echo "✅ Verification passed"
    exit 0
else
    echo "❌ Verification failed: $ERRORS errors"
    exit 1
fi
```

## Summary

App Factory's truth enforcement ensures that success claims are backed by concrete filesystem evidence. Use these verification procedures to:

1. **Validate pipeline completion** - Check that all required artifacts exist
2. **Debug failures** - Identify missing files and validation errors  
3. **Ensure quality** - Verify content is substantial and complete
4. **Trust the output** - Confirm that claimed work was actually done

**Remember**: The filesystem is the source of truth. If artifacts don't exist, the pipeline didn't succeed.