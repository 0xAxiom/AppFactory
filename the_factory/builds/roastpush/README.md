# RoastPush

**Get roasted when you least expect it.**

RoastPush is a mobile app that sends random insults to your phone throughout the day via push notifications. No effort required—just turn it on and let the roasts fly.

## Features

- **Random Insult Notifications**: Surprise roasts delivered at unpredictable times
- **Intensity Levels**: Mild Tease, Solid Roast, or Savage Burns
- **Category Control**: General, Work, Dating, Fitness, Intelligence, Appearance
- **Custom Scheduling**: Set your active hours and daily frequency
- **Roast History**: Browse and relive your favorite burns
- **Premium Tier**: Unlock savage content and unlimited roasts

## Tech Stack

- **Framework**: React Native with Expo SDK 52
- **Navigation**: Expo Router v4 (file-based routing)
- **Language**: TypeScript
- **Monetization**: RevenueCat
- **Storage**: expo-sqlite for data, AsyncStorage for preferences
- **Notifications**: expo-notifications (local scheduling)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Navigate to the project directory
cd builds/roastpush

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on Device

- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Physical Device**: Scan the QR code with Expo Go app

## Project Structure

```
roastpush/
├── app/                    # Expo Router screens
│   ├── _layout.tsx         # Root layout with providers
│   ├── index.tsx           # Entry point / router
│   ├── onboarding.tsx      # Onboarding flow
│   ├── home.tsx            # Main dashboard
│   ├── settings.tsx        # Settings screen
│   ├── history.tsx         # Roast history
│   ├── paywall.tsx         # Premium upgrade
│   └── privacy.tsx         # Privacy policy
├── src/
│   ├── components/         # Reusable components
│   ├── context/            # React context providers
│   ├── data/               # Insult library
│   ├── services/           # Database, notifications, purchases
│   └── ui/                 # Theme and styling
├── assets/                 # App icon, splash screen
├── research/               # Market research documents
├── aso/                    # App Store Optimization files
└── privacy_policy.md       # Privacy policy document
```

## Configuration

### RevenueCat Setup

1. Create a RevenueCat account at https://www.revenuecat.com
2. Set up your app and create products
3. Replace the placeholder API keys in `app.config.js`:

```javascript
extra: {
  revenueCatApiKeyApple: "your_apple_key_here",
  revenueCatApiKeyGoogle: "your_google_key_here"
}
```

### App Store / Play Store

1. Update bundle identifier in `app.config.js`
2. Generate app icons and splash screens (replace placeholder files in `assets/`)
3. Configure app signing for production builds

## Building for Production

```bash
# Build for iOS
npx expo build:ios

# Build for Android
npx expo build:android

# Or use EAS Build
npx eas build --platform all
```

## Monetization

- **Free Tier**: 5 daily roasts, 2 categories, Mild/Medium intensity
- **Premium**: $3.99/month or $24.99/year
  - Unlimited roasts (up to 20/day)
  - Savage Burns intensity
  - All 6 categories
  - Premium insult library

## Privacy

RoastPush is privacy-first:
- All data stored locally on device
- No analytics or tracking
- No account required
- Works completely offline

See `privacy_policy.md` for full details.

## Content Warning

This app contains mature humor and may not be suitable for all audiences. Recommended for ages 17+.

## License

Proprietary - All rights reserved.

## Support

Email: support@roastpush.app
