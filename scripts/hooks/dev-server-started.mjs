#!/usr/bin/env node
/**
 * Dev Server Started Hook
 *
 * Provides feedback when development servers start.
 * Auto-opens browser for web dev servers (non-Expo).
 *
 * Note: Expo has its own smart-preview hook, this handles Next.js, Vite, etc.
 *
 * @module scripts/hooks/dev-server-started
 */

import { spawn } from 'node:child_process';
import { platform } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let visual;
try {
  visual = await import(join(__dirname, '..', 'lib', 'visual.mjs'));
} catch {
  visual = {
    Spinner: class {
      constructor(msg) { this.msg = msg; }
      start() { console.log(`[...] ${this.msg}`); return this; }
      succeed(msg) { console.log(`[OK] ${msg || this.msg}`); return this; }
      fail(msg) { console.log(`[FAIL] ${msg || this.msg}`); return this; }
      stop() { return this; }
      update(msg) { this.msg = msg; return this; }
    },
    log: (msg, type) => console.log(`[${type}] ${msg}`),
  };
}

const { Spinner, log } = visual;

const CONFIG = {
  POLL_INTERVAL_MS: 500,
  MAX_POLL_ATTEMPTS: 60,
  REQUEST_TIMEOUT_MS: 2000,
};

// Port detection patterns for various frameworks
const PORT_PATTERNS = {
  next: { default: 3000, flag: /-p\s+(\d+)|--port[=\s]+(\d+)/ },
  vite: { default: 5173, flag: /--port[=\s]+(\d+)/ },
  remix: { default: 3000, flag: /--port[=\s]+(\d+)/ },
  generic: { default: 3000, flag: /--port[=\s]+(\d+)|-p\s+(\d+)/ },
};

function isHeadless() {
  return (
    process.env.CI === 'true' ||
    process.env.HEADLESS === 'true' ||
    process.env.GITHUB_ACTIONS === 'true'
  );
}

function getHookContext() {
  const toolInput = process.env.CLAUDE_TOOL_INPUT;
  if (!toolInput) return null;

  try {
    const parsed = JSON.parse(toolInput);
    return { command: parsed.command || '', cwd: parsed.cwd || process.cwd() };
  } catch {
    return { command: toolInput, cwd: process.cwd() };
  }
}

function detectFramework(command) {
  if (command.includes('next')) return 'next';
  if (command.includes('vite')) return 'vite';
  if (command.includes('remix')) return 'remix';
  return 'generic';
}

function extractPort(command, framework) {
  const pattern = PORT_PATTERNS[framework] || PORT_PATTERNS.generic;
  const match = command.match(pattern.flag);

  if (match) {
    // Find the first captured group that has a value
    const port = match.slice(1).find((g) => g);
    if (port) return parseInt(port, 10);
  }

  return pattern.default;
}

async function healthCheck(url) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT_MS);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    return { ok: response.status >= 200 && response.status < 400 };
  } catch {
    return { ok: false };
  }
}

async function waitForServer(url, spinner) {
  let attempts = 0;

  while (attempts < CONFIG.MAX_POLL_ATTEMPTS) {
    attempts++;
    spinner.update(`Waiting for dev server (${attempts}/${CONFIG.MAX_POLL_ATTEMPTS})...`);

    const result = await healthCheck(url);
    if (result.ok) return { ready: true, attempts };

    await new Promise((r) => setTimeout(r, CONFIG.POLL_INTERVAL_MS));
  }

  return { ready: false, attempts };
}

function openBrowser(url) {
  const plat = platform();
  let cmd, args;

  if (plat === 'darwin') {
    cmd = 'open';
    args = [url];
  } else if (plat === 'win32') {
    cmd = 'cmd';
    args = ['/c', 'start', '""', url];
  } else {
    cmd = 'xdg-open';
    args = [url];
  }

  try {
    spawn(cmd, args, { stdio: 'ignore', detached: true, shell: false }).unref();
    return { opened: true };
  } catch (err) {
    return { opened: false, error: err.message };
  }
}

async function main() {
  if (isHeadless()) {
    process.exit(0);
  }

  const context = getHookContext();
  if (!context) {
    process.exit(0);
  }

  const { command } = context;

  // Skip if this is an expo command (handled by smart-preview)
  if (command.includes('expo')) {
    process.exit(0);
  }

  const framework = detectFramework(command);
  const port = extractPort(command, framework);
  const url = `http://localhost:${port}`;

  console.log('');
  log(`Dev server starting (${framework})...`, 'step');

  const spinner = new Spinner('Waiting for server...').start();
  const result = await waitForServer(url, spinner);

  if (!result.ready) {
    spinner.fail('Server did not respond in time');
    process.exit(0);
  }

  spinner.succeed(`Server ready at ${url}`);

  const browserResult = openBrowser(url);
  if (browserResult.opened) {
    log(`Opened ${url} in browser`, 'success');
  }

  console.log('');
  process.exit(0);
}

main().catch(() => process.exit(0));
