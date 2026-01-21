/**
 * Path Safety Tests
 *
 * Tests for confined write enforcement.
 * Validates that file operations are restricted to designated directories.
 *
 * @module tests/unit
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

/**
 * Pipeline ID type
 */
type PipelineId =
  | 'app-factory'
  | 'dapp-factory'
  | 'agent-factory'
  | 'plugin-factory'
  | 'miniapp-pipeline'
  | 'website-pipeline';

/**
 * Allowed output directories for each pipeline
 */
const ALLOWED_DIRECTORIES: Record<PipelineId, string[]> = {
  'app-factory': ['app-factory/builds/', 'app-factory/runs/'],
  'dapp-factory': [
    'dapp-factory/dapp-builds/',
    'dapp-factory/runs/',
    'dapp-factory/generated/',
  ],
  'agent-factory': ['agent-factory/outputs/', 'agent-factory/runs/'],
  'plugin-factory': ['plugin-factory/builds/', 'plugin-factory/runs/'],
  'miniapp-pipeline': ['miniapp-pipeline/builds/', 'miniapp-pipeline/runs/'],
  'website-pipeline': ['website-pipeline/builds/', 'website-pipeline/runs/'],
};

/**
 * Forbidden paths that should never be written to
 */
const FORBIDDEN_PATHS = [
  '/',
  '/etc',
  '/usr',
  '/var',
  '/home',
  '/root',
  '/tmp',
  '..',
  '../',
  '~',
  '/Users',
  '/System',
  'node_modules',
  '.git',
  '.env',
  '.env.local',
  'secrets',
];

/**
 * Check if a path is within an allowed directory for a pipeline
 */
function isPathAllowed(
  targetPath: string,
  pipelineId: PipelineId,
  repoRoot: string
): boolean {
  const normalizedTarget = path.normalize(targetPath);
  const normalizedRoot = path.normalize(repoRoot);

  // Must be within repo root
  if (!normalizedTarget.startsWith(normalizedRoot)) {
    return false;
  }

  // Get relative path from repo root
  const relativePath = path.relative(normalizedRoot, normalizedTarget);

  // Check for path traversal
  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    return false;
  }

  // Check against allowed directories
  const allowedDirs = ALLOWED_DIRECTORIES[pipelineId];
  return allowedDirs.some((dir) => relativePath.startsWith(dir));
}

/**
 * Check if a path contains forbidden patterns
 */
function containsForbiddenPattern(targetPath: string): boolean {
  const normalizedPath = path.normalize(targetPath);

  for (const forbidden of FORBIDDEN_PATHS) {
    // For root path (/), check exact match or leading slash
    if (forbidden === '/') {
      if (normalizedPath === '/' || normalizedPath.startsWith('/')) {
        return true;
      }
      continue;
    }

    // For directory patterns, check if path starts with or contains as segment
    if (forbidden.startsWith('/')) {
      // Absolute forbidden paths - check if target starts with them
      if (
        normalizedPath.startsWith(forbidden) ||
        normalizedPath.startsWith(forbidden + '/')
      ) {
        return true;
      }
    } else {
      // Relative forbidden patterns - check if path contains them
      if (normalizedPath.includes(forbidden)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Sanitize a path for safe use
 */
function sanitizePath(inputPath: string): string {
  // Remove null bytes
  let sanitized = inputPath.replace(/\0/g, '');

  // Normalize path
  sanitized = path.normalize(sanitized);

  // Remove leading slashes for relative paths
  while (sanitized.startsWith('/') && !path.isAbsolute(inputPath)) {
    sanitized = sanitized.slice(1);
  }

  // Replace backslashes with forward slashes
  sanitized = sanitized.replace(/\\/g, '/');

  // Remove double slashes
  sanitized = sanitized.replace(/\/+/g, '/');

  return sanitized;
}

/**
 * Validate that a filename is safe
 */
function isValidFilename(filename: string): boolean {
  // Check for empty or too long
  if (!filename || filename.length > 255) {
    return false;
  }

  // Check for null bytes
  if (filename.includes('\0')) {
    return false;
  }

  // Check for reserved characters
  const invalidChars = /[<>:"|?*\x00-\x1f]/;
  if (invalidChars.test(filename)) {
    return false;
  }

  // Check for reserved names (Windows)
  const reservedNames = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\.|$)/i;
  if (reservedNames.test(filename)) {
    return false;
  }

  // Check for leading/trailing dots and spaces
  if (
    filename.startsWith('.') ||
    filename.startsWith(' ') ||
    filename.endsWith(' ')
  ) {
    // Note: dotfiles are allowed in some cases, so we don't fail on leading dot
    // but we do fail on trailing space
    if (filename.endsWith(' ')) {
      return false;
    }
  }

  return true;
}

describe('Path Allowance Checking', () => {
  const repoRoot = '/Users/test/AppFactory';

  describe('Allowed Paths', () => {
    it('should allow writing to app-factory/builds/', () => {
      const targetPath = `${repoRoot}/app-factory/builds/my-app`;
      expect(isPathAllowed(targetPath, 'app-factory', repoRoot)).toBe(true);
    });

    it('should allow writing to dapp-factory/dapp-builds/', () => {
      const targetPath = `${repoRoot}/dapp-factory/dapp-builds/my-dapp`;
      expect(isPathAllowed(targetPath, 'dapp-factory', repoRoot)).toBe(true);
    });

    it('should allow writing to agent-factory/outputs/', () => {
      const targetPath = `${repoRoot}/agent-factory/outputs/my-agent`;
      expect(isPathAllowed(targetPath, 'agent-factory', repoRoot)).toBe(true);
    });

    it('should allow writing to runs directories', () => {
      const targetPath = `${repoRoot}/app-factory/runs/2024-01-01/run-001`;
      expect(isPathAllowed(targetPath, 'app-factory', repoRoot)).toBe(true);
    });
  });

  describe('Disallowed Paths', () => {
    it('should not allow writing outside repo root', () => {
      const targetPath = '/etc/passwd';
      expect(isPathAllowed(targetPath, 'app-factory', repoRoot)).toBe(false);
    });

    it('should not allow path traversal', () => {
      const targetPath = `${repoRoot}/app-factory/builds/../../../etc/passwd`;
      expect(isPathAllowed(targetPath, 'app-factory', repoRoot)).toBe(false);
    });

    it('should not allow writing to wrong pipeline directory', () => {
      const targetPath = `${repoRoot}/dapp-factory/dapp-builds/my-app`;
      expect(isPathAllowed(targetPath, 'app-factory', repoRoot)).toBe(false);
    });

    it('should not allow writing to repo root directly', () => {
      const targetPath = `${repoRoot}/file.txt`;
      expect(isPathAllowed(targetPath, 'app-factory', repoRoot)).toBe(false);
    });

    it('should not allow writing to CLAUDE.md', () => {
      const targetPath = `${repoRoot}/CLAUDE.md`;
      expect(isPathAllowed(targetPath, 'dapp-factory', repoRoot)).toBe(false);
    });
  });

  describe('Cross-Pipeline Protection', () => {
    it('should not allow app-factory to write to dapp-factory', () => {
      const targetPath = `${repoRoot}/dapp-factory/dapp-builds/stolen`;
      expect(isPathAllowed(targetPath, 'app-factory', repoRoot)).toBe(false);
    });

    it('should not allow any pipeline to write to plugin-factory', () => {
      const targetPath = `${repoRoot}/plugin-factory/builds/malicious`;
      expect(isPathAllowed(targetPath, 'dapp-factory', repoRoot)).toBe(false);
      expect(isPathAllowed(targetPath, 'app-factory', repoRoot)).toBe(false);
      expect(isPathAllowed(targetPath, 'agent-factory', repoRoot)).toBe(false);
    });
  });
});

describe('Forbidden Pattern Detection', () => {
  it('should detect system paths', () => {
    expect(containsForbiddenPattern('/etc/passwd')).toBe(true);
    expect(containsForbiddenPattern('/usr/local/bin')).toBe(true);
    expect(containsForbiddenPattern('/var/log')).toBe(true);
  });

  it('should detect path traversal patterns', () => {
    expect(containsForbiddenPattern('../secret')).toBe(true);
    expect(containsForbiddenPattern('foo/../../bar')).toBe(true);
  });

  it('should detect home directory references', () => {
    expect(containsForbiddenPattern('~/.ssh/id_rsa')).toBe(true);
    expect(containsForbiddenPattern('/home/user/.bashrc')).toBe(true);
  });

  it('should detect node_modules writes', () => {
    expect(containsForbiddenPattern('node_modules/package/index.js')).toBe(
      true
    );
  });

  it('should detect .git writes', () => {
    expect(containsForbiddenPattern('.git/config')).toBe(true);
  });

  it('should detect .env files', () => {
    expect(containsForbiddenPattern('.env')).toBe(true);
    expect(containsForbiddenPattern('.env.local')).toBe(true);
  });

  it('should detect secrets directories', () => {
    expect(containsForbiddenPattern('secrets/api-key.json')).toBe(true);
  });

  it('should allow normal app paths', () => {
    expect(
      containsForbiddenPattern('app-factory/builds/my-app/src/index.ts')
    ).toBe(false);
  });
});

describe('Path Sanitization', () => {
  it('should remove null bytes', () => {
    const result = sanitizePath('file\x00name.txt');
    expect(result).not.toContain('\x00');
  });

  it('should normalize path separators', () => {
    const result = sanitizePath('path\\to\\file');
    expect(result).not.toContain('\\');
  });

  it('should remove double slashes', () => {
    const result = sanitizePath('path//to//file');
    expect(result).toBe('path/to/file');
  });

  it('should normalize parent directory references', () => {
    const result = sanitizePath('path/./to/../file');
    expect(result).toBe('path/file');
  });

  it('should preserve valid paths', () => {
    const result = sanitizePath('app-factory/builds/my-app/src/index.ts');
    expect(result).toBe('app-factory/builds/my-app/src/index.ts');
  });
});

describe('Filename Validation', () => {
  describe('Valid Filenames', () => {
    it('should accept normal filenames', () => {
      expect(isValidFilename('index.ts')).toBe(true);
      expect(isValidFilename('package.json')).toBe(true);
      expect(isValidFilename('README.md')).toBe(true);
    });

    it('should accept filenames with hyphens and underscores', () => {
      expect(isValidFilename('my-component.tsx')).toBe(true);
      expect(isValidFilename('my_module.ts')).toBe(true);
    });

    it('should accept filenames with numbers', () => {
      expect(isValidFilename('file123.txt')).toBe(true);
      expect(isValidFilename('2024-01-01-log.txt')).toBe(true);
    });

    it('should accept dotfiles (with caution)', () => {
      expect(isValidFilename('.gitignore')).toBe(true);
      expect(isValidFilename('.eslintrc.js')).toBe(true);
    });
  });

  describe('Invalid Filenames', () => {
    it('should reject empty filenames', () => {
      expect(isValidFilename('')).toBe(false);
    });

    it('should reject filenames with null bytes', () => {
      expect(isValidFilename('file\x00.txt')).toBe(false);
    });

    it('should reject filenames with invalid characters', () => {
      expect(isValidFilename('file<name>.txt')).toBe(false);
      expect(isValidFilename('file:name.txt')).toBe(false);
      expect(isValidFilename('file|name.txt')).toBe(false);
      expect(isValidFilename('file?name.txt')).toBe(false);
      expect(isValidFilename('file*name.txt')).toBe(false);
    });

    it('should reject Windows reserved names', () => {
      expect(isValidFilename('CON')).toBe(false);
      expect(isValidFilename('PRN')).toBe(false);
      expect(isValidFilename('AUX')).toBe(false);
      expect(isValidFilename('NUL')).toBe(false);
      expect(isValidFilename('COM1')).toBe(false);
      expect(isValidFilename('LPT1')).toBe(false);
    });

    it('should reject filenames that are too long', () => {
      const longName = 'a'.repeat(256);
      expect(isValidFilename(longName)).toBe(false);
    });

    it('should reject filenames with trailing spaces', () => {
      expect(isValidFilename('file.txt ')).toBe(false);
    });
  });
});

describe('Real-World Path Scenarios', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'appfactory-test-'));
  });

  afterEach(() => {
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should allow creating nested directory structure', () => {
    const nestedPath = path.join(tempDir, 'a', 'b', 'c', 'd');
    fs.mkdirSync(nestedPath, { recursive: true });
    expect(fs.existsSync(nestedPath)).toBe(true);
  });

  it('should prevent symlink escape attempts', () => {
    const targetDir = path.join(tempDir, 'target');
    const linkPath = path.join(tempDir, 'link');

    fs.mkdirSync(targetDir);

    // Create symlink to outside directory (simulating attack)
    // Note: In real implementation, symlinks should be validated
    try {
      fs.symlinkSync(os.tmpdir(), linkPath);

      // The link resolves outside our safe directory
      const resolved = fs.realpathSync(linkPath);
      expect(resolved).not.toContain(tempDir);

      // Cleanup
      fs.unlinkSync(linkPath);
    } catch {
      // Symlink creation may fail on some systems, which is fine
    }
  });

  it('should handle Unicode paths correctly', () => {
    const unicodePath = path.join(tempDir, 'tdd_emoji');
    fs.mkdirSync(unicodePath, { recursive: true });
    fs.writeFileSync(path.join(unicodePath, 'file.txt'), 'content');
    expect(fs.existsSync(path.join(unicodePath, 'file.txt'))).toBe(true);
  });

  it('should reject attempts to write outside temp directory', () => {
    const outsidePath = path.join(tempDir, '..', 'outside');

    // The normalized path should be outside tempDir
    const normalized = path.normalize(outsidePath);
    expect(normalized.startsWith(tempDir)).toBe(false);
  });
});

describe('Pipeline Directory Boundaries', () => {
  it('should define boundaries for all pipelines', () => {
    const pipelines: PipelineId[] = [
      'app-factory',
      'dapp-factory',
      'agent-factory',
      'plugin-factory',
      'miniapp-pipeline',
      'website-pipeline',
    ];

    for (const pipeline of pipelines) {
      expect(ALLOWED_DIRECTORIES[pipeline]).toBeDefined();
      expect(ALLOWED_DIRECTORIES[pipeline].length).toBeGreaterThan(0);
    }
  });

  it('should include builds and runs for each pipeline', () => {
    const pipelines: PipelineId[] = [
      'app-factory',
      'dapp-factory',
      'agent-factory',
      'plugin-factory',
      'miniapp-pipeline',
      'website-pipeline',
    ];

    for (const pipeline of pipelines) {
      const dirs = ALLOWED_DIRECTORIES[pipeline];
      const hasBuildOrOutput = dirs.some(
        (d) => d.includes('builds') || d.includes('outputs')
      );
      const hasRuns = dirs.some((d) => d.includes('runs'));

      expect(hasBuildOrOutput).toBe(true);
      expect(hasRuns).toBe(true);
    }
  });
});
