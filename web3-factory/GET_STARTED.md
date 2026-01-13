# Get Started with Web3 Factory

Build and launch your Web3 app in 30 minutes.

---

## What You'll Need

- [ ] Node.js 18+ installed
- [ ] A Solana wallet (Phantom or Solflare)
- [ ] ~0.05 SOL in your wallet (~$10)
- [ ] Claude Code, Cursor, or another AI coding tool

---

## Fast Path (Recommended)

**Open this folder in Claude Code and describe your app:**

```
Open web3-factory/ in Claude Code
Type: "Make a roast battle app where users compete for token rewards"
→ Prompts generated automatically in generated/roast-battle-app/
```

That's it. The agent reads templates, substitutes your app details, and writes the prompt files.

---

## Step-by-Step Guide

### Phase 1: Generate Prompts

**Option A: Agent Mode (Recommended)**

1. Open `web3-factory/` in Claude Code or Cursor
2. Describe your Web3 app idea
3. Agent generates files in `generated/<your-app>/`

**Option B: CLI Mode**

```bash
cd web3-factory
npm install
npm run generate "a roast battle app where users compete for token rewards"
```

Either way, you get:
```
generated/<app-slug>/
├── build_prompt.md      # Full build instructions
├── checklist.md         # Verification checklist
├── contract_spec.md     # Blockchain integration spec
└── frontend_spec.md     # UI guidelines
```

---

### Phase 2: Build Your App

1. Open `generated/<your-app>/build_prompt.md`
2. Copy the entire contents
3. Paste into Claude.ai, Cursor, or your AI tool
4. Let the AI generate your complete Next.js app
5. Save output to `web3-builds/<your-app>/`

**Tip:** Claude.ai produces the best results.

---

### Phase 3: Test Locally

```bash
cd web3-builds/<your-app>
npm install
npm run dev
```

Open http://localhost:3000 and verify:
- [ ] App loads without errors
- [ ] Wallet connect button appears
- [ ] Core features work

---

### Phase 4: Validate & Package

```bash
npm run validate
```

You should see:
```
============================================================
  Web3 Factory Build Validator
  Contract: ZIP_CONTRACT.md v1.0
============================================================

  VALIDATION PASSED

  Your build meets ZIP_CONTRACT.md requirements.

  NEXT STEP: npm run zip
```

Then package for upload:
```bash
npm run zip
```

This creates `<your-app>.zip` ready for upload.

---

### Phase 5: Launch

1. Go to [factoryapp.dev/web3-factory/launch](https://factoryapp.dev/web3-factory/launch)
2. Upload your `.zip` file
3. Fill token metadata (name, ticker, description)
4. Connect wallet and sign transaction
5. Done - token created, app deployed

---

## Troubleshooting

### Validation Failed

Check error messages. Common issues:
- Missing required files (see ZIP_CONTRACT.md)
- Missing dependencies
- Forbidden files included (.env, node_modules)

### Zip Too Large

Must be under 50 MB. Remove:
- Large images (optimize them)
- Build artifacts (.next, dist)

### Transaction Failed

- Ensure you have ~0.05 SOL
- Check wallet is connected
- Try refreshing

---

## Cost Summary

| Item | Cost |
|------|------|
| Web3 Factory tools | Free |
| AI inference | Your AI subscription |
| Token launch | ~0.05 SOL (~$10) |
| Vercel hosting | Free tier |

---

## Quick Reference

| Phase | Where | What |
|-------|-------|------|
| 1 | web3-factory/ | Generate prompts (agent or CLI) |
| 2 | Claude.ai/Cursor | Build app with AI |
| 3 | web3-builds/app/ | Test locally |
| 4 | web3-builds/app/ | Validate & zip |
| 5 | factoryapp.dev | Upload & launch |

---

**Questions?** Open an issue on GitHub.
