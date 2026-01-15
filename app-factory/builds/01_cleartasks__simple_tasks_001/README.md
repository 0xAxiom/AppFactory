# ClearTasks - Simple To-Do List

A minimalist task manager built with Expo and React Native that focuses on simplicity over complexity.

## Features

- **Single-tap task entry** - Add tasks quickly without setup
- **Swipe to complete** - Natural gesture-based task completion  
- **Offline-first** - Works without internet connection
- **Premium subscriptions** - Unlimited tasks, themes, cloud backup via RevenueCat
- **Clean, minimal UI** - No clutter, categories, or complexity

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm/yarn
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (macOS) or Android Studio

### Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure RevenueCat**:
   - Sign up at [RevenueCat](https://www.revenuecat.com)
   - Create a new project and get your API keys
   - Replace placeholders in `app/_layout.tsx`:
     - `appl_PLACEHOLDER_IOS_KEY` with your iOS API key
     - `goog_PLACEHOLDER_ANDROID_KEY` with your Android API key
   - Update `app.json` with your actual RevenueCat API key

3. **Create development build**:
   ```bash
   npx create-expo-app --template blank-typescript
   expo install react-native-purchases react-native-purchases-ui
   ```

4. **Run the app**:
   ```bash
   # iOS Simulator
   expo run:ios
   
   # Android Emulator  
   expo run:android
   
   # Web (limited functionality)
   expo start --web
   ```

### RevenueCat Configuration

1. **Create Products**:
   - Monthly: `cleartasks_premium_monthly` ($2.99)
   - Annual: `cleartasks_premium_annual` ($19.99)

2. **Set up Entitlements**:
   - Create entitlement: `premium`
   - Attach both products to this entitlement

3. **Configure Store Products**:
   - App Store Connect (iOS): Create in-app purchase products
   - Google Play Console (Android): Create subscription products
   - Link products to RevenueCat via Store settings

### Testing Subscriptions

- **iOS**: Use App Store Connect sandbox accounts
- **Android**: Use Google Play Console test accounts  
- **Development**: RevenueCat provides mock data in Expo Go

## Architecture

- **Frontend**: Expo Router v3 with TypeScript
- **State Management**: Zustand for lightweight state
- **Storage**: AsyncStorage for local task persistence
- **Subscriptions**: RevenueCat for cross-platform IAP
- **Gestures**: React Native Gesture Handler for swipe actions

## Key Files

- `app/index.tsx` - Main task list screen
- `app/settings.tsx` - Premium upgrade and settings
- `src/store/taskStore.ts` - Task management state
- `src/store/premiumStore.ts` - Subscription state
- `app/_layout.tsx` - Root layout with RevenueCat config

## ASO Package (App Store Optimization)

**Title**: ClearTasks - Simple To-Do List  
**Subtitle**: No complexity. Just tasks.  
**Keywords**: simple, tasks, to-do, minimal, productivity, clean, easy

**Description**: 
Finally, a task app that gets out of your way. ClearTasks is designed for people who abandoned complex productivity apps. Add tasks with one tap, complete with a swipe, and focus on getting things done instead of organizing systems.

## Deployment

1. **Build for stores**:
   ```bash
   # iOS
   eas build --platform ios
   
   # Android
   eas build --platform android
   ```

2. **Submit to stores**:
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

## Support

- Email: support@cleartasks.com
- Privacy Policy: [Link to privacy policy]
- Terms of Service: [Link to terms]

Built with ❤️ using Expo and RevenueCat