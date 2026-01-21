# Mobile UI Guidelines

**Purpose:** UI/UX quality rules for React Native mobile applications, adapted from Vercel's web-design-guidelines for mobile context.

**Source:** Adapted from [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines)

---

## When to Activate

This skill activates during:

- **Milestone 2** (Core Screens) - After navigation and UI structure are built
- **Phase 4** (Final Ralph QA) - As a scored compliance category

Trigger phrases:

- "Review mobile UI"
- "Check accessibility"
- "Audit UX quality"

---

## How to Use This Skill

1. **During Build:** Reference guidelines when designing screens
2. **After Milestone:** Run compliance check against all rules
3. **During Ralph:** Include skill compliance score in verdict

---

## Rule Categories

| Category             | Rules | Priority |
| -------------------- | ----- | -------- |
| Accessibility        | 8     | HIGH     |
| Touch & Gestures     | 6     | HIGH     |
| Loading States       | 5     | MEDIUM   |
| Empty States         | 4     | MEDIUM   |
| Error States         | 4     | MEDIUM   |
| Platform Conventions | 5     | MEDIUM   |
| Typography           | 4     | LOW      |
| Navigation           | 5     | LOW      |

---

## Accessibility (HIGH)

### A1: Touch Target Sizes

Minimum touch targets: 44x44pt (iOS) / 48x48dp (Android).

**Incorrect:**

```tsx
<Pressable style={{ padding: 4 }}>
  <Icon name="close" size={16} />
</Pressable>
```

**Correct:**

```tsx
<Pressable style={{ padding: 12, minWidth: 44, minHeight: 44 }} accessibilityRole="button" accessibilityLabel="Close">
  <Icon name="close" size={20} />
</Pressable>
```

### A2: Accessibility Labels

All interactive elements must have accessibility labels.

**Incorrect:**

```tsx
<Pressable onPress={handleDelete}>
  <Icon name="trash" />
</Pressable>
```

**Correct:**

```tsx
<Pressable
  onPress={handleDelete}
  accessibilityRole="button"
  accessibilityLabel="Delete item"
  accessibilityHint="Removes this item from your list"
>
  <Icon name="trash" />
</Pressable>
```

### A3: Color Contrast

Text must have 4.5:1 contrast ratio (WCAG AA).

**Incorrect:**

```tsx
<Text style={{ color: '#999', backgroundColor: '#eee' }}>Light gray on light gray</Text>
```

**Correct:**

```tsx
<Text style={{ color: '#595959', backgroundColor: '#fff' }}>Accessible contrast</Text>
```

### A4: Dynamic Type Support

Support system font scaling for accessibility.

**Incorrect:**

```tsx
<Text style={{ fontSize: 14 }}>Fixed size text</Text>
```

**Correct:**

```tsx
<Text style={{ fontSize: 14 }} maxFontSizeMultiplier={1.5} allowFontScaling={true}>
  Scalable text
</Text>
```

### A5: VoiceOver/TalkBack Navigation

Ensure logical focus order for screen readers.

**Incorrect:**

```tsx
// Visual order doesn't match DOM order
<View>
  <Button style={styles.floatingButton} />
  <Text>Main content</Text>
  <Header />
</View>
```

**Correct:**

```tsx
<View>
  <Header />
  <Text>Main content</Text>
  <Button style={styles.floatingButton} accessibilityLabel="Action button" />
</View>
```

### A6: Reduce Motion Support

Respect user's reduced motion preference.

**Incorrect:**

```tsx
<Animated.View entering={BounceIn.duration(1000)}>
  <Content />
</Animated.View>
```

**Correct:**

```tsx
import { useReducedMotion } from 'react-native-reanimated';

function AnimatedContent() {
  const reducedMotion = useReducedMotion();

  return (
    <Animated.View entering={reducedMotion ? FadeIn.duration(0) : BounceIn.duration(500)}>
      <Content />
    </Animated.View>
  );
}
```

### A7: Focus Indicators

Show visible focus state for keyboard/switch control users.

**Incorrect:**

```tsx
<Pressable onPress={handlePress}>
  <Text>Button</Text>
</Pressable>
```

**Correct:**

```tsx
<Pressable onPress={handlePress} style={({ focused }) => [styles.button, focused && styles.buttonFocused]}>
  <Text>Button</Text>
</Pressable>;

const styles = StyleSheet.create({
  button: { padding: 16 },
  buttonFocused: { borderWidth: 2, borderColor: '#007AFF' },
});
```

### A8: Error Announcement

Announce errors to screen readers.

**Incorrect:**

```tsx
{
  error && <Text style={styles.error}>{error}</Text>;
}
```

**Correct:**

```tsx
{
  error && (
    <Text style={styles.error} accessibilityRole="alert" accessibilityLiveRegion="assertive">
      {error}
    </Text>
  );
}
```

---

## Touch & Gestures (HIGH)

### T1: Visual Touch Feedback

All touchable elements must show feedback.

**Incorrect:**

```tsx
<TouchableWithoutFeedback onPress={handlePress}>
  <View>
    <Text>Tap me</Text>
  </View>
</TouchableWithoutFeedback>
```

**Correct:**

```tsx
<Pressable onPress={handlePress} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
  <Text>Tap me</Text>
</Pressable>
```

### T2: Haptic Feedback

Use haptics for important interactions.

**Incorrect:**

```tsx
<Pressable onPress={handleDelete}>
  <Text>Delete</Text>
</Pressable>
```

**Correct:**

```tsx
import * as Haptics from 'expo-haptics';

<Pressable
  onPress={() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleDelete();
  }}
>
  <Text>Delete</Text>
</Pressable>;
```

### T3: Gesture Conflict Prevention

Avoid overlapping gesture handlers.

**Incorrect:**

```tsx
<ScrollView>
  <PanGestureHandler onGestureEvent={handlePan}>
    <Animated.View>
      <Content />
    </Animated.View>
  </PanGestureHandler>
</ScrollView>
```

**Correct:**

```tsx
<GestureHandlerRootView>
  <PanGestureHandler onGestureEvent={handlePan} activeOffsetX={[-10, 10]} failOffsetY={[-5, 5]}>
    <Animated.View>
      <ScrollView>
        <Content />
      </ScrollView>
    </Animated.View>
  </PanGestureHandler>
</GestureHandlerRootView>
```

### T4: Swipe Actions

Swipeable actions should be discoverable.

**Incorrect:**

```tsx
// Hidden swipe actions with no indication
<Swipeable renderRightActions={renderDelete}>
  <ListItem />
</Swipeable>
```

**Correct:**

```tsx
<Swipeable renderRightActions={renderDelete} overshootRight={false}>
  <ListItem hint="Swipe left to delete" />
</Swipeable>
```

### T5: Long Press Discoverability

Long press actions need alternative access.

**Incorrect:**

```tsx
<Pressable onLongPress={showContextMenu}>
  <ItemCard />
</Pressable>
```

**Correct:**

```tsx
<Pressable onLongPress={showContextMenu}>
  <ItemCard />
  <Pressable onPress={showContextMenu} accessibilityLabel="More options" style={styles.menuButton}>
    <Icon name="more-horizontal" />
  </Pressable>
</Pressable>
```

### T6: Pull to Refresh

Implement standard pull-to-refresh for refreshable content.

**Incorrect:**

```tsx
<FlatList
  data={items}
  renderItem={renderItem}
/>
<Button onPress={refresh}>Refresh</Button>
```

**Correct:**

```tsx
<FlatList
  data={items}
  renderItem={renderItem}
  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />}
/>
```

---

## Loading States (MEDIUM)

### L1: Skeleton Screens

Show skeleton placeholders, not spinners, for content loading.

**Incorrect:**

```tsx
{
  isLoading ? <ActivityIndicator size="large" /> : <ContentList data={data} />;
}
```

**Correct:**

```tsx
{
  isLoading ? (
    <View>
      <Skeleton width="100%" height={80} />
      <Skeleton width="100%" height={80} />
      <Skeleton width="100%" height={80} />
    </View>
  ) : (
    <ContentList data={data} />
  );
}
```

### L2: Progressive Loading

Load critical content first, enhance progressively.

**Incorrect:**

```tsx
// Wait for all data before showing anything
const { data, isLoading } = useQuery(['all']);
if (isLoading) return <Loading />;
```

**Correct:**

```tsx
// Load and show critical data first
const { data: header } = useQuery(['header']);
const { data: details } = useQuery(['details']);

return (
  <View>
    {header ? <Header data={header} /> : <HeaderSkeleton />}
    {details ? <Details data={details} /> : <DetailsSkeleton />}
  </View>
);
```

### L3: Button Loading States

Buttons should show loading state during async actions.

**Incorrect:**

```tsx
<Button onPress={handleSubmit} disabled={isSubmitting}>
  Submit
</Button>
```

**Correct:**

```tsx
<Button onPress={handleSubmit} disabled={isSubmitting} loading={isSubmitting}>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</Button>
```

### L4: Optimistic Updates

Show changes immediately, reconcile with server.

**Incorrect:**

```tsx
async function toggleLike() {
  await api.toggleLike(postId);
  refetch(); // Wait for server response
}
```

**Correct:**

```tsx
async function toggleLike() {
  // Optimistic update
  setIsLiked(!isLiked);
  setLikeCount((c) => (isLiked ? c - 1 : c + 1));

  try {
    await api.toggleLike(postId);
  } catch (error) {
    // Revert on failure
    setIsLiked(isLiked);
    setLikeCount(likeCount);
  }
}
```

### L5: Infinite Scroll Loading

Show loading indicator at list end during pagination.

**Incorrect:**

```tsx
<FlatList data={items} onEndReached={loadMore} />
```

**Correct:**

```tsx
<FlatList
  data={items}
  onEndReached={loadMore}
  onEndReachedThreshold={0.5}
  ListFooterComponent={isLoadingMore ? <ActivityIndicator style={{ padding: 16 }} /> : null}
/>
```

---

## Empty States (MEDIUM)

### E1: Designed Empty States

Empty states must have icon, message, and CTA.

**Incorrect:**

```tsx
{
  items.length === 0 && <Text>No items</Text>;
}
```

**Correct:**

```tsx
{
  items.length === 0 && (
    <View style={styles.emptyState}>
      <View style={styles.iconContainer}>
        <Icon name="inbox" size={48} color="#999" />
      </View>
      <Text style={styles.emptyTitle}>No items yet</Text>
      <Text style={styles.emptyMessage}>Start by adding your first item</Text>
      <Button onPress={handleAdd}>Add Item</Button>
    </View>
  );
}
```

### E2: Contextual Empty States

Empty state messaging should be context-specific.

**Incorrect:**

```tsx
// Generic message for all empty states
<EmptyState message="No data found" />
```

**Correct:**

```tsx
// Search results empty
<EmptyState
  icon="search"
  title="No results found"
  message={`No items match "${searchQuery}"`}
  action={{ label: 'Clear search', onPress: clearSearch }}
/>

// Favorites empty
<EmptyState
  icon="heart"
  title="No favorites yet"
  message="Items you favorite will appear here"
  action={{ label: 'Browse items', onPress: goToBrowse }}
/>
```

### E3: First-Run Experience

New users need guidance, not just empty states.

**Incorrect:**

```tsx
{
  isFirstRun && items.length === 0 && <Text>No items</Text>;
}
```

**Correct:**

```tsx
{
  isFirstRun && items.length === 0 && (
    <View style={styles.onboarding}>
      <Text style={styles.welcomeTitle}>Welcome to AppName!</Text>
      <Text style={styles.welcomeMessage}>Let's get you started with your first item</Text>
      <Button onPress={startOnboarding}>Get Started</Button>
      <Button variant="ghost" onPress={skipOnboarding}>
        I'll explore on my own
      </Button>
    </View>
  );
}
```

### E4: Error Recovery in Empty States

Failed loads should offer retry, not just empty state.

**Incorrect:**

```tsx
{
  error && <EmptyState message="Something went wrong" />;
}
```

**Correct:**

```tsx
{
  error && (
    <View style={styles.errorState}>
      <Icon name="alert-circle" size={48} color="#dc3545" />
      <Text style={styles.errorTitle}>Failed to load</Text>
      <Text style={styles.errorMessage}>{error.message}</Text>
      <Button onPress={retry}>Try Again</Button>
    </View>
  );
}
```

---

## Error States (MEDIUM)

### ER1: Styled Error Messages

Errors must be visually distinct and helpful.

**Incorrect:**

```tsx
{
  error && <Text style={{ color: 'red' }}>{error}</Text>;
}
```

**Correct:**

```tsx
{
  error && (
    <View style={styles.errorCard}>
      <Icon name="alert-circle" color="#dc3545" />
      <View style={styles.errorContent}>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
      <Pressable onPress={dismiss}>
        <Icon name="x" />
      </Pressable>
    </View>
  );
}
```

### ER2: Form Validation Errors

Show inline validation with clear messaging.

**Incorrect:**

```tsx
<TextInput value={email} onChangeText={setEmail} />;
{
  emailError && <Text>Invalid</Text>;
}
```

**Correct:**

```tsx
<View>
  <Text style={styles.label}>Email</Text>
  <TextInput
    value={email}
    onChangeText={setEmail}
    style={[styles.input, emailError && styles.inputError]}
    accessibilityLabel="Email address"
    accessibilityHint={emailError || undefined}
  />
  {emailError && (
    <Text style={styles.errorText} accessibilityRole="alert">
      {emailError}
    </Text>
  )}
</View>
```

### ER3: Network Error Handling

Network failures need specific messaging and retry.

**Incorrect:**

```tsx
catch (e) {
  setError('Error occurred');
}
```

**Correct:**

```tsx
catch (e) {
  if (e instanceof NetworkError) {
    setError({
      title: 'No internet connection',
      message: 'Check your connection and try again',
      canRetry: true,
    });
  } else if (e instanceof TimeoutError) {
    setError({
      title: 'Request timed out',
      message: 'The server took too long to respond',
      canRetry: true,
    });
  } else {
    setError({
      title: 'Something went wrong',
      message: e.message,
      canRetry: false,
    });
  }
}
```

### ER4: Graceful Degradation

App should remain usable when features fail.

**Incorrect:**

```tsx
// Crash the whole screen on error
if (error) throw error;
```

**Correct:**

```tsx
// Show partial content with error for failed section
<View>
  <Header /> {/* Always shows */}
  {profileError ? <ProfileErrorCard onRetry={retryProfile} /> : <ProfileSection data={profile} />}
  <Navigation /> {/* Always shows */}
</View>
```

---

## Platform Conventions (MEDIUM)

### P1: iOS Back Gesture

Don't block the iOS swipe-back gesture.

**Incorrect:**

```tsx
<PanGestureHandler onGestureEvent={handlePan}>
  <View style={{ flex: 1 }}>
    <Content />
  </View>
</PanGestureHandler>
```

**Correct:**

```tsx
<PanGestureHandler
  onGestureEvent={handlePan}
  activeOffsetX={[20, 100]} // Don't activate near left edge
>
  <View style={{ flex: 1 }}>
    <Content />
  </View>
</PanGestureHandler>
```

### P2: Android Back Button

Handle Android hardware back button appropriately.

**Incorrect:**

```tsx
// Ignores Android back button
function ModalScreen() {
  return (
    <Modal>
      <Content />
    </Modal>
  );
}
```

**Correct:**

```tsx
import { BackHandler } from 'react-native';

function ModalScreen({ onClose }) {
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => handler.remove();
  }, [onClose]);

  return (
    <Modal>
      <Content />
    </Modal>
  );
}
```

### P3: Status Bar Handling

Manage status bar style based on content.

**Incorrect:**

```tsx
function DarkScreen() {
  return (
    <View style={{ backgroundColor: '#000' }}>
      <Content />
    </View>
  );
}
```

**Correct:**

```tsx
import { StatusBar } from 'expo-status-bar';

function DarkScreen() {
  return (
    <View style={{ backgroundColor: '#000' }}>
      <StatusBar style="light" />
      <Content />
    </View>
  );
}
```

### P4: Keyboard Handling

Handle keyboard appearance gracefully.

**Incorrect:**

```tsx
<View>
  <ScrollView>
    <Form />
  </ScrollView>
</View>
```

**Correct:**

```tsx
import { KeyboardAvoidingView, Platform } from 'react-native';

<KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={headerHeight}
>
  <ScrollView keyboardShouldPersistTaps="handled">
    <Form />
  </ScrollView>
</KeyboardAvoidingView>;
```

### P5: Safe Area Handling

Respect device safe areas (notch, home indicator).

**Incorrect:**

```tsx
<View style={{ flex: 1 }}>
  <Header />
  <Content />
  <TabBar />
</View>
```

**Correct:**

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Screen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <Header style={{ paddingTop: insets.top }} />
      <Content />
      <TabBar style={{ paddingBottom: insets.bottom }} />
    </View>
  );
}
```

---

## Compliance Scoring

```
skill_score = (passed_rules / applicable_rules) × 100

Thresholds:
- PASS: ≥95%
- CONDITIONAL: 90-94%
- FAIL: <90%

HIGH priority violations count double.
```

---

## Integration with Ralph

Ralph includes this skill as a scoring category:

```markdown
### Mobile UI Skills Compliance (5% weight)

- [ ] Touch targets meet minimum size (44pt/48dp)
- [ ] All interactive elements have accessibility labels
- [ ] Skeleton loaders for async content
- [ ] Designed empty states with CTAs
- [ ] Styled error states with retry options
- [ ] Safe areas properly handled
- [ ] Overall skill score ≥95%
```

---

## Version

- **1.0** (2026-01-15): Initial release, adapted from Vercel web-design-guidelines
