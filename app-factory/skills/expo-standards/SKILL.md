# Expo Standards

**Purpose:** Expo-specific patterns and best practices for App Factory mobile applications.

---

## When to Activate

This skill activates during:

- **Milestone 1** (Project Scaffold) - During initial setup
- **Throughout Build** - As reference for Expo patterns

---

## Rule Categories

| Category       | Priority |
| -------------- | -------- |
| Expo Router    | HIGH     |
| Configuration  | MEDIUM   |
| Assets         | MEDIUM   |
| Native Modules | LOW      |

---

## Expo Router (HIGH)

### R1: File-Based Routing Structure

Use Expo Router v4 file conventions correctly.

**Correct Structure:**

```
app/
├── _layout.tsx          # Root layout (navigation structure)
├── index.tsx            # Home screen (/)
├── (tabs)/              # Tab group
│   ├── _layout.tsx      # Tab navigator layout
│   ├── index.tsx        # First tab
│   ├── explore.tsx      # Second tab
│   └── settings.tsx     # Third tab
├── (auth)/              # Auth group (shared layout)
│   ├── _layout.tsx
│   ├── login.tsx
│   └── register.tsx
├── [id].tsx             # Dynamic route (/123)
├── item/
│   └── [id].tsx         # Nested dynamic (/item/123)
└── +not-found.tsx       # 404 screen
```

### R2: Layout Structure

Root layout must wrap with required providers.

**Incorrect:**

```tsx
// app/_layout.tsx
export default function RootLayout() {
  return <Stack />;
}
```

**Correct:**

```tsx
// app/_layout.tsx
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

### R3: Navigation with Type Safety

Use typed navigation for compile-time route checking.

**Incorrect:**

```tsx
router.push('/item/123');
router.push({ pathname: '/item/[id]', params: { id: '123' } });
```

**Correct:**

```tsx
import { router } from 'expo-router';

// Simple navigation
router.push('/item/123');

// With typed params
router.push({
  pathname: '/item/[id]',
  params: { id: item.id },
});

// Replace (no back)
router.replace('/home');

// Go back
router.back();
```

### R4: Tab Navigator Setup

Configure tab navigator with icons and labels.

**Correct:**

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Home, Search, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
```

### R5: Deep Linking Configuration

Enable deep linking with proper scheme.

**In app.config.js:**

```javascript
export default {
  expo: {
    scheme: 'myapp',
    // ...
  },
};
```

**Usage:**

```tsx
// Links that work: myapp://item/123
<Link href="/item/123">View Item</Link>
```

---

## Configuration (MEDIUM)

### C1: app.config.js Structure

Use dynamic config for environment-based settings.

**Correct:**

```javascript
// app.config.js
export default ({ config }) => ({
  ...config,
  name: process.env.APP_ENV === 'production' ? 'MyApp' : 'MyApp (Dev)',
  slug: 'myapp',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'myapp',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.company.myapp',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.company.myapp',
  },
  plugins: [
    'expo-router',
    'expo-font',
    [
      'expo-image-picker',
      {
        photosPermission: 'Allow $(PRODUCT_NAME) to access your photos.',
      },
    ],
  ],
  extra: {
    eas: {
      projectId: 'your-project-id',
    },
  },
});
```

### C2: Environment Variables

Use expo-constants for env vars, not process.env directly.

**Incorrect:**

```tsx
const API_URL = process.env.API_URL;
```

**Correct:**

```tsx
// app.config.js
export default {
  extra: {
    apiUrl: process.env.API_URL || 'https://api.example.com',
  },
};

// In code
import Constants from 'expo-constants';
const API_URL = Constants.expoConfig?.extra?.apiUrl;
```

### C3: EAS Build Configuration

Configure eas.json for build profiles.

**Correct:**

```json
{
  "cli": {
    "version": ">= 5.0.0"
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

---

## Assets (MEDIUM)

### A1: App Icon Requirements

Icon must be exactly 1024x1024 PNG, no transparency.

**Requirements:**

- Size: 1024x1024 pixels
- Format: PNG
- No transparency (solid background)
- No rounded corners (system applies them)

### A2: Splash Screen Configuration

Configure splash with proper resize mode.

**Correct:**

```javascript
// app.config.js
splash: {
  image: './assets/splash.png',
  resizeMode: 'contain', // or 'cover'
  backgroundColor: '#ffffff',
},
```

**Splash image requirements:**

- Recommended: 1284x2778 (iPhone 14 Pro Max)
- Format: PNG
- Keep logo centered in safe area

### A3: Adaptive Icons (Android)

Configure both foreground and background for Android.

**Correct:**

```javascript
android: {
  adaptiveIcon: {
    foregroundImage: './assets/adaptive-icon.png', // 1024x1024, logo only
    backgroundColor: '#ffffff', // Or backgroundImage
  },
},
```

### A4: Font Loading

Load fonts before rendering app.

**Correct:**

```tsx
// app/_layout.tsx
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return <Stack />;
}
```

---

## Native Modules (LOW)

### N1: Expo SDK Preference

Prefer Expo SDK modules over bare React Native equivalents.

**Incorrect:**

```tsx
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
```

**Correct:**

```tsx
import * as MediaLibrary from 'expo-media-library';
```

### N2: Permission Handling

Request permissions using expo modules with proper error handling.

**Incorrect:**

```tsx
const result = await ImagePicker.launchImageLibraryAsync();
```

**Correct:**

```tsx
import * as ImagePicker from 'expo-image-picker';

async function pickImage() {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert('Permission needed', 'Please grant photo library access to select images.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Settings', onPress: () => Linking.openSettings() },
    ]);
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled) {
    return result.assets[0];
  }
  return null;
}
```

### N3: SQLite Setup

Use expo-sqlite with proper initialization.

**Correct:**

```tsx
// src/data/database.ts
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('app.db');

export function initDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export function getItems() {
  return db.getAllSync<Item>('SELECT * FROM items ORDER BY created_at DESC');
}

export function addItem(title: string) {
  return db.runSync('INSERT INTO items (title) VALUES (?)', title);
}
```

### N4: Secure Storage

Use expo-secure-store for sensitive data.

**Incorrect:**

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.setItem('auth_token', token);
```

**Correct:**

```tsx
import * as SecureStore from 'expo-secure-store';

// Store securely
await SecureStore.setItemAsync('auth_token', token);

// Retrieve
const token = await SecureStore.getItemAsync('auth_token');

// Delete
await SecureStore.deleteItemAsync('auth_token');
```

---

## RevenueCat Integration (REQUIRED)

### RC1: SDK Initialization

Initialize RevenueCat early in app lifecycle.

**Correct:**

```tsx
// src/lib/revenuecat/index.ts
import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';

const API_KEYS = {
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || '',
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || '',
};

export async function initPurchases() {
  const apiKey = Platform.OS === 'ios' ? API_KEYS.ios : API_KEYS.android;

  if (!apiKey) {
    console.warn('RevenueCat API key not configured');
    return;
  }

  Purchases.configure({ apiKey });
}
```

**In \_layout.tsx:**

```tsx
useEffect(() => {
  initPurchases();
}, []);
```

### RC2: Offering Display

Fetch and display offerings properly.

**Correct:**

```tsx
import Purchases from 'react-native-purchases';

async function loadOfferings() {
  try {
    const offerings = await Purchases.getOfferings();

    if (offerings.current) {
      return offerings.current.availablePackages;
    }
    return [];
  } catch (error) {
    console.error('Failed to load offerings:', error);
    return [];
  }
}
```

### RC3: Purchase Flow

Handle purchases with proper error handling.

**Correct:**

```tsx
async function purchasePackage(pkg: PurchasesPackage) {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);

    if (customerInfo.entitlements.active['premium']) {
      // Grant access
      return { success: true };
    }
  } catch (error) {
    if (error.userCancelled) {
      return { success: false, cancelled: true };
    }
    throw error;
  }
}
```

---

## Version

- **1.0** (2026-01-15): Initial release
