/**
 * Ralph Report Generation
 *
 * Utilities for generating Ralph QA reports in various formats.
 *
 * @module @appfactory/core/ralph
 */
import type { RalphReport, RalphProgressEntry } from '../types/ralph.js';
/**
 * Generate the PROGRESS.md content
 */
export declare function generateProgressMarkdown(report: RalphReport): string;
/**
 * Generate a condensed LOOP.md content
 */
export declare function generateLoopMarkdown(report: RalphReport): string;
/**
 * Generate QA_NOTES.md content
 */
export declare function generateQANotesMarkdown(report: RalphReport): string;
/**
 * Generate acceptance criteria status
 */
export declare function generateAcceptanceMarkdown(checks: {
    name: string;
    passed: boolean;
}[]): string;
/**
 * Parse a progress entry from markdown
 */
export declare function parseProgressEntry(markdown: string, iteration: number): RalphProgressEntry | null;
//# sourceMappingURL=report.d.ts.map