# Ralph Loop 1: Scope & Intent Clarity

**Focus:** Is the plugin's purpose immediately obvious? Could a reviewer misunderstand what it does?

---

## Critique Report

### Issues Found

| # | Location | Issue | Severity |
|---|----------|-------|----------|
| 1 | plugin.json:4 | "Generates mobile apps, dApps, agents, and plugins" sounds autonomous | HIGH |
| 2 | README:7 | "governed interface" is jargon | MEDIUM |
| 3 | README:23 | "Adversarial QA (Ralph)" — "Ralph" is unexplained internal jargon | MEDIUM |
| 4 | README:84 | Architecture section exposes prompt-factory dependency | HIGH |
| 5 | README | No "What Factory Is NOT" section for non-goals | MEDIUM |
| 6 | README:91 | "All governance logic lives in prompt-factory" — confusing for standalone plugin | HIGH |

### Detailed Analysis

**Issue 1: Autonomous Language in Description**
The phrase "Generates mobile apps..." implies Factory does this automatically. A reviewer may think this is an autonomous code generation agent. It should emphasize user control.

**Issue 4 & 6: prompt-factory Dependency Exposure**
The README prominently mentions "prompt-factory" as if it's a separate, known entity. A marketplace reviewer will ask:
- "Is prompt-factory also in the marketplace?"
- "Do users need to install it separately?"
- "What happens if prompt-factory isn't available?"

This creates confusion about scope and dependencies.

**Issue 3: "Ralph" Jargon**
"Ralph" is an internal term for adversarial review. Without context, it sounds like a proper noun (a person?) rather than a QA process.

---

## Recommendations

1. **Rewrite plugin.json description** to emphasize user control
2. **Remove or minimize prompt-factory references** in user-facing docs
3. **Explain "Ralph"** or rename to clearer term
4. **Add explicit non-goals section** to README
5. **Simplify "governed interface"** to plain language

---

## Applied Fixes

### Fix 1: plugin.json — Clarify description (already applied)
Changed to emphasize planning and approval rather than autonomous generation.

### Fix 2: README — Rewrite for clarity
See edits below.

---

## Resolution Note

After fixes, the plugin's purpose should be immediately clear:
- It helps you plan and execute pipelines
- It always asks for approval
- It writes files only where you specify
- It logs everything

The dependency on prompt-factory is now treated as an internal implementation detail, not a user concern.
