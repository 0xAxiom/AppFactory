# EVP Analyzer - Build Contract

## 1. APP IDENTITY

**Name**: EVP Analyzer
**Tagline**: Professional EVP Investigation
**Bundle ID**: com.evpanalyzer.app

## 2. TECHNICAL STACK

- **Framework**: Expo SDK 52
- **Navigation**: Expo Router 4.x (file-based)
- **Language**: TypeScript
- **State**: React Context + useReducer
- **Storage**: AsyncStorage + expo-file-system
- **Subscriptions**: RevenueCat

## 3. SCREEN INVENTORY

| Route | Component | Type |
|-------|-----------|------|
| `/(tabs)/index` | HomeScreen | Tab |
| `/(tabs)/log` | LogScreen | Tab |
| `/(tabs)/settings` | SettingsScreen | Tab |
| `/record` | RecordScreen | Full Modal |
| `/session/[id]` | SessionScreen | Stack |
| `/session/[id]/spectrogram` | SpectrogramScreen | Stack |
| `/session/[id]/tag` | TagScreen | Modal |
| `/session/[id]/export` | ExportScreen | Modal |
| `/onboarding` | OnboardingScreen | Full Modal |
| `/paywall` | PaywallScreen | Form Sheet |

## 4. CORE FEATURES

### Free Tier
- Investigation Mode Recording (live waveform)
- Waveform Analyzer (post-recording)
- Basic Tagging (5 per session)
- Investigation Log (3 sessions max)

### Premium Tier (EVP Pro)
- Spectrogram Visualization
- Automatic Anomaly Detection
- Unlimited Sessions
- Audio Export (WAV)

## 5. SUBSCRIPTION CONFIGURATION

**RevenueCat Setup**:
- Offering ID: `evp_pro_offering`
- Entitlement ID: `evp_pro`

**Products**:
| ID | Price | Trial |
|----|-------|-------|
| evp_analyzer_monthly | $4.99/mo | None |
| evp_analyzer_annual | $29.99/yr | 7 days |

## 6. DESIGN TOKENS

```javascript
const colors = {
  background: { primary: '#0D0D0F', secondary: '#161619' },
  accent: { primary: '#00D9A5' },
  status: { recording: '#FF4444', anomaly: '#FFB800' },
  text: { primary: '#FFFFFF', secondary: '#A0A0A8' }
};
```

## 7. ONBOARDING FLOW

4 screens:
1. "Professional EVP Investigation" - Welcome
2. "Capture Ambient Audio" - Recording feature
3. "Analyze with Precision" - Analysis feature
4. "Enable Microphone" - Permission request

## 8. SOFT PAYWALL

**Triggers**:
- 4th session save attempt
- Premium feature tap (spectrogram, anomaly, export)

**Soft Gates**:
- Spectrogram: Blurred preview with unlock overlay
- Anomaly: "X found" badge with lock
- Export: Disabled button with Pro badge

## 9. ASSET REQUIREMENTS

| Asset | Path | Size |
|-------|------|------|
| App Icon | assets/icon.png | 1024x1024 |
| Adaptive Foreground | assets/adaptive-icon-foreground.png | 1024x1024 |
| Splash | assets/splash.png | 1284x2778 |
| In-app Icons | src/ui/icons/ | 18 icons |

## 10. DEPENDENCIES

```json
{
  "expo": "~52.0.0",
  "expo-router": "~4.0.0",
  "expo-av": "~15.0.0",
  "@siteed/expo-audio-studio": "^1.0.0",
  "react-native-audio-waveform": "^1.0.0",
  "react-native-purchases": "^8.0.0",
  "react-native-svg": "^15.0.0"
}
```

## 11. DATA MODEL

**Investigation**: id, title, location, startedAt, duration, audioFilePath, waveformData
**Anomaly**: id, investigationId, timestamp, type, severity
**Tag**: id, investigationId, timestamp, label, category, notes

## 12. BOOT SEQUENCE

1. Splash screen
2. Check onboarding flag
3. Route to onboarding or tabs
4. Initialize RevenueCat
5. Fetch entitlement status
6. Load user settings

## 13. PERMISSIONS

- **Microphone**: Required for recording
- **Location**: Optional for session tagging

## 14. ACCESSIBILITY

- VoiceOver/TalkBack support
- 44x44pt minimum touch targets
- 4.5:1 contrast ratio
- Dynamic Type support
