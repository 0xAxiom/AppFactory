# Moltbot Agent Template

> Build AI agents that run on Moltbot — the open-source agent runtime for Claude.

## Overview

This template generates a complete **Moltbot agent workspace** — a set of markdown files that define an AI agent's identity, behavior, memory, and capabilities. Unlike HTTP API agents, Moltbot agents are conversational AI assistants that can:

- Run on multiple channels (Telegram, Discord, Slack, terminal)
- Maintain persistent memory across sessions
- Use tools and skills
- Operate proactively via heartbeats
- Delegate to sub-agents

## What Gets Generated

```
<agent-name>/
├── SOUL.md           # Identity, personality, core values
├── AGENTS.md         # Workspace behavior rules
├── TOOLS.md          # Tool configurations and notes
├── USER.md           # User profile template
├── MEMORY.md         # Long-term memory seed
├── IDENTITY.md       # Name, emoji, avatar
├── HEARTBEAT.md      # Proactive behavior config (if enabled)
├── SETUP.md          # Installation & deployment guide
├── memory/           # Daily memory logs directory
│   └── .gitkeep
└── research/         # Market research (pipeline requirement)
    ├── market_research.md
    ├── competitor_analysis.md
    └── positioning.md
```

## Pre-configured Features

- **Persistent Identity**: SOUL.md defines who the agent is across all sessions
- **Memory System**: Daily logs + curated long-term memory
- **Channel Agnostic**: Works on Telegram, Discord, Slack, or CLI
- **Tool Access**: Configurable permissions for file, web, code execution
- **Proactive Mode**: Optional heartbeat-driven autonomous behavior
- **Sub-agent Support**: Can spawn and manage child agents

## Phase 3 Questions

When generating a Moltbot agent, Claude asks these 6 questions:

| #   | Question                                   | Purpose                  |
| --- | ------------------------------------------ | ------------------------ |
| 1   | Agent name (lowercase-with-hyphens)        | Directory name, identity |
| 2   | Personality in one sentence                | SOUL.md core vibe        |
| 3   | Primary mission/purpose                    | What the agent does      |
| 4   | Channels (telegram/discord/slack/terminal) | Deployment targets       |
| 5   | External services needed (APIs, databases) | TOOLS.md setup           |
| 6   | Proactive behavior? What to monitor?       | HEARTBEAT.md config      |

## Tech Stack

- **Runtime**: Moltbot (Node.js)
- **Model**: Claude (Anthropic)
- **Config**: JSON + Markdown
- **Memory**: File-based (markdown)

## Quality Expectations

Ralph QA validates:

- [ ] SOUL.md has clear identity and values
- [ ] AGENTS.md has actionable workspace rules
- [ ] TOOLS.md documents all required integrations
- [ ] USER.md is a useful template
- [ ] MEMORY.md has appropriate seed content
- [ ] SETUP.md has complete installation steps
- [ ] All files are well-formatted markdown
- [ ] No placeholder text remaining
- [ ] Personality is consistent across files

## Example Use Cases

- **Personal Assistant**: Calendar, email, task management
- **Social Media Manager**: Twitter/X engagement, content scheduling
- **Developer Helper**: Code review, documentation, git workflows
- **Research Agent**: Web search, summarization, report generation
- **Community Manager**: Discord/Telegram moderation, FAQs
- **Monitoring Agent**: GitHub watch, API health, alerting

## Customization Points

After generation, users typically customize:

1. `SOUL.md` — Refine personality and values
2. `TOOLS.md` — Add API credentials and tool notes
3. `USER.md` — Fill in their personal context
4. `HEARTBEAT.md` — Tune proactive check frequency

## Deployment

Generated agents deploy to Moltbot via:

```bash
# Copy workspace to Moltbot agents directory
cp -r <agent-name> ~/.moltbot/agents/

# Configure in moltbot.json
# Add agent to agents[] array with workspace path

# Restart Moltbot
moltbot gateway restart
```

## Resources

- [Moltbot Documentation](https://docs.molt.bot)
- [Moltbot GitHub](https://github.com/moltbot/moltbot)
- [Agent Examples](https://github.com/moltbot/moltbot/tree/main/examples)
- [Skill Development](https://docs.molt.bot/skills)

---

_Template version: 1.0.0_
_Compatible with: Moltbot 0.1.x+_
