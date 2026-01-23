# agent-factory

**AI Agent Pipeline** | Part of [App Factory](../README.md)

Describe an AI agent idea. Get a complete, production-ready scaffold.

---

## Who Is This For?

- Developers building AI-powered agents/bots
- Builders creating automated workflows
- Anyone who wants an HTTP-based AI service

**Not for you if:** You need a mobile app (use [app-factory](../app-factory/)) or a web app (use [dapp-factory](../dapp-factory/))

---

## Quickstart

```bash
cd agent-factory
claude
```

**You:** "Build an agent that summarizes YouTube videos"

**Claude:**

1. Normalizes your intent into a product specification
2. Writes comprehensive agent spec with all requirements
3. Researches competitors and positioning
4. Asks 4 questions (name, description, env vars, token integration)
5. Generates complete agent in `outputs/youtube-summarizer/`
6. Runs Ralph Polish Loop until quality passes

**When done:**

```bash
cd outputs/youtube-summarizer
npm install
npm run dev
curl http://localhost:8080/health
```

---

## Try the Example

Before building your own agent, try the reference implementation:

```bash
cd examples/codebase-explainer
npm install
cp .env.example .env
# Add your OPENAI_API_KEY to .env
npm run dev
```

Test it:

```bash
curl http://localhost:8080/health
curl -X POST http://localhost:8080/explain \
  -H "Content-Type: application/json" \
  -d '{"question": "What does this project do?", "directory": "/path/to/any/codebase"}'
```

See `examples/codebase-explainer/RUNBOOK.md` for full documentation.

---

## What Happens When You Describe an Agent

### Before (What you say)

> "Build an agent that summarizes YouTube videos"

### After (What Claude builds)

Claude transforms this into a complete product:

> "A YouTube video summarization agent that accepts video URLs, extracts transcripts, and generates concise summaries using LLM inference. Features structured output with key points, timestamps, and takeaways. Includes health monitoring, graceful error handling, structured logging, and configurable summary length. Designed for developer integration via REST API."

Then Claude:

1. Writes a 10-section technical spec
2. Researches competitors and positioning
3. Generates complete Node.js/TypeScript agent
4. Runs quality assurance until it passes

---

## The Pipeline

```
PHASE 0: Intent Normalization  → Upgrade "build agent that..." to product spec
PHASE 1: Dream Spec Author     → 10-section comprehensive specification
PHASE 2: Research & Position   → Market research, competitors, positioning
PHASE 3: Generate              → Complete Node.js/TypeScript agent
PHASE 4: Ralph Polish Loop     → QA until ≥97% quality (max 3 iterations)
```

---

## What Gets Generated

```
outputs/youtube-summarizer/
├── agent.json              # Agent manifest
├── package.json            # npm scripts: build, start, dev
├── tsconfig.json           # TypeScript config
├── src/
│   ├── index.ts            # HTTP server with endpoints
│   └── lib/
│       ├── logger.ts       # Structured JSON logging
│       └── errors.ts       # Error handling utilities
├── research/
│   ├── market_research.md  # Market opportunity
│   ├── competitor_analysis.md # Existing solutions
│   └── positioning.md      # Differentiation strategy
├── AGENT_SPEC.md           # Agent specification
├── RUNBOOK.md              # Run instructions
├── TESTING.md              # Test instructions
├── LAUNCH_CHECKLIST.md     # Pre-launch checks
├── DEPLOYMENT.md           # Deployment guide
└── .env.example            # Environment template
```

### With Token Integration

Adds:

- `TOKEN_INTEGRATION.md` - Token setup guide
- `src/lib/token.ts` - Token utilities
- Token balance checking endpoint

---

## Technology Stack

| Component      | Technology          |
| -------------- | ------------------- |
| Runtime        | Node.js 18+         |
| Language       | TypeScript          |
| Interface      | HTTP (REST)         |
| Port           | 8080 (default)      |
| Logging        | Structured JSON     |
| Error Handling | Typed error classes |

---

## API Endpoints

Every agent includes:

| Method | Path       | Description                        |
| ------ | ---------- | ---------------------------------- |
| GET    | `/`        | Agent info and available endpoints |
| GET    | `/health`  | Health check with uptime           |
| POST   | `/process` | Process input and return response  |

### Example Usage

```bash
# Health check
curl http://localhost:8080/health

# Process input
curl -X POST http://localhost:8080/process \
  -H "Content-Type: application/json" \
  -d '{"input": "https://youtube.com/watch?v=..."}'
```

---

## Token Integration

Token integration is **completely optional**.

### When to Skip

- Building a free utility agent
- MVP without monetization
- Internal tools

### When to Enable

- Agent charges per request
- Agent rewards users with tokens
- Agent gates features based on holdings

---

## Quality Standards

Every agent must pass Ralph's quality checklist:

### Build Quality

- `npm install` completes without errors
- `npm run build` compiles TypeScript
- `npm run dev` starts server

### Agent Quality

- `/health` returns 200 with status
- `/process` accepts input and returns response
- Structured logging on all requests
- Graceful error handling

### Research Quality

- Substantive market research (not placeholder)
- Real competitors named and analyzed
- Clear differentiation strategy

---

## Verification Commands

```bash
cd outputs/<agent-name>

# Install dependencies
npm install

# Type check
npm run typecheck

# Build for production
npm run build

# Start development server
npm run dev

# Run validation
npm run validate
```

---

## Deployment

Agents deploy to the Factory Launchpad or can be self-hosted.

### Factory Launchpad

1. Push to GitHub
2. Import to Launchpad
3. Configure environment variables
4. Deploy

### Self-Hosted

- Railway, Render, Fly.io
- Docker container
- Any Node.js hosting

See `DEPLOYMENT.md` in each generated agent for detailed instructions.

---

## Directory Structure

```
agent-factory/
├── CLAUDE.md               # Constitution (how Claude operates)
├── README.md               # This file
├── schema/
│   └── agent.schema.json   # Manifest schema
├── scripts/
│   ├── validate.js         # Validation script
│   └── zip.js              # ZIP helper (optional)
├── templates/
│   └── system/
│       ├── dream_spec_author.md
│       ├── ralph_polish_loop.md
│       └── deployment_guide.md
├── examples/
│   └── codebase-explainer/ # Reference implementation (Rig-aligned)
├── outputs/                # Generated agents (output)
└── runs/                   # Execution logs
```

---

## Troubleshooting

### "npm install fails"

**IMPORTANT:** Do NOT use `--legacy-peer-deps`, `--force`, or `--ignore-engines` flags. These are forbidden by the Local Run Proof Gate and will cause verification failure. Always fix the actual dependency versions instead.

1. **Clear npm cache:**

   ```bash
   npm cache clean --force
   npm install
   ```

2. **Check Node version:**

   ```bash
   node --version
   # Need 18+
   ```

3. **Use fresh install:**

   ```bash
   rm -rf node_modules package-lock.json
   npm install
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

### "Validation fails"

```bash
npm run validate
# Read output for specific errors
```

### "Ralph fails 3 times"

Agent is a hard failure. Check `runs/.../polish/ralph_final_verdict.md` for unresolved issues.

---

## PASS/FAIL Criteria

### PASS

- `npm install` completes
- `npm run build` compiles
- `npm run dev` starts server
- `/health` returns 200
- All research artifacts present
- Ralph gives PASS verdict

### FAIL

- Build errors
- Missing required files
- Validation errors
- Research is placeholder content
- Ralph gives 3 FAIL verdicts

---

## Links

- **Root README:** [../README.md](../README.md)
- **Constitution:** [CLAUDE.md](./CLAUDE.md)
- **Mobile apps:** [app-factory](../app-factory/)
- **Web apps:** [dapp-factory](../dapp-factory/)

---

**agent-factory v3.0** - Describe your agent idea. Get a complete, Rig-aligned, production-ready scaffold.
