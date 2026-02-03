# Factory

A command interface for App Factory pipelines in Claude Code.

> **Scope:** Factory is designed for use inside the AppFactory repository and is not intended to operate as a standalone plugin.

## What is Factory?

Factory is a Claude Code plugin that helps you plan and execute App Factory's code generation pipelines. It provides a single `/factory` command to assist in creating mobile apps, dApps, AI agents, and Claude plugins—with mandatory approval before any execution.

**Key principle:** Factory never runs anything without showing you the plan first and waiting for your explicit approval.

## What Factory Will Never Do

Factory is designed with explicit consent and minimal permissions:

- **No background execution** — Only runs when you invoke a command
- **No silent actions** — Always shows a plan before doing anything
- **Network calls require authorization** — Network-enabled by default, but nothing runs without explicit approval
- **No telemetry** — Does not collect, transmit, or report any data
- **No writes outside scope** — All generated files go to `./builds/` only
- **No approval bypass** — There is no `--force` or `--yes` flag

## Privacy & Data

**All data stays local.** Factory:

- Writes files only to `./builds/` directory
- Writes audit logs to your local filesystem only
- Does not send telemetry, analytics, or usage data
- Does not connect to external servers
- Does not require an account or authentication

## Quickstart

### Plan Without Executing

```
/factory plan a meditation timer with breathing exercises
```

Shows what would be created. No files are modified.

### Execute With Approval

```
/factory run miniapp a meditation timer with breathing exercises
```

Shows the plan, then waits for you to type `approve` before executing.

### Review Generated Code

```
/factory ralph ./builds/meditation-timer --loops 3
```

Runs 3 rounds of code review and produces a verdict file.

## Commands

| Command                             | Purpose                                |
| ----------------------------------- | -------------------------------------- |
| `/factory help`                     | Show command reference                 |
| `/factory plan <idea>`              | Generate execution plan (no execution) |
| `/factory run <pipeline> <idea>`    | Execute with mandatory approval gate   |
| `/factory ralph <path> [--loops N]` | Code review (1-5 loops)                |
| `/factory audit`                    | View execution history                 |

## Available Pipelines

| Pipeline  | What It Creates                           |
| --------- | ----------------------------------------- |
| `miniapp` | Base Mini Apps (MiniKit + Next.js)        |
| `dapp`    | Web3 dApps (Next.js + wallet integration) |
| `agent`   | AI agent scaffolds (Node.js)              |
| `app`     | Mobile apps (Expo + React Native)         |
| `plugin`  | Claude Code plugins                       |

## How It Works

1. You run `/factory run <pipeline> <idea>`
2. Factory analyzes your idea and generates a detailed plan
3. The plan shows: files to create, steps to run, manual actions required
4. You review the plan and type `approve` or `reject`
5. On approval, Factory writes files to `./builds/`
6. All actions are logged to the local audit trail

## Configuration

Pipeline paths are defined in `config.default.yaml`. Default settings:

- Network-enabled by default (still requires explicit authorization)
- Approval required for all executions
- Output confined to `./builds/` directory

## Behavioral Guarantees

See [INVARIANTS.md](./INVARIANTS.md) for the non-negotiable constraints:

- No silent execution
- Mandatory approval gates
- Confined file writes (`./builds/` only)
- Full audit logging
- Network-enabled by default

## Verification

See [PROOF_GATE.md](./PROOF_GATE.md) to verify the plugin works correctly.

## License

MIT
