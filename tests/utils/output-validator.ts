/**
 * Output Validator Utilities
 *
 * Validates generated output structures against expected pipeline contracts.
 * Ensures all required files, directories, and content patterns are present.
 *
 * @module tests/utils
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Validation result status
 */
export type ValidationStatus = 'pass' | 'fail' | 'warn' | 'skip';

/**
 * Individual validation check result
 */
export interface ValidationCheck {
  /** Check name */
  name: string;
  /** Check status */
  status: ValidationStatus;
  /** Result message */
  message: string;
  /** Optional details */
  details?: string[];
}

/**
 * Output validation result
 */
export interface OutputValidationResult {
  /** Overall pass/fail */
  passed: boolean;
  /** Individual check results */
  checks: ValidationCheck[];
  /** Number of passed checks */
  passedCount: number;
  /** Number of failed checks */
  failedCount: number;
  /** Number of warnings */
  warningCount: number;
  /** Score (0-100) */
  score: number;
}

/**
 * Pipeline output contract definition
 */
export interface OutputContract {
  /** Pipeline name */
  pipeline: string;
  /** Required files (relative paths) */
  requiredFiles: string[];
  /** Required directories (relative paths) */
  requiredDirs: string[];
  /** Optional files that earn bonus points */
  optionalFiles?: string[];
  /** Forbidden files that should not exist */
  forbiddenFiles?: string[];
  /** Forbidden patterns in file content */
  forbiddenPatterns?: { pattern: RegExp; description: string }[];
  /** Required patterns in specific files */
  requiredPatterns?: { file: string; pattern: RegExp; description: string }[];
}

/**
 * Pre-defined output contracts for each pipeline
 */
export const OUTPUT_CONTRACTS: Record<string, OutputContract> = {
  'app-factory': {
    pipeline: 'app-factory',
    requiredFiles: [
      'package.json',
      'tsconfig.json',
      'app.json',
      'App.tsx',
      'README.md',
    ],
    requiredDirs: ['src', 'src/components', 'src/screens'],
    optionalFiles: [
      'src/store/premiumStore.ts',
      'src/hooks/usePremium.ts',
      '.env.example',
    ],
    forbiddenPatterns: [
      { pattern: /sk-ant-[a-zA-Z0-9-]+/, description: 'Anthropic API key' },
      { pattern: /sk-[a-zA-Z0-9]{48}/, description: 'OpenAI API key' },
    ],
  },

  'dapp-factory': {
    pipeline: 'dapp-factory',
    requiredFiles: [
      'package.json',
      'tsconfig.json',
      'next.config.js',
      'tailwind.config.ts',
      'README.md',
      'DEPLOYMENT.md',
      'research/market_research.md',
      'research/competitor_analysis.md',
      'research/positioning.md',
    ],
    requiredDirs: [
      'src',
      'src/app',
      'src/components',
      'research',
      'ralph',
      'tests',
    ],
    optionalFiles: [
      'ralph/PROGRESS.md',
      'ralph/PRD.md',
      'playwright.config.ts',
      'vercel.json',
    ],
    forbiddenFiles: ['.env'],
    forbiddenPatterns: [
      { pattern: /sk-ant-[a-zA-Z0-9-]+/, description: 'Anthropic API key' },
      {
        pattern: /privateKey\s*[:=]\s*["'][^"']+["']/,
        description: 'Private key',
      },
    ],
    requiredPatterns: [
      {
        file: 'package.json',
        pattern: /"dev"\s*:\s*"/,
        description: 'dev script in package.json',
      },
      {
        file: 'package.json',
        pattern: /"build"\s*:\s*"/,
        description: 'build script in package.json',
      },
    ],
  },

  'agent-factory': {
    pipeline: 'agent-factory',
    requiredFiles: [
      'package.json',
      'tsconfig.json',
      'README.md',
      'src/index.ts',
    ],
    requiredDirs: ['src', 'src/agent', 'src/tools'],
    optionalFiles: ['src/agent/prompts.ts', 'src/agent/types.ts'],
  },

  'plugin-factory': {
    pipeline: 'plugin-factory',
    requiredFiles: ['package.json', 'tsconfig.json', 'README.md'],
    requiredDirs: ['src'],
    optionalFiles: ['manifest.json', 'CLAUDE.md'],
  },

  'miniapp-pipeline': {
    pipeline: 'miniapp-pipeline',
    requiredFiles: [
      'package.json',
      'tsconfig.json',
      'next.config.js',
      'README.md',
    ],
    requiredDirs: ['src', 'src/app'],
    optionalFiles: ['minikit.config.ts', 'vercel.json'],
  },
};

/**
 * Validate an output directory against a contract
 *
 * @param outputPath - Path to the output directory
 * @param contract - Output contract to validate against
 * @returns Validation result
 */
export function validateOutput(
  outputPath: string,
  contract: OutputContract
): OutputValidationResult {
  const checks: ValidationCheck[] = [];

  // Check required files
  for (const file of contract.requiredFiles) {
    const filePath = path.join(outputPath, file);
    const exists = fs.existsSync(filePath);

    checks.push({
      name: `Required file: ${file}`,
      status: exists ? 'pass' : 'fail',
      message: exists
        ? `File exists: ${file}`
        : `Missing required file: ${file}`,
    });
  }

  // Check required directories
  for (const dir of contract.requiredDirs) {
    const dirPath = path.join(outputPath, dir);
    const exists = fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();

    checks.push({
      name: `Required directory: ${dir}`,
      status: exists ? 'pass' : 'fail',
      message: exists
        ? `Directory exists: ${dir}`
        : `Missing required directory: ${dir}`,
    });
  }

  // Check optional files (warn if missing)
  if (contract.optionalFiles) {
    for (const file of contract.optionalFiles) {
      const filePath = path.join(outputPath, file);
      const exists = fs.existsSync(filePath);

      checks.push({
        name: `Optional file: ${file}`,
        status: exists ? 'pass' : 'warn',
        message: exists
          ? `Optional file present: ${file}`
          : `Optional file missing: ${file}`,
      });
    }
  }

  // Check forbidden files
  if (contract.forbiddenFiles) {
    for (const file of contract.forbiddenFiles) {
      const filePath = path.join(outputPath, file);
      const exists = fs.existsSync(filePath);

      checks.push({
        name: `Forbidden file check: ${file}`,
        status: exists ? 'fail' : 'pass',
        message: exists
          ? `Forbidden file found: ${file}`
          : `Forbidden file correctly absent: ${file}`,
      });
    }
  }

  // Check forbidden patterns in files
  if (contract.forbiddenPatterns) {
    const sourceFiles = listSourceFiles(outputPath);
    for (const { pattern, description } of contract.forbiddenPatterns) {
      const violations: string[] = [];

      for (const file of sourceFiles) {
        try {
          const content = fs.readFileSync(path.join(outputPath, file), 'utf-8');
          if (pattern.test(content)) {
            violations.push(file);
          }
        } catch {
          // Ignore read errors
        }
      }

      checks.push({
        name: `No ${description}`,
        status: violations.length === 0 ? 'pass' : 'fail',
        message:
          violations.length === 0
            ? `No ${description} found`
            : `${description} found in ${violations.length} file(s)`,
        details: violations.length > 0 ? violations : undefined,
      });
    }
  }

  // Check required patterns
  if (contract.requiredPatterns) {
    for (const { file, pattern, description } of contract.requiredPatterns) {
      const filePath = path.join(outputPath, file);

      if (!fs.existsSync(filePath)) {
        checks.push({
          name: `Required pattern: ${description}`,
          status: 'fail',
          message: `File ${file} not found`,
        });
        continue;
      }

      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const matches = pattern.test(content);

        checks.push({
          name: `Required pattern: ${description}`,
          status: matches ? 'pass' : 'fail',
          message: matches
            ? `Found ${description}`
            : `Missing ${description} in ${file}`,
        });
      } catch {
        checks.push({
          name: `Required pattern: ${description}`,
          status: 'fail',
          message: `Could not read file: ${file}`,
        });
      }
    }
  }

  // Calculate results
  const passedCount = checks.filter((c) => c.status === 'pass').length;
  const failedCount = checks.filter((c) => c.status === 'fail').length;
  const warningCount = checks.filter((c) => c.status === 'warn').length;
  const totalRequired = checks.filter(
    (c) => !c.name.startsWith('Optional')
  ).length;
  const passedRequired = checks.filter(
    (c) => c.status === 'pass' && !c.name.startsWith('Optional')
  ).length;

  const score =
    totalRequired > 0 ? Math.round((passedRequired / totalRequired) * 100) : 0;

  return {
    passed: failedCount === 0,
    checks,
    passedCount,
    failedCount,
    warningCount,
    score,
  };
}

/**
 * Validate output against a pipeline's contract
 *
 * @param outputPath - Path to the output directory
 * @param pipeline - Pipeline identifier
 * @returns Validation result
 */
export function validatePipelineOutput(
  outputPath: string,
  pipeline: string
): OutputValidationResult {
  const contract = OUTPUT_CONTRACTS[pipeline];

  if (!contract) {
    return {
      passed: false,
      checks: [
        {
          name: 'Pipeline contract',
          status: 'fail',
          message: `Unknown pipeline: ${pipeline}`,
        },
      ],
      passedCount: 0,
      failedCount: 1,
      warningCount: 0,
      score: 0,
    };
  }

  return validateOutput(outputPath, contract);
}

/**
 * Validate that a package.json has required scripts
 *
 * @param packageJsonPath - Path to package.json
 * @param requiredScripts - List of required script names
 * @returns Validation result
 */
export function validatePackageScripts(
  packageJsonPath: string,
  requiredScripts: string[]
): ValidationCheck[] {
  const checks: ValidationCheck[] = [];

  if (!fs.existsSync(packageJsonPath)) {
    return [
      {
        name: 'package.json exists',
        status: 'fail',
        message: 'package.json not found',
      },
    ];
  }

  try {
    const content = fs.readFileSync(packageJsonPath, 'utf-8');
    const pkg = JSON.parse(content) as { scripts?: Record<string, string> };

    for (const script of requiredScripts) {
      const hasScript = !!pkg.scripts?.[script];
      checks.push({
        name: `Script: ${script}`,
        status: hasScript ? 'pass' : 'fail',
        message: hasScript
          ? `Script "${script}" is defined`
          : `Missing script: ${script}`,
      });
    }
  } catch (error) {
    checks.push({
      name: 'package.json parsing',
      status: 'fail',
      message: `Failed to parse package.json: ${error instanceof Error ? error.message : String(error)}`,
    });
  }

  return checks;
}

/**
 * Validate research artifact quality
 *
 * @param researchDir - Path to the research directory
 * @param minLength - Minimum content length (default: 500)
 * @returns Validation result
 */
export function validateResearchQuality(
  researchDir: string,
  minLength = 500
): ValidationCheck[] {
  const checks: ValidationCheck[] = [];
  const requiredFiles = [
    'market_research.md',
    'competitor_analysis.md',
    'positioning.md',
  ];

  const placeholderPatterns = [
    /placeholder/i,
    /todo:/i,
    /lorem ipsum/i,
    /coming soon/i,
    /\[insert/i,
    /TBD/,
  ];

  for (const file of requiredFiles) {
    const filePath = path.join(researchDir, file);

    if (!fs.existsSync(filePath)) {
      checks.push({
        name: `Research: ${file}`,
        status: 'fail',
        message: `Missing research file: ${file}`,
      });
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');

      // Check length
      if (content.length < minLength) {
        checks.push({
          name: `Research: ${file}`,
          status: 'fail',
          message: `${file} is too short (${content.length} chars, need ${minLength})`,
        });
        continue;
      }

      // Check for placeholder content
      let hasPlaceholder = false;
      for (const pattern of placeholderPatterns) {
        if (pattern.test(content)) {
          hasPlaceholder = true;
          break;
        }
      }

      if (hasPlaceholder) {
        checks.push({
          name: `Research: ${file}`,
          status: 'fail',
          message: `${file} contains placeholder content`,
        });
      } else {
        checks.push({
          name: `Research: ${file}`,
          status: 'pass',
          message: `${file} is substantive (${content.length} chars)`,
        });
      }
    } catch (error) {
      checks.push({
        name: `Research: ${file}`,
        status: 'fail',
        message: `Could not read ${file}: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }

  return checks;
}

/**
 * List source files in a directory recursively
 */
function listSourceFiles(
  dir: string,
  extensions = ['.ts', '.tsx', '.js', '.jsx', '.json'],
  excludeDirs = ['node_modules', '.git', 'dist', '.next']
): string[] {
  const files: string[] = [];

  function walk(currentDir: string, prefix: string): void {
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          if (!excludeDirs.includes(entry.name)) {
            walk(
              path.join(currentDir, entry.name),
              prefix ? `${prefix}/${entry.name}` : entry.name
            );
          }
        } else {
          if (extensions.some((ext) => entry.name.endsWith(ext))) {
            files.push(prefix ? `${prefix}/${entry.name}` : entry.name);
          }
        }
      }
    } catch {
      // Ignore permission errors
    }
  }

  walk(dir, '');
  return files;
}
