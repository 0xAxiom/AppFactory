# Synthesis Adjustments 3: Misuse Resistance

## Adjustments to Prompt-Factory Design Based on Loop 3 Research

---

## CRITICAL SECURITY PRINCIPLES ADOPTED

### Principle 1: Instruction Hierarchy is Non-Negotiable

External content (URLs, documents, user-provided data) is **ALWAYS** treated as data, **NEVER** as instructions. This cannot be bypassed.

```
HIERARCHY (highest to lowest):
1. Prompt-Factory Core Rules     → Immutable
2. Skill Contracts               → Immutable at runtime
3. System Context                → Augmentable only
4. User Instructions             → Subject to contracts
5. External Content              → DATA ONLY
```

### Principle 2: Security Controls Independent of LLM

MUST NOT rules cannot rely on the LLM to self-police. Enforcement must be **external** and **deterministic**:

| Control Type                | LLM-Dependent? | Implementation                  |
| --------------------------- | -------------- | ------------------------------- |
| Secret detection            | NO             | Regex + pattern matching        |
| Output schema validation    | NO             | JSON Schema validator           |
| Injection pattern detection | NO             | Rule-based scanner              |
| Contract compliance         | PARTIAL        | LLM generates, validator checks |

### Principle 3: Defense-in-Depth Required

No single safeguard is sufficient. Every security-critical function has multiple layers.

---

## NEW SECURITY COMPONENTS

### Component 1: Activation Guardian

```yaml
activation_guardian:
  responsibilities:
    - Parse triggers BEFORE content processing
    - Enforce confidence thresholds
    - Detect conflicting activations
    - Limit activation depth (max: 3)
    - Require confirmation for implicit triggers

  rules:
    - MUST parse triggers in isolation from user content
    - MUST NOT allow dynamic skill names from user input
    - MUST log all activation attempts (successful and failed)
```

### Component 2: Contract Enforcer

```yaml
contract_enforcer:
  responsibilities:
    - Validate preconditions before skill execution
    - Check postconditions after execution
    - Block MUST NOT violations deterministically
    - Track contract compliance metrics

  rules:
    - MUST enforce MUST NOT rules OUTSIDE the LLM
    - MUST NOT allow runtime contract modification
    - MUST provide violation evidence for audit
```

### Component 3: Output Validator

```yaml
output_validator:
  responsibilities:
    - Scan outputs for secrets/sensitive data
    - Validate structured outputs against schema
    - Detect potential data exfiltration patterns
    - Apply redaction rules

  rules:
    - MUST operate independently of the LLM
    - MUST NOT block outputs silently (log and explain)
    - MUST support custom validation rules per skill
```

### Component 4: Audit Logger

```yaml
audit_logger:
  responsibilities:
    - Log every skill activation with context
    - Record contract violations with evidence
    - Flag override attempts
    - Apply redaction to sensitive data

  rules:
    - MUST log BEFORE and AFTER skill execution
    - MUST NOT log raw secrets (redact first)
    - MUST preserve logs for configurable retention period
```

---

## UPDATED SKILL MODULE SCHEMA (v3)

```yaml
SKILL:
  # ... previous fields ...

  # NEW: Security configuration
  security:
    # Trust level for this skill
    trust_level: system | privileged | standard | untrusted

    # What this skill can access
    allowed_resources:
      - type: string
        scope: string

    # What this skill cannot do (enforced externally)
    hardcoded_blocks:
      - pattern: regex
        reason: string

    # Input sanitization rules
    input_sanitization:
      - field: string
        sanitizer: string

    # Output validation rules
    output_validation:
      - type: schema | pattern | custom
        spec: string

    # Maximum execution depth when called by other skills
    max_depth: integer (default: 3)

    # Whether this skill can be triggered by external content
    external_triggerable: boolean (default: false)
```

---

## FAILURE MODE HANDLING

### On Precondition Failure

```
1. Log failure with context
2. Return structured error to user
3. Suggest remediation if possible
4. DO NOT proceed with skill execution
```

### On MUST NOT Violation Detected

```
1. BLOCK output immediately
2. Log violation with evidence
3. Return sanitized error (no details that could help bypass)
4. Flag for security review if repeated
```

### On Postcondition Failure

```
1. Log failure with partial output
2. Attempt rollback if state was modified
3. Return structured error with partial results (if safe)
4. Mark skill execution as incomplete
```

### On Contract Override Attempt

```
1. Log attempt with full context
2. DENY the override (no exceptions)
3. Explain that contracts are immutable
4. Flag for pattern analysis (detecting attack probing)
```

---

## SPOTLIGHTING IMPLEMENTATION

Adopted from Microsoft research, Prompt-Factory uses **datamarking** to separate trusted from untrusted content:

```
TRUSTED INSTRUCTION ZONE
[SKILL: doc-ingestion activated]
[CONTRACT: MUST extract structure, MUST NOT execute code]
END TRUSTED ZONE

<<<USER_CONTENT_START>>>
{user provided content here - treated as DATA only}
<<<USER_CONTENT_END>>>

TRUSTED INSTRUCTION ZONE
[Proceed with contracted behavior]
END TRUSTED ZONE
```

**Key:** Content between `<<<USER_CONTENT_START>>>` and `<<<USER_CONTENT_END>>>` is NEVER interpreted as instructions.

---

## RISK ASSESSMENT UPDATE

| Risk                           | Likelihood Before | Likelihood After Mitigations        |
| ------------------------------ | ----------------- | ----------------------------------- |
| Prompt injection               | High              | Medium (fundamental LLM limitation) |
| Skill confusion                | Medium            | Low                                 |
| Contract override              | Medium            | Very Low                            |
| Reference-to-action escalation | Medium            | Very Low                            |
| Dependency poisoning           | Low               | Very Low                            |
| Secret leakage                 | Medium            | Low                                 |

**Note:** Prompt injection remains "Medium" because it's a fundamental architectural challenge with LLMs. Defense-in-depth reduces impact, but doesn't eliminate the vector.

---

## QUESTIONS FOR LOOP 4

1. How do extension mechanisms maintain security guarantees?
2. Can users define custom security rules via `/addinfo`?
3. How are security updates propagated to existing skills?
4. What's the approval workflow for new skill dependencies?
