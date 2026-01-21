# Website Pipeline Architecture

**Version:** 1.0
**Last Updated:** 2026-01-18

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INPUT                                │
│                  "Build a portfolio website"                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PHASE 0: Intent Normalization                  │
│                                                                  │
│  • Parse raw input                                               │
│  • Infer website type                                            │
│  • Add missing requirements                                      │
│  • Output: normalized_prompt.md                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PHASE 1: Dream Spec Author                     │
│                                                                  │
│  • 12-section specification                                      │
│  • Performance budgets                                           │
│  • Accessibility requirements                                    │
│  • Output: dream_spec.md                                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PHASE 2-4: Planning                            │
│                                                                  │
│  • Research: market_research.md, competitor_analysis.md          │
│  • IA: sitemap.md, content_model.md, navigation.md               │
│  • Design: design_system.md                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PHASE 5: Build                                 │
│                                                                  │
│  • Generate Next.js project                                      │
│  • Implement pages and components                                │
│  • Apply design system                                           │
│  • Output: website-builds/<slug>/                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              PHASE 6: SKILLS AUDIT (MANDATORY)                   │
│                                                                  │
│  ┌───────────────────────┐    ┌───────────────────────┐         │
│  │ react-best-practices  │    │ web-design-guidelines │         │
│  │                       │    │                       │         │
│  │ • Bundle optimization │    │ • Accessibility       │         │
│  │ • Server components   │    │ • Focus states        │         │
│  │ • Data fetching       │    │ • Animations          │         │
│  │ • Code splitting      │    │ • Typography          │         │
│  │                       │    │ • Loading states      │         │
│  │ Threshold: ≥95%       │    │ Threshold: ≥90%       │         │
│  └───────────────────────┘    └───────────────────────┘         │
│                              │                                   │
│                              ▼                                   │
│                    ┌─────────────────┐                          │
│                    │   GATE CHECK    │                          │
│                    │                 │                          │
│                    │  PASS? ──────▶ Continue                    │
│                    │  FAIL? ──────▶ Fix & Retry (max 3)         │
│                    └─────────────────┘                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PHASE 7: SEO Review                            │
│                                                                  │
│  • Technical SEO (robots.txt, sitemap)                           │
│  • On-page SEO (titles, descriptions)                            │
│  • Performance SEO (Core Web Vitals)                             │
│  • Social SEO (OG tags, Twitter cards)                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PHASE 8: Ralph Polish Loop                     │
│                                                                  │
│  • Build quality (25%)                                           │
│  • Skills compliance (30%)                                       │
│  • SEO quality (20%)                                             │
│  • Content quality (15%)                                         │
│  • Documentation (10%)                                           │
│                                                                  │
│  Threshold: ≥97%                                                 │
│  Max iterations: 3                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        OUTPUT                                    │
│                                                                  │
│  website-builds/<slug>/                                          │
│  ├── Complete Next.js website                                    │
│  ├── Audit reports (PASS)                                        │
│  ├── SEO review (PASS)                                           │
│  └── Ready for vercel deploy                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
website-pipeline/
├── CLAUDE.md                 # Pipeline constitution
├── README.md                 # User documentation
├── ARCHITECTURE.md           # This file
├── skills/
│   ├── react-best-practices/
│   │   ├── SKILL.md          # Usage reference
│   │   └── AGENTS.md         # Full rules
│   ├── web-design-guidelines/
│   │   ├── SKILL.md
│   │   └── AGENTS.md
│   └── seo-guidelines/
│       └── SKILL.md
├── templates/
│   └── system/
│       ├── dream_spec_author.md
│       ├── ralph_polish_loop.md
│       └── seo_review.md
├── docs/
│   ├── QUALITY_GATES.md
│   └── SKILLS_USED.md
├── example/                  # Demo website
├── website-builds/           # Generated websites (output)
└── runs/                     # Execution logs
```

---

## Generated Website Structure

```
website-builds/<slug>/
├── package.json
├── package-lock.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── vercel.json
├── .env.example
├── .gitignore
├── README.md
├── DEPLOYMENT.md
│
├── research/
│   ├── market_research.md
│   ├── competitor_analysis.md
│   └── positioning.md
│
├── planning/
│   ├── sitemap.md
│   ├── content_model.md
│   ├── navigation.md
│   └── design_system.md
│
├── audits/
│   ├── react-best-practices.md
│   ├── web-design-guidelines.md
│   ├── seo_review.md
│   └── audit_summary.md
│
├── public/
│   ├── favicon.ico
│   ├── og-image.png
│   ├── robots.txt
│   └── sitemap.xml
│
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   ├── globals.css       # Global styles
│   │   ├── not-found.tsx     # 404 page
│   │   ├── error.tsx         # Error boundary
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── work/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   └── contact/
│   │       └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   └── navigation.tsx
│   │   └── sections/
│   │       ├── hero.tsx
│   │       ├── features.tsx
│   │       ├── testimonials.tsx
│   │       └── cta.tsx
│   │
│   ├── lib/
│   │   ├── utils.ts          # Utility functions (cn, etc.)
│   │   └── fonts.ts          # Font configuration
│   │
│   └── styles/
│       └── design-tokens.ts  # Exported design tokens
│
└── content/                  # MDX content (if blog)
    └── posts/
```

---

## Skills Integration

### Audit Flow

```
Build Completes
      │
      ▼
┌─────────────────────────────────────────────┐
│           react-best-practices              │
│                                             │
│  Scan: src/**/*.{ts,tsx}                    │
│  Rules: 40+ (8 categories)                  │
│  Pass: ≥95%, no CRITICAL                    │
│                                             │
│  Output: audits/react-best-practices.md     │
└─────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────┐
│           web-design-guidelines             │
│                                             │
│  Scan: src/**/*.tsx                         │
│  Rules: 100+ (11 categories)                │
│  Pass: ≥90%, no HIGH a11y                   │
│                                             │
│  Output: audits/web-design-guidelines.md    │
└─────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────┐
│             audit_summary.md                │
│                                             │
│  Combined scores                            │
│  Violation list                             │
│  Required fixes                             │
│  Gate verdict: PASS/FAIL                    │
└─────────────────────────────────────────────┘
```

### Report Format

```markdown
# Skills Audit Summary

**Website:** <slug>
**Generated:** <timestamp>

## Audit Results

| Skill                 | Score | Violations | Verdict |
| --------------------- | ----- | ---------- | ------- |
| react-best-practices  | 96%   | 2 MEDIUM   | PASS    |
| web-design-guidelines | 92%   | 1 MEDIUM   | PASS    |

## Combined Verdict: PASS

## Violations

### react-best-practices

1. **[MEDIUM] bundle-imports** - `src/components/index.ts:3`
   - Found barrel import
   - Fix: Import directly from component files

### web-design-guidelines

1. **[MEDIUM] LS1** - `src/app/work/page.tsx:45`
   - Missing skeleton loader for async content
   - Fix: Add Skeleton component during loading

## Fixes Applied

- [x] Removed barrel export in components/index.ts
- [x] Added skeleton loader to work page

## Re-audit Results

| Skill                 | Score | Verdict |
| --------------------- | ----- | ------- |
| react-best-practices  | 100%  | PASS    |
| web-design-guidelines | 96%   | PASS    |

**Final Verdict: PASS**
```

---

## Technology Decisions

### Why Next.js 14?

| Consideration           | Decision   | Rationale             |
| ----------------------- | ---------- | --------------------- |
| SSR/SSG                 | Next.js    | Built-in, optimized   |
| React Server Components | Supported  | Better performance    |
| Vercel deployment       | Native     | Zero-config           |
| Image optimization      | next/image | Automatic             |
| Font optimization       | next/font  | Automatic             |
| SEO                     | Strong     | Built-in metadata API |

### Why Tailwind CSS?

| Consideration | Decision      | Rationale                 |
| ------------- | ------------- | ------------------------- |
| Design system | Utility-first | Easy to customize         |
| Bundle size   | JIT           | Only used classes shipped |
| Dark mode     | Built-in      | `dark:` variants          |
| Responsive    | Built-in      | `sm:`, `md:`, etc.        |

### Why shadcn/ui?

| Consideration | Decision         | Rationale             |
| ------------- | ---------------- | --------------------- |
| Customization | Copy-paste       | Full control          |
| Accessibility | Radix primitives | WCAG compliant        |
| Dependencies  | Minimal          | Not an npm package    |
| Styling       | Tailwind         | Consistent with stack |

### Why Framer Motion?

| Consideration         | Decision    | Rationale          |
| --------------------- | ----------- | ------------------ |
| web-design-guidelines | Required    | AN1 rule           |
| Performance           | Optimized   | GPU-accelerated    |
| API                   | Declarative | Easy to use        |
| SSR                   | Compatible  | Works with Next.js |

---

## Performance Architecture

### Core Web Vitals Strategy

```
LCP < 2.5s
├── Server Components (no JS for static content)
├── Image optimization (next/image)
├── Font optimization (next/font)
└── Critical CSS inlined

FID < 100ms
├── Minimal client JS
├── Code splitting (dynamic imports)
└── Event delegation

CLS < 0.1
├── Image dimensions specified
├── Font display: swap with fallback
└── Skeleton loaders for async content

TTFB < 800ms
├── Edge runtime where applicable
├── Static generation (SSG)
└── Incremental Static Regeneration (ISR)
```

### Bundle Strategy

```
Target: < 200KB initial

Techniques:
├── Server Components by default
├── Dynamic imports for heavy components
│   └── Charts, Maps, Rich editors
├── Tree shaking (barrel import avoidance)
├── Route-based code splitting
└── Asset optimization
    ├── Images: WebP/AVIF
    ├── Fonts: Subset + woff2
    └── SVGs: Inline or sprite
```

---

## Error Handling

### Build Failures

```
Error: TypeScript errors
└── Fix: Resolve all type errors before proceeding

Error: Skills audit fails
└── Fix: Address violations, re-run audit (max 3 attempts)

Error: Ralph fails 3 times
└── Manual intervention required
    ├── Review runs/.../polish/ralph_final_verdict.md
    ├── Fix remaining issues manually
    └── Resume pipeline
```

### Runtime Errors

```
src/app/error.tsx
└── Global error boundary
    ├── Logs error to console
    ├── Shows user-friendly message
    └── Provides retry option

src/app/not-found.tsx
└── 404 page
    ├── Designed empty state
    ├── Navigation options
    └── Search (if applicable)
```

---

## Version History

- **1.0** (2026-01-18): Initial architecture specification
