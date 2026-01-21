#!/usr/bin/env node

/**
 * Dependency Health Check Script
 *
 * Checks for:
 * - Outdated dependencies
 * - Security vulnerabilities
 * - Deprecated packages
 * - Missing lockfiles
 *
 * Usage: node scripts/check-dependencies.js
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

// Packages to check
const PACKAGES = [
  { name: 'Root', path: ROOT_DIR },
  { name: 'CLI', path: join(ROOT_DIR, 'CLI') },
  { name: 'dapp-factory', path: join(ROOT_DIR, 'dapp-factory') },
  {
    name: 'plugin-factory/mcp-server',
    path: join(ROOT_DIR, 'plugin-factory', 'examples', 'mcp-server'),
  },
];

// Known deprecated packages to warn about
const DEPRECATED_PATTERNS = [
  'request',
  'querystring',
  'uuid@3',
  'mkdirp@0',
  'rimraf@2',
  'glob@7',
];

function log(message, type = 'info') {
  const prefix =
    {
      info: '\x1b[34m[INFO]\x1b[0m',
      warn: '\x1b[33m[WARN]\x1b[0m',
      error: '\x1b[31m[ERROR]\x1b[0m',
      success: '\x1b[32m[OK]\x1b[0m',
    }[type] || '[INFO]';

  console.log(`${prefix} ${message}`);
}

function checkPackageJson(pkgPath) {
  const packageJsonPath = join(pkgPath, 'package.json');

  if (!existsSync(packageJsonPath)) {
    return null;
  }

  try {
    return JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  } catch {
    return null;
  }
}

function checkLockfile(pkgPath) {
  const lockFiles = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'];
  return lockFiles.some((file) => existsSync(join(pkgPath, file)));
}

function checkForDeprecated(pkg) {
  const warnings = [];
  const allDeps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  for (const [name, version] of Object.entries(allDeps)) {
    for (const pattern of DEPRECATED_PATTERNS) {
      if (pattern.includes('@')) {
        const [depName, depVersion] = pattern.split('@');
        if (name === depName && version.includes(depVersion)) {
          warnings.push(`${name}@${version} may be deprecated`);
        }
      } else if (name === pattern) {
        warnings.push(`${name} is deprecated`);
      }
    }
  }

  return warnings;
}

function runAudit(pkgPath, _pkgName) {
  try {
    execSync('npm audit --json', { cwd: pkgPath, stdio: 'pipe' });
    return { vulnerabilities: 0 };
  } catch (error) {
    try {
      const output = error.stdout?.toString() || '{}';
      const audit = JSON.parse(output);
      return {
        vulnerabilities: audit.metadata?.vulnerabilities?.total || 0,
        critical: audit.metadata?.vulnerabilities?.critical || 0,
        high: audit.metadata?.vulnerabilities?.high || 0,
      };
    } catch {
      return { vulnerabilities: -1 }; // Could not parse
    }
  }
}

function checkOutdated(pkgPath) {
  try {
    execSync('npm outdated --json', { cwd: pkgPath, stdio: 'pipe' });
    return {};
  } catch (error) {
    try {
      return JSON.parse(error.stdout?.toString() || '{}');
    } catch {
      return {};
    }
  }
}

async function main() {
  console.log('\n========================================');
  console.log('  AppFactory Dependency Health Check');
  console.log('========================================\n');

  let hasIssues = false;
  const summary = {
    packages: 0,
    outdated: 0,
    vulnerabilities: 0,
    deprecated: 0,
    missingLockfiles: 0,
  };

  for (const { name, path: pkgPath } of PACKAGES) {
    const pkg = checkPackageJson(pkgPath);

    if (!pkg) {
      log(`${name}: No package.json found, skipping`, 'warn');
      continue;
    }

    summary.packages++;
    console.log(`\n--- ${name} ---`);

    // Check lockfile
    if (!checkLockfile(pkgPath)) {
      log('Missing lockfile (package-lock.json)', 'warn');
      summary.missingLockfiles++;
      hasIssues = true;
    } else {
      log('Lockfile present', 'success');
    }

    // Check for deprecated packages
    const deprecated = checkForDeprecated(pkg);
    if (deprecated.length > 0) {
      deprecated.forEach((d) => log(d, 'warn'));
      summary.deprecated += deprecated.length;
      hasIssues = true;
    }

    // Check outdated
    const outdated = checkOutdated(pkgPath);
    const outdatedCount = Object.keys(outdated).length;
    if (outdatedCount > 0) {
      log(`${outdatedCount} outdated package(s)`, 'warn');
      summary.outdated += outdatedCount;

      // Show major updates
      for (const [dep, info] of Object.entries(outdated)) {
        if (info.current && info.latest) {
          const currentMajor = parseInt(info.current.split('.')[0], 10);
          const latestMajor = parseInt(info.latest.split('.')[0], 10);
          if (latestMajor > currentMajor) {
            log(`  ${dep}: ${info.current} -> ${info.latest} (MAJOR)`, 'warn');
          }
        }
      }
    } else {
      log('All dependencies up to date', 'success');
    }

    // Run audit
    const audit = runAudit(pkgPath, name);
    if (audit.vulnerabilities > 0) {
      log(
        `${audit.vulnerabilities} vulnerabilities (${audit.critical || 0} critical, ${audit.high || 0} high)`,
        'error'
      );
      summary.vulnerabilities += audit.vulnerabilities;
      hasIssues = true;
    } else if (audit.vulnerabilities === 0) {
      log('No vulnerabilities found', 'success');
    } else {
      log('Could not run audit', 'warn');
    }
  }

  // Print summary
  console.log('\n========================================');
  console.log('  Summary');
  console.log('========================================');
  console.log(`  Packages checked: ${summary.packages}`);
  console.log(`  Outdated dependencies: ${summary.outdated}`);
  console.log(`  Vulnerabilities: ${summary.vulnerabilities}`);
  console.log(`  Deprecated packages: ${summary.deprecated}`);
  console.log(`  Missing lockfiles: ${summary.missingLockfiles}`);
  console.log('========================================\n');

  if (hasIssues) {
    log('Dependency health check found issues. Please review above.', 'warn');
    process.exit(1);
  } else {
    log('All dependency checks passed!', 'success');
    process.exit(0);
  }
}

main().catch((error) => {
  log(`Error: ${error.message}`, 'error');
  process.exit(1);
});
