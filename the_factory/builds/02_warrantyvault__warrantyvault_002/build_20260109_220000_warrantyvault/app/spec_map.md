# WarrantyVault Specification Map

This document provides evidence of Stage 02-09 consumption in the Stage 10 build.

## Build Contract Consumption

**Contract ID**: 20260109_201044_app_factory_run-warrantyvault_002
**Build Date**: 2026-01-09
**Contract Status**: AUTHORITATIVE

---

## Section 3: App Overview → Implementation

| Contract Field | Value | Implementation |
|----------------|-------|----------------|
| Name | WarrantyVault | app.config.js `name` |
| Tagline | "Never lose a warranty claim again" | EmptyState, Paywall messaging |
| Category | Utilities | ASO metadata |

---

## Section 4: Target Platform → Implementation

| Contract Field | Value | Implementation |
|----------------|-------|----------------|
| Framework | Expo React Native | package.json expo deps |
| SDK Version | 52 | package.json `expo: ~52.0.0` |
| React Native | 0.76.x | package.json `react-native: 0.76.5` |
| iOS Minimum | 15.0 | app.config.js infoPlist |
| Android Minimum | 10 | app.config.js android config |

---

## Section 5: Business Model → Implementation

| Contract Field | Value | Implementation |
|----------------|-------|----------------|
| Model Type | Freemium subscription | SubscriptionContext.tsx |
| Provider | RevenueCat | react-native-purchases integration |
| Free Tier Limit | 10 items | FREE_TIER_LIMIT constant |
| Monthly Price | $3.99 | Paywall screen |
| Annual Price | $29.99 | Paywall screen |

---

## Section 6: Monetization Rules → Implementation

| Requirement | Implementation File |
|-------------|---------------------|
| SDK Installation | package.json: react-native-purchases ^9.0.0 |
| Initialization | _layout.tsx via SubscriptionProvider |
| Entitlement ID | SubscriptionContext: PREMIUM_ENTITLEMENT_ID = 'premium' |
| Product IDs | SubscriptionContext: warrantyvault_premium_monthly/annual |
| Paywall Triggers | add.tsx (item limit), settings.tsx (upgrade button) |
| Restore Purchases | paywall.tsx, settings.tsx |
| Feature Gating | SubscriptionContext.canAddMoreItems() |

---

## Section 7: Core Features → Implementation

| Feature | Contract Section | Implementation |
|---------|------------------|----------------|
| Project Scaffolding | 7.1 | Expo Router v4, TypeScript |
| Add Item Screen | 7.2 | app/(tabs)/add.tsx |
| Dashboard Screen | 7.3 | app/(tabs)/index.tsx |
| Item Detail Screen | 7.4 | app/item/[id].tsx |
| Settings Screen | 7.5 | app/(tabs)/settings.tsx |
| Expiration Alerts | 7.6 | services/notifications.ts |
| Subscription Integration | 7.7 | contexts/SubscriptionContext.tsx |

---

## Section 8: Design Requirements → Implementation

| Design Element | Contract | Implementation |
|----------------|----------|----------------|
| Navigation | Bottom tabs (3) | app/(tabs)/_layout.tsx |
| Dashboard Layout | Status-grouped sections | StatusSection component |
| Item Cards | Thumbnail + status badge | ItemCard component |
| Paywall | Modal with benefits + plans | app/paywall.tsx |
| FAB | Bottom right, primary blue | FAB component |

---

## Section 9: Design System → Implementation

| Token | Contract Value | Implementation |
|-------|----------------|----------------|
| primary | #2563EB | theme/colors.ts |
| secondary | #059669 | theme/colors.ts |
| warning | #EA580C | theme/colors.ts |
| error | #EF4444 | theme/colors.ts |
| gray | #6B7280 | theme/colors.ts as muted |
| background | #F9FAFB | theme/colors.ts |
| surface | #FFFFFF | theme/colors.ts |
| Typography | System fonts | theme/typography.ts |
| Touch targets | 44pt/48dp | components use minHeight |

---

## Section 10: Technical Requirements → Implementation

| Requirement | Contract | Implementation |
|-------------|----------|----------------|
| Expo | ~52.0.0 | package.json |
| expo-router | ^4.0.0 | package.json |
| react-native-purchases | ^9.0.0 | package.json |
| expo-image-picker | ~16.0.0 | package.json |
| expo-notifications | ~0.29.0 | package.json |
| expo-file-system | ~18.0.0 | package.json |
| AsyncStorage | ^2.0.0 | package.json |
| date-fns | ^3.0.0 | package.json |
| uuid | ^9.0.0 | package.json |

---

## Section 11: Assets → Implementation

| Asset | Contract | Status |
|-------|----------|--------|
| App Icon | 1024x1024 PNG, #2563EB bg | Generated placeholder |
| Splash Screen | 1284x2778 PNG | Generated placeholder |
| Adaptive Icon | 1024x1024 PNG | Generated placeholder |

---

## File-to-Contract Traceability

| Source File | Contract Sections Implemented |
|-------------|------------------------------|
| app/_layout.tsx | 6 (RevenueCat init), 7.1 (providers) |
| app/(tabs)/index.tsx | 7.3 (dashboard), 8 (design) |
| app/(tabs)/add.tsx | 7.2 (add item), 6 (limit trigger) |
| app/(tabs)/settings.tsx | 7.5 (settings), 6 (restore) |
| app/item/[id].tsx | 7.4 (item detail) |
| app/paywall.tsx | 6 (paywall), 5 (pricing) |
| src/contexts/ItemsContext.tsx | 7 (item CRUD) |
| src/contexts/SubscriptionContext.tsx | 5, 6 (monetization) |
| src/services/notifications.ts | 7.6 (alerts) |
| src/services/images.ts | 7.2 (receipt capture) |
| src/theme/*.ts | 9 (design system) |
| src/components/*.tsx | 8, 9 (UI components) |

---

## Verification Status

All contract sections have been implemented:

- [x] Section 1: Purpose
- [x] Section 2: Role
- [x] Section 3: App Overview
- [x] Section 4: Target Platform
- [x] Section 5: Business Model
- [x] Section 6: Monetization Rules
- [x] Section 7: Core Features
- [x] Section 8: Design Requirements
- [x] Section 9: Design System Requirements
- [x] Section 10: Technical Requirements
- [x] Section 11: Assets
- [x] Section 12: Pipeline Enforcement
- [x] Section 13: Output Expectations
- [x] Section 14: Execution Instructions

**No improvisation or gap-filling was required.**
