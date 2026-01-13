#!/usr/bin/env node

/**
 * Agent Factory Validator (Optional Helper)
 *
 * Validates an agent against ZIP_CONTRACT.md rules.
 * This is an OPTIONAL script - most users won't need it.
 *
 * Usage: node scripts/validate.js [path]
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

// ============================================================
// CONFIGURATION
// ============================================================

const CONFIG = {
  maxZipSize: 10 * 1024 * 1024,
  maxFileSize: 1 * 1024 * 1024,
  maxFileCount: 100,

  requiredFiles: ['agent.json', 'package.json', 'src'],

  forbiddenPatterns: [
    /^\.env$/, /^\.env\..+$/, /\.pem$/, /\.key$/, /\.crt$/,
    /^credentials\.json$/, /^secrets\.json$/, /\.secret$/,
    /^node_modules$/, /^node_modules\//, /^dist\//, /^build\//,
    /\.log$/, /^\.DS_Store$/, /^\.git$/, /^\.git\//,
    /\.exe$/, /\.dll$/, /\.so$/, /\.dylib$/, /\.sh$/, /\.bat$/
  ],

  allowedDotfiles: ['.nvmrc', '.npmrc', '.env.example']
};

// ============================================================
// VALIDATION
// ============================================================

function validate(projectPath) {
  const errors = [];
  const warnings = [];

  // Check project exists
  if (!fs.existsSync(projectPath)) {
    errors.push(`Project not found: ${projectPath}`);
    return { errors, warnings };
  }

  // Check agent.json
  const agentJsonPath = path.join(projectPath, 'agent.json');
  if (!fs.existsSync(agentJsonPath)) {
    errors.push('Missing agent.json');
  } else {
    try {
      const content = fs.readFileSync(agentJsonPath, 'utf-8');
      const agentJson = JSON.parse(content);

      if (agentJson.manifestVersion !== '1.0') {
        errors.push('agent.json: manifestVersion must be "1.0"');
      }
      if (!agentJson.agent?.name) {
        errors.push('agent.json: missing agent.name');
      }
      if (!agentJson.runtime?.entrypoint) {
        errors.push('agent.json: missing runtime.entrypoint');
      } else {
        const entrypointPath = path.join(projectPath, agentJson.runtime.entrypoint);
        if (!fs.existsSync(entrypointPath)) {
          errors.push(`Entrypoint not found: ${agentJson.runtime.entrypoint}`);
        }
      }
    } catch (e) {
      errors.push(`agent.json: Invalid JSON - ${e.message}`);
    }
  }

  // Check package.json
  const packageJsonPath = path.join(projectPath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    errors.push('Missing package.json');
  } else {
    try {
      const content = fs.readFileSync(packageJsonPath, 'utf-8');
      const pkg = JSON.parse(content);

      const dangerousScripts = ['postinstall', 'preinstall', 'prepare'];
      for (const script of dangerousScripts) {
        if (pkg.scripts?.[script]) {
          errors.push(`package.json: Remove dangerous script "${script}"`);
        }
      }
    } catch (e) {
      errors.push(`package.json: Invalid JSON - ${e.message}`);
    }
  }

  // Check src directory
  if (!fs.existsSync(path.join(projectPath, 'src'))) {
    errors.push('Missing src/ directory');
  }

  // Scan for forbidden files
  let fileCount = 0;
  let totalSize = 0;

  function scanDir(dir, prefix = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
      const fullPath = path.join(dir, entry.name);

      // Check forbidden patterns
      for (const pattern of CONFIG.forbiddenPatterns) {
        if (pattern.test(entry.name) || pattern.test(relativePath)) {
          if (!CONFIG.allowedDotfiles.includes(entry.name)) {
            errors.push(`Forbidden file: ${relativePath}`);
          }
          break;
        }
      }

      if (entry.isDirectory()) {
        scanDir(fullPath, relativePath);
      } else {
        fileCount++;
        const stat = fs.statSync(fullPath);
        totalSize += stat.size;

        if (stat.size > CONFIG.maxFileSize) {
          errors.push(`File too large: ${relativePath} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
        }
      }
    }
  }

  try {
    scanDir(projectPath);
  } catch (e) {
    errors.push(`Error scanning files: ${e.message}`);
  }

  if (fileCount > CONFIG.maxFileCount) {
    errors.push(`Too many files: ${fileCount} (max ${CONFIG.maxFileCount})`);
  }

  if (totalSize > CONFIG.maxZipSize) {
    errors.push(`Total size too large: ${(totalSize / 1024 / 1024).toFixed(2)} MB (max 10 MB)`);
  }

  return { errors, warnings, fileCount, totalSize };
}

// ============================================================
// MAIN
// ============================================================

const projectPath = process.argv[2] || process.cwd();
const resolved = path.resolve(projectPath);

console.log(`\nValidating: ${resolved}\n`);

const result = validate(resolved);

if (result.errors.length > 0) {
  console.log('ERRORS:');
  result.errors.forEach(e => console.log(`  - ${e}`));
  console.log('');
  process.exit(1);
}

console.log('PASSED');
console.log(`  Files: ${result.fileCount}`);
console.log(`  Size: ${(result.totalSize / 1024).toFixed(1)} KB\n`);
