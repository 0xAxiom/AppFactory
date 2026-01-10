# WarrantyVault Compatibility Matrix

## Platform Requirements

| Platform | Minimum Version | Target Version |
|----------|----------------|----------------|
| iOS | 14.0 | 17.0 |
| Android | API 24 (7.0) | API 34 (14) |
| Expo SDK | 52 | 52 |
| React Native | 0.76.x | 0.76.x |
| TypeScript | 5.x | 5.x |

---

## Package Compatibility

### Core Dependencies

| Package | Version | Expo SDK 52 | RN 0.76 | Status |
|---------|---------|-------------|---------|--------|
| expo-router | ^4.0.0 | ✅ | ✅ | Compatible |
| expo-image-picker | ~16.0.0 | ✅ | ✅ | Compatible |
| expo-notifications | ~0.29.0 | ✅ | ✅ | Compatible |
| expo-file-system | ~18.0.0 | ✅ | ✅ | Compatible |
| async-storage | ^2.0.0 | ✅ | ✅ | Compatible |
| react-native-purchases | ^8.0.0 | ✅ | ✅ | Compatible |
| date-fns | ^3.0.0 | ✅ | ✅ | Compatible |
| uuid | ^9.0.0 | ✅ | ✅ | Compatible |

### All Packages Compatible: ✅ YES

---

## Feature Compatibility

### Camera & Media

| Feature | iOS | Android | Notes |
|---------|-----|---------|-------|
| Camera capture | ✅ | ✅ | Requires permission |
| Photo gallery | ✅ | ✅ | Requires permission |
| Image storage | ✅ | ✅ | Local file system |
| Image compression | ✅ | ✅ | Built-in to expo-image-picker |

### Notifications

| Feature | iOS | Android | Notes |
|---------|-----|---------|-------|
| Local notifications | ✅ | ✅ | Requires permission |
| Scheduled notifications | ✅ | ✅ | Works in background |
| Notification badges | ✅ | ✅ | Platform-specific behavior |
| Deep linking from notification | ✅ | ✅ | Via expo-router |

### Storage

| Feature | iOS | Android | Notes |
|---------|-----|---------|-------|
| Async key-value storage | ✅ | ✅ | AsyncStorage |
| File storage | ✅ | ✅ | expo-file-system |
| Data persistence | ✅ | ✅ | Survives app updates |

### Monetization

| Feature | iOS | Android | Notes |
|---------|-----|---------|-------|
| RevenueCat SDK | ✅ | ✅ | react-native-purchases |
| Subscription purchase | ✅ | ✅ | StoreKit / Play Billing |
| Restore purchases | ✅ | ✅ | Required for compliance |
| Entitlement check | ✅ | ✅ | Offline-capable |

---

## Known Limitations

### iOS Specific
- Push notification permission is opt-in (may reduce alert usage)
- Camera permission prompt appears on first use
- Background notification delivery depends on system state

### Android Specific
- POST_NOTIFICATIONS permission required for Android 13+
- File storage location varies by Android version
- Battery optimization may affect notification timing

### Cross-Platform
- Image file sizes vary between devices
- Notification timing not guaranteed to be exact
- No iCloud/Google Drive sync in MVP (local only)

---

## Testing Matrix

### Recommended Test Devices

| Platform | Device | OS Version | Priority |
|----------|--------|------------|----------|
| iOS | iPhone 13 | iOS 17 | High |
| iOS | iPhone SE | iOS 15 | Medium |
| iOS | iPad | iOS 17 | Low |
| Android | Pixel 6 | Android 14 | High |
| Android | Samsung S21 | Android 13 | Medium |
| Android | Budget device | Android 10 | Low |

### Critical Test Scenarios

1. **Fresh install**: Onboarding, permissions, first item add
2. **Notification delivery**: Background and foreground
3. **Image handling**: Large photos, gallery selection
4. **Subscription flow**: Purchase, restore, entitlement check
5. **Data persistence**: App restart, app update simulation

---

## Version Resolution Strategy

### Expo SDK Upgrade Path
- Current: SDK 52
- Next: SDK 53 (when stable)
- Strategy: Follow Expo upgrade guides, test on both platforms

### Package Update Policy
- Use `npx expo install` for Expo-managed packages
- Pin versions to prevent breaking changes
- Test updates in separate branch before merge

---

*Compatibility validated - all packages compatible with Expo SDK 52 and RN 0.76*
