# dapp-factory

**Decentralized App Pipeline** | Part of [App Factory](../README.md)

Describe a dApp idea. Get a complete, runnable Next.js application—with or without AI agents.

---

## Who Is This For?

- Developers building decentralized web applications
- Builders who want AI-assisted development
- Anyone launching dApps (with optional Solana integration)
- Teams building AI-powered web applications

**Not for you if:** You need a mobile app (use [app-factory](../app-factory/)) or a standalone AI agent (use [agent-factory](../agent-factory/))

---

## What's New in v8.0

**Agent Decision Gate**: dapp-factory now determines whether your application needs AI agents:

- **Mode A (Standard dApp)**: Traditional frontend + backend architecture
- **Mode B (Agent-Backed dApp)**: AI agents with Rig-aligned architecture

This decision happens automatically based on your requirements.

---

## Quickstart

```bash
cd dapp-factory
claude
```

**You:** "I want to make a DeFi dashboard with AI-powered portfolio recommendations"

**Claude:**

1. Normalizes your intent into a publishable product spec
2. Determines: Mode B (Agent-Backed) due to AI recommendations
3. Asks: "Do you want Solana wallet integration?" → answer yes or no
4. Writes comprehensive spec including agent architecture
5. Builds complete Next.js app with agent system in `dapp-builds/defi-dashboard/`
6. Runs Ralph Polish Loop until quality passes

**When done:**

```bash
cd dapp-builds/defi-dashboard
npm install
npm run dev
# Open http://localhost:3000
```

---

## Agent Decision Gate

Before building, Claude evaluates your requirements to determine if AI agents are needed:

| Criterion                          | Mode A Example (NO)                   | Mode B Example (YES)                                           |
| ---------------------------------- | ------------------------------------- | -------------------------------------------------------------- |
| Autonomous reasoning?              | User clicks "Swap" button manually    | AI recommends which tokens to swap based on portfolio analysis |
| Long-running decision loops?       | Dashboard shows static portfolio view | AI continuously monitors and suggests rebalancing              |
| Tool-using entities?               | User triggers all API calls           | AI decides when to fetch price data or execute trades          |
| Memory/environment modeling?       | Each session starts fresh             | AI remembers user preferences and adapts recommendations       |
| On-chain ↔ off-chain coordination? | User signs all transactions           | AI prepares and queues transactions for user approval          |

**3+ YES → Mode B (Agent-Backed)** - Includes Rig-aligned agent architecture
**2 or fewer → Mode A (Standard)** - Traditional frontend without AI agents

### Quick Decision Examples

| User Request                                            | Mode | Why                                                  |
| ------------------------------------------------------- | ---- | ---------------------------------------------------- |
| "A DeFi dashboard to view my portfolio"                 | A    | Static display, user-triggered actions               |
| "A DeFi dashboard with AI portfolio recommendations"    | B    | Autonomous reasoning, continuous analysis            |
| "An NFT gallery with wallet connection"                 | A    | Display only, no AI decision-making                  |
| "An NFT trading bot that finds arbitrage opportunities" | B    | Autonomous reasoning, tool-using, long-running loops |
| "A token launchpad with Bags integration"               | A    | User-driven actions, no AI agents                    |
| "A trading assistant that learns my preferences"        | B    | Memory modeling, autonomous recommendations          |

---

## The Pipeline

### Mode A: Standard dApp

```
PHASE 0: Intent Normalization  → Upgrade vague input to publishable spec
PHASE 1: Dream Spec Author     → 10-section technical specification
PHASE 2: Research & Position   → Market research, competitors, positioning
PHASE 3: Build                 → Complete Next.js application
PHASE 4: Ralph Polish Loop     → QA until ≥97% quality
```

### Mode B: Agent-Backed dApp

```
PHASE 0: Intent Normalization  → Upgrade vague input to publishable spec
PHASE 0.5: Agent Decision Gate → Validates agent requirements
PHASE 1: Dream Spec Author     → 12-section spec WITH agent architecture
PHASE 2: Research & Position   → Market research + agent landscape
PHASE 3: Build                 → Next.js app + Agent system (Rig patterns)
PHASE 4: Ralph Polish Loop     → QA includes agent quality checks
```

---

## What Gets Built

### Standard dApp (Mode A)

```
dapp-builds/your-dapp/
├── package.json              # npm scripts: dev, build, start
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── vercel.json               # Deployment config
├── .env.example              # Environment template
├── README.md                 # Run instructions
├── DEPLOYMENT.md             # Vercel deployment guide
├── research/
│   ├── market_research.md
│   ├── competitor_analysis.md
│   └── positioning.md
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── styles/
└── public/
```

### Agent-Backed dApp (Mode B)

Same structure, plus:

```
dapp-builds/your-dapp/
├── AGENT_ARCHITECTURE.md     # Rig-aligned agent design
├── src/
│   ├── agent/                # Agent implementation
│   │   ├── index.ts          # Agent definition
│   │   ├── tools/            # Tool implementations
│   │   ├── execution/        # Execution loop
│   │   └── types/            # Type definitions
│   └── ...
```

---

## Rig Framework Integration (Mode B)

Agent-backed dApps follow the [Rig framework](https://github.com/0xPlaygrounds/rig) patterns:

| Concept          | Implementation                                  |
| ---------------- | ----------------------------------------------- |
| Agent Definition | `AgentDefinition` interface                     |
| Tools            | `Tool<Args, Output>` interface with Zod schemas |
| Execution Loop   | `AgentExecutionLoop` class                      |
| Preamble         | System prompt defining agent behavior           |

**Reference**: See [references/rig](../references/rig/) for the canonical Rig implementation.

---

## Technology Stack

| Component  | Technology              |
| ---------- | ----------------------- |
| Framework  | Next.js 14 (App Router) |
| Language   | TypeScript              |
| Styling    | Tailwind CSS            |
| UI         | shadcn/ui               |
| Icons      | lucide-react            |
| Animations | Framer Motion           |
| State      | Zustand                 |

**Token-enabled dApps also include:**

| Component  | Technology                   |
| ---------- | ---------------------------- |
| Wallet     | @solana/wallet-adapter-react |
| Blockchain | @solana/web3.js v2.x         |

**Agent-backed dApps also include:**

| Component         | Technology             |
| ----------------- | ---------------------- |
| LLM Client        | OpenAI / Anthropic SDK |
| Schema Validation | Zod                    |
| Architecture      | Rig-aligned patterns   |

---

## Quality Standards

Every dApp must pass Ralph's quality checklist:

### Build Quality

- `npm install` completes without errors
- `npm run build` completes without errors
- `npm run dev` starts on localhost:3000

### UI/UX Quality

- Sans-serif font for body text
- Framer Motion animations on page load
- Hover states on all interactive elements
- Skeleton loaders for async content
- Designed empty states (not blank)
- Styled error states with retry
- Mobile responsive layout

### Agent Quality (Mode B)

- Agent definition follows Rig patterns
- All tools have typed args/output
- Execution loop handles tool calls
- Agent responses render cleanly in UI
- Error handling for agent failures

---

## Verification Commands

```bash
cd dapp-builds/<app-slug>

# Install dependencies
npm install

# Type check
npx tsc --noEmit

# Build for production
npm run build

# Start development server
npm run dev

# Run validation
npx tsx ../../validator/index.ts
```

---

## Deployment

Every dApp includes Vercel deployment config.

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

See `DEPLOYMENT.md` in each built dApp for detailed instructions.

---

## Directory Structure

```
dapp-factory/
├── CLAUDE.md               # Constitution (how Claude operates)
├── README.md               # This file
├── validator/
│   └── index.ts            # Build validator
├── skills/                 # Code quality rules
│   ├── react-best-practices/
│   ├── web-design-guidelines/
│   └── web-interface-guidelines/
├── templates/
│   └── system/
│       ├── dream_spec_author.md
│       ├── ralph_polish_loop.md
│       └── agent_architecture.md  # NEW
├── dapp-builds/            # Built dApps (output)
├── runs/                   # Execution logs
└── generated/              # Internal artifacts
```

---

## Troubleshooting

### "npm install fails"

**IMPORTANT:** Do NOT use `--legacy-peer-deps`, `--force`, or `--ignore-engines` flags. These are forbidden by the Local Run Proof Gate and will cause verification failure.

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

3. **Fresh install:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### "Build fails with TypeScript errors"

```bash
npm run build
# Fix errors shown in output
```

### "Agent not responding" (Mode B)

1. Check LLM API key in environment
2. Verify agent preamble is set
3. Check browser console for errors
4. Review agent execution loop logs

### "Wallet not connecting" (Token-enabled)

1. Check wallet extension is installed
2. Verify network matches (devnet vs mainnet)
3. Check browser console for errors

### "Ralph fails 3 times"

Build is a hard failure. Check `runs/.../polish/ralph_final_verdict.md` for unresolved issues.

---

## Links

- **Root README:** [../README.md](../README.md)
- **Constitution:** [CLAUDE.md](./CLAUDE.md)
- **Mobile apps:** [app-factory](../app-factory/)
- **AI agents:** [agent-factory](../agent-factory/)
- **Rig framework:** [references/rig](../references/rig/)

---

**dapp-factory v9.1.0** - Describe your dApp idea. Get a complete, polished, runnable decentralized application.
