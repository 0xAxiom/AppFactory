# MiniApp Pipeline

Build **Base Mini Apps** - applications that run inside the Base app.

## Quick Start

```bash
cd miniapp-pipeline
claude

# Describe your idea:
# "I want a mini app that lets users share daily gratitude posts"
```

The pipeline guides you from idea to published mini app.

---

## What is a Mini App?

A **mini app** is a lightweight application that runs inside another app - in this case, the **Base app**. Think of it like apps within an app store, but simpler and more social.

When someone shares a link to your mini app in Base, it shows up as a rich preview. Tapping it launches your app right inside Base - no separate download needed.

**Examples of mini apps:**
- A daily poll that friends can vote on
- A simple game with leaderboards
- A gratitude journal shared with close friends
- A tip jar for content creators
- An event RSVP tracker

## What is Base?

**Base** is a social app and Layer 2 blockchain built by Coinbase. It combines:
- A social feed (like Twitter/X, built on Farcaster)
- Wallet functionality (send/receive crypto)
- A mini app platform (where your app lives)

Your mini app can be purely social (no crypto needed) or can integrate wallet features for payments, NFTs, or other onchain functionality.

## What is MiniKit?

**MiniKit** is the SDK (software development kit) that connects your app to Base. It provides:
- User context (who's using your app)
- Wallet access (if you need payments)
- Native UI components that feel right in Base
- Sharing capabilities

You build a normal Next.js web app, add MiniKit, and it becomes a mini app.

## What is the Manifest?

The **manifest** is a JSON file that tells Base about your app:
- Name, description, and category
- Icon and screenshots
- Where to load your app from
- Who owns it (that's you!)

It lives at `/.well-known/farcaster.json` on your domain.

## Why Sign the Manifest?

**Account association** proves you own the domain hosting your mini app. It's like a digital signature connecting:
- Your Farcaster account (your identity)
- Your domain (where your app lives)

Without signing, Base won't trust that you actually own the app. It's a security feature that protects users.

This is a **manual step** - you'll use Base's tool to sign with your wallet.

## How Publishing Works

Publishing is simple: **post your app's URL in Base**.

1. Deploy your app to Vercel (or similar)
2. Complete account association
3. Create a post in Base with your URL
4. Base automatically detects it's a mini app
5. Users can now discover and launch it

That's it. No app store review. No waiting.

---

## Pipeline Stages

| Stage | Name | What Happens |
|-------|------|--------------|
| M0 | Intent | Your idea becomes a structured concept |
| M1 | Plan | Technical approach and file structure planned |
| M2 | Scaffold | Next.js app generated with MiniKit |
| M3 | Manifest | Configuration and placeholder assets created |
| M4 | Deploy | Step-by-step Vercel deployment guide |
| M5 | **Sign** | **MANUAL: You sign with Base Build tool** |
| M6 | Validate | Preview tool verification checklist |
| M7 | Harden | Error handling, loading states, polish |
| M8 | **Proof** | **Build must pass all checks** |
| M9 | Publish | Publication instructions |
| M10 | **Ralph** | **Adversarial QA review** |

**Bold stages** require action or have gates.

---

## What You Get

After running the pipeline, you have:

```
builds/miniapps/your-app/
├── app/                    # Your Next.js mini app
│   ├── app/
│   │   ├── page.tsx       # Main app page
│   │   └── .well-known/   # Manifest route
│   ├── components/        # Your UI components
│   ├── public/            # Images and assets
│   ├── minikit.config.ts  # Single source of truth
│   └── package.json
└── artifacts/             # Pipeline documentation
    ├── DEPLOYMENT.md      # How to deploy
    ├── ACCOUNT_ASSOCIATION_TODO.md
    ├── PUBLISH.md         # How to publish
    └── [validation reports]
```

---

## Manual Steps Required

The pipeline can't do everything automatically. You must:

### 1. Deploy to Vercel
- Push code to GitHub
- Import to Vercel
- **Disable Deployment Protection** (critical!)

### 2. Sign Your Manifest
- Open Base Build's account association tool
- Enter your Vercel URL
- Sign with your wallet
- Copy values back to `minikit.config.ts`

### 3. Publish
- Create a post in Base with your URL

---

## Do I Need Crypto Knowledge?

**No.** You can build mini apps that:
- Are purely social (no blockchain involved)
- Use only the social features of Base
- Don't require users to have wallets

Crypto features are **optional**. Only add them if your app idea needs them.

---

## Requirements

- Node.js 18+
- A Vercel account (free tier works)
- A Base app account
- A connected wallet (for signing only)

---

## Examples

See the `examples/` directory for complete, runnable example apps:

### [Commit App](./examples/commit-app/) - Accountability with Stakes

**Stake ETH on your goals.** Set a goal, stake crypto, pick an accountability partner. Complete it and get your stake back. Fail and your partner gets 95%.

```bash
cd examples/commit-app/app
npm install && npm run dev
```

**Why it's interesting:**
- Fills a gap in the ecosystem (no accountability apps)
- Inherently sticky (money at stake)
- Clear revenue model (5% protocol fee on forfeits)
- Full pipeline artifacts included

---

### Idea Examples

#### Social Poll App
```
"A mini app where I post a daily question and friends vote on answers"
```
No crypto needed. Just social interaction.

#### Tip Jar
```
"A mini app where fans can tip me with USDC"
```
Uses wallet features for payments.

#### Daily Streak Tracker
```
"A mini app that tracks how many days in a row I've posted"
```
No crypto needed. Just data tracking.

---

## Need Help?

- **Base Discord**: #minikit channel
- **Base Docs**: https://docs.base.org/mini-apps/
- **Cached Docs**: `vendor/base-miniapps/` in this repo

---

## Pipeline Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Full pipeline specification (this is the "rules") |
| `ARCHITECTURE.md` | Technical design and stage flow |
| `stages/` | Individual stage specifications |
| `templates/` | Code templates for generation |
| `scripts/` | Validation and build scripts |
| `examples/` | Complete runnable example apps |
| `research/` | Integration audits and QA reports |
| `builds/` | Generated app outputs |
