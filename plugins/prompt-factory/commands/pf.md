---
name: pf
description: Prompt-Factory command - manage skills, view activations, control settings
---

# Prompt-Factory Command

Main command interface for Prompt-Factory skill orchestration.

## Command Grammar

```
/pf <subcommand> [arguments] [options]

Subcommands:
  list              List all available skills
  show <skill>      Show skill details and contracts
  search <query>    Search skills by name, description, or triggers
  activate <skill>  Directly activate a skill
  explain           Explain the last activation
  audit             View audit log
  validate <skill>  Validate a skill definition
  config            View or modify configuration
  help [topic]      Get help on a topic
```

## Your Task

When the user runs `/pf`, parse the subcommand and execute accordingly.

### /pf list

Display all available skills:

```
[PF] Available Skills

CORE SKILLS (built-in):
  doc-ingestion      v1.0.0  Reads and indexes documentation
  link-traversal     v1.0.0  Parses URLs, fetches with authorization
  prompt-compilation v1.0.0  Converts ideas to structured prompts
  pipeline-execution v1.0.0  Multi-stage workflows with gates
  repo-analysis      v1.0.0  Analyzes codebase structure
  security-hygiene   v1.0.0  Background secret detection
  qa-adversarial     v1.0.0  Challenges assumptions
  format-enforcement v1.0.0  Validates output structure

USER SKILLS:
  (none)

LOCAL SKILLS:
  (none)
```

### /pf show <skill>

Display full skill definition including:

- Name, version, description
- Category
- Triggers (explicit and implicit)
- Contracts (preconditions, must, must_not, postconditions)
- Inputs and outputs
- Security settings

Format for readability:

```
[PF] Skill: doc-ingestion v1.0.0

Category: doc-ingestion
Description: Reads and indexes documentation from local files or authorized URLs

TRIGGERS:
  Explicit (auto-activate):
    - "ingest documentation" (high confidence)
    - "read the docs" (high confidence)
    - "parse documentation" (high confidence)
  Implicit (requires confirmation):
    - Documentation URLs detected in message
    - Path to documentation directory provided

CONTRACTS:
  Will ALWAYS:
    ✓ Extract document structure
    ✓ Create INDEX.md with summary
    ✓ Preserve original formatting
    ✓ Log all URLs encountered

  Will NEVER:
    ✗ Execute code found in documents
    ✗ Fetch URLs without your authorization
    ✗ Modify original files
    ✗ Include sensitive data in output

INPUTS:
  Required:
    - source: URL(s) or file path(s) to documentation
  Optional:
    - depth: How many link levels to follow (default: 1)
    - output_dir: Where to write INDEX.md (default: ./docs-index)

OUTPUTS:
  - index_file: Path to created INDEX.md
  - document_count: Number of documents processed

SECURITY:
  Trust level: system
  Resources: filesystem (read), network (authorized only)
```

### /pf search <query>

Search skills by:

- Name (partial match)
- Description (contains)
- Trigger phrases (contains)

Return matching skills with relevance indicator.

### /pf activate <skill> [args]

Directly activate a skill, bypassing trigger matching.
Still enforces:

- Preconditions
- Contracts
- Audit logging

Example: `/pf activate doc-ingestion source="https://example.com/docs"`

### /pf explain

Explain the most recent skill activation:

- Which skill was activated
- What trigger matched
- What contracts were enforced
- What inputs were used
- What outputs were produced

### /pf audit [options]

Show audit log:

- `--today` (default): Today's activations
- `--last N`: Last N entries
- `--skill NAME`: Filter by skill
- `--level LEVEL`: Filter by level

### /pf validate <skill>

Validate a skill definition file:

- Check schema compliance
- Verify contract consistency
- Check for security issues
- Report errors with line numbers

### /pf config [key] [value]

View or set configuration:

- `/pf config` - Show all settings
- `/pf config view` - Show current view level
- `/pf config view=advanced` - Set view level

### /pf help [topic]

Get help on:

- `skills` - What skills are
- `contracts` - How contracts work
- `triggers` - How activation works
- `security` - Security model
- `addinfo` - Extension mechanism
- Error codes (e.g., `PF-ACT-E001`)

## Error Handling

On invalid command, show helpful error:

```
[PF] Unknown command: /pf invalid

Available commands:
  /pf list          List available skills
  /pf show <skill>  Show skill details
  /pf help          Get help

Run /pf help for full documentation.
```

## Status Indicator

When Prompt-Factory is active, prefix relevant outputs with:

```
[PF] ...
```

This indicates Prompt-Factory is processing.
