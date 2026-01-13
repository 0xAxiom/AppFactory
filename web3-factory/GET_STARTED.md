# Get Started with Web3 Factory

A step-by-step guide to building and launching your Web3 app.

---

## What You'll Need

- [ ] Node.js 18+ installed
- [ ] A Solana wallet (Phantom or Solflare)
- [ ] ~0.05 SOL in your wallet (~$10)
- [ ] Access to Claude, Cursor, or ChatGPT

---

## Step 1: Get the Code

```bash
git clone https://github.com/AppFactory/app-factory.git
cd app-factory/web3-factory
npm install
```

---

## Step 2: Generate Build Prompts

```bash
npm run generate "a roast battle app where users compete for token rewards"
```

This creates files in `generated/roast-battle-app/`:

- `build_prompt.md` - Copy into Claude/Cursor
- `checklist.md` - Verify your build
- `contract_spec.md` - Blockchain integration spec
- `frontend_spec.md` - UI guidelines

---

## Step 3: Build with AI

1. Open `generated/your-app/build_prompt.md`
2. Copy the entire contents
3. Paste into Claude, Cursor, or ChatGPT
4. Wait for the AI to generate your app
5. Save output to `web3-builds/your-app/`

**Tip:** Claude (claude.ai) produces the best results.

---

## Step 4: Install Dependencies

```bash
cd web3-builds/your-app
npm install
```

---

## Step 5: Test Locally

```bash
npm run dev
```

Open http://localhost:3000 and check:

- [ ] App loads without errors
- [ ] Wallet connect button appears
- [ ] Core features work

---

## Step 6: Validate Your Build

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

If validation fails, fix the issues listed and run again.

---

## Step 7: Create Upload Package

```bash
npm run zip
```

This creates `your-app.zip` ready for upload.

---

## Step 8: Upload to factoryapp.dev

1. Go to [factoryapp.dev/web3-factory/launch](https://factoryapp.dev/web3-factory/launch)
2. Drag and drop your `.zip` file
3. Wait for validation

---

## Step 9: Fill Token Metadata

| Field | Example |
|-------|---------|
| Name | Roast Battle |
| Ticker | ROAST |
| Description | Battle it out in voice roasts |
| Twitter | @roastbattle |
| Website | roastbattle.app (optional) |

---

## Step 10: Launch!

1. Click "Connect Wallet"
2. Select Phantom or Solflare
3. Review the transaction
4. Click "Approve"
5. Wait for confirmation

**Done!** Your token is live and your app is deploying.

---

## After Launch

You'll receive:

- **Token Address** - Your SPL token mint
- **Draft URL** - App deployed on Vercel
- **Showcase Listing** - Visible on factoryapp.dev

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

## Quick Reference

| Step | Where | What |
|------|-------|------|
| 1-2 | web3-factory/ | Generate prompts |
| 3 | Claude/Cursor | Build app |
| 4-7 | web3-builds/app/ | Validate & zip |
| 8-10 | factoryapp.dev | Upload & launch |

---

## Cost

- Web3 Factory tools: Free
- Token launch: ~0.05 SOL (~$10)
- Vercel hosting: Free tier

---

## Time

- Generate prompts: 2 min
- Build with AI: 10-15 min
- Validate & zip: 2 min
- Upload & launch: 5 min
- **Total: ~30 minutes**

---

**Questions?** Open an issue on GitHub.
