# App Factory

**AI-Native Mobile App Development Pipeline**

App Factory is an end-to-end system that researches markets, generates validated app ideas, designs UX/monetization/brand, produces launch-ready specifications, and builds complete React Native mobile apps. Claude executes all stages directly within this repository without subprocess calls or hand-holding.

## 🚀 Quick Start

### Generate 10 Ranked App Ideas
```bash
run app factory
```

This executes Stage 01 market research and generates 10 ranked mobile app ideas in the "idea bin" for selective building.

### Build a Selected App
```bash
build <IDEA_ID_OR_NAME>
```

This builds ONE selected idea from the idea bin into a complete, store-ready Expo React Native app.

### Transform Raw Idea to Store-Ready App
```bash
dream <IDEA_TEXT>
```

This transforms a raw app idea into a complete, store-ready Expo React Native app via end-to-end pipeline execution (Stages 01-10).

## 📱 What App Factory Builds

App Factory creates **subscription-based React Native mobile apps** with:

- **Expo framework** for cross-platform iOS/Android deployment
- **RevenueCat integration** for subscription management
- **Production-ready screens** including onboarding, paywall, settings
- **Store submission ready** with ASO metadata and launch planning
- **Offline-first architecture** with minimal backend dependencies

## 🏗️ Pipeline Architecture

### Core Stages

1. **Stage 01: Market Research** - Generates 10 ranked app ideas
2. **Stages 02-09: Specification** - Product spec, UX, monetization, architecture, handoff, polish, brand, release planning  
3. **Stage 10: Mobile App Generation** - Complete Expo React Native app

### Execution Modes

- **Idea Generation** (`run app factory`) - Stage 01 only, creates idea bin
- **Selective Building** (`build <idea>`) - Stages 02-10 for chosen idea
- **End-to-End** (`dream <idea>`) - Stages 01-10 in single execution

## 📊 Global Leaderboard

App Factory maintains a cross-run leaderboard of all generated app ideas for:
- Long-term idea quality tracking
- Analytics and trend analysis  
- External tool integration
- Discovery surface for promising concepts

## 🎯 App Complexity Bias

App Factory favors **simple, profitable mobile apps**:

✅ **Prioritized Apps**:
- Client-side or offline-first
- Minimal backend dependencies
- Low ongoing operational costs
- Clear subscription value proposition
- Simple data models

❌ **Deprioritized Apps**:
- Heavy backend infrastructure
- Complex AI/ML requirements
- High operational costs
- Unclear monetization

## 📂 Directory Structure

```
the_factory/
├── CLAUDE.md                     # App Factory control plane
├── README.md                     # This file
├── templates/                    # Stage execution templates
├── schemas/                      # JSON validation schemas
├── runs/                         # Generated pipeline outputs
├── builds/                       # Built React Native apps
├── leaderboards/                 # Global idea rankings
├── standards/                    # Quality guidelines
├── scripts/                      # Utility scripts
└── appfactory/                   # Core Python modules
```

## ⚡ Technology Stack

- **Mobile Framework**: React Native with Expo
- **Language**: TypeScript for type safety
- **Monetization**: RevenueCat for subscriptions
- **Navigation**: React Navigation
- **Storage**: AsyncStorage for local data
- **Deployment**: App Store + Google Play submission ready

## 🔒 Isolation

App Factory operates in complete isolation from Web3 Factory:
- Separate directory structure (`/the_factory/` vs `/web3-factory/`)
- Separate technology stacks (React Native vs Web Apps)  
- Separate monetization models (subscriptions vs tokens)
- No shared execution state or data

## 📋 Validation & Status

### Check Pipeline Status
```bash
show status
```

### Validate Run Integrity  
```bash
validate run
```

## 🎪 Examples

### Generate Ideas for Productivity Apps
```bash
run app factory
# Creates 10 ranked productivity app ideas in idea bin
```

### Build Top-Ranked Idea
```bash
build focus_flow_ai
# Builds complete FocusFlow AI app with subscription paywall
```

### One-Shot App Creation
```bash
dream "A habit tracker that uses AI to suggest personalized habit stacks based on your goals and past behavior"
# Creates complete habit tracking app from raw idea
```

## 🚦 Success Criteria

A successful App Factory execution produces:
- ✅ Validated mobile app concept with market evidence
- ✅ Complete React Native Expo project
- ✅ RevenueCat subscription integration
- ✅ Production-ready screens and navigation
- ✅ Store submission package (metadata, screenshots, descriptions)
- ✅ Launch planning and go-to-market strategy

## 📖 Learn More

- Read `CLAUDE.md` for complete pipeline specifications
- Explore `templates/agents/` for stage execution details
- Check `schemas/` for JSON validation requirements
- Review `standards/` for quality guidelines

---

**App Factory**: Transform ideas into store-ready mobile apps through AI-native development.