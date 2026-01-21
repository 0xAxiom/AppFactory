/**
 * Structured Logger
 *
 * Provides consistent logging across all AppFactory pipelines with
 * support for JSON mode (CI), human-friendly output, and automatic
 * secret redaction.
 *
 * @module @appfactory/core/utils
 */
/**
 * Log level enumeration
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';
/**
 * Log entry structure for JSON mode
 */
export interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    context?: string;
    data?: Record<string, unknown>;
}
/**
 * Logger configuration options
 */
export interface LoggerOptions {
    /** Enable JSON output mode (for CI environments) */
    jsonMode?: boolean;
    /** Enable debug level logging */
    debugMode?: boolean;
    /** Context prefix for all log messages */
    context?: string;
    /** Additional patterns to redact from logs */
    redactPatterns?: RegExp[];
}
/**
 * Structured logger with secret redaction and multiple output modes
 */
export declare class Logger {
    private jsonMode;
    private debugMode;
    private context;
    private redactPatterns;
    /**
     * Default patterns to redact from logs
     */
    private static readonly DEFAULT_REDACT_PATTERNS;
    constructor(options?: LoggerOptions);
    /**
     * Enable or disable JSON output mode
     */
    setJsonMode(enabled: boolean): void;
    /**
     * Enable or disable debug mode
     */
    setDebugMode(enabled: boolean): void;
    /**
     * Set the context prefix for log messages
     */
    setContext(context: string): void;
    /**
     * Add a custom redaction pattern
     */
    addRedactPattern(pattern: RegExp): void;
    /**
     * Redact sensitive information from a string
     */
    private redact;
    /**
     * Format the current timestamp
     */
    private formatTimestamp;
    /**
     * Get the prefix for a log level
     */
    private getPrefix;
    /**
     * Core logging method
     */
    private log;
    /**
     * Log a debug message (only shown in debug mode)
     */
    debug(message: string, data?: Record<string, unknown>): void;
    /**
     * Log an info message
     */
    info(message: string, data?: Record<string, unknown>): void;
    /**
     * Log a warning message
     */
    warn(message: string, data?: Record<string, unknown>): void;
    /**
     * Log an error message
     */
    error(message: string, data?: Record<string, unknown>): void;
    /**
     * Log a success message
     */
    success(message: string, data?: Record<string, unknown>): void;
    /**
     * Log the start of a pipeline
     */
    pipelineStart(pipeline: string, runId: string): void;
    /**
     * Log pipeline completion
     */
    pipelineComplete(pipeline: string, duration: number): void;
    /**
     * Log pipeline failure
     */
    pipelineFailed(pipeline: string, error: string): void;
    /**
     * Log the start of a phase
     */
    phaseStart(phaseId: string, phaseName: string): void;
    /**
     * Log phase completion
     */
    phaseComplete(phaseId: string, duration?: number): void;
    /**
     * Log phase failure
     */
    phaseFailed(phaseId: string, error: string): void;
    /**
     * Log validation start
     */
    validationStart(schemaName: string): void;
    /**
     * Log validation success
     */
    validationSuccess(schemaName: string): void;
    /**
     * Log validation failure
     */
    validationFailed(schemaName: string, errors: string[]): void;
    /**
     * Log Ralph iteration
     */
    ralphIteration(iteration: number, score: number, verdict: string): void;
    /**
     * Log file write
     */
    fileWrite(path: string): void;
    /**
     * Log file read
     */
    fileRead(path: string): void;
    /**
     * Log a script execution
     */
    scriptStart(scriptName: string): void;
    /**
     * Log script success
     */
    scriptSuccess(scriptName: string): void;
    /**
     * Log script failure
     */
    scriptFailed(scriptName: string, exitCode: number): void;
}
/**
 * Create a new logger instance with the given options
 */
export declare function createLogger(options?: LoggerOptions): Logger;
/**
 * Default logger instance
 */
export declare const logger: Logger;
//# sourceMappingURL=logger.d.ts.map