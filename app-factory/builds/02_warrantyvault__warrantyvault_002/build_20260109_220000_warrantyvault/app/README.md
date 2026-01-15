# WarrantyVault

**Never lose a warranty claim again.**

A warranty tracking app that helps users protect their purchases by tracking warranty expiration dates, storing receipts, and sending timely reminders before warranties expire.

## Features

- **Receipt Photo Capture**: Take or select photos of receipts for safekeeping
- **Warranty Tracking**: Track purchase dates and warranty durations
- **Expiration Alerts**: Get notified 30 days before warranties expire
- **Status Organization**: Items grouped by Active, Expiring Soon, and Expired
- **Category Organization**: Organize by Electronics, Appliances, Furniture, Vehicles, and more

## Tech Stack

- **Framework**: Expo SDK 52, React Native 0.76
- **Navigation**: Expo Router v4 (file-based routing)
- **Subscriptions**: RevenueCat
- **Storage**: AsyncStorage + expo-file-system
- **Notifications**: expo-notifications

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Expo modules with correct versions:
   ```bash
   npx expo install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your RevenueCat API keys:
   ```
   EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_your_key_here
   EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_your_key_here
   ```

4. Start the development server:
   ```bash
   npx expo start
   ```

5. Press `i` for iOS Simulator or `a` for Android Emulator

## RevenueCat Setup

1. Create a RevenueCat account at https://app.revenuecat.com
2. Create a new project for WarrantyVault
3. Add iOS and Android apps
4. Configure products in App Store Connect / Google Play Console:
   - `warrantyvault_premium_monthly` - $3.99/month
   - `warrantyvault_premium_annual` - $29.99/year
5. Create an entitlement called `premium`
6. Link products to the entitlement
7. Get API keys from RevenueCat and add to `.env`

## Project Structure

```
app/                    # Expo Router screens
├── (tabs)/            # Tab navigation screens
│   ├── index.tsx      # Dashboard
│   ├── add.tsx        # Add Item
│   └── settings.tsx   # Settings
├── item/
│   └── [id].tsx       # Item Detail
├── paywall.tsx        # Subscription paywall
└── _layout.tsx        # Root layout

src/
├── components/        # Reusable UI components
├── contexts/          # React Context providers
├── hooks/             # Custom hooks
├── services/          # Business logic services
├── theme/             # Design tokens
├── types/             # TypeScript types
└── utils/             # Utility functions
```

## Subscription Tiers

### Free Tier
- Track up to 10 items
- Receipt photo storage
- Expiration alerts
- Category organization

### Premium Tier ($3.99/month or $29.99/year)
- Unlimited items
- Cloud backup (coming soon)
- PDF export (coming soon)
- Custom categories (coming soon)

## Development

### Run Tests
```bash
npm test
```

### Type Check
```bash
npm run typecheck
```

### Lint
```bash
npm run lint
```

### Format
```bash
npm run format
```

## Building for Production

### EAS Build

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Configure EAS:
   ```bash
   eas build:configure
   ```

3. Build for iOS:
   ```bash
   eas build --platform ios
   ```

4. Build for Android:
   ```bash
   eas build --platform android
   ```

## License

Proprietary - All rights reserved

## Support

Contact: support@warrantyvault.app
