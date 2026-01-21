#!/usr/bin/env node

/**
 * Agent Factory Zipper (Optional Helper)
 *
 * Creates a ZIP file for upload to factoryapp.dev.
 * This is an OPTIONAL script - most users won't need it.
 *
 * Usage: node scripts/zip.js [path]
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';

// ============================================================
// CONFIGURATION
// ============================================================

const EXCLUDE = [
  '.env',
  '.env.*',
  '!.env.example',
  'node_modules',
  'dist',
  'build',
  '.cache',
  '*.log',
  '.DS_Store',
  '.git',
  '.gitignore',
  '*.pem',
  '*.key',
  '*.crt',
  '*.secret',
  '*.exe',
  '*.dll',
  '*.so',
  '*.dylib',
  '*.sh',
  '*.bat',
  '*.zip',
];

// ============================================================
// FILE COLLECTION
// ============================================================

function shouldInclude(name, relativePath) {
  for (const pattern of EXCLUDE) {
    if (pattern.startsWith('!')) continue;
    if (pattern === name) return false;
    if (pattern.startsWith('*.') && name.endsWith(pattern.slice(1)))
      return false;
    if (relativePath.startsWith(pattern + '/')) return false;
  }

  // Allow exceptions
  for (const pattern of EXCLUDE) {
    if (pattern.startsWith('!') && name === pattern.slice(1)) return true;
  }

  return true;
}

function collectFiles(projectPath) {
  const files = [];

  function scanDir(dir, prefix = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
      const fullPath = path.join(dir, entry.name);

      if (!shouldInclude(entry.name, relativePath)) continue;

      if (entry.isDirectory()) {
        scanDir(fullPath, relativePath);
      } else {
        files.push({ relativePath, fullPath });
      }
    }
  }

  scanDir(projectPath);
  return files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

// ============================================================
// MAIN
// ============================================================

const projectPath = process.argv[2] || process.cwd();
const resolved = path.resolve(projectPath);

console.log(`\nCreating ZIP for: ${resolved}\n`);

// Load agent.json for naming
const agentJsonPath = path.join(resolved, 'agent.json');
if (!fs.existsSync(agentJsonPath)) {
  console.error('ERROR: agent.json not found');
  process.exit(1);
}

let agentJson;
try {
  agentJson = JSON.parse(fs.readFileSync(agentJsonPath, 'utf-8'));
} catch (e) {
  console.error(`ERROR: Invalid agent.json - ${e.message}`);
  process.exit(1);
}

const name = agentJson.agent?.name || 'agent';
const version = agentJson.agent?.version || '1.0.0';
const zipName = `${name}-${version}.zip`;
const zipPath = path.join(resolved, zipName);

// Collect files
const files = collectFiles(resolved);
console.log(`Files to include: ${files.length}`);
files.forEach((f) => console.log(`  ${f.relativePath}`));

// Create ZIP using system zip command
const fileList = files.map((f) => f.relativePath);
const listPath = path.join(resolved, '.zipfiles.tmp');

try {
  fs.writeFileSync(listPath, fileList.join('\n'));

  // Remove existing zip if present
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }

  execSync(`cd "${resolved}" && zip -@ "${zipPath}" < .zipfiles.tmp`, {
    stdio: 'pipe',
  });

  const stat = fs.statSync(zipPath);
  console.log(`\nCreated: ${zipName}`);
  console.log(`Size: ${(stat.size / 1024).toFixed(1)} KB\n`);
} catch (e) {
  console.error(`\nERROR: Failed to create ZIP`);
  console.error(`Make sure 'zip' command is installed.\n`);
  process.exit(1);
} finally {
  if (fs.existsSync(listPath)) {
    fs.unlinkSync(listPath);
  }
}
