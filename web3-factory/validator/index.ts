#!/usr/bin/env node
/**
 * Web3 Factory Build Validator
 *
 * Validates a build against ZIP_CONTRACT.md before upload.
 * NO AI - just file/structure checking.
 *
 * Usage: npm run validate (from within a build directory)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// ZIP CONTRACT v1.0 - Enforced exactly as specified
// ============================================================================

/**
 * Required files per ZIP_CONTRACT.md
 */
const REQUIRED_FILES = [
  'package.json',
  'tsconfig.json',
  'next.config.js',
  'tailwind.config.ts',
  'postcss.config.js',
  '.env.example',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/providers.tsx',
  'src/app/globals.css',
];

/**
 * Required dependencies per ZIP_CONTRACT.md
 */
const REQUIRED_DEPENDENCIES = [
  '@solana/wallet-adapter-react',
  '@solana/wallet-adapter-react-ui',
  '@solana/wallet-adapter-wallets',
  '@solana/web3.js',
];

/**
 * Forbidden files per ZIP_CONTRACT.md
 */
const FORBIDDEN_FILES = [
  'node_modules',
  '.git',
  '.next',
  'out',
  'dist',
  '.env',
  '.env.local',
  '.env.production',
];

/**
 * Forbidden code patterns per ZIP_CONTRACT.md (case-insensitive)
 */
const FORBIDDEN_PATTERNS = [
  { pattern: /private[_-]?key/i, message: 'private_key / privateKey' },
  { pattern: /secret[_-]?key/i, message: 'secret_key / secretKey' },
  { pattern: /\bmnemonic\b/i, message: 'mnemonic' },
  { pattern: /seed[_-]?phrase/i, message: 'seed_phrase / seedPhrase' },
];

/**
 * Size limits per ZIP_CONTRACT.md
 */
const SIZE_LIMITS = {
  totalZip: 50 * 1024 * 1024,      // 50 MB
  singleFile: 10 * 1024 * 1024,   // 10 MB
  maxFiles: 10000,
};

// ============================================================================
// Validation Types
// ============================================================================

interface ValidationResult {
  passed: boolean;
  checks: CheckResult[];
  errors: string[];
  warnings: string[];
}

interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
}

// ============================================================================
// Validation Functions
// ============================================================================

function checkRequiredFiles(buildDir: string): CheckResult[] {
  const results: CheckResult[] = [];

  for (const file of REQUIRED_FILES) {
    const fullPath = path.join(buildDir, file);
    const exists = fs.existsSync(fullPath);

    results.push({
      name: `Required: ${file}`,
      passed: exists,
      message: exists ? 'Found' : 'MISSING (per ZIP_CONTRACT.md)',
    });
  }

  return results;
}

function checkForbiddenFiles(buildDir: string): CheckResult[] {
  const results: CheckResult[] = [];

  for (const forbidden of FORBIDDEN_FILES) {
    const fullPath = path.join(buildDir, forbidden);
    const exists = fs.existsSync(fullPath);

    if (exists) {
      results.push({
        name: `Forbidden: ${forbidden}`,
        passed: false,
        message: `FOUND - must be removed (per ZIP_CONTRACT.md)`,
      });
    }
  }

  // If no forbidden files found, add a passing check
  if (results.length === 0) {
    results.push({
      name: 'Forbidden files',
      passed: true,
      message: 'None found',
    });
  }

  return results;
}

function checkDependencies(buildDir: string): CheckResult[] {
  const results: CheckResult[] = [];
  const packagePath = path.join(buildDir, 'package.json');

  if (!fs.existsSync(packagePath)) {
    return [{
      name: 'Dependencies',
      passed: false,
      message: 'package.json not found',
    }];
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

    for (const dep of REQUIRED_DEPENDENCIES) {
      const hasIt = dep in allDeps;
      results.push({
        name: `Dependency: ${dep}`,
        passed: hasIt,
        message: hasIt ? allDeps[dep] : 'MISSING (per ZIP_CONTRACT.md)',
      });
    }
  } catch (error) {
    results.push({
      name: 'Dependencies',
      passed: false,
      message: 'Failed to parse package.json',
    });
  }

  return results;
}

function checkWalletProvider(buildDir: string): CheckResult[] {
  const results: CheckResult[] = [];
  const providersPath = path.join(buildDir, 'src/app/providers.tsx');

  if (!fs.existsSync(providersPath)) {
    return [{
      name: 'Wallet Provider',
      passed: false,
      message: 'providers.tsx not found',
    }];
  }

  const content = fs.readFileSync(providersPath, 'utf-8');

  // Required per ZIP_CONTRACT.md
  const hasConnectionProvider = content.includes('ConnectionProvider');
  const hasWalletProvider = content.includes('WalletProvider');
  const hasPhantom = content.includes('PhantomWalletAdapter');

  results.push({
    name: 'ConnectionProvider',
    passed: hasConnectionProvider,
    message: hasConnectionProvider ? 'Found' : 'MISSING (per ZIP_CONTRACT.md)',
  });

  results.push({
    name: 'WalletProvider',
    passed: hasWalletProvider,
    message: hasWalletProvider ? 'Found' : 'MISSING (per ZIP_CONTRACT.md)',
  });

  results.push({
    name: 'PhantomWalletAdapter',
    passed: hasPhantom,
    message: hasPhantom ? 'Found' : 'MISSING (per ZIP_CONTRACT.md)',
  });

  // Forbidden per ZIP_CONTRACT.md
  const hasBackpack = content.includes('BackpackWalletAdapter');
  if (hasBackpack) {
    results.push({
      name: 'BackpackWalletAdapter',
      passed: false,
      message: 'FOUND - must be removed (causes errors, per ZIP_CONTRACT.md)',
    });
  }

  return results;
}

function checkSecurityPatterns(buildDir: string): CheckResult[] {
  const results: CheckResult[] = [];
  const srcDir = path.join(buildDir, 'src');

  if (!fs.existsSync(srcDir)) {
    return [{
      name: 'Security scan',
      passed: false,
      message: 'src/ directory not found',
    }];
  }

  const findings: Array<{ file: string; pattern: string }> = [];

  function scanDir(dir: string) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && item !== 'node_modules') {
        scanDir(fullPath);
      } else if (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.js') || item.endsWith('.jsx')) {
        const content = fs.readFileSync(fullPath, 'utf-8');

        for (const { pattern, message } of FORBIDDEN_PATTERNS) {
          if (pattern.test(content)) {
            findings.push({
              file: path.relative(buildDir, fullPath),
              pattern: message,
            });
          }
        }
      }
    }
  }

  scanDir(srcDir);

  if (findings.length > 0) {
    for (const finding of findings) {
      results.push({
        name: `Forbidden pattern: ${finding.pattern}`,
        passed: false,
        message: `Found in ${finding.file} (per ZIP_CONTRACT.md)`,
      });
    }
  } else {
    results.push({
      name: 'Security patterns',
      passed: true,
      message: 'No forbidden patterns found',
    });
  }

  return results;
}

function checkFileSizes(buildDir: string): CheckResult[] {
  const results: CheckResult[] = [];
  let totalSize = 0;
  let fileCount = 0;
  let oversizedFiles: string[] = [];

  function scanDir(dir: string) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);

      // Skip forbidden directories
      if (FORBIDDEN_FILES.includes(item)) continue;

      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else {
        fileCount++;
        totalSize += stat.size;

        if (stat.size > SIZE_LIMITS.singleFile) {
          oversizedFiles.push(`${path.relative(buildDir, fullPath)} (${(stat.size / 1024 / 1024).toFixed(1)} MB)`);
        }
      }
    }
  }

  scanDir(buildDir);

  // File count check
  results.push({
    name: 'File count',
    passed: fileCount <= SIZE_LIMITS.maxFiles,
    message: fileCount <= SIZE_LIMITS.maxFiles
      ? `${fileCount} files (limit: ${SIZE_LIMITS.maxFiles})`
      : `${fileCount} files EXCEEDS limit of ${SIZE_LIMITS.maxFiles}`,
  });

  // Total size estimate (actual zip will be smaller due to compression)
  const totalMB = (totalSize / 1024 / 1024).toFixed(1);
  const underLimit = totalSize <= SIZE_LIMITS.totalZip * 2; // Allow 2x for uncompressed
  results.push({
    name: 'Estimated size',
    passed: underLimit,
    message: underLimit
      ? `~${totalMB} MB uncompressed`
      : `~${totalMB} MB may exceed 50 MB zip limit`,
  });

  // Oversized files
  if (oversizedFiles.length > 0) {
    for (const file of oversizedFiles) {
      results.push({
        name: 'Oversized file',
        passed: false,
        message: `${file} exceeds 10 MB limit`,
      });
    }
  }

  return results;
}

// ============================================================================
// Main Validation
// ============================================================================

function validate(buildDir: string): ValidationResult {
  console.log('\n' + '='.repeat(60));
  console.log('  Web3 Factory Build Validator');
  console.log('  Contract: ZIP_CONTRACT.md v1.0');
  console.log('='.repeat(60) + '\n');

  console.log(`Directory: ${buildDir}\n`);

  const checks: CheckResult[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  // Run all checks
  const checkGroups = [
    { name: 'Required Files', fn: () => checkRequiredFiles(buildDir) },
    { name: 'Forbidden Files', fn: () => checkForbiddenFiles(buildDir) },
    { name: 'Dependencies', fn: () => checkDependencies(buildDir) },
    { name: 'Wallet Provider', fn: () => checkWalletProvider(buildDir) },
    { name: 'Security Patterns', fn: () => checkSecurityPatterns(buildDir) },
    { name: 'Size Limits', fn: () => checkFileSizes(buildDir) },
  ];

  for (const group of checkGroups) {
    console.log(`\n--- ${group.name} ---\n`);

    const results = group.fn();
    for (const result of results) {
      checks.push(result);
      printCheck(result);

      if (!result.passed) {
        errors.push(`${group.name}: ${result.name} - ${result.message}`);
      }
    }
  }

  // Summary
  const passed = errors.length === 0;

  console.log('\n' + '='.repeat(60));

  if (passed) {
    console.log('\n  VALIDATION PASSED\n');
    console.log('  Your build meets ZIP_CONTRACT.md requirements.');
    console.log('\n  NEXT STEP: npm run zip\n');
  } else {
    console.log('\n  VALIDATION FAILED\n');
    console.log(`  ${errors.length} error(s) found.\n`);
    console.log('  Fix these issues and run validation again.');
    console.log('  See ZIP_CONTRACT.md for requirements.\n');
  }

  console.log('='.repeat(60) + '\n');

  return { passed, checks, errors, warnings };
}

function printCheck(result: CheckResult): void {
  const icon = result.passed ? '[PASS]' : '[FAIL]';
  const color = result.passed ? '\x1b[32m' : '\x1b[31m';
  const reset = '\x1b[0m';

  console.log(`  ${color}${icon}${reset} ${result.name}`);
  console.log(`         ${result.message}`);
}

// ============================================================================
// Entry Point
// ============================================================================

async function main(): Promise<void> {
  const buildDir = process.cwd();

  // Quick sanity check
  if (!fs.existsSync(path.join(buildDir, 'package.json'))) {
    console.error('\nError: No package.json found in current directory.\n');
    console.error('Run this command from your build directory:\n');
    console.error('  cd web3-builds/your-app');
    console.error('  npm run validate\n');
    process.exit(1);
  }

  const result = validate(buildDir);
  process.exit(result.passed ? 0 : 1);
}

main();
