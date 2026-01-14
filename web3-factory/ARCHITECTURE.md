# Factory Architecture

## Version 4.0 - Agent-First Local Tooling

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
│  - Token creation (if enabled)                                              │
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
│     Example: "Make a roast battle app"                                       │
│                                                                              │
│  3. Agent asks: "Do you want token integration?"                             │
│     - Yes → includes wallet/token code                                       │
│     - No → standard Next.js app                                              │
│                                                                              │
│  4. Agent generates files automatically                                      │
│     └─> Creates: generated/<app-slug>/                                       │
│         - build_prompt.md                                                    │
│         - checklist.md                                                       │
│         - token_spec.md (if tokens enabled)                                  │
│         - frontend_spec.md                                                   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  PHASE 2: BUILD APP (Your AI tool)                                           │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  5. Copy build_prompt.md into Claude.ai or Cursor                            │
│     └─> AI generates your Next.js app (YOUR AI credits)                      │
│                                                                              │
│  6. Save output to web3-builds/<app-slug>/                                   │
│                                                                              │
│  7. Test locally: npm install && npm run dev                                 │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  PHASE 3: VALIDATE & PACKAGE (REQUIRED)                                      │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  8. npm run validate (REQUIRED)                                              │
│     └─> Checks build against ZIP_CONTRACT.md                                 │
│     └─> Detects if token integration is present                              │
│     └─> MUST PASS before proceeding                                          │
│                                                                              │
│  9. npm run zip (REQUIRED)                                                   │
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
│  10. Go to factoryapp.dev/launch                                             │
│                                                                              │
│  11. Upload <app-slug>.zip                                                   │
│                                                                              │
│  12. If token-enabled: Fill token metadata (name, ticker, description)       │
│                                                                              │
│  13. Connect Solana wallet                                                   │
│                                                                              │
│  14. Sign transaction                                                        │
│      - Token created (if enabled)                                            │
│      - App deployed to Vercel                                                │
│      - Listed on showcase                                                    │
│                                                                              │
│  15. If token-enabled: Add contract address to your .env                     │
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
│       ├── token_spec.hbs     # Only generated if tokens enabled
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
├── README.md                 # Project overview
└── package.json
```

---

## ZIP Contract v2.0

All builds must comply with `ZIP_CONTRACT.md`. Key requirements:

### Required Files (All Apps)
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

### Required Core Dependencies
```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "react-dom": "^18.0.0"
}
```

### Optional Dependencies (Token-Enabled Apps)
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

# Then upload at: https://factoryapp.dev/launch
```

---

## What Happens on factoryapp.dev

The hosted platform (not in this repo) handles:

1. **Upload** - Receives and validates zip
2. **Token Creation** - Creates token on Solana (if enabled)
3. **Transaction** - Prepares serialized transaction for wallet signing
4. **Deployment** - Pushes to GitHub, triggers Vercel deploy
5. **Showcase** - Stores app metadata, displays draft/deployed status

---

## Why This Separation?

| Concern | Location | Reason |
|---------|----------|--------|
| Prompt generation | Local (agent) | No cloud cost |
| AI inference | User's Claude/Cursor | User pays their own AI |
| Validation | Local | No cloud cost |
| API keys | factoryapp.dev only | Security |
| Token creation | factoryapp.dev | Requires server-side keys |
| Deployment | factoryapp.dev | Requires Vercel token |

The local tools do everything that doesn't need secrets or server infrastructure.

---

**Document Version:** 4.0
**Last Updated:** 2026-01-13
