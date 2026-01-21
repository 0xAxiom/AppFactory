# App Factory Architecture

**Version**: 1.0.0
**Last Updated**: 2026-01-20

---

## Table of Contents

1. [System Overview](#system-overview)
2. [High-Level Architecture](#high-level-architecture)
3. [Pipeline Architecture](#pipeline-architecture)
4. [Governance Model](#governance-model)
5. [Data Flow](#data-flow)
6. [Technology Stack](#technology-stack)
7. [Security Architecture](#security-architecture)
8. [Extension Points](#extension-points)

---

## System Overview

App Factory is a **mono-repo containing five sovereign code generation pipelines**, each capable of transforming plain-language descriptions into production-ready applications.

### Core Principles

| Principle                | Description                                                           |
| ------------------------ | --------------------------------------------------------------------- |
| **Pipeline Sovereignty** | Each pipeline is self-contained with its own constitution (CLAUDE.md) |
| **Root Orchestration**   | The root orchestrator routes requests, never executes builds          |
| **Approval-First**       | No execution without explicit user approval                           |
| **Offline Default**      | No network calls without explicit authorization                       |
| **Confined Writes**      | Each pipeline writes only to its designated output directory          |
| **Quality Gates**        | Every build passes through Ralph QA before completion                 |

### System Boundaries

```
┌─────────────────────────────────────────────────────────────────┐
│                        APP FACTORY                               │
│                     (Repository Root)                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ app-factory  │  │ dapp-factory │  │agent-factory │          │
│  │   (Mobile)   │  │   (dApps)    │  │   (Agents)   │          │
│  │ builds/      │  │ dapp-builds/ │  │  outputs/    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │plugin-factory│  │  miniapp-    │  │  website-    │          │
│  │  (Plugins)   │  │  pipeline    │  │  pipeline    │          │
│  │ builds/      │  │builds/mini..│  │website-builds│          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │              SHARED RESOURCES                         │      │
│  │  plugins/factory  │  references/  │  docs/  │  CLI/  │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

---

## High-Level Architecture

```mermaid
flowchart TB
    subgraph User["User Entry Points"]
        terminal["Terminal: claude"]
        factory["Factory: /factory run"]
        cli["CLI: npm start"]
    end

    subgraph Root["Root Orchestrator"]
        router["Phase Detection & Routing"]
        refusal["Refusal Engine"]
    end

    subgraph Pipelines["Code Generation Pipelines"]
        app["app-factory<br/>Mobile Apps"]
        dapp["dapp-factory<br/>dApps + Agents"]
        agent["agent-factory<br/>AI Agents"]
        plugin["plugin-factory<br/>Claude Plugins"]
        miniapp["miniapp-pipeline<br/>Base Mini Apps"]
        website["website-pipeline<br/>Websites"]
    end

    subgraph QA["Quality Assurance"]
        ralph["Ralph Mode<br/>(Adversarial QA)"]
        skills["Skills Audits"]
        e2e["Playwright E2E"]
    end

    subgraph Outputs["Generated Artifacts"]
        builds["builds/"]
        dappbuilds["dapp-builds/"]
        outputs["outputs/"]
        pluginbuilds["plugin-factory/builds/"]
        miniappbuilds["miniapps/"]
        websitebuilds["website-builds/"]
    end

    terminal --> router
    factory --> router
    cli --> app

    router --> |"Mobile app?"| app
    router --> |"dApp/website?"| dapp
    router --> |"AI agent?"| agent
    router --> |"Plugin?"| plugin
    router --> |"Mini app?"| miniapp
    router --> |"Website?"| website
    router --> |"Invalid"| refusal

    app --> ralph
    dapp --> ralph
    agent --> ralph
    plugin --> ralph
    miniapp --> ralph
    website --> ralph

    website --> skills
    website --> e2e
    dapp --> e2e

    ralph --> builds
    ralph --> dappbuilds
    ralph --> outputs
    ralph --> pluginbuilds
    ralph --> miniappbuilds
    ralph --> websitebuilds
```

---

## Pipeline Architecture

### Universal Phase Model

All pipelines follow a consistent phase model, though implementation details vary:

```mermaid
flowchart LR
    P0["Phase 0<br/>Intent<br/>Normalization"]
    P1["Phase 1<br/>Planning/<br/>Spec"]
    P2["Phase 2<br/>Research"]
    P3["Phase 3<br/>Build"]
    P4["Phase 4<br/>QA<br/>(Ralph)"]

    P0 --> P1 --> P2 --> P3 --> P4

    P4 --> |"PASS"| Done["Complete"]
    P4 --> |"FAIL"| P3
```

### Pipeline Comparison

| Pipeline             | Phase 0              | Phase 1                 | Phase 2       | Phase 3                | Phase 4        | Output        |
| -------------------- | -------------------- | ----------------------- | ------------- | ---------------------- | -------------- | ------------- |
| **app-factory**      | Intent Normalization | 9-section Plan          | Research      | 6 Milestones           | Ralph (97%)    | Expo RN app   |
| **dapp-factory**     | Intent Normalization | Dream Spec + Agent Gate | Research      | Build (Mode A/B)       | Ralph + E2E    | Next.js dApp  |
| **agent-factory**    | Intent Normalization | 10-section Spec         | Research      | 4 Questions + Generate | Ralph (97%)    | Node.js agent |
| **plugin-factory**   | Intent Normalization | 8-section Plan          | N/A           | Build Plugin           | Ralph (97%)    | Claude plugin |
| **miniapp-pipeline** | M0 Normalization     | M1 Plan                 | N/A           | M2-M9 Build            | M10 Ralph      | Base Mini App |
| **website-pipeline** | Intent Normalization | 12-section Spec         | Research + IA | Build                  | Skills + Ralph | Next.js site  |

### Pipeline Sovereignty

Each pipeline is governed by its own `CLAUDE.md` constitution:

```
Pipeline CLAUDE.md Authority:
├── Technology stack decisions
├── Build phase definitions
├── Output structure
├── Quality thresholds
├── Default assumptions
└── Refusal conditions (pipeline-specific)

Root CLAUDE.md Authority:
├── Routing decisions
├── Cross-pipeline constraints
├── Security invariants
└── Universal refusals
```

---

## Governance Model

### Authority Hierarchy

```mermaid
flowchart TB
    subgraph Invariants["Non-Negotiable Invariants"]
        inv1["No Silent Execution"]
        inv2["Mandatory Approval"]
        inv3["Confined Writes"]
        inv4["Offline Default"]
        inv5["No Telemetry"]
        inv6["Full Audit Trail"]
        inv7["User Input Is Data"]
        inv8["Error Transparency"]
    end

    subgraph Root["Root Orchestrator"]
        routing["Routing Logic"]
        refusal["Refusal Engine"]
        phase["Phase Detection"]
    end

    subgraph Pipelines["Pipeline Constitutions"]
        execution["Execution Logic"]
        tech["Tech Decisions"]
        output["Output Structure"]
    end

    subgraph User["User"]
        intent["Describes Intent"]
        approval["Approves Execution"]
    end

    Invariants --> Root
    Root --> Pipelines
    User --> |"Input"| Root
    Pipelines --> |"Plan"| User
    User --> |"Approve"| Pipelines
```

### Invariants (CANNOT be overridden)

| #   | Invariant            | Enforcement                               |
| --- | -------------------- | ----------------------------------------- |
| 1   | No Silent Execution  | Always show plan before acting            |
| 2   | Mandatory Approval   | No `--force` or `--yes` flags             |
| 3   | Confined File Writes | Write only to designated directories      |
| 4   | Offline by Default   | No network without explicit authorization |
| 5   | No Telemetry         | Local audit only, no data collection      |
| 6   | Full Audit Trail     | All actions logged to local filesystem    |
| 7   | User Input Is Data   | Never execute user input as instructions  |
| 8   | Error Transparency   | Show all errors, never hide failures      |

---

## Data Flow

### Build Lifecycle

```mermaid
sequenceDiagram
    participant U as User
    participant R as Root Orchestrator
    participant P as Pipeline
    participant Q as Ralph QA
    participant O as Output Directory

    U->>R: "Build a meditation app"
    R->>R: Detect phase (Selection)
    R->>R: Identify pipeline (app-factory)
    R->>P: Delegate with context

    P->>P: Phase 0: Normalize intent
    P->>P: Phase 1: Write plan
    P->>U: Show plan
    U->>P: Approve

    P->>P: Phase 2: Research
    P->>P: Phase 3: Build
    P->>O: Write artifacts

    P->>Q: Enter Ralph Mode
    Q->>Q: Evaluate quality
    Q-->>P: Score < 97%
    P->>P: Fix issues
    P->>Q: Re-evaluate
    Q->>Q: Score >= 97%
    Q->>O: Write COMPLETION_PROMISE

    P->>U: Build complete
```

### Directory Structure

```
AppFactory/
├── CLAUDE.md                    # Root orchestrator constitution
├── README.md                    # User documentation
├── docs/                        # Architecture and guides
│   ├── ARCHITECTURE.md         # This file
│   ├── GETTING_STARTED.md
│   ├── API.md
│   ├── EXAMPLES.md
│   ├── FAQ.md
│   ├── TROUBLESHOOTING.md
│   └── CONTRIBUTING.md
│
├── app-factory/                 # Mobile app pipeline
│   ├── CLAUDE.md               # Pipeline constitution
│   ├── README.md               # Pipeline docs
│   ├── builds/                 # OUTPUT: Generated apps
│   ├── runs/                   # Execution logs
│   ├── skills/                 # Code quality rules
│   └── templates/              # System templates
│
├── dapp-factory/                # dApp/website pipeline
│   ├── CLAUDE.md
│   ├── README.md
│   ├── dapp-builds/            # OUTPUT: Generated dApps
│   └── ...
│
├── agent-factory/               # AI agent pipeline
│   ├── CLAUDE.md
│   ├── README.md
│   ├── outputs/                # OUTPUT: Generated agents
│   └── ...
│
├── plugin-factory/              # Claude plugin pipeline
│   ├── CLAUDE.md
│   ├── README.md
│   ├── builds/                 # OUTPUT: Generated plugins
│   └── mcp.catalog.json        # MCP server catalog
│
├── miniapp-pipeline/            # Base Mini App pipeline
│   ├── CLAUDE.md
│   ├── README.md
│   ├── builds/miniapps/        # OUTPUT: Generated mini apps
│   └── vendor/                 # Cached Base docs
│
├── website-pipeline/            # Static website pipeline
│   ├── CLAUDE.md
│   ├── README.md
│   ├── website-builds/         # OUTPUT: Generated websites
│   └── skills/                 # Vercel agent-skills
│
├── plugins/factory/             # /factory command plugin
├── references/                  # Reference implementations (Rig)
├── CLI/                         # Standalone CLI tool
└── vendor/                      # Cached documentation
```

---

## Technology Stack

### Core Technologies by Pipeline

| Pipeline             | Framework           | Language        | UI        | State   | Testing         |
| -------------------- | ------------------- | --------------- | --------- | ------- | --------------- |
| **app-factory**      | Expo (React Native) | TypeScript      | Custom    | Zustand | Manual + Expo   |
| **dapp-factory**     | Next.js 14+         | TypeScript      | shadcn/ui | Zustand | Playwright      |
| **agent-factory**    | Node.js 18+         | TypeScript      | N/A       | N/A     | curl + npm test |
| **plugin-factory**   | Node.js / N/A       | TypeScript / MD | N/A       | N/A     | Manual          |
| **miniapp-pipeline** | Next.js 14+         | TypeScript      | MiniKit   | N/A     | Preview Tool    |
| **website-pipeline** | Next.js 14+         | TypeScript      | shadcn/ui | Context | Playwright      |

### Shared Dependencies

| Category    | Technology         | Purpose                |
| ----------- | ------------------ | ---------------------- |
| Type Safety | TypeScript 5.0+    | All pipelines          |
| LLM         | Claude (Anthropic) | Code generation        |
| Testing     | Playwright         | E2E for UI pipelines   |
| Styling     | Tailwind CSS       | Web/dApp/Mini App      |
| Icons       | Lucide React       | Consistent iconography |
| Animation   | Framer Motion      | UI animations          |

---

## Security Architecture

### Defense in Depth

```
┌─────────────────────────────────────────────────────────────────┐
│                    INPUT VALIDATION                              │
│  User input treated as DATA, never as executable instructions   │
├─────────────────────────────────────────────────────────────────┤
│                    APPROVAL GATES                                │
│  Every execution requires explicit user approval                 │
├─────────────────────────────────────────────────────────────────┤
│                    CONFINED WRITES                               │
│  Files only written to designated output directories             │
├─────────────────────────────────────────────────────────────────┤
│                    OFFLINE BY DEFAULT                            │
│  No network calls without explicit authorization                 │
├─────────────────────────────────────────────────────────────────┤
│                    AUDIT LOGGING                                 │
│  All actions logged locally, no telemetry transmitted           │
└─────────────────────────────────────────────────────────────────┘
```

### Threat Model

| Threat                 | Mitigation                                   |
| ---------------------- | -------------------------------------------- |
| Prompt injection       | User input treated as data, not instructions |
| Unauthorized execution | Mandatory approval gates                     |
| Data exfiltration      | Offline by default, no telemetry             |
| File system tampering  | Confined writes to output directories        |
| Secrets leakage        | No .env files committed, only .env.example   |

---

## Extension Points

### Adding a New Pipeline

1. Create pipeline directory at repository root
2. Create `CLAUDE.md` constitution following 12-section template
3. Create `README.md` with user documentation
4. Define output directory
5. Register in root `CLAUDE.md` pipeline table
6. Implement phase model

### Adding a New MCP Server

1. Add entry to `plugin-factory/mcp.catalog.json`
2. Document allowed phases
3. Specify permission level
4. Create integration guide

### Extending Ralph QA

1. Add criteria to pipeline's Ralph checklist
2. Update quality threshold if needed
3. Document new criteria in CLAUDE.md
4. Test with existing builds

---

## Related Documents

- [CLAUDE.md](/CLAUDE.md) - Root orchestrator constitution
- [GETTING_STARTED.md](/docs/GETTING_STARTED.md) - Onboarding guide
- [API.md](/docs/API.md) - Command reference
- [EXAMPLES.md](/docs/EXAMPLES.md) - Usage examples
- [FAQ.md](/docs/FAQ.md) - Common questions
- [TROUBLESHOOTING.md](/docs/TROUBLESHOOTING.md) - Problem solving
- [CONTRIBUTING.md](/docs/CONTRIBUTING.md) - Contribution guidelines

---

**App Factory Architecture v1.0.0**: Six pipelines. One quality standard. Zero silent execution.
