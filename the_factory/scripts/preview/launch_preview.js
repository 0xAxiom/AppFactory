#!/usr/bin/env node
/**
 * Hardened Preview Launch Script for App Factory
 * 
 * Implements Expo best practices for preview launches:
 * - Uses npx expo for latest CLI
 * - Supports monorepo configurations
 * - Handles environment variables properly
 * - Provides deterministic port selection
 * - Supports iOS simulator workflow
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const net = require('net');

// Constants
const DEFAULT_PORTS = [8081, 19000, 19001, 19002];
const ENV_FILE_NAMES = ['.env.local', '.env'];

/**
 * Check if a port is available
 */
async function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, (err) => {
      if (err) {
        resolve(false);
      } else {
        server.once('close', () => resolve(true));
        server.close();
      }
    });
    
    server.on('error', () => resolve(false));
  });
}

/**
 * Find an available port
 */
async function findAvailablePort(startPort = 8081) {
  for (let port = startPort; port < startPort + 100; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error('No available ports found');
}

/**
 * Validate build directory structure
 */
function validateBuildStructure(buildPath) {
  const validation = {
    isValid: false,
    errors: [],
    warnings: [],
    recommendations: []
  };

  // Check if directory exists
  if (!fs.existsSync(buildPath)) {
    validation.errors.push(`Build directory does not exist: ${buildPath}`);
    return validation;
  }

  // Check for package.json
  const packageJsonPath = path.join(buildPath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    validation.errors.push('Missing package.json');
    return validation;
  }

  let packageJson;
  try {
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  } catch (error) {
    validation.errors.push(`Invalid package.json: ${error.message}`);
    return validation;
  }

  // Check for Expo dependency
  const hasExpo = packageJson.dependencies?.expo || packageJson.devDependencies?.expo;
  if (!hasExpo) {
    validation.errors.push('Expo not found in dependencies');
    return validation;
  }

  // Check scripts
  const scripts = packageJson.scripts || {};
  if (!scripts.start) {
    validation.errors.push('Missing "start" script in package.json');
  } else if (!scripts.start.includes('expo')) {
    validation.warnings.push('Start script does not use expo command');
    validation.recommendations.push('Consider using "expo start" for the start script');
  }

  // Check for Expo config
  const appJsonPath = path.join(buildPath, 'app.json');
  const appConfigJsPath = path.join(buildPath, 'app.config.js');
  const appConfigTsPath = path.join(buildPath, 'app.config.ts');
  
  let hasExpoConfig = false;
  if (fs.existsSync(appJsonPath)) {
    try {
      const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
      if (appJson.expo) {
        hasExpoConfig = true;
      }
    } catch (error) {
      validation.warnings.push(`Invalid app.json: ${error.message}`);
    }
  }
  
  if (!hasExpoConfig && (fs.existsSync(appConfigJsPath) || fs.existsSync(appConfigTsPath))) {
    hasExpoConfig = true;
    validation.warnings.push('Dynamic Expo config detected - ensure it exports valid configuration');
  }
  
  if (!hasExpoConfig && packageJson.expo) {
    hasExpoConfig = true;
  }
  
  if (!hasExpoConfig) {
    validation.errors.push('No Expo configuration found (app.json, app.config.js, or package.json expo field)');
    return validation;
  }

  // Check node_modules
  const nodeModulesPath = path.join(buildPath, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    validation.warnings.push('node_modules not found - run npm install first');
    validation.recommendations.push('Run "npm install" in the build directory before starting preview');
  } else {
    // Check for expo CLI
    const expoCliPath = path.join(nodeModulesPath, '.bin', 'expo');
    const expoPackagePath = path.join(nodeModulesPath, 'expo');
    
    if (!fs.existsSync(expoPackagePath)) {
      validation.warnings.push('Expo package not found in node_modules');
      validation.recommendations.push('Ensure expo is properly installed');
    }
  }

  validation.isValid = validation.errors.length === 0;
  return validation;
}

/**
 * Check iOS Simulator availability (macOS only)
 */
function checkIOSSimulatorAvailability() {
  const simInfo = {
    available: false,
    devices: [],
    activeDevice: null,
    warnings: [],
    recommendations: []
  };

  // Only available on macOS
  if (process.platform !== 'darwin') {
    simInfo.warnings.push('iOS Simulator is only available on macOS');
    return simInfo;
  }

  try {
    // Check if Xcode command line tools are available
    const { execSync } = require('child_process');
    
    try {
      execSync('which xcrun', { stdio: 'ignore' });
    } catch (error) {
      simInfo.warnings.push('Xcode command line tools not found. Install with: xcode-select --install');
      return simInfo;
    }

    // Get available iOS devices
    const output = execSync('xcrun simctl list devices iOS available --json', { encoding: 'utf8' });
    const devices = JSON.parse(output);
    
    // Process iOS versions and devices
    for (const [iosVersion, deviceList] of Object.entries(devices.devices)) {
      if (iosVersion.includes('iOS')) {
        for (const device of deviceList) {
          simInfo.devices.push({
            name: device.name,
            udid: device.udid,
            state: device.state,
            iosVersion: iosVersion
          });
          
          if (device.state === 'Booted') {
            simInfo.activeDevice = device.name;
          }
        }
      }
    }

    simInfo.available = simInfo.devices.length > 0;

    if (simInfo.devices.length === 0) {
      simInfo.warnings.push('No iOS simulators found. Install iOS simulators through Xcode.');
    } else if (!simInfo.activeDevice) {
      simInfo.recommendations.push('Boot an iOS simulator with: xcrun simctl boot "iPhone 15"');
    }

  } catch (error) {
    simInfo.warnings.push(`Error checking iOS simulators: ${error.message}`);
    simInfo.recommendations.push('Ensure Xcode is properly installed and iOS simulators are available');
  }

  return simInfo;
}

/**
 * Check for environment variables
 */
function checkEnvironmentSetup(buildPath) {
  const envInfo = {
    hasEnvFile: false,
    envFiles: [],
    exposedVars: [],
    warnings: []
  };

  // Check for .env files
  for (const envFile of ENV_FILE_NAMES) {
    const envPath = path.join(buildPath, envFile);
    if (fs.existsSync(envPath)) {
      envInfo.hasEnvFile = true;
      envInfo.envFiles.push(envFile);
      
      try {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const lines = envContent.split('\n');
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
            const [key] = trimmed.split('=');
            if (key.startsWith('EXPO_PUBLIC_')) {
              envInfo.exposedVars.push(key);
            } else if (key.includes('API') || key.includes('KEY') || key.includes('SECRET')) {
              envInfo.warnings.push(`Environment variable "${key}" may contain sensitive data but is not prefixed with EXPO_PUBLIC_`);
            }
          }
        }
      } catch (error) {
        envInfo.warnings.push(`Could not read ${envFile}: ${error.message}`);
      }
    }
  }

  return envInfo;
}

/**
 * Launch Expo preview with proper error handling
 */
async function launchPreview(buildPath, options = {}) {
  const {
    mode = 'dev-client',
    platform = 'all',
    port = null,
    tunnel = false,
    clear = false,
    offline = false
  } = options;

  console.log(`🚀 Launching Expo preview for: ${buildPath}\n`);

  // Validate build structure
  console.log('📋 Validating build structure...');
  const validation = validateBuildStructure(buildPath);
  
  if (!validation.isValid) {
    console.error('❌ Build validation failed:');
    validation.errors.forEach(error => console.error(`  • ${error}`));
    process.exit(1);
  }

  if (validation.warnings.length > 0) {
    console.warn('⚠️  Warnings:');
    validation.warnings.forEach(warning => console.warn(`  • ${warning}`));
  }

  if (validation.recommendations.length > 0) {
    console.log('💡 Recommendations:');
    validation.recommendations.forEach(rec => console.log(`  • ${rec}`));
  }

  // Check environment setup
  console.log('\n🔧 Checking environment setup...');
  const envInfo = checkEnvironmentSetup(buildPath);
  
  if (envInfo.hasEnvFile) {
    console.log(`✅ Environment files found: ${envInfo.envFiles.join(', ')}`);
    if (envInfo.exposedVars.length > 0) {
      console.log(`📝 Exposed variables: ${envInfo.exposedVars.join(', ')}`);
    }
  } else {
    console.log('ℹ️  No .env files found - using system environment only');
  }

  if (envInfo.warnings.length > 0) {
    console.warn('⚠️  Environment warnings:');
    envInfo.warnings.forEach(warning => console.warn(`  • ${warning}`));
  }

  // Check iOS Simulator availability (if targeting iOS)
  if (platform === 'ios' || platform === 'all') {
    console.log('\n📱 Checking iOS Simulator availability...');
    const simInfo = checkIOSSimulatorAvailability();
    
    if (simInfo.available) {
      console.log(`✅ Found ${simInfo.devices.length} iOS simulators`);
      
      if (simInfo.activeDevice) {
        console.log(`🚀 Active simulator: ${simInfo.activeDevice}`);
      } else {
        console.log('💡 No simulator currently running');
        if (simInfo.devices.length > 0) {
          console.log(`   Recommended: xcrun simctl boot "${simInfo.devices[0].name}"`);
        }
      }
      
      // Show available devices
      if (simInfo.devices.length > 0) {
        console.log('📋 Available simulators:');
        simInfo.devices.forEach(device => {
          const status = device.state === 'Booted' ? '🟢' : '⚪';
          console.log(`   ${status} ${device.name} (${device.iosVersion})`);
        });
      }
    } else {
      console.warn('⚠️  iOS Simulator not available');
    }

    if (simInfo.warnings.length > 0) {
      console.warn('⚠️  iOS Simulator warnings:');
      simInfo.warnings.forEach(warning => console.warn(`  • ${warning}`));
    }

    if (simInfo.recommendations.length > 0) {
      console.log('💡 iOS Simulator recommendations:');
      simInfo.recommendations.forEach(rec => console.log(`  • ${rec}`));
    }
  }

  // Determine port
  let selectedPort = port;
  if (!selectedPort) {
    console.log('\n🔍 Finding available port...');
    selectedPort = await findAvailablePort();
  } else {
    const isAvailable = await isPortAvailable(selectedPort);
    if (!isAvailable) {
      console.warn(`⚠️  Port ${selectedPort} is not available, finding alternative...`);
      selectedPort = await findAvailablePort();
    }
  }

  console.log(`🌐 Using port: ${selectedPort}`);

  // Build expo command
  const expoArgs = ['expo', 'start'];
  
  if (mode === 'dev-client') {
    expoArgs.push('--dev-client');
  }
  
  if (tunnel) {
    expoArgs.push('--tunnel');
  }
  
  if (clear) {
    expoArgs.push('--clear');
  }
  
  if (offline) {
    expoArgs.push('--offline');
  }
  
  // Add platform-specific arguments
  if (platform === 'ios') {
    expoArgs.push('--ios');
  } else if (platform === 'android') {
    expoArgs.push('--android');
  } else if (platform === 'web') {
    expoArgs.push('--web');
  }
  
  // Add port
  expoArgs.push('--port', selectedPort.toString());

  // Set environment variables for monorepo support and iOS integration
  const env = { 
    ...process.env,
    EXPO_USE_METRO_WORKSPACE_ROOT: 'true'
  };

  // Add iOS-specific environment variables if targeting iOS
  if (platform === 'ios' || platform === 'all') {
    // Use preferred iOS simulator if specified
    if (process.env.EXPO_IOS_SIMULATOR_DEVICE_NAME) {
      env.EXPO_IOS_SIMULATOR_DEVICE_NAME = process.env.EXPO_IOS_SIMULATOR_DEVICE_NAME;
    }
    
    // iOS deployment target
    if (process.env.EXPO_IOS_SIMULATOR_DEPLOYMENT_TARGET) {
      env.EXPO_IOS_SIMULATOR_DEPLOYMENT_TARGET = process.env.EXPO_IOS_SIMULATOR_DEPLOYMENT_TARGET;
    }
  }

  console.log(`\n🎯 Starting Expo with command: npx ${expoArgs.join(' ')}`);
  console.log(`📁 Working directory: ${buildPath}`);
  console.log(`🔄 Mode: ${mode}`);
  
  if (platform !== 'all') {
    console.log(`📱 Platform: ${platform}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('📱 EXPO PREVIEW STARTED');
  console.log('='.repeat(60));
  console.log();
  console.log('Next steps:');
  console.log('1. Wait for Metro bundler to start');
  console.log('2. Press "w" to open web preview');
  console.log('3. Press "i" to open iOS Simulator (macOS only)');
  console.log('4. Press "a" to open Android emulator');
  console.log('5. Scan QR code with Expo Go or Dev Client');
  console.log();
  console.log('Troubleshooting:');
  console.log('• Press "r" to reload the app');
  console.log('• Press "shift+r" to reload with cache cleared');
  console.log('• Press "ctrl+c" to stop the preview');
  console.log();
  console.log('='.repeat(60));
  console.log();

  // Launch the process
  const expoProcess = spawn('npx', expoArgs, {
    cwd: buildPath,
    stdio: 'inherit',
    env
  });

  // Handle process events
  expoProcess.on('error', (error) => {
    console.error(`\n❌ Failed to start Expo: ${error.message}`);
    
    if (error.code === 'ENOENT') {
      console.error('\n💡 Troubleshooting suggestions:');
      console.error('  • Make sure Node.js is installed');
      console.error('  • Run "npm install" in the build directory');
      console.error('  • Check if expo package is installed');
    }
    
    process.exit(1);
  });

  expoProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`\n❌ Expo process exited with code ${code}`);
    } else {
      console.log('\n✅ Expo preview stopped');
    }
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping Expo preview...');
    expoProcess.kill('SIGTERM');
  });

  process.on('SIGTERM', () => {
    expoProcess.kill('SIGTERM');
  });

  return { port: selectedPort, process: expoProcess };
}

/**
 * CLI interface
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
🚀 App Factory Preview Launcher

Usage: node launch_preview.js <BUILD_PATH> [options]

Arguments:
  BUILD_PATH    Path to the build directory (required)

Options:
  --mode <mode>       Preview mode: "dev-client" (default) or "expo-go"
  --platform <plat>   Platform: "ios", "android", "web", or "all" (default)
  --port <number>     Specific port to use (auto-detect if not specified)
  --tunnel            Use Expo tunnel for network access
  --clear             Clear Metro bundler cache
  --offline           Work offline without network requests
  --help, -h          Show this help message

Examples:
  node launch_preview.js builds/01_myapp__myapp_001
  node launch_preview.js builds/06_habitapp/abc123def456/app --mode dev-client
  node launch_preview.js ../builds/myapp --port 8081 --clear
  node launch_preview.js builds/myapp --platform ios

iOS Simulator Examples:
  # Launch with specific iOS simulator device
  EXPO_IOS_SIMULATOR_DEVICE_NAME="iPhone 15" node launch_preview.js builds/myapp --platform ios
  
  # Launch iOS-only with specific deployment target
  EXPO_IOS_SIMULATOR_DEPLOYMENT_TARGET="13.0" node launch_preview.js builds/myapp --platform ios

Environment Variables:
  EXPO_PUBLIC_*                           Client-side environment variables
  EXPO_OFFLINE                            Enable offline mode
  EXPO_NO_TELEMETRY                       Disable telemetry
  EXPO_IOS_SIMULATOR_DEVICE_NAME          Preferred iOS simulator device
  EXPO_IOS_SIMULATOR_DEPLOYMENT_TARGET    iOS deployment target version

iOS Simulator Setup:
  1. Install Xcode from the App Store
  2. Install iOS simulators: Xcode > Window > Devices and Simulators
  3. Boot simulator: xcrun simctl boot "iPhone 15"
  4. Open Simulator app: open -a Simulator

For detailed iOS setup: See docs/ios_simulator_guide.md
`);
    process.exit(0);
  }

  const buildPath = args[0];
  if (!buildPath) {
    console.error('❌ Build path is required');
    process.exit(1);
  }

  const options = {};
  
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];
    
    switch (arg) {
      case '--mode':
        if (nextArg && !nextArg.startsWith('--')) {
          options.mode = nextArg;
          i++;
        }
        break;
      case '--platform':
        if (nextArg && !nextArg.startsWith('--')) {
          options.platform = nextArg;
          i++;
        }
        break;
      case '--port':
        if (nextArg && !nextArg.startsWith('--')) {
          options.port = parseInt(nextArg, 10);
          i++;
        }
        break;
      case '--tunnel':
        options.tunnel = true;
        break;
      case '--clear':
        options.clear = true;
        break;
      case '--offline':
        options.offline = true;
        break;
    }
  }

  try {
    await launchPreview(buildPath, options);
  } catch (error) {
    console.error(`\n❌ Launch failed: ${error.message}`);
    process.exit(1);
  }
}

// Run CLI if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = { 
  launchPreview, 
  validateBuildStructure, 
  checkEnvironmentSetup, 
  checkIOSSimulatorAvailability, 
  findAvailablePort 
};