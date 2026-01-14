# web3-factory

**Web App Pipeline** | Part of [App Factory](../README.md)

Describe a web app idea. Get a complete, runnable Next.js application.

---

## Who Is This For?

- Developers building web applications
- Builders who want AI-assisted development
- Anyone launching web apps (with optional Solana integration)

**Not for you if:** You need a mobile app (use [the_factory](../the_factory/)) or an AI agent (use [agent-factory](../agent-factory/))

---

## Quickstart

```bash
cd web3-factory
claude
```

**You:** "I want to make a meme battle arena where people vote on memes"

**Claude:**
1. Normalizes your intent into a publishable product spec
2. Asks: "Do you want Solana wallet integration?" → answer yes or no
3. Writes comprehensive spec and market research
4. Builds complete Next.js app in `web3-builds/meme-battle-arena/`
5. Runs Ralph Polish Loop until quality passes

**When done:**
```bash
cd web3-builds/meme-battle-arena
npm install
npm run dev
# Open http://localhost:3000
```

---

## What Happens When You Describe an App

### Before (What you say)
> "I want to make a meme battle arena where people vote on memes"

### After (What Claude builds)

Claude transforms this into a complete product:

> "A real-time meme battle platform where users submit memes, vote on head-to-head matchups, and climb a global leaderboard. Features smooth Framer Motion animations, skeleton loading states, designed empty states, and a polished dark-mode UI. Optional Solana wallet integration enables token-gated premium battles."

Then Claude:
1. Writes a 10-section technical spec
2. Researches competitors and positioning
3. Builds complete Next.js application
4. Runs quality assurance until it passes

---

## The Pipeline

```
PHASE 0: Intent Normalization  → Upgrade vague input to publishable spec
PHASE 1: Dream Spec Author     → 10-section technical specification
PHASE 2: Research & Position   → Market research, competitors, positioning
PHASE 3: Build                 → Complete Next.js application
PHASE 4: Ralph Polish Loop     → QA until ≥97% quality (max 3 iterations)
```

---

## What Gets Built

### Standard App

```
web3-builds/meme-battle-arena/
├── package.json              # npm scripts: dev, build, start
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── vercel.json               # Deployment config
├── .env.example              # Environment template
├── README.md                 # Run instructions
├── DEPLOYMENT.md             # Vercel deployment guide
├── research/
│   ├── market_research.md    # Market size, trends
│   ├── competitor_analysis.md # Real competitors, gaps
│   └── positioning.md        # Unique value proposition
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── providers.tsx
│   │   └── globals.css
│   ├── components/
│   │   └── ui/               # shadcn/ui components
│   ├── lib/
│   │   └── utils.ts          # cn() helper
│   └── styles/
│       └── design-tokens.ts
└── public/
```

### Token-Enabled App

Same structure, plus:
- Solana wallet adapter dependencies
- `ConnectionProvider` and `WalletProvider` in providers.tsx
- Wallet connection UI and hooks
- Optional token gating or tip jar functionality

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI | shadcn/ui |
| Icons | lucide-react |
| Animations | Framer Motion |
| State | Zustand |

**Token-enabled apps also include:**

| Component | Technology |
|-----------|------------|
| Wallet | @solana/wallet-adapter-react |
| Blockchain | @solana/web3.js v2.x |

---

## Token Integration

Token integration is **completely optional**.

### When to Skip
- Building an MVP without blockchain features
- Standard web app without rewards/payments
- Testing ideas before adding complexity

### When to Enable
- App rewards users with tokens
- App accepts token payments/tips
- App gates features based on token holdings
- Building a dApp with on-chain state

---

## Quality Standards

Every app must pass Ralph's quality checklist:

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

### Research Quality
- Substantive market research (not placeholder)
- Real competitors named and analyzed
- Clear differentiation strategy

---

## Verification Commands

```bash
cd web3-builds/<app-slug>

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

Every app includes Vercel deployment config.

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

See `DEPLOYMENT.md` in each built app for detailed instructions.

---

## Directory Structure

```
web3-factory/
├── CLAUDE.md               # Constitution (how Claude operates)
├── README.md               # This file
├── validator/
│   └── index.ts            # Build validator
├── templates/
│   ├── system/
│   │   ├── dream_spec_author.md
│   │   ├── ralph_polish_loop.md
│   │   ├── design_spec_author.md
│   │   └── ui_polish_checklist.md
│   ├── marketing/
│   │   └── launch_strategy.template.md
│   └── app_template/
│       ├── vercel.template.json
│       └── DEPLOYMENT.template.md
├── web3-builds/            # Built apps (output)
├── runs/                   # Execution logs
└── generated/              # Internal artifacts
```

---

## Troubleshooting

### "npm install fails"

```bash
npm install --legacy-peer-deps
```

### "Build fails with TypeScript errors"

```bash
npm run build
# Fix errors shown in output
```

### "Validation fails: PROMPT PACK DETECTED"

The build only produced markdown files. Re-run Claude and ensure it builds a complete application.

### "Ralph fails 3 times"

Build is a hard failure. Check `runs/.../polish/ralph_final_verdict.md` for unresolved issues.

### "Wallet not connecting" (Token-enabled)

1. Check wallet extension is installed
2. Verify network matches (devnet vs mainnet)
3. Check browser console for errors

---

## PASS/FAIL Criteria

### PASS
- `npm install` completes
- `npm run build` completes
- `npm run dev` starts server
- All required files present
- Research is substantive
- Ralph gives PASS verdict

### FAIL
- Missing package.json or src/app/
- No dev or build scripts
- Output is only prompt files
- Build errors
- Ralph gives 3 FAIL verdicts
- Research is placeholder content

---

## Links

- **Root README:** [../README.md](../README.md)
- **Constitution:** [CLAUDE.md](./CLAUDE.md)
- **Mobile apps:** [the_factory](../the_factory/)
- **AI agents:** [agent-factory](../agent-factory/)

---

**web3-factory v7.0** - Describe your idea. Get a complete, polished, runnable web application.
