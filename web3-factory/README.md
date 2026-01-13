# Web3 Factory

**Local tooling for building Web3 apps. No backend here.**

---

## What This Repo Does

This repo contains **local-only tools** that run on your machine:

| Tool | Command | Purpose |
|------|---------|---------|
| Generator | `npm run generate` | Create build prompts from your idea |
| Validator | `npm run validate` | Check your build meets requirements |
| Zipper | `npm run zip` | Package your app for upload |

**This repo does NOT host any backend.**
Uploads and token launches happen on [factoryapp.dev](https://factoryapp.dev).

---

## Quick Start

### Step 1: Generate Build Prompts

```bash
cd web3-factory
npm install
npm run generate "a roast battle app where users compete for token rewards"
```

This creates files in `generated/roast-battle-app/`:
- `build_prompt.md` - Copy into Claude/Cursor
- `checklist.md` - Verify your build
- `contract_spec.md` - Blockchain integration spec
- `frontend_spec.md` - UI guidelines

### Step 2: Build with Your Own AI

1. Open `build_prompt.md`
2. Copy the entire contents
3. Paste into Claude, Cursor, or ChatGPT
4. Save output to `web3-builds/your-app/`

**You use your own AI. This repo does zero inference.**

### Step 3: Validate & Zip

```bash
cd web3-builds/your-app
npm install
npm run validate    # Check your build
npm run zip         # Create upload package
```

### Step 4: Upload & Launch

1. Go to [factoryapp.dev/web3-factory/launch](https://factoryapp.dev/web3-factory/launch)
2. Upload your `.zip` file
3. Fill out token metadata (name, ticker, description)
4. Connect your Solana wallet
5. Sign the transaction
6. Done! Token launches, app deploys.

---

## Commands

| Command | Where to Run | What It Does |
|---------|--------------|--------------|
| `npm run generate "idea"` | web3-factory/ | Create build prompts |
| `npm run validate` | your-build-dir/ | Check build meets ZIP_CONTRACT |
| `npm run zip` | your-build-dir/ | Create upload package |

---

## Project Structure

```
web3-factory/
├── generator/              # Build prompt generator
│   ├── index.ts           # npm run generate
│   └── templates/         # Handlebars templates
├── validator/              # Build validator
│   ├── index.ts           # npm run validate
│   └── zip.ts             # npm run zip
├── generated/              # Output from npm run generate
├── web3-builds/            # Your built apps go here
├── ZIP_CONTRACT.md         # Source of truth for valid builds
├── GET_STARTED.md          # Step-by-step guide
└── README.md               # This file
```

---

## ZIP Contract

All builds must comply with `ZIP_CONTRACT.md`. Key requirements:

- `package.json` at root (no wrapper folder)
- Required files: `src/app/providers.tsx`, `src/app/layout.tsx`, etc.
- Required dependencies: `@solana/wallet-adapter-react`, `@solana/web3.js`, etc.
- No forbidden files: `node_modules/`, `.env`, `.git/`
- Max 50 MB compressed

Run `npm run validate` to check compliance.

---

## FAQ

**Why doesn't this repo have a backend?**

Separation of concerns. This repo is local tooling. The hosted platform (factoryapp.dev) handles uploads, token creation, and deployment.

**What AI should I use?**

Claude, Cursor, or ChatGPT all work. Claude produces the best results.

**How much SOL do I need?**

About 0.05 SOL (~$10) for the token creation transaction on factoryapp.dev.

**Where do I launch my app?**

[factoryapp.dev/web3-factory/launch](https://factoryapp.dev/web3-factory/launch)

**Where do I see fee split info?**

Fee split is shown on the factoryapp.dev UI.

---

## Documentation

- [ZIP_CONTRACT.md](./ZIP_CONTRACT.md) - Build requirements (source of truth)
- [GET_STARTED.md](./GET_STARTED.md) - Step-by-step beginner guide

---

## License

MIT License

---

**Web3 Factory** - Local tools for building Web3 apps.
Launch happens on [factoryapp.dev](https://factoryapp.dev).
