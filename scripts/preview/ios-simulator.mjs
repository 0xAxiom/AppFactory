#!/usr/bin/env node
/**
 * iOS Simulator Launcher (Mac Only)
 * Opens the iOS Simulator app and provides hints for Expo projects
 */

import { spawn, execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Check if running on macOS
 * @returns {boolean}
 */
function isMacOS() {
  return process.platform === 'darwin';
}

/**
 * Check if Xcode command line tools are installed
 * @returns {boolean}
 */
function hasXcodeTools() {
  try {
    execSync('xcode-select -p', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if Simulator app exists
 * @returns {boolean}
 */
function hasSimulatorApp() {
  const paths = [
    '/Applications/Xcode.app/Contents/Developer/Applications/Simulator.app',
    '/Applications/Simulator.app',
  ];
  return paths.some((p) => existsSync(p));
}

/**
 * Check if this is an Expo project
 * @param {string} cwd - Working directory
 * @returns {boolean}
 */
function isExpoProject(cwd) {
  const pkgPath = join(cwd, 'package.json');
  if (!existsSync(pkgPath)) {
    return false;
  }

  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    return !!deps['expo'];
  } catch {
    return false;
  }
}

/**
 * Write FAILURE.json artifact
 * @param {object} error - Error data
 * @param {string} outputDir - Output directory
 */
function writeFailureJson(error, outputDir) {
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const failurePath = join(outputDir, 'FAILURE.json');
  writeFileSync(failurePath, JSON.stringify(error, null, 2));
  console.error(`\n[Preview] Failure artifact written: ${failurePath}`);
}

/**
 * Launch iOS Simulator
 * @param {string} cwd - Working directory
 * @returns {Promise<void>}
 */
async function launchSimulator(cwd) {
  const outputDir = join(cwd, '.vscode', '.preview');

  console.log('');
  console.log('=== Factory Preview: iOS Simulator ===');
  console.log('');

  // Check platform
  if (!isMacOS()) {
    const error = {
      status: 'failure',
      reason: 'iOS Simulator requires macOS',
      platform: process.platform,
      suggestion: 'Use "Factory: Preview (Mobile Web iPhone)" for cross-platform mobile preview',
      timestamp: new Date().toISOString(),
    };
    writeFailureJson(error, outputDir);

    console.log('  Platform:  ' + process.platform);
    console.log('');
    console.log('  ERROR: iOS Simulator is only available on macOS.');
    console.log('');
    console.log('  Alternative: Use "Factory: Preview (Mobile Web iPhone)"');
    console.log('  This provides mobile web emulation that works on all platforms.');
    console.log('');
    process.exit(1);
  }

  // Check Xcode tools
  if (!hasXcodeTools()) {
    const error = {
      status: 'failure',
      reason: 'Xcode command line tools not installed',
      suggestion: 'Install with: xcode-select --install',
      timestamp: new Date().toISOString(),
    };
    writeFailureJson(error, outputDir);

    console.log('  ERROR: Xcode command line tools not found.');
    console.log('');
    console.log('  Install with:');
    console.log('    xcode-select --install');
    console.log('');
    process.exit(1);
  }

  // Check Simulator app
  if (!hasSimulatorApp()) {
    const error = {
      status: 'failure',
      reason: 'Simulator app not found',
      suggestion: 'Install Xcode from the App Store',
      timestamp: new Date().toISOString(),
    };
    writeFailureJson(error, outputDir);

    console.log('  ERROR: Simulator app not found.');
    console.log('');
    console.log('  Install Xcode from the App Store to get the Simulator.');
    console.log('');
    process.exit(1);
  }

  console.log('  Platform:     macOS');
  console.log('  Xcode Tools:  Found');
  console.log('  Simulator:    Found');
  console.log('');

  // Launch Simulator
  console.log('  Launching iOS Simulator...');
  console.log('');

  return new Promise((resolve, reject) => {
    const sim = spawn('open', ['-a', 'Simulator'], {
      detached: true,
      stdio: 'ignore',
    });

    sim.unref();

    sim.on('error', (err) => {
      reject(err);
    });

    setTimeout(() => {
      console.log('  ========================================');
      console.log('  iOS SIMULATOR LAUNCHED');
      console.log('  ========================================');
      console.log('');

      // Check if this is an Expo project and provide hints
      if (isExpoProject(cwd)) {
        console.log('  This appears to be an Expo project.');
        console.log('');
        console.log('  To run your app in the simulator:');
        console.log('    1. Start Expo: npx expo start');
        console.log('    2. Press "i" in the terminal to open in iOS Simulator');
        console.log('');
        console.log('  Or use the VS Code task:');
        console.log('    "Factory: Expo Start (iOS)"');
        console.log('');
      } else {
        console.log('  The iOS Simulator is now open.');
        console.log('');
        console.log('  For React Native apps:');
        console.log('    npx react-native run-ios');
        console.log('');
        console.log('  For Expo apps:');
        console.log('    npx expo start --ios');
        console.log('');
      }

      resolve();
    }, 1000);
  });
}

// CLI execution
if (process.argv[1] && process.argv[1].endsWith('ios-simulator.mjs')) {
  const cwd = process.argv[2] || process.cwd();

  try {
    await launchSimulator(cwd);
  } catch (err) {
    console.error(`\n[Preview] ERROR: ${err.message}`);
    process.exit(1);
  }
}

export { launchSimulator, isMacOS, hasXcodeTools, isExpoProject };
