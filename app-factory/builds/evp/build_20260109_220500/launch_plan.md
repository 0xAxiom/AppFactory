# EVP Analyzer - Launch Plan

**Generated**: 2026-01-09
**Build ID**: build_20260109_220500
**Status**: Store-Ready

---

## Section 1: Executive Summary

EVP Analyzer is a professional-grade paranormal investigation app that transforms smartphones into serious EVP (Electronic Voice Phenomena) research equipment. Unlike novelty ghost hunting apps filled with random word generators and fake sensor readings, EVP Analyzer provides real audio analysis tools—waveform visualization, spectrogram frequency analysis, and systematic investigation logging.

### Key Differentiators
- **Real Audio Analysis**: No gimmicks—actual signal processing and visualization
- **Professional Credibility**: Field equipment aesthetic, not haunted house toy
- **Signal Over Noise**: Analytical tools that serious investigators trust

### Business Model
- Freemium subscription with soft paywall
- Monthly: $4.99/month
- Annual: $29.99/year (50% savings, 7-day trial)

### Target Launch
- iOS: App Store Connect submission ready
- Android: Google Play Console submission ready

---

## Section 2: Product Overview

### Product Vision
The most credible, professional-grade EVP investigation tool for mobile—transforming smartphones into serious paranormal research equipment that prioritizes signal over noise.

### Value Proposition
Unlike novelty ghost hunting apps filled with random word generators and fake sensor readings, EVP Analyzer provides real audio analysis tools—waveform visualization, spectrogram frequency analysis, and systematic investigation logging—that serious researchers trust.

### Core Features

| Feature | Tier | Description |
|---------|------|-------------|
| Investigation Recording | Free | High-quality ambient audio recording with noise-aware sensitivity |
| Waveform Analyzer | Free | Real-time and post-recording waveform visualization |
| Spectrogram View | Premium | Frequency domain visualization as color-coded heatmap |
| Anomaly Detection | Premium | Automatic detection of frequency spikes and audio anomalies |
| Clip Review & Tagging | Free (Limited) | Review clips, add notes, tag moments |
| Investigation Log | Free (Limited) | Complete history of investigation sessions |
| Export & Share | Premium | Export clips as WAV/M4A for sharing |

### Free Tier Limitations
- 3 saved sessions maximum
- Waveform view only (no spectrogram)
- No anomaly detection
- 5 tags per session
- No export

### Premium Unlocks
- Unlimited sessions
- Spectrogram visualization
- Automatic anomaly detection
- Unlimited tagging
- Audio and image export
- Advanced sensitivity settings

---

## Section 3: Target Audience

### Primary Personas

#### Marcus - The Serious Investigator
- **Demographics**: 42, male, owns physical EMF equipment, member of local paranormal group
- **Goals**: Document investigations with credible evidence, analyze recordings for genuine anomalies
- **Frustrations**: Apps that feel like toys, can't trust random word generators
- **Usage**: Active investigations at locations, post-session review at home

#### Jenna - The Urban Explorer
- **Demographics**: 28, female, content creator, explores abandoned buildings
- **Goals**: Capture interesting audio for videos, have credible-looking tool on camera
- **Frustrations**: Cheesy apps don't look professional, hard to find specific moments
- **Usage**: Recording during exploration, editing clips for content

#### Derek - The Curious Hobbyist
- **Demographics**: 35, male, watches paranormal shows, occasionally investigates with friends
- **Goals**: Try investigating without expensive equipment, understand what he's hearing
- **Frustrations**: Doesn't know what's real vs fake, wants explanations
- **Usage**: Occasional investigations, learning the hobby

### Target Market Size
- Paranormal investigators and hobbyists: 25-55 age range
- Urban explorers and content creators
- Paranormal TV show enthusiasts exploring the hobby

---

## Section 4: Competitive Landscape

### Market Position
**Category**: Entertainment (Primary) / Utilities (Secondary)

### Competitive Differentiation

| Aspect | EVP Analyzer | Competitor Apps |
|--------|--------------|-----------------|
| Audio Analysis | Real waveform + spectrogram | Fake sensor readings |
| Word Generators | None (honest approach) | Random word generators |
| Data Visualization | Professional frequency analysis | Novelty animations |
| Investigation Logging | Systematic session tracking | Minimal or none |
| Export Capability | WAV/M4A + spectrogram PNG | Limited or none |
| Design Language | Professional, technical | Spooky, gimmicky |

### Competitive Distinction
"No word generators, no fake sensors—real audio analysis"

---

## Section 5: Monetization Strategy

### Pricing Structure

| Plan | Price | Trial | Product ID |
|------|-------|-------|------------|
| Monthly | $4.99/month | None | evp_analyzer_monthly |
| Annual | $29.99/year | 7 days | evp_analyzer_annual |

Annual plan highlighted as default (50% savings).

### RevenueCat Configuration

```
Offering ID: evp_pro_offering
Entitlement ID: evp_pro

Products:
- evp_analyzer_monthly (P1M subscription)
- evp_analyzer_annual (P1Y subscription)
```

### Soft Paywall Strategy

| Trigger | Condition | Gate Type |
|---------|-----------|-----------|
| Session Limit | 4th session save attempt | Modal paywall |
| Spectrogram Tap | Premium feature tap | Blur preview with unlock overlay |
| Anomaly Detection | View anomaly markers | Count tease with lock icon |
| Export Button | Export attempt | Disabled with Pro badge |

**Philosophy**: Show users the VALUE of premium features before asking them to pay. They see anomalies exist, spectrogram has data, export is possible—they just need to unlock it.

### Success Metrics
- 15% trial-to-subscription conversion
- 30% Day 7 retention rate
- Average session duration >5 minutes

---

## Section 6: ASO & Market Positioning

### Store Metadata

| Field | Value |
|-------|-------|
| App Name | EVP Analyzer - Ghost Detector |
| Subtitle | Professional Paranormal Investigation |
| Category | Entertainment |
| Secondary | Utilities |
| Age Rating | 4+ (iOS) / Everyone (Android) |

### Keywords
`EVP`, `ghost`, `paranormal`, `investigation`, `recorder`, `analyzer`, `spirit`, `detector`, `audio`, `waveform`

### App Store Description

**Short**:
Turn your phone into a professional EVP investigation tool with real audio analysis.

**Long**:
EVP Analyzer is a professional-grade paranormal investigation tool that transforms your phone into serious field equipment.

Unlike novelty ghost apps filled with random word generators and fake sensors, EVP Analyzer provides REAL audio analysis tools:

- WAVEFORM VISUALIZATION - See your audio in real-time with precise amplitude display
- SPECTROGRAM ANALYSIS - Visualize frequency patterns over time
- ANOMALY DETECTION - Automatic detection of unusual audio events
- INVESTIGATION LOG - Track sessions by location and date
- TAGGING & NOTES - Document your findings with detailed annotations
- EXPORT & SHARE - Save clips for further analysis

Designed for serious investigators who want signal over noise. Dark, minimal interface optimized for field use.

This is field equipment, not a haunted house toy.

### Screenshots Required

| # | Screen | Caption |
|---|--------|---------|
| 1 | Recording | Record with live waveform visualization |
| 2 | Session Analysis | Analyze recordings with precision |
| 3 | Spectrogram | See frequency patterns in detail |
| 4 | Investigation Log | Track your investigations |
| 5 | Anomaly Detection | Automatic event detection |

---

## Section 7: Technical Readiness

### Technology Stack
- **Framework**: React Native with Expo SDK 52
- **Language**: TypeScript
- **Subscriptions**: RevenueCat SDK
- **Navigation**: Expo Router
- **Storage**: AsyncStorage (local-only)
- **Audio**: expo-av for recording and playback

### Performance Requirements
- App launch to ready: <2 seconds
- Recording start latency: <500ms
- Waveform render: 30fps minimum
- Spectrogram generation: <3 seconds for 5-minute recording

### Platform Support
- iOS 15.0+
- Android API 24+ (Android 7.0+)

### Build Artifacts
- Complete Expo React Native app
- All required app icons and splash screens
- RevenueCat integration configured
- Onboarding, paywall, and settings screens

---

## Section 8: Privacy & Compliance

### Data Collection Summary

| Data Type | Collected | Usage |
|-----------|-----------|-------|
| Audio recordings | Yes | Stored locally only |
| Location data | Optional | User-controlled, stored locally |
| Subscription status | Yes | Via App Store/Play Store |
| Personal information | No | Not collected |
| Analytics on content | No | Not collected |

### Privacy Principles
- All recordings stored locally only
- No audio uploaded to servers
- Location optional and user-controlled
- No tracking or analytics on content
- Clear data deletion in settings

### Compliance
- **GDPR**: Compliant (minimal data, local storage)
- **CCPA**: Compliant (no personal info sale)
- **ATT**: Not required (no tracking)

### Required URLs
- Privacy Policy: `https://evpanalyzer.app/privacy`
- Terms of Service: `https://evpanalyzer.app/terms`

---

## Section 9: Go-to-Market Timeline

### Pre-Launch Checklist

| Task | Status | Notes |
|------|--------|-------|
| RevenueCat products configured | Required | evp_pro_offering |
| App Store Connect app created | Required | |
| Google Play Console app created | Required | |
| Privacy policy published | Required | evpanalyzer.app/privacy |
| Terms of service published | Required | evpanalyzer.app/terms |
| Screenshots prepared | Required | 5 screens per platform |
| App icon finalized | Complete | assets/icon.png |
| Splash screen finalized | Complete | assets/splash.png |
| TestFlight beta testing | Required | |
| Internal testing (Play Store) | Required | |

### Launch Sequence

1. **Configure RevenueCat**
   - Create products in App Store Connect & Play Console
   - Configure offerings in RevenueCat dashboard
   - Update API keys in app config

2. **Prepare Store Listings**
   - Upload screenshots (dark mode, showing functionality)
   - Enter ASO metadata
   - Publish privacy policy and terms

3. **Beta Testing**
   - TestFlight: Internal team + external testers
   - Play Store: Internal testing track

4. **Submit for Review**
   - iOS: App Store review (typically 1-3 days)
   - Android: Play Store review (typically 1-3 days)

5. **Launch**
   - Coordinate simultaneous release
   - Monitor analytics and crash reports
   - Respond to initial user feedback

---

## Brand Summary

### Visual Identity
- **Primary Color**: Investigation Teal (#00D9A5)
- **Background**: Night Black (#0D0D0F)
- **Alert**: Recording Red (#FF4444)
- **Markers**: Anomaly Amber (#FFB800)

### Brand Voice
- Scientific and matter-of-fact, not sensational
- Professional, technical, calm, trustworthy, precise
- "Investigation" not "ghost hunt"
- "Anomaly" not "ghost"
- "Session" not "séance"

### Tagline
**"Professional EVP Investigation"**

---

*Launch plan generated from App Factory pipeline stages 02-09.*
