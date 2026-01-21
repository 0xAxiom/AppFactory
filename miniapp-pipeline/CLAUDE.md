# MiniApp Pipeline

**Version**: 2.0.0
**Mode**: Base Mini App Generator (MiniKit + Next.js)
**Status**: MANDATORY CONSTITUTION

---

## 1. PURPOSE & SCOPE

### What This Pipeline Does

MiniApp Pipeline generates **production-ready Base Mini Apps** - applications that run inside the Base app using MiniKit and Next.js. It handles the complete lifecycle from concept to publication, including manifest configuration, account association guidance, and quality validation.

Base Mini Apps are Farcaster-compatible applications discovered and launched within the Base app ecosystem. They require:

- A Next.js application with MiniKit integration
- A properly configured manifest at `/.well-known/farcaster.json`
- Account association credentials proving domain ownership
- Proper asset images meeting Base specifications

### What This Pipeline Does NOT Do

| Action                       | Reason                    | Where It Belongs     |
| ---------------------------- | ------------------------- | -------------------- |
| Build mobile apps            | Wrong output format       | app-factory          |
| Build dApps/websites         | Wrong output format       | dapp-factory         |
| Generate AI agent scaffolds  | Wrong pipeline            | agent-factory        |
| Generate Claude plugins      | Wrong pipeline            | plugin-factory       |
| Deploy automatically         | Requires user approval    | Manual Vercel deploy |
| Generate account association | User-specific credentials | Manual step          |

### Output Directory

All generated mini apps are written to: `builds/miniapps/<slug>/`

### Boundary Enforcement

Claude MUST NOT write files outside `miniapp-pipeline/` directory. Specifically forbidden:

- `app-factory/builds/` (belongs to app-factory)
- `dapp-builds/` (belongs to dapp-factory)
- `outputs/` (belongs to agent-factory)
- Any path outside the repository

---

## 2. CANONICAL USER FLOW

```
User: "I want a mini app that lets users share daily gratitude posts"

┌─────────────────────────────────────────────────────────────────┐
│ STAGE M0: INTENT NORMALIZATION                                  │
│ Claude transforms raw input → structured mini app concept       │
│ Output: builds/miniapps/<slug>/artifacts/inputs/                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STAGE M1: TEMPLATE SELECTION & SCAFFOLD PLAN                    │
│ Claude plans route structure, components, data layer            │
│ Output: builds/miniapps/<slug>/artifacts/stage01/               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STAGE M2: SCAFFOLD PROJECT                                      │
│ Claude generates Next.js application structure                  │
│ Output: builds/miniapps/<slug>/app/                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STAGE M3: MANIFEST & METADATA AUTHORING                         │
│ Claude configures minikit.config.ts and placeholder assets      │
│ Output: builds/miniapps/<slug>/app/minikit.config.ts            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STAGE M4: VERCEL DEPLOYMENT PLAN                                │
│ Claude provides step-by-step deployment instructions            │
│ Output: builds/miniapps/<slug>/artifacts/stage04/DEPLOYMENT.md  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STAGE M5: ACCOUNT ASSOCIATION (MANUAL)                          │
│ ⚠️ PIPELINE PAUSES - User must complete account association     │
│ Output: builds/miniapps/<slug>/artifacts/stage05/               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STAGE M6-M9: VALIDATION & HARDENING                             │
│ Claude validates, hardens, and runs proof gate                  │
│ Output: builds/miniapps/<slug>/artifacts/stage06-09/            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STAGE M10: RALPH MODE (ADVERSARIAL QA)                          │
│ Rigorous quality assurance through adversarial review           │
│ Output: builds/miniapps/<slug>/artifacts/polish/                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
          User receives deployable Base Mini App
```

---

## 3. DIRECTORY MAP

```
miniapp-pipeline/
├── CLAUDE.md                 # This constitution (CANONICAL)
├── README.md                 # User documentation
├── scripts/
│   ├── miniapp_proof_gate.sh
│   ├── check_account_association.ts
│   ├── check_manifest_assets.ts
│   └── validate_manifest.ts
├── vendor/
│   └── base-miniapps/        # Cached Base documentation
│       ├── create-new-miniapp.md
│       ├── manifest.md
│       ├── sign-manifest.md
│       ├── common-issues.md
│       └── create-manifest-route.md
├── builds/                   # Generated mini apps (OUTPUT DIRECTORY)
│   └── miniapps/
│       └── <slug>/
│           ├── app/          # The Next.js application
│           └── artifacts/    # Pipeline outputs
└── templates/
    └── minikit-starter/
```

### Directory Boundaries

| Directory                           | Purpose                        | Who Writes  | Distributable |
| ----------------------------------- | ------------------------------ | ----------- | ------------- |
| `builds/miniapps/<slug>/app/`       | Final Next.js application      | Claude      | YES           |
| `builds/miniapps/<slug>/artifacts/` | Pipeline outputs               | Claude      | NO            |
| `vendor/`                           | Cached reference documentation | Maintainers | NO            |

---

## 4. MODES

### INFRA MODE (Default)

When Claude enters `miniapp-pipeline/` without an active build:

- Explains what MiniApp Pipeline does
- Lists recent builds in `builds/miniapps/`
- Awaits user's mini app description
- Does NOT generate code until user provides intent

**Infra Mode Indicators:**

- No active build session
- User asking questions or exploring
- No stage initiated

### BUILD MODE

When Claude is executing a mini app build:

- Has active `builds/miniapps/<slug>/` directory
- User has provided mini app intent
- Claude is generating files

**BUILD MODE Stages:**

- M0: Intent Normalization
- M1: Template Selection & Scaffold Plan
- M2: Scaffold Project
- M3: Manifest & Metadata Authoring
- M4: Vercel Deployment Plan
- M5: Account Association (MANUAL PAUSE)
- M6: Preview Tool Validation
- M7: Production Hardening
- M8: Proof Gate
- M9: Publish Checklist
- M10: Ralph Mode

### QA MODE (Ralph)

When Claude enters Stage M10:

- Adopts adversarial QA persona
- Evaluates against quality checklist
- Iterates until APPROVED (max 3 iterations)

---

## 5. PHASE MODEL

### STAGE M0: INTENT NORMALIZATION (MANDATORY)

Transform raw user input into a structured mini app concept.

**Output:** `inputs/normalized_prompt.md`

```markdown
# Mini App Concept

## Name

[Suggested app name]

## Tagline

[One-line description, max 30 chars]

## Description

[Detailed description, max 170 chars]

## Target Users

[Who will use this app]

## Core Loop

[Primary user interaction flow]

## Category

[One of: games, social, finance, utility, productivity, health-fitness,
news-media, music, shopping, education, developer-tools, entertainment,
art-creativity]

## Tags

[Up to 5 lowercase tags]

## Sharing Context

[How users will discover/share this in Base]

## Onchain Requirements

[None / Wallet connection / Transactions / Smart contracts]
```

### STAGE M1: TEMPLATE SELECTION & SCAFFOLD PLAN

Plan route structure, components, data layer, assets.

**Output:** `stage01/scaffold_plan.md`

### STAGE M2: SCAFFOLD PROJECT

Generate the Next.js application structure.

**Output Directory:** `builds/miniapps/<slug>/app/`

**Generated Structure:**

```
builds/miniapps/<slug>/
├── app/
│   ├── app/
│   │   ├── .well-known/
│   │   │   └── farcaster.json/
│   │   │       └── route.ts
│   │   ├── api/
│   │   │   └── webhook/
│   │   │       └── route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   ├── public/
│   │   ├── icon.png
│   │   ├── splash.png
│   │   ├── hero.png
│   │   ├── og.png
│   │   └── screenshots/
│   ├── minikit.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── .env.example
│   └── .gitignore
└── artifacts/
```

### STAGE M3: MANIFEST & METADATA AUTHORING

Configure manifest and generate placeholder assets.

**Output:**

- Updated `minikit.config.ts`
- Placeholder images in `public/`
- `stage03/manifest_config.md`

### STAGE M4: VERCEL DEPLOYMENT PLAN

Provide step-by-step deployment instructions.

**Output:** `stage04/DEPLOYMENT.md`

### STAGE M5: ACCOUNT ASSOCIATION (MANUAL STEP)

**⚠️ PIPELINE PAUSES HERE - User must complete account association.**

This stage requires USER ACTION. Claude provides instructions but CANNOT generate account association values.

**Resume Condition:** `minikit.config.ts` has non-empty `header`, `payload`, and `signature` values.

### STAGE M6-M9: VALIDATION & HARDENING

- M6: Preview Tool Validation - Validate using Base's preview tool
- M7: Production Hardening - Add error boundaries, loading states, fallbacks
- M8: Proof Gate - Verify build integrity (npm install, build, lint, typecheck)
- M9: Publish Checklist - Final publication guidance

### STAGE M10: RALPH MODE (MANDATORY)

Rigorous adversarial QA review.

**Ralph Review Checklist:**

- Manifest correctness (all fields, character limits, image dimensions)
- Account association (header/payload/signature non-empty)
- Preview tool (all three tabs show success)
- Code quality (no TS errors, no console errors, error boundaries)
- UX review (loads quickly, intuitive, touch targets, no gesture conflicts)
- Security (no exposed secrets, no hardcoded API keys)

**Final Verdict Criteria:**

- Zero critical issues
- Zero major issues
- Proof gate passes
- Preview tool shows all green

---

## 6. DELEGATION MODEL

### When miniapp-pipeline Delegates

| Trigger                 | Delegated To       | Context Passed        |
| ----------------------- | ------------------ | --------------------- |
| User says "review this" | Ralph QA persona   | Build path, checklist |
| Deploy request          | User manual action | Vercel instructions   |
| Account association     | User manual action | Base.dev instructions |

### When miniapp-pipeline Receives Delegation

| Source            | Trigger                         | Action           |
| ----------------- | ------------------------------- | ---------------- |
| Root orchestrator | `/factory run miniapp <idea>`   | Begin Stage M0   |
| User direct       | `cd miniapp-pipeline && claude` | Enter INFRA MODE |

### Role Boundaries

- **Builder Claude**: Generates code, writes files, runs stages
- **Ralph Claude**: Adversarial QA, never writes new features
- **User**: Completes account association, deploys to Vercel

---

## 7. HARD GUARDRAILS

### MUST DO

1. **MUST** normalize user intent through Stage M0 before any generation
2. **MUST** generate a complete `minikit.config.ts` as single source of truth
3. **MUST** create the manifest route at `app/.well-known/farcaster.json/route.ts`
4. **MUST** generate placeholder assets for all required images
5. **MUST** pause at Stage M5 for manual account association
6. **MUST** run proof gate (Stage M8) before declaring build complete
7. **MUST** complete Ralph Mode (Stage M10) for quality assurance

### MUST NOT

1. **MUST NOT** generate account association values - these are user-specific
2. **MUST NOT** skip the account association manual step
3. **MUST NOT** add onchain transactions unless explicitly requested
4. **MUST NOT** hardcode secrets or API keys in source files
5. **MUST NOT** deploy to Vercel automatically - provide instructions only
6. **MUST NOT** mark build complete without passing proof gate

---

## 8. REFUSAL TABLE

| Request Pattern                   | Action | Reason                        | Alternative                                    |
| --------------------------------- | ------ | ----------------------------- | ---------------------------------------------- |
| "Generate my account association" | REFUSE | User-specific credentials     | "Follow Stage M5 instructions at base.dev"     |
| "Skip account association"        | REFUSE | Required for Base app         | "Account association is mandatory"             |
| "Deploy to Vercel for me"         | REFUSE | Requires user approval        | "Follow the deployment instructions"           |
| "Skip the proof gate"             | REFUSE | Quality verification required | "Proof gate ensures the app works"             |
| "Skip Ralph QA"                   | REFUSE | QA is mandatory               | "Ralph ensures production quality"             |
| "Build a mobile app"              | REFUSE | Wrong pipeline                | "Use app-factory for mobile apps"              |
| "Build a dApp"                    | REFUSE | Wrong pipeline                | "Use dapp-factory for dApps"                   |
| "Write to dapp-builds/"           | REFUSE | Wrong directory               | "I'll write to builds/miniapps/ instead"       |
| "Add complex smart contracts"     | REFUSE | Unless explicitly requested   | "Mini apps default to no onchain requirements" |
| "Hardcode my API key"             | REFUSE | Security violation            | "Use environment variables"                    |

---

## 9. VERIFICATION & COMPLETION

### Pre-Completion Checklist

Before declaring a build complete, Claude MUST verify:

**Manifest Correctness:**

- [ ] All required fields present and valid
- [ ] Character limits respected (tagline: 30, description: 170)
- [ ] Image dimensions correct (icon: 1024x1024, splash: 200x200, hero: 1200x630)
- [ ] Category valid
- [ ] Tags properly formatted

**Account Association:**

- [ ] header/payload/signature all non-empty
- [ ] Domain matches deployment

**Build Quality:**

- [ ] `npm install` completes without errors
- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes (if configured)
- [ ] `npm run typecheck` passes (if configured)
- [ ] Manifest validation passes

**Code Quality:**

- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] Error boundaries in place
- [ ] Loading states present
- [ ] Browser fallback works

**UX Quality:**

- [ ] App loads quickly
- [ ] Core loop is intuitive
- [ ] Touch targets adequate for mobile
- [ ] No gesture conflicts

### Success Definition

A mini app build is only "done" if:

1. All stages M0-M10 completed
2. Account association present
3. Proof gate passes
4. Ralph APPROVED verdict
5. Preview tool shows all green

---

## 10. ERROR RECOVERY

### Error Categories

| Error Type                  | Detection                     | Recovery                                |
| --------------------------- | ----------------------------- | --------------------------------------- |
| Stage skip                  | Stage not in artifacts/       | Halt, restart from missed stage         |
| Account association missing | Empty fields in config        | Pause, show Stage M5 instructions       |
| Build failure               | npm build fails               | Log error, fix issue, re-run proof gate |
| Ralph rejection             | 3 iterations without APPROVED | Document blockers, escalate to user     |
| Manifest invalid            | Validation fails              | Fix fields, re-validate                 |

### Drift Detection

Claude MUST halt and reassess if:

1. About to write files outside `miniapp-pipeline/`
2. About to skip a mandatory stage
3. About to generate account association values
4. About to deploy to Vercel without user action
5. User instructions contradict invariants

### Recovery Protocol

```
1. HALT current action
2. LOG the anomaly to artifacts/errors/
3. INFORM user: "I detected [ANOMALY]. Let me reassess."
4. RESET to last known good stage
5. PRESENT options to user
6. WAIT for user direction
```

---

## 11. CROSS-LINKS

### Related Pipelines

| Pipeline         | When to Use                     | Directory              |
| ---------------- | ------------------------------- | ---------------------- |
| app-factory      | Mobile apps (Expo/React Native) | `../app-factory/`      |
| dapp-factory     | dApps and websites (Next.js)    | `../dapp-factory/`     |
| agent-factory    | AI agent scaffolds              | `../agent-factory/`    |
| plugin-factory   | Claude plugins/MCP servers      | `../plugin-factory/`   |
| website-pipeline | Static websites                 | `../website-pipeline/` |

### Shared Resources

| Resource          | Location                             | Purpose                           |
| ----------------- | ------------------------------------ | --------------------------------- |
| Root orchestrator | `../CLAUDE.md`                       | Routing, refusal, phase detection |
| Factory plugin    | `../plugins/factory/`                | `/factory` command interface      |
| MCP catalog       | `../plugin-factory/mcp.catalog.json` | MCP server configurations         |
| Base docs         | `./vendor/base-miniapps/`            | Cached reference documentation    |

### MCP Integration

This pipeline supports MCP servers as defined in `plugin-factory/mcp.catalog.json`:

| MCP Server | Stage   | Permission | Purpose                            |
| ---------- | ------- | ---------- | ---------------------------------- |
| Playwright | M6, M10 | read-only  | E2E testing, UI verification       |
| Vercel     | M4      | read-only  | Deployment management              |
| Supabase   | M2, M6  | read-only  | Database backend if needed         |
| GitHub     | all     | read-write | Already integrated via Claude Code |

**Note:** MCP is the **specification**. MCP servers are **tools** that follow the spec.

---

## 12. COMPLETION PROMISE

When Claude finishes a MiniApp Pipeline build, Claude writes this exact block to `builds/miniapps/<slug>/artifacts/polish/ralph_final_verdict.md`:

```
COMPLETION_PROMISE: All acceptance criteria met. Mini app is ready for publication.

PIPELINE: miniapp-pipeline v2.0.0
OUTPUT: builds/miniapps/<slug>/app/
RALPH_VERDICT: APPROVED
TIMESTAMP: <ISO-8601>

VERIFIED:
- [ ] Intent normalized (Stage M0)
- [ ] Scaffold planned (Stage M1)
- [ ] Project scaffolded (Stage M2)
- [ ] Manifest configured (Stage M3)
- [ ] Deployment documented (Stage M4)
- [ ] Account association complete (Stage M5)
- [ ] Preview tool validated (Stage M6)
- [ ] Production hardened (Stage M7)
- [ ] Proof gate passed (Stage M8)
- [ ] Publish checklist ready (Stage M9)
- [ ] Ralph APPROVED (Stage M10)
- [ ] npm install succeeds
- [ ] npm run build succeeds
- [ ] All manifest fields valid
- [ ] Account association non-empty
```

**This promise is non-negotiable.** Claude MUST NOT claim completion without writing this block.

---

## REFERENCE DOCUMENTATION

Cached documentation available at:

- `vendor/base-miniapps/create-new-miniapp.md`
- `vendor/base-miniapps/manifest.md`
- `vendor/base-miniapps/sign-manifest.md`
- `vendor/base-miniapps/common-issues.md`
- `vendor/base-miniapps/create-manifest-route.md`

Use these as canonical references for manifest fields, signing process, and troubleshooting.

---

## TECHNOLOGY STACK

### Core (REQUIRED)

| Component  | Technology           | Version |
| ---------- | -------------------- | ------- |
| Framework  | Next.js (App Router) | 14.0+   |
| Language   | TypeScript           | 5.0+    |
| Styling    | Tailwind CSS         | 3.4+    |
| MiniKit    | @coinbase/onchainkit | Latest  |
| Deployment | Vercel               | -       |

### Asset Requirements

| Asset       | Dimensions | Format        |
| ----------- | ---------- | ------------- |
| Icon        | 1024x1024  | PNG           |
| Splash      | 200x200    | PNG           |
| Hero        | 1200x630   | PNG           |
| Screenshots | 1284x2778  | PNG (up to 3) |
| OG Image    | 1200x630   | PNG           |

---

## VERSION HISTORY

| Version | Date       | Changes                                                           |
| ------- | ---------- | ----------------------------------------------------------------- |
| 2.0.0   | 2026-01-20 | Canonical 12-section structure, refusal table, completion promise |
| 1.2     | 2026-01-18 | Added MCP governance note                                         |
| 1.1     | 2026-01-18 | Added MCP integration catalog reference                           |
| 1.0     | 2026-01-17 | Initial release with M0-M10 stage system                          |

---

**miniapp-pipeline v2.0.0**: Describe your mini app idea. Get a production-ready Base Mini App.
