/**
 * Tipping Integration for Bags API
 *
 * Optional tipping functionality per Bags principles:
 * https://docs.bags.fm/principles/tipping
 */

import { BAGS_TIPPING } from '../constants/bags.js';

export interface TippingConfig {
  enabled: boolean;
  wallet?: string; // Base58 encoded Solana public key
  lamports?: number; // Tip amount in lamports
  provider?: 'jito' | 'bloxroute' | 'astral' | 'custom';
}

export interface TippingProvider {
  name: string;
  wallet: string;
  description: string;
  recommendedTip: number; // in lamports
}

/**
 * Well-known tipping providers
 *
 * Note: Provider wallet addresses should be configured via environment
 * variables or fetched from the Bags API at runtime. The addresses below
 * are placeholders - configure TIP_PROVIDER_JITO_WALLET, TIP_PROVIDER_BLOXROUTE_WALLET,
 * and TIP_PROVIDER_ASTRAL_WALLET in your environment.
 *
 * See: https://docs.bags.fm/principles/tipping for current provider addresses
 */
export const TIPPING_PROVIDERS: Record<string, TippingProvider> = {
  jito: {
    name: 'Jito',
    wallet: process.env.TIP_PROVIDER_JITO_WALLET || '',
    description: 'Jito block engine for faster transaction processing',
    recommendedTip: 100000, // 0.0001 SOL
  },
  bloxroute: {
    name: 'bloXroute',
    wallet: process.env.TIP_PROVIDER_BLOXROUTE_WALLET || '',
    description: 'bloXroute BDN for enhanced transaction delivery',
    recommendedTip: 50000, // 0.00005 SOL
  },
  astral: {
    name: 'Astral',
    wallet: process.env.TIP_PROVIDER_ASTRAL_WALLET || '',
    description: 'Astral validator for transaction prioritization',
    recommendedTip: 75000, // 0.000075 SOL
  },
};

/**
 * Validate tipping configuration
 */
export function validateTippingConfig(config: TippingConfig): void {
  if (!config.enabled) {
    return; // No validation needed if disabled
  }

  if (!config.wallet) {
    throw new Error('Tipping is enabled but no wallet address provided');
  }

  // Validate wallet address format (Base58)
  if (!isValidBase58Address(config.wallet)) {
    throw new Error(`Invalid tipping wallet address: ${config.wallet}`);
  }

  if (config.lamports === undefined || config.lamports <= 0) {
    throw new Error('Tipping is enabled but no valid lamports amount provided');
  }

  // Reasonable bounds check
  const maxTip = 1000000000; // 1 SOL
  const minTip = 1000; // 0.000001 SOL

  if (config.lamports > maxTip) {
    throw new Error(
      `Tip amount too large: ${config.lamports} lamports (max: ${maxTip})`
    );
  }

  if (config.lamports < minTip) {
    throw new Error(
      `Tip amount too small: ${config.lamports} lamports (min: ${minTip})`
    );
  }
}

/**
 * Basic Base58 address validation
 */
function isValidBase58Address(address: string): boolean {
  // Solana addresses are 32-44 characters, Base58 encoded
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

/**
 * Create tipping parameters for Bags API calls
 */
export function createTippingParams(config: TippingConfig): {
  tipWallet?: string;
  tipLamports?: number;
} {
  if (!config.enabled || !config.wallet || !config.lamports) {
    return {}; // No tipping parameters
  }

  validateTippingConfig(config);

  return {
    [BAGS_TIPPING.PARAMETERS.TIP_WALLET]: config.wallet,
    [BAGS_TIPPING.PARAMETERS.TIP_LAMPORTS]: config.lamports,
  };
}

/**
 * Get tipping configuration from environment variables
 */
export function getTippingConfigFromEnv(): TippingConfig {
  const tipWallet = process.env.TIP_WALLET;
  const tipLamportsStr = process.env.TIP_LAMPORTS;

  if (!tipWallet || !tipLamportsStr) {
    return { enabled: false };
  }

  const tipLamports = parseInt(tipLamportsStr, 10);
  if (isNaN(tipLamports)) {
    console.warn(
      `⚠️ Invalid TIP_LAMPORTS value: ${tipLamportsStr}. Disabling tipping.`
    );
    return { enabled: false };
  }

  return {
    enabled: true,
    wallet: tipWallet,
    lamports: tipLamports,
    provider: 'custom',
  };
}

/**
 * Get recommended tipping config for a provider
 */
export function getProviderTippingConfig(
  provider: keyof typeof TIPPING_PROVIDERS
): TippingConfig {
  const providerInfo = TIPPING_PROVIDERS[provider];

  if (!providerInfo || !providerInfo.wallet) {
    throw new Error(`Unknown or incomplete tipping provider: ${provider}`);
  }

  return {
    enabled: true,
    wallet: providerInfo.wallet,
    lamports: providerInfo.recommendedTip,
    provider,
  };
}

/**
 * Format tipping amount for display
 */
export function formatTipAmount(lamports: number): string {
  const sol = lamports / 1000000000;

  if (sol >= 0.001) {
    return `${sol.toFixed(4)} SOL`;
  }

  return `${lamports.toLocaleString()} lamports`;
}

/**
 * Calculate reasonable tip amount based on transaction complexity
 */
export function calculateRecommendedTip(params: {
  hasFileUploads?: boolean;
  feeClaimersCount?: number;
  priority?: 'low' | 'normal' | 'high';
}): number {
  const {
    hasFileUploads = false,
    feeClaimersCount = 1,
    priority = 'normal',
  } = params;

  let baseTip = 50000; // 0.00005 SOL

  // Adjust for complexity
  if (hasFileUploads) {
    baseTip += 25000;
  }

  if (feeClaimersCount > 5) {
    baseTip += (feeClaimersCount - 5) * 10000;
  }

  // Adjust for priority
  const priorityMultipliers = {
    low: 0.5,
    normal: 1.0,
    high: 2.0,
  };

  const finalTip = Math.round(baseTip * priorityMultipliers[priority]);

  // Ensure within reasonable bounds
  return Math.max(10000, Math.min(finalTip, 500000));
}

/**
 * Check if endpoint supports tipping
 */
export function isEndpointTippingSupported(endpoint: string): boolean {
  return BAGS_TIPPING.SUPPORTED_ENDPOINTS.some((supported) =>
    endpoint.includes(supported)
  );
}

/**
 * Add tipping to token launch parameters
 */
export function addTippingToLaunchParams(
  launchParams: Record<string, any>,
  tippingConfig: TippingConfig
): Record<string, any> {
  if (!tippingConfig.enabled) {
    return launchParams;
  }

  const tippingParams = createTippingParams(tippingConfig);

  console.log(
    `💰 Adding tip: ${formatTipAmount(tippingConfig.lamports!)} to ${tippingConfig.provider || 'custom'} provider`
  );

  return {
    ...launchParams,
    ...tippingParams,
  };
}

/**
 * Log tipping information for transparency
 */
export function logTippingInfo(config: TippingConfig): void {
  if (!config.enabled) {
    console.log(
      '💡 Tipping disabled - transactions will use standard priority'
    );
    return;
  }

  const provider = config.provider || 'custom';
  const amount = formatTipAmount(config.lamports!);

  console.log(`💰 Tipping Configuration:`);
  console.log(`   Provider: ${provider}`);
  console.log(`   Amount: ${amount}`);
  console.log(`   Wallet: ${config.wallet}`);

  if (provider !== 'custom' && TIPPING_PROVIDERS[provider]) {
    console.log(`   Description: ${TIPPING_PROVIDERS[provider]!.description}`);
  }
}
