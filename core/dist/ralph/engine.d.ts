/**
 * Ralph QA Engine
 *
 * The core Ralph quality assurance engine used across all pipelines.
 * Ralph is an adversarial QA agent that ensures production-ready quality.
 *
 * @module @appfactory/core/ralph
 */
import type { RalphConfig, RalphIterationResult, RalphReport, SkillAuditResult, E2ETestResult } from '../types/ralph.js';
import { Logger } from '../utils/logger.js';
/**
 * Ralph engine options
 */
export interface RalphEngineOptions {
    /** Ralph configuration */
    config: RalphConfig;
    /** Build path to review */
    buildPath: string;
    /** Pipeline identifier */
    pipeline: string;
    /** Logger instance (optional) */
    logger?: Logger;
    /** Hook called before each iteration */
    onIterationStart?: (iteration: number) => Promise<void>;
    /** Hook called after each iteration */
    onIterationComplete?: (result: RalphIterationResult) => Promise<void>;
    /** Custom skill audit runner */
    runSkillAudit?: (skill: string, buildPath: string) => Promise<SkillAuditResult>;
    /** Custom E2E test runner */
    runE2ETests?: (config: RalphConfig['e2eConfig']) => Promise<E2ETestResult>;
}
/**
 * Ralph QA Engine
 *
 * Runs iterative quality assurance checks until passing threshold is met
 * or maximum iterations are reached.
 */
export declare class RalphEngine {
    private config;
    private buildPath;
    private pipeline;
    private logger;
    private options;
    constructor(options: RalphEngineOptions);
    /**
     * Run the Ralph QA loop
     *
     * @returns Final Ralph report
     */
    run(): Promise<RalphReport>;
    /**
     * Run a single iteration
     */
    private runIteration;
    /**
     * Run all configured checks
     */
    private runChecks;
    /**
     * Run skill audits
     */
    private runSkillAudits;
    /**
     * Run E2E tests
     */
    private runE2E;
    /**
     * Calculate overall score and collect issues
     */
    private calculateScore;
    /**
     * Generate the completion promise block
     */
    private generateCompletionPromise;
}
/**
 * Create a new Ralph engine instance
 */
export declare function createRalphEngine(options: RalphEngineOptions): RalphEngine;
//# sourceMappingURL=engine.d.ts.map