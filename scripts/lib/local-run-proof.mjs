#!/usr/bin/env node
/**
 * Local Run Proof - Unified verification for all pipelines
 *
 * Verifies that a project:
 * 1. Installs dependencies successfully
 * 2. Starts dev server and responds with HTTP 200
 * 3. (Optional) Builds successfully
 *
 * Outputs:
 * - RUN_CERTIFICATE.json on success
 * - RUN_FAILURE.json on failure
 * - Logs to .appfactory/logs/
 *
 * Usage:
 *   node scripts/lib/local-run-proof.mjs \
 *     --cwd <project-path> \
 *     --port 3000 \
 *     --timeout 60000 \
 *     [--skip-install] \
 *     [--skip-build] \
 *     [--open]
 */

import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { startProcess, waitForReady, killProcess, openBrowser } from './process-manager.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse CLI arguments
function parseArgs(argv) {
  const args = {
    cwd: null,
    port: 3000,
    timeout: 60000,
    skipInstall: false,
    skipBuild: false,
    open: false
  };

  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case '--cwd': args.cwd = resolve(argv[++i]); break;
      case '--port': args.port = parseInt(argv[++i], 10); break;
      case '--timeout': args.timeout = parseInt(argv[++i], 10); break;
      case '--skip-install': args.skipInstall = true; break;
      case '--skip-build': args.skipBuild = true; break;
      case '--open': args.open = true; break;
    }
  }

  return args;
}

// Detect package manager
function detectPackageManager(cwd) {
  if (existsSync(join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(cwd, 'yarn.lock'))) return 'yarn';
  if (existsSync(join(cwd, 'bun.lockb'))) return 'bun';
  return 'npm';
}

// Check for forbidden bypass flags
function checkForbiddenFlags(command) {
  const forbidden = [
    '--legacy-peer-deps',
    '--force',
    '--ignore-engines',
    '--ignore-scripts',
    '--shamefully-hoist',
    '--skip-integrity-check'
  ];

  for (const flag of forbidden) {
    if (command.includes(flag)) {
      return flag;
    }
  }
  return null;
}

// Main verification logic
async function verify(args) {
  const { cwd, port, timeout, skipInstall, skipBuild, open } = args;

  // Validate
  if (!cwd) {
    console.error('ERROR: --cwd is required');
    process.exit(1);
  }

  if (!existsSync(cwd)) {
    console.error(`ERROR: Directory does not exist: ${cwd}`);
    process.exit(1);
  }

  if (!existsSync(join(cwd, 'package.json'))) {
    console.error(`ERROR: No package.json found in ${cwd}`);
    process.exit(1);
  }

  // Setup logging
  const logDir = join(cwd, '.appfactory', 'logs');
  mkdirSync(logDir, { recursive: true });
  const logFile = join(logDir, 'local-run-proof.log');
  const certPath = join(cwd, '.appfactory', 'RUN_CERTIFICATE.json');
  const failPath = join(cwd, '.appfactory', 'RUN_FAILURE.json');

  const log = (msg) => {
    const line = `[${new Date().toISOString()}] ${msg}`;
    console.log(line);
    writeFileSync(logFile, line + '\n', { flag: 'a' });
  };

  // Clean old certificates
  if (existsSync(certPath)) unlinkSync(certPath);
  if (existsSync(failPath)) unlinkSync(failPath);

  writeFileSync(logFile, `=== Local Run Proof ===\nStarted: ${new Date().toISOString()}\nProject: ${cwd}\n\n`);

  const pm = detectPackageManager(cwd);
  log(`Package manager: ${pm}`);

  const url = `http://localhost:${port}`;
  let devHandle = null;

  try {
    // Step 1: Install dependencies
    if (!skipInstall) {
      log('Step 1: Installing dependencies...');
      const installCmd = `${pm} install`;

      const forbidden = checkForbiddenFlags(installCmd);
      if (forbidden) {
        throw new Error(`Forbidden flag detected: ${forbidden}`);
      }

      try {
        execSync(installCmd, { cwd, stdio: 'inherit' });
        log('Dependencies installed successfully');
      } catch (err) {
        throw new Error(`Install failed: ${err.message}`);
      }
    } else {
      log('Step 1: Skipped (--skip-install)');
    }

    // Step 2: Build (optional)
    if (!skipBuild) {
      log('Step 2: Building project...');
      try {
        execSync(`${pm} run build`, { cwd, stdio: 'inherit' });
        log('Build completed successfully');
      } catch (err) {
        // Build failure is non-fatal for dev server check
        log(`Build failed (non-fatal): ${err.message}`);
      }
    } else {
      log('Step 2: Skipped (--skip-build)');
    }

    // Step 3: Start dev server
    log('Step 3: Starting dev server...');
    const devLogFile = join(logDir, 'devserver.log');

    devHandle = startProcess({
      command: pm,
      args: ['run', 'dev'],
      cwd,
      logFile: devLogFile,
      env: { PORT: port.toString() }
    });

    log(`Dev server started (PID: ${devHandle.pid})`);

    // Step 4: Wait for HTTP 200
    log(`Step 4: Waiting for ${url} to return HTTP 200...`);

    const result = await waitForReady({
      url,
      processHandle: devHandle,
      timeout,
      interval: 1000,
      onProgress: ({ type, attempts, _status, _error }) => {
        if (type === 'poll' && attempts % 5 === 0) {
          log(`Still waiting... (attempt ${attempts})`);
        }
      }
    });

    // Step 5: Clean up and write result
    log('Step 5: Shutting down dev server...');
    await killProcess(devHandle, 2000);

    if (result.ok) {
      // SUCCESS
      const cert = {
        status: 'PASS',
        timestamp: new Date().toISOString(),
        project: cwd,
        url,
        port,
        attempts: result.attempts,
        logFile: devLogFile
      };
      writeFileSync(certPath, JSON.stringify(cert, null, 2));

      log('=== LOCAL RUN PROOF: PASS ===');
      console.log(`\nRUN_CERTIFICATE: ${certPath}`);
      console.log(`Project: ${cwd}`);
      console.log(`URL: ${url}`);

      // Open browser if requested
      if (open) {
        log('Opening browser...');
        const { opened, error } = await openBrowser(url);
        if (!opened) {
          log(`Browser open failed (non-fatal): ${error}`);
        }
      }

      return { success: true, certPath };
    } else {
      // FAILURE
      throw new Error(result.error);
    }
  } catch (err) {
    // Clean up on error
    if (devHandle && !devHandle.exited) {
      await killProcess(devHandle, 1000);
    }

    const failure = {
      status: 'FAIL',
      timestamp: new Date().toISOString(),
      project: cwd,
      error: err.message,
      logFile,
      lastOutput: devHandle?.output?.slice(-2000) || ''
    };
    writeFileSync(failPath, JSON.stringify(failure, null, 2));

    log(`=== LOCAL RUN PROOF: FAIL ===`);
    log(`Error: ${err.message}`);
    console.log(`\nRUN_FAILURE: ${failPath}`);

    return { success: false, failPath, error: err.message };
  }
}

// CLI entry point
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = parseArgs(process.argv.slice(2));
  verify(args).then(result => {
    process.exit(result.success ? 0 : 1);
  });
}

export { verify, parseArgs, detectPackageManager };
