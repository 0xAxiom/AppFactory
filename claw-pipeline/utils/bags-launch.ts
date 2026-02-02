/**
 * Bags.fm Token Launch Utility (Solana)
 *
 * Launches tokens on Solana via the Bags.fm API with App Factory partner attribution.
 * Partner key: FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7
 * Fee split: 75% creator / 25% partner (7500/2500 BPS)
 *
 * API docs: https://bags.fm/skill.md
 */

import { APP_FACTORY_PARTNER_KEY, FEE_SPLIT } from '../constants/partner.js';
import { CHAIN_CONFIG } from '../constants/chains.js';
import { fetchWithRetry } from './retry.js';
import type { TokenReceipt, TokenLaunchConfig } from './token-receipt.js';

const BAGS_CONFIG = CHAIN_CONFIG.solana;

interface BagsLaunchRequest {
  name: string;
  symbol: string;
  description: string;
  image?: string;
  initialBuyAmount?: number;
  twitter?: string;
  website?: string;
  telegram?: string;
  feeClaimers?: Array<{
    wallet: string;
    bps: number;
  }>;
}

interface BagsLaunchResponse {
  success: boolean;
  tokenMint?: string;
  transactionHash?: string;
  error?: string;
}

/**
 * Validates that all required environment variables are set for Bags launch
 */
export function validateBagsEnvironment(): {
  valid: boolean;
  missing: string[];
} {
  const missing = BAGS_CONFIG.requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );
  return { valid: missing.length === 0, missing };
}

/**
 * Builds the fee claimers array with mandatory partner attribution
 */
function buildFeeClaimers(
  creatorWallet: string,
  additionalClaimers: Array<{ wallet: string; bps: number }> = []
): Array<{ wallet: string; bps: number }> {
  const partnerBPS = 2500; // 25%
  const additionalBPS = additionalClaimers.reduce((sum, c) => sum + c.bps, 0);
  const creatorBPS = 10000 - partnerBPS - additionalBPS;

  if (creatorBPS <= 0) {
    throw new Error(
      `Creator BPS would be ${creatorBPS}. Reduce additional claimers.`
    );
  }

  const claimers = [
    { wallet: creatorWallet, bps: creatorBPS },
    ...additionalClaimers,
  ];

  // Validate total
  const total = claimers.reduce((sum, c) => sum + c.bps, 0) + partnerBPS;
  if (total !== 10000) {
    throw new Error(`Fee claimers BPS must total 10000, got ${total}`);
  }

  return claimers;
}

/**
 * Launch a token on Solana via Bags.fm API
 */
export async function launchBagsToken(
  config: TokenLaunchConfig
): Promise<TokenReceipt> {
  if (config.chain !== 'solana') {
    throw new Error('launchBagsToken only supports Solana chain');
  }

  if (!config.solana?.creatorWallet) {
    throw new Error('Creator wallet address is required for Solana launch');
  }

  // Validate environment
  const envCheck = validateBagsEnvironment();
  if (!envCheck.valid) {
    throw new Error(
      `Missing environment variables: ${envCheck.missing.join(', ')}`
    );
  }

  // Build fee claimers
  const feeClaimers = buildFeeClaimers(
    config.solana.creatorWallet,
    config.solana.additionalFeeClaimers
  );

  // Build launch request
  const launchRequest: BagsLaunchRequest = {
    name: config.name,
    symbol: config.symbol,
    description: config.description,
    image: config.image,
    feeClaimers,
  };

  // Call Bags API
  const apiKey = process.env.BAGS_API_KEY!;
  const response = await fetchWithRetry(
    `${BAGS_CONFIG.apiEndpoint}token-launch/create-launch-transaction`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'X-Partner-Key': APP_FACTORY_PARTNER_KEY,
      },
      body: JSON.stringify(launchRequest),
    },
    BAGS_CONFIG.retryConfig
  );

  const result: BagsLaunchResponse = await response.json();

  if (!result.success || !result.tokenMint) {
    throw new Error(result.error || 'Bags token launch failed');
  }

  // Build receipt
  const receipt: TokenReceipt = {
    chain: 'solana',
    launchPlatform: 'bags',
    tokenAddress: result.tokenMint,
    tokenName: config.name,
    tokenSymbol: config.symbol,
    tokenDescription: config.description,
    tokenImage: config.image,
    creatorWallet: config.solana.creatorWallet,
    feeSplit: {
      creator: FEE_SPLIT.CREATOR_PERCENTAGE,
      partner: FEE_SPLIT.PARTNER_PERCENTAGE,
    },
    transactionHash: result.transactionHash,
    explorerUrl: `${BAGS_CONFIG.explorerUrl}${result.tokenMint}`,
    createdAt: new Date().toISOString(),
    bagsMetadata: {
      partnerKey: APP_FACTORY_PARTNER_KEY,
      feeBPS: { creator: 7500, partner: 2500 },
      tokenMint: result.tokenMint,
      sdkVersion: BAGS_CONFIG.sdkPackage,
    },
  };

  return receipt;
}
