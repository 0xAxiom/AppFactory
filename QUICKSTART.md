# App Factory Quick Start Guide

Welcome to App Factory! This guide will get you building in under 5 minutes.

## Prerequisites

Before you start, make sure you have:

- **Node.js 18+** - Check with `node --version`
- **Claude Code CLI** - Check with `claude --version`

Run `./quickstart.sh check` to verify your setup.

## Quick Start (Interactive)

```bash
./quickstart.sh
```

This launches an interactive menu where you can choose what to build:

1. **Mobile App** - iOS + Android via Expo
2. **dApp / Website** - Next.js with optional AI agents
3. **AI Agent** - HTTP API with tools
4. **Claude Plugin** - Extensions for Claude Code
5. **Base Mini App** - MiniKit + Next.js

## Quick Start (Direct)

Jump straight to a specific pipeline:

```bash
# Mobile app
./quickstart.sh app

# dApp or website
./quickstart.sh dapp

# AI agent
./quickstart.sh agent

# Claude plugin
./quickstart.sh plugin

# Base mini app
./quickstart.sh miniapp
```

## What Happens Next

1. Claude enters the chosen pipeline directory
2. Describe your idea in plain English
3. Claude builds everything for you
4. Run your creation with the provided commands

## Example Workflow

### Building a Mobile App

```bash
# Start the mobile app pipeline
./quickstart.sh app

# You'll see Claude's prompt. Type something like:
# "Build a meditation app with breathing exercises and daily reminders"

# Claude will:
# 1. Research the market
# 2. Design the UX
# 3. Generate the complete Expo app
# 4. Run quality checks

# When done, run your app:
cd app-factory/builds/<your-app>/app
npm install
npx expo start
```

### Building a dApp

```bash
# Start the dApp pipeline
./quickstart.sh dapp

# Describe your idea:
# "Build a token gating platform for NFT communities"

# When done:
cd dapp-factory/dapp-builds/<your-dapp>
npm install
npm run dev
```

### Building an AI Agent

```bash
# Start the agent pipeline
./quickstart.sh agent

# Describe your idea:
# "Build an agent that summarizes YouTube videos"

# When done:
cd agent-factory/outputs/<your-agent>
npm install
npm run dev
# Test: curl http://localhost:8080/health
```

## Working Examples

The `examples/` directory contains minimal working examples for each pipeline:

| Example                | Description                    | Run                             |
| ---------------------- | ------------------------------ | ------------------------------- |
| `examples/mobile-app/` | Expo app with RevenueCat       | `npm install && npx expo start` |
| `examples/dapp/`       | Next.js with wallet connection | `npm install && npm run dev`    |
| `examples/agent/`      | HTTP API with tools            | `npm install && npm run dev`    |
| `examples/plugin/`     | Claude Code slash command      | Copy to your project            |
| `examples/miniapp/`    | Base Mini App                  | `npm install && npm run dev`    |

## Validating Your Build

After building, validate your project:

```bash
./scripts/factory_ready_check.sh <path-to-your-build>

# Examples:
./scripts/factory_ready_check.sh app-factory/builds/my-app
./scripts/factory_ready_check.sh dapp-factory/dapp-builds/my-dapp
./scripts/factory_ready_check.sh agent-factory/outputs/my-agent
```

## Pipeline Comparison

| Pipeline             | Output        | Technology           | Best For           |
| -------------------- | ------------- | -------------------- | ------------------ |
| **app-factory**      | Mobile app    | Expo + React Native  | iOS/Android apps   |
| **dapp-factory**     | Website/dApp  | Next.js              | Web apps, dApps    |
| **agent-factory**    | AI agent      | Node.js + TypeScript | AI-powered APIs    |
| **plugin-factory**   | Claude plugin | Markdown + JSON      | Claude extensions  |
| **miniapp-pipeline** | Mini app      | MiniKit + Next.js    | Base app ecosystem |

## Getting Help

- **README.md** - Full documentation
- **examples/** - Working code examples
- **./quickstart.sh help** - CLI help
- **Pipeline CLAUDE.md** - Each pipeline has its own guide

## Troubleshooting

### Claude CLI not found

```bash
npm install -g @anthropic-ai/claude-code
```

### Permission denied on quickstart.sh

```bash
chmod +x quickstart.sh
```

### Node.js version too old

```bash
# macOS
brew install node

# Ubuntu
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## What's Next

Once you've built your first project:

1. Read the pipeline-specific documentation
2. Explore the generated code
3. Customize and extend
4. Deploy to production

Happy building!
