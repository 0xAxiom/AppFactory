# Agent Factory

**Agent-run-in-repo pipeline for generating AI agent scaffolds.**

Open this repo in Claude Code or Cursor. Describe your agent in plain English. Get a complete scaffold generated automatically.

## This Is NOT a CLI Tool

Agent Factory is designed to be used **with an AI coding assistant**. You don't run commands. You describe what you want, and the agent generates it for you.

## Quick Start

```
1. Clone this repo
2. Open in Claude Code or Cursor
3. Type: "Build an agent that summarizes YouTube videos"
4. Answer 3 questions
5. Find your agent in outputs/<agent-name>/
6. Run: npm run zip
7. Upload to factoryapp.dev
```

That's it. Local testing is optional.

## Philosophy

```
Agent Factory is an INSTRUCTION FACTORY, not an inference platform.
```

- **No hosted AI inference** - We never call OpenAI, Anthropic, or any LLM API
- **No API costs** - You run agents locally with your own keys
- **No CLI commands** - The AI assistant generates files for you
- **Deterministic scaffolds** - Same input = same output

## What Gets Generated

When you describe your agent, Claude creates:

```
outputs/your-agent-name/
├── agent.json       # Manifest (describes your agent)
├── package.json     # Node.js dependencies
├── tsconfig.json    # TypeScript config
├── src/
│   └── index.ts     # Main HTTP server code
├── AGENT_SPEC.md    # Human-readable description
└── RUNBOOK.md       # How to run it locally
```

## V1 Constraints

V1 is intentionally minimal:

| Aspect | V1 Choice | Why |
|--------|-----------|-----|
| Runtime | Node.js + TypeScript | Universal, type-safe |
| Interface | HTTP only | Most flexible, works everywhere |
| Inference | None (BYOK) | You bring your own API keys |

## Project Structure

```
agent-factory/
├── CLAUDE.md                # Instructions for Claude (primary)
├── ZIP_CONTRACT.md          # Rules for valid uploads
├── schema/
│   └── agent.schema.json    # Manifest schema
├── scripts/                 # Optional helpers (not required)
│   ├── validate.js          # Validate an agent
│   └── zip.js               # Create upload ZIP
├── examples/
│   └── hello-agent/         # Working example
└── outputs/                 # Generated agents appear here
```

## After Generation

**Primary flow (generate → zip → upload):**
```bash
cd outputs/<agent-name>
npm run zip
# Upload the .zip to factoryapp.dev
```

**Optional: Test locally first:**
```bash
npm install
# Add your API keys to .env (if needed)
npm start
curl -X POST http://localhost:3000/process -d '{"input":"hello"}'
```

## Uploading to Platform

1. `cd outputs/<agent-name> && npm run zip`
2. Upload to factoryapp.dev
3. Platform validates (no code execution)
4. Valid agents appear in the showcase
5. Other builders download and run with their own keys

## ZIP Contract

Your upload ZIP must follow strict rules:

- **Required**: `agent.json`, `package.json`, `src/`
- **Forbidden**: `.env`, `node_modules/`, shell scripts, secrets
- **Max size**: 10 MB

See [ZIP_CONTRACT.md](./ZIP_CONTRACT.md) for complete rules.

## External Data / API Rules

When building agents that use external APIs (crypto prices, weather, etc.):

- **Declare env vars**: List required API key NAMES in `agent.json`
- **Never include secrets**: Only variable names, never values
- **Prefer free endpoints**: Use no-auth APIs when possible
- **BYOK**: Builder supplies their own keys at runtime

## Optional Scripts

Helper scripts exist but are **not required** for the primary flow:

```bash
# These are optional - most users won't need them
node scripts/validate.js outputs/my-agent
node scripts/zip.js outputs/my-agent
```

The AI assistant handles generation. You can use any zip tool for packaging.

## Security

- **Deny-by-default permissions** - Agents declare what they need
- **No secrets in manifests** - Only variable names, never values
- **No code execution on platform** - Builders run agents themselves

## License

MIT

---

**Part of the Factory ecosystem. Generate structure, not inference.**
