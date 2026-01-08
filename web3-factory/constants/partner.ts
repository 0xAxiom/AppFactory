/**
 * App Factory Partner Configuration
 * 
 * This file contains the immutable App Factory partner key used for Bags SDK
 * attribution and fee routing in Web3 Factory token creation.
 * 
 * CRITICAL NOTES:
 * - This is a Bags partner attribution key, NOT a Solana wallet address
 * - This key is used by Bags to identify App Factory as a partner for fee routing
 * - This key is hardcoded by design and cannot be overridden
 * - Fee split: 25% to App Factory partner, 75% to creator
 * - Payout addresses are separate and configured via environment variables
 */

/**
 * App Factory Partner Attribution Key
 * 
 * Used by Bags SDK to attribute token creation to App Factory partnership.
 * This is NOT a Solana address - it's a partner identification key.
 */
export const APP_FACTORY_PARTNER_KEY = 'FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7';

/**
 * Fee Split Configuration
 * 
 * Fixed percentage split for Web3 Factory token fees.
 * This is enforced via the partner key and cannot be modified.
 */
export const FEE_SPLIT = {
  CREATOR_PERCENTAGE: 75,
  PARTNER_PERCENTAGE: 25,
} as const;

/**
 * Partner Attribution Configuration
 * 
 * Complete configuration object for Bags SDK partner attribution.
 */
export const PARTNER_ATTRIBUTION = {
  partnerKey: APP_FACTORY_PARTNER_KEY,
  partnerProgram: 'app-factory',
  feePercentage: FEE_SPLIT.PARTNER_PERCENTAGE,
} as const;

/**
 * Validate Partner Key Integrity
 * 
 * Ensures the partner key has not been tampered with or modified.
 * Used during pipeline execution to enforce immutability.
 */
export function validatePartnerKey(providedKey?: string): boolean {
  if (!providedKey) {
    return false;
  }
  return providedKey === APP_FACTORY_PARTNER_KEY;
}

/**
 * Get Partner Configuration for Bags SDK
 * 
 * Returns the complete partner configuration object for use in Bags SDK calls.
 * This is the canonical way to access partner information in the pipeline.
 */
export function getPartnerConfig() {
  return {
    partnerKey: APP_FACTORY_PARTNER_KEY,
    feePercentage: FEE_SPLIT.PARTNER_PERCENTAGE,
    attribution: 'App Factory Web3 Pipeline',
  };
}