# agent-factory

**AI Agent Pipeline** | Part of [App Factory](../README.md)

Describe an AI agent in plain English. Get a complete scaffold generated automatically. Prepare for deployment.

---

## Who Is This For?

- Developers building AI-powered agents/bots
- Builders creating automated workflows
- Anyone who wants an HTTP-based AI service

**Not for you if:** You need a mobile app (use [the_factory](../the_factory/)) or a web app (use [web3-factory](../web3-factory/))

---

## Quickstart

```bash
cd agent-factory
claude
# Type: "Build an agent that summarizes YouTube videos"
# Answer 3 questions (name, description, env vars)
# Answer: "Do you want token integration?" → no (default) or yes
# Scaffold appears in outputs/<agent-name>/
# Test locally:
cd outputs/<agent-name>
npm install
npm run dev
curl http://localhost:8080/health
# Push to GitHub when ready for deployment
```

---

## Full Walkthrough

### Step 1: Describe Your Agent

Open Claude Code in this directory and describe your agent:

```
Build an agent that summarizes YouTube videos
```

### Step 2: Answer Questions

Claude will ask:

1. **Name**: "What should I call this agent?" → `youtube-summarizer`
2. **Description**: "In one sentence, what does it do?" → `Summarizes YouTube videos into key points`
3. **Environment Variables**: "What API keys does it need?" → `OPENAI_API_KEY` or `none`
4. **Token Integration**: "Do you want token integration for rewards/payments?" → `no` (default) or `yes`

### Step 3: Review Generated Scaffold

Check `outputs/<agent-name>/`:

```
outputs/youtube-summarizer/
├── agent.json          # Agent manifest
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── src/
│   └── index.ts        # HTTP server code
├── AGENT_SPEC.md       # Agent specification
├── RUNBOOK.md          # Run instructions
├── TESTING.md          # Test instructions
├── LAUNCH_CHECKLIST.md # Pre-launch checks
├── FACTORY_IMPORT.md   # Import instructions
└── .env.example        # Environment template (if needed)
```

### Step 4: Test Locally (Recommended)

```bash
cd outputs/<agent-name>
npm install
npm run dev
```

Expected output:
```
youtube-summarizer v1.0.0 running at http://localhost:8080

Endpoints:
  GET  /         - Info
  GET  /health   - Health check
  POST /process  - Process input
```

Test the health endpoint:
```bash
curl http://localhost:8080/health
```

Expected output:
```json
{"status":"ok","name":"youtube-summarizer","version":"1.0.0"}
```

### Step 5: Validate Build (Recommended)

```bash
npm run validate
```

Expected output:
```
Validating: /path/to/outputs/youtube-summarizer

PASSED
  Files: 8
  Size: 12.3 KB

Wrote: factory_ready.json
```

### Step 6: Push to GitHub

```bash
cd outputs/<agent-name>
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-agent
git push -u origin main
```

### Step 7: Prepare for Deployment

**The Factory Launchpad is not yet publicly live.**

At this stage, ensure your project is ready for when launch access opens:

1. All validation checks pass (`npm run validate`)
2. Code pushed to GitHub repository
3. Project metadata prepared (name, description, optional token details)

When the Factory Launchpad opens, you will be able to import your project from GitHub and deploy it.

### Token Configuration (When Launched)

If you enabled token integration, after launching you will:

1. Receive a contract address from the launchpad
2. Add to your project's `.env`:

```bash
TOKEN_CONTRACT_ADDRESS=<your-contract-address>
```

3. Push update and redeploy to activate token features

---

## What Gets Generated

### Without Token Integration (Default)

```
outputs/<agent-name>/
├── agent.json          # Agent manifest
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── src/
│   └── index.ts        # HTTP server
├── AGENT_SPEC.md       # Specification
├── RUNBOOK.md          # Run instructions
├── TESTING.md          # Test instructions
├── LAUNCH_CHECKLIST.md # Launch checks
├── FACTORY_IMPORT.md   # Import guide
└── .env.example        # Environment template
```

### With Token Integration

Adds:
- Token balance check endpoint
- Token configuration in constants
- `TOKEN_INTEGRATION.md` with setup instructions
- `src/lib/token.ts` with token utilities

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js 18+ |
| Language | TypeScript |
| Interface | HTTP (REST) |
| Port | 8080 (default) |

---

## Token Integration Details

Token integration is **completely optional**.

### When to Skip Token Integration

- Building a free utility agent
- MVP without monetization
- Internal tools

### When to Enable Token Integration

- Agent charges per request
- Agent rewards users with tokens
- Agent gates features based on holdings

### How Token Integration Works

1. **During generation:** Answer "yes" to token question
2. **After generation:** Token endpoint and hooks included
3. **At launch:** Configure token details and receive contract address
4. **After launch:** Paste contract address into config
5. **After redeploy:** Token features active

---

## Factory Ready Checklist

This pipeline follows the [Factory Ready Standard](../docs/FACTORY_READY_STANDARD.md).

| Gate | How to Verify |
|------|---------------|
| **Build** | `npm install` succeeds |
| **Run** | `npm run dev` starts server on port 8080 |
| **Test** | `curl http://localhost:8080/health` returns 200 |
| **Validate** | `npm run validate` passes all checks |
| **Launch Ready** | All docs present, pushed to GitHub |

---

## Troubleshooting

### "npm install fails"

```bash
npm install --legacy-peer-deps
```

### "Server won't start"

Check if port 8080 is in use:
```bash
lsof -i :8080
```

Use a different port:
```bash
PORT=3000 npm run dev
```

### "Validation fails: missing agent.json"

Ensure `agent.json` exists at the project root with valid JSON.

### "Validation fails: missing files"

- Run `npm run validate` locally to see which files are missing
- Ensure all required files are present

### "Build fails locally"

- Run `npm run build` locally to see errors
- Ensure all dependencies are in `package.json`

---

## Directory Structure

```
agent-factory/
├── CLAUDE.md           # Agent constitution
├── README.md           # This file
├── ZIP_CONTRACT.md     # Build requirements
├── schema/
│   └── agent.schema.json  # Manifest schema
├── scripts/
│   └── validate.js     # Validation script
├── examples/
│   └── hello-agent/    # Reference implementation
└── outputs/            # Generated scaffolds
```

---

## PASS/FAIL Criteria

### PASS
- [ ] `npm run validate` exits with code 0
- [ ] All required files present (agent.json, package.json, src/)
- [ ] No forbidden files (.env, node_modules, etc.)
- [ ] Server starts and responds to `/health`
- [ ] Pushed to GitHub successfully

### FAIL
- [ ] Validation errors (missing files, forbidden patterns)
- [ ] Build errors during npm install
- [ ] Server crashes on startup
- [ ] agent.json invalid or missing required fields

---

## V1 Constraints

This is V1 - intentionally minimal:

| Aspect | V1 Choice | Why |
|--------|-----------|-----|
| Runtime | Node.js + TypeScript | Universal, type-safe |
| Interface | HTTP only | Most flexible |
| Inference | None (BYOK) | You bring your own API keys |

---

## Links

- **Root README:** [../README.md](../README.md)
- **Factory Ready Standard:** [../docs/FACTORY_READY_STANDARD.md](../docs/FACTORY_READY_STANDARD.md)
- **Preparing for Launch:** [../docs/LAUNCHPAD_OVERVIEW.md](../docs/LAUNCHPAD_OVERVIEW.md)

---

**agent-factory v1.1** - Describe your agent. Get a scaffold. Build.
