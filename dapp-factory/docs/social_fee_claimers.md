# Social Fee Claimers - Developer Equity for Tokenized Apps

## Overview

Social fee claimers enable developers, contributors, and team members to receive token fees using their social identities (GitHub, Twitter, Kick) instead of just wallet addresses. This creates a new model for developer equity in tokenized applications.

**Strategic Importance**: GitHub username resolution allows open source contributors to automatically receive token revenue share based on their contributions, creating powerful incentives for collaborative development.

## Supported Social Providers

### GitHub Integration

**Provider ID**: `github`  
**Resolution**: GitHub username → Solana wallet address  
**Strategic Value**: Developer equity and open source contributor rewards

```typescript
const githubFeeClaimer = {
  provider: 'github',
  username: 'lead_developer', // GitHub username without @
  bps: 1000, // 10% of fees
};
```

**Use Cases**:

- Lead developers receive ongoing token revenue
- Open source contributors get equity for contributions
- Technical team members receive automated compensation
- Repository maintainers earn from token-powered applications

### Twitter Integration

**Provider ID**: `twitter`  
**Resolution**: Twitter handle → Solana wallet address  
**Strategic Value**: Marketing and community building rewards

```typescript
const twitterFeeClaimer = {
  provider: 'twitter',
  username: '@marketing_lead', // Twitter handle with @
  bps: 500, // 5% of fees
};
```

**Use Cases**:

- Marketing team members receive token revenue
- Community managers earn from engagement-driven growth
- Social media contributors get equity for reach
- Influencer partnerships with automatic compensation

### Kick Integration

**Provider ID**: `kick`  
**Resolution**: Kick username → Solana wallet address  
**Strategic Value**: Gaming and streaming community rewards

```typescript
const kickFeeClaimer = {
  provider: 'kick',
  username: 'gaming_streamer', // Kick username
  bps: 300, // 3% of fees
};
```

**Use Cases**:

- Gaming streamers receive token revenue from game-related apps
- Community streaming events generate automatic rewards
- Content creators earn from token-powered gaming apps

## Social Provider Interface

### TypeScript Definitions

```typescript
enum SupportedSocialProvider {
  GITHUB = 'github',
  TWITTER = 'twitter',
  KICK = 'kick',
}

interface SocialFeeClaimer {
  provider: SupportedSocialProvider;
  username: string;
  bps: number;
  // Resolved at runtime via Bags social provider lookup
}

interface WalletFeeClaimer {
  wallet: string; // Base58 Solana address
  bps: number;
}

type FeeClaimer = SocialFeeClaimer | WalletFeeClaimer;
```

### Resolution Process

1. **Social Provider Lookup**: Bags API resolves social username to wallet
2. **Wallet Validation**: Confirmed wallet address is valid Base58 format
3. **Error Handling**: Clear failure messages if username has no connected wallet
4. **Fee Share Creation**: Resolved wallet included in fee share configuration

```typescript
async function resolveSocialFeeClaimer(claimer: SocialFeeClaimer): Promise<WalletFeeClaimer> {
  try {
    const resolvedWallet = await bagsApi.resolveSocialProvider({
      provider: claimer.provider,
      username: claimer.username,
    });

    return {
      wallet: resolvedWallet.address,
      bps: claimer.bps,
    };
  } catch (error) {
    throw new Error(`Failed to resolve ${claimer.provider} username ${claimer.username}: ${error.message}`);
  }
}
```

## Multi-Contributor Fee Distribution Examples

### Open Source Project

```typescript
const openSourceFeeClaimers = [
  {
    wallet: process.env.CREATOR_WALLET_ADDRESS,
    bps: 6000, // Project lead: 60%
  },
  {
    provider: 'github',
    username: 'core_developer',
    bps: 1500, // Core dev: 15%
  },
  {
    provider: 'github',
    username: 'ui_designer',
    bps: 1000, // UI designer: 10%
  },
  {
    provider: 'twitter',
    username: '@community_manager',
    bps: 500, // Community: 5%
  },
  {
    wallet: 'partner_payout_address', // App Factory
    bps: 1000, // Partner: 10%
  },
];
```

### Startup Team

```typescript
const startupFeeClaimers = [
  {
    wallet: process.env.CREATOR_WALLET_ADDRESS,
    bps: 4000, // Founder: 40%
  },
  {
    provider: 'github',
    username: 'cto_engineer',
    bps: 2000, // CTO: 20%
  },
  {
    provider: 'twitter',
    username: '@marketing_head',
    bps: 1500, // Marketing: 15%
  },
  {
    provider: 'github',
    username: 'backend_dev',
    bps: 1000, // Backend dev: 10%
  },
  {
    wallet: 'partner_payout_address', // App Factory
    bps: 1500, // Partner: 15%
  },
];
```

### Gaming Community

```typescript
const gamingFeeClaimers = [
  {
    wallet: process.env.CREATOR_WALLET_ADDRESS,
    bps: 5000, // Game creator: 50%
  },
  {
    provider: 'kick',
    username: 'top_streamer',
    bps: 2000, // Top streamer: 20%
  },
  {
    provider: 'github',
    username: 'game_dev',
    bps: 1500, // Game developer: 15%
  },
  {
    provider: 'twitter',
    username: '@esports_manager',
    bps: 1000, // Esports: 10%
  },
  {
    wallet: 'partner_payout_address', // App Factory
    bps: 500, // Partner: 5%
  },
];
```

## Implementation in Web3 Factory Pipeline

### W2: Token Model Stage

W2 must now support social fee claimers specification:

```typescript
interface TokenModel {
  // ... existing fields
  fee_claimers: {
    creator_bps: number;
    social_claimers?: SocialFeeClaimer[];
    partner_bps: number;
    total_bps: 10000; // Validation requirement
  };
}
```

### W4: Bags Integration Stage

W4 must prepare social provider resolution:

```typescript
interface BagsConfig {
  // ... existing config
  social_provider_config: {
    has_social_claimers: boolean;
    social_providers_used: SupportedSocialProvider[];
    resolution_strategy: 'fail_fast' | 'skip_unresolved';
  };
}
```

### W5: Build & Ship Stage

W5 must implement resolution and error handling:

```typescript
async function prepareFeeClaimers(feeClaimers: FeeClaimer[]): Promise<WalletFeeClaimer[]> {
  const resolved: WalletFeeClaimer[] = [];

  for (const claimer of feeClaimers) {
    if ('provider' in claimer) {
      // Social fee claimer - resolve to wallet
      try {
        const walletClaimer = await resolveSocialFeeClaimer(claimer);
        resolved.push(walletClaimer);
      } catch (error) {
        throw new Error(`Social resolution failed for ${claimer.provider}:${claimer.username}: ${error.message}`);
      }
    } else {
      // Direct wallet claimer
      resolved.push(claimer);
    }
  }

  return resolved;
}
```

## Error Handling and Validation

### Social Provider Resolution Errors

```typescript
enum SocialResolutionError {
  USERNAME_NOT_FOUND = 'username_not_found',
  WALLET_NOT_CONNECTED = 'wallet_not_connected',
  PROVIDER_UNAVAILABLE = 'provider_unavailable',
  INVALID_USERNAME = 'invalid_username',
}

interface SocialResolutionResult {
  success: boolean;
  wallet_address?: string;
  error?: SocialResolutionError;
  error_message?: string;
}
```

### BPS Validation

```typescript
function validateFeeClaimersBPS(feeClaimers: FeeClaimer[]): void {
  const totalBPS = feeClaimers.reduce((sum, claimer) => sum + claimer.bps, 0);

  if (totalBPS !== 10000) {
    throw new Error(`Fee claimers BPS must total 10000, got ${totalBPS}`);
  }

  // Validate individual claimer BPS
  for (const claimer of feeClaimers) {
    if (claimer.bps <= 0 || claimer.bps >= 10000) {
      throw new Error(`Invalid BPS for claimer: ${claimer.bps} (must be 1-9999)`);
    }
  }
}
```

### Username Format Validation

```typescript
function validateSocialUsername(provider: SupportedSocialProvider, username: string): void {
  switch (provider) {
    case SupportedSocialProvider.GITHUB:
      // GitHub usernames: alphanumeric, hyphens, max 39 chars
      if (!/^[a-zA-Z0-9-]{1,39}$/.test(username)) {
        throw new Error(`Invalid GitHub username format: ${username}`);
      }
      break;

    case SupportedSocialProvider.TWITTER:
      // Twitter handles: @ prefix, alphanumeric, underscores, max 15 chars
      if (!/^@[a-zA-Z0-9_]{1,15}$/.test(username)) {
        throw new Error(`Invalid Twitter handle format: ${username}`);
      }
      break;

    case SupportedSocialProvider.KICK:
      // Kick usernames: alphanumeric, underscores, max 25 chars
      if (!/^[a-zA-Z0-9_]{1,25}$/.test(username)) {
        throw new Error(`Invalid Kick username format: ${username}`);
      }
      break;
  }
}
```

## Strategic Benefits

### Developer Equity Revolution

Social fee claimers create a new model for developer compensation:

1. **Automatic Revenue Share**: Contributors automatically receive token fees
2. **Identity-Based Distribution**: No need to manage wallet addresses
3. **Contribution Recognition**: Social presence becomes equity stake
4. **Community Building**: Incentivizes long-term community involvement

### GitHub Username Resolution Priority

GitHub integration is strategically critical because:

1. **Developer Identity**: GitHub is primary professional identity for developers
2. **Contribution Tracking**: Commit history provides contribution evidence
3. **Open Source Incentives**: Creates direct financial incentives for OS contributions
4. **Team Coordination**: Simplifies revenue sharing for development teams

### Implementation Examples

```typescript
// Example: Repository contributor receives 5% of token fees
const contributorReward = {
  provider: 'github',
  username: 'frequent_contributor',
  bps: 500, // 5% ongoing revenue share
};

// Example: Marketing team member receives 3% of token fees
const marketingReward = {
  provider: 'twitter',
  username: '@growth_hacker',
  bps: 300, // 3% ongoing revenue share
};
```

This creates powerful incentives for collaborative development and community building around tokenized applications.

## Future Enhancements

### Additional Social Providers

Potential future integrations:

- **Discord**: Server roles and contribution tracking
- **LinkedIn**: Professional network integration
- **Telegram**: Community management rewards

### Dynamic Fee Distribution

Future capabilities could include:

- **Contribution-Based**: Fees based on actual contribution metrics
- **Time-Based**: Fee percentages that change over project lifecycle
- **Performance-Based**: Revenue sharing based on app performance metrics

**SOCIAL FEE CLAIMERS: DEVELOPER EQUITY FOR THE WEB3 ERA** ✅
