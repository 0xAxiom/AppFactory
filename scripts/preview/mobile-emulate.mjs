#!/usr/bin/env node
/**
 * Mobile Web Emulation with Playwright
 * Cross-platform script to open URLs with mobile device emulation
 * Installs Playwright on-demand if missing
 */

import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Device profiles for mobile emulation
 * Based on Playwright's device descriptors
 */
const DEVICE_PROFILES = {
  iphone: {
    name: 'iPhone 14 Pro',
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    defaultBrowserType: 'webkit',
  },
  'iphone-se': {
    name: 'iPhone SE',
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    viewport: { width: 375, height: 667 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    defaultBrowserType: 'webkit',
  },
  android: {
    name: 'Pixel 7',
    userAgent:
      'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2.625,
    isMobile: true,
    hasTouch: true,
    defaultBrowserType: 'chromium',
  },
  'android-tablet': {
    name: 'Galaxy Tab S8',
    userAgent:
      'Mozilla/5.0 (Linux; Android 13; SM-X700) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    viewport: { width: 753, height: 1193 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    defaultBrowserType: 'chromium',
  },
  ipad: {
    name: 'iPad Pro 11',
    userAgent:
      'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    viewport: { width: 834, height: 1194 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    defaultBrowserType: 'webkit',
  },
};

/**
 * Read URL from PREVIEW.json
 * @param {string} previewDir - Directory containing PREVIEW.json
 * @returns {string | null}
 */
function readPreviewUrl(previewDir) {
  const previewPath = join(previewDir, 'PREVIEW.json');

  if (!existsSync(previewPath)) {
    return null;
  }

  try {
    const preview = JSON.parse(readFileSync(previewPath, 'utf-8'));
    if (preview.status === 'success' && preview.url) {
      return preview.url;
    }
    return null;
  } catch {
    return null;
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
 * Check if Playwright is installed
 * @param {string} cwd - Working directory
 * @returns {boolean}
 */
function isPlaywrightInstalled(cwd) {
  try {
    // Check if playwright is in node_modules
    const playwrightPath = join(cwd, 'node_modules', 'playwright');
    if (existsSync(playwrightPath)) {
      return true;
    }

    // Check global installation
    const result = spawnSync('npx', ['playwright', '--version'], {
      stdio: 'pipe',
      shell: process.platform === 'win32',
    });
    return result.status === 0;
  } catch {
    return false;
  }
}

/**
 * Install Playwright as a dev dependency
 * @param {string} cwd - Working directory
 * @returns {Promise<boolean>}
 */
async function installPlaywright(cwd) {
  const pkgPath = join(cwd, 'package.json');
  const outputDir = join(cwd, '.vscode', '.preview');

  // Check if package.json exists
  if (!existsSync(pkgPath)) {
    const error = {
      status: 'failure',
      reason: 'No package.json found - cannot install Playwright',
      suggestion: 'Create a package.json with: npm init -y',
      cwd,
      timestamp: new Date().toISOString(),
    };
    writeFailureJson(error, outputDir);
    return false;
  }

  console.log('');
  console.log('[Preview] Playwright not found. Installing...');
  console.log('');

  return new Promise((resolve) => {
    const install = spawn('npm', ['install', '--save-dev', 'playwright'], {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    install.on('close', (code) => {
      if (code === 0) {
        console.log('');
        console.log('[Preview] Installing Playwright browsers...');
        console.log('');

        const browsers = spawn('npx', ['playwright', 'install', 'chromium', 'webkit'], {
          cwd,
          stdio: 'inherit',
          shell: process.platform === 'win32',
        });

        browsers.on('close', (browserCode) => {
          resolve(browserCode === 0);
        });
      } else {
        const error = {
          status: 'failure',
          reason: 'Failed to install Playwright',
          suggestion: 'Try running: npm install --save-dev playwright',
          cwd,
          timestamp: new Date().toISOString(),
        };
        writeFailureJson(error, outputDir);
        resolve(false);
      }
    });
  });
}

/**
 * Launch Playwright with mobile emulation
 * @param {string} url - URL to open
 * @param {string} device - Device profile key
 * @param {string} cwd - Working directory
 * @returns {Promise<void>}
 */
async function launchMobileEmulation(url, device, cwd) {
  const profile = DEVICE_PROFILES[device];
  const outputDir = join(cwd, '.vscode', '.preview');

  if (!profile) {
    const error = {
      status: 'failure',
      reason: `Unknown device: ${device}`,
      suggestion: `Available devices: ${Object.keys(DEVICE_PROFILES).join(', ')}`,
      cwd,
      timestamp: new Date().toISOString(),
    };
    writeFailureJson(error, outputDir);
    throw new Error(error.reason);
  }

  console.log('');
  console.log('=== Factory Preview: Mobile Emulation ===');
  console.log('');
  console.log(`  Device:   ${profile.name}`);
  console.log(`  Viewport: ${profile.viewport.width}x${profile.viewport.height}`);
  console.log(`  Browser:  ${profile.defaultBrowserType}`);
  console.log(`  URL:      ${url}`);
  console.log('');

  // Check if Playwright is installed
  if (!isPlaywrightInstalled(cwd)) {
    const installed = await installPlaywright(cwd);
    if (!installed) {
      throw new Error('Failed to install Playwright');
    }
  }

  // Create a temporary script to run Playwright
  const scriptContent = `
const { ${profile.defaultBrowserType} } = require('playwright');

(async () => {
  const browser = await ${profile.defaultBrowserType}.launch({ headless: false });
  const context = await browser.newContext({
    userAgent: ${JSON.stringify(profile.userAgent)},
    viewport: ${JSON.stringify(profile.viewport)},
    deviceScaleFactor: ${profile.deviceScaleFactor},
    isMobile: ${profile.isMobile},
    hasTouch: ${profile.hasTouch},
  });

  const page = await context.newPage();
  await page.goto(${JSON.stringify(url)});

  console.log('');
  console.log('  ========================================');
  console.log('  MOBILE PREVIEW OPEN: ${profile.name}');
  console.log('  ========================================');
  console.log('');
  console.log('  Close the browser window to exit.');
  console.log('');

  // Keep the browser open until manually closed
  await new Promise((resolve) => {
    context.on('close', resolve);
    browser.on('disconnected', resolve);
  });

  process.exit(0);
})();
`;

  const tempScriptPath = join(outputDir, '_mobile-preview.cjs');
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  writeFileSync(tempScriptPath, scriptContent);

  return new Promise((resolve, reject) => {
    const child = spawn('node', [tempScriptPath], {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    child.on('error', (err) => {
      reject(err);
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Playwright exited with code ${code}`));
      }
    });
  });
}

// CLI execution
if (process.argv[1] && process.argv[1].endsWith('mobile-emulate.mjs')) {
  const device = process.argv[2] || 'iphone';
  let url = process.argv[3];
  const cwd = process.cwd();

  // If no URL provided, try to read from PREVIEW.json
  if (!url) {
    const previewDir = join(cwd, '.vscode', '.preview');
    url = readPreviewUrl(previewDir);

    if (!url) {
      console.error('');
      console.error('Usage: node mobile-emulate.mjs <device> [url]');
      console.error('');
      console.error('Devices: iphone, iphone-se, android, android-tablet, ipad');
      console.error('');
      console.error('If no URL is provided, reads from .vscode/.preview/PREVIEW.json');
      console.error('Run "Factory: Preview (Auto)" first to start the dev server.');
      console.error('');
      process.exit(1);
    }
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    console.error(`[Preview] Invalid URL: ${url}`);
    process.exit(1);
  }

  try {
    await launchMobileEmulation(url, device, cwd);
  } catch (err) {
    console.error(`\n[Preview] ERROR: ${err.message}`);
    process.exit(1);
  }
}

export { launchMobileEmulation, DEVICE_PROFILES, isPlaywrightInstalled };
