# OpenClaw Reference Documentation

**Source**: https://openclaw.ai/
**Cached**: 2026-02-01

## What Is OpenClaw

OpenClaw is an open-source personal AI assistant platform that enables deploying custom AI agents across multiple chat platforms (WhatsApp, Telegram, Discord, Slack).

## Key Features

- Multi-platform deployment (WhatsApp, Telegram, Discord, Slack)
- Customizable personality and communication style
- 50+ built-in integrations/skills
- Multiple AI model support (Claude, GPT-4, local models)
- Persistent memory system
- Sub-agent delegation
- Proactive mode for background tasks
- Cron job scheduling

## Architecture

OpenClaw bots are Node.js applications with:

- TypeScript configuration files
- Skill-based plugin system
- Platform adapters for each chat service
- Memory persistence layer
- Optional token integration

## Configuration

Main configuration is done through TypeScript config files:

- `bot.config.ts` — Core bot settings
- `platforms.config.ts` — Platform-specific settings
- `skills.config.ts` — Enabled skills/integrations
- `model.config.ts` — AI model parameters

## Deployment

1. Clone the generated bot workspace
2. Copy `.env.example` to `.env` and fill in API keys
3. `npm install`
4. `npm start`

For production: use PM2, Docker, or a cloud platform.
