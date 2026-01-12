# App Factory

**Describe the app you want. Claude builds it.**

App Factory is a single-shot mobile app builder. You describe an app in plain language, and Claude produces a complete, store-ready Expo React Native application with full market research and App Store optimization.

---

## How It Works

1. **You describe an app** - any message describing what you want
2. **Claude researches the market** - competitors, positioning, target users
3. **Claude authors a spec** - expanding your idea into a comprehensive PRD
4. **Claude builds the app** - complete Expo project with all features
5. **Ralph Mode polishes** - adversarial QA ensures quality
6. **You get everything** - working app + research + ASO in `builds/<app-slug>/`

No commands. No configuration. Just describe and build.

---

## Example

**You type:**
```
A meditation app with guided sessions, ambient sounds, and streak tracking
```

**You get:**
```
builds/meditation-app/
├── package.json
├── app.config.js
├── src/
│   ├── screens/
│   │   ├── OnboardingScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── SessionScreen.tsx
│   │   ├── PaywallScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── components/
│   ├── services/
│   │   └── purchases.ts
│   └── ui/
├── assets/
│   ├── icon.png
│   └── splash.png
├── research/                     # Market intelligence
│   ├── market_research.md
│   ├── competitor_analysis.md
│   └── positioning.md
├── aso/                          # App Store Optimization
│   ├── app_title.txt
│   ├── subtitle.txt
│   ├── description.md
│   └── keywords.txt
├── privacy_policy.md
├── launch_plan.md
└── README.md
```

Ready to run with `npx expo start`.

---

## What Gets Built

Every build includes:

### App Code
- **Expo React Native** - iOS and Android from one codebase
- **TypeScript** - type-safe code throughout
- **RevenueCat** - subscription monetization
- **Onboarding** - 2-4 screen welcome flow
- **Paywall** - premium upgrade screen
- **Settings** - subscription management, privacy, support
- **Local storage** - SQLite for data, AsyncStorage for preferences
- **Polished UI** - domain-specific design, not generic templates

### Market Research (Mandatory)
- **market_research.md** - Market size, trends, demographics, pain points
- **competitor_analysis.md** - Direct/indirect competitors, gaps to exploit
- **positioning.md** - Unique value proposition, differentiation strategy

### App Store Optimization (Mandatory)
- **app_title.txt** - Optimized App Store title (max 30 chars)
- **subtitle.txt** - App Store subtitle (max 30 chars)
- **description.md** - Full App Store description, ready to paste
- **keywords.txt** - Keywords for App Store Connect (max 100 chars)

### Launch Materials
- **privacy_policy.md** - Privacy policy for store compliance
- **launch_plan.md** - Launch checklist and timeline

---

## Output Structure

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
│   ├── app_title.txt         # Store title
│   ├── subtitle.txt          # Store subtitle
│   ├── description.md        # Full description
│   └── keywords.txt          # ASO keywords
├── privacy_policy.md         # Privacy policy
├── launch_plan.md            # Launch checklist
└── README.md                 # Setup instructions
```

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Framework | Expo SDK 54+ |
| Language | TypeScript |
| Navigation | Expo Router v4 |
| Monetization | RevenueCat |
| Storage | expo-sqlite |
| Styling | Custom design system |

---

## Running Your App

```bash
cd builds/<app-slug>
npm install
npx expo start
```

Press `i` for iOS simulator or `a` for Android emulator.

---

## Quality Assurance

Every build goes through **Ralph Mode** - an adversarial QA process:

1. Ralph reviews the build critically
2. Verifies all code, research, and ASO artifacts
3. Identifies issues that block shipping
4. Builder fixes issues
5. Repeat until quality standards met (max 3 iterations)

A build only succeeds when Ralph approves it. Missing or thin research/ASO is a blocking failure.

---

## Defaults

When you don't specify details, App Factory assumes:

| Aspect | Default |
|--------|---------|
| Monetization | Freemium with $4.99/mo subscription |
| Data storage | Local-only (offline-first) |
| Backend | None required |
| Authentication | Guest-first (no login) |
| Platform | iOS + Android |

---

## Repo Structure

```
the_factory/
├── claude.md              # Constitution (defines behavior)
├── README.md              # This file
├── templates/
│   ├── system/            # Core templates
│   │   ├── dream_spec_author.md
│   │   └── ralph_polish_loop.md
│   └── app_template/      # Scaffolding templates
├── builds/                # Generated apps
├── runs/                  # Execution artifacts
├── vendor/                # Cached documentation
│   ├── expo-docs/         # Expo SDK docs
│   └── revenuecat-docs/   # RevenueCat docs
├── scripts/               # Helper utilities
│   ├── build_proof_gate.sh
│   ├── generate_assets.sh
│   └── generate_privacy_policy.sh
└── standards/             # Quality standards
    ├── mobile_app_best_practices_2026.md
    └── research_policy.md
```

---

## Getting Started

1. Open this repository in Claude Code
2. Describe the app you want
3. Wait for the build to complete
4. Run your app from `builds/`

That's it.

---

**App Factory v4.1** - Single-shot app building with market research and ASO.
