# App Specification: RoastPush

## 1. Overview

### App Name
RoastPush

### One-Line Pitch
Get randomly roasted throughout your day with surprise insult notifications that keep you humble and entertained.

### Value Proposition
RoastPush delivers unexpected comedic relief through push notifications containing witty, clever insults at random times. Unlike static insult apps you have to open, RoastPush ambushes you when you least expect it—perfect for people who enjoy self-deprecating humor, want to stay grounded, or just need random laughs during mundane days.

### App Category
Entertainment

## 2. Goals

### Primary Goals
- Deliver surprising, unexpected humor through push notifications
- Create a "pocket roast master" that users look forward to hearing from
- Build habit through unpredictable notification timing
- Generate subscription revenue through premium insult content

### Non-Goals (Explicitly Out of Scope)
- Social features or sharing to other platforms
- User-generated insult content
- AI-generated personalized roasts (MVP uses curated library)
- Photo-based roasting
- Chat or messaging features
- Leaderboards or gamification

## 3. Target User

### Primary Persona
- **Who**: Adults 18-35 who enjoy dark/dry humor, self-deprecating comedy, and shows like Roast battles, The Office, or stand-up comedy
- **Pain Point**: Days feel monotonous; need random moments of levity; existing motivation apps are too "soft"
- **Current Solutions**: Opening Reddit, Twitter, or meme apps manually; no passive delivery of humor
- **Desired Outcome**: Random laugh-out-loud moments delivered automatically throughout the day

### User Context
- **When**: Throughout the day at random intervals
- **Where**: Any context—work, commute, home, gym
- **Frequency**: Multiple times daily (user-controlled frequency)

## 4. Core Features (MVP)

### Feature 1: Random Insult Notifications
- **Purpose**: Deliver surprise comedic insults via push notifications
- **User Action**: None required—notifications arrive passively
- **System Response**: Sends notification with random insult from curated library at random time within user's active hours
- **Success State**: User laughs, smiles, or shares screen with nearby friends

### Feature 2: Insult Intensity Settings
- **Purpose**: Let users control how harsh or mild the insults are
- **User Action**: Select intensity level (Mild Tease, Solid Roast, Savage Burns)
- **System Response**: Filters insult library to match selected intensity
- **Success State**: User receives appropriately-toned content matching their preference

### Feature 3: Notification Schedule
- **Purpose**: Control when insults can arrive
- **User Action**: Set active hours (e.g., 9 AM - 10 PM) and daily frequency (3-20 notifications)
- **System Response**: Schedules random notifications only within the specified window
- **Success State**: No late-night notifications, predictable daily volume

### Feature 4: Insult Categories
- **Purpose**: Provide variety in roast styles
- **User Action**: Enable/disable categories (General, Work Life, Dating Life, Fitness, Intelligence, Appearance)
- **System Response**: Filters insults to only enabled categories
- **Success State**: User receives relevant, preferred content

### Feature 5: Roast History
- **Purpose**: Let users revisit their favorite burns
- **User Action**: Open history screen, scroll through past notifications
- **System Response**: Displays chronological list with timestamps
- **Success State**: User can find and share that perfect insult they got last week

## 5. Monetization

### Model
Freemium with soft paywall (subscription-based)

### Free Tier
- 5 notifications per day maximum
- Access to "Mild Tease" and "Solid Roast" intensity levels
- 2 categories (General, Work Life)
- Basic notification scheduling

### Premium Tier
- **Price**: $3.99/month or $24.99/year
- **Value**:
  - Unlimited daily notifications
  - "Savage Burns" intensity level unlocked
  - All 6 insult categories
  - Premium insult library (2x content)
  - Custom quiet hours
  - Notification sound customization
- **Positioning**: "Upgrade to get absolutely destroyed"

### Paywall Triggers
- When user tries to set more than 5 daily notifications
- When user taps on locked "Savage Burns" intensity
- When user taps on locked categories
- After 7 days of use (soft prompt)

### Subscription Compliance
- Auto-renewal disclosure on paywall
- Cancel anytime messaging clearly visible
- Restore purchases button in settings

## 6. UX Philosophy

### Design Principles
- **Irreverent over serious**: The entire app should feel like a joke, not a utility
- **Minimalist over complex**: Setup in under 60 seconds, then forget about it
- **Surprise over predictability**: The magic is in not knowing when the next roast comes

### Key Screens
1. **Onboarding** (3 screens): Explain the concept, get notification permission, quick intensity selection
2. **Home**: Simple dashboard showing today's roast count, last roast received, and quick settings
3. **Settings**: Intensity, schedule, categories, subscription management
4. **Paywall**: Premium upgrade screen with preview of savage content
5. **History**: Scrollable list of past roasts

### Interaction Patterns
- Tap-centric navigation (no complex gestures)
- Haptic feedback on insult delivery notification
- Dark mode default (fits the roast aesthetic)
- Minimal in-app time expected—it's about the notifications

## 7. Technical Constraints

### Platform
- iOS and Android via Expo React Native
- Expo SDK 54+ with Expo Router v4

### Data Storage
- **Primary**: expo-sqlite for insult library and history
- **Preferences**: AsyncStorage for settings
- **Sync**: None (offline-first)

### Third-Party Services
- **Monetization**: RevenueCat (react-native-purchases)
- **Notifications**: expo-notifications with local scheduling
- **Analytics**: None

### Offline Behavior
- All insults stored locally—works completely offline
- Notification scheduling works offline
- No network required for core functionality

## 8. Quality Bars

### UI Quality
- Dark theme with accent colors (red/orange for roast vibes)
- Bold, irreverent typography
- Subtle animations that feel punchy, not cute
- Premium enough to justify subscription

### Performance
- App loads in < 2 seconds
- Notifications scheduled reliably
- No battery drain from background scheduling

### Accessibility
- WCAG 2.1 AA compliance
- VoiceOver/TalkBack support for all screens
- Minimum 44pt touch targets
- High contrast text on dark backgrounds

### Reliability
- Notifications fire reliably at scheduled times
- History persists across sessions
- Settings never reset unexpectedly

## 9. Market Research (MANDATORY - Will be written to disk)

### Market Overview
- The mobile entertainment app market is valued at $186B globally (2025)
- Humor/comedy apps are a growing niche within entertainment
- Push notification engagement rates average 7-10% for entertainment apps
- Gen Z and Millennials prefer bite-sized, passive content delivery
- "Anti-motivation" and self-deprecating humor is trending (see: meme culture, roast battles on social media)

### Competitor Analysis
- **Direct Competitors**:
  - **RoastGPT** (4.4 stars): AI-powered roasts, but requires active use—no push notifications. Strengths: AI personalization. Weaknesses: Must open app to use.
  - **Insult Master**: Collection of insults to share. Strengths: Large library. Weaknesses: Static, no notification delivery.
  - **Insulterator** (iOS): Talking insult generator. Strengths: Audio delivery. Weaknesses: Requires active engagement, outdated UI.
- **Indirect Competitors**:
  - Meme apps (passive entertainment but not personalized)
  - Motivation apps like Carrot Fit (tough love angle, but fitness-focused)
- **Gap Analysis**: No competitor delivers random insults via push notification. All require active app usage.

### Positioning Strategy
- **Unique Value Proposition**: "The only app that roasts you automatically—no effort required"
- **Differentiation**: Push notification delivery is our moat; competitors are all active-use
- **Target Niche**: Self-deprecating humor enthusiasts who want passive entertainment

## 10. App Store Optimization (MANDATORY - Will be written to disk)

### App Title
RoastPush

### Subtitle
Random Insults All Day

### Description
**Get roasted when you least expect it.**

RoastPush sends you random, hilarious insults throughout your day via push notifications. No effort required—just turn it on and let the roasts fly.

**Why RoastPush?**
- Surprise insults at random times
- Choose your intensity: Mild Tease, Solid Roast, or Savage Burns
- Control when and how often you get roasted
- Browse your roast history anytime

**Perfect for:**
- Anyone who loves self-deprecating humor
- People who need to stay humble
- Fans of roast battles and comedy
- Those who want random laughs during boring days

**Free Features:**
- 5 daily roasts
- 2 intensity levels
- Custom scheduling

**Premium Unlocks:**
- Unlimited roasts
- Savage Burns mode
- All insult categories
- 2x more content

Warning: This app will hurt your feelings. Proceed with thick skin.

Download now and get destroyed.

### Keywords
insult,roast,funny,humor,notifications,comedy,burns,jokes,random,entertainment

## 11. Deliverables Checklist

The final build MUST include:
- [x] Working onboarding flow (3 screens)
- [x] Functional home screen with core feature
- [x] RevenueCat paywall integration
- [x] Settings screen with subscription management
- [x] App icon and splash screen
- [x] Privacy policy
- [x] Launch-ready metadata
- [x] **research/market_research.md** - Full market analysis
- [x] **research/competitor_analysis.md** - Competitor breakdown
- [x] **research/positioning.md** - Positioning strategy
- [x] **aso/app_title.txt** - App Store title
- [x] **aso/subtitle.txt** - App Store subtitle
- [x] **aso/description.md** - Full App Store description
- [x] **aso/keywords.txt** - App Store keywords

## 12. Success Criteria

The app is complete when:
1. User can complete onboarding and receive their first notification
2. Notifications fire at random times within scheduled window
3. Intensity and category settings filter insults correctly
4. Premium upgrade flow works correctly with RevenueCat
5. History displays past roasts
6. The UI reflects premium, irreverent positioning
7. All research artifacts are written to builds/roastpush/research/
8. All ASO artifacts are written to builds/roastpush/aso/
9. Ralph Mode approves the build
