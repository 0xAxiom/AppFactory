# Token Launch v2 Compliance - Social Fee Claimers

## Overview

This document provides the Token Launch v2 compliance specification for Web3 Factory, focusing on the new social fee claimers functionality and explicit fee share configuration requirements.

**CRITICAL**: Token Launch v2 introduces breaking changes that make fee share configuration MANDATORY and enable social identity fee claimers as first-class primitives.

## Fee Share Config Always Required

### Rule: No Defaults, Always Explicit

In Token Launch v2, `createBagsFeeShareConfig()` must ALWAYS be called, even for simple single-creator tokens.

**Why**: Token Launch v2 eliminates all defaults and shortcuts - explicit fee share configuration is mandatory.

```typescript
// ✅ CORRECT: Always explicit fee share config
const feeShareConfig = await sdk.createBagsFeeShareConfig({
  partnerKey: "FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7", 
  totalBPS: 10000, // MUST be explicit
  feeClaimers: [{
    wallet: process.env.CREATOR_WALLET_ADDRESS,
    bps: 7500 // Creator gets 75%
  }, {
    wallet: "partner_payout_address", // Resolved from partner key
    bps: 2500 // Partner gets 25%
  }]
});

// ❌ INCORRECT: Assuming defaults exist
const launchTx = await sdk.createLaunchTransaction({
  ipfs: tokenInfo.ipfsHash,
  tokenMint: tokenInfo.mint,
  initialBuyAmount: "1000000"
  // Missing feeShareConfig - will fail in v2
});
```

### Creator BPS Must Always Be Explicit

**Mandatory Rule**: Creator BPS allocation must be explicitly specified - never assume defaults.

```typescript
interface ExplicitFeeClaimers {
  creator_bps: number; // MUST be specified
  partner_bps: number; // MUST be specified  
  social_bps?: number; // Optional social claimers
  total_bps: 10000; // MUST equal sum of all claimers
}

// Validate BPS total
function validateBPS(feeClaimers: FeeClaimer[]): void {
  const total = feeClaimers.reduce((sum, claimer) => sum + claimer.bps, 0);
  if (total !== 10000) {
    throw new Error(`BPS total must equal 10000, got ${total}`);
  }
}
```

## Social Fee Claimers (First-Class Primitives)

### Supported Social Providers

Token Launch v2 supports social identity fee claimers alongside wallet addresses:

- **GitHub**: Username → resolved to wallet address
- **Twitter**: Handle → resolved to wallet address  
- **Kick**: Username → resolved to wallet address

### SocialFeeClaimer Interface

```typescript
interface SocialFeeClaimer {
  provider: 'twitter' | 'kick' | 'github';
  username: string;
  bps: number;
  // Resolved at launch time via Bags social provider lookup
}

interface WalletFeeClaimer {
  wallet: string; // Base58 Solana address
  bps: number;
}

type FeeClaimer = SocialFeeClaimer | WalletFeeClaimer;
```

### Example: Multi-Contributor Fee Claimers

```typescript
// Example fee claimers with social identities
const feeClaimers = [
  {
    wallet: process.env.CREATOR_WALLET_ADDRESS,
    bps: 7000 // Creator: 70%
  },
  {
    provider: 'github',
    username: 'dev_contributor', // Resolved to wallet
    bps: 500 // GitHub contributor: 5%
  },
  {
    provider: 'twitter', 
    username: '@marketing_lead', // Resolved to wallet
    bps: 500 // Twitter marketer: 5%
  },
  {
    wallet: "partner_payout_address", // App Factory
    bps: 2000 // Partner: 20%
  }
];
```

### GitHub Username Resolution Strategic Importance

**Priority Feature**: GitHub username resolution enables developer equity in tokenized apps.

**Use Cases**:
- Open source contributors earn token fees via GitHub identity
- Developer teams share token revenue automatically
- Attribution for technical contributions becomes tokenized

```typescript
const contributorFeeClaimer = {
  provider: 'github',
  username: 'lead_developer',
  bps: 1000 // 10% of fees to lead developer
};
```

**Resolution Process**:
1. Bags social provider lookup resolves GitHub username to wallet
2. If no wallet found, fee claimer creation fails with clear error
3. Successful resolution includes wallet address in fee share config
4. GitHub users must have connected wallet via Bags social provider

## Partner Attribution vs Partner Config Distinction

### Critical Concept

Partner key (`FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7`) is for **ATTRIBUTION**, not fee configuration.

### Attribution (Partner Key)
- **Purpose**: Links token creation to App Factory partnership
- **Value**: `FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7` (immutable)
- **Usage**: Analytics and attribution tracking
- **NOT**: A Solana wallet address or payout destination

### Fee Configuration (Partner Payout)
- **Purpose**: Where actual fee payments are sent
- **Value**: Separate payout address resolved from partner key
- **Handling**: App Factory gets 25% via this resolved address
- **Resolution**: Managed by Bags based on partner key configuration

### Implementation Example

```typescript
// ✅ CORRECT: Separate attribution vs payout
{
  partnerKey: "FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7", // Attribution
  feeClaimers: [
    { wallet: creatorAddress, bps: 7500 },
    { wallet: partnerPayoutAddress, bps: 2500 } // Resolved from partner key
  ]
}

// ❌ INCORRECT: Using partner key as direct payout address  
{
  feeClaimers: [
    { wallet: "FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7", bps: 2500 } // WRONG
  ]
}
```

## Address Lookup Tables (LUT) Behavior

### Custom LUT Requirements

**Rule**: Custom LUT creation is required when fee claimers > 15.

```typescript
interface LUTRequirements {
  fee_claimers_count: number;
  lut_threshold: 15;
  use_bags_public_lut: boolean;
  custom_lut_required: boolean;
}

function determineLUTStrategy(feeClaimersCount: number): LUTRequirements {
  return {
    fee_claimers_count: feeClaimersCount,
    lut_threshold: 15,
    use_bags_public_lut: true, // Always use Bags public LUT
    custom_lut_required: feeClaimersCount > 15
  };
}

// Implementation
if (feeClaimers.length > 15) {
  const customLUT = await createLookupTableTransactions(
    connection,
    payerKey,
    feeClaimerAddresses
  );
  // Use custom LUT alongside Bags public LUT
}
```

### LUT Management Strategy

1. **Always use Bags public LUT**: `Eq1EVs15EAWww1YtPTtWPzJRLPJoS6VYP9oW9SbNr3yp`
2. **Create custom LUT when needed**: >15 fee claimers
3. **Combine both**: Custom LUT used alongside Bags public LUT
4. **Performance optimization**: Reduces transaction size for complex fee structures

## Token Launch v2 3-Step Process (Updated)

### Complete Implementation

```typescript
// Step 1: Token metadata (unchanged)
const tokenInfo = await sdk.createTokenInfoAndMetadata({
  name: "Your Token",
  symbol: "YTK", 
  description: "Token description",
  image: uploadedImageUrl
});

// Step 2: Fee share config (NOW MANDATORY with explicit BPS)
const feeShareConfig = await sdk.createBagsFeeShareConfig({
  partnerKey: "FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7",
  totalBPS: 10000, // Explicit total
  feeClaimers: [
    { wallet: creatorAddress, bps: 7500 },
    { provider: 'github', username: 'contributor', bps: 500 },
    { wallet: partnerPayoutAddress, bps: 2000 }
  ]
});

// Step 3: Launch transaction (explicit fee share config required)
const launchTx = await sdk.createLaunchTransaction({
  ipfs: tokenInfo.ipfsHash,
  tokenMint: tokenInfo.mint,
  initialBuyAmount: "1000000",
  feeShareConfig: feeShareConfig, // MANDATORY in v2
  tipWallet: tipWallet,
  tipLamports: tipAmount
});
```

## Breaking Changes from v1 to v2

### ❌ What No Longer Works

1. **Missing feeShareConfig**: Will cause launch to fail
2. **Assuming default BPS**: No defaults exist in v2
3. **Partner key as payout address**: Attribution != payout address

### ✅ What You Must Do

1. **Always call** `createBagsFeeShareConfig()` before launch
2. **Explicitly specify** all BPS allocations (must sum to 10000)
3. **Use separate** partner attribution and payout addresses
4. **Consider social claimers** for developer equity use cases

## Web3 Factory Integration Points

### W2 Token Model Updates

W2 stage must now support:
- Optional token creation (some apps may not need tokens)
- Social fee claimers specification
- Explicit BPS allocation modeling

### W4 Bags Configuration Updates

W4 stage must now prepare:
- Mandatory fee share config parameters
- Social provider resolution requirements
- LUT strategy based on claimer count

### W5 Build & Ship Updates

W5 stage must now implement:
- Token Launch v2 3-step process with mandatory fee share config
- Social provider resolution and error handling
- Custom LUT creation for >15 fee claimers
- Proper partner attribution vs payout distinction

**TOKEN LAUNCH V2 COMPLIANCE IS MANDATORY FOR ALL NEW TOKENS** ✅