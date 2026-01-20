# dApp Factory (dapp-factory)

**Version**: 9.0.0
**Mode**: Full Build Factory with Agent Decision Gate
**Status**: MANDATORY CONSTITUTION

---

## 1. PURPOSE & SCOPE

### What This Pipeline Does

dApp Factory generates **complete, production-ready decentralized applications** from plain-language descriptions. When a user describes a dApp idea, Claude builds a full Next.js project with all code, configuration, research, and documentation.

**Key Distinction**: dApp Factory includes an **Agent Decision Gate** that determines whether the application requires AI agent integration via the Rig framework.

### What This Pipeline Does NOT Do

| Action | Reason | Where It Belongs |
|--------|--------|------------------|
| Build mobile apps | Wrong output format | app-factory |
| Generate Claude plugins | Wrong pipeline | plugin-factory |
| Generate AI agent scaffolds only | Wrong scope | agent-factory |
| Deploy to production | Requires user approval | Manual step |
| Make network calls without auth | Offline by default | Root orchestrator |

### Output Directory

All generated dApps are written to: `dapp-builds/<app-slug>/`

### Boundary Enforcement

Claude MUST NOT write files outside `dapp-factory/` directory. Specifically forbidden:
- `builds/` (belongs to app-factory)
- `outputs/` (belongs to agent-factory)
- `plugin-factory/builds/` (belongs to plugin-factory)
- Any path outside the repository

---

## 2. CANONICAL USER FLOW

```
User: "Build me a DeFi dashboard with AI recommendations"

┌─────────────────────────────────────────────────────────────────┐
│ PHASE 0: INTENT NORMALIZATION                                   │
│ Claude transforms vague input → publishable product spec        │
│ Output: runs/<date>/<run-id>/inputs/normalized_prompt.md        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 0.5: AGENT DECISION GATE                                  │
│ Claude evaluates 5 criteria → Mode A (Standard) or Mode B       │
│ Output: runs/<date>/<run-id>/inputs/agent_decision.md           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 1: DREAM SPEC AUTHOR                                      │
│ Claude writes comprehensive product specification               │
│ Output: runs/<date>/<run-id>/inputs/dream_spec.md               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 2: RESEARCH & POSITIONING                                 │
│ Claude conducts market research and competitive analysis        │
│ Output: dapp-builds/<app-slug>/research/                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 3: BUILD                                                  │
│ Claude generates complete Next.js application (+ agents if B)   │
│ Output: dapp-builds/<app-slug>/src/                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 4: RALPH POLISH LOOP                                      │
│ Adversarial QA with Playwright E2E testing until ≥97% PASS     │
│ Output: dapp-builds/<app-slug>/ralph/PROGRESS.md                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
          User receives runnable dApp at localhost:3000
```

---

## 3. DIRECTORY MAP

```
dapp-factory/
├── CLAUDE.md                 # This constitution (CANONICAL)
├── README.md                 # User documentation
├── validator/
│   └── index.ts              # Build validator
├── templates/
│   └── system/
│       ├── dream_spec_author.md
│       ├── ralph_polish_loop.md
│       └── agent_architecture.md
├── skills/
│   ├── react-best-practices/
│   ├── web-design-guidelines/
│   └── web-interface-guidelines/
├── dapp-builds/              # Built apps (OUTPUT DIRECTORY)
│   └── <app-slug>/
│       ├── package.json
│       ├── src/
│       ├── research/
│       ├── ralph/
│       └── tests/
├── runs/                     # Execution logs
│   └── YYYY-MM-DD/
│       └── build-<timestamp>/
│           └── inputs/
└── generated/                # Internal artifacts (DO NOT DISTRIBUTE)
```

### Directory Boundaries

| Directory | Purpose | Who Writes | Distributable |
|-----------|---------|------------|---------------|
| `dapp-builds/<app-slug>/` | Final runnable dApp | Claude | YES |
| `runs/` | Execution logs and planning | Claude | NO |
| `generated/` | Internal/intermediate artifacts | Claude | NO |

---

## 4. MODES

### INFRA MODE (Default)

When Claude enters `dapp-factory/` without an active build:
- Explains what dApp Factory does
- Lists recent builds in `dapp-builds/`
- Awaits user's dApp description
- Does NOT generate code until user provides intent

**Infra Mode Indicators:**
- No active `runs/<date>/<run-id>/` session
- User asking questions or exploring
- No BUILD phase initiated

### BUILD MODE

When Claude is executing a dApp build:
- Has active `runs/<date>/<run-id>/` directory
- User has provided dApp intent
- Claude is generating files

**BUILD MODE Phases (Mode A - Standard):**
1. Intent Normalization (Phase 0)
2. Dream Spec Author (Phase 1)
3. Research & Positioning (Phase 2)
4. Build (Phase 3)
5. Ralph Polish Loop (Phase 4)

**BUILD MODE Phases (Mode B - Agent-Backed):**
1. Intent Normalization (Phase 0)
2. Agent Decision Gate (Phase 0.5)
3. Dream Spec Author - Extended (Phase 1)
4. Research & Positioning - Extended (Phase 2)
5. Build with Agent System (Phase 3)
6. Ralph Polish Loop with Agent QA (Phase 4)

### QA MODE (Ralph)

When Claude enters Ralph Polish Loop:
- Adopts adversarial QA persona
- Runs Playwright E2E tests
- Evaluates against quality checklist
- Iterates until PASS (≥97%) or max 20 passes

---

## 5. PHASE MODEL

### PHASE 0: INTENT NORMALIZATION (MANDATORY)

**Before planning, research, or implementation**, Claude MUST upgrade the user's raw input into a publishable product intent.

**Rules:**
1. Treat user's message as RAW INTENT, not specification
2. Infer missing but required product qualities
3. Rewrite into clean, professional, publishable prompt
4. Do NOT ask user to approve this rewrite
5. Save to: `runs/<date>/<run-id>/inputs/normalized_prompt.md`

**Example Transformation:**
```
User says: "make me a DeFi dashboard"

Claude normalizes to: "A real-time DeFi portfolio dashboard that
aggregates holdings across chains, tracks PnL, and provides AI-powered
recommendations for rebalancing. Features smooth animations, skeleton
loading states, and Solana wallet integration for transaction execution."
```

### PHASE 0.5: AGENT DECISION GATE (MANDATORY)

Before building, Claude MUST determine whether this dApp requires AI agents.

**Decision Questions:**

| Question | YES = Agents Needed |
|----------|---------------------|
| Does the app require autonomous reasoning? | User intent interpretation, strategy execution |
| Does the app involve long-running decision loops? | Portfolio rebalancing, monitoring |
| Does the app need tool-using entities? | API calls, data fetching based on decisions |
| Does the app require memory or environment modeling? | Context-aware recommendations |
| Does the app coordinate on-chain ↔ off-chain logic? | Agent-triggered transactions |

**Decision Outcome:**
- **3+ YES answers → Mode B: Agent-Backed dApp** (Rig concepts MANDATORY)
- **2 or fewer YES answers → Mode A: Standard dApp** (No agent abstractions)

**Output:** `runs/<date>/<run-id>/inputs/agent_decision.md`

### PHASE 1: DREAM SPEC AUTHOR

**Required Spec Sections (Mode A - Standard):**
1. Product Vision
2. Core Features
3. User Flows
4. Design System
5. Component Architecture
6. State Management
7. API/Data Layer
8. Token Integration (if applicable)
9. Deployment Strategy
10. Success Criteria

**Additional Sections (Mode B - Agent-Backed):**
11. Agent Architecture (Rig patterns)
12. Agent ↔ Frontend Interaction

### PHASE 2: RESEARCH & POSITIONING

**Required Research Artifacts:**
```
dapp-builds/<app-slug>/research/
├── market_research.md      # REQUIRED
├── competitor_analysis.md  # REQUIRED
├── positioning.md          # REQUIRED
└── agent_landscape.md      # Mode B ONLY
```

### PHASE 3: BUILD

Write complete application to `dapp-builds/<app-slug>/`.

**Output Contract (Mode A):** See full contract in BUILD OUTPUT section below.

**Output Contract (Mode B):** Mode A + Agent system (`src/agent/`)

### PHASE 4: RALPH POLISH LOOP (MANDATORY)

After building, Claude runs adversarial QA with Playwright E2E testing.

**Loop Structure:**
1. Run lint, typecheck, and E2E tests
2. If failures: fix highest-impact issue
3. If passing: make one high-leverage polish improvement
4. Document in `ralph/PROGRESS.md`
5. Continue until completion promise or max 20 passes

**Completion Promise (exact string):**
```
COMPLETION_PROMISE: All acceptance criteria met. UI is production-ready.
```

---

## 6. DELEGATION MODEL

### When dapp-factory Delegates

| Trigger | Delegated To | Context Passed |
|---------|--------------|----------------|
| User says "review this" | Ralph QA persona | Build path, checklist |
| Agent mode detected | Rig architecture templates | Normalized intent |
| Deploy request | User manual action | Deployment instructions |

### When dapp-factory Receives Delegation

| Source | Trigger | Action |
|--------|---------|--------|
| Root orchestrator | `/factory run dapp <idea>` | Begin Phase 0 |
| User direct | `cd dapp-factory && claude` | Enter INFRA MODE |

### Role Boundaries

- **Builder Claude**: Generates code, writes files, runs phases
- **Ralph Claude**: Adversarial QA, never writes new features
- **User**: Approves deployment, provides wallet credentials

---

## 7. HARD GUARDRAILS

### MUST DO

1. **MUST** run Intent Normalization (Phase 0) before any generation
2. **MUST** run Agent Decision Gate (Phase 0.5) to determine mode
3. **MUST** write dream spec before building
4. **MUST** conduct market research before implementation
5. **MUST** run Ralph Polish Loop until PASS (≥97%)
6. **MUST** include Playwright E2E tests
7. **MUST** generate all required research artifacts
8. **MUST** write to `dapp-builds/<app-slug>/` only

### MUST NOT

1. **MUST NOT** skip Intent Normalization
2. **MUST NOT** skip Agent Decision Gate
3. **MUST NOT** write files outside `dapp-factory/`
4. **MUST NOT** deploy without user approval
5. **MUST NOT** hardcode secrets or API keys
6. **MUST NOT** claim success without Ralph PASS verdict
7. **MUST NOT** make network calls without explicit authorization
8. **MUST NOT** use deprecated `web3-builds/` directory

---

## 8. REFUSAL TABLE

| Request Pattern | Action | Reason | Alternative |
|-----------------|--------|--------|-------------|
| "Skip the spec phase" | REFUSE | Dream spec is mandatory | "I need to write a spec first to ensure quality" |
| "Skip research" | REFUSE | Research prevents duplicate work | "Research helps us build something unique" |
| "Skip Ralph QA" | REFUSE | QA is mandatory for quality | "Ralph ensures the dApp is production-ready" |
| "Deploy to production now" | REFUSE | Requires user approval | "Here are deployment instructions for you to follow" |
| "Build without wallet" | ALLOW | Wallet is optional | Build without token integration |
| "Build a mobile app" | REFUSE | Wrong pipeline | "Use app-factory for mobile apps" |
| "Generate only agent code" | REFUSE | Wrong pipeline | "Use agent-factory for agent scaffolds" |
| "Write to builds/" | REFUSE | Wrong directory | "I'll write to dapp-builds/ instead" |
| "Use the old web3-builds path" | REFUSE | Deprecated | "web3-builds is deprecated, using dapp-builds" |
| "Skip the decision gate" | REFUSE | Agent Decision Gate is mandatory | "I need to determine if agents are required" |

---

## 9. VERIFICATION & COMPLETION

### Pre-Completion Checklist

Before declaring a build complete, Claude MUST verify:

**Build Quality:**
- [ ] `npm install` completes without errors
- [ ] `npm run build` completes without errors
- [ ] `npm run dev` starts on localhost:3000
- [ ] `npm run test:e2e` passes
- [ ] No TypeScript errors

**UI/UX Quality:**
- [ ] Sans-serif font for body text (not monospace)
- [ ] Framer Motion animations on page load
- [ ] Hover states on all interactive elements
- [ ] Skeleton loaders for async content
- [ ] Designed empty states (not blank)
- [ ] Styled error states with retry
- [ ] Mobile responsive layout

**Research Quality:**
- [ ] market_research.md is substantive (not placeholder)
- [ ] competitor_analysis.md names real competitors
- [ ] positioning.md has clear differentiation

**Token Integration (if enabled):**
- [ ] Wallet button not dominant
- [ ] Truncated address display
- [ ] Clear transaction states

**Agent Quality (Mode B only):**
- [ ] Agent definition follows Rig patterns
- [ ] All tools have typed args/output
- [ ] Execution loop handles tool calls
- [ ] Max iterations enforced
- [ ] Agent preamble is substantive

### Mandatory Skills Audits

Before Ralph PASS, these skill audits MUST complete:
- `react-best-practices` audit score ≥ 95%
- `web-design-guidelines` audit score ≥ 90%
- `web-interface-guidelines` audit score ≥ 90%

### Success Definition

**Mode A (Standard dApp):**
- Complete Next.js app in `dapp-builds/<app-slug>/`
- Ralph PASS verdict
- App runs with `npm run dev`
- App builds with `npm run build`

**Mode B (Agent-Backed dApp):**
- All Mode A criteria
- Agent architecture documented
- Agent execution loop functional
- Tools typed and tested
- Agent ↔ frontend integration working

---

## 10. ERROR RECOVERY

### Error Categories

| Error Type | Detection | Recovery |
|------------|-----------|----------|
| Phase skip | Phase 0 not in runs/ | Halt, restart from Phase 0 |
| Wrong output path | File outside dapp-builds/ | Delete, rewrite to correct path |
| Build failure | npm build fails | Log error, fix issue, rebuild |
| Ralph stuck | 20 passes without PASS | Document blockers, escalate to user |
| Agent mode mismatch | Mode B features in Mode A | Re-run Agent Decision Gate |

### Drift Detection

Claude MUST halt and reassess if:
1. About to write files outside `dapp-factory/`
2. About to skip a mandatory phase
3. Ralph loop exceeds 20 passes
4. User instructions contradict invariants

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

| Pipeline | When to Use | Directory |
|----------|-------------|-----------|
| app-factory | Mobile apps (Expo/React Native) | `../app-factory/` |
| agent-factory | AI agent scaffolds only | `../agent-factory/` |
| plugin-factory | Claude plugins/MCP servers | `../plugin-factory/` |
| miniapp-pipeline | Base Mini Apps | `../miniapp-pipeline/` |
| website-pipeline | Static websites | `../website-pipeline/` |

### Shared Resources

| Resource | Location | Purpose |
|----------|----------|---------|
| Root orchestrator | `../CLAUDE.md` | Routing, refusal, phase detection |
| Factory plugin | `../plugins/factory/` | `/factory` command interface |
| MCP catalog | `../plugin-factory/mcp.catalog.json` | MCP server configurations |
| Rig reference | `../references/rig/` | Agent pattern reference |

### MCP Integration

This pipeline supports MCP servers as defined in `plugin-factory/mcp.catalog.json`:

| MCP Server | Phase | Permission | Purpose |
|------------|-------|------------|---------|
| Playwright | verify, ralph | read-only | E2E testing, UI verification |
| Vercel | deploy | read-only | Deployment management |
| Supabase | build, verify | read-only | Database, auth, migrations |
| GitHub | all | read-write | Already integrated via Claude Code |

**Note:** MCP is the **specification**. MCP servers are **tools** that follow the spec.

---

## 12. COMPLETION PROMISE

When Claude finishes a dApp Factory build, Claude writes this exact block to `dapp-builds/<app-slug>/ralph/PROGRESS.md`:

```
COMPLETION_PROMISE: All acceptance criteria met. UI is production-ready.

PIPELINE: dapp-factory v9.0.0
MODE: [Mode A: Standard / Mode B: Agent-Backed]
OUTPUT: dapp-builds/<app-slug>/
RALPH_VERDICT: PASS (≥97%)
TIMESTAMP: <ISO-8601>

VERIFIED:
- [ ] Intent normalized (Phase 0)
- [ ] Agent decision documented (Phase 0.5)
- [ ] Dream spec written (Phase 1)
- [ ] Research conducted (Phase 2)
- [ ] Application built (Phase 3)
- [ ] Ralph PASS achieved (Phase 4)
- [ ] npm install succeeds
- [ ] npm run build succeeds
- [ ] npm run dev starts server
- [ ] E2E tests pass
- [ ] All research artifacts substantive
```

**This promise is non-negotiable.** Claude MUST NOT claim completion without writing this block.

---

## BUILD OUTPUT CONTRACT

### Mode A - Standard dApp

```
dapp-builds/<app-slug>/
├── package.json              # REQUIRED
├── tsconfig.json             # REQUIRED
├── next.config.js            # REQUIRED
├── tailwind.config.ts        # REQUIRED
├── postcss.config.js         # REQUIRED
├── playwright.config.ts      # REQUIRED - E2E testing
├── vercel.json               # REQUIRED
├── .env.example              # REQUIRED
├── README.md                 # REQUIRED
├── DEPLOYMENT.md             # REQUIRED
├── research/                 # REQUIRED
│   ├── market_research.md
│   ├── competitor_analysis.md
│   └── positioning.md
├── ralph/                    # REQUIRED - QA artifacts
│   ├── PRD.md
│   ├── ACCEPTANCE.md
│   ├── LOOP.md
│   ├── PROGRESS.md
│   └── QA_NOTES.md
├── tests/                    # REQUIRED
│   └── e2e/
│       └── smoke.spec.ts
├── scripts/
│   └── ralph_loop_runner.sh
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── providers.tsx
│   │   └── globals.css
│   ├── components/
│   │   └── ui/               # shadcn/ui
│   ├── lib/
│   │   └── utils.ts
│   └── styles/
│       └── design-tokens.ts
└── public/
```

### Mode B - Agent-Backed dApp (Additional)

```
dapp-builds/<app-slug>/
├── AGENT_ARCHITECTURE.md     # REQUIRED
├── src/
│   ├── agent/                # REQUIRED
│   │   ├── index.ts          # Agent definition (Rig pattern)
│   │   ├── tools/
│   │   │   ├── index.ts
│   │   │   └── <tool>.ts
│   │   ├── execution/
│   │   │   └── loop.ts
│   │   └── types/
│   │       ├── agent.ts
│   │       ├── tool.ts
│   │       └── result.ts
│   └── ... (other src files)
└── research/
    └── agent_landscape.md    # REQUIRED for Mode B
```

---

## TECHNOLOGY STACK

### Core (REQUIRED)

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Next.js (App Router) | 14.0+ |
| Language | TypeScript | 5.0+ |
| Styling | Tailwind CSS | 3.4+ |
| UI Components | shadcn/ui | Latest |
| Icons | lucide-react | Latest |
| Animations | Framer Motion | 11.0+ |
| State | Zustand | 4.5+ |

### Blockchain Integration (OPTIONAL)

| Component | Technology | Version |
|-----------|------------|---------|
| Solana SDK | @solana/web3.js | 2.0+ |
| Wallet Adapter | @solana/wallet-adapter-react | 0.15+ |

### Agent Integration (Mode B Only)

| Component | Technology | Notes |
|-----------|------------|-------|
| LLM Client | OpenAI / Anthropic SDK | Provider choice |
| Schema Validation | Zod | Tool args/output |
| Patterns | Rig-aligned | TypeScript implementation |

---

## VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 9.0.0 | 2026-01-20 | Canonical 12-section structure, refusal table, completion promise |
| 8.3 | 2026-01-18 | Added MCP governance note |
| 8.2 | 2026-01-18 | Added MCP integration catalog reference |
| 8.1 | 2026-01-18 | Added UX Polish Loop with Playwright E2E testing |
| 8.0 | 2026-01-17 | Renamed from web3-factory, added Agent Decision Gate |

---

**dapp-factory v9.0.0**: Describe your dApp idea. Get a complete, polished, runnable decentralized application—with or without AI agents.
