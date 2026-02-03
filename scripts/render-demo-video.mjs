#!/usr/bin/env node

/**
 * Render Demo Video Pipeline
 *
 * Renders a Remotion MP4 demo video for an AppFactory generated project.
 * Requires Local Run Proof to PASS before rendering.
 *
 * Usage:
 *   node scripts/render-demo-video.mjs --cwd <path> --slug <slug> [options]
 *
 * Required flags:
 *   --cwd <path>       Path to the generated app to verify and render
 *   --slug <string>    Slug for the output video filename
 *
 * Optional flags:
 *   --install <cmd>    Install command (default: "npm install")
 *   --build <cmd>      Build command (default: "npm run build")
 *   --dev <cmd>        Dev server command (default: "npm run dev")
 *   --url <url>        Health check URL (default: "http://localhost:{port}/")
 *   --title <string>   Video title (default: derived from slug)
 *   --highlights <json> JSON array of highlight strings
 *   --skip-verify      Skip Local Run Proof (only use if RUN_CERTIFICATE.json exists)
 */

import { spawn } from 'node:child_process';
import { existsSync, readFileSync, mkdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { platform } from 'node:os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================================
// Visual Feedback Module (dynamic import with fallback)
// ============================================================================

let visual = null;
try {
  visual = await import('./lib/visual.mjs');
} catch {
  // Fallback if visual module not available
  visual = {
    banner: () => {},
    Spinner: class {
      constructor(msg) { this.msg = msg; }
      start() { console.log(`⏳ ${this.msg}`); return this; }
      succeed(msg) { console.log(`✅ ${msg || this.msg}`); return this; }
      fail(msg) { console.log(`❌ ${msg || this.msg}`); return this; }
      update(msg) { this.msg = msg; return this; }
      stop() { return this; }
    },
    celebrate: (title, stats) => {
      console.log(`\n🎉 ${title}`);
      Object.entries(stats || {}).forEach(([k, v]) => console.log(`   ${k}: ${v}`));
    },
    errorBox: (title, details) => {
      console.error(`\n❌ ${title}`);
      if (details.message) console.error(`   ${details.message}`);
      if (details.remediation) console.error(`   Fix: ${details.remediation}`);
    },
    phaseHeader: (name, num, total) => console.log(`\n=== Phase ${num}/${total}: ${name} ===`),
    log: (msg, type) => console.log(`[${type || 'info'}] ${msg}`),
    formatDuration: (ms) => ms < 1000 ? `${ms}ms` : `${(ms/1000).toFixed(1)}s`,
  };
}

// ============================================================================
// Constants
// ============================================================================

const REPO_ROOT = resolve(__dirname, '..');
const DEMO_VIDEO_DIR = join(REPO_ROOT, 'demo-video');
const OUTPUT_DIR = join(REPO_ROOT, 'demo', 'out');
const VERIFY_SCRIPT = join(REPO_ROOT, 'scripts', 'local-run-proof', 'verify.mjs');

// ============================================================================
// Argument Parsing
// ============================================================================

function parseArgs(argv) {
  const args = {
    cwd: null,
    slug: null,
    install: 'npm install',
    build: 'npm run build',
    dev: 'npm run dev',
    url: 'http://localhost:{port}/',
    title: null,
    highlights: null,
    skipVerify: false,
  };

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    const next = argv[i + 1];

    switch (arg) {
      case '--cwd':
        args.cwd = next;
        i++;
        break;
      case '--slug':
        args.slug = next;
        i++;
        break;
      case '--install':
        args.install = next;
        i++;
        break;
      case '--build':
        args.build = next;
        i++;
        break;
      case '--dev':
        args.dev = next;
        i++;
        break;
      case '--url':
        args.url = next;
        i++;
        break;
      case '--title':
        args.title = next;
        i++;
        break;
      case '--highlights':
        try {
          args.highlights = JSON.parse(next);
        } catch {
          console.error('Error: --highlights must be valid JSON');
          process.exit(1);
        }
        i++;
        break;
      case '--skip-verify':
        args.skipVerify = true;
        break;
      case '--help':
        printHelp();
        process.exit(0);
        break;
    }
  }

  return args;
}

function printHelp() {
  console.log(`
Render Demo Video Pipeline

Usage:
  node scripts/render-demo-video.mjs --cwd <path> --slug <slug> [options]

Required flags:
  --cwd <path>        Path to the generated app to verify and render
  --slug <string>     Slug for the output video filename

Optional flags:
  --install <cmd>     Install command (default: "npm install")
  --build <cmd>       Build command (default: "npm run build")
  --dev <cmd>         Dev server command (default: "npm run dev")
  --url <url>         Health check URL (default: "http://localhost:{port}/")
  --title <string>    Video title (default: derived from slug)
  --highlights <json> JSON array of highlight strings
  --skip-verify       Skip Local Run Proof (only use if RUN_CERTIFICATE.json exists)
  --help              Show this help message

Output:
  demo/out/<slug>.mp4         Rendered video
  demo/out/<slug>.props.json  Props used for rendering
`);
}

function validateArgs(args) {
  const errors = [];

  if (!args.cwd) {
    errors.push('Missing required flag: --cwd');
  } else if (!existsSync(args.cwd)) {
    errors.push(`Directory does not exist: ${args.cwd}`);
  }

  if (!args.slug) {
    errors.push('Missing required flag: --slug');
  } else if (!/^[a-z0-9-]+$/.test(args.slug)) {
    errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
  }

  return errors;
}

// ============================================================================
// Process Execution
// ============================================================================

function runProcess(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    // R2 fix: On Windows, npm/npx are .cmd files that require shell execution
    // We use shell:true only on Windows for these specific commands
    const isWindows = platform() === 'win32';
    const needsShell = isWindows && ['npm', 'npx', 'node'].includes(command);

    const proc = spawn(command, args, {
      cwd: options.cwd,
      shell: needsShell,
      stdio: options.stdio || 'inherit',
      env: { ...process.env, ...options.env },
    });

    let stdout = '';
    let stderr = '';

    if (proc.stdout) {
      proc.stdout.on('data', (data) => {
        stdout += data.toString();
      });
    }

    if (proc.stderr) {
      proc.stderr.on('data', (data) => {
        stderr += data.toString();
      });
    }

    proc.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

// ============================================================================
// Local Run Proof Integration
// ============================================================================

async function runLocalRunProof(args) {
  console.log('\n=== Running Local Run Proof ===\n');

  const verifyArgs = [
    VERIFY_SCRIPT,
    '--cwd', resolve(args.cwd),
    '--install', args.install,
    '--dev', args.dev,
    '--url', args.url,
    '--open_browser', 'false', // Don't open browser during video render
  ];

  if (args.build) {
    verifyArgs.push('--build', args.build);
  }

  const result = await runProcess('node', verifyArgs, {
    cwd: REPO_ROOT,
    stdio: 'inherit',
  });

  return result.code === 0;
}

function readCertificate(cwd) {
  const certPath = join(cwd, 'RUN_CERTIFICATE.json');

  if (!existsSync(certPath)) {
    return null;
  }

  try {
    const content = readFileSync(certPath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

// ============================================================================
// Props Generation
// ============================================================================

function generateProps(args, certificate) {
  // ENFORCE: Certificate must exist and have PASS status (R1 fix)
  if (!certificate || certificate.status !== 'PASS') {
    throw new Error('generateProps() requires a valid RUN_CERTIFICATE with PASS status');
  }

  const title = args.title || formatTitle(args.slug);

  // Default highlights based on certificate
  let highlights = args.highlights;

  if (!highlights) {
    highlights = [
      'Clean install completed',
      'Build succeeded without errors',
      `Dev server healthy at port ${certificate.port || 3000}`,
      'All verification checks passed',
    ];

    // Add package manager info
    if (certificate.packageManager) {
      highlights.unshift(`Using ${certificate.packageManager}`);
    }
  }

  // Calculate certificate hash (R1 fix: certificate is guaranteed non-null above)
  const certHash = `sha256:${createHash('sha256').update(JSON.stringify(certificate)).digest('hex').slice(0, 16)}`;

  // R1 fix: Use direct access since certificate is guaranteed valid
  // R2 fix: Throw if timestamp missing instead of non-deterministic fallback
  const timestamp = certificate.timestamps?.end;
  if (!timestamp) {
    throw new Error('Certificate missing timestamps.end - cannot render deterministically. Re-run Local Run Proof.');
  }

  return {
    title,
    slug: args.slug,
    verifiedUrl: certificate.healthcheck?.url || certificate.finalUrl || `http://localhost:${certificate.healthcheck?.port || 3000}`,
    timestamp,
    highlights,
    certificateHash: certHash,
  };
}

function formatTitle(slug) {
  // Convert slug to title case
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ============================================================================
// Remotion Rendering
// ============================================================================

async function ensureDemoVideoDeps() {
  const nodeModulesPath = join(DEMO_VIDEO_DIR, 'node_modules');

  if (!existsSync(nodeModulesPath)) {
    console.log('\n=== Installing demo-video dependencies ===\n');

    const result = await runProcess('npm', ['install'], {
      cwd: DEMO_VIDEO_DIR,
      stdio: 'inherit',
    });

    if (result.code !== 0) {
      throw new Error('Failed to install demo-video dependencies');
    }
  }
}

async function renderVideo(props, outputPath) {
  console.log('\n=== Rendering Demo Video ===\n');

  // Ensure output directory exists
  mkdirSync(dirname(outputPath), { recursive: true });

  // Write props file
  const propsPath = outputPath.replace('.mp4', '.props.json');
  writeFileSync(propsPath, JSON.stringify(props, null, 2));
  console.log(`Props saved to: ${propsPath}`);

  // Run Remotion render
  const entryPoint = join(DEMO_VIDEO_DIR, 'src', 'index.ts');

  const result = await runProcess(
    'npx',
    [
      'remotion',
      'render',
      entryPoint,
      'AppFactoryDemo',
      outputPath,
      '--props', propsPath,
    ],
    {
      cwd: DEMO_VIDEO_DIR,
      stdio: 'inherit',
    }
  );

  if (result.code !== 0) {
    throw new Error('Remotion render failed');
  }

  return true;
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  const startTime = Date.now();

  // Show banner
  visual.banner('Demo Video Pipeline');

  // Parse and validate arguments
  const args = parseArgs(process.argv);
  const errors = validateArgs(args);

  if (errors.length > 0) {
    visual.errorBox('Validation Failed', {
      message: errors.join('\n'),
      remediation: 'Run with --help for usage information.',
    });
    process.exit(1);
  }

  const resolvedCwd = resolve(args.cwd);
  const outputPath = join(OUTPUT_DIR, `${args.slug}.mp4`);

  visual.log(`Project: ${resolvedCwd}`, 'info');
  visual.log(`Output: ${outputPath}`, 'info');

  // Step 1: Run Local Run Proof (unless skipped)
  visual.phaseHeader('Verification', 1, 3);
  let certificate = null;

  if (args.skipVerify) {
    visual.log('Using existing certificate (--skip-verify)', 'info');
    certificate = readCertificate(resolvedCwd);

    if (!certificate) {
      visual.errorBox('Certificate Missing', {
        message: '--skip-verify requires existing RUN_CERTIFICATE.json',
        remediation: 'Run without --skip-verify to generate a certificate.',
      });
      process.exit(1);
    }

    if (certificate.status !== 'PASS') {
      visual.errorBox('Certificate Invalid', {
        message: 'RUN_CERTIFICATE.json does not have PASS status',
        remediation: 'Fix the build issues and re-run verification.',
      });
      process.exit(1);
    }

    visual.log('Certificate validated with PASS status', 'success');
  } else {
    const verifySpinner = new visual.Spinner('Running Local Run Proof...').start();
    const passed = await runLocalRunProof(args);

    if (!passed) {
      verifySpinner.fail('Local Run Proof FAILED');
      visual.errorBox('Verification Failed', {
        message: 'Cannot render demo video without passing verification.',
        remediation: `Check RUN_FAILURE.json in ${resolvedCwd} for details.`,
      });
      process.exit(1);
    }

    certificate = readCertificate(resolvedCwd);

    if (!certificate || certificate.status !== 'PASS') {
      verifySpinner.fail('Certificate not found');
      visual.errorBox('Certificate Error', {
        message: 'Verification passed but no valid RUN_CERTIFICATE.json found',
      });
      process.exit(1);
    }

    verifySpinner.succeed('Local Run Proof PASSED');
  }

  // Step 2: Generate props
  visual.phaseHeader('Props Generation', 2, 3);
  const props = generateProps(args, certificate);
  visual.log(`Title: ${props.title}`, 'info');
  visual.log(`Slug: ${props.slug}`, 'info');
  visual.log(`Highlights: ${props.highlights.length} items`, 'info');

  // Step 3: Ensure demo-video dependencies are installed
  const depsSpinner = new visual.Spinner('Checking Remotion dependencies...').start();
  try {
    await ensureDemoVideoDeps();
    depsSpinner.succeed('Remotion dependencies ready');
  } catch (err) {
    depsSpinner.fail('Failed to install dependencies');
    visual.errorBox('Dependency Error', {
      message: err.message,
      remediation: 'Run: cd demo-video && npm install',
    });
    process.exit(1);
  }

  // Step 4: Render video
  visual.phaseHeader('Video Rendering', 3, 3);
  const renderSpinner = new visual.Spinner('Rendering video with Remotion...').start();

  try {
    await renderVideo(props, outputPath);
    renderSpinner.succeed('Video rendered successfully');

    // Step 5: Report results with celebration
    const duration = visual.formatDuration(Date.now() - startTime);

    if (existsSync(outputPath)) {
      const stats = statSync(outputPath);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

      visual.celebrate('Demo Video Complete!', {
        'Output': outputPath,
        'Size': `${sizeMB} MB`,
        'Duration': duration,
        'Props': outputPath.replace('.mp4', '.props.json'),
      });
    } else {
      visual.celebrate('Demo Video Complete!', {
        'Output': outputPath,
        'Duration': duration,
      });
    }
  } catch (err) {
    renderSpinner.fail('Video rendering failed');
    visual.errorBox('Render Failed', {
      message: err.message,
      remediation: 'Check the Remotion logs above for details.',
      hint: 'Try: cd demo-video && npx remotion studio to debug',
    });
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
