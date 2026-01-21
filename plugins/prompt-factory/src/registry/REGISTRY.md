# Prompt-Factory Registry

## Overview

The registry is a local-first, file-based skill storage system. No network access required.

## Directory Structure

```
~/.prompt-factory/                    # User home directory
├── config.yaml                       # User configuration
├── skills/                           # User-created skills
│   └── <skill-name>.yaml
├── audit/                            # Audit logs
│   └── <YYYY-MM-DD>.log
└── state/                            # Runtime state
    └── activations.json              # Recent activations

./prompt-factory/                     # Project-local (highest priority)
├── skills/                           # Project-specific skills
│   └── <skill-name>.yaml
└── overrides/                        # Local overrides for core skills
    └── <skill-name>.yaml
```

## Resolution Order

When looking up a skill by name:

1. **Local Project**: `./prompt-factory/skills/<name>.yaml`
2. **Local Override**: `./prompt-factory/overrides/<name>.yaml`
3. **User Home**: `~/.prompt-factory/skills/<name>.yaml`
4. **Core Built-in**: Embedded in plugin at `skills/core/<name>.yaml`

First match wins. This allows project-specific overrides.

## Skill States

| State   | Description               | Editable | Location                    |
| ------- | ------------------------- | -------- | --------------------------- |
| `core`  | Built-in, shipped with PF | No       | `skills/core/`              |
| `draft` | User work-in-progress     | Yes      | `~/.prompt-factory/skills/` |
| `local` | Project-specific          | Yes      | `./prompt-factory/skills/`  |

## File Format

Skills are stored as YAML files:

```yaml
# skill: doc-ingestion
# version: 1.0.0
# state: core

skill:
  name: doc-ingestion
  version: '1.0.0'
  description: 'Reads and indexes documentation from files or authorized URLs'
  # ... rest of schema
```

## Registry Operations

### List Skills

```
Command: /pf list
Output: All available skills with name, version, state, description
```

### Get Skill

```
Command: /pf show <skill-name>
Output: Full skill definition with all contracts
```

### Search Skills

```
Command: /pf search <query>
Output: Skills matching query in name, description, or triggers
```

### Validate Skill

```
Command: /pf validate <skill-name>
Output: Schema validation results, contract consistency check
```

## Persistence

### Skill Files

- YAML format for human readability
- Comments preserved on edit
- File modification time used for ordering

### Audit Logs

- Append-only log files
- One file per day: `audit/YYYY-MM-DD.log`
- Format: `[ISO8601] [LEVEL] [SKILL] [ACTION] message`

### State Files

- JSON format for fast parsing
- `activations.json`: Recent skill activations (ring buffer, max 100)

## Offline-First Design

- **No network calls**: All skills stored locally
- **No external dependencies**: Pure file I/O
- **Atomic writes**: Write to temp file, then rename
- **Graceful degradation**: Missing dirs created on first use

## Initialization

On first run:

1. Create `~/.prompt-factory/` if not exists
2. Create subdirectories: `skills/`, `audit/`, `state/`
3. Write default `config.yaml`
4. Core skills are always available (embedded)
