# Ralph Repository Context

**Document Type:** Pre-Review Context Summary
**Reviewer:** Ralph (Adversarial QA)
**Date:** 2026-01-18
**Target:** plugins/factory/

---

## What This Repo Is

**AppFactory** is a monorepo containing five independent code generation pipelines:

| Pipeline    | Directory           | Purpose                    |
| ----------- | ------------------- | -------------------------- |
| Mobile Apps | `app-factory/`      | Expo + React Native apps   |
| dApps       | `dapp-factory/`     | Next.js + Web3 web apps    |
| Agents      | `agent-factory/`    | Node.js AI agent scaffolds |
| Plugins     | `plugin-factory/`   | Claude Code plugins        |
| Mini Apps   | `miniapp-pipeline/` | Base Mini Apps (MiniKit)   |

Each pipeline operates independently with its own `CLAUDE.md` constitution. The repository root is **not executable**—it only redirects users to pipeline directories.

The `plugins/` directory contains Claude Code plugins that provide interfaces to these pipelines.

---

## What the Factory Plugin Is

**Factory** (`plugins/factory/`) is a Claude Code plugin that provides:

1. **A unified command interface** (`/factory`) to access all pipelines
2. **Plan-first execution** — shows what will happen before doing anything
3. **Mandatory approval gates** — user must explicitly approve execution
4. **Adversarial QA** — `/factory ralph` for code review loops
5. **Audit logging** — records all operations

**Technical Architecture:**

- Factory is a **thin wrapper** around `prompt-factory`
- prompt-factory contains the governance engine (skills, contracts, audit)
- Factory handles: command parsing, plan display, approval blocking
- prompt-factory handles: skill execution, contract enforcement, security

**Command Surface (v1.0):**

```
/factory help                     # Display help
/factory plan <idea>              # Plan without executing
/factory run <pipeline> <idea>    # Execute with approval
/factory ralph <path> [--loops]   # Adversarial QA
/factory audit                    # View audit log
```

---

## What the Factory Plugin Is NOT

1. **NOT a standalone plugin** — Requires prompt-factory as a co-dependency
2. **NOT an execution engine** — Delegates all execution to prompt-factory
3. **NOT autonomous** — Cannot run without explicit user commands and approval
4. **NOT network-capable** — Offline-first, no automatic fetching
5. **NOT auto-discovering** — Pipelines are statically configured
6. **NOT portable** — Designed specifically for the AppFactory monorepo
7. **NOT the repository root** — Operates on pipelines, not from root

---

## Dependency Chain

```
User
  │
  ▼
/factory (this plugin)
  │
  ├──► commands/factory.md (command interface)
  ├──► agents/factory-executor.md (execution protocol)
  ├──► agents/factory-ralph.md (QA protocol)
  │
  ▼
plugins/prompt-factory/ (governance engine)
  │
  ├──► skills/core/*.yaml (8 skills)
  ├──► src/core/AUDIT.md (audit logging)
  ├──► src/core/CONTRACTS.md (enforcement)
  │
  ▼
Pipeline directories (../../app-factory, etc.)
  │
  └──► CLAUDE.md (pipeline constitution)
```

---

## Marketplace Submission Context

**What reviewers need to understand:**

1. Factory is part of a larger ecosystem (AppFactory)
2. It deliberately constrains itself to plan-and-approve patterns
3. It does not execute silently or autonomously
4. It requires a sibling plugin (prompt-factory) to function

**Potential reviewer concerns:**

- Dependency on prompt-factory (not separately available)
- Relative paths assume monorepo structure
- "Pipelines" concept may need explanation
- Scope of file operations unclear

---

**Next:** 5 Ralph Loops for marketplace hardening
