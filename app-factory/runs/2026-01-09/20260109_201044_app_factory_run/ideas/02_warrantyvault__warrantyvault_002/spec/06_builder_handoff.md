# Stage 06: Builder Handoff - WarrantyVault

**Run ID**: 20260109_201044_app_factory_run
**Generated**: 2026-01-09

---

## Implementation Priorities

### Phase 1: MVP

| Feature | Priority | Notes |
|---------|----------|-------|
| Project scaffolding | P0 | Expo SDK 52, TypeScript |
| Tab navigation | P0 | Dashboard, Add, Settings |
| Item data model | P0 | AsyncStorage persistence |
| Add Item screen | P0 | Camera + form |
| Dashboard | P0 | Status-grouped list |
| Item Detail | P0 | Receipt viewer + countdown |
| Notifications | P0 | 30-day expiration alerts |
| RevenueCat | P0 | Paywall + purchases |
| Item limit | P0 | 10 items free |
| Restore purchases | P0 | Settings screen |

### MVP Acceptance Criteria
- User can add item with receipt photo
- Dashboard shows items by status
- Notifications fire before expiration
- Paywall blocks 11th item
- Subscription unlocks unlimited
- Data persists across restarts

### Phase 2: Enhancements
- Cloud backup (Firebase, premium)
- PDF export (premium)
- Custom categories (premium)
- Dark mode
- Search/filter

---

## Technical Requirements

### Development Environment
```
Node.js: >= 18.0.0 LTS
Expo CLI: npx expo (latest)
EAS CLI: npm install -g eas-cli
Xcode: 15+ (iOS)
Android Studio: Latest (Android)
```

### Setup Instructions
```bash
git clone <repo>
cd warrantyvault
npm install
cp .env.example .env
# Add RevenueCat keys to .env
npx expo start --dev-client
```

### Critical Dependencies
```json
{
  "expo": "~52.0.0",
  "expo-router": "^4.0.0",
  "react-native-purchases": "^9.0.0",
  "expo-image-picker": "~16.0.0",
  "expo-notifications": "~0.29.0",
  "@react-native-async-storage/async-storage": "^2.0.0",
  "date-fns": "^3.0.0"
}
```

### Environment Variables
| Variable | Purpose |
|----------|---------|
| REVENUECAT_IOS_KEY | iOS API key |
| REVENUECAT_ANDROID_KEY | Android API key |
| FIREBASE_CONFIG | Firebase (Phase 2) |

---

## Quality Requirements

### Testing Strategy

| Type | Tool | Coverage |
|------|------|----------|
| Unit | Jest | 80% business logic |
| Integration | RTL | Component flows |
| E2E | Detox | Critical paths |

### Critical Test Flows
1. Add first item with receipt photo
2. View item detail and countdown
3. Receive and tap notification
4. Hit item limit → paywall
5. Complete purchase
6. Restore purchases

### Performance Criteria
| Metric | Target |
|--------|--------|
| Startup time | < 2 seconds |
| Memory usage | < 150MB |
| Crash-free rate | > 99.5% |

### Accessibility
- VoiceOver / TalkBack testing
- 4.5:1 contrast ratio
- 44pt touch targets
- Dynamic Type 200%

---

## RevenueCat Verification Checklist

- [ ] SDK installed (react-native-purchases)
- [ ] Initialization with platform keys
- [ ] Entitlement model: `premium`
- [ ] Paywall accessible from Settings + item limit
- [ ] Purchase flow implemented
- [ ] Restore purchases working
- [ ] Feature gating active (10-item limit)
- [ ] Debug confirmation of offerings
- [ ] Empty offerings error handling

---

## Deployment

### Build Profiles
| Profile | Purpose |
|---------|---------|
| development | Local testing |
| preview | Internal distribution |
| production | Store submission |

### iOS Submission Checklist
- [ ] App icon 1024x1024 PNG
- [ ] 6.5" screenshots
- [ ] 5.5" screenshots
- [ ] App Privacy completed
- [ ] Privacy policy URL
- [ ] Subscription disclosure

### Android Submission Checklist
- [ ] Hi-res icon 512x512
- [ ] Feature graphic 1024x500
- [ ] Phone screenshots
- [ ] Tablet screenshots
- [ ] Data Safety completed
- [ ] Content rating

---

## Monitoring Setup

### Analytics Events
- `add_item` - Item created
- `paywall_shown` - Paywall displayed
- `purchase_start` - Purchase initiated
- `purchase_complete` - Purchase successful
- `notification_tap` - Alert opened

### Alerts
| Metric | Threshold |
|--------|-----------|
| Crash rate | > 0.5% |
| Error rate | > 1% |
| Startup time | > 3 sec |

---

## Maintenance

### Update Strategy
- **OTA**: EAS Update for JS fixes
- **Binary**: Full build for native changes
- **Versioning**: Semantic (major.minor.patch)

### Support
- Email via Settings > Contact
- Response within 48 hours
- GitHub Issues for tracking

---

*Builder handoff complete - ready for Stage 07 Polish*
