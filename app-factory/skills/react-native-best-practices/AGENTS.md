# React Native Best Practices - Agent Rules

This document contains all performance optimization rules for React Native/Expo applications. Rules are organized by impact level from CRITICAL to LOW.

---

## Table of Contents

1. [Eliminating Waterfalls (CRITICAL)](#1-eliminating-waterfalls)
2. [Bundle Optimization (CRITICAL)](#2-bundle-optimization)
3. [List Performance (HIGH)](#3-list-performance)
4. [Re-render Prevention (MEDIUM)](#4-re-render-prevention)
5. [Memory Management (MEDIUM)](#5-memory-management)
6. [Animation Performance (MEDIUM)](#6-animation-performance)
7. [Platform Patterns (LOW)](#7-platform-patterns)

---

## 1. Eliminating Waterfalls

**Impact: CRITICAL**

Sequential async operations that could run in parallel cause waterfall performance issues.

### 1.1 Defer Await Until Needed

Move `await` operations into branches where the data is actually needed.

**Incorrect:**

```typescript
async function handleUserAction(userId: string, skipProcessing: boolean) {
  const userData = await fetchUserData(userId);
  if (skipProcessing) {
    return { skipped: true };
  }
  return processUserData(userData);
}
```

**Correct:**

```typescript
async function handleUserAction(userId: string, skipProcessing: boolean) {
  if (skipProcessing) {
    return { skipped: true };
  }
  const userData = await fetchUserData(userId);
  return processUserData(userData);
}
```

### 1.2 Parallel Data Fetching

Use `Promise.all` for independent async operations instead of sequential awaits.

**Incorrect:**

```typescript
async function loadScreenData(userId: string) {
  const user = await getUser(userId);
  const preferences = await getPreferences(userId);
  const notifications = await getNotifications(userId);
  return { user, preferences, notifications };
}
```

**Correct:**

```typescript
async function loadScreenData(userId: string) {
  const [user, preferences, notifications] = await Promise.all([
    getUser(userId),
    getPreferences(userId),
    getNotifications(userId),
  ]);
  return { user, preferences, notifications };
}
```

### 1.3 Start Promises Before Await

When you need results at different times, start all promises first, then await as needed.

**Incorrect:**

```typescript
async function processOrder(orderId: string) {
  const order = await getOrder(orderId);
  validateOrder(order);
  const inventory = await checkInventory(order.items);
  return { order, inventory };
}
```

**Correct:**

```typescript
async function processOrder(orderId: string) {
  const orderPromise = getOrder(orderId);
  const inventoryPromise = orderPromise.then((o) => checkInventory(o.items));

  const order = await orderPromise;
  validateOrder(order);
  const inventory = await inventoryPromise;
  return { order, inventory };
}
```

---

## 2. Bundle Optimization

**Impact: CRITICAL**

Import patterns significantly affect bundle size and startup time on mobile.

### 2.1 Avoid Barrel File Imports

Barrel files (`index.ts` that re-exports) prevent proper tree shaking.

**Incorrect:**

```typescript
// Imports entire components directory
import { Button, Text, Card } from '@/components';
import { formatDate, formatCurrency } from '@/utils';
```

**Correct:**

```typescript
// Direct imports enable tree shaking
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Card } from '@/components/Card';
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
```

### 2.2 Lazy Load Heavy Components

Use `React.lazy` for screens and heavy components not needed immediately.

**Incorrect:**

```typescript
import SettingsScreen from './screens/Settings';
import ProfileScreen from './screens/Profile';
import AnalyticsScreen from './screens/Analytics';
```

**Correct:**

```typescript
import { lazy } from 'react';

const SettingsScreen = lazy(() => import('./screens/Settings'));
const ProfileScreen = lazy(() => import('./screens/Profile'));
const AnalyticsScreen = lazy(() => import('./screens/Analytics'));
```

### 2.3 Conditional Requires for Platform Features

Use `require()` for features only needed on certain platforms or conditions.

**Incorrect:**

```typescript
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';

function PhotoButton({ useCamera }: Props) {
  const handler = useCamera ? Camera.takePicture : ImagePicker.launchImageLibrary;
  // ...
}
```

**Correct:**

```typescript
function PhotoButton({ useCamera }: Props) {
  const handler = useCamera ? require('expo-camera').takePicture : require('expo-image-picker').launchImageLibraryAsync;
  // ...
}
```

---

## 3. List Performance

**Impact: HIGH**

List rendering is critical for mobile performance. Wrong patterns cause jank and memory issues.

### 3.1 Use FlatList for Dynamic Lists

Never use `ScrollView` with `.map()` for lists that could grow.

**Incorrect:**

```typescript
<ScrollView>
  {items.map(item => (
    <ItemCard key={item.id} item={item} />
  ))}
</ScrollView>
```

**Correct:**

```typescript
<FlatList
  data={items}
  renderItem={({ item }) => <ItemCard item={item} />}
  keyExtractor={item => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
  initialNumToRender={10}
/>
```

### 3.2 Memoize renderItem Components

List item components should be memoized to prevent unnecessary re-renders.

**Incorrect:**

```typescript
const ItemCard = ({ item }: Props) => (
  <View>
    <Text>{item.title}</Text>
  </View>
);

<FlatList
  data={items}
  renderItem={({ item }) => <ItemCard item={item} />}
/>
```

**Correct:**

```typescript
const ItemCard = memo(({ item }: Props) => (
  <View>
    <Text>{item.title}</Text>
  </View>
));

const renderItem = useCallback(
  ({ item }) => <ItemCard item={item} />,
  []
);

<FlatList
  data={items}
  renderItem={renderItem}
/>
```

### 3.3 Use getItemLayout for Fixed Height Items

When items have fixed height, provide `getItemLayout` to skip measurement.

**Incorrect:**

```typescript
<FlatList
  data={items}
  renderItem={renderItem}
/>
```

**Correct:**

```typescript
const ITEM_HEIGHT = 80;

<FlatList
  data={items}
  renderItem={renderItem}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

### 3.4 Use SectionList for Grouped Data

For data with sections/headers, use SectionList instead of nested FlatLists.

**Incorrect:**

```typescript
<FlatList
  data={categories}
  renderItem={({ item: category }) => (
    <View>
      <Text>{category.name}</Text>
      <FlatList data={category.items} renderItem={renderItem} />
    </View>
  )}
/>
```

**Correct:**

```typescript
const sections = categories.map(cat => ({
  title: cat.name,
  data: cat.items,
}));

<SectionList
  sections={sections}
  renderItem={renderItem}
  renderSectionHeader={({ section }) => (
    <Text>{section.title}</Text>
  )}
/>
```

---

## 4. Re-render Prevention

**Impact: MEDIUM**

Unnecessary re-renders cause jank and battery drain on mobile devices.

### 4.1 Memoize Expensive Components

Use `memo` for components with expensive render logic or many children.

**Incorrect:**

```typescript
function ExpensiveChart({ data }: Props) {
  const processed = processChartData(data); // Expensive
  return <ChartView data={processed} />;
}
```

**Correct:**

```typescript
const ExpensiveChart = memo(function ExpensiveChart({ data }: Props) {
  const processed = useMemo(() => processChartData(data), [data]);
  return <ChartView data={processed} />;
});
```

### 4.2 Stable Callback References

Use `useCallback` for callbacks passed to child components.

**Incorrect:**

```typescript
function ParentComponent() {
  const [count, setCount] = useState(0);

  return (
    <ChildComponent
      onPress={() => setCount(c => c + 1)}
    />
  );
}
```

**Correct:**

```typescript
function ParentComponent() {
  const [count, setCount] = useState(0);

  const handlePress = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return <ChildComponent onPress={handlePress} />;
}
```

### 4.3 Avoid Object/Array Literals in Props

Inline objects/arrays create new references every render.

**Incorrect:**

```typescript
<CustomButton
  style={{ marginTop: 10, padding: 8 }}
  colors={['#fff', '#000']}
/>
```

**Correct:**

```typescript
const buttonStyle = { marginTop: 10, padding: 8 };
const buttonColors = ['#fff', '#000'];

<CustomButton style={buttonStyle} colors={buttonColors} />
```

Or with StyleSheet:

```typescript
const styles = StyleSheet.create({
  button: { marginTop: 10, padding: 8 },
});

<CustomButton style={styles.button} colors={buttonColors} />
```

### 4.4 Split State Appropriately

Keep unrelated state separate to prevent unnecessary re-renders.

**Incorrect:**

```typescript
const [state, setState] = useState({
  user: null,
  isLoading: false,
  error: null,
  selectedTab: 0,
});
```

**Correct:**

```typescript
const [user, setUser] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
const [selectedTab, setSelectedTab] = useState(0);
```

---

## 5. Memory Management

**Impact: MEDIUM**

Memory leaks cause crashes and poor performance, especially on lower-end devices.

### 5.1 Clean Up Effect Subscriptions

Always return cleanup functions from effects that create subscriptions.

**Incorrect:**

```typescript
useEffect(() => {
  const subscription = AppState.addEventListener('change', handleAppState);
  const keyboardSub = Keyboard.addListener('keyboardDidShow', handleKeyboard);
}, []);
```

**Correct:**

```typescript
useEffect(() => {
  const subscription = AppState.addEventListener('change', handleAppState);
  const keyboardSub = Keyboard.addListener('keyboardDidShow', handleKeyboard);

  return () => {
    subscription.remove();
    keyboardSub.remove();
  };
}, []);
```

### 5.2 Cancel Async Operations on Unmount

Use AbortController or flags to cancel pending operations.

**Incorrect:**

```typescript
useEffect(() => {
  async function loadData() {
    const data = await fetchData();
    setData(data); // May update unmounted component
  }
  loadData();
}, []);
```

**Correct:**

```typescript
useEffect(() => {
  const controller = new AbortController();

  async function loadData() {
    try {
      const data = await fetchData({ signal: controller.signal });
      setData(data);
    } catch (e) {
      if (e.name !== 'AbortError') throw e;
    }
  }

  loadData();
  return () => controller.abort();
}, []);
```

### 5.3 Release Image Resources

Clear image cache and release resources when no longer needed.

**Incorrect:**

```typescript
function Gallery({ images }: Props) {
  return images.map(uri => <Image key={uri} source={{ uri }} />);
}
```

**Correct:**

```typescript
import { Image } from 'expo-image';

function Gallery({ images }: Props) {
  useEffect(() => {
    return () => {
      // Clear cache on unmount for temporary images
      Image.clearMemoryCache();
    };
  }, []);

  return images.map(uri => (
    <Image
      key={uri}
      source={{ uri }}
      cachePolicy="memory-disk"
    />
  ));
}
```

---

## 6. Animation Performance

**Impact: MEDIUM**

Smooth animations require running on the UI thread, not JavaScript.

### 6.1 Use Native Driver When Possible

Enable native driver for transform and opacity animations.

**Incorrect:**

```typescript
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 300,
}).start();
```

**Correct:**

```typescript
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true,
}).start();
```

### 6.2 Prefer Reanimated for Complex Animations

Use react-native-reanimated for gesture-driven animations.

**Incorrect:**

```typescript
// Using Animated API for gesture-based animation
const pan = useRef(new Animated.ValueXY()).current;

const panResponder = PanResponder.create({
  onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }]),
});
```

**Correct:**

```typescript
// Using Reanimated for better performance
import Animated, { useAnimatedGestureHandler } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

const translateX = useSharedValue(0);
const translateY = useSharedValue(0);

const gestureHandler = useAnimatedGestureHandler({
  onActive: (event) => {
    translateX.value = event.translationX;
    translateY.value = event.translationY;
  },
});
```

### 6.3 Avoid Layout Animations During Scroll

Don't trigger layout animations while scrolling.

**Incorrect:**

```typescript
<FlatList
  data={items}
  renderItem={({ item }) => (
    <Animated.View entering={FadeIn}>
      <ItemCard item={item} />
    </Animated.View>
  )}
/>
```

**Correct:**

```typescript
const AnimatedItem = memo(({ item, index }: Props) => (
  <Animated.View
    entering={FadeIn.delay(index * 50).duration(200)}
  >
    <ItemCard item={item} />
  </Animated.View>
));

// Only animate initial render, not during scroll
<FlatList
  data={items}
  renderItem={({ item, index }) => (
    <AnimatedItem item={item} index={index} />
  )}
  initialNumToRender={10}
/>
```

---

## 7. Platform Patterns

**Impact: LOW**

Platform-specific optimizations for iOS and Android.

### 7.1 Use Platform-Specific Extensions

Split platform-specific code into separate files.

**Incorrect:**

```typescript
import { Platform } from 'react-native';

function DatePicker() {
  if (Platform.OS === 'ios') {
    return <IOSDatePicker />;
  }
  return <AndroidDatePicker />;
}
```

**Correct:**

```typescript
// DatePicker.ios.tsx
export function DatePicker() {
  return <IOSDatePicker />;
}

// DatePicker.android.tsx
export function DatePicker() {
  return <AndroidDatePicker />;
}

// Usage - automatically picks correct file
import { DatePicker } from './DatePicker';
```

### 7.2 Use Platform.select for Simple Differences

For small differences, use `Platform.select`.

**Incorrect:**

```typescript
const styles = StyleSheet.create({
  shadow: Platform.OS === 'ios' ? { shadowColor: '#000', shadowOffset: { width: 0, height: 2 } } : { elevation: 4 },
});
```

**Correct:**

```typescript
const styles = StyleSheet.create({
  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    android: {
      elevation: 4,
    },
  }),
});
```

### 7.3 Respect Safe Areas

Always use SafeAreaView or useSafeAreaInsets for edge content.

**Incorrect:**

```typescript
function Screen() {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <Content />
    </View>
  );
}
```

**Correct:**

```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Screen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <Header />
      <Content style={{ paddingBottom: insets.bottom }} />
    </View>
  );
}
```

---

## Summary

| Category               | Impact   | Key Rules                                         |
| ---------------------- | -------- | ------------------------------------------------- |
| Eliminating Waterfalls | CRITICAL | Defer await, Promise.all, start early             |
| Bundle Optimization    | CRITICAL | No barrel imports, lazy load, conditional require |
| List Performance       | HIGH     | FlatList always, memoize items, getItemLayout     |
| Re-render Prevention   | MEDIUM   | memo, useCallback, stable refs                    |
| Memory Management      | MEDIUM   | Cleanup effects, abort controllers                |
| Animation Performance  | MEDIUM   | Native driver, Reanimated                         |
| Platform Patterns      | LOW      | Platform extensions, safe areas                   |

---

## Version

- **1.0** (2026-01-15): Initial release
