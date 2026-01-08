# Validate Run Algorithm

This defines the exact steps Claude must follow when executing `validate run`.

## Command: `validate run`

Validates the most recent run (or current run if active) WITHOUT generating any new content.

### Validation Steps

#### 1. Locate Run Directory
```
Find: Most recent run in runs/YYYY-MM-DD/
Identify: Latest run_name by timestamp
Set: RUN_PATH = runs/YYYY-MM-DD/<run_name>/
```

#### 2. Validate Run Manifest
```
Check: RUN_PATH/meta/run_manifest.json exists
Validate: JSON structure against run manifest schema
Verify: run_status field is valid ("running"|"failed"|"completed")
Report: Missing or invalid manifest
```

#### 3. Validate Stage 01
```
Check: RUN_PATH/stage01/stages/stage01.json exists
Validate: Against schemas/stage01.json
Verify: Contains EXACTLY 10 ideas with unique idea_ids
Check: RUN_PATH/stage01/outputs/stage01_execution.md exists
Check: RUN_PATH/stage01/spec/01_market_research.md exists
Report: Stage 01 validation status
```

#### 4. Validate Idea Index
```
Check: RUN_PATH/meta/idea_index.json exists
Verify: Contains mappings for all 10 ideas from stage01.json
Validate: Directory names match deterministic naming pattern
Report: Idea index validation status
```

#### 5. Validate Each Idea Pack (02-09)
```
For each of 10 ideas:
  Check: RUN_PATH/ideas/<idea_dir>/ directory exists
  Check: meta/idea.json, meta/boundary.json, meta/stage_status.json exist
  For each stage 02-09:
    Check: stages/stageNN.json exists
    Validate: Against schemas/stageNN.json  
    Verify: meta fields match (run_id, idea_id, boundary_path)
    Check: outputs/stageNN_execution.md exists
    Check: spec/NN_*.md exists
  Report: Per-idea validation status
```

#### 6. Validate Stage Artifacts Integrity
```
For each completed idea pack:
  Check: All stage 02-10 JSONs exist and validate
  Verify: Meta field consistency across all stages
  Validate: Boundary enforcement compliance
  Report: Stage artifact integrity status
```

#### 7. Validate Global Leaderboard
```
Check: leaderboards/app_factory_all_time.json updated
Verify: 10 new entries added for this run
Validate: Entry structure and required fields
Report: Leaderboard validation status
```

#### 8. Generate Validation Report
```
Write: RUN_PATH/meta/validation_report.md
Include: Summary of all checks performed
Include: List of missing or invalid artifacts
Include: Overall run health status
Include: Recommendations for fixes (if any)
```

## Success Criteria

Validation passes if ALL of these are true:
- [ ] Run manifest exists and is valid
- [ ] Stage 01 complete with exactly 10 ideas
- [ ] All 10 idea packs have complete stage 02-09 artifacts
- [ ] All stage JSONs validate against schemas
- [ ] Meta fields consistent across all stages
- [ ] Stage artifacts integrity verified for all completed ideas
- [ ] Global leaderboard properly updated

## Failure Reporting

If validation fails:
- [ ] Write detailed failure report to validation_report.md
- [ ] List specific missing or invalid artifacts
- [ ] Provide remediation steps
- [ ] DO NOT attempt to fix issues (validation only)

## No Generation Rule

**CRITICAL**: `validate run` is read-only validation:
- NO new content generation
- NO file creation (except validation report)
- NO execution of stages
- NO artifact repairs