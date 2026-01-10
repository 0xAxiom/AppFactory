# React Native Upstream Reference Cache - VisualBell App

## Cached Upstream Files

### rn_running-on-simulator-ios.html
- **File**: iOS Simulator Documentation
- **Purpose**: React Native iOS simulator setup, device management, common issues
- **Stage(s) that rely on it**: Stage 10 (Build Phase - iOS testing and validation)
- **Source**: facebook/react-native repository documentation
- **Key Information**:
  - iOS simulator device specification options
  - Command line flags for device selection
  - UDID-based device targeting
  - Integration with Expo CLI for iOS development

## Cache Usage Rules

### When to Pull Upstream Files
Pull upstream files whenever clarification is needed on:
- iOS native modules
- Autolinking behavior  
- CocoaPods / build scripts
- New Architecture (Fabric / TurboModules)
- Hermes integration
- App extensions
- Build tooling edge cases

### Authorized Sources
- https://github.com/facebook/react-native
- https://github.com/facebook/react-native-website (docs source, when applicable)

### Cache Integrity
- All files must be recorded in manifest.json with SHA256 hashes
- Source commit SHA or tag must be recorded for traceability
- Reason for caching must be documented
- Only pull what is relevant, never guess

## Read-Only Reference Policy
This is a **read-only reference cache**, not vendored source code. Files are cached for documentation and decision-making purposes only.