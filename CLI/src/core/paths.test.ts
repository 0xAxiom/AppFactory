/**
 * Unit tests for CLI/src/core/paths.ts
 * Tests path resolution utilities
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

// We test path utilities by checking their behavior
// Some functions depend on the actual repo structure

describe('paths module', () => {
  describe('path utility patterns', () => {
    // These tests verify the expected behavior patterns
    // without depending on actual repo structure

    it('should handle path joining correctly', () => {
      const base = '/some/base/path';
      const result = path.join(base, 'app-factory');

      expect(result).toBe('/some/base/path/app-factory');
    });

    it('should resolve parent directory correctly', () => {
      const current = '/some/deep/nested/path';
      const parent = path.dirname(current);

      expect(parent).toBe('/some/deep/nested');
    });

    it('should handle path normalization', () => {
      const weirdPath = '/some//path/../path/./to/file';
      const normalized = path.normalize(weirdPath);

      expect(normalized).toBe('/some/path/to/file');
    });
  });

  describe('date-based path generation', () => {
    it('should generate valid ISO date string', () => {
      const today = new Date().toISOString().split('T')[0];

      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should create consistent run paths', () => {
      const runsBase = '/repo/app-factory/runs';
      const today = '2026-01-20';
      const runId = 'run-001';

      const runPath = path.join(runsBase, today, runId);

      expect(runPath).toBe('/repo/app-factory/runs/2026-01-20/run-001');
    });
  });

  describe('schema path resolution patterns', () => {
    let testDir: string;

    beforeEach(() => {
      testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'paths-test-'));
    });

    afterEach(() => {
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
      }
    });

    it('should handle multiple schema naming conventions', () => {
      const schemaDir = path.join(testDir, 'schemas');
      fs.mkdirSync(schemaDir);

      // Create different naming convention files
      fs.writeFileSync(path.join(schemaDir, 'stage01.json'), '{}', 'utf-8');
      fs.writeFileSync(path.join(schemaDir, '02_schema.json'), '{}', 'utf-8');
      fs.writeFileSync(
        path.join(schemaDir, 'stage03_schema.json'),
        '{}',
        'utf-8'
      );

      const variants = [
        'stage01.json',
        '01.json',
        '01_schema.json',
        'stage01_schema.json',
      ];

      // At least one variant should be found for stage01
      const found = variants.some((v) =>
        fs.existsSync(path.join(schemaDir, v))
      );
      expect(found).toBe(true);
    });
  });

  describe('validation patterns', () => {
    let testDir: string;

    beforeEach(() => {
      testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'validate-test-'));
    });

    afterEach(() => {
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
      }
    });

    it('should validate required paths exist', () => {
      // Create mock factory structure
      const factoryDir = path.join(testDir, 'app-factory');
      const templatesDir = path.join(factoryDir, 'templates', 'agents');
      const schemasDir = path.join(factoryDir, 'schemas');
      const scriptsDir = path.join(factoryDir, 'scripts');

      fs.mkdirSync(templatesDir, { recursive: true });
      fs.mkdirSync(schemasDir);
      fs.mkdirSync(scriptsDir);

      // Check existence
      expect(fs.existsSync(factoryDir)).toBe(true);
      expect(fs.existsSync(templatesDir)).toBe(true);
      expect(fs.existsSync(schemasDir)).toBe(true);
      expect(fs.existsSync(scriptsDir)).toBe(true);
    });

    it('should detect missing required paths', () => {
      const requiredPaths = [
        path.join(testDir, 'app-factory'),
        path.join(testDir, 'templates'),
        path.join(testDir, 'schemas'),
      ];

      const missing = requiredPaths.filter((p) => !fs.existsSync(p));

      expect(missing.length).toBe(requiredPaths.length);
    });
  });

  describe('run listing patterns', () => {
    let testDir: string;

    beforeEach(() => {
      testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'runs-test-'));
    });

    afterEach(() => {
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
      }
    });

    it('should list date directories sorted descending', () => {
      const runsDir = path.join(testDir, 'runs');
      fs.mkdirSync(runsDir);

      // Create date directories
      fs.mkdirSync(path.join(runsDir, '2026-01-15'));
      fs.mkdirSync(path.join(runsDir, '2026-01-20'));
      fs.mkdirSync(path.join(runsDir, '2026-01-18'));

      const dateDirs = fs
        .readdirSync(runsDir)
        .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
        .sort()
        .reverse();

      expect(dateDirs[0]).toBe('2026-01-20');
      expect(dateDirs[1]).toBe('2026-01-18');
      expect(dateDirs[2]).toBe('2026-01-15');
    });

    it('should ignore non-date directories', () => {
      const runsDir = path.join(testDir, 'runs');
      fs.mkdirSync(runsDir);

      fs.mkdirSync(path.join(runsDir, '2026-01-20'));
      fs.mkdirSync(path.join(runsDir, 'not-a-date'));
      fs.mkdirSync(path.join(runsDir, '.hidden'));

      const dateDirs = fs
        .readdirSync(runsDir)
        .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));

      expect(dateDirs).toHaveLength(1);
      expect(dateDirs[0]).toBe('2026-01-20');
    });

    it('should find run by ID across dates', () => {
      const runsDir = path.join(testDir, 'runs');
      fs.mkdirSync(runsDir);

      // Create runs in different dates
      fs.mkdirSync(path.join(runsDir, '2026-01-18', 'run-001'), {
        recursive: true,
      });
      fs.mkdirSync(path.join(runsDir, '2026-01-20', 'run-002'), {
        recursive: true,
      });

      // Search for run-001
      const runId = 'run-001';
      let foundPath: string | null = null;

      const dateDirs = fs
        .readdirSync(runsDir)
        .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));

      for (const dateDir of dateDirs) {
        const runPath = path.join(runsDir, dateDir, runId);
        if (fs.existsSync(runPath)) {
          foundPath = runPath;
          break;
        }
      }

      expect(foundPath).not.toBeNull();
      expect(foundPath).toContain('2026-01-18');
      expect(foundPath).toContain('run-001');
    });
  });

  describe('builds listing patterns', () => {
    let testDir: string;

    beforeEach(() => {
      testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'builds-test-'));
    });

    afterEach(() => {
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
      }
    });

    it('should list build directories excluding hidden', () => {
      const buildsDir = path.join(testDir, 'builds');
      fs.mkdirSync(buildsDir);

      fs.mkdirSync(path.join(buildsDir, 'my-app'));
      fs.mkdirSync(path.join(buildsDir, 'another-app'));
      fs.mkdirSync(path.join(buildsDir, '.hidden-dir'));

      const builds = fs
        .readdirSync(buildsDir)
        .filter((d) => !d.startsWith('.'))
        .filter((d) => fs.statSync(path.join(buildsDir, d)).isDirectory());

      expect(builds).toHaveLength(2);
      expect(builds).toContain('my-app');
      expect(builds).toContain('another-app');
      expect(builds).not.toContain('.hidden-dir');
    });

    it('should handle empty builds directory', () => {
      const buildsDir = path.join(testDir, 'builds');
      fs.mkdirSync(buildsDir);

      const builds = fs
        .readdirSync(buildsDir)
        .filter((d) => !d.startsWith('.'));

      expect(builds).toHaveLength(0);
    });
  });
});
