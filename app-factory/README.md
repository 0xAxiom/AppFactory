# app-factory

**Mobile App Pipeline** | Part of [App Factory](../README.md)

Describe a mobile app idea—even a vague one. Get a complete, **publishable** Expo React Native application with monetization, market research, App Store optimization, and launch marketing materials.

---

## Who Is This For?

- Developers building iOS/Android mobile apps
- Entrepreneurs who want a monetizable app quickly
- Builders who want production-quality code, not tutorials
- Anyone with an app idea (even vague ones)

**Not for you if:** You need a web app (use [dapp-factory](../dapp-factory/)) or an AI agent (use [agent-factory](../agent-factory/))

---

## How to Start (Important)

```bash
cd app-factory
claude
```

Then type your app idea. Even something vague:

```
I want to make an app where you fly a plane
```

Claude will:

1. **Normalize your intent** → "A flight simulation game with realistic physics, multiple aircraft, mission-based progression, and premium planes via RevenueCat"
2. **Plan** → Comprehensive 9-section implementation plan
3. **Build** → Complete Expo React Native app, milestone by milestone
4. **Integrate RevenueCat** → Monetization with meaningful premium features
5. **Generate** → Research, ASO, and marketing materials
6. **QA** → Ralph loops until ≥97% quality per milestone

No scripts. No commands. No stopping. No asking you to write a better prompt.

**Output:** A store-ready app in `builds/<app-slug>/`

---

## What "Done" Means

Your build is complete when:

1. **Code runs**: `npm install && npx expo start` works
2. **RevenueCat integrated**: Monetization SDK configured with paywall
3. **Quality passes**: Ralph QA reaches ≥97% on each milestone
4. **All deliverables exist**: research/, aso/, marketing/, docs

Claude won't stop until all of this is done. No demos. No toys. No half-products.

---

## What Gets Generated

```
builds/<app-slug>/
├── package.json              # Dependencies
├── app.config.js             # Expo configuration
├── app/                      # Expo Router screens
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── home.tsx
│   ├── paywall.tsx
│   └── settings.tsx
├── src/
│   ├── components/           # Reusable components
│   ├── services/             # RevenueCat, storage
│   ├── hooks/                # Custom hooks
│   └── ui/                   # Design system
├── assets/
│   ├── icon.png              # App icon (1024x1024)
│   └── splash.png            # Splash screen
│
├── research/                 # Market Intelligence
│   ├── market_research.md    # Market size, trends, opportunities
│   ├── competitor_analysis.md# Direct/indirect competitors
│   └── positioning.md        # Unique value proposition
│
├── aso/                      # App Store Optimization
│   ├── app_title.txt         # Store title (max 30 chars)
│   ├── subtitle.txt          # Store subtitle (max 30 chars)
│   ├── description.md        # Full App Store description
│   └── keywords.txt          # ASO keywords (max 100 chars)
│
├── marketing/                # Launch Materials
│   ├── launch_thread.md      # Twitter/X thread (10+ tweets)
│   ├── landing_copy.md       # Landing page copy
│   ├── press_kit.md          # Press one-pager
│   └── social_assets.md      # Social media descriptions
│
├── README.md                 # Project overview
├── RUNBOOK.md                # Copy-paste run commands
├── TESTING.md                # Smoke test checklist
├── LAUNCH_CHECKLIST.md       # Pre-launch steps
└── privacy_policy.md         # Privacy policy
```

**Execution artifacts** (in `runs/`):

```
runs/YYYY-MM-DD/build-<timestamp>/
├── inputs/
│   ├── user_prompt.md        # Your original idea (raw)
│   └── normalized_prompt.md  # Upgraded product intent
├── planning/plan.md          # Implementation plan
└── polish/                   # Ralph QA reports
    ├── ralph_report_*.md
    └── ralph_final_verdict.md
```

---

## Running Your App

After Claude finishes:

```bash
cd builds/<app-slug>
npm install
npx expo start
```

Press `i` for iOS simulator or `a` for Android emulator.

---

## The Build Process

When you describe an app, Claude automatically:

1. **Normalizes** - Upgrades your raw idea into a publishable product intent
2. **Plans** - Creates comprehensive implementation plan with monetization flow
3. **Builds** - Implements milestone by milestone
4. **QA** - Runs Ralph quality loop after each milestone (must reach ≥97%)
5. **Finalizes** - Completes all deliverables and confirms success

**Milestones:**

1. Project scaffold (config, dependencies)
2. Core screens (navigation, main UI)
3. Feature implementation (core functionality)
4. Monetization (RevenueCat SDK, paywall, premium gating)
5. Polish (onboarding, icons, assets)
6. Research, marketing & ASO (all artifacts)

**Intent Normalization Example:**

Your input:

```
I want to make an app where you fly a plane
```

Claude normalizes to:

```
Product: SkyPilot
Pitch: Master the skies in a realistic flight simulator with stunning visuals

Core Loop: Select mission → Fly aircraft → Complete objectives → Unlock rewards

Free Tier: 3 starter aircraft, tutorial missions, basic environments
Premium ($4.99/mo): All 12 aircraft, advanced missions, all environments, no ads

Visual: Realistic 3D cockpit views, dynamic weather, day/night cycles
```

This normalized intent drives all planning, building, and deliverables.

---

## Quality Assurance

Every build includes **Ralph Mode** - automatic adversarial QA:

- Reviews each milestone against checklist
- Fixes issues automatically
- Loops until ≥97% quality reached
- Must pass on research, ASO, AND marketing

**Quality threshold (≥97%):**

- ALL critical items must pass
- At most 3% non-critical items can fail
- Zero runtime errors
- No placeholder content

---

## Technology Stack

| Component    | Technology                 |
| ------------ | -------------------------- |
| Framework    | Expo SDK 54+               |
| Language     | TypeScript                 |
| Navigation   | Expo Router v4             |
| Monetization | RevenueCat                 |
| Storage      | expo-sqlite + AsyncStorage |
| State        | Zustand or React Context   |

---

## Defaults

When you don't specify:

| Aspect         | Default                         |
| -------------- | ------------------------------- |
| Monetization   | Freemium: $4.99/mo or $29.99/yr |
| Data storage   | Local-only (offline-first)      |
| Backend        | None                            |
| Authentication | Guest-first (no login)          |
| Platform       | iOS + Android                   |

---

## Troubleshooting

### npm install fails

**IMPORTANT:** Do NOT use `--legacy-peer-deps`, `--force`, or `--ignore-engines` flags. These are forbidden by the Local Run Proof Gate and will cause verification failure.

1. **Clear npm cache:**

   ```bash
   npm cache clean --force
   npm install
   ```

2. **Check Node version:**

   ```bash
   node --version
   # Need 18+
   ```

3. **Fresh install:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Expo won't start

```bash
npx expo start --clear
```

### App crashes

1. Check Metro for red errors
2. Verify dependencies installed
3. See `RUNBOOK.md` in build directory

---

## Internal Scripts (Debug/CI Only)

The `scripts/` directory contains helper utilities for debugging and CI. **Normal users don't need these** - just use `claude`.

| Script                | Purpose                    |
| --------------------- | -------------------------- |
| `build_proof_gate.sh` | CI validation              |
| `ralph/ralph.sh`      | Debug: manual Ralph        |
| `auto_plan_build.sh`  | Debug: standalone planning |

---

## Directory Structure

```
app-factory/
├── CLAUDE.md             # Constitution (Claude's instructions)
├── README.md             # This file
├── skills/               # Code quality rules
│   ├── mobile-interface-guidelines/  # Touch, accessibility, performance
│   ├── mobile-ui-guidelines/         # UI/UX standards
│   ├── react-native-best-practices/  # Performance patterns
│   └── expo-standards/               # Expo-specific patterns
├── templates/
│   ├── system/           # Execution templates
│   └── app_template/     # Expo scaffolding
├── builds/               # Generated apps (output)
├── runs/                 # Execution artifacts
├── scripts/              # Debug/CI helpers
├── standards/            # Quality standards
└── vendor/               # Cached documentation
```

---

## Links

- **Root README:** [../README.md](../README.md)
- **Constitution:** [CLAUDE.md](./CLAUDE.md) - How Claude operates this pipeline
- **Factory Ready Standard:** [../docs/FACTORY_READY_STANDARD.md](../docs/FACTORY_READY_STANDARD.md)
- **Web apps:** [dapp-factory](../dapp-factory/)
- **AI agents:** [agent-factory](../agent-factory/)
- **Claude plugins:** [plugin-factory](../plugin-factory/)

---

**app-factory v7.2** — `cd app-factory && claude` → describe your idea → get a publishable product.
