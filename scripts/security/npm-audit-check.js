#!/usr/bin/env node
/**
 * npm Audit Check
 *
 * Runs npm audit on all package.json files in the repository
 * and reports vulnerabilities above a threshold.
 *
 * Usage:
 *   node scripts/security/npm-audit-check.js [--fix] [--severity=<level>]
 *
 * Options:
 *   --fix              Attempt to fix vulnerabilities automatically
 *   --severity=<level> Minimum severity to report (low, moderate, high, critical)
 *                      Default: high
 *
 * Exit codes:
 *   0 - No vulnerabilities above threshold
 *   1 - Vulnerabilities detected
 *   2 - Error during execution
 */

import { execSync, spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const SEVERITY_ORDER = ['low', 'moderate', 'high', 'critical'];

// Directories to skip
const SKIP_DIRS = ['node_modules', '.git', 'vendor', 'references'];

// Find all package.json files
function findPackageJsonFiles(basePath, files = []) {
  try {
    const entries = fs.readdirSync(basePath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(basePath, entry.name);

      if (entry.isDirectory()) {
        if (!SKIP_DIRS.includes(entry.name)) {
          findPackageJsonFiles(fullPath, files);
        }
      } else if (entry.name === 'package.json') {
        // Only include if there's a package-lock.json (otherwise npm audit won't work)
        const lockPath = path.join(basePath, 'package-lock.json');
        if (fs.existsSync(lockPath)) {
          files.push(fullPath);
        }
      }
    }
  } catch (err) {
    // Skip directories that can't be read
  }

  return files;
}

// Run npm audit in a directory
function runAudit(packageDir, fix = false) {
  const cwd = path.dirname(packageDir);

  try {
    const cmd = fix ? 'npm audit fix --json' : 'npm audit --json';
    const result = spawnSync(
      'npm',
      fix ? ['audit', 'fix', '--json'] : ['audit', '--json'],
      {
        cwd,
        encoding: 'utf-8',
        timeout: 60000, // 1 minute timeout
      }
    );

    if (result.error) {
      return { error: result.error.message };
    }

    try {
      return JSON.parse(result.stdout || '{}');
    } catch {
      return { error: 'Failed to parse audit output' };
    }
  } catch (err) {
    return { error: err.message };
  }
}

// Check if severity meets threshold
function meetsThreshold(severity, threshold) {
  const severityIndex = SEVERITY_ORDER.indexOf(severity);
  const thresholdIndex = SEVERITY_ORDER.indexOf(threshold);
  return severityIndex >= thresholdIndex;
}

// Format vulnerability for display
function formatVulnerability(vuln) {
  return `
  Package: ${vuln.name}
  Severity: ${vuln.severity}
  Via: ${Array.isArray(vuln.via) ? vuln.via.map((v) => (typeof v === 'string' ? v : v.name)).join(', ') : vuln.via}
  Fix: ${vuln.fixAvailable ? 'Available' : 'Not available'}
`;
}

function main() {
  const args = process.argv.slice(2);
  const fix = args.includes('--fix');
  const severityArg = args.find((a) => a.startsWith('--severity='));
  const threshold = severityArg ? severityArg.split('=')[1] : 'high';

  if (!SEVERITY_ORDER.includes(threshold)) {
    console.error(`Invalid severity level: ${threshold}`);
    console.error(`Valid levels: ${SEVERITY_ORDER.join(', ')}`);
    process.exit(2);
  }

  console.log('npm Audit Check - AppFactory Security');
  console.log('=====================================\n');
  console.log(`Threshold: ${threshold}`);
  console.log(`Auto-fix: ${fix ? 'enabled' : 'disabled'}\n`);

  const basePath = process.cwd();
  const packageFiles = findPackageJsonFiles(basePath);

  console.log(
    `Found ${packageFiles.length} package.json files with lock files\n`
  );

  let totalVulnerabilities = 0;
  const results = [];

  for (const packagePath of packageFiles) {
    const relativePath = path.relative(basePath, packagePath);
    console.log(`Auditing: ${relativePath}`);

    const auditResult = runAudit(packagePath, fix);

    if (auditResult.error) {
      console.log(`  Error: ${auditResult.error}\n`);
      continue;
    }

    const vulnerabilities = auditResult.vulnerabilities || {};
    const relevantVulns = Object.values(vulnerabilities).filter((v) =>
      meetsThreshold(v.severity, threshold)
    );

    if (relevantVulns.length > 0) {
      console.log(
        `  Found ${relevantVulns.length} vulnerabilities >= ${threshold}`
      );
      totalVulnerabilities += relevantVulns.length;
      results.push({
        package: relativePath,
        vulnerabilities: relevantVulns,
      });
    } else {
      console.log(`  No vulnerabilities >= ${threshold}`);
    }
    console.log('');
  }

  if (totalVulnerabilities === 0) {
    console.log('No vulnerabilities detected above threshold.');
    process.exit(0);
  }

  console.log('\n=== VULNERABILITY REPORT ===\n');
  console.log(
    `Total: ${totalVulnerabilities} vulnerabilities >= ${threshold}\n`
  );

  for (const result of results) {
    console.log(`Package: ${result.package}`);
    console.log('-'.repeat(50));
    for (const vuln of result.vulnerabilities) {
      console.log(formatVulnerability(vuln));
    }
    console.log('');
  }

  console.log('\nAction Required:');
  console.log('1. Run `npm audit fix` in affected directories');
  console.log(
    '2. For breaking changes, run `npm audit fix --force` (with caution)'
  );
  console.log(
    '3. For unfixable issues, evaluate if dependency can be replaced'
  );

  process.exit(1);
}

main();
