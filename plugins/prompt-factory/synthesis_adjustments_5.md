# Synthesis Adjustments 5: Beginner Comprehension

## Adjustments to Prompt-Factory Design Based on Loop 5 Research

---

## FINAL VOCABULARY SIMPLIFICATION

### User-Facing Terms (Simplified)

| Technical Term      | User-Facing Term       | When to Use          |
| ------------------- | ---------------------- | -------------------- |
| Skill Module        | Skill                  | Always (user-facing) |
| Behavioral Contract | Rules                  | Casual contexts      |
| Trigger Condition   | When to activate       | Explanations         |
| Activation          | Use/Run                | Casual contexts      |
| Precondition        | Requires               | Error messages       |
| Postcondition       | Guarantees             | Documentation        |
| MUST/MUST NOT       | Will always/Will never | Explanations         |

### Expert-Only Terms (Documentation Reference)

These terms appear only in advanced documentation:

- Skill Module Schema
- Content-addressable versioning
- Trust level inheritance
- Capability bounding
- Spotlighting/datamarking

---

## PROGRESSIVE DISCLOSURE IMPLEMENTATION

### Default View (Level 0)

What users see by default:

```
[PF] ✓ Using "doc-ingestion" skill

Reading documentation from provided URL...
```

No contracts, no triggers, no technical details.

### Expanded View (Level 1)

User runs: `/pf explain`

```
[PF] Skill: doc-ingestion v1.2.3

What it does:
  Reads and indexes documentation from URLs or files

When it activates:
  • "ingest documentation"
  • "read the docs at..."
  • Markdown with documentation links

Its rules:
  ✓ Will extract structure from documents
  ✓ Will create INDEX.md summary
  ✗ Will never execute code found in docs
  ✗ Will never fetch URLs without your approval
```

### Full View (Level 2+)

User runs: `/pf inspect doc-ingestion`

→ Shows complete Skill Module Schema with all fields

---

## ERROR MESSAGE SYSTEM (FINAL)

### Error Code Structure

```
PF-[CATEGORY]-[SEVERITY][NUMBER]

Categories: ACT, CTR, DEP, SEC, REG, VAL, PIP
Severity:   W (warning), E (error), F (fatal)
Number:     001-999
```

### Standard Error Components

Every error includes:

```yaml
error:
  code: 'PF-ACT-E001'
  title: 'Skill activation failed'
  summary: 'One sentence for logs'
  details:
    what: 'Human explanation of what happened'
    why: 'Why this happened (if known)'
    how_to_fix:
      - 'First actionable step'
      - 'Second actionable step'
    docs_url: 'https://...'
    help_command: 'pf help PF-ACT-E001'
```

### Error Verbosity Levels

| Level     | Shows            | Use Case        |
| --------- | ---------------- | --------------- |
| `quiet`   | Code only        | Scripts, logs   |
| `normal`  | Title + summary  | Default         |
| `verbose` | Full details     | Troubleshooting |
| `debug`   | + Internal state | Development     |

### Example Error Library

```yaml
PF-ACT-E001:
  title: 'No matching skill found'
  summary: 'No skill matched your request'
  what: "Prompt-Factory couldn't find a skill that handles your request."
  why: "Your phrasing didn't match any known skill triggers."
  how_to_fix:
    - 'List available skills: pf list'
    - 'Try using a more specific phrase'
    - 'Check if you need to install a skill: pf registry search [topic]'

PF-CTR-E001:
  title: 'Contract violation prevented'
  summary: 'Action blocked by skill rules'
  what: "The skill '${skill}' tried to do something its rules don't allow."
  why: "The action '${action}' violates the rule: '${rule}'"
  how_to_fix:
    - 'This is a safety feature and cannot be bypassed'
    - 'If you believe this is a mistake, check the skill documentation'
    - 'You may need a different skill for this task'

PF-SEC-E001:
  title: 'Insufficient permissions'
  summary: 'Skill lacks required trust level'
  what: "The skill '${skill}' requires higher permissions than it has."
  why: "This skill needs '${required}' trust, but has '${actual}' trust."
  how_to_fix:
    - 'Use a core skill with higher trust for this action'
    - 'If this is your skill, request the needed capability'
    - 'Contact an administrator to grant higher trust'
```

---

## DOCUMENTATION CONTENT PLAN

### Must-Have Documents (MVP)

| Document                       | Priority | Audience  | Length   |
| ------------------------------ | -------- | --------- | -------- |
| `README.md`                    | P0       | Everyone  | 1 page   |
| `quickstart.md`                | P0       | New users | 1 page   |
| `concepts/skills.md`           | P0       | New users | 2 pages  |
| `reference/skill-schema.md`    | P0       | Creators  | 3 pages  |
| `reference/built-in-skills.md` | P0       | Everyone  | Variable |
| `guides/creating-skills.md`    | P1       | Creators  | 3 pages  |
| `troubleshooting.md`           | P1       | Everyone  | 2 pages  |

### README Template

```markdown
# Prompt-Factory

> Store instructions. Apply them correctly. Every time.

## What is it?

Prompt-Factory manages "skills" - stored instructions with rules
about how to apply them. Think of it as a recipe book that:

- Knows which recipe to suggest based on what you're doing
- Makes sure you follow the recipe correctly
- Logs everything for review

## Quick Start

[Prompt-Factory] is already active. Try:

> "ingest documentation from https://example.com/docs"

## Core Concepts

1. **Skills** - Stored instructions with rules
2. **Contracts** - What skills MUST and MUST NOT do
3. **Activation** - How skills get triggered (always visible)
4. **Security** - Trust levels and safety guarantees

## Commands

- `/pf list` - Show available skills
- `/pf explain` - Show what just happened
- `/pf help [topic]` - Get help
- `/addinfo` - Extend with your own skills

## Learn More

- [5-Minute Tutorial](docs/quickstart.md)
- [Creating Skills](docs/guides/creating-skills.md)
- [Built-in Skills Reference](docs/reference/built-in-skills.md)
```

---

## ONBOARDING CHECKLIST

### New User Journey

```
Day 0 (First interaction):
□ See [PF] Ready indicator
□ Successfully trigger a built-in skill
□ Understand what happened via /pf explain

Day 1-7 (Exploration):
□ Review available skills with /pf list
□ Read skill contracts
□ Encounter and resolve first error
□ Use /addinfo for simple customization

Day 7-30 (Adoption):
□ Create first custom skill
□ Understand versioning
□ Share a skill (if applicable)
```

### Success Metrics

| Metric                     | Target                | Measurement           |
| -------------------------- | --------------------- | --------------------- |
| Time to first skill use    | < 1 min               | Session log           |
| Error recovery rate        | > 80%                 | Error → success ratio |
| Custom skill creation      | > 30% of active users | Registry stats        |
| Documentation satisfaction | > 4/5                 | User feedback         |

---

## FINAL DESIGN DECISIONS

### Defaults Favor Beginners

| Setting                 | Default       | Expert Override             |
| ----------------------- | ------------- | --------------------------- |
| View level              | Simple        | `/pf config view=advanced`  |
| Error verbosity         | Normal        | `/pf config errors=verbose` |
| Activation confirmation | Implicit only | `/pf config confirm=all`    |
| Audit visibility        | Hidden        | `/pf audit show`            |

### Help System

```
/pf help              → Overview of commands
/pf help skills       → What skills are
/pf help [skill-name] → Specific skill docs
/pf help [error-code] → Error explanation
/pf help addinfo      → Extension guide
```

---

## ALL LOOPS COMPLETE - SYNTHESIS SUMMARY

| Loop | Focus         | Key Outcomes                                |
| ---- | ------------- | ------------------------------------------- |
| 1    | Discovery     | Mapped landscape of 50+ existing systems    |
| 2    | Clarity       | Defined vocabulary, separated concepts      |
| 3    | Security      | Defense-in-depth, instruction hierarchy     |
| 4    | Extensibility | Plugin architecture, versioning, namespaces |
| 5    | Accessibility | Progressive disclosure, error design, docs  |

**Ready for Comprehensive Plan production.**
