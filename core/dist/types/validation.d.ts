/**
 * Validation Type Definitions
 *
 * Types for build validation, schema validation, and output verification.
 *
 * @module @appfactory/core/types
 */
import type { Severity } from './pipeline.js';
/**
 * Validation result status
 */
export type ValidationStatus = 'pass' | 'fail' | 'skip' | 'warn';
/**
 * Build validation configuration
 */
export interface ValidationConfig {
    /** Required files that must exist */
    requiredFiles: string[];
    /** Forbidden files that must not exist */
    forbiddenFiles: string[];
    /** Forbidden patterns in file content */
    forbiddenPatterns: ForbiddenPattern[];
    /** Size limits */
    sizeLimits: SizeLimits;
    /** Required dependencies */
    requiredDependencies: string[];
    /** Forbidden dependencies */
    forbiddenDependencies: string[];
    /** Required scripts in package.json */
    requiredScripts: string[];
    /** Allowed dotfiles (exceptions to general dotfile rule) */
    allowedDotfiles: string[];
}
/**
 * Forbidden pattern definition
 */
export interface ForbiddenPattern {
    /** Regular expression pattern */
    pattern: RegExp;
    /** Human-readable description */
    description: string;
    /** Severity if found */
    severity: Severity;
}
/**
 * Size limit configuration
 */
export interface SizeLimits {
    /** Maximum total size in bytes */
    totalSize: number;
    /** Maximum single file size in bytes */
    singleFile: number;
    /** Maximum number of files */
    maxFiles: number;
}
/**
 * Validation result
 */
export interface ValidationResult {
    /** Overall pass/fail status */
    passed: boolean;
    /** Individual check results */
    checks: ValidationCheck[];
    /** Errors found */
    errors: ValidationError[];
    /** Warnings found */
    warnings: ValidationWarning[];
    /** Statistics */
    stats: ValidationStats;
    /** Timestamp */
    timestamp: string;
}
/**
 * Individual validation check
 */
export interface ValidationCheck {
    /** Check name */
    name: string;
    /** Check category */
    category: string;
    /** Check status */
    status: ValidationStatus;
    /** Result message */
    message: string;
    /** Details if any */
    details?: string;
}
/**
 * Validation error
 */
export interface ValidationError {
    /** Error code */
    code: string;
    /** Error message */
    message: string;
    /** File path if applicable */
    file?: string;
    /** Severity */
    severity: Severity;
    /** How to fix */
    fix?: string;
}
/**
 * Validation warning
 */
export interface ValidationWarning {
    /** Warning code */
    code: string;
    /** Warning message */
    message: string;
    /** File path if applicable */
    file?: string;
    /** Recommendation */
    recommendation?: string;
}
/**
 * Validation statistics
 */
export interface ValidationStats {
    /** Total number of files scanned */
    fileCount: number;
    /** Total size in bytes */
    totalSize: number;
    /** Number of checks passed */
    checksPassed: number;
    /** Number of checks failed */
    checksFailed: number;
    /** Number of checks skipped */
    checksSkipped: number;
    /** Number of errors */
    errorCount: number;
    /** Number of warnings */
    warningCount: number;
}
/**
 * Factory Ready JSON output format
 */
export interface FactoryReadyJson {
    /** Schema version */
    version: string;
    /** Generation timestamp */
    timestamp: string;
    /** Project information */
    project: {
        /** Project name */
        name: string;
        /** Pipeline that generated this */
        pipeline: string;
        /** Project path */
        path: string;
    };
    /** Gate statuses */
    gates: {
        /** Build gate */
        build: GateStatus;
        /** Run gate */
        run: GateStatus;
        /** Test gate */
        test: GateStatus;
        /** Validation gate */
        validate: GateStatus;
        /** Package gate */
        package: GateStatus;
        /** Launch ready gate */
        launch_ready: GateStatus;
        /** Token integration gate */
        token_integration: GateStatus;
        /** Skill compliance gate (optional) */
        skill_compliance?: GateStatus;
    };
    /** Overall status */
    overall: 'PASS' | 'FAIL';
    /** Next steps for the user */
    next_steps: string[];
}
/**
 * Gate status in Factory Ready JSON
 */
export interface GateStatus {
    /** Gate status */
    status: 'pass' | 'fail' | 'skip' | 'enabled' | 'disabled';
    /** Details or note */
    details?: string;
    /** Additional note */
    note?: string;
    /** Sub-checks if applicable */
    checks?: Array<{
        name: string;
        passed: boolean;
    }>;
    /** Errors if failed */
    errors?: string[];
    /** Numeric values if applicable */
    file_count?: number;
    total_size_kb?: number;
}
/**
 * Schema validation result
 */
export interface SchemaValidationResult {
    /** Whether validation passed */
    valid: boolean;
    /** Validation errors */
    errors: SchemaError[];
}
/**
 * Schema validation error
 */
export interface SchemaError {
    /** JSON path to the error */
    path: string;
    /** Error message */
    message: string;
    /** Expected value/type */
    expected?: string;
    /** Actual value/type */
    actual?: string;
}
//# sourceMappingURL=validation.d.ts.map