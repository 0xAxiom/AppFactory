# Pipeline Architecture

This document explains how AppFactory pipelines transform ideas into working code.

---

## What Is a Pipeline?

A pipeline is a self-contained system that:

1. Receives a plain-language description
2. Normalizes it into a specification
3. Generates code according to that specification
4. Validates the output
5. Produces a runnable application

Each pipeline targets a specific type of output (mobile app, website, etc.).

---

## Pipeline Components

Every pipeline contains:

```
<pipeline>/
├── CLAUDE.md          ← Constitution (rules for Claude)
├── README.md          ← Human documentation
├── builds/            ← Output directory (name varies)
├── templates/         ← Base templates (if applicable)
└── ...
```

### CLAUDE.md (Constitution)

This file defines rules that Claude must follow when operating in the pipeline. It specifies:

- What the pipeline builds
- What phases to execute
- What quality standards to meet
- What output structure to produce

Claude reads this file automatically when you start a session in the pipeline directory.

### Output Directory

Generated applications appear in a designated output directory:

| Pipeline         | Output Directory   |
| ---------------- | ------------------ |
| app-factory      | `builds/`          |
| dapp-factory     | `dapp-builds/`     |
| website-pipeline | `website-builds/`  |
| agent-factory    | `outputs/`         |
| plugin-factory   | `builds/`          |
| miniapp-pipeline | `builds/miniapps/` |

Each generated project gets its own subdirectory.

---

## Execution Phases

Pipelines typically execute these phases:

### Phase 0: Intent Normalization

Your plain-language input becomes a professional specification.

**Input**: "make me a meditation app"

**Output**: A detailed specification including:

- Feature list
- UI requirements
- Technical architecture
- Monetization strategy

### Phase 1: Planning

The system creates an implementation plan with milestones:

- M1: Project scaffold
- M2: Core screens/components
- M3: Feature implementation
- M4: Monetization (if applicable)
- M5: Polish and accessibility
- M6: Research and documentation

### Phase 2-3: Build

Code generation proceeds milestone by milestone. Each milestone:

1. Generates relevant files
2. Validates correctness
3. Commits progress

### Phase 4: Ralph QA

Ralph Mode performs adversarial quality checking:

1. Examines the complete output
2. Identifies issues
3. Requires fixes
4. Repeats until quality reaches 97%+

### Phase 5: Finalization

The system produces:

- Final documentation
- Run instructions
- Success artifacts

---

## Data Flow

```
┌─────────────────┐
│   Your Idea     │  "I want a meditation app"
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Intent Normal.  │  Expand to professional spec
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Planning      │  Create milestone plan
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Building     │  Generate code per milestone
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Ralph QA      │  Quality enforcement loop
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Output Dir     │  Complete, runnable app
└─────────────────┘
```

---

## Output Structure

Generated applications follow standard project structures:

### Mobile App (app-factory)

```
builds/<app-name>/
├── package.json
├── app.json              ← Expo configuration
├── App.tsx               ← Entry point
├── src/
│   ├── screens/          ← Screen components
│   ├── components/       ← Reusable components
│   ├── hooks/            ← Custom hooks
│   ├── utils/            ← Utilities
│   └── types/            ← TypeScript types
├── assets/               ← Images, fonts
├── README.md
├── RUNBOOK.md
└── research/             ← Market research
```

### Web App (dapp-factory)

```
dapp-builds/<app-name>/
├── package.json
├── next.config.js
├── src/
│   ├── app/              ← Next.js App Router
│   ├── components/
│   └── lib/
├── public/
├── README.md
├── RUNBOOK.md
└── research/
```

### AI Agent (agent-factory)

```
outputs/<agent-name>/
├── package.json
├── src/
│   ├── index.ts          ← Entry point
│   ├── agent.ts          ← Agent definition
│   ├── tools/            ← Agent tools
│   └── prompts/          ← System prompts
├── README.md
└── RUNBOOK.md
```

---

## Quality Enforcement

Ralph Mode checks:

| Category       | Checks                                                 |
| -------------- | ------------------------------------------------------ |
| Functionality  | Does the code run? Are features working?               |
| Types          | Are TypeScript types correct and complete?             |
| Accessibility  | Are ARIA labels present? Is color contrast sufficient? |
| Error Handling | Are errors caught and handled appropriately?           |
| Documentation  | Are README and RUNBOOK present and accurate?           |

The system iterates until all checks pass at 97%+ quality.

---

## Pipeline Independence

Pipelines share no runtime code. This means:

- **No cross-contamination**: A bug in app-factory cannot affect dapp-factory
- **Independent versioning**: Each pipeline can evolve at its own pace
- **Focused expertise**: Each pipeline optimizes for its output type

The root orchestrator routes requests but does not influence generation.

---

## Customization Points

### Before Generation

Modify the CLAUDE.md file to change:

- Quality thresholds
- Feature defaults
- Technology choices

### After Generation

The output is standard code. You can:

- Edit any file
- Add dependencies
- Integrate with other systems

There is no lock-in. The generated code belongs to you.

---

**Next**: [Orchestrator Model](./orchestrator.md) | [Back to Index](../index.md)
