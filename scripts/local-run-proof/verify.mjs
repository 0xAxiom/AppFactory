#!/usr/bin/env node
/**
 * Local Run Proof - Verification Harness
 *
 * Non-bypassable verification gate that ensures generated projects
 * can actually be installed, built, and run locally.
 *
 * Usage:
 *   node scripts/local-run-proof/verify.mjs \
 *     --cwd <path> \
 *     --install "npm install" \
 *     --build "npm run build" \
 *     --dev "npm run dev" \
 *     --url "http://localhost:3000/"
 *
 * @module scripts/local-run-proof/verify
 */

import { existsSync, writeFileSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { platform, arch, release } from 'node:os';

import {
  validateUrl,
  validateInstallCommand,
  expandUrlPort,
  detectPackageManager,
  hashFile,
  getGitCommit,
  redactLogs,
  runCommand,
  startDevServer,
  killProcessTree,
  pollHealthCheck,
  isHeadless,
  openBrowser,
  cleanBuildArtifacts,
  extractPort,
  timestamp,
  CLEAN_FILES,
} from './lib.mjs';

import { checkSolanaCompat, fixSolanaCompat } from './solana-compat.mjs';

// ============================================================================
// Version
// ============================================================================

const VERSION = '1.0.0';

// ============================================================================
// CLI Argument Parsing
// ============================================================================

function parseCliArgs() {
  const { values } = parseArgs({
    options: {
      cwd: { type: 'string' },
      install: { type: 'string' },
      build: { type: 'string' },
      dev: { type: 'string' },
      url: { type: 'string' },
      port: { type: 'string', default: 'auto' },
      timeout_ms: { type: 'string', default: '90000' },
      open_browser: { type: 'string', default: 'true' },
      health_path: { type: 'string', default: '/' },
      lockfile_policy: { type: 'string', default: 'clean' },
      artifacts_dir: { type: 'string', default: '.' },
      log_lines: { type: 'string', default: '200' },
      fix_solana: { type: 'boolean' },
      help: { type: 'boolean', short: 'h' },
      version: { type: 'boolean', short: 'v' },
    },
    strict: true,
  });

  return values;
}

function showHelp() {
  console.log(`
Local Run Proof - Verification Harness v${VERSION}

Ensures generated projects can be installed, built, and run locally.

USAGE:
  node scripts/local-run-proof/verify.mjs [OPTIONS]

REQUIRED OPTIONS:
  --cwd <path>              Target project directory
  --install "<command>"     Install command (e.g., "npm install")

OPTIONAL OPTIONS:
  --build "<command>"       Build command (e.g., "npm run build")
  --dev "<command>"         Dev server command (required for boot check)
  --url "<url>"             Health check URL (required for boot check)
  --port <port|auto>        Port number or "auto" (default: auto)
  --timeout_ms <int>        Health check timeout in ms (default: 90000)
  --open_browser <bool>     Auto-open browser on success (default: true)
  --health_path <path>      Health check path (default: "/")
  --lockfile_policy <str>   "clean" or "keep" (default: clean)
  --artifacts_dir <name>    Artifact output directory (default: ".")
  --log_lines <int>         Log lines to capture (default: 200)
  --fix_solana              Auto-fix Solana dependency conflicts
  -h, --help                Show this help
  -v, --version             Show version

EXAMPLES:
  # Full verification with boot check
  node scripts/local-run-proof/verify.mjs \\
    --cwd ./my-app \\
    --install "npm install" \\
    --build "npm run build" \\
    --dev "npm run dev" \\
    --url "http://localhost:3000/"

  # Install-only verification
  node scripts/local-run-proof/verify.mjs \\
    --cwd ./my-app \\
    --install "npm install"

OUTPUT:
  On PASS: Writes RUN_CERTIFICATE.json to artifacts directory
  On FAIL: Writes RUN_FAILURE.json to artifacts directory

SAFETY:
  - ONLY allows localhost URLs (http://localhost or http://127.0.0.1)
  - FAILS if install command contains --legacy-peer-deps, --force, --ignore-engines
  - ALWAYS cleans up dev server processes
  - NEVER opens browser in CI/headless environments
`);
}

// ============================================================================
// Main Verification Flow
// ============================================================================

async function verify(options) {
  const startTime = Date.now();
  const logs = {
    install: [],
    build: [],
    dev: [],
  };

  // Track dev server for cleanup
  let devServerProc = null;
  let devServerPid = null;

  // Cleanup handler
  const cleanup = () => {
    if (devServerPid) {
      console.log('\n[cleanup] Shutting down dev server...');
      killProcessTree(devServerPid);
      devServerPid = null;
    }
  };

  // Register cleanup handlers
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('exit', cleanup);
  process.on('uncaughtException', (err) => {
    console.error('[error] Uncaught exception:', err);
    cleanup();
    process.exit(1);
  });

  try {
    // ========================================================================
    // Step 1: Precheck
    // ========================================================================
    console.log('\n' + '='.repeat(60));
    console.log('  LOCAL RUN PROOF VERIFICATION');
    console.log('  Version:', VERSION);
    console.log('='.repeat(60) + '\n');

    console.log('[precheck] Validating arguments...');

    // Validate cwd
    if (!options.cwd) {
      return fail('precheck', 'Missing required argument: --cwd', options, logs, startTime);
    }

    const cwd = resolve(options.cwd);
    if (!existsSync(cwd)) {
      return fail('precheck', `Directory does not exist: ${cwd}`, options, logs, startTime);
    }

    if (!existsSync(join(cwd, 'package.json'))) {
      return fail('precheck', `No package.json found in: ${cwd}`, options, logs, startTime);
    }

    // Validate install command
    if (!options.install) {
      return fail('precheck', 'Missing required argument: --install', options, logs, startTime);
    }

    const installValidation = validateInstallCommand(options.install);
    if (!installValidation.valid) {
      return fail(
        'precheck',
        `Forbidden install flag detected: ${installValidation.forbidden}\n` +
          'Clean installs must not use bypass flags like --legacy-peer-deps, --force, or --ignore-engines.',
        options,
        logs,
        startTime,
        'Remove the forbidden flag and fix the underlying dependency conflict.'
      );
    }

    // Check for Solana dependency compatibility issues
    console.log('[precheck] Checking Solana dependency compatibility...');
    const solanaCheck = checkSolanaCompat(cwd);

    if (solanaCheck.hasIssue) {
      console.log(`[precheck] Solana compatibility issue detected: ${solanaCheck.details.message}`);
      console.log(`[precheck] @solana/web3.js version: ${solanaCheck.details.web3Version}`);
      console.log(`[precheck] Wallet adapter packages: ${solanaCheck.details.walletAdapterPackages.join(', ')}`);

      if (options.fix_solana) {
        console.log('[precheck] Applying Solana compatibility fix...');
        const fixResult = fixSolanaCompat(cwd, false);
        if (fixResult.fixed) {
          console.log(`[precheck] Fixed: ${fixResult.changes.package} ${fixResult.changes.from} -> ${fixResult.changes.to}`);
        }
      } else {
        return fail(
          'precheck',
          `Solana dependency conflict: ${solanaCheck.details.message}`,
          options,
          logs,
          startTime,
          `${solanaCheck.details.recommendation}. Run with --fix_solana to auto-fix.`
        );
      }
    } else {
      console.log('[precheck] Solana dependencies: compatible (or not present)');
    }

    // Validate URL if provided
    const hasBootCheck = options.dev && options.url;
    let healthUrl = options.url;

    if (hasBootCheck) {
      const urlValidation = validateUrl(options.url);
      if (!urlValidation.valid) {
        return fail(
          'precheck',
          `Invalid URL: ${urlValidation.error}`,
          options,
          logs,
          startTime,
          'Use http://localhost:<port>/ or http://127.0.0.1:<port>/'
        );
      }
    }

    const timeoutMs = parseInt(options.timeout_ms, 10) || 90000;
    const logLines = parseInt(options.log_lines, 10) || 200;
    const lockfilePolicy = options.lockfile_policy || 'clean';
    const artifactsDir = options.artifacts_dir === '.' ? cwd : join(cwd, options.artifacts_dir);

    console.log(`[precheck] Target directory: ${cwd}`);
    console.log(`[precheck] Install command: ${options.install}`);
    if (options.build) console.log(`[precheck] Build command: ${options.build}`);
    if (hasBootCheck) {
      console.log(`[precheck] Dev command: ${options.dev}`);
      console.log(`[precheck] Health URL: ${healthUrl}`);
    }
    console.log(`[precheck] Lockfile policy: ${lockfilePolicy}`);
    console.log(`[precheck] Timeout: ${timeoutMs}ms`);
    console.log('[precheck] PASS\n');

    // ========================================================================
    // Step 2: Clean (if policy = clean)
    // ========================================================================
    if (lockfilePolicy === 'clean') {
      console.log('[clean] Removing build artifacts for deterministic install...');
      cleanBuildArtifacts(cwd, CLEAN_FILES);
      console.log('[clean] PASS\n');
    } else {
      console.log('[clean] Skipped (lockfile_policy=keep)\n');
    }

    // ========================================================================
    // Step 3: Install
    // ========================================================================
    console.log('[install] Running install command...');
    console.log(`[install] $ ${options.install}`);

    const installResult = await runCommand(options.install, {
      cwd,
      timeout: timeoutMs,
    });

    logs.install = [...installResult.stdout, ...installResult.stderr];

    if (installResult.code !== 0) {
      // Extract error summary
      const allOutput = logs.install.join('\n');
      let errorSummary = 'Install command failed';
      let remediation = 'Check the install logs for errors';

      // Detect common errors
      if (allOutput.includes('ERESOLVE') || allOutput.includes('peer dep')) {
        errorSummary = 'Peer dependency conflict detected';
        remediation =
          'Fix the dependency versions in package.json. DO NOT use --legacy-peer-deps as a workaround.';
      } else if (allOutput.includes('ENOENT')) {
        errorSummary = 'Missing file or directory';
        remediation = 'Ensure all required files exist in the project';
      } else if (allOutput.includes('EACCES') || allOutput.includes('permission')) {
        errorSummary = 'Permission denied';
        remediation = 'Check file/directory permissions';
      }

      return fail(
        'install',
        errorSummary,
        options,
        logs,
        startTime,
        remediation,
        installResult.code
      );
    }

    console.log(`[install] Completed in ${installResult.duration}ms`);
    console.log('[install] PASS\n');

    // ========================================================================
    // Step 4: Build (optional)
    // ========================================================================
    if (options.build) {
      console.log('[build] Running build command...');
      console.log(`[build] $ ${options.build}`);

      const buildResult = await runCommand(options.build, {
        cwd,
        timeout: timeoutMs,
      });

      logs.build = [...buildResult.stdout, ...buildResult.stderr];

      if (buildResult.code !== 0) {
        const allOutput = logs.build.join('\n');
        let errorSummary = 'Build command failed';
        let remediation = 'Check the build logs for errors';

        if (allOutput.includes('TypeScript') || allOutput.includes('type error')) {
          errorSummary = 'TypeScript compilation failed';
          remediation = 'Fix the TypeScript errors shown in the build output';
        } else if (allOutput.includes('Module not found') || allOutput.includes("Cannot find module")) {
          errorSummary = 'Missing module or import error';
          remediation = 'Ensure all imports are correct and dependencies are installed';
        }

        return fail(
          'build',
          errorSummary,
          options,
          logs,
          startTime,
          remediation,
          buildResult.code
        );
      }

      console.log(`[build] Completed in ${buildResult.duration}ms`);
      console.log('[build] PASS\n');
    }

    // ========================================================================
    // Step 5: Boot Check (optional)
    // ========================================================================
    if (hasBootCheck) {
      console.log('[boot] Starting dev server...');
      console.log(`[boot] $ ${options.dev}`);

      // Determine port
      let port = extractPort(healthUrl);
      if (options.port && options.port !== 'auto') {
        port = parseInt(options.port, 10);
      }

      // Expand URL with port
      healthUrl = expandUrlPort(healthUrl, port);
      const healthPath = options.health_path || '/';
      const fullHealthUrl = healthUrl.endsWith('/')
        ? healthUrl.slice(0, -1) + healthPath
        : healthUrl + healthPath;

      // Start dev server with PORT env var
      const devServer = startDevServer(options.dev, {
        cwd,
        env: { PORT: String(port) },
        onStdout: (lines) => {
          lines.forEach((line) => {
            if (line.includes('ready') || line.includes('localhost') || line.includes('started')) {
              console.log(`[boot] ${line}`);
            }
          });
        },
      });

      devServerProc = devServer.proc;
      devServerPid = devServer.proc.pid;
      logs.dev = devServer.stdout;

      console.log(`[boot] Server PID: ${devServerPid}`);
      console.log(`[boot] Waiting for ${fullHealthUrl} to respond...`);

      // Poll health check
      const healthResult = await pollHealthCheck(fullHealthUrl, timeoutMs, 1000);
      logs.dev = [...devServer.stdout, ...devServer.stderr];

      if (!healthResult.ok) {
        return fail(
          'healthcheck',
          `Health check failed: ${healthResult.error || 'No response'}`,
          options,
          logs,
          startTime,
          'Ensure the dev server starts correctly and responds on the specified URL',
          null
        );
      }

      console.log(`[boot] Health check passed after ${healthResult.attempts} attempts`);
      console.log(`[boot] Response time: ${healthResult.responseTime}ms`);
      console.log('[boot] PASS\n');

      // ======================================================================
      // Step 6: Open Browser (if enabled and not CI)
      // ======================================================================
      const shouldOpenBrowser =
        options.open_browser !== 'false' && !isHeadless();

      if (shouldOpenBrowser) {
        console.log('[browser] Opening in default browser...');
        const browserResult = await openBrowser(fullHealthUrl);
        if (browserResult.opened) {
          console.log('[browser] PASS\n');
        } else {
          console.log(`[browser] Warning: Could not open browser: ${browserResult.error}`);
          console.log('[browser] SKIPPED (non-fatal)\n');
        }
      } else {
        console.log('[browser] Skipped (CI/headless environment or --open_browser=false)\n');
      }

      // ======================================================================
      // Step 7: Shutdown
      // ======================================================================
      console.log('[shutdown] Stopping dev server...');
      cleanup();
      console.log('[shutdown] PASS\n');
    }

    // ========================================================================
    // Success: Write Certificate
    // ========================================================================
    const endTime = Date.now();
    const packageManager = detectPackageManager(cwd);

    const certificate = {
      status: 'PASS',
      version: VERSION,
      timestamps: {
        start: new Date(startTime).toISOString(),
        end: new Date(endTime).toISOString(),
        duration_ms: endTime - startTime,
      },
      environment: {
        os: platform(),
        platform: platform(),
        arch: arch(),
        os_release: release(),
        node_version: process.version,
        package_manager: packageManager,
      },
      commands: {
        install: {
          command: options.install,
          exit_code: 0,
        },
        ...(options.build && {
          build: {
            command: options.build,
            exit_code: 0,
          },
        }),
        ...(options.dev && {
          dev: {
            command: options.dev,
            exit_code: null, // Server was running
          },
        }),
      },
      ...(hasBootCheck && {
        healthcheck: {
          url: healthUrl,
          port: extractPort(healthUrl),
          status_code: 200,
        },
      }),
      hashes: {
        package_json_sha256: hashFile(join(cwd, 'package.json')),
        lockfile_sha256:
          hashFile(join(cwd, 'package-lock.json')) ||
          hashFile(join(cwd, 'yarn.lock')) ||
          hashFile(join(cwd, 'pnpm-lock.yaml')) ||
          hashFile(join(cwd, 'bun.lockb')),
        git_commit: getGitCommit(cwd),
      },
      logs: {
        install: redactLogs(logs.install, logLines),
        ...(logs.build.length > 0 && { build: redactLogs(logs.build, logLines) }),
        ...(logs.dev.length > 0 && { dev: redactLogs(logs.dev, logLines) }),
      },
    };

    const certPath = join(artifactsDir, 'RUN_CERTIFICATE.json');
    writeFileSync(certPath, JSON.stringify(certificate, null, 2));

    console.log('='.repeat(60));
    console.log('  VERIFICATION PASSED');
    console.log('='.repeat(60));
    console.log(`\n  Certificate: ${certPath}`);
    console.log(`  Duration: ${endTime - startTime}ms\n`);

    // Remove any existing failure artifact
    const failPath = join(artifactsDir, 'RUN_FAILURE.json');
    if (existsSync(failPath)) {
      try {
        const { unlinkSync } = await import('node:fs');
        unlinkSync(failPath);
      } catch {
        // Ignore
      }
    }

    return { success: true, certificate };

  } catch (err) {
    console.error('\n[error] Unexpected error:', err.message);
    cleanup();
    return fail(
      'unexpected',
      err.message,
      options,
      logs,
      startTime,
      'An unexpected error occurred. Check the logs for details.',
      1
    );
  } finally {
    cleanup();
  }
}

// ============================================================================
// Failure Handler
// ============================================================================

function fail(step, errorSummary, options, logs, startTime, remediation = null, exitCode = 1) {
  const endTime = Date.now();
  const cwd = options.cwd ? resolve(options.cwd) : process.cwd();
  const artifactsDir = options.artifacts_dir === '.' ? cwd : join(cwd, options.artifacts_dir);
  const logLines = parseInt(options.log_lines, 10) || 200;

  const failure = {
    status: 'FAIL',
    version: VERSION,
    step_failed: step,
    error_summary: errorSummary,
    exit_code: exitCode,
    remediation_hint: remediation || 'Check the logs for more details',
    timestamps: {
      start: new Date(startTime).toISOString(),
      end: new Date(endTime).toISOString(),
      duration_ms: endTime - startTime,
    },
    environment: {
      os: platform(),
      platform: platform(),
      arch: arch(),
      os_release: release(),
      node_version: process.version,
      package_manager: existsSync(join(cwd, 'package.json')) ? detectPackageManager(cwd) : 'unknown',
    },
    commands: {
      ...(options.install && { install: { command: options.install, exit_code: exitCode } }),
      ...(options.build && { build: { command: options.build } }),
      ...(options.dev && { dev: { command: options.dev } }),
    },
    logs: {
      ...(logs.install.length > 0 && { install: redactLogs(logs.install, logLines) }),
      ...(logs.build.length > 0 && { build: redactLogs(logs.build, logLines) }),
      ...(logs.dev.length > 0 && { dev: redactLogs(logs.dev, logLines) }),
    },
  };

  try {
    const failPath = join(artifactsDir, 'RUN_FAILURE.json');
    writeFileSync(failPath, JSON.stringify(failure, null, 2));

    console.log('\n' + '='.repeat(60));
    console.log('  VERIFICATION FAILED');
    console.log('='.repeat(60));
    console.log(`\n  Step: ${step}`);
    console.log(`  Error: ${errorSummary}`);
    if (remediation) {
      console.log(`\n  Remediation: ${remediation}`);
    }
    console.log(`\n  Failure report: ${failPath}\n`);
  } catch (writeErr) {
    console.error('[error] Could not write failure artifact:', writeErr.message);
  }

  return { success: false, failure };
}

// ============================================================================
// Main Entry Point
// ============================================================================

async function main() {
  const args = parseCliArgs();

  if (args.help) {
    showHelp();
    process.exit(0);
  }

  if (args.version) {
    console.log(`Local Run Proof v${VERSION}`);
    process.exit(0);
  }

  const result = await verify(args);
  process.exit(result.success ? 0 : 1);
}

main().catch((err) => {
  console.error('[fatal]', err);
  process.exit(1);
});
