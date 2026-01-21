#!/usr/bin/env node
/**
 * Website Local Run Proof
 *
 * Verifies a website project runs locally by:
 * 1. Starting dev server as managed child process
 * 2. Waiting for HTTP 200 on specified URL
 * 3. Writing logs to .appfactory/logs/devserver.log
 * 4. Cleaning up process on completion
 *
 * Usage: node scripts/local-run-proof-website.mjs --cwd <path> [--port 3000] [--timeout 60000]
 *
 * Exit codes:
 *   0 - PASS: Server started and returned HTTP 200
 *   1 - FAIL: Server failed to start or respond
 */

import { spawn } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, appendFileSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import http from 'http';
import https from 'https';

// Parse arguments
const args = process.argv.slice(2);
let cwd = null;
let port = 3000;
let timeout = 60000;
let openBrowser = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--cwd' && args[i + 1]) {
    cwd = resolve(args[++i]);
  } else if (args[i] === '--port' && args[i + 1]) {
    port = parseInt(args[++i], 10);
  } else if (args[i] === '--timeout' && args[i + 1]) {
    timeout = parseInt(args[++i], 10);
  } else if (args[i] === '--open') {
    openBrowser = true;
  }
}

if (!cwd) {
  console.error('Usage: node scripts/local-run-proof-website.mjs --cwd <path> [--port 3000] [--timeout 60000] [--open]');
  process.exit(1);
}

if (!existsSync(cwd)) {
  console.error(`ERROR: Directory does not exist: ${cwd}`);
  process.exit(1);
}

const packageJsonPath = join(cwd, 'package.json');
if (!existsSync(packageJsonPath)) {
  console.error(`ERROR: No package.json found in ${cwd}`);
  process.exit(1);
}

// Setup logging
const logDir = join(cwd, '.appfactory', 'logs');
mkdirSync(logDir, { recursive: true });
const logPath = join(logDir, 'devserver.log');
const certPath = join(cwd, '.appfactory', 'RUN_CERTIFICATE.json');
const failPath = join(cwd, '.appfactory', 'RUN_FAILURE.json');

function log(message) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${message}\n`;
  process.stdout.write(line);
  appendFileSync(logPath, line);
}

// Clear old logs and certificates
writeFileSync(logPath, `=== Website Local Run Proof ===\nStarted: ${new Date().toISOString()}\nProject: ${cwd}\nPort: ${port}\nTimeout: ${timeout}ms\n\n`);

// Delete old certificates
if (existsSync(certPath)) {
  require('fs').unlinkSync(certPath);
}
if (existsSync(failPath)) {
  require('fs').unlinkSync(failPath);
}

const url = `http://localhost:${port}`;

log(`Starting dev server in: ${cwd}`);

// Detect package manager
let pm = 'npm';
if (existsSync(join(cwd, 'pnpm-lock.yaml'))) {
  pm = 'pnpm';
} else if (existsSync(join(cwd, 'yarn.lock'))) {
  pm = 'yarn';
}

log(`Using package manager: ${pm}`);

// Start dev server
const devProcess = spawn(pm, ['run', 'dev'], {
  cwd,
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, PORT: port.toString() }
});

let serverOutput = '';

devProcess.stdout.on('data', (data) => {
  const text = data.toString();
  serverOutput += text;
  appendFileSync(logPath, text);
});

devProcess.stderr.on('data', (data) => {
  const text = data.toString();
  serverOutput += text;
  appendFileSync(logPath, `[stderr] ${text}`);
});

devProcess.on('error', (err) => {
  log(`Process error: ${err.message}`);
});

devProcess.on('exit', (code) => {
  if (code !== null && code !== 0) {
    log(`Dev server exited with code ${code}`);
  }
});

// Health check function
function checkHealth() {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(res.statusCode);
    });
    req.on('error', () => resolve(null));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(null);
    });
  });
}

// Wait for server to be ready
async function waitForServer() {
  const startTime = Date.now();
  const pollInterval = 1000;
  let attempts = 0;

  log(`Waiting for ${url} to return HTTP 200...`);

  while (Date.now() - startTime < timeout) {
    attempts++;
    const status = await checkHealth();

    if (status === 200) {
      log(`SUCCESS: Got HTTP 200 after ${attempts} attempts (${Date.now() - startTime}ms)`);
      return true;
    }

    if (status !== null) {
      log(`Attempt ${attempts}: Got HTTP ${status}, waiting...`);
    }

    await new Promise(r => setTimeout(r, pollInterval));
  }

  log(`TIMEOUT: Server did not respond with HTTP 200 within ${timeout}ms`);
  return false;
}

// Main execution
async function main() {
  try {
    // Give server a moment to start
    await new Promise(r => setTimeout(r, 2000));

    const success = await waitForServer();

    // Clean up
    log('Terminating dev server...');
    devProcess.kill('SIGTERM');

    // Wait a moment for clean shutdown
    await new Promise(r => setTimeout(r, 1000));

    if (!devProcess.killed) {
      devProcess.kill('SIGKILL');
    }

    if (success) {
      // Write success certificate
      const cert = {
        status: 'PASS',
        timestamp: new Date().toISOString(),
        url,
        port,
        project: cwd,
        logFile: logPath
      };
      writeFileSync(certPath, JSON.stringify(cert, null, 2));
      log(`Certificate written: ${certPath}`);

      // Open browser if requested
      if (openBrowser) {
        const { spawn: spawnOpen } = await import('child_process');
        const openScript = join(process.cwd(), 'scripts', 'open-url.mjs');
        if (existsSync(openScript)) {
          log(`Opening browser: ${url}`);
          spawn('node', [openScript, url], { detached: true, stdio: 'ignore' }).unref();
        }
      }

      console.log('\n=== LOCAL RUN PROOF: PASS ===');
      console.log(`Project: ${cwd}`);
      console.log(`URL: ${url}`);
      console.log(`Logs: ${logPath}`);
      console.log(`Certificate: ${certPath}`);
      process.exit(0);
    } else {
      // Write failure report
      const failure = {
        status: 'FAIL',
        timestamp: new Date().toISOString(),
        url,
        port,
        project: cwd,
        logFile: logPath,
        lastOutput: serverOutput.slice(-2000)
      };
      writeFileSync(failPath, JSON.stringify(failure, null, 2));

      console.log('\n=== LOCAL RUN PROOF: FAIL ===');
      console.log(`Project: ${cwd}`);
      console.log(`Logs: ${logPath}`);
      console.log(`Failure report: ${failPath}`);
      console.log('\nLast 500 chars of output:');
      console.log(serverOutput.slice(-500));
      process.exit(1);
    }
  } catch (err) {
    log(`Fatal error: ${err.message}`);
    devProcess.kill('SIGKILL');
    process.exit(1);
  }
}

main();
