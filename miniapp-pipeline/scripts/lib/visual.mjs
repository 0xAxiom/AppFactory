#!/usr/bin/env node
/**
 * Visual Feedback Module for App Factory
 *
 * Provides consistent terminal UI components across all scripts:
 * - Spinners for async operations
 * - Progress bars for phased work
 * - Phase transition headers
 * - Success/failure celebrations
 * - Consistent color palette
 *
 * @module scripts/lib/visual
 */

import { platform } from 'node:os';

// ============================================================================
// ANSI Color Palette (Consistent across all App Factory scripts)
// ============================================================================

export const COLORS = {
  // Primary colors
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',

  // Modifiers
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',

  // Reset
  reset: '\x1b[0m',

  // Combinations
  success: '\x1b[32m',      // Green
  error: '\x1b[31m',        // Red
  warning: '\x1b[33m',      // Yellow
  info: '\x1b[36m',         // Cyan
  header: '\x1b[1;36m',     // Bold cyan
  muted: '\x1b[2;37m',      // Dim white
};

// ============================================================================
// Unicode Characters (with ASCII fallbacks)
// ============================================================================

const isWindows = platform() === 'win32';
const supportsUnicode = !isWindows && process.env.TERM !== 'dumb';

export const SYMBOLS = supportsUnicode ? {
  check: '\u2714',      // Checkmark
  cross: '\u2718',      // X mark
  bullet: '\u2022',     // Bullet
  arrow: '\u2192',      // Right arrow
  spinner: ['\u280b', '\u2819', '\u2839', '\u2838', '\u283c', '\u2834', '\u2826', '\u2827', '\u2807', '\u280f'],
  progressFilled: '\u2588',   // Full block
  progressEmpty: '\u2591',    // Light shade
  boxTopLeft: '\u250c',
  boxTopRight: '\u2510',
  boxBottomLeft: '\u2514',
  boxBottomRight: '\u2518',
  boxHorizontal: '\u2500',
  boxVertical: '\u2502',
  celebration: '\u2728',  // Sparkles
} : {
  check: '+',
  cross: 'x',
  bullet: '*',
  arrow: '->',
  spinner: ['|', '/', '-', '\\'],
  progressFilled: '#',
  progressEmpty: '-',
  boxTopLeft: '+',
  boxTopRight: '+',
  boxBottomLeft: '+',
  boxBottomRight: '+',
  boxHorizontal: '-',
  boxVertical: '|',
  celebration: '*',
};

// ============================================================================
// Spinner Class
// ============================================================================

export class Spinner {
  constructor(message = 'Loading...') {
    this.message = message;
    this.frameIndex = 0;
    this.interval = null;
    this.startTime = null;
  }

  start() {
    this.startTime = Date.now();
    this.interval = setInterval(() => {
      const frame = SYMBOLS.spinner[this.frameIndex % SYMBOLS.spinner.length];
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      process.stdout.write(`\r${COLORS.cyan}${frame}${COLORS.reset} ${this.message} ${COLORS.dim}(${elapsed}s)${COLORS.reset}  `);
      this.frameIndex++;
    }, 100);
    return this;
  }

  update(message) {
    this.message = message;
    return this;
  }

  succeed(message) {
    this.stop();
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    console.log(`\r${COLORS.green}${SYMBOLS.check}${COLORS.reset} ${message || this.message} ${COLORS.dim}(${elapsed}s)${COLORS.reset}  `);
    return this;
  }

  fail(message) {
    this.stop();
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    console.log(`\r${COLORS.red}${SYMBOLS.cross}${COLORS.reset} ${message || this.message} ${COLORS.dim}(${elapsed}s)${COLORS.reset}  `);
    return this;
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    process.stdout.write('\r\x1b[K'); // Clear line
    return this;
  }
}

// ============================================================================
// Progress Bar
// ============================================================================

export function progressBar(current, total, width = 30, options = {}) {
  const { label = '', showPercent = true, showCount = true } = options;
  const percent = Math.round((current / total) * 100);
  const filled = Math.round((current / total) * width);
  const empty = width - filled;

  let bar = COLORS.green + SYMBOLS.progressFilled.repeat(filled);
  bar += COLORS.dim + SYMBOLS.progressEmpty.repeat(empty) + COLORS.reset;

  let suffix = '';
  if (showPercent) suffix += ` ${percent}%`;
  if (showCount) suffix += ` (${current}/${total})`;

  const prefix = label ? `${label} ` : '';
  return `${prefix}[${bar}]${suffix}`;
}

export function renderProgress(current, total, label = '') {
  process.stdout.write(`\r${progressBar(current, total, 30, { label })}\x1b[K`);
}

// ============================================================================
// Phase Headers
// ============================================================================

export function phaseHeader(phaseName, phaseNumber, totalPhases) {
  const width = 60;
  const title = `PHASE ${phaseNumber}/${totalPhases}: ${phaseName.toUpperCase()}`;
  const padding = Math.max(0, Math.floor((width - title.length - 4) / 2));

  console.log('');
  console.log(COLORS.header + SYMBOLS.boxHorizontal.repeat(width) + COLORS.reset);
  console.log(COLORS.header + ' '.repeat(padding) + title + COLORS.reset);
  console.log(COLORS.header + SYMBOLS.boxHorizontal.repeat(width) + COLORS.reset);
  console.log('');
}

export function sectionHeader(title) {
  console.log('');
  console.log(`${COLORS.cyan}${COLORS.bold}${title}${COLORS.reset}`);
  console.log(COLORS.dim + SYMBOLS.boxHorizontal.repeat(title.length + 4) + COLORS.reset);
}

// ============================================================================
// Success Celebration
// ============================================================================

export function celebrate(title, stats = {}) {
  const width = 62;
  const line = SYMBOLS.boxHorizontal.repeat(width);

  console.log('');
  console.log(COLORS.green + SYMBOLS.boxTopLeft + line + SYMBOLS.boxTopRight + COLORS.reset);
  console.log(COLORS.green + SYMBOLS.boxVertical + COLORS.reset + ' '.repeat(width) + COLORS.green + SYMBOLS.boxVertical + COLORS.reset);

  // Title
  const titlePadding = Math.floor((width - title.length) / 2);
  console.log(
    COLORS.green + SYMBOLS.boxVertical + COLORS.reset +
    ' '.repeat(titlePadding) +
    COLORS.bold + COLORS.green + SYMBOLS.celebration + ' ' + title + ' ' + SYMBOLS.celebration + COLORS.reset +
    ' '.repeat(width - titlePadding - title.length - 4) +
    COLORS.green + SYMBOLS.boxVertical + COLORS.reset
  );

  console.log(COLORS.green + SYMBOLS.boxVertical + COLORS.reset + ' '.repeat(width) + COLORS.green + SYMBOLS.boxVertical + COLORS.reset);

  // Stats
  if (Object.keys(stats).length > 0) {
    console.log(COLORS.green + SYMBOLS.boxVertical + COLORS.reset + SYMBOLS.boxHorizontal.repeat(width) + COLORS.green + SYMBOLS.boxVertical + COLORS.reset);

    for (const [key, value] of Object.entries(stats)) {
      const statLine = `  ${key}: ${value}`;
      console.log(
        COLORS.green + SYMBOLS.boxVertical + COLORS.reset +
        statLine +
        ' '.repeat(Math.max(0, width - statLine.length)) +
        COLORS.green + SYMBOLS.boxVertical + COLORS.reset
      );
    }
  }

  console.log(COLORS.green + SYMBOLS.boxVertical + COLORS.reset + ' '.repeat(width) + COLORS.green + SYMBOLS.boxVertical + COLORS.reset);
  console.log(COLORS.green + SYMBOLS.boxBottomLeft + line + SYMBOLS.boxBottomRight + COLORS.reset);
  console.log('');
}

// ============================================================================
// Error Display
// ============================================================================

export function errorBox(title, details = {}) {
  const { message, remediation, hint } = details;
  const width = 62;
  const line = SYMBOLS.boxHorizontal.repeat(width);

  console.log('');
  console.log(COLORS.red + SYMBOLS.boxTopLeft + line + SYMBOLS.boxTopRight + COLORS.reset);

  // Title
  const titlePadding = Math.floor((width - title.length - 2) / 2);
  console.log(
    COLORS.red + SYMBOLS.boxVertical + COLORS.reset +
    ' '.repeat(titlePadding) +
    COLORS.bold + COLORS.red + SYMBOLS.cross + ' ' + title + COLORS.reset +
    ' '.repeat(Math.max(0, width - titlePadding - title.length - 2)) +
    COLORS.red + SYMBOLS.boxVertical + COLORS.reset
  );

  console.log(COLORS.red + SYMBOLS.boxVertical + COLORS.reset + ' '.repeat(width) + COLORS.red + SYMBOLS.boxVertical + COLORS.reset);

  // Message
  if (message) {
    const msgLines = wrapText(message, width - 4);
    for (const line of msgLines) {
      console.log(
        COLORS.red + SYMBOLS.boxVertical + COLORS.reset +
        '  ' + line +
        ' '.repeat(Math.max(0, width - line.length - 2)) +
        COLORS.red + SYMBOLS.boxVertical + COLORS.reset
      );
    }
  }

  // Remediation
  if (remediation) {
    console.log(COLORS.red + SYMBOLS.boxVertical + COLORS.reset + ' '.repeat(width) + COLORS.red + SYMBOLS.boxVertical + COLORS.reset);
    console.log(
      COLORS.red + SYMBOLS.boxVertical + COLORS.reset +
      COLORS.yellow + '  How to fix:' + COLORS.reset +
      ' '.repeat(width - 14) +
      COLORS.red + SYMBOLS.boxVertical + COLORS.reset
    );
    const remLines = wrapText(remediation, width - 6);
    for (const line of remLines) {
      console.log(
        COLORS.red + SYMBOLS.boxVertical + COLORS.reset +
        '    ' + line +
        ' '.repeat(Math.max(0, width - line.length - 4)) +
        COLORS.red + SYMBOLS.boxVertical + COLORS.reset
      );
    }
  }

  // Hint
  if (hint) {
    console.log(COLORS.red + SYMBOLS.boxVertical + COLORS.reset + ' '.repeat(width) + COLORS.red + SYMBOLS.boxVertical + COLORS.reset);
    console.log(
      COLORS.red + SYMBOLS.boxVertical + COLORS.reset +
      COLORS.dim + '  ' + hint + COLORS.reset +
      ' '.repeat(Math.max(0, width - hint.length - 2)) +
      COLORS.red + SYMBOLS.boxVertical + COLORS.reset
    );
  }

  console.log(COLORS.red + SYMBOLS.boxVertical + COLORS.reset + ' '.repeat(width) + COLORS.red + SYMBOLS.boxVertical + COLORS.reset);
  console.log(COLORS.red + SYMBOLS.boxBottomLeft + line + SYMBOLS.boxBottomRight + COLORS.reset);
  console.log('');
}

// ============================================================================
// Summary Table
// ============================================================================

export function summaryTable(title, rows) {
  const width = 60;

  console.log('');
  console.log(COLORS.cyan + SYMBOLS.boxTopLeft + SYMBOLS.boxHorizontal.repeat(width) + SYMBOLS.boxTopRight + COLORS.reset);

  // Title
  const titlePadding = Math.floor((width - title.length) / 2);
  console.log(
    COLORS.cyan + SYMBOLS.boxVertical + COLORS.reset +
    ' '.repeat(titlePadding) +
    COLORS.bold + title + COLORS.reset +
    ' '.repeat(width - titlePadding - title.length) +
    COLORS.cyan + SYMBOLS.boxVertical + COLORS.reset
  );

  console.log(COLORS.cyan + SYMBOLS.boxVertical + COLORS.reset + SYMBOLS.boxHorizontal.repeat(width) + COLORS.cyan + SYMBOLS.boxVertical + COLORS.reset);

  // Rows
  for (const row of rows) {
    const { label, value, status } = row;
    let statusIcon = '';
    let statusColor = '';

    if (status === 'pass') {
      statusIcon = SYMBOLS.check;
      statusColor = COLORS.green;
    } else if (status === 'fail') {
      statusIcon = SYMBOLS.cross;
      statusColor = COLORS.red;
    } else if (status === 'skip') {
      statusIcon = '-';
      statusColor = COLORS.dim;
    }

    const labelStr = `  ${label}`;
    const valueStr = `${statusColor}${statusIcon}${COLORS.reset} ${value}`;
    const padding = width - labelStr.length - value.length - 4;

    console.log(
      COLORS.cyan + SYMBOLS.boxVertical + COLORS.reset +
      labelStr +
      ' '.repeat(Math.max(1, padding)) +
      valueStr +
      ' '.repeat(Math.max(0, 2)) +
      COLORS.cyan + SYMBOLS.boxVertical + COLORS.reset
    );
  }

  console.log(COLORS.cyan + SYMBOLS.boxBottomLeft + SYMBOLS.boxHorizontal.repeat(width) + SYMBOLS.boxBottomRight + COLORS.reset);
  console.log('');
}

// ============================================================================
// App Factory Banner
// ============================================================================

export function banner(subtitle = '') {
  console.log('');
  console.log(COLORS.cyan + COLORS.bold);
  console.log('     ___              _____         _                   ');
  console.log('    / _ \\            |  ___|       | |                  ');
  console.log('   / /_\\ \\_ __  _ __ | |_ __ _  ___| |_ ___  _ __ _   _ ');
  console.log('   |  _  | \'_ \\| \'_ \\|  _/ _` |/ __| __/ _ \\| \'__| | | |');
  console.log('   | | | | |_) | |_) | || (_| | (__| || (_) | |  | |_| |');
  console.log('   \\_| |_/ .__/| .__/\\_| \\__,_|\\___|\\__\\___/|_|   \\__, |');
  console.log('         | |   | |                                 __/ |');
  console.log('         |_|   |_|                                |___/ ');
  console.log(COLORS.reset);
  if (subtitle) {
    console.log(COLORS.dim + '   ' + subtitle + COLORS.reset);
  }
  console.log('');
}

// ============================================================================
// Utilities
// ============================================================================

function wrapText(text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + word).length > maxWidth) {
      if (currentLine) lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine += word + ' ';
    }
  }
  if (currentLine.trim()) lines.push(currentLine.trim());
  return lines;
}

export function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const mins = Math.floor(ms / 60000);
  const secs = Math.round((ms % 60000) / 1000);
  return `${mins}m ${secs}s`;
}

export function log(message, type = 'info') {
  const prefix = {
    info: `${COLORS.cyan}[info]${COLORS.reset}`,
    success: `${COLORS.green}[${SYMBOLS.check}]${COLORS.reset}`,
    error: `${COLORS.red}[${SYMBOLS.cross}]${COLORS.reset}`,
    warning: `${COLORS.yellow}[!]${COLORS.reset}`,
    step: `${COLORS.blue}[${SYMBOLS.arrow}]${COLORS.reset}`,
  };
  console.log(`${prefix[type] || prefix.info} ${message}`);
}
