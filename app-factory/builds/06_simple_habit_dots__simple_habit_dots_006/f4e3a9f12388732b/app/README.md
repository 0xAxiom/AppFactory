# Simple Habit Dots

A visual habit tracking app with colored dots - unlimited and simple.

## Features

- 🎯 **Unlimited Habit Tracking** - Create and track as many habits as you want
- 📅 **Visual Calendar** - See your progress with colored dots
- 🔥 **Streak Tracking** - Monitor current and best streaks
- 💾 **Offline First** - All data stored locally with SQLite
- 💳 **Premium Analytics** - Advanced insights with RevenueCat subscriptions
- ♿ **Accessible** - Full VoiceOver support and dynamic text scaling
- 🌙 **Dark Mode** - Automatic system theme support

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd simple-habit-dots
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your RevenueCat API keys to `.env`:
```
EXPO_PUBLIC_REVENUECAT_IOS_KEY=your_ios_api_key_here
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=your_android_api_key_here
```

### Running the App

```bash
# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## RevenueCat Setup

This app uses RevenueCat for subscription management. To set up:

1. Create a [RevenueCat account](https://app.revenuecat.com/)
2. Create a new project
3. Configure products:
   - `simple_habit_dots_pro_monthly` - $2.99/month
   - `simple_habit_dots_pro_annual` - $24.99/year
4. Create a "pro" entitlement
5. Link both products to the "pro" entitlement
6. Get your API keys and add them to your `.env` file

## Database Schema

The app uses SQLite for local data storage:

- `habits` - Store habit information (name, color, creation date)
- `habit_completions` - Track daily habit completions
- `app_settings` - Store app preferences
- `schema_version` - Database migration tracking

## Architecture

- **Framework**: Expo SDK 50 with React Native 0.73
- **Navigation**: Expo Router v3 with file-based routing
- **Database**: SQLite with expo-sqlite
- **Subscriptions**: RevenueCat React Native SDK
- **State Management**: React Context API
- **Styling**: Custom theme system with dark mode support

## Project Structure

```
src/
├── components/         # Reusable UI components
├── screens/           # Screen components (if using non-Router navigation)
├── services/          # Business logic and external services
│   ├── database.js    # SQLite operations
│   └── purchases.js   # RevenueCat integration
├── styles/            # Theme and styling
├── utils/             # Helper functions
├── constants/         # App constants and configuration
├── hooks/             # Custom React hooks
└── database/          # Database schema and migrations

app/                   # Expo Router file-based routing
├── _layout.js        # Tab navigation layout
├── index.js          # Today screen
├── calendar.js       # Calendar view
├── habits.js         # Habit management
└── insights.js       # Premium analytics
```

## Development

### Code Style

The project uses ESLint and Prettier for code formatting:

```bash
# Lint code
npm run lint

# Format code
npm run format
```

### Building for Production

```bash
# Build for iOS
npm run build:ios

# Build for Android
npm run build:android
```

### Environment Variables

Required environment variables:

- `EXPO_PUBLIC_REVENUECAT_IOS_KEY` - RevenueCat iOS API key
- `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` - RevenueCat Android API key
- `EXPO_PUBLIC_APP_ENV` - App environment (development/production)

## Premium Features

The app follows a freemium model:

**Free Features:**
- Unlimited habit creation and tracking
- Visual dot calendar
- Basic streak counting
- Offline data storage

**Premium Features ($2.99/month):**
- Advanced pattern analytics
- Data export capabilities
- Cloud backup and sync
- Enhanced visualizations

## Accessibility

The app is built with accessibility in mind:

- VoiceOver/TalkBack support for screen readers
- Dynamic Type for text scaling
- High contrast color options
- Large touch targets (44pt minimum)
- Keyboard navigation support

## Support

For support or questions:
- Email: support@simplehabitdots.com
- Privacy Policy: [Link to privacy policy]
- Terms of Service: [Link to terms]

## License

This project is licensed under the MIT License - see the LICENSE file for details.