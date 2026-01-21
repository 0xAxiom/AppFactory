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
import { existsSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { platform } from 'node:os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  return {
    title,
    slug: args.slug,
    verifiedUrl: certificate.healthcheck?.url || certificate.finalUrl || `http://localhost:${certificate.healthcheck?.port || 3000}`,
    timestamp: certificate.timestamps?.end || new Date().toISOString(),
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
  console.log('AppFactory Demo Video Pipeline');
  console.log('==============================\n');

  // Parse and validate arguments
  const args = parseArgs(process.argv);
  const errors = validateArgs(args);

  if (errors.length > 0) {
    console.error('Validation errors:');
    errors.forEach((err) => console.error(`  - ${err}`));
    console.error('\nRun with --help for usage information.');
    process.exit(1);
  }

  const resolvedCwd = resolve(args.cwd);
  const outputPath = join(OUTPUT_DIR, `${args.slug}.mp4`);

  console.log(`Project path: ${resolvedCwd}`);
  console.log(`Output path: ${outputPath}`);

  // Step 1: Run Local Run Proof (unless skipped)
  let certificate = null;

  if (args.skipVerify) {
    console.log('\n=== Skipping Local Run Proof (--skip-verify) ===\n');
    certificate = readCertificate(resolvedCwd);

    if (!certificate) {
      console.error('Error: --skip-verify requires existing RUN_CERTIFICATE.json');
      process.exit(1);
    }

    if (certificate.status !== 'PASS') {
      console.error('Error: RUN_CERTIFICATE.json does not have PASS status');
      process.exit(1);
    }

    console.log('Found existing RUN_CERTIFICATE.json with PASS status');
  } else {
    const passed = await runLocalRunProof(args);

    if (!passed) {
      console.error('\n=== Local Run Proof FAILED ===');
      console.error('Cannot render demo video without passing verification.');
      console.error(`Check RUN_FAILURE.json in ${resolvedCwd} for details.`);
      process.exit(1);
    }

    certificate = readCertificate(resolvedCwd);

    if (!certificate || certificate.status !== 'PASS') {
      console.error('Error: Verification passed but no valid RUN_CERTIFICATE.json found');
      process.exit(1);
    }
  }

  // Step 2: Generate props
  const props = generateProps(args, certificate);
  console.log('\nVideo props:');
  console.log(JSON.stringify(props, null, 2));

  // Step 3: Ensure demo-video dependencies are installed
  await ensureDemoVideoDeps();

  // Step 4: Render video
  try {
    await renderVideo(props, outputPath);

    // Step 5: Report results
    console.log('\n=== Demo Video Rendered Successfully ===\n');

    if (existsSync(outputPath)) {
      const stats = statSync(outputPath);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`Output: ${outputPath}`);
      console.log(`Size: ${sizeMB} MB`);
    }

    console.log(`Props: ${outputPath.replace('.mp4', '.props.json')}`);
    console.log('\nDemo video pipeline completed successfully!');
  } catch (err) {
    console.error('\n=== Demo Video Render FAILED ===\n');
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
