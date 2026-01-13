# Get Started with Web3 Factory

Build and launch your Web3 app in 30 minutes.

---

## What You'll Need

- [ ] Node.js 18+ installed
- [ ] A Solana wallet (Phantom or Solflare)
- [ ] ~0.05 SOL in your wallet (~$10)
- [ ] Claude Code, Cursor, or another AI coding tool

---

## Fast Path

```
1. Open web3-factory/ in Claude Code or Cursor
2. Type: "Make a roast battle app where users compete for token rewards"
3. Agent generates prompts in generated/roast-battle-app/
4. Build app using build_prompt.md in your AI tool
5. Validate (REQUIRED) → Zip (REQUIRED) → Upload to factoryapp.dev
```

---

## Step-by-Step Guide

### Phase 1: Generate Prompts

1. Open `web3-factory/` in Claude Code or Cursor
2. Describe your Web3 app idea in plain English
3. Agent generates files automatically in `generated/<app-slug>/`

**Output:**
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

### Phase 4: Validate (REQUIRED)

```bash
npm run validate
```

**This step is REQUIRED.** You cannot upload without passing validation.

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

If validation fails, fix the issues listed and run again.

---

### Phase 5: Package (REQUIRED)

```bash
npm run zip
```

**This step is REQUIRED.** Creates `<your-app>.zip` for upload.

---

### Phase 6: Launch

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
| 1 | web3-factory/ | Describe app → agent generates prompts |
| 2 | Claude.ai/Cursor | Build app with AI |
| 3 | web3-builds/app/ | Test locally |
| 4 | web3-builds/app/ | Validate (REQUIRED) |
| 5 | web3-builds/app/ | Zip (REQUIRED) |
| 6 | factoryapp.dev | Upload & launch |

---

**Questions?** Open an issue on GitHub.
