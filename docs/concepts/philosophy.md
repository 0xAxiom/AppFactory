# AppFactory Philosophy

This document explains the design principles behind AppFactory.

---

## Core Idea

AppFactory exists to bridge the gap between having an idea and having working software.

Traditional software development requires:

1. Learning programming languages
2. Understanding frameworks
3. Setting up development environments
4. Writing thousands of lines of code
5. Testing and debugging
6. Creating deployment configurations

AppFactory compresses this into a single step: describe what you want.

---

## Design Principles

### 1. Plain Language Input

You should not need to know technical details to use AppFactory. Describe your idea in whatever terms feel natural:

- "I want an app where people can track their habits"
- "Make me a website for my photography portfolio"
- "Build an AI agent that summarizes articles"

The system interprets your intent and fills in technical decisions.

### 2. Intent Normalization

Vague ideas become professional specifications through **intent normalization**.

**What you say:**

> "make me a meditation app"

**What gets built:**

> A meditation app with guided sessions, breathing exercises, progress tracking, streak calendars, ambient sound mixing, smooth animations, offline support, dark mode, and subscription monetization.

This transformation happens automatically. You describe the concept; the system adds industry-standard features.

### 3. Complete Outputs

AppFactory generates complete, runnable applications. Not templates. Not stubs. Complete code that you can run immediately.

Every output includes:

- Working application code
- Dependency configuration
- Documentation
- Run instructions

### 4. Quality Enforcement

Every build passes through **Ralph Mode**, an adversarial quality checker. Ralph examines the output and requires fixes until quality reaches 97%+.

This means:

- You don't receive broken code
- Accessibility is checked
- Error handling is present
- TypeScript types are correct

### 5. Transparency

Nothing happens silently. The system shows:

- What it plans to do
- What it's currently doing
- What it generated
- What quality issues it found

Audit logs track all operations. You can trace any decision.

---

## What AppFactory Is Not

### Not a Hosted Service

AppFactory runs locally on your machine. Your ideas and code stay on your computer. There is no server receiving your data (unless you configure external APIs).

### Not a Template System

Templates provide starting points. AppFactory generates finished products. The output is customized to your specific idea, not a generic scaffold.

### Not Magic

The generated code follows standard practices. You can read it, modify it, and learn from it. There are no proprietary runtimes or locked dependencies.

### Not a Replacement for Developers

AppFactory accelerates development. It handles boilerplate and standard patterns. Complex business logic, custom integrations, and unique requirements still benefit from human expertise.

---

## The Pipeline Model

AppFactory is organized into **pipelines**. Each pipeline specializes in one type of output:

| Pipeline         | Specialization                     |
| ---------------- | ---------------------------------- |
| app-factory      | Mobile apps (React Native + Expo)  |
| dapp-factory     | Web apps (Next.js)                 |
| website-pipeline | Static websites (Next.js)          |
| agent-factory    | AI agents (Node.js HTTP servers)   |
| plugin-factory   | Claude Code plugins                |
| miniapp-pipeline | Base Mini Apps (MiniKit + Next.js) |

Pipelines are independent. They share no code at runtime. This means:

- Each pipeline can evolve independently
- Bugs in one pipeline don't affect others
- You only need to understand the pipeline you're using

---

## Governance

AppFactory includes governance controls to prevent mistakes:

### Approval Gates

The system shows its plan before executing. You approve or reject before anything is written.

### Confined Writes

Pipelines can only write to their designated output directories. They cannot modify your existing code.

### Offline Default

Network calls require explicit authorization. The system does not phone home.

### No Telemetry

No usage data is collected. No analytics. No tracking.

---

## Intended Workflow

1. **Navigate** to a pipeline directory
2. **Describe** your idea in plain language
3. **Review** the generated plan
4. **Approve** execution
5. **Wait** for generation and quality checks
6. **Run** the output

The entire process takes minutes, not days.

---

## Limitations

AppFactory works best for:

- Standard application patterns
- Well-defined project types
- Initial development phases

AppFactory works less well for:

- Highly custom architectures
- Integration with existing complex systems
- Real-time collaborative features
- Hardware-specific code

Know these boundaries. AppFactory accelerates the common cases. Edge cases may require manual work.

---

**Next**: [Pipeline Architecture](./pipeline-architecture.md) | [Back to Index](../index.md)
