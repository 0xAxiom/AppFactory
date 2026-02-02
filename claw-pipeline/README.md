# Claw Pipeline

Generate custom **Clawbot AI assistants** with optional dual-chain token launch.

## What It Does

Claw Pipeline creates fully-configured AI assistant workspaces with:

- Customizable personality, skills, and platform integrations
- Sub-agent delegation system (scout, builder, watcher)
- Memory and learning systems
- Optional token launch on **Solana** (via Bags.fm) or **Base** (via Clanker)

## Quick Start

```bash
# Option 1: One-command setup
bash setup.sh

# Option 2: Interactive wizard
npm run setup

# Option 3: Full pipeline
npm start
```

## Pipeline Stages

| Stage | Name                 | Purpose                                     |
| ----- | -------------------- | ------------------------------------------- |
| C0    | Intent Normalization | Transform raw input into structured concept |
| C1    | Bot Spec Design      | Design persona, skills, platforms           |
| C2    | Chain Selection      | Solana (Bags), Base (Clanker), or no token  |
| C3    | Token Configuration  | Chain-specific token params                 |
| C4    | Token Creation       | Launch token (requires approval)            |
| C5    | Bot Scaffold         | Generate workspace files                    |
| C6    | Verify               | Validate workspace integrity                |
| C7    | Ralph QA             | Quality review                              |
| C8    | Launch Card          | Summary and instructions                    |

## Workspace Structure

Each generated bot lives in `builds/claws/<slug>/` with:

```
builds/claws/<slug>/
├── SOUL.md          # Identity and personality
├── IDENTITY.md      # Public profile + token info
├── AGENTS.md        # Sub-agent configuration
├── USER.md          # Creator context
├── TOOLS.md         # Skills and integrations
├── MEMORY.md        # Memory system config
├── HEARTBEAT.md     # Health status
├── BOOTSTRAP.md     # First boot protocol
├── config.json      # Machine-readable config
├── .env.example     # API key template
├── agents/          # Sub-agent state
├── tasks/           # Task tracking
└── memory/          # Persistent memory
```

## Token Launch

### Solana (Bags.fm)

- Partner key: `FDYcV...dGE7`
- Fee split: 75% creator / 25% partner
- Wallet: Solana Base58 format

### Base (Clanker / Agent Launchpad)

- Fee split: 75% creator / 25% protocol
- Wallet: EVM 0x format
- Auto-creates Uniswap V4 pool

## Scripts

| Script                      | Purpose                       |
| --------------------------- | ----------------------------- |
| `npm start`                 | Run full pipeline             |
| `npm run setup`             | Interactive wizard            |
| `npm run validate`          | Validate workspace            |
| `npm run launch-token`      | Launch token for existing bot |
| `npm run generate-identity` | Regenerate identity files     |

## Part of App Factory

This pipeline is part of the [App Factory](../) monorepo. Use `/factory run claw <idea>` from the root to launch.

---

claw-pipeline v1.0.0
