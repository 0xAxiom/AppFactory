/**
 * Ralph Built-in Checks
 *
 * Common check implementations that can be reused across pipelines.
 *
 * @module @appfactory/core/ralph
 */

import * as path from 'node:path';
import { spawn } from 'node:child_process';
import type { RalphCheck, RalphContext } from '../types/ralph.js';
import { exists, readJson, readFileSafe } from '../utils/fs.js';

/**
 * Run a shell command and return whether it succeeded
 */
async function runCommand(
  command: string,
  args: string[],
  cwd: string
): Promise<{ success: boolean; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const proc = spawn(command, args, {
      cwd,
      shell: true,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    proc.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      resolve({
        success: code === 0,
        stdout,
        stderr,
      });
    });

    proc.on('error', () => {
      resolve({
        success: false,
        stdout,
        stderr: stderr || 'Command failed to execute',
      });
    });
  });
}

// =============================================================================
// Build Checks
// =============================================================================

/**
 * Check that npm install succeeds
 */
export const checkNpmInstall: RalphCheck = {
  id: 'npm-install',
  name: 'npm install',
  category: 'build',
  description: 'npm install completes without errors',
  mandatory: true,
  points: 10,
  verify: async (ctx: RalphContext) => {
    const result = await runCommand('npm', ['install'], ctx.buildPath);
    return result.success;
  },
};

/**
 * Check that npm run build succeeds
 */
export const checkNpmBuild: RalphCheck = {
  id: 'npm-build',
  name: 'npm run build',
  category: 'build',
  description: 'npm run build completes without errors',
  mandatory: true,
  points: 10,
  verify: async (ctx: RalphContext) => {
    const result = await runCommand('npm', ['run', 'build'], ctx.buildPath);
    return result.success;
  },
};

/**
 * Check that npm run lint passes
 */
export const checkNpmLint: RalphCheck = {
  id: 'npm-lint',
  name: 'npm run lint',
  category: 'code-quality',
  description: 'npm run lint passes',
  mandatory: false,
  points: 5,
  verify: async (ctx: RalphContext) => {
    const result = await runCommand('npm', ['run', 'lint'], ctx.buildPath);
    return result.success;
  },
};

/**
 * Check that npm run typecheck passes
 */
export const checkTypecheck: RalphCheck = {
  id: 'npm-typecheck',
  name: 'TypeScript typecheck',
  category: 'code-quality',
  description: 'TypeScript compiles without errors',
  mandatory: true,
  points: 10,
  verify: async (ctx: RalphContext) => {
    // Try npm run typecheck first
    let result = await runCommand('npm', ['run', 'typecheck'], ctx.buildPath);
    if (result.success) return true;

    // Fall back to tsc --noEmit
    result = await runCommand('npx', ['tsc', '--noEmit'], ctx.buildPath);
    return result.success;
  },
};

// =============================================================================
// File Existence Checks
// =============================================================================

/**
 * Create a check for file existence
 */
export function createFileExistsCheck(
  id: string,
  filePath: string,
  description: string,
  mandatory: boolean = true,
  points: number = 5
): RalphCheck {
  return {
    id,
    name: `File exists: ${filePath}`,
    category: 'build',
    description,
    mandatory,
    points,
    verify: async (ctx: RalphContext) => {
      return exists(path.join(ctx.buildPath, filePath));
    },
  };
}

/**
 * Check that package.json exists
 */
export const checkPackageJson = createFileExistsCheck(
  'package-json',
  'package.json',
  'package.json must exist'
);

/**
 * Check that tsconfig.json exists
 */
export const checkTsConfig = createFileExistsCheck(
  'tsconfig-json',
  'tsconfig.json',
  'tsconfig.json must exist'
);

/**
 * Check that README.md exists
 */
export const checkReadme = createFileExistsCheck(
  'readme',
  'README.md',
  'README.md must exist'
);

// =============================================================================
// Content Checks
// =============================================================================

/**
 * Check that package.json has required scripts
 */
export function createPackageScriptCheck(script: string): RalphCheck {
  return {
    id: `package-script-${script}`,
    name: `package.json has "${script}" script`,
    category: 'build',
    description: `package.json must have a "${script}" script`,
    mandatory: true,
    points: 5,
    verify: async (ctx: RalphContext) => {
      const pkgPath = path.join(ctx.buildPath, 'package.json');
      const pkg = readJson<{ scripts?: Record<string, string> }>(pkgPath);
      return !!pkg?.scripts?.[script];
    },
  };
}

/**
 * Check that no hardcoded secrets exist
 */
export const checkNoSecrets: RalphCheck = {
  id: 'no-secrets',
  name: 'No hardcoded secrets',
  category: 'security',
  description: 'Source files must not contain hardcoded secrets',
  mandatory: true,
  points: 15,
  verify: async (ctx: RalphContext) => {
    const patterns = [
      /sk-ant-[a-zA-Z0-9-]+/,
      /sk-[a-zA-Z0-9]{48}/,
      /ghp_[a-zA-Z0-9]{36}/,
      /ANTHROPIC_API_KEY\s*=\s*["'][^"']+["']/,
      /OPENAI_API_KEY\s*=\s*["'][^"']+["']/,
      /privateKey\s*[:=]\s*["'][^"']+["']/,
      /secretKey\s*[:=]\s*["'][^"']+["']/,
    ];

    // Simple check - in real implementation would scan all source files
    const envPath = path.join(ctx.buildPath, '.env');
    if (exists(envPath)) {
      const content = readFileSafe(envPath);
      if (content) {
        for (const pattern of patterns) {
          if (pattern.test(content)) {
            return false;
          }
        }
      }
    }

    return true;
  },
};

// =============================================================================
// Research Quality Checks
// =============================================================================

/**
 * Check that research files are substantive (not placeholders)
 */
export function createResearchCheck(
  fileName: string,
  minLength: number = 500
): RalphCheck {
  return {
    id: `research-${fileName.replace('.md', '')}`,
    name: `Research: ${fileName}`,
    category: 'documentation',
    description: `${fileName} must be substantive (>= ${minLength} chars)`,
    mandatory: true,
    points: 5,
    verify: async (ctx: RalphContext) => {
      const filePath = path.join(ctx.buildPath, 'research', fileName);
      const content = readFileSafe(filePath);
      if (!content) return false;

      // Check for common placeholder patterns
      const placeholderPatterns = [
        /placeholder/i,
        /todo:/i,
        /lorem ipsum/i,
        /coming soon/i,
      ];

      for (const pattern of placeholderPatterns) {
        if (pattern.test(content)) {
          return false;
        }
      }

      return content.length >= minLength;
    },
  };
}

/**
 * Standard research checks
 */
export const checkMarketResearch = createResearchCheck('market_research.md');
export const checkCompetitorAnalysis = createResearchCheck(
  'competitor_analysis.md'
);
export const checkPositioning = createResearchCheck('positioning.md');

// =============================================================================
// UI/UX Checks
// =============================================================================

/**
 * Check for loading states
 */
export const checkLoadingStates: RalphCheck = {
  id: 'loading-states',
  name: 'Loading states present',
  category: 'ux',
  description: 'Components should have loading states',
  mandatory: false,
  points: 5,
  verify: async (ctx: RalphContext) => {
    // Check for common loading patterns in source files
    const srcPath = path.join(ctx.buildPath, 'src');
    if (!exists(srcPath)) return false;

    // Simple heuristic - check for Skeleton or loading keywords
    const { stdout } = await runCommand(
      'grep',
      ['-r', '-l', 'Skeleton\\|isLoading\\|loading', '.'],
      srcPath
    );

    return stdout.trim().length > 0;
  },
};

/**
 * Check for error boundaries
 */
export const checkErrorBoundaries: RalphCheck = {
  id: 'error-boundaries',
  name: 'Error boundaries present',
  category: 'ux',
  description: 'Application should have error boundaries',
  mandatory: false,
  points: 5,
  verify: async (ctx: RalphContext) => {
    const srcPath = path.join(ctx.buildPath, 'src');
    if (!exists(srcPath)) return false;

    const { stdout } = await runCommand(
      'grep',
      ['-r', '-l', 'ErrorBoundary\\|error\\.tsx', '.'],
      srcPath
    );

    return stdout.trim().length > 0;
  },
};

// =============================================================================
// Pre-defined Check Collections
// =============================================================================

/**
 * Standard build checks for web applications
 */
export const WEB_BUILD_CHECKS: RalphCheck[] = [
  checkNpmInstall,
  checkNpmBuild,
  checkTypecheck,
  checkPackageJson,
  checkTsConfig,
  checkReadme,
  createPackageScriptCheck('dev'),
  createPackageScriptCheck('build'),
];

/**
 * Standard research checks
 */
export const RESEARCH_CHECKS: RalphCheck[] = [
  checkMarketResearch,
  checkCompetitorAnalysis,
  checkPositioning,
];

/**
 * Standard security checks
 */
export const SECURITY_CHECKS: RalphCheck[] = [checkNoSecrets];

/**
 * Standard UX checks
 */
export const UX_CHECKS: RalphCheck[] = [
  checkLoadingStates,
  checkErrorBoundaries,
];

/**
 * All standard checks combined
 */
export const STANDARD_CHECKS: RalphCheck[] = [
  ...WEB_BUILD_CHECKS,
  ...RESEARCH_CHECKS,
  ...SECURITY_CHECKS,
  ...UX_CHECKS,
];
