# App Factory API Reference

**Complete command and interface reference for all pipelines.**

---

## Table of Contents

1. [Entry Points](#entry-points)
2. [Factory Plugin Commands](#factory-plugin-commands)
3. [Pipeline-Specific Commands](#pipeline-specific-commands)
4. [CLI Commands](#cli-commands)
5. [Output Contracts](#output-contracts)
6. [Environment Variables](#environment-variables)

---

## Entry Points

App Factory can be invoked in three ways:

### 1. Direct Pipeline Invocation

```bash
cd <pipeline-directory>
claude
```

| Pipeline Directory  | Purpose                            |
| ------------------- | ---------------------------------- |
| `app-factory/`      | Mobile apps (Expo + React Native)  |
| `dapp-factory/`     | dApps and websites (Next.js)       |
| `agent-factory/`    | AI agents (Node.js HTTP)           |
| `plugin-factory/`   | Claude plugins (Code + MCP)        |
| `miniapp-pipeline/` | Base Mini Apps (MiniKit + Next.js) |
| `website-pipeline/` | Marketing websites (Next.js)       |

### 2. Factory Plugin

```bash
cd AppFactory
claude
> /factory <command> [args]
```

### 3. CLI (Standalone)

```bash
cd CLI
npm start
```

---

## Factory Plugin Commands

The `/factory` command provides orchestrated access to all pipelines.

### `/factory help`

Display command reference.

```
/factory help
```

**Output:** List of all available commands with descriptions.

---

### `/factory plan <idea>`

Generate an execution plan without executing.

```
/factory plan a meditation app with breathing exercises
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idea` | string | Yes | Plain-language description of what to build |

**Output:**

- Detected pipeline
- Files to be created
- Steps to be executed
- Manual actions required
- No files are modified

---

### `/factory run <pipeline> <idea>`

Execute a build with mandatory approval.

```
/factory run miniapp a gratitude journal for daily reflection
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pipeline` | string | Yes | Target pipeline: `app`, `dapp`, `agent`, `plugin`, `miniapp`, `website` |
| `idea` | string | Yes | Plain-language description |

**Pipeline Aliases:**
| Alias | Pipeline |
|-------|----------|
| `app` | app-factory |
| `dapp` | dapp-factory |
| `agent` | agent-factory |
| `plugin` | plugin-factory |
| `miniapp` | miniapp-pipeline |
| `website` | website-pipeline |

**Flow:**

1. Shows execution plan
2. Waits for user to type `approve` or `reject`
3. On approval, executes build
4. Logs all actions to audit trail

---

### `/factory ralph <path> [--loops N]`

Run Ralph QA on a generated project.

```
/factory ralph ./builds/meditation-timer --loops 3
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | string | Yes | Path to project directory |
| `--loops` | number | No | Number of QA iterations (1-5, default: 1) |

**Output:**

- Quality score per loop
- Issues found
- Fixes applied
- Final verdict (PASS/FAIL)

---

### `/factory audit`

View execution history.

```
/factory audit
```

**Output:**

- Recent executions
- Timestamps
- Outcomes (success/failure)
- Generated paths

---

## Pipeline-Specific Commands

### app-factory

**Entry:**

```bash
cd app-factory && claude
```

**Build Trigger:**

```
> I want to make an app that [description]
```

**Phases:**
| Phase | Description | Output |
|-------|-------------|--------|
| 0 | Intent Normalization | `runs/<date>/<run-id>/inputs/normalized_prompt.md` |
| 1 | Plan (9 sections) | `runs/<date>/<run-id>/planning/plan.md` |
| 2-3 | Build (6 milestones) | `builds/<app-slug>/` |
| 4 | Ralph QA (97%+) | `runs/<date>/<run-id>/polish/ralph_final_verdict.md` |

**Run Generated App:**

```bash
cd builds/<app-slug>
npm install
npx expo start
```

---

### dapp-factory

**Entry:**

```bash
cd dapp-factory && claude
```

**Build Trigger:**

```
> Build me a [dApp/website description]
```

**Phases:**
| Phase | Description | Output |
|-------|-------------|--------|
| 0 | Intent Normalization | `runs/<date>/<run-id>/inputs/normalized_prompt.md` |
| 0.5 | Agent Decision Gate | `runs/<date>/<run-id>/inputs/agent_decision.md` |
| 1 | Dream Spec (10-12 sections) | `runs/<date>/<run-id>/inputs/dream_spec.md` |
| 2 | Research | `dapp-builds/<slug>/research/` |
| 3 | Build | `dapp-builds/<slug>/src/` |
| 4 | Ralph + E2E | `dapp-builds/<slug>/ralph/` |

**Run Generated dApp:**

```bash
cd dapp-builds/<slug>
npm install
npm run dev
# Open http://localhost:3000
```

**Run E2E Tests:**

```bash
npm run test:e2e
```

---

### agent-factory

**Entry:**

```bash
cd agent-factory && claude
```

**Build Trigger:**

```
> Build an agent that [description]
```

**Phases:**
| Phase | Description | Output |
|-------|-------------|--------|
| 0 | Intent Normalization | `runs/<date>/<run-id>/inputs/normalized_prompt.md` |
| 1 | Dream Spec (10 sections) | `runs/<date>/<run-id>/inputs/dream_spec.md` |
| 2 | Research | `outputs/<agent-name>/research/` |
| 3 | Generate (after 4 questions) | `outputs/<agent-name>/` |
| 4 | Ralph QA (97%+) | `runs/<date>/<run-id>/polish/ralph_final_verdict.md` |

**4 Required Questions:**

1. Agent name (lowercase, hyphens)
2. One-sentence description
3. Required API keys
4. Token integration (yes/no)

**Run Generated Agent:**

```bash
cd outputs/<agent-name>
npm install
npm run dev
# Test: curl http://localhost:8080/health
```

**Test Process Endpoint:**

```bash
curl -X POST http://localhost:8080/process \
  -H "Content-Type: application/json" \
  -d '{"input": "your input here"}'
```

---

### plugin-factory

**Entry:**

```bash
cd plugin-factory && claude
```

**Build Trigger:**

```
> I want a plugin that [description]
```

**Phases:**
| Phase | Description | Output |
|-------|-------------|--------|
| 0 | Intent Normalization | `runs/<date>/<run-id>/inputs/normalized_prompt.md` |
| 1 | Plan (8 sections) | `runs/<date>/<run-id>/planning/plan.md` |
| 2 | Build | `builds/<plugin-slug>/` |
| 3 | Docs | `builds/<plugin-slug>/*.md` |
| 4 | Ralph QA (97%+) | `runs/<date>/<run-id>/polish/ralph_final_verdict.md` |

**Plugin Types:**
| Type | Structure | Use Case |
|------|-----------|----------|
| Claude Code Plugin | `.claude-plugin/`, commands/, hooks/ | React to Claude Code events |
| MCP Server | manifest.json, server/ | External data/API access |
| Hybrid | Both | Combined functionality |

**Install Generated Plugin:**

```bash
# Claude Code Plugin
cp -r builds/<plugin-slug> /path/to/project/

# MCP Server
cd builds/<plugin-slug>
npm install
npm run build
# Follow INSTALL.md
```

---

### miniapp-pipeline

**Entry:**

```bash
cd miniapp-pipeline && claude
```

**Build Trigger:**

```
> I want a mini app that [description]
```

**Stages:**
| Stage | Description | Output |
|-------|-------------|--------|
| M0 | Intent Normalization | `artifacts/inputs/normalized_prompt.md` |
| M1 | Scaffold Plan | `artifacts/stage01/scaffold_plan.md` |
| M2 | Scaffold Project | `builds/miniapps/<slug>/app/` |
| M3 | Manifest Config | `app/minikit.config.ts` |
| M4 | Deployment Plan | `artifacts/stage04/DEPLOYMENT.md` |
| M5 | Account Association | **MANUAL STEP** |
| M6-M9 | Validation | `artifacts/stage06-09/` |
| M10 | Ralph QA | `artifacts/polish/ralph_final_verdict.md` |

**Run Generated Mini App:**

```bash
cd builds/miniapps/<slug>/app
npm install
npm run dev
```

---

### website-pipeline

**Entry:**

```bash
cd website-pipeline && claude
```

**Build Trigger:**

```
> Build a website for [description]
```

**Phases:**
| Phase | Description | Output |
|-------|-------------|--------|
| 0 | Intent Normalization | `runs/<date>/<run-id>/inputs/normalized_prompt.md` |
| 1 | Dream Spec (12 sections) | `runs/<date>/<run-id>/inputs/dream_spec.md` |
| 2 | Research | `website-builds/<slug>/research/` |
| 3 | Information Architecture | `website-builds/<slug>/planning/` |
| 4 | Design System | `website-builds/<slug>/planning/design_system.md` |
| 5 | Build | `website-builds/<slug>/src/` |
| 6 | Skills Audit | `website-builds/<slug>/audits/` |
| 7 | SEO Review | `website-builds/<slug>/audits/seo_review.md` |
| 8 | Ralph + E2E | `website-builds/<slug>/ralph/` |

**Run Generated Website:**

```bash
cd website-builds/<slug>
npm install
npm run dev
# Open http://localhost:3000
```

---

## CLI Commands

The standalone CLI provides API-based generation.

### Interactive Mode

```bash
cd CLI
npm start
```

**Menu Options:**
| Option | Description |
|--------|-------------|
| Run App Factory | Generate 10 ranked app ideas |
| Build an Idea | Build a selected idea |
| Dream Mode | Your idea to complete app |
| List Runs & Builds | View history |
| Resume Run | Resume interrupted build |
| System Check | Verify environment |
| Help | Documentation |

### Command Line Mode

```bash
# Generate ideas
npm start -- run

# Build specific idea
npm start -- build <idea_id>

# End-to-end build
npm start -- dream "a meditation app"

# Check environment
npm start -- doctor

# List history
npm start -- list

# JSON output
npm start -- run --json
```

---

## Output Contracts

### Common Files (All Pipelines)

| File            | Required | Description       |
| --------------- | -------- | ----------------- |
| `README.md`     | Yes      | Project overview  |
| `package.json`  | Yes      | Dependencies      |
| `tsconfig.json` | Yes      | TypeScript config |

### app-factory Output

```
builds/<app-slug>/
├── package.json
├── app.config.js
├── tsconfig.json
├── app/                    # Expo Router
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── home.tsx
│   ├── paywall.tsx        # RevenueCat
│   └── settings.tsx
├── src/
│   ├── components/
│   ├── services/purchases.ts
│   └── hooks/
├── research/
├── aso/
├── marketing/
├── README.md
├── RUNBOOK.md
├── TESTING.md
├── LAUNCH_CHECKLIST.md
└── privacy_policy.md
```

### dapp-factory Output

```
dapp-builds/<slug>/
├── package.json
├── next.config.js
├── tailwind.config.ts
├── playwright.config.ts
├── src/
│   ├── app/
│   ├── components/
│   └── lib/
├── tests/e2e/
├── research/
├── ralph/
├── README.md
└── DEPLOYMENT.md
```

### agent-factory Output

```
outputs/<agent-name>/
├── agent.json
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts
│   └── lib/
├── research/
├── AGENT_SPEC.md
├── RUNBOOK.md
├── TESTING.md
└── .env.example
```

---

## Environment Variables

### CLI Configuration

| Variable                 | Required | Default                    | Description            |
| ------------------------ | -------- | -------------------------- | ---------------------- |
| `ANTHROPIC_API_KEY`      | Yes      | -                          | Your API key           |
| `ANTHROPIC_MODEL`        | No       | `claude-sonnet-4-20250514` | Model to use           |
| `APPFACTORY_MAX_TOKENS`  | No       | `16000`                    | Max tokens             |
| `APPFACTORY_TEMPERATURE` | No       | `0.3`                      | Generation temperature |

### Pipeline Environment

Pipelines use `.env.example` templates. Copy to `.env` and configure:

```bash
cp .env.example .env
# Edit .env with your values
```

**Never commit `.env` files.** They are gitignored.

---

## Related Documentation

- [ARCHITECTURE.md](/docs/ARCHITECTURE.md) - System design
- [GETTING_STARTED.md](/docs/GETTING_STARTED.md) - Onboarding
- [EXAMPLES.md](/docs/EXAMPLES.md) - Usage examples
- [TROUBLESHOOTING.md](/docs/TROUBLESHOOTING.md) - Problem solving

---

**App Factory API v1.0.0**: Complete command reference for all pipelines.
