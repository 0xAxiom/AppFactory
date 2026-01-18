# MiniApp Pipeline Architecture

## Overview

The MiniApp Pipeline transforms user ideas into production-ready Base Mini Apps through a staged workflow with quality gates.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MINIAPP PIPELINE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   USER IDEA                                                                  │
│       │                                                                      │
│       ▼                                                                      │
│   ┌───────────┐                                                             │
│   │    M0     │  Intent Normalization                                       │
│   │  INTAKE   │  ─────────────────────                                      │
│   └─────┬─────┘  Raw idea → Structured concept                              │
│         │        Output: normalized_prompt.md                                │
│         ▼                                                                    │
│   ┌───────────┐                                                             │
│   │    M1     │  Template Selection                                         │
│   │   PLAN    │  ──────────────────                                         │
│   └─────┬─────┘  Choose template, plan structure                            │
│         │        Output: scaffold_plan.md                                    │
│         ▼                                                                    │
│   ┌───────────┐                                                             │
│   │    M2     │  Scaffold Generation                                        │
│   │  SCAFFOLD │  ────────────────────                                       │
│   └─────┬─────┘  Generate Next.js + MiniKit app                             │
│         │        Output: builds/miniapps/<slug>/app/                         │
│         ▼                                                                    │
│   ┌───────────┐                                                             │
│   │    M3     │  Manifest & Assets                                          │
│   │ MANIFEST  │  ─────────────────                                          │
│   └─────┬─────┘  Configure minikit.config.ts                                │
│         │        Generate placeholder images                                 │
│         ▼                                                                    │
│   ┌───────────┐                                                             │
│   │    M4     │  Deployment Guide                                           │
│   │  DEPLOY   │  ────────────────                                           │
│   └─────┬─────┘  Vercel deployment instructions                             │
│         │        Output: DEPLOYMENT.md                                       │
│         ▼                                                                    │
│   ┌───────────┐                                                             │
│   │    M5     │  ██ MANUAL STEP ██                                          │
│   │   SIGN    │  Account Association                                        │
│   └─────┬─────┘  User signs with Base Build                                 │
│         │        GATE: accountAssociation fields filled                      │
│         ▼                                                                    │
│   ┌───────────┐                                                             │
│   │    M6     │  Preview Validation                                         │
│   │ VALIDATE  │  ──────────────────                                         │
│   └─────┬─────┘  base.dev/preview checks                                    │
│         │        Output: validation_checklist.md                             │
│         ▼                                                                    │
│   ┌───────────┐                                                             │
│   │    M7     │  Production Hardening                                       │
│   │  HARDEN   │  ─────────────────────                                      │
│   └─────┬─────┘  Error boundaries, loading states                           │
│         │        Browser fallback                                            │
│         ▼                                                                    │
│   ┌───────────┐                                                             │
│   │    M8     │  ██ PROOF GATE ██                                           │
│   │   PROOF   │  Build Validation                                           │
│   └─────┬─────┘  npm install/build/lint/typecheck                           │
│         │        Manifest + asset validation                                 │
│         │        GATE: All checks must pass                                  │
│         ▼                                                                    │
│   ┌───────────┐                                                             │
│   │    M9     │  Publish Checklist                                          │
│   │ PUBLISH   │  ─────────────────                                          │
│   └─────┬─────┘  How to post in Base                                        │
│         │        Output: PUBLISH.md                                          │
│         ▼                                                                    │
│   ┌───────────┐                                                             │
│   │   M10     │  ██ RALPH MODE ██                                           │
│   │  RALPH    │  Adversarial QA (max 3 iterations)                          │
│   └─────┬─────┘  GATE: Ralph approval required                              │
│         │                                                                    │
│         ▼                                                                    │
│   ✅ COMPLETE                                                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   User Idea  │────▶│  Normalized  │────▶│   Scaffold   │
│   (string)   │     │   Concept    │     │     Plan     │
└──────────────┘     └──────────────┘     └──────────────┘
                                                 │
                    ┌────────────────────────────┘
                    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Next.js    │────▶│   Manifest   │────▶│   Account    │
│     App      │     │   Config     │     │ Association  │
└──────────────┘     └──────────────┘     └──────────────┘
                                                 │
                    ┌────────────────────────────┘
                    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Validated   │────▶│   Hardened   │────▶│   Ralph      │
│     App      │     │     App      │     │   Approved   │
└──────────────┘     └──────────────┘     └──────────────┘
```

---

## Directory Structure

### Pipeline Root
```
miniapp-pipeline/
├── CLAUDE.md              # Pipeline constitution
├── README.md              # User documentation
├── ARCHITECTURE.md        # This file
├── stages/                # Stage specifications
│   ├── m0_intake.md
│   ├── m1_plan.md
│   ├── m2_scaffold.md
│   ├── m3_manifest.md
│   ├── m4_deploy.md
│   ├── m5_sign.md
│   ├── m6_validate.md
│   ├── m7_harden.md
│   ├── m8_proof.md
│   ├── m9_publish.md
│   ├── m10_ralph.md
│   └── schemas/           # JSON schemas for outputs
│       ├── normalized_prompt.schema.json
│       ├── scaffold_plan.schema.json
│       └── build_validation.schema.json
├── templates/             # Code templates
│   ├── system/            # System prompts
│   │   ├── dream_spec_author.md
│   │   └── ralph_polish_loop.md
│   └── app_template/      # Next.js starter
│       ├── app/
│       ├── components/
│       └── public/
├── scripts/               # Validation scripts
│   ├── miniapp_proof_gate.sh
│   ├── check_account_association.ts
│   ├── check_manifest_assets.ts
│   └── validate_manifest.ts
├── builds/                # Generated apps
│   └── miniapps/
│       └── <slug>/
│           ├── app/       # The Next.js app
│           └── artifacts/ # Pipeline outputs
├── runs/                  # Session logs
│   └── YYYY-MM-DD/
│       └── <run-id>/
└── docs/                  # Additional docs
```

### Build Output Structure
```
builds/miniapps/<slug>/
├── app/                           # Next.js application
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── .well-known/
│   │   │   └── farcaster.json/
│   │   │       └── route.ts       # Manifest endpoint
│   │   └── api/
│   │       └── webhook/
│   │           └── route.ts       # Notification webhook
│   ├── components/
│   │   ├── ClientWrapper.tsx      # Browser fallback
│   │   └── [app components]
│   ├── public/
│   │   ├── icon.png               # 1024x1024
│   │   ├── splash.png             # 200x200
│   │   ├── hero.png               # 1200x630
│   │   ├── og.png                 # 1200x630
│   │   └── screenshots/
│   │       └── 1.png              # 1284x2778
│   ├── minikit.config.ts          # Single source of truth
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── .env.example
│   └── .gitignore
└── artifacts/                     # Pipeline artifacts
    ├── inputs/
    │   └── normalized_prompt.md
    ├── stage01/
    │   └── scaffold_plan.md
    ├── stage02/
    │   └── scaffold_complete.md
    ├── stage03/
    │   └── manifest_config.md
    ├── stage04/
    │   └── DEPLOYMENT.md
    ├── stage05/
    │   └── ACCOUNT_ASSOCIATION_TODO.md
    ├── stage06/
    │   └── validation_checklist.md
    ├── stage07/
    │   └── hardening_report.md
    ├── stage08/
    │   └── build_validation_summary.json
    ├── stage09/
    │   └── PUBLISH.md
    └── polish/
        ├── ralph_report_1.md
        ├── builder_resolution_1.md
        ├── ralph_report_2.md
        ├── builder_resolution_2.md
        └── ralph_final_verdict.md
```

---

## Stage Contracts

### M0: Intake

**Input**: Raw user string
**Output**: `normalized_prompt.md`
**Schema**: `schemas/normalized_prompt.schema.json`

Fields:
- name (string, max 32)
- tagline (string, max 30)
- description (string, max 170)
- targetUsers (string)
- coreLoop (string)
- category (enum)
- tags (array, max 5)
- sharingContext (string)
- onchainRequirements (enum)

### M1: Plan

**Input**: `normalized_prompt.md`
**Output**: `scaffold_plan.md`
**Schema**: `schemas/scaffold_plan.schema.json`

Fields:
- template (string)
- routes (array)
- components (array)
- dataLayer (string)
- assetsRequired (object)
- dependencies (array)

### M2: Scaffold

**Input**: `scaffold_plan.md`
**Output**: Next.js app in `app/`
**Verification**: All planned files exist

### M3: Manifest

**Input**: Stage 2 output
**Output**: Updated `minikit.config.ts`, placeholder images
**Verification**: Manifest route returns valid JSON

### M4: Deploy

**Input**: Complete scaffold
**Output**: `DEPLOYMENT.md`
**Verification**: Document is complete

### M5: Sign (MANUAL)

**Input**: Deployed app URL
**Output**: Filled `accountAssociation` in config
**Gate**: All three fields non-empty

### M6: Validate

**Input**: Signed app
**Output**: `validation_checklist.md`
**Verification**: User confirms all checks

### M7: Harden

**Input**: Validated app
**Output**: Updated components, `hardening_report.md`
**Verification**: Error handling in place

### M8: Proof (GATE)

**Input**: Hardened app
**Output**: `build_validation_summary.json`
**Gate**: All checks pass

Checks:
1. npm install succeeds
2. npm run build succeeds
3. npm run lint passes (if configured)
4. npm run typecheck passes (if configured)
5. Manifest returns valid JSON
6. Account association non-empty
7. All assets exist

### M9: Publish

**Input**: Proof gate passed
**Output**: `PUBLISH.md`
**Verification**: Document is complete

### M10: Ralph (GATE)

**Input**: Complete app
**Output**: Ralph reports, final verdict
**Gate**: Ralph approval

Process:
1. Ralph reviews (produces `ralph_report_N.md`)
2. Builder resolves (produces `builder_resolution_N.md`)
3. Repeat max 3 times
4. Final verdict (produces `ralph_final_verdict.md`)

---

## Technology Stack

### Application
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (default) or CSS Modules
- **SDK**: MiniKit for Base integration

### Deployment
- **Platform**: Vercel (recommended)
- **Domain**: Vercel-provided or custom

### Validation
- **Build**: npm scripts
- **Manifest**: Custom TypeScript validators
- **QA**: Ralph adversarial review

---

## Integration Points

### With Base App
```
Your App                    Base App
────────                    ────────
/.well-known/farcaster.json → Discovery & indexing
/                           → App launch target
/api/webhook               → Notification delivery
```

### With MiniKit SDK
```typescript
import { MiniKit } from '@coinbase/minikit';

// Initialize
const sdk = new MiniKit();

// Ready signal
await sdk.actions.ready();

// User context
const user = await sdk.user.getUser();

// Wallet (optional)
const address = await sdk.wallet.getAddress();
```

---

## Quality Gates

### Gate 1: Account Association (M5)
- Blocks progress until signed
- Validates via config check
- Manual user action required

### Gate 2: Proof Gate (M8)
- Automated validation
- All checks must pass
- Blocks without passing

### Gate 3: Ralph Mode (M10)
- Adversarial review
- Max 3 iterations
- Must achieve approval

---

## Error Handling

### Build Failures
```
Failure in M8 → Identify failing check
             → Return to appropriate stage
             → Fix and re-run proof gate
```

### Missing Association
```
Empty fields in M5 → Output reminder
                   → Block progress
                   → Wait for user action
```

### Ralph Rejection
```
Rejected 3x → Document unresolved issues
           → Provide manual guidance
           → Do not auto-publish
```

---

## Caching Strategy

### Vendor Documentation
Location: `vendor/base-miniapps/`

Cached files:
- create-new-miniapp.md
- manifest.md
- sign-manifest.md
- common-issues.md
- create-manifest-route.md

Refresh policy: Quarterly or on major Base updates

### Build Artifacts
Location: `builds/miniapps/<slug>/artifacts/`

Retained: All stage outputs
Purpose: Audit trail, debugging, iteration

---

## Security Considerations

1. **No secrets in code**: `.env.example` only
2. **No auto-signing**: User must sign manually
3. **No auto-deploy**: Instructions only
4. **Wallet validation**: Use cryptographic verification
5. **HTTPS only**: All URLs must be HTTPS
