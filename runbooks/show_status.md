# Show Status Algorithm

This defines the exact steps Claude must follow when executing `show status`.

## Command: `show status`

Prints current run status using run_manifest.json and per-idea stage_status.json files WITHOUT generating new content.

### Status Display Steps

#### 1. Locate Current Run
```
Find: Most recent run in runs/YYYY-MM-DD/
Identify: Latest run_name by timestamp  
Set: RUN_PATH = runs/YYYY-MM-DD/<run_name>/
```

#### 2. Read Run Manifest
```
Read: RUN_PATH/meta/run_manifest.json
Extract: run_id, run_name, date, command_invoked
Extract: run_status, expected_idea_count
Extract: per_idea status summary
```

#### 3. Read Individual Idea Status
```
For each idea in idea_index.json:
  Read: RUN_PATH/ideas/<idea_dir>/meta/stage_status.json
  Extract: stages_completed, current_stage
  Check: handoff_capsule_status if applicable
```

#### 4. Display Status Summary
```
Print run header:
  Run ID: <run_id>
  Date: <date>  
  Command: <command_invoked>
  Status: <run_status>

Print stage progress:
  Stage 01: [✓|✗|⏳] Market Research (10 ideas)
  
Print per-idea progress:
  Idea 1: <idea_name> [stages completed: 02,03,04,05,06,07,08,09 | current: 09 | capsule: ✓]
  Idea 2: <idea_name> [stages completed: 02,03,04,05 | current: 06 | capsule: ✗]
  ...

Print summary:
  Ideas Complete: X/10
  Total Stages Complete: XX/90  
  Capsules Ready: X/10
```

#### 5. Display Failure Information (if applicable)
```
If run_status = "failed":
  Print failure details from run_manifest.failure:
    Failed Idea: <idea_name>
    Failed Stage: <stage>
    Reason: <reason>
    Missing Artifacts: <artifact_paths>
```

#### 6. Display Next Steps
```
If run_status = "running":
  Print: "Run in progress - next: Stage XX for <idea_name>"

If run_status = "completed":
  Print: "✓ Batch complete - ready for build commands"
  Print: "Available ideas: <list of idea names>"
  
If run_status = "failed":
  Print: "✗ Run failed - see failure details above"
  Print: "Run 'validate run' for detailed diagnostics"
```

## Output Format

Status output should be concise and actionable:

```
📊 App Factory Run Status

Run ID: app_factory_220354
Date: 2026-01-06T22:04:16Z
Command: run app factory  
Status: completed ✓

Stage Progress:
├── Stage 01: ✓ Market Research (10 ideas)
└── Stages 02-09: ✓ All idea packs complete

Idea Progress:
├── 01. QuickFlow          [02,03,04,05,06,07,08,09] ✓ Capsule Ready
├── 02. NeuroDash          [02,03,04,05,06,07,08,09] ✓ Capsule Ready  
├── 03. FamilyHub          [02,03,04,05,06,07,08,09] ✓ Capsule Ready
├── 04. VaultKeeper        [02,03,04,05,06,07,08,09] ✓ Capsule Ready
├── 05. CreativeFlow       [02,03,04,05,06,07,08,09] ✓ Capsule Ready
├── 06. EnergyRhythm       [02,03,04,05,06,07,08,09] ✓ Capsule Ready
├── 07. FocusSimple        [02,03,04,05,06,07,08,09] ✓ Capsule Ready
├── 08. HabitLink          [02,03,04,05,06,07,08,09] ✓ Capsule Ready
├── 09. WorkflowBridge     [02,03,04,05,06,07,08,09] ✓ Capsule Ready
└── 10. MindfulTech        [02,03,04,05,06,07,08,09] ✓ Capsule Ready

Summary: 10/10 ideas complete | 80/80 stages complete | 10/10 capsules ready

✓ Batch complete - ready for build commands

Available for build:
• QuickFlow • NeuroDash • FamilyHub • VaultKeeper • CreativeFlow
• EnergyRhythm • FocusSimple • HabitLink • WorkflowBridge • MindfulTech
```

## No Generation Rule  

**CRITICAL**: `show status` is read-only display:
- NO new content generation
- NO file creation  
- NO execution of stages
- NO status modifications
- ONLY read existing manifest and status files