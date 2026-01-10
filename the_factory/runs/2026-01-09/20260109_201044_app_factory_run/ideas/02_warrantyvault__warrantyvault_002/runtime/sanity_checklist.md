# Stage 10 Sanity Checklist: WarrantyVault

**Purpose**: Validate Stage 10 build output before store submission

---

## Critical Path Validation

### App Boot
- [ ] App launches without crash on iOS and Android
- [ ] Dashboard visible within 2 seconds of cold start
- [ ] No console errors during initialization
- [ ] RevenueCat SDK initializes (or gracefully fails)

### Core Functionality
- [ ] Add Item flow completes successfully
- [ ] Receipt photo captured and stored
- [ ] Item appears in Dashboard with correct status
- [ ] Item Detail screen displays all information
- [ ] Edit and Delete functions work correctly

### Subscription Integration
- [ ] RevenueCat offerings load on paywall
- [ ] Monthly and Annual options display with correct prices
- [ ] Purchase flow reaches StoreKit/Play Billing
- [ ] Restore purchases function works
- [ ] 10-item limit triggers paywall correctly
- [ ] Premium entitlement unlocks unlimited items

### Data Persistence
- [ ] Items persist after app restart
- [ ] Images load correctly from storage
- [ ] Preferences persist across sessions
- [ ] No data loss during normal operation

### Notifications
- [ ] Notification permission requested appropriately
- [ ] Alerts scheduled for items near expiration
- [ ] Notification tap opens app to relevant item
- [ ] Permission denial handled gracefully

---

## Error Handling Validation

### Network Errors
- [ ] App works offline (core features)
- [ ] Network error shows user-friendly message
- [ ] Retry mechanisms function correctly

### Permission Errors
- [ ] Camera denied: gallery fallback offered
- [ ] Notifications denied: in-app alerts work
- [ ] Clear guidance to enable permissions

### Input Validation
- [ ] Empty product name blocked with message
- [ ] Invalid dates prevented
- [ ] Form errors clear and actionable

---

## Performance Benchmarks

| Metric | Target | Pass/Fail |
|--------|--------|-----------|
| Cold start time | < 2 seconds | [ ] |
| Navigation response | < 100ms | [ ] |
| Dashboard with 10 items | < 500ms load | [ ] |
| Image load time | < 1 second | [ ] |
| Memory usage | < 150MB typical | [ ] |

---

## Accessibility Validation

- [ ] VoiceOver navigates all screens correctly
- [ ] TalkBack announces all elements properly
- [ ] Touch targets are 44pt/48dp minimum
- [ ] Color contrast meets 4.5:1 ratio
- [ ] Dynamic Type scales to 200%

---

## Store Submission Readiness

### iOS
- [ ] App icon 1024x1024 PNG present
- [ ] Splash screen configured
- [ ] Privacy manifest accurate
- [ ] No private API usage

### Android
- [ ] Adaptive icon configured
- [ ] Target API level current
- [ ] AAB builds successfully
- [ ] No sensitive permissions unused

---

## RevenueCat Verification

- [ ] SDK version: ^9.0.0
- [ ] Entitlement ID: "premium"
- [ ] Products configured correctly
- [ ] Debug logs show successful initialization
- [ ] Sandbox purchase completes
- [ ] Sandbox restore works

---

## Failure Actions

If any check fails:

1. **Critical failure** (app crash, data loss): Block submission, fix immediately
2. **Major failure** (broken flow, payment issue): Fix before submission
3. **Minor failure** (polish issue, minor UX): Log for post-launch fix

---

*Checklist validated for WarrantyVault build*
