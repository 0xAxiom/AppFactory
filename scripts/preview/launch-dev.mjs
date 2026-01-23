#!/usr/bin/env node
/**
 * Dev Server Launcher with URL Discovery
 * Cross-platform script to:
 * - Launch the dev server
 * - Discover the served URL/port from stdout
 * - Write PREVIEW.json artifact
 * - Handle graceful shutdown
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:net';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Import detect functions
const detectModule = await import('./detect.mjs');
const { detect, getRunCommand } = detectModule;

/**
 * URL patterns to match in stdout/stderr
 */
const URL_PATTERNS = [
  /https?:\/\/localhost:\d+/gi,
  /https?:\/\/127\.0\.0\.1:\d+/gi,
  /https?:\/\/0\.0\.0\.0:\d+/gi,
  /https?:\/\/\[::\]:\d+/gi,
  /Local:\s*(https?:\/\/[^\s]+)/gi,
  /ready on\s*(https?:\/\/[^\s]+)/gi,
  /started at\s*(https?:\/\/[^\s]+)/gi,
  /listening on\s*(https?:\/\/[^\s]+)/gi,
  /Server running at\s*(https?:\/\/[^\s]+)/gi,
  /➜\s*Local:\s*(https?:\/\/[^\s]+)/gi,
];

/**
 * Extract URL from output text
 * @param {string} text - Output text to search
 * @returns {string | null}
 */
function extractUrl(text) {
  for (const pattern of URL_PATTERNS) {
    pattern.lastIndex = 0; // Reset regex state
    const match = pattern.exec(text);
    if (match) {
      // Return the captured group if exists, otherwise the full match
      let url = match[1] || match[0];
      // Normalize 0.0.0.0 and [::] to localhost
      url = url.replace(/0\.0\.0\.0|(\[::\])/, 'localhost');
      return url;
    }
  }
  return null;
}

/**
 * Check if a port is in use
 * @param {number} port - Port to check
 * @returns {Promise<boolean>}
 */
function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = createServer();
    server.once('error', () => resolve(true));
    server.once('listening', () => {
      server.close();
      resolve(false);
    });
    server.listen(port, '127.0.0.1');
  });
}

/**
 * Find URL by scanning common ports
 * @param {number} defaultPort - Default port to check first
 * @returns {Promise<string | null>}
 */
async function scanForUrl(defaultPort) {
  const portsToCheck = [defaultPort, 3000, 3001, 5173, 5174, 4321, 8080, 8081];
  const uniquePorts = [...new Set(portsToCheck)];

  for (const port of uniquePorts) {
    if (await isPortInUse(port)) {
      return `http://localhost:${port}`;
    }
  }
  return null;
}

/**
 * Write PREVIEW.json artifact
 * @param {object} data - Preview data
 * @param {string} outputDir - Output directory
 */
function writePreviewJson(data, outputDir) {
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const previewPath = join(outputDir, 'PREVIEW.json');
  writeFileSync(previewPath, JSON.stringify(data, null, 2));
  console.log(`\n[Preview] Artifact written: ${previewPath}`);
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
 * Launch dev server and discover URL
 * @param {string} cwd - Working directory
 * @param {object} options - Options
 * @returns {Promise<{ url: string, process: ChildProcess }>}
 */
async function launchDevServer(cwd, options = {}) {
  const {
    timeout = 60000,
    outputDir = join(cwd, '.vscode', '.preview'),
    keepRunning = true,
  } = options;

  const detection = detect(cwd);

  if (!detection.packageManager) {
    const error = {
      status: 'failure',
      reason: 'No package manager detected',
      suggestion: 'Ensure package.json exists with a lockfile',
      cwd: detection.cwd,
      timestamp: new Date().toISOString(),
    };
    writeFailureJson(error, outputDir);
    throw new Error(error.reason);
  }

  if (!detection.devCommand) {
    const error = {
      status: 'failure',
      reason: 'No dev command found',
      suggestion: 'Add a "dev", "start", or "serve" script to package.json',
      cwd: detection.cwd,
      timestamp: new Date().toISOString(),
    };
    writeFailureJson(error, outputDir);
    throw new Error(error.reason);
  }

  const runCommand = getRunCommand(detection.packageManager, detection.devCommand);
  const [cmd, ...args] = runCommand;

  console.log('');
  console.log('=== Factory Preview: Launch Dev Server ===');
  console.log('');
  console.log(`  Directory:       ${detection.cwd}`);
  console.log(`  Package Manager: ${detection.packageManager}`);
  console.log(`  Project Type:    ${detection.projectType}`);
  console.log(`  Command:         ${runCommand.join(' ')}`);
  console.log('');
  console.log('  Launching server...');
  console.log('');

  return new Promise((resolve, reject) => {
    let discoveredUrl = null;
    let outputBuffer = '';
    let serverReady = false;

    // Spawn the dev server
    const serverProcess = spawn(cmd, args, {
      cwd: detection.cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: process.platform === 'win32',
      env: { ...process.env, FORCE_COLOR: '1' },
    });

    // Timeout handler
    const timeoutId = setTimeout(async () => {
      if (!serverReady) {
        // Try port scanning as fallback
        console.log('[Preview] Timeout waiting for URL in output, scanning ports...');
        const scannedUrl = await scanForUrl(detection.defaultPort);
        if (scannedUrl) {
          discoveredUrl = scannedUrl;
          serverReady = true;
          onServerReady();
        } else {
          const error = {
            status: 'failure',
            reason: 'Timeout waiting for server URL',
            suggestion: 'Server may have failed to start. Check the output above.',
            output: outputBuffer.slice(-2000),
            cwd: detection.cwd,
            timestamp: new Date().toISOString(),
          };
          writeFailureJson(error, outputDir);
          if (!keepRunning) {
            serverProcess.kill();
          }
          reject(new Error(error.reason));
        }
      }
    }, timeout);

    function onServerReady() {
      clearTimeout(timeoutId);

      const previewData = {
        status: 'success',
        url: discoveredUrl,
        platform: process.platform,
        pm: detection.packageManager,
        projectType: detection.projectType,
        command: runCommand.join(' '),
        pid: serverProcess.pid,
        cwd: detection.cwd,
        timestamp: new Date().toISOString(),
      };

      writePreviewJson(previewData, outputDir);

      console.log('');
      console.log('  ========================================');
      console.log(`  SERVER READY: ${discoveredUrl}`);
      console.log('  ========================================');
      console.log('');
      console.log('  The dev server is now running.');
      console.log('  Press Ctrl+C to stop the server.');
      console.log('');

      resolve({ url: discoveredUrl, process: serverProcess, detection });
    }

    function processOutput(data, stream) {
      const text = data.toString();
      outputBuffer += text;

      // Print to console
      process[stream].write(text);

      // Try to extract URL if not already found
      if (!serverReady) {
        const url = extractUrl(text);
        if (url) {
          discoveredUrl = url;
          serverReady = true;
          onServerReady();
        }
      }
    }

    serverProcess.stdout.on('data', (data) => processOutput(data, 'stdout'));
    serverProcess.stderr.on('data', (data) => processOutput(data, 'stderr'));

    serverProcess.on('error', (err) => {
      clearTimeout(timeoutId);
      const error = {
        status: 'failure',
        reason: `Failed to spawn process: ${err.message}`,
        command: runCommand.join(' '),
        cwd: detection.cwd,
        timestamp: new Date().toISOString(),
      };
      writeFailureJson(error, outputDir);
      reject(new Error(error.reason));
    });

    serverProcess.on('exit', (code) => {
      clearTimeout(timeoutId);
      if (!serverReady && code !== 0) {
        const error = {
          status: 'failure',
          reason: `Process exited with code ${code}`,
          output: outputBuffer.slice(-2000),
          cwd: detection.cwd,
          timestamp: new Date().toISOString(),
        };
        writeFailureJson(error, outputDir);
        reject(new Error(error.reason));
      }
    });

    // Handle graceful shutdown
    const shutdown = () => {
      console.log('\n[Preview] Shutting down server...');
      serverProcess.kill('SIGTERM');
      setTimeout(() => {
        if (!serverProcess.killed) {
          serverProcess.kill('SIGKILL');
        }
        process.exit(0);
      }, 3000);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  });
}

// CLI execution
if (process.argv[1] && process.argv[1].endsWith('launch-dev.mjs')) {
  const cwd = process.argv[2] || process.cwd();
  const timeout = parseInt(process.argv[3]) || 60000;

  try {
    await launchDevServer(cwd, { timeout, keepRunning: true });
  } catch (err) {
    console.error(`\n[Preview] ERROR: ${err.message}`);
    process.exit(1);
  }
}

export { launchDevServer, extractUrl, scanForUrl };
