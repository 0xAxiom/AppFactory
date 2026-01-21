# {{APP_NAME}} - Launch Checklist

**Complete these steps before submitting to the App Store.**

---

## Developer Account Requirements

### Apple App Store

| Requirement     | Details                                         |
| --------------- | ----------------------------------------------- |
| Cost            | **$99/year** (Apple Developer Program)          |
| Account Type    | Individual or Organization                      |
| Time to Approve | 24-48 hours (account), 24-48 hours (app review) |
| Sign Up         | https://developer.apple.com/programs/enroll     |

### Google Play Store

| Requirement     | Details                                        |
| --------------- | ---------------------------------------------- |
| Cost            | **$25 one-time** (Google Play Developer)       |
| Account Type    | Individual or Organization                     |
| Time to Approve | Minutes (account), 3-7 days (first app review) |
| Sign Up         | https://play.google.com/console/signup         |

---

## Pre-Launch (Before Submission)

### Code & Build

- [ ] App runs without errors (`npm install` + `npx expo start`)
- [ ] All smoke tests pass (see TESTING.md)
- [ ] No console errors or warnings in production build
- [ ] App works offline (if designed for offline use)
- [ ] Production build tested: `eas build --profile production`

### Assets

- [ ] App icon is 1024x1024 PNG (no transparency, no alpha channel)
- [ ] Splash screen displays correctly
- [ ] All images load properly
- [ ] Adaptive icon configured for Android (if customized)

### Monetization (RevenueCat - Required)

- [ ] RevenueCat project created (https://app.revenuecat.com)
- [ ] iOS API key added to `.env`
- [ ] Android API key added to `.env`
- [ ] Products configured in RevenueCat dashboard
- [ ] Products configured in App Store Connect (In-App Purchases)
- [ ] Products configured in Play Console (In-App Products)
- [ ] Entitlements mapped correctly ("pro" or custom)
- [ ] Sandbox purchases tested on iOS
- [ ] Test purchases verified on Android

### Privacy & Legal

- [ ] Privacy policy hosted at public URL
- [ ] Privacy policy URL added to app config
- [ ] Privacy policy URL added to App Store Connect
- [ ] Terms of service (if required)
- [ ] Data collection accurately described
- [ ] App Tracking Transparency configured (if using IDFA)

---

## Screenshot Requirements

### iOS Screenshots (Required)

| Device                   | Size (pixels) | Required           |
| ------------------------ | ------------- | ------------------ |
| iPhone 6.7" (14 Pro Max) | 1290 x 2796   | **Yes**            |
| iPhone 6.5" (11 Pro Max) | 1242 x 2688   | **Yes**            |
| iPhone 5.5" (8 Plus)     | 1242 x 2208   | **Yes**            |
| iPad Pro 12.9"           | 2048 x 2732   | If supporting iPad |
| iPad Pro 11"             | 1668 x 2388   | Optional           |

**Requirements:**

- 3-10 screenshots per device size
- PNG or JPEG format
- No device frames required (Apple adds them)
- First screenshot most important (appears in search)

### Android Screenshots (Required)

| Type            | Size (pixels)       | Required                  |
| --------------- | ------------------- | ------------------------- |
| Phone           | 1080 x 1920 minimum | **Yes** (2-8 screenshots) |
| Tablet 7"       | 1080 x 1920         | If supporting tablets     |
| Tablet 10"      | 1920 x 1200         | If supporting tablets     |
| Feature Graphic | 1024 x 500          | **Yes**                   |

### App Preview Video (Optional but Recommended)

- **iOS:** 15-30 seconds, device resolution, H.264 codec
- **Android:** 30 seconds - 2 minutes, YouTube link or uploaded

---

## App Store Materials

- [ ] App title finalized (see `aso/app_title.txt`) - max 30 chars
- [ ] Subtitle finalized (see `aso/subtitle.txt`) - max 30 chars
- [ ] Full description ready (see `aso/description.md`)
- [ ] Keywords optimized (see `aso/keywords.txt`) - max 100 chars
- [ ] Screenshots prepared (see requirements above)
- [ ] App preview video (optional but recommended)
- [ ] Category selected (primary + secondary)
- [ ] Age rating questionnaire completed
- [ ] Support URL provided
- [ ] Marketing URL (optional)

---

## Device Testing

- [ ] Tested on iPhone (or iOS simulator)
- [ ] Tested on Android phone (or emulator)
- [ ] Tested on iPad (if supporting tablets)
- [ ] Tested on Android tablet (if supporting tablets)
- [ ] All screen sizes display correctly
- [ ] Landscape orientation handled (if supported)
- [ ] Dark mode tested (if supported)

---

## Submission Checklist

### iOS (App Store Connect)

1. **Prepare Build**
   - [ ] Run `eas build --platform ios --profile production`
   - [ ] Wait for build to complete (~15-30 min)
   - [ ] Build automatically submitted to App Store Connect

2. **App Store Connect Setup**
   - [ ] Create new app in App Store Connect
   - [ ] Select the build
   - [ ] Fill in all metadata (name, subtitle, description)
   - [ ] Upload screenshots for all required sizes
   - [ ] Set pricing (Free or Paid)
   - [ ] Configure in-app purchases
   - [ ] Complete App Privacy questionnaire
   - [ ] Set age rating

3. **Submit**
   - [ ] Review all information
   - [ ] Submit for review
   - [ ] Expected review time: 24-48 hours

### Android (Google Play Console)

1. **Prepare Build**
   - [ ] Run `eas build --platform android --profile production`
   - [ ] Wait for build to complete (~15-30 min)
   - [ ] Download AAB file

2. **Play Console Setup**
   - [ ] Create new app in Google Play Console
   - [ ] Upload AAB to Production track
   - [ ] Complete store listing (title, description, screenshots)
   - [ ] Upload feature graphic (1024x500)
   - [ ] Complete content rating questionnaire
   - [ ] Complete data safety form
   - [ ] Set pricing & distribution

3. **Submit**
   - [ ] Review all information
   - [ ] Submit for review
   - [ ] Expected review time: 3-7 days (first app), 1-3 days (updates)

---

## Post-Launch Checklist

### Immediately After Approval

- [ ] Verify app appears in store search
- [ ] Download and test production build
- [ ] Verify in-app purchases work with real payment
- [ ] Check analytics are recording (if configured)
- [ ] Share launch announcement

### First Week

- [ ] Monitor crash reports (Sentry, Crashlytics, or EAS)
- [ ] Check user reviews daily
- [ ] Respond to support requests within 24 hours
- [ ] Monitor subscription metrics in RevenueCat
- [ ] Track download numbers

### Ongoing

- [ ] Set up crash/error alerting
- [ ] Plan first update based on feedback
- [ ] Request ratings from happy users (in-app prompt)
- [ ] A/B test screenshots (App Store Connect or third-party)
- [ ] Monitor ASO rankings weekly

---

## Common Rejection Reasons

### iOS (Apple App Store Review Guidelines)

| Reason                                    | How to Avoid                                                |
| ----------------------------------------- | ----------------------------------------------------------- |
| **Crashes/Bugs**                          | Test thoroughly on real devices before submission           |
| **Incomplete metadata**                   | Fill in ALL required fields, no placeholders                |
| **Placeholder content**                   | Remove all "lorem ipsum", test data, and TODO comments      |
| **Privacy issues**                        | Accurately describe data collection, include privacy policy |
| **Payments outside IAP**                  | All digital content must use In-App Purchase                |
| **Guideline 4.2 (Minimum Functionality)** | App must provide value beyond a website                     |
| **Missing demo account**                  | Provide test credentials if login required                  |
| **App Tracking Transparency**             | Must prompt before using IDFA                               |

**Review Guidelines:** https://developer.apple.com/app-store/review/guidelines/

### Android (Google Play Policies)

| Reason                 | How to Avoid                                               |
| ---------------------- | ---------------------------------------------------------- |
| **Crashes**            | Test on multiple devices, check Play Console crash reports |
| **Policy violations**  | Review Google Play Developer Policies                      |
| **Deceptive behavior** | App must do what store listing says                        |
| **User data**          | Complete data safety form accurately                       |
| **Impersonation**      | Don't use trademarked names/icons                          |
| **Repetitive content** | App must be meaningfully different from others             |

**Developer Policies:** https://play.google.com/about/developer-content-policy/

---

## Timeline Expectations

| Phase                     | Duration      |
| ------------------------- | ------------- |
| EAS Build (iOS + Android) | 30-60 minutes |
| Apple Review (new app)    | 24-48 hours   |
| Apple Review (update)     | 24-48 hours   |
| Google Review (new app)   | 3-7 days      |
| Google Review (update)    | 1-3 days      |
| RevenueCat Product Sync   | Instant       |

**Tip:** Submit iOS and Android simultaneously. iOS usually approves first.

---

## Quick Links

| Resource                | URL                                                     |
| ----------------------- | ------------------------------------------------------- |
| App Store Connect       | https://appstoreconnect.apple.com                       |
| Google Play Console     | https://play.google.com/console                         |
| RevenueCat Dashboard    | https://app.revenuecat.com                              |
| EAS Build Dashboard     | https://expo.dev                                        |
| Apple Review Guidelines | https://developer.apple.com/app-store/review/guidelines |
| Google Play Policies    | https://play.google.com/about/developer-content-policy  |

---

## Emergency Contacts

If you need help during launch:

- **Expo Support:** https://expo.dev/contact
- **RevenueCat Support:** support@revenuecat.com
- **Apple Developer Support:** https://developer.apple.com/contact
- **Google Play Support:** https://support.google.com/googleplay/android-developer

---

**Generated by App Factory v7.0**
