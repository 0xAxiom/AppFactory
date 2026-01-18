/**
 * Error handling utilities with typed error codes.
 * Follows Rig patterns for predictable error responses.
 */

export type ErrorCode =
  | 'DIR_NOT_FOUND'
  | 'FILE_UNREADABLE'
  | 'PATH_TRAVERSAL'
  | 'MAX_ITERATIONS'
  | 'RATE_LIMIT'
  | 'LLM_TIMEOUT'
  | 'VALIDATION_ERROR'
  | 'PROCESSING_ERROR'
  | 'CONFIGURATION_ERROR'
  | 'INTERNAL_ERROR';

export class AgentError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public statusCode: number = 500,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AgentError';
  }
}

export class ValidationError extends AgentError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, context);
    this.name = 'ValidationError';
  }
}

export class PathTraversalError extends AgentError {
  constructor(path: string) {
    super(`Path traversal attempt blocked: ${path}`, 'PATH_TRAVERSAL', 403, { path });
    this.name = 'PathTraversalError';
  }
}

export class DirectoryNotFoundError extends AgentError {
  constructor(path: string) {
    super(`Directory not found: ${path}`, 'DIR_NOT_FOUND', 400, { path });
    this.name = 'DirectoryNotFoundError';
  }
}

export class FileUnreadableError extends AgentError {
  constructor(path: string, reason?: string) {
    super(`File unreadable: ${path}${reason ? ` (${reason})` : ''}`, 'FILE_UNREADABLE', 400, { path, reason });
    this.name = 'FileUnreadableError';
  }
}

export class MaxIterationsError extends AgentError {
  constructor(iterations: number) {
    super(`Maximum iterations (${iterations}) exceeded`, 'MAX_ITERATIONS', 200, { iterations });
    this.name = 'MaxIterationsError';
  }
}

export class RateLimitError extends AgentError {
  constructor(retryAfter?: number) {
    super('Rate limit exceeded', 'RATE_LIMIT', 429, { retryAfter });
    this.name = 'RateLimitError';
  }
}

export class LLMTimeoutError extends AgentError {
  constructor(timeoutMs: number) {
    super(`LLM request timed out after ${timeoutMs}ms`, 'LLM_TIMEOUT', 504, { timeoutMs });
    this.name = 'LLMTimeoutError';
  }
}

export function handleError(error: unknown): { statusCode: number; body: object } {
  if (error instanceof AgentError) {
    return {
      statusCode: error.statusCode,
      body: {
        error: error.message,
        code: error.code,
        context: error.context,
      },
    };
  }

  if (error instanceof Error) {
    return {
      statusCode: 500,
      body: {
        error: error.message,
        code: 'INTERNAL_ERROR' as ErrorCode,
      },
    };
  }

  return {
    statusCode: 500,
    body: {
      error: 'Internal server error',
      code: 'INTERNAL_ERROR' as ErrorCode,
    },
  };
}
