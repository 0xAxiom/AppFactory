# Pipeline Index

**Last Updated:** 2026-01-18

---

## Overview

App Factory contains 5 independent pipelines, each generating different types of applications.

---

## Pipeline Inventory

| Pipeline             | Purpose                      | Output Directory  | Primary Docs                                                                        |
| -------------------- | ---------------------------- | ----------------- | ----------------------------------------------------------------------------------- |
| **app-factory**      | Mobile apps (iOS/Android)    | `builds/`         | [README](../app-factory/README.md), [CLAUDE.md](../app-factory/CLAUDE.md)           |
| **dapp-factory**     | Decentralized web apps       | `dapp-builds/`    | [README](../dapp-factory/README.md), [CLAUDE.md](../dapp-factory/CLAUDE.md)         |
| **agent-factory**    | AI agents (HTTP API)         | `outputs/`        | [README](../agent-factory/README.md), [CLAUDE.md](../agent-factory/CLAUDE.md)       |
| **plugin-factory**   | Claude plugins/MCP servers   | `builds/`         | [README](../plugin-factory/README.md), [CLAUDE.md](../plugin-factory/CLAUDE.md)     |
| **website-pipeline** | Marketing/portfolio websites | `website-builds/` | [README](../website-pipeline/README.md), [CLAUDE.md](../website-pipeline/CLAUDE.md) |

---

## Detailed Pipeline Information

### 1. app-factory

**What It Is:** Mobile app generator using Expo React Native

**What It Produces:**

- Complete iOS/Android app codebase
- RevenueCat monetization integration
- App Store Optimization (ASO) materials
- Marketing materials
- Research documentation

**Output Structure:**

```
app-factory/builds/<app-slug>/
├── app/                    # Expo Router screens
├── src/                    # Components, services, hooks
├── assets/                 # Icons, splash screens
├── research/               # Market research
├── aso/                    # App Store materials
├── marketing/              # Launch materials
└── README.md
```

**Example Builds:** `01_cleartasks__simple_tasks_001`, `02_neurodash__neurodash_002`

---

### 2. dapp-factory

**What It Is:** Decentralized application generator (Next.js + optional AI agents)

**What It Produces:**

- Complete Next.js web application
- Optional Rig-aligned AI agent system
- Research documentation
- Deployment configuration

**Output Structure:**

```
dapp-factory/dapp-builds/<app-slug>/
├── src/
│   ├── app/                # Next.js App Router
│   ├── components/         # React components
│   ├── agent/              # AI agent (Mode B only)
│   └── lib/                # Utilities
├── ralph/                  # UX Polish Loop
├── tests/e2e/              # Playwright tests
├── research/               # Market research
└── README.md
```

**Example Builds:** None yet (uses `dapp-builds/` directory)

**Note:** Formerly "web3-factory" - renamed in v8.0

---

### 3. agent-factory

**What It Is:** AI agent scaffold generator (Node.js HTTP API)

**What It Produces:**

- Rig-aligned agent scaffolds
- HTTP REST API with health/process endpoints
- Tool implementations
- Execution loop

**Output Structure:**

```
agent-factory/outputs/<agent-name>/
├── src/
│   ├── agent/              # Agent definition
│   ├── tools/              # Tool implementations
│   ├── server/             # HTTP server
│   └── types/              # Type definitions
├── package.json
└── README.md
```

**Example Outputs:** `codebase-explainer`

---

### 4. plugin-factory

**What It Is:** Claude Code plugin and MCP server generator

**What It Produces:**

- Claude Code plugins (commands, hooks, agents)
- MCP servers (STDIO or HTTP)
- Security documentation
- Installation guides

**Output Structure:**

```
plugin-factory/builds/<plugin-slug>/
├── commands/               # Plugin commands (if applicable)
├── hooks/                  # Plugin hooks (if applicable)
├── agents/                 # Plugin agents (if applicable)
├── src/                    # MCP server source (if applicable)
├── package.json            # (MCP servers only)
└── README.md
```

**Examples Directory:** `plugin-factory/examples/` with templates

---

### 5. website-pipeline

**What It Is:** Marketing/portfolio website generator (Next.js)

**What It Produces:**

- Complete Next.js website
- Skills audit reports
- SEO review
- Playwright E2E tests
- Ralph polish loop files

**Output Structure:**

```
website-pipeline/website-builds/<slug>/
├── src/
│   ├── app/                # Next.js App Router
│   ├── components/         # React components
│   └── lib/                # Utilities
├── ralph/                  # UX Polish Loop
├── tests/e2e/              # Playwright tests
├── audits/                 # Skills audit reports
├── research/               # Market research
├── planning/               # IA, design system
└── README.md
```

**Example Builds:** `example/website-builds/luminary-studio`

---

## Quick Reference: How to Run

| Pipeline         | Command                         | Output                   |
| ---------------- | ------------------------------- | ------------------------ |
| app-factory      | `cd app-factory && claude`      | `builds/<slug>/`         |
| dapp-factory     | `cd dapp-factory && claude`     | `dapp-builds/<slug>/`    |
| agent-factory    | `cd agent-factory && claude`    | `outputs/<slug>/`        |
| plugin-factory   | `cd plugin-factory && claude`   | `builds/<slug>/`         |
| website-pipeline | `cd website-pipeline && claude` | `website-builds/<slug>/` |

---

## Quality Gates by Pipeline

| Pipeline         | Skills Audits  | Ralph QA   | Playwright E2E |
| ---------------- | -------------- | ---------- | -------------- |
| app-factory      | Yes (3 skills) | Yes (≥97%) | Optional (web) |
| dapp-factory     | Yes (3 skills) | Yes (≥97%) | Required       |
| agent-factory    | No             | Yes (≥97%) | No             |
| plugin-factory   | No             | Yes (≥97%) | No             |
| website-pipeline | Yes (3 skills) | Yes (≥97%) | Required       |

---

## Version History

- **1.0** (2026-01-18): Initial pipeline index
