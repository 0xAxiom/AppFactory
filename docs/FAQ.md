# Frequently Asked Questions

**Common questions about App Factory.**

---

## Table of Contents

1. [General Questions](#general-questions)
2. [Pipeline Questions](#pipeline-questions)
3. [Technical Questions](#technical-questions)
4. [Quality & Testing](#quality--testing)
5. [Deployment](#deployment)
6. [Troubleshooting](#troubleshooting)

---

## General Questions

### What is App Factory?

App Factory is a mono-repo containing six code generation pipelines that transform plain-language descriptions into production-ready applications. You describe what you want in plain English, and Claude builds it.

### Do I need coding experience?

No coding experience is required to generate applications. However, basic knowledge helps if you want to customize the generated code or debug issues.

### What types of applications can I build?

| Type                      | Pipeline         | Output              |
| ------------------------- | ---------------- | ------------------- |
| Mobile apps (iOS/Android) | app-factory      | Expo React Native   |
| dApps and websites        | dapp-factory     | Next.js             |
| AI agents                 | agent-factory    | Node.js HTTP server |
| Claude plugins            | plugin-factory   | Claude Code / MCP   |
| Base Mini Apps            | miniapp-pipeline | MiniKit + Next.js   |
| Marketing websites        | website-pipeline | Next.js             |

### Is App Factory free to use?

The App Factory repository is open source (MIT license). However, you need:

- Claude Code subscription (for direct pipeline usage)
- OR Anthropic API key (for CLI usage)

### How long does a build take?

Build times vary by complexity:

- Simple app: 5-15 minutes
- Complex dApp: 15-30 minutes
- Website with research: 10-20 minutes

---

## Pipeline Questions

### Which pipeline should I use?

| I want to build...            | Use this pipeline                         |
| ----------------------------- | ----------------------------------------- |
| An iPhone/Android app         | app-factory                               |
| A website with AI agents      | dapp-factory (Mode B)                     |
| A website without agents      | dapp-factory (Mode A) or website-pipeline |
| An HTTP API powered by AI     | agent-factory                             |
| A Claude Code extension       | plugin-factory                            |
| An app for the Base ecosystem | miniapp-pipeline                          |
| A marketing/portfolio site    | website-pipeline                          |

### What's the difference between dapp-factory and website-pipeline?

| Feature            | dapp-factory            | website-pipeline      |
| ------------------ | ----------------------- | --------------------- |
| Agent support      | Yes (Mode B)            | No                    |
| Wallet integration | Optional                | No                    |
| Skills audits      | No                      | Yes (mandatory)       |
| Primary use        | dApps, AI-powered sites | Marketing, portfolios |

### Can I use multiple pipelines together?

Yes. Common combinations:

- agent-factory (backend) + dapp-factory (frontend)
- plugin-factory (MCP) + agent-factory (processing)

### What is Mode A vs Mode B in dapp-factory?

| Mode                  | When Used                   | Includes               |
| --------------------- | --------------------------- | ---------------------- |
| Mode A (Standard)     | No autonomous AI needed     | Standard Next.js dApp  |
| Mode B (Agent-Backed) | Requires AI reasoning/tools | Next.js + Agent system |

The Agent Decision Gate automatically determines the mode based on 5 criteria.

---

## Technical Questions

### What technologies are used?

| Pipeline         | Framework           | Language        | UI        |
| ---------------- | ------------------- | --------------- | --------- |
| app-factory      | Expo (React Native) | TypeScript      | Custom    |
| dapp-factory     | Next.js 14+         | TypeScript      | shadcn/ui |
| agent-factory    | Node.js             | TypeScript      | N/A       |
| plugin-factory   | Node.js / N/A       | TypeScript / MD | N/A       |
| miniapp-pipeline | Next.js             | TypeScript      | MiniKit   |
| website-pipeline | Next.js             | TypeScript      | shadcn/ui |

### Can I change the technology stack?

The technology stack is locked per pipeline to ensure quality. The stacks are production-grade and well-tested.

### Where does my code go?

| Pipeline         | Output Directory                                   |
| ---------------- | -------------------------------------------------- |
| app-factory      | `app-factory/builds/<app-name>/`                   |
| dapp-factory     | `dapp-factory/dapp-builds/<app-name>/`             |
| agent-factory    | `agent-factory/outputs/<agent-name>/`              |
| plugin-factory   | `plugin-factory/builds/<plugin-name>/`             |
| miniapp-pipeline | `miniapp-pipeline/builds/miniapps/<app-name>/app/` |
| website-pipeline | `website-pipeline/website-builds/<site-name>/`     |

### What is Intent Normalization?

Intent Normalization (Phase 0) upgrades your vague description into a professional specification. For example:

**You say:** "make a meditation app"

**Claude normalizes to:** "A premium meditation app with guided sessions, breathing exercises, progress tracking, streak calendars, and ambient sound mixing. Features smooth animations, offline support, and a calming dark-mode design. Monetization via RevenueCat subscription."

### What is Ralph Mode?

Ralph Mode is App Factory's adversarial QA system. It acts like a picky reviewer, checking quality against a comprehensive checklist. Builds must reach 97%+ quality to pass.

---

## Quality & Testing

### What quality checks are performed?

| Check                | Description                           |
| -------------------- | ------------------------------------- |
| Build verification   | npm install, npm build succeed        |
| Runtime verification | App starts without crashing           |
| Type checking        | No TypeScript errors                  |
| Code quality         | Skills audits (website-pipeline)      |
| E2E tests            | Playwright tests (UI pipelines)       |
| Research quality     | Substantive content, not placeholders |

### What is the 97% quality threshold?

Ralph QA evaluates against a checklist of criteria. The percentage represents (passed items / total items). Builds must reach 97% or higher to complete.

### Can I skip Ralph QA?

No. Ralph QA is mandatory for all pipelines. It ensures every build is production-ready.

### What are Skills Audits?

website-pipeline uses Vercel's agent-skills for code quality:

- react-best-practices (95% threshold)
- web-design-guidelines (90% threshold)

### How does E2E testing work?

UI pipelines (dapp-factory, website-pipeline) include Playwright E2E tests:

```bash
npm run test:e2e        # Run tests
npm run test:e2e:ui     # Run with UI
npm run polish:ux       # Run 20-pass polish loop
```

---

## Deployment

### How do I deploy my mobile app?

1. Build completes in `app-factory/builds/<app-name>/`
2. Create App Store Connect / Google Play Console accounts
3. Configure RevenueCat with your products
4. Follow `LAUNCH_CHECKLIST.md` in the build directory
5. Submit to app stores

### How do I deploy my website/dApp?

```bash
cd dapp-factory/dapp-builds/<app-name>
vercel deploy
```

Or connect to Vercel via GitHub for automatic deploys.

### How do I deploy my agent?

Options:

- **Local:** `npm run dev`
- **Cloud:** Deploy to Railway, Render, or any Node.js host
- **Serverless:** Adapt to Vercel Edge Functions or Cloudflare Workers

### How do I deploy my Base Mini App?

1. Deploy to Vercel: `vercel deploy`
2. Complete account association at base.dev
3. Update `minikit.config.ts` with association credentials
4. Post deployed URL in Base app

---

## Troubleshooting

### Build failed - what do I do?

1. Check the error message in the terminal
2. Look for specific error files:
   - `runs/<date>/<run-id>/errors/`
   - Ralph verdict files
3. Common issues:
   - Missing dependencies: `npm install --legacy-peer-deps`
   - Port in use: `PORT=3001 npm run dev`

### Ralph keeps failing

Ralph requires 97%+ quality. Common blockers:

- Missing error handling
- Accessibility violations
- TypeScript errors
- Missing research content

Check the specific issues in `ralph_final_verdict.md`.

### "Cannot find module" errors

```bash
rm -rf node_modules package-lock.json
npm install
```

### Expo app won't start

1. Check Expo CLI is installed: `npm install -g expo-cli`
2. Clear cache: `npx expo start -c`
3. Check your Node version: `node --version` (need 18+)

### Website shows blank page

1. Check browser console for errors
2. Verify `npm run build` succeeds
3. Check for hydration mismatches

### Agent doesn't respond

1. Check the agent is running: `curl http://localhost:8080/health`
2. Check logs for errors
3. Verify environment variables in `.env`

---

## More Questions

### Can I contribute to App Factory?

Yes! See [CONTRIBUTING.md](/docs/CONTRIBUTING.md) for guidelines.

### Where can I get help?

- [TROUBLESHOOTING.md](/docs/TROUBLESHOOTING.md) - Detailed problem solving
- GitHub Issues - Bug reports
- GitHub Discussions - Questions

### How do I report a bug?

Open a GitHub Issue with:

1. Pipeline used
2. Input description
3. Error message
4. Steps to reproduce

### Is my data private?

Yes. App Factory:

- Runs locally on your machine
- Does not collect telemetry
- Does not transmit data to external servers
- Only uses Claude API for generation (CLI mode)

---

## Related Documentation

- [GETTING_STARTED.md](/docs/GETTING_STARTED.md) - First build guide
- [ARCHITECTURE.md](/docs/ARCHITECTURE.md) - System design
- [API.md](/docs/API.md) - Command reference
- [TROUBLESHOOTING.md](/docs/TROUBLESHOOTING.md) - Problem solving

---

**App Factory FAQ v1.0.0**: Answers to common questions.
