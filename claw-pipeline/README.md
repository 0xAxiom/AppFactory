# Claw Pipeline

**Custom Clawbot AI Assistant Pipeline** | Part of [App Factory](../README.md)

Describe an AI assistant idea. Get a complete, runnable OpenClaw project as a zip.

---

## Who Is This For?

- Builders who want a custom AI assistant across multiple chat platforms
- Anyone launching AI bots on WhatsApp, Telegram, Discord, or Slack
- Creators who want a personalized AI assistant with custom skills and personality

**Not for you if:** You need a mobile app (use [app-factory](../app-factory/)), a website (use [website-pipeline](../website-pipeline/)), a dApp (use [dapp-factory](../dapp-factory/)), or a Base Mini App (use [miniapp-pipeline](../miniapp-pipeline/))

---

## How to Start

```bash
cd claw-pipeline
claude
```

Then describe your bot idea:

```
I want an AI chess tutor that teaches openings and analyzes positions
```

Claude will:

1. **Normalize your intent** — Transform your idea into a structured bot concept
2. **Design the personality** — Traits, communication style, skills, platform config
3. **Generate the workspace** — Complete OpenClaw project with config, skills, identity files
4. **Verify everything** — Install dependencies, validate config, run proof gate
5. **Run Ralph QA** — Adversarial quality review until production-ready
6. **Package as zip** — Complete ready-to-deploy project with setup instructions

**Output:** A production-ready OpenClaw assistant in `builds/claws/<slug>/`

---

## What Gets Generated

```
builds/claws/<slug>/
├── SOUL.md              # Identity and personality
├── IDENTITY.md          # Public profile + token info
├── AGENTS.md            # Sub-agent configuration
├── USER.md              # Creator context
├── TOOLS.md             # Skills and integrations
├── MEMORY.md            # Memory system config
├── HEARTBEAT.md         # Health status
├── BOOTSTRAP.md         # First boot protocol
├── config.json          # Machine-readable config
├── .env.example         # API key template
├── LAUNCH_CARD.md       # Setup instructions
├── agents/              # Sub-agent state
├── tasks/               # Task tracking
└── memory/              # Persistent memory
```

---

## Running Your Bot

After Claude finishes:

```bash
cd builds/claws/<slug>
cp .env.example .env
# Fill in your API keys
npm install
npm start
```

---

## Pipeline Stages

| Stage | Name                 | Purpose                                       |
| ----- | -------------------- | --------------------------------------------- |
| C0    | Intent Normalization | Transform raw input into structured concept   |
| C1    | Bot Spec Design      | Design persona, skills, platforms             |
| C2    | Bot Scaffold         | Generate workspace files                      |
| C3    | Verify               | Validate workspace integrity                  |
| C4    | Ralph QA             | Adversarial quality review                    |
| C5    | Launch Card + Zip    | Package and create setup instructions         |

---


## Workspace Features

- **Sub-agent delegation** — Scout (research), Builder (code), Watcher (monitoring)
- **Memory system** — Persistent memory with configurable retention
- **Multi-platform** — WhatsApp, Telegram, Discord, Slack
- **Custom skills** — Web browsing, email, calendar, social posting, and more
- **Identity system** — SOUL.md personality, IDENTITY.md public profile

---

## Quality Standards

Every bot must pass before Claude declares it complete:

- Config validation — all required fields present
- Environment variable documentation complete
- No secrets in source files
- Ralph QA verdict: PASS (>=97%)

---

## Defaults

When you don't specify:

| Aspect        | Default                                  |
| ------------- | ---------------------------------------- |
| Platforms     | All (WhatsApp, Telegram, Discord, Slack) |
| AI Model      | Claude (Anthropic)                       |
| Skills        | Standard (email, calendar, web browsing) |
| Communication | Friendly, professional tone              |
| Sub-agents    | Disabled                                 |

---

## Directory Structure

```
claw-pipeline/
├── CLAUDE.md             # Constitution (Claude's instructions)
├── README.md             # This file
├── constants/            # OpenClaw defaults
├── utils/                # Config generation, retry logic
├── schemas/              # JSON Schema validation
├── templates/            # Workspace templates and system prompts
├── skills/               # Skill definitions
├── scripts/              # Internal tools (used by Claude)
├── builds/               # Generated assistants (output)
│   └── claws/
└── vendor/
    └── openclaw/         # Cached reference documentation
```

---

## Troubleshooting

### npm install fails in generated workspace

**IMPORTANT:** Do NOT use `--legacy-peer-deps`, `--force`, or `--ignore-engines` flags. These are forbidden by the Local Run Proof Gate.

1. Check Node version (need 18+)
2. Fresh install:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Missing API keys

Check `.env.example` in your generated workspace — every required key is documented there with descriptions.

---

## Links

- **Root README:** [../README.md](../README.md)
- **Constitution:** [CLAUDE.md](./CLAUDE.md) - Full pipeline specification
- **Mobile apps:** [app-factory](../app-factory/)
- **Websites:** [website-pipeline](../website-pipeline/)
- **dApps:** [dapp-factory](../dapp-factory/)
- **AI agents:** [agent-factory](../agent-factory/)
- **Claude plugins:** [plugin-factory](../plugin-factory/)
- **Mini apps:** [miniapp-pipeline](../miniapp-pipeline/)

---

**claw-pipeline v2.0.0** - `cd claw-pipeline && claude` - describe your AI assistant idea - get a complete OpenClaw project as a zip.
