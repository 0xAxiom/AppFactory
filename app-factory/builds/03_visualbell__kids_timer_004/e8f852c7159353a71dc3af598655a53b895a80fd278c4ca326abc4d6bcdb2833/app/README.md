# VisualBell - Kids Timer App

A child-friendly visual timer app designed specifically for children ages 4-10 to help build healthy routines through visual time awareness.

## Features

### Free Features
- Core timer functionality (1-60 minutes)
- 4 preset time options (5min, 10min, 15min, 30min)
- 2 animation themes (Default Sunshine Circle, Space Adventure)
- Basic completion sounds
- Child-optimized large touch targets and visual design

### Premium Features
- 8 engaging timer themes (Space, Ocean, Garden, Construction, Art, Kitchen Helper)
- 15+ completion sounds (nature sounds, gentle chimes, custom uploads)
- Custom timer presets (up to 10 saved routines)
- Multiple simultaneous timers (up to 3 concurrent)
- Weekly usage analytics for parents
- Family cloud sync across devices

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- iOS Simulator (Mac) or Android Studio (cross-platform)
- Expo CLI (`npm install -g @expo/cli`)

### Installation

1. Clone this repository
2. Install dependencies:
```bash
npm install
npx expo install --check
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` and add your RevenueCat API keys:
- `EXPO_PUBLIC_REVENUECAT_IOS_KEY=your_ios_key_here`
- `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=your_android_key_here`

### Development

Start the development server:
```bash
npm start
```

Run on specific platforms:
```bash
npm run ios       # iOS Simulator
npm run android   # Android Emulator
npm run web       # Web browser
```

### RevenueCat Setup

1. Create a RevenueCat account at [revenuecat.com](https://revenuecat.com)
2. Create a new project
3. Add your iOS and Android apps to the project
4. Copy the API keys to your `.env` file
5. Configure products in RevenueCat dashboard:
   - `visualbell_premium_monthly` ($2.99/month)
   - `visualbell_premium_annual` ($24.99/year)
   - `visualbell_family_annual` ($39.99/year)

### App Store Setup

Update `app.config.js` with your:
- Bundle identifier: `com.yourcompany.visualbell.kids.timer`
- App Store Connect credentials
- Google Play Developer credentials

## Child-Centered Design

VisualBell is designed specifically for children ages 4-10:

### Design Principles
- **Extra-Large Touch Targets**: Minimum 64px, preferably 80px+ for developing motor skills
- **Visual-First Communication**: Icons and animations convey meaning before text
- **Single-Focus Interface**: One primary action at a time to reduce cognitive load
- **Immediate Visual Feedback**: 100ms response time for all interactions
- **Error Prevention**: Confirmations and easy undo for accidental actions

### Accessibility
- WCAG 2.1 AA compliant
- High contrast colors (4.5:1 ratio minimum)
- VoiceOver/TalkBack screen reader support
- Dynamic Type support up to 200% scaling
- Supports reduced motion preferences

## Technical Architecture

### Stack
- **Framework**: React Native with Expo SDK 54+
- **Navigation**: Expo Router v4 (file-based routing)
- **Subscriptions**: RevenueCat React Native SDK
- **Database**: expo-sqlite for local data persistence
- **State Management**: React Context API
- **Animations**: React Native Reanimated 3.x

### Key Components
- `CircularTimer`: Main timer display with smooth animations
- `TimeSelectionScreen`: Child-friendly timer duration picker
- `PaywallScreen`: Parent-focused subscription upgrade
- `SettingsScreen`: Parent controls and subscription management

### Data Storage
- **SQLite**: Timer sessions, custom presets, usage analytics
- **AsyncStorage**: User preferences, app state
- **Local-Only**: All child data stored locally, no external analytics

## App Store Optimization

### iOS App Store
- **Name**: "VisualBell - Kids Timer"
- **Subtitle**: "Time made simple for kids"
- **Keywords**: timer,kids,visual,countdown,children,routine,ADHD,activities,focus,family,gentle,colorful
- **Category**: Education (Primary), Health & Fitness (Secondary)

### Google Play Store
- **Name**: "VisualBell Timer for Kids - Family Routines"
- **Short Description**: "Visual countdown timer designed for children. Gentle, colorful, ADHD-friendly."
- **Category**: Education

## Testing

Run tests:
```bash
npm test
```

Test subscription flow:
1. Use RevenueCat sandbox environment
2. Create test accounts in App Store Connect (iOS) and Google Play Console (Android)
3. Test purchase, restore, and family sharing flows

## Deployment

### Development Builds
```bash
eas build --profile development --platform ios
eas build --profile development --platform android
```

### Production Builds
```bash
eas build --profile production --platform ios
eas build --profile production --platform android
```

### App Store Submission
```bash
eas submit --profile production --platform ios
eas submit --profile production --platform android
```

## Support

For technical support or questions:
- Email: support@visualbell-app.com
- GitHub Issues: Create an issue in this repository

## License

This project is proprietary software developed for the App Factory system.

---

**Made with ❤️ for families building better routines together.**