/**
 * Structured Logger
 *
 * Provides consistent logging across all AppFactory pipelines with
 * support for JSON mode (CI), human-friendly output, and automatic
 * secret redaction.
 *
 * @module @appfactory/core/utils
 */
import chalk from 'chalk';
/**
 * Structured logger with secret redaction and multiple output modes
 */
export class Logger {
    jsonMode;
    debugMode;
    context;
    redactPatterns;
    /**
     * Default patterns to redact from logs
     */
    static DEFAULT_REDACT_PATTERNS = [
        /sk-ant-[a-zA-Z0-9-]+/g, // Anthropic API keys
        /ANTHROPIC_API_KEY=[^\s]+/g,
        /sk-[a-zA-Z0-9]{48}/g, // OpenAI API keys
        /OPENAI_API_KEY=[^\s]+/g,
        /ghp_[a-zA-Z0-9]{36}/g, // GitHub personal access tokens
        /ghs_[a-zA-Z0-9]{36}/g, // GitHub secret scanning tokens
        /npm_[a-zA-Z0-9]{36}/g, // npm tokens
        /Bearer\s+[a-zA-Z0-9._-]+/gi, // Bearer tokens
        /Authorization:\s*[^\s]+/gi, // Authorization headers
        /password['":\s]*[^\s,}]+/gi, // Password fields
        /secret['":\s]*[^\s,}]+/gi, // Secret fields
    ];
    constructor(options = {}) {
        this.jsonMode = options.jsonMode ?? false;
        this.debugMode = options.debugMode ?? false;
        this.context = options.context ?? '';
        this.redactPatterns = [
            ...Logger.DEFAULT_REDACT_PATTERNS,
            ...(options.redactPatterns ?? []),
        ];
    }
    /**
     * Enable or disable JSON output mode
     */
    setJsonMode(enabled) {
        this.jsonMode = enabled;
    }
    /**
     * Enable or disable debug mode
     */
    setDebugMode(enabled) {
        this.debugMode = enabled;
    }
    /**
     * Set the context prefix for log messages
     */
    setContext(context) {
        this.context = context;
    }
    /**
     * Add a custom redaction pattern
     */
    addRedactPattern(pattern) {
        this.redactPatterns.push(pattern);
    }
    /**
     * Redact sensitive information from a string
     */
    redact(message) {
        let result = message;
        for (const pattern of this.redactPatterns) {
            result = result.replace(pattern, '[REDACTED]');
        }
        return result;
    }
    /**
     * Format the current timestamp
     */
    formatTimestamp() {
        return new Date().toISOString();
    }
    /**
     * Get the prefix for a log level
     */
    getPrefix(level) {
        switch (level) {
            case 'debug':
                return chalk.gray('[DEBUG]');
            case 'info':
                return chalk.blue('[INFO]');
            case 'warn':
                return chalk.yellow('[WARN]');
            case 'error':
                return chalk.red('[ERROR]');
            case 'success':
                return chalk.green('[OK]');
        }
    }
    /**
     * Core logging method
     */
    log(level, message, data) {
        const redactedMessage = this.redact(message);
        const redactedData = data
            ? JSON.parse(this.redact(JSON.stringify(data)))
            : undefined;
        if (this.jsonMode) {
            const entry = {
                level,
                message: redactedMessage,
                timestamp: this.formatTimestamp(),
                ...(this.context && { context: this.context }),
                ...(redactedData && { data: redactedData }),
            };
            console.log(JSON.stringify(entry));
            return;
        }
        const prefix = this.getPrefix(level);
        const contextStr = this.context ? chalk.gray(`[${this.context}] `) : '';
        const formattedMessage = `${prefix} ${contextStr}${redactedMessage}`;
        if (data && this.debugMode) {
            console.log(formattedMessage);
            console.log(chalk.gray(JSON.stringify(redactedData, null, 2)));
        }
        else {
            console.log(formattedMessage);
        }
    }
    /**
     * Log a debug message (only shown in debug mode)
     */
    debug(message, data) {
        if (this.debugMode) {
            this.log('debug', message, data);
        }
    }
    /**
     * Log an info message
     */
    info(message, data) {
        this.log('info', message, data);
    }
    /**
     * Log a warning message
     */
    warn(message, data) {
        this.log('warn', message, data);
    }
    /**
     * Log an error message
     */
    error(message, data) {
        this.log('error', message, data);
    }
    /**
     * Log a success message
     */
    success(message, data) {
        this.log('success', message, data);
    }
    // =========================================================================
    // Semantic Logging Methods
    // =========================================================================
    /**
     * Log the start of a pipeline
     */
    pipelineStart(pipeline, runId) {
        this.info(`Starting pipeline: ${pipeline}`, { runId });
    }
    /**
     * Log pipeline completion
     */
    pipelineComplete(pipeline, duration) {
        this.success(`Pipeline completed in ${(duration / 1000).toFixed(1)}s`, {
            pipeline,
            durationMs: duration,
        });
    }
    /**
     * Log pipeline failure
     */
    pipelineFailed(pipeline, error) {
        this.error(`Pipeline failed: ${error}`, { pipeline });
    }
    /**
     * Log the start of a phase
     */
    phaseStart(phaseId, phaseName) {
        this.info(`Starting phase ${phaseId}: ${phaseName}`);
    }
    /**
     * Log phase completion
     */
    phaseComplete(phaseId, duration) {
        const durationStr = duration ? ` (${(duration / 1000).toFixed(1)}s)` : '';
        this.success(`Phase ${phaseId} completed${durationStr}`);
    }
    /**
     * Log phase failure
     */
    phaseFailed(phaseId, error) {
        this.error(`Phase ${phaseId} failed: ${error}`);
    }
    /**
     * Log validation start
     */
    validationStart(schemaName) {
        this.debug(`Validating against schema: ${schemaName}`);
    }
    /**
     * Log validation success
     */
    validationSuccess(schemaName) {
        this.success(`Schema validation passed: ${schemaName}`);
    }
    /**
     * Log validation failure
     */
    validationFailed(schemaName, errors) {
        this.error(`Schema validation failed: ${schemaName}`);
        for (const err of errors) {
            this.error(`  - ${err}`);
        }
    }
    /**
     * Log Ralph iteration
     */
    ralphIteration(iteration, score, verdict) {
        const icon = verdict === 'PASS' ? chalk.green('PASS') : chalk.red('FAIL');
        this.info(`Ralph iteration ${iteration}: ${icon} (score: ${score}%)`);
    }
    /**
     * Log file write
     */
    fileWrite(path) {
        this.debug(`Writing file: ${path}`);
    }
    /**
     * Log file read
     */
    fileRead(path) {
        this.debug(`Reading file: ${path}`);
    }
    /**
     * Log a script execution
     */
    scriptStart(scriptName) {
        this.debug(`Executing script: ${scriptName}`);
    }
    /**
     * Log script success
     */
    scriptSuccess(scriptName) {
        this.success(`Script passed: ${scriptName}`);
    }
    /**
     * Log script failure
     */
    scriptFailed(scriptName, exitCode) {
        this.error(`Script failed: ${scriptName} (exit code ${exitCode})`);
    }
}
/**
 * Create a new logger instance with the given options
 */
export function createLogger(options) {
    return new Logger(options);
}
/**
 * Default logger instance
 */
export const logger = new Logger();
//# sourceMappingURL=logger.js.map