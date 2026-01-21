# Mobile Interface Guidelines Skill

**Source:** Adapted from [vercel-labs/web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines)
**Version:** Adapted January 2026 for React Native/Expo
**License:** MIT

---

## Purpose

Comprehensive mobile UI/UX quality rules for building accessible, performant, and delightful React Native applications. This skill enforces production-grade standards during the Ralph QA phase.

---

## Activation

This skill activates automatically during:

- **Milestone 2 (Core Screens):** Accessibility and touch target checks
- **Milestone 3 (Features):** Performance and list optimization checks
- **Phase 4 (Ralph QA):** Mandatory scoring category (part of Mobile UI Skills, 5% weight)

---

## Categories

| Category             | Rules | Priority | Focus                            |
| -------------------- | ----- | -------- | -------------------------------- |
| **Touch & Gestures** | 6     | HIGH     | Touch targets, gestures, haptics |
| **Animation**        | 5     | MEDIUM   | Motion preferences, performance  |
| **Layout**           | 5     | HIGH     | Safe areas, responsive, platform |
| **Content**          | 5     | MEDIUM   | Empty states, error handling     |
| **Accessibility**    | 8     | HIGH     | VoiceOver, TalkBack, contrast    |
| **Performance**      | 6     | HIGH     | FlatList, memory, main thread    |

---

## Quick Reference

### Critical Rules (Must Pass)

1. **Touch targets** - Minimum 44pt (iOS) / 48dp (Android)
2. **VoiceOver/TalkBack** - All interactive elements accessible
3. **FlatList for lists** - Lists >20 items use FlatList
4. **Safe areas** - Content respects notch and home indicator
5. **Memory cleanup** - useEffect subscriptions cleaned up

### High Priority Rules

- accessibilityLabel on all touchable elements
- accessibilityRole properly set
- Platform-specific back navigation works
- Keyboard avoidance implemented
- No heavy computation on main thread

### Medium Priority Rules

- Respects prefers-reduced-motion
- Haptic feedback on key interactions
- Skeleton loaders for loading states
- Designed empty/error states
- Dynamic type scaling supported

---

## Integration with Ralph

These rules contribute to the **Mobile UI Skills** category in Ralph scoring:

```
Mobile UI Skills (5% of total score)
├── Existing mobile-ui-guidelines rules
└── NEW: mobile-interface-guidelines rules
    ├── Touch & Gestures (targets, haptics)
    ├── Animation (motion preferences)
    ├── Layout (safe areas, platform)
    ├── Accessibility (VoiceOver, TalkBack)
    └── Performance (FlatList, memory)
```

---

## Checking Compliance

During build, Claude checks generated code against these patterns:

```tsx
// GOOD: Proper touch target
<TouchableOpacity
  style={{ minHeight: 44, minWidth: 44 }}
  accessibilityLabel="Submit form"
  accessibilityRole="button"
>
  <Text>Submit</Text>
</TouchableOpacity>

// BAD: Too small, no accessibility
<TouchableOpacity style={{ padding: 4 }}>
  <Icon name="submit" />
</TouchableOpacity>

// GOOD: FlatList for long lists
<FlatList
  data={items}
  renderItem={({ item }) => <Item {...item} />}
  keyExtractor={(item) => item.id}
/>

// BAD: ScrollView with many items
<ScrollView>
  {items.map(item => <Item key={item.id} {...item} />)}
</ScrollView>

// GOOD: Safe area handling
<SafeAreaView edges={['top', 'bottom']}>
  <View style={{ flex: 1 }}>
    {/* Content */}
  </View>
</SafeAreaView>

// BAD: Ignoring safe areas
<View style={{ flex: 1 }}>
  {/* Content cut off by notch */}
</View>
```

---

## Full Rules Document

See [AGENTS.md](./AGENTS.md) for the complete ruleset with examples and rationale.

---

## Optional: agent-browser Integration

For capturing competitor app screenshots from their web presence:

```bash
npm install -g agent-browser
agent-browser install
```

Then use `scripts/research/competitor_screenshots.sh` to capture competitor marketing pages and App Store listings.
