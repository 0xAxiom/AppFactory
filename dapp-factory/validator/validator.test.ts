/**
 * Unit tests for dapp-factory/validator/index.ts
 * Tests build validation logic
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Since validator is a CLI script, we test the underlying logic
// by recreating the key validation functions

// Required files per ZIP_CONTRACT.md
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

const REQUIRED_CORE_DEPENDENCIES = ['next', 'react', 'react-dom'];

const SOLANA_DEPENDENCIES = [
  '@solana/wallet-adapter-react',
  '@solana/wallet-adapter-react-ui',
  '@solana/wallet-adapter-wallets',
  '@solana/web3.js',
];

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

const FORBIDDEN_PATTERNS = [
  { pattern: /private[_-]?key/i, message: 'private_key / privateKey' },
  { pattern: /secret[_-]?key/i, message: 'secret_key / secretKey' },
  { pattern: /\bmnemonic\b/i, message: 'mnemonic' },
  { pattern: /seed[_-]?phrase/i, message: 'seed_phrase / seedPhrase' },
];

// Helper functions mirroring validator logic
function checkRequiredFiles(
  buildDir: string
): { name: string; passed: boolean; message: string }[] {
  const results: { name: string; passed: boolean; message: string }[] = [];

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

function checkForbiddenFiles(
  buildDir: string
): { name: string; passed: boolean; message: string }[] {
  const results: { name: string; passed: boolean; message: string }[] = [];

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

  if (results.length === 0) {
    results.push({
      name: 'Forbidden files',
      passed: true,
      message: 'None found',
    });
  }

  return results;
}

function checkCoreDependencies(
  buildDir: string
): { name: string; passed: boolean; message: string }[] {
  const results: { name: string; passed: boolean; message: string }[] = [];
  const packagePath = path.join(buildDir, 'package.json');

  if (!fs.existsSync(packagePath)) {
    return [
      {
        name: 'Core Dependencies',
        passed: false,
        message: 'package.json not found',
      },
    ];
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
  } catch {
    results.push({
      name: 'Core Dependencies',
      passed: false,
      message: 'Failed to parse package.json',
    });
  }

  return results;
}

function hasWalletIntegration(buildDir: string): boolean {
  const packagePath = path.join(buildDir, 'package.json');

  if (!fs.existsSync(packagePath)) {
    return false;
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

    return SOLANA_DEPENDENCIES.some((dep) => dep in allDeps);
  } catch {
    return false;
  }
}

function checkSecurityPatterns(
  srcDir: string
): { pattern: string; file: string }[] {
  const findings: { pattern: string; file: string }[] = [];

  if (!fs.existsSync(srcDir)) {
    return findings;
  }

  function scanDir(dir: string) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && item !== 'node_modules') {
        scanDir(fullPath);
      } else if (
        item.endsWith('.ts') ||
        item.endsWith('.tsx') ||
        item.endsWith('.js') ||
        item.endsWith('.jsx')
      ) {
        const content = fs.readFileSync(fullPath, 'utf-8');

        for (const { pattern, message } of FORBIDDEN_PATTERNS) {
          if (pattern.test(content)) {
            findings.push({
              file: path.relative(srcDir, fullPath),
              pattern: message,
            });
          }
        }
      }
    }
  }

  scanDir(srcDir);
  return findings;
}

describe('validator module', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'validator-test-'));
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('checkRequiredFiles', () => {
    it('should detect missing required files', () => {
      // Empty directory - all files missing
      const results = checkRequiredFiles(testDir);

      expect(results.length).toBe(REQUIRED_FILES.length);
      expect(results.every((r) => !r.passed)).toBe(true);
    });

    it('should detect present required files', () => {
      // Create required files
      for (const file of REQUIRED_FILES) {
        const filePath = path.join(testDir, file);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, '', 'utf-8');
      }

      const results = checkRequiredFiles(testDir);

      expect(results.every((r) => r.passed)).toBe(true);
    });

    it('should correctly report partial files', () => {
      // Create only some files
      fs.writeFileSync(path.join(testDir, 'package.json'), '{}', 'utf-8');
      fs.writeFileSync(path.join(testDir, 'tsconfig.json'), '{}', 'utf-8');

      const results = checkRequiredFiles(testDir);

      const passed = results.filter((r) => r.passed);
      const failed = results.filter((r) => !r.passed);

      expect(passed.length).toBe(2);
      expect(failed.length).toBe(REQUIRED_FILES.length - 2);
    });
  });

  describe('checkForbiddenFiles', () => {
    it('should pass when no forbidden files exist', () => {
      const results = checkForbiddenFiles(testDir);

      expect(results.length).toBe(1);
      expect(results[0]!.passed).toBe(true);
    });

    it('should detect node_modules', () => {
      fs.mkdirSync(path.join(testDir, 'node_modules'));

      const results = checkForbiddenFiles(testDir);

      expect(
        results.some((r) => !r.passed && r.name.includes('node_modules'))
      ).toBe(true);
    });

    it('should detect .git directory', () => {
      fs.mkdirSync(path.join(testDir, '.git'));

      const results = checkForbiddenFiles(testDir);

      expect(results.some((r) => !r.passed && r.name.includes('.git'))).toBe(
        true
      );
    });

    it('should detect .env file', () => {
      fs.writeFileSync(path.join(testDir, '.env'), 'SECRET=value', 'utf-8');

      const results = checkForbiddenFiles(testDir);

      expect(results.some((r) => !r.passed && r.name.includes('.env'))).toBe(
        true
      );
    });

    it('should detect multiple forbidden items', () => {
      fs.mkdirSync(path.join(testDir, 'node_modules'));
      fs.mkdirSync(path.join(testDir, '.next'));
      fs.writeFileSync(path.join(testDir, '.env.local'), '', 'utf-8');

      const results = checkForbiddenFiles(testDir);

      expect(results.filter((r) => !r.passed).length).toBe(3);
    });
  });

  describe('checkCoreDependencies', () => {
    it('should fail when package.json is missing', () => {
      const results = checkCoreDependencies(testDir);

      expect(results.length).toBe(1);
      expect(results[0]!.passed).toBe(false);
      expect(results[0]!.message).toContain('not found');
    });

    it('should pass when all dependencies are present', () => {
      const pkg = {
        dependencies: {
          next: '^14.0.0',
          react: '^18.0.0',
          'react-dom': '^18.0.0',
        },
      };
      fs.writeFileSync(
        path.join(testDir, 'package.json'),
        JSON.stringify(pkg),
        'utf-8'
      );

      const results = checkCoreDependencies(testDir);

      expect(results.every((r) => r.passed)).toBe(true);
    });

    it('should detect missing dependencies', () => {
      const pkg = {
        dependencies: {
          next: '^14.0.0',
        },
      };
      fs.writeFileSync(
        path.join(testDir, 'package.json'),
        JSON.stringify(pkg),
        'utf-8'
      );

      const results = checkCoreDependencies(testDir);

      const passed = results.filter((r) => r.passed);
      const failed = results.filter((r) => !r.passed);

      expect(passed.length).toBe(1);
      expect(failed.length).toBe(2);
    });

    it('should check devDependencies too', () => {
      const pkg = {
        devDependencies: {
          next: '^14.0.0',
          react: '^18.0.0',
          'react-dom': '^18.0.0',
        },
      };
      fs.writeFileSync(
        path.join(testDir, 'package.json'),
        JSON.stringify(pkg),
        'utf-8'
      );

      const results = checkCoreDependencies(testDir);

      expect(results.every((r) => r.passed)).toBe(true);
    });

    it('should handle invalid JSON', () => {
      fs.writeFileSync(path.join(testDir, 'package.json'), 'not json', 'utf-8');

      const results = checkCoreDependencies(testDir);

      expect(results.some((r) => r.message.includes('Failed to parse'))).toBe(
        true
      );
    });
  });

  describe('hasWalletIntegration', () => {
    it('should return false for missing package.json', () => {
      expect(hasWalletIntegration(testDir)).toBe(false);
    });

    it('should return false when no wallet deps', () => {
      const pkg = {
        dependencies: {
          next: '^14.0.0',
        },
      };
      fs.writeFileSync(
        path.join(testDir, 'package.json'),
        JSON.stringify(pkg),
        'utf-8'
      );

      expect(hasWalletIntegration(testDir)).toBe(false);
    });

    it('should return true when wallet deps are present', () => {
      const pkg = {
        dependencies: {
          '@solana/wallet-adapter-react': '^0.15.0',
          '@solana/web3.js': '^2.0.0',
        },
      };
      fs.writeFileSync(
        path.join(testDir, 'package.json'),
        JSON.stringify(pkg),
        'utf-8'
      );

      expect(hasWalletIntegration(testDir)).toBe(true);
    });
  });

  describe('checkSecurityPatterns', () => {
    it('should return empty array for non-existent directory', () => {
      const results = checkSecurityPatterns(path.join(testDir, 'nonexistent'));

      expect(results).toEqual([]);
    });

    it('should detect private_key pattern', () => {
      const srcDir = path.join(testDir, 'src');
      fs.mkdirSync(srcDir);
      fs.writeFileSync(
        path.join(srcDir, 'bad.ts'),
        'const private_key = "secret"',
        'utf-8'
      );

      const results = checkSecurityPatterns(srcDir);

      expect(results.length).toBe(1);
      expect(results[0]!.pattern).toContain('private_key');
    });

    it('should detect privateKey pattern', () => {
      const srcDir = path.join(testDir, 'src');
      fs.mkdirSync(srcDir);
      fs.writeFileSync(
        path.join(srcDir, 'bad.tsx'),
        'const privateKey = "secret"',
        'utf-8'
      );

      const results = checkSecurityPatterns(srcDir);

      expect(results.length).toBe(1);
    });

    it('should detect mnemonic pattern', () => {
      const srcDir = path.join(testDir, 'src');
      fs.mkdirSync(srcDir);
      fs.writeFileSync(
        path.join(srcDir, 'wallet.ts'),
        'const mnemonic = "word1 word2"',
        'utf-8'
      );

      const results = checkSecurityPatterns(srcDir);

      expect(results.length).toBe(1);
      expect(results[0]!.pattern).toContain('mnemonic');
    });

    it('should detect seed_phrase pattern', () => {
      const srcDir = path.join(testDir, 'src');
      fs.mkdirSync(srcDir);
      fs.writeFileSync(
        path.join(srcDir, 'config.js'),
        'let seed_phrase = ""',
        'utf-8'
      );

      const results = checkSecurityPatterns(srcDir);

      expect(results.length).toBe(1);
    });

    it('should scan nested directories', () => {
      const srcDir = path.join(testDir, 'src');
      const nestedDir = path.join(srcDir, 'lib', 'utils');
      fs.mkdirSync(nestedDir, { recursive: true });
      fs.writeFileSync(
        path.join(nestedDir, 'secret.ts'),
        'const secret_key = "bad"',
        'utf-8'
      );

      const results = checkSecurityPatterns(srcDir);

      expect(results.length).toBe(1);
    });

    it('should find multiple violations', () => {
      const srcDir = path.join(testDir, 'src');
      fs.mkdirSync(srcDir);
      fs.writeFileSync(
        path.join(srcDir, 'file1.ts'),
        'const private_key = "a"',
        'utf-8'
      );
      fs.writeFileSync(
        path.join(srcDir, 'file2.ts'),
        'const mnemonic = "b"',
        'utf-8'
      );

      const results = checkSecurityPatterns(srcDir);

      expect(results.length).toBe(2);
    });

    it('should not flag safe code', () => {
      const srcDir = path.join(testDir, 'src');
      fs.mkdirSync(srcDir);
      fs.writeFileSync(
        path.join(srcDir, 'safe.ts'),
        `
        const publicKey = "abc123";
        const walletAddress = "0x...";
        export function getKey() { return publicKey; }
      `,
        'utf-8'
      );

      const results = checkSecurityPatterns(srcDir);

      expect(results.length).toBe(0);
    });
  });

  describe('integration: full build validation scenario', () => {
    function createValidBuild(
      buildDir: string,
      includeWallet: boolean = false
    ) {
      // Create required files
      const pkg = {
        name: 'test-dapp',
        scripts: { dev: 'next dev', build: 'next build' },
        dependencies: {
          next: '^14.0.0',
          react: '^18.0.0',
          'react-dom': '^18.0.0',
          ...(includeWallet && {
            '@solana/wallet-adapter-react': '^0.15.0',
            '@solana/wallet-adapter-react-ui': '^0.15.0',
            '@solana/wallet-adapter-wallets': '^0.15.0',
            '@solana/web3.js': '^2.0.0',
          }),
        },
      };

      fs.writeFileSync(
        path.join(buildDir, 'package.json'),
        JSON.stringify(pkg, null, 2),
        'utf-8'
      );
      fs.writeFileSync(path.join(buildDir, 'tsconfig.json'), '{}', 'utf-8');
      fs.writeFileSync(
        path.join(buildDir, 'next.config.js'),
        'module.exports = {}',
        'utf-8'
      );
      fs.writeFileSync(
        path.join(buildDir, 'tailwind.config.ts'),
        'export default {}',
        'utf-8'
      );
      fs.writeFileSync(
        path.join(buildDir, 'postcss.config.js'),
        'module.exports = {}',
        'utf-8'
      );
      fs.writeFileSync(path.join(buildDir, '.env.example'), '', 'utf-8');

      const appDir = path.join(buildDir, 'src', 'app');
      fs.mkdirSync(appDir, { recursive: true });
      fs.writeFileSync(
        path.join(appDir, 'layout.tsx'),
        'export default function Layout() {}',
        'utf-8'
      );
      fs.writeFileSync(
        path.join(appDir, 'page.tsx'),
        'export default function Page() {}',
        'utf-8'
      );
      fs.writeFileSync(
        path.join(appDir, 'providers.tsx'),
        includeWallet
          ? `
        import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
        import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
        export default function Providers() {}
      `
          : 'export default function Providers() {}',
        'utf-8'
      );
      fs.writeFileSync(path.join(appDir, 'globals.css'), '', 'utf-8');
    }

    it('should pass validation for complete build', () => {
      createValidBuild(testDir);

      const requiredResults = checkRequiredFiles(testDir);
      const forbiddenResults = checkForbiddenFiles(testDir);
      const depsResults = checkCoreDependencies(testDir);
      const securityResults = checkSecurityPatterns(path.join(testDir, 'src'));

      expect(requiredResults.every((r) => r.passed)).toBe(true);
      expect(forbiddenResults.every((r) => r.passed)).toBe(true);
      expect(depsResults.every((r) => r.passed)).toBe(true);
      expect(securityResults.length).toBe(0);
    });

    it('should detect wallet integration in valid build', () => {
      createValidBuild(testDir, true);

      expect(hasWalletIntegration(testDir)).toBe(true);
    });

    it('should fail validation when forbidden files present', () => {
      createValidBuild(testDir);
      fs.mkdirSync(path.join(testDir, 'node_modules'));

      const forbiddenResults = checkForbiddenFiles(testDir);

      expect(forbiddenResults.some((r) => !r.passed)).toBe(true);
    });
  });
});
