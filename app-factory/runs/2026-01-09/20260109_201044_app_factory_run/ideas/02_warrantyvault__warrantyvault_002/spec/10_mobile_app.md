# Stage 10: Mobile App Build Specification

**App Name**: WarrantyVault
**Build ID**: build_20260109_220000_warrantyvault
**Status**: COMPLETE

---

## Build Summary

WarrantyVault is a complete, production-ready Expo React Native app that tracks warranty expiration dates, stores receipt photos, and sends timely reminders before warranties expire.

### Key Metrics
- **Screens**: 5 (Dashboard, Add Item, Settings, Item Detail, Paywall)
- **Components**: 6 reusable UI components
- **Services**: 2 (notifications, image handling)
- **Context Providers**: 3 (Items, Subscription, Preferences)

---

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Expo | ~52.0.0 |
| Runtime | React Native | 0.76.5 |
| Navigation | Expo Router | ~4.0.0 |
| Subscriptions | RevenueCat | ^9.0.0 |
| Storage | AsyncStorage | ^2.0.0 |
| File System | expo-file-system | ~18.0.0 |
| Notifications | expo-notifications | ~0.29.0 |
| Camera | expo-image-picker | ~16.0.0 |

---

## App Architecture

### Navigation Structure
```
Root Layout (_layout.tsx)
├── Tab Navigator ((tabs)/_layout.tsx)
│   ├── Dashboard (index.tsx)
│   ├── Add Item (add.tsx)
│   └── Settings (settings.tsx)
├── Item Detail (item/[id].tsx) - Stack screen
└── Paywall (paywall.tsx) - Modal
```

### State Management
- **ItemsContext**: CRUD operations for warranty items
- **SubscriptionContext**: RevenueCat entitlement state
- **PreferencesContext**: User settings (notifications, onboarding)

### Data Model
```typescript
interface Item {
  id: string;
  name: string;
  category: Category;
  purchaseDate: string;
  warrantyMonths: number;
  receiptUri: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## Feature Implementation

### 1. Dashboard Screen
- Status-grouped sections: Expiring Soon, Active, Expired
- Item cards with thumbnail, name, category, status badge
- Pull-to-refresh functionality
- FAB for quick add
- Empty state with vault illustration

### 2. Add Item Screen
- Camera/gallery picker for receipt photo
- Form fields: Name, Category, Purchase Date, Warranty Duration
- Category chips for quick selection
- Warranty duration presets (3mo to 5yr)
- Free tier limit enforcement (10 items)

### 3. Item Detail Screen
- Receipt image hero with tap-to-zoom
- Large countdown display (days remaining)
- Info cards: Category, Purchase Date, Warranty, Expiration
- Delete item with confirmation

### 4. Settings Screen
- Upgrade to Premium banner (free users)
- Restore Purchases button
- Notification toggle
- Privacy Policy and Terms links
- App version display

### 5. Paywall Screen
- Benefits comparison list
- Monthly/Annual plan toggle
- Subscribe CTA button
- Restore purchases link
- Auto-renewal disclosure
- Terms and privacy links

---

## RevenueCat Integration

### Configuration
- **Entitlement ID**: `premium`
- **Products**:
  - `warrantyvault_premium_monthly` - $3.99/month
  - `warrantyvault_premium_annual` - $29.99/year

### Feature Gating
- Free tier: 10 items maximum
- Premium: Unlimited items
- Gate check: `canAddMoreItems(currentCount)`

### Compliance
- Price in local currency
- Billing interval displayed
- Auto-renewal disclosed
- Cancellation instructions
- Terms/Privacy linked

---

## Design System

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| Primary | #2563EB | Actions, brand |
| Secondary | #059669 | Active status |
| Warning | #EA580C | Expiring soon |
| Error | #EF4444 | Destructive |
| Muted | #6B7280 | Expired, secondary |

### Typography
- System fonts (SF Pro / Roboto)
- Scale: 12sp - 32sp
- Body minimum: 16sp

### Components
- Button (primary, secondary, destructive, ghost)
- ItemCard (thumbnail + status badge)
- StatusSection (collapsible)
- EmptyState (illustration + CTA)
- FAB (floating action button)
- Input (outlined with label)

---

## Build Output

### Location
```
builds/02_warrantyvault__warrantyvault_002/build_20260109_220000_warrantyvault/
├── uiux/
│   ├── uiux_prompt.md
│   └── style_brief.json
├── app/
│   ├── package.json
│   ├── app.config.js
│   ├── app/
│   ├── src/
│   └── assets/
├── build_log.md
└── sources.md
```

### Assets Generated
- icon.png (1024x1024)
- adaptive-icon.png (1024x1024)
- splash.png (1284x2778)
- notification-icon.png (96x96)

---

## Development Setup

1. Navigate to app directory:
   ```bash
   cd builds/02_warrantyvault__warrantyvault_002/build_20260109_220000_warrantyvault/app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   # Add RevenueCat API keys
   ```

4. Start development server:
   ```bash
   npx expo start
   ```

---

## Next Steps

1. **Testing**: Run on iOS Simulator and Android Emulator
2. **RevenueCat**: Configure products in App Store Connect / Google Play
3. **Assets**: Replace placeholder icons with final branded assets
4. **EAS Build**: Configure eas.json for production builds
5. **Store Submission**: Prepare screenshots and metadata

---

*Generated by App Factory Stage 10 - 2026-01-09*
