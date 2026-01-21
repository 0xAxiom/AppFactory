#!/usr/bin/env node
/**
 * Smart Preview System for App Factory
 *
 * Automatically detects and launches the best available preview target:
 * 1. iOS Simulator (macOS only, if booted)
 * 2. Android Emulator (if running)
 * 3. Web browser (universal fallback)
 *
 * Integrates with Claude Code hooks for seamless development experience.
 *
 * @module scripts/expo-preview/smart-preview
 */

import { spawn, execSync } from 'node:child_process';
import { platform } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Import visual feedback module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const visualPath = join(__dirname, '..', 'lib', 'visual.mjs');

let visual;
try {
  visual = await import(visualPath);
} catch {
  // Fallback if visual module not available
  visual = {
    Spinner: class {
      constructor(msg) { this.msg = msg; }
      start() { console.log(`[...] ${this.msg}`); return this; }
      succeed(msg) { console.log(`[OK] ${msg || this.msg}`); return this; }
      fail(msg) { console.log(`[FAIL] ${msg || this.msg}`); return this; }
      stop() { return this; }
      update(msg) { this.msg = msg; return this; }
    },
    log: (msg, type = 'info') => console.log(`[${type}] ${msg}`),
    COLORS: { reset: '', cyan: '', green: '', yellow: '', red: '', dim: '' },
    SYMBOLS: { check: '+', cross: 'x', arrow: '->' },
  };
}

const { Spinner, log, COLORS, SYMBOLS } = visual;

// ============================================================================
// Configuration
// ============================================================================

const CONFIG = {
  // Expo ports
  METRO_PORT: 8081,
  WEB_PORT: 19006,

  // Polling
  POLL_INTERVAL_MS: 500,
  MAX_POLL_ATTEMPTS: 60,
  REQUEST_TIMEOUT_MS: 2000,

  // Preview priority (highest to lowest)
  PREVIEW_PRIORITY: ['ios-simulator', 'android-emulator', 'web'],

  // Success status range
  SUCCESS_STATUS_MIN: 200,
  SUCCESS_STATUS_MAX: 399,
};

// ============================================================================
// Environment Detection
// ============================================================================

/**
 * Check if running in CI/headless environment
 */
function isHeadless() {
  return (
    process.env.CI === 'true' ||
    process.env.HEADLESS === 'true' ||
    process.env.GITHUB_ACTIONS === 'true' ||
    process.env.GITLAB_CI === 'true' ||
    process.env.JENKINS_URL !== undefined ||
    process.env.BUILDKITE === 'true'
  );
}

/**
 * Get hook context from Claude Code environment
 */
function getHookContext() {
  const toolInput = process.env.CLAUDE_TOOL_INPUT;

  if (!toolInput) {
    if (process.argv.length > 2) {
      return {
        command: process.argv.slice(2).join(' '),
        cwd: process.cwd(),
      };
    }
    return null;
  }

  try {
    const parsed = JSON.parse(toolInput);
    return {
      command: parsed.command || '',
      cwd: parsed.cwd || process.cwd(),
    };
  } catch {
    return {
      command: toolInput,
      cwd: process.cwd(),
    };
  }
}

// ============================================================================
// Target Detection
// ============================================================================

/**
 * Check if iOS Simulator is available and booted
 * @returns {{ available: boolean, deviceId?: string, deviceName?: string }}
 */
function checkIOSSimulator() {
  if (platform() !== 'darwin') {
    return { available: false, reason: 'Not on macOS' };
  }

  try {
    const output = execSync('xcrun simctl list devices booted --json', {
      encoding: 'utf-8',
      timeout: 5000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    const data = JSON.parse(output);
    const devices = data.devices || {};

    // Find first booted device
    for (const runtime of Object.keys(devices)) {
      const runtimeDevices = devices[runtime];
      for (const device of runtimeDevices) {
        if (device.state === 'Booted') {
          return {
            available: true,
            deviceId: device.udid,
            deviceName: device.name,
            runtime: runtime.replace('com.apple.CoreSimulator.SimRuntime.', ''),
          };
        }
      }
    }

    return { available: false, reason: 'No booted simulator found' };
  } catch (err) {
    return { available: false, reason: err.message };
  }
}

/**
 * Check if Android Emulator is running
 * @returns {{ available: boolean, deviceId?: string }}
 */
function checkAndroidEmulator() {
  try {
    const output = execSync('adb devices', {
      encoding: 'utf-8',
      timeout: 5000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    const lines = output.split('\n').filter((line) => line.includes('emulator'));
    if (lines.length > 0) {
      const deviceId = lines[0].split('\t')[0];
      return { available: true, deviceId };
    }

    return { available: false, reason: 'No running emulator found' };
  } catch (err) {
    return { available: false, reason: err.message };
  }
}

/**
 * Detect best available preview target
 * @returns {{ target: string, details: object }}
 */
function detectBestTarget() {
  const results = {
    'ios-simulator': checkIOSSimulator(),
    'android-emulator': checkAndroidEmulator(),
    web: { available: true, reason: 'Universal fallback' },
  };

  for (const target of CONFIG.PREVIEW_PRIORITY) {
    if (results[target].available) {
      return { target, details: results[target] };
    }
  }

  return { target: 'web', details: results.web };
}

// ============================================================================
// Port Detection
// ============================================================================

/**
 * Extract port from Expo command
 */
function extractPort(command) {
  // Web mode uses different port
  if (/\s--web(\s|$)/.test(command)) {
    const portMatch = command.match(/--port[=\s]+(\d+)/);
    return portMatch ? parseInt(portMatch[1], 10) : CONFIG.WEB_PORT;
  }

  // Check for explicit port
  const portMatch = command.match(/--port[=\s]+(\d+)/);
  if (portMatch) return parseInt(portMatch[1], 10);

  const shortMatch = command.match(/-p[=\s]+(\d+)/);
  if (shortMatch) return parseInt(shortMatch[1], 10);

  return CONFIG.METRO_PORT;
}

/**
 * Check if command is web mode
 */
function isWebMode(command) {
  return /\s--web(\s|$)/.test(command);
}

// ============================================================================
// Health Checks
// ============================================================================

/**
 * Check if URL responds successfully
 */
async function healthCheck(url) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT_MS);

    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    return {
      ok: response.status >= CONFIG.SUCCESS_STATUS_MIN && response.status <= CONFIG.SUCCESS_STATUS_MAX,
      status: response.status,
    };
  } catch (err) {
    return {
      ok: false,
      error: err.name === 'AbortError' ? 'timeout' : err.message,
    };
  }
}

/**
 * Wait for server to be ready
 */
async function waitForServer(url, spinner) {
  let attempts = 0;

  while (attempts < CONFIG.MAX_POLL_ATTEMPTS) {
    attempts++;
    spinner.update(`Waiting for Metro bundler (attempt ${attempts}/${CONFIG.MAX_POLL_ATTEMPTS})...`);

    const result = await healthCheck(url);
    if (result.ok) {
      return { ready: true, attempts };
    }

    await new Promise((resolve) => setTimeout(resolve, CONFIG.POLL_INTERVAL_MS));
  }

  return {
    ready: false,
    attempts,
    error: `Server not ready after ${attempts} attempts`,
  };
}

// ============================================================================
// Preview Launchers
// ============================================================================

/**
 * Launch iOS Simulator preview
 */
function launchIOSSimulator(port, deviceId) {
  try {
    // Open Expo in simulator
    const url = `exp://localhost:${port}`;

    spawn('xcrun', ['simctl', 'openurl', deviceId || 'booted', url], {
      stdio: 'ignore',
      detached: true,
    }).unref();

    return { launched: true, url };
  } catch (err) {
    return { launched: false, error: err.message };
  }
}

/**
 * Launch Android Emulator preview
 */
function launchAndroidEmulator(port, deviceId) {
  try {
    // Open Expo in emulator via adb
    const url = `exp://localhost:${port}`;

    const args = deviceId ? ['-s', deviceId, 'shell', 'am', 'start', '-a', 'android.intent.action.VIEW', '-d', url] : ['shell', 'am', 'start', '-a', 'android.intent.action.VIEW', '-d', url];

    spawn('adb', args, {
      stdio: 'ignore',
      detached: true,
    }).unref();

    return { launched: true, url };
  } catch (err) {
    return { launched: false, error: err.message };
  }
}

/**
 * Launch web browser preview
 */
function launchWebBrowser(port) {
  const url = `http://localhost:${port}`;
  const plat = platform();

  try {
    let cmd, args;

    if (plat === 'darwin') {
      cmd = 'open';
      args = [url];
    } else if (plat === 'win32') {
      cmd = 'cmd';
      args = ['/c', 'start', '""', url];
    } else {
      cmd = 'xdg-open';
      args = [url];
    }

    spawn(cmd, args, {
      stdio: 'ignore',
      shell: false,
      detached: true,
    }).unref();

    return { launched: true, url };
  } catch (err) {
    return { launched: false, error: err.message };
  }
}

/**
 * Launch preview based on target
 */
function launchPreview(target, port, details) {
  switch (target) {
    case 'ios-simulator':
      return launchIOSSimulator(port, details.deviceId);
    case 'android-emulator':
      return launchAndroidEmulator(port, details.deviceId);
    case 'web':
    default:
      return launchWebBrowser(port);
  }
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  console.log('');
  log('Smart Preview System starting...', 'step');

  // Skip in CI
  if (isHeadless()) {
    log('Skipping in CI/headless environment', 'info');
    process.exit(0);
  }

  // Get context
  const context = getHookContext();
  if (!context) {
    log('No command context found', 'warning');
    process.exit(0);
  }

  const { command } = context;

  // Verify expo command
  if (!command.includes('expo start')) {
    log('Not an expo start command', 'info');
    process.exit(0);
  }

  // Detect best target
  const spinner = new Spinner('Detecting preview targets...').start();

  const { target, details } = detectBestTarget();
  const port = extractPort(command);
  const webMode = isWebMode(command);

  // If web mode forced, use web regardless of detection
  const finalTarget = webMode ? 'web' : target;
  const finalDetails = webMode ? { available: true, reason: '--web flag specified' } : details;

  const targetNames = {
    'ios-simulator': `iOS Simulator (${details.deviceName || 'booted'})`,
    'android-emulator': `Android Emulator (${details.deviceId || 'default'})`,
    web: 'Web Browser',
  };

  spinner.succeed(`Target: ${targetNames[finalTarget]}`);

  // Wait for server
  const waitSpinner = new Spinner('Waiting for Metro bundler...').start();
  const serverUrl = `http://localhost:${port}`;

  const serverResult = await waitForServer(serverUrl, waitSpinner);

  if (!serverResult.ready) {
    waitSpinner.fail(`Metro bundler not ready: ${serverResult.error}`);
    log('Preview skipped - server not available', 'warning');
    process.exit(0);
  }

  waitSpinner.succeed(`Metro bundler ready (${serverResult.attempts} attempts)`);

  // Launch preview
  const launchSpinner = new Spinner(`Launching ${targetNames[finalTarget]}...`).start();

  const launchResult = launchPreview(finalTarget, port, finalDetails);

  if (launchResult.launched) {
    launchSpinner.succeed(`Preview opened: ${launchResult.url}`);
    console.log('');
    log(`${SYMBOLS.arrow} Hot reload is active - edits will appear automatically`, 'info');
    console.log('');
  } else {
    launchSpinner.fail(`Failed to launch: ${launchResult.error}`);

    // Fallback to web if native failed
    if (finalTarget !== 'web') {
      log('Falling back to web browser...', 'info');
      const webResult = launchWebBrowser(port);
      if (webResult.launched) {
        log(`Web preview opened: ${webResult.url}`, 'success');
      }
    }
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('[smart-preview] Error:', err.message);
  process.exit(0); // Exit cleanly
});
