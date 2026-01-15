# App Factory - Repository Root

**This is NOT an executable workspace.**

---

## Scope

This is the root of a mono-repo. There is no root-level execution mode.

Claude MUST NOT attempt to:
- Generate apps from this directory
- Execute build workflows
- Run any pipeline logic

---

## Structure

This repository contains four independent pipelines:

| Directory | Purpose | Constitution |
|-----------|---------|--------------|
| `the_factory/` | Mobile app generation (Expo) | `the_factory/claude.md` |
| `web3-factory/` | Web app generation (Next.js) | `web3-factory/CLAUDE.md` |
| `agent-factory/` | AI agent scaffold generation (Node.js) | `agent-factory/CLAUDE.md` |
| `plugin-factory/` | Claude plugin generation (Code/MCP) | `plugin-factory/CLAUDE.md` |

Each pipeline has its own `CLAUDE.md` that defines execution behavior.

---

## If Asked to Run App Factory From Root

If a user asks to build, generate, or run something from this directory:

1. **Do not execute anything**
2. **Explain** that App Factory requires working inside a pipeline directory
3. **Ask** which pipeline they want to use (mobile, web, agent, or plugin)
4. **Direct them** to `cd` into the appropriate folder and run `claude` there

Example response:
> "App Factory doesn't run from the repository root. Which type of project do you want to build?
> - Mobile app → `cd the_factory && claude`
> - Web app → `cd web3-factory && claude`
> - AI agent → `cd agent-factory && claude`
> - Claude plugin → `cd plugin-factory && claude`"

---

## Boundaries

- Root-level files (`README.md`, `docs/`) are informational only
- Pipeline behavior is defined exclusively in pipeline directories
- This file exists to prevent accidental root-level execution

---

**Do not generate. Do not execute. Direct to pipelines.**
