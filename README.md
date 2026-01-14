<p align="center">
  <img src="./the_factory/AppFactory.png" alt="App Factory" width="800" />
</p>

# App Factory

**Describe what you want. Get a working product.**

App Factory is a mono-repo containing three pipelines that generate fully working products from plain-English descriptions.

---

## How to Start (Important)

**App Factory does NOT run from the repository root.**

Each pipeline is an independent Claude workspace with its own constitution (`CLAUDE.md`). You must `cd` into a pipeline folder before running `claude`.

```bash
# 1. Choose your pipeline
# 2. cd into that folder
# 3. Run claude INSIDE the folder

cd web3-factory    # or: cd the_factory / cd agent-factory
claude
```

**Do NOT run `claude` at the repo root.** There is no root-level CLAUDE.md because the pipelines are separate workspaces.

---

## Which Pipeline Do I Use?

| I want to build... | Use this pipeline | Output | Launch target |
|--------------------|-------------------|--------|---------------|
| A **mobile app** for iOS and Android | [the_factory/](./the_factory/) | Expo React Native app | App Store / Play Store |
| A **web app** (optionally with tokens) | [web3-factory/](./web3-factory/) | Next.js app | Factory launchpad |
| An **AI agent** (optionally with tokens) | [agent-factory/](./agent-factory/) | Node.js HTTP agent | Factory launchpad |

### Quick Decision Guide

```
Do you need a mobile app?
├── YES → the_factory/
└── NO
    ├── Do you need a web UI?
    │   ├── YES → web3-factory/
    │   └── NO
    │       └── Is it an AI agent/bot?
    │           ├── YES → agent-factory/
    │           └── NO → web3-factory/ (default for web)
```

---

## 30-Second Quickstarts

### Mobile App (the_factory)

```bash
cd the_factory
claude
# Type: "A meditation app with guided sessions and streak tracking"
# Wait for build to complete
# Run: cd builds/<app-slug> && npm install && npx expo start
```

### Web App (web3-factory)

```bash
cd web3-factory
claude
# Type: "A roast battle app where users vote on the best burns"
# Answer: "Do you want token integration?" → no (or yes if you want tokens)
# Generated prompts appear in generated/<app-slug>/
# Follow build_prompt.md to build your app
# Push to GitHub, then import on factoryapp.dev (Repo Mode)
```

### AI Agent (agent-factory)

```bash
cd agent-factory
claude
# Type: "An agent that summarizes YouTube videos"
# Answer 4 questions (name, description, env vars, token integration)
# Scaffold appears in outputs/<agent-name>/
# Run: cd outputs/<agent-name> && npm install && npm run dev
# Test: curl http://localhost:8080/health
# Push to GitHub, then import on factoryapp.dev (Repo Mode)
```

---

## What Each Pipeline Generates

### the_factory (Mobile)

| Output | Description |
|--------|-------------|
| Complete Expo app | TypeScript, Expo Router, RevenueCat monetization |
| Market research | Market analysis, competitor breakdown, positioning |
| ASO materials | App Store title, subtitle, description, keywords |
| Launch materials | Privacy policy, launch checklist |

### web3-factory (Web)

| Output | Description |
|--------|-------------|
| Build prompts | Detailed instructions for your AI tool |
| Frontend spec | UI/UX guidelines and component structure |
| Checklist | Build verification and quality gates |
| Token spec | (Only if opted in) Token integration guide |

### agent-factory (Agent)

| Output | Description |
|--------|-------------|
| Complete scaffold | TypeScript, HTTP server, manifest |
| AGENT_SPEC.md | Plain-English agent specification |
| RUNBOOK.md | Exact steps to run and test |
| agent.json | Machine-readable manifest for launchpad |

---

## Token Integration

**Token integration is optional** for web3-factory and agent-factory.

- **Default:** Projects are built WITHOUT token integration
- **Opt-in:** Answer "yes" when asked during generation
- **Post-launch:** Paste your contract address into the documented config variable

When you don't opt in, your project has zero token-related code, zero blockchain dependencies, and works as a standard web app or agent.

See [docs/LAUNCHPAD_OVERVIEW.md](./docs/LAUNCHPAD_OVERVIEW.md) for details on launching with or without tokens.

---

## Factory Ready Standard

All pipelines follow the same quality standard:

| Gate | Requirement |
|------|-------------|
| **Build** | Code compiles, dependencies resolve |
| **Run** | App/agent starts and responds |
| **Test** | Smoke tests pass |
| **Validate** | Contract requirements met |
| **Package** | Ready for deployment |
| **Launch Ready** | All docs present |

See [docs/FACTORY_READY_STANDARD.md](./docs/FACTORY_READY_STANDARD.md) for the complete checklist.

---

## Repository Structure

```
app-factory/
├── README.md                    # You are here
├── docs/
│   ├── FACTORY_READY_STANDARD.md   # Quality standard (all pipelines)
│   └── LAUNCHPAD_OVERVIEW.md       # Launch and deployment guide
├── the_factory/                 # Mobile app pipeline
│   ├── claude.md                # Constitution
│   ├── README.md                # Pipeline docs
│   ├── templates/               # Expo scaffolding
│   ├── scripts/                 # Proof gates
│   ├── builds/                  # Generated apps
│   └── runs/                    # Execution artifacts
├── web3-factory/                # Web app pipeline
│   ├── CLAUDE.md                # Constitution
│   ├── README.md                # Pipeline docs
│   ├── generator/               # Prompt generator
│   ├── validator/               # Contract validator
│   ├── generated/               # Generated prompts
│   └── web3-builds/             # Built apps
├── agent-factory/               # Agent pipeline
│   ├── CLAUDE.md                # Constitution
│   ├── README.md                # Pipeline docs
│   ├── schema/                  # Manifest schema
│   ├── scripts/                 # Validators
│   ├── examples/                # Reference implementation
│   └── outputs/                 # Generated scaffolds
└── scripts/
    └── factory_ready_check.sh   # Unified validation script
```

---

## Running Proof Gates

Each pipeline has validation to ensure your build actually works.

```bash
# From any generated project directory:

# Web3 apps
npm run validate
# → Produces factory_ready.json

# Agents
npm run validate
# → Produces factory_ready.json

# Mobile apps
cd the_factory
./scripts/build_proof_gate.sh builds/<app-slug>
# → Verifies install + build + boot
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| **v5.0** | 2026-01-13 | Factory Ready Standard, unified docs, token integration optional |
| **v4.1** | 2026-01-12 | Mandatory research and ASO for mobile |
| **v4.0** | 2026-01-10 | Single-mode refactor, Ralph QA process |

---
## $FACTORY
Support the project by holding $FACTORY on Solana.

Contract Address: BkSbFrDMkfkoG4NDUwadEGeQgVwoXkR3F3P1MPUnBAGS

---

## License

MIT License - See LICENSE file.

---

**App Factory v5.0** - Describe what you want. Get a working product.
