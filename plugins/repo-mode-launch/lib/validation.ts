/**
 * Validation utilities for Repo Mode launch intents
 * All validation is deterministic and does not make network calls
 */

export interface RepoValidation {
  valid: boolean;
  owner: string | null;
  repo: string | null;
  error?: string;
}

export interface WalletValidation {
  valid: boolean;
  address: string | null;
  error?: string;
}

export interface CommitShaValidation {
  valid: boolean;
  sha: string | null;
  error?: string;
}

/**
 * Validate GitHub repository URL
 * Only supports github.com repositories
 */
export function validateRepoUrl(url: string): RepoValidation {
  const githubPattern =
    /^https:\/\/github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_.-]+)\/?$/;
  const match = url.match(githubPattern);

  if (!match) {
    return {
      valid: false,
      owner: null,
      repo: null,
      error: 'Invalid GitHub URL. Must be https://github.com/{owner}/{repo}',
    };
  }

  const [, owner, repo] = match;

  // Remove .git suffix if present
  const cleanRepo = repo.replace(/\.git$/, '');

  return {
    valid: true,
    owner,
    repo: cleanRepo,
  };
}

/**
 * Validate Solana wallet address (base58 format)
 * Does not verify address exists on-chain
 */
export function validateWalletAddress(address: string): WalletValidation {
  // Solana addresses are base58-encoded and 32-44 characters
  const base58Pattern = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

  if (!base58Pattern.test(address)) {
    return {
      valid: false,
      address: null,
      error:
        'Invalid Solana wallet address. Must be base58-encoded, 32-44 characters.',
    };
  }

  return {
    valid: true,
    address,
  };
}

/**
 * Validate Git commit SHA (40 hex characters)
 */
export function validateCommitSha(sha: string): CommitShaValidation {
  const shaPattern = /^[a-f0-9]{40}$/;

  if (!shaPattern.test(sha.toLowerCase())) {
    return {
      valid: false,
      sha: null,
      error: 'Invalid commit SHA. Must be 40 lowercase hexadecimal characters.',
    };
  }

  return {
    valid: true,
    sha: sha.toLowerCase(),
  };
}

/**
 * Validate token symbol
 * 1-10 uppercase alphanumeric characters
 */
export function validateTokenSymbol(symbol: string): {
  valid: boolean;
  symbol: string | null;
  error?: string;
} {
  const symbolPattern = /^[A-Z0-9]{1,10}$/;

  if (!symbolPattern.test(symbol)) {
    return {
      valid: false,
      symbol: null,
      error:
        'Invalid token symbol. Must be 1-10 uppercase alphanumeric characters.',
    };
  }

  return {
    valid: true,
    symbol,
  };
}

/**
 * Validate brand name
 * 1-32 characters, non-empty
 */
export function validateBrandName(brand: string): {
  valid: boolean;
  brand: string | null;
  error?: string;
} {
  const trimmed = brand.trim();

  if (trimmed.length === 0) {
    return {
      valid: false,
      brand: null,
      error: 'Brand name cannot be empty.',
    };
  }

  if (trimmed.length > 32) {
    return {
      valid: false,
      brand: null,
      error: 'Brand name must be 32 characters or less.',
    };
  }

  return {
    valid: true,
    brand: trimmed,
  };
}

/**
 * Validate branch name matches deterministic pattern
 * Format: launch/{slug}-{8-char-hash}
 */
export function validateBranchName(branchName: string): {
  valid: boolean;
  error?: string;
} {
  const branchPattern = /^launch\/[a-z0-9-]+-[a-f0-9]{8}$/;

  if (!branchPattern.test(branchName)) {
    return {
      valid: false,
      error: 'Branch name must match pattern: launch/{slug}-{8-char-hash}',
    };
  }

  return {
    valid: true,
  };
}
