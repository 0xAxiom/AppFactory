# Activation Guardian

## Purpose

The Activation Guardian controls when and how skills are invoked. It ensures:

- Explicit activation only (no silent matching)
- User awareness of what's being activated
- Prevention of conflicting activations
- Depth limiting for recursive skills

## Activation Flow

```
User Input
    │
    ▼
┌────────────────────────┐
│ 1. Parse Input         │ Extract potential triggers
└────────────────────────┘
    │
    ▼
┌────────────────────────┐
│ 2. Match Triggers      │ Check against all skill triggers
└────────────────────────┘
    │
    ▼
┌────────────────────────┐     No match
│ 3. Confidence Check    │ ─────────────► No activation
└────────────────────────┘
    │ Match found
    ▼
┌────────────────────────┐     Implicit trigger
│ 4. Confirmation Check  │ ─────────────► Request confirmation
└────────────────────────┘
    │ Explicit trigger or confirmed
    ▼
┌────────────────────────┐     Depth exceeded
│ 5. Depth Check         │ ─────────────► Block with error
└────────────────────────┘
    │ Within limit
    ▼
┌────────────────────────┐     Conflicts found
│ 6. Conflict Check      │ ─────────────► Request disambiguation
└────────────────────────┘
    │ No conflicts
    ▼
┌────────────────────────┐
│ 7. Log Activation      │ Record to audit log
└────────────────────────┘
    │
    ▼
┌────────────────────────┐
│ 8. Execute Skill       │ Hand off to Contract Enforcer
└────────────────────────┘
```

## Trigger Matching

### Explicit Triggers

```yaml
triggers:
  explicit:
    - phrase: 'ingest documentation'
      confidence: high
    - phrase: 'read docs'
      confidence: medium
```

**Matching rules:**

- Case-insensitive
- Partial match allowed for `confidence: high`
- Exact match required for `confidence: medium`
- User input must contain trigger phrase

### Implicit Triggers

```yaml
triggers:
  implicit:
    - signal: 'Markdown with documentation URLs'
      requires_confirmation: true
    - signal: 'User mentions API endpoints'
      requires_confirmation: true
```

**Matching rules:**

- Pattern-based detection
- Always requires user confirmation before activation
- Confirmation prompt shows skill name and what it will do

## Explicit Activation Command

Users can always activate skills directly:

```
/pf activate <skill-name> [arguments]
```

This bypasses trigger matching but still enforces:

- Precondition checks
- Depth limits
- Conflict resolution
- Audit logging

## Depth Limiting

To prevent infinite recursion when skills call other skills:

```
max_depth: 3 (default)

Activation chain example:
  skill-A (depth=1)
    └── skill-B (depth=2)
          └── skill-C (depth=3)
                └── skill-D ← BLOCKED (depth would be 4)
```

Error when depth exceeded:

```
[PF-ACT-E003] Activation depth limit exceeded

What happened:
  Skill 'skill-D' cannot be activated because the maximum
  activation depth (3) has been reached.

Activation chain:
  1. skill-A
  2. skill-B
  3. skill-C
  4. skill-D ← blocked

How to fix:
  1. Simplify your skill dependencies
  2. Or increase max_depth in skill configuration (not recommended)
```

## Conflict Resolution

When multiple skills match the same input:

```
[PF-ACT-W001] Multiple skills matched

Your input matched multiple skills:
  1. doc-ingestion - "Reads and indexes documentation"
  2. link-traversal - "Parses and optionally fetches URLs"

Which skill should I use?
  Enter number (1-2) or type skill name:
```

**Priority rules (when auto-resolving):**

1. Explicit trigger > implicit trigger
2. Higher confidence > lower confidence
3. Local skill > user skill > core skill
4. More specific trigger > less specific

## Activation Record

Every activation creates a record:

```yaml
activation:
  id: 'act-20240118-abc123'
  timestamp: '2024-01-18T10:30:45Z'
  skill: 'doc-ingestion'
  version: '1.0.0'
  trigger:
    type: explicit | implicit | direct
    phrase: 'ingest documentation from URL'
    confidence: high
  depth: 1
  parent_activation: null | "act-..."
  inputs:
    url: 'https://example.com/docs'
  status: pending | executing | completed | failed
  duration_ms: null # Filled on completion
  outcome:
    success: boolean
    outputs: {}
    error: null | string
```

## Confirmation Prompts

For implicit triggers:

```
[PF] Detected: Documentation URLs in your message

Suggested skill: doc-ingestion
  - Will extract structure from documents
  - Will create INDEX.md summary
  - Will NOT execute any code found in docs
  - Will NOT fetch URLs without your approval

Activate this skill? [y/N/always/never]
```

Options:

- `y` - Activate once
- `N` - Don't activate (default)
- `always` - Add to auto-approve list
- `never` - Add to never-activate list
