#!/usr/bin/env node
/**
 * Package Manager and Dev Command Detection
 * Cross-platform script to detect:
 * - Package manager (npm, pnpm, yarn, bun)
 * - Available dev commands (dev, start, serve)
 * - Project type hints
 */

import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * Detect package manager based on lockfiles
 * @param {string} cwd - Working directory
 * @returns {{ pm: string, lockfile: string | null }}
 */
export function detectPackageManager(cwd = process.cwd()) {
  const lockfiles = [
    { pm: 'bun', file: 'bun.lockb' },
    { pm: 'pnpm', file: 'pnpm-lock.yaml' },
    { pm: 'yarn', file: 'yarn.lock' },
    { pm: 'npm', file: 'package-lock.json' },
  ];

  for (const { pm, file } of lockfiles) {
    const lockPath = join(cwd, file);
    if (existsSync(lockPath)) {
      return { pm, lockfile: file };
    }
  }

  // Fallback to npm if no lockfile found but package.json exists
  if (existsSync(join(cwd, 'package.json'))) {
    return { pm: 'npm', lockfile: null };
  }

  return { pm: null, lockfile: null };
}

/**
 * Read package.json scripts
 * @param {string} cwd - Working directory
 * @returns {object | null}
 */
export function readPackageScripts(cwd = process.cwd()) {
  const pkgPath = join(cwd, 'package.json');
  if (!existsSync(pkgPath)) {
    return null;
  }

  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    return pkg.scripts || {};
  } catch {
    return null;
  }
}

/**
 * Detect available dev command
 * @param {object} scripts - package.json scripts object
 * @returns {{ command: string, script: string } | null}
 */
export function detectDevCommand(scripts) {
  if (!scripts) return null;

  // Priority order for dev commands
  const devCommands = ['dev', 'start', 'serve', 'develop', 'watch'];

  for (const cmd of devCommands) {
    if (scripts[cmd]) {
      return { command: cmd, script: scripts[cmd] };
    }
  }

  return null;
}

/**
 * Detect project type based on dependencies and files
 * @param {string} cwd - Working directory
 * @returns {string}
 */
export function detectProjectType(cwd = process.cwd()) {
  const pkgPath = join(cwd, 'package.json');
  if (!existsSync(pkgPath)) {
    return 'unknown';
  }

  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    // Check for specific frameworks
    if (deps['expo']) return 'expo';
    if (deps['next']) return 'nextjs';
    if (deps['vite']) return 'vite';
    if (deps['@remix-run/react']) return 'remix';
    if (deps['nuxt']) return 'nuxt';
    if (deps['astro']) return 'astro';
    if (deps['svelte'] || deps['@sveltejs/kit']) return 'svelte';
    if (deps['react-scripts']) return 'cra';
    if (deps['vue']) return 'vue';
    if (deps['express'] || deps['fastify'] || deps['koa']) return 'node-server';
    if (deps['react']) return 'react';

    return 'node';
  } catch {
    return 'unknown';
  }
}

/**
 * Get the run command for a package manager
 * @param {string} pm - Package manager name
 * @param {string} script - Script name
 * @returns {string[]}
 */
export function getRunCommand(pm, script) {
  switch (pm) {
    case 'bun':
      return ['bun', 'run', script];
    case 'pnpm':
      return ['pnpm', 'run', script];
    case 'yarn':
      return ['yarn', script];
    case 'npm':
    default:
      return ['npm', 'run', script];
  }
}

/**
 * Guess default port based on project type
 * @param {string} projectType - Detected project type
 * @returns {number}
 */
export function guessDefaultPort(projectType) {
  const portMap = {
    'nextjs': 3000,
    'vite': 5173,
    'cra': 3000,
    'expo': 8081,
    'remix': 3000,
    'nuxt': 3000,
    'astro': 4321,
    'svelte': 5173,
    'vue': 5173,
    'node-server': 3000,
  };

  return portMap[projectType] || 3000;
}

/**
 * Full detection result
 * @param {string} cwd - Working directory
 * @returns {object}
 */
export function detect(cwd = process.cwd()) {
  const absoluteCwd = resolve(cwd);
  const { pm, lockfile } = detectPackageManager(absoluteCwd);
  const scripts = readPackageScripts(absoluteCwd);
  const devCmd = detectDevCommand(scripts);
  const projectType = detectProjectType(absoluteCwd);
  const defaultPort = guessDefaultPort(projectType);

  const result = {
    cwd: absoluteCwd,
    packageManager: pm,
    lockfile,
    projectType,
    devCommand: devCmd ? devCmd.command : null,
    devScript: devCmd ? devCmd.script : null,
    runCommand: pm && devCmd ? getRunCommand(pm, devCmd.command) : null,
    defaultPort,
    hasPackageJson: existsSync(join(absoluteCwd, 'package.json')),
    timestamp: new Date().toISOString(),
  };

  return result;
}

// CLI execution
if (process.argv[1] && process.argv[1].endsWith('detect.mjs')) {
  const cwd = process.argv[2] || process.cwd();
  const result = detect(cwd);

  console.log('');
  console.log('=== Factory Preview: Detection ===');
  console.log('');
  console.log(`  Directory:       ${result.cwd}`);
  console.log(`  Package Manager: ${result.packageManager || 'NOT FOUND'}`);
  console.log(`  Lockfile:        ${result.lockfile || 'NONE'}`);
  console.log(`  Project Type:    ${result.projectType}`);
  console.log(`  Dev Command:     ${result.devCommand || 'NOT FOUND'}`);
  console.log(`  Default Port:    ${result.defaultPort}`);
  console.log('');

  if (result.runCommand) {
    console.log(`  Run Command:     ${result.runCommand.join(' ')}`);
  } else {
    console.log('  Run Command:     CANNOT DETERMINE');
  }
  console.log('');

  // Output JSON to stdout for piping
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(result, null, 2));
  }

  // Exit with error if no dev command found
  if (!result.devCommand) {
    process.exit(1);
  }
}
