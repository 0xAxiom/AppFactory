#!/usr/bin/env node
/**
 * Secret Scanner
 *
 * Scans the codebase for potential hardcoded secrets, API keys, and credentials.
 * Used as a pre-commit hook and CI check.
 *
 * Usage:
 *   node scripts/security/scan-secrets.js [path]
 *   node scripts/security/scan-secrets.js --staged  # Only staged files
 *
 * Exit codes:
 *   0 - No secrets found
 *   1 - Potential secrets detected
 *   2 - Error during scan
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Secret patterns to detect
const SECRET_PATTERNS = [
  // API Keys - specific prefixes
  { pattern: /sk-[a-zA-Z0-9]{20,}/, name: 'OpenAI API Key' },
  { pattern: /sk-ant-[a-zA-Z0-9-]{20,}/, name: 'Anthropic API Key' },
  { pattern: /AKIA[0-9A-Z]{16}/, name: 'AWS Access Key ID' },
  // Note: AWS Secret Access Key pattern removed - too many false positives
  // AWS keys should be detected via AKIA prefix or explicit assignment patterns
  { pattern: /ghp_[a-zA-Z0-9]{36}/, name: 'GitHub Personal Access Token' },
  { pattern: /gho_[a-zA-Z0-9]{36}/, name: 'GitHub OAuth Token' },
  { pattern: /ghu_[a-zA-Z0-9]{36}/, name: 'GitHub User-to-Server Token' },
  { pattern: /ghs_[a-zA-Z0-9]{36}/, name: 'GitHub Server-to-Server Token' },
  { pattern: /github_pat_[a-zA-Z0-9_]{22,}/, name: 'GitHub Fine-grained PAT' },

  // Private Keys
  {
    pattern: /-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/,
    name: 'Private Key',
  },
  { pattern: /-----BEGIN PGP PRIVATE KEY BLOCK-----/, name: 'PGP Private Key' },

  // Generic Secrets - only in assignment context
  {
    pattern: /password\s*[:=]\s*['"][^'"]{8,}['"]/,
    name: 'Hardcoded Password',
    ignoreCase: true,
  },
  {
    pattern: /secret\s*[:=]\s*['"][^'"]{8,}['"]/,
    name: 'Hardcoded Secret',
    ignoreCase: true,
  },
  {
    pattern: /api[_-]?key\s*[:=]\s*['"][a-zA-Z0-9-_]{20,}['"]/,
    name: 'Hardcoded API Key',
    ignoreCase: true,
  },

  // Database URLs with credentials
  {
    pattern: /mongodb(\+srv)?:\/\/[^:]+:[^@]+@/,
    name: 'MongoDB Connection String with Credentials',
  },
  {
    pattern: /postgres(ql)?:\/\/[^:]+:[^@]+@/,
    name: 'PostgreSQL Connection String with Credentials',
  },
  {
    pattern: /mysql:\/\/[^:]+:[^@]+@/,
    name: 'MySQL Connection String with Credentials',
  },
  {
    pattern: /redis:\/\/[^:]+:[^@]+@/,
    name: 'Redis Connection String with Credentials',
  },

  // Tokens - specific patterns
  { pattern: /xox[baprs]-[0-9]{10,13}-[a-zA-Z0-9-]{24,}/, name: 'Slack Token' },

  // Cloud Providers - specific patterns
  { pattern: /AIza[0-9A-Za-z-_]{35}/, name: 'Google API Key' },
  {
    pattern: /[0-9]+-[a-zA-Z0-9_]{32}\.apps\.googleusercontent\.com/,
    name: 'Google OAuth Client ID',
  },
];

// Files/patterns to skip
const SKIP_PATTERNS = [
  /node_modules/,
  /\.git\//,
  /package-lock\.json$/,
  /yarn\.lock$/,
  /\.env\.example$/,
  /\.md$/, // Skip markdown files (documentation)
  /SECURITY\.md$/, // Explicitly skip this file
  /scan-secrets\.js$/, // Skip this script
  /\.test\.(ts|js)$/, // Skip test files
  /\.spec\.(ts|js)$/,
  /vendor\//, // Skip vendor directories
  /references\//, // Skip reference directories
];

// Allowed patterns (known safe)
const ALLOWED_PATTERNS = [
  /sk-ant-stub-key-for-testing/, // Test stub
  /your_.*_here/i, // Placeholder patterns
  /YOUR_.*_KEY/, // Placeholder patterns
  /PLACEHOLDER/i,
  /example\.com/,
  /localhost/,
  /127\.0\.0\.1/,
];

function shouldSkipFile(filePath) {
  return SKIP_PATTERNS.some((pattern) => pattern.test(filePath));
}

function isAllowedSecret(match) {
  return ALLOWED_PATTERNS.some((pattern) => pattern.test(match));
}

function scanFile(filePath) {
  const findings = [];

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, lineNum) => {
      SECRET_PATTERNS.forEach(({ pattern, name, ignoreCase }) => {
        const regex = new RegExp(pattern.source, ignoreCase ? 'gi' : 'g');
        const matches = line.match(regex);

        if (matches) {
          matches.forEach((match) => {
            if (!isAllowedSecret(match)) {
              findings.push({
                file: filePath,
                line: lineNum + 1,
                type: name,
                match: match.substring(0, 20) + '...', // Truncate for safety
              });
            }
          });
        }
      });
    });
  } catch (err) {
    // Skip files that can't be read (binary, etc.)
    if (err.code !== 'ENOENT' && err.code !== 'EISDIR') {
      console.error(`Warning: Could not read ${filePath}: ${err.message}`);
    }
  }

  return findings;
}

function getFilesToScan(basePath, staged = false) {
  if (staged) {
    try {
      const output = execSync(
        'git diff --cached --name-only --diff-filter=ACM',
        {
          encoding: 'utf-8',
          cwd: basePath,
        }
      );
      return output
        .trim()
        .split('\n')
        .filter(Boolean)
        .map((f) => path.join(basePath, f));
    } catch {
      console.error('Not a git repository or git not available');
      process.exit(2);
    }
  }

  // Recursively get all files
  const files = [];

  function walkDir(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (!shouldSkipFile(fullPath)) {
            walkDir(fullPath);
          }
        } else {
          if (!shouldSkipFile(fullPath)) {
            files.push(fullPath);
          }
        }
      }
    } catch (err) {
      // Skip directories that can't be read
    }
  }

  walkDir(basePath);
  return files;
}

function main() {
  const args = process.argv.slice(2);
  const staged = args.includes('--staged');
  const basePath = args.find((a) => !a.startsWith('--')) || process.cwd();

  console.log('Secret Scanner - AppFactory Security');
  console.log('====================================\n');

  const files = getFilesToScan(basePath, staged);
  console.log(`Scanning ${files.length} files...\n`);

  let allFindings = [];

  for (const file of files) {
    // Skip files that match skip patterns (e.g., this script itself)
    if (shouldSkipFile(file)) {
      continue;
    }
    const findings = scanFile(file);
    allFindings = allFindings.concat(findings);
  }

  if (allFindings.length === 0) {
    console.log('No potential secrets detected.');
    process.exit(0);
  }

  console.log(`Found ${allFindings.length} potential secret(s):\n`);

  allFindings.forEach(({ file, line, type, match }) => {
    console.log(`[${type}]`);
    console.log(`  File: ${file}`);
    console.log(`  Line: ${line}`);
    console.log(`  Match: ${match}`);
    console.log('');
  });

  console.log('\nAction Required:');
  console.log('1. If these are real secrets, remove them immediately');
  console.log(
    '2. If these are false positives, add patterns to ALLOWED_PATTERNS'
  );
  console.log('3. Use .env files for secrets and .env.example for templates');

  process.exit(1);
}

main();
