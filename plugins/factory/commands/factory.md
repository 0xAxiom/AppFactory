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

- `<pipeline>`: One of `miniapp`, `dapp`, `agent`, `app`, `plugin`
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

| Pipeline | Root                   | Description             |
| -------- | ---------------------- | ----------------------- |
| miniapp  | ../../miniapp-pipeline | Base Mini App pipeline  |
| dapp     | ../../dapp-factory     | Onchain dApp pipeline   |
| agent    | ../../agent-factory    | Agent scaffold pipeline |
| app      | ../../app-factory      | Mobile app pipeline     |
| plugin   | ../../plugin-factory   | Claude plugin pipeline  |

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

| Code    | Meaning                   | Recovery                    |
| ------- | ------------------------- | --------------------------- |
| FAC-001 | Unknown pipeline          | Check `config.default.yaml` |
| FAC-002 | Plan rejected by user     | Modify request and retry    |
| FAC-003 | Pipeline root not found   | Verify pipeline paths       |
| FAC-004 | Ralph loop limit exceeded | Use --loops 1-5             |
| FAC-005 | Audit log unavailable     | Check prompt-factory status |

Errors from prompt-factory (PF-\*) are propagated with context.
