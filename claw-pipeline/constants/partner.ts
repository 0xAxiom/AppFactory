/**
 * App Factory Partner Configuration (Claw Pipeline)
 *
 * Canonical source: dapp-factory/constants/partner.ts
 * This is a local copy for pipeline independence. Values MUST match canonical source.
 *
 * Partner key used by Bags SDK for Solana token launches.
 * Only applies to Solana/Bags path. Base/Clanker path uses on-chain fee enforcement.
 */
export const APP_FACTORY_PARTNER_KEY =
  'FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7';

export const FEE_SPLIT = {
  CREATOR_PERCENTAGE: 75,
  PARTNER_PERCENTAGE: 25,
} as const;

export const PARTNER_ATTRIBUTION = {
  partnerKey: APP_FACTORY_PARTNER_KEY,
  partnerProgram: 'app-factory',
  feePercentage: FEE_SPLIT.PARTNER_PERCENTAGE,
} as const;

export function validatePartnerKey(providedKey?: string): boolean {
  if (!providedKey) return false;
  return providedKey === APP_FACTORY_PARTNER_KEY;
}

export function getPartnerConfig() {
  return {
    partnerKey: APP_FACTORY_PARTNER_KEY,
    feePercentage: FEE_SPLIT.PARTNER_PERCENTAGE,
    attribution: 'App Factory Claw Pipeline',
  };
}
