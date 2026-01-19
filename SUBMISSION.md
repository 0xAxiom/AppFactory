# Claude Plugin Marketplace Submission

**Plugin:** Factory

---

## Purpose

This document is provided for formal Claude Plugin Marketplace intake and reviewer context.

---

## 1. Plugin Overview

| Field | Value |
|-------|-------|
| Name | Factory |
| Type | Claude Code Plugin |
| Repository | AppFactory |
| Plugin Location | `plugins/factory/` |

Factory is the official Claude plugin for AppFactory. It provides a governed command interface used to plan pipelines, run builds, perform adversarial QA, and audit outcomes.

Factory is explicitly repository-scoped and is not intended to operate as a standalone plugin.

---

## 2. Intended Audience & Scope

**Intended Users:**
- AppFactory contributors
- Local Claude Code users working within the AppFactory repository

**Explicit Non-Goals:**
- Not consumer-facing
- Not a standalone generator
- Not background automation
- Not remote execution or SaaS integration

This narrow scope is intentional and risk-reducing.

---

## 3. Safety & Permission Model

Factory operates with the following safety constraints:

| Property | Behavior |
|----------|----------|
| Offline by Default | No network calls |
| Approval-Gated | All executions require explicit `approve` input |
| No Background Actions | Only runs when user invokes a command |
| No Telemetry | Does not collect, transmit, or report any data |
| Confined File Writes | Generated files go to `./builds/` only |
| No Secrets Handling | Does not read or store credentials |

These constraints are documented in:
- `plugins/factory/INVARIANTS.md`
- `plugins/factory/README.md`

---

## 4. Commands Exposed (v1)

| Command | Purpose |
|---------|---------|
| `/factory help` | Show command reference |
| `/factory plan <idea>` | Generate execution plan (no execution) |
| `/factory run <pipeline> <idea>` | Execute with mandatory approval gate |
| `/factory ralph <path> [--loops N]` | Code review (1-5 loops) |
| `/factory audit` | View execution history |

No additional commands are registered.

---

## 5. Internal Dependencies

Factory uses repository-local tooling for governance and QA. These are implementation details. No external services or third-party APIs are required.

---

## 6. Quality & Review Process

Factory underwent:
- A 5-loop adversarial review ("Ralph")
- Marketplace-focused rejection analysis
- Documentation hardening for <2-minute reviewer comprehension

Review artifacts are located in:

```
plugins/factory/polish/
```

**Final Verdict:** Approved with minor notes

**Estimated Acceptance Confidence:** ~95%

---

## 7. Update Policy

For v1.x releases:
- Limited to documentation, bug fixes, and pipeline mappings
- No silent behavior changes
- No permission expansion without documentation
- Major changes require major version bump

---

## 8. Reviewer Notes

Factory is intentionally conservative. In ambiguity cases:
- Prefer written invariants
- Assume no action without approval
- Assume no data leaves local environment

Reference documentation:
- `plugins/factory/README.md`
- `plugins/factory/INVARIANTS.md`
- `plugins/factory/PROOF_GATE.md`

---

End of submission document
