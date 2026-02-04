#!/usr/bin/env node
/**
 * Process Manager - Unified process lifecycle for all pipelines
 *
 * Handles:
 * - Spawning child processes with proper stdio capture
 * - Process group management (Unix/Windows)
 * - Health checking with process supervision
 * - Clean shutdown with timeout escalation
 *
 * Usage:
 *   import { startProcess, waitForReady, killProcess } from './process-manager.mjs';
 */

import { spawn, execSync } from 'child_process';
import { platform } from 'os';
import { appendFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import http from 'http';

/**
 * Start a managed child process with full output capture
 * @param {Object} options
 * @param {string} options.command - Command to run (e.g., 'npm')
 * @param {string[]} options.args - Arguments (e.g., ['run', 'dev'])
 * @param {string} options.cwd - Working directory
 * @param {string} [options.logFile] - Path to log file (optional)
 * @param {Object} [options.env] - Additional environment variables
 * @returns {Object} Process handle with control methods
 */
export function startProcess({ command, args, cwd, logFile, env = {} }) {
  // Ensure log directory exists
  if (logFile) {
    mkdirSync(dirname(logFile), { recursive: true });
  }

  const isWindows = platform() === 'win32';

  // Spawn with proper process group handling
  const proc = spawn(command, args, {
    cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, ...env },
    // On Unix, create new process group for clean killing
    detached: !isWindows,
    // On Windows, don't hide the window
    windowsHide: false
  });

  let output = '';
  let exited = false;
  let exitCode = null;

  const log = (prefix, data) => {
    const text = data.toString();
    output += text;
    if (logFile) {
      appendFileSync(logFile, `[${prefix}] ${text}`);
    }
  };

  proc.stdout.on('data', (data) => log('stdout', data));
  proc.stderr.on('data', (data) => log('stderr', data));

  proc.on('exit', (code) => {
    exited = true;
    exitCode = code;
    if (logFile) {
      appendFileSync(logFile, `\n[exit] Process exited with code ${code}\n`);
    }
  });

  proc.on('error', (err) => {
    exited = true;
    if (logFile) {
      appendFileSync(logFile, `\n[error] ${err.message}\n`);
    }
  });

  return {
    proc,
    get output() { return output; },
    get exited() { return exited; },
    get exitCode() { return exitCode; },
    get pid() { return proc.pid; }
  };
}

/**
 * Wait for a URL to return HTTP 200, with process supervision
 * @param {Object} options
 * @param {string} options.url - URL to check
 * @param {Object} options.processHandle - Handle from startProcess
 * @param {number} [options.timeout=60000] - Max wait time in ms
 * @param {number} [options.interval=1000] - Poll interval in ms
 * @param {Function} [options.onProgress] - Called with status updates
 * @returns {Promise<{ok: boolean, attempts: number, error?: string}>}
 */
export async function waitForReady({ url, processHandle, timeout = 60000, interval = 1000, onProgress }) {
  const startTime = Date.now();
  let attempts = 0;

  while (Date.now() - startTime < timeout) {
    // CRITICAL: Check if process died before polling
    if (processHandle.exited) {
      return {
        ok: false,
        attempts,
        error: `Process exited with code ${processHandle.exitCode} before becoming ready`,
        output: processHandle.output.slice(-1000)
      };
    }

    attempts++;

    try {
      const status = await checkUrl(url, 5000);
      if (status === 200) {
        if (onProgress) onProgress({ type: 'ready', attempts, elapsed: Date.now() - startTime });
        return { ok: true, attempts };
      }
      if (onProgress) onProgress({ type: 'poll', attempts, status });
    } catch (err) {
      // Network error, keep trying
      if (onProgress) onProgress({ type: 'poll', attempts, error: err.message });
    }

    await sleep(interval);
  }

  return {
    ok: false,
    attempts,
    error: `Timeout after ${timeout}ms (${attempts} attempts)`,
    output: processHandle.output.slice(-1000)
  };
}

/**
 * Kill a process and all its children
 * @param {Object} processHandle - Handle from startProcess
 * @param {number} [gracePeriod=2000] - Time to wait before SIGKILL
 * @returns {Promise<void>}
 */
export async function killProcess(processHandle, gracePeriod = 2000) {
  if (!processHandle.proc || processHandle.exited) {
    return;
  }

  const { proc } = processHandle;
  const pid = proc.pid;

  return new Promise((resolve) => {
    const isWindows = platform() === 'win32';

    // Set up exit handler
    const onExit = () => {
      clearTimeout(forceKillTimer);
      resolve();
    };
    proc.once('exit', onExit);

    // First attempt: graceful
    try {
      if (isWindows) {
        // Windows: use taskkill with tree flag
        execSync(`taskkill /T /PID ${pid}`, { stdio: 'pipe' });
      } else {
        // Unix: kill the process group
        process.kill(-pid, 'SIGTERM');
      }
    } catch (_err) {
      // Process may already be dead, that's fine
    }

    // Second attempt: force kill after grace period
    const forceKillTimer = setTimeout(() => {
      try {
        if (isWindows) {
          execSync(`taskkill /T /F /PID ${pid}`, { stdio: 'pipe' });
        } else {
          process.kill(-pid, 'SIGKILL');
        }
      } catch (_err) {
        // Process is dead
      }
      proc.removeListener('exit', onExit);
      resolve();
    }, gracePeriod);
  });
}

/**
 * Open URL in default browser (cross-platform)
 * @param {string} url - URL to open
 * @returns {Promise<{opened: boolean, error?: string}>}
 */
export async function openBrowser(url) {
  const os = platform();
  let command;
  let args;

  switch (os) {
    case 'darwin':
      command = 'open';
      args = [url];
      break;
    case 'win32':
      command = 'cmd';
      args = ['/c', 'start', '', url];
      break;
    default: // linux and others
      command = 'xdg-open';
      args = [url];
      break;
  }

  try {
    const child = spawn(command, args, {
      detached: true,
      stdio: 'ignore'
    });
    child.unref();

    // Give it a moment to fail if it's going to
    await sleep(300);

    return { opened: true };
  } catch (_err) {
    return { opened: false, error: err.message };
  }
}

// Helper: Check URL status
function checkUrl(url, timeout) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, { timeout }, (res) => {
      resolve(res.statusCode);
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Helper: Sleep
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}
