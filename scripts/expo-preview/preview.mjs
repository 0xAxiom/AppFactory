#!/usr/bin/env node
/**
 * Expo Preview - Automatic Browser Launch Hook
 *
 * Claude Code hook that automatically opens the web preview when Expo dev server starts.
 * Triggered by post_tool_execution hook on "expo start" commands.
 *
 * @module scripts/expo-preview/preview
 */

import { spawn } from 'node:child_process';
import { platform } from 'node:os';

// ============================================================================
// Configuration
// ============================================================================

const CONFIG = {
  // Default ports for Expo
  DEFAULT_PORT: 8081,        // Metro bundler default
  WEB_PORT: 19006,           // Expo web default (--web flag)

  // Polling settings
  POLL_INTERVAL_MS: 500,     // Check every 500ms
  MAX_POLL_ATTEMPTS: 60,     // 30 seconds total (60 * 500ms)
  REQUEST_TIMEOUT_MS: 2000,  // Individual request timeout

  // Success criteria: any 2xx or 3xx response
  SUCCESS_STATUS_MIN: 200,
  SUCCESS_STATUS_MAX: 399,
};

// ============================================================================
// Environment Detection
// ============================================================================

/**
 * Checks if running in CI/headless environment
 * @returns {boolean}
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
 * Extracts command details from Claude Code hook environment
 * @returns {{ command: string, cwd: string } | null}
 */
function getHookContext() {
  const toolInput = process.env.CLAUDE_TOOL_INPUT;

  if (!toolInput) {
    // Fallback: check if we have command line args
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
    // Treat as raw command string
    return {
      command: toolInput,
      cwd: process.cwd(),
    };
  }
}

// ============================================================================
// Port Detection
// ============================================================================

/**
 * Extracts port from Expo command flags
 * Handles: --port 8082, --port=8082, -p 8082
 * @param {string} command - The expo start command
 * @returns {number}
 */
function extractPort(command) {
  // Check for web mode first (takes precedence)
  if (/\s--web(\s|$)/.test(command)) {
    // Check if custom port specified with --web
    const webPortMatch = command.match(/--port[=\s]+(\d+)/);
    return webPortMatch ? parseInt(webPortMatch[1], 10) : CONFIG.WEB_PORT;
  }

  // Check for --port=XXXX or --port XXXX
  const portMatch = command.match(/--port[=\s]+(\d+)/);
  if (portMatch) {
    return parseInt(portMatch[1], 10);
  }

  // Check for -p XXXX
  const shortPortMatch = command.match(/-p[=\s]+(\d+)/);
  if (shortPortMatch) {
    return parseInt(shortPortMatch[1], 10);
  }

  return CONFIG.DEFAULT_PORT;
}

/**
 * Determines if this is a web preview command
 * @param {string} command
 * @returns {boolean}
 */
function isWebMode(command) {
  return /\s--web(\s|$)/.test(command);
}

// ============================================================================
// Health Check
// ============================================================================

/**
 * Performs a single health check request
 * @param {string} url
 * @returns {Promise<{ ok: boolean, status?: number, error?: string }>}
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

    const isSuccess =
      response.status >= CONFIG.SUCCESS_STATUS_MIN &&
      response.status <= CONFIG.SUCCESS_STATUS_MAX;

    return {
      ok: isSuccess,
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
 * Polls until server is ready or max attempts reached
 * @param {string} url
 * @returns {Promise<{ ready: boolean, attempts: number, error?: string }>}
 */
async function waitForServer(url) {
  let attempts = 0;

  while (attempts < CONFIG.MAX_POLL_ATTEMPTS) {
    attempts++;

    const result = await healthCheck(url);

    if (result.ok) {
      return { ready: true, attempts };
    }

    // Wait before next attempt
    await new Promise((resolve) => setTimeout(resolve, CONFIG.POLL_INTERVAL_MS));
  }

  return {
    ready: false,
    attempts,
    error: `Server not ready after ${attempts} attempts (${(attempts * CONFIG.POLL_INTERVAL_MS) / 1000}s)`,
  };
}

// ============================================================================
// Browser Launch
// ============================================================================

/**
 * Opens URL in default browser (platform-specific)
 * @param {string} url
 * @returns {{ opened: boolean, error?: string }}
 */
function openBrowser(url) {
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
      // Linux and others
      cmd = 'xdg-open';
      args = [url];
    }

    // Fire and forget - detach process so it doesn't block
    const proc = spawn(cmd, args, {
      stdio: 'ignore',
      shell: false,
      detached: true,
    });
    proc.unref();

    return { opened: true };
  } catch (err) {
    return { opened: false, error: err.message };
  }
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  // Skip in CI environments
  if (isHeadless()) {
    console.log('[expo-preview] Skipping browser launch in CI/headless environment');
    process.exit(0);
  }

  // Get hook context
  const context = getHookContext();

  if (!context) {
    console.log('[expo-preview] No command context found, skipping');
    process.exit(0);
  }

  const { command } = context;

  // Verify this is an expo start command
  if (!command.includes('expo start')) {
    console.log('[expo-preview] Not an expo start command, skipping');
    process.exit(0);
  }

  // Determine port and URL
  const port = extractPort(command);
  const url = `http://localhost:${port}`;

  console.log(`[expo-preview] Waiting for Expo dev server at ${url}...`);

  // Wait for server to be ready
  const result = await waitForServer(url);

  if (!result.ready) {
    console.log(`[expo-preview] Server not ready: ${result.error}`);
    process.exit(0); // Exit cleanly - don't fail the build
  }

  console.log(`[expo-preview] Server ready after ${result.attempts} attempts`);

  // Open browser
  const browserResult = openBrowser(url);

  if (browserResult.opened) {
    console.log(`[expo-preview] Opened ${url} in browser`);
  } else {
    console.log(`[expo-preview] Failed to open browser: ${browserResult.error}`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('[expo-preview] Unexpected error:', err.message);
  process.exit(0); // Exit cleanly - don't fail the build
});
