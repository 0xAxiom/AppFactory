<p align="center">
  <img src="./app-factory/AppFactory.png" alt="App Factory" width="800" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" />
  <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen" alt="Node.js" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React_Native-61DAFB?style=flat&logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white" alt="Playwright" />
</p>

# App Factory

**Describe it. Build it. Ship it.**

App Factory turns your ideas into real, working products. No coding experience required. Just describe what you want in plain English, and Claude builds it.

---

## What Can I Build?

| I want to make...       | Use this                                 | What you get                                    |
| ----------------------- | ---------------------------------------- | ----------------------------------------------- |
| A **mobile app**        | [app-factory/](./app-factory/)           | iPhone & Android app ready for the App Store    |
| A **website**           | [website-pipeline/](./website-pipeline/) | Portfolio, blog, or marketing website           |
| A **dApp**              | [dapp-factory/](./dapp-factory/)         | Web3 app with blockchain integration            |
| An **AI agent**         | [agent-factory/](./agent-factory/)       | Smart bot with tools (Rig-aligned architecture) |
| A **Claude plugin**     | [plugin-factory/](./plugin-factory/)     | Extension for Claude Code or Claude Desktop     |
| A **Base Mini App**     | [miniapp-pipeline/](./miniapp-pipeline/) | Mini app for the Base app (MiniKit + Next.js)   |
| A **Clawbot assistant** | [claw-pipeline/](./claw-pipeline/)       | Custom AI assistant (OpenClaw)                  |

---

## First-Time Setup

```bash
claude
# Then type: /setup
```

Or validate your environment manually: `./scripts/validate-setup.sh`

See [QUICKSTART.md](./QUICKSTART.md) for full setup details.

---

## Quick Start Commands

### For Mobile Apps

```bash
cd app-factory
claude
# Type your app idea
# When done: cd builds/<your-app> && npm install && npx expo start
```

### For Websites

```bash
cd website-pipeline
claude
# Type your website idea (portfolio, blog, marketing site)
# When done: cd website-builds/<your-site> && npm install && npm run dev
# Open http://localhost:3000
```

### For dApps

```bash
cd dapp-factory
claude
# Type your dApp idea (blockchain, Web3, wallet integration)
# When done: cd dapp-builds/<your-dapp> && npm install && npm run dev
# Open http://localhost:3000
```

### For AI Agents

```bash
cd agent-factory
claude
# Type your agent idea
# When done: cd outputs/<your-agent> && npm install && npm run dev
# Test: curl http://localhost:8080/health
```

### For Clawbot Assistants

```bash
cd claw-pipeline
claude
# Type your assistant idea
# When done: cd builds/claws/<your-assistant> && npm install && npm start
```

### For Claude Plugins

```bash
cd plugin-factory
claude
# Type your plugin idea
# When done (Claude Code plugin): Copy builds/<plugin>/ to your project
# When done (MCP server): cd builds/<plugin> && npm install && npm run build
```

### For Base Mini Apps

```bash
cd miniapp-pipeline
claude
# Type your mini app idea
# When done: cd builds/miniapps/<your-app>/app && npm install && npm run dev
# Deploy to Vercel, complete account association, post URL in Base app
```

---

## How It Works

### Step 1: Pick Your Project Type

```
Want a mobile app?     → Go to app-factory folder
Want a website?        → Go to website-pipeline folder
Want a dApp (Web3)?    → Go to dapp-factory folder
Want an AI agent?      → Go to agent-factory folder
Want a Clawbot?        → Go to claw-pipeline folder
Want a Claude plugin?  → Go to plugin-factory folder
Want a Base Mini App?  → Go to miniapp-pipeline folder
```

### Step 2: Open Claude and Describe Your Idea

```bash
cd app-factory    # (or website-pipeline, dapp-factory, agent-factory, etc.)
claude
```

Then just type what you want:

> "I want to make an app where you fly a plane"

> "I want to make a meme battle website where people vote on memes"

> "Build an agent that summarizes YouTube videos"

> "I want a plugin that formats code on save"

> "Build a mini app for sharing daily gratitude with friends"

### Step 3: Let the AI Build It

The AI will:

1. **Understand your idea** - Turn your simple description into a detailed plan
2. **Research the market** - Find competitors and figure out what makes yours special
3. **Build everything** - Create all the code, designs, and documentation
4. **Check quality** - Review its own work and fix any issues

### Step 4: Run Your Creation

When it's done, you'll get step-by-step instructions to run your new app, website, or AI assistant on your computer.

---

## The Secret Sauce: Intent Normalization

You don't need to be specific. Our AI fills in the gaps.

**What you say:**

> "make me a meditation app"

**What the AI understands:**

> "A premium meditation app with guided sessions, progress tracking, streak calendars, ambient sounds, and subscription monetization. Features smooth animations, offline support, and a calming dark-mode design."

The AI adds all the details that make a great product, so you just focus on the idea.

---

## Quality Guarantee: Ralph Mode

Every project goes through "Ralph Mode" - our quality checker that acts like a picky reviewer.

Ralph checks:

- Does the code actually run?
- Does everything look polished?
- Is the research real and useful?
- Are there any bugs or issues?

**Ralph won't let a project finish until it's at least 97% perfect.**

If something's wrong, the AI fixes it automatically. You only see the final, working result.

---

## UX Polish Loop (Playwright E2E)

UI-generating pipelines (websites, dApps) support automated **Playwright E2E testing** when configured for extra quality assurance.

### What's Included

Every UI project gets:

- `ralph/` - PRD, acceptance criteria, progress tracking
- `tests/e2e/` - Smoke tests, form tests, accessibility checks
- `playwright.config.ts` - Multi-browser test configuration
- `scripts/ralph_loop_runner.sh` - 20-pass polish runner

### How It Works

```bash
cd dapp-builds/<your-project>
npm install
npm run test:e2e       # Run Playwright tests
npm run polish:ux      # Run full 20-pass polish loop
```

The loop continues until a "completion promise" is earned - proof that all acceptance criteria are verified.

### Which Pipelines?

| Pipeline         | Playwright                  |
| ---------------- | --------------------------- |
| website-pipeline | Optional (when configured)  |
| dapp-factory     | Optional (when configured)  |
| miniapp-pipeline | Optional (for verification) |
| app-factory      | Optional (for web exports)  |
| agent-factory    | Not needed (HTTP API)       |
| plugin-factory   | Not needed (CLI)            |

See [docs/UX_POLISH_LOOP.md](./docs/UX_POLISH_LOOP.md) for full documentation.

---

## Real Examples

### Mobile App Example

**You say:** "I want to make an app where you fly a plane"

**You get:**

- A complete iPhone/Android game with plane controls
- App Store listing with title, description, and keywords
- Marketing research showing similar apps and your advantages
- Everything you need to publish to the App Store

### Website Example

**You say:** "I want to make a meme battle arena where people vote on memes"

**You get:**

- A polished website with smooth animations
- Voting system, leaderboards, and user submissions
- Mobile-friendly design that works on any screen
- Ready to deploy to the internet

### AI Agent Example

**You say:** "Build an agent that summarizes YouTube videos"

**You get:**

- A working AI that accepts video links and returns summaries
- Simple API you can connect to other apps
- Documentation explaining how it all works
- Ready to run on your computer or a server

### Claude Plugin Example

**You say:** "I want a plugin that formats code on save"

**You get:**

- A complete Claude Code plugin with hooks and commands
- Auto-formatting whenever you save a file
- Support for multiple formatters (Prettier, ESLint, Black, etc.)
- Security documentation and installation guide

### Base Mini App Example

**You say:** "Build a mini app for sharing daily gratitude with friends"

**You get:**

- A complete Next.js app with MiniKit integration
- Manifest configuration for Base discovery
- Account association instructions and validation
- Step-by-step deployment and publication guide

---

## What's Inside Each Project

### Mobile Apps Include:

- Complete app code (TypeScript + React Native)
- App Store listing materials
- Market research and competitor analysis
- Privacy policy and legal docs
- Step-by-step launch instructions

### Websites Include:

- Complete website code (TypeScript + Next.js)
- Modern design with animations
- Mobile-responsive layout
- Market research and positioning
- Deployment instructions

### AI Agents Include:

- Complete server code (TypeScript + Node.js)
- API endpoints ready to use
- Market research and positioning
- Testing and deployment guides

### Claude Plugins Include:

- Complete plugin structure (commands, hooks, or MCP server)
- Security documentation
- Installation instructions
- Usage examples
- MCPB packaging guide (for MCP servers)

### Base Mini Apps Include:

- Complete Next.js app with MiniKit integration
- Manifest configuration (`minikit.config.ts`)
- Manifest route (`/.well-known/farcaster.json`)
- Placeholder assets (icon, splash, hero, screenshots)
- Account association instructions
- Vercel deployment guide
- Publication checklist
- Ralph QA review artifacts

---

## Starter Templates (NEW)

Speed up your builds with pre-configured templates for common use cases.

### Available Templates

| Category     | Template                                              | Description                                   |
| ------------ | ----------------------------------------------------- | --------------------------------------------- |
| **Mobile**   | [saas-starter](./templates/mobile/saas-starter/)      | Dashboard, subscriptions, offline-first       |
| **Mobile**   | [e-commerce](./templates/mobile/e-commerce/)          | Cart, products, checkout flow                 |
| **Mobile**   | [social-app](./templates/mobile/social-app/)          | Feed, posts, likes, profiles                  |
| **dApp**     | [defi-starter](./templates/dapp/defi-starter/)        | Portfolio tracking, swaps, AI recommendations |
| **dApp**     | [nft-marketplace](./templates/dapp/nft-marketplace/)  | NFT gallery, auctions, creator profiles       |
| **Website**  | [portfolio](./templates/website/portfolio/)           | Projects, about, contact form                 |
| **Website**  | [saas-landing](./templates/website/saas-landing/)     | Hero, pricing, testimonials                   |
| **Mini App** | [social-starter](./templates/miniapp/social-starter/) | Feed, reactions, sharing                      |
| **Agent**    | [api-integration](./templates/agent/api-integration/) | HTTP tools, caching, rate limiting            |
| **Plugin**   | [code-formatter](./templates/plugin/code-formatter/)  | Auto-format on save                           |

### How Templates Work

When you describe your idea, Claude may suggest a relevant template:

```
You: "I want to build a habit tracking app"

Claude: "I notice your idea aligns with our SaaS Starter template.
        Would you like me to use it as a foundation?"
```

Templates provide sensible defaults while remaining fully customizable.

See [templates/README.md](./templates/README.md) for full documentation.

---

## Folder Structure

```
AppFactory/
├── app-factory/       # Mobile app builder
├── dapp-factory/      # dApp/website builder (with optional AI agents)
├── agent-factory/     # AI agent builder (Rig-aligned)
├── plugin-factory/    # Claude plugin builder
├── miniapp-pipeline/  # Base Mini App builder (MiniKit + Next.js)
├── claw-pipeline/     # Clawbot assistant builder (OpenClaw)
├── website-pipeline/  # Static website builder
├── plugins/factory/   # /factory command plugin
├── CLI/               # Standalone CLI tool
├── references/        # Reference implementations (Rig framework)
├── vendor/            # Cached documentation
└── docs/              # Documentation
    ├── ARCHITECTURE.md      # System design
    ├── GETTING_STARTED.md   # Onboarding guide
    ├── API.md               # Command reference
    ├── EXAMPLES.md          # Usage examples
    ├── FAQ.md               # Common questions
    ├── TROUBLESHOOTING.md   # Problem solving
    └── CONTRIBUTING.md      # Contribution guidelines
```

Each folder is independent. Just pick one and start building.

---

## Claude Plugin: Factory

**Factory** is the official Claude plugin for AppFactory.
It provides a governed command interface for planning pipelines, running builds, and performing adversarial QA inside this repository.
Factory requires explicit user approval before execution, is network-enabled by default with explicit authorization gates, writes files only to designated output directories, and collects no telemetry.
It is designed for AppFactory contributors and is not intended to operate as a standalone plugin.

See [`plugins/factory/`](./plugins/factory/) for documentation.

---

## Claude Workflow and Repo Boundaries

AppFactory is an **integrated pipeline repository** with strict governance to prevent accidental cross-repo contamination.

### Key Principles

- **This repository** contains multiple internal components (CLI, core, factories, pipelines) that work together as a single system
- **External repositories** like `factoryapp` (factoryapp.dev website/product repo) must remain completely separate
- **Boundary enforcement** prevents accidental file copying, directory merging, or git submodule additions across repos

### Verification Tasks

Run these tasks from VS Code Command Palette (Cmd+Shift+P → "Tasks: Run Task"):

- **Claude: Audit Workspace** - Check governance files, code quality, and hygiene
- **Claude: Verify** - Run full CI pipeline (lint, format, type-check)
- **Claude: Boundary Check** - Verify working directory matches repository root

All tasks output machine-readable JSON artifacts (`AUDIT.json`, `BOUNDARY.json`) for automation.

### Switching to FIX MODE

By default, Claude operates in **SETUP MODE** (can only modify `.claude/`, `.vscode/`, `.gitignore`, `README.md`).

To allow source code modifications:

1. Say: **"ENTER FIX MODE"**
2. Claude shows you a plan
3. Approve the plan
4. Claude executes with full audit logging

See [`.claude/control.md`](./.claude/control.md) for complete governance documentation.

### Topology Declaration

This repository is structured as:

```
AppFactory (integrated-pipeline)
├── CLI              (standalone CLI tool)
├── core             (shared utilities)
├── agent-factory    (AI agent builder)
├── app-factory      (mobile app builder)
├── dapp-factory     (dApp/website builder)
├── miniapp-pipeline (Base Mini App builder)
├── plugin-factory   (Claude plugin builder)
├── website-pipeline (static website builder)
└── examples         (reference implementations)
```

External repos like `factoryapp` are **separate products** and must not be merged into this structure.

---

## Optional: Add Tokens

Want to add cryptocurrency features? Just say "yes" when asked about token integration.

- **Default:** No crypto, no blockchain, just a normal app
- **With tokens:** Add payments, rewards, or premium features using Solana

You don't need to understand crypto - the AI handles all the technical stuff.

---

## Security

AppFactory is built with security in mind. Every pipeline enforces strict security controls.

### Security Features

- **No Hardcoded Secrets**: All credentials use environment variables via `.env` files
- **Secret Scanning**: Pre-commit hooks detect and block potential secrets
- **Path Validation**: File operations validate paths to prevent directory traversal
- **Dependency Auditing**: `npm audit` integration for vulnerability scanning
- **Ralph Security Checks**: QA process includes security verification
- **Confined Writes**: Pipelines can only write to designated output directories

### Security Commands

```bash
# Scan for secrets
node scripts/security/scan-secrets.js

# Run npm audit across packages
node scripts/security/npm-audit-check.js

# Run Ralph security checks on a build
node scripts/security/ralph-security-checks.js <build-path>
```

### Reporting Vulnerabilities

Found a security issue? See [SECURITY.md](./SECURITY.md) for responsible disclosure guidelines.

---

## Documentation

**Start here**: [docs/index.md](./docs/index.md) - Complete documentation index

### Quick Links

| Document                                        | Description                   |
| ----------------------------------------------- | ----------------------------- |
| [docs/index.md](./docs/index.md)                | Documentation entry point     |
| [GETTING_STARTED.md](./docs/GETTING_STARTED.md) | Step-by-step onboarding guide |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md)       | System design and data flow   |
| [API.md](./docs/API.md)                         | Complete command reference    |

### Concepts

| Document                                                          | Description                     |
| ----------------------------------------------------------------- | ------------------------------- |
| [Philosophy](./docs/concepts/philosophy.md)                       | Why AppFactory exists           |
| [Pipeline Architecture](./docs/concepts/pipeline-architecture.md) | How pipelines transform ideas   |
| [Orchestrator Model](./docs/concepts/orchestrator.md)             | Root vs pipeline directories    |
| [Governance](./docs/concepts/governance.md)                       | Safety controls and constraints |

### Guides

| Document                                           | Description                    |
| -------------------------------------------------- | ------------------------------ |
| [Build a Website](./docs/guides/build-website.md)  | Create a static website        |
| [Build a dApp](./docs/guides/build-dapp.md)        | Create a web application       |
| [Build a Mini App](./docs/guides/build-miniapp.md) | Create a Base Mini App         |
| [Preview Output](./docs/guides/preview-output.md)  | Use the VS Code preview system |
| [Sync Machines](./docs/guides/sync-machines.md)    | Keep machines synchronized     |

### Reference

| Document                                          | Description                   |
| ------------------------------------------------- | ----------------------------- |
| [VS Code Tasks](./docs/reference/vscode-tasks.md) | All VS Code tasks             |
| [Artifacts](./docs/reference/artifacts.md)        | JSON artifact reference       |
| [EXAMPLES.md](./docs/EXAMPLES.md)                 | Real-world usage examples     |
| [FAQ.md](./docs/FAQ.md)                           | Frequently asked questions    |
| [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)   | Comprehensive problem solving |
| [CONTRIBUTING.md](./docs/CONTRIBUTING.md)         | How to contribute             |

---

## Troubleshooting

### "npm install fails"

```bash
# Clear node_modules and retry
node -e "require('fs').rmSync('node_modules',{recursive:true,force:true})"
npm install
```

### "Port already in use"

```bash
# For websites
PORT=3001 npm run dev

# For AI assistants
PORT=3001 npm run dev
```

### "Something's not working"

Check the `runs/` folder in your project - there's a detailed log of what happened and any issues found.

See [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) for comprehensive problem solving.

---

## VS Code Preview System

App Factory includes a cross-platform preview system for VS Code. Run any project with instant URL discovery and mobile emulation.

### Quick Start

1. Open Command Palette: `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
2. Run: `Tasks: Run Task` → `Factory: Preview (Auto)`
3. URL is written to `.vscode/.preview/PREVIEW.json`

### Available Preview Tasks

| Task                                    | Description                     |
| --------------------------------------- | ------------------------------- |
| `Factory: Preview (Auto)`               | Launch dev server, discover URL |
| `Factory: Preview (Mobile Web iPhone)`  | Playwright iPhone emulation     |
| `Factory: Preview (Mobile Web Android)` | Playwright Android emulation    |
| `Factory: Preview (Open Browser)`       | Open in default browser         |
| `Factory: iOS Simulator (Mac Only)`     | Launch iOS Simulator            |

See [.claude/preview.md](./.claude/preview.md) for full documentation.

---

## Meet the Tour Guide - Official Mascot

The **Tour Guide** is App Factory's official mascot - a well-traveled robot eyeball assistant with personality and emotions.

<p align="center">
  <img src="./brand/tg.png" alt="Tour Guide Mascot" width="200" />
</p>

### Features

- **5 Emotion States**: idle (cyan), happy (green), curious (orange), sad (blue), excited (magenta)
- **Eye Tracking**: Optional webcam-based face tracking
- **Random Look Behavior**: Natural eye movement when idle
- **Weathered Appearance**: Looks like it's been places and seen things

### Preview the Tour Guide

```bash
cd tools/sandbox
npm install
npm run dev
# Visit http://localhost:5173
```

### Use in Your Projects

```tsx
import { TourGuide, triggerEmotion } from '@appfactory/tour-guide';

// Render the 3D mascot
<TourGuide backgroundColor="#1a1a1a" showEmotionButtons={true} />;

// Trigger emotions programmatically
triggerEmotion('happy', 3.0);
```

### File Locations

| Asset     | Path                          |
| --------- | ----------------------------- |
| 3D Model  | `brand/mascot/tour-guide.glb` |
| Component | `shared/tour-guide/`          |
| Sandbox   | `tools/sandbox/`              |

See [docs/guides/tour-guide-mascot.md](./docs/guides/tour-guide-mascot.md) for full documentation.

---

## Optional: Blender MCP

For local 3D asset development, Blender MCP integration is available.

**This is OPTIONAL** - no pipeline requires Blender.

```bash
# Enable Blender MCP (requires Blender 3.0+ installed)
claude mcp add blender uvx blender-mcp
```

See [references/blender/README.md](./references/blender/README.md) for setup instructions.

---

## Support the Project

Hold **$FACTORY** on Solana to support ongoing development.

**Contract Address:** `BkSbFrDMkfkoG4NDUwadEGeQgVwoXkR3F3P1MPUnBAGS`

---

## AI Agent Architecture: Rig Integration

The agent-factory and dapp-factory pipelines are now aligned with the [Rig framework](https://github.com/0xPlaygrounds/rig) by 0xPlaygrounds - a production-grade Rust library for building LLM-powered applications.

**What this means for you:**

- Agents follow real architectural patterns (not tutorial code)
- Tools have proper typed definitions
- Generated code can scale to production
- Clear learning path from TypeScript scaffolds to Rust production

See `/docs/architecture/` for detailed documentation.

---

## MCP Integration (Model Context Protocol)

AppFactory supports MCP servers for enhanced AI-tool communication. MCP is the open standard that acts as "USB-C for AI tools."

### Quick Setup

```bash
# Copy the example configuration
cp mcp-config.example.json ~/.config/claude-code/mcp-config.json

# Edit with your credentials
code ~/.config/claude-code/mcp-config.json
```

### Essential MCP Servers by Pipeline

| Pipeline         | Recommended Servers                 |
| ---------------- | ----------------------------------- |
| app-factory      | Playwright (web exports), Figma     |
| dapp-factory     | Playwright, Supabase, Context7      |
| agent-factory    | Context7, E2B (sandboxed execution) |
| plugin-factory   | MCP SDK reference                   |
| miniapp-pipeline | Playwright, Vercel                  |
| website-pipeline | Playwright, Figma, Vercel           |

### Enhanced Ralph QA

With MCP integration, Ralph QA can perform:

- **Playwright MCP** - Automated accessibility and UI testing
- **Semgrep MCP** - Security vulnerability scanning
- **Context7 MCP** - API accuracy verification against current docs

### Documentation

| Document                                             | Description                     |
| ---------------------------------------------------- | ------------------------------- |
| [MCP_INTEGRATION.md](./docs/MCP_INTEGRATION.md)      | Setup guide and troubleshooting |
| [RALPH_QA_ENHANCED.md](./docs/RALPH_QA_ENHANCED.md)  | Enhanced QA with MCP tools      |
| [mcp-config.example.json](./mcp-config.example.json) | Configuration template          |
| [references/mcp-servers/](./references/mcp-servers/) | Server-specific documentation   |

---

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for detailed plans.

### Coming Soon

| Feature                 | Target  | Description                                     |
| ----------------------- | ------- | ----------------------------------------------- |
| More Templates          | Q1 2026 | Health/fitness, meditation, documentation sites |
| Build History           | Q1 2026 | Track and resume builds                         |
| Cross-Pipeline Projects | Q2 2026 | Build mobile + web + API together               |
| Team Workspaces         | Q3 2026 | Share projects with team members                |

### Request a Feature

1. Check [ROADMAP.md](./ROADMAP.md) for existing plans
2. Open a GitHub issue with the `[Feature Request]` template
3. Vote on existing requests with reactions

---

## Version History

| Version   | What Changed                                                              |
| --------- | ------------------------------------------------------------------------- |
| **v12.0** | MCP integration, 2026 tech stack updates, enhanced Ralph QA               |
| **v11.1** | Starter templates system, ROADMAP.md, innovation features                 |
| **v11.0** | Added miniapp-pipeline for Base Mini Apps (MiniKit + Next.js)             |
| **v10.0** | UX Polish Loop with Playwright E2E testing for UI pipelines               |
| **v9.0**  | Rig integration, renamed web3-factory → dapp-factory, agent decision gate |
| **v8.0**  | Added plugin-factory for Claude Code plugins and MCP servers              |
| **v7.0**  | Added Intent Normalization and Ralph Quality Mode to all pipelines        |
| **v5.0**  | Factory Ready Standard, unified documentation                             |
| **v4.0**  | Single-mode refactor, Ralph QA process                                    |

---

## License

MIT License - Free to use, modify, and share.

---

<p align="center">
  <a href="https://star-history.com/#MeltedMindz/AppFactory&Date">
    <img src="https://api.star-history.com/svg?repos=MeltedMindz/AppFactory&type=Date" alt="Star History Chart" width="600" />
  </a>
</p>

<p align="center">
  <strong>App Factory v12.0.1</strong><br/>
  Tell us what you want. We'll make it for you.
</p>
