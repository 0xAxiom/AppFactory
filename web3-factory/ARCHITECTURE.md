# Web3 Factory Architecture

## Version 3.1 - Agent-First Local Tooling

---

## System Boundary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  YOUR MACHINE (web3-factory repo)                                           │
│                                                                             │
│  Local-only tooling:                                                        │
│  - Agent constitution (CLAUDE.md) → generates prompts/specs                 │
│  - Build validator (REQUIRED before upload)                                 │
│  - Zip creator (REQUIRED before upload)                                     │
│                                                                             │
│  No backend. No AI inference. No API keys.                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Upload zip
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  HOSTED PLATFORM (factoryapp.dev)                                           │
│                                                                             │
│  Server-side:                                                               │
│  - Upload handler                                                           │
│  - Bags API integration (server-side key)                                   │
│  - Transaction preparation                                                  │
│  - Vercel deployment                                                        │
│  - Showcase database                                                        │
│                                                                             │
│  This repo does NOT contain the hosted platform.                            │
│  Platform code lives in a separate repository.                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## This Repo Contains

| Component | Purpose |
|-----------|---------|
| `CLAUDE.md` | Agent constitution - generates prompts when user describes app |
| `generator/templates/` | Handlebars templates for prompt generation |
| `validator/` | Validates builds against ZIP_CONTRACT.md |
| `validator/zip.ts` | Creates upload package |
| `ZIP_CONTRACT.md` | Source of truth for valid builds |
| `generated/` | Output from agent generation |
| `web3-builds/` | Where users save their builds |

---

## This Repo Does NOT Contain

- Backend API
- Upload handling
- Bags SDK integration
- Token creation
- Vercel deployment
- Showcase
- Database

All of the above live on **factoryapp.dev** (separate repository).

---

## User Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  PHASE 1: GENERATE PROMPTS (Agent-driven)                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. Open web3-factory/ in Claude Code or Cursor                              │
│                                                                              │
│  2. Describe your app idea                                                   │
│     Example: "Make a roast battle app with token rewards"                    │
│                                                                              │
│  3. Agent generates files automatically                                      │
│     └─> Creates: generated/<app-slug>/                                       │
│         - build_prompt.md                                                    │
│         - checklist.md                                                       │
│         - contract_spec.md                                                   │
│         - frontend_spec.md                                                   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  PHASE 2: BUILD APP (Your AI tool)                                           │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  4. Copy build_prompt.md into Claude.ai or Cursor                            │
│     └─> AI generates your Next.js app (YOUR AI credits)                      │
│                                                                              │
│  5. Save output to web3-builds/<app-slug>/                                   │
│                                                                              │
│  6. Test locally: npm install && npm run dev                                 │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  PHASE 3: VALIDATE & PACKAGE (REQUIRED)                                      │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  7. npm run validate (REQUIRED)                                              │
│     └─> Checks build against ZIP_CONTRACT.md                                 │
│     └─> MUST PASS before proceeding                                          │
│                                                                              │
│  8. npm run zip (REQUIRED)                                                   │
│     └─> Creates: <app-slug>.zip                                              │
│     └─> MUST complete before upload                                          │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Take your zip to:
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  PHASE 4: LAUNCH (factoryapp.dev)                                            │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  9. Go to factoryapp.dev/web3-factory/launch                                 │
│                                                                              │
│  10. Upload <app-slug>.zip                                                   │
│                                                                              │
│  11. Fill token metadata (name, ticker, description)                         │
│                                                                              │
│  12. Connect Solana wallet                                                   │
│                                                                              │
│  13. Sign transaction                                                        │
│      - Token created via Bags API                                            │
│      - App deployed to Vercel                                                │
│      - Listed on showcase                                                    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
web3-factory/
├── CLAUDE.md                  # Agent constitution (generates prompts)
│
├── generator/                 # Templates for prompt generation
│   └── templates/             # Handlebars templates
│       ├── build_prompt.hbs
│       ├── checklist.hbs
│       ├── contract_spec.hbs
│       └── frontend_spec.hbs
│
├── validator/                 # Build validation + packaging
│   ├── index.ts              # npm run validate (REQUIRED)
│   └── zip.ts                # npm run zip (REQUIRED)
│
├── generated/                # Output from agent (gitignored)
│
├── web3-builds/              # User's built apps (gitignored)
│
├── ZIP_CONTRACT.md           # Source of truth for valid builds
├── ARCHITECTURE.md           # This file
├── GET_STARTED.md            # Step-by-step guide
├── README.md                 # Project overview
└── package.json
```

---

## ZIP Contract

All builds must comply with `ZIP_CONTRACT.md`. Key requirements:

### Required Files
```
package.json          (at root)
tsconfig.json
next.config.js
tailwind.config.ts
postcss.config.js
.env.example
src/app/layout.tsx
src/app/page.tsx
src/app/providers.tsx
src/app/globals.css
```

### Required Dependencies
```json
{
  "@solana/wallet-adapter-react": "^0.15.0",
  "@solana/wallet-adapter-react-ui": "^0.9.0",
  "@solana/wallet-adapter-wallets": "^0.19.0",
  "@solana/web3.js": "^1.90.0"
}
```

### Forbidden
- `node_modules/`
- `.git/`
- `.env`
- Private key patterns in code

### Size Limits
- Max 50 MB compressed
- Max 10 MB per file
- Max 10,000 files

---

## Required Commands (After Building)

```bash
# From web3-builds/<your-app>/ directory:

# REQUIRED: Validate your build
npm run validate

# REQUIRED: Create upload package
npm run zip

# Then upload at: https://factoryapp.dev/web3-factory/launch
```

---

## What Happens on factoryapp.dev

The hosted platform (not in this repo) handles:

1. **Upload** - Receives and validates zip
2. **Token Creation** - Calls Bags API with server-side key
3. **Transaction** - Prepares serialized transaction for wallet signing
4. **Deployment** - Pushes to GitHub, triggers Vercel deploy
5. **Showcase** - Stores app metadata, displays draft/deployed status

Fee split is shown on the factoryapp.dev UI.

---

## Why This Separation?

| Concern | Location | Reason |
|---------|----------|--------|
| Prompt generation | Local (agent) | No cloud cost |
| AI inference | User's Claude/Cursor | User pays their own AI |
| Validation | Local | No cloud cost |
| API keys | factoryapp.dev only | Security |
| Token creation | factoryapp.dev | Requires server-side Bags key |
| Deployment | factoryapp.dev | Requires Vercel token |

The local tools do everything that doesn't need secrets or server infrastructure.

---

**Document Version:** 3.1
**Last Updated:** 2026-01-12
