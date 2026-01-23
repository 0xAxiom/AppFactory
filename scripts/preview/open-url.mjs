#!/usr/bin/env node
/**
 * Cross-Platform URL Opener
 * Opens URLs in the default browser across macOS, Linux, and Windows
 */

import { spawn, execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Get the platform-specific command to open URLs
 * @returns {{ command: string, args: (url: string) => string[] }}
 */
function getOpenCommand() {
  switch (process.platform) {
    case 'darwin':
      return {
        command: 'open',
        args: (url) => [url],
      };
    case 'win32':
      return {
        command: 'cmd',
        args: (url) => ['/c', 'start', '""', url],
      };
    case 'linux':
    default:
      return {
        command: 'xdg-open',
        args: (url) => [url],
      };
  }
}

/**
 * Open a URL in the default browser
 * @param {string} url - URL to open
 * @returns {Promise<void>}
 */
export async function openUrl(url) {
  const { command, args } = getOpenCommand();

  console.log('');
  console.log('=== Factory Preview: Open Browser ===');
  console.log('');
  console.log(`  Platform: ${process.platform}`);
  console.log(`  Command:  ${command}`);
  console.log(`  URL:      ${url}`);
  console.log('');

  return new Promise((resolve, reject) => {
    const child = spawn(command, args(url), {
      detached: true,
      stdio: 'ignore',
    });

    child.unref();

    child.on('error', (err) => {
      console.error(`[Preview] Failed to open browser: ${err.message}`);
      reject(err);
    });

    // Give it a moment to spawn
    setTimeout(() => {
      console.log('  Browser launched successfully.');
      console.log('');
      resolve();
    }, 500);
  });
}

/**
 * Read URL from PREVIEW.json
 * @param {string} previewDir - Directory containing PREVIEW.json
 * @returns {string | null}
 */
export function readPreviewUrl(previewDir) {
  const previewPath = join(previewDir, 'PREVIEW.json');

  if (!existsSync(previewPath)) {
    console.error(`[Preview] PREVIEW.json not found at: ${previewPath}`);
    console.error('[Preview] Run "Factory: Preview (Auto)" first to start the dev server.');
    return null;
  }

  try {
    const preview = JSON.parse(readFileSync(previewPath, 'utf-8'));
    if (preview.status !== 'success' || !preview.url) {
      console.error('[Preview] PREVIEW.json does not contain a valid URL.');
      console.error(`[Preview] Status: ${preview.status}`);
      return null;
    }
    return preview.url;
  } catch (err) {
    console.error(`[Preview] Failed to read PREVIEW.json: ${err.message}`);
    return null;
  }
}

/**
 * Check if a URL is reachable (basic check)
 * @param {string} url - URL to check
 * @returns {Promise<boolean>}
 */
export async function isUrlReachable(url) {
  try {
    // Use a simple fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return true;
  } catch {
    return false;
  }
}

// CLI execution
if (process.argv[1] && process.argv[1].endsWith('open-url.mjs')) {
  let url = process.argv[2];

  // If no URL provided, try to read from PREVIEW.json
  if (!url) {
    const cwd = process.cwd();
    const previewDir = join(cwd, '.vscode', '.preview');
    url = readPreviewUrl(previewDir);

    if (!url) {
      console.error('');
      console.error('Usage: node open-url.mjs [url]');
      console.error('');
      console.error('If no URL is provided, reads from .vscode/.preview/PREVIEW.json');
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
    await openUrl(url);
  } catch (err) {
    console.error(`[Preview] Failed to open URL: ${err.message}`);
    process.exit(1);
  }
}
