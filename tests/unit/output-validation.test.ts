/**
 * Output Validation Tests
 *
 * Tests for validating generated output structures against pipeline contracts.
 * Ensures all required files, directories, and content patterns are present.
 *
 * @module tests/unit
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import {
  validateOutput,
  validatePipelineOutput,
  validatePackageScripts,
  validateResearchQuality,
  OUTPUT_CONTRACTS,
  type OutputContract,
  type OutputValidationResult,
} from '../utils/output-validator.js';

describe('Output Validation', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'appfactory-test-'));
  });

  afterEach(() => {
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('Required Files Validation', () => {
    it('should pass when all required files exist', () => {
      const contract: OutputContract = {
        pipeline: 'test',
        requiredFiles: ['package.json', 'README.md'],
        requiredDirs: [],
      };

      fs.writeFileSync(path.join(tempDir, 'package.json'), '{}');
      fs.writeFileSync(path.join(tempDir, 'README.md'), '# Test');

      const result = validateOutput(tempDir, contract);
      expect(result.passed).toBe(true);
      expect(result.failedCount).toBe(0);
    });

    it('should fail when required files are missing', () => {
      const contract: OutputContract = {
        pipeline: 'test',
        requiredFiles: ['package.json', 'README.md', 'missing.txt'],
        requiredDirs: [],
      };

      fs.writeFileSync(path.join(tempDir, 'package.json'), '{}');
      fs.writeFileSync(path.join(tempDir, 'README.md'), '# Test');

      const result = validateOutput(tempDir, contract);
      expect(result.passed).toBe(false);
      expect(result.failedCount).toBe(1);
    });

    it('should report all missing files', () => {
      const contract: OutputContract = {
        pipeline: 'test',
        requiredFiles: ['file1.txt', 'file2.txt', 'file3.txt'],
        requiredDirs: [],
      };

      const result = validateOutput(tempDir, contract);
      expect(result.failedCount).toBe(3);
    });
  });

  describe('Required Directories Validation', () => {
    it('should pass when all required directories exist', () => {
      const contract: OutputContract = {
        pipeline: 'test',
        requiredFiles: [],
        requiredDirs: ['src', 'tests'],
      };

      fs.mkdirSync(path.join(tempDir, 'src'));
      fs.mkdirSync(path.join(tempDir, 'tests'));

      const result = validateOutput(tempDir, contract);
      expect(result.passed).toBe(true);
    });

    it('should fail when required directories are missing', () => {
      const contract: OutputContract = {
        pipeline: 'test',
        requiredFiles: [],
        requiredDirs: ['src', 'tests'],
      };

      fs.mkdirSync(path.join(tempDir, 'src'));
      // 'tests' directory missing

      const result = validateOutput(tempDir, contract);
      expect(result.passed).toBe(false);
      expect(result.failedCount).toBe(1);
    });

    it('should not count a file as a directory', () => {
      const contract: OutputContract = {
        pipeline: 'test',
        requiredFiles: [],
        requiredDirs: ['src'],
      };

      // Create a file named 'src' instead of a directory
      fs.writeFileSync(path.join(tempDir, 'src'), 'content');

      const result = validateOutput(tempDir, contract);
      expect(result.passed).toBe(false);
    });
  });

  describe('Optional Files Validation', () => {
    it('should warn but not fail when optional files missing', () => {
      const contract: OutputContract = {
        pipeline: 'test',
        requiredFiles: ['package.json'],
        requiredDirs: [],
        optionalFiles: ['optional.txt'],
      };

      fs.writeFileSync(path.join(tempDir, 'package.json'), '{}');

      const result = validateOutput(tempDir, contract);
      expect(result.passed).toBe(true);
      expect(result.warningCount).toBe(1);
    });

    it('should pass check when optional file exists', () => {
      const contract: OutputContract = {
        pipeline: 'test',
        requiredFiles: [],
        requiredDirs: [],
        optionalFiles: ['optional.txt'],
      };

      fs.writeFileSync(path.join(tempDir, 'optional.txt'), 'content');

      const result = validateOutput(tempDir, contract);
      expect(result.passed).toBe(true);
      expect(result.warningCount).toBe(0);
      expect(result.passedCount).toBe(1);
    });
  });

  describe('Forbidden Files Validation', () => {
    it('should fail when forbidden files exist', () => {
      const contract: OutputContract = {
        pipeline: 'test',
        requiredFiles: [],
        requiredDirs: [],
        forbiddenFiles: ['.env'],
      };

      fs.writeFileSync(path.join(tempDir, '.env'), 'SECRET=key');

      const result = validateOutput(tempDir, contract);
      expect(result.passed).toBe(false);
      expect(result.failedCount).toBe(1);
    });

    it('should pass when forbidden files do not exist', () => {
      const contract: OutputContract = {
        pipeline: 'test',
        requiredFiles: [],
        requiredDirs: [],
        forbiddenFiles: ['.env', 'secrets.json'],
      };

      const result = validateOutput(tempDir, contract);
      expect(result.passed).toBe(true);
    });
  });

  describe('Forbidden Patterns Validation', () => {
    it('should fail when forbidden pattern found in file', () => {
      const contract: OutputContract = {
        pipeline: 'test',
        requiredFiles: [],
        requiredDirs: [],
        forbiddenPatterns: [
          { pattern: /sk-ant-[a-zA-Z0-9-]+/, description: 'Anthropic API key' },
        ],
      };

      fs.writeFileSync(
        path.join(tempDir, 'config.ts'),
        'const key = "sk-ant-api123-test";'
      );

      const result = validateOutput(tempDir, contract);
      expect(result.passed).toBe(false);

      const patternCheck = result.checks.find((c) =>
        c.name.includes('Anthropic')
      );
      expect(patternCheck?.status).toBe('fail');
    });

    it('should pass when forbidden patterns not found', () => {
      const contract: OutputContract = {
        pipeline: 'test',
        requiredFiles: [],
        requiredDirs: [],
        forbiddenPatterns: [
          { pattern: /sk-ant-[a-zA-Z0-9-]+/, description: 'Anthropic API key' },
        ],
      };

      fs.writeFileSync(
        path.join(tempDir, 'config.ts'),
        'const apiUrl = "https://api.example.com";'
      );

      const result = validateOutput(tempDir, contract);
      expect(result.passed).toBe(true);
    });
  });

  describe('Required Patterns Validation', () => {
    it('should pass when required pattern found in file', () => {
      const contract: OutputContract = {
        pipeline: 'test',
        requiredFiles: ['package.json'],
        requiredDirs: [],
        requiredPatterns: [
          {
            file: 'package.json',
            pattern: /"dev"\s*:\s*"/,
            description: 'dev script',
          },
        ],
      };

      fs.writeFileSync(
        path.join(tempDir, 'package.json'),
        JSON.stringify({
          name: 'test',
          scripts: {
            dev: 'next dev',
          },
        })
      );

      const result = validateOutput(tempDir, contract);
      expect(result.passed).toBe(true);
    });

    it('should fail when required pattern not found', () => {
      const contract: OutputContract = {
        pipeline: 'test',
        requiredFiles: ['package.json'],
        requiredDirs: [],
        requiredPatterns: [
          {
            file: 'package.json',
            pattern: /"dev"\s*:\s*"/,
            description: 'dev script',
          },
        ],
      };

      fs.writeFileSync(
        path.join(tempDir, 'package.json'),
        JSON.stringify({
          name: 'test',
          scripts: {
            build: 'next build',
          },
        })
      );

      const result = validateOutput(tempDir, contract);
      expect(result.passed).toBe(false);
    });
  });

  describe('Score Calculation', () => {
    it('should calculate 100% score when all checks pass', () => {
      const contract: OutputContract = {
        pipeline: 'test',
        requiredFiles: ['package.json'],
        requiredDirs: ['src'],
      };

      fs.writeFileSync(path.join(tempDir, 'package.json'), '{}');
      fs.mkdirSync(path.join(tempDir, 'src'));

      const result = validateOutput(tempDir, contract);
      expect(result.score).toBe(100);
    });

    it('should calculate 0% score when all checks fail', () => {
      const contract: OutputContract = {
        pipeline: 'test',
        requiredFiles: ['file1.txt', 'file2.txt'],
        requiredDirs: ['dir1', 'dir2'],
      };

      const result = validateOutput(tempDir, contract);
      expect(result.score).toBe(0);
    });

    it('should calculate partial score correctly', () => {
      const contract: OutputContract = {
        pipeline: 'test',
        requiredFiles: ['file1.txt', 'file2.txt'],
        requiredDirs: [],
      };

      fs.writeFileSync(path.join(tempDir, 'file1.txt'), 'content');

      const result = validateOutput(tempDir, contract);
      expect(result.score).toBe(50);
    });

    it('should not include optional files in score calculation', () => {
      const contract: OutputContract = {
        pipeline: 'test',
        requiredFiles: ['required.txt'],
        requiredDirs: [],
        optionalFiles: ['optional.txt'],
      };

      fs.writeFileSync(path.join(tempDir, 'required.txt'), 'content');
      // Optional file missing

      const result = validateOutput(tempDir, contract);
      expect(result.score).toBe(100); // Optional doesn't affect score
    });
  });
});

describe('Pipeline Output Validation', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'appfactory-test-'));
  });

  afterEach(() => {
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should validate against correct pipeline contract', () => {
    // Set up a minimal dapp-factory structure
    fs.writeFileSync(path.join(tempDir, 'package.json'), '{}');
    fs.writeFileSync(path.join(tempDir, 'tsconfig.json'), '{}');
    fs.writeFileSync(path.join(tempDir, 'next.config.js'), '');
    fs.writeFileSync(path.join(tempDir, 'tailwind.config.ts'), '');
    fs.writeFileSync(path.join(tempDir, 'README.md'), '# Test');
    fs.writeFileSync(path.join(tempDir, 'DEPLOYMENT.md'), '# Deploy');

    fs.mkdirSync(path.join(tempDir, 'src'));
    fs.mkdirSync(path.join(tempDir, 'src', 'app'));
    fs.mkdirSync(path.join(tempDir, 'src', 'components'));
    fs.mkdirSync(path.join(tempDir, 'research'));
    fs.mkdirSync(path.join(tempDir, 'ralph'));
    fs.mkdirSync(path.join(tempDir, 'tests'));

    // Research files with enough content
    const substantiveContent = 'This is substantive research content. '.repeat(
      30
    );
    fs.writeFileSync(
      path.join(tempDir, 'research', 'market_research.md'),
      substantiveContent
    );
    fs.writeFileSync(
      path.join(tempDir, 'research', 'competitor_analysis.md'),
      substantiveContent
    );
    fs.writeFileSync(
      path.join(tempDir, 'research', 'positioning.md'),
      substantiveContent
    );

    const result = validatePipelineOutput(tempDir, 'dapp-factory');
    expect(result.checks.length).toBeGreaterThan(0);
  });

  it('should fail for unknown pipeline', () => {
    const result = validatePipelineOutput(tempDir, 'unknown-pipeline');
    expect(result.passed).toBe(false);
    expect(result.checks[0].message).toContain('Unknown pipeline');
  });

  it('should have contracts for all standard pipelines', () => {
    const expectedPipelines = [
      'app-factory',
      'dapp-factory',
      'agent-factory',
      'plugin-factory',
      'miniapp-pipeline',
    ];

    for (const pipeline of expectedPipelines) {
      expect(OUTPUT_CONTRACTS[pipeline]).toBeDefined();
      expect(OUTPUT_CONTRACTS[pipeline].pipeline).toBe(pipeline);
    }
  });
});

describe('Package Scripts Validation', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'appfactory-test-'));
  });

  afterEach(() => {
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should pass when all required scripts exist', () => {
    const packageJson = {
      name: 'test',
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'eslint .',
      },
    };

    const pkgPath = path.join(tempDir, 'package.json');
    fs.writeFileSync(pkgPath, JSON.stringify(packageJson, null, 2));

    const checks = validatePackageScripts(pkgPath, ['dev', 'build', 'lint']);
    expect(checks.every((c) => c.status === 'pass')).toBe(true);
  });

  it('should fail when scripts are missing', () => {
    const packageJson = {
      name: 'test',
      scripts: {
        dev: 'next dev',
      },
    };

    const pkgPath = path.join(tempDir, 'package.json');
    fs.writeFileSync(pkgPath, JSON.stringify(packageJson, null, 2));

    const checks = validatePackageScripts(pkgPath, ['dev', 'build', 'test']);
    const failedChecks = checks.filter((c) => c.status === 'fail');
    expect(failedChecks.length).toBe(2); // build and test missing
  });

  it('should fail when package.json does not exist', () => {
    const pkgPath = path.join(tempDir, 'nonexistent.json');
    const checks = validatePackageScripts(pkgPath, ['dev']);
    expect(checks[0].status).toBe('fail');
    expect(checks[0].message).toContain('not found');
  });

  it('should fail when package.json is invalid JSON', () => {
    const pkgPath = path.join(tempDir, 'package.json');
    fs.writeFileSync(pkgPath, 'invalid json content');

    const checks = validatePackageScripts(pkgPath, ['dev']);
    expect(checks.some((c) => c.status === 'fail')).toBe(true);
  });
});

describe('Research Quality Validation', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'appfactory-test-'));
    fs.mkdirSync(path.join(tempDir, 'research'));
  });

  afterEach(() => {
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should pass for substantive research content', () => {
    const substantiveContent =
      'This is a detailed market research document that analyzes the competitive landscape and user needs. '.repeat(
        10
      );

    fs.writeFileSync(
      path.join(tempDir, 'research', 'market_research.md'),
      substantiveContent
    );
    fs.writeFileSync(
      path.join(tempDir, 'research', 'competitor_analysis.md'),
      substantiveContent
    );
    fs.writeFileSync(
      path.join(tempDir, 'research', 'positioning.md'),
      substantiveContent
    );

    const checks = validateResearchQuality(path.join(tempDir, 'research'));
    expect(checks.every((c) => c.status === 'pass')).toBe(true);
  });

  it('should fail for short content', () => {
    fs.writeFileSync(
      path.join(tempDir, 'research', 'market_research.md'),
      'Short content'
    );
    fs.writeFileSync(
      path.join(tempDir, 'research', 'competitor_analysis.md'),
      'Also short'
    );
    fs.writeFileSync(
      path.join(tempDir, 'research', 'positioning.md'),
      'Too brief'
    );

    const checks = validateResearchQuality(path.join(tempDir, 'research'));
    expect(checks.every((c) => c.status === 'fail')).toBe(true);
  });

  it('should fail for placeholder content', () => {
    const placeholderContent =
      'This is a placeholder document. TODO: Add real content here. Coming soon... '.repeat(
        20
      );

    fs.writeFileSync(
      path.join(tempDir, 'research', 'market_research.md'),
      placeholderContent
    );
    fs.writeFileSync(
      path.join(tempDir, 'research', 'competitor_analysis.md'),
      'Lorem ipsum dolor sit amet'.repeat(50)
    );
    fs.writeFileSync(
      path.join(tempDir, 'research', 'positioning.md'),
      'This will be [insert content later]'.repeat(50)
    );

    const checks = validateResearchQuality(path.join(tempDir, 'research'));
    expect(checks.every((c) => c.status === 'fail')).toBe(true);
  });

  it('should fail for missing research files', () => {
    // Only create one of three required files
    fs.writeFileSync(
      path.join(tempDir, 'research', 'market_research.md'),
      'Substantive content '.repeat(50)
    );

    const checks = validateResearchQuality(path.join(tempDir, 'research'));
    const failedChecks = checks.filter((c) => c.status === 'fail');
    expect(failedChecks.length).toBe(2); // Two files missing
  });

  it('should respect custom minimum length', () => {
    const shortContent =
      'This is exactly 100 characters of content for testing the minimum length validation rules.'.repeat(
        2
      );

    fs.writeFileSync(
      path.join(tempDir, 'research', 'market_research.md'),
      shortContent
    );
    fs.writeFileSync(
      path.join(tempDir, 'research', 'competitor_analysis.md'),
      shortContent
    );
    fs.writeFileSync(
      path.join(tempDir, 'research', 'positioning.md'),
      shortContent
    );

    // Should pass with lower threshold
    const checksLow = validateResearchQuality(
      path.join(tempDir, 'research'),
      100
    );
    expect(checksLow.every((c) => c.status === 'pass')).toBe(true);

    // Should fail with higher threshold
    const checksHigh = validateResearchQuality(
      path.join(tempDir, 'research'),
      1000
    );
    expect(checksHigh.every((c) => c.status === 'fail')).toBe(true);
  });
});
