/**
 * Error types for Repo Mode launch operations
 */

export enum RepoModeErrorCode {
  // Validation errors (1xx)
  INVALID_REPO_URL = 'REPO_100',
  INVALID_COMMIT_SHA = 'REPO_101',
  INVALID_WALLET_ADDRESS = 'REPO_102',
  INVALID_TOKEN_SYMBOL = 'REPO_103',
  INVALID_BRAND_NAME = 'REPO_104',
  INVALID_BRANCH_NAME = 'REPO_105',
  INVALID_INTENT_FORMAT = 'REPO_106',
  HASH_MISMATCH = 'REPO_107',

  // Network errors (2xx)
  LAUNCHPAD_UNREACHABLE = 'REPO_200',
  LAUNCHPAD_ERROR = 'REPO_201',
  REPO_NOT_FOUND = 'REPO_202',
  REPO_NOT_PUBLIC = 'REPO_203',
  COMMIT_NOT_FOUND = 'REPO_204',

  // Attestation errors (3xx)
  ATTESTATION_EXPIRED = 'REPO_300',
  ATTESTATION_INVALID = 'REPO_301',
  SIGNATURE_INVALID = 'REPO_302',
  WALLET_MISMATCH = 'REPO_303',

  // Transaction errors (4xx)
  TRANSACTION_FAILED = 'REPO_400',
  INSUFFICIENT_BALANCE = 'REPO_401',
  TOKEN_MINT_FAILED = 'REPO_402',

  // Internal errors (5xx)
  INTERNAL_ERROR = 'REPO_500',
  CONFIG_MISSING = 'REPO_501'
}

export class RepoModeError extends Error {
  readonly code: RepoModeErrorCode;
  readonly details?: Record<string, unknown>;
  readonly timestamp: string;

  constructor(
    code: RepoModeErrorCode,
    message: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'RepoModeError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace?.(this, RepoModeError);
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp
    };
  }

  static validation(code: RepoModeErrorCode, message: string, field?: string): RepoModeError {
    return new RepoModeError(code, message, field ? { field } : undefined);
  }

  static network(code: RepoModeErrorCode, message: string, url?: string): RepoModeError {
    return new RepoModeError(code, message, url ? { url } : undefined);
  }

  static attestation(code: RepoModeErrorCode, message: string, intentId?: string): RepoModeError {
    return new RepoModeError(code, message, intentId ? { intentId } : undefined);
  }
}

/**
 * Type guard to check if an error is a RepoModeError
 */
export function isRepoModeError(error: unknown): error is RepoModeError {
  return error instanceof RepoModeError;
}

/**
 * Wrap unknown errors in RepoModeError
 */
export function wrapError(error: unknown, context?: string): RepoModeError {
  if (isRepoModeError(error)) {
    return error;
  }

  const message = error instanceof Error ? error.message : String(error);
  return new RepoModeError(
    RepoModeErrorCode.INTERNAL_ERROR,
    context ? `${context}: ${message}` : message,
    { originalError: message }
  );
}
