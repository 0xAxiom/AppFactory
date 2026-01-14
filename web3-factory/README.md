# web3-factory

**Web App Pipeline** | Part of [App Factory](../README.md)

Describe a web app idea. Get build prompts instantly. Build with your AI tool. Prepare for deployment.

---

## Who Is This For?

- Developers building web applications
- Builders who want AI-assisted development
- Anyone launching web apps (with optional token integration)

**Not for you if:** You need a mobile app (use [the_factory](../the_factory/)) or an AI agent (use [agent-factory](../agent-factory/))

---

## Quickstart

```bash
cd web3-factory
claude
# Type: "A roast battle app where users compete in 1v1 voice battles"
# Answer: "Do you want token integration?" → no (default) or yes
# Prompts generated in generated/<app-slug>/
# Build using the generated prompts
# Push to GitHub when ready for deployment
```

---

## Full Walkthrough

### Step 1: Describe Your App

Open Claude Code in this directory and describe your app:

```
A roast battle app where users compete in 1v1 voice roasts
and the community votes on the winner
```

### Step 2: Answer Token Question

The agent will ask:

> "Do you want token integration for rewards/payments?"

- **No** (default) → Standard Next.js app, no blockchain code
- **Yes** → Includes wallet connection, token balance hooks

### Step 3: Review Generated Prompts

Check `generated/<app-slug>/`:

```
generated/roast-battle-app/
├── build_prompt.md      # Full build instructions
├── checklist.md         # Verification checklist
├── frontend_spec.md     # UI/UX guidelines
└── token_spec.md        # Token integration (only if opted in)
```

### Step 4: Build Your App

Open `build_prompt.md` in Claude, Cursor, or your preferred AI tool. Follow the instructions to build your app.

Save the output to `web3-builds/<app-slug>/`.

### Step 5: Verify Locally

```bash
cd web3-builds/<app-slug>
npm install
npm run dev
```

Expected output:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

Open http://localhost:3000 in your browser. Verify the app works.

### Step 6: Validate Build (Recommended)

```bash
npm run validate
```

Expected output:
```
============================================================
  Factory Build Validator
  Contract: ZIP_CONTRACT.md v2.0
============================================================

Directory: /path/to/web3-builds/roast-battle-app
Token Integration: DISABLED

--- Required Files ---
  [PASS] Required: package.json
  [PASS] Required: tsconfig.json
  ...

============================================================
  VALIDATION PASSED
============================================================
```

If validation fails, fix the issues and run again.

### Step 7: Push to GitHub

```bash
cd web3-builds/<app-slug>
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-app
git push -u origin main
```

### Step 8: Prepare for Deployment

**The Factory Launchpad is not yet publicly live.**

At this stage, ensure your project is ready for when launch access opens:

1. All validation checks pass (`npm run validate`)
2. Code pushed to GitHub repository
3. Project metadata prepared (name, description, optional token details)

When the Factory Launchpad opens, you will be able to import your project from GitHub and deploy it.

### Token Configuration (When Launched)

If you enabled token integration, after launching you will:

1. Receive a contract address from the launchpad
2. Add it to your project:

```bash
# In .env.local (don't commit this file)
NEXT_PUBLIC_TOKEN_MINT=<your-contract-address>

# Or in src/config/constants.ts
export const TOKEN_MINT = "<your-contract-address>";
```

3. Push update and redeploy to activate token features

---

## What Gets Generated

### Without Token Integration (Default)

```
generated/<app-slug>/
├── build_prompt.md      # Full build instructions
├── checklist.md         # Verification checklist
└── frontend_spec.md     # UI/UX guidelines
```

### With Token Integration

```
generated/<app-slug>/
├── build_prompt.md      # Full build instructions (with wallet code)
├── checklist.md         # Verification checklist (with wallet checks)
├── frontend_spec.md     # UI/UX guidelines
└── token_spec.md        # Token integration guide
```

---

## Technology Stack

All generated apps use:

| Component | Technology |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |

Token-enabled apps also include:

| Component | Technology |
|-----------|------------|
| Wallet | @solana/wallet-adapter-react |
| Blockchain | @solana/web3.js |

---

## Token Integration Details

Token integration is **completely optional**.

### When to Skip Token Integration

- Building an MVP without blockchain features
- Standard web app without rewards/payments
- Testing ideas before adding complexity

### When to Enable Token Integration

- App rewards users with tokens
- App accepts token payments
- App gates features based on token holdings
- Building a dApp that interacts with on-chain state

### How Token Integration Works

1. **During generation:** Set `with_tokens = true`
2. **During build:** Wallet adapter and token hooks included
3. **At launch:** Configure token details and receive contract address
4. **After launch:** Paste contract address into config
5. **After redeploy:** Token features active

---

## Factory Ready Checklist

This pipeline follows the [Factory Ready Standard](../docs/FACTORY_READY_STANDARD.md).

| Gate | How to Verify |
|------|---------------|
| **Build** | `npm install` and `npm run build` succeed |
| **Run** | `npm run dev` starts server on localhost:3000 |
| **Test** | `curl http://localhost:3000` returns 200 |
| **Validate** | `npm run validate` passes all checks |
| **Launch Ready** | All required docs present, pushed to GitHub |

---

## Troubleshooting

### "npm install fails"

```bash
npm install --legacy-peer-deps
```

### "Validation fails: missing providers.tsx"

Ensure your build includes `src/app/providers.tsx`. Check `build_prompt.md` for the required file structure.

### "Validation fails: forbidden patterns found"

Remove any hardcoded secrets from your code. Use environment variables instead.

### "Validation fails: missing files"

- Run `npm run validate` locally to see which files are missing
- Check `build_prompt.md` for the required file structure
- Ensure all required files are present

### "Build fails locally"

- Run `npm run build` locally to see errors
- Ensure all dependencies are in `package.json`
- Check for TypeScript errors

### "Token balance shows 0 after configuration"

1. Verify contract address is correct
2. Push update with address and redeploy
3. Ensure wallet is connected to correct network

---

## Directory Structure

```
web3-factory/
├── CLAUDE.md               # Agent constitution
├── README.md               # This file
├── ZIP_CONTRACT.md         # Build requirements
├── generator/
│   ├── index.ts            # Generator CLI
│   └── templates/          # Handlebars templates
│       ├── build_prompt.hbs
│       ├── checklist.hbs
│       ├── frontend_spec.hbs
│       └── token_spec.hbs
├── validator/
│   └── index.ts            # Build validator
├── generated/              # Generated prompts (output)
└── web3-builds/            # Built apps (user saves here)
```

---

## PASS/FAIL Criteria

### PASS
- [ ] `npm run validate` exits with code 0
- [ ] All required files present
- [ ] No forbidden files or patterns
- [ ] App runs locally without crash
- [ ] Pushed to GitHub successfully

### FAIL
- [ ] Validation errors (missing files, forbidden patterns)
- [ ] Build errors during npm install
- [ ] App crashes on startup
- [ ] (Token-enabled only) Missing wallet provider setup

---

## Links

- **Root README:** [../README.md](../README.md)
- **Factory Ready Standard:** [../docs/FACTORY_READY_STANDARD.md](../docs/FACTORY_READY_STANDARD.md)
- **Preparing for Launch:** [../docs/LAUNCHPAD_OVERVIEW.md](../docs/LAUNCHPAD_OVERVIEW.md)

---

**web3-factory v4.0** - Describe your idea. Get build prompts. Build your app.
