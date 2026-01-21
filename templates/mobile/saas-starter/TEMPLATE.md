# SaaS Starter Mobile App Template

**Pipeline**: app-factory
**Category**: Productivity / Business
**Complexity**: Medium

---

## Description

A mobile app template for SaaS (Software as a Service) products. Perfect for subscription-based productivity tools, business applications, or service-oriented mobile apps.

---

## Pre-Configured Features

### Core Features

- User onboarding flow with value proposition slides
- Dashboard home screen with key metrics
- Settings screen with account management
- RevenueCat subscription integration (monthly/yearly tiers)
- Offline-first data persistence with SQLite

### UI Components

- Tab navigation (Home, Features, Profile, Settings)
- Card-based dashboard layout
- Progress indicators and charts
- Pull-to-refresh patterns
- Skeleton loading states

### Monetization

- Freemium model with feature gating
- 7-day free trial for premium
- Monthly: $9.99/month
- Yearly: $79.99/year (33% savings)

---

## Ideal For

- Task management apps
- Habit trackers
- Note-taking apps
- Personal finance tools
- Fitness tracking apps
- Learning/education apps

---

## File Structure

```
builds/<app-slug>/
├── app/
│   ├── _layout.tsx           # Root layout with auth check
│   ├── index.tsx             # Landing/splash
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Tab navigator
│   │   ├── home.tsx          # Dashboard
│   │   ├── features.tsx      # Main feature area
│   │   ├── profile.tsx       # User profile
│   │   └── settings.tsx      # Settings
│   ├── onboarding/
│   │   ├── _layout.tsx
│   │   └── index.tsx         # Onboarding slides
│   └── paywall.tsx           # Subscription screen
├── src/
│   ├── components/
│   │   ├── Dashboard/
│   │   ├── Cards/
│   │   └── Charts/
│   ├── services/
│   │   └── purchases.ts      # RevenueCat
│   ├── hooks/
│   │   └── usePremium.ts
│   └── store/
│       └── appStore.ts       # Zustand store
└── research/
    └── market_research.md    # SaaS mobile market analysis
```

---

## Default Tech Stack

| Component    | Technology                 |
| ------------ | -------------------------- |
| Framework    | Expo SDK 54                |
| Navigation   | Expo Router v4             |
| State        | Zustand                    |
| Storage      | expo-sqlite + AsyncStorage |
| Monetization | RevenueCat                 |
| Charts       | Victory Native             |
| Icons        | Lucide React Native        |

---

## Usage

When using this template in Phase 0, Claude will:

1. Normalize your idea with SaaS-specific enhancements
2. Pre-configure the subscription tiers
3. Set up dashboard components
4. Include relevant market research for SaaS apps

**Example prompt enhancement:**

- User says: "habit tracker app"
- Template adds: dashboard with streaks, progress charts, premium habit limits, offline sync, weekly/monthly analytics views

---

## Customization Points

| Element            | How to Customize                         |
| ------------------ | ---------------------------------------- |
| Subscription tiers | Modify prices in `services/purchases.ts` |
| Dashboard cards    | Add/remove in `components/Dashboard/`    |
| Tab structure      | Edit `(tabs)/_layout.tsx`                |
| Onboarding slides  | Modify `onboarding/index.tsx`            |
| Color scheme       | Update `src/ui/theme.ts`                 |

---

## Quality Expectations

When using this template, Ralph will check for:

- [ ] Dashboard loads with skeleton states
- [ ] All tabs navigate correctly
- [ ] Onboarding completes and doesn't repeat
- [ ] Paywall displays subscription options
- [ ] Premium features are properly gated
- [ ] Offline mode works correctly
- [ ] Charts render with real or mock data
