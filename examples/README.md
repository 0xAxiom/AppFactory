# App Factory Examples

This directory contains working examples for each pipeline. These examples are minimal but complete - they demonstrate the structure and patterns you should expect from App Factory builds.

## Quick Start

Each example can be run independently. Navigate to the example directory and follow the instructions in its README.

## Examples

| Example                      | Description                                   | Run Commands                    |
| ---------------------------- | --------------------------------------------- | ------------------------------- |
| [mobile-app/](./mobile-app/) | Minimal Expo React Native app with RevenueCat | `npm install && npx expo start` |
| [dapp/](./dapp/)             | Minimal Next.js dApp with wallet connection   | `npm install && npm run dev`    |
| [agent/](./agent/)           | Minimal AI agent with HTTP API                | `npm install && npm run dev`    |
| [plugin/](./plugin/)         | Minimal Claude Code plugin with slash command | Copy to your project            |
| [miniapp/](./miniapp/)       | Minimal Base Mini App with MiniKit            | `npm install && npm run dev`    |

## What These Examples Show

### Mobile App Example

- Expo Router navigation
- RevenueCat paywall integration
- TypeScript configuration
- Minimal but functional UI

### dApp Example

- Next.js App Router
- Wallet connection (Solana)
- Tailwind CSS styling
- Framer Motion animations

### Agent Example

- HTTP server with Express
- Health check endpoint
- Process endpoint for AI requests
- Structured logging

### Plugin Example

- Claude Code plugin structure
- Slash command definition
- Plugin manifest (plugin.json)
- Installation instructions

### Mini App Example

- MiniKit configuration
- Manifest route for Base
- Account association placeholder
- Responsive mobile UI

## Using Examples as Starting Points

You can copy any example as a starting point for your project:

```bash
# Copy the mobile app example
cp -r examples/mobile-app app-factory/builds/my-new-app

# Copy the dApp example
cp -r examples/dapp dapp-factory/dapp-builds/my-new-dapp
```

Then customize the code to fit your needs.

## Relationship to Full Builds

These examples are **minimal demonstrations**. Full App Factory builds include much more:

- Comprehensive research and market analysis
- Complete ASO (App Store Optimization) materials
- Marketing copy and launch materials
- Ralph QA verification
- Documentation (README, RUNBOOK, TESTING, etc.)

Use these examples to understand the structure, then use the full pipeline to build production-ready apps.
