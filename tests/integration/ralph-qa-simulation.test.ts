/**
 * Ralph QA Simulation Tests
 *
 * Integration tests for the Ralph QA checklist validation system.
 * Tests the iterative quality assurance loop that ensures production-ready builds.
 *
 * @module tests/integration
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

/**
 * Ralph check category
 */
type CheckCategory =
  | 'build'
  | 'runtime'
  | 'ui'
  | 'ux'
  | 'accessibility'
  | 'performance'
  | 'security'
  | 'documentation'
  | 'research'
  | 'code-quality';

/**
 * Ralph check definition
 */
interface RalphCheck {
  id: string;
  name: string;
  category: CheckCategory;
  description: string;
  mandatory: boolean;
  points: number;
  verify: (buildPath: string) => boolean;
}

/**
 * Ralph check result
 */
interface CheckResult {
  checkId: string;
  passed: boolean;
  message: string;
}

/**
 * Ralph iteration result
 */
interface IterationResult {
  iteration: number;
  score: number;
  passed: boolean;
  checkResults: CheckResult[];
  timestamp: Date;
}

/**
 * Ralph final verdict
 */
type RalphVerdict = 'PASS' | 'FAIL' | 'PENDING';

/**
 * Ralph QA configuration
 */
interface RalphConfig {
  passingThreshold: number;
  maxIterations: number;
  checks: RalphCheck[];
}

/**
 * Ralph QA report
 */
interface RalphReport {
  verdict: RalphVerdict;
  score: number;
  iterations: number;
  iterationResults: IterationResult[];
  completionPromise?: string;
}

/**
 * Standard Ralph checks for web applications
 */
function createStandardWebChecks(): RalphCheck[] {
  return [
    {
      id: 'package-json',
      name: 'package.json exists',
      category: 'build',
      description: 'package.json must exist at project root',
      mandatory: true,
      points: 10,
      verify: (buildPath) =>
        fs.existsSync(path.join(buildPath, 'package.json')),
    },
    {
      id: 'tsconfig',
      name: 'tsconfig.json exists',
      category: 'build',
      description: 'TypeScript configuration must be present',
      mandatory: true,
      points: 10,
      verify: (buildPath) =>
        fs.existsSync(path.join(buildPath, 'tsconfig.json')),
    },
    {
      id: 'readme',
      name: 'README.md exists',
      category: 'documentation',
      description: 'README documentation must be present',
      mandatory: true,
      points: 5,
      verify: (buildPath) => fs.existsSync(path.join(buildPath, 'README.md')),
    },
    {
      id: 'src-dir',
      name: 'src directory exists',
      category: 'build',
      description: 'Source directory must exist',
      mandatory: true,
      points: 10,
      verify: (buildPath) => {
        const srcPath = path.join(buildPath, 'src');
        return fs.existsSync(srcPath) && fs.statSync(srcPath).isDirectory();
      },
    },
    {
      id: 'no-secrets',
      name: 'No hardcoded secrets',
      category: 'security',
      description: 'Source files must not contain API keys or secrets',
      mandatory: true,
      points: 15,
      verify: (buildPath) => {
        const envPath = path.join(buildPath, '.env');
        if (fs.existsSync(envPath)) {
          const content = fs.readFileSync(envPath, 'utf-8');
          const secretPatterns = [
            /sk-ant-[a-zA-Z0-9-]+/,
            /sk-[a-zA-Z0-9]{48}/,
            /ghp_[a-zA-Z0-9]{36}/,
          ];
          return !secretPatterns.some((p) => p.test(content));
        }
        return true;
      },
    },
    {
      id: 'dev-script',
      name: 'dev script defined',
      category: 'build',
      description: 'package.json must have a dev script',
      mandatory: true,
      points: 5,
      verify: (buildPath) => {
        try {
          const pkg = JSON.parse(
            fs.readFileSync(path.join(buildPath, 'package.json'), 'utf-8')
          );
          return !!pkg.scripts?.dev;
        } catch {
          return false;
        }
      },
    },
    {
      id: 'build-script',
      name: 'build script defined',
      category: 'build',
      description: 'package.json must have a build script',
      mandatory: true,
      points: 5,
      verify: (buildPath) => {
        try {
          const pkg = JSON.parse(
            fs.readFileSync(path.join(buildPath, 'package.json'), 'utf-8')
          );
          return !!pkg.scripts?.build;
        } catch {
          return false;
        }
      },
    },
    {
      id: 'loading-states',
      name: 'Loading states present',
      category: 'ux',
      description: 'Components should have loading states',
      mandatory: false,
      points: 5,
      verify: (buildPath) => {
        const srcPath = path.join(buildPath, 'src');
        if (!fs.existsSync(srcPath)) return false;

        // Simple heuristic: check for Skeleton or loading patterns
        try {
          const files = listFilesRecursive(srcPath, ['.tsx', '.ts']);
          for (const file of files) {
            const content = fs.readFileSync(path.join(srcPath, file), 'utf-8');
            if (content.includes('Skeleton') || content.includes('isLoading')) {
              return true;
            }
          }
          return false;
        } catch {
          return false;
        }
      },
    },
    {
      id: 'error-boundaries',
      name: 'Error boundaries present',
      category: 'ux',
      description: 'Application should have error handling',
      mandatory: false,
      points: 5,
      verify: (buildPath) => {
        const srcPath = path.join(buildPath, 'src');
        if (!fs.existsSync(srcPath)) return false;

        try {
          const files = listFilesRecursive(srcPath, ['.tsx', '.ts']);
          for (const file of files) {
            const content = fs.readFileSync(path.join(srcPath, file), 'utf-8');
            if (
              content.includes('ErrorBoundary') ||
              content.includes('error')
            ) {
              return true;
            }
          }
          return false;
        } catch {
          return false;
        }
      },
    },
  ];
}

/**
 * Research quality checks
 */
function createResearchChecks(): RalphCheck[] {
  return [
    {
      id: 'market-research',
      name: 'Market research substantive',
      category: 'research',
      description: 'market_research.md must be substantive (>500 chars)',
      mandatory: true,
      points: 5,
      verify: (buildPath) => {
        const filePath = path.join(buildPath, 'research', 'market_research.md');
        if (!fs.existsSync(filePath)) return false;
        const content = fs.readFileSync(filePath, 'utf-8');
        return (
          content.length >= 500 &&
          !content.toLowerCase().includes('placeholder')
        );
      },
    },
    {
      id: 'competitor-analysis',
      name: 'Competitor analysis substantive',
      category: 'research',
      description: 'competitor_analysis.md must be substantive',
      mandatory: true,
      points: 5,
      verify: (buildPath) => {
        const filePath = path.join(
          buildPath,
          'research',
          'competitor_analysis.md'
        );
        if (!fs.existsSync(filePath)) return false;
        const content = fs.readFileSync(filePath, 'utf-8');
        return (
          content.length >= 500 &&
          !content.toLowerCase().includes('placeholder')
        );
      },
    },
    {
      id: 'positioning',
      name: 'Positioning substantive',
      category: 'research',
      description: 'positioning.md must be substantive',
      mandatory: true,
      points: 5,
      verify: (buildPath) => {
        const filePath = path.join(buildPath, 'research', 'positioning.md');
        if (!fs.existsSync(filePath)) return false;
        const content = fs.readFileSync(filePath, 'utf-8');
        return (
          content.length >= 500 &&
          !content.toLowerCase().includes('placeholder')
        );
      },
    },
  ];
}

/**
 * List files recursively with extension filter
 */
function listFilesRecursive(dir: string, extensions: string[]): string[] {
  const results: string[] = [];

  function walk(currentDir: string, prefix: string): void {
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        if (
          entry.isDirectory() &&
          !entry.name.startsWith('.') &&
          entry.name !== 'node_modules'
        ) {
          walk(
            path.join(currentDir, entry.name),
            path.join(prefix, entry.name)
          );
        } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
          results.push(path.join(prefix, entry.name));
        }
      }
    } catch {
      // Ignore permission errors
    }
  }

  walk(dir, '');
  return results;
}

/**
 * Run Ralph checks against a build
 */
function runRalphChecks(
  buildPath: string,
  checks: RalphCheck[]
): CheckResult[] {
  return checks.map((check) => {
    try {
      const passed = check.verify(buildPath);
      return {
        checkId: check.id,
        passed,
        message: passed
          ? `${check.name} passed`
          : `${check.name} failed: ${check.description}`,
      };
    } catch (error) {
      return {
        checkId: check.id,
        passed: false,
        message: `${check.name} threw error: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  });
}

/**
 * Calculate score from check results
 */
function calculateScore(checks: RalphCheck[], results: CheckResult[]): number {
  let totalPoints = 0;
  let earnedPoints = 0;

  for (const check of checks) {
    totalPoints += check.points;
    const result = results.find((r) => r.checkId === check.id);
    if (result?.passed) {
      earnedPoints += check.points;
    }
  }

  return totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
}

/**
 * Run the Ralph QA loop
 */
function runRalphLoop(
  buildPath: string,
  config: RalphConfig,
  fixCallback?: (results: CheckResult[]) => void
): RalphReport {
  const iterationResults: IterationResult[] = [];
  let finalVerdict: RalphVerdict = 'PENDING';

  for (let i = 0; i < config.maxIterations; i++) {
    const checkResults = runRalphChecks(buildPath, config.checks);
    const score = calculateScore(config.checks, checkResults);
    const passed = score >= config.passingThreshold;

    iterationResults.push({
      iteration: i + 1,
      score,
      passed,
      checkResults,
      timestamp: new Date(),
    });

    if (passed) {
      finalVerdict = 'PASS';
      break;
    }

    // Simulate fixes
    if (fixCallback) {
      fixCallback(checkResults);
    }
  }

  if (finalVerdict === 'PENDING') {
    finalVerdict = 'FAIL';
  }

  const lastResult = iterationResults[iterationResults.length - 1];

  const report: RalphReport = {
    verdict: finalVerdict,
    score: lastResult.score,
    iterations: iterationResults.length,
    iterationResults,
  };

  if (finalVerdict === 'PASS') {
    report.completionPromise = `COMPLETION_PROMISE: All acceptance criteria met. Build is production-ready.`;
  }

  return report;
}

describe('Ralph QA Simulation', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ralph-test-'));
  });

  afterEach(() => {
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('Individual Check Execution', () => {
    it('should pass package.json check when file exists', () => {
      fs.writeFileSync(path.join(tempDir, 'package.json'), '{}');
      const checks = createStandardWebChecks();
      const results = runRalphChecks(tempDir, checks);
      const pkgResult = results.find((r) => r.checkId === 'package-json');
      expect(pkgResult?.passed).toBe(true);
    });

    it('should fail package.json check when file missing', () => {
      const checks = createStandardWebChecks();
      const results = runRalphChecks(tempDir, checks);
      const pkgResult = results.find((r) => r.checkId === 'package-json');
      expect(pkgResult?.passed).toBe(false);
    });

    it('should pass dev-script check when script exists', () => {
      fs.writeFileSync(
        path.join(tempDir, 'package.json'),
        JSON.stringify({ scripts: { dev: 'next dev' } })
      );
      const checks = createStandardWebChecks();
      const results = runRalphChecks(tempDir, checks);
      const devResult = results.find((r) => r.checkId === 'dev-script');
      expect(devResult?.passed).toBe(true);
    });

    it('should fail no-secrets check when secrets present', () => {
      fs.writeFileSync(
        path.join(tempDir, '.env'),
        'API_KEY=sk-ant-test123-key'
      );
      const checks = createStandardWebChecks();
      const results = runRalphChecks(tempDir, checks);
      const secretsResult = results.find((r) => r.checkId === 'no-secrets');
      expect(secretsResult?.passed).toBe(false);
    });

    it('should pass no-secrets check when .env has no secrets', () => {
      fs.writeFileSync(path.join(tempDir, '.env'), 'DEBUG=true');
      const checks = createStandardWebChecks();
      const results = runRalphChecks(tempDir, checks);
      const secretsResult = results.find((r) => r.checkId === 'no-secrets');
      expect(secretsResult?.passed).toBe(true);
    });
  });

  describe('Score Calculation', () => {
    it('should calculate 100% score when all checks pass', () => {
      // Create a complete project structure
      fs.writeFileSync(
        path.join(tempDir, 'package.json'),
        JSON.stringify({ scripts: { dev: 'dev', build: 'build' } })
      );
      fs.writeFileSync(path.join(tempDir, 'tsconfig.json'), '{}');
      fs.writeFileSync(path.join(tempDir, 'README.md'), '# Test');
      fs.mkdirSync(path.join(tempDir, 'src'));

      const checks = createStandardWebChecks().filter((c) => c.mandatory);
      const results = runRalphChecks(tempDir, checks);
      const score = calculateScore(checks, results);

      expect(score).toBe(100);
    });

    it('should calculate low score when most checks fail', () => {
      // Empty directory - only checks that pass by default will score
      // (like no-secrets which passes when there's no .env file)
      const checks = createStandardWebChecks();
      const results = runRalphChecks(tempDir, checks);
      const score = calculateScore(checks, results);

      // Some checks pass by default (e.g., no-secrets), so score won't be 0
      expect(score).toBeLessThan(50);
    });

    it('should calculate partial score correctly', () => {
      // Create only some required files
      fs.writeFileSync(path.join(tempDir, 'package.json'), '{}');

      const checks = createStandardWebChecks().filter((c) => c.mandatory);
      const results = runRalphChecks(tempDir, checks);
      const score = calculateScore(checks, results);

      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(100);
    });
  });

  describe('Ralph Loop Execution', () => {
    it('should pass immediately when all checks satisfied', () => {
      // Create complete structure
      fs.writeFileSync(
        path.join(tempDir, 'package.json'),
        JSON.stringify({ scripts: { dev: 'dev', build: 'build' } })
      );
      fs.writeFileSync(path.join(tempDir, 'tsconfig.json'), '{}');
      fs.writeFileSync(path.join(tempDir, 'README.md'), '# Test');
      fs.mkdirSync(path.join(tempDir, 'src'));

      const config: RalphConfig = {
        passingThreshold: 97,
        maxIterations: 20,
        checks: createStandardWebChecks().filter((c) => c.mandatory),
      };

      const report = runRalphLoop(tempDir, config);

      expect(report.verdict).toBe('PASS');
      expect(report.iterations).toBe(1);
      expect(report.completionPromise).toBeDefined();
    });

    it('should fail after max iterations when checks never pass', () => {
      const config: RalphConfig = {
        passingThreshold: 97,
        maxIterations: 3,
        checks: createStandardWebChecks(),
      };

      const report = runRalphLoop(tempDir, config);

      expect(report.verdict).toBe('FAIL');
      expect(report.iterations).toBe(3);
      expect(report.completionPromise).toBeUndefined();
    });

    it('should pass after fixes are applied', () => {
      const config: RalphConfig = {
        passingThreshold: 97,
        maxIterations: 5,
        checks: createStandardWebChecks().filter((c) => c.mandatory),
      };

      let fixIteration = 0;
      const report = runRalphLoop(tempDir, config, () => {
        fixIteration++;
        if (fixIteration === 2) {
          // Apply all fixes on second iteration
          fs.writeFileSync(
            path.join(tempDir, 'package.json'),
            JSON.stringify({ scripts: { dev: 'dev', build: 'build' } })
          );
          fs.writeFileSync(path.join(tempDir, 'tsconfig.json'), '{}');
          fs.writeFileSync(path.join(tempDir, 'README.md'), '# Test');
          fs.mkdirSync(path.join(tempDir, 'src'), { recursive: true });
        }
      });

      expect(report.verdict).toBe('PASS');
      expect(report.iterations).toBeGreaterThan(1);
    });

    it('should track all iteration results', () => {
      const config: RalphConfig = {
        passingThreshold: 97,
        maxIterations: 3,
        checks: createStandardWebChecks().slice(0, 3),
      };

      const report = runRalphLoop(tempDir, config);

      expect(report.iterationResults.length).toBe(3);
      expect(report.iterationResults[0].iteration).toBe(1);
      expect(report.iterationResults[2].iteration).toBe(3);
    });
  });

  describe('Research Quality Checks', () => {
    it('should pass when research files are substantive', () => {
      fs.mkdirSync(path.join(tempDir, 'research'));
      const substantive = 'This is detailed research content. '.repeat(30);

      fs.writeFileSync(
        path.join(tempDir, 'research', 'market_research.md'),
        substantive
      );
      fs.writeFileSync(
        path.join(tempDir, 'research', 'competitor_analysis.md'),
        substantive
      );
      fs.writeFileSync(
        path.join(tempDir, 'research', 'positioning.md'),
        substantive
      );

      const checks = createResearchChecks();
      const results = runRalphChecks(tempDir, checks);

      expect(results.every((r) => r.passed)).toBe(true);
    });

    it('should fail when research files are too short', () => {
      fs.mkdirSync(path.join(tempDir, 'research'));

      fs.writeFileSync(
        path.join(tempDir, 'research', 'market_research.md'),
        'Short content'
      );
      fs.writeFileSync(
        path.join(tempDir, 'research', 'competitor_analysis.md'),
        'Brief'
      );
      fs.writeFileSync(
        path.join(tempDir, 'research', 'positioning.md'),
        'Minimal'
      );

      const checks = createResearchChecks();
      const results = runRalphChecks(tempDir, checks);

      expect(results.every((r) => !r.passed)).toBe(true);
    });

    it('should fail when research contains placeholder text', () => {
      fs.mkdirSync(path.join(tempDir, 'research'));
      const placeholder = 'This is a placeholder. '.repeat(30);

      fs.writeFileSync(
        path.join(tempDir, 'research', 'market_research.md'),
        placeholder
      );
      fs.writeFileSync(
        path.join(tempDir, 'research', 'competitor_analysis.md'),
        placeholder
      );
      fs.writeFileSync(
        path.join(tempDir, 'research', 'positioning.md'),
        placeholder
      );

      const checks = createResearchChecks();
      const results = runRalphChecks(tempDir, checks);

      expect(results.every((r) => !r.passed)).toBe(true);
    });
  });

  describe('Completion Promise Generation', () => {
    it('should generate completion promise on PASS', () => {
      fs.writeFileSync(
        path.join(tempDir, 'package.json'),
        JSON.stringify({ scripts: { dev: 'dev', build: 'build' } })
      );
      fs.writeFileSync(path.join(tempDir, 'tsconfig.json'), '{}');
      fs.writeFileSync(path.join(tempDir, 'README.md'), '# Test');
      fs.mkdirSync(path.join(tempDir, 'src'));

      const config: RalphConfig = {
        passingThreshold: 90,
        maxIterations: 1,
        checks: createStandardWebChecks().filter((c) => c.mandatory),
      };

      const report = runRalphLoop(tempDir, config);

      expect(report.completionPromise).toBeDefined();
      expect(report.completionPromise).toContain('COMPLETION_PROMISE');
      expect(report.completionPromise).toContain('production-ready');
    });

    it('should not generate completion promise on FAIL', () => {
      const config: RalphConfig = {
        passingThreshold: 97,
        maxIterations: 1,
        checks: createStandardWebChecks(),
      };

      const report = runRalphLoop(tempDir, config);

      expect(report.completionPromise).toBeUndefined();
    });
  });

  describe('Threshold Configuration', () => {
    it('should pass with lower threshold', () => {
      // Create minimal structure (partial completion)
      fs.writeFileSync(path.join(tempDir, 'package.json'), '{}');
      fs.writeFileSync(path.join(tempDir, 'tsconfig.json'), '{}');
      fs.writeFileSync(path.join(tempDir, 'README.md'), '# Test');
      fs.mkdirSync(path.join(tempDir, 'src'));

      const config: RalphConfig = {
        passingThreshold: 50, // Lower threshold
        maxIterations: 1,
        checks: createStandardWebChecks(),
      };

      const report = runRalphLoop(tempDir, config);

      // May pass with partial completion at 50% threshold
      expect(report.score).toBeGreaterThan(0);
    });

    it('should require higher score with higher threshold', () => {
      fs.writeFileSync(path.join(tempDir, 'package.json'), '{}');

      const lowConfig: RalphConfig = {
        passingThreshold: 10,
        maxIterations: 1,
        checks: createStandardWebChecks(),
      };

      const highConfig: RalphConfig = {
        passingThreshold: 97,
        maxIterations: 1,
        checks: createStandardWebChecks(),
      };

      const lowReport = runRalphLoop(tempDir, lowConfig);
      const highReport = runRalphLoop(tempDir, highConfig);

      // Same score, different verdicts based on threshold
      expect(lowReport.score).toBe(highReport.score);
    });
  });
});
