#!/usr/bin/env node
/**
 * Build Complete Hook
 *
 * Provides visual feedback when build commands complete.
 * Triggered by Claude Code post_tool_execution hook.
 *
 * @module scripts/hooks/build-complete
 */

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let visual;
try {
  visual = await import(join(__dirname, '..', 'lib', 'visual.mjs'));
} catch {
  // Minimal fallback
  visual = {
    celebrate: (title) => console.log(`\n[SUCCESS] ${title}\n`),
    log: (msg) => console.log(`[info] ${msg}`),
  };
}

const { celebrate, log } = visual;

function getHookContext() {
  const toolInput = process.env.CLAUDE_TOOL_INPUT;
  const toolResult = process.env.CLAUDE_TOOL_RESULT;

  if (!toolInput) return null;

  try {
    const input = JSON.parse(toolInput);
    return {
      command: input.command || '',
      exitCode: toolResult ? JSON.parse(toolResult).exit_code : null,
    };
  } catch {
    return { command: toolInput, exitCode: null };
  }
}

function main() {
  const context = getHookContext();
  if (!context) {
    process.exit(0);
  }

  const { command, exitCode } = context;

  // Only celebrate successful builds
  if (exitCode !== 0 && exitCode !== null) {
    log('Build completed with errors', 'warning');
    process.exit(0);
  }

  // Determine build type from command
  let buildType = 'Build';
  if (command.includes('next')) buildType = 'Next.js Build';
  else if (command.includes('expo')) buildType = 'Expo Build';
  else if (command.includes('vite')) buildType = 'Vite Build';

  celebrate(`${buildType} Complete!`, {
    Command: command.slice(0, 50) + (command.length > 50 ? '...' : ''),
  });

  process.exit(0);
}

main();
