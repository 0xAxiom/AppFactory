# EVP Analyzer - Product Specification

## Product Overview

**Vision**: The most credible, professional-grade EVP investigation tool for mobile—transforming smartphones into serious paranormal research equipment that prioritizes signal over noise.

**Target Market**: Paranormal investigators, urban explorers, and hobbyists aged 25-55 who value analytical rigor over entertainment gimmicks.

**Value Proposition**: Unlike novelty ghost hunting apps filled with random word generators and fake sensor readings, EVP Analyzer provides real audio analysis tools—waveform visualization, spectrogram frequency analysis, and systematic investigation logging—that serious researchers trust.

---

## Success Metrics

| Metric | Target |
|--------|--------|
| App Store Rating | 4.5+ stars |
| Day 7 Retention | 30% |
| Trial-to-Subscription | 15% |
| Avg Session Duration | >5 minutes |
| Sessions with Tags | 50% |

---

## User Personas

### Marcus - The Serious Investigator
- **Age**: 42
- **Context**: Owns physical EMF equipment, member of local paranormal group
- **Goals**: Document investigations with credible evidence, build investigation catalog
- **Frustrations**: Apps that feel like toys, can't trust random word generators

### Jenna - The Urban Explorer
- **Age**: 28
- **Context**: Content creator, explores abandoned buildings
- **Goals**: Capture interesting audio for videos, have professional-looking tools on camera
- **Frustrations**: Cheesy apps don't look professional, hard to find specific moments

### Derek - The Curious Hobbyist
- **Age**: 35
- **Context**: Watches paranormal shows, occasionally investigates with friends
- **Goals**: Try investigating without buying expensive equipment, understand what he's hearing
- **Frustrations**: Doesn't know what's real vs fake, wants something that explains what he's seeing

---

## Feature Specification

### Core Features

| ID | Feature | Description | Priority | Tier |
|----|---------|-------------|----------|------|
| F001 | Investigation Mode Recording | Noise-aware ambient audio recording optimized for EVP capture | P0 | Free |
| F002 | Waveform Analyzer | Real-time and post-recording waveform with timeline scrubbing | P0 | Free |
| F003 | Spectrogram View | Frequency domain visualization as color-coded heatmap | P0 | Premium |
| F004 | Anomaly Detection | Automatic detection of frequency spikes, noise floor changes | P0 | Premium |
| F005 | Clip Review & Tagging | Review segments, add notes and category tags | P0 | Free (limited) |
| F006 | Investigation Log | Session history with location, date, and tagged clips | P0 | Free (limited) |
| F007 | Export & Share | Export clips as WAV/M4A, share via system sheet | P1 | Premium |

### Free vs Premium

**Free Tier**:
- 3 saved sessions maximum
- Waveform view only (no spectrogram)
- No anomaly detection
- 5 tags per session
- No export

**Premium Tier**:
- Unlimited sessions
- Spectrogram visualization
- Automatic anomaly detection
- Unlimited tagging
- Audio and image export
- Advanced sensitivity settings

---

## Primary User Flow

```
1. User opens app
         ↓
2. Investigation Dashboard appears
         ↓
3. Tap "Start Investigation"
         ↓
4. (Optional) Enter location name
         ↓
5. Recording begins with live waveform
         ↓
6. Monitor waveform during recording
         ↓
7. Tap Stop when finished
         ↓
8. Session saved → Analysis view
```

---

## Non-Functional Requirements

### Performance
- App launch to ready: <2 seconds
- Recording start latency: <500ms
- Waveform render: 30fps minimum
- Spectrogram generation: <3 seconds for 5-minute recording

### Accessibility
- VoiceOver/TalkBack support
- Minimum touch targets: 44x44pt
- High contrast mode support
- Haptic feedback for key actions

### Privacy
- All recordings stored locally only
- No audio uploaded to servers
- Optional location tagging
- Clear data deletion in settings

---

## Content Requirements

### Onboarding Messages
1. "Your professional EVP investigation toolkit"
2. "Capture ambient audio with noise-aware recording"
3. "Analyze with waveform and spectrogram visualization"
4. "Automatic anomaly detection finds interesting moments"
5. "Log, tag, and export your findings"

### Empty States
- No sessions: "Start your first investigation to begin building your log"
- No tags: "Tap any moment on the timeline to add a tag"
- No anomalies: "No anomalies detected. Try adjusting sensitivity in settings."

### Error States
- Microphone denied: "EVP Analyzer needs microphone access to record. Tap Settings to enable."
- Storage full: "Not enough storage for new recordings. Free up space or delete old sessions."
- Recording failed: "Recording interrupted. Your session has been saved up to this point."
