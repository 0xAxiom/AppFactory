#!/usr/bin/env node
/**
 * Cross-platform URL opener
 *
 * Opens a URL in the user's default browser.
 *
 * Usage: node scripts/open-url.mjs <url>
 *
 * Supports:
 *   - macOS: uses 'open'
 *   - Windows: uses 'start'
 *   - Linux: uses 'xdg-open'
 */

import { spawn } from 'child_process';
import { platform } from 'os';

const url = process.argv[2];

if (!url) {
  console.error('Usage: node scripts/open-url.mjs <url>');
  process.exit(1);
}

function openUrl(url) {
  const os = platform();
  let command;
  let args;

  switch (os) {
    case 'darwin':
      command = 'open';
      args = [url];
      break;
    case 'win32':
      command = 'cmd';
      args = ['/c', 'start', '', url];
      break;
    case 'linux':
      command = 'xdg-open';
      args = [url];
      break;
    default:
      console.error(`Unsupported platform: ${os}`);
      process.exit(1);
  }

  console.log(`Opening ${url} on ${os}...`);

  const child = spawn(command, args, {
    detached: true,
    stdio: 'ignore'
  });

  child.unref();

  // Small delay to let the browser launch
  setTimeout(() => {
    console.log('Browser opened.');
    process.exit(0);
  }, 500);
}

openUrl(url);
