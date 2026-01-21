# Mobile App Example

A minimal Expo React Native app demonstrating the App Factory output structure.

## Quick Start

```bash
# Install dependencies
npm install

# Start Expo development server
npx expo start
```

Then:

- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app on your phone

## Structure

```
mobile-app/
├── app/                    # Expo Router pages
│   ├── _layout.tsx         # Root layout
│   ├── index.tsx           # Home screen
│   └── paywall.tsx         # RevenueCat paywall
├── src/
│   ├── components/         # Reusable components
│   │   └── Button.tsx
│   └── services/
│       └── purchases.ts    # RevenueCat service
├── assets/                 # Images and fonts
├── app.config.js           # Expo configuration
├── package.json
└── tsconfig.json
```

## Key Features

This example demonstrates:

1. **Expo Router** - File-based navigation
2. **RevenueCat Integration** - Paywall and subscription handling
3. **TypeScript** - Type-safe code
4. **Minimal UI** - Clean, functional interface

## RevenueCat Setup

To enable real purchases:

1. Create account at [revenuecat.com](https://revenuecat.com)
2. Create iOS/Android app in RevenueCat dashboard
3. Copy your API key
4. Update `src/services/purchases.ts` with your key

For development, the app runs in sandbox mode without a real key.

## Next Steps

This is a minimal example. Full App Factory builds include:

- Complete navigation with multiple screens
- Market research and competitor analysis
- ASO materials (title, description, keywords)
- Marketing copy
- Documentation
- Ralph QA verification

Run the full pipeline:

```bash
cd ../../app-factory
claude
# Describe your app idea
```
