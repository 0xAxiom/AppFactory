/**
 * Ralph QA Type Definitions
 *
 * Types for the Ralph Quality Assurance system used across all pipelines.
 * Ralph is the adversarial QA agent that ensures production-ready quality.
 *
 * @module @appfactory/core/types
 */
import type { Severity, Issue } from './pipeline.js';
export type { Issue };
/**
 * Ralph verdict status
 */
export type RalphVerdict = 'PASS' | 'FAIL' | 'PENDING';
/**
 * Ralph check category
 */
export type CheckCategory = 'build' | 'runtime' | 'ui' | 'ux' | 'accessibility' | 'performance' | 'security' | 'documentation' | 'research' | 'code-quality' | 'seo';
/**
 * Ralph configuration for a pipeline
 */
export interface RalphConfig {
    /** Minimum passing score (0-100) */
    passingThreshold: number;
    /** Maximum iterations before failure */
    maxIterations: number;
    /** Check definitions */
    checks: RalphCheck[];
    /** Skills to audit */
    skills?: SkillAuditConfig[];
    /** Whether to run E2E tests */
    runE2ETests: boolean;
    /** E2E test configuration */
    e2eConfig?: E2ETestConfig;
}
/**
 * Individual Ralph check definition
 */
export interface RalphCheck {
    /** Unique check identifier */
    id: string;
    /** Check name */
    name: string;
    /** Check category */
    category: CheckCategory;
    /** Check description */
    description: string;
    /** Whether this check is mandatory for passing */
    mandatory: boolean;
    /** Points awarded for passing (used in score calculation) */
    points: number;
    /** Function to verify the check (returns true if passed) */
    verify?: (context: RalphContext) => Promise<boolean>;
}
/**
 * Ralph check result
 */
export interface RalphCheckResult {
    /** Check ID */
    checkId: string;
    /** Whether the check passed */
    passed: boolean;
    /** Message explaining the result */
    message: string;
    /** Issues found */
    issues: Issue[];
    /** Time taken to run the check (ms) */
    duration: number;
}
/**
 * Skill audit configuration
 */
export interface SkillAuditConfig {
    /** Skill name (e.g., "react-best-practices") */
    name: string;
    /** Minimum passing score */
    threshold: number;
    /** Whether failing blocks progress */
    blocking: boolean;
}
/**
 * Skill audit result
 */
export interface SkillAuditResult {
    /** Skill name */
    skill: string;
    /** Score achieved (0-100) */
    score: number;
    /** Whether the audit passed */
    passed: boolean;
    /** Violations found */
    violations: SkillViolation[];
    /** Timestamp */
    timestamp: string;
}
/**
 * Skill violation
 */
export interface SkillViolation {
    /** Skill that was violated */
    skill: string;
    /** Rule that was violated */
    rule: string;
    /** Violation severity */
    severity: Severity;
    /** File where violation was found */
    file: string;
    /** Line number */
    line?: number;
    /** Violation message */
    message: string;
    /** Suggested fix */
    fix?: string;
}
/**
 * E2E test configuration
 */
export interface E2ETestConfig {
    /** Test framework (playwright, cypress) */
    framework: 'playwright' | 'cypress';
    /** Test directory */
    testDir: string;
    /** Base URL for tests */
    baseUrl: string;
    /** Timeout in milliseconds */
    timeout: number;
    /** Browser to use */
    browser: 'chromium' | 'firefox' | 'webkit';
}
/**
 * E2E test result
 */
export interface E2ETestResult {
    /** Whether all tests passed */
    passed: boolean;
    /** Total number of tests */
    total: number;
    /** Number of passed tests */
    passedCount: number;
    /** Number of failed tests */
    failedCount: number;
    /** Number of skipped tests */
    skippedCount: number;
    /** Failed test details */
    failures: E2ETestFailure[];
    /** Duration in milliseconds */
    duration: number;
}
/**
 * E2E test failure
 */
export interface E2ETestFailure {
    /** Test name */
    testName: string;
    /** Test file */
    file: string;
    /** Error message */
    error: string;
    /** Stack trace */
    stack?: string;
    /** Screenshot path if available */
    screenshot?: string;
}
/**
 * Ralph execution context
 */
export interface RalphContext {
    /** Build directory path */
    buildPath: string;
    /** Pipeline identifier */
    pipeline: string;
    /** Current iteration number */
    iteration: number;
    /** Previous iteration results */
    previousResults?: RalphIterationResult;
    /** Additional context data */
    data: Record<string, unknown>;
}
/**
 * Result of a single Ralph iteration
 */
export interface RalphIterationResult {
    /** Iteration number */
    iteration: number;
    /** Check results */
    checks: RalphCheckResult[];
    /** Skill audit results */
    skillAudits: SkillAuditResult[];
    /** E2E test results */
    e2eResults?: E2ETestResult;
    /** Overall score (0-100) */
    score: number;
    /** Verdict for this iteration */
    verdict: RalphVerdict;
    /** Issues to fix */
    issuesToFix: Issue[];
    /** Timestamp */
    timestamp: string;
    /** Duration in milliseconds */
    duration: number;
}
/**
 * Final Ralph report
 */
export interface RalphReport {
    /** Pipeline that was reviewed */
    pipeline: string;
    /** Build path that was reviewed */
    buildPath: string;
    /** Final verdict */
    verdict: RalphVerdict;
    /** Final score */
    score: number;
    /** Total iterations performed */
    iterations: number;
    /** All iteration results */
    iterationResults: RalphIterationResult[];
    /** Summary of remaining issues */
    remainingIssues: Issue[];
    /** Completion promise (if passed) */
    completionPromise?: string;
    /** Start timestamp */
    startedAt: string;
    /** Completion timestamp */
    completedAt: string;
    /** Total duration in milliseconds */
    totalDuration: number;
}
/**
 * Ralph progress entry for PROGRESS.md
 */
export interface RalphProgressEntry {
    /** Iteration number */
    iteration: number;
    /** Action taken */
    action: 'fix' | 'polish' | 'verify';
    /** Description of what was done */
    description: string;
    /** Issues fixed */
    issuesFixed: number;
    /** Remaining issues */
    remainingIssues: number;
    /** Score after this iteration */
    score: number;
    /** Timestamp */
    timestamp: string;
}
//# sourceMappingURL=ralph.d.ts.map