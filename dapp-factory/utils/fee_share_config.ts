/**
 * Fee Share Configuration Library - Token Launch v2 Compliant
 *
 * Handles explicit fee share configuration with social provider resolution
 * and BPS validation for Web3 Factory token creation.
 */

import { APP_FACTORY_PARTNER_KEY } from '../constants/partner.js';
import { bagsApiFetch } from './retry.js';

// ============================================================================
// Types and Interfaces
// ============================================================================

export enum SupportedSocialProvider {
  GITHUB = 'github',
  TWITTER = 'twitter',
  KICK = 'kick',
}

export interface SocialFeeClaimer {
  provider: SupportedSocialProvider;
  username: string;
  bps: number;
}

export interface WalletFeeClaimer {
  wallet: string; // Base58 Solana address
  bps: number;
}

export type FeeClaimer = SocialFeeClaimer | WalletFeeClaimer;

export interface FeeShareConfiguration {
  partnerKey: string; // Always APP_FACTORY_PARTNER_KEY
  totalBPS: number; // Always 10000
  feeClaimers: WalletFeeClaimer[]; // Resolved to wallet addresses only
}

export interface SocialResolutionResult {
  success: boolean;
  wallet_address?: string;
  error?: SocialResolutionError;
  error_message?: string;
}

export enum SocialResolutionError {
  USERNAME_NOT_FOUND = 'username_not_found',
  WALLET_NOT_CONNECTED = 'wallet_not_connected',
  PROVIDER_UNAVAILABLE = 'provider_unavailable',
  INVALID_USERNAME = 'invalid_username',
}

// ============================================================================
// Social Provider Resolution
// ============================================================================

/**
 * Validates social username format for supported providers
 */
export function validateSocialUsername(
  provider: SupportedSocialProvider,
  username: string
): void {
  switch (provider) {
    case SupportedSocialProvider.GITHUB:
      // GitHub usernames: alphanumeric, hyphens, max 39 chars
      if (!/^[a-zA-Z0-9-]{1,39}$/.test(username)) {
        throw new Error(
          `Invalid GitHub username format: ${username}. Must be alphanumeric with hyphens, 1-39 characters.`
        );
      }
      break;

    case SupportedSocialProvider.TWITTER:
      // Twitter handles: @ prefix, alphanumeric, underscores, max 15 chars
      if (!/^@[a-zA-Z0-9_]{1,15}$/.test(username)) {
        throw new Error(
          `Invalid Twitter handle format: ${username}. Must start with @ and be alphanumeric with underscores, max 15 characters.`
        );
      }
      break;

    case SupportedSocialProvider.KICK:
      // Kick usernames: alphanumeric, underscores, max 25 chars
      if (!/^[a-zA-Z0-9_]{1,25}$/.test(username)) {
        throw new Error(
          `Invalid Kick username format: ${username}. Must be alphanumeric with underscores, 1-25 characters.`
        );
      }
      break;

    default:
      throw new Error(`Unsupported social provider: ${provider}`);
  }
}

/**
 * Resolves social fee claimer to wallet address via Bags API
 */
export async function resolveSocialFeeClaimer(
  claimer: SocialFeeClaimer
): Promise<WalletFeeClaimer> {
  // Validate username format first
  validateSocialUsername(claimer.provider, claimer.username);

  try {
    // Call Bags API to resolve social provider to wallet
    const response = await bagsApiFetch('/social/resolve', {
      method: 'POST',
      body: JSON.stringify({
        provider: claimer.provider,
        username: claimer.username,
      }),
    });

    const resolution: SocialResolutionResult = await response.json();

    if (!resolution.success || !resolution.wallet_address) {
      throw new Error(
        resolution.error_message ||
          `Failed to resolve ${claimer.provider}:${claimer.username}`
      );
    }

    return {
      wallet: resolution.wallet_address,
      bps: claimer.bps,
    };
  } catch (error) {
    throw new Error(
      `Social resolution failed for ${claimer.provider}:${claimer.username}: ${error.message}`
    );
  }
}

/**
 * Resolves all fee claimers (social and wallet) to wallet addresses only
 */
export async function resolveAllFeeClaimers(
  feeClaimers: FeeClaimer[]
): Promise<WalletFeeClaimer[]> {
  const resolved: WalletFeeClaimer[] = [];

  for (const claimer of feeClaimers) {
    if ('provider' in claimer) {
      // Social fee claimer - resolve to wallet
      const walletClaimer = await resolveSocialFeeClaimer(claimer);
      resolved.push(walletClaimer);
    } else {
      // Direct wallet claimer - validate and pass through
      validateWalletAddress(claimer.wallet);
      resolved.push(claimer);
    }
  }

  return resolved;
}

// ============================================================================
// BPS Validation and Configuration
// ============================================================================

/**
 * Validates that fee claimers BPS total exactly 10000
 */
export function validateFeeClaimersBPS(feeClaimers: FeeClaimer[]): void {
  const totalBPS = feeClaimers.reduce((sum, claimer) => sum + claimer.bps, 0);

  if (totalBPS !== 10000) {
    throw new Error(
      `Fee claimers BPS must total 10000, got ${totalBPS}. Distribute: ${10000 - totalBPS} more BPS.`
    );
  }

  // Validate individual claimer BPS
  for (const claimer of feeClaimers) {
    if (claimer.bps <= 0 || claimer.bps >= 10000) {
      const identifier =
        'provider' in claimer
          ? `${claimer.provider}:${claimer.username}`
          : claimer.wallet;
      throw new Error(
        `Invalid BPS for claimer ${identifier}: ${claimer.bps} (must be 1-9999)`
      );
    }
  }
}

/**
 * Validates Solana wallet address format (Base58)
 */
export function validateWalletAddress(address: string): void {
  // Basic Base58 validation (Solana addresses are 32-44 chars, Base58 encoded)
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
    throw new Error(`Invalid Solana wallet address format: ${address}`);
  }
}

/**
 * Creates explicit fee share configuration for Token Launch v2
 */
export async function createExplicitFeeShareConfig(
  creatorWallet: string,
  additionalClaimers: FeeClaimer[] = [],
  partnerBPS: number = 2500 // Default 25% to App Factory
): Promise<FeeShareConfiguration> {
  // Validate creator wallet
  validateWalletAddress(creatorWallet);

  // Calculate creator BPS (remaining after partner and additional claimers)
  const additionalBPS = additionalClaimers.reduce(
    (sum, claimer) => sum + claimer.bps,
    0
  );
  const creatorBPS = 10000 - partnerBPS - additionalBPS;

  if (creatorBPS <= 0) {
    throw new Error(
      `Creator BPS would be ${creatorBPS}. Reduce additional claimers or partner BPS.`
    );
  }

  // Build complete fee claimers list
  const allFeeClaimers: FeeClaimer[] = [
    { wallet: creatorWallet, bps: creatorBPS },
    ...additionalClaimers,
    { wallet: 'PARTNER_PAYOUT_ADDRESS_PLACEHOLDER', bps: partnerBPS }, // Resolved by Bags from partner key
  ];

  // Validate total BPS
  validateFeeClaimersBPS(allFeeClaimers);

  // Resolve social claimers to wallet addresses
  const resolvedClaimers = await resolveAllFeeClaimers(allFeeClaimers);

  return {
    partnerKey: APP_FACTORY_PARTNER_KEY, // Immutable attribution
    totalBPS: 10000, // Always explicit
    feeClaimers: resolvedClaimers,
  };
}

// ============================================================================
// Preset Fee Configurations
// ============================================================================

/**
 * Simple creator-only fee configuration (75% creator, 25% partner)
 */
export async function createSimpleFeeShareConfig(
  creatorWallet: string
): Promise<FeeShareConfiguration> {
  return createExplicitFeeShareConfig(creatorWallet, [], 2500);
}

/**
 * Open source project fee configuration with GitHub contributors
 */
export async function createOpenSourceFeeShareConfig(
  creatorWallet: string,
  githubContributors: { username: string; bps: number }[]
): Promise<FeeShareConfiguration> {
  const githubClaimers: SocialFeeClaimer[] = githubContributors.map(
    (contributor) => ({
      provider: SupportedSocialProvider.GITHUB,
      username: contributor.username,
      bps: contributor.bps,
    })
  );

  return createExplicitFeeShareConfig(creatorWallet, githubClaimers, 2500);
}

/**
 * Startup team fee configuration with multi-role contributors
 */
export async function createTeamFeeShareConfig(
  creatorWallet: string,
  teamMembers: {
    role: 'developer' | 'marketing' | 'community';
    provider: SupportedSocialProvider;
    username: string;
    bps: number;
  }[]
): Promise<FeeShareConfiguration> {
  const teamClaimers: SocialFeeClaimer[] = teamMembers.map((member) => ({
    provider: member.provider,
    username: member.username,
    bps: member.bps,
  }));

  return createExplicitFeeShareConfig(creatorWallet, teamClaimers, 2500);
}

// ============================================================================
// Fee Configuration Summary
// ============================================================================

/**
 * Generates human-readable summary of fee share configuration
 */
export function summarizeFeeShareConfig(config: FeeShareConfiguration): string {
  let summary = `Fee Share Configuration:\n`;
  summary += `  Partner Key: ${config.partnerKey}\n`;
  summary += `  Total BPS: ${config.totalBPS}\n`;
  summary += `  Fee Claimers:\n`;

  for (const claimer of config.feeClaimers) {
    const percentage = (claimer.bps / 100).toFixed(1);
    const walletPreview = `${claimer.wallet.slice(0, 8)}...${claimer.wallet.slice(-8)}`;
    summary += `    ${walletPreview}: ${percentage}% (${claimer.bps} BPS)\n`;
  }

  return summary;
}

// ============================================================================
// Error Types for Better Error Handling
// ============================================================================

export class FeeShareConfigError extends Error {
  constructor(
    message: string,
    public readonly errorCode: string,
    public readonly details?: Record<string, any>
  ) {
    super(message);
    this.name = 'FeeShareConfigError';
  }
}

export class SocialResolutionFailedError extends FeeShareConfigError {
  constructor(provider: string, username: string, originalError: string) {
    super(
      `Failed to resolve ${provider}:${username} to wallet address: ${originalError}`,
      'SOCIAL_RESOLUTION_FAILED',
      { provider, username, originalError }
    );
  }
}

export class BPSValidationError extends FeeShareConfigError {
  constructor(
    expectedTotal: number,
    actualTotal: number,
    breakdown: Record<string, number>
  ) {
    super(
      `BPS validation failed: expected ${expectedTotal}, got ${actualTotal}`,
      'BPS_VALIDATION_FAILED',
      { expectedTotal, actualTotal, breakdown }
    );
  }
}
