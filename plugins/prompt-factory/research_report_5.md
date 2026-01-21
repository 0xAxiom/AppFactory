# Research Report 5: Beginner Comprehension

## Ralph Adversarial Research Loop 5

**Focus:** Simplifying explanations, designing accessible documentation, and making errors actionable.

---

## Progressive Disclosure for Prompt-Factory

### Principle: "Abstract to Specific"

Users should be able to use Prompt-Factory at whatever level of depth they need:

```
Level 0: "Just use it"
         │
         │ User doesn't need to know internal details
         │ Default skills work automatically
         │
Level 1: "Understand what's happening"
         │
         │ User sees skill activations
         │ Can view contracts
         │
Level 2: "Customize behavior"
         │
         │ User modifies triggers
         │ Adds their own skills (draft)
         │
Level 3: "Full control"
         │
         │ User creates complex skills
         │ Manages dependencies
         │ Publishes to registries
```

### UI Layering

| Layer        | What's Visible             | What's Hidden                  |
| ------------ | -------------------------- | ------------------------------ |
| **Simple**   | Skill name, description    | Contracts, triggers, security  |
| **Standard** | + Triggers, inputs/outputs | Security details, dependencies |
| **Advanced** | + Contracts, failure modes | Implementation internals       |
| **Expert**   | Everything                 | Nothing                        |

---

## One-Page Explanation

### The "Elevator Pitch" for Prompt-Factory

> **Prompt-Factory is a system that stores instructions (called "Skills") and makes sure they're applied correctly, consistently, and safely.**
>
> Think of it like a recipe book where:
>
> - Each recipe (Skill) has clear ingredients (inputs) and steps (contracts)
> - The book knows when to suggest a recipe based on what you're cooking
> - The book prevents you from accidentally using spoiled ingredients (security)
> - Every time you cook, it logs what happened (audit)

### Five Things You Need to Know

1. **Skills are stored instructions** - Not just prompts, but complete behavioral contracts
2. **Nothing runs silently** - You always know what's being activated and why
3. **Links are references, not commands** - URLs inform context, they don't trigger actions
4. **Contracts are enforced** - MUST and MUST NOT rules are non-negotiable
5. **You can extend it** - Add your own skills with `/addinfo`

---

## Documentation Structure

### Recommended Organization

```
docs/
├── getting-started/
│   ├── quickstart.md          # 5-minute intro
│   ├── first-skill.md         # Create your first skill
│   └── faq.md                 # Common questions
│
├── concepts/
│   ├── skills.md              # What skills are
│   ├── contracts.md           # MUST/MUST NOT explained
│   ├── activation.md          # How skills get triggered
│   └── security.md            # Trust levels and safety
│
├── guides/
│   ├── creating-skills.md     # Step-by-step skill creation
│   ├── using-addinfo.md       # Extension mechanism
│   ├── version-management.md  # Versioning skills
│   └── troubleshooting.md     # Common issues
│
├── reference/
│   ├── skill-schema.md        # Complete schema reference
│   ├── built-in-skills.md     # All core skills
│   ├── commands.md            # CLI commands
│   └── error-codes.md         # Error reference
│
└── examples/
    ├── simple-skill.yaml      # Basic example
    ├── pipeline-skill.yaml    # Multi-stage example
    └── secure-skill.yaml      # Security-focused example
```

### Documentation Principles (from Research)

1. **User-first approach** - Write for the reader, not the expert
2. **Segment by experience** - Quickstart for new users, reference for experts
3. **Single source of truth** - All docs in one place, searchable
4. **Docs-as-code** - Version control, automated testing
5. **Templates** - Consistent structure across all docs

---

## Error Message Design

### Prompt-Factory Error Template

```
┌─────────────────────────────────────────────────────────────┐
│ ❌ ERROR: [Short, human-readable title]                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ What happened:                                               │
│   [Clear explanation of the problem]                        │
│                                                              │
│ Why it happened:                                            │
│   [Context about the cause, if known]                       │
│                                                              │
│ How to fix it:                                              │
│   1. [First actionable step]                                │
│   2. [Second actionable step]                               │
│                                                              │
│ Need help?                                                   │
│   → Run: pf help [error-code]                               │
│   → Docs: https://prompt-factory.dev/errors/[code]          │
│                                                              │
│ Error code: PF-[category]-[number]                          │
└─────────────────────────────────────────────────────────────┘
```

### Error Categories

| Code Prefix | Category            | Example                                |
| ----------- | ------------------- | -------------------------------------- |
| `PF-ACT-*`  | Activation errors   | `PF-ACT-001: No matching skill`        |
| `PF-CTR-*`  | Contract violations | `PF-CTR-002: MUST NOT rule violated`   |
| `PF-DEP-*`  | Dependency issues   | `PF-DEP-003: Missing dependency`       |
| `PF-SEC-*`  | Security blocks     | `PF-SEC-004: Insufficient trust level` |
| `PF-REG-*`  | Registry errors     | `PF-REG-005: Skill not found`          |
| `PF-VAL-*`  | Validation failures | `PF-VAL-006: Invalid input format`     |

### Example Error Messages

**Bad (Technical Jargon):**

```
Error: ACTIVATION_FAILURE - trigger_match_confidence below threshold
       (0.3 < 0.5) for skill doc-ingestion@1.2.3
```

**Good (Human-Readable):**

```
❌ ERROR: Couldn't activate skill

What happened:
  The phrase "read my docs" partially matched the skill "doc-ingestion",
  but not confidently enough to activate automatically.

Why it happened:
  Prompt-Factory requires high confidence before activating skills
  to prevent accidental activations.

How to fix it:
  1. Be more specific: Try "ingest documentation from this URL"
  2. Or explicitly request: "/activate doc-ingestion"

Error code: PF-ACT-002
```

---

## Onboarding Journey

### 30-Second Quickstart

```
1. Start a conversation
2. Prompt-Factory is already active (shows "[PF] Ready")
3. Try: "ingest the documentation at [URL]"
4. See: Skill activation notification
5. Done!
```

### 5-Minute Tutorial

```
1. What is Prompt-Factory?
   → Brief explanation (30 seconds)

2. See it in action
   → Activate a built-in skill (1 minute)

3. Understand what happened
   → View skill contract (1 minute)

4. Check the audit trail
   → See logged activations (30 seconds)

5. Your first customization
   → Add a trigger with /addinfo (2 minutes)
```

### Common Beginner Questions

| Question                        | Simple Answer                                          |
| ------------------------------- | ------------------------------------------------------ |
| "What's a skill?"               | A stored instruction with rules about how to follow it |
| "What's a contract?"            | A promise about what the skill MUST or MUST NOT do     |
| "Why didn't my skill activate?" | It needs a confident match. Try being more specific.   |
| "Can I create my own skill?"    | Yes! Use `/addinfo skill` and follow the template      |
| "What's `/addinfo`?"            | A command to extend Prompt-Factory with your own stuff |
| "Is my data safe?"              | Skills follow security rules and everything is logged  |

---

## Accessibility Considerations

### Screen Reader Support

- All error messages have text descriptions
- Progress indicators announced
- Skill activations spoken aloud

### Cognitive Load Reduction

- Default to simple view
- Expand complexity on demand
- Use consistent patterns
- Limit options at each level (7±2 rule)

### Language

- Avoid jargon where possible
- Define terms on first use
- Provide glossary
- Use active voice

---

## Sources

- [Developer Onboarding Best Practices - Cortex](https://www.cortex.io/post/developer-onboarding-guide)
- [Technical Documentation Best Practices 2025 - 42 Coffee Cups](https://www.42coffeecups.com/blog/technical-documentation-best-practices)
- [Developer Onboarding Documentation - Multiplayer](https://www.multiplayer.app/blog/developer-onboarding-documentation/)
- [Progressive Disclosure - Nielsen Norman Group](https://www.nngroup.com/articles/progressive-disclosure/)
- [Progressive Disclosure: Simplifying Complexity - Shopify](https://www.shopify.com/partners/blog/progressive-disclosure)
- [Progressive Disclosure of Complexity - Jason.Energy](https://jason.energy/progressive-disclosure-of-complexity/)
- [Error-Message Guidelines - Nielsen Norman Group](https://www.nngroup.com/articles/error-message-guidelines/)
- [Error Messages UX Design - Smashing Magazine](https://www.smashingmagazine.com/2022/08/error-messages-ux-design/)
- [Error Feedback Patterns - Pencil & Paper](https://www.pencilandpaper.io/articles/ux-pattern-analysis-error-feedback)

---

## Beginner Comprehension Self-Assessment

| Aspect              | Clarity Level | Notes                          |
| ------------------- | ------------- | ------------------------------ |
| Elevator pitch      | High          | One paragraph explains it      |
| Five things to know | High          | Core concepts distilled        |
| Doc structure       | High          | Progressive disclosure applied |
| Error messages      | High          | Template + examples            |
| Onboarding journey  | Medium        | Needs real-world testing       |
| Accessibility       | Medium        | Needs implementation           |
