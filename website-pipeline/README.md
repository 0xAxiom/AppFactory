# website-pipeline

**Static Website Pipeline** | Part of [App Factory](../README.md)

Build production-ready, SEO-optimized websites from plain-language descriptions. Includes skills audits and Playwright E2E testing when available.

---

## Who Is This For?

- Developers building marketing/portfolio websites
- Designers who want production-quality code
- Businesses needing landing pages quickly
- Anyone who wants accessible, SEO-optimized websites

**Not for you if:** You need a mobile app (use [app-factory](../app-factory/)), a dApp with AI features (use [dapp-factory](../dapp-factory/)), or an AI agent (use [agent-factory](../agent-factory/))

---

## How to Start

```bash
cd website-pipeline
claude
```

Then type your website idea:

```
Build a portfolio website for a photographer
```

Claude will:

1. **Normalize your intent** - Upgrade your idea to a professional specification
2. **Research the market** - Competitor analysis, positioning
3. **Plan architecture** - Sitemap, content model, navigation
4. **Build everything** - Complete Next.js implementation
5. **Run skills audits** - Performance + accessibility checks when available
6. **Run Ralph QA** - Optional 20-pass polish loop until completion promise

**Output:** A production-ready website in `website-builds/<site-slug>/`

---

## What "Done" Means

Your build is complete when:

1. **Code runs**: `npm install && npm run dev` works
2. **Skills audit passes** (if available): react-best-practices (95%), web-design-guidelines (90%)
3. **Ralph completes** (if enabled): COMPLETION_PROMISE written
4. **All artifacts exist**: research/, planning/, audits/

Claude won't stop until all of this is done.

---

## What Gets Generated

```
website-builds/<site-slug>/
├── package.json              # Dependencies
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS
├── playwright.config.ts      # E2E test config
├── vercel.json               # Vercel deployment
│
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── layout/           # Header, footer, etc.
│   │   └── sections/         # Page sections
│   ├── lib/
│   │   └── utils.ts
│   └── styles/
│       └── design-tokens.ts
│
├── public/
│   ├── favicon.ico
│   ├── og-image.png
│   └── robots.txt
│
├── research/                 # Market Intelligence
│   ├── market_research.md
│   ├── competitor_analysis.md
│   └── positioning.md
│
├── planning/                 # Information Architecture
│   ├── sitemap.md
│   ├── content_model.md
│   ├── navigation.md
│   └── design_system.md
│
├── audits/                   # Quality Reports
│   ├── react-best-practices.md
│   ├── web-design-guidelines.md
│   ├── seo_review.md
│   └── audit_summary.md
│
├── ralph/                    # QA Artifacts
│   ├── PRD.md
│   ├── ACCEPTANCE.md
│   ├── LOOP.md
│   ├── PROGRESS.md
│   └── QA_NOTES.md
│
├── tests/e2e/                # Playwright Tests
│   ├── smoke.spec.ts
│   └── contact.spec.ts
│
├── README.md
└── DEPLOYMENT.md
```

---

## Running Your Website

After Claude finishes:

```bash
cd website-builds/<site-slug>
npm install
npm run dev
# Open http://localhost:3000
```

### Production Build

```bash
npm run build
npm run start
```

### Run E2E Tests

```bash
npm run test:e2e
```

### Deploy to Vercel

```bash
vercel deploy
```

---

## Pipeline Phases

| Phase | Description              | Output                                             |
| ----- | ------------------------ | -------------------------------------------------- |
| 0     | Intent Normalization     | `runs/<date>/<run-id>/inputs/normalized_prompt.md` |
| 1     | Dream Spec (12 sections) | `runs/<date>/<run-id>/inputs/dream_spec.md`        |
| 2     | Research                 | `website-builds/<slug>/research/`                  |
| 3     | Information Architecture | `website-builds/<slug>/planning/`                  |
| 4     | Design System            | `website-builds/<slug>/planning/design_system.md`  |
| 5     | Build                    | `website-builds/<slug>/src/`                       |
| 6     | Skills Audit (MANDATORY) | `website-builds/<slug>/audits/`                    |
| 7     | SEO Review               | `website-builds/<slug>/audits/seo_review.md`       |
| 8     | Ralph Polish Loop        | `website-builds/<slug>/ralph/`                     |

---

## Technology Stack

| Component  | Technology              |
| ---------- | ----------------------- |
| Framework  | Next.js 14 (App Router) |
| Language   | TypeScript              |
| Styling    | Tailwind CSS            |
| Components | shadcn/ui               |
| Animation  | Framer Motion           |
| Icons      | Lucide React            |
| Forms      | React Hook Form + Zod   |
| SEO        | next-seo                |
| Testing    | Playwright              |
| Deployment | Vercel                  |

---

## Optional Quality Enhancements

When available, websites can be enhanced with additional quality audits:

| Skill                 | Threshold | What It Checks                                     | Availability         |
| --------------------- | --------- | -------------------------------------------------- | -------------------- |
| react-best-practices  | 95%       | Server Components, no barrel imports, proper hooks | @vercel/agent-skills |
| web-design-guidelines | 90%       | Accessibility, responsive design, Core Web Vitals  | @vercel/agent-skills |

**Note**: These audits are OPTIONAL. If @vercel/agent-skills is not available, builds proceed without them. The mandatory quality gate is LOCAL_RUN_PROOF_GATE (verifies the build runs successfully).

---

## Performance Targets

All websites are built to meet Core Web Vitals:

| Metric | Target  | Description              |
| ------ | ------- | ------------------------ |
| LCP    | < 2.5s  | Largest Contentful Paint |
| FID    | < 100ms | First Input Delay        |
| CLS    | < 0.1   | Cumulative Layout Shift  |
| TTFB   | < 800ms | Time to First Byte       |
| Bundle | < 200KB | Main bundle size         |

---

## Quality Assurance

### Skills Audit

Run after build phase:

- Checks code patterns
- Validates accessibility
- Verifies performance optimization

### Ralph Polish Loop

20-pass quality loop:

1. Run lint, typecheck, E2E tests
2. Fix highest-impact issue
3. If passing, make polish improvement
4. Document in PROGRESS.md
5. Repeat until COMPLETION_PROMISE

---

## Defaults

When you don't specify:

| Aspect     | Default                        |
| ---------- | ------------------------------ |
| Framework  | Next.js 14 (App Router)        |
| Hosting    | Vercel                         |
| Dark mode  | Enabled                        |
| Animations | Framer Motion page transitions |
| Forms      | React Hook Form + Zod          |
| SEO        | next-seo configured            |

---

## Troubleshooting

### npm install fails

**IMPORTANT:** Do NOT use `--legacy-peer-deps`, `--force`, or `--ignore-engines` flags. These are forbidden by the Local Run Proof Gate and will cause verification failure.

1. **Check Node version matches .nvmrc**
2. **Fresh install:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. **Review the specific error message for missing peer dependencies**

### Build fails

```bash
rm -rf .next
npm run build
```

### Port in use

```bash
PORT=3001 npm run dev
```

### E2E tests fail

```bash
# Install browsers
npx playwright install

# Run with debug
npx playwright test --debug
```

---

## Directory Structure

```
website-pipeline/
├── CLAUDE.md             # Constitution (Claude's instructions)
├── README.md             # This file
├── ARCHITECTURE.md       # Technical architecture
├── skills/               # Code quality rules
│   ├── react-best-practices/
│   │   ├── SKILL.md
│   │   └── AGENTS.md
│   └── web-design-guidelines/
│       └── SKILL.md
├── templates/
│   └── system/
│       ├── dream_spec_author.md
│       └── ralph_polish_loop.md
├── docs/
│   ├── QUALITY_GATES.md
│   └── SKILLS_USED.md
├── example/              # Reference implementation
├── website-builds/       # Generated websites (output)
├── runs/                 # Execution artifacts
└── scripts/              # Internal tools
```

---

## Links

- **Root README:** [../README.md](../README.md)
- **Constitution:** [CLAUDE.md](./CLAUDE.md) - Full pipeline specification
- **Architecture:** [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical details
- **Documentation:** [../docs/](../docs/) - Global documentation
- **Mobile apps:** [app-factory](../app-factory/)
- **dApps:** [dapp-factory](../dapp-factory/)
- **AI agents:** [agent-factory](../agent-factory/)
- **Claude plugins:** [plugin-factory](../plugin-factory/)
- **Mini apps:** [miniapp-pipeline](../miniapp-pipeline/)

---

**website-pipeline v2.2.0** - `cd website-pipeline && claude` - describe your site - get a production-ready website.
