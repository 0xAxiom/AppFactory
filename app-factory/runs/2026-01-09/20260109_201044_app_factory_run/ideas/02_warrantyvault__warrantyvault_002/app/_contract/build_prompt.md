# WarrantyVault Build Contract

**Contract ID**: 20260109_201044_app_factory_run-warrantyvault_002
**Generated**: 2026-01-09
**Status**: AUTHORITATIVE - Stage 10 SOLE INPUT

---

## 1. PURPOSE

Build a complete, ship-ready Expo React Native app that can be submitted to the Apple App Store and Google Play without additional manual work. The final build artifact is the objective. A working, shippable mobile application is the only successful outcome.

---

## 2. ROLE

You are a senior React Native developer executing the final build phase. You will generate a complete, production-ready Expo React Native app based on the specifications in this contract. You must NOT improvise or add features not specified here. All implementation decisions must trace back to this contract.

---

## 3. APP OVERVIEW

**Name**: WarrantyVault
**Tagline**: Never lose a warranty claim again
**Description**: A warranty tracking app that helps users protect their purchases by tracking warranty expiration dates, storing receipts, and sending timely reminders before warranties expire.

---

## 4. TARGET PLATFORM

- **Framework**: Expo React Native
- **Expo SDK**: 52
- **React Native**: 0.76.x
- **Platforms**: iOS 15+ and Android 10+
- **Build System**: EAS Build
- **Workflow**: Managed workflow

---

## 5. BUSINESS MODEL

- **Type**: Freemium subscription
- **Revenue Source**: Subscriptions only (no ads, no IAP consumables)
- **Provider**: RevenueCat

**Free Tier**:
- Track up to 10 items
- Receipt photo storage
- Expiration alerts
- Category organization
- Local data storage

**Premium Tier** ($3.99/month or $29.99/year):
- Unlimited items
- Cloud backup & sync (Phase 2)
- PDF export (Phase 2)
- Custom categories (Phase 2)

---

## 6. MONETIZATION RULES (RevenueCat Integration)

**MANDATORY REQUIREMENTS**:

1. **SDK Installation**: Install `react-native-purchases` (^9.0.0)
2. **Initialization**: Configure in App.tsx with platform-specific API keys from environment variables
3. **Entitlement Model**: Single entitlement ID: `premium`
4. **Product IDs**:
   - Monthly: `warrantyvault_premium_monthly`
   - Annual: `warrantyvault_premium_annual`
5. **Paywall Triggers**:
   - Settings screen "Upgrade" button
   - Adding 11th item (item limit trigger)
6. **Restore Purchases**: Button in Settings and on Paywall
7. **Feature Gating**: Check entitlement before allowing 11th item
8. **Error Handling**: Handle empty offerings, network errors, user cancellation

**COMPLIANCE**:
- Price displayed in local currency
- Billing interval clearly stated
- Auto-renewal disclosed
- Cancellation instructions provided
- Terms of service linked
- Privacy policy linked

---

## 7. CORE FEATURES (MVP)

Build these features in the following order:

1. **Project Scaffolding**
   - Expo SDK 52 with TypeScript
   - Expo Router v4 file-based navigation
   - Three-tab layout: Dashboard, Add, Settings

2. **Add Item Screen**
   - Camera/gallery picker for receipt photo (expo-image-picker)
   - Form fields: Product name (required), Purchase date, Warranty duration, Category
   - Save to AsyncStorage
   - Image saved to expo-file-system documentDirectory

3. **Dashboard Screen**
   - Items grouped by status: Expiring Soon (30 days), Active, Expired
   - Status colors: Orange (expiring), Green (active), Gray (expired)
   - FAB for quick add
   - Empty state with vault illustration

4. **Item Detail Screen**
   - Receipt image with tap-to-zoom
   - Days remaining countdown (large display)
   - Purchase info and warranty dates
   - Edit and Delete actions

5. **Settings Screen**
   - Upgrade to Premium banner
   - Restore Purchases button
   - Notification preferences toggle
   - Privacy Policy link
   - Terms of Service link
   - App version

6. **Expiration Alerts**
   - expo-notifications for local push
   - Default: 30 days before expiration
   - Notification tap opens app to relevant item

7. **Subscription Integration**
   - RevenueCat SDK configuration
   - Paywall modal with Monthly/Annual options
   - Entitlement-based feature gating
   - 10-item limit for free tier

---

## 8. DESIGN REQUIREMENTS

### Navigation Structure
- **Type**: Bottom tab navigation (3 tabs)
- **Tabs**: Dashboard (home icon), Add Item (plus-circle), Settings (settings icon)
- **Modal Screens**: Item Detail (push), Paywall (modal), Camera (modal)

### Screen Layouts

**Dashboard**:
- Header: "WarrantyVault" title
- Sections: Expiring Soon, Active, Expired (collapsible)
- Item cards: Thumbnail, name, category, days remaining badge
- FAB: Bottom right, primary blue

**Add Item**:
- Camera preview/image area at top
- Scrollable form below
- Save button sticky at bottom

**Item Detail**:
- Receipt image hero (tap to zoom)
- Countdown: Large "X days" display
- Info cards: Purchase date, warranty length, category
- Actions: Edit, Delete buttons

**Paywall**:
- Benefits list comparing Free vs Premium
- Monthly/Annual price cards with toggle
- Subscribe CTA button
- Restore purchases link
- Terms and privacy links
- Dismiss X button

### Interaction Patterns
- Tap to navigate
- Swipe back to return (iOS)
- Pull to refresh on Dashboard
- Pinch to zoom on receipt images
- Haptic feedback on FAB tap (iOS)

---

## 9. DESIGN SYSTEM REQUIREMENTS

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| primary | #2563EB | Actions, links, brand |
| secondary | #059669 | Success, active status |
| warning | #EA580C | Expiring soon status |
| error | #EF4444 | Errors, destructive |
| gray | #6B7280 | Expired, secondary text |
| background | #F9FAFB | Light mode background |
| surface | #FFFFFF | Cards, modals |

### Typography
- **Font**: System fonts (SF Pro iOS, Roboto Android)
- **Scale**: 12/14/16/20/24/32sp
- **Body minimum**: 16sp
- **Dynamic Type**: Support up to 200%

### Spacing
- **Base unit**: 4dp
- **Standard**: 8, 16, 24, 32dp
- **Touch targets**: Minimum 44pt iOS / 48dp Android

### Accessibility
- Contrast ratio: ≥ 4.5:1 for all text
- Status uses color + icon + text
- Screen reader labels on all interactive elements
- VoiceOver and TalkBack tested

---

## 10. TECHNICAL REQUIREMENTS

### Dependencies (expo install --check compliant)
```json
{
  "expo": "~52.0.0",
  "expo-router": "^4.0.0",
  "react-native-purchases": "^9.0.0",
  "expo-image-picker": "~16.0.0",
  "expo-notifications": "~0.29.0",
  "expo-file-system": "~18.0.0",
  "@react-native-async-storage/async-storage": "^2.0.0",
  "date-fns": "^3.0.0",
  "uuid": "^9.0.0"
}
```

### File Structure
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
│   ├── ItemsContext.tsx     # Item management
│   ├── SubscriptionContext.tsx  # Entitlement state
│   └── PreferencesContext.tsx   # User settings
├── hooks/                   # Custom hooks
├── services/                # Storage, notifications
├── types/                   # TypeScript types
└── utils/                   # Helpers (dates, validation)
```

### Data Model
```typescript
interface Item {
  id: string;           // UUID
  name: string;         // Product name
  category: Category;   // electronics|appliances|furniture|vehicles|other
  purchaseDate: string; // ISO date
  warrantyMonths: number;
  receiptUri: string;   // Local file path
  productPhotoUri?: string;
  createdAt: string;
  updatedAt: string;
}

type Category = 'electronics' | 'appliances' | 'furniture' | 'vehicles' | 'other';
```

### Storage Keys
- `@warrantyvault/items` - Item[] JSON array
- `@warrantyvault/settings` - UserSettings JSON object

### Canonical Docs
- Reference: `vendor/expo-docs/` for Expo patterns
- Reference: `vendor/revenuecat-docs/` for subscription integration
- Run `npx expo install --check` before final build

---

## 11. ASSETS

### Required Assets
- App icon: 1024x1024 PNG (generate placeholder if missing)
- Adaptive icon foreground: 1024x1024 PNG
- Splash screen: 1284x2778 PNG (generate placeholder if missing)
- Favicon: 48x48 PNG (if web enabled)

### Asset Generation
If assets don't exist, generate deterministic placeholders:
- Solid #2563EB background
- Centered white vault icon or text
- Use `scripts/generate_placeholder_assets.mjs` or equivalent

### Brand Compliance
- Use brand blue (#2563EB) for icon background
- White foreground elements
- Consistent with app color palette

---

## 12. PIPELINE ENFORCEMENT

**CRITICAL RULES**:

1. **No Improvisation**: Only implement features specified in this contract
2. **No Gap Filling**: If something is unclear, the contract is incomplete (should not happen)
3. **Traceability**: Every feature traces to this contract
4. **Boundary Enforcement**: Only read from this idea pack's directory
5. **RevenueCat Hard Gate**: All 8 subscription requirements must be implemented
6. **Asset Preflight**: All assets must exist before build completes

**STAGE SOURCES** (DO NOT READ DIRECTLY):
- stage02.json: Product specification
- stage02.5.json: Core loop design
- stage02.7.json: Technical planning
- stage03.json: UX design
- stage04.json: Monetization
- stage05.json: Architecture
- stage06.json: Builder handoff
- stage07.json: Polish
- stage08.json: Brand
- stage09.json: Release planning
- stage09.5.json: Runtime validation

All requirements from these stages are synthesized INTO this contract.

---

## 13. OUTPUT EXPECTATIONS

### Build Output Location
```
builds/02_warrantyvault__warrantyvault_002/<build_id>/app/
```

### Required Files
- Complete Expo React Native app with all source files
- package.json with all dependencies
- app.json with proper configuration
- tsconfig.json for TypeScript
- All screens, components, contexts, services
- Asset files (icons, splash)

### Verification Checklist
- [ ] App launches without crash
- [ ] All 3 tabs navigate correctly
- [ ] Add item flow works end-to-end
- [ ] Items persist after restart
- [ ] Paywall displays with offerings
- [ ] 10-item limit triggers paywall
- [ ] Restore purchases works
- [ ] Notifications schedule correctly

---

## 14. EXECUTION INSTRUCTIONS

### Step 1: Scaffold Project
```bash
npx create-expo-app WarrantyVault --template expo-template-blank-typescript
cd WarrantyVault
npx expo install expo-router expo-image-picker expo-notifications expo-file-system @react-native-async-storage/async-storage react-native-purchases date-fns uuid
```

### Step 2: Configure Expo Router
- Set up app/_layout.tsx with providers
- Create tab navigation structure
- Add modal screens

### Step 3: Implement Contexts
- ItemsContext for item CRUD
- SubscriptionContext for RevenueCat
- PreferencesContext for settings

### Step 4: Build Screens
- Dashboard with status-grouped items
- Add Item with camera and form
- Item Detail with countdown
- Settings with upgrade and restore
- Paywall modal

### Step 5: Integrate RevenueCat
- Configure SDK with environment keys
- Implement paywall presentation
- Add purchase and restore flows
- Implement feature gating

### Step 6: Add Notifications
- Request permission
- Schedule expiration alerts
- Handle notification taps

### Step 7: Generate Assets
- Create or generate app icon
- Create or generate splash screen
- Configure in app.json

### Step 8: Validate
- Run `npx expo install --check`
- Test all flows manually
- Verify RevenueCat integration
- Check accessibility basics

### Step 9: Build
- Configure eas.json for builds
- Run development build for testing
- Prepare for store submission

---

**END OF BUILD CONTRACT**

This contract is the SOLE AUTHORITATIVE SOURCE for Stage 10. No improvisation allowed.
