# Web3 Factory

**Describe your Web3 app. Get build prompts instantly.**

---

## Quick Start

**Open this folder in Claude Code or Cursor, then type your app idea:**

```
Make a roast battle app where users compete in 1v1 voice battles for token rewards
```

The agent generates build prompts and specs automatically in `generated/<app-slug>/`.

---

## How It Works

1. **Open** `web3-factory/` in Claude Code or Cursor
2. **Describe** your Web3 app idea in one sentence
3. **Agent generates** prompts and specs in `generated/<app-slug>/`
4. **Build** using the generated `build_prompt.md` in your AI tool
5. **Validate** your build with helper scripts
6. **Upload** to factoryapp.dev to launch

**This is an agent-driven pipeline.** You describe, the agent generates. Your AI builds.

---

## What Gets Generated

When you describe an app, these files are created:

```
generated/<app-slug>/
├── build_prompt.md      # Full build instructions for Claude/Cursor
├── checklist.md         # Build verification checklist
├── contract_spec.md     # Blockchain integration spec
└── frontend_spec.md     # UI/UX guidelines
```

---

## After Building

Once you've built your app using the generated prompts:

```bash
cd web3-builds/<your-app>
npm install
npm run validate    # Check against ZIP_CONTRACT.md
npm run zip         # Create upload package
```

Then upload to [factoryapp.dev/web3-factory/launch](https://factoryapp.dev/web3-factory/launch).

---

## Helper Scripts

| Command | Run From | Purpose |
|---------|----------|---------|
| `npm run validate` | `web3-builds/<app>/` | Validate build structure |
| `npm run zip` | `web3-builds/<app>/` | Create upload package |

---

## Project Structure

```
web3-factory/
├── CLAUDE.md               # Agent constitution
├── generator/templates/    # Prompt templates
├── generated/              # Generated prompts/specs
├── web3-builds/            # Your built apps
├── validator/              # Validation helpers
└── ZIP_CONTRACT.md         # Build requirements
```

---

## ZIP Contract

All builds must comply with `ZIP_CONTRACT.md`:

- `package.json` at root
- Required files: `src/app/providers.tsx`, `src/app/layout.tsx`, etc.
- Required dependencies: `@solana/wallet-adapter-react`, `@solana/web3.js`
- No forbidden files: `node_modules/`, `.env`, `.git/`
- Max 50 MB compressed

---

## FAQ

**How does this work?**

You describe an app, the agent generates prompts. You build using those prompts in Claude/Cursor. Then validate, zip, and upload.

**What AI should I use to build?**

Claude, Cursor, or ChatGPT. Claude produces the best results.

**How much SOL do I need to launch?**

About 0.05 SOL (~$10) for token creation on factoryapp.dev.

**Where do I launch?**

[factoryapp.dev/web3-factory/launch](https://factoryapp.dev/web3-factory/launch)

---

## Documentation

- [CLAUDE.md](./CLAUDE.md) - How the agent works
- [ZIP_CONTRACT.md](./ZIP_CONTRACT.md) - Build requirements
- [GET_STARTED.md](./GET_STARTED.md) - Step-by-step guide

---

**Web3 Factory** - Describe your idea. Get build prompts. Launch on Solana.
