# AppFactory Documentation

Welcome to AppFactory, a system that builds complete applications from plain-language descriptions.

---

## What is AppFactory?

AppFactory is a monorepo containing six independent **pipelines**. Each pipeline generates a different type of application:

| Pipeline         | What it builds            | Output location                     |
| ---------------- | ------------------------- | ----------------------------------- |
| app-factory      | Mobile apps (iOS/Android) | `app-factory/builds/`               |
| dapp-factory     | Web apps and dApps        | `dapp-factory/dapp-builds/`         |
| website-pipeline | Static websites           | `website-pipeline/website-builds/`  |
| agent-factory    | AI agents (HTTP APIs)     | `agent-factory/outputs/`            |
| plugin-factory   | Claude Code plugins       | `plugin-factory/builds/`            |
| miniapp-pipeline | Base Mini Apps            | `miniapp-pipeline/builds/miniapps/` |

You describe what you want in plain English. The pipeline generates working code, documentation, and quality assurance artifacts.

---

## Quick Start

**New here?** Start with [Getting Started](./GETTING_STARTED.md).

**Already familiar?** Jump to a guide:

- [Build a Website](./guides/build-website.md)
- [Build a dApp](./guides/build-dapp.md)
- [Build a Mini App](./guides/build-miniapp.md)
- [Preview Your Output](./guides/preview-output.md)

---

## Documentation Structure

### Concepts

Understand how AppFactory works:

| Document                                                     | Description                                            |
| ------------------------------------------------------------ | ------------------------------------------------------ |
| [Philosophy](./concepts/philosophy.md)                       | Why AppFactory exists and how it approaches generation |
| [Pipeline Architecture](./concepts/pipeline-architecture.md) | How pipelines transform ideas into code                |
| [Orchestrator Model](./concepts/orchestrator.md)             | Root vs pipeline directories, navigation               |
| [Governance](./concepts/governance.md)                       | Safety controls, approval gates, audit logging         |

### Guides

Step-by-step instructions for common tasks:

| Guide                                             | Description                                   |
| ------------------------------------------------- | --------------------------------------------- |
| [Build a Website](./guides/build-website.md)      | Create a static website with website-pipeline |
| [Build a dApp](./guides/build-dapp.md)            | Create a web application with dapp-factory    |
| [Build a Mini App](./guides/build-miniapp.md)     | Create a Base Mini App with miniapp-pipeline  |
| [Preview Output](./guides/preview-output.md)      | Use the VS Code preview system                |
| [Sync Across Machines](./guides/sync-machines.md) | Keep multiple machines in sync                |

### Reference

Technical specifications:

| Document                                     | Description                                       |
| -------------------------------------------- | ------------------------------------------------- |
| [VS Code Tasks](./reference/vscode-tasks.md) | All available VS Code tasks                       |
| [Artifacts](./reference/artifacts.md)        | JSON artifacts (PREVIEW.json, FAILURE.json, etc.) |
| [Commands](./API.md)                         | CLI and /factory command reference                |
| [Architecture](./ARCHITECTURE.md)            | System design and data flow                       |

---

## Existing Documentation

These documents provide detailed information:

| Document                                                 | Purpose                              |
| -------------------------------------------------------- | ------------------------------------ |
| [GETTING_STARTED.md](./GETTING_STARTED.md)               | 5-minute setup guide                 |
| [ARCHITECTURE.md](./ARCHITECTURE.md)                     | System design, data flow, governance |
| [API.md](./API.md)                                       | Complete command reference           |
| [EXAMPLES.md](./EXAMPLES.md)                             | Real-world usage examples            |
| [FAQ.md](./FAQ.md)                                       | Frequently asked questions           |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)               | Problem solving guide                |
| [CONTRIBUTING.md](./CONTRIBUTING.md)                     | How to contribute                    |
| [FACTORY_READY_STANDARD.md](./FACTORY_READY_STANDARD.md) | Quality requirements                 |
| [UX_POLISH_LOOP.md](./UX_POLISH_LOOP.md)                 | Playwright E2E testing               |

---

## Key Concepts

### Pipelines Are Independent

Each pipeline is a self-contained system. You don't need to understand all pipelines to use one. Navigate to a pipeline directory and describe your idea.

### The Root Is an Orchestrator

The repository root (`/`) does not generate code. It routes requests to the correct pipeline. If you run Claude from the root, it will help you choose a pipeline.

### Outputs Live in Designated Directories

Pipelines write their outputs to specific directories. These output directories contain complete, runnable applications with their own `package.json` and documentation.

### Quality Is Enforced

Every build passes through **Ralph Mode**, an adversarial quality checker. Ralph requires 97%+ quality before declaring a build complete. You receive a finished, tested output.

---

## Navigation

### From the Repository Root

```
AppFactory/
├── CLAUDE.md              ← Root orchestrator constitution
├── app-factory/           ← Mobile app pipeline
├── dapp-factory/          ← dApp/website pipeline
├── website-pipeline/      ← Static website pipeline
├── agent-factory/         ← AI agent pipeline
├── plugin-factory/        ← Claude plugin pipeline
├── miniapp-pipeline/      ← Base Mini App pipeline
├── docs/                  ← This documentation
├── scripts/               ← Utility scripts
└── .vscode/               ← VS Code configuration
```

### From a Pipeline Directory

```
app-factory/
├── CLAUDE.md              ← Pipeline constitution
├── README.md              ← Pipeline documentation
├── builds/                ← Generated outputs
│   └── <app-name>/        ← Your generated app
└── ...
```

### From an Output Directory

```
app-factory/builds/<app-name>/
├── package.json           ← Dependencies
├── README.md              ← How to run
├── RUNBOOK.md             ← Detailed instructions
├── src/                   ← Application code
└── research/              ← Market research (if applicable)
```

---

## VS Code Integration

AppFactory includes VS Code tasks for common operations. Open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and run `Tasks: Run Task`.

### Key Tasks

| Task                                   | Purpose                                 |
| -------------------------------------- | --------------------------------------- |
| `Claude: Verify`                       | Run lint, format check, type check      |
| `Claude: Audit Workspace`              | Check governance files and code quality |
| `Factory: Preview (Auto)`              | Launch dev server, discover URL         |
| `Factory: Preview (Mobile Web iPhone)` | Preview with iPhone emulation           |
| `Factory: Preview (Open Browser)`      | Open in default browser                 |

See [VS Code Tasks Reference](./reference/vscode-tasks.md) for all tasks.

---

## Getting Help

1. **Check documentation**: This index, FAQ, and troubleshooting guides
2. **Read pipeline README**: Each pipeline has specific guidance
3. **Open GitHub Issue**: For bugs or feature requests

---

## Document Conventions

Throughout this documentation:

- `code blocks` indicate commands to run or file names
- **Bold text** indicates important concepts
- Tables summarize options or mappings
- File paths are relative to the repository root unless stated otherwise

---

**Next**: [Getting Started](./GETTING_STARTED.md) | [Philosophy](./concepts/philosophy.md)
