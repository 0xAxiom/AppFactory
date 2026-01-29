/**
 * Ralph Report Generation
 *
 * Utilities for generating Ralph QA reports in various formats.
 *
 * @module @appfactory/core/ralph
 */
/**
 * Generate the PROGRESS.md content
 */
export function generateProgressMarkdown(report) {
    const lines = [];
    lines.push('# Ralph QA Progress Log');
    lines.push('');
    lines.push(`**Pipeline**: ${report.pipeline}`);
    lines.push(`**Build Path**: ${report.buildPath}`);
    lines.push(`**Started**: ${report.startedAt}`);
    lines.push(`**Completed**: ${report.completedAt}`);
    lines.push(`**Total Duration**: ${(report.totalDuration / 1000).toFixed(1)}s`);
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push('## Iterations');
    lines.push('');
    for (const iteration of report.iterationResults) {
        lines.push(`### Iteration ${iteration.iteration}`);
        lines.push('');
        lines.push(`- **Timestamp**: ${iteration.timestamp}`);
        lines.push(`- **Duration**: ${(iteration.duration / 1000).toFixed(1)}s`);
        lines.push(`- **Score**: ${iteration.score}%`);
        lines.push(`- **Verdict**: ${iteration.verdict}`);
        lines.push('');
        // Check results
        const failedChecks = iteration.checks.filter((c) => !c.passed);
        const passedChecks = iteration.checks.filter((c) => c.passed);
        if (failedChecks.length > 0) {
            lines.push('**Failed Checks:**');
            for (const check of failedChecks) {
                lines.push(`- [ ] ${check.checkId}: ${check.message}`);
            }
            lines.push('');
        }
        if (passedChecks.length > 0) {
            lines.push('**Passed Checks:**');
            for (const check of passedChecks) {
                lines.push(`- [x] ${check.checkId}`);
            }
            lines.push('');
        }
        // Skill audit results
        if (iteration.skillAudits.length > 0) {
            lines.push('**Skill Audits:**');
            for (const audit of iteration.skillAudits) {
                const status = audit.passed ? '[PASS]' : '[FAIL]';
                lines.push(`- ${status} ${audit.skill}: ${audit.score}%`);
            }
            lines.push('');
        }
        // E2E results
        if (iteration.e2eResults) {
            const e2e = iteration.e2eResults;
            const status = e2e.passed ? '[PASS]' : '[FAIL]';
            lines.push(`**E2E Tests:** ${status} (${e2e.passedCount}/${e2e.total} passed)`);
            lines.push('');
        }
        // Issues to fix
        if (iteration.issuesToFix.length > 0) {
            lines.push('**Issues to Fix:**');
            for (const issue of iteration.issuesToFix.slice(0, 10)) {
                lines.push(`- [${issue.severity.toUpperCase()}] ${issue.message}`);
                if (issue.file) {
                    lines.push(`  - File: ${issue.file}${issue.line ? `:${issue.line}` : ''}`);
                }
            }
            if (iteration.issuesToFix.length > 10) {
                lines.push(`... and ${iteration.issuesToFix.length - 10} more`);
            }
            lines.push('');
        }
        lines.push('---');
        lines.push('');
    }
    // Final summary
    lines.push('## Final Summary');
    lines.push('');
    lines.push(`**Final Verdict**: ${report.verdict}`);
    lines.push(`**Final Score**: ${report.score}%`);
    lines.push(`**Total Iterations**: ${report.iterations}`);
    lines.push('');
    if (report.remainingIssues.length > 0) {
        lines.push('### Remaining Issues');
        lines.push('');
        for (const issue of report.remainingIssues) {
            lines.push(`- [${issue.severity.toUpperCase()}] ${issue.message}`);
        }
        lines.push('');
    }
    if (report.completionPromise) {
        lines.push('---');
        lines.push('');
        lines.push('```');
        lines.push(report.completionPromise);
        lines.push('```');
    }
    return lines.join('\n');
}
/**
 * Generate a condensed LOOP.md content
 */
export function generateLoopMarkdown(report) {
    const lines = [];
    lines.push('# Ralph QA Loop Summary');
    lines.push('');
    lines.push('| Iteration | Score | Verdict | Duration | Issues Fixed |');
    lines.push('|-----------|-------|---------|----------|--------------|');
    let previousIssueCount = 0;
    for (const iteration of report.iterationResults) {
        const issuesFixed = previousIssueCount - iteration.issuesToFix.length;
        const issuesFixedStr = previousIssueCount > 0
            ? issuesFixed > 0
                ? `+${issuesFixed}`
                : '0'
            : '-';
        lines.push(`| ${iteration.iteration} | ${iteration.score}% | ${iteration.verdict} | ${(iteration.duration / 1000).toFixed(1)}s | ${issuesFixedStr} |`);
        previousIssueCount = iteration.issuesToFix.length;
    }
    lines.push('');
    lines.push(`**Final**: ${report.verdict} (${report.score}%)`);
    return lines.join('\n');
}
/**
 * Generate QA_NOTES.md content
 */
export function generateQANotesMarkdown(report) {
    const lines = [];
    lines.push('# Ralph QA Notes');
    lines.push('');
    lines.push('## Quality Assessment');
    lines.push('');
    lines.push(`- **Overall Score**: ${report.score}%`);
    lines.push(`- **Verdict**: ${report.verdict}`);
    lines.push(`- **Iterations Required**: ${report.iterations}`);
    lines.push('');
    // Categorize issues
    const issuesByCategory = {};
    for (const issue of report.remainingIssues) {
        const category = issue.category || 'other';
        if (!issuesByCategory[category]) {
            issuesByCategory[category] = [];
        }
        issuesByCategory[category].push(issue);
    }
    if (Object.keys(issuesByCategory).length > 0) {
        lines.push('## Issues by Category');
        lines.push('');
        for (const [category, issues] of Object.entries(issuesByCategory)) {
            lines.push(`### ${category}`);
            lines.push('');
            for (const issue of issues) {
                lines.push(`- **[${issue.severity.toUpperCase()}]** ${issue.message}`);
                if (issue.fix) {
                    lines.push(`  - Fix: ${issue.fix}`);
                }
            }
            lines.push('');
        }
    }
    // Strengths
    const lastResult = report.iterationResults[report.iterationResults.length - 1];
    const passedChecks = lastResult.checks.filter((c) => c.passed);
    if (passedChecks.length > 0) {
        lines.push('## Strengths');
        lines.push('');
        for (const check of passedChecks) {
            lines.push(`- ${check.checkId}: ${check.message}`);
        }
        lines.push('');
    }
    return lines.join('\n');
}
/**
 * Generate acceptance criteria status
 */
export function generateAcceptanceMarkdown(checks) {
    const lines = [];
    lines.push('# Acceptance Criteria');
    lines.push('');
    for (const check of checks) {
        const status = check.passed ? '[x]' : '[ ]';
        lines.push(`- ${status} ${check.name}`);
    }
    return lines.join('\n');
}
/**
 * Parse a progress entry from markdown
 */
export function parseProgressEntry(markdown, iteration) {
    const iterationRegex = new RegExp(`### Iteration ${iteration}[\\s\\S]*?(?=###|$)`);
    const match = markdown.match(iterationRegex);
    if (!match)
        return null;
    const content = match[0];
    const scoreMatch = content.match(/Score[:\s]*(\d+)%/);
    const timestampMatch = content.match(/Timestamp[:\s]*([^\n]+)/);
    return {
        iteration,
        action: 'verify',
        description: `Iteration ${iteration} completed`,
        issuesFixed: 0,
        remainingIssues: 0,
        score: scoreMatch ? parseInt(scoreMatch[1], 10) : 0,
        timestamp: timestampMatch
            ? timestampMatch[1].trim()
            : new Date().toISOString(),
    };
}
//# sourceMappingURL=report.js.map