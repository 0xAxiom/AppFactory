/**
 * Dual-Chain Configuration
 *
 * Solana: Token launch via Bags.fm API with partner key attribution
 * Base: Token launch via Clanker/Agent Launchpad with on-chain fee enforcement
 */

export type SupportedChain = 'solana' | 'base';

export const CHAIN_CONFIG = {
  solana: {
    name: 'Solana',
    launchPlatform: 'Bags.fm',
    apiEndpoint: 'https://public-api-v2.bags.fm/api/v1/',
    agentApiEndpoint: 'https://public-api-v2.bags.fm/api/v1/agent/',
    sdkPackage: '@bagsfm/bags-sdk@latest',
    feeSplit: { creator: 75, partner: 25 },
    feeBPS: { creator: 7500, partner: 2500, total: 10000 },
    walletFormat: 'base58' as const,
    walletRegex: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
    explorerUrl: 'https://solscan.io/token/',
    tokenDecimals: 9,
    rateLimit: { requestsPerHour: 1000 },
    retryConfig: {
      maxAttempts: 5,
      initialDelayMs: 1000,
      backoffBase: 2,
      retryableStatusCodes: [429, 500, 502, 503],
    },
    requiredEnvVars: [
      'BAGS_API_KEY',
      'SOLANA_RPC_URL',
      'CREATOR_WALLET_ADDRESS',
    ],
  },
  base: {
    name: 'Base',
    launchPlatform: 'Clanker (Agent Launchpad)',
    apiEndpoint: 'https://agent-launchpad-ruby.vercel.app/api/launch',
    statusEndpoint: 'https://agent-launchpad-ruby.vercel.app/api/status/',
    feeEndpoint: 'https://agent-launchpad-ruby.vercel.app/api/fees/',
    healthEndpoint: 'https://agent-launchpad-ruby.vercel.app/health',
    apiKeyHeader: 'x-api-key',
    apiKeyEnvVar: 'CLANKER_API_KEY',
    feeSplit: { creator: 75, protocol: 25 },
    walletFormat: 'evm' as const,
    walletRegex: /^0x[a-fA-F0-9]{40}$/,
    explorerUrl: 'https://basescan.org/token/',
    rateLimit: { launchesPerHour: 5 },
    retryConfig: {
      maxAttempts: 3,
      initialDelayMs: 2000,
      backoffBase: 2,
      retryableStatusCodes: [429, 500, 502, 503],
      timeoutMs: 30000,
    },
    requiredEnvVars: ['CLANKER_API_KEY'],
    requiredFields: ['name', 'description', 'image', 'socialUrls'],
    optionalFields: ['admin', 'symbol'],
  },
} as const;

export function getChainConfig(chain: SupportedChain) {
  return CHAIN_CONFIG[chain];
}

export function validateWalletAddress(
  address: string,
  chain: SupportedChain
): boolean {
  return CHAIN_CONFIG[chain].walletRegex.test(address);
}

export function getExplorerUrl(
  tokenAddress: string,
  chain: SupportedChain
): string {
  return `${CHAIN_CONFIG[chain].explorerUrl}${tokenAddress}`;
}
