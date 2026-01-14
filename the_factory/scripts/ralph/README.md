# Ralph Wiggum - Iterative Quality Assurance

Ralph Wiggum is a bash-driven iteration loop that re-feeds prompts into Claude Code repeatedly and tracks progress via `prd.json` until quality criteria are met.

## Prerequisites

### Required
- **jq**: JSON processor
  ```bash
  brew install jq
  ```
- **claude**: Claude Code CLI
  ```bash
  npm install -g @anthropic/claude-code
  ```

### Optional
- **npx**: For running Expo commands (usually included with Node.js)

## Installation

Ralph is included in the App Factory repository. No additional installation required.

```bash
cd the_factory/scripts/ralph
ls -la
# ralph.sh      - Main loop script
# prd.json      - PRD/milestone tracking
# prompt.md     - Default prompt template
# progress.txt  - Progress log
```

## Usage

### Basic Usage

```bash
# Run with default settings (5 iterations)
./ralph.sh

# Run with custom max iterations
./ralph.sh 10

# Run for a specific milestone
./ralph.sh 5 --milestone 1

# Run with a custom run directory
./ralph.sh 5 --run-dir /path/to/run

# Run with custom quality threshold
./ralph.sh 5 --threshold 95
```

### From Auto Plan + Build

Ralph is automatically invoked by the Auto Plan + Build pipeline:

```bash
# In the_factory directory
./scripts/auto_plan_build.sh --idea "A meditation app"

# Then navigate to run directory and execute
cd runs/YYYY-MM-DD/plan-HHMMSS
claude
```

### Manual Integration

```bash
# 1. Set up a run directory
mkdir -p my-run/ralph
cp scripts/ralph/prd.json my-run/ralph/

# 2. Customize PRD for your milestones
# Edit my-run/ralph/prd.json

# 3. Run Ralph for each milestone
./scripts/ralph/ralph.sh 5 --run-dir my-run --milestone 0
./scripts/ralph/ralph.sh 5 --run-dir my-run --milestone 1
# ... etc
```

## Quality Threshold (≥97%)

Ralph uses a practical, measurable quality definition:

### Calculation

```
quality_percentage = (passed_items / total_items) * 100
```

### Critical Items Rule

- If ANY critical item fails, quality = 0%
- Critical items are marked in the checklist with `"critical": true`
- All critical items MUST pass to achieve ≥97%

### Threshold Meaning

≥97% means:
1. ALL critical items pass
2. At most 1-2 non-critical items may fail
3. No runtime errors or crashes
4. No TypeScript compilation errors

## PRD Structure

The `prd.json` file tracks milestones and their checklists:

```json
{
  "version": "1.0",
  "project": "app-factory-build",
  "quality_threshold": 97,
  "milestones": [
    {
      "id": 1,
      "name": "Project Scaffold",
      "description": "Initial project structure",
      "status": "pending",
      "quality": 0,
      "checklist": [
        {
          "item": "npm install completes",
          "critical": true,
          "status": "pending"
        }
      ]
    }
  ],
  "current_milestone": 0,
  "total_iterations": 0,
  "status": "pending"
}
```

### Milestone Statuses

- `pending`: Not started
- `in_progress`: Currently being worked on
- `completed`: Reached ≥97% quality
- `failed`: Could not reach threshold after max iterations

### Checklist Item Statuses

- `pending`: Not yet verified
- `passed`: Verification successful
- `failed`: Verification failed

## Progress Tracking

Ralph maintains a human-readable progress log at `progress.txt`:

```
# Ralph Wiggum Progress Log
# Started: 2026-01-14T12:00:00Z

[2026-01-14T12:00:01Z] INFO: Starting Ralph Wiggum loop
[2026-01-14T12:00:02Z] INFO: Max iterations: 5
[2026-01-14T12:00:03Z] INFO: Quality threshold: 97%
[2026-01-14T12:01:00Z] INFO: Iteration 1 complete
[2026-01-14T12:01:01Z] INFO: Quality after iteration 1: 60%
[2026-01-14T12:02:00Z] SUCCESS: Quality threshold reached: 97%
```

## Integration with Existing Ralph Mode

Ralph Wiggum complements the existing Ralph Mode in App Factory:

| Aspect | Ralph Mode (Manual) | Ralph Wiggum (Automated) |
|--------|---------------------|--------------------------|
| Invocation | Claude plays both roles | Bash script drives loop |
| Tracking | Markdown reports | JSON PRD + progress.txt |
| Iterations | Max 3 | Configurable (default 5) |
| Quality | Subjective verdict | Quantitative ≥97% |
| Scope | Final QA only | Per-milestone gating |

Both systems serve the same goal: ensuring quality before shipping.

## Troubleshooting

### jq not found
```bash
brew install jq
```

### claude not found
```bash
npm install -g @anthropic/claude-code
```

### Permission denied
```bash
chmod +x ralph.sh
```

### Quality stuck below threshold
1. Check which critical items are failing
2. Review iteration results in `iteration_N_result.md`
3. Manually fix blocking issues
4. Re-run Ralph

### PRD not updating
- Ensure jq is working: `jq --version`
- Check file permissions on prd.json
- Verify JSON is valid: `jq . prd.json`

## Files Reference

| File | Purpose |
|------|---------|
| `ralph.sh` | Main loop script |
| `prd.json` | PRD with milestones and checklists |
| `prompt.md` | Default prompt template (regenerated per milestone) |
| `progress.txt` | Human-readable progress log |
| `iteration_N_result.md` | Results from each Claude iteration |

## License

Part of App Factory. See repository root for license.
