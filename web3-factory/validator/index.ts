#!/usr/bin/env node
/**
 * Factory Build Validator
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
// ZIP CONTRACT v2.0 - Enforced exactly as specified
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
 * Required core dependencies (all apps)
 */
const REQUIRED_CORE_DEPENDENCIES = [
  'next',
  'react',
  'react-dom',
];

/**
 * Solana dependencies (only required if app uses wallet integration)
 */
const SOLANA_DEPENDENCIES = [
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
  tokenEnabled: boolean;
  skillCompliance?: SkillComplianceResult;
}

interface SkillComplianceResult {
  reactBestPractices: number;
  webDesignGuidelines: number;
  overall: number;
  violations: SkillViolation[];
}

interface SkillViolation {
  skill: string;
  rule: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  file: string;
  message: string;
}

interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if the app has Solana/wallet dependencies
 */
function hasWalletIntegration(buildDir: string): boolean {
  const packagePath = path.join(buildDir, 'package.json');

  if (!fs.existsSync(packagePath)) {
    return false;
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

    // Check if any Solana dependency is present
    return SOLANA_DEPENDENCIES.some(dep => dep in allDeps);
  } catch {
    return false;
  }
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

function checkCoreDependencies(buildDir: string): CheckResult[] {
  const results: CheckResult[] = [];
  const packagePath = path.join(buildDir, 'package.json');

  if (!fs.existsSync(packagePath)) {
    return [{
      name: 'Core Dependencies',
      passed: false,
      message: 'package.json not found',
    }];
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

    for (const dep of REQUIRED_CORE_DEPENDENCIES) {
      const hasIt = dep in allDeps;
      results.push({
        name: `Core Dependency: ${dep}`,
        passed: hasIt,
        message: hasIt ? allDeps[dep] : 'MISSING (per ZIP_CONTRACT.md)',
      });
    }
  } catch (error) {
    results.push({
      name: 'Core Dependencies',
      passed: false,
      message: 'Failed to parse package.json',
    });
  }

  return results;
}

function checkSolanaDependencies(buildDir: string): CheckResult[] {
  const results: CheckResult[] = [];
  const packagePath = path.join(buildDir, 'package.json');

  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

    for (const dep of SOLANA_DEPENDENCIES) {
      const hasIt = dep in allDeps;
      results.push({
        name: `Wallet Dependency: ${dep}`,
        passed: hasIt,
        message: hasIt ? allDeps[dep] : 'MISSING (required for token integration)',
      });
    }
  } catch (error) {
    results.push({
      name: 'Wallet Dependencies',
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

  // Required per ZIP_CONTRACT.md for token-enabled apps
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

/**
 * Check that this is a full build, not a prompt pack
 * Prompt packs contain only .md files and no package.json with scripts
 */
function checkNotPromptPack(buildDir: string): CheckResult[] {
  const results: CheckResult[] = [];

  // Count file types at root level
  const items = fs.readdirSync(buildDir);
  const mdFiles = items.filter(f => f.endsWith('.md'));
  const hasPackageJson = items.includes('package.json');
  const hasSrcDir = items.includes('src') && fs.statSync(path.join(buildDir, 'src')).isDirectory();

  // Detect prompt pack pattern: mostly .md files, no src/, no valid package.json
  const isPromptPack = mdFiles.length >= 2 && !hasSrcDir && (
    !hasPackageJson ||
    (() => {
      try {
        const pkg = JSON.parse(fs.readFileSync(path.join(buildDir, 'package.json'), 'utf-8'));
        return !pkg.scripts?.dev || !pkg.scripts?.build;
      } catch {
        return true;
      }
    })()
  );

  if (isPromptPack) {
    results.push({
      name: 'Full Build Check',
      passed: false,
      message: 'PROMPT PACK DETECTED - This appears to be a prompt pack (only .md files), not a runnable app. Web3 Factory requires full builds with src/, package.json, and working dev/build scripts.',
    });
  } else {
    results.push({
      name: 'Full Build Check',
      passed: true,
      message: 'Output is a full build (has src/ and package.json)',
    });
  }

  return results;
}

/**
 * Check that package.json has required npm scripts (dev AND build)
 */
function checkRequiredScripts(buildDir: string): CheckResult[] {
  const results: CheckResult[] = [];
  const packagePath = path.join(buildDir, 'package.json');

  if (!fs.existsSync(packagePath)) {
    return [{
      name: 'Required Scripts',
      passed: false,
      message: 'package.json not found',
    }];
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    const scripts = pkg.scripts || {};

    const hasDev = 'dev' in scripts;
    const hasBuild = 'build' in scripts;

    results.push({
      name: 'Script: dev',
      passed: hasDev,
      message: hasDev ? `"${scripts.dev}"` : 'MISSING - package.json must have "dev" script',
    });

    results.push({
      name: 'Script: build',
      passed: hasBuild,
      message: hasBuild ? `"${scripts.build}"` : 'MISSING - package.json must have "build" script',
    });

  } catch (error) {
    results.push({
      name: 'Required Scripts',
      passed: false,
      message: 'Failed to parse package.json',
    });
  }

  return results;
}

/**
 * Check skill compliance (react-best-practices + web-design-guidelines)
 * This is a simplified check - full compliance is verified during Ralph QA
 */
function checkSkillCompliance(buildDir: string): CheckResult[] {
  const results: CheckResult[] = [];
  const srcDir = path.join(buildDir, 'src');

  if (!fs.existsSync(srcDir)) {
    return [{
      name: 'Skill Compliance',
      passed: false,
      message: 'src/ directory not found',
    }];
  }

  const violations: Array<{ rule: string; severity: string; file: string; message: string }> = [];

  // Scan source files for common violations
  function scanFile(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(buildDir, filePath);

    // React Best Practices checks

    // Check for barrel imports (CRITICAL)
    if (content.match(/from\s+['"]@\/components['"]/)) {
      violations.push({
        rule: 'bundle-imports',
        severity: 'CRITICAL',
        file: relativePath,
        message: 'Barrel import from @/components - import from specific files instead',
      });
    }

    // Check for sequential awaits pattern (CRITICAL)
    const awaitMatches = content.match(/await\s+\w+\([^)]*\);\s*\n\s*await\s+\w+\([^)]*\)/g);
    if (awaitMatches && awaitMatches.length > 0) {
      violations.push({
        rule: 'async-parallel',
        severity: 'CRITICAL',
        file: relativePath,
        message: 'Sequential awaits detected - consider Promise.all for parallel operations',
      });
    }

    // Web Design Guidelines checks

    // Check for monospace body font (HIGH)
    if (content.match(/font-family:\s*['"]?(Monaco|Consolas|Courier|monospace)/i)) {
      if (!content.match(/\.code|\.mono|code|pre|address/i)) {
        violations.push({
          rule: 'typography-sans-serif',
          severity: 'HIGH',
          file: relativePath,
          message: 'Monospace font used for non-code content - use sans-serif for body text',
        });
      }
    }

    // Check for missing page animations (MEDIUM) - only for page.tsx files
    if (filePath.endsWith('page.tsx')) {
      if (!content.includes('motion.') && !content.includes('framer-motion')) {
        violations.push({
          rule: 'animation-page-entrance',
          severity: 'MEDIUM',
          file: relativePath,
          message: 'Page missing entrance animation - add Framer Motion animation',
        });
      }
    }

    // Check for spinner-only loading (MEDIUM)
    if (content.match(/ActivityIndicator|Spinner.*loading|isLoading.*Spinner/i)) {
      if (!content.includes('Skeleton')) {
        violations.push({
          rule: 'loading-skeleton',
          severity: 'MEDIUM',
          file: relativePath,
          message: 'Spinner used for loading - prefer skeleton loaders',
        });
      }
    }

    // Check for bare empty states (MEDIUM)
    if (content.match(/No\s+(items?|results?|data)['"`]/i)) {
      if (!content.match(/EmptyState|empty-state|icon.*text.*button/i)) {
        violations.push({
          rule: 'empty-state-design',
          severity: 'MEDIUM',
          file: relativePath,
          message: 'Basic "No items" text detected - design empty state with icon, message, and CTA',
        });
      }
    }
  }

  // Scan all TypeScript/JavaScript files
  function scanDirectory(dir: string) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !['node_modules', '.next'].includes(item)) {
        scanDirectory(fullPath);
      } else if (item.match(/\.(tsx?|jsx?)$/)) {
        scanFile(fullPath);
      }
    }
  }

  scanDirectory(srcDir);

  // Calculate compliance scores
  const criticalViolations = violations.filter(v => v.severity === 'CRITICAL').length;
  const highViolations = violations.filter(v => v.severity === 'HIGH').length;
  const mediumViolations = violations.filter(v => v.severity === 'MEDIUM').length;

  // Score calculation (simplified)
  const baseScore = 100;
  const score = Math.max(0, baseScore - (criticalViolations * 10) - (highViolations * 5) - (mediumViolations * 2));

  // Add results
  if (criticalViolations > 0) {
    results.push({
      name: 'Skill Compliance: CRITICAL violations',
      passed: false,
      message: `${criticalViolations} CRITICAL violation(s) found - must fix before proceeding`,
    });

    for (const v of violations.filter(v => v.severity === 'CRITICAL')) {
      results.push({
        name: `  ${v.rule}`,
        passed: false,
        message: `${v.file}: ${v.message}`,
      });
    }
  }

  if (highViolations > 0) {
    results.push({
      name: 'Skill Compliance: HIGH violations',
      passed: score >= 90,
      message: `${highViolations} HIGH violation(s) found`,
    });
  }

  if (mediumViolations > 0) {
    results.push({
      name: 'Skill Compliance: MEDIUM violations',
      passed: true,
      message: `${mediumViolations} MEDIUM violation(s) - fix before Ralph QA`,
    });
  }

  // Overall score
  const passed = criticalViolations === 0 && score >= 90;
  results.push({
    name: 'Skill Compliance Score',
    passed: passed,
    message: passed
      ? `${score}% - meets threshold (≥90%)`
      : `${score}% - below threshold (≥90%), fix violations`,
  });

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
  const tokenEnabled = hasWalletIntegration(buildDir);

  console.log('\n' + '='.repeat(60));
  console.log('  Factory Build Validator');
  console.log('  Contract: ZIP_CONTRACT.md v2.0');
  console.log('='.repeat(60) + '\n');

  console.log(`Directory: ${buildDir}`);
  console.log(`Token Integration: ${tokenEnabled ? 'ENABLED' : 'DISABLED'}\n`);

  const checks: CheckResult[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  // Build check groups based on whether token integration is enabled
  const checkGroups = [
    { name: 'Full Build Verification', fn: () => checkNotPromptPack(buildDir) },
    { name: 'Required Scripts', fn: () => checkRequiredScripts(buildDir) },
    { name: 'Required Files', fn: () => checkRequiredFiles(buildDir) },
    { name: 'Forbidden Files', fn: () => checkForbiddenFiles(buildDir) },
    { name: 'Core Dependencies', fn: () => checkCoreDependencies(buildDir) },
  ];

  // Only add wallet checks if token integration is detected
  if (tokenEnabled) {
    checkGroups.push(
      { name: 'Wallet Dependencies', fn: () => checkSolanaDependencies(buildDir) },
      { name: 'Wallet Provider', fn: () => checkWalletProvider(buildDir) },
    );
  }

  // Always run these checks
  checkGroups.push(
    { name: 'Security Patterns', fn: () => checkSecurityPatterns(buildDir) },
    { name: 'Size Limits', fn: () => checkFileSizes(buildDir) },
    { name: 'Skill Compliance', fn: () => checkSkillCompliance(buildDir) },
  );

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

  // Write factory_ready.json
  writeFactoryReadyJson(buildDir, passed, checks, errors, tokenEnabled);

  return { passed, checks, errors, warnings, tokenEnabled };
}

/**
 * Write factory_ready.json per Factory Ready Standard
 */
function writeFactoryReadyJson(
  buildDir: string,
  passed: boolean,
  checks: CheckResult[],
  errors: string[],
  tokenEnabled: boolean
): void {
  const packagePath = path.join(buildDir, 'package.json');
  let projectName = 'unknown';

  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    projectName = pkg.name || 'unknown';
  } catch {
    // Keep default
  }

  const factoryReady = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    project: {
      name: projectName,
      pipeline: 'web3-factory',
      path: buildDir,
    },
    gates: {
      build: {
        status: 'SKIP' as const,
        details: 'Run npm install && npm run build to verify'
      },
      run: {
        status: 'SKIP' as const,
        details: 'Run npm run dev and verify localhost:3000 responds'
      },
      test: {
        status: 'SKIP' as const,
        details: 'Run curl http://localhost:3000 to verify'
      },
      validate: {
        status: passed ? 'PASS' as const : 'FAIL' as const,
        details: passed
          ? 'All contract requirements met'
          : `${errors.length} error(s): ${errors.slice(0, 3).join('; ')}${errors.length > 3 ? '...' : ''}`
      },
      package: {
        status: 'SKIP' as const,
        details: 'Run npm run zip to create package'
      },
      launch_ready: {
        status: passed ? 'PASS' as const : 'FAIL' as const,
        details: passed ? 'Validation passed' : 'Fix validation errors first'
      },
      token_integration: {
        status: tokenEnabled ? 'PASS' as const : 'SKIP' as const,
        details: tokenEnabled ? 'Wallet integration detected and validated' : 'Not opted in'
      },
      skill_compliance: {
        status: passed ? 'PASS' as const : 'FAIL' as const,
        details: passed
          ? 'Skill compliance checks passed (≥90%)'
          : 'Skill compliance violations detected - see validation output'
      },
    },
    overall: passed ? 'PASS' : 'FAIL',
    next_steps: passed
      ? [
          'Run: npm run build',
          'Run: npm run dev',
          'Test at http://localhost:3000',
          tokenEnabled ? 'Configure NEXT_PUBLIC_TOKEN_MINT when ready' : null,
        ].filter(Boolean)
      : [
          'Fix the validation errors listed above',
          'Run validation again',
          'See CLAUDE.md for requirements',
        ],
  };

  const outputPath = path.join(buildDir, 'factory_ready.json');
  fs.writeFileSync(outputPath, JSON.stringify(factoryReady, null, 2));
  console.log(`  Wrote: factory_ready.json\n`);
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
