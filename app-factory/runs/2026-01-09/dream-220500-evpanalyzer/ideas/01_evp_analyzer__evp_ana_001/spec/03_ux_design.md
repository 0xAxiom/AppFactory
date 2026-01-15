# EVP Analyzer - UX Design Specification

## Design Philosophy

**Field Equipment Minimalism**: Professional, technical, and calm. This is investigation equipment, not entertainment.

### Key Principles
1. Night-friendly by default (dark theme)
2. Data visualization is primary focus
3. Minimal decoration, maximum function
4. Technical credibility through precise UI
5. Calm focus over sensational excitement

---

## Color System

### Primary Colors
| Token | Value | Usage |
|-------|-------|-------|
| Background | #0D0D0F | Main background |
| Accent | #00D9A5 | Teal - CTAs, waveform |
| Recording | #FF4444 | Recording indicator |
| Anomaly | #FFB800 | Event markers |

### Visualization Colors
- Waveform: #00D9A5 (teal)
- Spectrogram: #1A1A2E → #4A00E0 → #FF0080 (cool to warm gradient)

---

## Typography

- **Primary**: System font (SF Pro on iOS, Roboto on Android)
- **Monospace**: For timestamps, frequencies, data display
- **Scale**: iOS Human Interface Guidelines-based scale

---

## Screen Designs

### Home Screen
- Centered layout with hero RecordButton
- "Start Investigation" label
- Session count indicator
- Quick access to last investigation

### Recording Screen
- Full-screen modal presentation
- Live waveform (40% height)
- Large stop button
- Timer and dB meter display

### Session Analyzer
- Waveform with interactive timeline
- Anomaly markers overlay
- Spectrogram below waveform (premium)
- Playback controls
- Tag list
- Export action

### Investigation Log
- List of SessionCards
- Sorted by date descending
- Swipe to delete
- Tap to open session

### Settings
- Grouped list layout
- Recording settings (sensitivity, quality)
- General settings (haptics, theme)
- Subscription management
- Data and privacy options

---

## Onboarding Flow

| Screen | Title | Content |
|--------|-------|---------|
| 1 | Professional EVP Investigation | Welcome positioning |
| 2 | Capture Ambient Audio | Recording feature |
| 3 | Analyze with Precision | Visualization feature |
| 4 | Enable Microphone | Permission request |

---

## Soft Paywall

**Trigger**: After 3rd session OR premium feature access

**Presentation**: formSheet modal

**Features Highlighted**:
- Spectrogram Visualization
- Automatic Anomaly Detection
- Unlimited Sessions
- Export & Share

**Pricing**:
- Monthly: $4.99
- Annual: $29.99 (Save 50%) ← Highlighted

---

## Accessibility

- VoiceOver/TalkBack support
- 44x44pt minimum touch targets
- 4.5:1 minimum contrast ratio
- Dynamic Type support
- Reduce Motion support
- Haptic feedback with visual alternatives
