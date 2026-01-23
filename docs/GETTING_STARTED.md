# Getting Started with App Factory

**Time to first build: ~5 minutes**

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Your First Build](#your-first-build)
4. [Understanding the Output](#understanding-the-output)
5. [Next Steps](#next-steps)

---

## Prerequisites

### Required

| Requirement | Version | Check Command      |
| ----------- | ------- | ------------------ |
| Node.js     | 18+     | `node --version`   |
| npm         | 9+      | `npm --version`    |
| Claude Code | Latest  | `claude --version` |

### Optional (for specific pipelines)

| Tool       | Pipeline                                         | Purpose            |
| ---------- | ------------------------------------------------ | ------------------ |
| Expo CLI   | app-factory                                      | Mobile development |
| Vercel CLI | dapp-factory, website-pipeline, miniapp-pipeline | Deployment         |
| Playwright | website-pipeline, dapp-factory                   | E2E testing        |

---

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/MeltedMindz/AppFactory.git
cd AppFactory
```

### Step 2: Verify Structure

```bash
ls -la
```

You should see:

```
app-factory/
dapp-factory/
agent-factory/
plugin-factory/
miniapp-pipeline/
website-pipeline/
docs/
CLI/
README.md
CLAUDE.md
```

### Step 3: Choose Your Pipeline

| I want to build...               | Navigate to           |
| -------------------------------- | --------------------- |
| A mobile app (iOS/Android)       | `cd app-factory`      |
| A dApp or website with AI agents | `cd dapp-factory`     |
| An AI agent (HTTP server)        | `cd agent-factory`    |
| A Claude plugin                  | `cd plugin-factory`   |
| A Base Mini App                  | `cd miniapp-pipeline` |
| A marketing website              | `cd website-pipeline` |

---

## Quick Start Options

You have three ways to start building:

### Option A: Using the Quick Start Script (Easiest)

```bash
./quickstart.sh
```

This interactive script:

- Verifies your system requirements (Node.js, npm, Claude CLI, Git, MCP)
- Presents a menu of all 6 pipelines
- Automatically navigates to your chosen pipeline
- Launches Claude Code for you

**Best for:** First-time users, quick exploration

### Option B: Direct Pipeline Access

```bash
# Navigate to your chosen pipeline
cd app-factory

# Start Claude Code
claude

# Describe your idea
> I want to make an app where users can track their daily habits with streaks
```

**Best for:** Users who know which pipeline they need

---

## Your First Build

Once you've chosen your approach above, here's what happens:

### The Build Process

Claude will:

1. **Normalize** your idea into a professional specification
2. **Plan** the implementation
3. **Build** the complete application
4. **QA** using Ralph Mode until quality reaches 97%+
5. **Verify** using Local Run Proof Gate

### Option C: Using the Factory Plugin

From the repository root:

```bash
claude
> /factory run app a habit tracker with daily streaks and reminders
```

The `/factory` command provides:

- Explicit approval gates
- Structured execution plan
- Audit logging

### Option C: Using the CLI (API-based)

```bash
cd CLI
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm start
```

Select "Dream Mode" and enter your idea.

---

## Understanding the Output

### Where to Find Your Build

| Pipeline         | Output Location                                    |
| ---------------- | -------------------------------------------------- |
| app-factory      | `app-factory/builds/<app-name>/`                   |
| dapp-factory     | `dapp-factory/dapp-builds/<app-name>/`             |
| agent-factory    | `agent-factory/outputs/<agent-name>/`              |
| plugin-factory   | `plugin-factory/builds/<plugin-name>/`             |
| miniapp-pipeline | `miniapp-pipeline/builds/miniapps/<app-name>/app/` |
| website-pipeline | `website-pipeline/website-builds/<site-name>/`     |

### Running Your Build

**Mobile App (app-factory):**

```bash
cd app-factory/builds/<app-name>
npm install
npx expo start
# Scan QR code with Expo Go app
```

**dApp/Website (dapp-factory, website-pipeline):**

```bash
cd dapp-factory/dapp-builds/<app-name>
npm install
npm run dev
# Open http://localhost:3000
```

**AI Agent (agent-factory):**

```bash
cd agent-factory/outputs/<agent-name>
npm install
npm run dev
# Test: curl http://localhost:8080/health
```

**Claude Plugin (plugin-factory):**

```bash
# Copy to your project
cp -r plugin-factory/builds/<plugin-name> /path/to/your/project/
# Follow INSTALL.md in the plugin directory
```

**Base Mini App (miniapp-pipeline):**

```bash
cd miniapp-pipeline/builds/miniapps/<app-name>/app
npm install
npm run dev
# Follow DEPLOYMENT.md for Vercel deployment
```

---

## What Gets Generated

Every build includes:

### Code

- Complete, runnable application
- TypeScript with full type safety
- Proper project structure
- Configuration files

### Documentation

- `README.md` - Overview and quick start
- `RUNBOOK.md` - Detailed run instructions
- Pipeline-specific guides

### Research (where applicable)

- `research/market_research.md`
- `research/competitor_analysis.md`
- `research/positioning.md`

### Quality Assurance

- Ralph QA verdict
- Build logs
- Validation results

---

## Example Session

Here's what a complete build session looks like:

```
$ cd app-factory
$ claude

You: I want to make an app that helps people meditate

Claude: I'll normalize your intent and build a complete meditation app.

[PHASE 0: INTENT NORMALIZATION]
Upgrading "app that helps people meditate" to:
"A premium meditation app with guided sessions, breathing exercises,
progress tracking, streak calendars, and ambient sound mixing.
Features smooth animations, offline support, and dark mode.
Monetization via RevenueCat subscription ($4.99/mo or $29.99/yr)."

[PHASE 1: PLAN]
Writing 9-section implementation plan...

[PHASE 2-3: BUILD]
M1: Scaffold ✓
M2: Screens ✓
M3: Features ✓
M4: Monetization ✓
M5: Polish ✓
M6: Research/Marketing ✓

[PHASE 4: RALPH QA]
Pass 1: 89% (fixing navigation issues)
Pass 2: 94% (adding missing accessibility)
Pass 3: 97% - PASS

BUILD COMPLETE

App: MindfulMoments
Location: builds/mindful-moments/

To run:
  cd builds/mindful-moments
  npm install
  npx expo start
```

---

## Troubleshooting First Build

### "npm install fails"

```bash
npm install --legacy-peer-deps
```

### "Claude says pipeline not found"

Make sure you're in the correct directory:

```bash
pwd  # Should show /path/to/AppFactory/app-factory (or other pipeline)
```

### "Build doesn't start"

Check if ports are in use:

```bash
# For web projects
PORT=3001 npm run dev

# For agents
PORT=8081 npm run dev
```

### "Ralph keeps failing"

Ralph requires 97%+ quality. Common issues:

- Missing error handling
- Accessibility violations
- TypeScript errors

Check `runs/<date>/<run-id>/polish/ralph_final_verdict.md` for specific issues.

---

## Next Steps

### Learn More

- [ARCHITECTURE.md](/docs/ARCHITECTURE.md) - System design
- [API.md](/docs/API.md) - Command reference
- [EXAMPLES.md](/docs/EXAMPLES.md) - More examples

### Try Other Pipelines

- Build a dApp: `cd dapp-factory && claude`
- Build an agent: `cd agent-factory && claude`
- Build a plugin: `cd plugin-factory && claude`

### Customize Your Build

- Edit generated code
- Add features
- Configure monetization

### Deploy

- Mobile: Follow `LAUNCH_CHECKLIST.md` for App Store
- Web: `vercel deploy`
- Agent: Deploy to cloud provider

---

## Getting Help

### Documentation

- Pipeline READMEs contain pipeline-specific guidance
- CLAUDE.md files explain governance and constraints

### Troubleshooting

- [TROUBLESHOOTING.md](/docs/TROUBLESHOOTING.md) - Common issues
- [FAQ.md](/docs/FAQ.md) - Frequently asked questions

### Community

- GitHub Issues for bug reports
- GitHub Discussions for questions

---

**Ready to build?** Pick a pipeline and describe your idea. App Factory handles the rest.
