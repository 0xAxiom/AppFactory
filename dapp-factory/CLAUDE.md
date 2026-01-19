# dApp Factory (dapp-factory)

**Version**: 8.3
**Mode**: Full Build Factory with Agent Decision Gate
**Status**: MANDATORY CONSTITUTION

---

## Purpose

dApp Factory generates **complete, production-ready decentralized applications** from plain-language descriptions. When a user describes a dApp idea, Claude builds a full Next.js project with all code, configuration, research, and documentation.

**Key Distinction (v8.0)**: dApp Factory now includes an **Agent Decision Gate** that determines whether the application requires AI agent integration via the Rig framework.

---

## AGENT DECISION GATE (MANDATORY)

Before building, Claude MUST determine whether this dApp requires AI agents.

### Decision Questions

Ask or infer from the spec:

| Question | YES = Agents Needed |
|----------|---------------------|
| Does the app require autonomous reasoning? | User intent interpretation, strategy execution |
| Does the app involve long-running decision loops? | Portfolio rebalancing, monitoring |
| Does the app need tool-using entities? | API calls, data fetching based on decisions |
| Does the app require memory or environment modeling? | Context-aware recommendations |
| Does the app coordinate on-chain ↔ off-chain logic? | Agent-triggered transactions |

### Decision Outcome

**If 3+ YES answers → Mode B: Agent-Backed dApp**
- Rig concepts are MANDATORY in architecture
- Agent design is documented in spec
- Agent execution loop is generated
- Tools are formally defined

**If 2 or fewer YES answers → Mode A: Standard dApp**
- No agent abstractions
- Traditional frontend + backend architecture
- Rust utilities from Rig MAY still be used (non-agent)

### Decision Saves To

```
runs/YYYY-MM-DD/build-<timestamp>/
└── inputs/
    └── agent_decision.md   # Documents the decision and reasoning
```

---

## Pipeline Modes

### Mode A: Standard dApp

```
PHASE 0: Intent Normalization  → Upgrade vague input to publishable spec
PHASE 1: Dream Spec Author     → 10-section spec (no agent sections)
PHASE 2: Research & Position   → Market research, competitor analysis
PHASE 3: Build                 → Complete Next.js application
PHASE 4: Ralph Polish Loop     → Adversarial QA until PASS (≥97%)
```

### Mode B: Agent-Backed dApp

```
PHASE 0: Intent Normalization  → Upgrade vague input to publishable spec
PHASE 0.5: Agent Decision Gate → MUST result in agents (validated)
PHASE 1: Dream Spec Author     → 12-section spec WITH agent architecture
PHASE 2: Research & Position   → Market research + agent landscape
PHASE 3: Build                 → Next.js app + Agent system (Rig patterns)
PHASE 4: Ralph Polish Loop     → QA includes agent quality checks
```

---

## The Pipeline (Combined)

```
PHASE 0: Intent Normalization  → Upgrade vague input to publishable spec
PHASE 0.5: Agent Decision Gate → Determine Mode A or Mode B
PHASE 1: Dream Spec Author     → Comprehensive spec with all requirements
PHASE 2: Research & Position   → Market research, competitor analysis
PHASE 3: Build                 → Complete Next.js application (+ agents if Mode B)
PHASE 4: Ralph Polish Loop     → Adversarial QA until PASS (≥97%)
```

---

## PHASE 0: INTENT NORMALIZATION (MANDATORY)

**Before planning, research, or implementation**, Claude MUST upgrade the user's raw input into a publishable product intent.

### Rules for Intent Normalization

1. Treat the user's message as RAW INTENT, not a specification
2. Infer missing but required product qualities
3. Rewrite into clean, professional, **publishable prompt**
4. Do NOT ask user to approve this rewrite
5. Save to: `runs/<date>/<run-id>/inputs/normalized_prompt.md`

### Example

**User says:**
> "make me a DeFi dashboard that helps me manage my portfolio"

**Claude normalizes to:**
> "A real-time DeFi portfolio dashboard that aggregates holdings across chains, tracks PnL, and provides AI-powered recommendations for rebalancing. Features smooth animations, skeleton loading states, and Solana wallet integration for transaction execution."

### Normalization Saves To

```
runs/YYYY-MM-DD/build-<timestamp>/
└── inputs/
    ├── raw_input.md           # User's exact words
    └── normalized_prompt.md   # Claude's upgraded version
```

---

## PHASE 0.5: AGENT DECISION GATE

### Required Decision Document

Claude MUST write `agent_decision.md` containing:

```markdown
# Agent Decision Report

## Application Summary
[One paragraph describing the dApp]

## Agent Requirement Analysis

| Criterion | Present? | Evidence |
|-----------|----------|----------|
| Autonomous reasoning | YES/NO | [specific feature] |
| Long-running decision loops | YES/NO | [specific feature] |
| Tool-using entities | YES/NO | [specific feature] |
| Memory/environment modeling | YES/NO | [specific feature] |
| On-chain ↔ off-chain coordination | YES/NO | [specific feature] |

## Decision: MODE A / MODE B

## Justification
[2-3 sentences explaining the decision]
```

---

## PHASE 1: DREAM SPEC AUTHOR

### Required Spec Sections (Mode A - Standard)

1. **Product Vision** - One-paragraph description
2. **Core Features** - Bulleted list of must-have functionality
3. **User Flows** - Primary user journeys
4. **Design System** - Colors, typography, spacing tokens
5. **Component Architecture** - Key components and their responsibilities
6. **State Management** - What state exists and where it lives
7. **API/Data Layer** - Data sources, API routes if any
8. **Token Integration** - Yes/No and what it enables (if yes)
9. **Deployment Strategy** - Vercel configuration
10. **Success Criteria** - What "done" looks like

### Additional Spec Sections (Mode B - Agent-Backed)

11. **Agent Architecture** - Agent definitions following Rig patterns
    - Agent name and description
    - Preamble (system prompt)
    - Tools (with typed definitions)
    - Static context
    - Dynamic context (if RAG needed)

12. **Agent ↔ Frontend Interaction** - How agents integrate
    - Which user actions trigger agent reasoning
    - How agent responses render in UI
    - Transaction signing flow (if applicable)

### Spec Saves To

```
runs/YYYY-MM-DD/build-<timestamp>/
└── inputs/
    └── dream_spec.md
```

---

## PHASE 2: RESEARCH & POSITIONING

Before building, Claude researches the market.

### Required Research Artifacts

```
dapp-builds/<app-slug>/
└── research/
    ├── market_research.md      # REQUIRED - Market size, trends, opportunity
    ├── competitor_analysis.md  # REQUIRED - 3-5 competitors, gaps
    └── positioning.md          # REQUIRED - Unique value proposition
```

### Additional Research (Mode B Only)

```
dapp-builds/<app-slug>/
└── research/
    └── agent_landscape.md      # REQUIRED for Mode B - Existing agent solutions
```

---

## PHASE 3: BUILD

Write complete application to `dapp-builds/<app-slug>/`.

### Output Contract (Mode A - Standard)

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
├── ralph/                    # REQUIRED - UX Polish Loop
│   ├── PRD.md
│   ├── ACCEPTANCE.md
│   ├── LOOP.md
│   ├── PROGRESS.md
│   └── QA_NOTES.md
├── tests/                    # REQUIRED - E2E tests
│   └── e2e/
│       └── smoke.spec.ts
├── scripts/                  # REQUIRED
│   └── ralph_loop_runner.sh
├── src/
│   ├── app/
│   │   ├── layout.tsx        # REQUIRED
│   │   ├── page.tsx          # REQUIRED
│   │   ├── providers.tsx     # REQUIRED
│   │   └── globals.css       # REQUIRED
│   ├── components/
│   │   └── ui/               # REQUIRED - shadcn/ui
│   ├── lib/
│   │   └── utils.ts          # REQUIRED
│   └── styles/
│       └── design-tokens.ts  # REQUIRED
└── public/
```

### Additional Output (Mode B - Agent-Backed)

```
dapp-builds/<app-slug>/
├── ... (all Mode A files)
├── AGENT_ARCHITECTURE.md     # REQUIRED - Rig-aligned agent design
├── src/
│   ├── agent/                # REQUIRED - Agent implementation
│   │   ├── index.ts          # Agent definition (Rig pattern)
│   │   ├── tools/            # Tool implementations
│   │   │   ├── index.ts
│   │   │   └── <tool>.ts
│   │   ├── execution/        # Execution loop
│   │   │   └── loop.ts
│   │   └── types/            # Type definitions
│   │       ├── agent.ts
│   │       ├── tool.ts
│   │       └── result.ts
│   └── ... (other src files)
```

---

## AGENT IMPLEMENTATION (Mode B Only)

### Agent Definition Pattern (Rig-Aligned)

```typescript
// src/agent/index.ts
/**
 * Agent definition following Rig patterns.
 * @see https://github.com/0xPlaygrounds/rig
 */

import { AgentDefinition } from './types/agent';
import { PortfolioAnalysisTool } from './tools/portfolio-analysis';
import { SwapRecommendationTool } from './tools/swap-recommendation';

export const defiAssistantAgent: AgentDefinition = {
  name: 'defi-assistant',
  description: 'AI-powered DeFi portfolio assistant',
  preamble: `You are a DeFi portfolio assistant. You help users:
- Analyze their holdings across protocols
- Identify optimization opportunities
- Execute rebalancing strategies

Always explain your reasoning. Never execute transactions without explicit confirmation.`,
  tools: [
    new PortfolioAnalysisTool(),
    new SwapRecommendationTool(),
  ],
  temperature: 0.7,
  maxTokens: 2000,
  maxIterations: 10,
};
```

### Tool Implementation Pattern (Rig-Aligned)

```typescript
// src/agent/tools/portfolio-analysis.ts
import { Tool, ToolDefinition } from '../types/tool';
import { z } from 'zod';

const ArgsSchema = z.object({
  walletAddress: z.string(),
  chains: z.array(z.string()).optional().default(['solana']),
});

type Args = z.infer<typeof ArgsSchema>;

/**
 * Tool for analyzing portfolio holdings.
 * Follows Rig's Tool trait pattern.
 * @see references/rig/rig/rig-core/src/tool/mod.rs
 */
export class PortfolioAnalysisTool implements Tool<Args, PortfolioAnalysis> {
  readonly name = 'analyze_portfolio';

  definition(): ToolDefinition {
    return {
      name: this.name,
      description: 'Analyze holdings across DeFi protocols for a wallet',
      parameters: {
        type: 'object',
        properties: {
          walletAddress: { type: 'string', description: 'Wallet address' },
          chains: { type: 'array', items: { type: 'string' } },
        },
        required: ['walletAddress'],
      },
    };
  }

  async call(args: Args): Promise<PortfolioAnalysis> {
    const validated = ArgsSchema.parse(args);
    // Implementation: fetch from indexers, analyze
    return { /* analysis */ };
  }
}
```

### Execution Loop Pattern (Rig-Aligned)

```typescript
// src/agent/execution/loop.ts
import { AgentDefinition, AgentResponse } from '../types/agent';
import { logger } from '@/lib/logger';

/**
 * Agent execution loop following Rig's PromptRequest pattern.
 * @see references/rig/rig/rig-core/src/agent/prompt_request/mod.rs
 */
export class AgentExecutionLoop {
  constructor(
    private agent: AgentDefinition,
    private llm: LLMClient
  ) {}

  async run(prompt: string): Promise<AgentResponse> {
    return this.runWithTools(prompt, this.agent.maxIterations ?? 10);
  }

  async runWithTools(prompt: string, maxIterations: number): Promise<AgentResponse> {
    let iteration = 0;
    let messages = [{ role: 'user' as const, content: prompt }];

    while (iteration < maxIterations) {
      const response = await this.llm.complete({
        model: this.agent.model ?? 'gpt-4',
        messages,
        systemPrompt: this.agent.preamble,
        tools: this.agent.tools.map(t => t.definition()),
        temperature: this.agent.temperature,
        maxTokens: this.agent.maxTokens,
      });

      if (!response.toolCalls || response.toolCalls.length === 0) {
        return {
          content: response.content,
          iterations: iteration + 1,
          toolsUsed: [],
        };
      }

      // Execute tool calls
      const toolResults: string[] = [];
      for (const call of response.toolCalls) {
        const tool = this.agent.tools.find(t => t.name === call.name);
        if (!tool) throw new Error(`Unknown tool: ${call.name}`);

        logger.info('Executing tool', { tool: call.name, iteration });
        const result = await tool.call(call.arguments);
        toolResults.push(JSON.stringify(result));
        messages.push({ role: 'tool' as const, content: JSON.stringify(result) });
      }

      iteration++;
    }

    throw new Error(`Max iterations (${maxIterations}) exceeded`);
  }
}
```

---

## PHASE 4: RALPH POLISH LOOP (MANDATORY)

After building, Claude runs adversarial QA as "Ralph Wiggum" with **Playwright E2E testing**.

### Ralph Loop Structure

Every generated dApp includes:

```
dapp-builds/<app-slug>/
├── ralph/
│   ├── PRD.md              # Product requirements
│   ├── ACCEPTANCE.md       # Acceptance criteria + completion promise
│   ├── LOOP.md             # Loop execution instructions
│   ├── PROGRESS.md         # Pass-by-pass progress log
│   └── QA_NOTES.md         # Manual QA observations
├── tests/
│   └── e2e/
│       ├── smoke.spec.ts   # Core smoke tests
│       └── wallet.spec.ts  # Wallet integration tests (if applicable)
├── playwright.config.ts    # Playwright configuration
└── scripts/
    └── ralph_loop_runner.sh  # Human-in-the-loop runner
```

### Running the Polish Loop

```bash
cd dapp-builds/<app-slug>
npm install
npm run polish:ux    # Runs ralph_loop_runner.sh
```

Or manually:

```bash
npm run lint
npm run typecheck
npm run test:e2e     # Runs Playwright tests
```

### The 20-Pass System

Each pass:
1. Runs lint, typecheck, and E2E tests
2. If failures: fix highest-impact issue
3. If passing: make one high-leverage polish improvement
4. Documents in `ralph/PROGRESS.md`
5. Continues until completion promise or max 20 passes

### The Completion Promise

The loop completes ONLY when this exact string is written to `ralph/PROGRESS.md`:

```
COMPLETION_PROMISE: All acceptance criteria met. UI is production-ready.
```

### Package.json Scripts

Generated dApps include:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test:e2e": "playwright test",
    "polish:ux": "./scripts/ralph_loop_runner.sh"
  }
}
```

### Ralph's Checklist (Mode A - Standard)

#### Build Quality
- [ ] `npm install` completes without errors
- [ ] `npm run build` completes without errors
- [ ] `npm run dev` starts on localhost:3000
- [ ] `npm run test:e2e` passes
- [ ] No TypeScript errors

#### UI/UX Quality
- [ ] Sans-serif font for body text (not monospace)
- [ ] Framer Motion animations on page load
- [ ] Hover states on all interactive elements
- [ ] Skeleton loaders for async content
- [ ] Designed empty states (not blank)
- [ ] Styled error states with retry
- [ ] Mobile responsive layout

#### Research Quality
- [ ] market_research.md is substantive (not placeholder)
- [ ] competitor_analysis.md names real competitors
- [ ] positioning.md has clear differentiation

#### Token Integration (if enabled)
- [ ] Wallet button not dominant
- [ ] Truncated address display
- [ ] Clear transaction states

### Additional Checks (Mode B - Agent-Backed)

#### Agent Architecture Quality
- [ ] Agent definition follows Rig patterns
- [ ] All tools have typed args/output
- [ ] Execution loop handles tool calls
- [ ] Max iterations enforced
- [ ] Agent preamble is substantive

#### Agent ↔ Frontend Integration
- [ ] Agent responses render cleanly in UI
- [ ] Loading states during agent reasoning
- [ ] Error handling for agent failures
- [ ] Tool execution visible to user (when appropriate)

#### Agent Safety
- [ ] No arbitrary code execution
- [ ] Transaction confirmation required
- [ ] Rate limiting on agent calls

---

## Technology Stack

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

## Rig Reference

This pipeline uses concepts from the Rig framework by 0xPlaygrounds.

**Rig Repository**: `references/rig/` (cloned in this repo)

| Concept | Rig Source | TypeScript Equivalent |
|---------|------------|----------------------|
| Agent | `rig/rig-core/src/agent/completion.rs` | `AgentDefinition` interface |
| Tool | `rig/rig-core/src/tool/mod.rs` | `Tool<Args, Output>` interface |
| Execution | `rig/rig-core/src/agent/prompt_request/` | `AgentExecutionLoop` class |
| Pipeline | `rig/rig-core/src/pipeline/mod.rs` | Async function composition |

---

## Directory Structure

```
dapp-factory/
├── CLAUDE.md                 # This constitution
├── README.md                 # User documentation
├── validator/
│   └── index.ts              # Build validator
├── templates/
│   └── system/
│       ├── dream_spec_author.md
│       ├── ralph_polish_loop.md
│       └── agent_architecture.md  # NEW in v8.0
├── skills/
│   ├── react-best-practices/
│   ├── web-design-guidelines/
│   └── web-interface-guidelines/
├── dapp-builds/              # Built apps (output directory)
├── runs/                     # Execution logs
└── generated/                # Internal artifacts
```

### Directory Boundaries

| Directory | Purpose | Who Writes |
|-----------|---------|------------|
| `dapp-builds/<app-slug>/` | **Final output** - runnable dApp | Claude |
| `runs/` | Execution logs and artifacts | Claude |
| `generated/` | Internal/intermediate artifacts | Internal only |

### FORBIDDEN Directories

- `builds/` - belongs to app-factory
- `outputs/` - belongs to agent-factory
- `web3-builds/` - deprecated (use dapp-builds)
- Any path outside `dapp-factory/`

---

## Quickstart

```bash
cd dapp-factory
claude
# Describe: "A DeFi dashboard that helps me manage my portfolio with AI recommendations"
# Claude determines: Mode B (Agent-Backed) due to AI recommendations
# Answer: "Do you want Solana wallet integration?" → yes
# Claude builds complete app in dapp-builds/<app-slug>/
# When done:
cd dapp-builds/<app-slug>
npm install
npm run dev
# Open http://localhost:3000
```

---

## Success Definition

### Mode A (Standard dApp)
- Complete Next.js app in `dapp-builds/<app-slug>/`
- Ralph PASS verdict
- App runs with `npm run dev`
- App builds with `npm run build`

### Mode B (Agent-Backed dApp)
- All Mode A criteria
- Agent architecture documented
- Agent execution loop functional
- Tools typed and tested
- Agent ↔ frontend integration working

---

## MCP INTEGRATION (OPTIONAL)

> **Note**: MCP (Model Context Protocol) is the **specification** that governs how AI systems communicate with tools. The entries below are **MCP servers** (implementations) that follow the MCP spec. For full governance details, see `plugin-factory/CLAUDE.md` under "MCP GOVERNANCE". For the specification itself: https://github.com/modelcontextprotocol

This pipeline supports the following MCP servers as defined in `plugin-factory/mcp.catalog.json`:

| MCP | Phase | Permission | Purpose |
|-----|-------|------------|---------|
| Playwright | verify, ralph | read-only | E2E testing, UI verification |
| Vercel | deploy | read-only | Deployment management, log analysis |
| Stripe | build | mutating (approval required) | Payment integration |
| Supabase | build, verify | read-only | Database, auth, migrations |
| Figma | research, build | read-only | Design token extraction |
| Cloudflare | deploy | read-only | Edge deployment, Workers |
| GitHub | all | read-write | Already integrated via Claude Code |

### MCP Usage Rules

1. **MCPs are opt-in** - Never required for basic pipeline execution
2. **Phase-gated** - MCPs only available in specified phases
3. **Approval for mutations** - Stripe, Cloudflare mutations require explicit approval
4. **Artifacts logged** - All MCP operations logged to `runs/<date>/<run-id>/mcp-logs/`
5. **No production by default** - Use dev/test environments only

### Enabling MCPs

MCPs are enabled via Claude Code:
```bash
claude mcp add --transport http vercel https://mcp.vercel.com
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

See `plugin-factory/mcp.catalog.json` for full configuration details.

---

## Version History

- **8.3** (2026-01-18): Added MCP governance note - MCP is spec, MCP servers are tools
- **8.2** (2026-01-18): Added MCP integration catalog reference
- **8.1** (2026-01-18): Added UX Polish Loop with Playwright E2E testing
- **8.0** (2026-01-17): Renamed from web3-factory to dapp-factory, added Agent Decision Gate, Rig integration for Mode B
- **7.1** (2026-01-15): Added web-interface-guidelines skill
- **7.0** (2026-01-14): Added Intent Normalization, Dream Spec Author, Ralph Polish Loop
- **6.1** (2026-01-13): Comprehensive UI/UX requirements
- **6.0** (2026-01-13): Restored full-build contract

---

**dapp-factory v8.2**: Describe your dApp idea. Get a complete, polished, runnable decentralized application—with or without AI agents.
