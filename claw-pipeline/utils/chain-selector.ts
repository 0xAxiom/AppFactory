/**
 * Chain Selector Utility
 *
 * Handles chain selection logic and wallet validation for dual-chain token launches.
 */

import { CHAIN_CONFIG, validateWalletAddress } from '../constants/chains.js';
import type { SupportedChain } from '../constants/chains.js';

export interface ChainSelectionResult {
  chain: SupportedChain;
  launchPlatform: string;
  feeSplitDescription: string;
  requiredEnvVars: string[];
  walletFormat: string;
}

/**
 * Get human-readable chain comparison for user decision
 */
export function getChainComparisonText(): string {
  return `
CHAIN SELECTION
═══════════════

Option A: Solana (via Bags.fm)
  • Established Solana token launchpad
  • Partner key attribution (App Factory earns 25% of fees)
  • Requires: Solana wallet (Base58), Bags API key
  • Fee split: 75% creator / 25% App Factory partner
  • SDK: @bagsfm/bags-sdk

Option B: Base (via Clanker / Agent Launchpad)
  • One-call token deployment on Base L2
  • Uniswap V4 liquidity pool included
  • No wallet needed (created for you)
  • Fee split: 75% creator / 25% protocol (on-chain)
  • Cost: $0, no gas required

Option C: No token launch
  • Skip token creation entirely
  • Generate OpenClaw bot only
`.trim();
}

/**
 * Get chain selection result with all relevant info
 */
export function getChainSelection(chain: SupportedChain): ChainSelectionResult {
  const config = CHAIN_CONFIG[chain];

  if (chain === 'solana') {
    return {
      chain,
      launchPlatform: config.launchPlatform,
      feeSplitDescription: `${config.feeSplit.creator}% creator / ${config.feeSplit.partner}% App Factory partner`,
      requiredEnvVars: config.requiredEnvVars,
      walletFormat: 'Solana (Base58, 32-44 characters)',
    };
  }

  return {
    chain,
    launchPlatform: config.launchPlatform,
    feeSplitDescription: `${config.feeSplit.creator}% creator / ${config.feeSplit.protocol}% protocol`,
    requiredEnvVars: [],
    walletFormat: 'EVM (0x + 40 hex characters, optional)',
  };
}

/**
 * Validate wallet address for selected chain
 */
export function validateWallet(
  address: string,
  chain: SupportedChain
): { valid: boolean; error?: string } {
  if (!address) {
    if (chain === 'base') {
      return { valid: true }; // Base creates wallet if none provided
    }
    return {
      valid: false,
      error: 'Wallet address is required for Solana launch',
    };
  }

  const isValid = validateWalletAddress(address, chain);
  if (!isValid) {
    const format =
      chain === 'solana'
        ? 'Base58 encoded, 32-44 characters'
        : '0x prefix followed by 40 hex characters';
    return {
      valid: false,
      error: `Invalid ${chain} wallet address. Expected format: ${format}`,
    };
  }

  return { valid: true };
}
