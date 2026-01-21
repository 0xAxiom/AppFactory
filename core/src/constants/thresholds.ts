/**
 * Quality Thresholds
 *
 * Standard quality thresholds and limits used across all pipelines.
 *
 * @module @appfactory/core/constants
 */

/**
 * Ralph QA thresholds
 */
export const RALPH_THRESHOLDS = {
  /** Default passing threshold percentage */
  DEFAULT_PASSING: 97,
  /** Minimum acceptable passing threshold */
  MIN_PASSING: 70,
  /** Maximum passing threshold */
  MAX_PASSING: 100,
  /** Default maximum iterations */
  DEFAULT_MAX_ITERATIONS: 20,
  /** Maximum allowed iterations */
  MAX_ITERATIONS_LIMIT: 100,
} as const;

/**
 * File size limits (in bytes)
 */
export const SIZE_LIMITS = {
  /** Maximum total build size (50 MB) */
  MAX_TOTAL_SIZE: 50 * 1024 * 1024,
  /** Maximum single file size (10 MB) */
  MAX_SINGLE_FILE: 10 * 1024 * 1024,
  /** Maximum number of files in a build */
  MAX_FILE_COUNT: 10000,
  /** Warning threshold for total size (25 MB) */
  WARN_TOTAL_SIZE: 25 * 1024 * 1024,
  /** Warning threshold for single file (5 MB) */
  WARN_SINGLE_FILE: 5 * 1024 * 1024,
} as const;

/**
 * Research content thresholds (character counts)
 */
export const RESEARCH_THRESHOLDS = {
  /** Minimum market research length */
  MIN_MARKET_RESEARCH: 500,
  /** Minimum competitor analysis length */
  MIN_COMPETITOR_ANALYSIS: 500,
  /** Minimum positioning document length */
  MIN_POSITIONING: 500,
  /** Minimum README length */
  MIN_README: 200,
  /** Maximum placeholder ratio (0.0-1.0) */
  MAX_PLACEHOLDER_RATIO: 0.1,
} as const;

/**
 * Code quality thresholds
 */
export const CODE_QUALITY_THRESHOLDS = {
  /** Maximum cyclomatic complexity per function */
  MAX_COMPLEXITY: 15,
  /** Maximum function depth */
  MAX_DEPTH: 4,
  /** Maximum lines per function */
  MAX_LINES_PER_FUNCTION: 100,
  /** Maximum nested callbacks */
  MAX_NESTED_CALLBACKS: 3,
  /** Maximum function parameters */
  MAX_PARAMS: 5,
} as const;

/**
 * Performance budgets
 */
export const PERFORMANCE_BUDGETS = {
  /** Maximum bundle size in KB */
  MAX_BUNDLE_SIZE_KB: 500,
  /** Maximum initial load time in ms */
  MAX_INITIAL_LOAD_MS: 3000,
  /** Maximum time to interactive in ms */
  MAX_TTI_MS: 5000,
  /** Minimum Lighthouse performance score */
  MIN_LIGHTHOUSE_PERFORMANCE: 80,
  /** Minimum Lighthouse accessibility score */
  MIN_LIGHTHOUSE_ACCESSIBILITY: 90,
} as const;

/**
 * Check point values for Ralph scoring
 */
export const CHECK_POINTS = {
  /** Build-related checks */
  BUILD: 10,
  /** TypeScript/type checking */
  TYPECHECK: 10,
  /** Linting checks */
  LINT: 5,
  /** File existence checks */
  FILE_EXISTS: 5,
  /** Security checks */
  SECURITY: 15,
  /** Research quality checks */
  RESEARCH: 5,
  /** UX/UI checks */
  UX: 5,
  /** Documentation checks */
  DOCS: 3,
  /** E2E test checks */
  E2E: 10,
} as const;

/**
 * Severity levels with numeric weights
 */
export const SEVERITY_WEIGHTS = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
} as const;
