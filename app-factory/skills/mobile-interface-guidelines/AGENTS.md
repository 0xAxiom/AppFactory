# Mobile Interface Guidelines - Complete Ruleset

**Source:** Adapted from [vercel-labs/web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines)
**Adapted for:** App Factory app-factory pipeline (React Native/Expo)
**Last Updated:** January 2026

---

## How to Use This Document

When generating mobile applications, Claude MUST follow these rules. During Ralph QA, compliance with these rules contributes to the Mobile UI Skills category (5% of total score).

**Priority Levels:**

- **CRITICAL** - Must pass or build fails
- **HIGH** - Should pass; failures reduce score significantly
- **MEDIUM** - Should pass; failures reduce score moderately
- **LOW** - Nice to have; minor score impact

---

## 1. Touch & Gestures

### TOU-1: Touch Targets (CRITICAL)

Interactive elements must be at least 44pt (iOS) / 48dp (Android).

```tsx
// GOOD: Adequate touch target
<TouchableOpacity
  style={{
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  <Icon name="settings" size={24} />
</TouchableOpacity>

// GOOD: Using Pressable with hitSlop
<Pressable
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  onPress={handlePress}
>
  <Icon name="close" size={20} />
</Pressable>

// BAD: Too small
<TouchableOpacity style={{ padding: 4 }}>
  <Icon name="settings" size={16} />
</TouchableOpacity>
```

### TOU-2: Touch Feedback (HIGH)

Provide visual feedback on touch.

```tsx
// GOOD: Opacity feedback
<TouchableOpacity activeOpacity={0.7}>
  <Text>Press me</Text>
</TouchableOpacity>

// GOOD: Highlight feedback
<TouchableHighlight
  underlayColor="#DDDDDD"
  onPress={handlePress}
>
  <View style={styles.button}>
    <Text>Press me</Text>
  </View>
</TouchableHighlight>

// GOOD: Pressable with style function
<Pressable
  style={({ pressed }) => [
    styles.button,
    pressed && styles.buttonPressed,
  ]}
>
  <Text>Press me</Text>
</Pressable>
```

### TOU-3: Haptic Feedback (MEDIUM)

Use haptic feedback for important interactions.

```tsx
import * as Haptics from 'expo-haptics';

// GOOD: Haptic on success
const handlePurchase = async () => {
  await completePurchase();
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

// GOOD: Haptic on selection
const handleSelect = (item) => {
  Haptics.selectionAsync();
  setSelected(item);
};

// GOOD: Impact feedback on button press
<Pressable
  onPress={() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleAction();
  }}
>
```

### TOU-4: Swipe Gestures (MEDIUM)

Implement standard swipe gestures where appropriate.

```tsx
import { Swipeable } from 'react-native-gesture-handler';

// GOOD: Swipe to delete
<Swipeable
  renderRightActions={() => (
    <TouchableOpacity style={styles.deleteAction}>
      <Icon name="trash" color="white" />
    </TouchableOpacity>
  )}
  onSwipeableRightOpen={handleDelete}
>
  <ListItem {...item} />
</Swipeable>;
```

### TOU-5: Pull to Refresh (HIGH)

Refreshable content should support pull-to-refresh.

```tsx
// GOOD: Pull to refresh
<FlatList
  data={items}
  renderItem={renderItem}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      tintColor="#007AFF"
    />
  }
/>

// BAD: Manual refresh button only
<View>
  <Button onPress={handleRefresh}>Refresh</Button>
  <FlatList data={items} renderItem={renderItem} />
</View>
```

### TOU-6: Scroll Indicators (LOW)

Show scroll indicators for scrollable content.

```tsx
// GOOD: Scroll indicator visible
<ScrollView showsVerticalScrollIndicator={true}>
  {content}
</ScrollView>

// In long lists, indicator helps orientation
<FlatList
  showsVerticalScrollIndicator={true}
  data={longList}
  renderItem={renderItem}
/>
```

---

## 2. Animation

### ANI-1: Reduced Motion (CRITICAL)

Respect user's reduced motion preferences.

```tsx
import { useReducedMotion } from 'react-native-reanimated';

// GOOD: Check motion preference
function AnimatedCard({ children }) {
  const reducedMotion = useReducedMotion();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: reducedMotion ? [] : [{ scale: withSpring(isPressed ? 0.95 : 1) }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

// GOOD: AccessibilityInfo API
import { AccessibilityInfo } from 'react-native';

const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);

useEffect(() => {
  AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotionEnabled);
  const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotionEnabled);
  return () => subscription.remove();
}, []);
```

### ANI-2: Native Driver (HIGH)

Use native driver for animations when possible.

```tsx
import Animated, { useNativeDriver } from 'react-native-reanimated';

// GOOD: Native driver animation
const fadeAnim = useSharedValue(0);

const animatedStyle = useAnimatedStyle(() => ({
  opacity: fadeAnim.value,
  transform: [{ translateY: (1 - fadeAnim.value) * 20 }],
}));

// GOOD: Animated API with native driver
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true, // Only for transform and opacity
}).start();

// BAD: Animating layout properties
Animated.timing(heightAnim, {
  toValue: 100,
  useNativeDriver: true, // Will crash - height not supported
}).start();
```

### ANI-3: Screen Transitions (MEDIUM)

Use smooth transitions between screens.

```tsx
// GOOD: Custom transition in Expo Router
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_right',
        animationDuration: 200,
      }}
    />
  );
}

// GOOD: Modal presentation
<Stack.Screen
  name="modal"
  options={{
    presentation: 'modal',
    animation: 'slide_from_bottom',
  }}
/>;
```

### ANI-4: Loading Animations (MEDIUM)

Use subtle loading animations.

```tsx
// GOOD: Skeleton pulse animation
function Skeleton({ width, height }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(withTiming(0.7, { duration: 800 }), withTiming(0.3, { duration: 800 })),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    backgroundColor: '#E5E7EB',
    width,
    height,
    borderRadius: 4,
  }));

  return <Animated.View style={animatedStyle} />;
}
```

### ANI-5: Gesture-Driven Animation (LOW)

Animations should respond to gesture input.

```tsx
// GOOD: Gesture-driven card
function SwipeableCard() {
  const translateX = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (Math.abs(e.translationX) > 100) {
        translateX.value = withTiming(e.translationX > 0 ? 300 : -300);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animatedStyle}>
        <Card />
      </Animated.View>
    </GestureDetector>
  );
}
```

---

## 3. Layout

### LAY-1: Safe Areas (CRITICAL)

Respect device safe areas (notch, home indicator, status bar).

```tsx
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// GOOD: SafeAreaView wrapper
function Screen({ children }) {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      {children}
    </SafeAreaView>
  );
}

// GOOD: Manual inset handling
function CustomHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }}>
      <Text>Header</Text>
    </View>
  );
}

// GOOD: Bottom tab bar
function TabBar() {
  const insets = useSafeAreaInsets();

  return <View style={{ paddingBottom: insets.bottom }}>{/* Tab items */}</View>;
}

// BAD: Ignoring safe areas
<View style={{ flex: 1 }}>{/* Content blocked by notch */}</View>;
```

### LAY-2: Platform Conventions (HIGH)

Follow platform-specific UI conventions.

```tsx
import { Platform } from 'react-native';

// GOOD: Platform-specific back button
function Header({ title, onBack }) {
  return (
    <View style={styles.header}>
      {Platform.OS === 'ios' ? (
        <TouchableOpacity onPress={onBack}>
          <Icon name="chevron-left" />
          <Text>Back</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onBack}>
          <Icon name="arrow-left" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

// GOOD: Platform-specific styling
const styles = StyleSheet.create({
  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
  }),
});
```

### LAY-3: Keyboard Avoidance (HIGH)

Handle keyboard appearance properly.

```tsx
import { KeyboardAvoidingView, Platform } from 'react-native';

// GOOD: Keyboard avoiding form
function LoginForm() {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <TextInput placeholder="Email" />
        <TextInput placeholder="Password" secureTextEntry />
        <Button title="Login" onPress={handleLogin} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// GOOD: Dismiss keyboard on tap outside
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
  <View style={{ flex: 1 }}>{/* Form content */}</View>
</TouchableWithoutFeedback>;
```

### LAY-4: Responsive Layout (MEDIUM)

Adapt layout to different screen sizes.

```tsx
import { useWindowDimensions } from 'react-native';

// GOOD: Responsive grid
function Grid({ items }) {
  const { width } = useWindowDimensions();
  const numColumns = width > 600 ? 3 : 2;

  return (
    <FlatList
      data={items}
      numColumns={numColumns}
      key={numColumns} // Re-render on column change
      renderItem={({ item }) => (
        <View style={{ width: width / numColumns - 16 }}>
          <GridItem {...item} />
        </View>
      )}
    />
  );
}

// GOOD: Orientation handling
function useOrientation() {
  const { width, height } = useWindowDimensions();
  return width > height ? 'landscape' : 'portrait';
}
```

### LAY-5: StyleSheet Usage (MEDIUM)

Use StyleSheet.create for styles.

```tsx
// GOOD: StyleSheet.create
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

// BAD: Inline styles (causes re-renders)
<View style={{ flex: 1, padding: 16 }}>
  <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Title</Text>
</View>;
```

---

## 4. Content

### CON-1: Empty States (HIGH)

Design empty states with icon, message, and action.

```tsx
// GOOD: Designed empty state
function EmptyInbox() {
  return (
    <View style={styles.emptyContainer}>
      <InboxIcon size={64} color="#9CA3AF" />
      <Text style={styles.emptyTitle}>No messages yet</Text>
      <Text style={styles.emptySubtitle}>Start a conversation to see messages here</Text>
      <TouchableOpacity style={styles.emptyButton} onPress={handleCompose}>
        <Text style={styles.emptyButtonText}>Send Message</Text>
      </TouchableOpacity>
    </View>
  );
}

// BAD: Plain text
<Text>No messages</Text>;
```

### CON-2: Error States (HIGH)

Error states should explain and offer recovery.

```tsx
// GOOD: Helpful error state
function ErrorState({ error, onRetry }) {
  return (
    <View style={styles.errorContainer}>
      <AlertCircleIcon size={48} color="#EF4444" />
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorMessage}>{error.message}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <RefreshIcon size={20} color="white" />
        <Text style={styles.retryText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}

// BAD: Generic error
<Text style={{ color: 'red' }}>Error</Text>;
```

### CON-3: Loading States (HIGH)

Use skeleton loaders, not spinners.

```tsx
// GOOD: Skeleton loader
function CardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton width={200} height={20} />
      <View style={{ height: 8 }} />
      <Skeleton width={150} height={16} />
      <View style={{ height: 8 }} />
      <Skeleton width="100%" height={100} />
    </View>
  );
}

// GOOD: List with skeletons
function ListLoading() {
  return (
    <View>
      {[1, 2, 3, 4, 5].map((i) => (
        <CardSkeleton key={i} />
      ))}
    </View>
  );
}

// BAD: Centered spinner
<View style={styles.centered}>
  <ActivityIndicator size="large" />
</View>;
```

### CON-4: Confirmation Dialogs (MEDIUM)

Destructive actions require confirmation.

```tsx
import { Alert } from 'react-native';

// GOOD: Confirmation before delete
const handleDelete = () => {
  Alert.alert('Delete Item', 'Are you sure? This cannot be undone.', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Delete',
      style: 'destructive',
      onPress: confirmDelete,
    },
  ]);
};
```

### CON-5: Text Truncation (LOW)

Handle long text gracefully.

```tsx
// GOOD: Truncated text with numberOfLines
<Text numberOfLines={2} ellipsizeMode="tail">
  {longDescription}
</Text>;

// GOOD: Expandable text
function ExpandableText({ text, maxLines = 3 }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View>
      <Text numberOfLines={expanded ? undefined : maxLines}>{text}</Text>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text style={styles.link}>{expanded ? 'Show less' : 'Read more'}</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## 5. Accessibility

### ACC-1: Accessibility Labels (CRITICAL)

All interactive elements must have accessibility labels.

```tsx
// GOOD: Proper accessibility
<TouchableOpacity
  accessibilityLabel="Add item to cart"
  accessibilityRole="button"
  accessibilityHint="Double tap to add this item to your shopping cart"
>
  <Icon name="plus" />
</TouchableOpacity>

// GOOD: Image with description
<Image
  source={productImage}
  accessibilityLabel="Red Nike running shoes, side view"
/>

// BAD: No accessibility
<TouchableOpacity>
  <Icon name="plus" />
</TouchableOpacity>
```

### ACC-2: Accessibility Roles (HIGH)

Use correct accessibility roles.

```tsx
// GOOD: Proper roles
<TouchableOpacity accessibilityRole="button">
  <Text>Submit</Text>
</TouchableOpacity>

<TouchableOpacity accessibilityRole="link">
  <Text>Learn more</Text>
</TouchableOpacity>

<Switch accessibilityRole="switch" />

<TextInput accessibilityRole="search" placeholder="Search..." />

<View accessibilityRole="header">
  <Text style={styles.heading}>Section Title</Text>
</View>
```

### ACC-3: Screen Reader Announcements (HIGH)

Announce important changes to screen readers.

```tsx
import { AccessibilityInfo } from 'react-native';

// GOOD: Announce success
const handlePurchase = async () => {
  await completePurchase();
  AccessibilityInfo.announceForAccessibility('Purchase complete');
};

// GOOD: Announce errors
const handleError = (error) => {
  setError(error);
  AccessibilityInfo.announceForAccessibility(`Error: ${error.message}`);
};
```

### ACC-4: Focus Management (MEDIUM)

Manage focus for modals and navigation.

```tsx
// GOOD: Auto-focus first input
function SearchScreen() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <TextInput ref={inputRef} accessibilityLabel="Search" placeholder="Search..." />;
}
```

### ACC-5: Color Contrast (HIGH)

Maintain 4.5:1 contrast ratio for text.

```tsx
// GOOD: High contrast
const styles = StyleSheet.create({
  text: {
    color: '#1F2937', // Dark gray on white
  },
  secondaryText: {
    color: '#6B7280', // Medium gray, still accessible
  },
});

// BAD: Low contrast
const badStyles = StyleSheet.create({
  text: {
    color: '#D1D5DB', // Light gray on white - hard to read
  },
});
```

### ACC-6: Dynamic Type (MEDIUM)

Support user's preferred text size.

```tsx
import { PixelRatio } from 'react-native';

// GOOD: Scaled font sizes
const scaledFontSize = (size) => {
  const scale = PixelRatio.getFontScale();
  return size * scale;
};

// GOOD: Using Text's allowFontScaling
<Text allowFontScaling={true} style={{ fontSize: 16 }}>
  This text will scale with system settings
</Text>

// For critical UI where scaling might break layout:
<Text allowFontScaling={false} style={{ fontSize: 12 }}>
  Tab Label
</Text>
```

### ACC-7: Touch Accessibility (MEDIUM)

Group related elements for accessibility.

```tsx
// GOOD: Accessible list item
<TouchableOpacity
  accessibilityLabel={`${item.title}, ${item.subtitle}, ${item.price}`}
  accessibilityRole="button"
>
  <View style={styles.row}>
    <Text style={styles.title}>{item.title}</Text>
    <Text style={styles.subtitle}>{item.subtitle}</Text>
    <Text style={styles.price}>{item.price}</Text>
  </View>
</TouchableOpacity>

// BAD: Each element separately focusable
<View style={styles.row}>
  <Text accessibilityRole="text">{item.title}</Text>
  <Text accessibilityRole="text">{item.subtitle}</Text>
  <TouchableOpacity>
    <Text>{item.price}</Text>
  </TouchableOpacity>
</View>
```

### ACC-8: Accessibility Testing (HIGH)

Test with VoiceOver (iOS) and TalkBack (Android).

**Checklist:**

- [ ] All buttons/links announced with clear labels
- [ ] Screen reader can navigate between all elements
- [ ] Form inputs have labels read correctly
- [ ] Headings properly identified
- [ ] Images have meaningful alt text
- [ ] Dynamic changes announced

---

## 6. Performance

### PER-1: FlatList for Lists (CRITICAL)

Lists with more than 20 items must use FlatList.

```tsx
// GOOD: FlatList for performance
<FlatList
  data={items}
  renderItem={({ item }) => <ListItem {...item} />}
  keyExtractor={(item) => item.id}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
/>

// GOOD: SectionList for grouped data
<SectionList
  sections={sections}
  renderItem={({ item }) => <ListItem {...item} />}
  renderSectionHeader={({ section }) => <Header title={section.title} />}
  keyExtractor={(item) => item.id}
/>

// BAD: ScrollView with many items
<ScrollView>
  {items.map(item => <ListItem key={item.id} {...item} />)}
</ScrollView>
```

### PER-2: Memory Cleanup (CRITICAL)

Clean up subscriptions and listeners in useEffect.

```tsx
// GOOD: Cleanup in useEffect
useEffect(() => {
  const subscription = eventEmitter.addListener('event', handler);

  return () => {
    subscription.remove();
  };
}, []);

// GOOD: Abort controller for fetch
useEffect(() => {
  const controller = new AbortController();

  fetch(url, { signal: controller.signal }).then(handleResponse).catch(handleError);

  return () => controller.abort();
}, [url]);

// BAD: No cleanup
useEffect(() => {
  eventEmitter.addListener('event', handler);
}, []);
```

### PER-3: Image Optimization (HIGH)

Optimize images for mobile.

```tsx
import { Image } from 'expo-image';

// GOOD: Optimized image loading
<Image
  source={{ uri: imageUrl }}
  style={{ width: 200, height: 200 }}
  contentFit="cover"
  placeholder={blurhash}
  transition={200}
/>

// GOOD: Cached images
<Image
  source={{ uri: imageUrl }}
  cachePolicy="memory-disk"
/>
```

### PER-4: Avoid Main Thread Work (HIGH)

Keep heavy computation off the main thread.

```tsx
// GOOD: Defer expensive work
import { InteractionManager } from 'react-native';

useEffect(() => {
  InteractionManager.runAfterInteractions(() => {
    // Heavy computation after animations complete
    processData(data);
  });
}, [data]);

// GOOD: Use worklets for animation calculations
const animatedStyle = useAnimatedStyle(() => {
  // Runs on UI thread, not JS thread
  return {
    transform: [{ rotate: `${rotation.value}deg` }],
  };
});

// BAD: Heavy computation in render
function Component({ data }) {
  const processed = expensiveOperation(data); // Blocks render
  return <View>{/* ... */}</View>;
}
```

### PER-5: Memoization (MEDIUM)

Use memo and useCallback appropriately.

```tsx
// GOOD: Memoized list item
const ListItem = memo(function ListItem({ item, onPress }) {
  return (
    <TouchableOpacity onPress={() => onPress(item.id)}>
      <Text>{item.title}</Text>
    </TouchableOpacity>
  );
});

// GOOD: Stable callback
const handlePress = useCallback(
  (id) => {
    navigation.navigate('Detail', { id });
  },
  [navigation]
);

// GOOD: Memoized computation
const sortedItems = useMemo(() => {
  return [...items].sort((a, b) => a.title.localeCompare(b.title));
}, [items]);
```

### PER-6: Lazy Loading (MEDIUM)

Lazy load screens and heavy components.

```tsx
// GOOD: Lazy loaded screen in Expo Router
// This happens automatically with file-based routing

// GOOD: Deferred component loading
const HeavyChart = lazy(() => import('./HeavyChart'));

function Dashboard() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <HeavyChart data={data} />
    </Suspense>
  );
}
```

---

## Compliance Scoring

During Ralph QA, these rules are checked and scored:

| Category         | Weight | Items   |
| ---------------- | ------ | ------- |
| Touch & Gestures | 20%    | 6 rules |
| Animation        | 15%    | 5 rules |
| Layout           | 20%    | 5 rules |
| Content          | 15%    | 5 rules |
| Accessibility    | 20%    | 8 rules |
| Performance      | 20%    | 6 rules |

**Pass Threshold:** 95% of HIGH/CRITICAL rules, 80% of MEDIUM rules

**Automatic Failure:** Any CRITICAL rule violation (touch targets, safe areas, FlatList, memory cleanup, accessibility labels, reduced motion)
