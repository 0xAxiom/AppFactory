# Web3 Factory Architecture

## Version 3.0 - Local Tooling + Hosted Platform

---

## System Boundary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  YOUR MACHINE (web3-factory repo)                                           │
│                                                                             │
│  Local-only tooling:                                                        │
│  - Prompt generator (npm run generate)                                      │
│  - Build validator (npm run validate)                                       │
│  - Zip creator (npm run zip)                                                │
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
| `generator/` | Creates build prompts from user's idea |
| `validator/` | Validates builds against ZIP_CONTRACT.md |
| `validator/zip.ts` | Creates upload package |
| `ZIP_CONTRACT.md` | Source of truth for valid builds |
| `generated/` | Output from generator |
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
│  PHASE 1: LOCAL BUILD (Your machine)                                         │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. npm run generate "your app idea"                                         │
│     └─> Creates: generated/your-app/                                         │
│         - build_prompt.md                                                    │
│         - checklist.md                                                       │
│         - contract_spec.md                                                   │
│         - frontend_spec.md                                                   │
│                                                                              │
│  2. Copy build_prompt.md into Claude/Cursor                                  │
│     └─> AI generates your Next.js app (YOUR AI credits)                      │
│                                                                              │
│  3. Save output to web3-builds/your-app/                                     │
│                                                                              │
│  4. npm run validate                                                         │
│     └─> Checks build against ZIP_CONTRACT.md                                 │
│                                                                              │
│  5. npm run zip                                                              │
│     └─> Creates: your-app.zip                                                │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Take your zip to:
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  PHASE 2: LAUNCH (factoryapp.dev)                                            │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  6. Go to factoryapp.dev/web3-factory/launch                                 │
│                                                                              │
│  7. Upload your-app.zip                                                      │
│                                                                              │
│  8. Fill token metadata (name, ticker, description)                          │
│                                                                              │
│  9. Connect Solana wallet                                                    │
│                                                                              │
│  10. Sign transaction                                                        │
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
├── generator/                  # Build prompt generator
│   ├── index.ts               # npm run generate
│   ├── package.json
│   └── templates/             # Handlebars templates
│       ├── build_prompt.hbs
│       ├── checklist.hbs
│       ├── contract_spec.hbs
│       └── frontend_spec.hbs
│
├── validator/                  # Build validator + zipper
│   ├── index.ts               # npm run validate
│   └── zip.ts                 # npm run zip
│
├── generated/                  # Output from generator (gitignored)
│
├── web3-builds/                # User's built apps (gitignored)
│
├── deprecated/                 # Old code, do not use
│   └── platform-v1/           # Was incorrectly placed here
│
├── ZIP_CONTRACT.md            # Source of truth for valid builds
├── ARCHITECTURE.md            # This file
├── GET_STARTED.md             # Step-by-step guide
├── README.md                  # Project overview
├── CLAUDE.md                  # Control plane (for pipeline mode)
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

## Commands

```bash
# Generate build prompts (no AI)
cd web3-factory
npm run generate "your app idea"

# Validate your build (run from build directory)
cd web3-builds/your-app
npm run validate

# Create upload zip (run from build directory)
npm run zip

# Upload at: https://factoryapp.dev/web3-factory/launch
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
| Build prompts | Local | No cloud cost |
| AI inference | User's Claude/Cursor | User pays their own AI |
| Validation | Local | No cloud cost |
| API keys | factoryapp.dev only | Security |
| Token creation | factoryapp.dev | Requires server-side Bags key |
| Deployment | factoryapp.dev | Requires Vercel token |

The local tools do everything that doesn't need secrets or server infrastructure.

---

**Document Version:** 3.0
**Last Updated:** 2026-01-12
