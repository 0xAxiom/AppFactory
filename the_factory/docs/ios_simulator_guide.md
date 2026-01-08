# iOS Simulator Guide for App Factory Preview

This guide provides comprehensive instructions for using iOS Simulator with the App Factory hardened preview system.

## Prerequisites

### System Requirements
- **macOS only** - iOS Simulator is only available on macOS
- **Xcode** - Must be installed from the App Store or Apple Developer portal
- **Xcode Command Line Tools** - Required for simulator management

### Installation Steps

1. **Install Xcode** (if not already installed):
   ```bash
   # Option 1: Via App Store (recommended)
   # Search for "Xcode" and install

   # Option 2: Via command line (requires Apple ID)
   xcode-select --install
   ```

2. **Verify Installation**:
   ```bash
   # Check Xcode installation
   xcode-select -p

   # List available simulators
   xcrun simctl list devices available
   ```

## Simulator Management

### Available iOS Simulators
```bash
# List all available iOS simulators
xcrun simctl list devices iOS available

# Example output:
# iOS 17.2
#   iPhone 15 (12345678-1234-1234-1234-123456789ABC) (Shutdown)
#   iPhone 15 Plus (87654321-4321-4321-4321-CBA987654321) (Shutdown)
#   iPhone 15 Pro (ABCD1234-ABCD-1234-ABCD-123456789DEF) (Shutdown)
```

### Boot Simulator
```bash
# Boot specific simulator by name
xcrun simctl boot "iPhone 15"

# Boot by device ID (more reliable)
xcrun simctl boot 12345678-1234-1234-1234-123456789ABC

# Open Simulator app
open -a Simulator
```

### Simulator State Management
```bash
# Check simulator status
xcrun simctl list devices | grep "iPhone 15"

# Shutdown simulator
xcrun simctl shutdown "iPhone 15"

# Erase simulator (reset to factory state)
xcrun simctl erase "iPhone 15"
```

## Expo with iOS Simulator

### Prerequisites for Expo Development

1. **Expo Dev Client** - Install on simulator:
   ```bash
   # The expo start --dev-client command will handle this automatically
   # when targeting iOS simulator
   ```

2. **iOS Deployment Target** - Ensure your app's `app.json` supports the simulator iOS version:
   ```json
   {
     "expo": {
       "ios": {
         "deploymentTarget": "13.0"
       }
     }
   }
   ```

### Launch Workflow

#### Method 1: Using App Factory Preview System (Recommended)

1. **Start Preview Server**:
   ```bash
   cd the_factory/preview
   npm start
   ```

2. **Access Dashboard**:
   ```
   http://localhost:3000
   ```

3. **Select Build and Launch**:
   - Choose your app build from the dropdown
   - Click "Launch Live Preview"
   - The system will automatically detect iOS Simulator

4. **Simulator Integration**:
   - If iOS Simulator is running, Expo will automatically install and launch your app
   - If not running, you'll see instructions to launch it manually

#### Method 2: Direct Launch Script

```bash
# Navigate to your built app directory
cd builds/01_myapp__myapp_001/abc123def456/app

# Launch with iOS simulator targeting
node ../../scripts/preview/launch_preview.js . --platform ios

# Or specify simulator device
EXPO_IOS_SIMULATOR_DEVICE_NAME="iPhone 15" node ../../scripts/preview/launch_preview.js .
```

#### Method 3: Manual Expo Command

```bash
# In your app directory
npx expo start --dev-client --ios

# For specific simulator
npx expo start --dev-client --ios --device "iPhone 15"
```

## Troubleshooting

### Common Issues and Solutions

#### Simulator Not Launching
```bash
# Kill existing simulator processes
sudo pkill -f Simulator

# Reset simulator
xcrun simctl shutdown all
xcrun simctl erase all

# Restart with specific device
xcrun simctl boot "iPhone 15"
open -a Simulator
```

#### Expo Not Installing on Simulator
```bash
# Clear Expo cache
npx expo start --clear --dev-client --ios

# Reset Metro bundler
npx expo start --reset-cache --dev-client --ios
```

#### App Not Loading in Simulator
1. **Check iOS Deployment Target**: Ensure your app supports the simulator iOS version
2. **Verify Bundle**: Check that your app builds successfully
3. **Clear App Data**: Delete app from simulator and reinstall

#### Performance Issues
```bash
# Allocate more resources to simulator (if available)
# Edit in Xcode > Simulator > Device > Device Settings

# Disable unnecessary simulator features
# Simulator > Debug > Slow Animations (off)
# Simulator > Debug > Color Blended Layers (off)
```

### Debug Information

#### Simulator Logs
```bash
# View simulator system logs
xcrun simctl spawn booted log stream --predicate 'eventMessage contains "YourAppName"'

# View all simulator logs
tail -f ~/Library/Logs/CoreSimulator/*/system.log
```

#### Expo Debug Information
```bash
# Enable Expo debug mode
export EXPO_DEBUG=true
npx expo start --dev-client --ios

# View Metro bundler logs
npx expo start --dev-client --ios --verbose
```

## Environment Variables for iOS Simulator

### App Factory Preview System Variables
```bash
# Set default iOS simulator device
export EXPO_IOS_SIMULATOR_DEVICE_NAME="iPhone 15"

# Force iOS simulator usage
export EXPO_USE_IOS_SIMULATOR=true

# Simulator-specific Expo settings
export EXPO_IOS_SIMULATOR_DEPLOYMENT_TARGET="13.0"
```

### In .env Files
```env
# For builds that should default to iOS simulator
EXPO_PUBLIC_IOS_SIMULATOR_DEVICE_NAME=iPhone 15
EXPO_PUBLIC_IOS_DEPLOYMENT_TARGET=13.0
```

## Best Practices

### Development Workflow
1. **Keep Simulator Running**: Boot your preferred simulator once and keep it running during development
2. **Use Dev Client**: Always use `--dev-client` for more reliable development experience
3. **Clear Cache**: Use `--clear` flag when experiencing bundle issues
4. **Monitor Performance**: Watch for memory usage in Activity Monitor

### Device Selection
- **iPhone 15**: Recommended for general development (latest features)
- **iPhone SE (3rd gen)**: Good for testing smaller screens
- **iPad**: Test tablet layouts and iPad-specific features

### Network Configuration
- **localhost**: Simulator can access `localhost` and `127.0.0.1` directly
- **Local Network**: Use your computer's IP address for network testing
- **Metro Tunneling**: Use `--tunnel` flag if experiencing network issues

## Integration with App Factory

### Automated iOS Testing
```bash
# Launch preview with iOS simulator preference
cd the_factory/scripts/preview
node launch_preview.js builds/myapp --platform ios --simulator "iPhone 15"
```

### Dashboard Integration
The App Factory dashboard automatically detects iOS Simulator availability and provides:
- One-click iOS simulator launch
- Device selection preferences
- Simulator status monitoring
- Automatic app installation

### Build Validation for iOS
The hardened preview system validates iOS compatibility:
- Checks iOS deployment target
- Validates iOS-specific dependencies
- Warns about simulator-incompatible features
- Provides iOS-specific troubleshooting

## Simulator Device Management

### Create Custom Simulators
```bash
# List available device types
xcrun simctl list devicetypes

# Create custom simulator
xcrun simctl create "My iPhone 15" com.apple.CoreSimulator.SimDeviceType.iPhone-15 com.apple.CoreSimulator.SimRuntime.iOS-17-2

# Delete simulator
xcrun simctl delete "My iPhone 15"
```

### Simulator Screenshots and Videos
```bash
# Take screenshot
xcrun simctl io booted screenshot ~/Desktop/simulator_screenshot.png

# Record video
xcrun simctl io booted recordVideo ~/Desktop/simulator_video.mp4
```

## Performance Monitoring

### Resource Usage
```bash
# Monitor simulator resource usage
top -pid $(pgrep Simulator)

# Memory usage
vm_stat

# Disk space
df -h
```

### App Performance
- Use Xcode Instruments for detailed profiling
- Monitor JavaScript errors in Metro bundler logs
- Check React Native performance metrics in dev tools

---

## Quick Reference

### Essential Commands
```bash
# Boot simulator
xcrun simctl boot "iPhone 15"

# Launch App Factory preview
cd the_factory/preview && npm start

# Direct launch with iOS
node scripts/preview/launch_preview.js builds/myapp --platform ios

# Reset simulator
xcrun simctl erase "iPhone 15"

# View logs
xcrun simctl spawn booted log stream
```

### Keyboard Shortcuts (in Simulator)
- `Cmd + Shift + H`: Home button (single tap)
- `Cmd + Shift + H + H`: App switcher (double tap)
- `Cmd + R`: Reload app (in dev mode)
- `Cmd + D`: Developer menu (in dev mode)
- `Cmd + Ctrl + Z`: Shake gesture

### Troubleshooting Checklist
- [ ] Xcode installed and up to date
- [ ] iOS Simulator running with correct device
- [ ] App deployment target matches simulator iOS version
- [ ] Expo Dev Client installed in simulator
- [ ] Metro bundler running without errors
- [ ] Network connectivity working
- [ ] Sufficient disk space and memory