# Preparing for the Factory Launchpad

**How to get your projects launch-ready.**

The Factory Launchpad is where you will deploy and launch projects built with the App Factory pipelines. This guide explains how to prepare your projects so they are ready when launch access opens.

---

## Launchpad Status

**The Factory Launchpad is not yet publicly live.**

At this stage, builders should focus on preparing their projects. When the launchpad opens, prepared projects will be able to onboard quickly with minimal changes.

---

## Supported Project Types

| Pipeline          | Target                 | What Gets Deployed           |
| ----------------- | ---------------------- | ---------------------------- |
| **web3-factory**  | Factory Launchpad      | Next.js web app              |
| **agent-factory** | Factory Launchpad      | Node.js HTTP agent           |
| **the-factory**   | App Store / Play Store | Mobile apps go to app stores |

---

## Preparation Checklist

### For All Projects

Before the launchpad opens, ensure your project meets these requirements:

| Requirement          | Description                                       |
| -------------------- | ------------------------------------------------- |
| Clean repository     | Well-structured, no unnecessary files             |
| Deterministic build  | `npm run build` succeeds consistently             |
| Local testing        | Project runs and passes smoke tests locally       |
| Documentation        | README, RUNBOOK, and TESTING files present        |
| No secrets committed | Use `.env.example`, never commit real credentials |

### For web3-factory Projects

| File                    | Purpose                  |
| ----------------------- | ------------------------ |
| `package.json`          | Dependencies and scripts |
| `next.config.js`        | Next.js configuration    |
| `src/app/layout.tsx`    | Root layout              |
| `src/app/page.tsx`      | Homepage                 |
| `src/app/providers.tsx` | App providers            |

### For agent-factory Projects

| File           | Purpose                  |
| -------------- | ------------------------ |
| `agent.json`   | Agent manifest           |
| `package.json` | Dependencies and scripts |
| `src/index.ts` | Entry point              |

---

## Project Readiness Steps

### Step 1: Build Your Project Locally

Use one of the App Factory pipelines to generate your project:

```
the-factory/     → Mobile app (Expo)
web3-factory/    → Web app (Next.js)
agent-factory/   → AI agent (Node.js)
```

### Step 2: Verify Local Build

Run your project's build and development server:

```bash
npm install
npm run build
npm run dev
```

Ensure all commands complete without errors.

### Step 3: Run Validation

Each pipeline includes a validator:

```bash
# For web3-factory projects
npm run validate

# For agent-factory projects
npm run validate
```

Fix any issues reported by the validator.

### Step 4: Prepare Repository

Ensure your repository is ready:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-repo
git push -u origin main
```

### Step 5: Prepare Project Metadata

Have the following ready for when the launchpad opens:

- **Project name**: Human-readable name for your project
- **Project description**: One-line summary
- **Repository URL**: GitHub repository containing your code
- **Token details** (if using token integration):
  - Token name and symbol
  - Token image
  - Social links (Twitter, Telegram, website)

---

## Token Integration (Optional)

Token integration is **completely optional** for web3-factory and agent-factory projects.

### What Token Integration Enables

| Feature            | Description                                |
| ------------------ | ------------------------------------------ |
| **Rewards**        | Distribute tokens to users for actions     |
| **Payments**       | Accept token payments for premium features |
| **Governance**     | Let token holders vote on features         |
| **Access Control** | Gate features based on token holdings      |

### When NOT to Use Token Integration

- Your app doesn't need blockchain functionality
- You want the simplest possible deployment
- You're building an MVP and may add tokens later

### When to Use Token Integration

- Your business model involves token rewards
- You want community ownership via tokens
- You're building a dApp that interacts with on-chain state

### Preparing for Token Integration

If you plan to use token integration:

1. Answer "yes" when asked during project generation
2. Your project will include wallet adapter setup and token hooks
3. A configuration variable will be included for the contract address
4. After launching, you will paste your contract address into the config

---

## Contract Address Configuration

When you launch with token integration, you will receive a contract address to configure.

### Where to Configure the Address

| Pipeline          | Config Location                           | Variable Name            |
| ----------------- | ----------------------------------------- | ------------------------ |
| **web3-factory**  | `.env.local` or `src/config/constants.ts` | `NEXT_PUBLIC_TOKEN_MINT` |
| **agent-factory** | `.env` or `src/config/token.ts`           | `TOKEN_CONTRACT_ADDRESS` |

This configuration happens after launch, not during preparation.

---

## Files That Should NOT Be Committed

| File/Pattern          | Reason                |
| --------------------- | --------------------- |
| `.env` / `.env.local` | Contains secrets      |
| `node_modules/`       | Reinstalled on deploy |
| `.next/` / `dist/`    | Build artifacts       |

---

## Common Preparation Issues

### "npm install fails"

```bash
npm install --legacy-peer-deps
```

### "Build fails with TypeScript errors"

- Run `npm run build` locally to see errors
- Fix type errors before pushing

### "Validation fails"

- Run `npm run validate` locally
- Fix all reported issues
- Common issues: missing files, forbidden patterns

---

## What Happens at Launch

When the Factory Launchpad opens:

1. You will import your project from GitHub
2. Your project will be deployed to production infrastructure
3. If using token integration, you will configure token details and receive a contract address
4. Your project goes live

Prepared projects will be able to complete this process quickly.

---

## Next Steps

1. Build your project using one of the App Factory pipelines
2. Run local validation to ensure it meets requirements
3. Push to a GitHub repository
4. Prepare your project metadata
5. Watch for announcements about launchpad availability

---

## Links

- **Factory Ready Standard:** [FACTORY_READY_STANDARD.md](./FACTORY_READY_STANDARD.md)

---

**Prepare your project now. Launch when the launchpad opens.**
