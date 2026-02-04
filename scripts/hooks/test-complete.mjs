#!/usr/bin/env node
/**
 * Test Complete Hook
 *
 * Provides visual feedback when test commands complete.
 * Shows celebration for passing tests, clear error for failures.
 *
 * @module scripts/hooks/test-complete
 */

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let visual;
try {
  visual = await import(join(__dirname, '..', 'lib', 'visual.mjs'));
} catch {
  visual = {
    celebrate: (title, stats) => {
      console.log(`\n[SUCCESS] ${title}`);
      if (stats) console.log(JSON.stringify(stats, null, 2));
    },
    errorBox: (title, details) => {
      console.log(`\n[ERROR] ${title}`);
      if (details.message) console.log(details.message);
    },
    log: (msg, type) => console.log(`[${type}] ${msg}`),
  };
}

const { celebrate, errorBox } = visual;

function getHookContext() {
  const toolInput = process.env.CLAUDE_TOOL_INPUT;
  const toolResult = process.env.CLAUDE_TOOL_RESULT;

  if (!toolInput) return null;

  try {
    const input = JSON.parse(toolInput);
    const result = toolResult ? JSON.parse(toolResult) : {};
    return {
      command: input.command || '',
      exitCode: result.exit_code,
      stdout: result.stdout || '',
      stderr: result.stderr || '',
    };
  } catch {
    return { command: toolInput, exitCode: null };
  }
}

function parseTestOutput(stdout, stderr) {
  const output = stdout + stderr;
  const stats = {};

  // Jest patterns
  const jestMatch = output.match(/Tests:\s+(\d+)\s+passed/);
  if (jestMatch) stats.passed = parseInt(jestMatch[1], 10);

  const jestFailMatch = output.match(/Tests:\s+(\d+)\s+failed/);
  if (jestFailMatch) stats.failed = parseInt(jestFailMatch[1], 10);

  // Vitest patterns
  const vitestMatch = output.match(/(\d+)\s+passed/);
  if (vitestMatch && !stats.passed) stats.passed = parseInt(vitestMatch[1], 10);

  // Generic test count
  const testCountMatch = output.match(/(\d+)\s+tests?/i);
  if (testCountMatch) stats.total = parseInt(testCountMatch[1], 10);

  return stats;
}

function detectTestFramework(command) {
  if (command.includes('jest')) return 'Jest';
  if (command.includes('vitest')) return 'Vitest';
  if (command.includes('playwright')) return 'Playwright';
  if (command.includes('mocha')) return 'Mocha';
  return 'Tests';
}

function main() {
  const context = getHookContext();
  if (!context) {
    process.exit(0);
  }

  const { command, exitCode, stdout, stderr } = context;
  const framework = detectTestFramework(command);
  const stats = parseTestOutput(stdout || '', stderr || '');

  if (exitCode === 0) {
    // Tests passed
    const displayStats = {};
    if (stats.passed) displayStats['Passed'] = stats.passed;
    if (stats.total) displayStats['Total'] = stats.total;

    celebrate(`${framework} Passed!`, displayStats);
  } else if (exitCode !== null) {
    // Tests failed
    errorBox(`${framework} Failed`, {
      message: stats.failed ? `${stats.failed} test(s) failed` : 'See output above for details',
      hint: 'Fix failing tests and run again',
    });
  }

  process.exit(0);
}

main();
