# EVP Analyzer - MVP Scope

## Scope Boundaries

This document defines what is IN and OUT of scope for the MVP (V1) release.

---

## IN SCOPE (V1)

### Core Recording
- [x] Investigation Mode Recording with live waveform visualization
- [x] Noise-aware microphone capture (44.1kHz, 16-bit)
- [x] Background recording continues when screen dims
- [x] Session auto-save on stop

### Analysis
- [x] Post-recording waveform analyzer with timeline scrubbing
- [x] Pinch-to-zoom on timeline
- [x] Playback with position indicator
- [x] Spectrogram view (premium, post-processing only)
- [x] Basic anomaly detection: frequency spikes (premium)

### Documentation
- [x] Manual tagging with 5 categories (voice, noise, knock, unknown, other)
- [x] Text notes on tags
- [x] Favorite/star clips
- [x] Investigation log with session list
- [x] Optional location tagging (GPS or manual)

### Export
- [x] Export clips as WAV format
- [x] System share sheet integration

### Monetization
- [x] Onboarding flow (4 screens)
- [x] Soft paywall after 3 saved sessions
- [x] RevenueCat integration
- [x] Restore purchases
- [x] Subscription: $4.99/month or $29.99/year

### Settings
- [x] Sensitivity control (low/medium/high)
- [x] Recording quality toggle
- [x] Haptic feedback toggle
- [x] Dark mode preference (always dark default)
- [x] Privacy policy and terms links
- [x] Delete all data option

---

## OUT OF SCOPE (V1)

### Deferred Features
| Feature | Reason |
|---------|--------|
| Real-time spectrogram during recording | Performance complexity, post-processing sufficient for V1 |
| Multiple export formats (M4A, etc.) | WAV is universal, sufficient for V1 |
| Cloud backup/sync | Adds backend complexity, local-only for V1 |
| Social sharing (formatted clips) | Not core value prop |
| Team/collaboration features | Single-user focus for V1 |
| External hardware integration | EMF devices, Bluetooth—future enhancement |
| Voice interpretation AI | Not aligned with "signal over noise" philosophy |

### Advanced Detection (Deferred to V1.1+)
| Feature | Status |
|---------|--------|
| Noise floor change detection | V1.1 |
| Silence anomaly detection | V1.1 |
| Adjustable frequency thresholds | V1.1 |
| Custom tag categories | V1.2 |
| Session search/filtering | V1.2 |

---

## MVP Success Criteria

The MVP is successful when:

1. **Recording works reliably** - No crashes, no data loss, clean waveform
2. **Analysis is credible** - Waveform/spectrogram look professional
3. **Anomaly detection produces results** - Users see markers on recordings
4. **Tagging is smooth** - Easy to tap, tag, and note moments
5. **Investigation log grows** - Sessions accumulate and persist
6. **Export works** - Users can share WAV files
7. **Premium converts** - Users hit paywall and subscribe

---

## Technical Constraints

| Constraint | Limit |
|------------|-------|
| Minimum iOS version | 15.0 |
| Minimum Android API | 26 (Android 8.0) |
| Max recording duration | 60 minutes (storage consideration) |
| Free tier session limit | 3 sessions |
| Free tier tag limit | 5 tags per session |

---

## Dependencies for MVP

| Dependency | Purpose |
|------------|---------|
| expo-audio | Recording with metering |
| @siteed/expo-audio-studio | Spectrogram extraction |
| react-native-audio-waveform | Native waveform rendering |
| expo-file-system | Audio file storage |
| react-native-svg | Visualization components |
| @react-native-async-storage/async-storage | Metadata storage |
| react-native-purchases (RevenueCat) | Subscription handling |
| expo-location | Optional GPS tagging |
| expo-haptics | Haptic feedback |
