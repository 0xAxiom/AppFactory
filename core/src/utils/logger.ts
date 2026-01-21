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
export class Logger {
  private jsonMode: boolean;
  private debugMode: boolean;
  private context: string;
  private redactPatterns: RegExp[];

  /**
   * Default patterns to redact from logs
   */
  private static readonly DEFAULT_REDACT_PATTERNS: RegExp[] = [
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

  constructor(options: LoggerOptions = {}) {
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
  setJsonMode(enabled: boolean): void {
    this.jsonMode = enabled;
  }

  /**
   * Enable or disable debug mode
   */
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }

  /**
   * Set the context prefix for log messages
   */
  setContext(context: string): void {
    this.context = context;
  }

  /**
   * Add a custom redaction pattern
   */
  addRedactPattern(pattern: RegExp): void {
    this.redactPatterns.push(pattern);
  }

  /**
   * Redact sensitive information from a string
   */
  private redact(message: string): string {
    let result = message;
    for (const pattern of this.redactPatterns) {
      result = result.replace(pattern, '[REDACTED]');
    }
    return result;
  }

  /**
   * Format the current timestamp
   */
  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Get the prefix for a log level
   */
  private getPrefix(level: LogLevel): string {
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
  private log(
    level: LogLevel,
    message: string,
    data?: Record<string, unknown>
  ): void {
    const redactedMessage = this.redact(message);
    const redactedData = data
      ? JSON.parse(this.redact(JSON.stringify(data)))
      : undefined;

    if (this.jsonMode) {
      const entry: LogEntry = {
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
    } else {
      console.log(formattedMessage);
    }
  }

  /**
   * Log a debug message (only shown in debug mode)
   */
  debug(message: string, data?: Record<string, unknown>): void {
    if (this.debugMode) {
      this.log('debug', message, data);
    }
  }

  /**
   * Log an info message
   */
  info(message: string, data?: Record<string, unknown>): void {
    this.log('info', message, data);
  }

  /**
   * Log a warning message
   */
  warn(message: string, data?: Record<string, unknown>): void {
    this.log('warn', message, data);
  }

  /**
   * Log an error message
   */
  error(message: string, data?: Record<string, unknown>): void {
    this.log('error', message, data);
  }

  /**
   * Log a success message
   */
  success(message: string, data?: Record<string, unknown>): void {
    this.log('success', message, data);
  }

  // =========================================================================
  // Semantic Logging Methods
  // =========================================================================

  /**
   * Log the start of a pipeline
   */
  pipelineStart(pipeline: string, runId: string): void {
    this.info(`Starting pipeline: ${pipeline}`, { runId });
  }

  /**
   * Log pipeline completion
   */
  pipelineComplete(pipeline: string, duration: number): void {
    this.success(`Pipeline completed in ${(duration / 1000).toFixed(1)}s`, {
      pipeline,
      durationMs: duration,
    });
  }

  /**
   * Log pipeline failure
   */
  pipelineFailed(pipeline: string, error: string): void {
    this.error(`Pipeline failed: ${error}`, { pipeline });
  }

  /**
   * Log the start of a phase
   */
  phaseStart(phaseId: string, phaseName: string): void {
    this.info(`Starting phase ${phaseId}: ${phaseName}`);
  }

  /**
   * Log phase completion
   */
  phaseComplete(phaseId: string, duration?: number): void {
    const durationStr = duration ? ` (${(duration / 1000).toFixed(1)}s)` : '';
    this.success(`Phase ${phaseId} completed${durationStr}`);
  }

  /**
   * Log phase failure
   */
  phaseFailed(phaseId: string, error: string): void {
    this.error(`Phase ${phaseId} failed: ${error}`);
  }

  /**
   * Log validation start
   */
  validationStart(schemaName: string): void {
    this.debug(`Validating against schema: ${schemaName}`);
  }

  /**
   * Log validation success
   */
  validationSuccess(schemaName: string): void {
    this.success(`Schema validation passed: ${schemaName}`);
  }

  /**
   * Log validation failure
   */
  validationFailed(schemaName: string, errors: string[]): void {
    this.error(`Schema validation failed: ${schemaName}`);
    for (const err of errors) {
      this.error(`  - ${err}`);
    }
  }

  /**
   * Log Ralph iteration
   */
  ralphIteration(iteration: number, score: number, verdict: string): void {
    const icon = verdict === 'PASS' ? chalk.green('PASS') : chalk.red('FAIL');
    this.info(`Ralph iteration ${iteration}: ${icon} (score: ${score}%)`);
  }

  /**
   * Log file write
   */
  fileWrite(path: string): void {
    this.debug(`Writing file: ${path}`);
  }

  /**
   * Log file read
   */
  fileRead(path: string): void {
    this.debug(`Reading file: ${path}`);
  }

  /**
   * Log a script execution
   */
  scriptStart(scriptName: string): void {
    this.debug(`Executing script: ${scriptName}`);
  }

  /**
   * Log script success
   */
  scriptSuccess(scriptName: string): void {
    this.success(`Script passed: ${scriptName}`);
  }

  /**
   * Log script failure
   */
  scriptFailed(scriptName: string, exitCode: number): void {
    this.error(`Script failed: ${scriptName} (exit code ${exitCode})`);
  }
}

/**
 * Create a new logger instance with the given options
 */
export function createLogger(options?: LoggerOptions): Logger {
  return new Logger(options);
}

/**
 * Default logger instance
 */
export const logger = new Logger();
