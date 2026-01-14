# the_factory

**Mobile App Pipeline** | Part of [App Factory](../README.md)

Describe a mobile app in plain language. Get a complete, store-ready Expo React Native application with market research and App Store optimization.

---

## Who Is This For?

- Indie developers who want to ship mobile apps fast
- Entrepreneurs validating app ideas
- Developers who want research + ASO included automatically

**Not for you if:** You need a web app (use [web3-factory](../web3-factory/)) or an AI agent (use [agent-factory](../agent-factory/))

---

## Quickstart

```bash
cd the_factory
claude
# Type: "A meditation app with guided sessions and streak tracking"
# Wait for build to complete (5-15 minutes)
# Run your app:
cd builds/<app-slug>
npm install
npx expo start
```

Press `i` for iOS simulator or `a` for Android emulator.

---

## What Gets Generated

```
builds/<app-slug>/
├── package.json              # Dependencies
├── app.config.js             # Expo configuration
├── src/
│   ├── screens/              # All app screens
│   ├── components/           # Reusable components
│   ├── services/             # RevenueCat, storage
│   └── ui/                   # Design system
├── assets/
│   ├── icon.png              # App icon (1024x1024)
│   └── splash.png            # Splash screen
├── research/                 # Market intelligence
│   ├── market_research.md    # Market analysis
│   ├── competitor_analysis.md# Competitor breakdown
│   └── positioning.md        # Positioning strategy
├── aso/                      # App Store Optimization
│   ├── app_title.txt         # Store title (max 30 chars)
│   ├── subtitle.txt          # Store subtitle (max 30 chars)
│   ├── description.md        # Full description
│   └── keywords.txt          # ASO keywords
├── README.md                 # Project overview
├── RUNBOOK.md                # Exact steps to run locally
├── TESTING.md                # How to verify it works
├── LAUNCH_CHECKLIST.md       # Pre/post-launch checks
├── privacy_policy.md         # Privacy policy
└── launch_plan.md            # Launch timeline
```

---

## Full Walkthrough

### Step 1: Describe Your App

Open Claude Code in this directory and describe your app:

```
A habit tracking app that uses dots to show completion streaks,
with gentle reminders and a clean minimalist design
```

The more detail you provide, the more tailored the result. But even one sentence works.

### Step 2: Wait for the Build

Claude will:
1. Research the market for your app category
2. Analyze competitors
3. Write a comprehensive specification
4. Build the complete Expo app
5. Run adversarial QA (Ralph Mode)
6. Deliver the finished app

This takes 5-15 minutes depending on complexity.

### Step 3: Review the Output

Check the `builds/<app-slug>/` directory:
- Read `README.md` for project overview
- Read `RUNBOOK.md` for exact run instructions
- Check `research/` for market intelligence
- Check `aso/` for App Store copy

### Step 4: Run the App

```bash
cd builds/<app-slug>
npm install
npx expo start
```

Expected output:
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web
```

Press `i` for iOS or `a` for Android.

### Step 5: Verify It Works

Follow `TESTING.md` in your generated project to run smoke tests:
- App loads without crash
- Onboarding flow completes
- Main functionality works
- Paywall displays correctly

### Step 6: Prepare for Launch

Follow `LAUNCH_CHECKLIST.md`:
- [ ] App runs on physical device
- [ ] RevenueCat products configured (if using subscriptions)
- [ ] Privacy policy URL hosted
- [ ] App Store assets ready (screenshots, preview video)
- [ ] ASO copy reviewed and customized

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Framework | Expo SDK 54+ |
| Language | TypeScript |
| Navigation | Expo Router v4 |
| Monetization | RevenueCat |
| Storage | expo-sqlite + AsyncStorage |
| Styling | Custom design system |

---

## Defaults

When you don't specify details, the pipeline assumes:

| Aspect | Default |
|--------|---------|
| Monetization | Freemium with $4.99/mo subscription |
| Data storage | Local-only (offline-first) |
| Backend | None required |
| Authentication | Guest-first (no login) |
| Platform | iOS + Android |

---

## Quality Assurance

Every build goes through **Ralph Mode** - an adversarial QA process:

1. Ralph reviews the build critically
2. Verifies all code, research, and ASO artifacts
3. Identifies issues that block shipping
4. Builder fixes issues
5. Repeat until quality standards met (max 3 iterations)

A build only succeeds when Ralph approves it.

**Blocking failures:**
- Missing or thin research
- Missing or generic ASO copy
- App crashes on startup
- Missing required screens (onboarding, paywall, settings)

---

## Factory Ready Checklist

This pipeline follows the [Factory Ready Standard](../docs/FACTORY_READY_STANDARD.md).

| Gate | How to Verify |
|------|---------------|
| **Build** | `npm install` completes without errors |
| **Run** | `npx expo start` shows Metro bundler |
| **Test** | App loads in simulator without crash |
| **Validate** | `./scripts/build_proof_gate.sh builds/<app-slug>` |
| **Launch Ready** | All docs present (README, RUNBOOK, TESTING, LAUNCH_CHECKLIST) |

---

## Troubleshooting

### "npm install fails with peer dependency error"

```bash
npm install --legacy-peer-deps
```

### "Expo start shows 'Command not found'"

```bash
npm install -g expo-cli
# or use npx:
npx expo start
```

### "App crashes immediately on launch"

1. Check Metro bundler for red errors
2. Look for missing imports or typos
3. Verify all dependencies installed
4. Try clearing cache: `npx expo start --clear`

### "Simulator doesn't launch"

**iOS:** Open Xcode > Preferences > Locations > Command Line Tools (select version)

**Android:** Ensure Android Studio and emulator are installed, ANDROID_HOME is set

### "Research files are thin or generic"

This is a Ralph Mode failure. Check `runs/.../polish/ralph_report_*.md` for specific issues. The build will re-run until research meets quality bar.

---

## Directory Structure

```
the_factory/
├── claude.md              # Constitution (defines behavior)
├── README.md              # This file
├── templates/
│   ├── system/            # Core execution templates
│   │   ├── dream_spec_author.md   # Spec generation
│   │   └── ralph_polish_loop.md   # QA process
│   └── app_template/      # Expo scaffolding
├── builds/                # Generated apps
├── runs/                  # Execution artifacts
├── vendor/                # Cached documentation
│   ├── expo-docs/         # Expo SDK docs
│   └── revenuecat-docs/   # RevenueCat docs
├── scripts/               # Helper utilities
│   ├── build_proof_gate.sh    # Build validation
│   ├── generate_assets.sh     # Asset generation
│   └── generate_privacy_policy.sh
└── standards/             # Quality standards
    ├── mobile_app_best_practices_2026.md
    └── research_policy.md
```

---

## PASS/FAIL Criteria

### PASS
- [ ] App builds without errors (`npm install` + `npx expo start`)
- [ ] App runs in simulator without crash
- [ ] All required screens present (onboarding, home, paywall, settings)
- [ ] Research artifacts contain substantive content (not placeholders)
- [ ] ASO artifacts ready to paste into App Store Connect
- [ ] Privacy policy present and complete
- [ ] Ralph Mode issued PASS verdict

### FAIL
- [ ] Build errors during npm install
- [ ] App crashes on startup
- [ ] Missing required screens
- [ ] Research contains placeholders or generic content
- [ ] ASO copy is thin or templated
- [ ] Ralph Mode issued FAIL after 3 iterations

---

## Links

- **Root README:** [../README.md](../README.md)
- **Factory Ready Standard:** [../docs/FACTORY_READY_STANDARD.md](../docs/FACTORY_READY_STANDARD.md)
- **Launchpad Overview:** [../docs/LAUNCHPAD_OVERVIEW.md](../docs/LAUNCHPAD_OVERVIEW.md)

---

**the_factory v4.1** - Describe your app. Get a working mobile app with research and ASO.
