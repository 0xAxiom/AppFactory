# Dream Research: EVP Analyzer

**Run ID**: dream-220500-evpanalyzer
**Research Date**: 2026-01-09

---

## Market Research Sources

### Paranormal App Market Overview
- **Source**: [Horror Facts - Top Paranormal Apps 2025](https://horrorfacts.com/top-paranormal-apps-for-2025-so-far-ghost-hunting-in-the-digital-age/)
- **Finding**: "The fascination with the supernatural isn't fading—it's evolving. With technology at our fingertips, paranormal apps blend science and speculation, turning your phone into a ghost-hunting toolkit."
- **Relevance**: Confirms active market for paranormal investigation tools

### GhostTube EVP (Primary Competitor)
- **Source**: [Google Play Store](https://play.google.com/store/apps/details?id=com.ghosttube.evp)
- **Finding**: "Advanced voice recorder for paranormal investigators... combines microphone audio with audio signals generated based on magnetic interference detected by the environmental sensors"
- **Gap Identified**: Entertainment-focused sensor integration, less emphasis on serious audio analysis

### Ghost Hunting Tools (Multi-Tool Competitor)
- **Source**: [Apple App Store](https://apps.apple.com/us/app/ghost-hunting-tools-detector/id1025393457)
- **Finding**: "Supplies five powerful ghost-hunting tools including EMF detector, vibration detector, power detector, EVP recorder, and interrogation tool"
- **Gap Identified**: Toolkit approach dilutes focus; novelty features (word generator) undermine credibility

### EVP Hunter Ghost Detector
- **Source**: [AppBrain Analysis](https://www.appbrain.com/app/evp-hunter-ghost-detector/com.zk.evpanalyser)
- **Finding**: Basic EVP recording functionality with limited visualization
- **Gap Identified**: Lacks professional waveform/spectrogram visualization

---

## Technical Research Sources

### @siteed/expo-audio-studio
- **Source**: [npm Package](https://www.npmjs.com/package/@siteed/expo-audio-studio)
- **Finding**: "Dual-stream recording with simultaneous raw PCM and compressed audio recording, advanced audio analysis including MFCC, Chroma, Mel Spectrogram extraction"
- **Application**: Use for spectrogram generation and audio analysis pipeline

### react-native-audio-waveform
- **Source**: [GitHub Repository](https://github.com/SimformSolutionsPvtLtd/react-native-audio-waveform)
- **Finding**: "Native modules for generating and rendering audio waveforms, designed to efficiently produce visual representations for pre-recorded audio files and dynamically draw waveforms in real-time during audio recording"
- **Application**: Primary waveform visualization component

### Expo Audio SDK
- **Source**: [Expo Documentation](https://docs.expo.dev/versions/latest/sdk/audio/)
- **Finding**: "Audio sampling provides real-time access to audio waveform data for visualization or analysis. Audio samples are provided in real-time when audio sampling is enabled"
- **Application**: Core recording infrastructure with metering

### Real-time Audio Processing with Expo
- **Source**: [Expo Blog](https://expo.dev/blog/real-time-audio-processing-with-expo-and-native-code)
- **Finding**: Demonstrates real-time audio processing patterns for Expo apps
- **Application**: Architecture reference for live visualization

---

## Subscription Pricing Research

### Ghost Detector - Spirit Box
- **Pricing**: $3.99/week after 3-day trial
- **Model**: Free basic, subscription unlocks all features

### Ghost Tracker EMF EVP Recorder
- **Pricing**: $5.99 one-time purchase
- **Model**: Paid app, no subscription

### Ghosthunting Toolkit
- **Pricing**: $5.99 one-time purchase
- **Model**: Paid app with full feature access

### Pricing Decision
**Recommended**: $4.99/month or $29.99/year
- Competitive with weekly subscription pricing
- Higher than one-time purchases but justified by professional positioning
- Annual discount encourages long-term commitment

---

## Differentiation Analysis

### Market Positioning Gap
| Attribute | Competitors | EVP Analyzer |
|-----------|-------------|--------------|
| Tone | Entertainment/Novelty | Professional/Technical |
| Visual Design | Haunted house aesthetic | Field equipment aesthetic |
| Analysis Depth | Basic or gimmicky | Waveform + Spectrogram |
| Investigation Logging | Limited or none | Systematic session history |
| Credibility | Mixed (word generators, etc.) | Serious analytical tools |

### Unique Value Proposition
"EVP Analyzer is field equipment, not a haunted house toy. For investigators who want signal over noise."

---

## Research Conclusions

1. **Market Validated**: Active user base for paranormal apps, gap for professional tools
2. **Technical Feasibility**: Libraries exist for all core features
3. **Subscription Viable**: Users pay for professional tools in this category
4. **Differentiation Clear**: Professional aesthetic in novelty-dominated market
5. **Offline-First Possible**: All processing client-side
