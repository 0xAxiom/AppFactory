---
name: factory
description: App Factory pipeline interface with plan-first execution, approval gates, and audit logging
triggers:
  - /factory
---

# /factory Command

The official Claude interface for App Factory pipelines.

## Command Surface

```
/factory help                      Show this help
/factory plan <idea>               Plan a pipeline without executing
/factory run <pipeline> <idea>     Execute a pipeline with approval gate
/factory ralph <path> [--loops N]  Run adversarial QA review
/factory video <path> [--slug S]   Generate demo video for a verified build
/factory audit                     View execution audit log
```

## Behavioral Contract

**All commands that perform work MUST:**

1. Propose a plan before execution
2. Block until explicit user approval
3. Execute only after approval
4. Log all actions to audit
5. Summarize outcome

## Command Details

### /factory help

Display command reference and behavioral contract.

**Output:** This help text.

### /factory plan \<idea\>

Analyze an idea and produce a detailed execution plan without running anything.

**Input:**

- `<idea>`: Natural language description of what to build

**Process:**

1. Parse the idea for intent
2. Identify the appropriate pipeline(s)
3. List skills that would activate (from prompt-factory)
4. Enumerate files/folders that would be created or modified
5. Note any network actions that would require authorization
6. List manual steps the user must perform

**Output:** Structured plan artifact. No execution occurs.

**Example:**

```
/factory plan a meditation timer app for iOS and Android
```

### /factory run \<pipeline\> \<idea\>

Execute a full pipeline with mandatory approval gate.

**Input:**

- `<pipeline>`: One of `website`, `miniapp`, `dapp`, `agent`, `app`, `plugin`
- `<idea>`: Natural language description

**Process:**

1. Validate pipeline exists in config
2. Generate execution plan (same as `/factory plan`)
3. **BLOCK: Display plan and wait for explicit user approval**
4. On approval: delegate to prompt-factory's `pipeline-execution` skill
5. Log activation, inputs, outputs to audit
6. Display summary with artifact locations

**Approval Gate:**

```
─────────────────────────────────────────────
EXECUTION PLAN REQUIRES APPROVAL

Pipeline: miniapp
Skills:   repo-analysis, prompt-compilation, pipeline-execution
Creates:  ./builds/meditation-timer/
Network:  None (offline mode)
Manual:   User must run `npm install` after generation

Type 'approve' to proceed, 'reject' to cancel:
─────────────────────────────────────────────
```

**Example:**

```
/factory run miniapp a meditation timer with breathing exercises
```

### /factory ralph \<path\> [--loops N]

Run adversarial QA review on generated artifacts.

**Input:**

- `<path>`: Directory or file to review
- `--loops N`: Number of review iterations (default: 3, max: 5)

**Process:**

1. Validate path exists
2. Delegate to prompt-factory's `qa-adversarial` skill
3. Execute N review loops, each challenging previous findings
4. Produce final verdict artifact

**Output:** `ralph_verdict.md` in the reviewed path

**Example:**

```
/factory ralph ./builds/meditation-timer --loops 3
```

### /factory video \<path\> [--slug S]

Generate a demo video for a verified build using Remotion.

**Input:**

- `<path>`: Path to the build directory (must contain RUN_CERTIFICATE.json with PASS status)
- `--slug S`: Custom slug for the output filename (default: derived from directory name)

**Prerequisites:**

1. The build must have passed Local Run Proof verification
2. `RUN_CERTIFICATE.json` with `status: "PASS"` must exist in the path
3. Remotion dependencies in `demo-video/` directory

**Process:**

1. Validate RUN_CERTIFICATE.json exists with PASS status
2. Extract build metadata from certificate (URL, timestamp, etc.)
3. Generate video props from certificate data
4. Render MP4 video using Remotion
5. Output video to `demo/out/<slug>.mp4`

**Output:**

- `demo/out/<slug>.mp4` - The rendered demo video
- `demo/out/<slug>.props.json` - Props used for rendering (for reproducibility)

**Example:**

```
/factory video ./app-factory/builds/my-app/app

/factory video ./miniapp-pipeline/builds/miniapps/hello-miniapp/app --slug hello-world
```

**Video Content:**

The generated video showcases:

1. Project title and branding
2. Key highlights from the build verification
3. Verification badge with certificate hash
4. Timestamp of successful verification

**Note:** Video generation also triggers automatically when Local Run Proof verification passes (via hooks.toml). Use this command to manually regenerate or customize videos.

**Skills Integration:**

Remotion skills are automatically available at `.claude/skills/remotion/SKILL.md`. These skills provide Claude with domain-specific knowledge for video generation, including:

- Frame-based animation patterns
- Determinism requirements
- Interpolation best practices
- Pipeline integration details

Skills are verified before each video render by `scripts/skills/ensure-remotion-skills.mjs`.

### /factory audit

View the execution audit log for factory commands.

**Process:**

1. Query prompt-factory audit log
2. Filter for factory-related activations
3. Display recent entries with:
   - Timestamp
   - Command
   - Approval status
   - Skills activated
   - Outcome

**Output:** Formatted audit log table

**Example output:**

```
FACTORY AUDIT LOG
─────────────────────────────────────────────
2026-01-18 14:32:01 | run miniapp     | APPROVED | SUCCESS
2026-01-18 14:28:45 | plan            | N/A      | COMPLETE
2026-01-18 13:15:22 | ralph           | N/A      | APPROVED
─────────────────────────────────────────────
```

## Pipeline Registry

Available pipelines are defined in `config.default.yaml`:

| Pipeline | Root                   | Description                          |
| -------- | ---------------------- | ------------------------------------ |
| website  | ../../website-pipeline | Website pipeline (portfolios, blogs) |
| miniapp  | ../../miniapp-pipeline | Base Mini App pipeline               |
| dapp     | ../../dapp-factory     | Onchain dApp pipeline (Web3)         |
| agent    | ../../agent-factory    | Agent scaffold pipeline              |
| app      | ../../app-factory      | Mobile app pipeline                  |
| plugin   | ../../plugin-factory   | Claude plugin pipeline               |

## Delegation Model

Factory is a **thin wrapper**. All governance logic lives in prompt-factory:

```
/factory run miniapp <idea>
    │
    ├─► Parse command
    ├─► Load pipeline config
    ├─► Generate plan
    ├─► BLOCK for approval
    │
    └─► Delegate to prompt-factory:
        ├─► /pf activate repo-analysis
        ├─► /pf activate prompt-compilation
        ├─► /pf activate pipeline-execution
        └─► Audit logging (automatic)
```

## Invariants

1. **No silent execution**: Every action requires prior plan display
2. **Approval gates are mandatory**: Cannot bypass with any flag
3. **Offline by default**: No network calls without explicit authorization
4. **Full auditability**: Every execution logged with inputs and outputs
5. **hrefs are references**: Links in output are not executed

## Error Handling

| Code    | Meaning                     | Recovery                       |
| ------- | --------------------------- | ------------------------------ |
| FAC-001 | Unknown pipeline            | Check `config.default.yaml`    |
| FAC-002 | Plan rejected by user       | Modify request and retry       |
| FAC-003 | Pipeline root not found     | Verify pipeline paths          |
| FAC-004 | Ralph loop limit exceeded   | Use --loops 1-5                |
| FAC-005 | Audit log unavailable       | Check prompt-factory status    |
| FAC-006 | No RUN_CERTIFICATE found    | Run verification first         |
| FAC-007 | Certificate status not PASS | Fix build issues and re-verify |
| FAC-008 | Remotion render failed      | Check demo-video/ dependencies |

Errors from prompt-factory (PF-\*) are propagated with context.
