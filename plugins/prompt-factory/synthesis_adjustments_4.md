# Synthesis Adjustments 4: Extensibility

## Adjustments to Prompt-Factory Design Based on Loop 4 Research

---

## ADOPTED EXTENSION MODEL

### Core Principle: Microkernel Architecture

Prompt-Factory uses a **microkernel architecture**:

- **Core** handles: registry, activation, contracts, validation, audit
- **Skills** are plugins that provide specific behaviors
- **Interface** is the Skill Module Schema (well-defined, stable)

```
CORE (immutable contract)
        │
        │ Skill Module Schema (interface)
        │
   ┌────┴────┬────────┬────────┐
   │         │        │        │
Skill A   Skill B  Skill C  Skill D
(core)    (user)   (org)   (community)
```

---

## `/addinfo` SPECIFICATION (FINAL)

### Command Syntax

```
/addinfo <type> <content>

Types:
- skill      : Add a new skill (draft)
- trigger    : Add trigger pattern to existing skill
- resource   : Register external resource
- config     : Add configuration setting
- context    : Add persistent context
```

### Examples

```
/addinfo skill
name: my-custom-analyzer
description: Analyzes code for specific patterns
triggers:
  explicit:
    - "analyze with my tool"
...

/addinfo trigger doc-ingestion
explicit:
  - "read the docs"
  - "ingest documentation"

/addinfo resource
type: api
name: internal-api
base_url: https://api.internal.com
auth: bearer
```

### Constraints Enforced

| Constraint                     | Enforcement              |
| ------------------------------ | ------------------------ |
| Cannot modify stable skills    | Blocked at runtime       |
| Cannot override MUST NOT rules | Blocked at runtime       |
| Cannot elevate trust levels    | Automatically downgraded |
| All additions logged           | Audit trail created      |
| Conflicts surfaced             | User must resolve        |

---

## VERSIONING STRATEGY

### Dual Versioning System

```yaml
version:
  semantic: '1.2.3' # Human-readable
  hash: 'sha256:abc123...' # Content-addressable
  aliases:
    - latest # Mutable alias
    - stable # Points to approved version
```

### Version Resolution

```
Request: "core/doc-ingestion"
         → Resolves to "stable" alias
         → Points to "1.2.3"
         → Hash: "sha256:abc123..."

Request: "core/doc-ingestion@1.2.3"
         → Direct version match
         → Hash: "sha256:abc123..."

Request: "core/doc-ingestion@sha256:abc123..."
         → Direct hash match (most reproducible)
```

### Version Immutability

| State      | Editable     | Deletable | Notes            |
| ---------- | ------------ | --------- | ---------------- |
| draft      | Yes          | Yes       | Work in progress |
| review     | Comment only | No        | Under review     |
| stable     | No           | No        | Locked forever   |
| deprecated | No           | No        | Superseded       |

---

## SKILL NAMESPACING (FINAL)

### Namespace Structure

```
<scope>/<skill-name>[@<version>]

Scopes:
- core/           Built-in, maintained by Prompt-Factory
- user:<id>/      User-created, private by default
- org:<id>/       Organization-owned
- shared/         User-created, explicitly shared
- community/      Community registry (opt-in)
```

### Resolution Order

```
1. Local: ./prompt-factory/skills/<name>.yaml
2. User:  ~/.prompt-factory/skills/<name>.yaml
3. Org:   [org-registry]/<name> (if configured)
4. Core:  [built-in]/<name>
5. Community: [community-registry]/<name> (if enabled)
```

### Conflict Resolution

When same-named skills exist in multiple scopes:

1. **Local always wins** (explicit override)
2. User prompted to choose if ambiguous
3. Fully-qualified names resolve unambiguously

---

## DEPENDENCY MANAGEMENT

### Dependency Declaration

```yaml
dependencies:
  skills:
    - name: core/doc-ingestion
      version: '^1.0.0' # Semver range
      optional: false
      reason: 'Required for document parsing'

  resources:
    - type: network
      scope: '*.docs.example.com'
      reason: 'Fetching documentation'
```

### Dependency Resolution Rules

1. **Direct dependencies** resolved first
2. **Transitive dependencies** flattened
3. **Version conflicts** → use highest compatible version
4. **Incompatible versions** → error, user must resolve
5. **Missing dependencies** → skill activation blocked

### Security Inheritance

```
Parent Skill Trust: standard
                    │
                    ▼
Child Skill Trust: standard OR LOWER (never higher)
```

---

## PERMISSION MODEL (REFINED)

### Trust Levels

| Level        | Description         | Can Access          |
| ------------ | ------------------- | ------------------- |
| `system`     | Core Prompt-Factory | Everything          |
| `privileged` | Approved high-trust | Network, limited FS |
| `standard`   | Normal user skills  | Restricted sandbox  |
| `untrusted`  | Unknown/unverified  | Minimal sandbox     |

### Capability Requests

```yaml
security:
  trust_level: standard
  capabilities:
    requested:
      - type: network
        scope: 'api.example.com'
        operations: [GET]
        justification: 'Fetch API docs'

      - type: filesystem
        scope: './docs/**'
        operations: [read]
        justification: 'Read local docs'

    granted: [] # Populated after approval
```

### Approval Workflow

```
Skill requests capability
         │
         ▼
┌─────────────────────┐
│ Capability in scope │──── Yes ──→ Grant automatically
│ of trust level?     │
└─────────────────────┘
         │
        No
         │
         ▼
┌─────────────────────┐
│ Prompt user for     │
│ approval            │
└─────────────────────┘
         │
    ┌────┴────┐
    │         │
  Approve   Deny
    │         │
    ▼         ▼
  Grant     Block
  (logged)  (logged)
```

---

## REGISTRY ARCHITECTURE (FINAL)

### Registry Entry Schema

```yaml
registry_entry:
  # Identity
  namespace: string
  name: string
  qualified_name: string # namespace/name

  # Versions
  versions:
    - version: semver
      hash: string
      state: draft | review | stable | deprecated
      created: ISO8601
      author: string
      changelog: string

  # Aliases
  aliases:
    latest: version
    stable: version
    # Custom aliases allowed

  # Metadata
  metadata:
    description: string
    category: string
    tags: [string]
    license: string (for community)

  # Stats (for community registry)
  stats:
    downloads: number
    rating: number
    last_updated: ISO8601
```

### Registry Operations

| Operation | Command                         | Notes                            |
| --------- | ------------------------------- | -------------------------------- |
| List      | `pf registry list`              | Shows all available skills       |
| Search    | `pf registry search <query>`    | Search by name, tag, description |
| Install   | `pf registry install <skill>`   | Add to local registry            |
| Publish   | `pf registry publish <skill>`   | Publish to shared/community      |
| Deprecate | `pf registry deprecate <skill>` | Mark as superseded               |

---

## QUESTIONS RESOLVED

| Question from Loop 3                    | Resolution                                    |
| --------------------------------------- | --------------------------------------------- |
| How do extensions maintain security?    | Trust level inheritance + capability bounding |
| Can users define custom security rules? | Yes, but cannot override MUST NOT             |
| Security update propagation?            | Version aliasing + deprecation notices        |
| Dependency approval workflow?           | Explicit capability requests                  |

---

## QUESTIONS FOR LOOP 5

1. How do we explain this system to beginners?
2. What's the minimum viable onboarding?
3. What documentation structure is most accessible?
4. How do we make errors actionable for non-experts?
