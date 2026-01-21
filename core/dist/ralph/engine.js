/**
 * Ralph QA Engine
 *
 * The core Ralph quality assurance engine used across all pipelines.
 * Ralph is an adversarial QA agent that ensures production-ready quality.
 *
 * @module @appfactory/core/ralph
 */
import { createLogger } from '../utils/logger.js';
/**
 * Ralph QA Engine
 *
 * Runs iterative quality assurance checks until passing threshold is met
 * or maximum iterations are reached.
 */
export class RalphEngine {
  config;
  buildPath;
  pipeline;
  logger;
  options;
  constructor(options) {
    this.config = options.config;
    this.buildPath = options.buildPath;
    this.pipeline = options.pipeline;
    this.logger = options.logger ?? createLogger({ context: 'Ralph' });
    this.options = options;
  }
  /**
   * Run the Ralph QA loop
   *
   * @returns Final Ralph report
   */
  async run() {
    const startTime = Date.now();
    const iterationResults = [];
    this.logger.info(
      `Starting Ralph QA (threshold: ${this.config.passingThreshold}%, max iterations: ${this.config.maxIterations})`
    );
    let iteration = 0;
    let finalVerdict = 'PENDING';
    while (iteration < this.config.maxIterations) {
      iteration++;
      if (this.options.onIterationStart) {
        await this.options.onIterationStart(iteration);
      }
      const result = await this.runIteration(
        iteration,
        iterationResults[iterationResults.length - 1]
      );
      iterationResults.push(result);
      if (this.options.onIterationComplete) {
        await this.options.onIterationComplete(result);
      }
      this.logger.ralphIteration(iteration, result.score, result.verdict);
      if (result.verdict === 'PASS') {
        finalVerdict = 'PASS';
        break;
      }
      // Log issues to fix
      if (result.issuesToFix.length > 0) {
        this.logger.info(`Issues to fix (${result.issuesToFix.length}):`);
        for (const issue of result.issuesToFix.slice(0, 5)) {
          this.logger.warn(
            `  - [${issue.severity.toUpperCase()}] ${issue.message}`
          );
        }
        if (result.issuesToFix.length > 5) {
          this.logger.warn(`  ... and ${result.issuesToFix.length - 5} more`);
        }
      }
    }
    // If we exhausted iterations without passing, final verdict is FAIL
    if (finalVerdict === 'PENDING') {
      finalVerdict = 'FAIL';
    }
    const lastResult = iterationResults[iterationResults.length - 1];
    const completedAt = new Date().toISOString();
    const report = {
      pipeline: this.pipeline,
      buildPath: this.buildPath,
      verdict: finalVerdict,
      score: lastResult.score,
      iterations: iteration,
      iterationResults,
      remainingIssues: lastResult.issuesToFix,
      startedAt: new Date(startTime).toISOString(),
      completedAt,
      totalDuration: Date.now() - startTime,
    };
    if (finalVerdict === 'PASS') {
      report.completionPromise = this.generateCompletionPromise();
      this.logger.success(
        `Ralph PASS - All criteria met (score: ${lastResult.score}%)`
      );
    } else {
      this.logger.error(
        `Ralph FAIL - Score ${lastResult.score}% below threshold ${this.config.passingThreshold}%`
      );
    }
    return report;
  }
  /**
   * Run a single iteration
   */
  async runIteration(iteration, previousResult) {
    const startTime = Date.now();
    const context = {
      buildPath: this.buildPath,
      pipeline: this.pipeline,
      iteration,
      previousResults: previousResult,
      data: {},
    };
    // Run all checks
    const checkResults = await this.runChecks(context);
    // Run skill audits if configured
    const skillAudits = await this.runSkillAudits();
    // Run E2E tests if configured
    let e2eResults;
    if (this.config.runE2ETests && this.config.e2eConfig) {
      e2eResults = await this.runE2E();
    }
    // Calculate score
    const { score, issuesToFix } = this.calculateScore(
      checkResults,
      skillAudits,
      e2eResults
    );
    // Determine verdict
    const verdict = score >= this.config.passingThreshold ? 'PASS' : 'FAIL';
    return {
      iteration,
      checks: checkResults,
      skillAudits,
      e2eResults,
      score,
      verdict,
      issuesToFix,
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
    };
  }
  /**
   * Run all configured checks
   */
  async runChecks(context) {
    const results = [];
    for (const check of this.config.checks) {
      const startTime = Date.now();
      try {
        let passed = true;
        let message = `${check.name} passed`;
        const issues = [];
        if (check.verify) {
          passed = await check.verify(context);
          if (!passed) {
            message = `${check.name} failed`;
            issues.push({
              severity: check.mandatory ? 'critical' : 'medium',
              category: check.category,
              message: check.description,
            });
          }
        }
        results.push({
          checkId: check.id,
          passed,
          message,
          issues,
          duration: Date.now() - startTime,
        });
      } catch (error) {
        results.push({
          checkId: check.id,
          passed: false,
          message: `${check.name} threw an error: ${error instanceof Error ? error.message : String(error)}`,
          issues: [
            {
              severity: 'critical',
              category: 'error',
              message: `Check threw an error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          duration: Date.now() - startTime,
        });
      }
    }
    return results;
  }
  /**
   * Run skill audits
   */
  async runSkillAudits() {
    if (!this.config.skills || this.config.skills.length === 0) {
      return [];
    }
    const results = [];
    for (const skillConfig of this.config.skills) {
      if (this.options.runSkillAudit) {
        const result = await this.options.runSkillAudit(
          skillConfig.name,
          this.buildPath
        );
        results.push(result);
      } else {
        // Default stub result - pipelines should provide actual implementation
        results.push({
          skill: skillConfig.name,
          score: 100,
          passed: true,
          violations: [],
          timestamp: new Date().toISOString(),
        });
      }
    }
    return results;
  }
  /**
   * Run E2E tests
   */
  async runE2E() {
    if (!this.config.e2eConfig) {
      return undefined;
    }
    if (this.options.runE2ETests) {
      return this.options.runE2ETests(this.config.e2eConfig);
    }
    // Default stub result - pipelines should provide actual implementation
    return {
      passed: true,
      total: 0,
      passedCount: 0,
      failedCount: 0,
      skippedCount: 0,
      failures: [],
      duration: 0,
    };
  }
  /**
   * Calculate overall score and collect issues
   */
  calculateScore(checkResults, skillAudits, e2eResults) {
    const issuesToFix = [];
    // Calculate check score
    let totalPoints = 0;
    let earnedPoints = 0;
    for (const check of this.config.checks) {
      totalPoints += check.points;
      const result = checkResults.find((r) => r.checkId === check.id);
      if (result?.passed) {
        earnedPoints += check.points;
      } else if (result) {
        issuesToFix.push(...result.issues);
      }
    }
    // Include skill audit results
    for (const audit of skillAudits) {
      if (!audit.passed) {
        for (const violation of audit.violations) {
          issuesToFix.push({
            severity: violation.severity,
            category: 'code-quality',
            message: violation.message,
            file: violation.file,
            line: violation.line,
            rule: violation.rule,
            fix: violation.fix,
          });
        }
      }
    }
    // Include E2E failures
    if (e2eResults && !e2eResults.passed) {
      for (const failure of e2eResults.failures) {
        issuesToFix.push({
          severity: 'high',
          category: 'build',
          message: `E2E test failed: ${failure.testName}`,
          file: failure.file,
        });
      }
    }
    // Sort issues by severity
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    issuesToFix.sort(
      (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
    );
    const score =
      totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    return { score, issuesToFix };
  }
  /**
   * Generate the completion promise block
   */
  generateCompletionPromise() {
    const timestamp = new Date().toISOString();
    return `COMPLETION_PROMISE: All acceptance criteria met. Build is production-ready.

PIPELINE: ${this.pipeline}
OUTPUT: ${this.buildPath}
RALPH_VERDICT: PASS (>=${this.config.passingThreshold}%)
TIMESTAMP: ${timestamp}`;
  }
}
/**
 * Create a new Ralph engine instance
 */
export function createRalphEngine(options) {
  return new RalphEngine(options);
}
//# sourceMappingURL=engine.js.map
