#!/usr/bin/env node
/**
 * Build Orchestrator for App Factory
 *
 * Unified build experience that integrates:
 * - Visual feedback (spinners, progress, celebrations)
 * - Local Run Proof verification
 * - Smart preview launching
 *
 * Usage:
 *   node scripts/build-orchestrator.mjs \
 *     --cwd <path> \
 *     --pipeline <app|dapp|agent|plugin|miniapp> \
 *     [--skip-verify] \
 *     [--skip-preview]
 *
 * @module scripts/build-orchestrator
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { parseArgs } from 'node:util';
import { spawn, execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import visual feedback module
let visual;
try {
  visual = await import(join(__dirname, 'lib', 'visual.mjs'));
} catch {
  // Minimal fallback
  visual = {
    Spinner: class {
      constructor(msg) { this.msg = msg; }
      start() { console.log(`[...] ${this.msg}`); return this; }
      succeed(msg) { console.log(`[OK] ${msg || this.msg}`); return this; }
      fail(msg) { console.log(`[FAIL] ${msg || this.msg}`); return this; }
      stop() { return this; }
      update(msg) { this.msg = msg; return this; }
    },
    banner: () => console.log('\n=== App Factory ===\n'),
    phaseHeader: (name, num, total) => console.log(`\n--- Phase ${num}/${total}: ${name} ---\n`),
    celebrate: (title, stats) => {
      console.log(`\n[SUCCESS] ${title}`);
      if (stats) Object.entries(stats).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
    },
    errorBox: (title, details) => {
      console.log(`\n[ERROR] ${title}`);
      if (details.message) console.log(`  ${details.message}`);
      if (details.remediation) console.log(`  Fix: ${details.remediation}`);
    },
    summaryTable: (title, rows) => {
      console.log(`\n${title}`);
      rows.forEach((r) => console.log(`  ${r.label}: ${r.value}`));
    },
    log: (msg, type) => console.log(`[${type}] ${msg}`),
    formatDuration: (ms) => `${Math.round(ms / 1000)}s`,
    COLORS: { reset: '', cyan: '', green: '', yellow: '', red: '', dim: '', bold: '' },
    SYMBOLS: { check: '+', cross: 'x', arrow: '->', bullet: '*' },
  };
}

const {
  Spinner,
  banner,
  phaseHeader,
  celebrate,
  errorBox,
  summaryTable,
  log,
  formatDuration,
  COLORS,
  SYMBOLS,
} = visual;

// ============================================================================
// Configuration
// ============================================================================

const VERSION = '1.0.0';

const PIPELINE_CONFIGS = {
  app: {
    name: 'Mobile App',
    buildDir: 'app-factory/builds',
    install: 'npm install',
    build: 'npx expo export',
    dev: 'npx expo start --web',
    port: 19006,
    framework: 'Expo',
  },
  dapp: {
    name: 'dApp',
    buildDir: 'dapp-factory/dapp-builds',
    install: 'npm install',
    build: 'npm run build',
    dev: 'npm run dev',
    port: 3000,
    framework: 'Next.js',
  },
  agent: {
    name: 'AI Agent',
    buildDir: 'agent-factory/outputs',
    install: 'npm install',
    build: 'npm run build',
    dev: 'npm start',
    port: 3000,
    framework: 'Node.js',
  },
  plugin: {
    name: 'Claude Plugin',
    buildDir: 'plugin-factory/builds',
    install: 'npm install',
    build: 'npm run build',
    dev: null, // Plugins don't have a dev server
    port: null,
    framework: 'MCP',
  },
  miniapp: {
    name: 'Base Mini App',
    buildDir: 'miniapp-pipeline/builds/miniapps',
    install: 'npm install',
    build: 'npm run build',
    dev: 'npm run dev',
    port: 3000,
    framework: 'MiniKit + Next.js',
  },
};

// ============================================================================
// CLI Argument Parsing
// ============================================================================

function parseCliArgs() {
  const { values, positionals } = parseArgs({
    options: {
      cwd: { type: 'string' },
      pipeline: { type: 'string', short: 'p' },
      'skip-verify': { type: 'boolean' },
      'skip-preview': { type: 'boolean' },
      'open-browser': { type: 'boolean', default: true },
      verbose: { type: 'boolean', short: 'v' },
      help: { type: 'boolean', short: 'h' },
    },
    allowPositionals: true,
    strict: false,
  });

  // Allow positional as cwd
  if (positionals.length > 0 && !values.cwd) {
    values.cwd = positionals[0];
  }

  return values;
}

function showHelp() {
  console.log(`
Build Orchestrator v${VERSION}

Unified build experience for App Factory pipelines.

USAGE:
  node scripts/build-orchestrator.mjs [OPTIONS] [path]

OPTIONS:
  --cwd <path>        Target project directory
  -p, --pipeline <p>  Pipeline type (app|dapp|agent|plugin|miniapp)
  --skip-verify       Skip Local Run Proof verification
  --skip-preview      Skip auto-preview launch
  --open-browser      Open browser on success (default: true)
  -v, --verbose       Verbose output
  -h, --help          Show this help

EXAMPLES:
  # Build and verify a mobile app
  node scripts/build-orchestrator.mjs --cwd ./my-app -p app

  # Build a dApp without preview
  node scripts/build-orchestrator.mjs ./my-dapp -p dapp --skip-preview

  # Verify only (no build)
  node scripts/build-orchestrator.mjs ./my-app -p app
`);
}

// ============================================================================
// Pipeline Detection
// ============================================================================

function detectPipeline(cwd) {
  const packageJsonPath = join(cwd, 'package.json');
  if (!existsSync(packageJsonPath)) {
    return null;
  }

  try {
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    // Detect by dependencies
    if (deps['expo'] || deps['react-native']) return 'app';
    if (deps['@worldcoin/minikit-js']) return 'miniapp';
    if (deps['next'] && (deps['@solana/web3.js'] || deps['wagmi'] || deps['viem'])) return 'dapp';
    if (deps['next']) return 'dapp';
    if (deps['@modelcontextprotocol/sdk']) return 'plugin';
    if (deps['openai'] || deps['anthropic'] || deps['@anthropic-ai/sdk']) return 'agent';

    // Detect by directory structure
    if (cwd.includes('app-factory')) return 'app';
    if (cwd.includes('dapp-factory')) return 'dapp';
    if (cwd.includes('agent-factory')) return 'agent';
    if (cwd.includes('plugin-factory')) return 'plugin';
    if (cwd.includes('miniapp-pipeline')) return 'miniapp';

    return null;
  } catch {
    return null;
  }
}

// ============================================================================
// Command Execution
// ============================================================================

function runCommand(cmd, options = {}) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const [command, ...args] = cmd.split(' ');

    const proc = spawn(command, args, {
      cwd: options.cwd,
      shell: true,
      stdio: options.verbose ? 'inherit' : 'pipe',
      env: { ...process.env, ...options.env, FORCE_COLOR: '1' },
    });

    const stdout = [];
    const stderr = [];

    if (!options.verbose && proc.stdout) {
      proc.stdout.on('data', (data) => stdout.push(data.toString()));
    }
    if (!options.verbose && proc.stderr) {
      proc.stderr.on('data', (data) => stderr.push(data.toString()));
    }

    proc.on('close', (code) => {
      resolve({
        code,
        stdout: stdout.join(''),
        stderr: stderr.join(''),
        duration: Date.now() - startTime,
      });
    });

    proc.on('error', (err) => {
      resolve({
        code: 1,
        stdout: '',
        stderr: err.message,
        duration: Date.now() - startTime,
      });
    });
  });
}

// ============================================================================
// Local Run Proof Integration
// ============================================================================

async function runLocalRunProof(cwd, config, options) {
  const verifyScript = join(__dirname, 'local-run-proof', 'verify.mjs');

  if (!existsSync(verifyScript)) {
    log('Local Run Proof not found, skipping verification', 'warning');
    return { success: true, skipped: true };
  }

  const args = [
    'node',
    verifyScript,
    `--cwd "${cwd}"`,
    `--install "${config.install}"`,
  ];

  if (config.build) {
    args.push(`--build "${config.build}"`);
  }

  if (config.dev && config.port) {
    args.push(`--dev "${config.dev}"`);
    args.push(`--url "http://localhost:${config.port}/"`);
  }

  if (options.openBrowser === false) {
    args.push('--open_browser=false');
  }

  const cmd = args.join(' ');
  log(`Running: ${cmd}`, 'step');

  const result = await runCommand(cmd, {
    cwd: process.cwd(),
    verbose: options.verbose,
  });

  // Check for certificate
  const certPath = join(cwd, 'RUN_CERTIFICATE.json');
  const failPath = join(cwd, 'RUN_FAILURE.json');

  if (existsSync(certPath)) {
    try {
      const cert = JSON.parse(readFileSync(certPath, 'utf-8'));
      return { success: true, certificate: cert };
    } catch {
      return { success: result.code === 0 };
    }
  }

  if (existsSync(failPath)) {
    try {
      const failure = JSON.parse(readFileSync(failPath, 'utf-8'));
      return { success: false, failure };
    } catch {
      return { success: false };
    }
  }

  return { success: result.code === 0 };
}

// ============================================================================
// Main Build Flow
// ============================================================================

async function build(options) {
  const startTime = Date.now();
  const cwd = resolve(options.cwd || '.');

  // Show banner
  banner('Build Orchestrator');

  // Validate directory
  if (!existsSync(cwd)) {
    errorBox('Directory Not Found', {
      message: `Path does not exist: ${cwd}`,
      remediation: 'Provide a valid project directory with --cwd',
    });
    return { success: false };
  }

  if (!existsSync(join(cwd, 'package.json'))) {
    errorBox('Not a Node.js Project', {
      message: `No package.json found in: ${cwd}`,
      remediation: 'Ensure the directory contains a valid Node.js project',
    });
    return { success: false };
  }

  // Detect or use provided pipeline
  let pipeline = options.pipeline;
  if (!pipeline) {
    pipeline = detectPipeline(cwd);
    if (pipeline) {
      log(`Auto-detected pipeline: ${pipeline}`, 'info');
    }
  }

  if (!pipeline || !PIPELINE_CONFIGS[pipeline]) {
    errorBox('Unknown Pipeline', {
      message: pipeline ? `Unknown pipeline: ${pipeline}` : 'Could not detect pipeline type',
      remediation: 'Use --pipeline to specify: app, dapp, agent, plugin, or miniapp',
    });
    return { success: false };
  }

  const config = PIPELINE_CONFIGS[pipeline];
  const projectName = basename(cwd);

  // Show configuration
  console.log('');
  log(`Project: ${projectName}`, 'info');
  log(`Pipeline: ${config.name} (${config.framework})`, 'info');
  log(`Directory: ${cwd}`, 'info');
  console.log('');

  const totalPhases = options.skipVerify ? 2 : 3;
  let currentPhase = 0;

  // ========================================================================
  // Phase 1: Install Dependencies
  // ========================================================================
  currentPhase++;
  phaseHeader('Install Dependencies', currentPhase, totalPhases);

  const installSpinner = new Spinner('Installing dependencies...').start();
  const installResult = await runCommand(config.install, {
    cwd,
    verbose: options.verbose,
  });

  if (installResult.code !== 0) {
    installSpinner.fail('Dependency installation failed');
    errorBox('Install Failed', {
      message: installResult.stderr.slice(0, 500),
      remediation: 'Check package.json for dependency conflicts',
    });
    return { success: false, phase: 'install' };
  }

  installSpinner.succeed(`Dependencies installed (${formatDuration(installResult.duration)})`);

  // ========================================================================
  // Phase 2: Build
  // ========================================================================
  currentPhase++;
  phaseHeader('Build', currentPhase, totalPhases);

  if (config.build) {
    const buildSpinner = new Spinner(`Building ${config.name}...`).start();
    const buildResult = await runCommand(config.build, {
      cwd,
      verbose: options.verbose,
    });

    if (buildResult.code !== 0) {
      buildSpinner.fail('Build failed');
      errorBox('Build Failed', {
        message: buildResult.stderr.slice(0, 500),
        remediation: 'Check the build output for errors',
      });
      return { success: false, phase: 'build' };
    }

    buildSpinner.succeed(`Build complete (${formatDuration(buildResult.duration)})`);
  } else {
    log('No build step for this pipeline', 'info');
  }

  // ========================================================================
  // Phase 3: Verification (Local Run Proof)
  // ========================================================================
  if (!options.skipVerify) {
    currentPhase++;
    phaseHeader('Verification', currentPhase, totalPhases);

    const verifySpinner = new Spinner('Running Local Run Proof verification...').start();
    const verifyResult = await runLocalRunProof(cwd, config, options);

    if (verifyResult.skipped) {
      verifySpinner.succeed('Verification skipped (harness not found)');
    } else if (verifyResult.success) {
      verifySpinner.succeed('Verification passed');

      if (verifyResult.certificate) {
        log(`Certificate: ${join(cwd, 'RUN_CERTIFICATE.json')}`, 'success');
      }
    } else {
      verifySpinner.fail('Verification failed');

      if (verifyResult.failure) {
        errorBox('Verification Failed', {
          message: verifyResult.failure.error_summary,
          remediation: verifyResult.failure.remediation_hint,
        });
      }

      return { success: false, phase: 'verify' };
    }
  }

  // ========================================================================
  // Success
  // ========================================================================
  const endTime = Date.now();
  const duration = endTime - startTime;

  celebrate(`${config.name} Build Complete!`, {
    Project: projectName,
    Pipeline: config.name,
    Framework: config.framework,
    Duration: formatDuration(duration),
    Verified: options.skipVerify ? 'Skipped' : 'Passed',
  });

  // Show run instructions
  if (config.dev && !options.skipPreview) {
    console.log('');
    log(`To run locally:`, 'step');
    console.log(`${COLORS.dim}  cd ${cwd}${COLORS.reset}`);
    console.log(`${COLORS.dim}  ${config.dev}${COLORS.reset}`);
    if (config.port) {
      console.log(`${COLORS.dim}  ${SYMBOLS.arrow} Opens at http://localhost:${config.port}${COLORS.reset}`);
    }
    console.log('');
  }

  return {
    success: true,
    duration,
    project: projectName,
    pipeline: config.name,
  };
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

  const result = await build({
    cwd: args.cwd,
    pipeline: args.pipeline,
    skipVerify: args['skip-verify'],
    skipPreview: args['skip-preview'],
    openBrowser: args['open-browser'],
    verbose: args.verbose,
  });

  process.exit(result.success ? 0 : 1);
}

main().catch((err) => {
  console.error('[fatal]', err);
  process.exit(1);
});
