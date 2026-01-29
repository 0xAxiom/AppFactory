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
export declare const RALPH_THRESHOLDS: {
    /** Default passing threshold percentage */
    readonly DEFAULT_PASSING: 97;
    /** Minimum acceptable passing threshold */
    readonly MIN_PASSING: 70;
    /** Maximum passing threshold */
    readonly MAX_PASSING: 100;
    /** Default maximum iterations */
    readonly DEFAULT_MAX_ITERATIONS: 20;
    /** Maximum allowed iterations */
    readonly MAX_ITERATIONS_LIMIT: 100;
};
/**
 * File size limits (in bytes)
 */
export declare const SIZE_LIMITS: {
    /** Maximum total build size (50 MB) */
    readonly MAX_TOTAL_SIZE: number;
    /** Maximum single file size (10 MB) */
    readonly MAX_SINGLE_FILE: number;
    /** Maximum number of files in a build */
    readonly MAX_FILE_COUNT: 10000;
    /** Warning threshold for total size (25 MB) */
    readonly WARN_TOTAL_SIZE: number;
    /** Warning threshold for single file (5 MB) */
    readonly WARN_SINGLE_FILE: number;
};
/**
 * Research content thresholds (character counts)
 */
export declare const RESEARCH_THRESHOLDS: {
    /** Minimum market research length */
    readonly MIN_MARKET_RESEARCH: 500;
    /** Minimum competitor analysis length */
    readonly MIN_COMPETITOR_ANALYSIS: 500;
    /** Minimum positioning document length */
    readonly MIN_POSITIONING: 500;
    /** Minimum README length */
    readonly MIN_README: 200;
    /** Maximum placeholder ratio (0.0-1.0) */
    readonly MAX_PLACEHOLDER_RATIO: 0.1;
};
/**
 * Code quality thresholds
 */
export declare const CODE_QUALITY_THRESHOLDS: {
    /** Maximum cyclomatic complexity per function */
    readonly MAX_COMPLEXITY: 15;
    /** Maximum function depth */
    readonly MAX_DEPTH: 4;
    /** Maximum lines per function */
    readonly MAX_LINES_PER_FUNCTION: 100;
    /** Maximum nested callbacks */
    readonly MAX_NESTED_CALLBACKS: 3;
    /** Maximum function parameters */
    readonly MAX_PARAMS: 5;
};
/**
 * Performance budgets
 */
export declare const PERFORMANCE_BUDGETS: {
    /** Maximum bundle size in KB */
    readonly MAX_BUNDLE_SIZE_KB: 500;
    /** Maximum initial load time in ms */
    readonly MAX_INITIAL_LOAD_MS: 3000;
    /** Maximum time to interactive in ms */
    readonly MAX_TTI_MS: 5000;
    /** Minimum Lighthouse performance score */
    readonly MIN_LIGHTHOUSE_PERFORMANCE: 80;
    /** Minimum Lighthouse accessibility score */
    readonly MIN_LIGHTHOUSE_ACCESSIBILITY: 90;
};
/**
 * Check point values for Ralph scoring
 */
export declare const CHECK_POINTS: {
    /** Build-related checks */
    readonly BUILD: 10;
    /** TypeScript/type checking */
    readonly TYPECHECK: 10;
    /** Linting checks */
    readonly LINT: 5;
    /** File existence checks */
    readonly FILE_EXISTS: 5;
    /** Security checks */
    readonly SECURITY: 15;
    /** Research quality checks */
    readonly RESEARCH: 5;
    /** UX/UI checks */
    readonly UX: 5;
    /** Documentation checks */
    readonly DOCS: 3;
    /** E2E test checks */
    readonly E2E: 10;
};
/**
 * Severity levels with numeric weights
 */
export declare const SEVERITY_WEIGHTS: {
    readonly critical: 4;
    readonly high: 3;
    readonly medium: 2;
    readonly low: 1;
};
//# sourceMappingURL=thresholds.d.ts.map