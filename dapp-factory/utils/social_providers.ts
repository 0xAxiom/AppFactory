/**
 * Social Provider Resolution Utilities
 * 
 * Handles resolution of social identities (GitHub/Twitter/Kick) to Solana wallet addresses
 * for Token Launch v2 social fee claimers functionality.
 */

import { bagsApiFetch } from './retry.js';

// ============================================================================
// Types and Enums
// ============================================================================

export enum SocialProvider {
  GITHUB = 'github',
  TWITTER = 'twitter', 
  KICK = 'kick'
}

export interface SocialIdentity {
  provider: SocialProvider;
  username: string;
  display_name?: string;
}

export interface ResolvedSocialIdentity extends SocialIdentity {
  wallet_address: string;
  verified: boolean;
  resolution_timestamp: string;
}

export interface SocialResolutionRequest {
  provider: SocialProvider;
  username: string;
  resolve_to_wallet: boolean;
}

export interface SocialResolutionResponse {
  success: boolean;
  provider: SocialProvider;
  username: string;
  wallet_address?: string;
  verified?: boolean;
  error?: SocialResolutionError;
  error_message?: string;
  resolution_timestamp: string;
}

export enum SocialResolutionError {
  USERNAME_NOT_FOUND = 'username_not_found',
  WALLET_NOT_CONNECTED = 'wallet_not_connected',
  PROVIDER_UNAVAILABLE = 'provider_unavailable',
  INVALID_USERNAME_FORMAT = 'invalid_username_format',
  RATE_LIMITED = 'rate_limited',
  API_ERROR = 'api_error'
}

export interface BatchResolutionResult {
  resolved: ResolvedSocialIdentity[];
  failed: Array<{
    provider: SocialProvider;
    username: string;
    error: SocialResolutionError;
    error_message: string;
  }>;
  resolution_strategy: ResolutionStrategy;
  total_requested: number;
  successful_count: number;
  failed_count: number;
}

export enum ResolutionStrategy {
  FAIL_FAST = 'fail_fast',
  SKIP_UNRESOLVED = 'skip_unresolved',
  RETRY_FAILED = 'retry_failed'
}

// ============================================================================
// Username Validation
// ============================================================================

/**
 * Validates username format for each social provider
 */
export function validateUsername(provider: SocialProvider, username: string): void {
  switch (provider) {
    case SocialProvider.GITHUB:
      // GitHub usernames: alphanumeric, hyphens, max 39 chars, no consecutive hyphens
      if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]){0,37}[a-zA-Z0-9]$|^[a-zA-Z0-9]$/.test(username)) {
        throw new Error(`Invalid GitHub username format: ${username}. Must be alphanumeric with single hyphens, 1-39 characters.`);
      }
      
      // Check for reserved names
      const githubReserved = ['api', 'www', 'github', 'help', 'about', 'security', 'contact'];
      if (githubReserved.includes(username.toLowerCase())) {
        throw new Error(`GitHub username is reserved: ${username}`);
      }
      break;
      
    case SocialProvider.TWITTER:
      // Twitter handles: @ prefix, alphanumeric, underscores, max 15 chars
      if (!/^@[a-zA-Z0-9_]{1,15}$/.test(username)) {
        throw new Error(`Invalid Twitter handle format: ${username}. Must start with @ and be alphanumeric with underscores, max 15 characters.`);
      }
      
      // Remove @ for API calls but validate with it
      if (!username.startsWith('@')) {
        throw new Error(`Twitter usernames must start with @: ${username}`);
      }
      break;
      
    case SocialProvider.KICK:
      // Kick usernames: alphanumeric, underscores, max 25 chars
      if (!/^[a-zA-Z0-9_]{1,25}$/.test(username)) {
        throw new Error(`Invalid Kick username format: ${username}. Must be alphanumeric with underscores, 1-25 characters.`);
      }
      break;
      
    default:
      throw new Error(`Unsupported social provider: ${provider}`);
  }
}

/**
 * Normalizes username for API calls (removes @ from Twitter handles)
 */
export function normalizeUsername(provider: SocialProvider, username: string): string {
  validateUsername(provider, username);
  
  switch (provider) {
    case SocialProvider.TWITTER:
      // Remove @ prefix for API calls
      return username.slice(1);
      
    case SocialProvider.GITHUB:
    case SocialProvider.KICK:
      return username;
      
    default:
      throw new Error(`Unsupported social provider: ${provider}`);
  }
}

/**
 * Formats username for display (adds @ for Twitter if missing)
 */
export function formatUsernameForDisplay(provider: SocialProvider, username: string): string {
  switch (provider) {
    case SocialProvider.TWITTER:
      return username.startsWith('@') ? username : `@${username}`;
      
    case SocialProvider.GITHUB:
    case SocialProvider.KICK:
      return username;
      
    default:
      throw new Error(`Unsupported social provider: ${provider}`);
  }
}

// ============================================================================
// Single Resolution
// ============================================================================

/**
 * Resolves a single social identity to a Solana wallet address
 */
export async function resolveSocialIdentity(request: SocialResolutionRequest): Promise<SocialResolutionResponse> {
  const startTime = new Date().toISOString();
  
  try {
    // Validate and normalize username
    validateUsername(request.provider, request.username);
    const normalizedUsername = normalizeUsername(request.provider, request.username);
    
    // Call Bags API for social provider resolution
    const response = await bagsApiFetch('/social/resolve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        provider: request.provider,
        username: normalizedUsername,
        resolve_to_wallet: request.resolve_to_wallet
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error ${response.status}: ${errorData.message || 'Unknown error'}`);
    }
    
    const resolutionData = await response.json();
    
    if (!resolutionData.success) {\n      return {\n        success: false,\n        provider: request.provider,\n        username: request.username,\n        error: resolutionData.error || SocialResolutionError.API_ERROR,\n        error_message: resolutionData.error_message || 'Resolution failed',\n        resolution_timestamp: startTime\n      };\n    }\n    \n    // Validate wallet address if provided\n    if (resolutionData.wallet_address && !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(resolutionData.wallet_address)) {\n      throw new Error(`Invalid wallet address returned: ${resolutionData.wallet_address}`);\n    }\n    \n    return {\n      success: true,\n      provider: request.provider,\n      username: request.username,\n      wallet_address: resolutionData.wallet_address,\n      verified: resolutionData.verified || false,\n      resolution_timestamp: startTime\n    };\n    \n  } catch (error) {\n    // Classify error type\n    let errorType = SocialResolutionError.API_ERROR;\n    let errorMessage = error instanceof Error ? error.message : String(error);\n    \n    if (errorMessage.includes('not found')) {\n      errorType = SocialResolutionError.USERNAME_NOT_FOUND;\n    } else if (errorMessage.includes('not connected')) {\n      errorType = SocialResolutionError.WALLET_NOT_CONNECTED;\n    } else if (errorMessage.includes('rate limit')) {\n      errorType = SocialResolutionError.RATE_LIMITED;\n    } else if (errorMessage.includes('unavailable')) {\n      errorType = SocialResolutionError.PROVIDER_UNAVAILABLE;\n    }\n    \n    return {\n      success: false,\n      provider: request.provider,\n      username: request.username,\n      error: errorType,\n      error_message: errorMessage,\n      resolution_timestamp: startTime\n    };\n  }\n}\n\n// ============================================================================\n// Batch Resolution\n// ============================================================================\n\n/**\n * Resolves multiple social identities with configurable error handling\n */\nexport async function batchResolveSocialIdentities(\n  requests: SocialResolutionRequest[],\n  strategy: ResolutionStrategy = ResolutionStrategy.FAIL_FAST\n): Promise<BatchResolutionResult> {\n  const resolved: ResolvedSocialIdentity[] = [];\n  const failed: BatchResolutionResult['failed'] = [];\n  \n  console.log(`🔍 Resolving ${requests.length} social identities using ${strategy} strategy...`);\n  \n  for (let i = 0; i < requests.length; i++) {\n    const request = requests[i]!;\n    \n    try {\n      const response = await resolveSocialIdentity(request);\n      \n      if (response.success && response.wallet_address) {\n        resolved.push({\n          provider: response.provider,\n          username: response.username,\n          wallet_address: response.wallet_address,\n          verified: response.verified || false,\n          resolution_timestamp: response.resolution_timestamp\n        });\n        \n        console.log(`   ✅ ${response.provider}:${response.username} → ${response.wallet_address}`);\n        \n      } else {\n        const failureRecord = {\n          provider: request.provider,\n          username: request.username,\n          error: response.error || SocialResolutionError.API_ERROR,\n          error_message: response.error_message || 'Unknown error'\n        };\n        \n        failed.push(failureRecord);\n        \n        console.log(`   ❌ ${request.provider}:${request.username} failed: ${failureRecord.error_message}`);\n        \n        // Handle strategy\n        if (strategy === ResolutionStrategy.FAIL_FAST) {\n          throw new Error(`Social resolution failed for ${request.provider}:${request.username}: ${failureRecord.error_message}`);\n        }\n        // For SKIP_UNRESOLVED and RETRY_FAILED, continue processing\n      }\n      \n    } catch (error) {\n      const errorMessage = error instanceof Error ? error.message : String(error);\n      \n      failed.push({\n        provider: request.provider,\n        username: request.username,\n        error: SocialResolutionError.API_ERROR,\n        error_message: errorMessage\n      });\n      \n      if (strategy === ResolutionStrategy.FAIL_FAST) {\n        throw error;\n      }\n      \n      console.log(`   ❌ ${request.provider}:${request.username} error: ${errorMessage}`);\n    }\n    \n    // Rate limiting: small delay between requests\n    if (i < requests.length - 1) {\n      await new Promise(resolve => setTimeout(resolve, 100));\n    }\n  }\n  \n  // Retry failed resolutions if using RETRY_FAILED strategy\n  if (strategy === ResolutionStrategy.RETRY_FAILED && failed.length > 0) {\n    console.log(`🔄 Retrying ${failed.length} failed resolutions...`);\n    \n    const retryRequests = failed.map(f => ({\n      provider: f.provider,\n      username: f.username,\n      resolve_to_wallet: true\n    }));\n    \n    // Clear failed array and retry with SKIP_UNRESOLVED strategy\n    failed.length = 0;\n    \n    const retryResult = await batchResolveSocialIdentities(retryRequests, ResolutionStrategy.SKIP_UNRESOLVED);\n    resolved.push(...retryResult.resolved);\n    failed.push(...retryResult.failed);\n  }\n  \n  return {\n    resolved,\n    failed,\n    resolution_strategy: strategy,\n    total_requested: requests.length,\n    successful_count: resolved.length,\n    failed_count: failed.length\n  };\n}\n\n// ============================================================================\n// Utility Functions\n// ============================================================================\n\n/**\n * Creates a social resolution request from basic info\n */\nexport function createSocialResolutionRequest(\n  provider: SocialProvider,\n  username: string\n): SocialResolutionRequest {\n  return {\n    provider,\n    username,\n    resolve_to_wallet: true\n  };\n}\n\n/**\n * Generates a summary of batch resolution results\n */\nexport function summarizeBatchResolution(result: BatchResolutionResult): string {\n  let summary = `Social Provider Resolution Summary:\\n`;\n  summary += `  Strategy: ${result.resolution_strategy}\\n`;\n  summary += `  Total Requested: ${result.total_requested}\\n`;\n  summary += `  Successful: ${result.successful_count}\\n`;\n  summary += `  Failed: ${result.failed_count}\\n`;\n  \n  if (result.resolved.length > 0) {\n    summary += `\\n  Successful Resolutions:\\n`;\n    for (const identity of result.resolved) {\n      const walletPreview = `${identity.wallet_address.slice(0, 8)}...${identity.wallet_address.slice(-8)}`;\n      summary += `    ${identity.provider}:${identity.username} → ${walletPreview}\\n`;\n    }\n  }\n  \n  if (result.failed.length > 0) {\n    summary += `\\n  Failed Resolutions:\\n`;\n    for (const failure of result.failed) {\n      summary += `    ${failure.provider}:${failure.username} - ${failure.error}: ${failure.error_message}\\n`;\n    }\n  }\n  \n  return summary;\n}\n\n/**\n * Checks if a social provider is supported\n */\nexport function isSupportedProvider(provider: string): provider is SocialProvider {\n  return Object.values(SocialProvider).includes(provider as SocialProvider);\n}\n\n/**\n * Gets all supported social providers\n */\nexport function getSupportedProviders(): SocialProvider[] {\n  return Object.values(SocialProvider);\n}\n\n/**\n * Validates that all usernames in a list are properly formatted\n */\nexport function validateAllUsernames(identities: SocialIdentity[]): void {\n  for (const identity of identities) {\n    validateUsername(identity.provider, identity.username);\n  }\n}\n\n// ============================================================================\n// Error Classes\n// ============================================================================\n\nexport class SocialProviderError extends Error {\n  constructor(\n    message: string,\n    public readonly provider: SocialProvider,\n    public readonly username: string,\n    public readonly errorCode: SocialResolutionError\n  ) {\n    super(message);\n    this.name = 'SocialProviderError';\n  }\n}\n\nexport class BatchResolutionError extends Error {\n  constructor(\n    message: string,\n    public readonly failedCount: number,\n    public readonly totalCount: number,\n    public readonly failures: BatchResolutionResult['failed']\n  ) {\n    super(message);\n    this.name = 'BatchResolutionError';\n  }\n}