# App Factory (the_factory)

**Version**: 7.0
**Mode**: Interactive Build Session
**Status**: MANDATORY CONSTITUTION

---

## HOW TO USE APP FACTORY

```bash
cd the_factory
claude
```

Then describe your app idea. That's it.

Claude will build a complete, **publishable** mobile app with:
- Full Expo React Native codebase
- RevenueCat monetization (non-negotiable)
- Market research and competitor analysis
- App Store Optimization (ASO) materials
- Marketing launch materials
- All documentation

The pipeline runs automatically until complete. No scripts. No commands. No stopping.

---

## PURPOSE

App Factory transforms raw app ideas into **publishable products**. Not demos. Not toys. Not half-products.

When you describe an app, Claude builds everything needed to ship to the App Store: production code, monetization, research, marketing, and store materials.

**This is not a scaffold generator.** The output is a store-ready app.

---

## ABSOLUTE RULES

Claude MUST:
- Treat every user message as a product request, not a specification
- Build a complete, publishable product every time
- Include RevenueCat monetization in every mobile app
- Run to completion without stopping

Claude MUST NOT:
- Ask the user to write a better prompt
- Stop early for any reason
- Ship demos, toys, or half-products
- Skip monetization integration
- Ask clarifying questions mid-build
- Pause for user confirmation

---

## INTERACTIVE BUILD SESSION PROTOCOL

When a user describes an app idea, Claude executes ALL phases automatically:

---

### PHASE 0: INTENT NORMALIZATION (MANDATORY)

**Before planning, research, or implementation**, Claude MUST upgrade the user's raw input into a publishable product intent.

The user's input may be vague, casual, or underspecified (e.g., "I want to make an app where you fly a plane"). Claude MUST assume they want a real, App Store–ready product.

**Rules for Intent Normalization:**

1. Treat the user's message as RAW INTENT, not a specification
2. Infer missing but required product qualities:
   - Platform (default: iOS + Android via Expo)
   - Core interaction model
   - Core gameplay/usage loop
   - Visual and experiential direction
   - Progression and success criteria
   - Monetization model (RevenueCat required)
3. Rewrite the idea into a clean, professional, **publishable prompt**
4. Do NOT ask the user to approve this rewrite
5. Save the rewritten prompt to: `runs/<date>/<run-id>/inputs/normalized_prompt.md`
6. Use ONLY the normalized prompt for all subsequent planning and building

**If multiple interpretations exist**, choose the one that:
- Produces a deeper, more durable product
- Is realistically shippable
- Avoids gimmicks
- Has clear progression and retention mechanics

**Normalized Prompt Format:**

```markdown
# Normalized Product Intent

## Product Name
[Suggested name]

## One-Line Pitch
[What it is in one sentence]

## Platform
iOS + Android (Expo React Native)

## Core Loop
[Trigger → Action → Reward → Retention]

## Key Features
1. [Feature 1]
2. [Feature 2]
3. [Feature 3]

## Monetization
[Model: Freemium/Premium/Subscription]
[Free tier: what's included]
[Paid tier: what's gated behind RevenueCat]

## Visual Direction
[Style, tone, aesthetic]

## Success Criteria
[What makes this product "done"]
```

---

### PHASE 1: PLAN

After normalization, generate a thorough plan artifact:

**Output:** `runs/<date>/<run-id>/planning/plan.md`

**Plan Structure (9 required sections):**

1. **Project Overview** (name, pitch, value proposition)
2. **Core User Loop** (trigger → action → reward → retention)
3. **Tech Stack** (committed choices, no alternatives)
4. **Project Structure** (exact file tree)
5. **Key Systems** (navigation, data, UI)
6. **Monetization Flow** (explicit RevenueCat touchpoints)
7. **Milestones** (numbered, with verification checklists)
8. **Verification Strategy** (how to validate each milestone)
9. **Risks & Mitigations**

---

### PHASE 2: BUILD (MILESTONE-DRIVEN)

Implement the product milestone by milestone.

**Standard Milestones:**
1. Project Scaffold (package.json, config, structure)
2. Core Screens (navigation, main UI)
3. Feature Implementation (core functionality)
4. Monetization (RevenueCat SDK, paywall, premium gating)
5. Polish & Assets (onboarding, icons, splash)
6. Research, Marketing & ASO (all artifacts)

**After each milestone:**
```
1. IMPLEMENT milestone deliverables
2. VERIFY using checklist
3. RUN Ralph QA loop automatically until ≥97%
4. PROCEED to next milestone only after ≥97%
```

If any critical item fails, DO NOT proceed. Fix it first.

---

### PHASE 3: RESEARCH, MARKETING & ASO (MANDATORY)

Every build MUST output:

**Research:**
```
research/
├── market_research.md      # Market size, trends, opportunities
├── competitor_analysis.md  # Direct/indirect competitors, gaps
└── positioning.md          # Unique value, differentiation
```

**ASO:**
```
aso/
├── app_title.txt           # Max 30 characters
├── subtitle.txt            # Max 30 characters
├── description.md          # Full App Store description
└── keywords.txt            # Max 100 characters total
```

**Marketing:**
```
marketing/
├── launch_thread.md        # Twitter/X thread (10+ tweets)
├── landing_copy.md         # Landing page headline + copy
├── press_blurb.md          # Press one-pager
└── social_assets.md        # Social media descriptions
```

---

### PHASE 4: FINALIZATION

```
1. RUN final Ralph QA (must reach ≥97%)
2. WRITE ralph_final_verdict.md = PASS
3. OUTPUT complete build to: builds/<app-slug>/
4. CONFIRM with run instructions
```

---

## REVENUECAT (NON-NEGOTIABLE)

**ALL mobile apps MUST include RevenueCat monetization.**

During intent normalization:
- Decide a reasonable monetization model
- Ensure monetization fits naturally (not bolted-on)

During implementation:
- Integrate RevenueCat SDK (`react-native-purchases`)
- Configure products and entitlements
- Gate at least one meaningful feature behind RevenueCat
- Document how to configure RevenueCat keys
- Ensure app runs in sandbox mode by default

**No mobile app build is complete without RevenueCat integration.**

---

## MANDATORY DELIVERABLES

### 1. Runnable App (`builds/<app-slug>/`)

```
builds/<app-slug>/
├── package.json
├── app.config.js
├── tsconfig.json
├── app/                    # Expo Router screens
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── home.tsx
│   ├── paywall.tsx         # RevenueCat paywall
│   └── settings.tsx
├── src/
│   ├── components/
│   ├── services/
│   │   └── purchases.ts    # RevenueCat integration
│   ├── hooks/
│   └── ui/
└── assets/
    ├── icon.png            # 1024x1024
    └── splash.png
```

### 2. Research (`builds/<app-slug>/research/`)
Substantive analysis. No placeholder text.

### 3. ASO (`builds/<app-slug>/aso/`)
Ready to paste into App Store Connect.

### 4. Marketing (`builds/<app-slug>/marketing/`)
Ready to post. Specific to this app.

### 5. Documentation
```
├── README.md               # Project overview
├── RUNBOOK.md              # Copy-paste run commands
├── TESTING.md              # Smoke test checklist
├── LAUNCH_CHECKLIST.md     # Pre-launch steps
└── privacy_policy.md       # Privacy policy
```

---

## RALPH QA (AUTOMATIC)

Ralph runs automatically after each milestone. Users never invoke Ralph.

**After completing a milestone, Claude:**
1. Reviews against the milestone checklist
2. Identifies issues (blocking vs non-blocking)
3. Fixes issues immediately
4. Re-checks until ≥97% quality
5. Proceeds to next milestone

**Quality Threshold (≥97%):**
- ALL critical items must pass (else quality = 0%)
- Non-critical items: ≤3% can fail
- Zero runtime errors or crashes
- No TypeScript compilation errors

**Ralph Artifacts** (in `runs/.../polish/`):
```
polish/
├── ralph_report_1.md
├── builder_resolution_1.md
├── ralph_report_2.md       # (if needed)
├── ralph_report_3.md       # (if needed)
└── ralph_final_verdict.md  # VERDICT: PASS required
```

---

## OUTPUT DIRECTORIES

| Directory | Purpose | Contents |
|-----------|---------|----------|
| `builds/<app-slug>/` | **Primary output** | Complete runnable app + all artifacts |
| `runs/YYYY-MM-DD/build-<timestamp>/` | Execution artifacts | Normalized prompt, plan, Ralph reports |

**Run Directory Structure:**
```
runs/YYYY-MM-DD/build-<timestamp>/
├── inputs/
│   ├── user_prompt.md        # Raw user input
│   └── normalized_prompt.md  # Upgraded product intent
├── planning/
│   └── plan.md               # Implementation plan
└── polish/
    └── ralph_final_verdict.md
```

---

## TECHNOLOGY STACK (LOCKED)

| Layer | Choice |
|-------|--------|
| Framework | React Native + Expo SDK 54+ |
| Navigation | Expo Router v4 (file-based) |
| Language | TypeScript |
| Monetization | RevenueCat (required) |
| Database | expo-sqlite (data), AsyncStorage (preferences) |
| State | Zustand or React Context |

---

## DEFAULT ASSUMPTIONS

When user doesn't specify:

| Aspect | Default |
|--------|---------|
| Platform | iOS + Android (Expo) |
| Monetization | Freemium: $4.99/mo or $29.99/yr via RevenueCat |
| Data storage | Local-only (offline-first) |
| Backend | None |
| Authentication | Guest-first (no login required) |
| Quality | Premium, subscription-worthy |

---

## WHEN THE BUILD IS DONE

Claude will output:

```
BUILD COMPLETE

App: <app-name>
Location: builds/<app-slug>/

To run:
  cd builds/<app-slug>
  npm install
  npx expo start

Deliverables:
  ✓ Runnable Expo app
  ✓ RevenueCat monetization
  ✓ Market research (research/)
  ✓ ASO materials (aso/)
  ✓ Marketing materials (marketing/)
  ✓ Documentation

Ralph Verdict: PASS (XX% quality)

RevenueCat Setup:
  1. Create account at revenuecat.com
  2. Add iOS/Android app
  3. Create products matching aso/pricing
  4. Copy API keys to .env
```

---

## TROUBLESHOOTING

### npm install fails
```bash
npm install --legacy-peer-deps
```

### Expo won't start
```bash
npx expo start --clear
```

### App crashes on launch
1. Check Metro for red errors
2. Verify dependencies installed
3. Check `RUNBOOK.md` in build directory

---

## INTERNAL TOOLS (FOR DEBUGGING/CI ONLY)

The `scripts/` directory contains helper scripts for debugging and CI. **Normal users don't need these.**

| Script | Purpose |
|--------|---------|
| `scripts/build_proof_gate.sh` | CI validation |
| `scripts/ralph/ralph.sh` | Debug: manual Ralph |
| `scripts/auto_plan_build.sh` | Debug: standalone planning |

**Just use `claude`.**

---

## VERSION HISTORY

- **7.0** (2026-01-14): Intent Normalization phase, RevenueCat non-negotiable, stricter product quality
- **6.0** (2026-01-14): Claude-first Interactive Build Session, marketing mandatory
- **5.1** (2026-01-14): Auto Plan + Build mode with Ralph Wiggum integration
- **5.0** (2026-01-13): Standardized constitution format
- **4.0** (2026-01-11): Single-mode refactor, Ralph Mode

---

**the_factory**: `cd the_factory && claude` → describe your idea → get a publishable product.
