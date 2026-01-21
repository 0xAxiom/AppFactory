/**
 * Structured Logger
 *
 * Provides JSON-formatted logging for production use.
 * Logs include timestamp, level, event name, and structured data.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  event: string;
  data?: Record<string, unknown>;
}

function createLogEntry(
  level: LogLevel,
  event: string,
  data?: Record<string, unknown>
): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...(data && { data }),
  };
}

function formatLog(entry: LogEntry): string {
  return JSON.stringify(entry);
}

export const logger = {
  debug(event: string, data?: Record<string, unknown>) {
    if (process.env.LOG_LEVEL === 'debug') {
      console.debug(formatLog(createLogEntry('debug', event, data)));
    }
  },

  info(event: string, data?: Record<string, unknown>) {
    console.info(formatLog(createLogEntry('info', event, data)));
  },

  warn(event: string, data?: Record<string, unknown>) {
    console.warn(formatLog(createLogEntry('warn', event, data)));
  },

  error(event: string, data?: Record<string, unknown>) {
    console.error(formatLog(createLogEntry('error', event, data)));
  },
};
