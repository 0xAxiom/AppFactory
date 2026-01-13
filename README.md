<p align="center">
  <img src="./the_factory/AppFactory.png" alt="App Factory" width="800" />
</p>

# App Factory

**Describe the app you want. Claude builds it.**

This repository contains three builders:

| Builder | What It Makes | Tech Stack |
|---------|---------------|------------|
| [**the_factory/**](./the_factory/) | Mobile apps | Expo + React Native |
| [**web3-factory/**](./web3-factory/) | Web3 apps with tokens | Next.js + Solana |
| [**agent-factory/**](./agent-factory/) | AI agent scaffolds | Node.js + TypeScript |

---

## Web3 Factory (New)

Build Web3 apps and launch Solana tokens with **zero platform AI cost**.

**Fast path:**
```
Open web3-factory/ in Claude Code or Cursor
Type: "Make a roast battle app with token rewards"
→ Prompts and specs generated automatically
```

**How it works:**

1. Clone this repo and open `web3-factory/` in Claude Code or Cursor
2. Describe your Web3 app idea in one sentence
3. The agent generates build prompts and specs automatically
4. Open the generated `build_prompt.md` in your AI tool
5. Build the app following the prompt instructions
6. Use helper scripts to validate and zip your build
7. Upload to [factoryapp.dev](https://factoryapp.dev/web3-factory/launch)
8. Connect wallet, sign transaction, launch!

**This is an agent-driven pipeline.** You type your idea, the repo generates prompts. Your AI tool builds the app.

See [web3-factory/README.md](./web3-factory/README.md) for full docs.

---

## Agent Factory (New)

Build AI agent scaffolds with **zero platform inference cost**.

**Fast path:**
```
Open agent-factory/ in Claude Code or Cursor
Type: "Build an agent that summarizes YouTube videos"
→ Complete scaffold generated automatically
```

**How it works:**

1. Clone this repo and open `agent-factory/` in Claude Code or Cursor
2. Describe your agent idea in one sentence
3. Answer 3 questions (name, description, env vars)
4. Get a complete scaffold in `outputs/<agent-name>/`
5. Run `npm run zip` to package
6. Upload to [factoryapp.dev](https://factoryapp.dev)

**This is an agent-driven pipeline.** You type your idea, Claude generates the scaffold. You bring your own API keys.

See [agent-factory/README.md](./agent-factory/README.md) for full docs.

---

## App Factory (Mobile)

Build mobile apps with a single description.

```bash
cd the_factory
claude
# Describe your app to Claude
# Get a complete Expo app with research + ASO
```

---

## Changelog

**v4.1 (January 2026)** - Mandatory research and ASO
- **Market research** - every build includes written market analysis
- **Competitor analysis** - documented competitive landscape
- **ASO metadata** - ready-to-paste App Store copy

**v4.0 (January 2026)** - Single-mode refactor
- **No commands required** - describe your app, get a working build
- **Ralph Mode** - adversarial QA ensures every build meets quality standards
- **Streamlined repo** - removed legacy orchestration, kept only what matters

---

## How It Works

1. Open Claude Code in the `the_factory/` directory
2. Describe the app you want in plain English
3. Claude researches the market and builds it end-to-end
4. Get a complete Expo app with research and ASO in `builds/<app-slug>/`

No commands. No configuration. No pipeline stages to manage.

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
│   ├── market_research.md        # Market size, trends, demographics
│   ├── competitor_analysis.md    # Competitor breakdown
│   └── positioning.md            # Differentiation strategy
├── aso/                          # App Store Optimization
│   ├── app_title.txt             # Store title (max 30 chars)
│   ├── subtitle.txt              # Store subtitle (max 30 chars)
│   ├── description.md            # Full store description
│   └── keywords.txt              # ASO keywords (max 100 chars)
├── privacy_policy.md
├── launch_plan.md
└── README.md
```

Ready to run with `npx expo start`.

---

## What Gets Built

Every build includes:

### App Code
| Feature | Description |
|---------|-------------|
| **Expo + TypeScript** | iOS and Android from one codebase |
| **RevenueCat** | Subscription monetization built-in |
| **Onboarding** | 2-4 screen welcome flow |
| **Paywall** | Premium upgrade screen |
| **Settings** | Subscription management, privacy, support |
| **Local Storage** | SQLite for data, AsyncStorage for preferences |

### Market Research (Mandatory)
| File | Contents |
|------|----------|
| `research/market_research.md` | Market size, trends, demographics, pain points |
| `research/competitor_analysis.md` | Direct/indirect competitors, gaps to exploit |
| `research/positioning.md` | Unique value proposition, differentiation |

### App Store Optimization (Mandatory)
| File | Contents |
|------|----------|
| `aso/app_title.txt` | Optimized App Store title |
| `aso/subtitle.txt` | App Store subtitle |
| `aso/description.md` | Full App Store description |
| `aso/keywords.txt` | ASO keywords for App Store Connect |

### Launch Materials
| File | Contents |
|------|----------|
| `privacy_policy.md` | Privacy policy for store compliance |
| `launch_plan.md` | Launch checklist and timeline |

---

## Quality Assurance

Every build goes through **Ralph Mode** - an adversarial QA process:

1. Ralph reviews the build critically
2. Verifies all code, research, and ASO artifacts
3. Identifies issues that would block shipping
4. Builder fixes the issues
5. Repeat until quality standards met (max 3 iterations)

A build only succeeds when Ralph approves it. **Missing or thin research/ASO is a blocking failure.**

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

## Technology Stack

| Component | Technology |
|-----------|------------|
| Framework | Expo SDK 54+ |
| Language | TypeScript |
| Navigation | Expo Router v4 |
| Monetization | RevenueCat |
| Storage | expo-sqlite |

---

## Repo Map

```
the_factory/
├── claude.md              # Constitution - defines single-mode behavior
├── README.md              # App Factory documentation
├── templates/
│   ├── system/            # Core execution templates
│   │   ├── dream_spec_author.md   # Expands input to spec
│   │   └── ralph_polish_loop.md   # QA process
│   └── app_template/      # Expo scaffolding
├── builds/                # Generated apps go here
├── runs/                  # Execution artifacts
├── vendor/                # Cached Expo/RevenueCat docs
│   ├── expo-docs/         # Expo SDK documentation
│   └── revenuecat-docs/   # RevenueCat documentation
├── scripts/               # Helper utilities
│   ├── build_proof_gate.sh
│   ├── generate_assets.sh
│   └── generate_privacy_policy.sh
└── standards/             # Quality standards
    ├── mobile_app_best_practices_2026.md
    └── research_policy.md
```

---

## Running Your App

```bash
cd the_factory/builds/<app-slug>
npm install
npx expo start
```

Press `i` for iOS simulator or `a` for Android emulator.

---

## Getting Started

1. Clone this repository
2. Open `the_factory/` in Claude Code
3. Describe the app you want
4. Wait for the build to complete
5. Run your app from `builds/`

That's it.

---

## License

MIT License - See LICENSE file.

---

## $FACTORY

Support the project by holding $FACTORY on Solana.

**Contract Address:** `BkSbFrDMkfkoG4NDUwadEGeQgVwoXkR3F3P1MPUnBAGS`

[View on Bags.fm](https://bags.fm/BkSbFrDMkfkoG4NDUwadEGeQgVwoXkR3F3P1MPUnBAGS)

---

**App Factory v4.1** - Describe what you want. Get a working app with research and ASO.
