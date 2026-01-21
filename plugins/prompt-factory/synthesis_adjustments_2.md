# Synthesis Adjustments 2: Conceptual Clarity

## Adjustments to Prompt-Factory Design Based on Loop 2 Research

---

## TERMINOLOGY STANDARDIZATION

### Adopted Terms

| Term                | Status   | Rationale                                              |
| ------------------- | -------- | ------------------------------------------------------ |
| Skill Module        | **KEEP** | Distinct from "prompt template" - implies completeness |
| Behavioral Contract | **KEEP** | Aligns with research on LLM API contracts              |
| Trigger Condition   | **KEEP** | Clear activation semantics                             |
| Provenance          | **KEEP** | Distinguishes reference from action                    |
| Pipeline Gate       | **KEEP** | Explicit checkpoint concept                            |

### Refined Terms

| Original                   | Revised                  | Rationale                                        |
| -------------------------- | ------------------------ | ------------------------------------------------ |
| "Deterministic generation" | "Procedural determinism" | Honest about LLM limitations                     |
| "Rules"                    | "Contracts"              | Stronger semantics, aligns with research         |
| "Outputs guaranteed"       | "Outputs contracted"     | Clarity that these are promises, not certainties |

### Removed Terms

| Term       | Why Removed                                |
| ---------- | ------------------------------------------ |
| "Memory"   | Too ambiguous; use "registry" or "context" |
| "Remember" | Implies persistence we don't guarantee     |

---

## SCHEMA REFINEMENTS

### Updated Skill Module Schema v2

```yaml
SKILL:
  # Identity
  name: string (kebab-case)
  version: semver
  description: string (one sentence)

  # Classification
  category: enum # One of the 8 defined categories

  # Activation
  triggers:
    explicit:
      - phrase: string
        confidence: high | medium
    implicit:
      - signal: string
        requires_confirmation: boolean

  # Contracts (not "rules")
  contracts:
    preconditions:
      - condition: string
        failure_action: string
    must:
      - behavior: string
    must_not:
      - behavior: string
    postconditions:
      - condition: string
        verification: string

  # Interface
  inputs:
    required:
      - name: string
        type: string
        description: string
    optional:
      - name: string
        type: string
        default: any

  outputs:
    contracted:
      - name: string
        type: string
        description: string
    conditional:
      - name: string
        condition: string

  # Failure handling
  failure_modes:
    - trigger: string
      behavior: string
      recovery: string | null

  # Dependencies
  dependencies:
    skills: [skill-name]
    resources: [resource-type]

  # Audit
  audit:
    created: ISO8601
    modified: ISO8601
    author: string
    rationale: string
```

### Key Changes from v1

1. **Triggers split**: Explicit (high confidence) vs implicit (may need confirmation)
2. **Contracts expanded**: Added preconditions and postconditions
3. **Failure modes enhanced**: Added recovery actions
4. **Naming convention**: kebab-case enforced for skill names

---

## DETERMINISM POLICY

### What We Promise

```
┌────────────────────────────────────────────────────────────┐
│ PROMPT-FACTORY DETERMINISM GUARANTEES                       │
├────────────────────────────────────────────────────────────┤
│ ✓ Same skill + same inputs → same PROCEDURE followed       │
│ ✓ Contracts (MUST/MUST NOT) are ALWAYS enforced            │
│ ✓ Every activation is LOGGED with full rationale           │
│ ✓ Pipeline stages execute in DEFINED order                 │
│ ✓ Manual steps are ALWAYS surfaced                         │
├────────────────────────────────────────────────────────────┤
│ ✗ Bit-identical LLM outputs (NOT possible)                 │
│ ✗ Identical token sequences (NOT possible)                 │
│ ✗ Same latency across runs (NOT possible)                  │
└────────────────────────────────────────────────────────────┘
```

### Determinism Tiers

| Tier            | Description         | Example                  |
| --------------- | ------------------- | ------------------------ |
| **Procedural**  | Same steps followed | Skill activation order   |
| **Contractual** | Same rules enforced | MUST NOT include secrets |
| **Structural**  | Same output format  | JSON schema compliance   |
| **Semantic**    | Same meaning        | NOT guaranteed           |
| **Lexical**     | Same tokens         | NOT guaranteed           |

---

## CATEGORY REFINEMENTS

### Final Category Taxonomy

| Category             | Scope                             | Typical Triggers                           |
| -------------------- | --------------------------------- | ------------------------------------------ |
| `doc-ingestion`      | Processing external documentation | "ingest", "read docs", markdown with hrefs |
| `link-traversal`     | URL handling and fetching         | URLs in input, "fetch", "traverse"         |
| `prompt-compilation` | Building structured prompts       | "create prompt", "compile instructions"    |
| `pipeline-execution` | Multi-stage workflows             | "run pipeline", "execute stages"           |
| `repo-analysis`      | Codebase understanding            | "analyze repo", "understand code"          |
| `security-hygiene`   | Preventing harmful outputs        | Always active (background)                 |
| `qa-adversarial`     | Testing and challenging           | "test", "verify", "challenge", "ralph"     |
| `format-enforcement` | Output structure validation       | Schema references, format requests         |

**Change:** Renamed `deterministic_generation` → `format-enforcement` (more honest).

---

## OPEN QUESTIONS RESOLVED

| Question from Loop 1                 | Resolution                                                                   |
| ------------------------------------ | ---------------------------------------------------------------------------- |
| Should skills support inheritance?   | **YES** - via `dependencies.skills`                                          |
| How to handle skill conflicts?       | **Priority rules** + explicit disambiguation                                 |
| Right granularity for triggers?      | **Two tiers** - explicit (high confidence) and implicit (needs confirmation) |
| Should there be a meta-skill router? | **NO** - routing logic is in Prompt-Factory core, not a skill                |

---

## NEW QUESTIONS FOR LOOP 3

1. What are the specific failure modes that need safeguards?
2. How do we prevent prompt injection attacks on skills?
3. What happens when a skill's contract is violated at runtime?
4. How do we handle partial skill execution failures?
