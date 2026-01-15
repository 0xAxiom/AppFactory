# EVP Analyzer - Compatibility Matrix

## Platform Requirements

| Platform | Minimum Version | Target Version | Notes |
|----------|-----------------|----------------|-------|
| iOS | 15.0 | 17.0 | iPhone 6s and newer |
| Android | API 26 (8.0 Oreo) | API 34 | 95%+ device coverage |
| Expo SDK | 52 | 52 | Latest stable |

---

## Required Permissions

### iOS

| Permission | Key | Purpose | Required |
|------------|-----|---------|----------|
| Microphone | NSMicrophoneUsageDescription | Record ambient audio for EVP analysis | Yes |
| Location | NSLocationWhenInUseUsageDescription | Tag investigation location for records | No |

**Info.plist Strings**:
```xml
<key>NSMicrophoneUsageDescription</key>
<string>EVP Analyzer needs microphone access to record audio for paranormal investigation</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>EVP Analyzer can tag your investigation location for your records</string>
```

### Android

| Permission | Manifest Entry | Purpose | Required |
|------------|----------------|---------|----------|
| Record Audio | RECORD_AUDIO | Record ambient audio | Yes |
| Fine Location | ACCESS_FINE_LOCATION | GPS location tagging | No |

---

## Device Features

| Feature | Required | Fallback |
|---------|----------|----------|
| Microphone | Yes | App cannot function without microphone |
| GPS | No | Manual location entry |
| Haptic Engine | No | Disable haptic feedback option |
| Storage (500MB+) | Recommended | Storage warnings, session limits |

---

## Background Modes

### iOS Background Audio

Required for continuous recording when screen dims.

**app.json configuration**:
```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "UIBackgroundModes": ["audio"]
      }
    }
  }
}
```

### Android Foreground Service

Required for recordings over 10 minutes.

**Note**: expo-av handles this automatically with proper notification configuration.

---

## Known Limitations

| Limitation | Platform | Mitigation |
|------------|----------|------------|
| Background audio requires session config | iOS | Configure AVAudioSession properly |
| Spectrogram processing intensive | Both | Post-processing only (not real-time) |
| Large recordings consume storage | Both | 60-minute limit, storage warnings |
| GPS accuracy varies indoors | Both | Manual location entry option |
| Haptic feedback unavailable on some Android | Android | Graceful degradation |

---

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| App launch | <2 seconds | Cold start to interactive |
| Recording start | <500ms | Button tap to recording active |
| Waveform render | 30 fps | During live recording |
| Spectrogram generation | <3 seconds | For 5-minute recording |
| Session load | <1 second | Open saved session |

---

## Storage Estimates

| Recording Duration | Approximate Size |
|--------------------|------------------|
| 5 minutes | ~5 MB |
| 15 minutes | ~15 MB |
| 30 minutes | ~30 MB |
| 60 minutes (max) | ~60 MB |

**Note**: WAV format at 44.1kHz, 16-bit mono.

---

## Testing Matrix

### Required Test Devices

| Category | Device | OS Version |
|----------|--------|------------|
| iOS Minimum | iPhone 8 | iOS 15.0 |
| iOS Target | iPhone 14 | iOS 17.0 |
| Android Minimum | Pixel 3 | Android 8.0 |
| Android Target | Pixel 8 | Android 14 |

### Required Test Scenarios

1. Recording in quiet environment
2. Recording in noisy environment
3. Background recording (screen off)
4. Long recording (30+ minutes)
5. Storage near full
6. Permission denied flows
7. Offline usage
8. Subscription purchase flow
9. Restore purchases
