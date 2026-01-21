# Factory Architecture

## Version 6.0 - Full Build Factory

---

## System Boundary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  YOUR MACHINE (web3-factory repo)                                           │
│                                                                             │
│  Local tooling:                                                             │
│  - Agent constitution (CLAUDE.md) → builds complete apps                    │
│  - Build validator → verifies output meets contract                         │
│                                                                             │
│  Output: Complete, runnable Next.js applications                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## This Repo Contains

| Component            | Purpose                                              |
| -------------------- | ---------------------------------------------------- |
| `CLAUDE.md`          | Agent constitution - defines full-build contract     |
| `validator/index.ts` | Validates builds (fails on prompt packs)             |
| `web3-builds/`       | Output directory for built applications              |
| `generated/`         | Internal/intermediate artifacts (not primary output) |

---

## User Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  BUILD COMPLETE APPLICATION                                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. Open web3-factory/ in Claude Code                                        │
│                                                                              │
│  2. Describe your app idea                                                   │
│     Example: "Make a roast battle app"                                       │
│                                                                              │
│  3. Claude asks: "Do you want token integration?"                            │
│     - Yes → includes wallet/token code                                       │
│     - No → standard Next.js app                                              │
│                                                                              │
│  4. Claude builds complete application                                       │
│     └─> Creates: web3-builds/<app-slug>/                                     │
│         - package.json (with dev, build scripts)                             │
│         - tsconfig.json                                                      │
│         - next.config.js                                                     │
│         - src/app/ (complete React components)                               │
│         - README.md                                                          │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  VERIFY & RUN                                                                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  5. Install dependencies                                                     │
│     cd web3-builds/<app-slug>                                                │
│     npm install                                                              │
│                                                                              │
│  6. Run development server                                                   │
│     npm run dev                                                              │
│     Open http://localhost:3000                                               │
│                                                                              │
│  7. Build for production                                                     │
│     npm run build                                                            │
│                                                                              │
│  8. (Optional) Validate                                                      │
│     npx tsx ../../validator/index.ts                                         │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Output Contract

All builds MUST produce a runnable Next.js application with:

### Required Files

```
web3-builds/<app-slug>/
├── package.json          # REQUIRED - with dev AND build scripts
├── tsconfig.json         # REQUIRED
├── next.config.js        # REQUIRED
├── tailwind.config.ts    # REQUIRED
├── postcss.config.js     # REQUIRED
├── .env.example          # REQUIRED
├── README.md             # REQUIRED
└── src/app/
    ├── layout.tsx        # REQUIRED
    ├── page.tsx          # REQUIRED
    ├── providers.tsx     # REQUIRED
    └── globals.css       # REQUIRED
```

### Required npm Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  }
}
```

### Forbidden Outputs

Validation FAILS if:

- Output is a prompt pack (only .md files, no package.json)
- Missing src/app/ directory
- Missing dev or build scripts
- Output in `generated/` instead of `web3-builds/`

---

## Directory Structure

```
web3-factory/
├── CLAUDE.md               # Agent constitution (full-build contract)
├── README.md               # Project overview
├── ARCHITECTURE.md         # This file
├── GET_STARTED.md          # User guide
├── validator/
│   └── index.ts            # Build validator (enforces contract)
├── web3-builds/            # Built applications (PRIMARY OUTPUT)
│   └── <app-slug>/         # Complete runnable Next.js app
└── generated/              # Internal artifacts (NOT primary output)
```

---

## Validation

The validator enforces the full-build contract:

```bash
cd web3-builds/<app-slug>
npx tsx ../../validator/index.ts
```

Checks performed:

1. **Full Build Verification** - Fails if output is prompt pack
2. **Required Scripts** - Requires dev AND build scripts
3. **Required Files** - All config and source files present
4. **Core Dependencies** - next, react, react-dom installed
5. **Security Patterns** - No private keys or secrets
6. **Forbidden Files** - No .env, node_modules, .next

---

## Technology Stack

| Component  | Technology              |
| ---------- | ----------------------- |
| Framework  | Next.js 14 (App Router) |
| Language   | TypeScript              |
| Styling    | Tailwind CSS            |
| State      | Zustand                 |
| Blockchain | Solana (optional)       |

---

## Integrity Rule

**Documentation MUST match enforcement.**

- CLAUDE.md says "full build" → validator rejects prompt packs
- CLAUDE.md says "runnable app" → npm run dev MUST work
- If they diverge, the code is wrong, not the documentation

---

**Document Version:** 6.0
**Last Updated:** 2026-01-13
