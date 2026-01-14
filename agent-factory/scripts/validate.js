#!/usr/bin/env node

/**
 * Agent Factory Validator
 *
 * Validates an agent against the Factory Ready Standard.
 * Outputs factory_ready.json on success.
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
  writeFactoryReadyJson(resolved, false, result);
  process.exit(1);
}

console.log('PASSED');
console.log(`  Files: ${result.fileCount}`);
console.log(`  Size: ${(result.totalSize / 1024).toFixed(1)} KB`);
writeFactoryReadyJson(resolved, true, result);
console.log(`\nWrote: factory_ready.json\n`);

// ============================================================
// FACTORY READY JSON OUTPUT
// ============================================================

function writeFactoryReadyJson(projectPath, passed, result) {
  // Read agent.json for project info
  let agentName = path.basename(projectPath);
  let tokenEnabled = false;

  try {
    const agentJsonPath = path.join(projectPath, 'agent.json');
    if (fs.existsSync(agentJsonPath)) {
      const agentJson = JSON.parse(fs.readFileSync(agentJsonPath, 'utf-8'));
      agentName = agentJson.agent?.name || agentName;
      tokenEnabled = agentJson.tokenIntegration === true;
    }
  } catch (e) {
    // Use defaults
  }

  const factoryReady = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    project: {
      name: agentName,
      pipeline: 'agent-factory',
      path: projectPath
    },
    gates: {
      build: {
        status: passed ? 'pass' : 'fail',
        checks: [
          { name: 'package.json exists', passed: !result.errors.some(e => e.includes('Missing package.json')) },
          { name: 'agent.json valid', passed: !result.errors.some(e => e.includes('agent.json')) },
          { name: 'src/ directory exists', passed: !result.errors.some(e => e.includes('Missing src/')) }
        ]
      },
      run: { status: 'not_checked', note: 'Run npm run dev to verify' },
      test: { status: 'not_checked', note: 'Run curl http://localhost:8080/health to verify' },
      validate: {
        status: passed ? 'pass' : 'fail',
        file_count: result.fileCount,
        total_size_kb: Math.round(result.totalSize / 1024),
        errors: result.errors
      },
      package: { status: 'pass', note: 'Push to GitHub for launchpad import' },
      launch_ready: {
        status: passed ? 'pass' : 'fail',
        checks: [
          { name: 'No forbidden files', passed: !result.errors.some(e => e.includes('Forbidden')) },
          { name: 'Size under limit', passed: !result.errors.some(e => e.includes('too large')) }
        ]
      },
      token_integration: {
        status: tokenEnabled ? 'enabled' : 'disabled',
        note: tokenEnabled
          ? 'Set TOKEN_CONTRACT_ADDRESS in .env after launch'
          : 'Token integration not enabled for this agent'
      }
    },
    overall: passed ? 'PASS' : 'FAIL',
    next_steps: passed
      ? ['Push to GitHub', 'Import on factoryapp.dev (Repo Mode)']
      : ['Fix errors listed above', 'Run npm run validate again']
  };

  const outputPath = path.join(projectPath, 'factory_ready.json');
  fs.writeFileSync(outputPath, JSON.stringify(factoryReady, null, 2));
}
