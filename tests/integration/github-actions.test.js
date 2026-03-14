/**
 * Integration test for GitHub Actions CI workflow
 */

import { describe, it, expect } from 'vitest';
import { readFile, access } from 'fs/promises';
import path from 'path';

describe('GitHub Actions CI', () => {
  it('should have CI workflow file', async () => {
    const workflowPath = path.join(process.cwd(), '.github/workflows/ci.yml');

    try {
      await access(workflowPath);
      // File exists, test passes
      expect(true).toBe(true);
    } catch {
      throw new Error('CI workflow file not found: .github/workflows/ci.yml');
    }
  });

  it('should have valid workflow structure', async () => {
    const workflowPath = path.join(process.cwd(), '.github/workflows/ci.yml');
    const content = await readFile(workflowPath, 'utf8');

    // Basic structure checks
    expect(content).toContain('name: CI');
    expect(content).toContain('on:');
    expect(content).toContain('jobs:');
    expect(content).toContain('npm run test:all');
    expect(content).toContain('npm run lint');
    expect(content).toContain('npm run format:check');
    expect(content).toContain('npm run type-check');
  });

  it('should test multiple Node.js versions', async () => {
    const workflowPath = path.join(process.cwd(), '.github/workflows/ci.yml');
    const content = await readFile(workflowPath, 'utf8');

    expect(content).toContain('matrix:');
    expect(content).toContain('node-version:');
    expect(content).toContain('[18, 20, 22]');
  });

  it('should include security audit', async () => {
    const workflowPath = path.join(process.cwd(), '.github/workflows/ci.yml');
    const content = await readFile(workflowPath, 'utf8');

    expect(content).toContain('npm run deps:audit');
  });
});
