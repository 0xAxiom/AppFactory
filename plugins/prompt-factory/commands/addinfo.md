---
name: addinfo
description: Extend Prompt-Factory with new skills, triggers, resources, or configuration
---

# /addinfo Command

Extend Prompt-Factory with new information without modifying core.

## Command Grammar

```
/addinfo <type> [content]

Types:
  skill        Add a new skill (creates draft)
  trigger      Add trigger pattern to existing skill
  resource     Register external resource
  config       Add configuration setting
  context      Add persistent context
```

## Your Task

When the user runs `/addinfo`, help them extend Prompt-Factory according to the type specified.

### /addinfo skill

Create a new user skill. Guide the user through the skill creation process.

If content provided inline:

```
/addinfo skill
name: my-analyzer
description: Analyzes code for specific patterns
triggers:
  explicit:
    - phrase: "run my analyzer"
...
```

If no content:

```
[PF] Creating new skill

Let me help you define a new skill. I'll ask a few questions:

1. What should this skill be called? (kebab-case, e.g., "code-analyzer")
2. What does it do? (one sentence)
3. What phrases should activate it?
4. What must it ALWAYS do? (at least one)
5. What must it NEVER do? (at least one)
```

After gathering info, generate skill YAML and save to `~/.prompt-factory/skills/<name>.yaml`

**Constraints enforced:**

- Cannot use `core/` prefix
- Cannot use `trust_level: system`
- Cannot override existing core skills
- Must have at least one MUST and one MUST NOT

**On success:**

```
[PF] Skill created: my-analyzer v0.1.0

State: draft
Location: ~/.prompt-factory/skills/my-analyzer.yaml

The skill is now available. Test it with:
  /pf activate my-analyzer

To edit: Modify the YAML file directly
To delete: Remove the file
```

### /addinfo trigger <skill>

Add a trigger pattern to an existing skill.

```
/addinfo trigger doc-ingestion
explicit:
  - phrase: "gobble up those docs"
    confidence: medium
```

**Constraints:**

- Cannot modify core skills directly
- Creates override in `./prompt-factory/overrides/<skill>.yaml`
- Only adds triggers, never removes

**On success:**

```
[PF] Trigger added to doc-ingestion

New trigger: "gobble up those docs" (medium confidence)

This override is project-local:
  ./prompt-factory/overrides/doc-ingestion.yaml

Core skill unchanged.
```

### /addinfo resource

Register an external resource (for skills that need access).

```
/addinfo resource
type: api
name: internal-docs
base_url: https://docs.internal.com
auth: bearer
```

**Constraints:**

- Resources are stored in `~/.prompt-factory/resources.yaml`
- No automatic credential storage (user manages separately)
- Skills must explicitly request resource access

**On success:**

```
[PF] Resource registered: internal-docs

Type: api
Base URL: https://docs.internal.com
Auth: bearer (token not stored - provide at runtime)

Skills can now request access to this resource.
```

### /addinfo config

Add or modify configuration.

```
/addinfo config audit.retention_days=60
/addinfo config view=advanced
```

**Available settings:**

- `view`: simple, standard, advanced, expert
- `confirm`: all, implicit-only, none
- `audit.retention_days`: 1-365
- `audit.verbose`: true, false

**Constraints:**

- Cannot disable security features
- Cannot set `audit.retention_days` to 0

**On success:**

```
[PF] Configuration updated

audit.retention_days: 30 → 60

Config saved to: ~/.prompt-factory/config.yaml
```

### /addinfo context

Add persistent context that skills can reference.

```
/addinfo context
project: My E-commerce Platform
conventions:
  - Use TypeScript
  - Tests in __tests__ directories
  - API routes in /api
```

**Use case:** Provide project-specific information that skills can use without re-asking.

**On success:**

```
[PF] Context added

Persistent context saved. Skills can now reference:
  - project: "My E-commerce Platform"
  - conventions: 3 items

Location: ./prompt-factory/context.yaml
```

## Conflict Handling

When `/addinfo` would conflict with existing information:

```
[PF] Conflict detected

You're trying to add a trigger that already exists:
  Existing: "read the docs" → doc-ingestion (core)
  New: "read the docs" → my-doc-reader (user)

Options:
  1. Keep existing (core skill takes precedence)
  2. Override for this project only
  3. Rename your trigger

Choose [1/2/3]:
```

## Constraints Summary

| Action                     | Allowed | Blocked                     |
| -------------------------- | ------- | --------------------------- |
| Add new skill              | ✓       | Cannot use core/ prefix     |
| Add trigger                | ✓       | Cannot remove core triggers |
| Set trust_level: system    | ✗       | Reserved for core           |
| Disable security-hygiene   | ✗       | Always active               |
| Override MUST NOT rules    | ✗       | Immutable                   |
| Set audit.retention_days=0 | ✗       | Minimum is 1                |

All additions are logged to audit with `SKILL_ADDED`, `TRIGGER_ADDED`, `CONFIG_CHANGED`, or `CONTEXT_ADDED` events.
