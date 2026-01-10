# Stage 05: Technical Architecture - WarrantyVault

**Run ID**: 20260109_201044_app_factory_run
**Generated**: 2026-01-09

---

## Technology Stack

### Framework
- **React Native**: 0.76.x
- **Expo SDK**: 52
- **Workflow**: Managed (EAS Build)
- **Language**: TypeScript

### Navigation
- **Library**: expo-router v4
- **Pattern**: File-based routing
- **Structure**: 3-tab bottom navigation + modal screens

### State Management
- **Approach**: React Context + useReducer
- **Contexts**: ItemsContext, SubscriptionContext, PreferencesContext
- **Rationale**: Simple state, no external dependency needed

### UI Components
- React Native core components
- Custom themed primitives
- Design tokens for consistency

---

## Data Architecture

### Local Storage
```
AsyncStorage:
  @warrantyvault/items      → Item[] (JSON array)
  @warrantyvault/settings   → UserSettings (JSON object)
  @warrantyvault/categories → Category[] (JSON array)

expo-file-system:
  documentDirectory/receipts/   → Receipt images
  documentDirectory/products/   → Product photos
```

### Cloud Sync (Premium)
- **Provider**: Firebase Firestore
- **Auth**: Anonymous Firebase Auth (upgradeable)
- **Sync**: Last-write-wins with client timestamp
- **Storage**: Firebase Storage for images

### Offline Capability
- All core features work offline
- Cloud sync is additive (premium only)
- Offline queue for pending uploads
- Graceful degradation on network failure

---

## Subscription Integration

### RevenueCat Configuration
```typescript
// Early in App.tsx
Purchases.configure({
  apiKey: Platform.OS === 'ios'
    ? process.env.REVENUECAT_IOS_KEY
    : process.env.REVENUECAT_ANDROID_KEY
});
```

### Entitlement Model
```
Entitlement: "premium"
  ├── warrantyvault_premium_monthly (P1M)
  └── warrantyvault_premium_annual (P1Y)
```

### Feature Gating
| Feature | Free | Premium |
|---------|------|---------|
| Track items | 10 max | Unlimited |
| Receipt photos | Yes | Yes |
| Alerts | Yes | Yes |
| Cloud backup | No | Yes |
| PDF export | No | Yes |
| Custom categories | No | Yes |

---

## Security & Privacy

### Data Protection
- **At Rest**: Platform encryption (iOS Keychain, Android EncryptedSharedPreferences)
- **In Transit**: HTTPS/TLS 1.3 only
- **Secrets**: Environment variables (never hardcoded)

### Privacy Compliance
- Guest-first (no account required)
- Data minimization (only user-provided data)
- Privacy policy linked in Settings
- GDPR data export on request

### Permissions
| Permission | Purpose | Required |
|------------|---------|----------|
| Camera | Receipt capture | Core feature |
| Photo Library | Select existing photos | Optional |
| Notifications | Expiration alerts | Core feature |

---

## Performance Targets

### Startup
- **Target**: < 2 seconds to interactive dashboard
- **Strategy**: Lazy loading, Hermes engine, parallel data fetch

### Runtime
- **Target**: 60fps UI interactions
- **Strategy**: Virtualized lists, memoization, image optimization

### Images
- **Compression**: Max 1MB per image before storage
- **Loading**: Lazy load with placeholders
- **Caching**: expo-image with memory cache

---

## Platform Features

### iOS
- Haptic feedback on interactions
- Share sheet for PDF export
- StoreKit 2 via RevenueCat
- Dynamic Type support

### Android
- Material You theming
- Share intent for export
- Play Billing via RevenueCat
- System font scaling

### Cross-Platform
- Unified component API
- Platform-specific styling via Platform.select()
- Consistent behavior abstracted by Expo modules

---

## Development Workflow

### Build System
- **Tool**: EAS Build
- **Profiles**: development, staging, production
- **Updates**: EAS Update for OTA JavaScript fixes

### Testing
| Type | Tool | Coverage |
|------|------|----------|
| Unit | Jest | Utilities, helpers |
| Integration | RTL | Components, flows |
| E2E | Detox | Critical user journeys |

### Deployment
| Environment | Distribution |
|-------------|-------------|
| Development | EAS internal |
| Staging | TestFlight / Internal track |
| Production | App Store / Play Store |

---

## File Structure

```
app/
├── _layout.tsx              # Root layout + providers
├── (tabs)/
│   ├── _layout.tsx          # Tab navigator
│   ├── index.tsx            # Dashboard
│   ├── add.tsx              # Add item
│   └── settings.tsx         # Settings
├── item/
│   └── [id].tsx             # Item detail
└── paywall.tsx              # Subscription modal

src/
├── components/              # Reusable UI
├── contexts/                # State providers
├── hooks/                   # Custom hooks
├── services/                # Storage, notifications
├── types/                   # TypeScript types
└── utils/                   # Helpers

assets/
├── images/                  # Static assets
└── fonts/                   # Custom fonts (if any)
```

---

*Architecture specification ready for Stage 06 Builder Handoff*
