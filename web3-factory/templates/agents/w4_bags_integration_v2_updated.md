# W4: Bags Integration (Token Launch v2 Compliant)

## AGENT-NATIVE EXECUTION
You are Claude executing W4 for Web3 Factory. Configure Bags SDK for deterministic token creation based on official Bags documentation and Token Launch v2 requirements.

## TOKEN LAUNCH V2 CRITICAL CHANGES

**MANDATORY UPDATES**:
- Fee share config is ALWAYS required (no defaults)
- Creator BPS must be explicitly calculated
- Social fee claimers supported as first-class primitives
- Partner attribution vs partner payout distinction enforced
- Custom LUT required for >15 fee claimers

**BREAKING CHANGE**: Apps may be token-free. W4 must handle both token creation and token-free configurations.

## AUTHORITATIVE SOURCES (MANDATORY)

ALL Bags-related implementation MUST reference these official sources:

- **Launch Token Guide**: https://docs.bags.fm/how-to-guides/launch-token
- **TypeScript Setup**: https://docs.bags.fm/how-to-guides/typescript-node-setup
- **Program IDs**: https://docs.bags.fm/principles/program-ids
- **Lookup Tables**: https://docs.bags.fm/principles/lookup-tables
- **Rate Limits**: https://docs.bags.fm/principles/rate-limits
- **Error Handling**: https://docs.bags.fm/principles/error-handling
- **File Uploads**: https://docs.bags.fm/principles/file-uploads
- **Tipping**: https://docs.bags.fm/principles/tipping
- **API Key Management**: https://docs.bags.fm/principles/api-key-management
- **Base URL Versioning**: https://docs.bags.fm/principles/base-url-versioning

**CRITICAL RULES**:
- Use ONLY documented SDK methods and API endpoints
- Follow exact parameter names and types from documentation
- Implement rate limiting and error handling per principles
- Use centralized constants from `/web3-factory/constants/`
- All configuration must be deterministic and idempotent

## CONFIGURATION ONLY STAGE

**W4 DOES NOT CREATE TOKENS** - Configuration and validation only.

W4 prepares all parameters for token creation in W5 (if token required) based on official Bags patterns:
1. `createTokenInfoAndMetadata()` parameters
2. `createBagsFeeShareConfig()` parameters (MANDATORY in v2)
3. `createLaunchTransaction()` parameters

**New in v2**: Handle token-free Web3 apps that only need wallet authentication.

## INPUTS
- Read: `web3-factory/runs/.../w1/web3_idea.json`
- Read: `web3-factory/runs/.../w2/token_model.json`
- Read: `web3-factory/runs/.../w3/web3_architecture.json`

## OUTPUTS
- Write: `web3-factory/runs/.../w4/bags_config.json`
- Write: `web3-factory/runs/.../w4/w4_execution.md`

## JSON SCHEMA (TOKEN LAUNCH V2 COMPLIANT)
```json
{
  "type": "object",
  "properties": {
    "app_configuration": {
      "type": "object",
      "properties": {
        "requires_token_creation": {"type": "boolean"},
        "wallet_auth_only": {"type": "boolean"},
        "onchain_data_strategy": {"type": "string"},
        "app_type": {"enum": ["token_powered", "token_free"]}
      },
      "required": ["requires_token_creation", "wallet_auth_only", "app_type"]
    },
    "token_metadata": {
      "type": "object",
      "properties": {
        "name": {"type": "string", "maxLength": 32},
        "symbol": {"type": "string", "maxLength": 10},
        "description": {"type": "string", "maxLength": 500},
        "image": {"type": "string", "format": "uri"},
        "website": {"type": "string", "format": "uri"},
        "twitter": {"type": "string"},
        "telegram": {"type": "string"}
      },
      "required": ["name", "symbol", "description"]
    },
    "token_launch_params": {
      "type": "object",
      "properties": {
        "initialBuyAmount": {"type": "string"},
        "totalSupply": {"type": "string"},
        "decimals": {"type": "number", "enum": [9]}
      },
      "required": ["initialBuyAmount"]
    },
    "fee_share_config_v2": {
      "type": "object",
      "properties": {
        "config_required": {"type": "boolean", "enum": [true]},
        "partner_attribution": {
          "type": "object",
          "properties": {
            "partner_key": {"type": "string", "enum": ["FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7"]},
            "partner_program": {"type": "string", "enum": ["app-factory"]}
          },
          "required": ["partner_key", "partner_program"]
        },
        "fee_claimers": {
          "type": "array",
          "items": {
            "oneOf": [
              {
                "type": "object",
                "properties": {
                  "wallet": {"type": "string"},
                  "bps": {"type": "number", "minimum": 1, "maximum": 9999},
                  "claimer_type": {"type": "string", "enum": ["wallet"]}
                },
                "required": ["wallet", "bps", "claimer_type"]
              },
              {
                "type": "object",
                "properties": {
                  "provider": {"enum": ["github", "twitter", "kick"]},
                  "username": {"type": "string"},
                  "bps": {"type": "number", "minimum": 1, "maximum": 9999},
                  "claimer_type": {"type": "string", "enum": ["social"]},
                  "role_description": {"type": "string"}
                },
                "required": ["provider", "username", "bps", "claimer_type", "role_description"]
              }
            ]
          },
          "maxItems": 100
        },
        "total_bps": {"type": "number", "enum": [10000]},
        "creator_bps": {"type": "number", "minimum": 1, "maximum": 9999},
        "partner_bps": {"type": "number", "enum": [2500]},
        "social_claimers_bps": {"type": "number", "minimum": 0, "maximum": 9999},
        "bps_breakdown": {
          "type": "object",
          "properties": {
            "creator_percentage": {"type": "number"},
            "social_percentage": {"type": "number"},
            "partner_percentage": {"type": "number"}
          },
          "required": ["creator_percentage", "social_percentage", "partner_percentage"]
        },
        "explicit_bps_validation": {"type": "boolean", "enum": [true]}
      },
      "required": ["config_required", "partner_attribution", "fee_claimers", "total_bps", "creator_bps", "partner_bps", "explicit_bps_validation"]
    },
    "social_provider_config": {
      "type": "object",
      "properties": {
        "has_social_claimers": {"type": "boolean"},
        "social_providers_used": {
          "type": "array",
          "items": {"enum": ["github", "twitter", "kick"]}
        },
        "github_claimers_count": {"type": "number"},
        "twitter_claimers_count": {"type": "number"},
        "kick_claimers_count": {"type": "number"},
        "social_resolution_strategy": {"enum": ["fail_fast", "skip_unresolved"]},
        "username_validation_required": {"type": "boolean", "enum": [true]}
      },
      "required": ["has_social_claimers", "social_resolution_strategy", "username_validation_required"]
    },
    "lookup_table_config": {
      "type": "object",
      "properties": {
        "use_bags_lut": {"type": "boolean"},
        "bags_lut_address": {"type": "string", "enum": ["Eq1EVs15EAWww1YtPTtWPzJRLPJoS6VYP9oW9SbNr3yp"]},
        "custom_lut_required": {"type": "boolean"},
        "fee_claimers_count": {"type": "number"},
        "lut_threshold": {"type": "number", "enum": [15]},
        "lut_strategy": {"enum": ["bags_only", "bags_plus_custom"]}
      },
      "required": ["use_bags_lut", "custom_lut_required", "fee_claimers_count", "lut_threshold"]
    },
    "tipping_config": {
      "type": "object",
      "properties": {
        "enabled": {"type": "boolean"},
        "tip_wallet": {"type": "string"},
        "tip_lamports": {"type": "number", "minimum": 1000},
        "provider": {"type": "string", "enum": ["jito", "bloxroute", "astral", "custom"]}
      },
      "required": ["enabled"]
    },
    "environment_config": {
      "type": "object",
      "properties": {
        "network": {"type": "string", "enum": ["mainnet-beta", "devnet"]},
        "rpc_url": {"type": "string", "format": "uri"},
        "api_base_url": {"type": "string", "enum": ["https://public-api-v2.bags.fm/api/v1/"]},
        "api_version": {"type": "string", "enum": ["v1"]},
        "required_env_vars": {"type": "array", "items": {"type": "string"}}
      },
      "required": ["network", "api_base_url", "api_version", "required_env_vars"]
    },
    "program_ids": {
      "type": "object",
      "properties": {
        "fee_share_v2": {"type": "string", "enum": ["7ko7duEv4Gk5kRoJKGTRVgypuRHvTbCFbDeaC9Q4pWk3"]},
        "meteora_damm_v2": {"type": "string", "enum": ["cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG"]},
        "meteora_dbc": {"type": "string", "enum": ["dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN"]}
      },
      "required": ["fee_share_v2", "meteora_damm_v2", "meteora_dbc"]
    },
    "file_upload_config": {
      "type": "object",
      "properties": {
        "has_image_uploads": {"type": "boolean"},
        "max_file_size_mb": {"type": "number", "enum": [15]},
        "supported_types": {"type": "array", "items": {"type": "string"}},
        "upload_strategy": {"type": "string", "enum": ["direct", "deferred"]}
      },
      "required": ["has_image_uploads", "max_file_size_mb", "supported_types"]
    },
    "idempotency_config": {
      "type": "object",
      "properties": {
        "build_id": {"type": "string"},
        "input_hash": {"type": "string"},
        "deterministic_params": {"type": "object"},
        "retry_strategy": {"type": "string", "enum": ["exponential_backoff"]},
        "max_retries": {"type": "number", "enum": [5]}
      },
      "required": ["build_id", "input_hash", "deterministic_params", "retry_strategy", "max_retries"]
    }
  },
  "required": [
    "app_configuration",
    "environment_config", 
    "program_ids",
    "file_upload_config",
    "idempotency_config"
  ]
}
```

**Conditional Requirements**:
- If `app_configuration.requires_token_creation` is `true`: `token_metadata`, `token_launch_params`, `fee_share_config_v2`, `social_provider_config`, `lookup_table_config`, `tipping_config` are required
- If `app_configuration.requires_token_creation` is `false`: Only core configuration fields are required

## EXECUTION STEPS

### 1. Determine App Type (MANDATORY FIRST STEP)

From W2 output, determine if this is a token-powered or token-free Web3 app:
```typescript
const appType = w2Data.token_necessity.requires_token ? 'token_powered' : 'token_free';
```

### 2a. If Token-Free App: Configure Minimal Bags Setup

For token-free Web3 apps:
- Set `requires_token_creation: false`
- Configure wallet authentication only
- Define onchain data strategy (if any)
- Skip token-related configuration sections

Example token-free configuration:
```json
{
  "app_configuration": {
    "requires_token_creation": false,
    "wallet_auth_only": true,
    "onchain_data_strategy": "sol_payments_only",
    "app_type": "token_free"
  }
}
```

### 2b. If Token-Powered App: Configure Full Token Launch v2

#### Load Web3 Factory Constants
Use centralized constants from `/web3-factory/constants/`:
- `BAGS_API_CONFIG` for base URL and versioning
- `BAGS_PROGRAM_IDS` for mainnet program addresses
- `BAGS_LOOKUP_TABLES` for LUT configuration
- `BAGS_TOKEN_LAUNCH` for launch parameters
- `APP_FACTORY_PARTNER_KEY` for immutable partner attribution

#### Extract Token Metadata (createTokenInfoAndMetadata)
From W2 token model, prepare parameters for `createTokenInfoAndMetadata()`:
- **name**: Token name (max 32 chars)
- **symbol**: Token symbol (max 10 chars)
- **description**: Token description (max 500 chars)
- **image**: Image URL (from file upload or IPFS)
- **website**: Optional website URL
- **twitter**: Optional Twitter handle
- **telegram**: Optional Telegram link

Validate all parameters against Bags constraints.

#### Configure Fee Sharing v2 (createBagsFeeShareConfig)
**CRITICAL**: Token Launch v2 requires explicit fee share configuration with no defaults.

Extract from W2 fee share configuration:
```typescript
const creatorBPS = w2Data.fee_share_configuration.creator_bps;
const socialClaimersBPS = w2Data.fee_share_configuration.social_fee_claimers
  .reduce((sum, claimer) => sum + claimer.bps, 0);
const partnerBPS = w2Data.fee_share_configuration.partner_bps; // Always 2500

// Validate total
if (creatorBPS + socialClaimersBPS + partnerBPS !== 10000) {
  throw new Error(`BPS validation failed: ${creatorBPS} + ${socialClaimersBPS} + ${partnerBPS} != 10000`);
}
```

**Fee Claimers Configuration**:
```json
{
  "fee_claimers": [
    {
      "wallet": "<CREATOR_WALLET_ADDRESS>",
      "bps": 6000,
      "claimer_type": "wallet"
    },
    {
      "provider": "github",
      "username": "lead_developer", 
      "bps": 1500,
      "claimer_type": "social",
      "role_description": "Lead developer - core architecture"
    },
    {
      "wallet": "partner_payout_address", // Resolved from partner key
      "bps": 2500,
      "claimer_type": "wallet"
    }
  ]
}
```

#### Configure Social Provider Resolution
If W2 includes social fee claimers:
- Validate username formats per provider
- Count social claimers by provider type
- Set resolution strategy (`fail_fast` recommended)
- Document username validation requirements

**Social Provider Validation**:
```typescript
// GitHub: alphanumeric + hyphens, 1-39 chars
if (provider === 'github' && !/^[a-zA-Z0-9-]{1,39}$/.test(username)) {
  throw new Error(`Invalid GitHub username: ${username}`);
}

// Twitter: @ prefix + alphanumeric + underscores, max 15 chars
if (provider === 'twitter' && !/^@[a-zA-Z0-9_]{1,15}$/.test(username)) {
  throw new Error(`Invalid Twitter handle: ${username}`);
}

// Kick: alphanumeric + underscores, 1-25 chars
if (provider === 'kick' && !/^[a-zA-Z0-9_]{1,25}$/.test(username)) {
  throw new Error(`Invalid Kick username: ${username}`);
}
```

#### Determine Lookup Table Requirements
Based on Bags principles and Token Launch v2:
- **Always use Bags public LUT**: `Eq1EVs15EAWww1YtPTtWPzJRLPJoS6VYP9oW9SbNr3yp`
- **Custom LUT required**: If total fee claimers > 15
- **LUT strategy**: `bags_only` or `bags_plus_custom`

```typescript
const totalClaimers = feeClaimers.length;
const customLUTRequired = totalClaimers > 15;
const lutStrategy = customLUTRequired ? 'bags_plus_custom' : 'bags_only';
```

#### Configure Tipping (Optional)
Based on environment variables and Bags tipping principles:
- Check `TIP_WALLET` and `TIP_LAMPORTS` environment variables
- Validate tip wallet is valid Base58 Solana address
- Ensure tip amount is within reasonable bounds (1000-500000 lamports)
- Document tipping provider if applicable

### 3. Environment Configuration (All App Types)

Validate and document required environment variables:
- **BAGS_API_KEY**: Required for all API calls (if token creation)
- **SOLANA_RPC_URL**: Solana network endpoint
- **SOLANA_NETWORK**: mainnet-beta or devnet
- **CREATOR_WALLET_ADDRESS**: Creator's public key (if token creation)
- **PRIVATE_KEY**: Required for transaction signing (if token creation)

**Token-Free Apps**: Only wallet connection environment variables needed.

**Do NOT access or validate actual values** - only document requirements.

### 4. File Upload Strategy (If Token Creation)

Based on token metadata requirements:
- Check if image uploads are needed
- Document file size limits (15MB max)
- List supported types: PNG, JPG, JPEG, GIF, WebP
- Choose upload strategy: direct (W5) or deferred

### 5. Program ID Configuration (If Token Creation)

Include all required Bags program IDs for mainnet:
- **Fee Share V2**: `7ko7duEv4Gk5kRoJKGTRVgypuRHvTbCFbDeaC9Q4pWk3`
- **Meteora DAMM v2**: `cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG`
- **Meteora DBC**: `dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN`

### 6. Idempotency Configuration

Prepare deterministic execution parameters:
- **build_id**: From W1/W2/W3 content hash
- **input_hash**: SHA256 of all configuration inputs
- **retry_strategy**: "exponential_backoff" per Bags error handling
- **max_retries**: 5 attempts per Bags rate limiting principles

## TOKEN LAUNCH V2 INTEGRATION PATTERNS

### Updated 3-Step Process (Token Apps Only)

```javascript
// Step 1: Create token info and metadata (unchanged)
const tokenInfo = await sdk.createTokenInfoAndMetadata({
  name: config.token_metadata.name,
  symbol: config.token_metadata.symbol,
  description: config.token_metadata.description,
  image: config.token_metadata.image // URL from upload
});

// Step 2: Create fee share configuration (MANDATORY in v2)
const feeShareConfig = await sdk.createBagsFeeShareConfig({
  partnerKey: "FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7", // Attribution
  totalBPS: 10000, // Always explicit
  feeClaimers: [
    { wallet: process.env.CREATOR_WALLET_ADDRESS, bps: config.creator_bps },
    // Social claimers resolved to wallet addresses
    ...config.resolved_social_claimers,
    { wallet: partnerPayoutAddress, bps: config.partner_bps } // Resolved from partner key
  ]
});

// Step 3: Create launch transaction (explicit fee share config required)
const launchTx = await sdk.createLaunchTransaction({
  ipfs: tokenInfo.ipfsHash,
  tokenMint: tokenInfo.mint,
  initialBuyAmount: config.token_launch_params.initialBuyAmount,
  feeShareConfig: feeShareConfig, // MANDATORY in v2
  tipWallet: config.tipping_config.tip_wallet,
  tipLamports: config.tipping_config.tip_lamports
});
```

### Rate Limiting Compliance
- **Rate Limit**: 1,000 requests/hour (~16.7/minute)
- **Retry Logic**: Exponential backoff for 429/500/502/503
- **Headers**: Monitor X-RateLimit-Remaining
- **No Retry**: 400/401/403/404 errors

### Social Provider Resolution Error Handling

```javascript
// Token Launch v2 social provider resolution
try {
  const resolvedWallet = await bagsApi.resolveSocialProvider({
    provider: 'github',
    username: 'lead_developer'
  });
  
  feeClaimers.push({
    wallet: resolvedWallet.address,
    bps: 1500
  });
} catch (error) {
  if (config.social_resolution_strategy === 'fail_fast') {
    throw new Error(`GitHub resolution failed for lead_developer: ${error.message}`);
  } else {
    // Skip unresolved claimers and redistribute BPS
    console.warn(`Skipping unresolved GitHub user: lead_developer`);
  }
}
```

## SUCCESS CRITERIA

W4 is successful when:
- [ ] App type correctly determined (token-powered vs token-free)
- [ ] If token-free: Minimal wallet auth configuration prepared
- [ ] If token-powered: All token metadata extracted and formatted for `createTokenInfoAndMetadata()`
- [ ] If token-powered: Fee share configuration prepared with explicit BPS totaling 10000
- [ ] If token-powered: Social fee claimers validated and resolution strategy defined
- [ ] If token-powered: Lookup table requirements determined based on claimer count
- [ ] If token-powered: Tipping configuration prepared (if enabled)
- [ ] Environment variable requirements documented (no access to values)
- [ ] If token-powered: File upload strategy determined for token assets
- [ ] If token-powered: Program IDs configuration includes all required mainnet addresses
- [ ] Idempotency parameters generated for deterministic execution
- [ ] All configuration validates against Token Launch v2 requirements

## FAILURE CONDITIONS

STOP execution if:
- Cannot determine if app requires token creation from W2 output
- If token-powered: Cannot map token model to Bags SDK `createTokenInfoAndMetadata()` parameters
- If token-powered: Fee share configuration violates Token Launch v2 constraints (BPS != 10000)
- If token-powered: Partner key is not the immutable App Factory key
- If token-powered: Social fee claimers contain invalid usernames or providers
- If token-powered: Token metadata exceeds Bags field length limits
- If token-powered: Required program IDs are missing or incorrect
- Configuration does not match documented Bags Token Launch v2 patterns
- Lookup table requirements cannot be determined

Write detailed failure analysis referencing specific Bags documentation sections and Token Launch v2 requirements.

**DO NOT OUTPUT JSON IN CHAT**. Write all artifacts to disk only.