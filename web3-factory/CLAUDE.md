# Web3 Factory (web3-factory)

**Version**: 7.0
**Mode**: Full Build Factory with Auto-Polish
**Status**: MANDATORY CONSTITUTION

---

## Purpose

Web3 Factory generates **complete, production-ready web applications** from plain-language descriptions. When a user describes an app idea, Claude builds a full Next.js project with all code, configuration, research, and documentation. The output is a runnable application, not prompts or scaffolds.

---

## The Pipeline

```
PHASE 0: Intent Normalization  → Upgrade vague input to publishable spec
PHASE 1: Dream Spec Author     → Comprehensive spec with all requirements
PHASE 2: Research & Position   → Market research, competitor analysis
PHASE 3: Build                 → Complete Next.js application
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
> "make me a meme voting app"

**Claude normalizes to:**
> "A real-time meme battle platform where users submit memes, vote on head-to-head matchups, and climb a global leaderboard. Features smooth animations, skeleton loading states, and optional Solana wallet integration for token-gated premium features."

### What Intent Normalization Adds

| Missing Element | Claude Infers |
|-----------------|---------------|
| No visual style | "Modern, polished UI with Framer Motion animations" |
| No state management | "Zustand for client state, optimistic updates" |
| No loading behavior | "Skeleton loaders for async content" |
| No empty states | "Designed empty states with CTAs" |
| No error handling | "Graceful error states with retry actions" |
| No responsive mention | "Mobile-first responsive layout" |

### Normalization Saves To

```
runs/YYYY-MM-DD/build-<timestamp>/
└── inputs/
    ├── raw_input.md           # User's exact words
    └── normalized_prompt.md   # Claude's upgraded version
```

---

## PHASE 1: DREAM SPEC AUTHOR

After normalization, Claude writes a comprehensive specification.

### Required Spec Sections

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
web3-builds/<app-slug>/
└── research/
    ├── market_research.md      # REQUIRED - Market size, trends, opportunity
    ├── competitor_analysis.md  # REQUIRED - 3-5 competitors, gaps
    └── positioning.md          # REQUIRED - Unique value proposition
```

### Research Quality Bar

- **Substantive content** - Not placeholder or generic text
- **Specific insights** - Name actual competitors, cite trends
- **Actionable positioning** - Clear differentiation strategy

---

## PHASE 3: BUILD

Write complete application to `web3-builds/<app-slug>/`.

### Output Contract

Every successful build MUST produce:

```
web3-builds/<app-slug>/
├── package.json              # REQUIRED - with dev AND build scripts
├── tsconfig.json             # REQUIRED
├── next.config.js            # REQUIRED
├── tailwind.config.ts        # REQUIRED
├── postcss.config.js         # REQUIRED
├── vercel.json               # REQUIRED - deployment config
├── .env.example              # REQUIRED - environment template
├── README.md                 # REQUIRED - run instructions
├── DEPLOYMENT.md             # REQUIRED - Vercel deployment guide
├── research/                 # REQUIRED - market intelligence
│   ├── market_research.md
│   ├── competitor_analysis.md
│   └── positioning.md
├── src/
│   ├── app/
│   │   ├── layout.tsx        # REQUIRED
│   │   ├── page.tsx          # REQUIRED
│   │   ├── providers.tsx     # REQUIRED
│   │   └── globals.css       # REQUIRED
│   ├── components/
│   │   └── ui/               # REQUIRED - shadcn/ui components
│   ├── lib/
│   │   └── utils.ts          # REQUIRED - cn() helper
│   └── styles/
│       └── design-tokens.ts  # REQUIRED - design system tokens
└── public/                   # Static assets
```

### Required npm Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## PHASE 4: RALPH POLISH LOOP (MANDATORY)

After building, Claude runs adversarial QA as "Ralph Wiggum" - a skeptical reviewer who finds issues.

### How Ralph Works

1. **Ralph Reviews** - Checks all quality criteria
2. **Ralph Scores** - Calculates pass rate (passed/total × 100)
3. **Threshold** - Must reach ≥97% to PASS
4. **Iteration** - Builder fixes issues, Ralph re-reviews
5. **Max 3 Iterations** - 3 FAILs = hard failure

### Ralph's Checklist

#### Build Quality
- [ ] `npm install` completes without errors
- [ ] `npm run build` completes without errors
- [ ] `npm run dev` starts on localhost:3000
- [ ] No TypeScript errors

#### UI/UX Quality
- [ ] Sans-serif font for body text (not monospace)
- [ ] Framer Motion animations on page load
- [ ] Hover states on all interactive elements
- [ ] Skeleton loaders for async content
- [ ] Designed empty states (not blank)
- [ ] Styled error states with retry
- [ ] Mobile responsive layout
- [ ] Consistent color tokens

#### Research Quality
- [ ] market_research.md is substantive (not placeholder)
- [ ] competitor_analysis.md names real competitors
- [ ] positioning.md has clear differentiation

#### Token Integration (if enabled)
- [ ] Wallet button not dominant (right side, reasonable size)
- [ ] Truncated address display when connected
- [ ] Clear transaction states (signing, confirming, success, error)
- [ ] Connection errors handled gracefully

### Ralph Verdict Format

```markdown
# Ralph Polish Report - Iteration X

## Score: XX% (X/X passed)

## Blocking Issues
- [ ] Issue 1
- [ ] Issue 2

## Verdict: PASS | FAIL

## Notes
...
```

### Ralph Saves To

```
runs/YYYY-MM-DD/build-<timestamp>/
└── polish/
    ├── ralph_report_1.md
    ├── ralph_report_2.md
    ├── ralph_report_3.md
    └── ralph_final_verdict.md   # VERDICT: PASS or VERDICT: FAIL
```

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

### Solana Integration (OPTIONAL)

**IMPORTANT: Solana ecosystem has two SDK versions. Choose based on project needs.**

#### Option A: Modern Stack (@solana/web3.js v2.x) - RECOMMENDED

For new projects without Anchor:

```json
{
  "dependencies": {
    "@solana/web3.js": "^2.0.0",
    "@solana/wallet-adapter-react": "^0.15.39",
    "@solana/wallet-adapter-react-ui": "^0.9.35",
    "@solana/wallet-adapter-wallets": "^0.19.32"
  }
}
```

**v2.x Key Changes:**
- `KeyPairSigner` replaces `Keypair`
- `address` replaces `PublicKey`
- BigInt for amounts (`1n` not `1`)
- Factory pattern for configuration
- Zero dependencies, tree-shakeable
- 10x faster cryptographic operations

#### Option B: Legacy Stack (@solana/web3.js v1.x)

For projects using Anchor (Anchor doesn't support v2 yet):

```json
{
  "dependencies": {
    "@solana/web3.js": "^1.95.0",
    "@solana/wallet-adapter-react": "^0.15.39",
    "@solana/wallet-adapter-react-ui": "^0.9.35",
    "@solana/wallet-adapter-wallets": "^0.19.32",
    "@coral-xyz/anchor": "^0.30.0"
  }
}
```

### Wallet Provider Setup (Both Versions)

```tsx
// src/app/providers.tsx
'use client';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';

import '@solana/wallet-adapter-react-ui/styles.css';

export function SolanaProvider({ children }: { children: React.ReactNode }) {
  const endpoint = useMemo(() => clusterApiUrl('devnet'), []);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
```

**Note:** Wallets implementing Wallet Standard are auto-detected. Only legacy wallets need explicit adapters.

---

## UI/UX Quality Requirements (MANDATORY)

Apps MUST have professional, polished visual design. **Bare-minimum functional UIs are a build failure.**

### Required Visual Standards

#### 1. Typography (CRITICAL)

```css
/* CORRECT: Sans-serif for body text */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* CORRECT: Monospace ONLY for code/addresses */
.code, .address, .hash {
  font-family: 'JetBrains Mono', monospace;
}
```

**FAIL CONDITION**: Monospace font used for body text

#### 2. Animations (Framer Motion REQUIRED)

```tsx
// REQUIRED: Page entrance animations
import { motion } from 'framer-motion';

export function PageContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* content */}
    </motion.div>
  );
}

// REQUIRED: Interactive element hover states
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.15 }}
>
  Click me
</motion.button>
```

**FAIL CONDITION**: No animations, instant transitions, static UI

#### 3. Loading States (Skeleton REQUIRED)

```tsx
import { Skeleton } from "@/components/ui/skeleton";

function LoadingCard() {
  return (
    <Card>
      <Skeleton className="h-8 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </Card>
  );
}
```

**FAIL CONDITION**: Blank screens during loading, spinner-only loading

#### 4. Empty States (Designed REQUIRED)

```tsx
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="rounded-full bg-muted p-4 mb-4">
        <InboxIcon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No items yet</h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        Get started by creating your first item.
      </p>
      <Button>Create Item</Button>
    </div>
  );
}
```

**FAIL CONDITION**: Blank space for empty states

#### 5. Error States (Helpful REQUIRED)

```tsx
function ErrorState({ message, onRetry }: Props) {
  return (
    <Card className="border-destructive/50 bg-destructive/5 p-6">
      <div className="flex items-start gap-4">
        <AlertCircle className="h-5 w-5 text-destructive" />
        <div>
          <h4 className="font-semibold text-destructive">Something went wrong</h4>
          <p className="text-sm text-muted-foreground mt-1">{message}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
            Try Again
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

**FAIL CONDITION**: Raw error messages, no retry option

### Web3-Specific UX Requirements

#### Wallet Connection
- Wallet button in header, NOT dominant (right side, reasonable size)
- Show truncated address when connected: `5FHw...3kPb`
- Clear connect/disconnect states
- Handle connection errors gracefully

#### Transaction States
```tsx
const [txState, setTxState] = useState<'idle' | 'signing' | 'confirming' | 'success' | 'error'>('idle');

<Button disabled={txState === 'signing' || txState === 'confirming'}>
  {txState === 'signing' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {txState === 'signing' ? 'Waiting for signature...' : 'Send'}
</Button>
```

#### Address Display
```tsx
<button onClick={() => navigator.clipboard.writeText(address)}>
  <span className="font-mono text-sm">{address.slice(0, 4)}...{address.slice(-4)}</span>
  <Copy className="ml-2 h-3 w-3" />
</button>
```

### Forbidden UI Patterns (FAIL CONDITIONS)

| Pattern | Why It Fails |
|---------|--------------|
| Monospace body text | Unprofessional, hard to read |
| Plain HTML elements | No polish, looks like tutorial |
| No hover states | Non-responsive, feels broken |
| Spinner-only loading | Poor UX, no content preview |
| Blank empty states | Confusing, no guidance |
| Raw error messages | Unhelpful, unprofessional |
| Wallet dominates UI | Web3 > App purpose inversion |
| Instant transitions | Jarring, no polish |

---

## Monetization Options

Unlike mobile apps, web3 apps have multiple monetization paths:

### Option 1: Token Gating (Solana Native)

```tsx
// Gate premium features behind token holdings
const { data: balance } = useTokenBalance(tokenMint);
const isPremium = balance && balance > 0;

{isPremium ? <PremiumFeature /> : <UpgradePrompt />}
```

### Option 2: Tip Jar (Solana Native)

```tsx
// Accept SOL tips
const { sendTransaction } = useWallet();

async function sendTip(amount: number) {
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: CREATOR_ADDRESS,
      lamports: amount * LAMPORTS_PER_SOL,
    })
  );
  await sendTransaction(tx, connection);
}
```

### Option 3: Stripe (SaaS Model)

For subscription-based web apps without token requirements.

### Default

If user doesn't specify monetization, default to **free with optional tip jar** for token-enabled apps, or **free** for standard apps.

---

## Guardrails

### DO

- Write all code to `web3-builds/<app-slug>/`
- Normalize intent before building
- Write comprehensive spec before code
- Include research artifacts
- Run Ralph Polish Loop until PASS
- Include working `npm run dev` and `npm run build` scripts
- Create fully implemented components (not placeholders)
- Include `.env.example` for any required environment variables
- Include `vercel.json` for deployment

### DO NOT

- Ask clarifying questions (infer from context)
- Skip Intent Normalization
- Skip Research phase
- Skip Ralph Polish Loop
- Write prompt files as final output
- Output to `generated/` as the primary path
- Create empty or placeholder implementations
- Include actual secrets or API keys in code
- Include `node_modules/`, `.env`, or `.next/` in the project
- Claim success without Ralph PASS verdict

---

## Execution Flow

### Step 1: Receive App Idea
- Accept user's plain-language description
- Extract `app_name` and `app_slug`

### Step 2: Normalize Intent
- Upgrade raw input to publishable spec
- Save to `runs/.../inputs/normalized_prompt.md`

### Step 3: Ask About Token Integration
Ask exactly once: **"Do you want Solana wallet integration for token features? (yes/no)"**

### Step 4: Write Dream Spec
- Comprehensive specification with all 10 sections
- Save to `runs/.../inputs/dream_spec.md`

### Step 5: Research & Position
- Write market_research.md, competitor_analysis.md, positioning.md
- Save to `web3-builds/<app-slug>/research/`

### Step 6: Build Complete Application
- Write ALL files to `web3-builds/<app-slug>/`
- Follow UI/UX requirements strictly

### Step 7: Ralph Polish Loop
- Run adversarial QA
- Iterate until ≥97% pass rate
- Max 3 iterations before hard failure

### Step 8: Verify Build Works

```bash
cd web3-builds/<app-slug>
npm install      # Must complete without errors
npm run build    # Must complete without errors
npm run dev      # Must start server on localhost:3000
```

---

## Directory Structure

```
web3-factory/
├── CLAUDE.md                 # This constitution
├── README.md                 # User documentation
├── validator/
│   └── index.ts              # Build validator
├── templates/
│   └── system/
│       ├── dream_spec_author.md    # Spec writing guide
│       ├── ralph_polish_loop.md    # QA loop protocol
│       ├── design_spec_author.md   # Design system guide
│       └── ui_polish_checklist.md  # UI QA checklist
├── web3-builds/              # Built apps (output directory)
├── runs/                     # Execution logs
│   └── YYYY-MM-DD/
│       └── build-<timestamp>/
│           ├── inputs/
│           │   ├── raw_input.md
│           │   ├── normalized_prompt.md
│           │   └── dream_spec.md
│           └── polish/
│               ├── ralph_report_1.md
│               └── ralph_final_verdict.md
└── generated/                # Internal artifacts (not primary output)
```

### Directory Boundaries

| Directory | Purpose | Who Writes |
|-----------|---------|------------|
| `web3-builds/<app-slug>/` | **Final output** - runnable app | Claude |
| `runs/` | Execution logs and artifacts | Claude |
| `generated/` | Internal/intermediate artifacts | Internal only |

### FORBIDDEN Directories (never write to)

- `builds/` - belongs to the_factory
- `outputs/` - belongs to agent-factory
- Any path outside `web3-factory/`

---

## Default Assumptions

When the user doesn't specify:

| Aspect | Default |
|--------|---------|
| Styling | Dark mode with light mode toggle |
| State | Zustand for client state |
| Auth | Guest-first (no login required) |
| Monetization | Free (tip jar if token-enabled) |
| Deployment | Vercel |
| Animations | Framer Motion, subtle polish |
| Loading | Skeleton loaders |

---

## Quickstart

```bash
cd web3-factory
claude
# Describe: "A meme battle arena where users vote on head-to-head meme matchups"
# Answer: "Do you want Solana wallet integration?" → no (or yes)
# Claude builds complete app in web3-builds/<app-slug>/
# When done:
cd web3-builds/<app-slug>
npm install
npm run dev
# Open http://localhost:3000
```

---

## Troubleshooting

### npm install fails

```bash
npm install --legacy-peer-deps
```

### Build errors

```bash
npm run build
# Check output for specific TypeScript errors
```

### Missing wallet provider (token-enabled only)

Ensure `src/app/providers.tsx` includes:
- `ConnectionProvider` wrapping the app
- `WalletProvider` with `PhantomWalletAdapter`

### Validation fails

```bash
npx tsx ../../validator/index.ts
# Read output for specific missing files or errors
```

### Ralph fails 3 times

Build is a hard failure. Check `runs/.../polish/ralph_final_verdict.md` for unresolved issues.

---

## Validation Command

```bash
cd web3-builds/<app-slug>
npx tsx ../../validator/index.ts
```

Validation PASSES only if:
- All required files exist
- package.json has dev AND build scripts
- Core dependencies are present
- Research artifacts exist and are substantive
- No forbidden files (.env, node_modules)
- No security patterns (private keys, secrets)

Validation FAILS if:
- Output is a prompt pack (only .md files)
- Missing package.json or src/app/
- No dev or build scripts
- Research is placeholder content

---

## Success Definition

A successful execution produces:
- Complete Next.js app in `web3-builds/<app-slug>/`
- Ralph PASS verdict in `runs/.../polish/ralph_final_verdict.md`
- All research artifacts with substantive content
- App runs with `npm run dev`
- App builds with `npm run build`

---

## Version History

- **7.0** (2026-01-14): Added Intent Normalization, Dream Spec Author, Ralph Polish Loop, updated Solana to web3.js v2.x, added research requirements
- **6.1** (2026-01-13): Comprehensive UI/UX requirements, Framer Motion mandatory
- **6.0** (2026-01-13): Restored full-build contract, explicit forbidden outputs
- **5.0** (2026-01-13): Incorrect prompt-generator framing (reverted)
- **4.0** (2026-01-12): Token integration optional

---

**web3-factory**: Describe your app idea. Get a complete, polished, runnable web application.
