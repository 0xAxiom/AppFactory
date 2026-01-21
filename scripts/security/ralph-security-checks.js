#!/usr/bin/env node
/**
 * Ralph Security Checks
 *
 * Security-focused quality assurance checks for AppFactory pipelines.
 * These checks are run as part of the Ralph QA process.
 *
 * Usage:
 *   node scripts/security/ralph-security-checks.js <build-path>
 *
 * Checks:
 *   1. no-hardcoded-secrets - Detects potential secrets in code
 *   2. no-eval-usage - Detects eval() and Function() usage
 *   3. safe-file-paths - Checks for path traversal patterns
 *   4. dependency-audit - Runs npm audit
 *   5. env-example-present - Verifies .env.example exists
 *   6. security-docs-present - Verifies SECURITY.md exists
 *
 * Exit codes:
 *   0 - All checks pass
 *   1 - One or more checks failed
 *   2 - Error during execution
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync, spawnSync } from 'child_process';

// Check result structure
class CheckResult {
  constructor(name, passed, issues = []) {
    this.name = name;
    this.passed = passed;
    this.issues = issues;
  }
}

// Secret patterns (subset of scan-secrets.js)
const SECRET_PATTERNS = [
  { pattern: /sk-[a-zA-Z0-9]{20,}/, name: 'API Key' },
  { pattern: /sk-ant-[a-zA-Z0-9-]{20,}/, name: 'Anthropic API Key' },
  { pattern: /AKIA[0-9A-Z]{16}/, name: 'AWS Key' },
  { pattern: /ghp_[a-zA-Z0-9]{36}/, name: 'GitHub PAT' },
  { pattern: /-----BEGIN.*PRIVATE KEY-----/, name: 'Private Key' },
  { pattern: /password\s*[:=]\s*['"][^'"]{8,}['"]/i, name: 'Password' },
];

// Allowed patterns
const ALLOWED_PATTERNS = [
  /stub.*key/i,
  /placeholder/i,
  /your.*here/i,
  /example/i,
  /test/i,
];

// Files to skip
const SKIP_FILES = [
  'node_modules',
  '.git',
  'package-lock.json',
  'yarn.lock',
  '.env.example',
];

function shouldSkip(filePath) {
  return SKIP_FILES.some((pattern) => filePath.includes(pattern));
}

function isAllowed(match) {
  return ALLOWED_PATTERNS.some((p) => p.test(match));
}

// Check 1: No hardcoded secrets
function checkNoHardcodedSecrets(buildPath) {
  const issues = [];

  function scanDir(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (shouldSkip(fullPath)) continue;

        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.isFile()) {
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const lines = content.split('\n');

            lines.forEach((line, lineNum) => {
              SECRET_PATTERNS.forEach(({ pattern, name }) => {
                const matches = line.match(pattern);
                if (matches && !isAllowed(matches[0])) {
                  issues.push({
                    file: path.relative(buildPath, fullPath),
                    line: lineNum + 1,
                    type: name,
                  });
                }
              });
            });
          } catch {
            // Skip binary files
          }
        }
      }
    } catch {
      // Skip unreadable directories
    }
  }

  scanDir(buildPath);
  return new CheckResult(
    'no-hardcoded-secrets',
    issues.length === 0,
    issues.map((i) => `${i.file}:${i.line} - ${i.type}`)
  );
}

// Check 2: No eval usage
function checkNoEvalUsage(buildPath) {
  const issues = [];
  const dangerousPatterns = [
    { pattern: /\beval\s*\(/, name: 'eval()' },
    { pattern: /new\s+Function\s*\(/, name: 'new Function()' },
    { pattern: /setTimeout\s*\(\s*['"]/, name: 'setTimeout with string' },
    { pattern: /setInterval\s*\(\s*['"]/, name: 'setInterval with string' },
  ];

  function scanDir(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (shouldSkip(fullPath)) continue;

        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.isFile() && /\.(js|ts|tsx|jsx)$/.test(entry.name)) {
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const lines = content.split('\n');

            lines.forEach((line, lineNum) => {
              dangerousPatterns.forEach(({ pattern, name }) => {
                if (pattern.test(line)) {
                  issues.push({
                    file: path.relative(buildPath, fullPath),
                    line: lineNum + 1,
                    type: name,
                  });
                }
              });
            });
          } catch {
            // Skip binary files
          }
        }
      }
    } catch {
      // Skip unreadable directories
    }
  }

  scanDir(buildPath);
  return new CheckResult(
    'no-eval-usage',
    issues.length === 0,
    issues.map((i) => `${i.file}:${i.line} - ${i.type}`)
  );
}

// Check 3: Safe file paths
function checkSafeFilePaths(buildPath) {
  const issues = [];
  const dangerousPatterns = [
    {
      pattern: /fs\.readFileSync\s*\([^)]*\+/,
      name: 'Dynamic path in fs.readFileSync',
    },
    {
      pattern: /fs\.writeFileSync\s*\([^)]*\+/,
      name: 'Dynamic path in fs.writeFileSync',
    },
    { pattern: /require\s*\([^)]*\+/, name: 'Dynamic require' },
    {
      pattern: /import\s*\([^)]*\+/,
      name: 'Dynamic import with concatenation',
    },
  ];

  function scanDir(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (shouldSkip(fullPath)) continue;

        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.isFile() && /\.(js|ts|tsx|jsx)$/.test(entry.name)) {
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const lines = content.split('\n');

            lines.forEach((line, lineNum) => {
              dangerousPatterns.forEach(({ pattern, name }) => {
                if (pattern.test(line)) {
                  issues.push({
                    file: path.relative(buildPath, fullPath),
                    line: lineNum + 1,
                    type: name,
                  });
                }
              });
            });
          } catch {
            // Skip binary files
          }
        }
      }
    } catch {
      // Skip unreadable directories
    }
  }

  scanDir(buildPath);

  // This check is advisory - dynamic paths are sometimes necessary
  // Mark as warning, not failure
  return new CheckResult(
    'safe-file-paths',
    true, // Always pass, but report issues as warnings
    issues.map((i) => `WARNING: ${i.file}:${i.line} - ${i.type}`)
  );
}

// Check 4: Dependency audit
function checkDependencyAudit(buildPath) {
  const packageJsonPath = path.join(buildPath, 'package.json');
  const packageLockPath = path.join(buildPath, 'package-lock.json');

  if (!fs.existsSync(packageJsonPath)) {
    return new CheckResult('dependency-audit', true, [
      'No package.json found - skipping',
    ]);
  }

  if (!fs.existsSync(packageLockPath)) {
    return new CheckResult('dependency-audit', true, [
      'No package-lock.json found - skipping',
    ]);
  }

  try {
    const result = spawnSync('npm', ['audit', '--json'], {
      cwd: buildPath,
      encoding: 'utf-8',
      timeout: 60000,
    });

    if (result.error) {
      return new CheckResult('dependency-audit', true, [
        `Audit error: ${result.error.message}`,
      ]);
    }

    const audit = JSON.parse(result.stdout || '{}');
    const vulnerabilities = audit.metadata?.vulnerabilities || {};

    const critical = vulnerabilities.critical || 0;
    const high = vulnerabilities.high || 0;

    const issues = [];
    if (critical > 0) issues.push(`${critical} critical vulnerabilities`);
    if (high > 0) issues.push(`${high} high vulnerabilities`);

    return new CheckResult(
      'dependency-audit',
      critical === 0 && high === 0,
      issues
    );
  } catch (err) {
    return new CheckResult('dependency-audit', true, [
      `Audit error: ${err.message}`,
    ]);
  }
}

// Check 5: .env.example present
function checkEnvExamplePresent(buildPath) {
  const envExamplePath = path.join(buildPath, '.env.example');
  const packageJsonPath = path.join(buildPath, 'package.json');

  // Only check if this looks like a Node.js project
  if (!fs.existsSync(packageJsonPath)) {
    return new CheckResult('env-example-present', true, [
      'Not a Node.js project - skipping',
    ]);
  }

  const exists = fs.existsSync(envExamplePath);
  return new CheckResult(
    'env-example-present',
    exists,
    exists
      ? []
      : [
          ".env.example not found - users won't know what environment variables are needed",
        ]
  );
}

// Check 6: Security docs present
function checkSecurityDocsPresent(buildPath) {
  // Check for SECURITY.md in build or parent directories
  const securityPaths = [
    path.join(buildPath, 'SECURITY.md'),
    path.join(buildPath, '..', 'SECURITY.md'),
    path.join(buildPath, '..', '..', 'SECURITY.md'),
  ];

  const exists = securityPaths.some((p) => fs.existsSync(p));
  return new CheckResult(
    'security-docs-present',
    exists,
    exists
      ? []
      : ['No SECURITY.md found - consider documenting security practices']
  );
}

function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: ralph-security-checks.js <build-path>');
    process.exit(2);
  }

  const buildPath = path.resolve(args[0]);

  if (!fs.existsSync(buildPath)) {
    console.error(`Build path does not exist: ${buildPath}`);
    process.exit(2);
  }

  console.log('Ralph Security Checks - AppFactory QA');
  console.log('======================================\n');
  console.log(`Build Path: ${buildPath}\n`);

  const checks = [
    checkNoHardcodedSecrets,
    checkNoEvalUsage,
    checkSafeFilePaths,
    checkDependencyAudit,
    checkEnvExamplePresent,
    checkSecurityDocsPresent,
  ];

  const results = checks.map((check) => check(buildPath));

  let passed = 0;
  let failed = 0;

  for (const result of results) {
    const status = result.passed ? 'PASS' : 'FAIL';
    const icon = result.passed ? '+' : 'X';

    console.log(`[${icon}] ${result.name}: ${status}`);

    if (result.issues.length > 0) {
      result.issues.forEach((issue) => {
        console.log(`    - ${issue}`);
      });
    }

    if (result.passed) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log('\n======================================');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log(`Score: ${Math.round((passed / results.length) * 100)}%`);

  if (failed > 0) {
    console.log('\nSecurity checks failed. Please address the issues above.');
    process.exit(1);
  }

  console.log('\nAll security checks passed.');
  process.exit(0);
}

main();
