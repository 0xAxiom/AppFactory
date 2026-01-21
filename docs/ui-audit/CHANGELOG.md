# React-Aware Pipelines & Website Pipeline - Changelog

**Date:** 2026-01-18
**Author:** Claude (Opus 4.5)
**Task:** Make all pipelines "React-aware" via Vercel agent-skills integration + create website-pipeline

---

## Executive Summary

This update integrates Vercel's agent-skills into all React-capable pipelines (app-factory, dapp-factory) and creates a new website-pipeline optimized for building production-ready websites with mandatory skills audits.

---

## Files Added

### Central Documentation

| File                                       | Purpose                                               |
| ------------------------------------------ | ----------------------------------------------------- |
| `/docs/third_party/vercel_agent_skills.md` | Documents the Vercel agent-skills integration pattern |
| `/docs/pipelines/SKILLS_SYSTEM.md`         | Central skills invocation interface specification     |

### dapp-factory Integration

| File                                  | Purpose                             |
| ------------------------------------- | ----------------------------------- |
| `/dapp-factory/docs/QUALITY_GATES.md` | Gate specifications for dApp builds |
| `/dapp-factory/docs/SKILLS_USED.md`   | Skills reference with code examples |

### app-factory Integration

| File                                 | Purpose                             |
| ------------------------------------ | ----------------------------------- |
| `/app-factory/docs/QUALITY_GATES.md` | Mobile-specific gate specifications |
| `/app-factory/docs/SKILLS_USED.md`   | React Native skills reference       |

### website-pipeline (New Pipeline - 15 files)

| File                                                      | Purpose                           |
| --------------------------------------------------------- | --------------------------------- |
| `/website-pipeline/CLAUDE.md`                             | Pipeline constitution (8 phases)  |
| `/website-pipeline/README.md`                             | User documentation                |
| `/website-pipeline/ARCHITECTURE.md`                       | Technical architecture diagrams   |
| `/website-pipeline/skills/react-best-practices/SKILL.md`  | Performance optimization rules    |
| `/website-pipeline/skills/web-design-guidelines/SKILL.md` | UI/UX/accessibility rules         |
| `/website-pipeline/skills/seo-guidelines/SKILL.md`        | SEO rules (new, website-specific) |
| `/website-pipeline/docs/QUALITY_GATES.md`                 | Three mandatory gates             |
| `/website-pipeline/docs/SKILLS_USED.md`                   | Skills invocation schedule        |

### Demo Website (40+ files)

```
/website-pipeline/example/
├── runs/2026-01-18/luminary-001/
│   ├── inputs/
│   │   ├── raw_input.md
│   │   ├── normalized_prompt.md
│   │   └── dream_spec.md
│   └── polish/
│       ├── ralph_report_1.md
│       └── ralph_final_verdict.md
└── website-builds/luminary-studio/
    ├── package.json
    ├── tsconfig.json
    ├── next.config.js
    ├── tailwind.config.ts
    ├── postcss.config.js
    ├── vercel.json
    ├── .env.example
    ├── README.md
    ├── DEPLOYMENT.md
    ├── public/robots.txt
    ├── src/app/layout.tsx
    ├── src/app/page.tsx
    ├── src/app/globals.css
    ├── src/app/not-found.tsx
    ├── src/app/sitemap.ts
    ├── src/lib/fonts.ts
    ├── src/lib/utils.ts
    ├── src/lib/data/projects.ts
    ├── src/lib/data/services.ts
    ├── src/lib/data/team.ts
    ├── src/components/ui/button.tsx
    ├── src/components/layout/header.tsx
    ├── src/components/layout/footer.tsx
    ├── src/components/sections/project-card.tsx
    ├── research/market_research.md
    ├── research/competitor_analysis.md
    ├── research/positioning.md
    ├── planning/sitemap.md
    ├── planning/content_model.md
    ├── planning/navigation.md
    ├── planning/design_system.md
    ├── audits/react-best-practices.md
    ├── audits/web-design-guidelines.md
    ├── audits/audit_summary.md
    ├── audits/seo_review.md
    └── audits/audit_resolution.md
```

---

## Files Modified

None. All existing pipeline files were preserved as-is. The integration is additive.

---

## Renames

None.

---

## Agent-Skills Integration Per Pipeline

### dapp-factory

**Skills Used:**

- `react-best-practices` - Performance optimization
- `web-interface-guidelines` - Interface quality (already present)
- `web-design-guidelines` - UI/UX polish (already present)

**Gate Configuration:**
| Gate | Skills | Pass Threshold |
|------|--------|----------------|
| Post-Build Skills Check | All 3 | ≥90% each |
| Ralph Quality Gate | All 3 | ≥97% weighted |

**Invocation Points:**

1. After Mode A/B build completes
2. During Ralph QA loop
3. Before final delivery

### app-factory

**Skills Used:**

- `react-best-practices` - React Native optimization
- `web-design-guidelines` - Mobile UI/UX

**Gate Configuration:**
| Gate | Phase | Pass Threshold |
|------|-------|----------------|
| Post-Milestone-2 UI Check | After UI complete | ≥90% |
| Post-Milestone-3 Performance | After integration | ≥95% |
| Ralph Quality Gate | Final QA | ≥97% |

**Mobile-Specific Rules:**

- FlatList for long lists (not ScrollView)
- useEffect cleanup for subscriptions
- Touch targets ≥ 44x44px

### website-pipeline (New)

**Skills Used:**

- `react-best-practices` - MANDATORY gate
- `web-design-guidelines` - MANDATORY gate
- `seo-guidelines` - MANDATORY gate (new skill)

**Gate Configuration:**
| Gate | Phase | Skills | Pass Threshold |
|------|-------|--------|----------------|
| Gate 1: Skills Audit | Phase 6 | react-best-practices, web-design-guidelines | ≥95%, ≥90% |
| Gate 2: SEO Review | Phase 7 | seo-guidelines | All items pass |
| Gate 3: Ralph Polish | Phase 8 | All | ≥97% weighted |

---

## What Each Skill Gate Enforces

### react-best-practices (CRITICAL)

| Rule Category     | Impact   | Key Rules                                         |
| ----------------- | -------- | ------------------------------------------------- |
| Async Patterns    | CRITICAL | Promise.all for parallel ops, defer await         |
| Bundle Size       | CRITICAL | No barrel imports, dynamic imports for heavy deps |
| Server Components | HIGH     | Default to server, minimize 'use client'          |
| Caching           | HIGH     | Cache server data fetches                         |
| Images/Fonts      | HIGH     | next/image, next/font required                    |

**Blocking Conditions:**

- ANY CRITICAL violation → BLOCKED
- Score < 95% → FAIL

### web-design-guidelines (HIGH Accessibility)

| Rule Category      | Impact | Key Rules                                          |
| ------------------ | ------ | -------------------------------------------------- |
| Accessibility      | HIGH   | Semantic HTML, ARIA labels, contrast, keyboard nav |
| Focus States       | HIGH   | Visible indicators, no focus traps                 |
| Animation          | MEDIUM | Page transitions, hover feedback, reduced motion   |
| Loading States     | MEDIUM | Skeleton loaders, button states                    |
| Empty/Error States | MEDIUM | Designed states with CTAs                          |

**Blocking Conditions:**

- ANY HIGH accessibility violation → BLOCKED
- Score < 90% → FAIL

### seo-guidelines (Website-Specific)

| Rule Category   | Impact | Key Rules                                            |
| --------------- | ------ | ---------------------------------------------------- |
| Technical SEO   | HIGH   | robots.txt, sitemap, canonical URLs, structured data |
| On-Page SEO     | HIGH   | Title tags, meta descriptions, heading hierarchy     |
| Performance SEO | HIGH   | Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1) |
| Social SEO      | MEDIUM | OG tags, Twitter cards, OG image                     |

**Blocking Conditions:**

- ANY Technical SEO failure → FAIL
- ANY On-Page SEO failure → FAIL

---

## How website-pipeline Works

### 8-Phase Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                     WEBSITE-PIPELINE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PHASE 0: Intent Normalization                                  │
│  ↓ Upgrade vague idea → publishable website spec                │
│                                                                 │
│  PHASE 1: Dream Spec Author                                     │
│  ↓ 12-section comprehensive specification                       │
│                                                                 │
│  PHASE 2: Research & Positioning                                │
│  ↓ Market research, competitor analysis                         │
│                                                                 │
│  PHASE 3: Information Architecture                              │
│  ↓ Sitemap, content model, navigation                           │
│                                                                 │
│  PHASE 4: Design System                                         │
│  ↓ Colors, typography, spacing, components                      │
│                                                                 │
│  PHASE 5: Build                                                 │
│  ↓ Complete Next.js website                                     │
│                                                                 │
│  PHASE 6: Skills Audit ◆ GATE 1                                 │
│  ↓ react-best-practices + web-design-guidelines                 │
│                                                                 │
│  PHASE 7: SEO Review ◆ GATE 2                                   │
│  ↓ Technical, on-page, performance, social SEO                  │
│                                                                 │
│  PHASE 8: Ralph Polish Loop ◆ GATE 3                            │
│  → Final QA until ≥97%                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Opinionated Stack

| Component  | Technology              |
| ---------- | ----------------------- |
| Framework  | Next.js 14 (App Router) |
| Language   | TypeScript              |
| Styling    | Tailwind CSS            |
| Components | shadcn/ui               |
| Animation  | Framer Motion           |
| Forms      | React Hook Form + Zod   |
| Icons      | Lucide React            |
| Deployment | Vercel                  |

### Output Structure

```
website-builds/<slug>/
├── [Next.js project files]
├── research/           # Market research
├── planning/           # IA documents
└── audits/             # Skills audit reports

runs/YYYY-MM-DD/<run-id>/
├── inputs/             # Spec documents
└── polish/             # Ralph reports
```

---

## How to Run the Example / Verify Outputs

### 1. Navigate to Example

```bash
cd /Users/melted/Documents/GitHub/AppFactory/website-pipeline/example/website-builds/luminary-studio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 to view the website.

### 4. Build for Production

```bash
npm run build
```

### 5. Verify Audit Reports

```bash
# View audit results
cat audits/audit_summary.md
cat audits/react-best-practices.md
cat audits/web-design-guidelines.md
cat audits/seo_review.md
```

### 6. View Pipeline Execution Artifacts

```bash
# View the dream spec
cat ../runs/2026-01-18/luminary-001/inputs/dream_spec.md

# View Ralph's verdict
cat ../runs/2026-01-18/luminary-001/polish/ralph_final_verdict.md
```

### 7. Deploy to Vercel

```bash
vercel deploy --prod
```

---

## Verification Checklist

- [x] All pipelines have skills documentation
- [x] dapp-factory has QUALITY_GATES.md and SKILLS_USED.md
- [x] app-factory has QUALITY_GATES.md and SKILLS_USED.md
- [x] website-pipeline has complete constitution (CLAUDE.md)
- [x] website-pipeline has 3 skills with SKILL.md files
- [x] Demo website has all planning artifacts
- [x] Demo website has all audit reports
- [x] Demo website code matches spec
- [x] Demo website passes all gates (100% Ralph score)

---

## Total Files Added

| Category              | Count   |
| --------------------- | ------- |
| Central docs          | 2       |
| dapp-factory docs     | 2       |
| app-factory docs      | 2       |
| website-pipeline core | 8       |
| Demo website          | 40+     |
| **Total**             | **55+** |

---

## Conclusion

All six phases are complete:

1. ✅ **Phase 0:** Discovered all pipelines, identified React-capable ones
2. ✅ **Phase 1:** Documented Vercel agent-skills integration pattern
3. ✅ **Phase 2:** Created central SKILLS_SYSTEM.md specification
4. ✅ **Phase 3:** Integrated skills into app-factory and dapp-factory
5. ✅ **Phase 4:** Created website-pipeline with 3 mandatory skills
6. ✅ **Phase 5:** Built complete Luminary Studio demo (100% pass)
7. ✅ **Phase 6:** This changelog

The AppFactory mono-repo is now fully "React-aware" with standardized skills integration across all applicable pipelines.
