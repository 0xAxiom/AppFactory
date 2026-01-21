#!/usr/bin/env node
/**
 * Post-Install Hook
 *
 * Runs after package install commands complete.
 * Validates installation and provides feedback.
 *
 * @module scripts/hooks/post-install
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let visual;
try {
  visual = await import(join(__dirname, '..', 'lib', 'visual.mjs'));
} catch {
  visual = {
    log: (msg, type) => console.log(`[${type}] ${msg}`),
    SYMBOLS: { check: '+', cross: 'x' },
    COLORS: { green: '', red: '', reset: '' },
  };
}

const { log, SYMBOLS, COLORS } = visual;

function getHookContext() {
  const toolInput = process.env.CLAUDE_TOOL_INPUT;
  const toolResult = process.env.CLAUDE_TOOL_RESULT;

  if (!toolInput) return null;

  try {
    const input = JSON.parse(toolInput);
    const result = toolResult ? JSON.parse(toolResult) : {};
    return {
      command: input.command || '',
      cwd: input.cwd || process.cwd(),
      exitCode: result.exit_code,
      stdout: result.stdout || '',
    };
  } catch {
    return { command: toolInput, cwd: process.cwd(), exitCode: null };
  }
}

function checkForBypassFlags(command) {
  const forbiddenFlags = [
    '--legacy-peer-deps',
    '--force',
    '--ignore-engines',
    '--ignore-scripts',
    '--shamefully-hoist',
    '--skip-integrity-check',
  ];

  const found = forbiddenFlags.filter((flag) => command.includes(flag));
  return found;
}

function main() {
  const context = getHookContext();
  if (!context) {
    process.exit(0);
  }

  const { command, cwd, exitCode, stdout } = context;

  // Check for forbidden bypass flags
  const bypassFlags = checkForBypassFlags(command);
  if (bypassFlags.length > 0) {
    console.log('');
    log(`Warning: Bypass flags detected: ${bypassFlags.join(', ')}`, 'warning');
    log('These flags may hide dependency issues and are forbidden by Local Run Proof.', 'warning');
    console.log('');
    process.exit(0);
  }

  // Check if install succeeded
  if (exitCode !== 0 && exitCode !== null) {
    log('Package installation failed', 'error');
    process.exit(0);
  }

  // Verify node_modules exists
  const nodeModulesPath = join(cwd, 'node_modules');
  if (!existsSync(nodeModulesPath)) {
    log('Warning: node_modules not found after install', 'warning');
    process.exit(0);
  }

  // Check for peer dependency warnings in output
  if (stdout && stdout.includes('peer dep')) {
    log('Note: Peer dependency warnings detected - review may be needed', 'warning');
  }

  log(`${COLORS.green}${SYMBOLS.check}${COLORS.reset} Dependencies installed successfully`, 'success');
  process.exit(0);
}

main();
