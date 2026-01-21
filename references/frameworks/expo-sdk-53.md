# Expo SDK 53 Reference for AppFactory

## Version: SDK 53+ (January 2026)

## Key Features

### New Architecture (Default)

The React Native New Architecture is now enabled by default:

- **Fabric renderer** - Concurrent rendering
- **TurboModules** - Faster native module initialization
- **Bridgeless mode** - Direct native calls

No configuration needed - it's automatic in SDK 53+.

### Platform Requirements

| Platform | Minimum Version |
| -------- | --------------- |
| iOS      | 15.1+           |
| Android  | SDK 24+         |

## Project Structure

```
my-app/
├── app/                    # Expo Router pages
│   ├── _layout.tsx         # Root layout
│   ├── index.tsx           # Home screen
│   └── (tabs)/             # Tab navigation
├── components/             # Shared components
├── hooks/                  # Custom hooks
├── utils/                  # Utilities
├── assets/                 # Images, fonts
├── app.json                # Expo config
└── package.json
```

## Key Dependencies

| Package                   | Version  | Purpose                    |
| ------------------------- | -------- | -------------------------- |
| expo                      | ^53.0.0  | Core framework             |
| expo-router               | ^4.0.0   | File-based routing         |
| expo-video                | ^2.0.0   | Video playback (stable)    |
| expo-audio                | ^1.0.0   | Audio playback (stable)    |
| expo-file-system          | ^18.0.0  | File operations            |
| expo-image                | ^2.0.0   | Optimized images           |
| expo-notifications        | ^0.29.0  | Push notifications         |
| expo-secure-store         | ^14.0.0  | Secure storage             |
| react-native-purchases    | ^8.0.0   | RevenueCat SDK             |
| zustand                   | ^5.0.0   | State management           |
| nativewind                | ^4.0.0   | Tailwind for RN            |

## Expo Router

### File-Based Routing

```
app/
├── _layout.tsx          # Root layout
├── index.tsx            # /
├── about.tsx            # /about
├── [id].tsx             # /123 (dynamic)
└── (tabs)/
    ├── _layout.tsx      # Tab layout
    ├── home.tsx         # /home
    └── profile.tsx      # /profile
```

### Typed Routes

```typescript
import { Link } from "expo-router";

// Type-safe navigation
<Link href="/profile">Profile</Link>
<Link href={{ pathname: "/user/[id]", params: { id: "123" } }}>User</Link>
```

### Layouts

```typescript
// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
```

## Styling with NativeWind

### Setup

```typescript
// tailwind.config.js
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### Usage

```typescript
import { View, Text } from "react-native";

export default function Card() {
  return (
    <View className="bg-white rounded-xl p-4 shadow-lg">
      <Text className="text-lg font-bold text-gray-900">Title</Text>
      <Text className="text-gray-600">Description</Text>
    </View>
  );
}
```

## Monetization with RevenueCat

### Setup

```typescript
// app/_layout.tsx
import Purchases from "react-native-purchases";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    Purchases.configure({
      apiKey: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY!,
    });
  }, []);

  // ...
}
```

### Subscription Check

```typescript
import Purchases from "react-native-purchases";

async function checkSubscription() {
  const customerInfo = await Purchases.getCustomerInfo();
  const isPro = customerInfo.entitlements.active["pro"] !== undefined;
  return isPro;
}
```

### Purchase Flow

```typescript
async function purchaseSubscription() {
  try {
    const offerings = await Purchases.getOfferings();
    const product = offerings.current?.availablePackages[0];

    if (product) {
      const { customerInfo } = await Purchases.purchasePackage(product);
      // Handle successful purchase
    }
  } catch (error) {
    // Handle error
  }
}
```

## Media Handling

### Video (expo-video)

```typescript
import { VideoView, useVideoPlayer } from "expo-video";

export default function VideoPlayer({ url }: { url: string }) {
  const player = useVideoPlayer(url, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <VideoView
      player={player}
      style={{ width: "100%", aspectRatio: 16 / 9 }}
      allowsFullscreen
      allowsPictureInPicture
    />
  );
}
```

### Audio (expo-audio)

```typescript
import { useAudioPlayer } from "expo-audio";

export default function AudioPlayer({ url }: { url: string }) {
  const player = useAudioPlayer(url);

  return (
    <Button
      title={player.playing ? "Pause" : "Play"}
      onPress={() => (player.playing ? player.pause() : player.play())}
    />
  );
}
```

## Build Commands

### Development

```bash
# Start development server
npx expo start

# With dev client (for native modules)
npx expo start --dev-client

# Clear cache
npx expo start -c
```

### Production Builds

```bash
# iOS build
eas build --platform ios

# Android build
eas build --platform android

# Both platforms
eas build --platform all

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

## EAS Configuration

```json
// eas.json
{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

## Common Patterns

### Safe Area Handling

```typescript
import { SafeAreaView } from "react-native-safe-area-context";

export default function Screen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Content */}
    </SafeAreaView>
  );
}
```

### Keyboard Avoiding

```typescript
import { KeyboardAvoidingView, Platform } from "react-native";

export default function Form() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      {/* Form content */}
    </KeyboardAvoidingView>
  );
}
```

## MCP Integration

### Recommended Servers

| Server   | Purpose                      |
| -------- | ---------------------------- |
| figma    | Import designs directly      |
| github   | Repository management        |
| context7 | Real-time Expo/RN docs       |

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [NativeWind](https://www.nativewind.dev/)
- [RevenueCat React Native](https://www.revenuecat.com/docs/reactnative)
