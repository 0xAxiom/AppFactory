# MiniApp Pipeline

**Version**: 1.2
**Mode**: Base Mini App Generator (MiniKit + Next.js)
**Status**: MANDATORY CONSTITUTION

---

## Purpose

This pipeline generates production-ready **Base Mini Apps** - applications that run inside the Base app using MiniKit and Next.js. It handles the complete lifecycle from concept to publication, including manifest configuration, account association guidance, and quality validation.

Base Mini Apps are Farcaster-compatible applications discovered and launched within the Base app ecosystem. They require:
- A Next.js application with MiniKit integration
- A properly configured manifest at `/.well-known/farcaster.json`
- Account association credentials proving domain ownership
- Proper asset images meeting Base specifications

---

## For Users

```bash
cd miniapp-pipeline
claude

# Then describe your mini app idea:
# "I want a mini app that lets users share daily gratitude posts with their friends"
```

---

## ABSOLUTE RULES

### MUST

1. **MUST** normalize user intent through Stage M0 before any generation
2. **MUST** generate a complete `minikit.config.ts` as the single source of truth
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

## STAGE M0: INTENT NORMALIZATION (MANDATORY)

**Purpose**: Transform raw user input into a structured mini app concept.

**Input**: Raw user description (any format)

**Process**:
1. Extract core value proposition
2. Identify target users
3. Determine primary use case
4. Classify by Base category
5. Identify any onchain requirements (default: none)

**Output**: `inputs/normalized_prompt.md`

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
[One of: games, social, finance, utility, productivity, health-fitness, news-media, music, shopping, education, developer-tools, entertainment, art-creativity]

## Tags
[Up to 5 lowercase tags]

## Sharing Context
[How users will discover/share this in Base]

## Onchain Requirements
[None / Wallet connection / Transactions / Smart contracts]
```

---

## STAGE M1: TEMPLATE SELECTION & SCAFFOLD PLAN

**Purpose**: Decide on technical approach and plan the project structure.

**Input**: `inputs/normalized_prompt.md`

**Process**:
1. Select base template (default: MiniKit Next.js starter)
2. Plan route structure
3. Plan component hierarchy
4. Determine data storage approach (local state / API / onchain)
5. Plan asset requirements

**Output**: `stage01/scaffold_plan.md`

```markdown
# Scaffold Plan

## Template
MiniKit Next.js Starter

## Routes
- `/` - Main app page
- `/api/webhook` - Notification webhook (optional)
- `/.well-known/farcaster.json` - Manifest endpoint

## Components
[List of React components to create]

## Data Layer
[State management approach]

## Assets Required
- Icon: 1024x1024 PNG
- Splash: 200x200 PNG
- Hero: 1200x630 PNG
- Screenshots: 1284x2778 PNG (up to 3)
- OG Image: 1200x630 PNG

## Dependencies
[NPM packages needed beyond template]
```

---

## STAGE M2: SCAFFOLD PROJECT

**Purpose**: Generate the Next.js application structure.

**Input**: `stage01/scaffold_plan.md`

**Output Directory**: `builds/miniapps/<slug>/app/`

**Generated Structure**:
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
│   │   └── [app-specific components]
│   ├── public/
│   │   ├── icon.png
│   │   ├── splash.png
│   │   ├── hero.png
│   │   ├── og.png
│   │   └── screenshots/
│   │       └── 1.png
│   ├── minikit.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── .env.example
│   └── .gitignore
└── artifacts/
    └── [pipeline outputs]
```

**Output**: `stage02/scaffold_complete.md` confirming all files created.

---

## STAGE M3: MANIFEST & METADATA AUTHORING

**Purpose**: Configure the manifest and generate placeholder assets.

**Input**: Stage M2 scaffold

**Process**:
1. Populate `minikit.config.ts` with all manifest fields
2. Generate placeholder images (solid color with text overlay)
3. Verify manifest route returns valid JSON
4. Create embed metadata

**Output**:
- Updated `minikit.config.ts`
- Placeholder images in `public/`
- `stage03/manifest_config.md` documenting all values

**minikit.config.ts Template**:
```typescript
export const minikitConfig = {
  accountAssociation: {
    header: "",   // FILL AFTER SIGNING - Stage M5
    payload: "",  // FILL AFTER SIGNING - Stage M5
    signature: "" // FILL AFTER SIGNING - Stage M5
  },
  miniapp: {
    version: "1",
    name: "[APP_NAME]",
    subtitle: "[TAGLINE]",
    description: "[DESCRIPTION]",
    screenshotUrls: [
      "[URL]/screenshots/1.png"
    ],
    iconUrl: "[URL]/icon.png",
    splashImageUrl: "[URL]/splash.png",
    splashBackgroundColor: "#FFFFFF",
    homeUrl: "[URL]",
    primaryCategory: "[CATEGORY]",
    tags: ["[TAG1]", "[TAG2]"],
    heroImageUrl: "[URL]/hero.png",
    tagline: "[TAGLINE]",
    ogTitle: "[APP_NAME]",
    ogDescription: "[DESCRIPTION]",
    ogImageUrl: "[URL]/og.png"
  }
} as const;

export type MinikitConfig = typeof minikitConfig;
```

---

## STAGE M4: VERCEL DEPLOYMENT PLAN

**Purpose**: Provide step-by-step deployment instructions.

**Input**: Completed scaffold

**Output**: `stage04/DEPLOYMENT.md`

```markdown
# Deployment Guide

## Prerequisites
- Vercel account
- GitHub repository with your mini app code

## Steps

### 1. Push to GitHub
git add .
git commit -m "Initial mini app scaffold"
git push origin main

### 2. Import to Vercel
1. Go to vercel.com/new
2. Import your GitHub repository
3. Keep default settings for Next.js
4. Click Deploy

### 3. Configure Environment
In Vercel project settings, add:
- `NEXT_PUBLIC_URL` = your-app.vercel.app

### 4. CRITICAL: Disable Deployment Protection
1. Go to Settings → Deployment Protection
2. Set to "None" or disable for production
3. This allows Base to access /.well-known/farcaster.json

### 5. Verify Deployment
Visit: https://your-app.vercel.app/.well-known/farcaster.json
Confirm valid JSON response.

## Next Step
Proceed to Stage M5: Account Association
```

---

## STAGE M5: ACCOUNT ASSOCIATION (MANUAL STEP)

**Purpose**: Guide user through domain verification and manifest signing.

**This stage requires USER ACTION. The pipeline PAUSES here.**

**Output**: `stage05/ACCOUNT_ASSOCIATION_TODO.md`

```markdown
# Account Association - MANUAL STEP REQUIRED

## What This Does
Account association cryptographically proves you own this domain
and connects your mini app to your Farcaster account.

## Prerequisites
- [ ] App deployed to Vercel (Stage M4 complete)
- [ ] Vercel Deployment Protection disabled
- [ ] Base app account with connected wallet

## Steps

### 1. Open Base Build Tool
Go to: https://base.dev (Build section → Account Association)

### 2. Enter Your Domain
Paste your Vercel URL: `https://your-app.vercel.app`

### 3. Submit and Verify
1. Click "Submit"
2. Click "Verify"
3. Sign the message with your wallet

### 4. Copy Generated Values
You'll receive three values:
- header
- payload
- signature

### 5. Update minikit.config.ts
Open `minikit.config.ts` and fill in:

accountAssociation: {
  header: "PASTE_HEADER_HERE",
  payload: "PASTE_PAYLOAD_HERE",
  signature: "PASTE_SIGNATURE_HERE"
}

### 6. Deploy Update
git add minikit.config.ts
git commit -m "Add account association"
git push origin main

### 7. Verify
Visit: https://base.dev/preview
Enter your URL and check "Account Association" tab shows green checkmarks.

## Resume Pipeline
Once account association is complete, run Stage M6 validation.
```

**Resume Condition**: `minikit.config.ts` has non-empty `header`, `payload`, and `signature` values.

---

## STAGE M6: PREVIEW TOOL VALIDATION

**Purpose**: Validate the mini app using Base's preview tool.

**Input**: Deployed app with account association

**Output**: `stage06/validation_checklist.md`

```markdown
# Preview Tool Validation Checklist

URL: https://base.dev/preview

## Embeds Tab
- [ ] Embed renders correctly
- [ ] App launches when clicked
- [ ] Loading screen displays properly

## Account Association Tab
- [ ] Three green checkmarks displayed
- [ ] No "invalid signature" errors

## Metadata Tab
- [ ] All required fields present
- [ ] No warnings about missing fields
- [ ] Images display correctly
- [ ] Category and tags visible

## Manual Testing
- [ ] App loads in mobile view
- [ ] Core functionality works
- [ ] No console errors
- [ ] Wallet connection works (if applicable)

## Issues Found
[Document any issues here]

## Resolution Status
[Track fixes applied]
```

---

## STAGE M7: PRODUCTION HARDENING

**Purpose**: Add polish and safety features.

**Input**: Validated app

**Process**:
1. Add error boundaries
2. Add loading states
3. Add browser fallback (for non-Base contexts)
4. Add basic analytics hooks (optional)
5. Optimize images
6. Add proper meta tags

**Output**:
- Updated components with error handling
- `stage07/hardening_report.md`

**Browser Fallback Pattern**:
```typescript
// components/ClientWrapper.tsx
'use client';

import { useEffect, useState } from 'react';

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isInClient, setIsInClient] = useState(false);

  useEffect(() => {
    // Check if running inside Base/Farcaster client
    const isClient = typeof window !== 'undefined' &&
      (window.parent !== window || navigator.userAgent.includes('Farcaster'));
    setIsInClient(isClient);
  }, []);

  if (!isInClient) {
    return (
      <div className="fallback">
        <h1>App Name</h1>
        <p>This app is designed for the Base app.</p>
        <a href="https://base.org/app">Get Base App</a>
      </div>
    );
  }

  return <>{children}</>;
}
```

---

## STAGE M8: PROOF GATE (MANDATORY)

**Purpose**: Verify build integrity before declaring completion.

**Input**: Hardened app

**Process** (automated via `scripts/miniapp_proof_gate.sh`):
1. `npm install` - Dependencies install cleanly
2. `npm run build` - Production build succeeds
3. `npm run lint` - No linting errors (if configured)
4. `npm run typecheck` - TypeScript compiles (if configured)
5. Manifest validation - `/.well-known/farcaster.json` returns valid JSON
6. Account association check - All three fields are non-empty
7. Asset validation - All referenced images exist

**Output**: `stage08/build_validation_summary.json`

```json
{
  "timestamp": "2026-01-18T10:00:00Z",
  "slug": "hello-miniapp",
  "checks": {
    "npm_install": { "status": "pass", "duration_ms": 5000 },
    "npm_build": { "status": "pass", "duration_ms": 15000 },
    "npm_lint": { "status": "pass", "duration_ms": 2000 },
    "npm_typecheck": { "status": "pass", "duration_ms": 3000 },
    "manifest_valid": { "status": "pass" },
    "account_association": { "status": "pass" },
    "assets_exist": { "status": "pass", "assets_checked": 5 }
  },
  "overall": "PASS"
}
```

**Gate Rule**: ALL checks must pass. If any fail, the build is NOT complete.

---

## STAGE M9: PUBLISH CHECKLIST

**Purpose**: Provide final publication guidance.

**Output**: `stage09/PUBLISH.md`

```markdown
# Publishing Your Mini App

## Final Verification
- [ ] App deployed and accessible
- [ ] Account association verified (green checkmarks)
- [ ] Preview tool shows no errors
- [ ] Proof gate passed (Stage M8)

## How to Publish

### 1. Open Base App
Launch the Base app on your mobile device.

### 2. Create a Post
Compose a new post (cast) containing your app URL:
https://your-app.vercel.app

### 3. Add Context
Include:
- Brief description of what your app does
- Call to action for users
- Relevant hashtags

### 4. Post It
Your mini app will be indexed within ~10 minutes.

## Best Practices

### Caption Tips
- Lead with the value proposition
- Keep it concise (1-2 sentences)
- Include a clear call to action

### Hashtags
- #miniapp
- #base
- #[your-category]

### Sharing Loop
Encourage users to share by:
- Making sharing easy within the app
- Creating shareable moments/achievements
- Adding social proof elements

## Post-Launch

### Monitor
- Check Base app for user feedback
- Monitor for any reported issues
- Track usage through your analytics

### Iterate
- Respond to user feedback
- Ship improvements regularly
- Re-share major updates
```

---

## STAGE M10: RALPH MODE (ADVERSARIAL QA)

**Purpose**: Rigorous quality assurance through adversarial review.

**Ralph Persona**: A meticulous QA engineer who finds every flaw, inconsistency, and edge case. Ralph is constructive but thorough.

**Process**:
1. Ralph reviews the entire build
2. Produces `polish/ralph_report_N.md` with findings
3. Builder addresses issues in `polish/builder_resolution_N.md`
4. Repeat until Ralph approves (max 3 iterations)
5. Final verdict in `polish/ralph_final_verdict.md`

**Ralph Review Checklist**:

### Manifest Correctness
- [ ] All required fields present and valid
- [ ] Character limits respected
- [ ] Image dimensions correct
- [ ] Category valid
- [ ] Tags properly formatted

### Account Association
- [ ] header/payload/signature all non-empty
- [ ] Signature verification passes
- [ ] Domain matches deployment

### Preview Tool
- [ ] All three tabs show success
- [ ] No warnings or errors
- [ ] Embed renders correctly

### Code Quality
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] Error boundaries in place
- [ ] Loading states present
- [ ] Browser fallback works

### UX Review
- [ ] App loads quickly
- [ ] Core loop is intuitive
- [ ] Touch targets adequate for mobile
- [ ] No gesture conflicts

### Security
- [ ] No exposed secrets
- [ ] No hardcoded API keys
- [ ] Wallet interactions secure (if applicable)

**Ralph Report Template**:
```markdown
# Ralph Report #N

## Summary
[Overall assessment]

## Critical Issues (Must Fix)
1. [Issue description]
   - Location: [file:line]
   - Impact: [what breaks]
   - Suggested fix: [how to fix]

## Major Issues (Should Fix)
[...]

## Minor Issues (Nice to Fix)
[...]

## Passing Checks
[List of things that passed review]

## Verdict
[ ] APPROVED - Ready for publication
[ ] NEEDS WORK - Address critical/major issues
```

**Final Verdict Criteria**:
- Zero critical issues
- Zero major issues (or explicitly deferred with justification)
- Proof gate passes
- Preview tool shows all green

---

## OUTPUT STRUCTURE

All pipeline outputs follow this structure:

```
builds/miniapps/<slug>/
├── app/                    # The Next.js application
│   ├── app/
│   ├── components/
│   ├── public/
│   ├── minikit.config.ts
│   └── [other Next.js files]
└── artifacts/              # Pipeline outputs
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
        └── ralph_final_verdict.md
```

---

## REFERENCE DOCUMENTATION

Cached documentation is available at:
- `vendor/base-miniapps/create-new-miniapp.md`
- `vendor/base-miniapps/manifest.md`
- `vendor/base-miniapps/sign-manifest.md`
- `vendor/base-miniapps/common-issues.md`
- `vendor/base-miniapps/create-manifest-route.md`

Use these as canonical references for manifest fields, signing process, and troubleshooting.

---

## VALIDATION SCRIPTS

Available in `scripts/`:

- `miniapp_proof_gate.sh` - Full proof gate runner
- `check_account_association.ts` - Validates account association fields
- `check_manifest_assets.ts` - Validates all assets exist and are referenced
- `validate_manifest.ts` - Validates manifest JSON structure

---

## ERROR RECOVERY

### Account Association Missing
If user hasn't completed Stage M5:
1. Check `minikit.config.ts` for empty association fields
2. Output reminder to complete manual step
3. Do not proceed past Stage M5

### Build Failure
If proof gate fails:
1. Identify failing check from `build_validation_summary.json`
2. Return to appropriate stage
3. Fix issue
4. Re-run proof gate

### Ralph Rejection
If Ralph rejects after 3 iterations:
1. Document all unresolved issues
2. User must manually address remaining items
3. Provide guidance on each issue
4. Do not auto-publish

---

## MCP INTEGRATION (OPTIONAL)

> **Note**: MCP (Model Context Protocol) is the **specification** that governs how AI systems communicate with tools. The entries below are **MCP servers** (implementations) that follow the MCP spec. For full governance details, see `plugin-factory/CLAUDE.md` under "MCP GOVERNANCE". For the specification itself: https://github.com/modelcontextprotocol

This pipeline supports the following MCP servers as defined in `plugin-factory/mcp.catalog.json`:

| MCP | Phase/Stage | Permission | Purpose |
|-----|-------------|------------|---------|
| Playwright | M6 (Validate), M10 (Ralph) | read-only | E2E testing, UI verification |
| Vercel | M4 (Deploy) | read-only | Deployment management, log analysis |
| Supabase | M2 (Scaffold), M6 (Validate) | read-only | Database backend if needed |
| Cloudflare | M4 (Deploy) | read-only | Edge functions, alternative deploy |
| GitHub | all stages | read-write | Already integrated via Claude Code |

### MCP Usage Rules

1. **MCPs are opt-in** - Mini apps work without any MCP integration
2. **Stage-gated** - MCPs only available in specified stages
3. **Vercel is primary** - Cloudflare is alternative for edge functions
4. **Artifacts logged** - All MCP operations logged to `builds/miniapps/<slug>/artifacts/mcp-logs/`

### Notes

- **Playwright**: Useful for validating mini app behavior before publication
- **Vercel**: Primary deployment target for Base Mini Apps
- **Supabase**: Optional backend when mini app needs data persistence

See `plugin-factory/mcp.catalog.json` for full configuration details.

---

## Version History

- **1.2** (2026-01-18): Added MCP governance note - MCP is spec, MCP servers are tools
- **1.1** (2026-01-18): Added MCP integration catalog reference
- **1.0** (2026-01-17): Initial release with M0-M10 stage system
