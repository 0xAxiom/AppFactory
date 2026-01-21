# Positioning: Codebase Explainer Agent

**Date**: 2026-01-17

---

## Positioning Statement

**For** developers who need to understand unfamiliar codebases,
**The** Codebase Explainer Agent **is a** autonomous exploration tool
**That** answers natural language questions by actively navigating code, tracing dependencies, and synthesizing clear explanations with relevant snippets.
**Unlike** passive AI chat tools or manual code navigation,
**Our product** explores on your behalf using typed tools, returns structured insights with line numbers, and suggests follow-up questions—without modifying any code.

---

## Value Proposition Canvas

### Customer Jobs

| Job                                      | Type       | Priority |
| ---------------------------------------- | ---------- | -------- |
| Understand how a feature works           | Functional | High     |
| Find where something is implemented      | Functional | High     |
| Trace data flow through the system       | Functional | High     |
| Answer "why was it built this way?"      | Emotional  | Medium   |
| Feel confident reviewing unfamiliar code | Emotional  | High     |
| Reduce interruptions to teammates        | Social     | Medium   |

### Pains

| Pain                                            | Severity |
| ----------------------------------------------- | -------- |
| Hours spent reading code to find relevant parts | High     |
| Outdated or missing documentation               | High     |
| Fear of breaking things you don't understand    | Medium   |
| Embarrassment asking "dumb" questions           | Medium   |
| Context switching while tracing imports         | High     |

### Gains

| Gain                                  | Impact |
| ------------------------------------- | ------ |
| Instant understanding of any codebase | High   |
| Confidence in code review             | High   |
| Faster onboarding                     | High   |
| Self-service code knowledge           | Medium |
| Audit trail of explorations           | Low    |

---

## Unique Value Proposition

### The One-Liner

**"Ask questions. We explore. You understand."**

### The Elevator Pitch

The Codebase Explainer Agent is like having a senior engineer who knows the entire codebase instantly available to answer your questions. You ask "How does authentication work?" and instead of pointing you to a file, it explores the code, traces imports, reads relevant files, and returns a clear explanation with the exact code snippets you need—with line numbers so you can dive deeper.

### The Technical Pitch

A Rig-aligned agent with four typed tools (list_directory, read_file, search_code, analyze_imports) that executes an iterative reasoning loop to answer questions about codebases. Returns structured JSON with explanation, annotated code snippets, confidence score, and suggested follow-up questions. Respects safety boundaries (read-only, path validation, configurable scope) and gracefully handles large codebases through intelligent file limiting.

---

## Differentiation Strategy

### Primary Differentiator: Autonomous Exploration

Most tools answer questions about code you've already found.
**We find the code that answers your question.**

```
Traditional Flow:
  User → searches files → opens file → reads code → asks AI → gets explanation

Our Flow:
  User → asks question → agent explores → returns explanation + code
```

### Secondary Differentiators

1. **Structured Output**
   - Not just prose—code snippets with file paths, line numbers, and relevance notes
   - Suggested follow-up questions guide deeper exploration

2. **Rig-Aligned Architecture**
   - Real production patterns, not tutorial code
   - Composable tools that can be extended
   - Typed inputs/outputs for reliability

3. **Read-Only Safety**
   - Guaranteed not to modify files
   - Path traversal prevention
   - Configurable scope limits

4. **API-First**
   - HTTP interface for integration
   - Use from any tool, editor, or workflow
   - Structured responses for programmatic use

---

## Target Segments (Priority Order)

### Segment 1: Onboarding Developers

**Profile**: New team members joining existing projects
**Need**: Rapid codebase understanding
**Value**: 50% reduction in time-to-productivity
**Channel**: Team lead recommendations, DevEx teams

### Segment 2: Code Reviewers

**Profile**: Engineers reviewing PRs in unfamiliar areas
**Need**: Quick context for changes
**Value**: 3x faster reviews, higher quality feedback
**Channel**: PR integration, IDE plugins

### Segment 3: Technical Writers

**Profile**: Documentation specialists
**Need**: Understand code to document it
**Value**: Accurate, current documentation
**Channel**: Documentation tooling integrations

### Segment 4: Security Auditors

**Profile**: Security engineers doing code review
**Need**: Trace data flow, find vulnerabilities
**Value**: Comprehensive exploration, audit trail
**Channel**: Security tool integrations

---

## Messaging Framework

### Headline Options

1. "Understand Any Codebase in Seconds"
2. "The AI That Explores Code For You"
3. "Ask Questions. Get Answers. See the Code."
4. "Your Always-Available Senior Engineer"

### Tagline Options

1. "Autonomous codebase understanding"
2. "Questions in. Explanations out."
3. "Stop searching. Start asking."

### Key Messages by Audience

| Audience             | Key Message                                                     |
| -------------------- | --------------------------------------------------------------- |
| Developers           | "Ask questions in English, get explanations with code snippets" |
| Engineering Managers | "Reduce onboarding time, decrease cross-team interruptions"     |
| DevEx Teams          | "API-first codebase understanding for your developer portal"    |

---

## Competitive Positioning Map

```
                    Autonomous Exploration
                            ^
                            |
         [Codebase Explainer]
                            |
                    +-------+--------+
                    |                |
    Passive    ----[Copilot]----[Cursor]---- Active Editing
                    |                |
               [Cody]           [Aider]
                    |
                            |
                    Static Analysis
```

**We own the top-left quadrant**: Autonomous exploration without editing.

---

## Go-to-Market Positioning

### Phase 1: Open Source Launch

- Position as "the open-source codebase explainer"
- Target individual developers and small teams
- BYOK model (bring your own API key)
- GitHub stars as social proof

### Phase 2: API Hosting

- Managed API for teams
- Usage-based pricing
- Enterprise features (SSO, audit logs)

### Phase 3: Integrations

- IDE plugins (VS Code, JetBrains)
- PR review integrations (GitHub, GitLab)
- Documentation platforms

---

## Proof Points to Build

1. **Time Savings**: "Reduced average code understanding time from 2 hours to 15 minutes"
2. **Accuracy**: "90%+ of explanations validated as accurate by users"
3. **Adoption**: "Used by X developers to understand Y repositories"
4. **Coverage**: "Successfully explained codebases up to 500K lines"

---

## Conclusion

The Codebase Explainer Agent is positioned as the **autonomous exploration** tool in a market of passive assistants. Our differentiation is not just technical (Rig-aligned, typed tools, structured output) but experiential: **we explore so you don't have to**.

This positioning:

- Addresses a clear, validated pain point
- Differentiates from established competitors
- Enables expansion into adjacent use cases
- Supports both open-source community and commercial paths
