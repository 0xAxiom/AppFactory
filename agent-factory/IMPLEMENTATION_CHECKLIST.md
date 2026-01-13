# Agent Factory - Implementation Checklist

## V1 Scope

V1 is intentionally minimal:
- **Runtime**: Node.js + TypeScript only
- **Interface**: HTTP only
- **UX**: Agent-run-in-repo (not CLI)

## Core Files

| File | Status | Purpose |
|------|--------|---------|
| `CLAUDE.md` | Complete | Primary entrypoint - instructions for Claude + generation templates |
| `README.md` | Complete | Overview for humans, explains agent-first approach |
| `ZIP_CONTRACT.md` | Complete | Rules for valid uploads |
| `schema/agent.schema.json` | Complete | JSON Schema for agent.json validation |
| `scripts/validate.js` | Complete | Optional validation helper |
| `scripts/zip.js` | Complete | Optional zip helper |
| `outputs/.gitkeep` | Complete | Where generated agents appear |

## Example Agent

| File | Status |
|------|--------|
| `examples/hello-agent/agent.json` | Complete |
| `examples/hello-agent/package.json` | Complete |
| `examples/hello-agent/tsconfig.json` | Complete |
| `examples/hello-agent/src/index.ts` | Complete |
| `examples/hello-agent/AGENT_SPEC.md` | Complete |
| `examples/hello-agent/RUNBOOK.md` | Complete |

## Removed (CLI Approach)

These were removed because they created a CLI-first experience:
- `generator/` - Interactive CLI generator
- `validator/` - CLI validation tool
- `zipper/` - CLI zip creator
- `bin/cli.js` - CLI entrypoint
- `GET_STARTED.md` - CLI-focused tutorial
- `AGENT_FACTORY_PROMPT.md` - Merged into CLAUDE.md

## Agent-First UX

Users now:
1. Open repo in Claude Code or Cursor
2. Type "Build an agent that..."
3. Answer 3 questions (name, description, env vars)
4. Get files generated in `outputs/<agent-name>/`

No CLI commands required.

## V1 Constraints

| Aspect | Choice | Rationale |
|--------|--------|-----------|
| Runtime | Node.js | Universal, well-understood |
| Language | TypeScript | Type safety, IDE support |
| Interface | HTTP | Most flexible, works everywhere |
| Inference | None | BYOK (Bring Your Own Keys) |

---

**Status**: V1 Complete
