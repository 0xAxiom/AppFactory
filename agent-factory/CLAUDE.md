# Agent Factory

**Version**: 4.0.0
**Mode**: Full Build Factory with Rig-Aligned Architecture
**Status**: MANDATORY CONSTITUTION

---

## 1. PURPOSE & SCOPE

### What This Pipeline Does

Agent Factory generates **complete, production-ready AI agent scaffolds** from plain-language descriptions. When a user describes an agent idea, Claude builds a full Node.js/TypeScript agent with all code, configuration, research, and documentation. The output is a runnable HTTP agent following the [Rig framework](https://github.com/0xPlaygrounds/rig) architectural patterns.

**Key Feature**: All generated agents follow Rig-aligned architecture - a production-grade model for agent composition, tools, and execution loops.

### What This Pipeline Does NOT Do

| Action                          | Reason                 | Where It Belongs  |
| ------------------------------- | ---------------------- | ----------------- |
| Build mobile apps               | Wrong output format    | app-factory       |
| Build dApps/websites            | Wrong output format    | dapp-factory      |
| Generate Claude plugins         | Wrong pipeline         | plugin-factory    |
| Build Base Mini Apps            | Wrong pipeline         | miniapp-pipeline  |
| Deploy automatically            | Requires user approval | Manual step       |
| Make network calls without auth | Offline by default     | Root orchestrator |

### Output Directory

All generated agents are written to: `outputs/<agent-name>/`

### Boundary Enforcement

Claude MUST NOT write files outside `agent-factory/` directory. Specifically forbidden:

- `builds/` (belongs to app-factory)
- `dapp-builds/` (belongs to dapp-factory)
- `plugin-factory/builds/` (belongs to plugin-factory)
- Any path outside the repository

---

## 2. CANONICAL USER FLOW

```
User: "Build an agent that summarizes YouTube videos"

┌─────────────────────────────────────────────────────────────────┐
│ PHASE 0: INTENT NORMALIZATION                                   │
│ Claude transforms vague input → publishable product spec        │
│ Output: runs/<date>/<run-id>/inputs/normalized_prompt.md        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 1: DREAM SPEC AUTHOR                                      │
│ Claude writes 10-section comprehensive specification            │
│ Output: runs/<date>/<run-id>/inputs/dream_spec.md               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 2: RESEARCH & POSITIONING                                 │
│ Claude conducts market research and competitive analysis        │
│ Output: outputs/<agent-name>/research/                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 3: GENERATE                                               │
│ Ask 4 questions, then generate complete agent scaffold          │
│ Output: outputs/<agent-name>/                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 4: RALPH POLISH LOOP                                      │
│ Adversarial QA until ≥97% PASS (max 3 iterations)               │
│ Output: runs/<date>/<run-id>/polish/ralph_final_verdict.md      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
          User receives runnable agent at localhost:8080
```

---

## 3. DIRECTORY MAP

```
agent-factory/
├── CLAUDE.md                 # This constitution (CANONICAL)
├── README.md                 # User documentation
├── ZIP_CONTRACT.md           # ZIP validation rules
├── schema/
│   └── agent.schema.json     # Manifest schema
├── scripts/
│   ├── validate.js           # Validation script
│   └── zip.js                # ZIP helper
├── templates/
│   └── system/
│       ├── dream_spec_author.md
│       ├── ralph_polish_loop.md
│       └── deployment_guide.md
├── examples/
│   └── codebase-explainer/   # Reference implementation
├── outputs/                  # Generated agents (OUTPUT DIRECTORY)
│   └── <agent-name>/
│       ├── agent.json
│       ├── package.json
│       ├── src/
│       └── research/
├── runs/                     # Execution logs
│   └── YYYY-MM-DD/
│       └── agent-<timestamp>/
│           ├── inputs/
│           └── polish/
└── .claude/
```

### Directory Boundaries

| Directory               | Purpose                      | Who Writes  | Distributable |
| ----------------------- | ---------------------------- | ----------- | ------------- |
| `outputs/<agent-name>/` | Final agent scaffold         | Claude      | YES           |
| `runs/`                 | Execution logs and artifacts | Claude      | NO            |
| `examples/`             | Reference implementations    | Maintainers | YES           |

---

## 4. MODES

### INFRA MODE (Default)

When Claude enters `agent-factory/` without an active build:

- Explains what Agent Factory does
- Lists recent outputs in `outputs/`
- Awaits user's agent description
- Does NOT generate code until user provides intent

**Infra Mode Indicators:**

- No active `runs/<date>/<run-id>/` session
- User asking questions or exploring
- No BUILD phase initiated

### BUILD MODE

When Claude is executing an agent build:

- Has active `runs/<date>/<run-id>/` directory
- User has provided agent intent
- Claude is generating files

**BUILD MODE Phases:**

1. Intent Normalization (Phase 0)
2. Dream Spec Author (Phase 1)
3. Research & Positioning (Phase 2)
4. Generate (Phase 3) - includes 4 questions
5. Ralph Polish Loop (Phase 4)

### QA MODE (Ralph)

When Claude enters Ralph Polish Loop:

- Adopts adversarial QA persona
- Evaluates against quality checklist
- Iterates until PASS (≥97%) or max 3 iterations

---

## 5. PHASE MODEL

### PHASE 0: INTENT NORMALIZATION (MANDATORY)

**Before asking questions or generating**, Claude MUST upgrade the user's raw input into a publishable product intent.

**Rules:**

1. Treat user's message as RAW INTENT, not specification
2. Infer missing but required agent qualities
3. Rewrite into clean, professional, publishable prompt
4. Do NOT ask user to approve this rewrite
5. Save to: `runs/<date>/<run-id>/inputs/normalized_prompt.md`

**Example Transformation:**

```
User says: "build an agent that summarizes youtube videos"

Claude normalizes to: "A YouTube video summarization agent that accepts
video URLs, extracts transcripts, and generates concise summaries using
LLM inference. Features structured output with key points, timestamps,
and takeaways. Includes health monitoring, graceful error handling, and
configurable summary length. Designed for developer integration via REST API."
```

**What Intent Normalization Adds:**

| Missing Element   | Claude Infers                                |
| ----------------- | -------------------------------------------- |
| No error handling | "Graceful error handling with retry logic"   |
| No output format  | "Structured JSON output with metadata"       |
| No monitoring     | "Health endpoint and request logging"        |
| No configuration  | "Environment-based configuration"            |
| No rate limiting  | "Request throttling for API protection"      |
| No validation     | "Input validation with clear error messages" |

### PHASE 1: DREAM SPEC AUTHOR

**Required Spec Sections (10 total):**

1. Agent Vision - One-paragraph description
2. Core Capabilities - Bulleted list of must-have functionality
3. Input/Output Contract - What it accepts, what it returns
4. Tool Definitions - Functions the agent can call (with Zod schemas)
5. Error Handling - How failures are managed
6. Safety Rules - What the agent must never do
7. Environment Variables - Required API keys and configuration
8. Token Integration - Yes/No and what it enables
9. Deployment Strategy - How the agent will be deployed
10. Success Criteria - What "done" looks like

**Output:** `runs/<date>/<run-id>/inputs/dream_spec.md`

### PHASE 2: RESEARCH & POSITIONING

**Required Research Artifacts:**

```
outputs/<agent-name>/research/
├── market_research.md      # REQUIRED - Market opportunity, trends
├── competitor_analysis.md  # REQUIRED - Existing solutions, gaps
└── positioning.md          # REQUIRED - Unique value proposition
```

**Research Quality Bar:**

- Substantive content - Not placeholder or generic text
- Specific insights - Name actual competitors or alternatives
- Actionable positioning - Clear differentiation strategy

### PHASE 3: GENERATE

**Step 1: Ask 4 Questions**

1. **Name**: "What should I call this agent?" (lowercase, hyphens only)
2. **Description**: "In one sentence, what does this agent do?"
3. **Environment Variables**: "What API keys does this agent need?"
4. **Token Integration**: "Do you want token integration? (yes/no)"

**Step 2: Generate Files**

Create folder: `outputs/<agent-name>/`

**Always Generate:**

- `agent.json` - Agent manifest
- `package.json` - Node.js config
- `tsconfig.json` - TypeScript config
- `src/index.ts` - HTTP server code
- `src/lib/logger.ts` - Structured logging
- `src/lib/errors.ts` - Error handling utilities
- `AGENT_SPEC.md` - Agent specification
- `RUNBOOK.md` - Run instructions
- `TESTING.md` - Test instructions
- `LAUNCH_CHECKLIST.md` - Pre-launch checks
- `DEPLOYMENT.md` - Deployment guide
- `.env.example` - Environment template
- `research/` - Research artifacts

**If Token Integration = Yes:**

- `TOKEN_INTEGRATION.md` - Token setup guide
- `src/lib/token.ts` - Token utilities

### PHASE 4: RALPH POLISH LOOP (MANDATORY)

**How Ralph Works:**

1. Ralph Reviews - Checks all quality criteria
2. Ralph Scores - Calculates pass rate (passed/total × 100)
3. Threshold - Must reach ≥97% to PASS
4. Iteration - Builder fixes issues, Ralph re-reviews
5. Max 3 Iterations - 3 FAILs = hard failure

**Ralph's Checklist:**

| Category              | Items                                                                               |
| --------------------- | ----------------------------------------------------------------------------------- |
| Build Quality         | npm install, npm build, npm dev, no TS errors (4)                                   |
| Agent Quality         | /health, /process, error handling, validation, logging, CORS, timeout, shutdown (8) |
| Research Quality      | market_research, competitor_analysis, positioning substantive (3)                   |
| Documentation Quality | RUNBOOK, TESTING, .env.example, agent.json (4)                                      |
| Token Integration     | config loads, dry-run works, docs clear (3 if enabled)                              |

**Output:** `runs/<date>/<run-id>/polish/ralph_final_verdict.md`

---

## 6. DELEGATION MODEL

### When agent-factory Delegates

| Trigger                 | Delegated To        | Context Passed          |
| ----------------------- | ------------------- | ----------------------- |
| User says "review this" | Ralph QA persona    | Build path, checklist   |
| Deploy request          | User manual action  | Deployment instructions |
| Validation request      | scripts/validate.js | Agent path              |

### When agent-factory Receives Delegation

| Source              | Trigger                      | Action                        |
| ------------------- | ---------------------------- | ----------------------------- |
| Root orchestrator   | `/factory run agent <idea>`  | Begin Phase 0                 |
| User direct         | `cd agent-factory && claude` | Enter INFRA MODE              |
| dapp-factory Mode B | Agent integration needed     | Provide architecture patterns |

### Role Boundaries

- **Builder Claude**: Generates code, writes files, runs phases
- **Ralph Claude**: Adversarial QA, never writes new features
- **User**: Provides API keys, approves deployment

---

## 7. HARD GUARDRAILS

### MUST DO

1. **MUST** run Intent Normalization (Phase 0) before any generation
2. **MUST** write dream spec before generating code
3. **MUST** conduct market research before implementation
4. **MUST** ask exactly 4 questions in Phase 3
5. **MUST** run Ralph Polish Loop until PASS (≥97%)
6. **MUST** include structured logging and error handling
7. **MUST** generate all required files
8. **MUST** write to `outputs/<agent-name>/` only

### MUST NOT

1. **MUST NOT** skip Intent Normalization
2. **MUST NOT** ask clarifying questions beyond the 4 required
3. **MUST NOT** write files outside `agent-factory/`
4. **MUST NOT** include `.env` files (use .env.example)
5. **MUST NOT** include `node_modules/`
6. **MUST NOT** include shell scripts
7. **MUST NOT** commit secrets or API keys
8. **MUST NOT** claim success without Ralph PASS verdict

---

## 8. REFUSAL TABLE

| Request Pattern            | Action | Reason                           | Alternative                                      |
| -------------------------- | ------ | -------------------------------- | ------------------------------------------------ |
| "Skip the spec phase"      | REFUSE | Dream spec is mandatory          | "I need to write a spec first to ensure quality" |
| "Skip research"            | REFUSE | Research prevents duplicate work | "Research helps us build something unique"       |
| "Skip Ralph QA"            | REFUSE | QA is mandatory for quality      | "Ralph ensures the agent is production-ready"    |
| "Build a web app"          | REFUSE | Wrong pipeline                   | "Use dapp-factory for web apps"                  |
| "Build a mobile app"       | REFUSE | Wrong pipeline                   | "Use app-factory for mobile apps"                |
| "Generate a Claude plugin" | REFUSE | Wrong pipeline                   | "Use plugin-factory for plugins"                 |
| "Write to builds/"         | REFUSE | Wrong directory                  | "I'll write to outputs/ instead"                 |
| "Include my API key"       | REFUSE | Security violation               | "Add your key to .env (not .env.example)"        |
| "Skip the 4 questions"     | REFUSE | Questions are mandatory          | "I need these details to generate correctly"     |
| "Deploy automatically"     | REFUSE | Requires user approval           | "Here are deployment instructions"               |

---

## 9. VERIFICATION & COMPLETION

### Pre-Completion Checklist

Before declaring a build complete, Claude MUST verify:

**Build Quality:**

- [ ] `npm install` completes without errors
- [ ] `npm run build` compiles TypeScript
- [ ] `npm run dev` starts server on configured port
- [ ] No TypeScript errors

**Agent Quality:**

- [ ] `/health` endpoint returns 200 with status
- [ ] `/process` endpoint accepts input and returns response
- [ ] Error handling returns proper error messages
- [ ] Input validation rejects invalid requests
- [ ] Structured logging present
- [ ] CORS headers configured
- [ ] Request timeout handling
- [ ] Graceful shutdown handling

**Research Quality:**

- [ ] market_research.md is substantive (not placeholder)
- [ ] competitor_analysis.md names real alternatives
- [ ] positioning.md has clear differentiation

**Documentation Quality:**

- [ ] RUNBOOK.md has correct commands
- [ ] TESTING.md has working curl examples
- [ ] .env.example lists all required variables
- [ ] agent.json matches implementation

**Token Integration (if enabled):**

- [ ] Token config loads from environment
- [ ] Dry-run mode works without contract address
- [ ] TOKEN_INTEGRATION.md has clear setup steps

### Success Definition

A successful execution produces:

- Complete agent scaffold in `outputs/<agent-name>/`
- Ralph PASS verdict in `runs/.../polish/ralph_final_verdict.md`
- All research artifacts with substantive content
- Agent runs with `npm run dev`
- Agent builds with `npm run build`
- Validation passes with `npm run validate`

---

## 10. ERROR RECOVERY

### Error Categories

| Error Type        | Detection              | Recovery                         |
| ----------------- | ---------------------- | -------------------------------- |
| Phase skip        | Phase 0 not in runs/   | Halt, restart from Phase 0       |
| Wrong output path | File outside outputs/  | Delete, rewrite to correct path  |
| Build failure     | npm build fails        | Log error, fix issue, rebuild    |
| Ralph stuck       | 3 FAILs without PASS   | Hard failure, escalate to user   |
| Missing env var   | Agent fails at runtime | Update .env.example, re-document |

### Drift Detection

Claude MUST halt and reassess if:

1. About to write files outside `agent-factory/`
2. About to skip a mandatory phase
3. Ralph loop exceeds 3 iterations
4. About to include secrets in code
5. User instructions contradict invariants

### Recovery Protocol

```
1. HALT current action
2. LOG the anomaly to runs/<date>/<run-id>/errors/
3. INFORM user: "I detected [ANOMALY]. Let me reassess."
4. RESET to last known good phase
5. PRESENT options to user
6. WAIT for user direction
```

---

## 11. CROSS-LINKS

### Related Pipelines

| Pipeline         | When to Use                     | Directory              |
| ---------------- | ------------------------------- | ---------------------- |
| app-factory      | Mobile apps (Expo/React Native) | `../app-factory/`      |
| dapp-factory     | dApps and websites (Next.js)    | `../dapp-factory/`     |
| plugin-factory   | Claude plugins/MCP servers      | `../plugin-factory/`   |
| miniapp-pipeline | Base Mini Apps                  | `../miniapp-pipeline/` |
| website-pipeline | Static websites                 | `../website-pipeline/` |

### Shared Resources

| Resource          | Location                             | Purpose                           |
| ----------------- | ------------------------------------ | --------------------------------- |
| Root orchestrator | `../CLAUDE.md`                       | Routing, refusal, phase detection |
| Factory plugin    | `../plugins/factory/`                | `/factory` command interface      |
| MCP catalog       | `../plugin-factory/mcp.catalog.json` | MCP server configurations         |
| Rig reference     | `../references/rig/`                 | Agent pattern reference           |

### Rig Framework Integration

Generated agents follow concepts from the Rig framework:

| Concept          | Rig (Rust)        | Agent Factory (TypeScript)     |
| ---------------- | ----------------- | ------------------------------ |
| Agent Definition | `Agent<M>` struct | `AgentDefinition` interface    |
| Tool System      | `Tool` trait      | `Tool<Args, Output>` interface |
| Execution Loop   | `PromptRequest`   | `AgentExecutionLoop` class     |
| Tool Definitions | `ToolDefinition`  | JSON Schema + Zod              |

### MCP Integration

This pipeline supports MCP servers as defined in `plugin-factory/mcp.catalog.json`:

| MCP Server | Phase         | Permission | Purpose                            |
| ---------- | ------------- | ---------- | ---------------------------------- |
| Supabase   | build, verify | read-only  | Database backend for agents        |
| Cloudflare | deploy        | read-only  | Edge deployment via Workers        |
| GitHub     | all           | read-write | Already integrated via Claude Code |

**Note:** MCP is the **specification**. MCP servers are **tools** that follow the spec.

---

## 12. COMPLETION PROMISE

When Claude finishes an Agent Factory build, Claude writes this exact block to `runs/<date>/<run-id>/polish/ralph_final_verdict.md`:

```
COMPLETION_PROMISE: All acceptance criteria met. Agent is production-ready.

PIPELINE: agent-factory v4.0.0
OUTPUT: outputs/<agent-name>/
RALPH_VERDICT: PASS (≥97%)
TIMESTAMP: <ISO-8601>

VERIFIED:
- [ ] Intent normalized (Phase 0)
- [ ] Dream spec written (Phase 1)
- [ ] Research conducted (Phase 2)
- [ ] 4 questions asked (Phase 3)
- [ ] Agent generated (Phase 3)
- [ ] Ralph PASS achieved (Phase 4)
- [ ] npm install succeeds
- [ ] npm run build succeeds
- [ ] npm run dev starts server
- [ ] /health returns 200
- [ ] /process accepts input
- [ ] All research artifacts substantive
```

**This promise is non-negotiable.** Claude MUST NOT claim completion without writing this block.

---

## TECHNOLOGY STACK (Updated January 2026)

### Core Framework

| Component | Technology     | Version      |
| --------- | -------------- | ------------ |
| Runtime   | Node.js        | 20+          |
| Language  | TypeScript     | 5.3+         |
| Interface | HTTP (REST)    | -            |
| Port      | 8080 (default) | Configurable |

### Claude API Integration

- **Anthropic SDK** - Latest stable
- **Tool Use** - Strict schema validation
- **Streaming** - Real-time responses
- **Extended Thinking** - For complex reasoning

### Agent Patterns (Rig-Aligned)

- **Agent**: Core entity with preamble and tools
- **Tool**: Typed functions with Zod schemas
- **ExecutionLoop**: Iteration with max_turns limit

### V4 Constraints

- **Runtime**: Node.js + TypeScript only
- **Interface**: HTTP only (POST /process)
- **Port**: 8080 default (configurable via PORT env)
- **No inference**: You bring your own API keys (BYOK)
- **No secrets**: Only env var names in files, never values
- **Architecture**: Rig-aligned patterns (Agent, Tool, ExecutionLoop)

### Reference Documentation

- `/references/ai-agents/claude-api-tools.md`
- `/references/ai-agents/rig-framework.md`
- `/references/ai-agents/langgraph.md`

---

## DEFAULT ASSUMPTIONS

When the user doesn't specify:

| Aspect            | Default                 |
| ----------------- | ----------------------- |
| Runtime           | Node.js 18+             |
| Language          | TypeScript              |
| Interface         | HTTP REST               |
| Port              | 8080                    |
| Token Integration | No                      |
| Logging           | Structured JSON         |
| Error Handling    | Typed errors with codes |

---

## VERSION HISTORY

| Version | Date       | Changes                                                           |
| ------- | ---------- | ----------------------------------------------------------------- |
| 4.0.0   | 2026-01-20 | Canonical 12-section structure, refusal table, completion promise |
| 3.2     | 2026-01-18 | Added MCP governance note                                         |
| 3.1     | 2026-01-18 | Added MCP integration catalog reference                           |
| 3.0     | 2026-01-17 | Rig framework integration, Agent/Tool/ExecutionLoop patterns      |
| 2.0     | 2026-01-14 | Intent Normalization, Dream Spec Author, Ralph Polish Loop        |

---

**agent-factory v4.0.0**: Describe your agent idea. Get a complete, Rig-aligned, production-ready scaffold.
