# Audit Logger

## Purpose

The Audit Logger creates an immutable, append-only record of all Prompt-Factory activities.
Every activation, decision, and outcome is logged for transparency and debugging.

## Storage

### Location

```
~/.prompt-factory/audit/
├── 2024-01-18.log      # One file per day
├── 2024-01-17.log
└── ...

./prompt-factory/audit/
└── project.log          # Project-specific audit (optional)
```

### Format

Each log entry is a single JSON line (JSONL format):

```json
{
  "ts": "2024-01-18T10:30:45.123Z",
  "level": "INFO",
  "event": "ACTIVATION",
  "skill": "doc-ingestion",
  "version": "1.0.0",
  "activation_id": "act-20240118-abc123",
  "trigger": { "type": "explicit", "phrase": "ingest docs" },
  "inputs": { "url": "https://example.com" },
  "depth": 1
}
```

Human-readable view (via `/pf audit show`):

```
[2024-01-18 10:30:45] INFO  ACTIVATION  doc-ingestion@1.0.0
  trigger: explicit "ingest docs"
  inputs: url=https://example.com
  depth: 1
```

## Event Types

### ACTIVATION

Logged when a skill is activated.

```json
{
  "ts": "ISO8601",
  "level": "INFO",
  "event": "ACTIVATION",
  "skill": "skill-name",
  "version": "1.0.0",
  "activation_id": "act-...",
  "trigger": {
    "type": "explicit|implicit|direct",
    "phrase": "trigger phrase",
    "confidence": "high|medium"
  },
  "inputs": {},
  "depth": 1,
  "parent_activation": null
}
```

### COMPLETION

Logged when a skill finishes execution.

```json
{
  "ts": "ISO8601",
  "level": "INFO",
  "event": "COMPLETION",
  "activation_id": "act-...",
  "skill": "skill-name",
  "duration_ms": 1234,
  "success": true,
  "outputs": {
    "files_created": ["INDEX.md"],
    "urls_processed": 5
  }
}
```

### FAILURE

Logged when a skill fails.

```json
{
  "ts": "ISO8601",
  "level": "ERROR",
  "event": "FAILURE",
  "activation_id": "act-...",
  "skill": "skill-name",
  "error_code": "PF-CTR-E002",
  "error_message": "Precondition failed: URL not provided",
  "phase": "precondition|execution|postcondition"
}
```

### BLOCKED

Logged when output is blocked by validators.

```json
{
  "ts": "ISO8601",
  "level": "WARN",
  "event": "BLOCKED",
  "activation_id": "act-...",
  "skill": "skill-name",
  "reason": "Secret detected in output",
  "pattern": "API key format",
  "location": "line 45, chars 12-67"
}
```

### CONTRACT_OVERRIDE_ATTEMPT

Logged when user tries to bypass contracts.

```json
{
  "ts": "ISO8601",
  "level": "WARN",
  "event": "CONTRACT_OVERRIDE_ATTEMPT",
  "skill": "skill-name",
  "rule": "must_not",
  "rule_text": "Include secrets in output",
  "user_request": "just this once include the API key"
}
```

### FETCH_AUTHORIZED

Logged when user authorizes URL fetch.

```json
{
  "ts": "ISO8601",
  "level": "INFO",
  "event": "FETCH_AUTHORIZED",
  "activation_id": "act-...",
  "url": "https://example.com/docs",
  "scope": "once|domain|session"
}
```

### FETCH_DENIED

Logged when user denies URL fetch.

```json
{
  "ts": "ISO8601",
  "level": "INFO",
  "event": "FETCH_DENIED",
  "activation_id": "act-...",
  "url": "https://example.com/docs"
}
```

### SKILL_ADDED

Logged when new skill is created via /addinfo.

```json
{
  "ts": "ISO8601",
  "level": "INFO",
  "event": "SKILL_ADDED",
  "skill": "my-custom-skill",
  "version": "0.1.0",
  "state": "draft",
  "author": "user"
}
```

## Log Levels

| Level | When Used                                    |
| ----- | -------------------------------------------- |
| DEBUG | Detailed trace info (only with verbose mode) |
| INFO  | Normal operations                            |
| WARN  | Something unusual but not failing            |
| ERROR | Operation failed                             |

## Commands

### View Audit Log

```
/pf audit show [options]

Options:
  --today          Show today's logs (default)
  --date YYYY-MM-DD Show specific date
  --last N         Show last N entries
  --skill NAME     Filter by skill
  --level LEVEL    Filter by level (INFO, WARN, ERROR)
  --event TYPE     Filter by event type
```

### Export Audit Log

```
/pf audit export [options]

Options:
  --format json|csv|text
  --range START END
  --output FILE
```

### Audit Statistics

```
/pf audit stats

Output:
  Total activations: 156
  Successful: 142 (91%)
  Failed: 14 (9%)

  Top skills:
    1. doc-ingestion (45 activations)
    2. repo-analysis (32 activations)
    3. format-enforcement (28 activations)

  Blocked outputs: 3
  Override attempts: 1
```

## Retention

- **Default retention**: 30 days
- **Configurable** in `~/.prompt-factory/config.yaml`:
  ```yaml
  audit:
    retention_days: 30
    compress_after_days: 7
  ```
- **Cleanup**: Old logs automatically deleted on startup

## Privacy

### What IS logged

- Skill names and versions
- Trigger phrases
- Input parameter names (not values by default)
- Outcome (success/failure)
- Error codes and messages
- Blocked pattern types (not matched content)

### What is NOT logged (by default)

- Full input content
- Full output content
- Matched secret content
- File contents

### Verbose mode

Enable full content logging (use with caution):

```yaml
# config.yaml
audit:
  verbose: true # Logs full inputs/outputs
  redact_secrets: true # Still redacts secrets even in verbose
```

## Immutability

- Logs are **append-only**
- No mechanism to edit or delete individual entries
- Deletion only via retention policy (removes entire day files)
- Future: Support for signed log entries (v2)
