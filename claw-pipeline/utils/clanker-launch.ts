/**
 * Clanker Token Launch Utility (Base)
 *
 * Launches tokens on Base via the Agent Launchpad API (clawbots.org).
 * Single API call deploys: wallet + token + Uniswap V4 liquidity pool.
 * Fee split: 75% creator / 25% protocol (on-chain enforced, immutable).
 *
 * API: POST https://agent-launchpad-ruby.vercel.app/api/launch
 * Rate limit: 5 launches/hour/IP
 */

import { CHAIN_CONFIG } from '../constants/chains.js';
import { fetchWithRetry } from './retry.js';
import type { TokenReceipt, TokenLaunchConfig } from './token-receipt.js';

const CLANKER_CONFIG = CHAIN_CONFIG.base;

function getClankerApiKey(): string {
  const key = process.env[CLANKER_CONFIG.apiKeyEnvVar];
  if (!key) {
    throw new Error(
      `Missing ${CLANKER_CONFIG.apiKeyEnvVar} environment variable. ` +
        `Set it in your .env file to use the Clanker/Agent Launchpad API.`
    );
  }
  return key;
}

interface ClankerLaunchRequest {
  name: string;
  description?: string;
  image?: string;
  socialUrls?: Array<{ platform: string; url: string }>;
  admin?: string;
  symbol?: string;
}

interface ClankerLaunchResponse {
  success: boolean;
  wallet?: {
    address: string;
    privateKey: string;
  };
  token?: {
    address: string;
    symbol: string;
    name: string;
  };
  fees?: {
    creatorShare: number;
    protocolShare: number;
  };
  announcement?: string;
  error?: string;
}

interface ClankerStatusResponse {
  token?: {
    address: string;
    name: string;
    symbol: string;
    totalSupply?: string;
  };
  fees?: {
    unclaimed: string;
    claimed: string;
    total: string;
  };
}

/**
 * Check Agent Launchpad health
 */
export async function checkClankerHealth(): Promise<boolean> {
  try {
    const response = await fetch(CLANKER_CONFIG.healthEndpoint, {
      headers: { [CLANKER_CONFIG.apiKeyHeader]: getClankerApiKey() },
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Launch a token on Base via Clanker/Agent Launchpad
 */
export async function launchClankerToken(
  config: TokenLaunchConfig
): Promise<TokenReceipt> {
  if (config.chain !== 'base') {
    throw new Error('launchClankerToken only supports Base chain');
  }

  // Check health first
  const healthy = await checkClankerHealth();
  if (!healthy) {
    throw new Error('Agent Launchpad service is unavailable. Try again later.');
  }

  // Build launch request
  const launchRequest: ClankerLaunchRequest = {
    name: config.name,
    description: config.description,
    image: config.image,
    socialUrls: config.base?.socialUrls,
    admin: config.base?.adminWallet,
    symbol: config.base?.customSymbol || config.symbol,
  };

  // Call Agent Launchpad API
  const response = await fetchWithRetry(
    CLANKER_CONFIG.apiEndpoint,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        [CLANKER_CONFIG.apiKeyHeader]: getClankerApiKey(),
      },
      body: JSON.stringify(launchRequest),
    },
    CLANKER_CONFIG.retryConfig
  );

  const result: ClankerLaunchResponse = await response.json();

  if (!result.success || !result.token?.address) {
    throw new Error(result.error || 'Clanker token launch failed');
  }

  // Build receipt
  const receipt: TokenReceipt = {
    chain: 'base',
    launchPlatform: 'clanker',
    tokenAddress: result.token.address,
    tokenName: result.token.name || config.name,
    tokenSymbol: result.token.symbol || config.symbol,
    tokenDescription: config.description,
    tokenImage: config.image,
    creatorWallet: result.wallet?.address || config.base?.adminWallet || '',
    feeSplit: {
      creator: CLANKER_CONFIG.feeSplit.creator,
      partner: CLANKER_CONFIG.feeSplit.protocol,
    },
    explorerUrl: `${CLANKER_CONFIG.explorerUrl}${result.token.address}`,
    createdAt: new Date().toISOString(),
    clankerMetadata: {
      walletAddress: result.wallet?.address || '',
      adminAddress: config.base?.adminWallet,
    },
  };

  return receipt;
}

/**
 * Check token status on Agent Launchpad
 */
export async function getClankerTokenStatus(
  tokenAddress: string
): Promise<ClankerStatusResponse> {
  const response = await fetch(
    `${CLANKER_CONFIG.statusEndpoint}${tokenAddress}`,
    {
      headers: {
        [CLANKER_CONFIG.apiKeyHeader]: getClankerApiKey(),
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Status check failed: HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Check fees for an admin address
 */
export async function getClankerFees(
  adminAddress: string
): Promise<{ tokens: Array<{ address: string; unclaimed: string }> }> {
  const response = await fetch(`${CLANKER_CONFIG.feeEndpoint}${adminAddress}`, {
    headers: {
      [CLANKER_CONFIG.apiKeyHeader]: getClankerApiKey(),
    },
  });

  if (!response.ok) {
    throw new Error(`Fee check failed: HTTP ${response.status}`);
  }

  return response.json();
}
