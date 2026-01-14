# Factory Launchpad Overview

**How your projects go live.**

The Factory launchpad is where you deploy and launch projects built with the App Factory pipelines.

---

## What is the Launchpad?

The launchpad is a deployment platform at [factoryapp.dev](https://factoryapp.dev) where you can:

1. **Import** your project directly from GitHub
2. **Deploy** to production infrastructure
3. **Launch** optionally with token integration
4. **Share** your live project with the world

---

## Two Launch Modes

The launchpad supports two modes:

| Mode | How It Works | Best For |
|------|--------------|----------|
| **Prompt Mode** | Describe your idea, AI builds it | Quick prototypes |
| **Repo Mode** | Import from GitHub repository | Projects you've built locally |

This guide focuses on **Repo Mode** - importing projects you've built with App Factory pipelines.

---

## Supported Project Types

| Pipeline | Launchpad Path | What Gets Deployed |
|----------|----------------|-------------------|
| **web3-factory** | factoryapp.dev (Repo Mode) | Next.js web app |
| **agent-factory** | factoryapp.dev (Repo Mode) | Node.js HTTP agent |
| **the-factory** | N/A (uses App Store/Play Store) | Mobile apps go to app stores |

---

## The Launch Flow

### Step 1: Build Your Project Locally

Use one of the App Factory pipelines to generate your project:

```
the-factory/     → Mobile app (Expo)
web3-factory/    → Web app (Next.js)
agent-factory/   → AI agent (Node.js)
```

### Step 2: Push to GitHub

Your project must be in a GitHub repository:

```bash
cd your-project
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-repo
git push -u origin main
```

### Step 3: Validate Locally (Recommended)

Run the pipeline's validator before importing:

```bash
# For web3-factory projects
npm run validate

# For agent-factory projects
npm run validate
```

This ensures your project meets requirements before you import.

### Step 4: Import on Launchpad

Go to [factoryapp.dev](https://factoryapp.dev):

1. Click **Repo Mode**
2. Connect your GitHub account (if not already connected)
3. Enter your repository URL: `owner/repo` or `https://github.com/owner/repo`
4. Select branch (default: `main`)
5. Optionally specify a commit SHA (leave empty for latest)

### Step 5: Configure Token Details (If Launching with Token)

If you want token integration:

1. Expand **Token Details** section
2. Upload a token image
3. Enter token name and symbol (e.g., `My Project` / `$PROJ`)
4. Add social links (Twitter, Telegram, website)
5. Optionally set initial buy amount in SOL

### Step 6: Launch

1. Review all details
2. Click **Create**
3. Connect wallet and sign transaction (costs ~0.02 SOL)
4. Your project deploys and token launches (if enabled)

### Step 7: Get Your Contract Address (If Token-Enabled)

After launch:

1. Your contract address appears on the confirmation screen
2. Copy the address
3. Add it to your project's configuration (see below)
4. Push the update to GitHub
5. Redeploy to activate token features

---

## Contract Address Configuration

If you launched with token integration, configure your project with the new contract address.

### Where to Paste the Address

| Pipeline | Config File | Variable Name |
|----------|-------------|---------------|
| **web3-factory** | `.env.local` or `src/config/constants.ts` | `NEXT_PUBLIC_TOKEN_MINT` |
| **agent-factory** | `.env` or `src/config/token.ts` | `TOKEN_CONTRACT_ADDRESS` |

### Step-by-Step: web3-factory

```bash
# After launching, you receive your contract address

# Option 1: Environment variable
# Add to .env.local:
NEXT_PUBLIC_TOKEN_MINT=<your-contract-address>

# Option 2: Constants file
# Edit src/config/constants.ts:
export const TOKEN_MINT = "<your-contract-address>";

# Push update
git add .
git commit -m "Add token contract address"
git push

# Redeploy on launchpad
```

### Step-by-Step: agent-factory

```bash
# After launching, you receive your contract address

# Add to .env:
TOKEN_CONTRACT_ADDRESS=<your-contract-address>

# Push update
git add .
git commit -m "Add token contract address"
git push

# Redeploy on launchpad
```

---

## Token Integration Details

Token integration is **completely optional**.

### What Token Integration Enables

| Feature | Description |
|---------|-------------|
| **Rewards** | Distribute tokens to users for actions |
| **Payments** | Accept token payments for premium features |
| **Governance** | Let token holders vote on features |
| **Access Control** | Gate features based on token holdings |

### When NOT to Use Token Integration

- Your app doesn't need blockchain functionality
- You want the simplest possible deployment
- You're building an MVP and may add tokens later

### When to Use Token Integration

- Your business model involves token rewards
- You want community ownership via tokens
- You're building a dApp that interacts with on-chain state

---

## Deployment Without Token Integration

If you skip token integration:

1. Your project deploys as a standard web app or agent
2. No wallet connection required for users
3. No blockchain dependencies
4. Leave Token Details section empty on launchpad

---

## Project Requirements

Before importing to the launchpad, ensure your project:

### Required for All Projects

| Requirement | Description |
|-------------|-------------|
| GitHub repository | Public or private with access granted |
| `package.json` | Valid Node.js project |
| Build script | `npm run build` must succeed |

### Required for web3-factory Projects

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `next.config.js` | Next.js configuration |
| `src/app/layout.tsx` | Root layout |
| `src/app/page.tsx` | Homepage |

### Required for agent-factory Projects

| File | Purpose |
|------|---------|
| `agent.json` | Agent manifest |
| `package.json` | Dependencies and scripts |
| `src/index.ts` | Entry point |

### Files That Should NOT Be Committed

| File/Pattern | Reason |
|--------------|--------|
| `.env` / `.env.local` | Contains secrets |
| `node_modules/` | Reinstalled on deploy |
| `.next/` / `dist/` | Build artifacts |

---

## Troubleshooting

### "Repository not found"

- Ensure the repository exists and is spelled correctly
- If private, ensure you've granted access to the launchpad

### "Build failed"

- Run `npm run build` locally to see errors
- Check all dependencies are in `package.json`
- Ensure no TypeScript errors

### "Token not showing after launch"

1. Wait 1-2 minutes for blockchain confirmation
2. Check the transaction on a block explorer
3. Verify you connected the correct wallet

### "Contract address not working"

1. Ensure address is pasted correctly (no extra spaces)
2. Rebuild the project after adding address
3. Push changes to GitHub and redeploy

---

## Post-Launch Checklist

After a successful launch:

- [ ] Test your live URL
- [ ] If token-enabled, paste contract address into config
- [ ] If token-enabled, push update and redeploy
- [ ] Share your launch on social media
- [ ] Monitor for errors in production

---

## Links

- **Launchpad:** https://factoryapp.dev
- **Factory Ready Standard:** [FACTORY_READY_STANDARD.md](./FACTORY_READY_STANDARD.md)

---

**Questions?** Check the troubleshooting section above or reach out on the launchpad.
