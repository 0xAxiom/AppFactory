# App Factory Skills Reference

**Pipeline:** app-factory
**Skills System:** See `/docs/pipelines/SKILLS_SYSTEM.md`

---

## Registered Skills

| Skill ID                                  | Location                              | Source              | Purpose           |
| ----------------------------------------- | ------------------------------------- | ------------------- | ----------------- |
| `app-factory:react-native-best-practices` | `skills/react-native-best-practices/` | Adapted from Vercel | RN performance    |
| `app-factory:mobile-ui-guidelines`        | `skills/mobile-ui-guidelines/`        | Internal            | Mobile UI/UX      |
| `app-factory:mobile-interface-guidelines` | `skills/mobile-interface-guidelines/` | Internal            | Touch, a11y, perf |
| `app-factory:expo-standards`              | `skills/expo-standards/`              | Internal            | Expo-specific     |

---

## react-native-best-practices

### Quick Reference

**CRITICAL Rules (must not violate):**

```typescript
// async-parallel: Use Promise.all for independent operations
// BAD
const user = await getUser();
const posts = await getPosts();

// GOOD
const [user, posts] = await Promise.all([getUser(), getPosts()]);
```

```typescript
// bundle-imports: Avoid barrel file imports
// BAD
import { Button, Card } from '@/components';

// GOOD
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
```

```typescript
// list-flatlist: Use FlatList for lists > 10 items
// BAD
<ScrollView>
  {items.map(item => <Item key={item.id} {...item} />)}
</ScrollView>

// GOOD
<FlatList
  data={items}
  renderItem={({ item }) => <Item {...item} />}
  keyExtractor={item => item.id}
/>
```

```typescript
// effect-cleanup: Clean up useEffect subscriptions
// BAD
useEffect(() => {
  const subscription = EventEmitter.addListener('event', handler);
}, []);

// GOOD
useEffect(() => {
  const subscription = EventEmitter.addListener('event', handler);
  return () => subscription.remove();
}, []);
```

**HIGH Rules:**

```typescript
// memo-callbacks: Memoize callback functions
// BAD
<FlatList
  data={items}
  renderItem={({ item }) => <Item onPress={() => handlePress(item.id)} />}
/>

// GOOD
const renderItem = useCallback(({ item }) => (
  <Item onPress={() => handlePress(item.id)} />
), [handlePress]);

<FlatList data={items} renderItem={renderItem} />
```

```typescript
// image-optimization: Use optimized image components
// BAD
import { Image } from 'react-native';
<Image source={{ uri: url }} />

// GOOD
import { Image } from 'expo-image';
<Image source={url} contentFit="cover" transition={200} />
```

### When Checked

- **Milestone 3:** After feature implementation
- **Gate 2:** Before monetization phase
- **Ralph:** As 20% weighted scoring category

### Full Rules

See `skills/react-native-best-practices/AGENTS.md` for complete rules.

---

## mobile-ui-guidelines

### Quick Reference

**CRITICAL Rules (Touch & Accessibility):**

```tsx
// touch-target: Minimum touch target size
// BAD
<Pressable style={{ padding: 4 }}>
  <Text>Tap</Text>
</Pressable>

// GOOD - 44pt minimum (iOS) / 48dp (Android)
<Pressable style={{ minWidth: 44, minHeight: 44, padding: 12 }}>
  <Text>Tap</Text>
</Pressable>
```

```tsx
// a11y-labels: Accessibility labels required
// BAD
<Pressable onPress={close}>
  <XIcon />
</Pressable>

// GOOD
<Pressable
  onPress={close}
  accessibilityLabel="Close"
  accessibilityRole="button"
>
  <XIcon />
</Pressable>
```

```tsx
// safe-areas: Use SafeAreaView
// BAD
<View style={{ flex: 1 }}>
  <Content />
</View>;

// GOOD
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView style={{ flex: 1 }}>
  <Content />
</SafeAreaView>;
```

**HIGH Rules:**

```tsx
// skeleton-loading: Skeleton loaders for async content
// BAD
{
  isLoading ? <ActivityIndicator /> : <Content />;
}

// GOOD
{
  isLoading ? (
    <View style={styles.skeleton}>
      <SkeletonPlaceholder>
        <View style={{ height: 20, width: '80%', borderRadius: 4 }} />
      </SkeletonPlaceholder>
    </View>
  ) : (
    <Content />
  );
}
```

```tsx
// empty-states: Designed empty states with CTAs
// BAD
{
  items.length === 0 && <Text>No items</Text>;
}

// GOOD
{
  items.length === 0 && (
    <View style={styles.emptyState}>
      <EmptyIcon size={48} color="#888" />
      <Text style={styles.emptyTitle}>No items yet</Text>
      <Text style={styles.emptySubtitle}>Create your first item to get started</Text>
      <Button onPress={createItem}>Create Item</Button>
    </View>
  );
}
```

### When Checked

- **Milestone 2:** After core screens
- **Gate 1:** Before feature implementation
- **Ralph:** As 25% weighted scoring category

### Full Rules

See `skills/mobile-ui-guidelines/AGENTS.md` for complete rules.

---

## mobile-interface-guidelines

### Quick Reference

**Accessibility:**

```tsx
// voiceover-compatible: VoiceOver/TalkBack support
<Pressable
  accessibilityLabel="Add to cart, $29.99"
  accessibilityHint="Double tap to add this item to your cart"
  accessibilityRole="button"
>
  <AddIcon />
</Pressable>
```

```tsx
// reduced-motion: Respect prefers-reduced-motion
import { useReducedMotion } from 'react-native-reanimated';

const prefersReducedMotion = useReducedMotion();

<Animated.View entering={prefersReducedMotion ? undefined : FadeIn.duration(300)}>
  <Content />
</Animated.View>;
```

**Performance:**

```tsx
// memory-cleanup: Clean up timers and subscriptions
useEffect(() => {
  const timer = setTimeout(callback, 1000);
  const listener = Keyboard.addListener('keyboardDidShow', handler);

  return () => {
    clearTimeout(timer);
    listener.remove();
  };
}, []);
```

```tsx
// flatlist-optimization: Optimize FlatList performance
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
  initialNumToRender={10}
  getItemLayout={getItemLayout} // If fixed height
/>
```

### When Checked

- **Milestone 2, 3:** During development
- **Gate 1, 2:** Quality checkpoints
- **Ralph Final:** Comprehensive check

### Full Rules

See `skills/mobile-interface-guidelines/AGENTS.md` for complete rules.

---

## expo-standards

### Quick Reference

**Configuration:**

```javascript
// app.config.js - Proper configuration
export default {
  expo: {
    name: 'App Name',
    slug: 'app-name',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.example.app',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.example.app',
    },
    plugins: ['expo-router'],
  },
};
```

**Expo Router:**

```tsx
// app/_layout.tsx - Root layout
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
```

```tsx
// app/(tabs)/_layout.tsx - Tab layout
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
```

### When Checked

- **Throughout build:** Continuous validation
- **Ralph:** Configuration and structure checks

### Full Rules

See `skills/expo-standards/SKILL.md` for complete rules.

---

## Skill Compliance in Ralph

Ralph report includes skill scores:

```markdown
## Skills Compliance Summary

| Skill                       | Score | Status      |
| --------------------------- | ----- | ----------- |
| react-native-best-practices | 94%   | CONDITIONAL |
| mobile-ui-guidelines        | 98%   | PASS        |
| mobile-interface-guidelines | 96%   | PASS        |
| expo-standards              | 100%  | PASS        |

### Violations Found

1. **[HIGH] memo-callbacks** - Inline function in FlatList at `app/home.tsx:45`
2. **[MEDIUM] image-optimization** - Using RN Image instead of expo-image at `src/components/Card.tsx:12`

### Required Fixes

- [ ] Memoize renderItem callback in home screen
- [ ] Switch to expo-image for optimized loading
```

---

## Version History

- **1.0** (2026-01-18): Initial skills documentation
