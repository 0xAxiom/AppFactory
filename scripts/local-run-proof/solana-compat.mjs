#!/usr/bin/env node

/**
 * Solana Dependency Compatibility Checker
 *
 * Detects and fixes the known compatibility issue between:
 * - @solana/wallet-adapter-* (requires @solana/web3.js v1.x)
 * - @solana/web3.js v2.x (incompatible with wallet-adapter)
 *
 * When detected, this utility pins @solana/web3.js to a compatible v1 range.
 *
 * Usage:
 *   node scripts/local-run-proof/solana-compat.mjs --cwd <path> [--fix]
 *
 * Options:
 *   --cwd <path>  Path to the project to check
 *   --fix         Automatically fix incompatible versions
 *   --dry-run     Show what would be changed without modifying files
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// ============================================================================
// Constants
// ============================================================================

/**
 * Compatible @solana/web3.js version range for wallet-adapter
 * As of 2026, wallet-adapter still requires web3.js v1.x
 */
const COMPATIBLE_WEB3_VERSION = '^1.95.0';

/**
 * Wallet adapter packages that require web3.js v1.x
 */
const WALLET_ADAPTER_PACKAGES = [
  '@solana/wallet-adapter-react',
  '@solana/wallet-adapter-base',
  '@solana/wallet-adapter-react-ui',
  '@solana/wallet-adapter-wallets',
  '@solana/wallet-adapter-phantom',
  '@solana/wallet-adapter-solflare',
  '@solana/wallet-adapter-backpack',
];

/**
 * Pattern to detect v2.x version specs
 */
const V2_VERSION_PATTERN = /^(\^|~|>=)?2\./;

// ============================================================================
// Argument Parsing
// ============================================================================

function parseArgs(argv) {
  const args = {
    cwd: null,
    fix: false,
    dryRun: false,
    help: false,
  };

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    const next = argv[i + 1];

    switch (arg) {
      case '--cwd':
        args.cwd = next;
        i++;
        break;
      case '--fix':
        args.fix = true;
        break;
      case '--dry-run':
        args.dryRun = true;
        break;
      case '--help':
        args.help = true;
        break;
    }
  }

  return args;
}

function printHelp() {
  console.log(`
Solana Dependency Compatibility Checker

Detects and fixes the known compatibility issue between
@solana/wallet-adapter-* and @solana/web3.js v2.x.

Usage:
  node scripts/local-run-proof/solana-compat.mjs --cwd <path> [options]

Options:
  --cwd <path>  Path to the project to check (required)
  --fix         Automatically fix incompatible versions
  --dry-run     Show what would be changed without modifying files
  --help        Show this help message

Example:
  node scripts/local-run-proof/solana-compat.mjs --cwd ./my-dapp --fix
`);
}

// ============================================================================
// Compatibility Check
// ============================================================================

/**
 * Checks a package.json for Solana dependency compatibility issues
 * @param {string} cwd - Project directory
 * @returns {{ hasIssue: boolean, details: object }}
 */
export function checkSolanaCompat(cwd) {
  const packageJsonPath = join(cwd, 'package.json');

  if (!existsSync(packageJsonPath)) {
    return {
      hasIssue: false,
      details: {
        error: 'No package.json found',
        packageJsonPath,
      },
    };
  }

  let packageJson;
  try {
    packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  } catch (err) {
    return {
      hasIssue: false,
      details: {
        error: `Failed to parse package.json: ${err.message}`,
        packageJsonPath,
      },
    };
  }

  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  // Check for wallet adapter packages
  const walletAdapterPackages = WALLET_ADAPTER_PACKAGES.filter((pkg) => deps[pkg]);

  if (walletAdapterPackages.length === 0) {
    return {
      hasIssue: false,
      details: {
        message: 'No wallet adapter packages found',
        web3Version: deps['@solana/web3.js'] || null,
      },
    };
  }

  // Check for @solana/web3.js
  const web3Version = deps['@solana/web3.js'];

  if (!web3Version) {
    return {
      hasIssue: false,
      details: {
        message: 'Wallet adapter found but no @solana/web3.js dependency',
        walletAdapterPackages,
      },
    };
  }

  // Check if web3.js is v2.x
  const isV2 = V2_VERSION_PATTERN.test(web3Version);

  if (!isV2) {
    return {
      hasIssue: false,
      details: {
        message: 'Solana dependencies are compatible',
        web3Version,
        walletAdapterPackages,
      },
    };
  }

  // Found the incompatibility
  return {
    hasIssue: true,
    details: {
      message: 'Incompatible Solana dependency versions detected',
      web3Version,
      walletAdapterPackages,
      recommendation: `Pin @solana/web3.js to ${COMPATIBLE_WEB3_VERSION}`,
      packageJsonPath,
    },
  };
}

/**
 * Fixes Solana dependency compatibility by pinning web3.js to v1.x
 * @param {string} cwd - Project directory
 * @param {boolean} dryRun - If true, don't write changes
 * @returns {{ fixed: boolean, changes: object }}
 */
export function fixSolanaCompat(cwd, dryRun = false) {
  const check = checkSolanaCompat(cwd);

  if (!check.hasIssue) {
    return {
      fixed: false,
      changes: null,
      reason: check.details.message || 'No compatibility issue detected',
    };
  }

  const packageJsonPath = check.details.packageJsonPath;
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

  const oldVersion = packageJson.dependencies?.['@solana/web3.js'] ||
                     packageJson.devDependencies?.['@solana/web3.js'];

  // Determine where to fix (dependencies or devDependencies)
  const isDevDep = packageJson.devDependencies?.['@solana/web3.js'] !== undefined;
  const depKey = isDevDep ? 'devDependencies' : 'dependencies';

  const changes = {
    package: '@solana/web3.js',
    from: oldVersion,
    to: COMPATIBLE_WEB3_VERSION,
    location: depKey,
  };

  if (!dryRun) {
    packageJson[depKey]['@solana/web3.js'] = COMPATIBLE_WEB3_VERSION;
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  }

  return {
    fixed: true,
    changes,
    dryRun,
    packageJsonPath,
  };
}

// ============================================================================
// Main Execution
// ============================================================================

function main() {
  const args = parseArgs(process.argv);

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  if (!args.cwd) {
    console.error('Error: --cwd is required');
    console.error('Run with --help for usage information');
    process.exit(1);
  }

  if (!existsSync(args.cwd)) {
    console.error(`Error: Directory does not exist: ${args.cwd}`);
    process.exit(1);
  }

  console.log('Solana Dependency Compatibility Checker');
  console.log('=======================================\n');
  console.log(`Project: ${args.cwd}\n`);

  // Check for compatibility issues
  const check = checkSolanaCompat(args.cwd);

  if (!check.hasIssue) {
    console.log('Status: COMPATIBLE');
    console.log(`Details: ${check.details.message || check.details.error || 'No issues'}`);

    if (check.details.web3Version) {
      console.log(`@solana/web3.js version: ${check.details.web3Version}`);
    }

    if (check.details.walletAdapterPackages?.length > 0) {
      console.log(`Wallet adapter packages: ${check.details.walletAdapterPackages.join(', ')}`);
    }

    process.exit(0);
  }

  // Found compatibility issue
  console.log('Status: INCOMPATIBLE');
  console.log(`\nIssue: ${check.details.message}`);
  console.log(`@solana/web3.js version: ${check.details.web3Version}`);
  console.log(`Wallet adapter packages: ${check.details.walletAdapterPackages.join(', ')}`);
  console.log(`\nRecommendation: ${check.details.recommendation}`);

  if (args.fix || args.dryRun) {
    console.log(`\n--- ${args.dryRun ? 'Dry Run' : 'Applying Fix'} ---\n`);

    const fix = fixSolanaCompat(args.cwd, args.dryRun);

    if (fix.fixed) {
      console.log(`${args.dryRun ? 'Would change' : 'Changed'}: ${fix.changes.package}`);
      console.log(`  From: ${fix.changes.from}`);
      console.log(`  To: ${fix.changes.to}`);
      console.log(`  Location: ${fix.changes.location}`);

      if (!args.dryRun) {
        console.log(`\nFile updated: ${fix.packageJsonPath}`);
        console.log('\nRun "npm install" to apply the changes.');
      }
    }
  } else {
    console.log('\nRun with --fix to automatically resolve this issue.');
  }

  // Exit with error code if issue not fixed
  if (!args.fix) {
    process.exit(1);
  }
}

// Only run main if this is the entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
