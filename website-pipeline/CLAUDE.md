# Website Pipeline

**Version:** 1.3
**Mode:** Full Build Factory with Mandatory Skills Audits
**Status:** MANDATORY CONSTITUTION

---

## Purpose

Website Pipeline generates **complete, production-ready websites** from plain-language descriptions. When a user describes a website idea, Claude builds a full Next.js project optimized for performance, accessibility, and SEO.

**Key Distinction:** This pipeline has **mandatory skills audits** using Vercel's agent-skills. Every website must pass react-best-practices and web-design-guidelines gates before shipping.

---

## For Users

```bash
cd website-pipeline
claude
```

Then describe your website:

- "Build a portfolio website for a photographer"
- "Create a landing page for my SaaS product"
- "Make a restaurant website with menu and reservations"
- "Build a blog with MDX support"

---

## Technology Stack (Opinionated)

| Component | Technology | Justification |
|-----------|------------|---------------|
| Framework | **Next.js 14+ (App Router)** | Best React framework for websites, SSR/SSG, Vercel-native |
| Language | TypeScript | Type safety, better DX |
| Styling | Tailwind CSS | Utility-first, performance, design system friendly |
| UI Components | shadcn/ui | Copy-paste components, fully customizable |
| Animation | Framer Motion | Required by web-design-guidelines |
| Icons | Lucide React | Consistent, lightweight |
| State | React Context / Zustand | Minimal, no Redux overhead |
| Forms | React Hook Form + Zod | Validation, performance |
| SEO | next-seo | Comprehensive metadata |

### Why Next.js?

1. **Server Components by default** - Better performance out of the box
2. **Static Site Generation** - Perfect for marketing/portfolio sites
3. **Vercel deployment** - Zero-config deployment
4. **Image optimization** - Built-in next/image
5. **Font optimization** - Built-in next/font

---

## The Pipeline

```
PHASE 0: Intent Normalization  → Upgrade vague idea to website spec
PHASE 1: Dream Spec Author     → 12-section comprehensive spec
PHASE 2: Research & Position   → Market research, competitor analysis
PHASE 3: Information Architecture → Sitemap, content model
PHASE 4: Design System         → Colors, typography, components
PHASE 5: Build                 → Complete Next.js website
PHASE 6: Skills Audit          → MANDATORY react-best-practices + web-design-guidelines
PHASE 7: SEO Review            → Metadata, structured data, performance
PHASE 8: Ralph Polish Loop     → Final QA until ≥97%
```

---

## PHASE 0: INTENT NORMALIZATION (MANDATORY)

**Before planning**, Claude MUST upgrade the user's raw input into a publishable website intent.

### Rules for Intent Normalization

1. Treat the user's message as RAW INTENT, not a specification
2. Infer missing but required website qualities
3. Determine website type (marketing, portfolio, blog, e-commerce, etc.)
4. Rewrite into clean, professional, **publishable prompt**
5. Do NOT ask user to approve this rewrite
6. Save to: `runs/<date>/<run-id>/inputs/normalized_prompt.md`

### Example

**User says:**
> "Build me a portfolio website"

**Claude normalizes to:**
> "A professional portfolio website for a creative professional. Features a hero section with animated introduction, project gallery with filtering, about page with skills showcase, contact form with email integration, and responsive design optimized for all devices. Dark mode support, smooth page transitions with Framer Motion, and optimized for Core Web Vitals (LCP < 2.5s, CLS < 0.1)."

### What Intent Normalization Adds

| Missing Element | Claude Infers |
|-----------------|---------------|
| No target audience | Infer from context (freelancer, agency, artist) |
| No performance goals | "Core Web Vitals compliant" |
| No animations | "Framer Motion page transitions" |
| No responsiveness | "Mobile-first responsive design" |
| No SEO | "SEO-optimized with metadata" |
| No contact | "Contact form with validation" |

---

## PHASE 1: DREAM SPEC AUTHOR

After normalization, Claude writes a comprehensive specification.

### Required Spec Sections (12)

1. **Website Vision** - One-paragraph description
2. **Target Audience** - Who will visit this website
3. **Core Pages** - List of pages with purpose
4. **Content Requirements** - What content is needed per page
5. **User Flows** - Primary user journeys
6. **Design Direction** - Visual style, mood, references
7. **Component Architecture** - Key components and responsibilities
8. **Performance Budget** - LCP, TTFB, bundle size targets
9. **SEO Strategy** - Keywords, metadata approach
10. **Accessibility Requirements** - WCAG level, specific needs
11. **Deployment Strategy** - Vercel configuration
12. **Success Criteria** - What "done" looks like

### Spec Saves To

```
runs/YYYY-MM-DD/website-<timestamp>/
└── inputs/
    └── dream_spec.md
```

---

## PHASE 2: RESEARCH & POSITIONING

Before building, Claude researches the market.

### Required Research Artifacts

```
website-builds/<slug>/
└── research/
    ├── market_research.md      # REQUIRED - Industry trends, opportunities
    ├── competitor_analysis.md  # REQUIRED - 3-5 competitor websites, gaps
    └── positioning.md          # REQUIRED - Unique value proposition
```

---

## PHASE 3: INFORMATION ARCHITECTURE

Define the structure before implementation.

### Required IA Artifacts

```
website-builds/<slug>/
└── planning/
    ├── sitemap.md              # REQUIRED - Page hierarchy
    ├── content_model.md        # REQUIRED - Content types and relationships
    └── navigation.md           # REQUIRED - Navigation structure
```

### Sitemap Format

```markdown
# Sitemap

## Primary Navigation

- / (Home)
  - /about
  - /work
    - /work/[slug]
  - /services
  - /blog
    - /blog/[slug]
  - /contact

## Secondary Navigation (Footer)

- /privacy
- /terms

## Utility Pages

- /404
- /500
```

---

## PHASE 4: DESIGN SYSTEM

Establish visual foundations before coding.

### Required Design Artifacts

```
website-builds/<slug>/
└── planning/
    └── design_system.md        # REQUIRED - Colors, typography, spacing
```

### Design System Format

```markdown
# Design System

## Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| --background | #ffffff | #0a0a0a | Page background |
| --foreground | #0a0a0a | #fafafa | Primary text |
| --primary | #0066ff | #3b82f6 | CTAs, links |
| --muted | #f4f4f5 | #27272a | Secondary backgrounds |

## Typography

| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| h1 | Inter | 48px/3rem | 700 | 1.1 |
| h2 | Inter | 36px/2.25rem | 600 | 1.2 |
| body | Inter | 16px/1rem | 400 | 1.5 |

## Spacing Scale

4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px, 128px

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| --radius-sm | 4px | Buttons, inputs |
| --radius-md | 8px | Cards |
| --radius-lg | 16px | Modals |
| --radius-full | 9999px | Pills, avatars |
```

---

## PHASE 5: BUILD

Write complete website to `website-builds/<slug>/`.

### Output Contract

```
website-builds/<slug>/
├── package.json              # REQUIRED
├── tsconfig.json             # REQUIRED
├── next.config.js            # REQUIRED
├── tailwind.config.ts        # REQUIRED
├── postcss.config.js         # REQUIRED
├── playwright.config.ts      # REQUIRED - E2E testing
├── vercel.json               # REQUIRED
├── .env.example              # REQUIRED
├── README.md                 # REQUIRED
├── DEPLOYMENT.md             # REQUIRED
├── research/                 # REQUIRED
├── planning/                 # REQUIRED
├── ralph/                    # REQUIRED - UX Polish Loop
│   ├── PRD.md
│   ├── ACCEPTANCE.md
│   ├── LOOP.md
│   ├── PROGRESS.md
│   └── QA_NOTES.md
├── tests/                    # REQUIRED - E2E tests
│   └── e2e/
│       ├── smoke.spec.ts
│       └── contact.spec.ts
├── scripts/                  # REQUIRED
│   └── ralph_loop_runner.sh
├── public/
│   ├── favicon.ico
│   ├── og-image.png          # 1200x630
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── layout.tsx        # REQUIRED - Root layout
│   │   ├── page.tsx          # REQUIRED - Home page
│   │   ├── globals.css       # REQUIRED
│   │   ├── not-found.tsx     # REQUIRED - 404 page
│   │   └── [...pages]/
│   ├── components/
│   │   ├── ui/               # REQUIRED - shadcn/ui
│   │   ├── layout/           # Header, Footer, etc.
│   │   └── sections/         # Page sections
│   ├── lib/
│   │   ├── utils.ts          # REQUIRED
│   │   └── fonts.ts          # Font configuration
│   └── styles/
│       └── design-tokens.ts  # REQUIRED
└── content/                  # MDX content if blog
```

### Performance Requirements

| Metric | Target | Audit Tool |
|--------|--------|------------|
| LCP | < 2.5s | Lighthouse |
| FID | < 100ms | Lighthouse |
| CLS | < 0.1 | Lighthouse |
| TTFB | < 800ms | Lighthouse |
| Bundle Size | < 200KB (initial) | Next.js build |

---

## PHASE 6: SKILLS AUDIT (MANDATORY)

**This is NOT optional.** Every website must pass skills audits.

### Skill: react-best-practices

**ID:** `website-pipeline:react-best-practices`
**Trigger:** After Phase 5 Build completes
**Pass Threshold:** ≥95%, no CRITICAL violations

**Critical Rules:**
- No barrel imports (`import from '@/components'`)
- Promise.all for parallel data fetching
- Dynamic imports for heavy dependencies
- Server Components by default

### Skill: web-design-guidelines

**ID:** `website-pipeline:web-design-guidelines`
**Trigger:** After Phase 5 Build completes
**Pass Threshold:** ≥90%, no HIGH accessibility violations

**Critical Rules:**
- Semantic HTML
- ARIA labels on interactive elements
- Color contrast ≥4.5:1
- Focus states visible
- Framer Motion page transitions

### Audit Output

```
website-builds/<slug>/
└── audits/
    ├── react-best-practices.md    # REQUIRED
    ├── web-design-guidelines.md   # REQUIRED
    └── audit_summary.md           # REQUIRED
```

### Gate Criteria

```
Skills Audit PASS if:
  - react-best-practices: ≥95% AND no CRITICAL
  - web-design-guidelines: ≥90% AND no HIGH a11y violations
  - Both audits produce reports
```

**If gate fails:** Claude fixes violations and re-runs audit (max 3 attempts).

---

## PHASE 7: SEO REVIEW

After skills audit passes, review SEO.

### SEO Checklist

```markdown
## SEO Audit

### Technical SEO
- [ ] robots.txt configured
- [ ] sitemap.xml generated
- [ ] Canonical URLs set
- [ ] Structured data (JSON-LD)

### On-Page SEO
- [ ] Unique title tags (< 60 chars)
- [ ] Meta descriptions (< 160 chars)
- [ ] H1 on every page
- [ ] Alt text on images
- [ ] Internal linking

### Performance SEO
- [ ] LCP < 2.5s
- [ ] Images optimized (next/image)
- [ ] Fonts optimized (next/font)
- [ ] No render-blocking resources

### Social SEO
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] OG image (1200x630)
```

### SEO Output

```
website-builds/<slug>/
└── audits/
    └── seo_review.md              # REQUIRED
```

---

## PHASE 8: RALPH POLISH LOOP (MANDATORY)

After all audits pass, Claude runs the UX Polish Loop with **Playwright E2E testing**.

### Ralph Loop Structure

Every generated website includes:

```
website-builds/<slug>/
├── ralph/
│   ├── PRD.md              # Product requirements
│   ├── ACCEPTANCE.md       # Acceptance criteria + completion promise
│   ├── LOOP.md             # Loop execution instructions
│   ├── PROGRESS.md         # Pass-by-pass progress log
│   └── QA_NOTES.md         # Manual QA observations
├── tests/
│   └── e2e/
│       ├── smoke.spec.ts   # Core smoke tests
│       └── contact.spec.ts # Form tests (if applicable)
├── playwright.config.ts    # Playwright configuration
└── scripts/
    └── ralph_loop_runner.sh  # Human-in-the-loop runner
```

### Running the Polish Loop

```bash
cd website-builds/<slug>
npm install
npm run polish:ux    # Runs ralph_loop_runner.sh
```

Or manually:

```bash
npm run lint
npm run typecheck
npm run test:e2e     # Runs Playwright tests
```

### The 20-Pass System

Each pass:
1. Runs lint, typecheck, and E2E tests
2. If failures: fix highest-impact issue
3. If passing: make one high-leverage polish improvement
4. Documents in `ralph/PROGRESS.md`
5. Continues until completion promise or max 20 passes

### The Completion Promise

The loop completes ONLY when this exact string is written to `ralph/PROGRESS.md`:

```
COMPLETION_PROMISE: All acceptance criteria met. UI is production-ready.
```

**This promise requires:**
- All E2E tests pass
- All lint/typecheck passes
- All acceptance criteria in `ACCEPTANCE.md` verified
- No CRITICAL or HIGH issues remaining

### Package.json Scripts

Generated websites include:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "polish:ux": "./scripts/ralph_loop_runner.sh"
  }
}
```

### Default E2E Tests

Every website gets these smoke tests:

1. **Home page loads** - Page title exists, no error states
2. **Main content visible** - Main element has content
3. **Navigation works** - Can navigate to about/work/contact
4. **No console errors** - Critical errors fail the test
5. **Responsive design** - No horizontal scroll on mobile
6. **Accessibility basics** - h1 exists, images have alt, keyboard navigation

### Pass Criteria

```
Ralph PASS if:
  - npm run test:e2e passes
  - npm run lint passes
  - npm run typecheck passes
  - All ACCEPTANCE.md criteria verified
  - Completion promise written
```

---

## Output Directories

| Directory | Purpose | Contents |
|-----------|---------|----------|
| `website-builds/<slug>/` | **Primary output** | Complete website + audits |
| `runs/YYYY-MM-DD/website-<timestamp>/` | Execution artifacts | Spec, reports, Ralph verdicts |

---

## Guardrails

### DO

- Normalize intent before planning
- Research before building
- Build Information Architecture first
- Run skills audits BEFORE Ralph
- Optimize for Core Web Vitals
- Use Server Components by default
- Add Framer Motion animations
- Include comprehensive SEO

### DO NOT

- Skip Intent Normalization
- Skip Research phase
- Skip Skills Audits (they are MANDATORY)
- Use `'use client'` unnecessarily
- Use barrel imports
- Skip accessibility requirements
- Deploy without audit reports
- Claim success without Ralph PASS

---

## Default Assumptions

When the user doesn't specify:

| Aspect | Default |
|--------|---------|
| Framework | Next.js 14 (App Router) |
| Hosting | Vercel |
| Dark mode | Enabled |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| SEO | next-seo configured |
| Performance | Core Web Vitals compliant |

---

## Success Definition

A successful execution produces:

1. Complete website in `website-builds/<slug>/`
2. Skills audit reports (PASS)
3. SEO review (PASS)
4. Ralph PASS verdict
5. Website runs with `npm run dev`
6. Website builds with `npm run build`
7. Ready for `vercel deploy`

---

## Quickstart

```bash
cd website-pipeline
claude
# Describe: "Build a portfolio website for a photographer with project gallery"
# Claude builds complete website in website-builds/<slug>/

# When done:
cd website-builds/<slug>
npm install
npm run dev
# Open http://localhost:3000

# Deploy:
vercel deploy
```

---

## MCP INTEGRATION (OPTIONAL)

> **Note**: MCP (Model Context Protocol) is the **specification** that governs how AI systems communicate with tools. The entries below are **MCP servers** (implementations) that follow the MCP spec. For full governance details, see `plugin-factory/CLAUDE.md` under "MCP GOVERNANCE". For the specification itself: https://github.com/modelcontextprotocol

This pipeline supports the following MCP servers as defined in `plugin-factory/mcp.catalog.json`:

| MCP | Phase | Permission | Purpose |
|-----|-------|------------|---------|
| Playwright | verify, ralph | read-only | E2E testing, UI verification |
| Vercel | deploy | read-only | Deployment management, log analysis |
| Figma | research, build | read-only | Design token extraction, component specs |
| GitHub | all | read-write | Already integrated via Claude Code |

### MCP Usage Rules

1. **MCPs are opt-in** - Websites work without any MCP integration
2. **Phase-gated** - MCPs only available in specified phases
3. **Figma recommended** - Design token extraction significantly improves design fidelity
4. **Artifacts logged** - All MCP operations logged to `runs/<date>/<run-id>/mcp-logs/`

### Figma Integration (Recommended)

When a Figma file is available:
1. Connect via `claude mcp add --transport http figma https://mcp.figma.com/mcp`
2. Extract design tokens during Phase 4 (Design System)
3. Component specs inform Phase 5 (Build)

See `plugin-factory/mcp.catalog.json` for full configuration details.

---

## Version History

- **1.3** (2026-01-18): Added MCP governance note - MCP is spec, MCP servers are tools
- **1.2** (2026-01-18): Added MCP integration catalog reference
- **1.1** (2026-01-18): Added UX Polish Loop with Playwright E2E testing
- **1.0** (2026-01-18): Initial release with mandatory skills audits
