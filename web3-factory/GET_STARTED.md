# Get Started with Web3 Factory

Build complete web applications with Claude.

---

## What You'll Need

- [ ] Node.js 18+ installed
- [ ] Claude Code (recommended) or Cursor
- [ ] A GitHub account for pushing your project

---

## Fast Path

```bash
cd web3-factory
claude
# Describe: "A roast battle app where users compete for token rewards"
# Answer: "Do you want token integration?" → yes or no
# Claude builds complete app in web3-builds/<app-slug>/
cd web3-builds/<app-slug>
npm install && npm run dev
# Open http://localhost:3000
```

---

## Step-by-Step Guide

### Step 1: Describe Your App

1. Open `web3-factory/` in Claude Code
2. Describe your web app idea in plain English
3. Answer when asked about token integration

**Example:**
```
Make a roast battle app where users compete in 1v1 voice battles
and the community votes on the winner
```

---

### Step 2: Claude Builds Your App

Claude generates a complete Next.js application in `web3-builds/<app-slug>/`:

```
web3-builds/<app-slug>/
├── package.json          # With dev, build, start scripts
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── .env.example
├── README.md
├── src/app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── providers.tsx
│   └── globals.css
└── public/
```

---

### Step 3: Test Locally

```bash
cd web3-builds/<app-slug>
npm install
npm run dev
```

Open http://localhost:3000 and verify:
- [ ] App loads without errors
- [ ] Core features work
- [ ] (If token-enabled) Wallet connect button appears

---

### Step 4: Build for Production

```bash
npm run build
```

This verifies your app compiles correctly for deployment.

---

### Step 5: Validate (Optional)

```bash
npx tsx ../../validator/index.ts
```

This checks:
- Required files exist
- Core dependencies present
- Required scripts present (dev, build)
- No forbidden files
- No security patterns

---

### Step 6: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-app
git push -u origin main
```

---

## Troubleshooting

### Build Fails Locally

```bash
npm run build
# Check output for TypeScript errors
```

### npm install fails

```bash
npm install --legacy-peer-deps
```

### Validation Failed

Check error messages. Common issues:
- Missing required files (package.json, src/app/*)
- Missing dev or build scripts
- Forbidden files included (.env, node_modules)

### "PROMPT PACK DETECTED"

This means the output contains only `.md` files without runnable code. The build did not complete. Re-run Claude and ensure it builds a complete application.

---

## Cost Summary

| Item | Cost |
|------|------|
| Web3 Factory tools | Free |
| Local development | Free |
| Claude Code | Your subscription |

---

## Quick Reference

| Step | Where | What |
|------|-------|------|
| 1 | web3-factory/ | Describe app to Claude |
| 2 | web3-builds/app/ | Claude builds complete app |
| 3 | web3-builds/app/ | Test with npm run dev |
| 4 | web3-builds/app/ | Build with npm run build |
| 5 | web3-builds/app/ | Validate (optional) |
| 6 | GitHub | Push when ready |

---

**Questions?** Open an issue on GitHub.
