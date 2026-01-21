# Skill Module Schema v1.0

This document defines the canonical schema for Prompt-Factory skill modules.

## Schema Definition

```yaml
# SKILL MODULE SCHEMA v1.0
# All fields marked [REQUIRED] must be present
# All fields marked [OPTIONAL] have defaults shown

skill:
  # === IDENTITY ===
  name: string # [REQUIRED] kebab-case, unique identifier
  version: string # [REQUIRED] semver format (e.g., "1.0.0")
  description: string # [REQUIRED] one-sentence description

  # === CLASSIFICATION ===
  category:
    enum # [REQUIRED] one of:
    # - doc-ingestion
    # - link-traversal
    # - prompt-compilation
    # - pipeline-execution
    # - repo-analysis
    # - security-hygiene
    # - qa-adversarial
    # - format-enforcement

  # === ACTIVATION ===
  triggers:
    explicit: # [OPTIONAL] phrases that directly activate
      - phrase: string # The trigger phrase
        confidence: high | medium # [default: high]
    implicit: # [OPTIONAL] signals that suggest activation
      - signal: string # Description of the signal
        requires_confirmation: boolean # [default: true]

  # === CONTRACTS ===
  contracts:
    preconditions: # [OPTIONAL] must be true before execution
      - condition: string # What must be true
        failure_action: string # What to do if false
    must: # [REQUIRED] behaviors skill WILL do
      - string # Behavior description
    must_not: # [REQUIRED] behaviors skill WILL NEVER do
      - string # Prohibited behavior
    postconditions: # [OPTIONAL] guaranteed after execution
      - condition: string # What will be true
        verification: string # How to verify

  # === INTERFACE ===
  inputs:
    required: # [OPTIONAL] inputs that must be provided
      - name: string
        type: string
        description: string
    optional: # [OPTIONAL] inputs with defaults
      - name: string
        type: string
        default: any
        description: string

  outputs:
    contracted: # [OPTIONAL] outputs always produced
      - name: string
        type: string
        description: string
    conditional: # [OPTIONAL] outputs sometimes produced
      - name: string
        condition: string
        type: string

  # === FAILURE HANDLING ===
  failure_modes: # [OPTIONAL]
    - trigger: string # What causes this failure
      behavior: string # How skill behaves
      recovery: string | null # How to recover (null = no recovery)

  # === SECURITY ===
  security:
    trust_level:
      enum # [default: standard]
      # - system      : Core PF skills only
      # - privileged  : Approved high-trust
      # - standard    : Normal user skills
      # - untrusted   : Unknown/unverified
    allowed_resources: # [OPTIONAL] what skill can access
      - type: string # Resource type (network, filesystem, etc.)
        scope: string # Scope limitation
    hardcoded_blocks: # [OPTIONAL] patterns always blocked
      - pattern: string # Regex pattern
        reason: string # Why blocked
    max_depth: integer # [default: 3] max recursive activation depth
    external_triggerable: boolean # [default: false] can external content trigger?

  # === DEPENDENCIES ===
  dependencies: # [OPTIONAL]
    skills: # Other skills required
      - name: string
        version: string # Semver range
        optional: boolean # [default: false]
    resources: # External resources needed
      - type: string
        scope: string

  # === AUDIT ===
  audit:
    created: string # [REQUIRED] ISO8601 timestamp
    modified: string # [REQUIRED] ISO8601 timestamp
    author: string # [REQUIRED] who created this
    rationale: string # [OPTIONAL] why this skill exists
```

## Validation Rules

### Name Validation

- Must be kebab-case: `^[a-z][a-z0-9]*(-[a-z0-9]+)*$`
- Max length: 64 characters
- Reserved prefixes: `core/`, `system/`

### Version Validation

- Must be valid semver: `^\\d+\\.\\d+\\.\\d+$`
- Pre-release suffixes allowed: `-alpha`, `-beta`, `-rc.1`

### Contract Rules

- `must` array must have at least 1 item
- `must_not` array must have at least 1 item
- Contracts are IMMUTABLE after skill reaches `stable` state

### Security Rules

- User-created skills cannot have `trust_level: system`
- `trust_level: privileged` requires explicit approval
- `external_triggerable: true` requires `trust_level: system`
