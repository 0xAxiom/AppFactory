/**
 * Tests for configuration loader
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import {
  loadPipelineConfig,
  loadRalphConfig,
  loadValidationConfig,
  loadPipelineConfigFile,
  discoverPipelineConfig,
  getDefaultRalphConfig,
  getDefaultValidationConfig,
} from '../config/loader.js';

describe('Configuration Loader', () => {
  let testDir;

  // Setup test directory before each test
  function setupTestDir() {
    testDir = join(tmpdir(), `appfactory-test-${Date.now()}`);
    mkdirSync(testDir, { recursive: true });
    return testDir;
  }

  // Cleanup test directory after each test
  function cleanupTestDir() {
    if (testDir) {
      rmSync(testDir, { recursive: true, force: true });
    }
  }

  test('loadPipelineConfig - should load valid pipeline config', () => {
    const dir = setupTestDir();
    const configPath = join(dir, 'pipeline.json');

    const validConfig = {
      name: 'test-pipeline',
      description: 'Test pipeline',
      version: '1.0.0',
      type: 'website',
      metadata: {
        author: 'Test Author',
        tags: ['test'],
      },
    };

    writeFileSync(configPath, JSON.stringify(validConfig, null, 2));

    const result = loadPipelineConfig(configPath);

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.config.name, 'test-pipeline');
    assert.strictEqual(result.config.type, 'website');

    cleanupTestDir();
  });

  test('loadPipelineConfig - should fail for non-existent file', () => {
    const result = loadPipelineConfig('/non/existent/file.json');

    assert.strictEqual(result.success, false);
    assert(result.errors);
    assert(result.errors[0].includes('not found'));
  });

  test('loadPipelineConfig - should fail for invalid JSON', () => {
    const dir = setupTestDir();
    const configPath = join(dir, 'invalid.json');

    writeFileSync(configPath, '{ invalid json }');

    const result = loadPipelineConfig(configPath);

    assert.strictEqual(result.success, false);
    assert(result.errors);

    cleanupTestDir();
  });

  test('loadRalphConfig - should load valid Ralph config', () => {
    const dir = setupTestDir();
    const configPath = join(dir, 'ralph.json');

    const validConfig = {
      passingThreshold: 95,
      maxIterations: 15,
      checks: ['lint', 'test'],
      runE2ETests: true,
    };

    writeFileSync(configPath, JSON.stringify(validConfig, null, 2));

    const result = loadRalphConfig(configPath);

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.config.passingThreshold, 95);
    assert.strictEqual(result.config.runE2ETests, true);

    cleanupTestDir();
  });

  test('loadValidationConfig - should load valid validation config', () => {
    const dir = setupTestDir();
    const configPath = join(dir, 'validation.json');

    const validConfig = {
      requiredFiles: ['package.json'],
      forbiddenFiles: ['node_modules'],
      forbiddenPatterns: [],
      sizeLimits: {
        totalSize: 1000000,
        singleFile: 100000,
        maxFiles: 1000,
      },
      requiredDependencies: [],
      forbiddenDependencies: [],
      requiredScripts: ['dev'],
      allowedDotfiles: ['.env.example'],
    };

    writeFileSync(configPath, JSON.stringify(validConfig, null, 2));

    const result = loadValidationConfig(configPath);

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.config.requiredFiles.length, 1);
    assert.strictEqual(result.config.sizeLimits.maxFiles, 1000);

    cleanupTestDir();
  });

  test('loadPipelineConfigFile - should load complete config file', () => {
    const dir = setupTestDir();
    const configPath = join(dir, 'pipeline.config.json');

    const validConfig = {
      pipeline: {
        name: 'test-pipeline',
        description: 'Test pipeline',
        version: '1.0.0',
        type: 'website',
        metadata: {
          author: 'Test Author',
          tags: ['test'],
        },
      },
      ralph: {
        passingThreshold: 97,
        maxIterations: 20,
        checks: [],
        runE2ETests: false,
      },
    };

    writeFileSync(configPath, JSON.stringify(validConfig, null, 2));

    const result = loadPipelineConfigFile(configPath);

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.config.pipeline.name, 'test-pipeline');
    assert.strictEqual(result.config.ralph.passingThreshold, 97);

    cleanupTestDir();
  });

  test('discoverPipelineConfig - should find JSON config', async () => {
    const dir = setupTestDir();
    const configPath = join(dir, 'pipeline.config.json');

    const validConfig = {
      pipeline: {
        name: 'discovered-pipeline',
        description: 'Discovered pipeline',
        version: '1.0.0',
        type: 'mobile',
        metadata: {
          author: 'Test Author',
          tags: ['test'],
        },
      },
    };

    writeFileSync(configPath, JSON.stringify(validConfig, null, 2));

    const result = await discoverPipelineConfig(dir);

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.config.pipeline.name, 'discovered-pipeline');

    cleanupTestDir();
  });

  test('discoverPipelineConfig - should fail when no config found', async () => {
    const dir = setupTestDir();

    const result = await discoverPipelineConfig(dir);

    assert.strictEqual(result.success, false);
    assert(result.errors);
    assert(result.errors[0].includes('No configuration file found'));

    cleanupTestDir();
  });

  test('getDefaultRalphConfig - should return valid defaults', () => {
    const config = getDefaultRalphConfig();

    assert.strictEqual(config.passingThreshold, 97);
    assert.strictEqual(config.maxIterations, 20);
    assert.strictEqual(config.runE2ETests, false);
    assert.strictEqual(Array.isArray(config.checks), true);
  });

  test('getDefaultValidationConfig - should return valid defaults', () => {
    const config = getDefaultValidationConfig();

    assert(config.requiredFiles.includes('package.json'));
    assert(config.forbiddenFiles.includes('node_modules'));
    assert(config.requiredScripts.includes('dev'));
    assert(config.requiredScripts.includes('build'));
    assert.strictEqual(typeof config.sizeLimits.totalSize, 'number');
  });
});
