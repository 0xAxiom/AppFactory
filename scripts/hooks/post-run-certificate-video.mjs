#!/usr/bin/env node
/**
 * Post-RUN_CERTIFICATE Video Generation Hook
 *
 * Automatically renders a demo video when Local Run Proof verification passes.
 * Triggered by hooks.toml after verify.mjs completes.
 *
 * Behavior:
 * - Checks for RUN_CERTIFICATE.json with PASS status
 * - Extracts slug from the working directory or certificate
 * - Renders demo video using render-demo-video.mjs
 * - Provides visual feedback during rendering
 *
 * Environment:
 * - APPFACTORY_VIDEO_AUTO=false to disable auto-rendering
 * - CI=true skips video rendering in CI environments
 */

import { existsSync, readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { join, resolve, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..', '..');

// ============================================================================
// Visual Feedback (inline to avoid import issues in hook context)
// ============================================================================

const COLORS = {
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  reset: '\x1b[0m',
};

const SYMBOLS = {
  check: '\u2714',
  cross: '\u2718',
  video: '\u{1F3AC}',
  sparkles: '\u2728',
};

function log(message, type = 'info') {
  const prefix = {
    info: `${COLORS.cyan}[video]${COLORS.reset}`,
    success: `${COLORS.green}[${SYMBOLS.check}]${COLORS.reset}`,
    error: `${COLORS.red}[${SYMBOLS.cross}]${COLORS.reset}`,
    warning: `${COLORS.yellow}[!]${COLORS.reset}`,
  };
  console.log(`${prefix[type] || prefix.info} ${message}`);
}

// ============================================================================
// Certificate Detection
// ============================================================================

function findCertificate() {
  // Check current working directory and common build output paths
  const searchPaths = [
    process.cwd(),
    process.env.APPFACTORY_BUILD_DIR,
    // Common pipeline output patterns
    join(process.cwd(), 'app'),
    join(process.cwd(), 'build'),
    join(process.cwd(), 'dist'),
  ].filter(Boolean);

  for (const searchPath of searchPaths) {
    const certPath = join(searchPath, 'RUN_CERTIFICATE.json');
    if (existsSync(certPath)) {
      try {
        const content = readFileSync(certPath, 'utf-8');
        const cert = JSON.parse(content);
        if (cert.status === 'PASS') {
          return { cert, path: searchPath };
        }
      } catch {
        // Invalid certificate, continue searching
      }
    }
  }

  return null;
}

function extractSlug(certPath, certificate) {
  // Try to extract slug from certificate metadata
  if (certificate.metadata?.slug) {
    return certificate.metadata.slug;
  }

  // Try to derive from directory name
  const dirName = basename(certPath);

  // Check if this looks like a pipeline output directory
  // e.g., app-factory/builds/my-app/app -> "my-app"
  const parentDir = basename(dirname(certPath));
  if (['app', 'build', 'dist', 'out'].includes(dirName)) {
    return parentDir;
  }

  // Use directory name if it looks like a slug
  if (/^[a-z0-9-]+$/.test(dirName)) {
    return dirName;
  }

  // Fallback to timestamp-based slug
  const timestamp = new Date().toISOString().slice(0, 10);
  return `demo-${timestamp}`;
}

// ============================================================================
// Video Rendering
// ============================================================================

function runVideoRender(cwd, slug) {
  return new Promise((resolve) => {
    const renderScript = join(REPO_ROOT, 'scripts', 'render-demo-video.mjs');

    if (!existsSync(renderScript)) {
      log('render-demo-video.mjs not found, skipping video generation', 'warning');
      resolve(false);
      return;
    }

    log(`${SYMBOLS.video} Rendering demo video for "${slug}"...`);

    const proc = spawn('node', [
      renderScript,
      '--cwd', cwd,
      '--slug', slug,
      '--skip-verify', // Certificate already verified
    ], {
      cwd: REPO_ROOT,
      stdio: 'inherit',
      env: { ...process.env },
    });

    proc.on('close', (code) => {
      if (code === 0) {
        log(`${SYMBOLS.sparkles} Demo video rendered successfully!`, 'success');
        log(`Output: demo/out/${slug}.mp4`, 'info');
        resolve(true);
      } else {
        log('Video rendering failed (exit code: ' + code + ')', 'error');
        resolve(false);
      }
    });

    proc.on('error', (err) => {
      log(`Video rendering error: ${err.message}`, 'error');
      resolve(false);
    });
  });
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  // Skip in CI environments
  if (process.env.CI === 'true') {
    return;
  }

  // Allow disabling via environment variable
  if (process.env.APPFACTORY_VIDEO_AUTO === 'false') {
    return;
  }

  // Find a valid RUN_CERTIFICATE.json
  const result = findCertificate();

  if (!result) {
    // No certificate found - this is normal if verification didn't pass
    // or if this hook was triggered by a different command
    return;
  }

  const { cert, path: certPath } = result;
  const slug = extractSlug(certPath, cert);

  log('');
  log(`${COLORS.bold}=== Auto Video Generation ===${COLORS.reset}`);
  log(`Certificate found at: ${certPath}`);
  log(`Slug: ${slug}`);
  log('');

  await runVideoRender(certPath, slug);
}

main().catch((err) => {
  // Hooks should fail silently to not interrupt user workflow
  if (process.env.DEBUG) {
    console.error('Video hook error:', err);
  }
});
